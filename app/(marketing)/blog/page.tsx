'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, User, Tag, ArrowRight, Search, Tv, Smartphone, Monitor, Flame, Shield, Zap } from 'lucide-react'

/* ────────────── BLOG DATA ────────────── */
const categories = ['All', 'Guides', 'IPTV Apps', 'Tips & Tricks', 'News']

const posts = [
    {
        slug: 'best-iptv-players-2026',
        category: 'IPTV Apps',
        title: 'The 5 Best IPTV Players in 2026 — Compared & Ranked',
        excerpt:
            'Looking for the best app to stream your IPTV subscription? We tested dozens of players on every platform to bring you the definitive top 5. From feature-rich powerhouses to lightweight options, find the one that fits your setup perfectly.',
        content: [
            'Choosing the right IPTV player can make or break your streaming experience. A good player provides a smooth EPG guide, fast channel switching, and buffer-free playback. A bad one can lead to crashes, constant buffering, and a frustrating overall experience.',
            'After extensive testing, our top pick is IPTV Smarters Pro. It supports Xtream Codes API, has a clean interface, and works reliably on Android, iOS, Firestick, and Smart TVs. For a free alternative, TiviMate offers a premium experience with its multi-EPG layout and catch-up TV support.',
            'Other strong contenders include GSE Smart IPTV for iOS users, Perfect Player for those who prefer a minimalist desktop-style interface, and OTT Navigator for its highly customizable channel organization. Each player has strengths depending on your device and preferences.',
            'Pro Tip: Always make sure your player supports Xtream Codes API for the easiest setup. Simply enter your server URL, username, and password, and you\'re streaming within seconds.',
        ],
        icon: Smartphone,
        color: '#00d4ff',
        readTime: '6 min read',
        date: 'Feb 20, 2026',
        author: 'Stream4U Team',
    },
    {
        slug: 'setup-iptv-firestick-2026',
        category: 'Guides',
        title: 'How to Set Up IPTV on Amazon Firestick in Under 5 Minutes (2026)',
        excerpt:
            'The Amazon Firestick is the most popular device for IPTV streaming. This step-by-step guide walks you through the entire setup process — from enabling developer options to entering your login credentials.',
        content: [
            'The Amazon Firestick remains the #1 device for IPTV in 2026, and for good reason. It\'s affordable, portable (just plug it into any HDMI port), and powerful enough to handle 4K streaming without breaking a sweat.',
            'Step 1: Navigate to Settings → My Fire TV → Developer Options and enable "Install Unknown Apps" for the Downloader app. Step 2: Install the free "Downloader" app from the Amazon App Store. Step 3: Open Downloader and enter the download URL provided in your Stream4U dashboard.',
            'Step 4: Install the downloaded APK file. Step 5: Open the app, select "Xtream Codes API", and enter your server URL, username, and password. That\'s it — your channels and VOD library will load automatically.',
            'Troubleshooting: If channels don\'t load, double-check your credentials and make sure your Firestick is connected to a stable internet connection. For the best experience, we recommend a minimum of 25 Mbps download speed for 4K content.',
        ],
        icon: Tv,
        color: '#ff9900',
        readTime: '4 min read',
        date: 'Feb 18, 2026',
        author: 'Stream4U Team',
    },
    {
        slug: 'iptv-buffering-fix-guide',
        category: 'Tips & Tricks',
        title: '7 Proven Ways to Fix IPTV Buffering Once and For All',
        excerpt:
            'Buffering kills the streaming experience. Whether it\'s during a live sports event or a movie night, here are 7 actionable fixes that will eliminate buffering and give you smooth, uninterrupted playback.',
        content: [
            'Buffering is the number one complaint among IPTV users, but in most cases, it has nothing to do with your IPTV provider. The issue usually lies with your internet connection, device performance, or network configuration.',
            'Fix #1: Use an Ethernet connection instead of Wi-Fi. An Ethernet adapter for your Firestick or Android Box can dramatically reduce buffering. Fix #2: Clear your player\'s cache regularly. Over time, cached data can cause performance issues. Fix #3: Change your DNS to a faster provider like Cloudflare (1.1.1.1) or Google (8.8.8.8).',
            'Fix #4: Restart your router and modem weekly. Fix #5: Make sure no other devices on your network are hogging bandwidth (downloads, updates, video calls). Fix #6: Reduce the stream quality from 4K to 1080p if your connection is under 25 Mbps.',
            'Fix #7: Use a VPN if your ISP is throttling IPTV traffic. Some internet providers intentionally slow down streaming services. A quality VPN can bypass this throttling and restore full speed.',
        ],
        icon: Zap,
        color: '#00e5a0',
        readTime: '5 min read',
        date: 'Feb 15, 2026',
        author: 'Stream4U Team',
    },
    {
        slug: 'setup-iptv-smart-tv-2026',
        category: 'Guides',
        title: 'Complete Guide: Install IPTV on Samsung & LG Smart TVs (2026)',
        excerpt:
            'Smart TVs from Samsung and LG have built-in app stores that make IPTV setup simple. Learn how to install and configure your IPTV player directly on your Smart TV without any additional devices.',
        content: [
            'If you own a Samsung or LG Smart TV manufactured after 2017, you can run IPTV apps directly without needing a Firestick or Android box. This makes for a cleaner setup and one less remote to deal with.',
            'For Samsung TVs: Open the Smart Hub, search for "IPTV Smarters" or "Smart IPTV", and install it. Once installed, open the app and select the Xtream Codes API login method. Enter your server URL, username, and password from your Stream4U dashboard.',
            'For LG TVs: Open the LG Content Store, search for "Smart IPTV" or "IPTV Smarters", and install it. The setup process is identical — enter your Xtream Codes credentials and wait for the channel list to load.',
            'Note: The initial channel load may take 1-2 minutes as the EPG data is downloaded. After the first load, channels will appear almost instantly on subsequent launches.',
        ],
        icon: Monitor,
        color: '#1428a0',
        readTime: '5 min read',
        date: 'Feb 12, 2026',
        author: 'Stream4U Team',
    },
    {
        slug: 'iptv-vs-cable-comparison',
        category: 'News',
        title: 'IPTV vs Traditional Cable in 2026: The Complete Comparison',
        excerpt:
            'Cable TV costs keep rising while IPTV offers more channels at a fraction of the price. We break down the real differences in cost, content library, device support, and overall value.',
        content: [
            'The average cable TV bill in 2026 has surpassed $150/month in the US and £75/month in the UK. Meanwhile, a premium IPTV subscription delivers 10x the content for a fraction of the cost. But is IPTV really better? Let\'s compare.',
            'Content: Cable typically offers 200-500 channels depending on your package. IPTV services like Stream4U offer 35,000+ live channels from 100+ countries, plus 150,000+ movies and series on demand. There\'s simply no comparison in terms of volume.',
            'Cost: A basic cable package runs $50-80/month, while a premium package with sports and movies can exceed $200/month. Stream4U starts at just $29.99 for 3 months — that\'s less than $10/month for full access to everything.',
            'Flexibility: Cable locks you into a TV in your living room. IPTV works on any device, anywhere — your phone, tablet, laptop, Firestick, Smart TV, even your car. Plus, there are no contracts, no installation fees, and no equipment rental charges.',
        ],
        icon: Flame,
        color: '#fbbf24',
        readTime: '7 min read',
        date: 'Feb 8, 2026',
        author: 'Stream4U Team',
    },
    {
        slug: 'do-you-need-vpn-for-iptv',
        category: 'Tips & Tricks',
        title: 'Do You Really Need a VPN for IPTV? The Honest Answer',
        excerpt:
            'VPNs are heavily marketed alongside IPTV services, but do you actually need one? We cut through the noise and give you a straightforward, honest answer based on your specific situation.',
        content: [
            'The short answer: No, you don\'t need a VPN to use Stream4U. Our servers are equipped with enterprise-grade security and encryption. Your connection is private and protected without any additional software.',
            'However, there are situations where a VPN can be beneficial. If your ISP actively throttles streaming traffic, a VPN can bypass this and restore your full internet speed. This is particularly common with certain ISPs in the UK, Germany, and Australia.',
            'Another use case is privacy. While we don\'t log your viewing activity, a VPN adds an extra layer of anonymity by encrypting all your internet traffic and masking your IP address from your ISP.',
            'If you do choose to use a VPN, we recommend NordVPN, ExpressVPN, or Surfshark — all of which offer fast speeds optimized for streaming. Avoid free VPNs as they often introduce buffering and may sell your data.',
        ],
        icon: Shield,
        color: '#a855f7',
        readTime: '4 min read',
        date: 'Feb 5, 2026',
        author: 'Stream4U Team',
    },
]

