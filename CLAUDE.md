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

## Architecture

Stream4U is a Next.js 16 (App Router) subscription platform backed by Supabase and Stripe, with PayPal as Phase 2.

### Route Groups

The `app/` directory is organized into four route groups:

| Group | Routes | Access |
|---|---|---|
| `(marketing)` | `/`, `/pricing`, `/pricing/[id]`, `/terms`, `/privacy`, `/refund`, `/reviews`, `/blog`, `/contact`, `/guides` | Public |
| `(auth)` | `/sign-in`, `/sign-up` | Unauthenticated only |
| `(app)` | `/app` | Authenticated users |
| `(admin)` | `/admin/orders`, `/admin/orders/[id]`, `/admin/pool` | Admin role only |

Auth signout is a Route Handler at `app/auth/signout/route.ts`.

### Middleware & Auth Guards

`middleware.ts` delegates to `lib/supabase/middleware.ts`. The middleware handles three guards:
1. Authenticated users visiting `/sign-in` or `/sign-up` → redirect to `/app`
2. Unauthenticated users visiting `/app` or `/admin/**` → redirect to `/sign-in`
3. Non-admin users visiting `/admin/**` → redirect to `/app` (role checked via service role client to bypass RLS)

### Supabase Client Pattern

Two clients exist in `lib/supabase/`:
- `createClient()` in `server.ts` — cookie-based SSR client for Server Components and Route Handlers that act on behalf of users. Respects RLS.
- `supabaseAdmin` in `server.ts` — service role client, bypasses RLS. **Only for webhook handlers and server-side provisioning.** Never expose to browser.
- `lib/supabase/client.ts` — browser client for Client Components.

### Payment Flow

Both Stripe and PayPal follow the same lifecycle:
1. Client calls checkout API (`/api/stripe/checkout` or `/api/paypal/checkout`) with `planId`
2. User is redirected to hosted payment page
3. On success, payment provider calls the webhook handler
4. Webhook handler:
   - Inserts a row into `orders` (status: `paid`)
   - Upserts a row into `subscriptions` (status: `pending_activation`)
   - Calls `autoProvision()` from `lib/provisioning.ts`
5. `autoProvision()` claims an unused row from `activation_pool` for the plan, inserts into `activations`, and updates the subscription to `active`. If no pool entries exist, the subscription stays `pending_activation` for manual admin activation at `/admin/orders`.

### Database Schema (Supabase)

Migrations are in `supabase/migrations/` and must be run in order:
- `001_init.sql` — core tables: `profiles`, `plans`, `subscriptions`, `activations`, `orders` + RLS policies + trigger to auto-create a `profiles` row on signup
- `002_phase2.sql` — adds PayPal columns, creates `activation_pool` table

**To promote a user to admin:**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

After running migrations, update the `plans` table to replace placeholder Stripe Price IDs with real ones.

### UI Components

Shared UI primitives in `components/ui/` are shadcn/ui components (Radix UI + Tailwind). Add new shadcn components via:
```bash
npx shadcn add <component>
```

Global layout in `app/layout.tsx` wraps all routes with `<Navbar>` and `<Footer>`.
