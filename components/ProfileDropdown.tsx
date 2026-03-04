'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, LayoutDashboard, Settings, LogOut, ChevronDown, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ProfileDropdownProps {
    email: string
    fullName?: string
    isAdmin?: boolean
}

export default function ProfileDropdown({ email, fullName, isAdmin }: ProfileDropdownProps) {
    const router = useRouter()
    const supabase = createClient()

    const initials = fullName
        ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : email[0].toUpperCase()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors outline-none group"
                    aria-label="Profile menu"
                >
                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center text-[#0a0f1a] font-bold text-sm shadow-[0_0_12px_rgba(0,212,255,0.3)] select-none">
                        {initials}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8899aa] group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 min-w-[220px] rounded-xl bg-[#111827] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-1.5 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                >
                    {/* User info header */}
                    <div className="px-3 py-2.5 mb-1">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center text-[#0a0f1a] font-bold text-sm select-none shrink-0">
                                {initials}
                            </div>
                            <div className="overflow-hidden">
                                {fullName && (
                                    <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                                )}
                                <p className="text-xs text-[#8899aa] truncate">{email}</p>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-white/10 mx-1 mb-1" />

                    {isAdmin && (
                        <DropdownMenu.Item asChild>
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:text-amber-300 rounded-lg hover:bg-white/5 cursor-pointer outline-none transition-colors"
                            >
                                <Shield className="w-4 h-4" />
                                Admin Panel
                            </Link>
                        </DropdownMenu.Item>
                    )}

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/app"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#ccd6f6] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer outline-none transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 text-[#00d4ff]" />
                            Dashboard
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/app/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#ccd6f6] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer outline-none transition-colors"
                        >
                            <User className="w-4 h-4 text-[#00d4ff]" />
                            Profile Info
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/app/settings"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#ccd6f6] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer outline-none transition-colors"
                        >
                            <Settings className="w-4 h-4 text-[#00d4ff]" />
                            Settings
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-white/10 mx-1 my-1" />

                    <DropdownMenu.Item
                        onSelect={handleSignOut}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
