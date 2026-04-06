import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import ArticlesPageClient from './_client'

export const metadata: Metadata = {
    title: 'Trending Articles | Streamtly',
    description: 'The hottest topics in streaming, technology, and entertainment. Trending articles updated regularly.',
    alternates: { canonical: `${SITE_URL}/articles` },
    openGraph: {
        title: 'Trending Articles | Streamtly',
        description: 'The hottest topics in streaming, technology, and entertainment.',
        url: `${SITE_URL}/articles`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Trending Articles | Streamtly',
        description: 'Trending topics in streaming, technology, and entertainment.',
    },
}

export default function ArticlesPage() {
    return <ArticlesPageClient />
}
