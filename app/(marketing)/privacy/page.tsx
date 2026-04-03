import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import PrivacyPageClient from './_client'

export const metadata: Metadata = {
    title: 'Privacy Policy | Streamtly IPTV',
    description: 'Read the Streamtly Privacy Policy. Learn how we collect, use, and protect your personal data. Your privacy is our priority.',
    keywords: ['Streamtly privacy policy', 'IPTV privacy policy', 'Streamtly data protection'],
    alternates: { canonical: `${SITE_URL}/privacy` },
    openGraph: {
        title: 'Privacy Policy | Streamtly IPTV',
        description: 'How Streamtly collects, uses, and protects your personal data.',
        url: `${SITE_URL}/privacy`,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Privacy Policy | Streamtly IPTV',
        description: 'How Streamtly protects your personal data.',
    },
}

export default function PrivacyPage() {
    return <PrivacyPageClient />
}
