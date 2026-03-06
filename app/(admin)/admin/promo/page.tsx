'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tag, Plus, Trash2, RefreshCw, Copy, Check, ToggleLeft, ToggleRight } from 'lucide-react'

interface PromoCode {
    id: string
    code: string
    discount_percent: number
    max_uses: number | null
    uses_count: number
    expires_at: string | null
    is_active: boolean
    created_at: string
}

export default function AdminPromoPage() {
    const [codes, setCodes] = useState<PromoCode[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    // Form state
    const [form, setForm] = useState({
        code: '',
        discount_percent: '10',
        max_uses: '',
        expires_at: '',
    })

    async function fetchCodes() {
        setLoading(true)
        const res = await fetch('/api/admin/promo')
        const data = await res.json()
        setCodes(data)
        setLoading(false)
    }

    useEffect(() => { fetchCodes() }, [])

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setCreating(true)
        try {
            const res = await fetch('/api/admin/promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: form.code || undefined,
                    discount_percent: parseInt(form.discount_percent),
                    max_uses: form.max_uses ? parseInt(form.max_uses) : null,
                    expires_at: form.expires_at || null,
                }),
            })
            if (res.ok) {
                setForm({ code: '', discount_percent: '10', max_uses: '', expires_at: '' })
                await fetchCodes()
            }
        } finally {
            setCreating(false)
        }
    }

    async function handleToggle(id: string, current: boolean) {
        await fetch(`/api/admin/promo/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: !current }),
        })
        await fetchCodes()
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this promo code permanently?')) return
        await fetch(`/api/admin/promo/${id}`, { method: 'DELETE' })
        await fetchCodes()
    }

    function copyCode(code: string) {
        navigator.clipboard.writeText(code)
        setCopied(code)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <Tag className="w-6 h-6 text-[#00d4ff]" />
                <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
            </div>

            {/* Create Form */}
            <form onSubmit={handleCreate} className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-[#8899aa] uppercase tracking-widest">Generate New Code</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-[#8899aa] font-semibold">Code (leave blank = random)</label>
                        <Input
                            value={form.code}
                            onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                            placeholder="e.g. SUMMER25"
                            className="bg-white/5 border-white/10 text-white font-mono uppercase"
                            maxLength={20}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-[#8899aa] font-semibold">Discount %</label>
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            value={form.discount_percent}
                            onChange={(e) => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                            required
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-[#8899aa] font-semibold">Max Uses (blank = unlimited)</label>
                        <Input
                            type="number"
                            min={1}
                            value={form.max_uses}
                            onChange={(e) => setForm(f => ({ ...f, max_uses: e.target.value }))}
                            placeholder="∞"
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-[#8899aa] font-semibold">Expires At</label>
                        <Input
                            type="datetime-local"
                            value={form.expires_at}
                            onChange={(e) => setForm(f => ({ ...f, expires_at: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={creating}
                    className="bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {creating ? 'Creating…' : 'Create Promo Code'}
                </Button>
            </form>

            {/* Codes Table */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <span className="text-sm font-bold text-white">{codes.length} codes</span>
                    <button onClick={fetchCodes} className="text-[#8899aa] hover:text-white transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-[#8899aa]">Loading…</div>
                ) : codes.length === 0 ? (
                    <div className="p-8 text-center text-[#8899aa]">No promo codes yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-left">
                                    <th className="p-4 text-xs text-[#8899aa] font-bold uppercase tracking-wider">Code</th>
                                    <th className="p-4 text-xs text-[#8899aa] font-bold uppercase tracking-wider">Discount</th>
                                    <th className="p-4 text-xs text-[#8899aa] font-bold uppercase tracking-wider">Uses</th>
                                    <th className="p-4 text-xs text-[#8899aa] font-bold uppercase tracking-wider">Expires</th>
                                    <th className="p-4 text-xs text-[#8899aa] font-bold uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs text-[#8899aa] font-bold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map((c) => (
                                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-white tracking-widest">{c.code}</span>
                                                <button
                                                    onClick={() => copyCode(c.code)}
                                                    className="text-[#555] hover:text-[#00d4ff] transition-colors"
                                                >
                                                    {copied === c.code
                                                        ? <Check className="w-3.5 h-3.5 text-[#00e5a0]" />
                                                        : <Copy className="w-3.5 h-3.5" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[#00e5a0] font-bold">{c.discount_percent}%</span>
                                        </td>
                                        <td className="p-4 text-[#8899aa]">
                                            {c.uses_count}{c.max_uses !== null ? `/${c.max_uses}` : ''}
                                        </td>
                                        <td className="p-4 text-[#8899aa] text-xs">
                                            {c.expires_at
                                                ? new Date(c.expires_at).toLocaleDateString()
                                                : <span className="text-[#555]">Never</span>
                                            }
                                        </td>
                                        <td className="p-4">
                                            <Badge className={c.is_active
                                                ? 'bg-[#00e5a0]/20 text-[#00e5a0] border-[#00e5a0]/30'
                                                : 'bg-white/5 text-[#555] border-white/10'
                                            }>
                                                {c.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggle(c.id, c.is_active)}
                                                    className="text-[#8899aa] hover:text-white transition-colors"
                                                    title={c.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {c.is_active
                                                        ? <ToggleRight className="w-5 h-5 text-[#00e5a0]" />
                                                        : <ToggleLeft className="w-5 h-5" />
                                                    }
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="text-[#555] hover:text-red-400 transition-colors"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
