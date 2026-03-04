import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Double check admin role
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        redirect('/app')
    }

    // Fetch all subscriptions, order by pending first, then created_at
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
      *,
      plan:plans(name),
      profile:profiles(email)
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin: Manage Subscriptions</h1>

            <div className="bg-card rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions && subscriptions.map((sub: any) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">{sub.profile?.email || sub.user_id}</TableCell>
                                <TableCell>{sub.plan?.name}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        sub.status === 'active' ? 'default' :
                                            sub.status === 'pending_activation' ? 'secondary' :
                                                sub.status === 'canceled' ? 'destructive' : 'outline'
                                    }>
                                        {sub.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {sub.status === 'pending_activation' ? (
                                        <Link href={`/admin/orders/${sub.id}`}>
                                            <Button size="sm">Activate</Button>
                                        </Link>
                                    ) : (
                                        <Link href={`/admin/orders/${sub.id}`}>
                                            <Button size="sm" variant="outline">View</Button>
                                        </Link>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!subscriptions || subscriptions.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    No subscriptions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
