export interface KBEntry {
    keywords: string[]
    content: string
}

export const knowledgeBase: KBEntry[] = [
    {
        keywords: ['price', 'pricing', 'cost', 'plan', 'plans', 'how much', 'subscription', 'monthly', 'cheap'],
        content: `
## Streamtly Pricing Plans

| Plan | Duration | Total Price | Per Month |
|------|----------|-------------|-----------|
| Starter | 1 Month | $13.00 | $13.00 |
| Standard | 3 Months | $29.00 | $9.67 |
| Premium | 6 Months | $49.00 | $8.17 |
| Annual | 12 Months | $69.00 | $5.75 |

All plans include: 35,000+ live channels, 150,000+ VODs, 4K Ultra HD, all PPV events, EPG guide, 24/7 support.
No contracts. Cancel anytime. 7-day money-back guarantee.
Payment methods: PayPal, Crypto (BTC, ETH, USDT and 100+ coins).
`,
    },
    {
        keywords: ['firestick', 'fire stick', 'fire tv', 'amazon', 'downloader', 'apk'],
        content: `
## How to Install Streamtly on Firestick / Fire TV

1. On your Firestick, go to **Settings → My Fire TV → Developer Options**
2. Enable **"Apps from Unknown Sources"**
3. Go back to the home screen and open the **Downloader** app (install from App Store if not present)
4. Enter the URL provided in your activation email to download the IPTV app APK
5. Install the APK and open the app
6. Enter your **Username**, **Password**, and **Server URL** from your dashboard
7. Select your channel package and start streaming

**Pro Tip:** Use a 5GHz Wi-Fi band or Ethernet adapter for buffer-free 4K streaming.
Full guide: https://streamtly.com/guides/android
`,
    },
    {
        keywords: ['android', 'android tv', 'android box', 'google tv', 'nvidia shield', 'apk', 'sideload'],
        content: `
## How to Install Streamtly on Android TV / Android Box

1. Open **Settings → Security** and enable **"Unknown Sources"**
2. Download a file manager app (e.g., CX File Explorer) from the Play Store
3. In the file manager, navigate to your downloads and install the Streamtly APK
4. Alternatively, install **IPTV Smarters Pro** or **TiviMate** from the Play Store
5. Open the app and enter your Xtream Codes credentials (username, password, server URL)
6. All your channels and VOD will load automatically

**Pro Tip:** TiviMate Premium gives the best EPG experience with a 7-day schedule grid.
Full guide: https://streamtly.com/guides/android
`,
    },
    {
        keywords: ['smart tv', 'samsung', 'lg', 'hisense', 'sony', 'tizen', 'webos'],
        content: `
## How to Install Streamtly on Smart TV (Samsung / LG / Hisense / Sony)

**Samsung (Tizen):**
1. Go to **Smart Hub → Apps → Search** for "IPTV Smarters" or use the browser method
2. Alternatively, enable Developer Mode in Samsung settings and sideload the app

**LG (webOS):**
1. Open the **LG Content Store** and search for an IPTV app
2. Or use the built-in browser to access your M3U playlist URL directly

**All Smart TVs:**
1. Open your IPTV app and select **"Add Playlist / Xtream Codes"**
2. Enter your Streamtly credentials (username, password, server URL from your dashboard)
3. Wait for the channel list to load (30–60 seconds first time)

Full guide: https://streamtly.com/guides/smart-tv
`,
    },
    {
        keywords: ['iphone', 'ipad', 'ios', 'apple', 'gseplayer', 'gse', 'infuse', 'vlc'],
        content: `
## How to Install Streamtly on iPhone / iPad (iOS)

1. Open the **App Store** and download **GSE Smart IPTV** or **IPTV Smarters Pro**
2. Open the app and tap **"Remote Playlists"** or **"Xtream Codes"**
3. Enter your Streamtly **Username**, **Password**, and **Server URL** (from your dashboard email)
4. Tap Load and wait for channels to appear
5. Browse the EPG guide and start watching

**Pro Tip:** GSE Smart IPTV supports PiP (Picture-in-Picture) mode — watch while using other apps.
Full guide: https://streamtly.com/guides/ios
`,
    },
    {
        keywords: ['windows', 'mac', 'pc', 'laptop', 'desktop', 'computer', 'vlc', 'kodi', 'browser'],
        content: `
## How to Watch Streamtly on Windows / Mac

**Option 1 — VLC Media Player (Recommended):**
1. Download and install **VLC** from videolan.org
2. Open VLC → **Media → Open Network Stream**
3. Paste your M3U playlist URL (found in your dashboard)
4. Click Play — all channels load immediately

**Option 2 — Kodi:**
1. Install Kodi and add the **PVR IPTV Simple Client** addon
2. Configure it with your M3U URL or Xtream Codes credentials

**Option 3 — IPTV Smarters for PC** (Windows only):
1. Download from the Microsoft Store
2. Enter Xtream Codes credentials

Full guide: https://streamtly.com/guides/windows
`,
    },
    {
        keywords: ['mag', 'mag box', 'mag254', 'mag256', 'mag322', 'mag420', 'portal', 'stalker'],
        content: `
## How to Set Up Streamtly on MAG Box

1. On your MAG remote, go to **Settings → System Settings → Servers**
2. Under **"Portal URL"**, enter your Streamtly portal URL (provided in your activation email)
3. Save settings and restart the MAG box
4. The Streamtly channel list will load on startup

**Supported MAG models:** 250, 254, 256, 322, 420 and newer
**Note:** Ensure your MAG box MAC address is registered — contact support if activation fails.
Full guide: https://streamtly.com/guides/mag
`,
    },
    {
        keywords: ['enigma', 'enigma2', 'dreambox', 'vu+', 'zgemma', 'octagon', 'satellite', 'openatv', 'e2'],
        content: `
## How to Set Up Streamtly on Enigma2 / Satellite Receiver

1. Install the **E2M3U2Bouquet** plugin via your image's plugin manager
2. Configure the plugin with your M3U URL or Xtream Codes credentials
3. Alternatively, use **OpenWebif** to upload bouquets directly
4. Restart the receiver — Streamtly channels appear in your bouquet list

**Supported devices:** Dreambox, Vu+, Zgemma, Octagon, Mut@nt
Full guide: https://streamtly.com/guides/enigma2
`,
    },
    {
        keywords: ['buffering', 'buffer', 'freezing', 'lagging', 'slow', 'stuttering', 'loading', 'spinning'],
        content: `
## Fixing Buffering / Freezing Issues

**Step 1 — Check your internet speed:**
- Minimum: 10 Mbps for HD | 25 Mbps for 4K
- Test at fast.com or speedtest.net

**Step 2 — Switch to a wired connection:**
- Use an Ethernet cable instead of Wi-Fi where possible
- If Wi-Fi only, use 5GHz band (not 2.4GHz)

**Step 3 — Change the server:**
- Open your IPTV app settings
- Switch from your current server to the backup server URL in your dashboard

**Step 4 — Reduce stream quality:**
- In your IPTV app, change quality from 4K/UHD to 1080p or Auto
- Streamtly's Adaptive Bitrate (ABR) will then manage this automatically

**Step 5 — Clear app cache:**
- Android/Firestick: Settings → Apps → [IPTV app] → Clear Cache
- Restart the app

If buffering persists after all steps: support@streamtly.com
`,
    },
    {
        keywords: ['black screen', 'no picture', 'no image', 'channel not working', 'not loading', 'error'],
        content: `
## Fixing Black Screen / Channel Not Working

1. **Check credentials** — Go to your dashboard and verify username/password/server URL are entered correctly (no spaces)
2. **Check subscription status** — Log in at streamtly.com/app to confirm your subscription is active
3. **Try a different channel** — If only one channel is black, it may be temporarily offline. Try another in the same category
4. **Restart the app** — Force close and reopen your IPTV application
5. **Check server URL** — Ensure you are using the correct server URL from your activation email (not an old one)
6. **Reboot your device** — A full device restart clears most temporary issues

Still black? Contact: support@streamtly.com with your username and the channel name
`,
    },
    {
        keywords: ['epg', 'guide', 'program guide', 'tv guide', 'schedule', 'no epg', 'missing guide'],
        content: `
## EPG (Electronic Program Guide) Setup & Troubleshooting

**What is EPG?**
EPG is the on-screen TV schedule guide showing what's on now and upcoming on each channel.

**To enable EPG:**
1. In your IPTV app, go to **Settings → EPG / XMLTV**
2. Enter the EPG URL from your dashboard (or it loads automatically with Xtream Codes)
3. Set refresh interval to **24 hours**
4. Force refresh EPG data

**EPG not showing?**
- Ensure your app supports EPG (TiviMate, IPTV Smarters, GSE all support it)
- Allow 2–5 minutes for first load
- Check the EPG URL is correct in app settings

**Streamtly EPG provides:** 7-day schedule for all supported channels
`,
    },
    {
        keywords: ['vpn', 'blocked', 'restricted', 'region', 'country', 'access'],
        content: `
## VPN & Regional Access

**Do I need a VPN for Streamtly?**
No. Streamtly works without a VPN in all regions. Our servers use advanced encryption and security protocols.

**Can I use a VPN with Streamtly?**
Yes. Streamtly is fully compatible with all major VPN providers. A VPN may actually improve performance if your ISP throttles streaming traffic.

**Recommended if:** You experience ISP throttling or want additional privacy. Use a server close to your physical location for lowest latency.

**Channels blocked in your region?** Our international package includes 50+ country packages. Contact support to switch your channel package at no extra cost.
`,
    },
    {
        keywords: ['activation', 'activate', 'credentials', 'username', 'password', 'server url', 'not received', 'email'],
        content: `
## Activation & Credentials

**How long does activation take?**
Instant. Credentials are sent to your email and appear in your dashboard within seconds of payment confirmation.

**Where do I find my credentials?**
1. Check your email inbox (including spam/junk folder)
2. Log in at streamtly.com/app — your credentials are in your dashboard

**Credentials format:**
- **Username:** provided in activation email
- **Password:** provided in activation email
- **Server URL:** provided in activation email (starts with http://)
- **M3U URL:** available in your dashboard

**Not received after 15 minutes?** Contact: support@streamtly.com
`,
    },
    {
        keywords: ['refund', 'money back', 'guarantee', 'cancel', 'return'],
        content: `
## Refund Policy

Streamtly offers a **7-day money-back guarantee** on all plans.

**Eligible for refund if:**
- You request within 7 days of purchase
- You have used less than 30% of your subscription period
- Technical issues could not be resolved by support

**How to request a refund:**
1. Email support@streamtly.com with subject "Refund Request"
2. Include your order email and reason
3. Refunds processed within 3–5 business days

Full policy: https://streamtly.com/refund
`,
    },
    {
        keywords: ['channels', 'sports', 'ppv', 'nba', 'nfl', 'premier league', 'ufc', 'boxing', 'espn', 'tnt'],
        content: `
## Channels & Sports Coverage

**Total channels:** 35,000+ live channels across 50+ countries

**Sports channels included:**
- ESPN, ESPN2, ESPN+
- TNT, TBS
- NBC Sports, CBS Sports, Fox Sports
- Sky Sports (all channels)
- beIN Sports, BT Sport
- NFL Network, NBA TV, MLB Network, NHL Network

**Live sports included in all plans:**
- NFL (all games)
- NBA (all games + playoffs)
- Premier League, Champions League, Europa League
- UFC & Boxing PPV events
- F1, MotoGP, NASCAR
- Tennis (Wimbledon, US Open, French Open)

**PPV events:** All included at no extra charge — no separate purchase needed.
`,
    },
    {
        keywords: ['contact', 'support', 'help', 'ticket', 'whatsapp', 'email'],
        content: `
## Contact & Support

**24/7 Customer Support:**
- **Email:** support@streamtly.com
- **WhatsApp:** +44 7520 695452
- **Live Chat:** Available at streamtly.com/contact

**Support handles:**
- Technical troubleshooting
- Activation issues
- Channel package changes
- Billing and refunds
- Device-specific setup help

**Response time:** Email within 2 hours | WhatsApp typically under 30 minutes
`,
    },
]

export function searchKB(query: string): string {
    const q = query.toLowerCase()
    const matched = knowledgeBase.filter(entry =>
        entry.keywords.some(kw => q.includes(kw))
    )
    if (matched.length === 0) return ''
    return matched.map(e => e.content).join('\n\n---\n\n')
}
