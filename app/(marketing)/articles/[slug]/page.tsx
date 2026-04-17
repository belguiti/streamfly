import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, User, Tag, ArrowLeft, CheckCircle2, ChevronDown, TrendingUp } from 'lucide-react'
import { articles, getArticle } from '@/lib/articles'
import { SITE_URL } from '@/lib/site-config'

export function generateStaticParams() {
    return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const article = getArticle(slug)
    if (!article) return {}

    return {
        title: article.metaTitle,
        description: article.metaDescription,
        keywords: [article.targetKeyword, ...article.secondaryKeywords].join(', '),
        alternates: { canonical: `${SITE_URL}/articles/${article.slug}` },
        openGraph: {
            title: article.metaTitle,
            description: article.metaDescription,
            url: `${SITE_URL}/articles/${article.slug}`,
            type: 'article',
            publishedTime: article.date,
            authors: [article.author],
            images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: article.metaTitle }],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.metaTitle,
            description: article.metaDescription,
            images: [`${SITE_URL}/og-image.jpg`],
        },
    }
}

export default async function ArticlePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const article = getArticle(slug)
    if (!article) notFound()

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
            { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/articles/${article.slug}` },
        ],
    }

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.metaDescription,
        keywords: [article.targetKeyword, ...article.secondaryKeywords].join(', '),
        datePublished: article.date,
        author: { '@type': 'Organization', name: article.author },
        publisher: { '@type': 'Organization', name: 'Streamtly', url: SITE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${article.slug}` },
    }

    const faqSchema = article.faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        }
        : null

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            {faqSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            )}

            <div className="min-h-screen">
                {/* Hero banner */}
                <div
                    className="relative pt-16 pb-12 overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #0a0f1a 0%, #0d1220 60%, #0a0f1a 100%)' }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,72,153,0.12) 0%, transparent 70%)' }}
                    />
                    <div className="container mx-auto px-4 max-w-3xl relative">
                        <Link
                            href="/articles"
                            className="inline-flex items-center gap-1.5 text-sm text-[#8899aa] hover:text-white transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Articles
                        </Link>

                        <div className="mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EC4899]/20 text-[#F9A8D4] border border-[#EC4899]/30">
                                <Tag className="w-3 h-3" />
                                {article.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#8899aa]">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {article.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-[#EC4899]" />
                                {article.date}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Article body */}
                <div className="container mx-auto px-4 max-w-3xl py-12">

                    {/* Intro */}
                    <p className="text-lg text-[#b0c4d8] leading-relaxed mb-10 border-l-4 border-[#EC4899]/60 pl-5">
                        {article.intro}
                    </p>

                    {/* Sections */}
                    <div className="space-y-10">
                        {article.sections.map((section, i) => (
                            <section key={i}>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span
                                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}
                                    >
                                        {i + 1}
                                    </span>
                                    {section.heading}
                                </h2>
                                <div className="space-y-4 pl-10">
                                    {section.body.map((para, j) => (
                                        <p key={j} className="text-[#94a3b8] leading-relaxed">{para}</p>
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
                                    {section.table && (
                                        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))' }}>
                                                        {section.table.headers.map((h, k) => (
                                                            <th key={k} className="px-4 py-3 text-left font-bold text-white border-b border-white/10">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.table.rows.map((row, k) => (
                                                        <tr key={k} className={k % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}>
                                                            {row.map((cell, l) => (
                                                                <td key={l} className="px-4 py-3 text-[#94a3b8] border-b border-white/5 last:border-b-0">{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Conclusion */}
                    <div className="mt-12 p-6 rounded-2xl bg-[#0d1220] border border-[#EC4899]/20">
                        <h2 className="text-xl font-bold text-white mb-3">Final Thoughts</h2>
                        <p className="text-[#94a3b8] leading-relaxed">{article.conclusion}</p>
                    </div>

                    {/* FAQ */}
                    {article.faqs.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-3">
                                {article.faqs.map((faq, i) => (
                                    <details
                                        key={i}
                                        className="group rounded-xl bg-[#111827] border border-white/5 overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-white font-semibold hover:text-[#F9A8D4] transition-colors">
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
                        style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(236,72,153,0.22)' }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(236,72,153,0.15) 0%, transparent 70%)' }}
                        />
                        <div className="relative">
                            <h3 className="text-2xl font-extrabold text-white mb-2">Ready to Start Streaming?</h3>
                            <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">
                                Get instant access to 35,000+ live channels, 150,000+ movies &amp; series — starting from $13/month.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-white hover:opacity-90 hover:scale-105 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}
                                >
                                    View Pricing Plans
                                </Link>
                                <Link
                                    href="/articles"
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
