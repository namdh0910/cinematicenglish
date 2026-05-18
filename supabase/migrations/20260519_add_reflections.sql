-- =========================================================================
-- CINEMATIC ENGLISH — MIGRATION: ADD LEARNING REFLECTIONS TABLE
-- Features: Row-Level Security (RLS), Cascade Deletion, Indexes
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.learning_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL, -- Supports both database UUIDs and static/mock lesson keys
    emotion_tag TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for optimized queries per student and lesson context
CREATE INDEX IF NOT EXISTS learning_reflections_user_lesson_idx ON public.learning_reflections (user_id, lesson_id);

-- Enable Row-Level Security
ALTER TABLE public.learning_reflections ENABLE ROW LEVEL SECURITY;

-- RLS Select Policy: Authenticated users can view their own reflections
DROP POLICY IF EXISTS "learning_reflections_select_own" ON public.learning_reflections;
CREATE POLICY "learning_reflections_select_own" ON public.learning_reflections
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Insert Policy: Authenticated users can write reflections for themselves
DROP POLICY IF EXISTS "learning_reflections_insert_own" ON public.learning_reflections;
CREATE POLICY "learning_reflections_insert_own" ON public.learning_reflections
    FOR INSERT WITH CHECK (auth.uid() = user_id);
