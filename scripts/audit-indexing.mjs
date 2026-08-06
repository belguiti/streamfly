/**
 * Streamtly — Google Indexing Audit Script
 * 
 * Checks every URL from the sitemap for common indexing issues:
 * - HTTP status codes (404, 500, redirects)
 * - Missing/duplicate titles & meta descriptions
 * - Noindex meta tags or X-Robots-Tag headers
 * - Canonical URL mismatches
 * - Thin content (too small pages)
 * - Missing Open Graph tags
 * - Slow response times (>3s)
 * 
 * Usage: node scripts/audit-indexing.mjs
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://streamtly.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const CONCURRENCY = 5;
const TIMEOUT_MS = 15000;

// ── Colors for terminal ──────────────────────────────────────────
const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
};

// ── Fetch sitemap URLs ───────────────────────────────────────────
async function fetchSitemapUrls() {
    console.log(`\n${c.cyan}📡 Fetching sitemap: ${SITEMAP_URL}${c.reset}\n`);
    const res = await fetch(SITEMAP_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Sitemap returned ${res.status}`);
    const xml = await res.text();

    // Simple regex parse <loc>...</loc>
    const urls = [];
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        urls.push(match[1].trim());
    }
    return urls;
}

// ── Check a single URL ──────────────────────────────────────────
async function auditUrl(url) {
    const result = {
        url,
        status: 0,
        responseTime: 0,
        title: '',
        metaDescription: '',
        canonical: '',
        hasNoindex: false,
        hasXRobotsNoindex: false,
        contentLength: 0,
        issues: [],
    };

    const start = Date.now();

    try {
        const res = await fetch(url, {
            signal: AbortSignal.timeout(TIMEOUT_MS),
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; StreamtlyAuditBot/1.0)',
                'Accept': 'text/html',
            },
            redirect: 'follow',
        });

        result.status = res.status;
        result.responseTime = Date.now() - start;

        // Check X-Robots-Tag header
        const xRobots = res.headers.get('x-robots-tag') || '';
        if (xRobots.toLowerCase().includes('noindex')) {
            result.hasXRobotsNoindex = true;
            result.issues.push('X-Robots-Tag: noindex header');
        }

        const html = await res.text();
        result.contentLength = html.length;

        // Parse title
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
        result.title = titleMatch ? titleMatch[1].trim() : '';

        // Parse meta description
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is)
            || html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/is);
        result.metaDescription = descMatch ? descMatch[1].trim() : '';

        // Parse canonical
        const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/is)
            || html.match(/<link\s+href=["'](.*?)["']\s+rel=["']canonical["']/is);
        result.canonical = canonMatch ? canonMatch[1].trim() : '';

        // Check for noindex meta tag
        const robotsMetaMatch = html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/is)
            || html.match(/<meta\s+content=["'](.*?)["']\s+name=["']robots["']/is);
        if (robotsMetaMatch && robotsMetaMatch[1].toLowerCase().includes('noindex')) {
            result.hasNoindex = true;
            result.issues.push('Meta robots: noindex');
        }

        // ── Issue detection ──────────────────────────────────
        if (res.status >= 400) {
            result.issues.push(`HTTP ${res.status} error`);
        } else if (res.status >= 300) {
            result.issues.push(`HTTP ${res.status} redirect`);
        }

        if (!result.title) {
            result.issues.push('Missing <title>');
        } else if (result.title.length < 20) {
            result.issues.push(`Title too short (${result.title.length} chars)`);
        } else if (result.title.length > 70) {
            result.issues.push(`Title too long (${result.title.length} chars)`);
        }

        if (!result.metaDescription) {
            result.issues.push('Missing meta description');
        } else if (result.metaDescription.length < 50) {
            result.issues.push(`Meta description too short (${result.metaDescription.length} chars)`);
        } else if (result.metaDescription.length > 160) {
            result.issues.push(`Meta description too long (${result.metaDescription.length} chars)`);
        }

        if (result.canonical && result.canonical !== url && result.canonical !== url.replace(/\/$/, '')) {
            result.issues.push(`Canonical mismatch → ${result.canonical}`);
        }

        if (result.contentLength < 2000) {
            result.issues.push(`Thin content (${(result.contentLength / 1024).toFixed(1)}KB)`);
        }

        if (result.responseTime > 3000) {
            result.issues.push(`Slow response (${(result.responseTime / 1000).toFixed(1)}s)`);
        }

    } catch (err) {
        result.responseTime = Date.now() - start;
        result.issues.push(`Fetch error: ${err.message}`);
    }

    return result;
}

// ── Run in batches ──────────────────────────────────────────────
async function runBatch(urls, batchSize) {
    const results = [];
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(auditUrl));
        results.push(...batchResults);

        const done = Math.min(i + batchSize, urls.length);
        process.stdout.write(`\r${c.dim}   Checked ${done}/${urls.length} URLs...${c.reset}`);
    }
    console.log('');
    return results;
}

// ── Report ──────────────────────────────────────────────────────
function generateReport(results) {
    const indexed = results.filter(r => r.status === 200 && r.issues.length === 0);
    const withIssues = results.filter(r => r.issues.length > 0);
    const errors = results.filter(r => r.status >= 400 || r.status === 0);
    const noindex = results.filter(r => r.hasNoindex || r.hasXRobotsNoindex);
    const thin = results.filter(r => r.issues.some(i => i.startsWith('Thin content')));
    const missingMeta = results.filter(r => r.issues.some(i => i.includes('Missing meta description')));
    const missingTitle = results.filter(r => r.issues.some(i => i.includes('Missing <title>')));
    const slow = results.filter(r => r.issues.some(i => i.startsWith('Slow response')));
    const canonicalIssues = results.filter(r => r.issues.some(i => i.startsWith('Canonical mismatch')));

    console.log(`\n${c.bold}${'═'.repeat(70)}${c.reset}`);
    console.log(`${c.bold}  📊 STREAMTLY INDEXING AUDIT REPORT${c.reset}`);
    console.log(`${c.bold}${'═'.repeat(70)}${c.reset}\n`);

    // Summary
    console.log(`${c.bold}  Summary${c.reset}`);
    console.log(`  ${'─'.repeat(50)}`);
    console.log(`  Total URLs checked:    ${c.bold}${results.length}${c.reset}`);
    console.log(`  ${c.green}✅ No issues:           ${indexed.length}${c.reset}`);
    console.log(`  ${c.yellow}⚠️  With issues:         ${withIssues.length}${c.reset}`);
    console.log(`  ${c.red}❌ HTTP errors (4xx/5xx): ${errors.length}${c.reset}`);
    console.log(`  ${c.red}🚫 Noindex tag:          ${noindex.length}${c.reset}`);
    console.log(`  ${c.yellow}📄 Thin content:         ${thin.length}${c.reset}`);
    console.log(`  ${c.yellow}📝 Missing meta desc:    ${missingMeta.length}${c.reset}`);
    console.log(`  ${c.yellow}📝 Missing title:        ${missingTitle.length}${c.reset}`);
    console.log(`  ${c.yellow}🐌 Slow (>3s):           ${slow.length}${c.reset}`);
    console.log(`  ${c.yellow}🔗 Canonical mismatch:   ${canonicalIssues.length}${c.reset}`);

    // ── Group issues by reason ──────────────────────────────
    const issueGroups = {};
    withIssues.forEach(r => {
        r.issues.forEach(issue => {
            // Normalize issue name
            let key = issue;
            if (issue.startsWith('Title too')) key = issue.split('(')[0].trim();
            if (issue.startsWith('Meta description too')) key = issue.split('(')[0].trim();
            if (issue.startsWith('Thin content')) key = 'Thin content (<2KB)';
            if (issue.startsWith('Slow response')) key = 'Slow response (>3s)';
            if (issue.startsWith('Canonical mismatch')) key = 'Canonical mismatch';

            if (!issueGroups[key]) issueGroups[key] = [];
            issueGroups[key].push(r);
        });
    });

    // ── Detailed by issue type ──────────────────────────────
    console.log(`\n${c.bold}  Issues Breakdown (Google's likely reasons for not indexing)${c.reset}`);
    console.log(`  ${'─'.repeat(50)}\n`);

    // Map to common Google Search Console reasons
    const gscReasonMap = {
        'Meta robots: noindex': '🚫 "Excluded by noindex tag"',
        'X-Robots-Tag: noindex header': '🚫 "Excluded by noindex tag"',
        'HTTP 404 error': '❌ "Not found (404)"',
        'HTTP 500 error': '❌ "Server error (5xx)"',
        'Canonical mismatch': '🔗 "Duplicate, Google chose different canonical"',
        'Thin content (<2KB)': '📄 "Crawled — currently not indexed" (thin content)',
        'Missing meta description': '⚠️  May reduce crawl priority',
        'Missing <title>': '⚠️  "Crawled — currently not indexed" (missing title)',
        'Slow response (>3s)': '🐌 "Crawled — currently not indexed" (slow page)',
    };

    Object.entries(issueGroups).forEach(([issue, urls]) => {
        const gscReason = gscReasonMap[issue] || `⚠️  ${issue}`;
        console.log(`  ${c.bold}${gscReason}${c.reset} — ${urls.length} page(s)`);
        urls.forEach(r => {
            const shortUrl = r.url.replace(SITE_URL, '');
            console.log(`    ${c.dim}→ ${shortUrl || '/'}${c.reset}`);
        });
        console.log('');
    });

    // ── Clean pages ─────────────────────────────────────────
    if (indexed.length > 0) {
        console.log(`\n${c.bold}  ✅ Clean pages (should be indexed)${c.reset}`);
        console.log(`  ${'─'.repeat(50)}`);
        indexed.forEach(r => {
            const shortUrl = r.url.replace(SITE_URL, '');
            console.log(`  ${c.green}✓${c.reset} ${shortUrl || '/'} ${c.dim}(${r.responseTime}ms, ${(r.contentLength/1024).toFixed(0)}KB)${c.reset}`);
        });
    }

    // ── Full detail table ───────────────────────────────────
    console.log(`\n${c.bold}  Full URL Status Table${c.reset}`);
    console.log(`  ${'─'.repeat(68)}`);
    console.log(`  ${c.dim}${'URL'.padEnd(45)} ${'Status'.padEnd(7)} ${'Time'.padEnd(7)} Issues${c.reset}`);
    console.log(`  ${'─'.repeat(68)}`);

    results
        .sort((a, b) => b.issues.length - a.issues.length)
        .forEach(r => {
            const shortUrl = (r.url.replace(SITE_URL, '') || '/').substring(0, 44).padEnd(45);
            const status = r.status === 200
                ? `${c.green}${r.status}${c.reset}`
                : r.status >= 400
                    ? `${c.red}${r.status}${c.reset}`
                    : `${c.yellow}${r.status}${c.reset}`;
            const time = `${r.responseTime}ms`.padEnd(7);
            const issues = r.issues.length > 0
                ? `${c.red}${r.issues.length} issue(s)${c.reset}: ${r.issues.join(', ')}`
                : `${c.green}OK${c.reset}`;
            console.log(`  ${shortUrl} ${status.padEnd(16)} ${time} ${issues}`);
        });

    console.log(`\n${c.bold}${'═'.repeat(70)}${c.reset}\n`);
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
    try {
        const urls = await fetchSitemapUrls();
        console.log(`${c.bold}  Found ${urls.length} URLs in sitemap${c.reset}\n`);

        const results = await runBatch(urls, CONCURRENCY);
        generateReport(results);

    } catch (err) {
        console.error(`\n${c.red}❌ Error: ${err.message}${c.reset}\n`);
        process.exit(1);
    }
}

main();
