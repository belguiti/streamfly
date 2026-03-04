import { supabaseAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Users, CreditCard, Package } from 'lucide-react'

export const revalidate = 0

// Small bar chart rendered purely with divs (no chart library needed)
function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
    const max = Math.max(...data.map(d => d.value), 1)
    return (
        <div className="flex items-end gap-2 h-32">
            {data.map(({ label, value, color }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span className="text-[10px] text-[#8899aa] font-medium truncate w-full text-center">
                        ${(value / 100).toFixed(0)}
                    </span>
                    <div
                        className={`w-full rounded-t-md transition-all ${color ?? 'bg-[#00d4ff]'}`}
                        style={{ height: `${Math.max((value / max) * 96, 4)}px` }}
                    />
                    <span className="text-[9px] text-[#555] truncate w-full text-center">{label}</span>
                </div>
            ))}
        </div>
    )
}

function DonutStat({ items }: { items: { label: string; value: number; color: string }[] }) {
    const total = items.reduce((s, i) => s + i.value, 0)
    return (
        <div className="space-y-3">
            {items.map(({ label, value, color }) => {
                const pct = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                    <div key={label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                <span className="text-[#ccd6f6]">{label}</span>
                            </div>
                            <span className="text-white font-semibold">{value} <span className="text-[#8899aa] font-normal text-xs">({pct}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                )
            })}
            <p className="text-right text-xs text-[#555] pt-1">Total: {total}</p>
        </div>
    )
}

export default async function AdminStatsPage() {
    const [
        { data: orders },
        { data: subscriptions },
        { data: plans },
        { data: users },
    ] = await Promise.all([
        supabaseAdmin.from('orders').select('amount_cents, provider, plan_id, created_at, status'),
        supabaseAdmin.from('subscriptions').select('status, plan_id, created_at'),
        supabaseAdmin.from('plans').select('id, name, price_cents, duration_months').order('duration_months'),
        supabaseAdmin.from('profiles').select('created_at, role'),
    ])

    const paidOrders = orders?.filter(o => o.status === 'paid') ?? []

    // ── Revenue by plan ──────────────────────────────────────
    const revenueByPlan = plans?.map(plan => {
        const rev = paidOrders
            .filter(o => o.plan_id === plan.id)
            .reduce((s, o) => s + (o.amount_cents ?? 0), 0)
        return { label: plan.name, value: rev }
    }) ?? []

    // ── Revenue by provider ──────────────────────────────────
    const stripeRev = paidOrders.filter(o => o.provider === 'stripe').reduce((s, o) => s + (o.amount_cents ?? 0), 0)
    const paypalRev = paidOrders.filter(o => o.provider === 'paypal').reduce((s, o) => s + (o.amount_cents ?? 0), 0)

    // ── Revenue last 6 months ────────────────────────────────
    const monthlyRevenue: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const y = d.getFullYear(), m = d.getMonth()
        const label = d.toLocaleString('en-US', { month: 'short' })
        const value = paidOrders
            .filter(o => {
                const od = new Date(o.created_at)
                return od.getFullYear() === y && od.getMonth() === m
            })
            .reduce((s, o) => s + (o.amount_cents ?? 0), 0)
        monthlyRevenue.push({ label, value })
    }

    // ── Subscription status breakdown ────────────────────────
    const statusGroups = {
        active: subscriptions?.filter(s => s.status === 'active').length ?? 0,
        pending_activation: subscriptions?.filter(s => s.status === 'pending_activation').length ?? 0,
        canceled: subscriptions?.filter(s => s.status === 'canceled').length ?? 0,
        past_due: subscriptions?.filter(s => s.status === 'past_due').length ?? 0,
    }

    // ── Subs by plan ─────────────────────────────────────────
    const subsByPlan = plans?.map(plan => ({
        label: plan.name,
        value: subscriptions?.filter(s => s.plan_id === plan.id).length ?? 0,
    })) ?? []

    // ── User signups last 6 months ───────────────────────────
    const userGrowth: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const y = d.getFullYear(), m = d.getMonth()
        const label = d.toLocaleString('en-US', { month: 'short' })
        const value = (users ?? []).filter(u => {
            const ud = new Date(u.created_at)
            return ud.getFullYear() === y && ud.getMonth() === m && u.role === 'user'
        }).length
        userGrowth.push({ label, value: value * 100 }) // scale for bar display
    }

    // ── Summary KPIs ─────────────────────────────────────────
    const totalRevenue = paidOrders.reduce((s, o) => s + (o.amount_cents ?? 0), 0)
    const totalOrders = paidOrders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalCustomers = (users ?? []).filter(u => u.role === 'user').length

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Statistics</h1>
                <p className="text-[#8899aa] text-sm mt-1">Revenue, growth, and subscription analytics</p>
            </div>

            {/* ── Summary KPIs ─────────────────────────────── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `$${(totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-[#00d4ff]', bg: 'bg-[#00d4ff]/10' },
                    { label: 'Total Orders', value: totalOrders, icon: CreditCard, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { label: 'Avg. Order Value', value: `$${(avgOrderValue / 100).toFixed(2)}`, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <Card key={label} className="bg-[#111827] border-white/10">
                        <CardContent className="pt-5 pb-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#8899aa] uppercase tracking-wider mb-1">{label}</p>
                                    <p className="text-2xl font-black text-white">{value}</p>
                                </div>
                                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* ── Revenue last 6 months ──────────────────── */}
                <Card className="bg-[#111827] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Monthly Revenue</CardTitle>
                        <CardDescription className="text-[#8899aa]">Last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart data={monthlyRevenue} />
                    </CardContent>
                </Card>

                {/* ── Revenue by plan ────────────────────────── */}
                <Card className="bg-[#111827] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Revenue by Plan</CardTitle>
                        <CardDescription className="text-[#8899aa]">All time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart data={revenueByPlan} />
                    </CardContent>
                </Card>

                {/* ── Subscription status ────────────────────── */}
                <Card className="bg-[#111827] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Subscription Status</CardTitle>
                        <CardDescription className="text-[#8899aa]">Current breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DonutStat items={[
                            { label: 'Active', value: statusGroups.active, color: 'bg-green-500' },
                            { label: 'Pending Activation', value: statusGroups.pending_activation, color: 'bg-amber-500' },
                            { label: 'Canceled', value: statusGroups.canceled, color: 'bg-red-500' },
                            { label: 'Past Due', value: statusGroups.past_due, color: 'bg-orange-500' },
                        ]} />
                    </CardContent>
                </Card>

                {/* ── Provider split ─────────────────────────── */}
                <Card className="bg-[#111827] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Revenue by Provider</CardTitle>
                        <CardDescription className="text-[#8899aa]">Stripe vs PayPal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <DonutStat items={[
                            { label: 'Stripe', value: Math.round(stripeRev / 100), color: 'bg-[#635bff]' },
                            { label: 'PayPal', value: Math.round(paypalRev / 100), color: 'bg-[#009cde]' },
                        ]} />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {[
                                { label: 'Stripe', value: `$${(stripeRev / 100).toFixed(2)}`, color: 'text-[#635bff]' },
                                { label: 'PayPal', value: `$${(paypalRev / 100).toFixed(2)}`, color: 'text-[#009cde]' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="p-3 rounded-xl bg-white/5 text-center">
                                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                                    <p className="text-xs text-[#8899aa]">{label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Subs by plan ───────────────────────────── */}
                <Card className="bg-[#111827] border-white/10 xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Subscriptions by Plan</CardTitle>
                        <CardDescription className="text-[#8899aa]">Total sold per plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {subsByPlan.map(({ label, value }) => {
                                const plan = plans?.find(p => p.name === label)
                                return (
                                    <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                                        <p className="text-3xl font-black text-white">{value}</p>
                                        <p className="text-sm font-semibold text-[#00d4ff]">{label}</p>
                                        {plan && (
                                            <p className="text-xs text-[#8899aa]">
                                                ${(plan.price_cents / 100).toFixed(2)} each
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
