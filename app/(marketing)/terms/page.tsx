import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import TermsPageClient from './_client'

export const metadata: Metadata = {
    title: 'Terms of Service | Streamtly IPTV',
    description: 'Read the Streamtly Terms of Service. Understand your rights and responsibilities when using our IPTV subscription platform.',
    keywords: ['Streamtly terms', 'IPTV terms of service', 'Streamtly terms and conditions'],
    alternates: { canonical: `${SITE_URL}/terms` },
    openGraph: {
        title: 'Terms of Service | Streamtly IPTV',
        description: 'Streamtly Terms of Service — understand your rights and responsibilities.',
        url: `${SITE_URL}/terms`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Terms of Service | Streamtly IPTV',
        description: 'Streamtly Terms of Service.',
    },
}

export default function TermsPage() {
    return <TermsPageClient />
}
