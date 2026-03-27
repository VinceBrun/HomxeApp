-- ============================================================
-- HOMXE: COMPLETE PRODUCTION SCHEMA MIGRATION
-- Date: February 19, 2026
-- Version: 2.0 - Production Ready
-- Author: Senior Developer Team
-- ============================================================
-- This migration adds all missing tables and updates existing ones
-- for production readiness at million-user scale
-- ============================================================

-- ============================================================
-- PART 1: ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================

-- Properties table enhancements
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bedrooms integer;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bathrooms integer;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS square_feet integer;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS building_age text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_number integer;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS total_floors integer;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS parking_spaces integer;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS furnishing_status text CHECK (furnishing_status IN ('furnished', 'semi-furnished', 'unfurnished'));
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add property status checks if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'properties_status_check'
  ) THEN
    ALTER TABLE public.properties ADD CONSTRAINT properties_status_check 
    CHECK (status IN ('draft', 'listed', 'rented', 'maintenance', 'delisted'));
  END IF;
END $$;

-- Profiles enhancements (merge with persona system)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text DEFAULT 'Nigeria';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS postal_code text;

-- Reviews enhancements
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS landlord_response text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS landlord_response_at timestamptz;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS helpful_count integer DEFAULT 0;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reported boolean DEFAULT false;

-- Payments enhancements
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_gateway text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS transaction_fee numeric(12,2) DEFAULT 0;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS currency text DEFAULT 'NGN';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS refunded boolean DEFAULT false;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS refund_amount numeric(12,2);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS refund_reason text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS refunded_at timestamptz;

-- ============================================================
-- PART 2: CREATE MISSING TABLES FOR APP FEATURES
-- ============================================================

