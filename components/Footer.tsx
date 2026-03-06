import Link from 'next/link'
import { Tv, Mail, CreditCard, Shield } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#070b14] py-16 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e5a0] flex items-center justify-center">
                                <Tv className="w-4 h-4 text-[#0a0f1a]" />
                            </div>
                            <span className="font-bold text-xl tracking-tight gradient-text">Streamtly</span>
                        </Link>
                        <p className="text-sm text-[#8899aa] mb-4 leading-relaxed">
                            Your premier streaming subscription platform. 35,000+ live channels and 150,000+ VODs delivered with instant activation and 24/7 expert support.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-[#00d4ff]" />
                            <a href="mailto:support@streamtly.com" className="text-[#00d4ff] hover:text-[#00e5a0] transition-colors">
                                support@streamtly.com
                            </a>
                        </div>
                    </div>

                    {/* Device Setup */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Device Setup</h3>
                        <ul className="space-y-2.5 text-sm text-[#8899aa]">
                            <li>
                                <Link href="/guides" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Amazon Firestick
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Android TV / Box
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Samsung / LG Smart TVs
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    iOS / iPhone / iPad
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Windows / Mac / PC
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Trust */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal & Trust</h3>
                        <ul className="space-y-2.5 text-sm text-[#8899aa]">
                            <li>
                                <Link href="/terms" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <span className="flex items-center gap-2 text-[#8899aa]">
                                    <Shield className="w-3.5 h-3.5 text-[#00e5a0]" />
                                    DMCA Protected
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-2.5 text-sm text-[#8899aa]">
                            <li>
                                <Link href="/pricing" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Pricing Plans
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Installation Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/reviews" className="hover:text-[#00d4ff] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40"></span>
                                    Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods & Copyright */}
                <div className="mt-12 pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Payment Icons */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[#8899aa] mr-2">We Accept:</span>
                            <div className="flex gap-2">
                                {['VISA', 'MC', 'AMEX', 'PayPal', 'Crypto'].map((method) => (
                                    <span key={method} className="px-2.5 py-1 text-[10px] font-bold rounded bg-white/5 text-[#8899aa] border border-white/5 uppercase tracking-wider">
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Copyright */}
                        <p className="text-xs text-[#8899aa]">
                            &copy; {new Date().getFullYear()} Streamtly. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
