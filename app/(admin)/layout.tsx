import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/sign-in')

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/app')

    const fullName: string | undefined = user.user_metadata?.full_name
    const initials = fullName
        ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email?.[0]?.toUpperCase() ?? '?'

    return (
        <div className="flex flex-1">
            <AdminSidebar initials={initials} email={user.email!} fullName={fullName} />
            {/* pt-14 only on mobile to clear the fixed top bar */}
            <main className="flex-1 overflow-y-auto pt-14 md:pt-0 bg-[#0a0f1a] min-h-screen">
                {children}
            </main>
        </div>
    )
}
