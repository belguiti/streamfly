import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { sendActivationSuccessEmail } from '@/lib/activation-emails'

export default async function ActivateSubscriptionPage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/sign-in')

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') redirect('/app')

    const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('*, plan:plans(id, name, duration_months), profile:profiles(email)')
        .eq('id', id)
        .single()

    if (!subscription) redirect('/admin/orders')

    // Extract values at render time (avoids closure serialization issues in server actions)
    const planId = (subscription as any).plan?.id ?? ''
    const planName = (subscription as any).plan?.name ?? 'Streamtly Plan'
    const durationMonths = (subscription as any).plan?.duration_months ?? 1
    const userEmail = (subscription as any).profile?.email ?? ''
    const userName = userEmail ? userEmail.split('@')[0] : 'Customer'

    // Fetch an available pool entry for this plan
    const { data: poolEntry } = planId
        ? await supabaseAdmin
            .from('activation_pool')
            .select('*')
            .eq('plan_id', planId)
            .eq('is_used', false)
            .is('assigned_to', null)
            .order('created_at', { ascending: true })
            .limit(1)
            .single()
        : { data: null }

    const handleActivate = async (formData: FormData) => {
        'use server'
        const payloadType = formData.get('type') as string
        const payloadValue = formData.get('value') as string
        const poolEntryId = formData.get('pool_entry_id') as string
        const subId = formData.get('sub_id') as string
        const adminId = formData.get('admin_id') as string
        const toEmail = formData.get('user_email') as string
        const toName = formData.get('user_name') as string
        const pName = formData.get('plan_name') as string
        const durMonths = parseInt(formData.get('duration_months') as string) || 1

        if (!payloadType || !payloadValue || !subId) return

        // Create activation record
        const { error: actError } = await supabaseAdmin.from('activations').insert({
            subscription_id: subId,
            type: payloadType,
            value: payloadValue,
            activated_by: adminId || null,
        })
        if (actError) console.error('[ManualActivation] Activation insert error:', actError)

        // Calculate start/end dates based on plan duration
        const startDate = new Date()
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + durMonths)

        // Update subscription status to active with dates
        const { error: subError } = await supabaseAdmin.from('subscriptions').update({
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        }).eq('id', subId)
        if (subError) console.error('[ManualActivation] Subscription update error:', subError)

        // Delete the used pool entry
        if (poolEntryId) {
            const { error: delError } = await supabaseAdmin
                .from('activation_pool')
                .delete()
                .eq('id', poolEntryId)
            if (delError) console.error('[ManualActivation] Pool delete error:', delError)
        }

        // Send activation email to the user
        console.log(`[ManualActivation] Attempting to send email to: "${toEmail}" (name: "${toName}", plan: "${pName}", type: "${payloadType}")`)

        if (toEmail && toEmail.length > 0) {
            try {
                await sendActivationSuccessEmail(toEmail, toName, pName, payloadValue, payloadType)
                console.log(`[ManualActivation] ✅ Email SENT to ${toEmail}`)
            } catch (emailErr: any) {
                console.error(`[ManualActivation] ❌ Email FAILED to ${toEmail}:`, emailErr?.message ?? emailErr)
            }
        } else {
            console.error('[ManualActivation] ❌ No email address found for user — skipping email')
        }

        redirect('/admin/orders')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Activate Subscription</CardTitle>
                    <CardDescription>
                        User: {userEmail || 'Unknown'} <br />
                        Plan: {planName} ({durationMonths} month{durationMonths > 1 ? 's' : ''}) <br />
                        ID: {id}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Pool status indicator */}
                    {poolEntry ? (
                        <div className="mb-6 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="default" className="bg-green-600">✓ Pool Code Found</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Auto-filled from pool. Code will be <strong>deleted from pool</strong> after activation.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="bg-amber-600/20 text-amber-400">⚠ No Pool Codes</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                No available codes in pool for this plan. Enter credentials manually below.
                            </p>
                        </div>
                    )}

                    <form action={handleActivate} className="space-y-6">
                        {/* Hidden fields — pass all needed data via form to avoid closure serialization issues */}
                        <input type="hidden" name="sub_id" value={id} />
                        <input type="hidden" name="admin_id" value={user.id} />
                        <input type="hidden" name="user_email" value={userEmail} />
                        <input type="hidden" name="user_name" value={userName} />
                        <input type="hidden" name="plan_name" value={planName} />
                        <input type="hidden" name="duration_months" value={durationMonths} />
                        {poolEntry && (
                            <input type="hidden" name="pool_entry_id" value={poolEntry.id} />
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="type">Activation Type</Label>
                            <select
                                id="type"
                                name="type"
                                required
                                defaultValue={poolEntry?.type ?? 'activation_code'}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="activation_code">Activation Code</option>
                                <option value="account">Account (User/Pass)</option>
                                <option value="note">Note / Link</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="value">Activation Value (Code, Credentials, etc.)</Label>
                            <Input
                                id="value"
                                name="value"
                                required
                                defaultValue={poolEntry?.value ?? ''}
                                placeholder="Enter the activation details..."
                                className="font-mono"
                            />
                            {poolEntry && (
                                <p className="text-xs text-green-400">
                                    ↑ Pre-filled from pool: <code className="bg-muted px-1 rounded">{poolEntry.type}</code>
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">Complete Provisioning</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
