import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
    title: 'IPTV Setup Guides — Smart TV, Firestick, Android, iOS & More | Streamtly',
    description: 'Free step-by-step IPTV setup guides for every device. Smart TV, Firestick, Android Box, iPhone, iPad, Windows, Mac, MAG, and Enigma2. Get streaming in under 5 minutes.',
    keywords: ['IPTV setup guide', 'how to install IPTV', 'IPTV tutorial', 'IPTV Firestick setup', 'IPTV Smart TV setup', 'IPTV Android setup', 'IPTV iPhone setup', 'MAG IPTV setup'],
    alternates: { canonical: `${SITE_URL}/guides` },
    openGraph: {
        title: 'IPTV Setup Guides — Smart TV, Firestick, Android, iOS & More | Streamtly',
        description: 'Free step-by-step IPTV setup guides for every device. Get streaming in under 5 minutes.',
        url: `${SITE_URL}/guides`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'IPTV Setup Guides — All Devices | Streamtly',
        description: 'Step-by-step IPTV setup for Smart TV, Firestick, Android, iPhone, MAG and more.',
    },
}

const DEVICE_GUIDES = [
    {
        slug: 'smart-tv',
        emoji: '📺',
        title: 'Smart TV',
        subtitle: 'Samsung, LG, Hisense, Sony',
        desc: 'Use IPTV Smarters or Smart IPTV with Xtream Codes.',
        color: '#1428a0',
    },
    {
        slug: 'android',
        emoji: '📦',
        title: 'Android Box & Firestick',
        subtitle: 'Android TV, Firestick, Android Phone',
        desc: 'TiviMate or IPTV Smarters — best experience on Android.',
        color: '#3ddc84',
    },
    {
        slug: 'ios',
        emoji: '🍎',
        title: 'iPhone & iPad',
        subtitle: 'iOS 14 and above',
        desc: 'IPTV Smarters Pro or GSE Smart IPTV from the App Store.',
        color: '#007aff',
    },
    {
        slug: 'windows',
        emoji: '💻',
        title: 'Windows & Mac',
        subtitle: 'Desktop & Laptop',
        desc: 'VLC, IPTV Smarters, or Kodi with PVR add-on.',
        color: '#00d4ff',
    },
    {
        slug: 'mag',
        emoji: '📡',
        title: 'MAG Device',
        subtitle: 'MAG 250 / 254 / 256 / 322 / 420+',
        desc: 'Portal URL setup — no extra app required.',
        color: '#f59e0b',
    },
    {
        slug: 'enigma2',
        emoji: '🛰️',
        title: 'Enigma2 / Satellite',
        subtitle: 'Dreambox, Vu+, Zgemma, Octagon',
        desc: 'E2M3U2Bouquet plugin for bouquets & EPG.',
        color: '#8b5cf6',
    },
]

export default function GuidesPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">

            {/* Header */}
            <div className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Installation <span className="gradient-text">Guides</span>
                </h1>
                <p className="text-lg text-[#8899aa] max-w-xl mx-auto">
                    Get set up in under 5 minutes. Pick your device below for step-by-step instructions.
                </p>
            </div>

            {/* Device grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                {DEVICE_GUIDES.map(device => (
                    <Link
                        key={device.slug}
                        href={`/guides/${device.slug}`}
                        className="group relative p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/15 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col gap-4"
                    >
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ background: `${device.color}15` }}
                        >
                            {device.emoji}
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h2 className="font-bold text-white text-base mb-0.5">{device.title}</h2>
                            <p className="text-xs text-[#555] mb-2">{device.subtitle}</p>
                            <p className="text-sm text-[#8899aa] leading-relaxed">{device.desc}</p>
                        </div>

                        {/* Arrow */}
                        <div
                            className="flex items-center gap-1 text-xs font-bold transition-colors"
                            style={{ color: device.color }}
                        >
                            View Guide
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>

                        {/* Accent bar */}
                        <div
                            className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: device.color }}
                        />
                    </Link>
                ))}
            </div>

            {/* Help CTA */}
            <div className="text-center p-8 rounded-2xl bg-[#111827] border border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">Need Help With Setup?</h3>
                <p className="text-[#8899aa] mb-6">Our 24/7 support team can walk you through installation on any device.</p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    )
}
