-- Migration 005: Add NOWPayments (crypto) support

-- 1. Update orders provider constraint to include 'nowpayments'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_provider_check;
ALTER TABLE orders ADD CONSTRAINT orders_provider_check
    CHECK (provider IN ('stripe', 'paypal', 'nowpayments'));

-- 2. Add nowpayments_payment_id to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS nowpayments_payment_id TEXT;

-- 3. Add nowpayments_payment_id to subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS nowpayments_payment_id TEXT UNIQUE;
