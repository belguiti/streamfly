import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminPoolPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/sign-in')

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') redirect('/app')

    // Fetch plans for the selector
    const { data: plans } = await supabase.from('plans').select('*').eq('is_active', true).order('duration_months')

    // Fetch pool inventory grouped by plan
    const { data: poolEntries } = await supabase
        .from('activation_pool')
        .select('*, plan:plans(name)')
        .order('created_at', { ascending: false })

    // Calculate stats
    const stats = plans?.map((plan) => {
        const entries = poolEntries?.filter((e: any) => e.plan_id === plan.id) || []
        const available = entries.filter((e: any) => !e.is_used).length
        const used = entries.filter((e: any) => e.is_used).length
        return { plan, available, used, total: entries.length }
    }) || []

    const handleAddCodes = async (formData: FormData) => {
        'use server'
        const planId = formData.get('planId') as string
        const type = formData.get('type') as string
        const codesRaw = formData.get('codes') as string

        if (!planId || !type || !codesRaw) return

        const codes = codesRaw.split('\n').map(c => c.trim()).filter(c => c.length > 0)
        if (codes.length === 0) return

        const supabaseAdmin = await createClient()
        const rows = codes.map(value => ({
            plan_id: planId,
            type,
            value,
        }))

        await supabaseAdmin.from('activation_pool').insert(rows)
        redirect('/admin/pool')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Activation Pool</h1>
                <Link href="/admin/orders">
                    <Button variant="outline">← Back to Orders</Button>
                </Link>
            </div>

            {/* Inventory Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(({ plan, available, used, total }) => (
                    <Card key={plan.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>{total} total codes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Badge variant="default">{available} available</Badge>
                                <Badge variant="secondary">{used} used</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Codes Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add Activation Codes</CardTitle>
                    <CardDescription>Paste codes below, one per line. They will be auto-assigned to subscribers as payments come in.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleAddCodes} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="planId">Plan</Label>
                                <select
                                    id="planId"
                                    name="planId"
                                    required
                                    className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    {plans?.map((plan) => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Code Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    required
                                    defaultValue="activation_code"
                                    className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="activation_code">Activation Code</option>
                                    <option value="account">Account (User/Pass)</option>
                                    <option value="note">Note / Link</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codes">Codes (one per line)</Label>
                            <textarea
                                id="codes"
                                name="codes"
                                required
                                rows={6}
                                placeholder={"ABC-DEF-123\nGHI-JKL-456\nMNO-PQR-789"}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                            />
                        </div>
                        <Button type="submit">Add to Pool</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Recent Pool Entries */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Pool Entries</CardTitle>
                    <CardDescription>Last 50 entries</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plan</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {poolEntries && poolEntries.slice(0, 50).map((entry: any) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.plan?.name || 'Unknown'}</TableCell>
                                    <TableCell className="capitalize">{entry.type?.replace('_', ' ')}</TableCell>
                                    <TableCell className="font-mono text-xs max-w-[200px] truncate">{entry.value}</TableCell>
                                    <TableCell>
                                        <Badge variant={entry.is_used ? 'secondary' : 'default'}>
                                            {entry.is_used ? 'Used' : 'Available'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {(!poolEntries || poolEntries.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        No codes in the pool yet. Add some above.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
