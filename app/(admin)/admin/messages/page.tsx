import { supabaseAdmin } from '@/lib/supabase/server'
import { MessageSquare, Mail, User, Clock, CheckCircle2, Circle } from 'lucide-react'
import MarkReadButton from './MarkReadButton'
import QuickReplyForm from './QuickReplyForm'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
    const { data: messages, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    const unread = (messages ?? []).filter(m => !m.read).length

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
                        {unread > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#4338CA]/20 text-[#818CF8] border border-[#4338CA]/30">
                                {unread} unread
                            </span>
                        )}
                    </div>
                    <p className="text-[#64748B] text-sm">
                        Messages submitted via the contact form.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    Failed to load messages: {error.message}
                </div>
            )}

            {!messages || messages.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-[#161633] border border-white/5">
                    <MessageSquare className="w-10 h-10 text-[#475569] mx-auto mb-3" />
                    <p className="text-[#64748B] font-medium">No messages yet</p>
                    <p className="text-[#475569] text-sm mt-1">Messages sent via the contact form will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <article
                            key={msg.id}
                            className={`rounded-2xl border p-5 transition-colors ${msg.read
                                ? 'bg-[#0F0F1E] border-white/5'
                                : 'bg-[#161633] border-[#4338CA]/20'
                            }`}
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Unread dot */}
                                    <div className="flex-shrink-0 mt-0.5">
                                        {msg.read
                                            ? <Circle className="w-3 h-3 text-[#475569]" />
                                            : <CheckCircle2 className="w-3 h-3 text-[#4338CA]" />
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-white text-sm truncate">{msg.subject}</p>
                                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                            <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                                                <User className="w-3 h-3" aria-hidden="true" />
                                                {msg.name}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                                                <Mail className="w-3 h-3" aria-hidden="true" />
                                                <a href={`mailto:${msg.email}`} className="hover:text-[#4338CA] transition-colors">
                                                    {msg.email}
                                                </a>
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[#64748B]">
                                                <Clock className="w-3 h-3" aria-hidden="true" />
                                                {new Date(msg.created_at).toLocaleString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <MarkReadButton id={msg.id} read={msg.read} />
                            </div>

                            {/* Message body */}
                            <p className="text-[#94A3B8] text-sm leading-relaxed whitespace-pre-wrap pl-6 border-l border-white/5">
                                {msg.message}
                            </p>

                            {/* Quick Reply */}
                            <QuickReplyForm
                                id={msg.id}
                                toEmail={msg.email}
                                toName={msg.name}
                                originalSubject={msg.subject}
                            />
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
