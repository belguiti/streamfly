import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (!profile) throw new Error('Profile not found')

        const formData = await req.formData()
        const priceId = formData.get('priceId') as string

        if (!priceId) throw new Error('Price ID is required')

        const { data: plan } = await supabase.from('plans').select('*').eq('stripe_price_id', priceId).single()
        if (!plan) throw new Error('Invalid plan')

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer_email: profile.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: process.env.STRIPE_SUCCESS_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/app?success=true`,
            cancel_url: process.env.STRIPE_CANCEL_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
            metadata: {
                userId: user.id,
                planId: plan.id,
            },
        })

        if (session.url) {
            return NextResponse.redirect(session.url, 303)
        }

        throw new Error('Could not create checkout session')
    } catch (err: any) {
        console.error('Checkout error:', err)
        return new NextResponse(err.message || 'Internal Server Error', { status: 500 })
    }
}
