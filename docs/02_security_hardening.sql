-- =========================================================================
-- CINEMATIC ENGLISH — PRODUCTION HARDENING & EXPLOIT PREVENTION
-- MIGRATION SCRIPT (PHASE 4 / CLOSED BETA READY)
-- =========================================================================

-- ─── 1. UNIQUE SUBMISSION CONSTRAINT ──────────────────────────────────────
-- Prevents multiple duplicate submissions from the same student for the same assignment
ALTER TABLE public.assignment_submissions
  DROP CONSTRAINT IF EXISTS unique_assignment_student_submission,
  ADD CONSTRAINT unique_assignment_student_submission UNIQUE (assignment_id, student_id);

-- ─── 2. TELEMETRY EVENTS TABLE FOR REAL OBSERVABILITY ─────────────────────
CREATE TABLE IF NOT EXISTS public.telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL, -- 'crash', 'rage_click', 'hydration_error', 'latency', 'slow_interaction', 'abandonment'
  page_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on Telemetry
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own logs
DROP POLICY IF EXISTS "Authenticated users insert telemetry" ON public.telemetry_events;
CREATE POLICY "Authenticated users insert telemetry"
  ON public.telemetry_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow admins to read telemetry
DROP POLICY IF EXISTS "Admins read telemetry" ON public.telemetry_events;
CREATE POLICY "Admins read telemetry"
  ON public.telemetry_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ─── 3. SECURE PROFILES UPDATE RLS POLICY ────────────────────────────────
-- Allows users to update their own avatar and full_name, but we block exploit updates via a trigger!
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── 4. PROFILE FIELD IMMUTABILITY TRIGGER (XP & ROLE EXPLOIT PREVENTION) ───
-- Restricts role changing, arbitrary XP gains, or streak manipulation via client-side updates
CREATE OR REPLACE FUNCTION public.prevent_profile_exploits()
RETURNS trigger AS $$
BEGIN
  -- If user is trying to change role, plan, total_xp, or current_streak, and they are not admin
  IF (OLD.role IS DISTINCT FROM NEW.role OR
      OLD.plan IS DISTINCT FROM NEW.plan OR
      OLD.total_xp IS DISTINCT FROM NEW.total_xp OR
      OLD.current_streak IS DISTINCT FROM NEW.current_streak)
      AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IS DISTINCT FROM 'admin' THEN
    
    -- Override changes with old secure values
    NEW.role := OLD.role;
    NEW.plan := OLD.plan;
    NEW.total_xp := OLD.total_xp;
    NEW.current_streak := OLD.current_streak;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_prevent_profile_exploits ON public.profiles;
CREATE TRIGGER trigger_prevent_profile_exploits
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.prevent_profile_exploits();

-- ─── 5. AUTOMATIC XP INCREMENT TRIGGER ON ASSIGNMENT COMPLETION ───────────
-- Automatically increments student total_xp on successful submission, safe from client tampering
CREATE OR REPLACE FUNCTION public.process_xp_on_submission()
RETURNS trigger AS $$
DECLARE
  xp_bonus INT;
BEGIN
  -- Base XP bonus = score * 2.5 (e.g. 100% score = 250 XP, 80% = 200 XP)
  xp_bonus := COALESCE(NEW.score, 0) * 2.5;
  
  -- Update student profile safely
  UPDATE public.profiles
  SET total_xp = total_xp + xp_bonus,
      last_active = now()
  WHERE id = NEW.student_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_process_xp_on_submission ON public.assignment_submissions;
CREATE TRIGGER trigger_process_xp_on_submission
  AFTER INSERT ON public.assignment_submissions
  FOR EACH ROW
  EXECUTE PROCEDURE public.process_xp_on_submission();
