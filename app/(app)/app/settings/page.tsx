'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Shield, AlertTriangle, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function getPasswordStrength(p: string) {
    if (!p) return { label: '', color: '', width: '0%' }
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[A-Z]/.test(p)) score++
    if (/[a-z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' }
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { label: 'Strong', color: 'bg-green-500', width: '100%' }
}

export default function SettingsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    // Password
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordSuccess, setPasswordSuccess] = useState(false)

    const strength = getPasswordStrength(newPassword)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push('/sign-in'); return }
            setUser(user)
        })
    }, [])

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }
        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters.')
            return
        }
        setPasswordLoading(true)
        setPasswordError(null)
        setPasswordSuccess(false)
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error
            setPasswordSuccess(true)
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            setPasswordError(err.message)
        } finally {
            setPasswordLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 animate-spin text-[#00d4ff]" />
            </div>
        )
    }

    const isOAuthUser = user.app_metadata?.provider && user.app_metadata.provider !== 'email'

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/app" className="p-2 rounded-lg text-[#8899aa] hover:text-white hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-[#8899aa] text-sm">Manage your account preferences and security</p>
                </div>
            </div>

            {/* ── Password ─────────────────────────────────── */}
            <Card className="bg-[#111827]/80 border-white/10 mb-6">
                <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#00d4ff]" />
                        Password
                    </CardTitle>
                    <CardDescription className="text-[#8899aa]">
                        {isOAuthUser
                            ? 'You signed in with Google — password login is not available for your account.'
                            : 'Change the password used to log in to your account.'}
                    </CardDescription>
                </CardHeader>

                {isOAuthUser ? (
                    <CardContent>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-[#8899aa]">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-blue-400" />
                            </div>
                            Your account is secured via Google OAuth. Manage your password in your Google account settings.
                        </div>
                    </CardContent>
                ) : (
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {/* New password */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                    <Input
                                        type={showNew ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setPasswordSuccess(false) }}
                                        placeholder="••••••••"
                                        required
                                        className="bg-white/5 border-white/10 text-white pl-10 pr-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-11"
                                    />
                                    <button type="button" onClick={() => setShowNew(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8899aa] transition-colors" tabIndex={-1}>
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {newPassword.length > 0 && (
                                    <div className="space-y-1 pt-0.5">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                                        </div>
                                        <p className={`text-xs font-semibold ${
                                            strength.label === 'Weak' ? 'text-red-400' :
                                            strength.label === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                                        }`}>{strength.label}</p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                    <Input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="bg-white/5 border-white/10 text-white pl-10 pr-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-11"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8899aa] transition-colors" tabIndex={-1}>
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {passwordError && (
                                <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-xs font-medium text-red-400">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Password updated successfully.
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={passwordLoading}
                                className="bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold px-6 shadow-[0_4px_16px_rgba(0,212,255,0.2)]"
                            >
                                {passwordLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                )}
            </Card>

            {/* ── Account Details ───────────────────────────── */}
            <Card className="bg-[#111827]/80 border-white/10 mb-6">
                <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#00d4ff]" />
                        Account Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-white/5">
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-[#8899aa]">Email</span>
                            <span className="text-sm text-white">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-[#8899aa]">Account ID</span>
                            <span className="text-xs font-mono text-white/50">{user.id.slice(0, 16)}…</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-[#8899aa]">Sign-in Method</span>
                            <span className="text-sm text-white capitalize">
                                {user.app_metadata?.provider === 'google' ? '🔵 Google' : '✉️ Email & Password'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-[#8899aa]">Member Since</span>
                            <span className="text-sm text-white">
                                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-[#8899aa]">Last Sign-in</span>
                            <span className="text-sm text-white">
                                {new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Danger Zone ───────────────────────────────── */}
            <Card className="bg-[#111827]/80 border-red-500/30">
                <CardHeader>
                    <CardTitle className="text-red-400 text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-[#8899aa]">
                        Irreversible actions — proceed with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                        <div>
                            <p className="text-sm font-semibold text-white">Delete Account</p>
                            <p className="text-xs text-[#8899aa] mt-0.5">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <a href="mailto:support@streamtly.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20account.%20My%20email%20is%3A%20">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 shrink-0 ml-4"
                            >
                                Request Deletion
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
