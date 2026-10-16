-- =============================================================================
-- Questra World — Full Database Schema (Hompage + User Dashboard + Admin Dashboard)
-- Project: tgynmnzvcfebouymtyau
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================

-- -------------------------------------------------------------------
-- 1. USERS (Login/Session support: user1/admin + general users)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  full_name_bn TEXT,
  email TEXT,
  phone TEXT,
  password TEXT,
  role TEXT CHECK (role IN ('investor','admin')) DEFAULT 'investor',
  member_id TEXT,
  referral_code TEXT,
  sponsor_username TEXT,
  branch TEXT,
  city TEXT,
  address TEXT,
  nid_no TEXT,
  avatar TEXT,
  nominee JSONB DEFAULT '{}',
  bank_name TEXT,
  bank_branch TEXT,
  bank_account TEXT,
  bank_routing_number TEXT,
  mfs_number TEXT,
  joined_date TEXT,
  e2e_encryption_key TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  transaction_pin TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 2. SIGNUPS (Public Registration)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  password TEXT,
  transaction_pin TEXT,
  reference_username TEXT,
  member_id TEXT,
  joined_date TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT signups_username_unique UNIQUE (username)
);

-- -------------------------------------------------------------------
-- 3. ADMIN INVESTORS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_investors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT,
  full_name TEXT,
  full_name_bn TEXT,
  email TEXT,
  phone TEXT,
  member_id TEXT,
  referral_code TEXT,
  sponsor_username TEXT,
  branch TEXT,
  role TEXT CHECK (role IN ('investor','admin')) DEFAULT 'investor',
  status TEXT CHECK (status IN ('Active','Pending KYC','Suspended')) DEFAULT 'Active',
  avatar TEXT,
  address TEXT,
  city TEXT,
  nid_no TEXT,
  nominee JSONB DEFAULT '{}',
  bank_name TEXT,
  bank_branch TEXT,
  bank_account TEXT,
  bank_routing_number TEXT,
  mfs_number TEXT,
  kyc_status TEXT CHECK (kyc_status IN ('Verified','Pending','Rejected')) DEFAULT 'Pending',
  kyc_documents JSONB DEFAULT '{}',
  investment_amount NUMERIC DEFAULT 0,
  share_holding NUMERIC DEFAULT 0,
  total_dividends NUMERIC DEFAULT 0,
  pending_installments INTEGER DEFAULT 0,
  password TEXT,
  transaction_pin TEXT,
  joined_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 4. SHARE INVESTMENTS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.share_investments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  project_name TEXT,
  unit TEXT,
  unit_type TEXT,
  total_price NUMERIC DEFAULT 0,
  booking_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  remaining_amount NUMERIC DEFAULT 0,
  installment_plan TEXT,
  number_of_installments INTEGER DEFAULT 0,
  next_due_date TEXT,
  status TEXT CHECK (status IN ('Active','Completed','Defaulted')) DEFAULT 'Active',
  share_percentage NUMERIC DEFAULT 0,
  registration_no TEXT,
  possession_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 5. INSTALLMENTS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.installments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  project TEXT,
  installment_no INTEGER,
  due_date TEXT,
  amount NUMERIC DEFAULT 0,
  paid_date TEXT,
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT CHECK (status IN ('Due','Paid','Overdue','Cancelled')) DEFAULT 'Due',
  receipt_no TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 6. TRANSACTIONS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  type TEXT CHECK (type IN ('Credit','Debit','Dividend','Refund','Transfer')) DEFAULT 'Credit',
  amount NUMERIC DEFAULT 0,
  description TEXT,
  date TEXT,
  balance NUMERIC DEFAULT 0,
  reference TEXT,
  channel TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 7. DOUBLE PROFIT PLANS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.double_profit_plans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  package_name TEXT,
  principal_amount NUMERIC DEFAULT 0,
  total_return NUMERIC DEFAULT 0,
  monthly_installment NUMERIC DEFAULT 0,
  tenure_months INTEGER DEFAULT 12,
  start_date TEXT,
  end_date TEXT,
  status TEXT CHECK (status IN ('Active','Completed','Cancelled')) DEFAULT 'Active',
  paid_installments INTEGER DEFAULT 0,
  remaining_installments INTEGER DEFAULT 12,
  ledger JSONB DEFAULT '[]',
  next_payout_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 7b. INSTALLMENT RECEIPTS (installments CREDITED to an investor)
