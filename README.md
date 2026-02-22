# Stream4U

Stream4U is a licensed streaming subscription and activation-delivery platform.

## PRD (Product Requirements Document)

### Goal
A working production-ready MVP deployed on Vercel for generic subscriptions + manual activation-delivery.

### Key Product Decisions
- **Currency:** USD
- **Plans:** 1 / 3 / 6 / 12 months
- **Pricing:**
  - 1 month: $12.99
  - 3 months: $34.99
  - 6 months: $59.99
  - 12 months: $99.99
- **Provisioning:** Manual initially. Status becomes `pending_activation` after payment. Admin activates it via dashboard.

### Core Features
- Marketing site `/`, `/pricing`, `/terms`, `/privacy`, `/refund`
- Authentication (Supabase Auth)
- Checkout & Subscriptions via Stripe Checkout and Customer Portal
- User Dashboard (`/app`) for checking status, plan, & activation details
- Admin Panel (`/admin/orders`) for managing and manually activating subscriptions

---

## Environment Variables
Create a `.env.local` based on this list:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PORTAL_RETURN_URL=http://localhost:3000/app
STRIPE_SUCCESS_URL=http://localhost:3000/app?success=true
STRIPE_CANCEL_URL=http://localhost:3000/pricing?canceled=true
```

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. In the SQL Editor, run the migration provided in `supabase/migrations/001_init.sql`.
3. To test with stripe properly, replace the `price_1m_placeholder` dummy values in the `plans` table with your actual Stripe Price IDs!
4. **How to set an admin user:**
   After signing up locally, run this in your Supabase SQL Editor:
   `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';`

### 2. Stripe Setup
1. Create a Stripe Product called "Stream4U Subscription".
2. Create 4 recurring prices (1m, 3m, 6m, 12m) using the pricing mentioned in the PRD (interval: month, interval_count: 1/3/6/12).
3. Copy the created Price IDs and update the `plans` table in Supabase.
4. Enable the Stripe Customer Portal.
5. Set up a Webhook for your local/production environment:
   Events needed: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

### 3. Local Development
1. Clone / pull the repo.
2. Run `npm install`.
3. Fill in your `.env.local`.
4. Run `npm run dev`.

### 4. Vercel Deployment & Domain Connection
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Configure **ALL** Environment Variables in the Vercel dashboard.
4. Deploy the project.
5. Go to Vercel Settings > Domains. Add `stream4u.com`. Update your DNS records (A Record/CNAME) as instructed by Vercel.

### 5. QA Checklist
- [ ] Users can sign up / log in.
- [ ] Users can view pricing.
- [ ] Checkout redirects to Stripe properly and captures payment.
- [ ] Webhook successfully sets subscription to `pending_activation`.
- [ ] Admin can view the subscription in `/admin/orders`.
- [ ] Admin can set an activation note/code.
- [ ] User can see activation info in `/app`.
- [ ] User can access Stripe billing portal from `/app/billing`.

---

## Phase 2 (Future Roadmap)
- **PayPal Subscriptions:** Add a provider column handler for PayPal webhooks, mirror Stripe logic.
- **Auto-provisioning:** Setup an internal API, a secure queue/cron worker that calls provider API, fetches credentials, and encrypts activation values before storing them.
