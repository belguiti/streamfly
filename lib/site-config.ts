export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.streamtly.com')
    .replace(/['"]/g, '')
    .replace(/\/$/, '')
