-- =========================================================================
-- CINEMATIC ENGLISH — CLASSROOM RELATIONSHIPS & ROW LEVEL SECURITY (RLS)
-- MIGRATION SCRIPT (PRODUCTION READY)
-- =========================================================================

-- ─── 1. ADD FOREIGN KEY RELATIONSHIPS ──────────────────────────────────────
-- Enables PostgREST automatic relationship resolver for joins (e.g. profiles table joins)

ALTER TABLE public.classrooms
  DROP CONSTRAINT IF EXISTS fk_classrooms_teacher,
  ADD CONSTRAINT fk_classrooms_teacher FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.classroom_members
  DROP CONSTRAINT IF EXISTS fk_classroom_members_student,
  ADD CONSTRAINT fk_classroom_members_student FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.assignment_submissions
  DROP CONSTRAINT IF EXISTS fk_assignment_submissions_student,
  ADD CONSTRAINT fk_assignment_submissions_student FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ─── 2. ENABLE ROW LEVEL SECURITY (RLS) ────────────────────────────────────

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- ─── 3. CLASSROOM POLICIES ──────────────────────────────────────────────────

-- Policy: Teachers have full control over classrooms they created
DROP POLICY IF EXISTS "Teachers manage own classrooms" ON public.classrooms;
CREATE POLICY "Teachers manage own classrooms"
  ON public.classrooms FOR ALL
  USING (auth.uid() = teacher_id);

-- Policy: Students can view classrooms they have successfully joined
DROP POLICY IF EXISTS "Members view classrooms" ON public.classrooms;
CREATE POLICY "Members view classrooms"
  ON public.classrooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members
      WHERE classroom_id = public.classrooms.id
      AND student_id = auth.uid()
    )
  );

-- ─── 4. CLASSROOM MEMBER POLICIES ───────────────────────────────────────────

-- Policy: Teachers can view and manage members in classrooms they own
DROP POLICY IF EXISTS "Teachers manage classroom members" ON public.classroom_members;
CREATE POLICY "Teachers manage classroom members"
  ON public.classroom_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms
      WHERE id = public.classroom_members.classroom_id
      AND teacher_id = auth.uid()
    )
  );

-- Policy: Students can view their own classroom memberships
DROP POLICY IF EXISTS "Students view own memberships" ON public.classroom_members;
CREATE POLICY "Students view own memberships"
  ON public.classroom_members FOR SELECT
  USING (auth.uid() = student_id);

-- Policy: Authenticated students can insert themselves into classroom (join by code)
DROP POLICY IF EXISTS "Students can join classrooms" ON public.classroom_members;
CREATE POLICY "Students can join classrooms"
  ON public.classroom_members FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ─── 5. ASSIGNMENTS POLICIES ────────────────────────────────────────────────

-- Policy: Teachers manage assignments for their own classrooms
DROP POLICY IF EXISTS "Teachers manage assignments" ON public.assignments;
CREATE POLICY "Teachers manage assignments"
  ON public.assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms
      WHERE id = public.assignments.classroom_id
      AND teacher_id = auth.uid()
    )
  );

-- Policy: Students can view assignments for classrooms they are a member of
DROP POLICY IF EXISTS "Students view assignments" ON public.assignments;
CREATE POLICY "Students view assignments"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members
      WHERE classroom_id = public.assignments.classroom_id
      AND student_id = auth.uid()
    )
  );

-- ─── 6. ASSIGNMENT SUBMISSIONS POLICIES ────────────────────────────────────

-- Policy: Students have full control to insert, read and update their own submissions
DROP POLICY IF EXISTS "Students manage own submissions" ON public.assignment_submissions;
CREATE POLICY "Students manage own submissions"
  ON public.assignment_submissions FOR ALL
  USING (auth.uid() = student_id);

-- Policy: Teachers can read submissions belonging to assignments in classrooms they own
DROP POLICY IF EXISTS "Teachers view submissions" ON public.assignment_submissions;
CREATE POLICY "Teachers view submissions"
  ON public.assignment_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classrooms c ON a.classroom_id = c.id
      WHERE a.id = public.assignment_submissions.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Policy: Teachers can grade (update) submissions in classrooms they own
DROP POLICY IF EXISTS "Teachers grade submissions" ON public.assignment_submissions;
CREATE POLICY "Teachers grade submissions"
  ON public.assignment_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classrooms c ON a.classroom_id = c.id
      WHERE a.id = public.assignment_submissions.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );
