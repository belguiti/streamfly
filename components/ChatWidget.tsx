'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, Minimize2, Loader2 } from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const SUGGESTIONS = [
    'How do I set up on Firestick?',
    'What channels are included?',
    'How much does it cost?',
    'My stream is buffering — help!',
]

function MarkdownText({ text }: { text: string }) {
    const lines = text.split('\n')
    return (
        <div className="space-y-1.5 text-sm leading-relaxed">
            {lines.map((line, i) => {
                if (line.startsWith('## ')) return <p key={i} className="font-bold text-white text-sm mt-2">{line.slice(3)}</p>
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-white">{line.slice(2, -2)}</p>
                if (line.startsWith('- ') || line.startsWith('* ')) return (
                    <div key={i} className="flex gap-2">
                        <span className="text-[#4338CA] mt-0.5 flex-shrink-0">•</span>
                        <span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                    </div>
                )
                if (/^\d+\./.test(line)) {
                    const [num, ...rest] = line.split('. ')
                    return (
                        <div key={i} className="flex gap-2">
                            <span className="text-[#4338CA] font-bold flex-shrink-0">{num}.</span>
                            <span dangerouslySetInnerHTML={{ __html: rest.join('. ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    )
                }
                if (line.startsWith('---')) return <hr key={i} className="border-white/10 my-1" />
                if (line.trim() === '') return <div key={i} className="h-1" />
                return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#4338CA] hover:underline">$1</a>') }} />
            })}
        </div>
    )
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [streamingText, setStreamingText] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingText])

    useEffect(() => {
        if (open && messages.length === 0) inputRef.current?.focus()
    }, [open, messages.length])

    async function send(text: string) {
        const userMessage = text.trim()
        if (!userMessage || loading) return

        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)
        setInput('')
        setLoading(true)
        setStreamingText('')

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            })

            if (!res.ok) throw new Error('API error')
            const reader = res.body!.getReader()
            const decoder = new TextDecoder()
            let full = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                full += decoder.decode(value, { stream: true })
                setStreamingText(full)
            }

            setMessages(prev => [...prev, { role: 'assistant', content: full }])
            setStreamingText('')
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble connecting. Please try again or contact **support@streamtly.com** for immediate help.',
            }])
            setStreamingText('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Bubble button */}
            <button
                onClick={() => setOpen(o => !o)}
                aria-label="Open Streamtly support chat"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}
            >
                {open
                    ? <X className="w-6 h-6 text-white" />
                    : <Bot className="w-6 h-6 text-white" />
                }
            </button>

            {/* Chat window */}
            {open && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    style={{ height: '520px', background: '#0d1220', border: '1px solid rgba(67,56,202,0.3)' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                        style={{ background: 'linear-gradient(135deg, #4338CA22, #22C55E11)' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}>
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Streamtly Assistant</p>
                                <p className="text-[10px] text-[#22C55E] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block" />
                                    Online — IPTV Expert
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-[#8899aa] hover:text-white transition-colors">
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="space-y-4">
                                <div className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                        style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}>
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                                        <p className="text-[#94a3b8] text-sm leading-relaxed">
                                            Hi! I&apos;m the Streamtly IPTV Assistant. I can help you with setup guides, troubleshooting, pricing, and any technical questions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-9">
                                    {SUGGESTIONS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => send(s)}
                                            className="text-xs px-3 py-1.5 rounded-full border border-[#4338CA]/40 text-[#94a3b8] hover:border-[#4338CA] hover:text-white transition-all bg-white/5 hover:bg-[#4338CA]/10 text-left"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                        style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}>
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${
                                        msg.role === 'user'
                                            ? 'text-white rounded-tr-none'
                                            : 'text-[#94a3b8] bg-white/5 border border-white/10 rounded-tl-none'
                                    }`}
                                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #4338CA, #3730a3)' } : {}}
                                >
                                    {msg.role === 'assistant'
                                        ? <MarkdownText text={msg.content} />
                                        : <p>{msg.content}</p>
                                    }
                                </div>
                            </div>
                        ))}

                        {/* Streaming response */}
                        {streamingText && (
                            <div className="flex gap-2.5">
                                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                    style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}>
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] text-[#94a3b8]">
                                    <MarkdownText text={streamingText} />
                                    <span className="inline-block w-1.5 h-3.5 bg-[#4338CA] ml-0.5 animate-pulse rounded-sm" />
                                </div>
                            </div>
                        )}

                        {loading && !streamingText && (
                            <div className="flex gap-2.5">
                                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}>
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                                    <div className="flex gap-1 items-center h-4">
                                        {[0, 1, 2].map(i => (
                                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-bounce"
                                                style={{ animationDelay: `${i * 150}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/10">
                        <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#4338CA]/50 transition-colors">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                                placeholder="Ask me anything about IPTV..."
                                className="flex-1 bg-transparent text-white text-sm placeholder:text-[#555] outline-none"
                                disabled={loading}
                            />
                            <button
                                onClick={() => send(input)}
                                disabled={loading || !input.trim()}
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                                style={{ background: 'linear-gradient(135deg, #4338CA, #22C55E)' }}
                            >
                                {loading
                                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                    : <Send className="w-3.5 h-3.5 text-white" />
                                }
                            </button>
                        </div>
                        <p className="text-[10px] text-[#333] text-center mt-2">Powered by Streamtly AI · IPTV specialist</p>
                    </div>
                </div>
            )}
        </>
    )
}