--     The 12-Month Double Profit scheme pays capital + profit back in
--     12 equal monthly installments; every credited installment produces
--     one receipt row. Unlike `installments` (money the investor PAYS),
--     these are payouts the investor RECEIVES.
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.installment_receipts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT,
  member_name TEXT,
  plan_id TEXT,
  investment_title TEXT,
  principal_amount NUMERIC DEFAULT 0,
  installment_no INTEGER,
  total_installments INTEGER DEFAULT 12,
  amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  scheduled_date TEXT,
  received_date TEXT,
  status TEXT CHECK (status IN ('Received','Processing','Upcoming')) DEFAULT 'Upcoming',
  credit_method TEXT,
  reference_no TEXT,
  receipt_no TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 8. DEPOSIT SLIPS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deposit_slips (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slip_no TEXT UNIQUE,
  member_id TEXT,
  member_name TEXT,
  project TEXT,
  amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  bank_name TEXT,
  branch_name TEXT,
  account_no TEXT,
  transaction_id TEXT,
  reference_no TEXT,
  payment_method TEXT,
  deposit_date TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('Pending','Approved','Rejected')) DEFAULT 'Pending',
  remarks TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  rejected_reason TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 9. REFERRAL SIGNUPS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referral_signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  referrer_username TEXT,
  referrer_member_id TEXT,
  signup_username TEXT,
  signup_member_id TEXT,
  signup_name TEXT,
  level INTEGER DEFAULT 1,
  amount_earned NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('Pending','Paid','Cancelled')) DEFAULT 'Pending',
  paid_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 10. REFERRAL SETTINGS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referral_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  enabled BOOLEAN DEFAULT TRUE,
  level1_percent NUMERIC DEFAULT 10,
  level2_percent NUMERIC DEFAULT 5,
  level3_percent NUMERIC DEFAULT 2,
  direct_bonus NUMERIC DEFAULT 50,
  payout_method TEXT DEFAULT 'Wallet',
  min_payout NUMERIC DEFAULT 100,
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT referral_settings_single CHECK (id = 1)
);

-- -------------------------------------------------------------------
-- 11. NOTICES
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  priority TEXT CHECK (priority IN ('High','Medium','Low')) DEFAULT 'Medium',
  category TEXT,
  published BOOLEAN DEFAULT TRUE,
  publish_date TEXT,
  expiry_date TEXT,
  author TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 12. SUPPORT TICKETS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket_no TEXT UNIQUE,
  member_id TEXT,
  member_name TEXT,
  subject TEXT NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('Open','In Progress','Resolved','Closed')) DEFAULT 'Open',
  priority TEXT CHECK (priority IN ('High','Medium','Low')) DEFAULT 'Medium',
  department TEXT,
  assigned_to TEXT,
  replies JSONB DEFAULT '[]',
  last_reply_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 13. NOTIFICATIONS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT,
  title TEXT,
  message TEXT,
  type TEXT CHECK (type IN ('Info','Success','Warning','Error')) DEFAULT 'Info',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 14. SITE VISITS / SITE TOURS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_no TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  email TEXT,
  project TEXT,
  pickup_point TEXT,
  visit_date TEXT,
  guests INTEGER DEFAULT 1,
  notes TEXT,
  status TEXT CHECK (status IN ('Pending','Confirmed','Cancelled','Completed')) DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_tours (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_no TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  email TEXT,
  project TEXT,
  pickup_point TEXT,
  visit_date TEXT,
  guests INTEGER DEFAULT 1,
  notes TEXT,
  status TEXT CHECK (status IN ('Pending','Confirmed','Cancelled','Completed')) DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 15. VACATION BOOKINGS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vacation_bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_no TEXT UNIQUE,
  member_id TEXT,
  member_name TEXT,
  suite_type TEXT,
  check_in TEXT,
  check_out TEXT,
  guests INTEGER DEFAULT 1,
  amount NUMERIC DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('Pending','Paid','Refunded')) DEFAULT 'Pending',
  status TEXT CHECK (status IN ('Pending','Confirmed','Cancelled')) DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 16. AUDIT LOGS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action TEXT,
  target TEXT,
  details TEXT,
  actor TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 17. CMS SECTIONS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_sections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  subtitle TEXT,
  body TEXT,
  kind TEXT CHECK (kind IN ('text','collection','gallery','banner')) DEFAULT 'text',
  collection_key TEXT,
  visible BOOLEAN DEFAULT TRUE,
  "order" INTEGER DEFAULT 0,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 18. CMS COLLECTIONS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_collections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  video_url TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 19. CMS SETTINGS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  brand_name TEXT DEFAULT 'Questra World',
  tagline TEXT DEFAULT 'Official Investor Portal · Global',
  logo TEXT,
  favicon TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image TEXT,
  support_phone TEXT,
  support_email TEXT,
  corporate_address TEXT,
  social_links JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  footer_links JSONB DEFAULT '{}',
  theme JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cms_settings_single CHECK (id = 1)
);