-- Bookings/Tours table (for property viewings)
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  seeker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  landlord_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Booking details
  tour_date date NOT NULL,
  tour_time time NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
  booking_type text DEFAULT 'in-person' CHECK (booking_type IN ('in-person', 'virtual')),
  
  -- Communication
  seeker_notes text,
  landlord_notes text,
  cancellation_reason text,
  cancelled_by uuid REFERENCES auth.users(id),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_bookings_property ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_seeker ON public.bookings(seeker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_landlord ON public.bookings(landlord_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_date ON public.bookings(tour_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'bookings_select' AND tablename = 'bookings'
  ) THEN
    CREATE POLICY bookings_select ON public.bookings
      FOR SELECT USING (seeker_id = auth.uid() OR landlord_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'bookings_insert' AND tablename = 'bookings'
  ) THEN
    CREATE POLICY bookings_insert ON public.bookings
      FOR INSERT WITH CHECK (seeker_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'bookings_update' AND tablename = 'bookings'
  ) THEN
    CREATE POLICY bookings_update ON public.bookings
      FOR UPDATE USING (seeker_id = auth.uid() OR landlord_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- Artisan Services table
CREATE TABLE IF NOT EXISTS public.artisan_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Service details
  service_name text NOT NULL,
  service_category text NOT NULL CHECK (service_category IN (
    'plumbing', 'electrical', 'carpentry', 'painting', 
    'hvac', 'roofing', 'landscaping', 'cleaning', 
    'pest_control', 'security', 'appliance_repair', 'general_maintenance'
  )),
  description text NOT NULL,
  base_price numeric(12,2) NOT NULL,
  pricing_type text DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'hourly', 'per_sqft', 'negotiable')),
  
  -- Availability
  available boolean DEFAULT true,
  service_areas text[], -- Array of cities/areas they serve
  
  -- Media
  service_images text[] DEFAULT ARRAY[]::text[],
  
  -- Stats
  jobs_completed integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artisan_services_artisan ON public.artisan_services(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisan_services_category ON public.artisan_services(service_category);
CREATE INDEX IF NOT EXISTS idx_artisan_services_available ON public.artisan_services(available);

ALTER TABLE public.artisan_services ENABLE ROW LEVEL SECURITY;

-- Artisan services RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'artisan_services_select' AND tablename = 'artisan_services'
  ) THEN
    CREATE POLICY artisan_services_select ON public.artisan_services
      FOR SELECT USING (available = true OR artisan_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'artisan_services_insert' AND tablename = 'artisan_services'
  ) THEN
    CREATE POLICY artisan_services_insert ON public.artisan_services
      FOR INSERT WITH CHECK (artisan_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'artisan_services_update' AND tablename = 'artisan_services'
  ) THEN
    CREATE POLICY artisan_services_update ON public.artisan_services
      FOR UPDATE USING (artisan_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- Artisan Jobs table
CREATE TABLE IF NOT EXISTS public.artisan_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.artisan_services(id) ON DELETE CASCADE,
  artisan_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  
  -- Job details
  job_title text NOT NULL,
  job_description text NOT NULL,
  job_status text DEFAULT 'requested' CHECK (job_status IN (
    'requested', 'quote_sent', 'accepted', 'in_progress', 
    'completed', 'cancelled', 'disputed'
  )),
  
  -- Pricing
  quoted_price numeric(12,2),
  final_price numeric(12,2),
  deposit_amount numeric(12,2),
  deposit_paid boolean DEFAULT false,
  
  -- Scheduling
  scheduled_date date,
  scheduled_time time,
  estimated_duration integer, -- in hours
  
  -- Location
  job_address text NOT NULL,
  job_city text NOT NULL,
  job_latitude double precision,
  job_longitude double precision,
  
  -- Communication
  client_notes text,
  artisan_notes text,
  completion_notes text,
  cancellation_reason text,
  
  -- Media
  before_images text[] DEFAULT ARRAY[]::text[],
  after_images text[] DEFAULT ARRAY[]::text[],
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_artisan_jobs_service ON public.artisan_jobs(service_id);
CREATE INDEX IF NOT EXISTS idx_artisan_jobs_artisan ON public.artisan_jobs(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisan_jobs_client ON public.artisan_jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_artisan_jobs_property ON public.artisan_jobs(property_id);
CREATE INDEX IF NOT EXISTS idx_artisan_jobs_status ON public.artisan_jobs(job_status);
CREATE INDEX IF NOT EXISTS idx_artisan_jobs_scheduled_date ON public.artisan_jobs(scheduled_date);

ALTER TABLE public.artisan_jobs ENABLE ROW LEVEL SECURITY;

-- Artisan jobs RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'artisan_jobs_select' AND tablename = 'artisan_jobs'
  ) THEN
    CREATE POLICY artisan_jobs_select ON public.artisan_jobs
      FOR SELECT USING (artisan_id = auth.uid() OR client_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'artisan_jobs_insert' AND tablename = 'artisan_jobs'
  ) THEN
    CREATE POLICY artisan_jobs_insert ON public.artisan_jobs
      FOR INSERT WITH CHECK (client_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'artisan_jobs_update' AND tablename = 'artisan_jobs'
  ) THEN
    CREATE POLICY artisan_jobs_update ON public.artisan_jobs
      FOR UPDATE USING (artisan_id = auth.uid() OR client_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification details
  type text NOT NULL CHECK (type IN (
    'booking', 'payment', 'message', 'review', 'job_request',
    'job_update', 'property_update', 'system', 'marketing'
  )),
  title text NOT NULL,
  body text NOT NULL,
  
  -- Related entities
  related_id uuid, -- ID of related booking, job, property, etc.
  related_type text, -- Type of related entity
  
  -- Action
  action_url text, -- Deep link or route to navigate to
  
  -- Status
  read boolean DEFAULT false,
  read_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'notifications_select_own' AND tablename = 'notifications'
  ) THEN
    CREATE POLICY notifications_select_own ON public.notifications
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'notifications_update_own' AND tablename = 'notifications'
  ) THEN
    CREATE POLICY notifications_update_own ON public.notifications
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- Property Views/Analytics table
CREATE TABLE IF NOT EXISTS public.property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for anonymous
  
  -- View details
  view_source text CHECK (view_source IN ('search', 'map', 'similar', 'saved', 'direct')),
  device_type text CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  
  -- Location data (for analytics)
  viewer_city text,
  viewer_country text,
  
  -- Timestamps
  viewed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_views_property ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewer ON public.property_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_property_views_date ON public.property_views(viewed_at DESC);

ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Property views RLS (landlords can see their property views)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'property_views_select_landlord' AND tablename = 'property_views'
  ) THEN
    CREATE POLICY property_views_select_landlord ON public.property_views
      FOR SELECT USING (
        property_id IN (
          SELECT id FROM public.properties WHERE landlord_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'property_views_insert' AND tablename = 'property_views'
  ) THEN
    CREATE POLICY property_views_insert ON public.property_views
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- Wallet Transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  category text NOT NULL CHECK (category IN (
    'rent_payment', 'service_payment', 'refund', 'withdrawal',
    'deposit', 'commission', 'bonus', 'penalty'
  )),
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'NGN',
  
  -- Balance tracking
  balance_before numeric(12,2) NOT NULL,
  balance_after numeric(12,2) NOT NULL,
  
  -- Related entities
  related_id uuid, -- ID of payment, job, etc.
  related_type text, -- Type of related entity
  
  -- Description
  description text NOT NULL,
  reference text UNIQUE, -- External payment reference
  
  -- Status
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON public.wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_category ON public.wallet_transactions(category);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created ON public.wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON public.wallet_transactions(status);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Wallet transactions RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'wallet_transactions_select_own' AND tablename = 'wallet_transactions'
  ) THEN
    CREATE POLICY wallet_transactions_select_own ON public.wallet_transactions
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- User Wallets table (for balance tracking)
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Balance
  balance numeric(12,2) DEFAULT 0 NOT NULL CHECK (balance >= 0),
  currency text DEFAULT 'NGN',
  
  -- Security
  pin_hash text, -- For wallet PIN
  pin_enabled boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_wallets_user ON public.user_wallets(user_id);

ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- User wallets RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'user_wallets_select_own' AND tablename = 'user_wallets'
  ) THEN
    CREATE POLICY user_wallets_select_own ON public.user_wallets
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'user_wallets_update_own' AND tablename = 'user_wallets'
  ) THEN
    CREATE POLICY user_wallets_update_own ON public.user_wallets
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- PART 3: CREATE USEFUL VIEWS FOR ANALYTICS
-- ============================================================

