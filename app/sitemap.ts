import type { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase/server'
import { blogPosts } from '@/lib/blog-posts'
import { articles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site-config'

// Parse "Apr 6, 2026" → Date
function parseArticleDate(dateStr: string): Date {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? new Date() : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: plans } = await supabaseAdmin
        .from('plans')
        .select('id')

    const planUrls: MetadataRoute.Sitemap = (plans ?? []).map(p => ({
        url: `${SITE_URL}/pricing/${p.id}`,
        lastModified: new Date('2026-04-01'),
        changeFrequency: 'weekly',
        priority: 0.85,
    }))

    return [
        { url: SITE_URL,                                    lastModified: new Date(),             changeFrequency: 'daily',   priority: 1.00 },
        { url: `${SITE_URL}/pricing`,                       lastModified: new Date(),             changeFrequency: 'daily',   priority: 0.95 },
        { url: `${SITE_URL}/articles`,                      lastModified: new Date(),             changeFrequency: 'daily',   priority: 0.90 },
        { url: `${SITE_URL}/guides`,                        lastModified: new Date('2026-04-01'), changeFrequency: 'weekly',  priority: 0.85 },
        { url: `${SITE_URL}/guides/smart-tv`,               lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.90 },
        { url: `${SITE_URL}/guides/android`,                lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.90 },
        { url: `${SITE_URL}/guides/ios`,                    lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.90 },
        { url: `${SITE_URL}/guides/windows`,                lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.88 },
        { url: `${SITE_URL}/guides/mag`,                    lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.88 },
        { url: `${SITE_URL}/guides/enigma2`,                lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.88 },
        { url: `${SITE_URL}/guides/iptv-architecture`,      lastModified: new Date('2026-03-01'), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/guides/xtream-vs-m3u`,          lastModified: new Date('2026-03-01'), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/guides/isp-throttling-vpn`,     lastModified: new Date('2026-03-01'), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/guides/qos-router-setup`,       lastModified: new Date('2026-03-01'), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/guides/automated-epg-sync`,     lastModified: new Date('2026-03-01'), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/guides/diagnosing-buffer-bloat`,lastModified: new Date('2026-03-01'), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/reviews`,                       lastModified: new Date(),             changeFrequency: 'weekly',  priority: 0.75 },
        { url: `${SITE_URL}/blog`,                          lastModified: new Date('2026-04-01'), changeFrequency: 'weekly',  priority: 0.70 },
        ...blogPosts.map(p => ({
            url: `${SITE_URL}/blog/${p.slug}`,
            lastModified: new Date('2026-03-01'),
            changeFrequency: 'monthly' as const,
            priority: 0.70,
        })),
        ...articles.map(a => ({
            url: `${SITE_URL}/articles/${a.slug}`,
            lastModified: parseArticleDate(a.date),
            changeFrequency: 'weekly' as const,
            priority: 0.90,
        })),
        { url: `${SITE_URL}/contact`,    lastModified: new Date('2026-01-01'), changeFrequency: 'monthly', priority: 0.55 },
        { url: `${SITE_URL}/terms`,      lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.30 },
        { url: `${SITE_URL}/privacy`,    lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.30 },
        { url: `${SITE_URL}/refund`,     lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.30 },
        { url: `${SITE_URL}/site-index`, lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.40 },
        ...planUrls,
    ]
}
