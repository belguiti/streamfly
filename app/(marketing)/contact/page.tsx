import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import ContactPageClient from './_client'

export const metadata: Metadata = {
    title: 'Contact Support | Streamtly IPTV',
    description: 'Get in touch with the Streamtly support team. We are available 24/7 by email and live chat. Responses within 2 hours for all billing, setup, and technical enquiries.',
    keywords: ['Streamtly support', 'IPTV support', 'contact Streamtly', 'IPTV help', 'IPTV customer service'],
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        title: 'Contact Support | Streamtly IPTV',
        description: '24/7 support by email and live chat. Get help with setup, billing, and technical issues.',
        url: `${SITE_URL}/contact`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Contact Support | Streamtly IPTV',
        description: '24/7 support. Get help with setup, billing, and technical issues.',
    },
}

export default function ContactPage() {
    return <ContactPageClient />
}
