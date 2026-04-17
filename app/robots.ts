import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/app/', '/admin/', '/api/', '/auth/', '/search/', '/tag/', '/author/', '/cdn-cgi/'],
            },
            // Allow AI crawlers that respect robots.txt for GEO (Generative Engine Optimization)
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'cohere-ai', 'Google-Extended'],
                allow: ['/', '/pricing', '/guides', '/blog', '/articles', '/reviews', '/llms.txt'],
                disallow: ['/app/', '/admin/', '/api/', '/auth/'],
            },
            // Block scraper bots with no AI value
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            }
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
