'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowUpDown } from 'lucide-react'

const PROVIDER_LABEL: Record<string, string> = {
    stripe: '💳 Stripe',
    paypal: '🅿️ PayPal',
    crypto: '₿ Crypto',
    manual: '🔧 Manual',
}

const DEVICE_LABEL: Record<string, string> = {
    smart_tv: 'Smart TV',
    android_box: 'Android Box',
    android_phone: 'Android',
    iphone_ipad: 'iOS',
    windows_mac: 'Windows/Mac',
    mag_device: 'MAG',
    enigma2: 'Enigma2',
    other: 'Other',
}

function StatusBadge({ status, isExpired }: { status: string; isExpired: boolean }) {
    if (status === 'active' && isExpired)
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Expired</Badge>
    if (status === 'active')
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
    if (status === 'pending_activation')
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Pending</Badge>
    if (status === 'canceled')
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Canceled</Badge>
    return <Badge className="bg-white/10 text-[#8899aa] border-white/10 text-xs">No Sub</Badge>
}

function DaysLeft({ daysLeft, isExpired }: { daysLeft: number | null; isExpired: boolean }) {
    if (daysLeft === null) return <span className="text-[#555]">—</span>
    if (isExpired) return <span className="text-red-400 font-semibold">Expired</span>
    if (daysLeft <= 3) return <span className="text-red-400 font-bold">{daysLeft}d</span>
    if (daysLeft <= 7) return <span className="text-orange-400 font-semibold">{daysLeft}d</span>
    return <span className="text-green-400">{daysLeft}d</span>
}

type Row = {
    id: string; email: string; joinedAt: string; status: string
    planName: string | null; durationMonths: number | null
    expiresAt: string | null; daysLeft: number | null; isExpired: boolean
    provider: string | null; deviceType: string | null; providerUsername: string | null
    totalSpentCents: number; totalOrders: number; lastOrderAt: string | null
    subId: string | null
}

type SortKey = 'email' | 'status' | 'daysLeft' | 'totalSpentCents' | 'joinedAt' | 'lastOrderAt'

