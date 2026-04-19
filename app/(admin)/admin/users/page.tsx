import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Users, CheckCircle2, Clock, XCircle, UserX, Search } from 'lucide-react'
import UsersTable from './UsersTable'

export const revalidate = 0

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/sign-in')

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') redirect('/app')

    // Fetch all profiles + their latest subscription + order stats
    const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, email, created_at, role')
        .eq('role', 'user')
        .order('created_at', { ascending: false })

    const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('*, plan:plans(name, duration_months)')
        .order('created_at', { ascending: false })

    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('user_id, amount_cents, created_at, status')
        .eq('status', 'paid')

    // Build user rows
    const now = new Date()
    const rows = (profiles ?? []).map(p => {
        const userSubs = (subscriptions ?? []).filter(s => s.user_id === p.id)
        const activeSub = userSubs.find(s => s.status === 'active')
            ?? userSubs.find(s => s.status === 'pending_activation')
            ?? userSubs[0] ?? null

        const userOrders = (orders ?? []).filter(o => o.user_id === p.id)
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.amount_cents ?? 0), 0)
        const lastOrder = userOrders.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0] ?? null

        let daysLeft: number | null = null
        let isExpired = false
        if (activeSub?.current_period_end) {
            const end = new Date(activeSub.current_period_end)
            daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            isExpired = daysLeft < 0
        }

        const provider = activeSub?.stripe_customer_id ? 'stripe'
            : activeSub?.paypal_subscription_id ? 'paypal'
            : activeSub?.nowpayments_payment_id ? 'crypto'
            : activeSub ? 'manual' : null

        return {
            id: p.id,
            email: p.email ?? '—',
            joinedAt: p.created_at,
            status: activeSub?.status ?? 'none',
            planName: activeSub?.plan?.name ?? null,
            durationMonths: activeSub?.plan?.duration_months ?? null,
            expiresAt: activeSub?.current_period_end ?? null,
            daysLeft,
            isExpired,
            provider,
            deviceType: activeSub?.device_type ?? null,
            providerUsername: activeSub?.provider_username ?? null,
            totalSpentCents: totalSpent,
            totalOrders: userOrders.length,
            lastOrderAt: lastOrder?.created_at ?? null,
            subId: activeSub?.id ?? null,
        }
    })

    // Summary counts
    const activeCount   = rows.filter(r => r.status === 'active').length
    const pendingCount  = rows.filter(r => r.status === 'pending_activation').length
    const expiringSoon  = rows.filter(r => r.status === 'active' && r.daysLeft !== null && r.daysLeft <= 7 && !r.isExpired).length
    const noSubCount    = rows.filter(r => r.status === 'none').length

    const stats = [
        { label: 'Active', value: activeCount,  icon: CheckCircle2, color: 'text-green-400',  bg: 'bg-green-400/10' },
        { label: 'Pending', value: pendingCount, icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-400/10' },
        { label: 'Expiring ≤7d', value: expiringSoon, icon: Clock,   color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'No Subscription', value: noSubCount, icon: UserX,  color: 'text-[#8899aa]',  bg: 'bg-white/5' },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#00d4ff]" /> Users
                </h1>
                <p className="text-[#8899aa] text-sm mt-1">{rows.length} registered accounts</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <Card key={label} className="bg-[#111827] border-white/10">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-[#8899aa] font-semibold uppercase tracking-wider">{label}</p>
                                    <p className="text-2xl font-black text-white mt-0.5">{value}</p>
                                </div>
                                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table with client-side search/filter */}
            <UsersTable rows={rows} />
        </div>
    )
}
