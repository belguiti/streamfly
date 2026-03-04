const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seedPaypalIds() {
    const updates = [
        { name: '1 Month', id: 'P-123EXAMPL' },
        { name: '3 Months', id: 'P-456EXAMPL' },
        { name: '6 Months', id: 'P-789EXAMPL' },
        { name: '12 Months', id: 'P-000EXAMPL' }
    ]

    for (const update of updates) {
        const { error } = await supabase
            .from('plans')
            .update({ paypal_plan_id: update.id })
            .eq('name', update.name)

        if (error) {
            console.error(`Error updating ${update.name}:`, error)
        } else {
            console.log(`Updated ${update.name} with PayPal ID: ${update.id}`)
        }
    }
}

seedPaypalIds()
