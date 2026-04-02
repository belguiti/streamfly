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
            {
                userAgent: ['CCBot', 'GPTBot'],
                disallow: ['/']
            }
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
