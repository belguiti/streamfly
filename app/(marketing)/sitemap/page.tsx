import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-config'
import { blogPosts } from '@/lib/blog-posts'
import {
    Home, Tag, BookOpen, Star, Phone, FileText, ShieldCheck, RotateCcw,
    Tv, Smartphone, Monitor, Satellite, Box, Tablet,
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Sitemap | Streamtly IPTV',
    description: 'Browse all pages on Streamtly — setup guides, pricing plans, blog articles, reviews, and support.',
    alternates: { canonical: `${SITE_URL}/sitemap` },
    robots: { index: true, follow: true },
}

const mainPages = [
    { href: '/', label: 'Home', icon: Home, desc: 'Premium IPTV — 35,000+ channels & 150,000+ VODs' },
    { href: '/pricing', label: 'Pricing & Plans', icon: Tag, desc: 'Monthly, 3-month, 6-month & annual subscriptions' },
    { href: '/reviews', label: 'Customer Reviews', icon: Star, desc: 'Verified reviews from thousands of subscribers' },
    { href: '/blog', label: 'IPTV Blog', icon: BookOpen, desc: 'Guides, tutorials, and streaming tips' },
    { href: '/guides', label: 'Setup Guides', icon: Monitor, desc: 'Step-by-step installation guides for every device' },
    { href: '/contact', label: 'Contact Support', icon: Phone, desc: '24/7 support by email and live chat' },
]

const deviceGuides = [
    { href: '/guides/smart-tv', label: 'Smart TV Setup Guide', icon: Tv, desc: 'Samsung, LG, Hisense, Sony' },
    { href: '/guides/android', label: 'Android & Firestick Guide', icon: Smartphone, desc: 'Android Box, Firestick, Android TV' },
    { href: '/guides/ios', label: 'iPhone & iPad Guide', icon: Tablet, desc: 'iOS 14 and above' },
    { href: '/guides/windows', label: 'Windows & Mac Guide', icon: Monitor, desc: 'Desktop and laptop setup' },
    { href: '/guides/mag', label: 'MAG Box Guide', icon: Box, desc: 'MAG 250, 254, 256, 322, 420+' },
    { href: '/guides/enigma2', label: 'Enigma2 / Satellite Guide', icon: Satellite, desc: 'Dreambox, Vu+, Zgemma, Octagon' },
]

const legalPages = [
    { href: '/terms', label: 'Terms of Service', icon: FileText },
    { href: '/privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { href: '/refund', label: 'Refund Policy', icon: RotateCcw },
]

const blogCategories = ['Beginner Guides', 'Setup Guides', 'Troubleshooting', 'Comparisons', 'IPTV Apps', 'Tips & Tricks']

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
    return arr.reduce((acc, item) => {
        const k = key(item)
        if (!acc[k]) acc[k] = []
        acc[k].push(item)
        return acc
    }, {} as Record<string, T[]>)
}

export default function SitemapPage() {
    const postsByCategory = groupBy(blogPosts, p => p.category)

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">

            {/* Header */}
            <div className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Site <span className="gradient-text">Map</span>
                </h1>
                <p className="text-[#8899aa] text-lg max-w-xl mx-auto">
                    A complete index of all pages on Streamtly.
                </p>
            </div>

            {/* Main Pages */}
            <section className="mb-14">
                <h2 className="text-xs font-bold text-[#8899aa] uppercase tracking-widest mb-5">Main Pages</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainPages.map(page => (
                        <Link
                            key={page.href}
                            href={page.href}
                            className="group flex items-start gap-3 p-4 rounded-xl bg-[#111827] border border-white/5 hover:border-[#00d4ff]/30 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <page.icon className="w-4 h-4 text-[#00d4ff]" />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm group-hover:text-[#00d4ff] transition-colors">{page.label}</p>
                                <p className="text-xs text-[#555] mt-0.5">{page.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Device Setup Guides */}
            <section className="mb-14">
                <h2 className="text-xs font-bold text-[#8899aa] uppercase tracking-widest mb-5">Device Setup Guides</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deviceGuides.map(guide => (
                        <Link
                            key={guide.href}
                            href={guide.href}
                            className="group flex items-start gap-3 p-4 rounded-xl bg-[#111827] border border-white/5 hover:border-[#00e5a0]/30 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#00e5a0]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <guide.icon className="w-4 h-4 text-[#00e5a0]" />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm group-hover:text-[#00e5a0] transition-colors">{guide.label}</p>
                                <p className="text-xs text-[#555] mt-0.5">{guide.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Blog Articles by Category */}
            <section className="mb-14">
                <h2 className="text-xs font-bold text-[#8899aa] uppercase tracking-widest mb-5">Blog Articles</h2>
                <div className="space-y-8">
                    {blogCategories.map(cat => {
                        const posts = postsByCategory[cat]
                        if (!posts?.length) return null
                        return (
                            <div key={cat}>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA]" />
                                    {cat}
                                </h3>
                                <ul className="space-y-2 pl-4">
                                    {posts.map(post => (
                                        <li key={post.slug}>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="text-sm text-[#8899aa] hover:text-[#4338CA] transition-colors flex items-center gap-2"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-[#333] flex-shrink-0" />
                                                {post.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Legal Pages */}
            <section>
                <h2 className="text-xs font-bold text-[#8899aa] uppercase tracking-widest mb-5">Legal & Policies</h2>
                <div className="flex flex-wrap gap-4">
                    {legalPages.map(page => (
                        <Link
                            key={page.href}
                            href={page.href}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] border border-white/5 hover:border-white/15 transition-all text-sm text-[#8899aa] hover:text-white"
                        >
                            <page.icon className="w-4 h-4" />
                            {page.label}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
