'use client'

import { useState } from 'react'
import { Bot, X, MessageCircle } from 'lucide-react'

// ─── WhatsApp SVG (not in lucide-react) ──────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    )
}

// ─── Config ───────────────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_WHATSAPP_NUMBER to your WhatsApp number (digits only, with country code)
// e.g.  NEXT_PUBLIC_WHATSAPP_NUMBER=12025550123
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
const WA_TEXT = encodeURIComponent('Hello! I need help with Streamtly.')
const WA_HREF = WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}` : '#'

// ─── ChatBot panel (placeholder — wire up your model here) ───────────────────
function ChatBotPanel({ onClose }: { onClose: () => void }) {
    return (
        <div className="absolute bottom-16 right-0 w-80 glass rounded-2xl shadow-2xl overflow-hidden border border-[#4338CA]/20"
            style={{ boxShadow: '0 0 40px rgba(67,56,202,0.2)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#4338CA] to-[#8B5CF6]">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-none">Streamtly Assistant</p>
                        <p className="text-[10px] text-white/70 mt-0.5">Powered by AI</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close chat"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Messages area */}
            <div className="p-4 min-h-[200px] flex flex-col gap-3">
                {/* Bot welcome message */}
                <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#4338CA]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-[#818CF8]" />
                    </div>
                    <div className="bg-[#1E1B4B] rounded-2xl rounded-tl-none px-3 py-2 max-w-[85%]">
                        <p className="text-sm text-white leading-relaxed">
                            Hi! I&apos;m the Streamtly AI assistant. I&apos;m being configured — for immediate help, use WhatsApp below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input area */}
            <div className="px-4 pb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                    <input
                        type="text"
                        placeholder="Chat coming soon..."
                        disabled
                        className="flex-1 bg-transparent text-sm text-[#64748B] placeholder:text-[#475569] outline-none cursor-not-allowed"
                    />
                    <MessageCircle className="w-4 h-4 text-[#475569] flex-shrink-0" />
                </div>
                {/* WhatsApp fallback */}
                <a
                    href={WA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/25 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/25 transition-colors"
                >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    Chat on WhatsApp
                </a>
            </div>
        </div>
    )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function FloatingWidgets() {
    const [chatOpen, setChatOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" aria-label="Quick contact options">

            {/* Chat bot button + panel */}
            <div className="relative">
                {chatOpen && <ChatBotPanel onClose={() => setChatOpen(false)} />}

                <button
                    onClick={() => setChatOpen(v => !v)}
                    aria-label={chatOpen ? 'Close chat assistant' : 'Open chat assistant'}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #4338CA, #8B5CF6)',
                        boxShadow: '0 0 20px rgba(67,56,202,0.4)',
                    }}
                >
                    {chatOpen
                        ? <X className="w-5 h-5 text-white" />
                        : <Bot className="w-5 h-5 text-white" />
                    }
                </button>
            </div>

            {/* WhatsApp button */}
            <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                    background: '#25D366',
                    boxShadow: '0 0 20px rgba(37,211,102,0.4)',
                }}
            >
                <WhatsAppIcon className="w-5 h-5 text-white" />
            </a>
        </div>
    )
}
