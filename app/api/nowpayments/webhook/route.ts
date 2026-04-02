import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyIpnSignature, PAID_STATUSES } from '@/lib/nowpayments'
import { autoProvision } from '@/lib/provisioning'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()

    // 1. Verify IPN signature
    const signature = req.headers.get('x-nowpayments-sig') ?? ''
    if (!verifyIpnSignature(body, signature)) {
        console.error('NOWPayments IPN: invalid signature')
        return new NextResponse('Invalid signature', { status: 401 })
    }

    let event: Record<string, any>
    try {
        event = JSON.parse(body)
    } catch {
        return new NextResponse('Invalid JSON', { status: 400 })
    }

    const paymentStatus: string = event.payment_status
    const paymentId: string = String(event.payment_id)
    const orderId: string = event.order_id ?? ''

    // Only process confirmed/finished payments
    if (!PAID_STATUSES.has(paymentStatus)) {
        return new NextResponse('OK', { status: 200 })
    }

    // Parse userId and planId from order_id (format: "userId__planId__timestamp")
    const parts = orderId.split('__')
    const userId = parts[0]
    const planId = parts[1]

    if (!userId || !planId) {
        console.error('NOWPayments IPN: cannot parse userId/planId from order_id', orderId)
        return new NextResponse('Bad order_id', { status: 400 })
    }

    // Idempotency: skip if already processed
    const { data: existing } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('nowpayments_payment_id', paymentId)
        .maybeSingle()

    if (existing) {
        return new NextResponse('OK', { status: 200 })
    }

    try {
        const amountCents = Math.round((event.price_amount ?? 0) * 100)

        // Insert order
        await supabaseAdmin.from('orders').insert({
            user_id: userId,
            plan_id: planId,
            provider: 'nowpayments',
            status: 'paid',
            amount_cents: amountCents,
            currency: 'USD',
            nowpayments_payment_id: paymentId,
        })

        // Upsert subscription
        const { data: upsertedSub } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: userId,
                plan_id: planId,
                status: 'pending_activation',
                nowpayments_payment_id: paymentId,
            }, { onConflict: 'nowpayments_payment_id' })
            .select('id')
            .single()

        // Auto-provision
        if (upsertedSub) {
            await autoProvision(upsertedSub.id, planId, userId)
        }

        return new NextResponse('OK', { status: 200 })
    } catch (err: any) {
        console.error('NOWPayments webhook handler error:', err)
        return new NextResponse(`Error: ${err.message}`, { status: 500 })
    }
}
