-- =========================================================================
-- CINEMATIC ENGLISH — COMPLETE PRODUCTION SCHEMA MIGRATION (MASTER RESILIENT)
-- Target Database: Supabase (PostgreSQL 15+)
-- Features: snake_case, UUIDs, RLS, Indexes, Triggers, Resilient ALTERs
-- =========================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 0. TRIGGER FUNCTION FOR UPDATED_AT ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 1. PROFILES TABLE ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Maps to auth.users.id
    email TEXT UNIQUE NOT NULL,
    full_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'student',
    subscription_plan TEXT NOT NULL DEFAULT 'free',
    subscription_status TEXT NOT NULL DEFAULT 'active',
    xp_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'team', 'school'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp_score INTEGER NOT NULL DEFAULT 0;

-- Profiles Indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
CREATE INDEX IF NOT EXISTS profiles_xp_idx ON public.profiles (xp_score DESC);

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Profiles Trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auth handler to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role, subscription_plan, subscription_status, xp_score)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'student',
        'free',
        'active',
        0
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 2. STORIES TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    thumbnail_url TEXT,
    difficulty TEXT NOT NULL DEFAULT 'easy',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on stories table
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard'));
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;

-- Stories RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stories_read_published" ON public.stories;
CREATE POLICY "stories_read_published" ON public.stories
    FOR SELECT USING (is_published = TRUE OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

DROP POLICY IF EXISTS "stories_admin_all" ON public.stories;
CREATE POLICY "stories_admin_all" ON public.stories
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Stories Trigger
DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 3. STORY_SCENES TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.story_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on story_scenes table
ALTER TABLE public.story_scenes ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Story Scenes Index
CREATE INDEX IF NOT EXISTS story_scenes_story_id_idx ON public.story_scenes (story_id, order_index ASC);

-- Story Scenes RLS
ALTER TABLE public.story_scenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scenes_read_policy" ON public.story_scenes;
CREATE POLICY "scenes_read_policy" ON public.story_scenes
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "scenes_admin_policy" ON public.story_scenes;
CREATE POLICY "scenes_admin_policy" ON public.story_scenes
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Story Scenes Trigger
DROP TRIGGER IF EXISTS update_story_scenes_updated_at ON public.story_scenes;
CREATE TRIGGER update_story_scenes_updated_at
    BEFORE UPDATE ON public.story_scenes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 4. LESSONS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    type TEXT NOT NULL DEFAULT 'Speaking',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Speaking' CHECK (type IN ('Listening', 'Speaking', 'Reading', 'Writing', 'Language', 'Getting Started', 'Exam'));
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;

-- Lessons RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lessons_read_published" ON public.lessons;
CREATE POLICY "lessons_read_published" ON public.lessons
    FOR SELECT USING (is_published = TRUE OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

DROP POLICY IF EXISTS "lessons_admin_all" ON public.lessons;
CREATE POLICY "lessons_admin_all" ON public.lessons
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Lessons Trigger
DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 5. LESSON_SENTENCES TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_sentences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    transcript TEXT NOT NULL,
    translation TEXT NOT NULL,
    audio_url TEXT,
    thumbnail_url TEXT,
    start_time NUMERIC,
    end_time NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on lesson_sentences table
ALTER TABLE public.lesson_sentences ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.lesson_sentences ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.lesson_sentences ADD COLUMN IF NOT EXISTS start_time NUMERIC;
ALTER TABLE public.lesson_sentences ADD COLUMN IF NOT EXISTS end_time NUMERIC;

-- Lesson Sentences Index
CREATE INDEX IF NOT EXISTS lesson_sentences_lesson_id_idx ON public.lesson_sentences (lesson_id, order_index ASC);

-- Lesson Sentences RLS
ALTER TABLE public.lesson_sentences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sentences_read_policy" ON public.lesson_sentences;
CREATE POLICY "sentences_read_policy" ON public.lesson_sentences
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "sentences_admin_policy" ON public.lesson_sentences;
CREATE POLICY "sentences_admin_policy" ON public.lesson_sentences
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Lesson Sentences Trigger
DROP TRIGGER IF EXISTS update_lesson_sentences_updated_at ON public.lesson_sentences;
CREATE TRIGGER update_lesson_sentences_updated_at
    BEFORE UPDATE ON public.lesson_sentences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 6. LESSON_PROGRESS TABLE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_activity_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id)
);

-- Ensure all customized production columns exist on lesson_progress table
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS last_activity_index INTEGER NOT NULL DEFAULT 0;

-- Lesson Progress Indexes
CREATE INDEX IF NOT EXISTS lesson_progress_user_idx ON public.lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS lesson_progress_lesson_idx ON public.lesson_progress (lesson_id);

