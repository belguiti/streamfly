import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
    Zap, Shield, Headphones, Globe, Star, Tv, Monitor, Smartphone,
    Award, Server, RefreshCw, CheckCircle2, ArrowRight, Play, Clock,
} from 'lucide-react'
import FAQAccordion from '@/components/marketing/FAQAccordion'

// ─── ISR: revalidate every hour ───────────────────────────────────────────────
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: 'Streamtly | Premium IPTV – 35,000+ Live Channels & 150,000+ VODs',
    description:
        'Streamtly is the #1 premium IPTV service with 35,000+ live channels, 150,000+ movies & series, and every PPV event in 4K quality. Instant activation. 24/7 support. 14-day money-back guarantee.',
    keywords: [
        'IPTV service', 'best IPTV', 'premium IPTV', 'live TV streaming',
        '4K IPTV', 'IPTV subscription', 'IPTV Firestick', 'IPTV Android TV',
        'IPTV Smart TV', 'watch live TV online', 'IPTV channels', 'VOD streaming',
        'buy IPTV', 'IPTV provider', 'streaming subscription', 'PPV IPTV 2025',
    ],
    authors: [{ name: 'Streamtly', url: SITE_URL }],
    creator: 'Streamtly',
    publisher: 'Streamtly',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: 'Streamtly',
        title: 'Streamtly | Premium IPTV – 35,000+ Live Channels & 150,000+ VODs',
        description:
            'Streamtly delivers 35,000+ live TV channels, 150,000+ movies and series, and every PPV event in stunning 4K quality. Instant activation. 14-day money-back guarantee.',
        images: [{
            url: `${SITE_URL}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: 'Streamtly Premium IPTV Service – 35,000+ Channels in 4K',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Streamtly | Premium IPTV – 35,000+ Live Channels & 150,000+ VODs',
        description:
            'Streamtly delivers 35,000+ live TV channels, 150,000+ movies and series, and every PPV event in stunning 4K quality.',
        images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: { canonical: SITE_URL },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'entertainment',
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Streamtly',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    description: 'Premium IPTV service with 35,000+ live channels and 150,000+ VODs in 4K quality.',
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        url: `${SITE_URL}/contact`,
        availabilityStarts: '00:00',
        availabilityEnds: '23:59',
        hoursAvailable: 'Mo,Tu,We,Th,Fr,Sa,Su',
    },
}

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Streamtly',
    url: SITE_URL,
    potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
}

const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Streamtly IPTV Streaming Service',
    description:
        'Premium IPTV streaming service with 35,000+ live channels, 150,000+ movies & series, and all PPV events. Compatible with Firestick, Android TV, Smart TV, iOS, Android, PC.',
    provider: { '@type': 'Organization', name: 'Streamtly', url: SITE_URL },
    areaServed: 'Worldwide',
    url: `${SITE_URL}/pricing`,
    offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '19.99',
        highPrice: '89.99',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '50000',
        bestRating: '5',
        worstRating: '1',
    },
}

const faqItems = [
    {
        q: 'What is IPTV and how does Streamtly work?',
        a: 'IPTV (Internet Protocol Television) delivers live TV channels and on-demand video content over the internet. With Streamtly, you subscribe to a plan, receive your activation details instantly, and start streaming 35,000+ channels and 150,000+ VODs on any compatible device — no satellite dish or cable box required.',
    },
    {
        q: 'Which devices are compatible with Streamtly?',
        a: 'Streamtly supports Amazon Firestick & Fire TV, Android TV & Google TV, Samsung & LG Smart TVs, iPhones & iPads, Android smartphones & tablets, Windows PC, Mac, MAG boxes, and Nvidia Shield. Visit our Installation Guides for step-by-step setup instructions for each device.',
    },
    {
        q: 'How long does activation take after payment?',
        a: 'Activation is instant. As soon as your payment is confirmed, your subscription credentials and setup instructions are delivered automatically to your email and dashboard. Most users start streaming within 5 minutes of signing up.',
    },
    {
        q: 'Do I need a VPN to use Streamtly?',
        a: 'No. A VPN is not required. Our servers use advanced encryption and security protocols that keep your connection private and secure. You may optionally use a VPN for additional privacy, but Streamtly works flawlessly without one.',
    },
    {
        q: 'What video quality can I expect?',
        a: 'Streamtly streams in 4K Ultra HD, Full HD (1080p), and HD (720p) depending on your internet connection and channel source. Our adaptive bitrate technology automatically adjusts quality to ensure smooth, buffer-free playback on any connection speed.',
    },
    {
        q: 'Are sports and PPV events included in the subscription?',
        a: "Yes! Every Streamtly subscription includes access to all major live sports events — NFL, NBA, Premier League, Champions League, UFC, and Boxing — plus all Pay-Per-View (PPV) events at no extra cost. You'll never pay separately for a PPV fight again.",
    },
    {
        q: 'What is the refund policy?',
        a: "We offer a 14-day full money-back guarantee on all plans. If you're not completely satisfied within the first 14 days, contact our support team and we'll issue a prompt, no-questions-asked refund.",
    },
    {
        q: 'How many devices can I stream on simultaneously?',
        a: 'Standard plans include one simultaneous connection, allowing streaming on one device at a time. Multi-connection plans allow two or more devices to stream simultaneously. You can always upgrade your plan for additional connections.',
    },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
    })),
}

// ─── Static Content ───────────────────────────────────────────────────────────
const STATS = [
    { value: '35,000+', label: 'Live Channels', color: '#00d4ff' },
    { value: '150,000+', label: 'Movies & Series', color: '#00e5a0' },
    { value: '50,000+', label: 'Happy Customers', color: '#a855f7' },
    { value: '99.9%', label: 'Uptime Guaranteed', color: '#fbbf24' },
    { value: '4.9★', label: 'Average Rating', color: '#fbbf24' },
]

const FEATURES = [
    { icon: Tv, title: '35,000+ Live Channels', desc: 'Local, national, and international channels from 100+ countries in every language and genre — sports, news, entertainment, kids, and more.', color: '#00d4ff' },
    { icon: Play, title: '150,000+ VOD Library', desc: 'New theatrical releases, award-winning series, classic films, and documentaries — all on demand, zero ads, instant playback.', color: '#00e5a0' },
    { icon: Award, title: 'All PPV Events Included', desc: 'UFC, boxing, NFL, NBA, Premier League, Formula 1 — every Pay-Per-View event is included in every plan at absolutely no extra cost.', color: '#fbbf24' },
    { icon: Zap, title: '4K Ultra HD Quality', desc: 'Crystal-clear 4K, FHD, and HD streams with adaptive bitrate technology that automatically adjusts to your connection speed.', color: '#a855f7' },
    { icon: Shield, title: '14-Day Money-Back Guarantee', desc: "Try Streamtly completely risk-free. If you're not satisfied within the first 14 days, we'll issue a full refund — no questions asked.", color: '#00e5a0' },
    { icon: Headphones, title: '24/7 Expert Support', desc: 'Our dedicated support team is available around the clock via live chat, email, and ticket system to resolve any issue quickly.', color: '#00d4ff' },
    { icon: Clock, title: 'Instant Activation', desc: 'Receive your subscription credentials and setup instructions the moment your payment is confirmed. Start streaming in under 5 minutes.', color: '#fbbf24' },
    { icon: RefreshCw, title: 'Weekly Content Updates', desc: 'New channels, movies, and series are added every week. Your library keeps growing automatically — no manual updates needed.', color: '#a855f7' },
]

const DEVICES = [
    { name: 'Amazon Firestick & Fire TV', icon: Tv, keywords: 'Fire TV Stick 4K, Fire TV Cube' },
    { name: 'Android TV & Google TV', icon: Monitor, keywords: 'Chromecast, Sony, Philips, TCL' },
    { name: 'Samsung & LG Smart TV', icon: Monitor, keywords: 'Tizen OS, webOS Smart TVs' },
    { name: 'iPhone & iPad (iOS)', icon: Smartphone, keywords: 'iOS 13+ compatible, all sizes' },
    { name: 'Android Smartphones', icon: Smartphone, keywords: 'Android 5.0+, all brands' },
    { name: 'Windows PC & Mac', icon: Monitor, keywords: 'Any browser or desktop app' },
    { name: 'MAG & IPTV Boxes', icon: Tv, keywords: 'MAG 254, 256, 322, 351, 410' },
    { name: 'Nvidia Shield TV', icon: Tv, keywords: 'Shield TV Pro, 4K HDR support' },
]

const TESTIMONIALS = [
    { name: 'Sarah M.', location: 'United States', rating: 5, text: "Used Streamtly for over a year. Crystal-clear 4K, zero buffering even on PPV fight nights. Absolutely worth every penny." },
    { name: 'James T.', location: 'United Kingdom', rating: 5, text: "Cancelled my cable and saving $120 a month. The channel selection is insane — sports, movies, international. Nothing compares." },
    { name: 'Maria L.', location: 'Canada', rating: 5, text: "Setup took 5 minutes on my Firestick. The support team walked me through everything on live chat. Best streaming service I've used." },
    { name: 'David K.', location: 'Australia', rating: 5, text: "150,000+ VOD titles and I'm always finding something new. Found rare films here I couldn't locate anywhere else. Incredible library." },
    { name: 'Chen W.', location: 'Singapore', rating: 5, text: "Asian channels in perfect quality alongside international content. Replaced 3 subscriptions with just one. The 14-day guarantee made it easy to try." },
    { name: 'Fatima R.', location: 'UAE', rating: 5, text: "Arabic channels, sports, and international content all in one place. Streamtly replaced multiple subscriptions for our whole family." },
]

const PLAN_INCLUDED = [
    'All 35,000+ live channels',
    '150,000+ movies & series on demand',
    'All PPV events — included free',
    '4K / FHD / HD streaming quality',
    'Anti-buffering technology',
    'Instant delivery to email & dashboard',
    '24/7 expert customer support',
    '14-day money-back guarantee',
]

const WHY_US = [
    {
        icon: Server,
        title: 'Enterprise-Grade Infrastructure — Zero Buffering',
        desc: "Streamtly runs on a network of premium server clusters across multiple continents. Our anti-buffering technology uses intelligent load balancing to distribute traffic, ensuring zero lag even during peak hours — UFC fight nights, World Cup matches, or Super Bowl Sundays. We guarantee 99.9% uptime backed by redundant failover systems. Unlike smaller providers that disappear overnight, we've invested in infrastructure built to last.",
        color: '#00d4ff',
    },
    {
        icon: Tv,
        title: 'Purpose-Built Apps for Every Platform',
        desc: "We don't hand you a generic M3U link and leave you to figure it out. Streamtly provides dedicated, polished apps for Amazon Firestick, Android TV, Smart TVs, iOS, and Android — each featuring Electronic Program Guide (EPG) integration, favorites management, catch-up TV, and an intuitive channel browser. The experience rivals Netflix in usability.",
        color: '#00e5a0',
    },
    {
        icon: Globe,
        title: 'Truly Global Content Library',
        desc: "With channels from over 100 countries and content in 50+ languages, Streamtly is the only streaming service you'll ever need. Watch Arabic news, Bollywood films, Korean dramas, UK football, American sports, and French cinema — all in one place. Our content team curates and updates the lineup weekly to ensure you always have the best global programming.",
        color: '#a855f7',
    },
    {
        icon: Award,
        title: 'Every PPV Event — No Extra Charges',
        desc: "Other providers charge extra for PPV events. Streamtly includes every major PPV fight, match, and live event in your standard subscription — UFC, boxing, wrestling, Formula 1, and major championship bouts. Combined with our 150,000+ VOD library featuring new releases within 30 days of theatrical debut, you'll never need another streaming subscription again.",
        color: '#fbbf24',
    },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function LandingPage() {
    const supabase = await createClient()
    const { data: plans } = await supabase
        .from('plans')
        .select('id, name, price_cents, duration_months')
        .order('price_cents')

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="flex flex-col items-center flex-1">

                {/* ══ HERO ══════════════════════════════════════════════════════ */}
                <section
                    aria-label="Welcome to Streamtly"
                    className="w-full relative overflow-hidden"
                    style={{ background: 'var(--gradient-hero)' }}
                >
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" aria-hidden="true">
                        <source src="/hero-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/80 via-[#0a0f1a]/70 to-[#0a0f1a]/95" aria-hidden="true" />
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00d4ff]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#00d4ff]/3 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 py-24 md:py-40 lg:py-48 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-[#8899aa] mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#00e5a0] animate-pulse" aria-hidden="true" />
                            Trusted by <strong className="text-white">&nbsp;50,000+&nbsp;</strong> subscribers worldwide
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl leading-[1.08]">
                            <span className="text-white">The #1 Premium</span>{' '}
                            <span className="gradient-text">IPTV Streaming Service</span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#8899aa] mb-4 max-w-2xl leading-relaxed">
                            Access <strong className="text-white">35,000+ Live Channels</strong> &amp;{' '}
                            <strong className="text-white">150,000+ Movies &amp; Series</strong> in stunning 4K quality —
                            on any device, anywhere in the world.
                        </p>
                        <p className="text-base text-[#8899aa] mb-10 max-w-xl leading-relaxed">
                            Every PPV event included. Instant activation. No contracts. Cancel anytime.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                            {[
                                { icon: Shield, label: '14-Day Money-Back', color: '#00e5a0' },
                                { icon: Zap, label: 'Instant Activation', color: '#00d4ff' },
                                { icon: Star, label: '4.9/5 Rating', color: '#fbbf24' },
                                { icon: Globe, label: 'Worldwide Access', color: '#a855f7' },
                            ].map(({ icon: Icon, label, color }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
                                    style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
                                >
                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all hover:scale-105 active:scale-95"
                            >
                                View All Plans
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 transition-all"
                            >
                                Installation Guides
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ══ STATS BAR ═════════════════════════════════════════════════ */}
                <section aria-label="Platform statistics" className="w-full bg-[#111827] border-y border-white/5">
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                            {STATS.map(({ value, label, color }) => (
                                <div key={label} className="flex flex-col items-center gap-1">
                                    <span className="text-2xl md:text-3xl font-black" style={{ color }}>{value}</span>
                                    <span className="text-xs text-[#8899aa] font-medium uppercase tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ PRICING PLANS ═════════════════════════════════════════════ */}
                <section id="pricing" aria-labelledby="pricing-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-xs font-bold text-[#00d4ff] mb-4 uppercase tracking-wider">
                                Flexible Plans
                            </div>
                            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                Choose Your Streamtly Plan
                            </h2>
                            <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                                Simple, transparent pricing with no hidden fees. All plans include every channel,
                                VOD title, and PPV event. The longer you subscribe, the more you save.
                            </p>
                        </div>

                        {plans && plans.length > 0 ? (
                            <div className="flex flex-col md:flex-row md:items-stretch gap-3">
                                {plans.map((plan) => {
                                    const price = (plan.price_cents / 100).toFixed(2)
                                    const monthly = (plan.price_cents / 100 / plan.duration_months).toFixed(2)
                                    const isBest = plan.duration_months >= 12
                                    return (
                                        <article
                                            key={plan.id}
                                            className={`group relative rounded-2xl p-[1px] flex-1 md:hover:flex-[2.5] transition-[flex-grow] duration-500 ease-in-out ${isBest
                                                ? 'bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706]'
                                                : 'bg-white/10 hover:bg-gradient-to-b hover:from-[#00d4ff]/40 hover:to-[#00e5a0]/40'}`}
                                        >
                                            {isBest && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                                    <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0a0f1a] shadow-lg whitespace-nowrap">
                                                        ⭐ Best Value
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`rounded-2xl p-6 h-full flex flex-col overflow-hidden ${isBest ? 'bg-[#0f172a]' : 'bg-[#111827]'}`}>
                                                {/* Always-visible: name + price */}
                                                <header className="mb-4 flex-shrink-0">
                                                    <h3 className="text-base font-bold text-white mb-0.5 truncate">{plan.name}</h3>
                                                    <p className="text-xs text-[#8899aa]">{plan.duration_months} Month{plan.duration_months !== 1 ? 's' : ''}</p>
                                                    <div className="mt-3">
                                                        <span className="text-3xl font-extrabold text-white">${price}</span>
                                                    </div>
                                                    <p className="text-xs text-[#8899aa] mt-1">
                                                        <span className="text-[#00d4ff] font-semibold">${monthly}</span>/mo
                                                    </p>
                                                </header>

                                                {/* Revealed on hover (desktop) / always visible (mobile) */}
                                                <ul
                                                    className="space-y-2 mb-5 flex-1 md:max-h-0 md:opacity-0 md:overflow-hidden md:group-hover:max-h-96 md:group-hover:opacity-100 transition-all duration-500 ease-in-out"
                                                    aria-label={`${plan.name} included features`}
                                                >
                                                    {PLAN_INCLUDED.map(f => (
                                                        <li key={f} className="flex items-start gap-2 text-xs text-[#c0ccda]">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a0] flex-shrink-0 mt-0.5" aria-hidden="true" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Link
                                                    href={`/pricing/${plan.id}`}
                                                    className={`block text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 ${isBest
                                                        ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0a0f1a] shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                                        : 'bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a]'}`}
                                                    aria-label={`Subscribe to ${plan.name} for $${price}`}
                                                >
                                                    Get Started — ${price}
                                                </Link>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all hover:scale-105"
                                >
                                    View All Plans <ArrowRight className="w-5 h-5" aria-hidden="true" />
                                </Link>
                            </div>
                        )}

                        <p className="text-center text-[#555] text-xs mt-10">
                            All prices in USD · Secure payment via Stripe &amp; PayPal · No recurring charges ·{' '}
                            <Link href="/refund" className="text-[#8899aa] hover:text-[#00d4ff] underline underline-offset-2 transition-colors">
                                14-day refund policy
                            </Link>
                        </p>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ FEATURES ══════════════════════════════════════════════════ */}
                <section aria-labelledby="features-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-xs font-bold text-[#00e5a0] mb-4 uppercase tracking-wider">
                                Everything Included
                            </div>
                            <h2 id="features-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                Everything You Get With Streamtly
                            </h2>
                            <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                                From the moment you subscribe, you get full unlimited access to every feature —
                                no upsells, no extra fees, no surprises. Ever.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                                <div
                                    key={title}
                                    className="p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all hover-lift"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: `${color}15` }}
                                        aria-hidden="true"
                                    >
                                        <Icon className="w-6 h-6" style={{ color }} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                                    <p className="text-sm text-[#8899aa] leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ DEVICES ═══════════════════════════════════════════════════ */}
                <section aria-labelledby="devices-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 text-xs font-bold text-[#a855f7] mb-4 uppercase tracking-wider">
                                Universal Compatibility
                            </div>
                            <h2 id="devices-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                Stream on Any Device, Anywhere
                            </h2>
                            <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                                One subscription, every screen. Streamtly works natively on all major devices
                                with dedicated apps and step-by-step setup guides included free.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {DEVICES.map(({ name, icon: Icon, keywords }) => (
                                <div
                                    key={name}
                                    className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#00d4ff]/20 hover:bg-white/5 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center" aria-hidden="true">
                                        <Icon className="w-6 h-6 text-[#00d4ff]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-snug">{name}</p>
                                        <p className="text-xs text-[#555] mt-1">{keywords}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link href="/guides" className="inline-flex items-center gap-2 text-[#00d4ff] font-semibold hover:underline text-sm">
                                View step-by-step installation guides for all devices
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ WHY STREAM4U ══════════════════════════════════════════════ */}
                <section aria-labelledby="why-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-xs font-bold text-[#fbbf24] mb-4 uppercase tracking-wider">
                                Our Difference
                            </div>
                            <h2 id="why-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                Why 50,000+ Customers Choose Streamtly
                            </h2>
                            <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                                We&apos;re not just another IPTV provider. Here&apos;s what makes Streamtly the last streaming service you&apos;ll ever need.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {WHY_US.map(({ icon: Icon, title, desc, color }, i) => (
                                <article
                                    key={title}
                                    className={`flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl bg-[#111827] border border-white/5 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-shrink-0">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                                            aria-hidden="true"
                                        >
                                            <Icon className="w-8 h-8" style={{ color }} />
                                        </div>
                                    </div>
                                    <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                                        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                                        <p className="text-[#8899aa] leading-relaxed">{desc}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ TESTIMONIALS ══════════════════════════════════════════════ */}
                <section aria-labelledby="reviews-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-xs font-bold text-[#00d4ff] mb-4 uppercase tracking-wider">
                                Customer Reviews
                            </div>
                            <h2 id="reviews-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                                What Our Customers Say
                            </h2>
                            <div className="flex items-center justify-center gap-1.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" aria-hidden="true" />
                                ))}
                                <span className="text-white font-bold ml-2 text-lg">4.9</span>
                                <span className="text-[#8899aa] text-sm">/5 · 50,000+ reviews</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TESTIMONIALS.map(({ name, location, rating, text }) => (
                                <article
                                    key={name}
                                    className="p-6 rounded-2xl bg-[#111827] border border-white/5 flex flex-col gap-4"
                                    itemScope
                                    itemType="https://schema.org/Review"
                                >
                                    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
                                        {Array.from({ length: rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" aria-hidden="true" />
                                        ))}
                                    </div>
                                    <blockquote className="text-[#c0ccda] text-sm leading-relaxed flex-1" itemProp="reviewBody">
                                        &ldquo;{text}&rdquo;
                                    </blockquote>
                                    <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                                        <div
                                            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                            aria-hidden="true"
                                        >
                                            {name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white" itemProp="author">{name}</p>
                                            <p className="text-xs text-[#8899aa]">{location}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link href="/reviews" className="inline-flex items-center gap-2 text-[#00d4ff] font-semibold hover:underline text-sm">
                                Read all customer reviews
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ FAQ ═══════════════════════════════════════════════════════ */}
                <section aria-labelledby="faq-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-xs font-bold text-[#00e5a0] mb-4 uppercase tracking-wider">
                                FAQ
                            </div>
                            <h2 id="faq-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-[#8899aa] text-lg">
                                Everything you need to know about Streamtly before you subscribe.
                            </p>
                        </div>

                        <FAQAccordion items={faqItems} />

                        <p className="text-center text-[#8899aa] text-sm mt-10">
                            Still have questions?{' '}
                            <Link href="/contact" className="text-[#00d4ff] font-semibold hover:underline">
                                Contact our support team
                            </Link>
                            {' '}— we respond within minutes.
                        </p>
                    </div>
                </section>

                {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
                <section aria-labelledby="cta-heading" className="w-full py-20 md:py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-[#0a0f1a] to-[#a855f7]/5" aria-hidden="true" />
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#00d4ff]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#a855f7]/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-[#8899aa] mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#00e5a0] animate-pulse" aria-hidden="true" />
                            Ready when you are
                        </div>
                        <h2 id="cta-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                            Start Streaming Today —{' '}
                            <span className="gradient-text">Risk Free</span>
                        </h2>
                        <p className="text-lg text-[#8899aa] mb-4 max-w-xl mx-auto leading-relaxed">
                            Join 50,000+ satisfied subscribers. Start streaming in under 5 minutes
                            with instant activation. Protected by our 14-day money-back guarantee.
                        </p>
                        <p className="text-sm text-[#555] mb-10">
                            No contract · Cancel anytime · All PPV events included · 24/7 support
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all hover:scale-105 active:scale-95"
                            >
                                View All Plans
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 transition-all"
                            >
                                Talk to Support
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}
