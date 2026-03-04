import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')
    const isProtectedApp = pathname.startsWith('/app')
    const isProtectedAdmin = pathname.startsWith('/admin')

    // Not logged in → protect app & admin routes
    if ((isProtectedApp || isProtectedAdmin) && !user) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Logged in → role-aware routing
    if (user && (isAuthRoute || isProtectedApp || isProtectedAdmin)) {
        const serviceClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { data: profile } = await serviceClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const isAdmin = profile?.role === 'admin'

        // Auth pages while logged in → send to correct home
        if (isAuthRoute) {
            return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/app', request.url))
        }

        // Admin visiting user area → redirect to admin panel
        if (isProtectedApp && isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        // Non-admin visiting admin area → send back to user dashboard
        if (isProtectedAdmin && !isAdmin) {
            return NextResponse.redirect(new URL('/app', request.url))
        }
    }

    return supabaseResponse
}
