'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

export default function MarkReadButton({ id, read }: { id: string; read: boolean }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const toggle = () => {
        startTransition(async () => {
            await fetch('/api/admin/messages/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, read: !read }),
            })
            router.refresh()
        })
    }

    return (
        <button
            onClick={toggle}
            disabled={isPending}
            title={read ? 'Mark as unread' : 'Mark as read'}
            className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${read
                ? 'text-[#64748B] border-white/8 hover:text-white hover:border-white/20'
                : 'text-[#4338CA] border-[#4338CA]/30 bg-[#4338CA]/10 hover:bg-[#4338CA]/20'
            } disabled:opacity-50`}
        >
            {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : read ? (
                <Circle className="w-3 h-3" />
            ) : (
                <CheckCircle2 className="w-3 h-3" />
            )}
            {read ? 'Unread' : 'Mark read'}
        </button>
    )
}
