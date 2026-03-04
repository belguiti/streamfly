import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, plan:plans(name), profile:profiles(email)')
        .eq('id', id)
        .single()

    if (!subscription) redirect('/admin/orders')

    const handleActivate = async (formData: FormData) => {
        'use server'
        const payloadType = formData.get('type') as string
        const payloadValue = formData.get('value') as string

        if (!payloadType || !payloadValue) return

        const supabaseAdmin = await createClient()

        // Create activation record
        await supabaseAdmin.from('activations').insert({
            subscription_id: id,
            type: payloadType,
            value: payloadValue,
            activated_by: user.id,
        })

        // Update subscription status to active
        await supabaseAdmin.from('subscriptions').update({
            status: 'active',
        }).eq('id', id)

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
                    <form action={handleActivate} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">Activation Type</Label>
                            <select
                                id="type"
                                name="type"
                                required
                                defaultValue="activation_code"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="activation_code">Activation Code</option>
                                <option value="account">Account (User/Pass)</option>
                                <option value="note">Note / Link</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="value">Activation Value (Code, Credentials, etc.)</Label>
                            <Input id="value" name="value" required placeholder="Enter the activation details..." className="font-mono" />
                        </div>

                        <Button type="submit" className="w-full">Complete Provisioning</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
