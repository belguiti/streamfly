import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Menu, X, Tv, Sparkles } from 'lucide-react'
import ProfileDropdown from '@/components/ProfileDropdown'

export default async function Navbar() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    let isAdmin = false
    let fullName: string | undefined
    if (user) {
        const { data } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
        if (data?.role === 'admin') isAdmin = true
        fullName = user.user_metadata?.full_name
    }

    return (
        <header className="sticky top-0 z-50 glass">
            {/* Top accent line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#4338CA]/40 to-transparent" aria-hidden="true" />

            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4338CA] to-[#22C55E] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(67,56,202,0.5)] transition-all group-hover:scale-110">
                        <Tv className="w-4 h-4 text-[#0F0F23]" />
                    </div>
                    <span className="font-bold text-xl tracking-tight gradient-text">Streamtly</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-white hover:text-[#D97706] transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                        Pricing
                    </Link>
                    <Link href="/blog" className="px-3 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        Blog
                    </Link>
                    <Link href="/guides" className="px-3 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        Guides
                    </Link>
                    <Link href="/reviews" className="px-3 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        Reviews
                    </Link>
                    <Link href="/contact" className="px-3 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        Contact
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Desktop: profile dropdown */}
                            <div className="hidden md:flex items-center">
                                <ProfileDropdown
                                    email={user.email!}
                                    fullName={fullName}
                                    isAdmin={isAdmin}
                                />
                            </div>

                            {/* Mobile menu — authenticated */}
                            <details className="md:hidden relative group">
                                <summary className="list-none p-2 cursor-pointer text-white hover:bg-white/5 rounded-lg">
                                    <Menu className="w-5 h-5 group-open:hidden" />
                                    <X className="w-5 h-5 hidden group-open:block" />
                                </summary>
                                <div className="absolute right-0 top-12 w-64 glass rounded-xl p-4 space-y-1 shadow-2xl">
                                    <Link href="/pricing" className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#D97706] hover:text-[#D97706] hover:bg-white/5 rounded-lg transition-colors font-medium">
                                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                        Pricing
                                    </Link>
                                    <Link href="/blog" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Blog</Link>
                                    <Link href="/guides" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Guides</Link>
                                    <Link href="/reviews" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Reviews</Link>
                                    <Link href="/contact" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Contact</Link>
                                    <div className="border-t border-white/5 mt-2 pt-2 space-y-1">
                                        {isAdmin && (
                                            <Link href="/admin/orders" className="block px-3 py-2.5 text-sm text-amber-400 hover:text-amber-300 rounded-lg transition-colors">Admin Panel</Link>
                                        )}
                                        <Link href="/app" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white rounded-lg transition-colors">Dashboard</Link>
                                        <Link href="/app/profile" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white rounded-lg transition-colors">Profile Info</Link>
                                        <Link href="/app/settings" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white rounded-lg transition-colors">Settings</Link>
                                        <form action="/auth/signout" method="post">
                                            <button type="submit" className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:text-red-300 rounded-lg transition-colors">Sign Out</button>
                                        </form>
                                    </div>
                                </div>
                            </details>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className="hidden md:block text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
                                Log In
                            </Link>
                            <Link href="/pricing">
                                <Button size="sm" className="bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-[#0F0F23] font-bold hover:shadow-[0_0_20px_rgba(67,56,202,0.5)] transition-all hover:scale-105 border-0">
                                    View Plans
                                </Button>
                            </Link>

                            {/* Mobile menu — guest */}
                            <details className="md:hidden relative group">
                                <summary className="list-none p-2 cursor-pointer text-white hover:bg-white/5 rounded-lg">
                                    <Menu className="w-5 h-5 group-open:hidden" />
                                    <X className="w-5 h-5 hidden group-open:block" />
                                </summary>
                                <div className="absolute right-0 top-12 w-64 glass rounded-xl p-4 space-y-1 shadow-2xl">
                                    <Link href="/pricing" className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#D97706] hover:text-[#D97706] hover:bg-white/5 rounded-lg transition-colors font-medium">
                                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                        Pricing
                                    </Link>
                                    <Link href="/blog" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Blog</Link>
                                    <Link href="/guides" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Guides</Link>
                                    <Link href="/reviews" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Reviews</Link>
                                    <Link href="/contact" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Contact</Link>
                                    <div className="border-t border-white/5 mt-2 pt-2">
                                        <Link href="/sign-in" className="block px-3 py-2.5 text-sm text-[#94A3B8] hover:text-white rounded-lg transition-colors">Log In</Link>
                                    </div>
                                </div>
                            </details>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
