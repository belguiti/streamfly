import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'admin') {
            return new NextResponse('Forbidden', { status: 403 })
        }

        const { planId, type, codes } = await req.json() as {
            planId: string
            type: string
            codes: string[]
        }

        if (!planId || !type || !codes || codes.length === 0) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const rows = codes
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0)
            .map((value: string) => ({
                plan_id: planId,
                type,
                value,
            }))

        const { error } = await supabase.from('activation_pool').insert(rows)

        if (error) {
            console.error('Pool insert error:', error)
            return new NextResponse(error.message, { status: 500 })
        }

        return NextResponse.json({ inserted: rows.length })
    } catch (err: any) {
        console.error('Pool API error:', err)
        return new NextResponse(err.message, { status: 500 })
    }
}
