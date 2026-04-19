import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyWebhookSignature, getPayPalSubscription } from '@/lib/paypal'
import { autoProvision } from '@/lib/provisioning'
import { sendNewSubscriptionAlert } from '@/lib/telegram'
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

    // Verify webhook signature (skip if PAYPAL_WEBHOOK_ID not yet configured)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim()
    if (webhookId && webhookId !== 'dummy_paypal_webhook_id') {
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
    } else {
        console.warn('PayPal webhook: PAYPAL_WEBHOOK_ID not set — skipping signature verification')
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

                // Support both old JSON format and new pipe-separated format
                let userId: string, planId: string, deviceType: string | null,
                    isRenewal: boolean, existingSubId: string | null, packageId: string | null
                const raw = typeof customData === 'string' ? customData : JSON.stringify(customData)
                if (raw.includes('|')) {
                    const p = raw.split('|')
                    userId = p[0]; planId = p[1]
                    deviceType    = p[2] !== 'none' ? p[2] : null
                    isRenewal     = p[3] === '1'
                    existingSubId = p[4] !== 'null' ? p[4] : null
                    packageId     = p[5] && p[5] !== 'none' ? p[5] : null
                } else {
                    const d = customData as any
                    userId = d.userId; planId = d.planId
                    deviceType    = d.deviceType ?? null
                    isRenewal     = !!d.isRenewal
                    existingSubId = d.existingSubId ?? null
                    packageId     = d.packageId ?? null
                }
                if (!userId || !planId) {
                    console.error('PayPal webhook: missing custom_id metadata')
                    break
                }

                // Insert order
                const { data: insertedOrder } = await supabaseAdmin.from('orders').insert({
                    user_id: userId,
                    plan_id: planId,
                    provider: 'paypal',
                    status: 'paid',
                    amount_cents: 0,
                    currency: 'USD',
                    paypal_order_id: resource.id,
                    order_type: isRenewal ? 'renewal' : 'new',
                }).select('id').single()

                if (isRenewal && existingSubId) {
                    // Renewal: insert into renewals table, keep subscription as-is
                    await supabaseAdmin.from('renewals').insert({
                        user_id: userId,
                        subscription_id: existingSubId,
                        plan_id: planId,
                        order_id: insertedOrder?.id ?? null,
                        provider: 'paypal',
                        status: 'pending',
                    })
                    break
                }

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
                    device_type: deviceType ?? null,
                    provider_pack_id: packageId ?? null,
                }, { onConflict: 'paypal_subscription_id' }).select('id').single()

                // Telegram alert
                try {
                    const [{ data: planData }, { data: { user: tgUser } }] = await Promise.all([
                        supabaseAdmin.from('plans').select('name, price_cents').eq('id', planId).single(),
                        supabaseAdmin.auth.admin.getUserById(userId),
                    ])
                    await sendNewSubscriptionAlert({
                        userEmail:   tgUser?.email ?? userId,
                        planName:    planData?.name ?? planId,
                        amountCents: planData?.price_cents ?? 0,
                        provider:    'paypal',
                        status:      'pending_activation',
                        expiresAt:   resource.billing_info?.next_billing_time ?? null,
                        deviceType:  deviceType ?? null,
                    })
                } catch {}

                // Attempt auto-provisioning (pass packageId to override plan default)
                if (upsertedSub) {
                    await autoProvision(upsertedSub.id, planId, userId, packageId ?? undefined)
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
