-- =========================================================================
-- CINEMATIC ENGLISH — MIGRATION: EDTECH SGK GLOBAL SUCCESS SCHEMA PIVOT
-- Features: Row-Level Security (RLS), CASCADE deletes, indexes, triggers
-- =========================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. GRADES TABLE ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g. "Lớp 3", "Lớp 6", "Lớp 10"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on grade name
CREATE INDEX IF NOT EXISTS grades_name_idx ON public.grades (name);

-- RLS policies for grades
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "grades_select_policy" ON public.grades;
CREATE POLICY "grades_select_policy" ON public.grades
    FOR SELECT USING (TRUE);

DROP TRIGGER IF EXISTS update_grades_updated_at ON public.grades;
CREATE TRIGGER update_grades_updated_at
    BEFORE UPDATE ON public.grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 2. UNITS TABLE ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- e.g. "My New School"
    unit_no TEXT NOT NULL, -- e.g. "Unit 1"
    description TEXT DEFAULT '',
    cover_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for optimized querying
CREATE INDEX IF NOT EXISTS units_grade_id_idx ON public.units (grade_id);
CREATE INDEX IF NOT EXISTS units_unit_no_idx ON public.units (unit_no);

-- RLS policies for units
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "units_select_policy" ON public.units;
CREATE POLICY "units_select_policy" ON public.units
    FOR SELECT USING (TRUE);

DROP TRIGGER IF EXISTS update_units_updated_at ON public.units;
CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON public.units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 3. LESSONS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('speaking', 'dictation', 'quiz')),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    content JSONB NOT NULL, -- Flexible payload depending on lesson type
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying lessons by unit and type
CREATE INDEX IF NOT EXISTS lessons_unit_id_idx ON public.lessons (unit_id);
CREATE INDEX IF NOT EXISTS lessons_type_idx ON public.lessons (type);

-- RLS policies for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lessons_select_policy" ON public.lessons;
CREATE POLICY "lessons_select_policy" ON public.lessons
    FOR SELECT USING (TRUE);

DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 4. ALTERING EXISTING SPEAKING ATTEMPTS TO SUPPORT NEW LESSON PIVOT ───
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE;
ALTER TABLE public.speaking_attempts ALTER COLUMN sentence_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS speaking_attempts_lesson_idx ON public.speaking_attempts (lesson_id);

