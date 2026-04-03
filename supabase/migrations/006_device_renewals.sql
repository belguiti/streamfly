-- 006_device_renewals.sql — Device type + renewal tracking

-- A) Device type on subscriptions (which device the user uses)
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS device_type TEXT;

-- B) Order type on orders (new purchase vs renewal)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'new'
    CHECK (order_type IN ('new', 'renewal'));

-- C) Renewal requests table (pending admin activation)
CREATE TABLE IF NOT EXISTS renewals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    plan_id         UUID REFERENCES plans(id) ON DELETE SET NULL,
    order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
    provider        TEXT NOT NULL,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'activated')),
    activated_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
    activated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE renewals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage renewals"
ON renewals FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users read own renewals"
ON renewals FOR SELECT USING (auth.uid() = user_id);
