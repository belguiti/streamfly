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

    // Fetch an available pool entry for this plan
    const planId = (subscription as any).plan?.id
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

        if (!payloadType || !payloadValue) return

        // Create activation record
        await supabaseAdmin.from('activations').insert({
            subscription_id: id,
            type: payloadType,
            value: payloadValue,
            activated_by: user!.id,
        })

        // Calculate start/end dates based on plan duration
        const durationMonths = (subscription as any).plan?.duration_months ?? 1
        const startDate = new Date()
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + durationMonths)

        // Update subscription status to active with dates
        await supabaseAdmin.from('subscriptions').update({
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        }).eq('id', id)

        // Delete the used pool entry
        if (poolEntryId) {
            await supabaseAdmin
                .from('activation_pool')
                .delete()
                .eq('id', poolEntryId)
        }

        // Send activation email to the user
        const userEmail = (subscription as any).profile?.email
        const userName = userEmail?.split('@')[0] ?? 'Customer'
        const planName = (subscription as any).plan?.name ?? 'Streamtly Plan'

        if (userEmail) {
            try {
                await sendActivationSuccessEmail(userEmail, userName, planName, payloadValue, payloadType)
                console.log(`[ManualActivation] Email sent to ${userEmail}`)
            } catch (emailErr) {
                console.error('[ManualActivation] Failed to send activation email:', emailErr)
            }
        }

        redirect('/admin/orders')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Activate Subscription</CardTitle>
                    <CardDescription>
                        User: {subscription.profile?.email} <br />
                        Plan: {subscription.plan?.name} <br />
                        ID: {subscription.id}
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
                        {/* Hidden field to track which pool entry to delete */}
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
