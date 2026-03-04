'use client'

import { useState } from 'react'
import { ChevronDown, Smartphone, Tv, Monitor, Tablet, Laptop } from 'lucide-react'

const guides = [
    {
        icon: Tv,
        device: 'Amazon Firestick',
        color: '#ff9900',
        steps: [
            'From your Firestick home screen, go to Settings → My Fire TV → Developer Options.',
            'Enable "Apps from Unknown Sources" (or "Install Unknown Apps").',
            'Search for "Downloader" in the Amazon App Store and install it.',
            'Open Downloader and enter the app download URL provided in your dashboard.',
            'Install the downloaded APK and open the app.',
            'Enter your username and password from your activation email.',
            'Enjoy streaming! Your channel list will load automatically.',
        ],
    },
    {
        icon: Smartphone,
        device: 'Android TV / Android Box',
        color: '#3ddc84',
        steps: [
            'Go to Settings → Security → Enable "Unknown Sources".',
            'Open the built-in web browser or install "Downloader" from Google Play.',
            'Navigate to the app download URL provided in your dashboard.',
            'Download and install the APK file.',
            'Open the app and enter your login credentials.',
            'Your channels and VOD library will appear instantly.',
        ],
    },
    {
        icon: Monitor,
        device: 'Samsung / LG Smart TV',
        color: '#1428a0',
        steps: [
            'From your Smart TV, open the built-in app store (Samsung: Smart Hub, LG: LG Content Store).',
            'Search for "IPTV Smarters" or "Smart IPTV" and install it.',
            'Open the app and select "Xtream Codes API" as the login type.',
            'Enter your server URL, username, and password from your activation email.',
            'Wait for the channel list to load (this may take 1-2 minutes on first launch).',
            'Start streaming! Use the EPG guide to browse by category.',
        ],
    },
    {
        icon: Tablet,
        device: 'iOS / iPhone / iPad',
        color: '#007aff',
        steps: [
            'Open the App Store on your iOS device.',
            'Search for "IPTV Smarters Pro" or "GSE Smart IPTV" and install it.',
            'Open the app and tap "Add New User" or the "+" icon.',
            'Select "Xtream Codes API" login type.',
            'Enter your server URL, username, and password from your activation email.',
            'Your channel list and VOD library will load automatically.',
            'Enjoy streaming on the go!',
        ],
    },
    {
        icon: Laptop,
        device: 'Windows / Mac / PC',
        color: '#00d4ff',
        steps: [
            'Download the recommended player from the link in your dashboard (VLC or our custom app).',
            'Install and open the application.',
            'Go to Media → Open Network Stream (VLC) or enter credentials (custom app).',
            'Enter the M3U URL or Xtream Codes details from your activation email.',
            'Wait for the playlist to load — this may take a moment for the full library.',
            'Browse channels by category and start watching!',
        ],
    },
]

export default function GuidesPage() {
    const [openGuide, setOpenGuide] = useState<number | null>(0)

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
            <div className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Installation <span className="gradient-text">Guides</span>
                </h1>
                <p className="text-lg text-[#8899aa] max-w-xl mx-auto">
                    Get set up in under 5 minutes. Choose your device below for step-by-step instructions.
                </p>
            </div>

            <div className="space-y-4">
                {guides.map((guide, i) => (
                    <div
                        key={guide.device}
                        className="rounded-xl border border-white/5 bg-[#111827] overflow-hidden transition-colors hover:border-white/10"
                    >
                        <button
                            onClick={() => setOpenGuide(openGuide === i ? null : i)}
                            className="w-full flex items-center gap-4 p-5 text-left"
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `${guide.color}15` }}
                            >
                                <guide.icon className="w-5 h-5" style={{ color: guide.color }} />
                            </div>
                            <span className="font-semibold text-white flex-1">{guide.device}</span>
                            <ChevronDown
                                className={`w-5 h-5 text-[#00d4ff] flex-shrink-0 transition-transform duration-300 ${openGuide === i ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${openGuide === i ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-5 pb-5">
                                <ol className="space-y-3 ml-2">
                                    {guide.steps.map((step, j) => (
                                        <li key={j} className="flex gap-3 text-sm text-[#8899aa]">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center text-xs font-bold">
                                                {j + 1}
                                            </span>
                                            <span className="leading-relaxed pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Help CTA */}
            <div className="mt-12 text-center p-8 rounded-2xl bg-[#111827] border border-white/5">
                <h3 className="text-xl font-bold text-white mb-3">Need Help With Setup?</h3>
                <p className="text-[#8899aa] mb-6">Our 24/7 support team can walk you through the installation on any device.</p>
                <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105"
                >
                    Contact Support
                </a>
            </div>
        </div>
    )
}
