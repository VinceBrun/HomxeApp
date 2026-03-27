-- ============================================================
-- HOMXE: COMPLETE AUTH & PERSONA SYSTEM MIGRATION
-- Updated: January 15, 2026
-- Includes: Auth flow, onboarding, persona system, permissions
-- ============================================================

-- Create persona type enum
DO $$ BEGIN
  CREATE TYPE public.persona_type AS ENUM ('seeker', 'owner', 'artisan');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- ============================================================
-- PART 1: CREATE USER_PERSONAS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.persona_type NOT NULL,
  display_name text NULL,
  avatar_url text NULL,
  bio text NULL,
  kyc_status text DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_persona UNIQUE (user_id, type)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_personas_user_id ON public.user_personas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_personas_type ON public.user_personas(type);

-- Enable RLS
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_personas' AND policyname = 'personas_select_self'
  ) THEN
    CREATE POLICY personas_select_self ON public.user_personas
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_personas' AND policyname = 'personas_modify_self'
  ) THEN
    CREATE POLICY personas_modify_self ON public.user_personas
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- PART 2: CREATE PROFILES TABLE (Enhanced with Auth Fields)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NULL,
  phone_number text NULL,
  current_persona_id uuid NULL REFERENCES public.user_personas(id) ON DELETE SET NULL,
  
  -- Auth & Onboarding Fields
  onboarding_completed boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  biometrics_enabled boolean DEFAULT false,
  location_enabled boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
-- CREATE INDEX IF NOT EXISTS idx_profiles_current_persona_id ON public.profiles(current_persona_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_select_self'
  ) THEN
    CREATE POLICY profiles_select_self ON public.profiles
      FOR SELECT USING (id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_modify_self'
  ) THEN
    CREATE POLICY profiles_modify_self ON public.profiles
      FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- PART 3: DATABASE FUNCTIONS
-- ============================================================

-- Function: Get user's personas
CREATE OR REPLACE FUNCTION public.get_user_personas()
RETURNS SETOF public.user_personas
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY SELECT * FROM public.user_personas WHERE user_id = v_user_id ORDER BY created_at ASC;
END; $$;

-- Function: Get active persona
CREATE OR REPLACE FUNCTION public.get_active_persona()
RETURNS public.user_personas
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_persona_id uuid;
  v_persona public.user_personas;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get current persona ID from profile
  SELECT current_persona_id INTO v_persona_id
  FROM public.profiles
  WHERE id = v_user_id;
  
  SELECT * INTO v_persona
  FROM public.user_personas 
  WHERE id = v_persona_id;
  
  RETURN v_persona;
END; $$;

-- Function: Upsert persona
CREATE OR REPLACE FUNCTION public.upsert_persona(
  p_type public.persona_type,
  p_display_name text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS public.user_personas
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_persona public.user_personas;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Insert or update persona
  INSERT INTO public.user_personas (user_id, type, display_name, avatar_url, bio, metadata)
  VALUES (v_user_id, p_type, p_display_name, p_avatar_url, p_bio, p_metadata)
  ON CONFLICT (user_id, type) 
  DO UPDATE SET
    display_name = COALESCE(p_display_name, user_personas.display_name),
    avatar_url = COALESCE(p_avatar_url, user_personas.avatar_url),
    bio = COALESCE(p_bio, user_personas.bio),
    metadata = p_metadata,
    updated_at = now()
  RETURNING * INTO v_persona;
  
  RETURN v_persona;
END; $$;

-- Function: Set active persona
CREATE OR REPLACE FUNCTION public.set_active_persona(p_persona_id uuid)
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Verify persona belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM public.user_personas 
    WHERE id = p_persona_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Persona not found or does not belong to user';
  END IF;
  
  -- Update profile
  UPDATE public.profiles
  SET current_persona_id = p_persona_id, updated_at = now()
  WHERE id = v_user_id
  RETURNING * INTO v_profile;
  
  RETURN v_profile;
END; $$;

-- Function: Mark onboarding complete
CREATE OR REPLACE FUNCTION public.complete_onboarding()
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  UPDATE public.profiles
  SET onboarding_completed = true, updated_at = now()
  WHERE id = v_user_id
  RETURNING * INTO v_profile;
  
  RETURN v_profile;
END; $$;

-- Function: Update biometrics status
CREATE OR REPLACE FUNCTION public.update_biometrics_status(p_enabled boolean)
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  UPDATE public.profiles
  SET biometrics_enabled = p_enabled, updated_at = now()
  WHERE id = v_user_id
  RETURNING * INTO v_profile;
  
  RETURN v_profile;
END; $$;

-- Function: Update location status
CREATE OR REPLACE FUNCTION public.update_location_status(p_enabled boolean)
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  UPDATE public.profiles
  SET location_enabled = p_enabled, updated_at = now()
  WHERE id = v_user_id
  RETURNING * INTO v_profile;
  
  RETURN v_profile;
END; $$;

-- ============================================================
-- PART 4: AUTO-CREATE PROFILE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    phone_number,
    email_verified,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PART 5: UPDATE EXISTING PROFILES (Migration)
-- ============================================================

-- Add new columns if they don't exist (for existing databases)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'current_persona_id'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN current_persona_id uuid NULL REFERENCES public.user_personas(id) ON DELETE SET NULL;
      CREATE INDEX IF NOT EXISTS idx_profiles_current_persona_id ON public.profiles(current_persona_id);
    END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email_verified boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'biometrics_enabled'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN biometrics_enabled boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'location_enabled'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN location_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================