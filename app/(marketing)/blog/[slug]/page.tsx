import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, User, Tag, ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react'
import { blogPosts, getPost } from '@/lib/blog-posts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

/* ─── Static params ──────────────────────────────────────────────────────── */
export function generateStaticParams() {
    return blogPosts.map((p) => ({ slug: p.slug }))
}

/* ─── Metadata ───────────────────────────────────────────────────────────── */
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const post = getPost(slug)
    if (!post) return {}

    return {
        title: post.metaTitle,
        description: post.metaDescription,
        keywords: [post.targetKeyword, ...post.secondaryKeywords].join(', '),
        alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
        openGraph: {
            title: post.metaTitle,
            description: post.metaDescription,
            url: `${SITE_URL}/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.metaTitle,
            description: post.metaDescription,
        },
    }
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function BlogPostPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const post = getPost(slug)
    if (!post) notFound()

    /* ── JSON-LD ── */
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        keywords: [post.targetKeyword, ...post.secondaryKeywords].join(', '),
        datePublished: post.date,
        author: { '@type': 'Organization', name: post.author },
        publisher: {
            '@type': 'Organization',
            name: 'Streamtly',
            url: SITE_URL,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    }

    const faqSchema = post.faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        }
        : null

    return (
        <>
            {/* Structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <div className="min-h-screen">
                {/* ── Hero banner ── */}
                <div
                    className="relative pt-16 pb-12 overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #0a0f1a 0%, #0d1220 60%, #0a0f1a 100%)' }}
                >
                    {/* Glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(67,56,202,0.15) 0%, transparent 70%)',
                        }}
                    />

                    <div className="container mx-auto px-4 max-w-3xl relative">
                        {/* Back link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1.5 text-sm text-[#8899aa] hover:text-white transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Blog
                        </Link>

                        {/* Category pill */}
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#4338CA]/20 text-[#818CF8] border border-[#4338CA]/30">
                                <Tag className="w-3 h-3" />
                                {post.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            {post.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#8899aa]">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </span>
                            <span>{post.date}</span>
                        </div>
                    </div>
                </div>

                {/* ── Article body ── */}
                <div className="container mx-auto px-4 max-w-3xl py-12">

                    {/* Intro */}
                    <p className="text-lg text-[#b0c4d8] leading-relaxed mb-10 border-l-4 border-[#4338CA]/60 pl-5">
                        {post.intro}
                    </p>

                    {/* Sections */}
                    <div className="space-y-10">
                        {post.sections.map((section, i) => (
                            <section key={i}>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span
                                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}
                                    >
                                        {i + 1}
                                    </span>
                                    {section.heading}
                                </h2>

                                <div className="space-y-4 pl-10">
                                    {section.body.map((para, j) => (
                                        <p key={j} className="text-[#94a3b8] leading-relaxed">
                                            {para}
                                        </p>
                                    ))}

                                    {section.list && section.list.length > 0 && (
                                        <ul className="space-y-2 mt-4">
                                            {section.list.map((item, k) => (
                                                <li key={k} className="flex items-start gap-2.5 text-[#94a3b8]">
                                                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Conclusion */}
                    <div className="mt-12 p-6 rounded-2xl bg-[#0d1220] border border-[#4338CA]/20">
                        <h2 className="text-xl font-bold text-white mb-3">Final Thoughts</h2>
                        <p className="text-[#94a3b8] leading-relaxed">{post.conclusion}</p>
                    </div>

                    {/* FAQ */}
                    {post.faqs.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {post.faqs.map((faq, i) => (
                                    <details
                                        key={i}
                                        className="group rounded-xl bg-[#111827] border border-white/5 overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-white font-semibold hover:text-[#818CF8] transition-colors">
                                            {faq.q}
                                            <ChevronDown className="w-4 h-4 flex-shrink-0 text-[#8899aa] group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="px-5 pb-4">
                                            <p className="text-[#94a3b8] text-sm leading-relaxed">{faq.a}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div
                        className="mt-14 p-8 rounded-2xl text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(67,56,202,0.15) 0%, rgba(124,58,237,0.10) 100%)', border: '1px solid rgba(67,56,202,0.25)' }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(67,56,202,0.2) 0%, transparent 70%)' }}
                        />
                        <div className="relative">
                            <h3 className="text-2xl font-extrabold text-white mb-2">
                                Ready to Start Streaming?
                            </h3>
                            <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">
                                Get instant access to 35,000+ live channels, 150,000+ movies &amp; series, and every live sports event — starting from £9.99/month.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-[#0a0f1a] hover:opacity-90 hover:scale-105 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}
                                >
                                    View Pricing Plans
                                </Link>
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-white border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all"
                                >
                                    More Articles
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
