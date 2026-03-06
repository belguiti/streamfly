import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null)
    if (!body) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { name, email, subject, message } = body as Record<string, string>

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
    })

    if (error) {
        console.error('contact insert error:', error)
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
