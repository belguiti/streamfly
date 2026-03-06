import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Tv, Shield, Zap } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

// ─── SEO Metadata 2026 ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: 'Advanced IPTV Setup & Network Optimization Guide 2026',
    description: 'IPTV streams broadcast television over IP networks. Learn how to configure your router, eliminate buffering, and optimize streaming tech with our 2026 strategies.',
    alternates: { canonical: `${SITE_URL}/guides/iptv-architecture` },
}

export default function PillarPage() {
    return (
        <article className="container mx-auto px-4 py-24 max-w-4xl">
            {/* Breadcrumbs for SEO */}
            <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
                <span>/</span>
                <span className="text-white">IPTV Architecture 2026</span>
            </nav>

            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4338CA]/10 border border-[#4338CA]/20 text-xs font-bold text-[#4338CA] mb-6 uppercase tracking-wider">
                    Technical Guide
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    Advanced IPTV Setup &amp; Network Optimization Guide 2026
                </h1>

                {/* ── ATOMIC ANSWER (AI Extraction Block For SGE/Gemini) ── */}
                <div
                    className="p-6 rounded-2xl bg-[#161633] border border-[#22C55E]/20 relative overflow-hidden"
                    itemScope
                    itemType="https://schema.org/DefinedTerm"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#22C55E]" aria-hidden="true" />
                    <strong className="text-white block mb-2 font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#22C55E]" />
                        What is IPTV streaming architecture?
                    </strong>
                    <p className="text-[# CBD5E1] text-lg leading-relaxed" itemProp="description">
                        IPTV (Internet Protocol Television) streams broadcast television formats over broadband IP networks. Unlike traditional RF signals, IPTV utilizes M3U playlists or Xtream Codes APIs through client applications to decode live video packets, requiring a minimum stable bandwidth of 25 Mbps for 4K streaming.
                    </p>
                </div>
            </header>

            <div className="space-y-12 text-[#94A3B8] leading-relaxed text-lg">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Core Architecture: Xtream Codes vs M3U</h2>
                    <p className="mb-4">
                        Understanding the delivery mechanism of your stream is critical. While traditional <strong>M3U playlists</strong> are static files requiring manual updating, the <strong>Xtream Codes API</strong> dynamically authenticates and fetches the latest channel payload directly from the provider&apos;s server cluster.
                    </p>
                    <Link href="/guides/xtream-vs-m3u" className="text-[#4338CA] font-medium hover:underline inline-flex items-center gap-1">
                        Deep dive into decoding Xtream Codes API vs local M3U <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Eliminating Buffer Bloat & Router QoS</h2>
                    <p className="mb-4">
                        If you experience buffering exactly when a major PPV event begins, the issue is often local network congestion (Buffer Bloat) rather than server load. Configuring <strong>Quality of Service (QoS)</strong> on your home router to prioritize MPEG-TS or HLS traffic over standard HTTP processing is the single most effective optimization you can make.
                    </p>
                    <ul className="space-y-3 mb-6 bg-white/5 p-6 rounded-xl border border-white/10">
                        <li className="flex gap-3"><CheckCircle2 className="w-6 h-6 text-[#22C55E] flex-shrink-0" /> Assign highest priority (Real-Time) to the MAC address of your streaming device.</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-6 h-6 text-[#22C55E] flex-shrink-0" /> Disable SIP ALG on your router which often corrupts streaming video packets.</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-6 h-6 text-[#22C55E] flex-shrink-0" /> Hardwire your device via Ethernet whenever possible (Cat6 recommended).</li>
                    </ul>
                    <Link href="/guides/qos-router-setup" className="text-[#4338CA] font-medium hover:underline inline-flex items-center gap-1">
                        Read exactly how to configure QoS for IPTV <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Mitigating ISP Throttling</h2>
                    <p className="mb-4">
                        Many major ISPs deploy deep packet inspection (DPI) during high-profile live events (e.g., Sunday NFL) and artificially throttle unknown UDP/TCP video streams. To bypass this, implementing a Split-Tunneling VPN on the device level ensures the video traffic is encrypted and bypasses traffic shaping rules without slowing down the rest of your home network.
                    </p>
                    <Link href="/guides/isp-throttling-vpn" className="text-[#4338CA] font-medium hover:underline inline-flex items-center gap-1">
                        Guide: Bypassing ISP throttling during live events <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>

                {/* Author BIO block to establish E-E-A-T */}
                <div className="mt-16 p-8 rounded-2xl bg-[#0F0F23] border border-[#4338CA]/20 flex flex-col md:flex-row gap-6 items-center md:items-start" itemScope itemType="https://schema.org/Person">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4338CA] to-[#8B5CF6] flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                        SS
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xl mb-1" itemProp="name">Streamtly Solutions Team</h4>
                        <p className="text-[#8B5CF6] font-medium text-sm mb-3" itemProp="jobTitle">Network Engineers & Streaming Architects</p>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            With over a decade of experience in content delivery networks and high-bandwidth load balancing, the Streamtly team configures enterprise-grade streaming infrastructure ensuring zero latency for over 50,000 global users.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    )
}
