import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import BlogPageClient from './_client'

export const metadata: Metadata = {
    title: 'IPTV Guides, Tutorials & Tips | Streamtly Blog',
    description: 'Expert IPTV guides, setup tutorials, app comparisons, and troubleshooting help. Learn how to set up IPTV on any device — Firestick, Smart TV, Android, iPhone, MAG and more.',
    keywords: ['IPTV guide', 'IPTV tutorial', 'IPTV setup', 'IPTV tips', 'IPTV blog', 'IPTV help', 'IPTV Firestick guide', 'IPTV Smart TV tutorial'],
    alternates: { canonical: `${SITE_URL}/blog` },
    openGraph: {
        title: 'IPTV Guides, Tutorials & Tips | Streamtly Blog',
        description: 'Expert IPTV setup guides and troubleshooting help for every device.',
        url: `${SITE_URL}/blog`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'IPTV Guides & Tutorials | Streamtly Blog',
        description: 'IPTV setup guides for Firestick, Smart TV, Android, iPhone and more.',
    },
}

export default function BlogPage() {
    return <BlogPageClient />
}
