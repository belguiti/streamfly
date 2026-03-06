import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
    Zap, Shield, Headphones, Globe, Star, Tv, Monitor, Smartphone,
    Award, Server, RefreshCw, CheckCircle2, ArrowRight, Play, Clock,
} from 'lucide-react'
import FAQAccordion from '@/components/marketing/FAQAccordion'
import { Particles } from '@/components/ui/particles'
import { SpotlightCard } from '@/components/ui/spotlight-card'

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
        'buy IPTV', 'IPTV provider', 'streaming subscription', 'PPV IPTV 2026',
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
        images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Streamtly Premium IPTV' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Streamtly | Premium IPTV – 35,000+ Live Channels & 150,000+ VODs',
        description: 'Streamtly delivers 35,000+ live TV channels, 150,000+ movies and series in stunning 4K quality.',
        images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: { canonical: SITE_URL },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    category: 'entertainment',
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationSchema = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: 'Streamtly', url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    description: 'Premium IPTV service with 35,000+ live channels and 150,000+ VODs in 4K quality.',
    contactPoint: { '@type': 'ContactPoint', contactType: 'Customer Support', url: `${SITE_URL}/contact`, availabilityStarts: '00:00', availabilityEnds: '23:59', hoursAvailable: 'Mo,Tu,We,Th,Fr,Sa,Su' },
}
const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: 'Streamtly', url: SITE_URL,
    potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
}
const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'Streamtly IPTV Streaming Service',
    description: 'Premium IPTV streaming service with 35,000+ live channels, 150,000+ movies & series, and all PPV events.',
    provider: { '@type': 'Organization', name: 'Streamtly', url: SITE_URL },
    areaServed: 'Worldwide', url: `${SITE_URL}/pricing`,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: '19.99', highPrice: '89.99' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '50000', bestRating: '5', worstRating: '1' },
}

const faqItems = [
    { q: 'What is IPTV and how does Streamtly work?', a: 'IPTV (Internet Protocol Television) delivers live TV channels and on-demand video content over the internet. With Streamtly, you subscribe to a plan, receive your activation details instantly, and start streaming 35,000+ channels and 150,000+ VODs on any compatible device — no satellite dish or cable box required.' },
    { q: 'Which devices are compatible with Streamtly?', a: 'Streamtly supports Amazon Firestick & Fire TV, Android TV & Google TV, Samsung & LG Smart TVs, iPhones & iPads, Android smartphones & tablets, Windows PC, Mac, MAG boxes, and Nvidia Shield. Visit our Installation Guides for step-by-step setup instructions for each device.' },
    { q: 'How long does activation take after payment?', a: 'Activation is instant. As soon as your payment is confirmed, your subscription credentials and setup instructions are delivered automatically to your email and dashboard. Most users start streaming within 5 minutes of signing up.' },
    { q: 'Do I need a VPN to use Streamtly?', a: 'No. A VPN is not required. Our servers use advanced encryption and security protocols that keep your connection private and secure. You may optionally use a VPN for additional privacy, but Streamtly works flawlessly without one.' },
    { q: 'What video quality can I expect?', a: 'Streamtly streams in 4K Ultra HD, Full HD (1080p), and HD (720p) depending on your internet connection and channel source. Our adaptive bitrate technology automatically adjusts quality to ensure smooth, buffer-free playback on any connection speed.' },
    { q: 'Are sports and PPV events included in the subscription?', a: "Yes! Every Streamtly subscription includes access to all major live sports events — NFL, NBA, Premier League, Champions League, UFC, and Boxing — plus all Pay-Per-View (PPV) events at no extra cost. You'll never pay separately for a PPV fight again." },
    { q: 'What is the refund policy?', a: "We offer a 14-day full money-back guarantee on all plans. If you're not completely satisfied within the first 14 days, contact our support team and we'll issue a prompt, no-questions-asked refund." },
    { q: 'How many devices can I stream on simultaneously?', a: 'Standard plans include one simultaneous connection, allowing streaming on one device at a time. Multi-connection plans allow two or more devices to stream simultaneously. You can always upgrade your plan for additional connections.' },
]

const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

