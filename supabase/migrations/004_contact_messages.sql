-- ─── Contact Messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL,
    email       TEXT        NOT NULL,
    subject     TEXT        NOT NULL,
    message     TEXT        NOT NULL,
    read        BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only service role can access (API route uses supabaseAdmin which bypasses RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
-- No policies = deny all public access; service role bypasses RLS
