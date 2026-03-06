import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Tv } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

export const metadata: Metadata = {
    title: 'Automated EPG Aggregation and Syncing for IPTV',
    description: 'Ensure your 35,000+ channel IPTV guide is always accurate. Learn how Electronic Program Guides (EPG) use XMLTV standard to populate your live television schedule.',
    alternates: { canonical: `${SITE_URL}/guides/automated-epg-sync` },
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
                <span className="text-white">EPG Aggregation</span>
            </nav>

            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    Automated EPG Aggregation and Syncing
                </h1>
                <p className="text-xl text-[#94A3B8] leading-relaxed">
                    A premium IPTV service is only as good as its TV guide. Understanding how Electronic Program Guide (EPG) data is formatted ensures you never miss a live event due to incorrect scheduling.
                </p>
            </header>

            <div className="space-y-12 text-[#94A3B8] leading-relaxed text-lg">
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Tv className="text-[#8B5CF6] w-8 h-8" />
                        The XMLTV Standard Format
                    </h2>
                    <p className="mb-4">
                        Modern IPTV clients load their 7-day schedules utilizing an <strong>XMLTV format file</strong>. This file contains universally standardized XML tags that map localized broadcast times, show synopses, and channel logos directly to your subscription.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Clock className="text-[#22C55E] w-8 h-8" />
                        Why Does My EPG Keep Failing?
                    </h2>
                    <ul className="list-disc pl-6 space-y-4 mb-6 text-[#CBD5E1]">
                        <li><strong>M3U Static Limits:</strong> If you are importing thousands of channels via an M3U file, you must attach a secondary EPG source URL manually, which often breaks when the provider shifts domains.</li>
                        <li><strong>Timezone Offset Errors:</strong> If a Premier League match states it begins at 3 AM locally, your IPTV Player offset configuration needs to be adjusted in the settings. Most premium panels utilize UTC Server time natively.</li>
                    </ul>
                </section>

                <div className="p-8 rounded-2xl bg-[#161633] border border-white/10 mt-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">The Streamtly Xtream Codes Solution</h3>
                    <p className="mb-6">
                        Streamtly&apos;s API naturally ties the EPG directly to the channel lineup, eliminating the need for manual XMLTV source imports entirely.
                    </p>
                    <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-bold hover:scale-105 transition-all">
                        Upgrade Your Stream <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </article>
    )
}
