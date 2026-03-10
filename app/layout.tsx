import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

/* Pro Max UI UX Design System: Righteous (headings via CSS import) + Poppins (body) */
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-poppins',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://streamtly.com'

export const viewport: Viewport = {
    themeColor: '#0F0F23',
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Streamtly | Premium IPTV Streaming Service',
        template: '%s | Streamtly',
    },
    description:
        'Streamtly is the #1 premium IPTV service with 35,000+ live channels, 150,000+ movies & series, and every PPV event in 4K quality. Instant activation, 24/7 support.',
    openGraph: {
        siteName: 'Streamtly',
        locale: 'en_US',
        type: 'website',
    },
    robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* Pro Max UI UX: Righteous heading font */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet" />

                {/* 2026 Core Web Vitals Optimization - Speculation Rules API for INP */}
                <script
                    type="speculationrules"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            prerender: [{ source: "document", where: { href_matches: "/*" } }]
                        })
                    }}
                />
            </head>
            <body className={`${poppins.variable} font-sans min-h-screen flex flex-col antialiased`}>
                {children}
                <SpeedInsights />
            </body>
        </html>
    )
}
