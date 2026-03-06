import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldAlert, Lock, Activity } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

export const metadata: Metadata = {
    title: 'Bypass ISP Throttling for IPTV with a VPN',
    description: 'Stop live event buffering caused by Deep Packet Inspection (DPI) from your Internet Service Provider by utilizing Split-Tunneling VPNs.',
    alternates: { canonical: `${SITE_URL}/guides/isp-throttling-vpn` },
}

export default function SubTopicPage() {
    return (
        <article className="container mx-auto px-4 py-24 max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
                <span>/</span>
                <Link href="/guides/iptv-architecture" className="hover:text-white transition-colors">IPTV Architecture</Link>
                <span>/</span>
                <span className="text-white">ISP Throttling & VPN</span>
            </nav>

            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    Mitigating ISP Throttling During Live Events
                </h1>
                <p className="text-xl text-[#94A3B8] leading-relaxed">
                    If your IPTV connection degrades strictly during high-profile PPV events or Sunday NFL broadcasts, you are almost certainly experiencing aggressive ISP-level traffic shaping.
                </p>
            </header>

            <div className="space-y-12 text-[#94A3B8] leading-relaxed text-lg">
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Activity className="text-[#EF4444] w-8 h-8" />
                        How Deep Packet Inspection Ruins IPTV
                    </h2>
                    <p className="mb-4">
                        Major ISPs (Comcast, AT&T, Virgin Media) utilize Deep Packet Inspection (DPI) to analyze the *type* of data flowing through their nodes. During high-traffic events, if their algorithms detect sustained UDP video traffic originating from non-approved IPTV servers, they actively throttle the connection bandwidth below the threshold required for HD streaming.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Lock className="text-[#22C55E] w-8 h-8" />
                        The Fix: Split-Tunneling VPN
                    </h2>
                    <p className="mb-4">
                        A VPN (Virtual Private Network) encapsulates your traffic inside an encrypted AES-256 tunnel. When you use a VPN, the ISP&apos;s DPI systems can no longer see that the data packets are streaming video; they only see encrypted gibberish traveling to the VPN server. Because they cannot identify the payload, they cannot apply their targeted throttling rules.
                    </p>
                    <p className="mb-4 text-[#CBD5E1]">
                        <strong>Why Split-Tunneling?</strong> Running an entire home network through a VPN router can drastically increase overall latency. Split-tunneling allows you to install the VPN directly on your streaming client (e.g., Surfshark/NordVPN app on the Firestick) so that *only* the IPTV stream is encrypted, leaving the rest of your home internet uncompromised.
                    </p>
                </section>

                <div className="p-8 rounded-2xl bg-[#161633] border border-white/10 mt-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Streamtly is VPN-Friendly by Default</h3>
                    <p className="mb-6">
                        Streamtly never blocks commercial IP addresses or data centers. We fully encourage the use of secure VPNs to ensure maximum connectivity and privacy.
                    </p>
                    <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-bold hover:scale-105 transition-all">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </article>
    )
}
