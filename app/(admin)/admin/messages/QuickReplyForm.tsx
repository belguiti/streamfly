'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ChevronDown, ChevronUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
    id: string
    toEmail: string
    toName: string
    originalSubject: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function QuickReplyForm({ id, toEmail, toName, originalSubject }: Props) {
    const [open, setOpen] = useState(false)
    const [subject, setSubject] = useState(`Re: ${originalSubject}`)
    const [body, setBody] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [error, setError] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (open && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [open])

    const send = async () => {
        if (!body.trim()) return
        setStatus('loading')
        setError('')

        try {
            const res = await fetch('/api/admin/messages/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, to: toEmail, toName, subject, body }),
            })

            if (res.ok) {
                setStatus('success')
                setBody('')
                setTimeout(() => {
                    setStatus('idle')
                    setOpen(false)
                    router.refresh()
                }, 1500)
            } else {
                const json = await res.json().catch(() => ({}))
                setError(json.error ?? 'Failed to send. Try again.')
                setStatus('error')
            }
        } catch {
            setError('Network error. Check your connection.')
            setStatus('error')
        }
    }

    return (
        <div className="mt-3 pl-6">
            {/* Toggle button */}
            <button
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4338CA] bg-[#4338CA]/10 border border-[#4338CA]/25 hover:bg-[#4338CA]/20 transition-colors"
            >
                <Send className="w-3 h-3" />
                Quick Reply
                {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Reply form */}
            {open && (
                <div className="mt-3 rounded-xl border border-[#4338CA]/20 bg-[#0F0F23] overflow-hidden">
                    {/* To line */}
                    <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 text-xs text-[#64748B]">
                        <span className="font-medium text-[#94A3B8]">To:</span>
                        <span className="text-[#4338CA] font-medium">{toName}</span>
                        <span>&lt;{toEmail}&gt;</span>
                    </div>

                    {/* Subject */}
                    <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
                        <span className="text-xs font-medium text-[#94A3B8] shrink-0">Subject:</span>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#475569]"
                            placeholder="Subject"
                        />
                    </div>

                    {/* Body */}
                    <textarea
                        ref={textareaRef}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        rows={5}
                        placeholder={`Write your reply to ${toName}...`}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white placeholder:text-[#475569] outline-none resize-none border-b border-white/5"
                    />

                    {/* Error */}
                    {status === 'error' && (
                        <div className="px-4 py-2 flex items-center gap-2 text-xs text-red-400 bg-red-500/5 border-b border-white/5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="px-4 py-3 flex items-center justify-between gap-3">
                        <button
                            onClick={() => { setOpen(false); setStatus('idle'); setError('') }}
                            className="text-xs text-[#64748B] hover:text-white transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={send}
                            disabled={status === 'loading' || status === 'success' || !body.trim()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#4338CA] to-[#22C55E] text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_16px_rgba(67,56,202,0.35)] transition-all"
                        >
                            {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {status === 'loading' ? 'Sending…' : status === 'success' ? 'Sent!' : (
                                <><Send className="w-3.5 h-3.5" /> Send Reply</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
