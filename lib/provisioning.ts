import { supabaseAdmin } from '@/lib/supabase/server'
import {
    sendActivationSuccessEmail,
    sendAdminPoolEmptyAlert,
} from '@/lib/activation-emails'
import {
    createM3uDevice,
    createMagDevice,
    durationToSub,
    getResellerInfo,
} from '@/lib/provider-api'

/**
 * Auto-provision a subscription via the Gold Panel API.
 * Called immediately after a successful payment webhook.
 * @param packageIdOverride - Package ID selected by the user at checkout.
 *   If provided, it takes precedence over the plan's default provider_pack_id.
 */
export async function autoProvision(
    subscriptionId: string,
    planId: string,
    userId: string,
    packageIdOverride?: string,
): Promise<boolean> {
    // ── 1. Load user info ─────────────────────────────────────────────────────
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)
    const userEmail = user?.email ?? ''
    const userName  = (user?.user_metadata?.full_name as string | undefined)
        ?? user?.email?.split('@')[0]
        ?? 'Customer'

    // ── 2. Load plan (needs provider_pack_id, duration_months, provider_country) ──
    const { data: plan } = await supabaseAdmin
        .from('plans')
        .select('name, duration_months, provider_pack_id, provider_country')
        .eq('id', planId)
        .single()

    const planName      = plan?.name             ?? 'Streamtly Plan'
    const durationMonths = plan?.duration_months ?? 1
    // User-selected package takes precedence over the plan's default package
    const packId        = packageIdOverride ?? plan?.provider_pack_id ?? null
    const country       = (plan?.provider_country ?? 'ALL').trim()

    if (!packId) {
        console.error(`[AutoProvision] No provider_pack_id: plan ${planId} has no default and user selected none`)
        try { await sendAdminPoolEmptyAlert(planName, userEmail) } catch {}
        return false
    }

    // ── 3. Check reseller credits ─────────────────────────────────────────────
    try {
        const info = await getResellerInfo()
        if (info.credits <= 0) {
            console.error('[AutoProvision] No reseller credits remaining!')
            try {
                await Promise.all([
                    sendAdminPoolEmptyAlert(planName, userEmail),
                ])
            } catch {}
            return false
        }
        console.log(`[AutoProvision] Reseller credits remaining: ${info.credits}`)
    } catch (err) {
        console.error('[AutoProvision] Could not check reseller credits:', err)
        // Continue anyway — don't block the customer
    }

    // ── 4. Load subscription to check device type and MAG MAC ────────────────
    const { data: sub } = await supabaseAdmin
        .from('subscriptions')
        .select('device_type, provider_mac')
        .eq('id', subscriptionId)
        .single()

    const deviceType = sub?.device_type ?? 'm3u'
    const mac        = sub?.provider_mac ?? null
    const isMag      = deviceType === 'mag_device' && !!mac
    const sub_param  = durationToSub(durationMonths)

    // ── 5. Call provider API ──────────────────────────────────────────────────
    let activationType  = 'account'
    let activationValue = ''
    let providerUserId  = ''
    let providerUsername = ''
    let providerPassword = ''
    let providerType     = 'm3u'

    try {
        if (isMag) {
            const mag = await createMagDevice({
                mac,
                packId,
                sub: sub_param,
                country,
                notes: userEmail,
            })
            activationType  = 'portal'
            activationValue = mag.portalUrl
            providerUserId  = mag.userId
            providerType    = 'mag'
            console.log(`[AutoProvision] MAG device created: user_id=${mag.userId}`)
        } else {
            const m3u = await createM3uDevice({
                packId,
                sub: sub_param,
                country,
                notes: userEmail,
            })
            activationType   = 'account'
            activationValue  = m3u.xtreamValue   // "serverUrl|username|password"
            providerUserId   = m3u.userId
            providerUsername = m3u.username
            providerPassword = m3u.password
            providerType     = 'm3u'
            console.log(`[AutoProvision] M3U device created: user=${m3u.username}`)
        }
    } catch (apiErr: any) {
        console.error('[AutoProvision] Provider API error:', apiErr.message)
        try { await sendAdminPoolEmptyAlert(planName, userEmail) } catch {}
        return false
    }

    // ── 6. Store activation record ────────────────────────────────────────────
    await supabaseAdmin.from('activations').insert({
        subscription_id: subscriptionId,
        type:            activationType,
        value:           activationValue,
    })

    // ── 7. Update subscription: active + provider credentials ─────────────────
    const startDate = new Date()
    const endDate   = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + durationMonths)

    await supabaseAdmin
        .from('subscriptions')
        .update({
            status:              'active',
            start_date:          startDate.toISOString(),
            end_date:            endDate.toISOString(),
            current_period_end:  endDate.toISOString(),
            provider_user_id:    providerUserId,
            provider_username:   providerUsername,
            provider_password:   providerPassword,
            provider_type:       providerType,
        })
        .eq('id', subscriptionId)

    console.log(`[AutoProvision] Subscription ${subscriptionId} activated successfully`)

    // ── 8. Send activation email ──────────────────────────────────────────────
    if (userEmail) {
        try {
            await sendActivationSuccessEmail(
                userEmail,
                userName,
                planName,
                activationValue,
                activationType,
            )
        } catch (emailErr) {
            console.error('[AutoProvision] Email send failed:', emailErr)
        }
    }

    return true
}
