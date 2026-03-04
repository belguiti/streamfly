import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .not('stripe_customer_id', 'is', null)
            .limit(1)
            .single()

        if (!subscription || !subscription.stripe_customer_id) {
            return new NextResponse('No active Stripe customer found', { status: 400 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: process.env.STRIPE_PORTAL_RETURN_URL || `${req.headers.get('origin')}/app`,
        })

        return NextResponse.redirect(session.url, 303)
    } catch (err: any) {
        console.error('Portal error:', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
