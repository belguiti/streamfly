import { createClient, supabaseAdmin } from '@/lib/supabase/server'
import { sendRenewalConfirmationEmail } from '@/lib/activation-emails'
import { renewM3uDevice, renewMagDevice, durationToSub } from '@/lib/provider-api'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        // ── Auth: admin only ──────────────────────────────────────────────────
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return new NextResponse('Unauthorized', { status: 401 })

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        if (profile?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

        const { renewalId } = await req.json()
        if (!renewalId) return new NextResponse('renewalId required', { status: 400 })

        // ── Fetch renewal + subscription credentials ──────────────────────────
        const { data: renewal, error } = await supabaseAdmin
            .from('renewals')
            .select(`
                *,
                subscription:subscriptions (
                    id,
                    current_period_end,
                    provider_username,
                    provider_password,
                    provider_type,
                    provider_mac,
                    plan:plans (name, duration_months)
                ),
                user:profiles (email)
            `)
            .eq('id', renewalId)
            .single()

        if (error || !renewal) {
            return new NextResponse('Renewal not found', { status: 404 })
        }
        if (renewal.status === 'activated') {
            return new NextResponse('Already activated', { status: 400 })
        }

        const sub        = renewal.subscription
        const durationMonths: number = sub?.plan?.duration_months ?? 1
        const sub_param  = durationToSub(durationMonths)
        const provType   = sub?.provider_type ?? 'm3u'

        // ── Call provider API to renew the device ─────────────────────────────
        if (provType === 'mag' && sub?.provider_mac) {
            await renewMagDevice(sub.provider_mac, sub_param)
            console.log(`[RenewalActivate] MAG renewed: ${sub.provider_mac}`)
        } else if (sub?.provider_username && sub?.provider_password) {
            await renewM3uDevice(sub.provider_username, sub.provider_password, sub_param)
            console.log(`[RenewalActivate] M3U renewed: ${sub.provider_username}`)
        } else {
            // No credentials stored — can't call API, just extend locally
            console.warn('[RenewalActivate] No provider credentials on subscription — extending locally only')
        }

        // ── Extend subscription period ────────────────────────────────────────
        const now        = new Date()
        const currentEnd = sub?.current_period_end ? new Date(sub.current_period_end) : now
        const base       = currentEnd > now ? currentEnd : now
        const newPeriodEnd = new Date(base)
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + durationMonths)

        await supabaseAdmin
            .from('subscriptions')
            .update({
                status:             'active',
                current_period_end: newPeriodEnd.toISOString(),
                end_date:           newPeriodEnd.toISOString(),
            })
            .eq('id', renewal.subscription_id)

        // ── Mark renewal activated ────────────────────────────────────────────
        await supabaseAdmin
            .from('renewals')
            .update({
                status:       'activated',
                activated_by: user.id,
                activated_at: new Date().toISOString(),
            })
            .eq('id', renewalId)

        // ── Send confirmation email ───────────────────────────────────────────
        const userEmail = renewal.user?.email
        if (userEmail) {
            const userName   = userEmail.split('@')[0]
            const planName   = sub?.plan?.name ?? 'Your Plan'
            const periodEndStr = newPeriodEnd.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            })
            await sendRenewalConfirmationEmail(userEmail, userName, planName, periodEndStr)
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Renewal activation error:', err)
        return new NextResponse(err.message || 'Internal Server Error', { status: 500 })
    }
}
