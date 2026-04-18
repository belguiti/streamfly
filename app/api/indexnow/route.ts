import { NextResponse } from 'next/server'
import { articles } from '@/lib/articles'
import { blogPosts } from '@/lib/blog-posts'
import { SITE_URL } from '@/lib/site-config'

const INDEXNOW_KEY = 'streamtly-indexnow-2026-f4a2e8d1'

const STATIC_URLS = [
    SITE_URL,
    `${SITE_URL}/pricing`,
    `${SITE_URL}/guides`,
    `${SITE_URL}/guides/smart-tv`,
    `${SITE_URL}/guides/android`,
    `${SITE_URL}/guides/ios`,
    `${SITE_URL}/guides/windows`,
    `${SITE_URL}/guides/mag`,
    `${SITE_URL}/guides/enigma2`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/articles`,
    `${SITE_URL}/reviews`,
    `${SITE_URL}/llms.txt`,
]

export async function GET() {
    const allUrls = [
        ...STATIC_URLS,
        ...articles.map(a => `${SITE_URL}/articles/${a.slug}`),
        ...blogPosts.map(p => `${SITE_URL}/blog/${p.slug}`),
    ]

    const host = new URL(SITE_URL).hostname

    const payload = {
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: allUrls,
    }

    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload),
        })

        return NextResponse.json({
            success: res.ok,
            status: res.status,
            submitted: allUrls.length,
            urls: allUrls,
        })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
