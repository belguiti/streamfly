import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download, CheckCircle2, AlertCircle, Lightbulb, ExternalLink } from 'lucide-react'
import { SITE_URL } from '@/lib/site-config'

// ── Guide data ────────────────────────────────────────────────────────────────

const GUIDES: Record<string, GuideData> = {
    'smart-tv': {
        title: 'Smart TV Setup Guide',
        subtitle: 'Samsung, LG, Hisense, Sony & more',
        emoji: '📺',
        color: '#1428a0',
        description: 'Set up your Streamtly IPTV subscription on any Smart TV using IPTV Smarters or Smart IPTV app.',
        apps: [
            { name: 'IPTV Smarters Pro', platform: 'Samsung & LG', note: 'Recommended — supports Xtream Codes', url: null },
            { name: 'Smart IPTV', platform: 'Samsung (Tizen)', note: 'Simple M3U setup', url: null },
            { name: 'TiviMate', platform: 'Android TV', note: 'Best UI experience', url: null },
        ],
        sections: [
            {
                title: 'Method 1 — IPTV Smarters (Xtream Codes)',
                color: '#00d4ff',
                steps: [
                    'Open your Smart TV App Store (Samsung: Smart Hub → Apps, LG: LG Content Store).',
                    'Search for "IPTV Smarters Pro" and install it.',
                    'Open the app and tap "Add New User".',
                    'Select login type: "Xtream Codes API".',
                    'Enter your Server URL, Username, and Password from your dashboard.',
                    'Tap "Add User" — the channel list will load (1–2 min on first run).',
                    'Browse by category, enable EPG for the TV guide, and enjoy!',
                ],
            },
            {
                title: 'Method 2 — M3U Playlist URL',
                color: '#00e5a0',
                steps: [
                    'Install "Smart IPTV" or any M3U-compatible player from your TV app store.',
                    'Copy your M3U Plus URL from the dashboard credentials section.',
                    'Open the app and look for "Add playlist" or "Load M3U".',
                    'Paste the M3U Plus URL and confirm.',
                    'Wait for the playlist to load — this may take a few minutes.',
                    'Use the EPG URL from your dashboard for the TV guide.',
                ],
            },
        ],
        tips: [
            'Use M3U Plus (not basic M3U) for the best compatibility and EPG data.',
            'If channels buffer, try lowering the video quality in the app settings.',
            'Connect via Ethernet cable instead of Wi-Fi for the most stable stream.',
            'EPG (TV Guide) URL is found in your dashboard under "EPG & Portal" section.',
        ],
    },

    'android': {
        title: 'Android Setup Guide',
        subtitle: 'Android Box, Firestick, Android Phone & Tablet',
        emoji: '📦',
        color: '#3ddc84',
        description: 'Install and configure IPTV on Android Box, Firestick, Android phones and tablets.',
        apps: [
            { name: '8K Player Plus', platform: 'Firestick / Android TV', note: '⭐ Recommended — optimized for 8K/4K IPTV. Code: 1240465', url: 'https://bit.ly/4muCvw4' },
            { name: 'TiviMate 8K', platform: 'Firestick / Android TV', note: 'Best EPG guide experience. Code: 1969685', url: 'http://aftv.news/1969685' },
            { name: 'IPTV Smarters Pro', platform: 'All Android', note: 'Works on phone, tablet, box & Firestick', url: null },
            { name: '8K Player Vip+', platform: 'Firestick / Android TV', note: 'Premium version. Code: 6883465', url: 'https://bit.ly/4myPgGi' },
            { name: '8K Player Prime', platform: 'Firestick / Android TV', note: 'Advanced features. Code: 1050263', url: 'https://bit.ly/3ID17VG' },
            { name: 'TiviMate', platform: 'Android TV / Box', note: 'Standard version — Google Play', url: null },
        ],
        sections: [
            {
                title: 'Method 1 — 8K Player (Recommended for Firestick)',
                color: '#00d4ff',
                steps: [
                    'On your Firestick: Settings → My Fire TV → Developer Options → Apps from Unknown Sources: ON.',
                    'Install the "Downloader" app from the Amazon App Store (it\'s free).',
                    'Open Downloader and enter code: 1240465 (8K Player Plus) or go to bit.ly/4muCvw4.',
                    'Download and install the 8K Player APK.',
                    'Open 8K Player and tap "Add Playlist" or "M3U".',
                    'Select "Xtream Codes" and enter your Server URL, Username, and Password from your dashboard.',
                    'Your full channel list and VOD will load automatically. Enjoy!',
                ],
            },
            {
                title: 'Method 2 — TiviMate 8K (Best EPG Experience)',
                color: '#ff9900',
                steps: [
                    'On your Firestick, open the Downloader app.',
                    'Enter code: 1969685 or go to http://aftv.news/1969685.',
                    'Download and install TiviMate 8K.',
                    'Open TiviMate and tap "Add Playlist".',
                    'Select "Xtream Codes" — enter your Server URL, Username, and Password.',
                    'Go to Settings → EPG and paste your EPG URL from the dashboard.',
                    'Enjoy a full TV-guide interface with 7-day schedule.',
                ],
            },
            {
                title: 'Method 3 — IPTV Smarters Pro (Android Phone/Tablet)',
                color: '#00e5a0',
                steps: [
                    'Install "IPTV Smarters Pro" from the Google Play Store.',
                    'Open the app and tap "Add New User".',
                    'Choose "Xtream Codes API" as login type.',
                    'Enter your Server URL, Username, and Password from your dashboard.',
                    'Tap "Add User" — channels load automatically.',
                    'Use the EPG tab to see the TV guide.',
                ],
            },
        ],
        tips: [
            '8K Player is specifically optimized for high-quality IPTV streams — use it for Firestick.',
            'TiviMate 8K gives the best Smart TV-like EPG guide with a proper 7-day schedule.',
            'For Firestick, press the menu button (≡) on the remote to access player options.',
            'Enable "Hardware Decoding" in app settings for smoother 4K and 8K playback.',
            'Use the Downloader codes (e.g. 1240465) for the fastest Firestick installation.',
        ],
    },

    'ios': {
        title: 'iPhone & iPad Setup Guide',
        subtitle: 'iOS 14+ required',
        emoji: '🍎',
        color: '#007aff',
        description: 'Watch IPTV on your iPhone or iPad using IPTV Smarters Pro or GSE Smart IPTV.',
        apps: [
            { name: 'IPTV Smarters Pro', platform: 'iPhone & iPad', note: 'Free — supports Xtream Codes login', url: null },
            { name: 'GSE Smart IPTV', platform: 'iPhone & iPad', note: 'Full-featured M3U & Xtream player', url: null },
            { name: 'Flex IPTV', platform: 'iPhone & iPad', note: 'Clean interface, AirPlay support', url: null },
        ],
        sections: [
            {
                title: 'Method 1 — IPTV Smarters Pro',
                color: '#007aff',
                steps: [
                    'Open the App Store on your iPhone or iPad.',
                    'Search for "IPTV Smarters Pro" and install it (free).',
                    'Open the app and tap the "+" icon or "Add New User".',
                    'Select "Xtream Codes API" as the login type.',
                    'Enter your Server URL, Username, and Password from your dashboard.',
                    'Tap "Add User" — your channels and VOD will load.',
                    'Use the EPG tab for the TV guide.',
                ],
            },
            {
                title: 'Method 2 — GSE Smart IPTV (M3U)',
                color: '#00e5a0',
                steps: [
                    'Download "GSE Smart IPTV" from the App Store.',
                    'Open the app and go to "Remote Playlists".',
                    'Tap "+" and select "Add M3U URL".',
                    'Paste your M3U Plus URL from the dashboard.',
                    'Name the playlist (e.g. "Streamtly") and save.',
                    'Go back to the main screen — channels will appear under categories.',
                    'For the EPG guide, add your EPG URL under Settings → EPG.',
                ],
            },
        ],
        tips: [
            'Use Wi-Fi for best streaming quality. 5GHz Wi-Fi is recommended.',
            'AirPlay lets you cast from your iPhone to an Apple TV or AirPlay-compatible TV.',
            'Enable background audio in your phone settings to keep IPTV playing while switching apps.',
            'If a channel buffers, tap Settings inside the app and reduce the buffer size.',
        ],
    },

    'windows': {
        title: 'Windows & Mac Setup Guide',
        subtitle: 'Desktop & Laptop computers',
        emoji: '💻',
        color: '#00d4ff',
        description: 'Stream IPTV on your Windows PC or Mac using VLC, IPTV Smarters, or a dedicated player.',
        apps: [
            { name: '8K Player (Windows 11)', platform: 'Windows 11', note: '⭐ Recommended — dedicated IPTV player', url: 'http://download.exchange-cdn.com/apk_8k_win/8K.Player.Setup.0.2.0.Windows11.exe' },
            { name: '8K Player (Windows 10)', platform: 'Windows 10', note: '⭐ Recommended — dedicated IPTV player', url: 'http://download.exchange-cdn.com/apk_8k_win/8K.Player.Setup.0.2.0.Windows10.exe' },
            { name: '8K Player (macOS)', platform: 'macOS', note: 'Native Mac IPTV app', url: 'http://download.best-ott.me/apk_gold/8k.PLAYER.OS-1.0.0.dmg' },
            { name: '4K Player (macOS)', platform: 'macOS', note: 'Upload playlist via billing system. Code: 9285892', url: 'http://aftv.news/9285892' },
            { name: 'VLC Media Player', platform: 'Windows & Mac', note: 'Free, open-source — paste M3U URL directly', url: 'https://www.videolan.org/vlc/' },
            { name: 'Kodi + PVR IPTV', platform: 'Windows & Mac', note: 'Advanced setup with full EPG', url: 'https://kodi.tv/download' },
        ],
        sections: [
            {
                title: 'Method 1 — 8K Player for Windows (Recommended)',
                color: '#00d4ff',
                steps: [
                    'Download 8K Player for your Windows version — Windows 10 or Windows 11 (see download buttons above).',
                    'Run the installer and complete the setup.',
                    'Open 8K Player and click "Add Playlist" or the + button.',
                    'Select "Xtream Codes" login type.',
                    'Enter your Server URL, Username, and Password from your dashboard.',
                    'Click Confirm — your full channel list and VOD library will load.',
                    'Use the EPG section to see the full 7-day TV guide.',
                ],
            },
            {
                title: 'Method 2 — 8K Player for macOS',
                color: '#a78bfa',
                steps: [
                    'Download the 8K Player .dmg file for macOS (link above).',
                    'Open the .dmg and drag 8K Player to your Applications folder.',
                    'Open 8K Player. If macOS blocks it: System Preferences → Security → "Open Anyway".',
                    'Click "Add Playlist" and select "Xtream Codes".',
                    'Enter your Server URL, Username, and Password from your dashboard.',
                    'Your channels will load. Use EPG for the full TV guide.',
                ],
            },
            {
                title: 'Method 3 — VLC Media Player (Quick Test)',
                color: '#ff8800',
                steps: [
                    'Download and install VLC from videolan.org (free, Windows & Mac).',
                    'Open VLC and go to Media → Open Network Stream (Ctrl+N on Windows, Cmd+N on Mac).',
                    'Paste your M3U Plus URL from the dashboard and click Play.',
                    'VLC will load your full channel list in the playlist panel.',
                    'Go to View → Playlist to browse channels.',
                    'Double-click any channel to start watching.',
                ],
            },
            {
                title: 'Method 4 — Kodi with PVR IPTV (Advanced)',
                color: '#00e5a0',
                steps: [
                    'Download and install Kodi from kodi.tv.',
                    'Open Kodi → Settings → Add-ons → Install from repository.',
                    'Go to Kodi Add-on repository → PVR Clients → PVR IPTV Simple Client → Install.',
                    'After installation, go to Settings → PVR IPTV Simple Client → General.',
                    'Set M3U playlist URL to your M3U Plus URL from the dashboard.',
                    'Set EPG URL to your EPG URL from the dashboard.',
                    'Restart Kodi — Live TV will appear in the main menu.',
                ],
            },
        ],
        tips: [
            '8K Player is the recommended app — it\'s optimized for high-quality IPTV streams on Windows and Mac.',
            'VLC is the fastest way to test — just paste the M3U URL and play instantly.',
            'macOS users: if the .dmg is blocked, go to System Preferences → Security & Privacy → Open Anyway.',
            'Use the Web TV player at http://8k.webplayer-only.com for instant browser-based testing.',
            'Ensure your internet connection is at least 25 Mbps for stable 4K streams.',
        ],
    },

    'mag': {
        title: 'MAG Device Setup Guide',
        subtitle: 'MAG 250, 254, 256, 322, 351, 420 & more',
        emoji: '📡',
        color: '#f59e0b',
        description: 'Configure your Streamtly service on MAG set-top boxes using the Portal URL.',
        apps: [
            { name: 'Built-in Portal', platform: 'All MAG devices', note: 'No extra app needed — uses the device portal', url: null },
        ],
        sections: [
            {
                title: 'MAG Portal Setup (All Models)',
                color: '#f59e0b',
                steps: [
                    'On your MAG remote, press the Menu button or go to Settings.',
                    'Navigate to System Settings → Servers → Portals.',
                    'In the "Portal 1 URL" field, enter your Portal URL from the dashboard.',
                    'Leave the portal name as anything (e.g. "Streamtly").',
                    'Press OK to save, then go back to the main menu.',
                    'Select "Portal 1" from the menu — the Streamtly interface will load.',
                    'Enter your Username and Password when prompted.',
                    'Your full channel list and EPG guide will appear.',
                ],
            },
            {
                title: 'If Your MAG Asks for a MAC Address',
                color: '#00d4ff',
                steps: [
                    'Go to Settings → System Information on your MAG device.',
                    'Note down the MAC address (format: AA:BB:CC:DD:EE:FF).',
                    'Contact our support team at support@streamtly.com with your MAC address.',
                    'We will link your subscription to your device MAC address.',
                    'Once confirmed, your portal will load automatically on device startup.',
                ],
            },
        ],
        tips: [
            'Your Portal URL is listed in the dashboard under "EPG & Portal" section.',
            'MAG devices work best on a wired Ethernet connection for stable streams.',
            'If the portal does not load, double-check the URL — no spaces or extra characters.',
            'Some MAG models require a reboot after changing portal settings.',
            'For older MAG models (250/254), use the Stalker Middleware URL format.',
        ],
    },

    'enigma2': {
        title: 'Enigma2 / Satellite Setup Guide',
        subtitle: 'Dreambox, Vu+, Zgemma, Octagon & compatible receivers',
        emoji: '🛰️',
        color: '#8b5cf6',
        description: 'Set up IPTV on your Enigma2 satellite receiver using the E2M3U2Bouquet plugin or IPTV Bouquet Maker.',
        apps: [
            { name: 'E2M3U2Bouquet Plugin', platform: 'All Enigma2 boxes', note: 'Recommended — converts M3U to bouquets', url: null },
            { name: 'IPTV Bouquet Maker', platform: 'Enigma2', note: 'Web-based alternative', url: null },
            { name: 'OpenWebif', platform: 'All Enigma2 boxes', note: 'Web interface for remote management', url: null },
        ],
        sections: [
            {
                title: 'Method 1 — E2M3U2Bouquet Plugin (Recommended)',
                color: '#8b5cf6',
                steps: [
                    'On your Enigma2 box, open the Plugin Browser (Blue button → Plugins).',
                    'Go to "Plugin Browser" → search for "E2M3U2Bouquet" and install it.',
                    'If not found in the feed, SSH into the box and run: opkg install enigma2-plugin-extensions-e2m3u2bouquet',
                    'After installation, open the plugin from the Plugin menu.',
                    'Enter your M3U Plus URL from the dashboard in the "M3U URL" field.',
                    'Enter your EPG URL from the dashboard in the "XMLTV EPG URL" field.',
                    'Press "OK" to save and download bouquets — this takes 1–2 minutes.',
                    'Restart the channel scan. Your IPTV channels appear as a new bouquet.',
                ],
            },
            {
                title: 'Method 2 — Manual Bouquet via OpenWebif',
                color: '#00e5a0',
                steps: [
                    'Find your receiver\'s IP address in Menu → Setup → System → Network.',
                    'Open a browser on your PC and go to http://[your-receiver-ip].',
                    'Log in to the OpenWebif interface (default: no password).',
                    'Go to the "Bouquet Editor" or use a plugin like IPTV Bouquet Maker.',
                    'Add your M3U Plus URL as the IPTV source.',
                    'Save the bouquet and restart the channel list on the receiver.',
                ],
            },
            {
                title: 'Configuring EPG (TV Guide)',
                color: '#f59e0b',
                steps: [
                    'Install the "CrossEPG" plugin from the Plugin Browser.',
                    'Open CrossEPG settings and add your EPG URL from the dashboard.',
                    'Set the download schedule to "Daily" for automatic updates.',
                    'Run a manual EPG download to populate the guide immediately.',
                    'Your Enigma2 EPG guide will show programme info for all IPTV channels.',
                ],
            },
        ],
        tips: [
            'SSH access makes setup much easier. Default SSH credentials are usually root / dreambox.',
            'Use M3U Plus URL (not basic M3U) for category grouping in bouquets.',
            'After each bouquet update, do a short restart (not full reboot) to apply changes.',
            'If EPG is missing for some channels, check that the channel names match the EPG source.',
            'Zgemma and Octagon boxes running OpenATV/OpenPLi work best with E2M3U2Bouquet.',
        ],
    },

    'players': {
        title: 'Recommended IPTV Players',
        subtitle: 'Best apps for every device — Windows, Mac, Firestick, Android, iOS',
        emoji: '🎬',
        color: '#00d4ff',
        description: 'The best IPTV players recommended by Streamtly. Download links, Firestick codes, and setup instructions for all devices.',
        apps: [
            { name: '8K Player Plus (Firestick)', platform: 'Firestick / Android TV', note: 'Code: 1240465 — bit.ly/4muCvw4', url: 'https://bit.ly/4muCvw4' },
            { name: '8K Player Vip+ (Firestick)', platform: 'Firestick / Android TV', note: 'Code: 6883465 — Premium version', url: 'https://bit.ly/4myPgGi' },
            { name: '8K Player Prime (Firestick)', platform: 'Firestick / Android TV', note: 'Code: 1050263 — Advanced features', url: 'https://bit.ly/3ID17VG' },
            { name: 'TiviMate 8K (Firestick)', platform: 'Firestick / Android TV', note: 'Code: 1969685 — Best EPG guide', url: 'http://aftv.news/1969685' },
            { name: '8K Player (Windows 11)', platform: 'Windows 11', note: 'Direct installer download', url: 'http://download.exchange-cdn.com/apk_8k_win/8K.Player.Setup.0.2.0.Windows11.exe' },
            { name: '8K Player (Windows 10)', platform: 'Windows 10', note: 'Direct installer download', url: 'http://download.exchange-cdn.com/apk_8k_win/8K.Player.Setup.0.2.0.Windows10.exe' },
            { name: '8K Player (macOS)', platform: 'macOS', note: '.dmg download', url: 'http://download.best-ott.me/apk_gold/8k.PLAYER.OS-1.0.0.dmg' },
            { name: '4K Player (macOS)', platform: 'macOS', note: 'Code: 9285892 — Upload playlist via billing', url: 'http://aftv.news/9285892' },
            { name: 'Web TV Player', platform: 'Any Browser', note: 'No install — test instantly in browser', url: 'http://8k.webplayer-only.com' },
            { name: 'VLC Media Player', platform: 'Windows & Mac', note: 'Free, open-source — paste M3U URL', url: 'https://www.videolan.org/vlc/' },
        ],
        sections: [
            {
                title: 'Firestick & Android TV — Install via Downloader',
                color: '#ff9900',
                steps: [
                    'On Firestick: Settings → My Fire TV → Developer Options → Apps from Unknown Sources: ON.',
                    'Install the "Downloader" app from the Amazon App Store.',
                    'Open Downloader and enter one of these codes:',
                    '1240465 → 8K Player Plus (recommended)',
                    '1969685 → TiviMate 8K (best EPG)',
                    '6883465 → 8K Player Vip+',
                    '1050263 → 8K Player Prime',
                    'Install the app and enter your Xtream Codes credentials from your dashboard.',
                ],
            },
            {
                title: 'Windows — 8K Player Setup',
                color: '#00d4ff',
                steps: [
                    'Download 8K Player for Windows 10 or Windows 11 using the links above.',
                    'Run the installer — it takes under 1 minute.',
                    'Open 8K Player and click "Add Playlist".',
                    'Choose "Xtream Codes" and enter your Server URL, Username, and Password.',
                    'Your full channel list and VOD library loads automatically.',
                ],
            },
            {
                title: 'macOS — 8K Player Setup',
                color: '#a78bfa',
                steps: [
                    'Download the 8K Player .dmg for macOS using the link above.',
                    'Open the .dmg and drag 8K Player to Applications.',
                    'If macOS blocks it: System Preferences → Security → "Open Anyway".',
                    'Open 8K Player → Add Playlist → Xtream Codes.',
                    'Enter your Server URL, Username, and Password from the dashboard.',
                ],
            },
            {
                title: 'Quick Test — Web TV Player (Any Device)',
                color: '#00e5a0',
                steps: [
                    'Open http://8k.webplayer-only.com in any browser.',
                    'Click "Add Playlist" or the M3U option.',
                    'Paste your M3U Plus URL from your dashboard.',
                    'Your channels will load instantly — no installation required.',
                    'Use this to verify your subscription is working before installing an app.',
                ],
            },
        ],
        tips: [
            '8K Player is the provider-recommended app for the best stream quality.',
            'Use the Web TV Player at 8k.webplayer-only.com to instantly test your credentials in the browser.',
            'Always use M3U Plus (not basic M3U) for better compatibility and EPG data.',
            'For Firestick, codes via Downloader are faster than browsing for APKs manually.',
            'TiviMate 8K is best if you want a proper TV-guide (EPG) with 7-day schedule.',
        ],
    },
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface App {
    name: string
    platform: string
    note: string
    url: string | null
}

interface Section {
    title: string
    color: string
    steps: string[]
}

interface GuideData {
    title: string
    subtitle: string
    emoji: string
    color: string
    description: string
    apps: App[]
    sections: Section[]
    tips: string[]
}

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
    return Object.keys(GUIDES).map(slug => ({ slug }))
}

