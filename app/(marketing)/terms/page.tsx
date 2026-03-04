'use client'

import { useEffect, useRef } from 'react'
import { Scale, FileText, Users, CreditCard, Truck, AlertTriangle, Mail } from 'lucide-react'

const sections = [
    {
        icon: FileText,
        title: '1. Service Description',
        color: '#00d4ff',
        content:
            'Stream4U provides a generic subscription and activation-delivery platform for licensed streaming services. We are not responsible for creating or hosting the content itself; we facilitate access via authorized licenses.',
    },
    {
        icon: Users,
        title: '2. User Responsibilities',
        color: '#00e5a0',
        content:
            'You agree not to use the service for any illegal or unauthorized purpose. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
    },
    {
        icon: CreditCard,
        title: '3. Billing & Subscriptions',
        color: '#a855f7',
        content:
            'Payments are processed securely via Stripe or PayPal. Subscriptions are one-time purchases for the selected duration and do not auto-renew. You will receive a confirmation email with your invoice details after purchase.',
    },
    {
        icon: Truck,
        title: '4. Delivery of Service',
        color: '#fbbf24',
        content:
            'After purchase, your activation details will be provided in your dashboard. Our auto-provisioning system will attempt to set up your account automatically. If manual intervention is required, our team will process your order within 24 hours.',
    },
    {
        icon: AlertTriangle,
        title: '5. Limitation of Liability',
        color: '#ff4d6a',
        content:
            'Stream4U shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our service. Our total liability shall not exceed the amount paid by you for the current subscription period.',
    },
    {
        icon: Mail,
        title: '6. Contact & Disputes',
        color: '#00d4ff',
        content:
            'For any questions regarding these Terms, please contact us at support@stream4u.com. We encourage resolving any disputes through direct communication before pursuing formal actions.',
    },
]

export default function TermsOfService() {
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00d4ff]/10 mb-6">
                    <Scale className="w-8 h-8 text-[#00d4ff]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Terms of <span className="gradient-text">Service</span>
                </h1>
                <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                    By using Stream4U, you agree to the following terms and conditions.
                </p>
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#8899aa]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0]"></span>
                    Last updated: February 2026
                </div>
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
                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00d4ff] transition-colors">
                                        {section.title}
                                    </h3>
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
            <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-[#00d4ff]/5 to-[#a855f7]/5 border border-white/5">
                <p className="text-[#8899aa] text-sm">
                    Questions about our terms?{' '}
                    <a href="/contact" className="text-[#00d4ff] hover:text-[#00e5a0] font-semibold transition-colors">Contact our team →</a>
                </p>
            </div>

            {/* Inline styles for animation */}
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
