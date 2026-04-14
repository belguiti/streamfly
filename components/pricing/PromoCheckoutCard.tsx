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
    isRenewal?: boolean
}

const DEVICES = [
    { id: 'smart_tv', label: 'Smart TV', icon: '📺' },
    { id: 'android_box', label: 'Android Box', icon: '📦' },
    { id: 'android_phone', label: 'Android Phone', icon: '📱' },
    { id: 'iphone_ipad', label: 'iPhone / iPad', icon: '🍎' },
    { id: 'windows_mac', label: 'Windows / Mac', icon: '💻' },
    { id: 'mag_device', label: 'MAG Device', icon: '📡' },
    { id: 'enigma2', label: 'Enigma2 / Sat', icon: '🛰️' },
    { id: 'other', label: 'Other', icon: '🔌' },
]

const PACKAGES = [
    { id: '65410', label: 'USA + Sport', flag: '🇺🇸', desc: 'USA channels with all sports & PPV' },
    { id: '65507', label: 'USA / Canada', flag: '🇨🇦', desc: 'US & Canadian channels' },
    { id: '65435', label: 'Morocco', flag: '🇲🇦', desc: 'Moroccan & Arabic channels' },
    { id: '65504', label: 'France', flag: '🇫🇷', desc: 'French channels & TNT' },
    { id: '65505', label: 'Germany', flag: '🇩🇪', desc: 'German channels & Bundesliga' },
    { id: '65506', label: 'Portugal', flag: '🇵🇹', desc: 'Portuguese & Brazilian channels' },
    { id: '65508', label: 'Spain', flag: '🇪🇸', desc: 'Spanish channels & La Liga' },
]

export function PromoCheckoutCard({ plan, isLoggedIn, loginRedirect, isRenewal = false }: PromoCheckoutCardProps) {
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
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

                {/* Step 1 — Device Selection */}
                {isLoggedIn && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">Step 1 — Select your device</p>
                        <div className="grid grid-cols-4 gap-2">
                            {DEVICES.map(d => (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => setSelectedDevice(d.id)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                                        selectedDevice === d.id
                                            ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-white'
                                            : 'border-white/10 bg-white/5 text-[#8899aa] hover:border-white/30'
                                    }`}
                                >
                                    <span className="text-lg">{d.icon}</span>
                                    <span className="text-[9px] font-semibold leading-tight">{d.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2 — Package Selection */}
                {isLoggedIn && selectedDevice && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-[#8899aa] uppercase tracking-wider">Step 2 — Choose your channel package</p>
                        <div className="space-y-2">
                            {PACKAGES.map(pkg => (
                                <button
                                    key={pkg.id}
                                    type="button"
                                    onClick={() => setSelectedPackage(pkg.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                        selectedPackage === pkg.id
                                            ? 'border-[#a855f7] bg-[#a855f7]/10 text-white'
                                            : 'border-white/10 bg-white/5 text-[#8899aa] hover:border-white/25 hover:text-white'
                                    }`}
                                >
                                    <span className="text-xl flex-shrink-0">{pkg.flag}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm leading-tight">{pkg.label}</p>
                                        <p className="text-[10px] text-[#555] leading-tight mt-0.5">{pkg.desc}</p>
                                    </div>
                                    {selectedPackage === pkg.id && (
                                        <Check className="w-4 h-4 text-[#a855f7] flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-[#8899aa] leading-relaxed pt-1">
                            💬 Don&apos;t see your country? You can request any other channel package after subscribing by contacting our support team via{' '}
                            <a href="mailto:support@streamtly.com" className="text-[#00d4ff] hover:underline font-semibold">email</a>
                            {' '}or{' '}
                            <a href="https://wa.me/447520695452" className="text-[#25D366] hover:underline font-semibold">WhatsApp</a>
                            {' '}— we&apos;ll switch it for free.
                        </p>
                    </div>
                )}

                {/* Payment Options */}
                <div className="space-y-4">
                    {isLoggedIn ? (
                        <>
                            {selectedDevice && selectedPackage && (
                            <>
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="w-3.5 h-3.5 text-[#00e5a0]" />
                                <span className="text-xs text-[#8899aa] font-semibold">Step 3 — AES-256 Encrypted Payment</span>
                            </div>

                            {/* Stripe Card */}
                            <form action="/api/stripe/checkout" method="POST" className="w-full">
                                <input type="hidden" name="priceId" value={plan.stripe_price_id} />
                                <input type="hidden" name="deviceType" value={selectedDevice ?? ''} />
                                <input type="hidden" name="packageId" value={selectedPackage ?? ''} />
                                {appliedPromo && (
                                    <>
                                        <input type="hidden" name="promoId" value={appliedPromo.promoId} />
                                        <input type="hidden" name="discountPercent" value={appliedPromo.discountPercent} />
                                    </>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-14 text-base font-black text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                                >
                                    Pay ${priceTotal} with Card
                                </Button>
                            </form>

                            {/* PayPal */}
                            {plan.paypal_plan_id && (
                                <form action="/api/paypal/checkout" method="POST" className="w-full">
                                    <input type="hidden" name="planId" value={plan.id} />
                                    <input type="hidden" name="deviceType" value={selectedDevice ?? ''} />
                                    <input type="hidden" name="packageId" value={selectedPackage ?? ''} />
                                    <input type="hidden" name="isRenewal" value={String(isRenewal)} />
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

                            {/* Crypto — NOWPayments */}
                            <form action="/api/nowpayments/checkout" method="POST" className="w-full">
                                <input type="hidden" name="planId" value={plan.id} />
                                <input type="hidden" name="deviceType" value={selectedDevice ?? ''} />
                                <input type="hidden" name="packageId" value={selectedPackage ?? ''} />
                                <input type="hidden" name="isRenewal" value={String(isRenewal)} />
                                {appliedPromo && (
                                    <input type="hidden" name="discountPercent" value={appliedPromo.discountPercent} />
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-14 text-base font-black bg-[#1a1a2e] hover:bg-[#16213e] text-white border border-[#f7931a]/40 hover:border-[#f7931a]/80 transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_4px_20px_rgba(247,147,26,0.15)]"
                                >
                                    <span className="mr-2 text-lg">₿</span>
                                    Pay with Crypto
                                    {appliedPromo && <span className="ml-2 text-sm opacity-70">(${priceTotal})</span>}
                                </Button>
                                <p className="text-[10px] text-center text-[#555] mt-2">BTC, ETH, USDT, LTC & 100+ coins</p>
                            </form>
                            </>
                            )}
                            {selectedDevice && !selectedPackage && (
                                <p className="text-xs text-center text-[#8899aa] py-2">
                                    ↑ Choose your channel package above to continue
                                </p>
                            )}
                            {!selectedDevice && (
                                <p className="text-xs text-center text-[#8899aa] py-2">
                                    ↑ Select your device above to continue
                                </p>
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
                                <Link href={`/sign-up?next=/pricing/${plan.id}`} className="text-[#00d4ff] hover:underline font-semibold">
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
