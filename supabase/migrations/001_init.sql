-- 001_init.sql

-- Enable uuid-ossp extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- A) profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B) plans
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    duration_months INT NOT NULL,
    price_cents INT NOT NULL,
    stripe_price_id TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- C) subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('pending_activation', 'active', 'canceled', 'past_due')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D) activations
CREATE TABLE activations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('activation_code', 'account', 'note')),
    value TEXT NOT NULL,
    activated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    activated_at TIMESTAMPTZ DEFAULT NOW()
);

-- E) orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    provider TEXT CHECK (provider IN ('stripe', 'paypal')),
    status TEXT CHECK (status IN ('paid', 'failed', 'refunded')),
    amount_cents INT NOT NULL,
    currency TEXT DEFAULT 'USD',
    stripe_checkout_session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- RLS POLICIES
-- -------------------------------------------------------------

-- profiles: user can read/update their own; admin can read all
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- plans: readable by everyone (public read)
CREATE POLICY "Plans are visible to everyone" 
ON plans FOR SELECT USING (true);

-- subscriptions: user can read their own; admin can read all; only admin can update status
CREATE POLICY "Users can view own subscriptions" 
ON subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything on subscriptions" 
ON subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- activations: user can read their own; admin can read all; only admin can update/insert
CREATE POLICY "Users can view own activations" 
ON activations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE subscriptions.id = activations.subscription_id 
        AND subscriptions.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can do everything on activations" 
ON activations FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- orders: user can read their own; admin can read all
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything on orders" 
ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create a trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- -------------------------------------------------------------
-- SEED DATA
-- -------------------------------------------------------------
-- Replace 'stripe_price_id_*' with your actual Stripe Price IDs
INSERT INTO plans (name, duration_months, price_cents, stripe_price_id) VALUES
('1 Month', 1, 1299, 'price_1m_placeholder'),
('3 Months', 3, 3499, 'price_3m_placeholder'),
('6 Months', 6, 5999, 'price_6m_placeholder'),
('12 Months', 12, 9999, 'price_12m_placeholder');
