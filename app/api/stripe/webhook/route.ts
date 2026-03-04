import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/server'
import { autoProvision } from '@/lib/provisioning'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const sig = (await headers()).get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const subscriptionId = session.subscription as string
                const customerId = session.customer as string
                const userId = session.metadata?.userId
                const planId = session.metadata?.planId

                if (!userId || !planId) throw new Error('Missing metadata')

                const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Stripe.Subscription

                await supabaseAdmin.from('orders').insert({
                    user_id: userId,
                    plan_id: planId,
                    provider: 'stripe',
                    status: 'paid',
                    amount_cents: session.amount_total || 0,
                    currency: session.currency || 'USD',
                    stripe_checkout_session_id: session.id,
                })

                const { data: upsertedSub } = await supabaseAdmin.from('subscriptions').upsert({
                    user_id: userId,
                    plan_id: planId,
                    status: 'pending_activation',
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    current_period_end: new Date(((subscription as any).current_period_end) * 1000).toISOString(),
                }, { onConflict: 'stripe_subscription_id' }).select('id').single()

                // Attempt auto-provisioning from the activation pool
                if (upsertedSub) {
                    await autoProvision(upsertedSub.id, planId)
                }

                break
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription

                const { data: existingSub } = await supabaseAdmin
                    .from('subscriptions')
                    .select('status')
                    .eq('stripe_subscription_id', subscription.id)
                    .single()

                let newStatus = existingSub?.status
                if (subscription.status === 'canceled') newStatus = 'canceled'
                if (subscription.status === 'past_due' || subscription.status === 'unpaid') newStatus = 'past_due'

                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        current_period_end: new Date(((subscription as any).current_period_end) * 1000).toISOString(),
                        status: newStatus
                    })
                    .eq('stripe_subscription_id', subscription.id)

                break
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: 'canceled'
                    })
                    .eq('stripe_subscription_id', subscription.id)
                break
            }
        }
        return new NextResponse('OK', { status: 200 })
    } catch (err: any) {
        console.error('Webhook handler error:', err)
        return new NextResponse(`Webhook handler error: ${err.message}`, { status: 500 })
    }
}
