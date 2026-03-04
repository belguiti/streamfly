import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stream4u.com'

export const viewport: Viewport = {
    themeColor: '#0a0f1a',
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Stream4U | Premium IPTV Streaming Service',
        template: '%s | Stream4U',
    },
    description:
        'Stream4U is the #1 premium IPTV service with 35,000+ live channels, 150,000+ movies & series, and every PPV event in 4K quality. Instant activation, 24/7 support.',
    openGraph: {
        siteName: 'Stream4U',
        locale: 'en_US',
        type: 'website',
    },
    robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
