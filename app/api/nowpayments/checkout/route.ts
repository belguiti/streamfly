import { createClient } from '@/lib/supabase/server'
import { createInvoice } from '@/lib/nowpayments'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }

        const formData = await req.formData()
        const planId = formData.get('planId') as string
        if (!planId) throw new Error('Plan ID is required')

        const { data: plan } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single()
        if (!plan) throw new Error('Invalid plan')

        const baseUrl = 'https://www.streamtly.com'
        const priceAmount = plan.price_cents / 100

        // Encode userId + planId in the order_id (separated by __ for safe splitting)
        const orderId = `${user.id}__${planId}__${Date.now()}`

        const invoice = await createInvoice({
            priceAmount,
            orderId,
            orderDescription: `Streamtly – ${plan.name}`,
            ipnCallbackUrl: `${baseUrl}/api/nowpayments/webhook`,
            successUrl: `${baseUrl}/app?success=true&provider=crypto`,
            cancelUrl: `${baseUrl}/pricing?canceled=true`,
        })

        return NextResponse.redirect(invoice.invoice_url, 303)
    } catch (err: any) {
        console.error('NOWPayments checkout error:', err)
        return new NextResponse(err.message || 'Internal Server Error', { status: 500 })
    }
}