const GUIDE_KEYWORDS: Record<string, string[]> = {
    'smart-tv': ['IPTV Smart TV setup', 'IPTV Samsung TV', 'IPTV LG TV', 'IPTV Smarters Smart TV', 'Smart IPTV app', 'how to watch IPTV on Smart TV'],
    'android': ['IPTV Firestick setup', 'IPTV Android Box', 'TiviMate IPTV', 'IPTV Smarters Android', 'how to install IPTV on Firestick', 'IPTV Android TV'],
    'ios': ['IPTV iPhone setup', 'IPTV iPad setup', 'IPTV Smarters Pro iOS', 'GSE Smart IPTV iPhone', 'how to watch IPTV on iPhone'],
    'windows': ['IPTV Windows PC', 'IPTV VLC setup', 'IPTV Mac setup', 'IPTV on computer', 'how to watch IPTV on PC', 'IPTV Kodi setup'],
    'mag': ['MAG IPTV setup', 'MAG box portal URL', 'MAG 254 IPTV', 'MAG 322 setup', 'how to set up MAG box'],
    'enigma2': ['Enigma2 IPTV setup', 'Dreambox IPTV', 'Vu+ IPTV', 'Zgemma IPTV', 'E2M3U2Bouquet', 'OpenPLi IPTV setup'],
    'players': ['best IPTV player', '8K Player download', 'TiviMate Firestick', 'IPTV player Windows', 'IPTV player Mac', 'IPTV Firestick code', '8K Player Firestick code'],
}

