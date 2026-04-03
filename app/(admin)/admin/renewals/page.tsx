'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Renewal {
    id: string
    status: string
    provider: string
    created_at: string
    activated_at: string | null
    user: { email: string; full_name: string | null } | null
    subscription: {
        id: string
        current_period_end: string | null
        plan: { name: string; duration_months: number } | null
    } | null
}

export default function AdminRenewalsPage() {
    const [renewals, setRenewals] = useState<Renewal[]>([])
    const [loading, setLoading] = useState(true)
    const [activating, setActivating] = useState<string | null>(null)

    async function loadRenewals() {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase
            .from('renewals')
            .select(`
                id, status, provider, created_at, activated_at,
                user:profiles (email, full_name),
                subscription:subscriptions (
                    id, current_period_end,
                    plan:plans (name, duration_months)
                )
            `)
            .order('created_at', { ascending: false })
        setRenewals((data as any) ?? [])
        setLoading(false)
    }

    useEffect(() => { loadRenewals() }, [])

    async function activateRenewal(renewalId: string) {
        setActivating(renewalId)
        try {
            const res = await fetch('/api/admin/renewals/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ renewalId }),
            })
            if (!res.ok) {
                const text = await res.text()
                alert(`Error: ${text}`)
            } else {
                await loadRenewals()
            }
        } catch (err: any) {
            alert(err.message)
        } finally {
            setActivating(null)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Renewals</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage pending subscription renewals</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadRenewals} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Current End</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : renewals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No renewals found.
                                </TableCell>
                            </TableRow>
                        ) : renewals.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell className="text-sm">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium">{r.user?.email ?? '—'}</div>
                                    {r.user?.full_name && (
                                        <div className="text-xs text-muted-foreground">{r.user.full_name}</div>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {r.subscription?.plan?.name ?? '—'}
                                    {r.subscription?.plan?.duration_months && (
                                        <span className="text-muted-foreground ml-1">
                                            ({r.subscription.plan.duration_months}mo)
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">{r.provider}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {r.subscription?.current_period_end
                                        ? new Date(r.subscription.current_period_end).toLocaleDateString()
                                        : '—'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={r.status === 'activated' ? 'default' : 'secondary'}>
                                        {r.status === 'activated' ? 'Activated' : 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {r.status === 'pending' ? (
                                        <Button
                                            size="sm"
                                            onClick={() => activateRenewal(r.id)}
                                            disabled={activating === r.id}
                                        >
                                            {activating === r.id
                                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                : 'Activate Renewal'
                                            }
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            {r.activated_at
                                                ? `Done ${new Date(r.activated_at).toLocaleDateString()}`
                                                : 'Done'}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