export default function UsersTable({ rows }: { rows: Row[] }) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'expired' | 'none'>('all')
    const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'joinedAt', dir: 'desc' })

    const filtered = useMemo(() => {
        let list = rows

        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(r =>
                r.email.toLowerCase().includes(q) ||
                r.providerUsername?.toLowerCase().includes(q) ||
                r.planName?.toLowerCase().includes(q)
            )
        }

        if (filter === 'active')  list = list.filter(r => r.status === 'active' && !r.isExpired)
        if (filter === 'pending') list = list.filter(r => r.status === 'pending_activation')
        if (filter === 'expired') list = list.filter(r => r.isExpired || r.status === 'canceled')
        if (filter === 'none')    list = list.filter(r => r.status === 'none')

        return [...list].sort((a, b) => {
            const dir = sort.dir === 'asc' ? 1 : -1
            const k = sort.key
            if (k === 'daysLeft') {
                const av = a.daysLeft ?? -9999
                const bv = b.daysLeft ?? -9999
                return (av - bv) * dir
            }
            if (k === 'totalSpentCents') return (a.totalSpentCents - b.totalSpentCents) * dir
            const av = (a[k] as string | null) ?? ''
            const bv = (b[k] as string | null) ?? ''
            return av.localeCompare(bv) * dir
        })
    }, [rows, search, filter, sort])

    function toggleSort(key: SortKey) {
        setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
    }

    const filterTabs = [
        { key: 'all',     label: `All (${rows.length})` },
        { key: 'active',  label: `Active (${rows.filter(r => r.status === 'active' && !r.isExpired).length})` },
        { key: 'pending', label: `Pending (${rows.filter(r => r.status === 'pending_activation').length})` },
        { key: 'expired', label: `Expired (${rows.filter(r => r.isExpired || r.status === 'canceled').length})` },
        { key: 'none',    label: `No Sub (${rows.filter(r => r.status === 'none').length})` },
    ] as const

    return (
        <div className="bg-[#111827] rounded-xl border border-white/10 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8899aa]" />
                    <Input
                        placeholder="Search email, username, plan…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 bg-[#0a0f1a] border-white/10 text-white placeholder:text-[#555] h-9 text-sm"
                    />
                </div>
                <div className="flex gap-1 flex-wrap">
                    {filterTabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setFilter(t.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                filter === t.key
                                    ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30'
                                    : 'text-[#8899aa] hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            {([
                                { key: 'email',          label: 'User' },
                                { key: 'status',         label: 'Status' },
                                { key: null,             label: 'Plan' },
                                { key: 'daysLeft',       label: 'Days Left' },
                                { key: null,             label: 'Expires' },
                                { key: null,             label: 'Provider' },
                                { key: null,             label: 'Device' },
                                { key: null,             label: 'Username' },
                                { key: 'totalSpentCents',label: 'Spent' },
                                { key: 'joinedAt',       label: 'Joined' },
                                { key: null,             label: '' },
                            ] as { key: SortKey | null; label: string }[]).map(({ key, label }) => (
                                <th
                                    key={label}
                                    onClick={() => key && toggleSort(key)}
                                    className={`px-4 py-3 text-left text-xs font-bold text-[#8899aa] uppercase tracking-wider whitespace-nowrap ${key ? 'cursor-pointer hover:text-white select-none' : ''}`}
                                >
                                    <span className="flex items-center gap-1">
                                        {label}
                                        {key && <ArrowUpDown className="w-3 h-3 opacity-40" />}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={11} className="text-center py-12 text-[#8899aa]">No users found.</td>
                            </tr>
                        )}
                        {filtered.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                            >
                                {/* Email */}
                                <td className="px-4 py-3 font-medium text-white max-w-[180px]">
                                    <span className="block truncate" title={row.email}>{row.email}</span>
                                    <span className="text-[10px] text-[#555]">{row.totalOrders} order{row.totalOrders !== 1 ? 's' : ''}</span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <StatusBadge status={row.status} isExpired={row.isExpired} />
                                </td>

                                {/* Plan */}
                                <td className="px-4 py-3 text-[#94a3b8] whitespace-nowrap">
                                    {row.planName ?? <span className="text-[#555]">—</span>}
                                </td>

                                {/* Days left */}
                                <td className="px-4 py-3 font-mono text-sm">
                                    <DaysLeft daysLeft={row.daysLeft} isExpired={row.isExpired} />
                                </td>

                                {/* Expires */}
                                <td className="px-4 py-3 text-[#8899aa] text-xs whitespace-nowrap">
                                    {row.expiresAt
                                        ? new Date(row.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : <span className="text-[#555]">—</span>}
                                </td>

                                {/* Provider */}
                                <td className="px-4 py-3 text-xs text-[#8899aa] whitespace-nowrap">
                                    {row.provider ? PROVIDER_LABEL[row.provider] : <span className="text-[#555]">—</span>}
                                </td>

                                {/* Device */}
                                <td className="px-4 py-3 text-xs text-[#8899aa]">
                                    {row.deviceType ? (DEVICE_LABEL[row.deviceType] ?? row.deviceType) : <span className="text-[#555]">—</span>}
                                </td>

                                {/* Provider username */}
                                <td className="px-4 py-3">
                                    {row.providerUsername
                                        ? <code className="text-xs text-[#00d4ff] bg-[#00d4ff]/5 px-1.5 py-0.5 rounded">{row.providerUsername}</code>
                                        : <span className="text-[#555] text-xs">—</span>}
                                </td>

                                {/* Total spent */}
                                <td className="px-4 py-3 text-[#94a3b8] font-semibold whitespace-nowrap">
                                    {row.totalSpentCents > 0
                                        ? `$${(row.totalSpentCents / 100).toFixed(2)}`
                                        : <span className="text-[#555]">$0</span>}
                                </td>

                                {/* Joined */}
                                <td className="px-4 py-3 text-[#555] text-xs whitespace-nowrap">
                                    {new Date(row.joinedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>

                                {/* Action */}
                                <td className="px-4 py-3">
                                    {row.subId ? (
                                        <Link href={`/admin/orders/${row.subId}`}>
                                            <Button size="sm" variant="ghost"
                                                className="h-7 px-2 text-xs text-[#8899aa] hover:text-white hover:bg-white/10">
                                                View →
                                            </Button>
                                        </Link>
                                    ) : (
                                        <span className="text-[#555] text-xs px-2">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-white/10 text-xs text-[#555]">
                    Showing {filtered.length} of {rows.length} users
                </div>
            )}
        </div>
    )
}
