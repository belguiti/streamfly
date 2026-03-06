import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function generateCode(length = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
}

async function requireAdmin(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return null
    return user
}

// GET /api/admin/promo — list all promo codes
export async function GET(req: Request) {
    const admin = await requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabaseAdmin
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// POST /api/admin/promo — create a promo code
export async function POST(req: Request) {
    const admin = await requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const {
        code: rawCode,
        discount_percent,
        max_uses = null,
        expires_at = null,
    } = body

    const code = rawCode ? rawCode.toUpperCase().trim() : generateCode()

    if (!discount_percent || discount_percent < 1 || discount_percent > 100) {
        return NextResponse.json({ error: 'discount_percent must be 1–100' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
        .from('promo_codes')
        .insert({
            code,
            discount_percent,
            max_uses,
            expires_at,
            created_by: admin.id,
        })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
}
