'use client'

import { useEffect, useRef } from 'react'
import { RotateCcw, Clock, CheckCircle, AlertCircle, CreditCard, MessageSquare, Mail } from 'lucide-react'

const sections = [
    {
        icon: Clock,
        title: 'Before Activation',
        color: '#00e5a0',
        badge: 'Full Refund',
        badgeColor: '#00e5a0',
        content:
            'If your subscription has not yet been activated, you are eligible for a full refund within 24 hours of purchase. We process these requests quickly and without any hassle. Simply contact our support team with your Invoice ID.',
    },
    {
        icon: AlertCircle,
        title: 'After Activation',
        color: '#fbbf24',
        badge: 'Case by Case',
        badgeColor: '#fbbf24',
        content:
            'Refunds are not guaranteed once your subscription has been activated and the service details have been delivered. However, a partial refund or credit may be possible if there is a verified technical issue that our support team cannot resolve within a reasonable timeframe.',
    },
    {
        icon: CreditCard,
        title: 'Duplicate Payments',
        color: '#00d4ff',
        badge: 'Full Refund',
        badgeColor: '#00e5a0',
        content:
            'If you are charged twice for the same subscription period, the duplicate payment will be refunded in full after verification. This process typically takes 3-5 business days to reflect in your account.',
    },
    {
        icon: MessageSquare,
        title: 'Chargebacks & Disputes',
        color: '#ff4d6a',
        badge: 'Important',
        badgeColor: '#ff4d6a',
        content:
            'We strongly encourage you to contact support before initiating a chargeback with your bank or credit card company. Most issues can be resolved quickly by our team. Unjustified chargebacks may result in immediate termination of your service and a permanent ban from the platform.',
    },
    {
        icon: Mail,
        title: 'How to Request a Refund',
        color: '#a855f7',
        badge: 'Easy Process',
        badgeColor: '#a855f7',
        content:
            'To request a refund, please send an email to support@stream4u.com with your Invoice ID, account email, and the reason for the request. Our team will review your case and respond within 12 hours.',
    },
]

export default function RefundPolicy() {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in')
                    }
                })
            },
            { threshold: 0.15 }
        )

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00e5a0]/10 mb-6">
                    <RotateCcw className="w-8 h-8 text-[#00e5a0]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Refund <span className="gradient-text">Policy</span>
                </h1>
                <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                    We want you to be fully satisfied. Here&apos;s our transparent refund policy.
                </p>
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#8899aa]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0]"></span>
                    Last updated: February 2026
                </div>
            </div>

            {/* Money-Back Guarantee Banner */}
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-[#00e5a0]/10 to-[#00d4ff]/10 border border-[#00e5a0]/20 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-[#00e5a0]" />
                    <h2 className="text-xl font-bold text-white">14-Day Money-Back Guarantee</h2>
                </div>
                <p className="text-sm text-[#8899aa]">
                    Not satisfied within the first 14 days? Contact us for a hassle-free full refund — no questions asked.
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {sections.map((section, i) => (
                    <div
                        key={section.title}
                        ref={(el) => { sectionRefs.current[i] = el }}
                        className="legal-section opacity-0 translate-y-6 transition-all duration-700 ease-out"
                        style={{ transitionDelay: `${i * 80}ms` }}
                    >
                        <div className="group p-6 md:p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `${section.color}15` }}
                                >
                                    <section.icon className="w-5 h-5" style={{ color: section.color }} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#00e5a0] transition-colors">
                                            {section.title}
                                        </h3>
                                        <span
                                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                            style={{
                                                background: `${section.badgeColor}15`,
                                                color: section.badgeColor,
                                                border: `1px solid ${section.badgeColor}30`,
                                            }}
                                        >
                                            {section.badge}
                                        </span>
                                    </div>
                                    <p className="text-[#8899aa] leading-relaxed text-sm md:text-base">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Contact CTA */}
            <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-[#00e5a0]/5 to-[#00d4ff]/5 border border-white/5">
                <p className="text-[#8899aa] text-sm">
                    Need a refund?{' '}
                    <a href="mailto:support@stream4u.com" className="text-[#00e5a0] hover:text-[#00d4ff] font-semibold transition-colors">support@stream4u.com →</a>
                </p>
            </div>

            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .legal-section.animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `}</style>
        </div>
    )
}
