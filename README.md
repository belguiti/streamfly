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

# PayPal (Phase 2)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
PAYPAL_MODE=sandbox
```

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. In the SQL Editor, run `supabase/migrations/001_init.sql`.
3. Run `supabase/migrations/002_phase2.sql` for PayPal + auto-provisioning tables.
4. Replace the `price_1m_placeholder` dummy values in the `plans` table with your actual Stripe Price IDs.
5. **(Optional)** Add PayPal Plan IDs to the `paypal_plan_id` column in the `plans` table.
6. **How to set an admin user:**
   `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';`

### 2. Stripe Setup
1. Create a Stripe Product called "Stream4U Subscription".
2. Create 4 recurring prices (1m, 3m, 6m, 12m).
3. Copy the created Price IDs and update the `plans` table in Supabase.
4. Enable the Stripe Customer Portal.
5. Set up a Webhook: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

### 3. PayPal Setup (Phase 2)
1. Create a PayPal Developer REST API App at https://developer.paypal.com.
2. Create a Product and subscription Plans in PayPal (matching your 1/3/6/12 month plans).
3. Copy the PayPal Plan IDs and update the `paypal_plan_id` column in your `plans` table.
4. Set up a Webhook in PayPal: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED`, `PAYMENT.SALE.COMPLETED`.
5. Copy the Webhook ID and add to your environment variables.

### 4. Auto-Provisioning (Activation Pool)
1. Log in as an admin and go to `/admin/pool`.
2. Select a plan, paste your activation codes (one per line), and click "Add to Pool".
3. When a user pays, the system will automatically assign a code from the pool.
4. If no codes are available, the subscription stays as `pending_activation` for manual admin activation at `/admin/orders`.

### 5. Local Development
1. Clone / pull the repo.
2. Run `npm install`.
3. Fill in your `.env.local`.
4. Run `npm run dev`.

### 6. Vercel Deployment & Domain Connection
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Configure **ALL** Environment Variables in the Vercel dashboard.
4. Deploy the project.
5. Go to Vercel Settings > Domains. Add `stream4u.com`. Update your DNS records as instructed.

### QA Checklist
- [ ] Users can sign up / log in.
- [ ] Users can view pricing with both Stripe and PayPal buttons.
- [ ] Stripe checkout redirects and captures payment.
- [ ] PayPal checkout redirects and captures payment.
- [ ] Stripe webhook sets subscription to `pending_activation`.
- [ ] PayPal webhook sets subscription to `pending_activation`.
- [ ] Auto-provisioning assigns an activation code if pool has entries.
- [ ] Admin can view pool inventory at `/admin/pool`.
- [ ] Admin can bulk-add codes to the pool.
- [ ] Admin can manually activate subscriptions at `/admin/orders`.
- [ ] User sees provider badge (Stripe/PayPal) on dashboard.
- [ ] User can access correct billing portal (Stripe or PayPal).

---

## Phase 3 (Future Roadmap)
- **External API Provisioning:** Connect to streaming service APIs for fully automated account creation.
- **Email Notifications:** Send activation details via email to users.