/* ────────────── COMPONENT ────────────── */
export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [expandedPost, setExpandedPost] = useState<string | null>(null)

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter((p) => p.category === activeCategory)

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Our <span className="gradient-text">Blog</span>
                </h1>
                <p className="text-lg text-[#8899aa] max-w-xl mx-auto">
                    Expert guides, tips, and news to help you get the most out of your streaming experience.
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setExpandedPost(null) }}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat
                                ? 'bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] shadow-lg'
                                : 'bg-white/5 text-[#8899aa] hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
                {filteredPosts.map((post) => {
                    const isExpanded = expandedPost === post.slug
                    return (
                        <article
                            key={post.slug}
                            className="group rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-5">
                                    {/* Icon */}
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                        style={{ background: `${post.color}15` }}
                                    >
                                        <post.icon className="w-6 h-6" style={{ color: post.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Meta */}
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span
                                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                                style={{
                                                    background: `${post.color}15`,
                                                    color: post.color,
                                                    border: `1px solid ${post.color}30`,
                                                }}
                                            >
                                                {post.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[#555]">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </span>
                                            <span className="text-xs text-[#555]">{post.date}</span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#00d4ff] transition-colors">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-[#8899aa] leading-relaxed text-sm md:text-base">
                                            {post.excerpt}
                                        </p>

                                        {/* Read More Button */}
                                        <button
                                            onClick={() => setExpandedPost(isExpanded ? null : post.slug)}
                                            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#00d4ff] hover:text-[#00e5a0] transition-colors"
                                        >
                                            {isExpanded ? 'Show Less' : 'Read Full Article'}
                                            <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 md:px-8 pb-8 pt-2 border-t border-white/5">
                                    <div className="ml-0 md:ml-[68px] space-y-4">
                                        {post.content.map((paragraph, i) => (
                                            <p key={i} className="text-[#8899aa] leading-relaxed text-sm md:text-base">
                                                {paragraph}
                                            </p>
                                        ))}
                                        <div className="pt-4 flex items-center gap-2 text-xs text-[#555]">
                                            <User className="w-3 h-3" />
                                            Written by {post.author}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* Empty state */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-16 rounded-2xl bg-[#111827] border border-white/5">
                    <Search className="w-12 h-12 text-[#555] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                    <p className="text-[#8899aa]">Try selecting a different category.</p>
                </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-[#00d4ff]/5 to-[#a855f7]/5 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">Ready to Start Streaming?</h3>
                <p className="text-[#8899aa] mb-6 text-sm">Get instant access to 35,000+ channels and 150,000+ VODs.</p>
                <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105"
                >
                    View Plans
                </Link>
            </div>
        </div>
    )
}
