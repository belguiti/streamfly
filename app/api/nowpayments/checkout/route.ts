import { createClient, supabaseAdmin } from '@/lib/supabase/server'
import { createInvoice } from '@/lib/nowpayments'
import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/site-config'

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

        const discountPercent = parseInt(formData.get('discountPercent') as string || '0', 10)
        const baseUrl = SITE_URL
        const discountedCents = discountPercent > 0
            ? Math.round(plan.price_cents * (1 - discountPercent / 100))
            : plan.price_cents
        const priceAmount = discountedCents / 100

        const deviceType = (formData.get('deviceType') as string) || 'none'
        const packageId  = (formData.get('packageId')  as string) || 'none'
        const isRenewal = formData.get('isRenewal') === 'true'

        // Find existing subscription (for renewal tracking)
        let existingSubId = 'null'
        if (isRenewal) {
            const { data: existingSub } = await supabaseAdmin
                .from('subscriptions')
                .select('id')
                .eq('user_id', user.id)
                .eq('plan_id', planId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()
            existingSubId = existingSub?.id ?? 'null'
        }

        // Encode metadata in order_id (__ separated)
        // Format: userId__planId__deviceType__isRenewal__existingSubId__packageId__timestamp
        const orderId = `${user.id}__${planId}__${deviceType}__${isRenewal}__${existingSubId}__${packageId}__${Date.now()}`

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
