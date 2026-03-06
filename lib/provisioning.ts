import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * Auto-provision a subscription by assigning an unused activation code from the pool.
 * If no codes are available, the subscription remains in 'pending_activation' for manual admin handling.
 */
export async function autoProvision(subscriptionId: string, planId: string): Promise<boolean> {
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
        return false
    }

    // 2. Mark the pool entry as used
    const { error: updatePoolError } = await supabaseAdmin
        .from('activation_pool')
        .update({
            is_used: true,
            assigned_to: subscriptionId,
        })
        .eq('id', poolEntry.id)
        .eq('is_used', false) // Optimistic concurrency: avoid double-assigning

    if (updatePoolError) {
        console.error('[AutoProvision] Failed to claim pool entry:', updatePoolError)
        return false
    }

    // 3. Create an activation record
    await supabaseAdmin.from('activations').insert({
        subscription_id: subscriptionId,
        type: poolEntry.type,
        value: poolEntry.value,
    })

    // 4. Update subscription to active + set start/end dates
    const { data: planData } = await supabaseAdmin
        .from('plans')
        .select('duration_months')
        .eq('id', planId)
        .single()

    const durationMonths = planData?.duration_months ?? 1
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
    return true
}