-- -------------------------------------------------------------------
-- 20. CRYPTO PAYMENT SETTINGS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crypto_payment_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  enabled BOOLEAN DEFAULT TRUE,
  network TEXT DEFAULT 'TRC20',
  wallet_address TEXT,
  usdt_contract TEXT,
  rate_bdt_to_usdt NUMERIC DEFAULT 110,
  minimum_usdt NUMERIC DEFAULT 10,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crypto_settings_single CHECK (id = 1)
);

-- -------------------------------------------------------------------
-- INDEXES (Performance)
-- -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS users_username_idx ON public.users(username);
CREATE INDEX IF NOT EXISTS users_member_id_idx ON public.users(member_id);
CREATE INDEX IF NOT EXISTS signups_created_at_idx ON public.signups(created_at DESC);
CREATE INDEX IF NOT EXISTS signups_email_idx ON public.signups(email);
CREATE INDEX IF NOT EXISTS admin_investors_member_id_idx ON public.admin_investors(member_id);
CREATE INDEX IF NOT EXISTS installments_member_id_idx ON public.installments(member_id);
CREATE INDEX IF NOT EXISTS installments_status_idx ON public.installments(status);
CREATE INDEX IF NOT EXISTS installment_receipts_member_id_idx ON public.installment_receipts(member_id);
CREATE INDEX IF NOT EXISTS installment_receipts_plan_id_idx ON public.installment_receipts(plan_id);
CREATE INDEX IF NOT EXISTS installment_receipts_status_idx ON public.installment_receipts(status);
CREATE INDEX IF NOT EXISTS transactions_member_id_idx ON public.transactions(member_id);
CREATE INDEX IF NOT EXISTS deposit_slips_status_idx ON public.deposit_slips(status);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS notifications_member_id_read_idx ON public.notifications(member_id, read);
CREATE INDEX IF NOT EXISTS cms_sections_order_idx ON public.cms_sections("order");
CREATE INDEX IF NOT EXISTS cms_collections_order_idx ON public.cms_collections("order");

-- -------------------------------------------------------------------
-- TRIGGERS: auto-update updated_at
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_updated_at') THEN
    CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'admin_investors_updated_at') THEN
    CREATE TRIGGER admin_investors_updated_at BEFORE UPDATE ON public.admin_investors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'share_investments_updated_at') THEN
    CREATE TRIGGER share_investments_updated_at BEFORE UPDATE ON public.share_investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'installments_updated_at') THEN
    CREATE TRIGGER installments_updated_at BEFORE UPDATE ON public.installments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'double_profit_plans_updated_at') THEN
    CREATE TRIGGER double_profit_plans_updated_at BEFORE UPDATE ON public.double_profit_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'installment_receipts_updated_at') THEN
    CREATE TRIGGER installment_receipts_updated_at BEFORE UPDATE ON public.installment_receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'deposit_slips_updated_at') THEN
    CREATE TRIGGER deposit_slips_updated_at BEFORE UPDATE ON public.deposit_slips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'notices_updated_at') THEN
    CREATE TRIGGER notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'support_tickets_updated_at') THEN
    CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cms_sections_updated_at') THEN
    CREATE TRIGGER cms_sections_updated_at BEFORE UPDATE ON public.cms_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cms_collections_updated_at') THEN
    CREATE TRIGGER cms_collections_updated_at BEFORE UPDATE ON public.cms_collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cms_settings_updated_at') THEN
    CREATE TRIGGER cms_settings_updated_at BEFORE UPDATE ON public.cms_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'crypto_payment_settings_updated_at') THEN
    CREATE TRIGGER crypto_payment_settings_updated_at BEFORE UPDATE ON public.crypto_payment_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'referral_settings_updated_at') THEN
    CREATE TRIGGER referral_settings_updated_at BEFORE UPDATE ON public.referral_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- -------------------------------------------------------------------
