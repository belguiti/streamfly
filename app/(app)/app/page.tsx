import { createClient, supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

// ── Credential parser (server-side) ─────────────────────────────────────────
function parseCreds(type: string, value: string) {
    if (type === 'account' && value.includes('|')) {
        const [rawServer, username = '', password = ''] = value.split('|').map(s => s.trim())
        const serverUrl = rawServer.replace(/\/$/, '')
        const u = encodeURIComponent(username)
        const p = encodeURIComponent(password)
        return {
            kind: 'xtream' as const,
            serverUrl,
            username,
            password,
            m3uUrl: `${serverUrl}/get.php?username=${u}&password=${p}&type=m3u`,
            m3uPlusUrl: `${serverUrl}/get.php?username=${u}&password=${p}&type=m3u_plus`,
            epgUrl: `${serverUrl}/xmltv.php?username=${u}&password=${p}`,
            portalUrl: `${serverUrl}/c/`,
        }
    }
    if (type === 'activation_code') return { kind: 'code' as const, value }
    return { kind: 'text' as const, value }
}

const GUIDES: Record<string, { label: string; url: string }[]> = {
    smart_tv: [
        { label: 'Smart TV Setup Guide', url: '/guides/smart-tv' },
    ],
    android_box: [
        { label: 'Android Box Setup Guide', url: '/guides/android' },
    ],
    android_phone: [
        { label: 'Android Phone Setup Guide', url: '/guides/android' },
    ],
    iphone_ipad: [
        { label: 'iPhone / iPad Setup Guide', url: '/guides/ios' },
    ],
    windows_mac: [
        { label: 'Windows / Mac Setup Guide', url: '/guides/windows' },
    ],
    mag_device: [
        { label: 'MAG Device Setup Guide', url: '/guides/mag' },
    ],
    enigma2: [
        { label: 'Enigma2 / Satellite Setup Guide', url: '/guides/enigma2' },
    ],
}

const DEVICE_LABELS: Record<string, string> = {
    smart_tv: 'Smart TV',
    android_box: 'Android Box',
    android_phone: 'Android Phone',
    iphone_ipad: 'iPhone / iPad',
    windows_mac: 'Windows / Mac',
    mag_device: 'MAG Device',
    enigma2: 'Enigma2 / Satellite',
    other: 'Other',
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/sign-in')
    }

    const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select(`
            *,
            plan:plans (id, name, duration_months),
            activations (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*, plan:plans(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const currentSub = subscriptions?.[0]
    const activation = currentSub?.activations?.[0]
    const creds = activation ? parseCreds(activation.type, activation.value) : null
    const deviceGuides = currentSub?.device_type ? (GUIDES[currentSub.device_type] ?? []) : []

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Dashboard</h1>
                <a href="mailto:support@streamtly.com">
                    <Button>Contact Support</Button>
                </a>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* ── Subscription card ────────────────────── */}
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
                                        {currentSub.device_type && (
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                Device: {DEVICE_LABELS[currentSub.device_type] ?? currentSub.device_type}
                                            </div>
                                        )}
                                        <div className="text-sm text-muted-foreground">
                                            {currentSub.current_period_end
                                                ? `Active until: ${new Date(currentSub.current_period_end).toLocaleDateString()}`
                                                : 'No end date'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <Badge variant="outline">
                                            {currentSub.stripe_customer_id
                                                ? '💳 Stripe'
                                                : currentSub.paypal_subscription_id
                                                ? '🅿️ PayPal'
                                                : currentSub.nowpayments_payment_id
                                                ? '₿ Crypto'
                                                : '🔧 Manual'}
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
                                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-4 rounded-lg text-sm">
                                        <p className="font-semibold">Payment successful!</p>
                                        <p>Our team is provisioning your service. Activation details will appear here shortly.</p>
                                    </div>
                                )}

                                {/* Renew button */}
                                {currentSub.plan?.id && currentSub.status !== 'canceled' && (
                                    <Link href={`/pricing/${currentSub.plan.id}?renew=true`}>
                                        <Button variant="outline" className="w-full">
                                            🔄 Renew Subscription
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">You do not have any active subscriptions.</p>
                                <Link href="/pricing">
                                    <Button>View Plans</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Account card ─────────────────────────── */}
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

            {/* ── IPTV Credentials ─────────────────────────────────────────── */}
            {creds && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Your IPTV Credentials</h2>
                    {creds.kind === 'xtream' ? (
                        <div className="space-y-4">
                            {/* Xtream / App Login */}
                            <Card className="border-indigo-500/30 bg-indigo-950/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
                                        👤 Xtream Codes / App Login
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[
                                        { label: 'Server URL', val: creds.serverUrl },
                                        { label: 'Username', val: creds.username },
                                        { label: 'Password', val: creds.password },
                                    ].map(({ label, val }) => (
                                        <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-white/5 last:border-0">
                                            <span className="text-xs font-bold text-muted-foreground uppercase w-28 shrink-0">{label}</span>
                                            <code className="text-sm break-all bg-black/30 px-2 py-1 rounded">{val}</code>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* M3U / M3U+ */}
                            <Card className="border-green-500/30 bg-green-950/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-green-400 uppercase tracking-widest">
                                        🎬 M3U / M3U Plus Links
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[
                                        { label: 'M3U', val: creds.m3uUrl },
                                        { label: 'M3U Plus', val: creds.m3uPlusUrl },
                                    ].map(({ label, val }) => (
                                        <div key={label} className="flex flex-col gap-1 py-2 border-b border-white/5 last:border-0">
                                            <span className="text-xs font-bold text-muted-foreground uppercase">{label}</span>
                                            <a href={val} target="_blank" rel="noopener noreferrer"
                                                className="text-xs break-all text-green-400 hover:underline font-mono">
                                                {val}
                                            </a>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* EPG + Portal */}
                            <Card className="border-purple-500/30 bg-purple-950/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                                        📅 EPG &amp; Portal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[
                                        { label: 'EPG URL', val: creds.epgUrl },
                                        { label: 'Portal URL', val: creds.portalUrl },
                                    ].map(({ label, val }) => (
                                        <div key={label} className="flex flex-col gap-1 py-2 border-b border-white/5 last:border-0">
                                            <span className="text-xs font-bold text-muted-foreground uppercase">{label}</span>
                                            <a href={val} target="_blank" rel="noopener noreferrer"
                                                className="text-xs break-all text-purple-400 hover:underline font-mono">
                                                {val}
                                            </a>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card className="border-green-500/30 bg-green-950/20">
                            <CardContent className="pt-6 text-center">
                                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">🔑 Your Activation Code</p>
                                <code className="text-2xl font-black tracking-widest">{creds.value}</code>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* ── Setup Guides ─────────────────────────────────────────────── */}
            {(deviceGuides.length > 0 || currentSub?.status === 'active') && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Setup Guide</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-3">
                                {deviceGuides.map(guide => (
                                    <Link key={guide.url} href={guide.url}>
                                        <Button variant="outline" size="sm">{guide.label}</Button>
                                    </Link>
                                ))}
                                <Link href="/guides">
                                    <Button variant="outline" size="sm">📚 All Setup Guides</Button>
                                </Link>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                Need help setting up? Follow our step-by-step guides or{' '}
                                <a href="mailto:support@streamtly.com" className="underline">contact support</a>.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── Order History ─────────────────────────────────────────────── */}
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
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
                                    <Badge variant="outline" className="capitalize">
                                        {order.order_type ?? 'new'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>{order.status}</Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
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
