'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, User, Tag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { blogPosts, blogCategories } from '@/lib/blog-posts'

const PER_PAGE = 12

const categoryColors: Record<string, string> = {
    'All': '#4338CA',
    'Beginner Guides': '#4338CA',
    'Setup Guides': '#0EA5E9',
    'Troubleshooting': '#EF4444',
    'Comparisons': '#F59E0B',
    'IPTV Apps': '#8B5CF6',
    'Tips & Tricks': '#22C55E',
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [page, setPage] = useState(1)

    const filtered = activeCategory === 'All'
        ? blogPosts
        : blogPosts.filter(p => p.category === activeCategory)

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const start = (page - 1) * PER_PAGE
    const paginated = filtered.slice(start, start + PER_PAGE)

    function selectCategory(cat: string) {
        setActiveCategory(cat)
        setPage(1)
    }

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
                        Streaming Guides &amp;{' '}
                        <span style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Tips
                        </span>
                    </h1>
                    <p className="text-lg text-[#8899aa] max-w-xl mx-auto">
                        Expert IPTV guides, setup tutorials, and troubleshooting help — written for beginners and power users alike.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">

                {/* Category filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {blogCategories.map((cat) => {
                        const color = categoryColors[cat] ?? '#4338CA'
                        const isActive = activeCategory === cat
                        return (
                            <button
                                key={cat}
                                onClick={() => selectCategory(cat)}
                                className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                                style={{
                                    background: isActive ? color : `${color}12`,
                                    color: isActive ? '#fff' : color,
                                    borderColor: isActive ? color : `${color}35`,
                                    boxShadow: isActive ? `0 0 16px ${color}55` : 'none',
                                }}
                            >
                                {cat}
                            </button>
                        )
                    })}
                </div>

                {/* Article count */}
                <p className="text-center text-sm text-[#555] mb-8">
                    {filtered.length} article{filtered.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
                    {totalPages > 1 && ` — page ${page} of ${totalPages}`}
                </p>

                {/* Article grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {paginated.map((post) => {
                        const color = categoryColors[post.category] ?? '#4338CA'
                        return (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col rounded-2xl bg-[#111827] border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden hover:shadow-[0_0_24px_rgba(67,56,202,0.12)]"
                            >
                                {/* Color stripe */}
                                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }} />

                                <div className="p-5 flex flex-col flex-1">
                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span
                                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                            style={{ background: `${color}15`, color, borderColor: `${color}30` }}
                                        >
                                            {post.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-[#555]">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#818CF8] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-xs text-[#8899aa] leading-relaxed line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                        <span className="flex items-center gap-1 text-xs text-[#555]">
                                            <User className="w-3 h-3" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-semibold text-[#818CF8] group-hover:gap-2 transition-all">
                                            Read
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 text-white disabled:opacity-30 hover:bg-white/5 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className="w-9 h-9 rounded-xl text-sm font-bold border transition-all"
                                style={{
                                    background: n === page ? '#4338CA' : 'transparent',
                                    color: n === page ? '#fff' : '#8899aa',
                                    borderColor: n === page ? '#4338CA' : 'rgba(255,255,255,0.08)',
                                }}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 text-white disabled:opacity-30 hover:bg-white/5 transition-all"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

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
                        View Plans <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
