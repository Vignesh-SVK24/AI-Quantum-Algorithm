-- =========================================================================
-- Migration: 006_create_profiles_and_rls.sql
-- Table: public.profiles, RLS Policies, and Automatic Profile Trigger
-- Smart India Hackathon - Interactive Quantum Algorithm Learning Platform
-- =========================================================================

-- 1. Create public.profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    auth_provider TEXT DEFAULT 'email',
    is_guest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email and auth_provider for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_provider ON public.profiles(auth_provider);

-- 2. Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access on profiles" ON public.profiles;

-- RLS Policy: Users can view only their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated, anon
WITH CHECK (auth.uid() = id);

-- RLS Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- RLS Policy: Service role has full administrative access
CREATE POLICY "Service role full access on profiles"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Automatic Trigger to create profile when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, auth_provider, is_guest)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
        COALESCE((NEW.raw_user_meta_data->>'is_anonymous')::boolean, (NEW.is_anonymous)::boolean, FALSE)
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        auth_provider = COALESCE(EXCLUDED.auth_provider, public.profiles.auth_provider),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Tighten Row Level Security on practice_progress and practice_attempts if existing in Postgres
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'practice_progress') THEN
        ALTER TABLE public.practice_progress ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users manage own practice progress" ON public.practice_progress;
        CREATE POLICY "Users manage own practice progress"
        ON public.practice_progress
        FOR ALL
        TO authenticated, anon
        USING (auth.uid()::text = user_id)
        WITH CHECK (auth.uid()::text = user_id);
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'practice_attempts') THEN
        ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users manage own practice attempts" ON public.practice_attempts;
        CREATE POLICY "Users manage own practice attempts"
        ON public.practice_attempts
        FOR ALL
        TO authenticated, anon
        USING (auth.uid()::text = user_id)
        WITH CHECK (auth.uid()::text = user_id);
    END IF;
END $$;
