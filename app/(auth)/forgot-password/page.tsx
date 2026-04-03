'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        setIsLoading(false)
        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }
    }

    return (
        <div className="min-h-screen bg-[#080818] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#111827] border-white/10 shadow-2xl">
                <CardHeader className="pb-2 px-8 pt-8">
                    <CardTitle className="text-2xl font-black text-white">
                        Reset your password
                    </CardTitle>
                    <CardDescription className="text-[#8899aa]">
                        Enter your email and we'll send you a reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-4">
                    {sent ? (
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                            <p className="text-white font-semibold">Check your inbox!</p>
                            <p className="text-sm text-[#8899aa]">
                                We sent a reset link to <strong className="text-white">{email}</strong>.
                                Check your spam folder if you don't see it.
                            </p>
                            <Link href="/sign-in" className="text-sm text-[#00d4ff] hover:underline mt-2">
                                ← Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="bg-white/5 border-white/10 text-white pl-10 focus:ring-[#00d4ff] focus:border-[#00d4ff] h-12"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-red-400 font-medium">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] font-bold text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
                            </Button>

                            <Link href="/sign-in" className="flex items-center justify-center gap-1 text-sm text-[#8899aa] hover:text-white mt-2">
                                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                            </Link>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
