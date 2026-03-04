import { supabaseAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Users, CreditCard, Clock, TrendingUp, Database, ArrowRight, CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminHomePage() {
    // ── Aggregate queries ──────────────────────────────────────
    const [
        { count: totalUsers },
        { count: activeCount },
        { count: pendingCount },
        { count: canceledCount },
        { data: orders },
        { data: recentSubs },
        { data: poolStats },
    ] = await Promise.all([
        supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'pending_activation'),
        supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'canceled'),
        supabaseAdmin.from('orders').select('amount_cents, created_at').eq('status', 'paid'),
        supabaseAdmin
            .from('subscriptions')
            .select('*, plan:plans(name), profile:profiles(email)')
            .order('created_at', { ascending: false })
            .limit(8),
        supabaseAdmin
            .from('activation_pool')
            .select('plan_id, is_used, plan:plans(name)'),
    ])

    const totalRevenueCents = orders?.reduce((sum, o) => sum + (o.amount_cents ?? 0), 0) ?? 0

    // Pool summary
    const poolByPlan: Record<string, { name: string; available: number; used: number }> = {}
    poolStats?.forEach((e: any) => {
        const id = e.plan_id
        if (!poolByPlan[id]) poolByPlan[id] = { name: e.plan?.name ?? id, available: 0, used: 0 }
        if (e.is_used) poolByPlan[id].used++
        else poolByPlan[id].available++
    })

    // Revenue this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const revenueThisMonth = orders
        ?.filter(o => new Date(o.created_at) >= startOfMonth)
        .reduce((sum, o) => sum + (o.amount_cents ?? 0), 0) ?? 0

    const statCards = [
        {
            label: 'Total Revenue',
            value: `$${(totalRevenueCents / 100).toFixed(2)}`,
            sub: `$${(revenueThisMonth / 100).toFixed(2)} this month`,
            icon: TrendingUp,
            color: 'text-[#00d4ff]',
            bg: 'bg-[#00d4ff]/10',
        },
        {
            label: 'Active Subscriptions',
            value: activeCount ?? 0,
            sub: `${canceledCount ?? 0} canceled`,
            icon: CheckCircle2,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
        },
        {
            label: 'Pending Activation',
            value: pendingCount ?? 0,
            sub: 'Require manual action',
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
        },
        {
            label: 'Total Users',
            value: totalUsers ?? 0,
            sub: 'Registered accounts',
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
        },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-[#8899aa] text-sm mt-1">Platform overview at a glance</p>
            </div>

            {/* ── KPI cards ──────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
                    <Card key={label} className="bg-[#111827] border-white/10">
                        <CardContent className="pt-5 pb-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#8899aa] uppercase tracking-wider mb-1">{label}</p>
                                    <p className="text-3xl font-black text-white">{value}</p>
                                    <p className="text-xs text-[#555] mt-1">{sub}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Recent subscriptions ───────────────────── */}
                <div className="xl:col-span-2">
                    <Card className="bg-[#111827] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-white text-base flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#00d4ff]" />
                                    Recent Subscriptions
                                </CardTitle>
                                <CardDescription className="text-[#8899aa]">Latest 8 entries</CardDescription>
                            </div>
                            <Link href="/admin/orders">
                                <Button size="sm" variant="outline" className="border-white/10 text-[#8899aa] hover:text-white hover:bg-white/5 gap-1 text-xs">
                                    View all <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-[#8899aa]">User</TableHead>
                                        <TableHead className="text-[#8899aa]">Plan</TableHead>
                                        <TableHead className="text-[#8899aa]">Status</TableHead>
                                        <TableHead className="text-[#8899aa]">Date</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentSubs?.map((sub: any) => (
                                        <TableRow key={sub.id} className="border-white/5 hover:bg-white/3">
                                            <TableCell className="text-white text-sm font-medium truncate max-w-[140px]">
                                                {sub.profile?.email || sub.user_id}
                                            </TableCell>
                                            <TableCell className="text-[#8899aa] text-sm">{sub.plan?.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    sub.status === 'active' ? 'default' :
                                                    sub.status === 'pending_activation' ? 'secondary' :
                                                    sub.status === 'canceled' ? 'destructive' : 'outline'
                                                } className="text-xs">
                                                    {sub.status === 'pending_activation' ? 'Pending' : sub.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[#8899aa] text-xs">
                                                {new Date(sub.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/orders/${sub.id}`}>
                                                    <Button size="sm" variant={sub.status === 'pending_activation' ? 'default' : 'ghost'}
                                                        className="h-7 text-xs px-2">
                                                        {sub.status === 'pending_activation' ? 'Activate' : 'View'}
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!recentSubs || recentSubs.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-[#8899aa] py-8">
                                                No subscriptions yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Pool inventory ─────────────────────────── */}
                <div>
                    <Card className="bg-[#111827] border-white/10 h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-white text-base flex items-center gap-2">
                                    <Database className="w-4 h-4 text-[#00d4ff]" />
                                    Activation Pool
                                </CardTitle>
                                <CardDescription className="text-[#8899aa]">Available codes per plan</CardDescription>
                            </div>
                            <Link href="/admin/pool">
                                <Button size="sm" variant="outline" className="border-white/10 text-[#8899aa] hover:text-white hover:bg-white/5 gap-1 text-xs">
                                    Manage <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.values(poolByPlan).length === 0 && (
                                <p className="text-sm text-[#8899aa] text-center py-6">No codes in pool.</p>
                            )}
                            {Object.values(poolByPlan).map(({ name, available, used }) => {
                                const total = available + used
                                const pct = total > 0 ? Math.round((available / total) * 100) : 0
                                return (
                                    <div key={name} className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white font-medium">{name}</span>
                                            <span className="text-xs text-[#8899aa]">
                                                <span className={available === 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                                                    {available}
                                                </span> / {total}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${pct > 30 ? 'bg-green-500' : pct > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
