import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ShieldCheck, RotateCcw, Zap } from 'lucide-react'
import Link from 'next/link'

// We need to disable caching for the pricing page to get the latest plans when changed
export const revalidate = 0

export default async function PricingPage() {
    const supabase = await createClient()
    const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('duration_months')

    if (error) {
        console.error('Error fetching plans:', error)
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Simple, Transparent <span className="gradient-text">Pricing</span>
                </h1>
                <p className="text-lg text-[#8899aa] max-w-2xl mx-auto">
                    Get uninterrupted access to premium licensed streaming content.
                    Choose the plan that fits your lifestyle.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans?.map((plan) => {
                    const isMostPopular = plan.duration_months === 6
                    const isBestValue = plan.duration_months === 12
                    const priceStr = (plan.price_cents / 100).toFixed(2)
                    const perMonth = (plan.price_cents / 100 / plan.duration_months).toFixed(2)

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col bg-[#111827] border-white/5 transition-all duration-300 hover:border-white/10 ${isMostPopular ? 'ring-2 ring-[#00d4ff] shadow-[0_0_30px_rgba(0,212,255,0.2)] scale-105 z-10' : ''
                                } ${isBestValue ? 'border-[#fbbf24]/30 shadow-[0_0_25px_rgba(251,191,36,0.15)]' : ''}`}
                        >
                            {isMostPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00d4ff] text-[#0a0f1a] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            {isBestValue && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fbbf24] text-[#0a0f1a] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                    Best Value
                                </div>
                            )}

                            <CardHeader className="text-center pt-8">
                                <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
                                <CardDescription className="text-[#8899aa]">
                                    Full access for {plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 text-center">
                                <div className="mb-8">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-2xl font-bold text-white content-start pt-1">$</span>
                                        <span className="text-5xl font-extrabold text-white">{priceStr}</span>
                                    </div>
                                    {plan.duration_months > 1 && (
                                        <div className="text-sm text-[#00d4ff] font-medium mt-2">
                                            Just ${perMonth}/mo
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-4 text-left max-w-[200px] mx-auto mb-6">
                                    <li className="flex items-center gap-3 text-sm text-[#8899aa]">
                                        <Check className="h-4 w-4 text-[#00e5a0]" />
                                        <span>4K / FHD Quality</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-[#8899aa]">
                                        <Check className="h-4 w-4 text-[#00e5a0]" />
                                        <span>35,000+ Channels</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-[#8899aa]">
                                        <Check className="h-4 w-4 text-[#00e5a0]" />
                                        <span>Instant Delivery</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-[#8899aa]">
                                        <Check className="h-4 w-4 text-[#00e5a0]" />
                                        <span>24/7 Support</span>
                                    </li>
                                </ul>
                            </CardContent>

                            <CardFooter className="pb-8">
                                <Link href={`/pricing/${plan.id}`} className="w-full">
                                    <Button
                                        className={`w-full py-6 font-bold text-base transition-all active:scale-95 ${isMostPopular
                                            ? 'bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]'
                                            : isBestValue
                                                ? 'bg-[#fbbf24] text-[#0a0f1a] hover:bg-[#f59e0b]'
                                                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                            }`}
                                        variant={isMostPopular ? 'default' : 'outline'}
                                    >
                                        Order Now
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Trust Badges below pricing */}
            <div className="mt-20 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">Secure SSL Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">14-Day Money Back</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">Instant Setup</span>
                </div>
            </div>
        </div>
    )
}
