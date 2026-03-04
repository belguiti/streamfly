const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkPlans() {
    const { data, error } = await supabase.from('plans').select('id, name, paypal_plan_id, stripe_price_id')
    if (error) {
        console.error('Error fetching plans:', error)
        return
    }
    console.log('Plans in DB:')
    console.table(data)
}

checkPlans()
