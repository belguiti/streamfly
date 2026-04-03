-- 007_provider_api.sql
-- Adds provider API fields to plans and subscriptions

-- A) Plans: map each plan to a provider package ID and country
ALTER TABLE plans ADD COLUMN IF NOT EXISTS provider_pack_id  TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS provider_country  TEXT DEFAULT 'ALL';

-- B) Subscriptions: store provider credentials for renewals + device management
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider_user_id  TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider_username TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider_password TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider_type     TEXT DEFAULT 'm3u';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider_mac      TEXT; -- MAG only

-- C) Map your plans to packages:
--    65410 = USA WITH SPORT
--    65435 = MOROCCO
--    Update these UUIDs to match your actual plan IDs from the plans table.
UPDATE plans SET provider_pack_id = '65410', provider_country = 'ALL'
WHERE name ILIKE '%month%' OR name ILIKE '%1%';

-- If you want different packages per plan, run:
-- UPDATE plans SET provider_pack_id = '65435' WHERE name = 'Morocco Plan';