-- RLS ENABLE
-- -------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.double_profit_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payment_settings ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------
-- DROP OLD POLICIES IF ANY
-- -------------------------------------------------------------------
DO $$
DECLARE
  tbl TEXT;
  pol TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'users','signups','admin_investors','share_investments','installments',
    'transactions','double_profit_plans','installment_receipts','deposit_slips','referral_signups',
    'referral_settings','notices','support_tickets','notifications',
    'site_visits','site_tours','vacation_bookings','audit_logs',
    'cms_sections','cms_collections','cms_settings','crypto_payment_settings'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "anon_full_access_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "anon_read_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "anon_write_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public_full_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public_select_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public_insert_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public_update_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public_delete_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public can insert signups" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public can read signups" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "public can delete signups" ON public.%I', tbl);
  END LOOP;
END $$;

-- -------------------------------------------------------------------
-- RLS POLICIES (anon + authenticated: public site + admin UI)
-- -------------------------------------------------------------------
-- USERS
CREATE POLICY "public_select_users" ON public.users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_users" ON public.users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_users" ON public.users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_users" ON public.users FOR DELETE TO anon, authenticated USING (true);

-- SIGNUPS
CREATE POLICY "public_select_signups" ON public.signups FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_signups" ON public.signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_delete_signups" ON public.signups FOR DELETE TO anon, authenticated USING (true);

-- ADMIN INVESTORS
CREATE POLICY "public_select_admin_investors" ON public.admin_investors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_admin_investors" ON public.admin_investors FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_admin_investors" ON public.admin_investors FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_admin_investors" ON public.admin_investors FOR DELETE TO anon, authenticated USING (true);

-- SHARE INVESTMENTS
CREATE POLICY "public_select_share_investments" ON public.share_investments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_share_investments" ON public.share_investments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_share_investments" ON public.share_investments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_share_investments" ON public.share_investments FOR DELETE TO anon, authenticated USING (true);

-- INSTALLMENTS
CREATE POLICY "public_select_installments" ON public.installments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_installments" ON public.installments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_installments" ON public.installments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_installments" ON public.installments FOR DELETE TO anon, authenticated USING (true);

-- TRANSACTIONS
CREATE POLICY "public_select_transactions" ON public.transactions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_transactions" ON public.transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_transactions" ON public.transactions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_transactions" ON public.transactions FOR DELETE TO anon, authenticated USING (true);

-- DOUBLE PROFIT PLANS
CREATE POLICY "public_select_double_profit_plans" ON public.double_profit_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_double_profit_plans" ON public.double_profit_plans FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_double_profit_plans" ON public.double_profit_plans FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_double_profit_plans" ON public.double_profit_plans FOR DELETE TO anon, authenticated USING (true);

-- INSTALLMENT RECEIPTS
CREATE POLICY "public_select_installment_receipts" ON public.installment_receipts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_installment_receipts" ON public.installment_receipts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_installment_receipts" ON public.installment_receipts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_installment_receipts" ON public.installment_receipts FOR DELETE TO anon, authenticated USING (true);

-- DEPOSIT SLIPS
CREATE POLICY "public_select_deposit_slips" ON public.deposit_slips FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_deposit_slips" ON public.deposit_slips FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_deposit_slips" ON public.deposit_slips FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_deposit_slips" ON public.deposit_slips FOR DELETE TO anon, authenticated USING (true);

