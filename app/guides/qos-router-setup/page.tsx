import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Wifi, ShieldCheckText, Settings } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

export const metadata: Metadata = {
    title: 'Router QoS Configuration for IPTV: Eliminate Buffer Bloat',
    description: 'Learn how to configure Quality of Service (QoS) on your Asus, Netgear, or TP-Link router to prioritize IPTV packet streaming and eliminate buffer bloat during live events.',
    alternates: { canonical: `${SITE_URL}/guides/qos-router-setup` },
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
                <span className="text-white">Router QoS</span>
            </nav>

            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    Router QoS Setup: Prioritizing IPTV Traffic
                </h1>
                <p className="text-xl text-[#94A3B8] leading-relaxed">
                    If your IPTV stream buffers perfectly while navigating menus but lags exactly when the UFC fight starts, you likely have "Buffer Bloat"—local network congestion stopping live video packets.
                </p>
            </header>

            <div className="space-y-12 text-[#94A3B8] leading-relaxed text-lg">
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Wifi className="text-[#F59E0B] w-8 h-8" />
                        What is Quality of Service (QoS)?
                    </h2>
                    <p className="mb-4">
                        Without QoS, a router treats all internet traffic equally. If a roommate starts a 50GB Steam game download, your router blindly processes those large TCP packets and chokes out the small, real-time UDP packets your IPTV needs to stream live video, causing immediate buffering.
                    </p>
                    <p className="mb-4">
                        By enabling QoS, you instruct the router to guarantee bandwidth and processing priority specifically to the MAC address of your Amazon Firestick, Nvidia Shield, or Apple TV.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Settings className="text-[#8B5CF6] w-8 h-8" />
                        Step-by-step QoS Configuration
                    </h2>
                    <ol className="list-decimal pl-6 space-y-4 mb-6 text-[#CBD5E1]">
                        <li>
                            <strong className="text-white">Find your device MAC Address:</strong> On your streaming device, navigate to Settings {'->'} Network {'->'} Status and note the 12-character MAC Address (e.g., A1:B2:C3:D4:E5:F6).
                        </li>
                        <li>
                            <strong className="text-white">Log into the Router Admin Panel:</strong> Open a browser and type `192.168.1.1` or `192.168.0.1`.
                        </li>
                        <li>
                            <strong className="text-white">Locate the QoS Settings:</strong> This is typically under &apos;Advanced Networking&apos; or &apos;Gaming QoS&apos;.
                        </li>
                        <li>
                            <strong className="text-white">Create a New Priority Rule:</strong> Enter the MAC address of your streaming device and assign it the highest priority available (usually &apos;Highest&apos; or &apos;Real-Time Streaming&apos;).
                        </li>
                        <li>
                            <strong className="text-white">Disable SIP ALG:</strong> In advanced WAN settings, disable SIP ALG. This protocol interferes with sustained HLS and MPEG-TS connections.
                        </li>
                    </ol>
                </section>

                <div className="p-8 rounded-2xl bg-[#161633] border border-white/10 mt-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Streamtly Infrastructure Guarantees Delivery</h3>
                    <p className="mb-6">
                        Once your local QoS is configured, Streamtly&apos;s server-side load balancers guarantee a completely buffer-free 4K stream.
                    </p>
                    <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-bold hover:scale-105 transition-all">
                        Upgrade Your Stream <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </article>
    )
}
