// 2026 SEO Strategy: Static Site Indexing CLI
import { google } from 'googleapis';
import fetch from 'node-fetch'; // Required for Node < 18, or just native fetch in modern Node
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function submitToGoogle(url, type = 'URL_UPDATED') {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn('⚠️ [Google] Skipping Indexing API (Missing Credentials in .env.local)');
        return;
    }

    try {
        const jwtClient = new google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        await jwtClient.authorize();
        const indexing = google.indexing({ version: 'v3', auth: jwtClient });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: type, // 'URL_UPDATED' or 'URL_DELETED'
            }
        });
        console.log(`✅ [Google] Successfully submitted ${url} - Status: ${res.status}`);
    } catch (error) {
        console.error(`❌ [Google] Error submitting ${url}`);
        console.error(error.message);
    }
}

async function submitToIndexNow(url) {
    const key = process.env.INDEXNOW_API_KEY;
    if (!key) {
        console.warn('⚠️ [IndexNow] Skipping IndexNow (Missing INDEXNOW_API_KEY in .env.local)');
        return;
    }

    const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${key}`;

    try {
        const res = await fetch(endpoint);
        if (res.ok) {
            console.log(`✅ [IndexNow] Successfully submitted ${url} - Status: ${res.status}`);
        } else {
            console.error(`❌ [IndexNow] Failed to submit ${url} - Status: ${res.status}`);
        }
    } catch (error) {
        console.error(`❌ [IndexNow] Error submitting ${url}`);
        console.error(error.message);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const targetUrl = args[0];

    if (!targetUrl) {
        console.error('\n❌ Error: Please provide a URL to index.');
        console.log('\nUsage:');
        console.log('  npm run index "https://streamtly.com/guides/my-new-post"');
        console.log('  npm run index:delete "https://streamtly.com/guides/old-post"\n');
        process.exit(1);
    }

    // Check if the user passed an explicit "DELETE" command flag (e.g., in package.json)
    const isDelete = process.env.INDEX_ACTION === 'DELETE';
    const actionType = isDelete ? 'URL_DELETED' : 'URL_UPDATED';

    console.log(`\n🚀 Submitting ${targetUrl} [Action: ${actionType}]...`);

    await Promise.allSettled([
        submitToGoogle(targetUrl, actionType),
        submitToIndexNow(targetUrl)
    ]);

    console.log('🎉 Done!\n');
}

main();
