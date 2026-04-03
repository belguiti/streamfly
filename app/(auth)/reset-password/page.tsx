'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) { setError('Passwords do not match.'); return }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
        setIsLoading(true)
        setError(null)
        const { error } = await supabase.auth.updateUser({ password })
        setIsLoading(false)
        if (error) {
            setError(error.message)
        } else {
            setDone(true)
            setTimeout(() => router.push('/sign-in'), 2500)
        }
    }

    return (
        <div className="min-h-screen bg-[#080818] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#111827] border-white/10 shadow-2xl">
                <CardHeader className="pb-2 px-8 pt-8">
                    <CardTitle className="text-2xl font-black text-white">Set new password</CardTitle>
                    <CardDescription className="text-[#8899aa]">Choose a strong password for your account.</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-4">
                    {done ? (
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                            <p className="text-white font-semibold">Password updated!</p>
                            <p className="text-sm text-[#8899aa]">Redirecting you to sign in...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 text-white pl-10 pr-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8899aa]">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
                            <Button type="submit" className="w-full h-12 bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold text-base" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update password'}
                            </Button>
                            <Link href="/sign-in" className="flex justify-center text-sm text-[#8899aa] hover:text-white mt-2">Back to sign in</Link>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
