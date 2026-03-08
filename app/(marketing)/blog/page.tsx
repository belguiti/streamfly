import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, Tag, ArrowRight } from 'lucide-react'
import { blogPosts, blogCategories } from '@/lib/blog-posts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

export const metadata: Metadata = {
    title: 'IPTV Blog — Guides, Tips & Setup Help | Streamtly',
    description: 'Expert IPTV guides, setup tutorials, troubleshooting tips, and streaming advice. Everything you need to get the most out of your IPTV subscription.',
    alternates: { canonical: `${SITE_URL}/blog` },
}

const categoryColors: Record<string, string> = {
    'Beginner Guides': '#4338CA',
    'Setup Guides': '#0EA5E9',
    'Troubleshooting': '#EF4444',
    'Comparisons': '#F59E0B',
    'IPTV Apps': '#8B5CF6',
    'Tips & Tricks': '#22C55E',
}

export default function BlogPage() {
    const categories = blogCategories

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div
                className="relative pt-16 pb-12 text-center overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0a0f1a 0%, #0d1220 60%, #0a0f1a 100%)' }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(67,56,202,0.15) 0%, transparent 70%)' }}
                />
                <div className="relative container mx-auto px-4 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#4338CA]/20 text-[#818CF8] border border-[#4338CA]/30 mb-5">
                        <Tag className="w-3 h-3" />
                        IPTV Knowledge Base
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Streaming Guides &amp; <span style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tips</span>
                    </h1>
                    <p className="text-lg text-[#8899aa] max-w-xl mx-auto">
                        Expert IPTV guides, setup tutorials, and troubleshooting help — written for beginners and power users alike.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Category legend */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat) => {
                        const color = cat === 'All' ? '#4338CA' : (categoryColors[cat] ?? '#4338CA')
                        return (
                            <span
                                key={cat}
                                className="px-4 py-1.5 rounded-full text-xs font-semibold border"
                                style={{
                                    background: `${color}15`,
                                    color: color,
                                    borderColor: `${color}30`,
                                }}
                            >
                                {cat}
                            </span>
                        )
                    })}
                </div>

                {/* Article grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {blogPosts.map((post) => {
                        const color = categoryColors[post.category] ?? '#4338CA'
                        return (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col rounded-2xl bg-[#111827] border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(67,56,202,0.1)]"
                            >
                                {/* Color stripe */}
                                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

                                <div className="p-6 flex flex-col flex-1">
                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                                        <span
                                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                            style={{ background: `${color}15`, color, borderColor: `${color}30` }}
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
                                    <h2 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#818CF8] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-sm text-[#8899aa] leading-relaxed line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                                        <span className="flex items-center gap-1.5 text-xs text-[#555]">
                                            <User className="w-3 h-3" />
                                            {post.author}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-semibold text-[#818CF8] group-hover:gap-2 transition-all">
                                            Read Article
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <div
                    className="mt-16 p-8 rounded-2xl text-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(67,56,202,0.12) 0%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(67,56,202,0.2)' }}
                >
                    <h3 className="text-xl font-bold text-white mb-3">Ready to Start Streaming?</h3>
                    <p className="text-[#8899aa] mb-6 text-sm max-w-md mx-auto">
                        Get instant access to 35,000+ channels and 150,000+ movies &amp; series.
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-white hover:opacity-90 hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}
                    >
                        View Plans
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
