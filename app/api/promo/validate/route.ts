import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')?.toUpperCase().trim()

    if (!code) {
        return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
    }

    const supabase = await createClient()

    // Must be logged in to validate
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ valid: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: promo, error } = await supabase
        .from('promo_codes')
        .select('id, code, discount_percent, max_uses, uses_count, expires_at, is_active')
        .eq('code', code)
        .single()

    if (error || !promo) {
        return NextResponse.json({ valid: false, error: 'Invalid promo code' })
    }

    if (!promo.is_active) {
        return NextResponse.json({ valid: false, error: 'This promo code is no longer active' })
    }

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        return NextResponse.json({ valid: false, error: 'This promo code has expired' })
    }

    if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
        return NextResponse.json({ valid: false, error: 'This promo code has reached its usage limit' })
    }

    return NextResponse.json({
        valid: true,
        promoId: promo.id,
        code: promo.code,
        discountPercent: promo.discount_percent,
    })
}
