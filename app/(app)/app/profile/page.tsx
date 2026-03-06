'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, User, Mail, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [fullName, setFullName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push('/sign-in'); return }
            setUser(user)
            setFullName(user.user_metadata?.full_name || '')
        })
    }, [])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        try {
            const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
            if (error) throw error
            setSuccess(true)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 animate-spin text-[#00d4ff]" />
            </div>
        )
    }

    const initials = fullName
        ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email?.[0]?.toUpperCase() ?? '?'

    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/app" className="p-2 rounded-lg text-[#8899aa] hover:text-white hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Profile Info</h1>
                    <p className="text-[#8899aa] text-sm">Manage your personal information</p>
                </div>
            </div>

            {/* Avatar card */}
            <Card className="bg-[#111827]/80 border-white/10 mb-6">
                <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center text-[#0a0f1a] font-black text-2xl shadow-[0_0_24px_rgba(0,212,255,0.3)] shrink-0 select-none">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xl font-bold text-white truncate">
                                {fullName || <span className="text-[#8899aa] italic font-normal text-base">No name set</span>}
                            </p>
                            <p className="text-[#8899aa] text-sm truncate">{user.email}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Calendar className="w-3.5 h-3.5 text-[#555]" />
                                <p className="text-[#555] text-xs">Member since {memberSince}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit form */}
            <Card className="bg-[#111827]/80 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-[#00d4ff]" />
                        Personal Information
                    </CardTitle>
                    <CardDescription className="text-[#8899aa]">
                        Update your display name shown across the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                        {/* Full name */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                <Input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => { setFullName(e.target.value); setSuccess(false) }}
                                    placeholder="Your full name"
                                    className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-11"
                                />
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                <Input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-white/5 border-white/10 text-[#8899aa] pl-10 h-11 cursor-not-allowed opacity-60"
                                />
                            </div>
                            <p className="text-xs text-[#555]">
                                Email cannot be changed here.{' '}
                                <a href="mailto:support@streamtly.com" className="text-[#00d4ff] hover:underline">
                                    Contact support
                                </a>{' '}
                                to update it.
                            </p>
                        </div>

                        {/* Provider badge */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Sign-in Method
                            </Label>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white capitalize">
                                {user.app_metadata?.provider === 'google' ? '🔵 Google' : '✉️ Email & Password'}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-xs font-medium text-red-400">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Profile updated successfully.
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold px-6 shadow-[0_4px_16px_rgba(0,212,255,0.2)]"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