-- REFERRAL SIGNUPS
CREATE POLICY "public_select_referral_signups" ON public.referral_signups FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_referral_signups" ON public.referral_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_referral_signups" ON public.referral_signups FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_referral_signups" ON public.referral_signups FOR DELETE TO anon, authenticated USING (true);

-- REFERRAL SETTINGS
CREATE POLICY "public_select_referral_settings" ON public.referral_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_referral_settings" ON public.referral_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_referral_settings" ON public.referral_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_referral_settings" ON public.referral_settings FOR DELETE TO anon, authenticated USING (true);

-- NOTICES
CREATE POLICY "public_select_notices" ON public.notices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_notices" ON public.notices FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_notices" ON public.notices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_notices" ON public.notices FOR DELETE TO anon, authenticated USING (true);

-- SUPPORT TICKETS
CREATE POLICY "public_select_support_tickets" ON public.support_tickets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_support_tickets" ON public.support_tickets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_support_tickets" ON public.support_tickets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_support_tickets" ON public.support_tickets FOR DELETE TO anon, authenticated USING (true);

-- NOTIFICATIONS
CREATE POLICY "public_select_notifications" ON public.notifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_notifications" ON public.notifications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_notifications" ON public.notifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_notifications" ON public.notifications FOR DELETE TO anon, authenticated USING (true);

-- SITE VISITS
CREATE POLICY "public_select_site_visits" ON public.site_visits FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_site_visits" ON public.site_visits FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_site_visits" ON public.site_visits FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_site_visits" ON public.site_visits FOR DELETE TO anon, authenticated USING (true);

-- SITE TOURS
CREATE POLICY "public_select_site_tours" ON public.site_tours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_site_tours" ON public.site_tours FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_site_tours" ON public.site_tours FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_site_tours" ON public.site_tours FOR DELETE TO anon, authenticated USING (true);

-- VACATION BOOKINGS
CREATE POLICY "public_select_vacation_bookings" ON public.vacation_bookings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_vacation_bookings" ON public.vacation_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_vacation_bookings" ON public.vacation_bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_vacation_bookings" ON public.vacation_bookings FOR DELETE TO anon, authenticated USING (true);

-- AUDIT LOGS
CREATE POLICY "public_select_audit_logs" ON public.audit_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_audit_logs" ON public.audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- CMS SECTIONS
CREATE POLICY "public_select_cms_sections" ON public.cms_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_cms_sections" ON public.cms_sections FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_cms_sections" ON public.cms_sections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_cms_sections" ON public.cms_sections FOR DELETE TO anon, authenticated USING (true);

-- CMS COLLECTIONS
CREATE POLICY "public_select_cms_collections" ON public.cms_collections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_cms_collections" ON public.cms_collections FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_cms_collections" ON public.cms_collections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_cms_collections" ON public.cms_collections FOR DELETE TO anon, authenticated USING (true);

-- CMS SETTINGS
CREATE POLICY "public_select_cms_settings" ON public.cms_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_cms_settings" ON public.cms_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_cms_settings" ON public.cms_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_cms_settings" ON public.cms_settings FOR DELETE TO anon, authenticated USING (true);

-- CRYPTO PAYMENT SETTINGS
CREATE POLICY "public_select_crypto_payment_settings" ON public.crypto_payment_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_crypto_payment_settings" ON public.crypto_payment_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_update_crypto_payment_settings" ON public.crypto_payment_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_crypto_payment_settings" ON public.crypto_payment_settings FOR DELETE TO anon, authenticated USING (true);

-- -------------------------------------------------------------------
-- DEFAULT SEED DATA
-- -------------------------------------------------------------------
INSERT INTO public.cms_settings (id, brand_name, tagline, support_phone, support_email, corporate_address)
VALUES (1, 'Questra World', 'Official Investor Portal · Global', '+1 415 555 0101', 'support@questraworld.com', 'Questra World Tower, International Business District, Dubai')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.crypto_payment_settings (id, enabled, network, wallet_address)
VALUES (1, true, 'TRC20', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.referral_settings (id, enabled, level1_percent, level2_percent, level3_percent, direct_bonus, payout_method, min_payout, currency)
VALUES (1, true, 10, 5, 2, 50, 'Wallet', 100, 'USD')
ON CONFLICT (id) DO NOTHING;

-- END OF SCHEMA
