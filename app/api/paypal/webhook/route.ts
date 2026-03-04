import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyWebhookSignature, getPayPalSubscription } from '@/lib/paypal'
import { autoProvision } from '@/lib/provisioning'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()

    // Extract PayPal headers for signature verification
    const paypalHeaders: Record<string, string> = {}
    const headerKeys = [
        'paypal-auth-algo',
        'paypal-cert-url',
        'paypal-transmission-id',
        'paypal-transmission-sig',
        'paypal-transmission-time',
    ]
    headerKeys.forEach((key) => {
        const val = req.headers.get(key)
        if (val) paypalHeaders[key] = val
    })

    // Verify webhook signature
    try {
        const isValid = await verifyWebhookSignature(paypalHeaders, body)
        if (!isValid) {
            console.error('PayPal webhook signature verification failed')
            return new NextResponse('Invalid signature', { status: 401 })
        }
    } catch (err: any) {
        console.error('PayPal webhook verification error:', err)
        return new NextResponse('Verification error', { status: 400 })
    }

    const event = JSON.parse(body)
    const eventType = event.event_type as string

    try {
        switch (eventType) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
            case 'PAYMENT.SALE.COMPLETED': {
                const resource = event.resource
                let subscriptionId: string
                let customData: { userId: string; planId: string }

                if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
                    subscriptionId = resource.id
                    customData = JSON.parse(resource.custom_id || '{}')
                } else {
                    // PAYMENT.SALE.COMPLETED — the subscription ID is in billing_agreement_id
                    subscriptionId = resource.billing_agreement_id
                    // Fetch subscription to get custom_id
                    const ppSub = await getPayPalSubscription(subscriptionId)
                    customData = JSON.parse(ppSub.custom_id || '{}')
                }

                const { userId, planId } = customData
                if (!userId || !planId) {
                    console.error('PayPal webhook: missing custom_id metadata')
                    break
                }

                // Insert order
                await supabaseAdmin.from('orders').insert({
                    user_id: userId,
                    plan_id: planId,
                    provider: 'paypal',
                    status: 'paid',
                    amount_cents: 0, // PayPal doesn't break down nicely; plan price is the source of truth
                    currency: 'USD',
                    paypal_order_id: resource.id,
                })

                // Upsert subscription
                const { data: upsertedSub } = await supabaseAdmin.from('subscriptions').upsert({
                    user_id: userId,
                    plan_id: planId,
                    status: 'pending_activation',
                    paypal_subscription_id: subscriptionId,
                    paypal_payer_id: resource.subscriber?.payer_id || resource.payer?.payer_info?.payer_id || null,
                    current_period_end: resource.billing_info?.next_billing_time
                        ? new Date(resource.billing_info.next_billing_time).toISOString()
                        : null,
                }, { onConflict: 'paypal_subscription_id' }).select('id').single()

                // Attempt auto-provisioning
                if (upsertedSub) {
                    await autoProvision(upsertedSub.id, planId)
                }

                break
            }
            case 'BILLING.SUBSCRIPTION.CANCELLED':
            case 'BILLING.SUBSCRIPTION.EXPIRED': {
                const subscriptionId = event.resource.id

                await supabaseAdmin
                    .from('subscriptions')
                    .update({ status: 'canceled' })
                    .eq('paypal_subscription_id', subscriptionId)

                break
            }
        }

        return new NextResponse('OK', { status: 200 })
    } catch (err: any) {
        console.error('PayPal webhook handler error:', err)
        return new NextResponse(`Webhook handler error: ${err.message}`, { status: 500 })
    }
}
