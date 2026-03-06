import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

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
        const promoId = formData.get('promoId') as string | null
        const discountPercent = parseInt(formData.get('discountPercent') as string || '0', 10)

        if (!priceId) throw new Error('Price ID is required')

        const { data: plan } = await supabase
            .from('plans')
            .select('*')
            .eq('stripe_price_id', priceId)
            .single()
        if (!plan) throw new Error('Invalid plan')

        // Apply promo discount via Stripe coupon (re-validated server-side)
        let appliedDiscount: { coupon: string }[] | undefined

        if (promoId && discountPercent > 0) {
            const { data: promo } = await supabaseAdmin
                .from('promo_codes')
                .select('*')
                .eq('id', promoId)
                .eq('is_active', true)
                .single()

            const isValid = promo
                && (!promo.expires_at || new Date(promo.expires_at) > new Date())
                && (promo.max_uses === null || promo.uses_count < promo.max_uses)

            if (isValid) {
                // Reuse or create a Stripe coupon for this percentage
                const couponId = `STREAMTLY_${promo.discount_percent}PCT`
                try {
                    await stripe.coupons.retrieve(couponId)
                } catch {
                    await stripe.coupons.create({
                        id: couponId,
                        percent_off: promo.discount_percent,
                        duration: 'once',
                        name: `Streamtly ${promo.discount_percent}% Off`,
                    })
                }
                appliedDiscount = [{ coupon: couponId }]

                // Increment usage counter
                await supabaseAdmin
                    .from('promo_codes')
                    .update({ uses_count: promo.uses_count + 1 })
                    .eq('id', promoId)
            }
        }

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer_email: profile.email,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: process.env.STRIPE_SUCCESS_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/app?success=true`,
            cancel_url: process.env.STRIPE_CANCEL_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
            metadata: {
                userId: user.id,
                planId: plan.id,
                ...(promoId ? { promoId } : {}),
            },
            ...(appliedDiscount ? { discounts: appliedDiscount } : {}),
        }

        const session = await stripe.checkout.sessions.create(sessionParams)

        if (session.url) {
            return NextResponse.redirect(session.url, 303)
        }

        throw new Error('Could not create checkout session')
    } catch (err: any) {
        console.error('Checkout error:', err)
        return new NextResponse(err.message || 'Internal Server Error', { status: 500 })
    }
}
