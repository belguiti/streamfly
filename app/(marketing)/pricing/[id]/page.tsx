import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ShieldCheck, Zap, Headphones, Globe, ArrowLeft, Star, Lock, Info, CheckCircle2, LogIn } from 'lucide-react'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stream4u.com'

interface PageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data: plan } = await supabase
        .from('plans')
        .select('name, price_cents, duration_months')
        .eq('id', id)
        .single()

    if (!plan) return { title: 'Plan Not Found' }

    const price = (plan.price_cents / 100).toFixed(2)
    const monthly = (plan.price_cents / 100 / plan.duration_months).toFixed(2)
    const title = `${plan.name} – $${price} for ${plan.duration_months} Month${plan.duration_months !== 1 ? 's' : ''}`
    const description = `Get the Stream4U ${plan.name} IPTV subscription for $${price} (just $${monthly}/month). Access 35,000+ live channels, 150,000+ movies & series, and all PPV events for ${plan.duration_months} month${plan.duration_months !== 1 ? 's' : ''}. Instant activation, 14-day money-back guarantee.`

    return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}/pricing/${id}` },
        openGraph: {
            title: `${title} | Stream4U`,
            description,
            url: `${SITE_URL}/pricing/${id}`,
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: `${title} | Stream4U`,
            description,
        },
    }
}

export default async function PlanDetailsPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const [{ data: plan, error }, { data: { user } }] = await Promise.all([
        supabase.from('plans').select('*').eq('id', id).single(),
        supabase.auth.getUser(),
    ])

    if (error || !plan) {
        notFound()
    }

    const isLoggedIn = !!user
    const loginRedirect = `/sign-in?next=/pricing/${id}`

    const priceTotal = (plan.price_cents / 100).toFixed(2)
    const monthlyPrice = (plan.price_cents / 100 / plan.duration_months).toFixed(2)

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            {/* Back Link */}
            <Link
                href="/pricing"
                className="inline-flex items-center text-sm text-[#8899aa] hover:text-[#00d4ff] mb-10 transition-colors group"
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Pricing
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left Column: Plan Details (7 cols) */}
                <div className="lg:col-span-7 space-y-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-xs font-bold text-[#00d4ff] mb-4 uppercase tracking-wider">
                            Premium Plan selected
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                            {plan.name} <span className="gradient-text">Subscription</span>
                        </h1>
                        <p className="text-lg text-[#8899aa] max-w-xl">
                            You&apos;re one step away from unlocking premium access to 35,000+ channels and 150,000+ movies.
                        </p>
                    </div>

                    {/* Value Props Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            {
                                icon: Globe,
                                title: 'Global Access',
                                desc: 'Stream from anywhere in the world on any device.',
                                color: '#00d4ff',
                            },
                            {
                                icon: Zap,
                                title: 'Instant Activation',
                                desc: 'Codes delivered instantly to your dashboard.',
                                color: '#00e5a0',
                            },
                            {
                                icon: Headphones,
                                title: '24/7 Expert Support',
                                desc: 'Our team is here to help you around the clock.',
                                color: '#a855f7',
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Money-Back Guarantee',
                                desc: 'Not satisfied? Get a full refund within 14 days.',
                                color: '#fbbf24',
                            },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ background: `${item.color}15` }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-xs text-[#8899aa] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Signals */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] to-[#0a0f1a] border border-white/5">
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111827] bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-white font-semibold">Over 50,000 Satisfied Users</p>
                                </div>
                            </div>
                            <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-[10px] text-[#8899aa] uppercase font-bold mb-1 tracking-widest">Satisfaction Score</p>
                                <p className="text-2xl font-black text-[#00e5a0]">99.8%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Card (5 cols) */}
                <div className="lg:col-span-5 w-full">
                    <Card className="bg-[#111827] border-white/10 shadow-2xl sticky top-24 overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/5">
                            <h2 className="text-xl font-bold text-white mb-1">Secure Checkout</h2>
                            <p className="text-xs text-[#8899aa]">Review your order and select payment method</p>
                        </div>

                        <CardContent className="p-6 space-y-6">
                            {/* Summary Table */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#8899aa]">{plan.name} ({plan.duration_months} Months)</span>
                                    <span className="text-white font-medium">${priceTotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#8899aa]">Platform License Fee</span>
                                    <span className="text-[#00e5a0] font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#8899aa]">Monthly Average</span>
                                    <span className="text-[#8899aa] font-medium">${monthlyPrice}/mo</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-[#8899aa] font-medium uppercase tracking-widest">Total to Pay</p>
                                        <p className="text-3xl font-black text-white">$ {priceTotal}</p>
                                    </div>
                                    {plan.duration_months >= 12 && (
                                        <div className="px-3 py-1 rounded-full bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[10px] font-bold text-[#fbbf24] uppercase">
                                            Best Deal
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="space-y-4">
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lock className="w-3.5 h-3.5 text-[#00e5a0]" />
                                            <span className="text-xs text-[#8899aa] font-semibold">AES-256 Encrypted Payment</span>
                                        </div>

                                        {/* Stripe */}
                                        <form action={`/api/stripe/checkout`} method="POST" className="w-full">
                                            <input type="hidden" name="priceId" value={plan.stripe_price_id} />
                                            <Button
                                                type="submit"
                                                className="w-full h-14 text-base font-black bg-[#635BFF] hover:bg-[#5249E0] text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(99,91,255,0.3)]"
                                            >
                                                Pay with Credit Card
                                            </Button>
                                            <p className="text-[10px] text-center text-[#555] mt-2">Cards, Apple Pay, Google Pay</p>
                                        </form>

                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-white/5" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                                <span className="bg-[#111827] px-3 text-[#555]">Secure Gateway</span>
                                            </div>
                                        </div>

                                        {/* PayPal */}
                                        {plan.paypal_plan_id && (
                                            <form action={`/api/paypal/checkout`} method="POST" className="w-full">
                                                <input type="hidden" name="planId" value={plan.id} />
                                                <Button
                                                    type="submit"
                                                    className="w-full h-14 text-base font-black bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(255,196,57,0.2)]"
                                                >
                                                    Pay with PayPal
                                                </Button>
                                            </form>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <Link href={loginRedirect} className="block w-full">
                                            <Button className="w-full h-14 text-base font-black bg-[#00d4ff] hover:bg-[#00bbff] text-[#0a0f1a] transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(0,212,255,0.3)] gap-2">
                                                <LogIn className="w-5 h-5" />
                                                Log In to Purchase
                                            </Button>
                                        </Link>
                                        <p className="text-[11px] text-center text-[#555]">
                                            Don&apos;t have an account?{' '}
                                            <Link href={`/sign-up`} className="text-[#00d4ff] hover:underline font-semibold">
                                                Sign up free
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Order Info */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3">
                                <Info className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-[#8899aa] leading-relaxed">
                                    Activation is <strong>instant</strong>. Details will be sent to your email and dashbaord immediately after payment.
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="p-6 bg-white/5 border-t border-white/5 flex flex-col items-center gap-4">
                            <div className="flex gap-4 opacity-30 grayscale saturate-0 items-center">
                                <span className="font-extrabold text-white text-xs tracking-tighter">VISA</span>
                                <span className="font-extrabold text-white text-xs tracking-tighter">MASTERCARD</span>
                                <span className="font-extrabold text-white text-xs tracking-tighter">AMEX</span>
                                <span className="font-extrabold text-white text-xs tracking-tighter">BITCOIN</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[#555] font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-[#00e5a0]" /> Verified Secure Transaction
                            </div>
                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
    )
}
