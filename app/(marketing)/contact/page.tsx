'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Clock, Send } from 'lucide-react'

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            <div className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Get in <span className="gradient-text">Touch</span>
                </h1>
                <p className="text-lg text-[#8899aa] max-w-xl mx-auto">
                    Have a question or need assistance? Our team is here to help 24/7.
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                    {
                        icon: Mail,
                        title: 'Email Support',
                        desc: 'Get a response within 2 hours',
                        action: 'support@stream4u.com',
                        href: 'mailto:support@stream4u.com',
                        color: '#00d4ff',
                    },
                    {
                        icon: MessageCircle,
                        title: 'Live Chat',
                        desc: 'Instant help from our team',
                        action: 'Start Chat',
                        href: '#',
                        color: '#00e5a0',
                    },
                    {
                        icon: Clock,
                        title: 'Availability',
                        desc: 'We are available around the clock',
                        action: '24/7 Support',
                        href: '#',
                        color: '#a855f7',
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="p-6 rounded-2xl bg-[#111827] border border-white/5 text-center hover-lift"
                    >
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: `${item.color}15` }}
                        >
                            <item.icon className="w-7 h-7" style={{ color: item.color }} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-[#8899aa] mb-3">{item.desc}</p>
                        <a
                            href={item.href}
                            className="text-sm font-semibold"
                            style={{ color: item.color }}
                        >
                            {item.action}
                        </a>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl bg-[#111827] border border-white/5 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-[#00e5a0]/10 flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-[#00e5a0]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-[#8899aa]">Thanks for reaching out. We&apos;ll get back to you within 2 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#8899aa] mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your full name"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#555] focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#8899aa] mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#555] focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8899aa] mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#555] focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8899aa] mb-1.5">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Describe your question or issue in detail..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#555] focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-colors resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
