import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import RefundPageClient from './_client'

export const metadata: Metadata = {
    title: 'Refund Policy | Streamtly IPTV',
    description: 'Streamtly offers a 14-day money-back guarantee. Read our transparent refund policy to understand eligibility, process, and timelines.',
    keywords: ['Streamtly refund', 'IPTV refund policy', 'money back guarantee IPTV', 'Streamtly money back'],
    alternates: { canonical: `${SITE_URL}/refund` },
    openGraph: {
        title: 'Refund Policy | Streamtly IPTV',
        description: '14-day money-back guarantee. Transparent, hassle-free refund policy.',
        url: `${SITE_URL}/refund`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Refund Policy | Streamtly IPTV',
        description: '14-day money-back guarantee. Transparent refund policy.',
    },
}

export default function RefundPage() {
    return <RefundPageClient />
}
