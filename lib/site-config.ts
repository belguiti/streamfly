// Single source of truth for the canonical site URL.
// MUST be https://www.streamtly.com — all sitemaps, canonicals, OG tags, and emails use this.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.streamtly.com')
    .trim()
    .replace(/['"\s\\n]+/g, '')
    .replace(/\/$/, '')