// ─── Static Content ───────────────────────────────────────────────────────────
const CHANNEL_CATEGORIES = [
    '🏈 NFL & College Football', '⚽ Premier League', '🥊 UFC & Boxing PPV',
    '🎬 New Theatrical Releases', '🌍 100+ Countries', '📺 Crystal 4K',
    '🏀 NBA Live Games', '🎵 Music Channels', '👶 Kids & Family',
    '📰 24/7 Live News', '🏎️ Formula 1', '🎭 Premium Series',
    '⭐ Hollywood Blockbusters', '🏒 NHL Hockey', '⚾ MLB Baseball',
    '🎯 PPV Fight Nights', '📡 Satellite HD', '🔥 Trending Shows',
]

const STATS = [
    { value: '35,000+', label: 'Live Channels', color: '#4338CA' },
    { value: '150,000+', label: 'Movies & Series', color: '#22C55E' },
    { value: '50,000+', label: 'Happy Customers', color: '#8B5CF6' },
    { value: '99.9%', label: 'Uptime Guaranteed', color: '#F59E0B' },
    { value: '4.9★', label: 'Average Rating', color: '#F59E0B' },
]

const FEATURES = [
    { icon: Tv, title: '35,000+ Live Channels', desc: 'Local, national, and international channels from 100+ countries in every language and genre — sports, news, entertainment, kids, and more.', color: '#4338CA' },
    { icon: Play, title: '150,000+ VOD Library', desc: 'New theatrical releases, award-winning series, classic films, and documentaries — all on demand, zero ads, instant playback.', color: '#22C55E' },
    { icon: Award, title: 'All PPV Events Included', desc: 'UFC, boxing, NFL, NBA, Premier League, Formula 1 — every Pay-Per-View event is included in every plan at absolutely no extra cost.', color: '#F59E0B' },
    { icon: Zap, title: '4K Ultra HD Quality', desc: 'Crystal-clear 4K, FHD, and HD streams with adaptive bitrate technology that automatically adjusts to your connection speed.', color: '#8B5CF6' },
    { icon: Shield, title: '14-Day Money-Back Guarantee', desc: "Try Streamtly completely risk-free. If you're not satisfied within the first 14 days, we'll issue a full refund — no questions asked.", color: '#22C55E' },
    { icon: Headphones, title: '24/7 Expert Support', desc: 'Our dedicated support team is available around the clock via live chat, email, and ticket system to resolve any issue quickly.', color: '#4338CA' },
    { icon: Clock, title: 'Instant Activation', desc: 'Receive your subscription credentials and setup instructions the moment your payment is confirmed. Start streaming in under 5 minutes.', color: '#F59E0B' },
    { icon: RefreshCw, title: 'Weekly Content Updates', desc: 'New channels, movies, and series are added every week. Your library keeps growing automatically — no manual updates needed.', color: '#8B5CF6' },
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
    { icon: Server, title: 'Enterprise-Grade Infrastructure — Zero Buffering', desc: "Streamtly runs on a network of premium server clusters across multiple continents. Our anti-buffering technology uses intelligent load balancing to distribute traffic, ensuring zero lag even during peak hours — UFC fight nights, World Cup matches, or Super Bowl Sundays. We guarantee 99.9% uptime backed by redundant failover systems.", color: '#4338CA' },
    { icon: Tv, title: 'Purpose-Built Apps for Every Platform', desc: "We don't hand you a generic M3U link and leave you to figure it out. Streamtly provides dedicated, polished apps for Amazon Firestick, Android TV, Smart TVs, iOS, and Android — each featuring EPG integration, favorites management, catch-up TV, and an intuitive channel browser.", color: '#22C55E' },
    { icon: Globe, title: 'Truly Global Content Library', desc: "With channels from over 100 countries and content in 50+ languages, Streamtly is the only streaming service you'll ever need. Watch Arabic news, Bollywood films, Korean dramas, UK football, American sports, and French cinema — all in one place. Our content team curates and updates the lineup weekly.", color: '#8B5CF6' },
    { icon: Award, title: 'Every PPV Event — No Extra Charges', desc: "Other providers charge extra for PPV events. Streamtly includes every major PPV fight, match, and live event in your standard subscription — UFC, boxing, wrestling, Formula 1, and major championship bouts. Combined with our 150,000+ VOD library featuring new releases within 30 days of theatrical debut.", color: '#F59E0B' },
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
                    className="w-full relative overflow-hidden min-h-screen flex items-center"
                    style={{ background: 'var(--gradient-hero)' }}
                >
                    {/* Mesh dot grid */}
                    <div className="absolute inset-0 mesh-dots opacity-50 pointer-events-none" aria-hidden="true" />

                    {/* Canvas particle field */}
                    <Particles className="absolute inset-0 z-[1]" quantity={80} color="#4338CA" speed={0.25} minSize={0.5} maxSize={2} />
                    <Particles className="absolute inset-0 z-[1]" quantity={30} color="#22C55E" speed={0.18} minSize={0.4} maxSize={1.2} />

                    {/* Ambient video */}
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-25" aria-hidden="true">
                        <source src="/hero-bg.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F23]/40 via-[#0F0F23]/50 to-[#0F0F23] pointer-events-none" aria-hidden="true" />

                    {/* Animated glow orbs */}
                    <div className="absolute top-1/4 left-[8%] w-[500px] h-[500px] bg-[#4338CA]/10 rounded-full blur-[130px] animate-float pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-1/4 right-[8%] w-[600px] h-[600px] bg-[#8B5CF6]/7 rounded-full blur-[150px] animate-float-slow pointer-events-none" aria-hidden="true" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#22C55E]/4 rounded-full blur-[170px] pointer-events-none" aria-hidden="true" />

                    <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 flex flex-col items-center text-center w-full">

                        {/* Live badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 text-sm text-[#22C55E] mb-8 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" aria-hidden="true" />
                            Live Now —&nbsp;<strong className="text-white">50,000+</strong>&nbsp;active subscribers worldwide
                        </div>

                        {/* Main headline — Righteous font applied globally to h1 */}
                        <h1 className="mb-6 max-w-5xl">
                            <span className="text-white block">The World&apos;s</span>
                            <span className="shimmer-text block">#1 IPTV Service</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-[#94A3B8] mb-3 max-w-2xl leading-relaxed">
                            Access <strong className="text-white">35,000+ Live Channels</strong> &amp;{' '}
                            <strong className="text-white">150,000+ Movies &amp; Series</strong> in stunning 4K quality
                        </p>
                        <p className="text-base text-[#64748B] mb-10 max-w-xl">
                            Every PPV event included · Instant activation · No contracts · Cancel anytime
                        </p>

                        {/* Trust pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                            {[
                                { icon: Shield, label: '14-Day Money-Back', color: '#22C55E' },
                                { icon: Zap, label: 'Instant Activation', color: '#4338CA' },
                                { icon: Star, label: '4.9/5 Rating', color: '#F59E0B' },
                                { icon: Globe, label: 'Worldwide Access', color: '#8B5CF6' },
                            ].map(({ icon: Icon, label, color }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
                                    style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
                                >
                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-black text-lg hover:scale-105 active:scale-95 transition-all"
                                style={{ boxShadow: '0 0 32px rgba(67,56,202,0.45), 0 8px 32px rgba(67,56,202,0.2)' }}
                            >
                                Start Streaming Now
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 transition-all"
                            >
                                <Play className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
                                Installation Guides
                            </Link>
                        </div>

                        {/* Channel category marquee */}
                        <div
                            className="w-full overflow-hidden"
                            style={{ maskImage: 'linear-gradient(to right, transparent, white 12%, white 88%, transparent)' }}
                            aria-hidden="true"
                        >
                            <div className="animate-marquee-slow flex w-max gap-3 py-2">
                                {[...CHANNEL_CATEGORIES, ...CHANNEL_CATEGORIES].map((cat, i) => (
                                    <span
                                        key={i}
                                        className="flex-shrink-0 px-4 py-2 rounded-full bg-white/5 border border-white/8 text-xs font-medium text-[#94A3B8] whitespace-nowrap"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ STATS STRIP ═══════════════════════════════════════════════ */}
                <section aria-label="Platform statistics" className="w-full bg-[#0A0A1A] border-y border-white/5">
                    <div className="container mx-auto px-4 py-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {STATS.map(({ value, label, color }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center gap-1.5 p-5 rounded-2xl text-center"
                                    style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                                >
                                    <span className="text-3xl md:text-4xl font-black animate-glow-pulse" style={{ color }}>
                                        {value}
                                    </span>
                                    <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ PRICING PLANS ═════════════════════════════════════════════ */}
                <section id="pricing" aria-labelledby="pricing-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4338CA]/10 border border-[#4338CA]/20 text-xs font-bold text-[#4338CA] mb-4 uppercase tracking-wider">
                                Flexible Plans
                            </div>
                            <h2 id="pricing-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                Choose Your Streamtly Plan
                            </h2>
                            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
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
                                                ? 'bg-gradient-to-b from-[#F59E0B] via-[#D97706] to-[#B45309]'
                                                : 'bg-white/8 hover:bg-gradient-to-b hover:from-[#4338CA]/40 hover:to-[#22C55E]/40'}`}
                                        >
                                            {isBest && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                                    <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0F0F23] shadow-lg whitespace-nowrap">
                                                        ⭐ Best Value
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`rounded-2xl p-6 h-full flex flex-col overflow-hidden ${isBest ? 'bg-[#0F0F1E]' : 'bg-[#161633]'}`}>
                                                <header className="mb-4 flex-shrink-0">
                                                    <h3 className="text-base font-bold text-white mb-0.5 truncate">{plan.name}</h3>
                                                    <p className="text-xs text-[#94A3B8]">{plan.duration_months} Month{plan.duration_months !== 1 ? 's' : ''}</p>
                                                    <div className="mt-3">
                                                        <span className="text-3xl font-extrabold text-white">${price}</span>
                                                    </div>
                                                    <p className="text-xs text-[#94A3B8] mt-1">
                                                        <span className="font-semibold text-[#4338CA]">${monthly}</span>/mo
                                                    </p>
                                                </header>

                                                <ul
                                                    className="space-y-2 mb-5 flex-1 md:max-h-0 md:opacity-0 md:overflow-hidden md:group-hover:max-h-96 md:group-hover:opacity-100 transition-all duration-500 ease-in-out"
                                                    aria-label={`${plan.name} included features`}
                                                >
                                                    {PLAN_INCLUDED.map(f => (
                                                        <li key={f} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0 mt-0.5" aria-hidden="true" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Link
                                                    href={`/pricing/${plan.id}`}
                                                    className={`block text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 ${isBest
                                                        ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0F0F23]'
                                                        : 'bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white'}`}
                                                    style={isBest
                                                        ? { boxShadow: '0 0 20px rgba(245,158,11,0.35)' }
                                                        : { boxShadow: '0 0 20px rgba(67,56,202,0.3)' }}
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
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-bold text-lg hover:scale-105 transition-all"
                                    style={{ boxShadow: '0 0 30px rgba(67,56,202,0.4)' }}
                                >
                                    View All Plans <ArrowRight className="w-5 h-5" aria-hidden="true" />
                                </Link>
                            </div>
                        )}

                        <p className="text-center text-[#475569] text-xs mt-10">
                            All prices in USD · Secure payment via Stripe &amp; PayPal · No recurring charges ·{' '}
                            <Link href="/refund" className="text-[#94A3B8] hover:text-[#4338CA] underline underline-offset-2 transition-colors">
                                14-day refund policy
                            </Link>
                        </p>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ FEATURES BENTO GRID ═══════════════════════════════════════ */}
                <section aria-labelledby="features-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-xs font-bold text-[#22C55E] mb-4 uppercase tracking-wider">
                                Everything Included
                            </div>
                            <h2 id="features-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                Everything You Get With Streamtly
                            </h2>
                            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
                                From the moment you subscribe, you get full unlimited access to every feature —
                                no upsells, no extra fees, no surprises. Ever.
                            </p>
                        </div>

                        {/* Bento Grid — first card spans 2 cols + 2 rows, last card spans 2 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
                                <SpotlightCard
                                    key={title}
                                    spotlightColor={`${color}18`}
                                    className={`bento-card card-hover-glow p-6 flex flex-col gap-4 ${i === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''} ${i === 7 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                                >
                                    <div
                                        className={`flex-shrink-0 rounded-xl flex items-center justify-center ${i === 0 ? 'w-16 h-16' : 'w-12 h-12'}`}
                                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                                        aria-hidden="true"
                                    >
                                        <Icon className={i === 0 ? 'w-8 h-8' : 'w-6 h-6'} style={{ color }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-white mb-2 ${i === 0 ? 'text-2xl' : 'text-base'}`}>{title}</h3>
                                        <p className={`text-[#94A3B8] leading-relaxed ${i === 0 ? 'text-base' : 'text-sm'}`}>{desc}</p>
                                    </div>
                                    {i === 0 && (
                                        <Link
                                            href="/pricing"
                                            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
                                            style={{ color }}
                                        >
                                            View All Plans <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                        </Link>
                                    )}
                                </SpotlightCard>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ DEVICES MARQUEE ═══════════════════════════════════════════ */}
                <section aria-labelledby="devices-heading" className="w-full py-20 md:py-28 overflow-hidden">
                    <div className="container mx-auto px-4 max-w-6xl mb-12">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-xs font-bold text-[#8B5CF6] mb-4 uppercase tracking-wider">
                                Universal Compatibility
                            </div>
                            <h2 id="devices-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                Stream on Any Device, Anywhere
                            </h2>
                            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
                                One subscription, every screen. Streamtly works natively on all major devices
                                with dedicated apps and step-by-step setup guides included free.
                            </p>
                        </div>
                    </div>

                    {/* Auto-scroll marquee with fade edges */}
                    <div
                        className="w-full overflow-hidden"
                        style={{ maskImage: 'linear-gradient(to right, transparent, white 8%, white 92%, transparent)' }}
                        aria-hidden="true"
                    >
                        <div className="animate-marquee flex w-max gap-4 py-3">
                            {[...DEVICES, ...DEVICES].map(({ name, icon: Icon, keywords }, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-xl bg-[#161633] border border-white/6 whitespace-nowrap hover:border-[#4338CA]/30 transition-colors cursor-default"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#4338CA]/15 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-[#4338CA]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight">{name}</p>
                                        <p className="text-xs text-[#64748B] mt-0.5">{keywords}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/guides" className="inline-flex items-center gap-2 text-[#4338CA] font-semibold hover:underline text-sm">
                            View step-by-step installation guides for all devices
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                <div className="section-divider w-full" aria-hidden="true" />

                {/* ══ WHY STREAMTLY ═════════════════════════════════════════════ */}
                <section aria-labelledby="why-heading" className="w-full py-20 md:py-28">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs font-bold text-[#F59E0B] mb-4 uppercase tracking-wider">
                                Our Difference
                            </div>
                            <h2 id="why-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                Why 50,000+ Customers Choose Streamtly
                            </h2>
                            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
                                We&apos;re not just another IPTV provider. Here&apos;s what makes Streamtly the last streaming service you&apos;ll ever need.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {WHY_US.map(({ icon: Icon, title, desc, color }, i) => (
                                <article
                                    key={title}
                                    className="relative p-8 rounded-2xl bg-[#161633] border border-white/5 overflow-hidden card-hover-glow"
                                >
                                    {/* Number watermark */}
                                    <div
                                        className="absolute -top-6 -right-3 text-[110px] font-black leading-none select-none pointer-events-none"
                                        style={{ color: `${color}07` }}
                                        aria-hidden="true"
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                                                aria-hidden="true"
                                            >
                                                <Icon className="w-6 h-6" style={{ color }} />
                                            </div>
                                            <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest">
                                                0{i + 1}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-3 leading-snug">{title}</h3>
                                        <p className="text-[#94A3B8] leading-relaxed text-sm">{desc}</p>
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4338CA]/10 border border-[#4338CA]/20 text-xs font-bold text-[#4338CA] mb-4 uppercase tracking-wider">
                                Customer Reviews
                            </div>
                            <h2 id="reviews-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                                What Our Customers Say
                            </h2>
                            <div className="flex items-center justify-center gap-1.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" aria-hidden="true" />
                                ))}
                                <span className="text-white font-bold ml-2 text-lg">4.9</span>
                                <span className="text-[#94A3B8] text-sm">/5 · 50,000+ reviews</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TESTIMONIALS.map(({ name, location, rating, text }) => (
                                <SpotlightCard
                                    key={name}
                                    spotlightColor="rgba(67,56,202,0.1)"
                                    className="bento-card card-hover-glow cursor-default"
                                >
                                    <article
                                        className="p-6 flex flex-col gap-3 h-full"
                                        itemScope
                                        itemType="https://schema.org/Review"
                                    >
                                        {/* Large opening quote */}
                                        <div className="text-5xl font-black leading-none select-none text-[#4338CA]/30" aria-hidden="true">
                                            &ldquo;
                                        </div>

                                        <div className="flex gap-0.5 -mt-1" aria-label={`${rating} out of 5 stars`}>
                                            {Array.from({ length: rating }).map((_, idx) => (
                                                <Star key={idx} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" aria-hidden="true" />
                                            ))}
                                        </div>

                                        <blockquote className="text-[#CBD5E1] text-sm leading-relaxed flex-1" itemProp="reviewBody">
                                            {text}
                                        </blockquote>

                                        <div className="flex items-center gap-3 pt-3 border-t border-white/6">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #4338CA, #8B5CF6)' }}
                                                aria-hidden="true"
                                            >
                                                {name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white" itemProp="author">{name}</p>
                                                <p className="text-xs text-[#64748B]">{location}</p>
                                            </div>
                                        </div>
                                    </article>
                                </SpotlightCard>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link href="/reviews" className="inline-flex items-center gap-2 text-[#4338CA] font-semibold hover:underline text-sm">
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-xs font-bold text-[#22C55E] mb-4 uppercase tracking-wider">
                                FAQ
                            </div>
                            <h2 id="faq-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-[#94A3B8] text-lg">
                                Everything you need to know about Streamtly before you subscribe.
                            </p>
                        </div>

                        <FAQAccordion items={faqItems} />

                        <p className="text-center text-[#94A3B8] text-sm mt-10">
                            Still have questions?{' '}
                            <Link href="/contact" className="text-[#4338CA] font-semibold hover:underline">
                                Contact our support team
                            </Link>
                            {' '}— we respond within minutes.
                        </p>
                    </div>
                </section>

                {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
                <section aria-labelledby="cta-heading" className="w-full py-24 md:py-36 relative overflow-hidden">
                    {/* Aurora animated gradient background */}
                    <div
                        className="absolute inset-0 animate-aurora"
                        style={{
                            background: 'linear-gradient(135deg, #0F0F23 0%, #1E1B4B 25%, #0A1F12 50%, #1E1B4B 75%, #0F0F23 100%)',
                            backgroundSize: '300% 300%',
                        }}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-0 mesh-dots opacity-35 pointer-events-none" aria-hidden="true" />

                    {/* Glow orbs */}
                    <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#4338CA]/12 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#22C55E]/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

                    <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-[#94A3B8] mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" aria-hidden="true" />
                            Ready when you are
                        </div>

                        <h2 id="cta-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                            Start Streaming Today —{' '}
                            <span className="shimmer-text">Risk Free</span>
                        </h2>

                        <p className="text-lg text-[#94A3B8] mb-3 max-w-xl mx-auto leading-relaxed">
                            Join 50,000+ satisfied subscribers. Start streaming in under 5 minutes
                            with instant activation. Protected by our 14-day money-back guarantee.
                        </p>
                        <p className="text-sm text-[#475569] mb-10">
                            No contract · Cancel anytime · All PPV events included · 24/7 support
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-black text-lg hover:scale-105 active:scale-95 transition-all"
                                style={{ boxShadow: '0 0 40px rgba(67,56,202,0.5), 0 8px 40px rgba(67,56,202,0.25)' }}
                            >
                                View All Plans
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 transition-all"
                            >
                                Talk to Support
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            {[
                                { icon: Shield, label: '14-Day Guarantee', color: '#22C55E' },
                                { icon: Zap, label: 'Instant Setup', color: '#4338CA' },
                                { icon: Star, label: '4.9★ Rated', color: '#F59E0B' },
                                { icon: Globe, label: 'Global Access', color: '#8B5CF6' },
                            ].map(({ icon: Icon, label, color }) => (
                                <div key={label} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                                    <Icon className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}
