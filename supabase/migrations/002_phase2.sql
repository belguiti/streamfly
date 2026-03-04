-- 002_phase2.sql — PayPal Support + Auto-Provisioning

-- A) Add PayPal plan ID to plans table
ALTER TABLE plans ADD COLUMN paypal_plan_id TEXT UNIQUE;

-- B) Add PayPal columns to subscriptions
ALTER TABLE subscriptions ADD COLUMN paypal_subscription_id TEXT UNIQUE;
ALTER TABLE subscriptions ADD COLUMN paypal_payer_id TEXT;

-- C) Add PayPal order ID to orders
ALTER TABLE orders ADD COLUMN paypal_order_id TEXT;

-- D) Activation Pool for auto-provisioning
CREATE TABLE activation_pool (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('activation_code', 'account', 'note')) DEFAULT 'activation_code',
    value TEXT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for activation_pool
ALTER TABLE activation_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on activation_pool"
ON activation_pool FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
