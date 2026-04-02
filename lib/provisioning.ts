import { supabaseAdmin } from '@/lib/supabase/server'
import {
    sendActivationSuccessEmail,
    sendActivationDelayEmail,
    sendAdminPoolEmptyAlert,
} from '@/lib/activation-emails'

/**
 * Auto-provision a subscription by assigning an unused activation code from the pool.
 * Sends email to the client (and admin if pool is empty).
 */
export async function autoProvision(subscriptionId: string, planId: string, userId: string): Promise<boolean> {
    // Fetch user info
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)
    const userEmail = user?.email ?? ''
    const userName = (user?.user_metadata?.full_name as string | undefined)
        ?? user?.email?.split('@')[0]
        ?? 'Customer'

    // Fetch plan info (name + duration)
    const { data: planData } = await supabaseAdmin
        .from('plans')
        .select('name, duration_months')
        .eq('id', planId)
        .single()
    const planName = planData?.name ?? 'Streamtly Plan'
    const durationMonths = planData?.duration_months ?? 1

    // 1. Find an unused activation code for the given plan
    const { data: poolEntry, error: poolError } = await supabaseAdmin
        .from('activation_pool')
        .select('*')
        .eq('plan_id', planId)
        .eq('is_used', false)
        .is('assigned_to', null)
        .limit(1)
        .single()

    if (poolError || !poolEntry) {
        console.log(`[AutoProvision] No available codes for plan ${planId}. Manual activation required.`)

        // Notify admin + client
        try {
            await Promise.all([
                sendAdminPoolEmptyAlert(planName, userEmail),
                userEmail ? sendActivationDelayEmail(userEmail, userName, planName) : Promise.resolve(),
            ])
        } catch (emailErr) {
            console.error('[AutoProvision] Failed to send pool-empty emails:', emailErr)
        }

        return false
    }

    // 2. Delete the pool entry (remove after use)
    const { error: deletePoolError } = await supabaseAdmin
        .from('activation_pool')
        .delete()
        .eq('id', poolEntry.id)
        .eq('is_used', false) // Optimistic concurrency: avoid double-assigning

    if (deletePoolError) {
        console.error('[AutoProvision] Failed to claim pool entry:', deletePoolError)
        return false
    }

    // 3. Create an activation record
    await supabaseAdmin.from('activations').insert({
        subscription_id: subscriptionId,
        type: poolEntry.type,
        value: poolEntry.value,
    })

    // 4. Update subscription to active + set start/end dates
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + durationMonths)

    await supabaseAdmin
        .from('subscriptions')
        .update({
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        })
        .eq('id', subscriptionId)

    console.log(`[AutoProvision] Successfully provisioned subscription ${subscriptionId}`)

    // 5. Send activation code to client
    if (userEmail) {
        try {
            await sendActivationSuccessEmail(userEmail, userName, planName, poolEntry.value, poolEntry.type)
        } catch (emailErr) {
            console.error('[AutoProvision] Failed to send success email:', emailErr)
        }
    }

    return true
}
