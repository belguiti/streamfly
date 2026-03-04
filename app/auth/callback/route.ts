import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app'

    if (code) {
        const supabase = await createClient()
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Redirect admins to the admin panel
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            const redirectTo = profile?.role === 'admin' ? '/admin' : next
            return NextResponse.redirect(new URL(redirectTo, origin))
        }
    }

    return NextResponse.redirect(new URL('/sign-in?message=Could not authenticate. Please try again.', origin))
}
