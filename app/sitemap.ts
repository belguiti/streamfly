import type { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: plans } = await supabaseAdmin
        .from('plans')
        .select('id')

    const planUrls: MetadataRoute.Sitemap = (plans ?? []).map(p => ({
        url: `${SITE_URL}/pricing/${p.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
    }))

    return [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
        { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.80 },
        { url: `${SITE_URL}/guides/iptv-architecture`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/guides/xtream-vs-m3u`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/guides/isp-throttling-vpn`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/guides/qos-router-setup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/guides/automated-epg-sync`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/guides/diagnosing-buffer-bloat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.70 },
        { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.70 },
        { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
        { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.30 },
        { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.30 },
        { url: `${SITE_URL}/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.30 },
        ...planUrls,
    ]
}
