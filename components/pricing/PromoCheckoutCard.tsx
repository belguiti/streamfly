'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Check, Lock, Info, CheckCircle2, LogIn, Tag, Loader2, X } from 'lucide-react'
import Link from 'next/link'

interface Plan {
    id: string
    name: string
    price_cents: number
    duration_months: number
    stripe_price_id: string
    paypal_plan_id: string | null
}

interface PromoCheckoutCardProps {
    plan: Plan
    isLoggedIn: boolean
    loginRedirect: string
}

export function PromoCheckoutCard({ plan, isLoggedIn, loginRedirect }: PromoCheckoutCardProps) {
    const [promoInput, setPromoInput] = useState('')
    const [promoLoading, setPromoLoading] = useState(false)
    const [promoError, setPromoError] = useState<string | null>(null)
    const [appliedPromo, setAppliedPromo] = useState<{
        promoId: string
        code: string
        discountPercent: number
    } | null>(null)

    const originalCents = plan.price_cents
    const discountCents = appliedPromo
        ? Math.round((originalCents * appliedPromo.discountPercent) / 100)
        : 0
    const finalCents = originalCents - discountCents
    const priceTotal = (finalCents / 100).toFixed(2)
    const originalTotal = (originalCents / 100).toFixed(2)
    const monthlyPrice = (finalCents / 100 / plan.duration_months).toFixed(2)

    async function applyPromo() {
        const code = promoInput.trim().toUpperCase()
        if (!code) return
        setPromoLoading(true)
        setPromoError(null)
        try {
            const res = await fetch(`/api/promo/validate?code=${encodeURIComponent(code)}`)
            const data = await res.json()
            if (data.valid) {
                setAppliedPromo(data)
                setPromoInput('')
            } else {
                setPromoError(data.error ?? 'Invalid promo code')
            }
        } catch {
            setPromoError('Could not validate promo code. Try again.')
        } finally {
            setPromoLoading(false)
        }
    }

    function removePromo() {
        setAppliedPromo(null)
        setPromoError(null)
    }

    return (
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
                        <span className={`font-medium ${appliedPromo ? 'line-through text-[#555]' : 'text-white'}`}>
                            ${originalTotal}
                        </span>
                    </div>

                    {appliedPromo && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#00e5a0] font-semibold flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" />
                                Promo {appliedPromo.code} (-{appliedPromo.discountPercent}%)
                            </span>
                            <span className="text-[#00e5a0] font-semibold">-${(discountCents / 100).toFixed(2)}</span>
                        </div>
                    )}

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
                            <p className="text-3xl font-black text-white">${priceTotal}</p>
                        </div>
                        {plan.duration_months >= 12 && (
                            <div className="px-3 py-1 rounded-full bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[10px] font-bold text-[#fbbf24] uppercase">
                                Best Deal
                            </div>
                        )}
                    </div>
                </div>

                {/* Promo Code Input */}
                {isLoggedIn && (
                    <div className="space-y-2">
                        {appliedPromo ? (
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[#00e5a0]/10 border border-[#00e5a0]/30">
                                <div className="flex items-center gap-2 text-sm text-[#00e5a0] font-bold">
                                    <Check className="w-4 h-4" />
                                    {appliedPromo.code} applied — {appliedPromo.discountPercent}% off
                                </div>
                                <button
                                    onClick={removePromo}
                                    className="text-[#8899aa] hover:text-white transition-colors"
                                    type="button"
                                    aria-label="Remove promo code"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={promoInput}
                                    onChange={(e) => {
                                        setPromoInput(e.target.value.toUpperCase())
                                        setPromoError(null)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                                    placeholder="Promo code"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-[#555] uppercase text-sm h-11 tracking-widest font-mono"
                                    maxLength={20}
                                />
                                <Button
                                    type="button"
                                    onClick={applyPromo}
                                    disabled={promoLoading || !promoInput.trim()}
                                    className="h-11 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold whitespace-nowrap border border-white/10"
                                    variant="outline"
                                >
                                    {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                </Button>
                            </div>
                        )}
                        {promoError && (
                            <p className="text-xs text-red-400 font-medium">{promoError}</p>
                        )}
                    </div>
                )}

                {/* Payment Options */}
                <div className="space-y-4">
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="w-3.5 h-3.5 text-[#00e5a0]" />
                                <span className="text-xs text-[#8899aa] font-semibold">AES-256 Encrypted Payment</span>
                            </div>

                            {/* Stripe */}
                            <form action="/api/stripe/checkout" method="POST" className="w-full">
                                <input type="hidden" name="priceId" value={plan.stripe_price_id} />
                                <input type="hidden" name="planId" value={plan.id} />
                                {appliedPromo && (
                                    <>
                                        <input type="hidden" name="promoId" value={appliedPromo.promoId} />
                                        <input type="hidden" name="promoCode" value={appliedPromo.code} />
                                        <input type="hidden" name="discountPercent" value={appliedPromo.discountPercent} />
                                    </>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-14 text-base font-black bg-[#635BFF] hover:bg-[#5249E0] text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(99,91,255,0.3)]"
                                >
                                    Pay with Credit Card
                                    {appliedPromo && <span className="ml-2 text-sm opacity-80">(${priceTotal})</span>}
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
                                <form action="/api/paypal/checkout" method="POST" className="w-full">
                                    <input type="hidden" name="planId" value={plan.id} />
                                    {appliedPromo && (
                                        <>
                                            <input type="hidden" name="promoId" value={appliedPromo.promoId} />
                                            <input type="hidden" name="promoCode" value={appliedPromo.code} />
                                            <input type="hidden" name="discountPercent" value={appliedPromo.discountPercent} />
                                        </>
                                    )}
                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-base font-black bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(255,196,57,0.2)]"
                                    >
                                        Pay with PayPal
                                        {appliedPromo && <span className="ml-2 text-sm opacity-70">(${priceTotal})</span>}
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
                                <Link href="/sign-up" className="text-[#00d4ff] hover:underline font-semibold">
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
                        Activation is <strong>instant</strong>. Details will be sent to your email and dashboard immediately after payment.
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-6 bg-white/5 border-t border-white/5 flex flex-col items-center gap-4">
                <div className="flex gap-4 opacity-30 grayscale saturate-0 items-center">
                    <span className="font-extrabold text-white text-xs tracking-tighter">VISA</span>
                    <span className="font-extrabold text-white text-xs tracking-tighter">MASTERCARD</span>
                    <span className="font-extrabold text-white text-xs tracking-tighter">AMEX</span>
                    <span className="font-extrabold text-white text-xs tracking-tighter">PAYPAL</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#555] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-[#00e5a0]" /> Verified Secure Transaction
                </div>
            </CardFooter>
        </Card>
    )
}
