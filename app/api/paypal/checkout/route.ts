import { createClient } from '@/lib/supabase/server'
import { createPayPalSubscription } from '@/lib/paypal'
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

        const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).single()
        if (!plan) throw new Error('Invalid plan')
        if (!plan.paypal_plan_id) throw new Error('PayPal is not configured for this plan')

        const baseUrl = 'https://www.streamtly.com'

        const { approvalUrl } = await createPayPalSubscription(
            plan.paypal_plan_id,
            user.id,
            plan.id,
            user.email ?? '',
            `${baseUrl}/app?success=true&provider=paypal`,
            `${baseUrl}/pricing?canceled=true`
        )

        return NextResponse.redirect(approvalUrl, 303)
    } catch (err: any) {
        console.error('PayPal checkout error:', err)
        return new NextResponse(err.message || 'Internal Server Error', { status: 500 })
    }
}
