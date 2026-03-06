import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { renewalEmailHtml, renewalEmailText } from '@/emails/renewal'
import { NextResponse } from 'next/server'

// Called daily by Vercel Cron — secured by CRON_SECRET header
export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.streamtly.com'
    const FROM = `${process.env.RESEND_FROM_NAME ?? 'Streamtly'} <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`
    const DISCOUNT_PERCENT = 10
    const PROMO_EXPIRES_DAYS = 30

    // Find subscriptions expiring in 6–8 days (centered on 7)
    const now = new Date()
    const windowStart = new Date(now)
    windowStart.setDate(windowStart.getDate() + 6)
    const windowEnd = new Date(now)
    windowEnd.setDate(windowEnd.getDate() + 8)

    const { data: subs, error } = await supabaseAdmin
        .from('subscriptions')
        .select(`
            id,
            end_date,
            plan_id,
            user_id,
            plans ( name ),
            profiles ( email, full_name )
        `)
        .eq('status', 'active')
        .gte('end_date', windowStart.toISOString())
        .lte('end_date', windowEnd.toISOString())

    if (error) {
        console.error('[Renewal Cron] DB error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const results: { email: string; status: string; code?: string }[] = []

    for (const sub of subs ?? []) {
        const profile = sub.profiles as any
        const plan = sub.plans as any

        if (!profile?.email) continue

        try {
            // Generate a unique renewal promo code
            const code = `RENEW${Math.random().toString(36).slice(2, 7).toUpperCase()}`
            const promoExpiry = new Date()
            promoExpiry.setDate(promoExpiry.getDate() + PROMO_EXPIRES_DAYS)

            // Insert promo code into DB
            const { error: promoError } = await supabaseAdmin
                .from('promo_codes')
                .insert({
                    code,
                    discount_percent: DISCOUNT_PERCENT,
                    max_uses: 1,
                    expires_at: promoExpiry.toISOString(),
                    is_active: true,
                })

            if (promoError) {
                console.error(`[Renewal Cron] Failed to create promo for ${profile.email}:`, promoError)
                results.push({ email: profile.email, status: 'promo_error' })
                continue
            }

            const endDateFormatted = new Date(sub.end_date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            })

            // Send renewal email
            const { error: emailError } = await resend.emails.send({
                from: FROM,
                to: profile.email,
                subject: `⚡ Your Streamtly subscription expires in 7 days — ${DISCOUNT_PERCENT}% renewal offer inside`,
                html: renewalEmailHtml({
                    userName: profile.full_name?.split(' ')[0] ?? 'there',
                    planName: plan?.name ?? 'Premium',
                    endDate: endDateFormatted,
                    promoCode: code,
                    discountPercent: DISCOUNT_PERCENT,
                    renewUrl: `${SITE_URL}/pricing`,
                }),
                text: renewalEmailText({
                    userName: profile.full_name?.split(' ')[0] ?? 'there',
                    planName: plan?.name ?? 'Premium',
                    endDate: endDateFormatted,
                    promoCode: code,
                    discountPercent: DISCOUNT_PERCENT,
                    renewUrl: `${SITE_URL}/pricing`,
                }),
            })

            if (emailError) {
                console.error(`[Renewal Cron] Email failed for ${profile.email}:`, emailError)
                results.push({ email: profile.email, status: 'email_error' })
            } else {
                results.push({ email: profile.email, status: 'sent', code })
            }
        } catch (err: any) {
            console.error(`[Renewal Cron] Unexpected error for ${profile.email}:`, err)
            results.push({ email: profile.email, status: 'error' })
        }
    }

    console.log(`[Renewal Cron] Processed ${results.length} subscriptions`)
    return NextResponse.json({ processed: results.length, results })
}
