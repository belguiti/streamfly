import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Load .env.prod
const env = readFileSync('.env.prod', 'utf-8')
for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim().replace(/^"|"$/g, '').replace(/\\n/g, '')
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CLIENT_EMAIL = 'nicoalemanes@gmail.com'

// 1. Find the user profile by email
const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', CLIENT_EMAIL)
    .single()

if (profileErr || !profile) {
    console.error('User not found:', profileErr?.message)
    console.log('Trying auth.users...')

    // Try via admin auth API
    const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers()
    if (authErr) { console.error('Auth error:', authErr); process.exit(1) }

    const authUser = users.find(u => u.email === CLIENT_EMAIL)
    if (!authUser) {
        console.error(`No user found with email ${CLIENT_EMAIL}`)
        process.exit(1)
    }
    console.log('Found in auth.users:', authUser.id)

    // Upsert profile
    await supabase.from('profiles').upsert({ id: authUser.id, email: CLIENT_EMAIL })
    profile = { id: authUser.id, email: CLIENT_EMAIL }
}

console.log('User profile:', profile)

// 2. Get the 1-month plan
const { data: plans } = await supabase.from('plans').select('id, name, price_cents, duration_months').eq('is_active', true)
console.log('Available plans:', plans)

const plan1m = plans?.find(p => p.duration_months === 1)
if (!plan1m) { console.error('1-month plan not found'); process.exit(1) }
console.log('Using plan:', plan1m)

// 3. Insert order
const { data: order, error: orderErr } = await supabase.from('orders').insert({
    user_id: profile.id,
    plan_id: plan1m.id,
    provider: 'paypal',
    status: 'paid',
    amount_cents: plan1m.price_cents,
    currency: 'USD',
    paypal_order_id: 'PAYPAL-MANUAL-' + Date.now(),
    order_type: 'new',
}).select('id').single()

if (orderErr) { console.error('Order insert error:', orderErr); process.exit(1) }
console.log('Order created:', order.id)

// 4. Insert subscription
const periodEnd = new Date()
periodEnd.setMonth(periodEnd.getMonth() + 1)

const { data: sub, error: subErr } = await supabase.from('subscriptions').insert({
    user_id: profile.id,
    plan_id: plan1m.id,
    status: 'active',
    current_period_end: periodEnd.toISOString(),
    device_type: null,
    provider_type: 'm3u',
    provider_user_id: '79013c05fe',
    provider_username: '79013c05fe',
    provider_password: '04fdefcd01',
}).select('id').single()

if (subErr) { console.error('Subscription insert error:', subErr); process.exit(1) }
console.log('Subscription created:', sub.id)

// 5. Insert activation with credentials
const SERVER = 'http://bored78441.wd.onvitv.online'
const USERNAME = '79013c05fe'
const PASSWORD = '04fdefcd01'

const { error: actErr } = await supabase.from('activations').insert({
    subscription_id: sub.id,
    type: 'account',
    value: `${SERVER}|${USERNAME}|${PASSWORD}`,
    activated_by: null,
})

if (actErr) { console.error('Activation insert error:', actErr); process.exit(1) }

console.log('\n✅ All done!')
console.log(`Order ID:        ${order.id}`)
console.log(`Subscription ID: ${sub.id}`)
console.log(`Client:          ${CLIENT_EMAIL}`)
console.log(`Plan:            ${plan1m.name} ($${plan1m.price_cents / 100})`)
console.log(`Active until:    ${periodEnd.toDateString()}`)
