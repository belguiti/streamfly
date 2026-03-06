import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Fetch active or pending subscriptions
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
      *,
      plan:plans (name, duration_months),
      activations (*)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch order history
    const { data: orders } = await supabase
        .from('orders')
        .select('*, plan:plans(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const currentSub = subscriptions?.[0]

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Dashboard</h1>
                <div className="flex gap-4">
                    {currentSub?.stripe_customer_id ? (
                        <form action="/api/stripe/portal" method="POST">
                            <Button variant="outline" type="submit">
                                Manage Billing (Stripe)
                            </Button>
                        </form>
                    ) : currentSub?.paypal_subscription_id ? (
                        <a href="https://www.paypal.com/myaccount/autopay" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">Manage Billing (PayPal)</Button>
                        </a>
                    ) : null}
                    <a href="mailto:support@streamtly.com">
                        <Button>Contact Support</Button>
                    </a>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Current Subscription</CardTitle>
                        <CardDescription>Your active plan and status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentSub ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
                                    <div>
                                        <div className="font-semibold text-lg">{currentSub.plan?.name || 'Unknown Plan'}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Renews on: {currentSub.current_period_end ? new Date(currentSub.current_period_end).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Badge variant="outline">
                                            {currentSub.stripe_customer_id ? '💳 Stripe' : currentSub.paypal_subscription_id ? '🅿️ PayPal' : 'Unknown'}
                                        </Badge>
                                        <Badge variant={
                                            currentSub.status === 'active' ? 'default' :
                                                currentSub.status === 'pending_activation' ? 'secondary' :
                                                    currentSub.status === 'canceled' ? 'destructive' : 'outline'
                                        }>
                                            {currentSub.status === 'pending_activation' ? 'Pending Activation' :
                                                currentSub.status === 'active' ? 'Active' :
                                                    currentSub.status === 'canceled' ? 'Canceled' : currentSub.status}
                                        </Badge>
                                    </div>
                                </div>

                                {currentSub.status === 'pending_activation' && (
                                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-4 rounded-lg text-sm flex flex-col gap-2">
                                        <p className="font-semibold">Your payment was successful!</p>
                                        <p>Our team is currently provisioning your service. Activation details will appear here shortly.</p>
                                    </div>
                                )}

                                {currentSub.activations && currentSub.activations.length > 0 && (
                                    <div className="mt-6 border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">Activation Details</h3>
                                        <div className="space-y-3">
                                            {currentSub.activations.map((act: any) => (
                                                <div key={act.id} className="bg-muted p-3 rounded text-sm">
                                                    <span className="text-muted-foreground uppercase text-xs font-bold mr-2">{act.type.replace('_', ' ')}:</span>
                                                    <span className="font-mono">{act.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">You do not have any active subscriptions.</p>
                                <form action="/pricing">
                                    <Button>View Plans</Button>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Your profile details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <span className="text-muted-foreground block mb-1">Email</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders && orders.length > 0 ? orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{order.plan?.name || 'Unknown'}</TableCell>
                                <TableCell>${(order.amount_cents / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>{order.status}</Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
