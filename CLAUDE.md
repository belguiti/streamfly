# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured. Stripe webhooks can be tested locally with the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Useful one-off scripts (in `scripts/`, run with `node scripts/<file>`):
- `check-plans.js` / `check-plans-json.js` — inspect the `plans` table
- `seed-paypal-ids.js` — backfill `paypal_plan_id` on plans
- `create-order.mjs` / `verify-order.mjs` — manually create/verify an order for testing
- `audit-indexing.mjs`, `index-url.mjs` (npm run index) — IndexNow submission for SEO
- `send-waiting-email.mjs` — manually trigger an activation-pending email

## Architecture

Streamtly is a Next.js 16 (App Router) IPTV/streaming subscription platform backed by Supabase, with three payment providers (Stripe, PayPal, NowPayments for crypto) and automated provisioning through a third-party reseller ("Gold Panel") API.

### Route Groups

The `app/` directory is organized into route groups:

| Group | Routes | Access |
|---|---|---|
| `(marketing)` | `/`, `/pricing`, `/pricing/[id]`, `/terms`, `/privacy`, `/refund`, `/reviews`, `/blog`, `/blog/[slug]`, `/articles/[slug]`, `/guides`, `/guides/[slug]`, `/contact`, `/site-index` | Public |
| `(auth)` | `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` | Unauthenticated only |
| `(app)` | `/app`, `/app/profile`, `/app/settings` | Authenticated users |
| `(admin)` | `/admin` (dashboard), `/admin/orders`, `/admin/orders/[id]`, `/admin/pool`, `/admin/promo`, `/admin/renewals`, `/admin/messages`, `/admin/stats`, `/admin/users` | Admin role only |

There's also a static content route at `app/guides/*` (hand-written technical guides, separate from the DB-driven `(marketing)/guides`) and a Route Handler at `app/auth/signout/route.ts` / `app/auth/callback/route.ts`.

### Middleware & Auth Guards

`middleware.ts` delegates to `updateSession()` in `lib/supabase/middleware.ts`, which:
1. Redirects unauthenticated users away from `/app/**` and `/admin/**` to `/sign-in`.
2. For logged-in users, looks up `profiles.role` via a service-role client (bypasses RLS) and redirects: auth pages → `/admin` or `/app` depending on role; admins hitting `/app` → `/admin`; non-admins hitting `/admin` → `/app`.

### Supabase Client Pattern

Clients live in `lib/supabase/`:
- `createClient()` in `server.ts` — cookie-based SSR client for Server Components and Route Handlers acting on behalf of a user. Respects RLS.
- `supabaseAdmin` in `server.ts` — service role client, bypasses RLS. **Only for webhook handlers and server-side provisioning/admin routes.** Never expose to the browser.
- `client.ts` — browser client for Client Components.

### Payment Flow

Stripe, PayPal, and NowPayments (crypto) all converge on the same downstream logic:
1. Client calls a checkout API — `/api/stripe/checkout`, `/api/paypal/checkout`, or `/api/nowpayments/checkout` — with a `planId` (and optionally a promo code, validated via `/api/promo/validate` against the `promo_codes` table).
2. User is redirected to the provider's hosted payment page.
3. On success, the provider calls its webhook: `/api/stripe/webhook`, `/api/paypal/webhook`, or `/api/nowpayments/webhook`.
4. The webhook handler inserts a row into `orders` (status `paid`), upserts a row into `subscriptions`, and calls `autoProvision()` from `lib/provisioning.ts`.
5. `autoProvision()` (in `lib/provisioning.ts`) provisions the subscription live through the reseller API in `lib/provider-api.ts` (Gold Panel — `createM3uDevice` / `createMagDevice`, keyed off the plan's `provider_pack_id` or a user-selected package), inserts an `activations` row, and flips the subscription to `active`. If the provider call fails or reseller credits are exhausted, the subscription is left `pending_activation` for manual admin activation at `/admin/orders`, an activation email is skipped, and Telegram alerts fire instead (see below).
   - Note: the older pool-based flow (`activation_pool` table, claiming pre-loaded codes) from migration `002_phase2.sql` still exists in the schema and has an admin UI at `/admin/pool`, but current `autoProvision()` no longer reads from it — provisioning is now live via `lib/provider-api.ts`.
6. On successful (or failed) provisioning, `lib/telegram.ts` sends an admin alert via the Telegram Bot API (`TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`), and `lib/activation-emails.ts` (via `lib/resend.ts`) emails the customer their credentials.

Renewals (subscription extension for existing devices) are a separate flow: `renewals` table (migration `006_device_renewals.sql`), reminder emails sent by the daily Vercel Cron job at `/api/cron/renewal-reminder` (see `vercel.json`), and admin-side activation at `/api/admin/renewals/activate` using `renewM3uDevice`/`renewMagDevice` from `lib/provider-api.ts`.

### Database Schema (Supabase)

Migrations are in `supabase/migrations/` and must be run in order:
- `001_init.sql` — core tables: `profiles`, `plans`, `subscriptions`, `activations`, `orders` + RLS policies + trigger to auto-create a `profiles` row on signup
- `002_phase2.sql` — adds PayPal columns, creates `activation_pool` table (legacy, see Payment Flow note above)
- `003_promo_codes.sql` — `promo_codes` table
- `004_contact_messages.sql` — `contact_messages` table (backs the `/contact` page and `/admin/messages`)
- `005_nowpayments.sql` — crypto payment columns/support
- `006_device_renewals.sql` — `renewals` table
- `007_provider_api.sql` — columns supporting the live `provider-api.ts` integration (e.g. `provider_pack_id`, `provider_country`, `provider_user_id`, `device_type`)

**To promote a user to admin:**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

After running migrations, update the `plans` table with real Stripe Price IDs, PayPal plan IDs, and `provider_pack_id` values from the reseller panel.

### Other Integrations

- `lib/provider-api.ts` — typed wrapper around the Gold Panel reseller API (device creation/renewal, package listing, credit checks). Requires `PROVIDER_API_KEY`.
- `lib/telegram.ts` — fire-and-forget admin notifications (new subscription, provisioning failure) via the Telegram Bot API.
- `lib/resend.ts` / `lib/activation-emails.ts` / `emails/renewal.ts` — transactional email (activation success, pool-empty alerts, renewal reminders) via Resend.
- `app/api/chat/route.ts` + `lib/chatbot-kb.ts` — a keyword-matched knowledge-base chatbot (site FAQ) used on the marketing site, backed by the `openai` SDK.
- `lib/site-config.ts` — canonical `SITE_URL` (must resolve to `https://www.streamtly.com`); used for sitemaps, canonical tags, OG tags, and email links. `app/api/indexnow/route.ts` submits URLs to IndexNow for SEO.
- `lib/blog-posts.ts` / `lib/articles.ts` — statically defined content for `/blog` and `/articles/[slug]`; `app/guides/*` and `(marketing)/guides/[slug]` are separate hand-written vs. DB-driven guide systems.

### UI Components

Shared UI primitives in `components/ui/` are shadcn/ui components (Radix UI + Tailwind). Add new shadcn components via:
```bash
npx shadcn add <component>
```

Global layout in `app/layout.tsx` wraps all routes with `<Navbar>` and `<Footer>`.
