'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
    const [status, setStatus] = useState<Status>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMsg('')

        const form = e.currentTarget
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setStatus('success')
                form.reset()
            } else {
                const json = await res.json().catch(() => ({}))
                setErrorMsg(json.error ?? 'Failed to send message. Please try again.')
                setStatus('error')
            }
        } catch {
            setErrorMsg('Network error. Please check your connection and try again.')
            setStatus('error')
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4338CA]/10 border border-[#4338CA]/20 text-xs font-bold text-[#4338CA] mb-4 uppercase tracking-wider">
                    Support
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Get in <span className="gradient-text">Touch</span>
                </h1>
                <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
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
                        action: 'support@streamtly.com',
                        href: 'mailto:support@streamtly.com',
                        color: '#4338CA',
                    },
                    {
                        icon: MessageCircle,
                        title: 'Live Chat',
                        desc: 'Instant help from our team',
                        action: 'Start Chat',
                        href: '#',
                        color: '#22C55E',
                    },
                    {
                        icon: Clock,
                        title: 'Availability',
                        desc: 'We are available around the clock',
                        action: '24/7 Support',
                        href: '#',
                        color: '#8B5CF6',
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="bento-card card-hover-glow p-6 text-center"
                    >
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                        >
                            <item.icon className="w-7 h-7" style={{ color: item.color }} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-[#94A3B8] mb-3">{item.desc}</p>
                        <a
                            href={item.href}
                            className="text-sm font-semibold hover:underline transition-colors"
                            style={{ color: item.color }}
                        >
                            {item.action}
                        </a>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
                <div className="bento-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                    {/* Success state */}
                    {status === 'success' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-[#94A3B8] mb-6">
                                Thanks for reaching out. We&apos;ll get back to you within 2 hours.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="text-sm font-semibold text-[#4338CA] hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    )}

                    {/* Form */}
                    {status !== 'success' && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Your full name"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    required
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    placeholder="Describe your question or issue in detail..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA] transition-colors resize-none"
                                />
                            </div>

                            {/* Error alert */}
                            {status === 'error' && (
                                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white font-bold text-sm hover:shadow-[0_0_24px_rgba(67,56,202,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
