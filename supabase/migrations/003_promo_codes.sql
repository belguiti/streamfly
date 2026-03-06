-- 003_promo_codes.sql — Promo Codes + Subscription Dates

-- A) Promo codes table
CREATE TABLE promo_codes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    max_uses        INTEGER DEFAULT NULL,        -- NULL = unlimited
    uses_count      INTEGER DEFAULT 0,
    expires_at      TIMESTAMPTZ DEFAULT NULL,    -- NULL = never expires
    is_active       BOOLEAN DEFAULT TRUE,
    created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- B) Promo fields on orders
ALTER TABLE orders
    ADD COLUMN promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL,
    ADD COLUMN discount_cents INTEGER DEFAULT 0;

-- C) Subscription start / end dates
ALTER TABLE subscriptions
    ADD COLUMN start_date TIMESTAMPTZ,
    ADD COLUMN end_date   TIMESTAMPTZ;

-- D) RLS for promo_codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage everything
CREATE POLICY "Admins manage promo_codes"
ON promo_codes FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authenticated users can read active codes (needed for client-side validation)
CREATE POLICY "Auth users read active promo_codes"
ON promo_codes FOR SELECT USING (
    auth.role() = 'authenticated' AND is_active = TRUE
);
