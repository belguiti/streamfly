'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff, User } from 'lucide-react'

function GoogleIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
    mode: 'sign-in' | 'sign-up'
    message?: string
    next?: string
}

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
    if (password.length === 0) return { label: '', color: '', width: '0%' }
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' }
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { label: 'Strong', color: 'bg-green-500', width: '100%' }
}

export function AuthForm({ mode, message, next: nextProp }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(message || null)
    const supabase = createClient()
    const router = useRouter()
    const next = nextProp ?? '/app'

    // ── sign-up state ──────────────────────────────────────────
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [awaitingConfirm, setAwaitingConfirm] = useState(false)
    const [signupEmail, setSignupEmail] = useState('')

    const passwordStrength = getPasswordStrength(password)

    // ── shared ─────────────────────────────────────────────────
    const handleGoogleLogin = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const callbackUrl = new URL(`${window.location.origin}/auth/callback`)
            if (next !== '/app') callbackUrl.searchParams.set('next', next)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: callbackUrl.toString() },
            })
            if (error) throw error
        } catch (err: any) {
            setError(`${err.message}. Make sure Google is enabled in Supabase Dashboard.`)
            setIsLoading(false)
        }
    }

    // ── sign-in handler ────────────────────────────────────────
    const handlePasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const fd = new FormData(e.currentTarget)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: fd.get('email') as string,
                password: fd.get('password') as string,
            })
            if (error) throw error
            router.push(next)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // ── sign-up handler ────────────────────────────────────────
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const fd = new FormData(e.currentTarget)
        const fullName = fd.get('fullName') as string
        const emailVal = fd.get('email') as string
        const passwordVal = fd.get('password') as string
        const confirmVal = fd.get('confirmPassword') as string

        if (passwordVal !== confirmVal) {
            setError('Passwords do not match.')
            setIsLoading(false)
            return
        }
        if (passwordStrength.label === 'Weak') {
            setError('Please choose a stronger password.')
            setIsLoading(false)
            return
        }
        try {
            const { error } = await supabase.auth.signUp({
                email: emailVal,
                password: passwordVal,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
            setSignupEmail(emailVal)
            setAwaitingConfirm(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // ══════════════════════════════════════════════════════════
    // SIGN-UP RENDER
    // ══════════════════════════════════════════════════════════
    if (mode === 'sign-up') {
        // Step 2 — confirmation sent
        if (awaitingConfirm) {
            return (
                <Card className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="text-center pt-8 pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center shadow-[0_0_24px_rgba(0,212,255,0.35)]">
                                <Mail className="w-7 h-7 text-[#0a0f1a]" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black text-white">Check Your Email</CardTitle>
                        <CardDescription className="text-[#8899aa] mt-2 leading-relaxed">
                            We sent a verification link to{' '}
                            <span className="text-white font-semibold">{signupEmail}</span>.
                            <br />
                            Click the link in the email to activate your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#8899aa] leading-relaxed text-center">
                            Didn&apos;t receive it? Check your spam folder or{' '}
                            <button
                                type="button"
                                className="text-[#00d4ff] font-bold hover:underline"
                                onClick={() => { setAwaitingConfirm(false); setError(null) }}
                            >
                                try a different email
                            </button>
                            .
                        </div>
                    </CardContent>
                </Card>
            )
        }

        // Step 1 — registration form
        return (
            <Card className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
                <CardHeader className="text-center pt-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                            <User className="w-6 h-6 text-[#0a0f1a]" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-white">Get Started</CardTitle>
                    <CardDescription className="text-[#8899aa]">
                        Create your account to start streaming today
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8 space-y-6">
                    <Button
                        variant="outline"
                        className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 gap-2"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        type="button"
                    >
                        <GoogleIcon /> Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#555]">
                            <span className="bg-[#111827] px-4">Or sign up with email</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSignUp}>
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white pl-10 pr-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8899aa] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="space-y-1 pt-1">
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{ width: passwordStrength.width }}
                                        />
                                    </div>
                                    <p className={`text-xs font-semibold ${
                                        passwordStrength.label === 'Weak' ? 'text-red-400' :
                                        passwordStrength.label === 'Medium' ? 'text-yellow-400' :
                                        'text-green-400'
                                    }`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    className="bg-white/5 border-white/10 text-white pl-10 pr-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8899aa] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-xs font-medium text-red-400">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold text-base transition-all transform active:scale-[0.98] group shadow-[0_4px_20px_rgba(0,212,255,0.2)]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="px-8 py-6 bg-white/5 border-t border-white/5 flex justify-center">
                    <p className="text-sm text-[#8899aa]">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-[#00d4ff] font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        )
    }

    // ══════════════════════════════════════════════════════════
    // SIGN-IN RENDER
    // ══════════════════════════════════════════════════════════
    return (
        <Card className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                        <Mail className="w-6 h-6 text-[#0a0f1a]" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-black text-white">Welcome Back</CardTitle>
                <CardDescription className="text-[#8899aa]">
                    Log in to access your premium subscription
                </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 space-y-6">
                <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 gap-2"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    type="button"
                >
                    <GoogleIcon /> Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#555]">
                        <span className="bg-[#111827] px-4">Or continue with email</span>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handlePasswordSignIn}>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-xs font-medium text-red-400">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold text-base transition-all transform active:scale-[0.98] group shadow-[0_4px_20px_rgba(0,212,255,0.2)]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            <>
                                Log In
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="px-8 py-6 bg-white/5 border-t border-white/5 flex justify-center">
                <p className="text-sm text-[#8899aa]">
                    Don&apos;t have an account?{' '}
                    <Link href="/sign-up" className="text-[#00d4ff] font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