const GUIDE_FAQS: Record<string, Array<{ q: string; a: string }>> = {
    'smart-tv': [
        { q: 'What is the best IPTV app for Samsung TV?', a: 'IPTV Smarters Pro is the best app for Samsung Smart TVs. It supports Xtream Codes login and M3U playlists, with a built-in EPG guide.' },
        { q: 'How do I install IPTV on my LG TV?', a: 'Search for IPTV Smarters Pro in the LG Content Store, install it, then enter your Server URL, username and password from your Streamtly dashboard.' },
        { q: 'Can I watch IPTV on any Smart TV?', a: 'Yes. Any Smart TV with an app store supports IPTV through apps like IPTV Smarters Pro or Smart IPTV. You can also use an M3U URL with compatible apps.' },
        { q: 'Why is my IPTV buffering on Smart TV?', a: 'Buffering is usually caused by a slow Wi-Fi connection. Connect your TV via Ethernet cable and ensure your internet speed is at least 20 Mbps for 4K streams.' },
    ],
    'android': [
        { q: 'How do I install IPTV on Firestick?', a: 'Enable Unknown Sources in Firestick settings, install the Downloader app from Amazon, then download and install IPTV Smarters or TiviMate APK. Enter your Streamtly credentials to start watching.' },
        { q: 'What is the best IPTV app for Android?', a: 'TiviMate is the best IPTV player for Android TV and Android Box. It has a beautiful TV-guide interface and supports Xtream Codes API. IPTV Smarters Pro is the best option for Android phones.' },
        { q: 'How do I set up IPTV on Android TV box?', a: 'Install TiviMate from Google Play, open it, tap Add Playlist, select Xtream Codes, and enter your Server URL, username and password from your Streamtly dashboard.' },
        { q: 'Can I use IPTV on my Android phone?', a: 'Yes. Install IPTV Smarters Pro from Google Play and enter your Xtream Codes credentials. You can stream on 4G/5G or Wi-Fi.' },
    ],
    'ios': [
        { q: 'What is the best IPTV app for iPhone?', a: 'IPTV Smarters Pro and GSE Smart IPTV are the top IPTV apps for iPhone and iPad. Both are free on the App Store and support Xtream Codes login.' },
        { q: 'How do I set up IPTV on iPhone?', a: 'Download IPTV Smarters Pro from the App Store, tap Add New User, select Xtream Codes API, and enter your Server URL, username and password from your Streamtly dashboard.' },
        { q: 'Can I AirPlay IPTV from iPhone to TV?', a: 'Yes. Many IPTV apps on iPhone support AirPlay. You can mirror your screen or cast directly to an Apple TV or AirPlay 2 compatible TV.' },
        { q: 'Does IPTV work on iOS 17?', a: 'Yes. IPTV Smarters Pro and GSE Smart IPTV are fully compatible with iOS 17 and iOS 18.' },
    ],
    'windows': [
        { q: 'How do I watch IPTV on Windows PC?', a: 'Open VLC Media Player, go to Media → Open Network Stream, and paste your M3U Plus URL from your Streamtly dashboard. For a better experience, use IPTV Smarters for Windows with Xtream Codes login.' },
        { q: 'Can I watch IPTV on Mac?', a: 'Yes. VLC Media Player is available for macOS and works perfectly with M3U URLs. Download from videolan.org, open a network stream, and paste your M3U Plus URL.' },
        { q: 'What is the best free IPTV player for PC?', a: 'VLC Media Player is the best free option for PC and Mac. For a dedicated IPTV experience with EPG guide, IPTV Smarters Pro for Windows is highly recommended.' },
        { q: 'How do I use Kodi for IPTV?', a: 'Install Kodi, add the PVR IPTV Simple Client add-on, and enter your M3U Plus URL and EPG URL from your Streamtly dashboard. Restart Kodi to access Live TV.' },
    ],
    'mag': [
        { q: 'How do I set up IPTV on a MAG box?', a: 'Go to Settings → System Settings → Servers → Portals on your MAG device. Enter your Portal URL from your Streamtly dashboard and save. Select Portal 1 from the main menu.' },
        { q: 'What is the Portal URL for IPTV?', a: 'Your Portal URL is available in your Streamtly dashboard under the "EPG & Portal" section after activation. It looks like http://server-address/c/' },
        { q: 'Which MAG boxes are supported?', a: 'Streamtly works with all MAG models including MAG 250, 254, 256, 322, 351, 420, and newer models. Both old and new firmware versions are supported.' },
        { q: 'Why is my MAG box not loading IPTV?', a: 'Check that the Portal URL is entered correctly with no extra spaces. Also ensure your MAG box is connected to the internet and restart it after changing portal settings.' },
    ],
    'enigma2': [
        { q: 'How do I install IPTV on Enigma2?', a: 'Install the E2M3U2Bouquet plugin from your receiver\'s Plugin Browser. Open it and enter your M3U Plus URL and EPG URL from your Streamtly dashboard. The plugin converts your IPTV playlist into Enigma2 bouquets.' },
        { q: 'What Enigma2 receivers are supported?', a: 'Streamtly works with all Enigma2 receivers including Dreambox, Vu+, Zgemma, Octagon, and any device running OpenATV, OpenPLi, or other Enigma2 distributions.' },
        { q: 'What is E2M3U2Bouquet?', a: 'E2M3U2Bouquet is a plugin for Enigma2 satellite receivers that automatically converts an M3U IPTV playlist into native Enigma2 bouquets, allowing you to browse IPTV channels with your remote like regular satellite channels.' },
        { q: 'How do I set up EPG on Enigma2?', a: 'Install the CrossEPG plugin and add your EPG URL from the Streamtly dashboard. Set a daily download schedule to keep the TV guide automatically updated.' },
    ],
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params
    const guide = GUIDES[slug]
    if (!guide) return { title: 'Guide Not Found' }

    const keywords = GUIDE_KEYWORDS[slug] ?? []
    const titleMap: Record<string, string> = {
        'smart-tv': 'How to Set Up IPTV on Smart TV (Samsung, LG & More)',
        'android': 'How to Set Up IPTV on Firestick & Android Box',
        'ios': 'How to Set Up IPTV on iPhone & iPad',
        'windows': 'How to Watch IPTV on Windows & Mac',
        'mag': 'How to Set Up IPTV on MAG Box',
        'enigma2': 'How to Set Up IPTV on Enigma2 Receiver',
        'players': 'Best IPTV Players — Download Links & Firestick Codes',
    }
    const seoTitle = titleMap[slug] ? `${titleMap[slug]} | Streamtly` : `${guide.title} | Streamtly`

    return {
        title: seoTitle,
        description: guide.description,
        keywords,
        alternates: { canonical: `${SITE_URL}/guides/${slug}` },
        openGraph: {
            title: seoTitle,
            description: guide.description,
            url: `${SITE_URL}/guides/${slug}`,
            type: 'article',
        },
        twitter: {
            card: 'summary',
            title: seoTitle,
            description: guide.description,
        },
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function GuideSlugPage({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const guide = GUIDES[slug]
    if (!guide) notFound()

    const faqs = GUIDE_FAQS[slug] ?? []

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Setup Guides', item: `${SITE_URL}/guides` },
            { '@type': 'ListItem', position: 3, name: guide.title, item: `${SITE_URL}/guides/${slug}` },
        ],
    }

    const faqSchema = faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
    } : null

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">

            {/* Back */}
            <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-sm text-[#8899aa] hover:text-[#00d4ff] mb-10 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                All Guides
            </Link>

            {/* Header */}
            <div className="mb-12">
                <div className="text-5xl mb-4">{guide.emoji}</div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{guide.title}</h1>
                <p className="text-[#8899aa] text-base mb-4">{guide.subtitle}</p>
                <p className="text-[#aab] text-sm leading-relaxed max-w-xl">{guide.description}</p>
            </div>

            {/* Recommended Apps */}
            <div className="mb-12">
                <h2 className="text-sm font-bold text-[#8899aa] uppercase tracking-widest mb-4">
                    <Download className="inline w-4 h-4 mr-2 mb-0.5" />
                    Recommended Apps
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    {guide.apps.map(app => (
                        <div
                            key={app.name}
                            className="p-4 rounded-xl bg-[#111827] border border-white/5 flex flex-col gap-1"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-white text-sm">{app.name}</span>
                                {app.url && (
                                    <a href={app.url} target="_blank" rel="noopener noreferrer"
                                        className="text-[#00d4ff] hover:underline text-xs flex items-center gap-1">
                                        Download <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                            <span className="text-xs text-[#555]">{app.platform}</span>
                            <span className="text-xs text-[#8899aa]">{app.note}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Setup Sections */}
            <div className="space-y-10 mb-12">
                {guide.sections.map((section, si) => (
                    <div key={si}>
                        <h2
                            className="text-base font-bold mb-5 pb-2 border-b border-white/10 flex items-center gap-2"
                            style={{ color: section.color }}
                        >
                            <span
                                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: section.color }}
                            />
                            {section.title}
                        </h2>
                        <ol className="space-y-4">
                            {section.steps.map((step, i) => (
                                <li key={i} className="flex gap-4">
                                    <span
                                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                                        style={{ background: `${section.color}18`, color: section.color }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="text-[#c0ccd8] text-sm leading-relaxed pt-1">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

            {/* Tips */}
            <div className="mb-12 p-6 rounded-2xl bg-[#0d1f12] border border-[#22C55E]/20">
                <h2 className="text-sm font-bold text-[#22C55E] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Pro Tips
                </h2>
                <ul className="space-y-3">
                    {guide.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[#8899aa]">
                            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Dashboard reminder */}
            <div className="p-5 rounded-xl bg-[#111827] border border-white/5 flex gap-4 items-start mb-10">
                <AlertCircle className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-white mb-1">Find your credentials in your dashboard</p>
                    <p className="text-xs text-[#8899aa] leading-relaxed">
                        Your Server URL, Username, Password, M3U URLs, EPG URL, and Portal URL are all available at{' '}
                        <Link href="/app" className="text-[#00d4ff] hover:underline">streamtly.com/app</Link>.
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            {faqs.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-lg font-bold text-white mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="p-5 rounded-xl bg-[#111827] border border-white/5">
                                <p className="font-semibold text-white text-sm mb-2">{faq.q}</p>
                                <p className="text-sm text-[#8899aa] leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Support CTA */}
            <div className="text-center p-8 rounded-2xl bg-[#111827] border border-white/5">
                <h3 className="text-xl font-bold text-white mb-2">Still Need Help?</h3>
                <p className="text-[#8899aa] text-sm mb-6">Our support team is available 24/7 to walk you through setup on any device.</p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105"
                >
                    Contact Support
                </Link>
            </div>

            {/* BreadcrumbList + FAQ JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

        </div>
    )
}
