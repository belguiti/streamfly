'use client'

import { useEffect, useRef } from 'react'
import { Eye, Database, Lock, UserCheck, Globe, Bell, Mail } from 'lucide-react'

const sections = [
    {
        icon: Database,
        title: '1. Information We Collect',
        color: '#00d4ff',
        content:
            'We collect your email address for account creation and communication. Payment information is handled securely by our payment processors (Stripe and PayPal) and is never stored on our servers. We may also collect basic usage analytics to improve our service.',
    },
    {
        icon: UserCheck,
        title: '2. How We Use Your Information',
        color: '#00e5a0',
        content:
            'We use your information to provide the service, process payments, deliver activation credentials, send important account updates, and improve your user experience. We will never sell your personal data to third parties.',
    },
    {
        icon: Lock,
        title: '3. Data Protection',
        color: '#a855f7',
        content:
            'We use secure database infrastructure powered by Supabase, including Row Level Security (RLS) to ensure your data is only accessible to you and authorized administrators. All data is encrypted in transit using TLS 1.3 and at rest using AES-256.',
    },
    {
        icon: Globe,
        title: '4. Cookies & Tracking',
        color: '#fbbf24',
        content:
            'We use essential cookies for authentication and session management. We do not use third-party advertising cookies. Analytics cookies are used anonymously to understand how users interact with our platform.',
    },
    {
        icon: Bell,
        title: '5. Data Retention',
        color: '#ff4d6a',
        content:
            'We retain your account information for as long as your account is active. If you delete your account, your personal data will be permanently removed from our systems within 30 days. Transaction records may be kept for up to 7 years for legal compliance.',
    },
    {
        icon: Mail,
        title: '6. Contact Us',
        color: '#00d4ff',
        content:
            'If you have any questions about this Privacy Policy or want to exercise your data rights (access, correction, deletion), please contact us at support@stream4u.com. We respond to all privacy-related inquiries within 48 hours.',
    },
]

export default function PrivacyPolicy() {
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#a855f7]/10 mb-6">
                    <Eye className="w-8 h-8 text-[#a855f7]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Privacy <span className="gradient-text">Policy</span>
                </h1>
                <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                    Your privacy is important to us. Here&apos;s how we handle your personal information.
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
                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#a855f7] transition-colors">
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
            <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-[#a855f7]/5 to-[#00d4ff]/5 border border-white/5">
                <p className="text-[#8899aa] text-sm">
                    Privacy concerns?{' '}
                    <a href="mailto:support@stream4u.com" className="text-[#a855f7] hover:text-[#00d4ff] font-semibold transition-colors">support@stream4u.com →</a>
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