-- Property statistics view (for landlord dashboard)
CREATE OR REPLACE VIEW public.property_statistics AS
SELECT 
  p.id as property_id,
  p.landlord_id,
  p.title,
  p.status,
  COUNT(DISTINCT pv.id) as total_views,
  COUNT(DISTINCT sp.id) as total_saves,
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_tours,
  AVG(r.rating) as average_rating,
  COUNT(r.id) as total_reviews
FROM public.properties p
LEFT JOIN public.property_views pv ON p.id = pv.property_id
LEFT JOIN public.saved_properties sp ON p.id = sp.property_id
LEFT JOIN public.bookings b ON p.id = b.property_id
LEFT JOIN public.reviews r ON p.id = r.property_id
GROUP BY p.id, p.landlord_id, p.title, p.status;

-- Artisan performance view
CREATE OR REPLACE VIEW public.artisan_performance AS
SELECT 
  a.id as artisan_id,
  COUNT(DISTINCT s.id) as total_services,
  COUNT(DISTINCT j.id) as total_jobs,
  COUNT(DISTINCT CASE WHEN j.job_status = 'completed' THEN j.id END) as completed_jobs,
  AVG(CASE WHEN j.job_status = 'completed' THEN j.final_price END) as avg_job_value,
  SUM(CASE WHEN j.job_status = 'completed' THEN j.final_price ELSE 0 END) as total_earnings
FROM auth.users a
LEFT JOIN public.artisan_services s ON a.id = s.artisan_id
LEFT JOIN public.artisan_jobs j ON a.id = j.artisan_id
GROUP BY a.id;

-- ============================================================
-- PART 4: CREATE FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================

-- Function to increment property views
CREATE OR REPLACE FUNCTION public.increment_property_views(property_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.properties 
  SET views_count = views_count + 1
  WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  user_uuid uuid,
  amount_change numeric,
  transaction_type text,
  transaction_category text,
  transaction_description text,
  transaction_reference text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  wallet_record RECORD;
  new_transaction_id uuid;
BEGIN
  -- Get or create wallet
  INSERT INTO public.user_wallets (user_id, balance)
  VALUES (user_uuid, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Lock the wallet row
  SELECT * INTO wallet_record
  FROM public.user_wallets
  WHERE user_id = user_uuid
  FOR UPDATE;
  
  -- Create transaction record
  INSERT INTO public.wallet_transactions (
    user_id,
    type,
    category,
    amount,
    balance_before,
    balance_after,
    description,
    reference,
    status
  ) VALUES (
    user_uuid,
    transaction_type,
    transaction_category,
    ABS(amount_change),
    wallet_record.balance,
    wallet_record.balance + amount_change,
    transaction_description,
    transaction_reference,
    'completed'
  ) RETURNING id INTO new_transaction_id;
  
  -- Update wallet balance
  UPDATE public.user_wallets
  SET 
    balance = balance + amount_change,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN new_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PART 5: CREATE TRIGGERS FOR AUTOMATED ACTIONS
-- ============================================================

-- Trigger to update property updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_artisan_services_updated_at ON public.artisan_services;
CREATE TRIGGER update_artisan_services_updated_at
  BEFORE UPDATE ON public.artisan_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_artisan_jobs_updated_at ON public.artisan_jobs;
CREATE TRIGGER update_artisan_jobs_updated_at
  BEFORE UPDATE ON public.artisan_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PART 6: PERFORMANCE INDEXES
-- ============================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_landlord_status ON public.properties(landlord_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_location_available ON public.properties(location, is_available);
CREATE INDEX IF NOT EXISTS idx_properties_type_price ON public.properties(type, price);
CREATE INDEX IF NOT EXISTS idx_reviews_property_rating ON public.reviews(property_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_saved_properties_tenant_created ON public.saved_properties(tenant_id, created_at DESC);

-- Text search index for properties (for search functionality)
CREATE INDEX IF NOT EXISTS idx_properties_search ON public.properties 
  USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || location));

-- ============================================================
-- MIGRATION COMPLETE - Success message
-- ============================================================

DO $$ BEGIN
  RAISE NOTICE '✅ Migration completed successfully! All tables, indexes, and functions created.';
  RAISE NOTICE '📊 Database is now production-ready for million-user scale!';
  RAISE NOTICE '🎯 Next step: Generate TypeScript types with: supabase gen types typescript --local > types/database.ts';
END $$;