-- Lesson Progress RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "progress_select_own" ON public.lesson_progress;
CREATE POLICY "progress_select_own" ON public.lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_insert_own" ON public.lesson_progress;
CREATE POLICY "progress_insert_own" ON public.lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_update_own" ON public.lesson_progress;
CREATE POLICY "progress_update_own" ON public.lesson_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Lesson Progress Trigger
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON public.lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 7. SPEAKING_ATTEMPTS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.speaking_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sentence_id UUID NOT NULL REFERENCES public.lesson_sentences(id) ON DELETE CASCADE,
    accuracy_score INTEGER NOT NULL,
    word_evaluations JSONB DEFAULT '[]'::jsonb,
    audio_url TEXT,
    coach_feedback TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on speaking_attempts table
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS accuracy_score INTEGER NOT NULL DEFAULT 0 CHECK (accuracy_score >= 0 AND accuracy_score <= 100);
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS word_evaluations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS coach_feedback TEXT DEFAULT '';

-- Speaking Attempts Indexes
CREATE INDEX IF NOT EXISTS speaking_attempts_user_idx ON public.speaking_attempts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS speaking_attempts_sentence_idx ON public.speaking_attempts (sentence_id);

-- Speaking Attempts RLS
ALTER TABLE public.speaking_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attempts_select_own" ON public.speaking_attempts;
CREATE POLICY "attempts_select_own" ON public.speaking_attempts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempts_insert_own" ON public.speaking_attempts;
CREATE POLICY "attempts_insert_own" ON public.speaking_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Speaking Attempts Trigger
DROP TRIGGER IF EXISTS update_speaking_attempts_updated_at ON public.speaking_attempts;
CREATE TRIGGER update_speaking_attempts_updated_at
    BEFORE UPDATE ON public.speaking_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 8. DAILY_STREAKS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    max_streak INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on daily_streaks table
ALTER TABLE public.daily_streaks ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.daily_streaks ADD COLUMN IF NOT EXISTS max_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.daily_streaks ADD COLUMN IF NOT EXISTS last_active_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Daily Streaks RLS
ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "streaks_select_own" ON public.daily_streaks;
CREATE POLICY "streaks_select_own" ON public.daily_streaks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "streaks_insert_own" ON public.daily_streaks;
CREATE POLICY "streaks_insert_own" ON public.daily_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "streaks_update_own" ON public.daily_streaks;
CREATE POLICY "streaks_update_own" ON public.daily_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Daily Streaks Trigger
DROP TRIGGER IF EXISTS update_daily_streaks_updated_at ON public.daily_streaks;
CREATE TRIGGER update_daily_streaks_updated_at
    BEFORE UPDATE ON public.daily_streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 9. SUBSCRIPTIONS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'momo', 'zalopay', 'qr_banking', 'manual')),
    provider_subscription_id TEXT,
    provider_customer_id TEXT,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'team', 'school')),
    status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Subscriptions RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions Trigger
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 10. ANALYTICS_EVENTS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    page_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all customized production columns exist on analytics_events table
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS page_url TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Analytics Events Index
CREATE INDEX IF NOT EXISTS analytics_events_user_idx ON public.analytics_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON public.analytics_events (event_type, created_at DESC);

-- Analytics Events RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_insert_policy" ON public.analytics_events;
CREATE POLICY "analytics_insert_policy" ON public.analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "analytics_select_admin" ON public.analytics_events;
CREATE POLICY "analytics_select_admin" ON public.analytics_events
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));


-- ─── 11. QUOTA_USAGE TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quota_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quota_date DATE NOT NULL DEFAULT CURRENT_DATE,
    speaking_count INTEGER NOT NULL DEFAULT 0,
    max_limit INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, quota_date)
);

-- Ensure all customized production columns exist on quota_usage table
ALTER TABLE public.quota_usage ADD COLUMN IF NOT EXISTS max_limit INTEGER NOT NULL DEFAULT 15;

-- Quota Usage Index
CREATE INDEX IF NOT EXISTS quota_usage_user_date_idx ON public.quota_usage (user_id, quota_date);

-- Quota Usage RLS
ALTER TABLE public.quota_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quota_select_own" ON public.quota_usage;
CREATE POLICY "quota_select_own" ON public.quota_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Quota Usage Trigger
DROP TRIGGER IF EXISTS update_quota_usage_updated_at ON public.quota_usage;
CREATE TRIGGER update_quota_usage_updated_at
    BEFORE UPDATE ON public.quota_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 12. RATE_LIMITS TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    reset_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (ip_address, endpoint, reset_at)
);

-- Ensure all customized production columns exist on rate_limits table
ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS request_count INTEGER NOT NULL DEFAULT 1;

-- Rate Limits Index
CREATE INDEX IF NOT EXISTS rate_limits_ip_endpoint_idx ON public.rate_limits (ip_address, endpoint);

-- Rate Limits RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate Limits Trigger
DROP TRIGGER IF EXISTS update_rate_limits_updated_at ON public.rate_limits;
CREATE TRIGGER update_rate_limits_updated_at
    BEFORE UPDATE ON public.rate_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
