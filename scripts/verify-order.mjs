import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.prod', 'utf-8')
for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim().replace(/^"|"$/g, '').replace(/\\n/g, '')
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const USER_ID = '8c103bee-6f5e-4217-be5b-af73011a057d'

// Check subscription with plan + activations (same query as dashboard)
const { data: subs } = await supabase
    .from('subscriptions')
    .select('*, plan:plans(id, name, duration_months), activations(*)')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false })

// Check orders
const { data: orders } = await supabase
    .from('orders')
    .select('*, plan:plans(name)')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false })

console.log('\n=== SUBSCRIPTIONS ===')
subs?.forEach(s => {
    console.log(`ID:          ${s.id}`)
    console.log(`Status:      ${s.status}`)
    console.log(`Plan:        ${s.plan?.name}`)
    console.log(`Expires:     ${s.current_period_end}`)
    console.log(`Activations: ${s.activations?.length}`)
    s.activations?.forEach(a => {
        console.log(`  → type: ${a.type}  value: ${a.value}`)
    })
    console.log('---')
})

console.log('\n=== ORDERS ===')
orders?.forEach(o => {
    console.log(`ID:       ${o.id}`)
    console.log(`Plan:     ${o.plan?.name}`)
    console.log(`Amount:   $${o.amount_cents / 100}`)
    console.log(`Provider: ${o.provider}`)
    console.log(`Status:   ${o.status}`)
    console.log(`Date:     ${o.created_at}`)
    console.log('---')
})
