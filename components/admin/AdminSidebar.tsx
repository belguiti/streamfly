'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ClipboardList,
    Database,
    BarChart3,
    Menu,
    X,
    Tv,
    LogOut,
    Tag,
} from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: 'Orders', icon: ClipboardList, exact: false },
    { href: '/admin/pool', label: 'Activation Pool', icon: Database, exact: false },
    { href: '/admin/promo', label: 'Promo Codes', icon: Tag, exact: false },
    { href: '/admin/stats', label: 'Statistics', icon: BarChart3, exact: false },
]

interface AdminSidebarProps {
    initials: string
    email: string
    fullName?: string
}

function NavLink({ href, label, icon: Icon, exact, onClick }: {
    href: string; label: string; icon: any; exact: boolean; onClick?: () => void
}) {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname.startsWith(href)

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20'
                : 'text-[#8899aa] hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
        </Link>
    )
}

export default function AdminSidebar({ initials, email, fullName }: AdminSidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false)

    const userCard = (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm shrink-0 select-none">
                {initials}
            </div>
            <div className="overflow-hidden min-w-0">
                {fullName && <p className="text-xs font-semibold text-white truncate">{fullName}</p>}
                <p className="text-xs text-[#8899aa] truncate">{email}</p>
            </div>
        </div>
    )

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────── */}
            <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#0d1424] border-r border-white/10 shrink-0">
                {/* Logo */}
                <div className="h-16 px-5 flex items-center border-b border-white/10 shrink-0">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.3)]">
                            <Tv className="w-4 h-4 text-[#0a0f1a]" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm leading-none">Streamtly</p>
                            <p className="text-[10px] text-amber-400 font-semibold tracking-wide mt-0.5">ADMIN PANEL</p>
                        </div>
                    </Link>
                </div>

                {/* Nav links */}
                <nav className="flex-1 p-3 space-y-0.5">
                    {navItems.map(item => (
                        <NavLink key={item.href} {...item} />
                    ))}
                </nav>

                {/* User section */}
                <div className="p-3 border-t border-white/10 space-y-2">
                    {userCard}
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* ── Mobile top bar ───────────────────────────── */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#0d1424] border-b border-white/10 flex items-center justify-between px-4">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center">
                        <Tv className="w-3.5 h-3.5 text-[#0a0f1a]" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-xs leading-none">Streamtly</p>
                        <p className="text-[9px] text-amber-400 font-semibold">ADMIN</p>
                    </div>
                </Link>
                <button
                    onClick={() => setMobileOpen(v => !v)}
                    className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Mobile drawer ────────────────────────────── */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                >
                    <div
                        className="absolute left-0 top-14 bottom-0 w-64 bg-[#0d1424] border-r border-white/10 flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <nav className="flex-1 p-3 space-y-0.5">
                            {navItems.map(item => (
                                <NavLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
                            ))}
                        </nav>
                        <div className="p-3 border-t border-white/10 space-y-2">
                            {userCard}
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
