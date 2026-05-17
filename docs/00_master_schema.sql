-- =========================================================================
-- CINEMATIC ENGLISH — SYSTEM DATABASE MASTER SCHEMA (PRODUCTION READY)
-- =========================================================================

-- ─── 1. CORE SYSTEM TABLES ────────────────────────────────────────────────

-- STORIES TABLE
CREATE TABLE IF NOT EXISTS stories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  synopsis text,
  transcript text,
  category text check (category in ('Psychology','Business','Philosophy','Cinema','Power & Influence','Creative')),
  difficulty text check (difficulty in ('Beginner','Intermediate','Advanced')),
  duration text, -- '12:45'
  thumbnail_url text,
  audio_url text,
  xp_value int default 250,
  is_premium boolean default false,
  is_featured boolean default false,
  status text check (status in ('Draft','Published','Archived')) default 'Draft',
  plays int default 0,
  tags text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- QUIZZES TABLE
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references stories(id) on delete cascade,
  questions jsonb not null default '[]',
  created_at timestamptz default now()
);

-- USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  story_id uuid references stories(id),
  completed boolean default false,
  quiz_score int,
  xp_earned int default 0,
  listened_at timestamptz default now()
);

-- USER PROFILES (EXTENDS AUTH.USERS)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text,
  avatar_url text,
  plan text check (plan in ('Free','Pro','Group')) default 'Free',
  total_xp int default 0,
  current_streak int default 0,
  role text check (role in ('user', 'teacher', 'admin')) default 'user',
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

-- ─── 2. AUTHENTICATION & SECURITY DEFINERS ────────────────────────────────

-- Security Definer function to check admin role safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function: Auto-create profile on signup with selected role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe Trigger Creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── 3. ROW LEVEL SECURITY (RLS) & POLICIES ────────────────────────────────

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Stories Policies
DROP POLICY IF EXISTS "Public can read published stories" ON stories;
CREATE POLICY "Public can read published stories"
  ON stories FOR SELECT
  USING (status = 'Published');

DROP POLICY IF EXISTS "Admin full access to stories" ON stories;
CREATE POLICY "Admin full access to stories"
  ON stories FOR ALL
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can do anything" ON stories;
CREATE POLICY "Admins can do anything" 
  ON stories FOR ALL 
  USING (is_admin());

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- User Progress Policies
DROP POLICY IF EXISTS "Users manage own progress" ON user_progress;
CREATE POLICY "Users manage own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin read all progress" ON user_progress;
CREATE POLICY "Admin read all progress"
  ON user_progress FOR SELECT
  USING (is_admin());

-- ─── 4. CLASSROOM SYSTEM SCHEMAS ───────────────────────────────────────────

-- Classrooms Table
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classroom Members
CREATE TABLE IF NOT EXISTS classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(classroom_id, student_id)
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL, -- 'lesson' or 'exam'
    activity_id UUID NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    score INT DEFAULT 0,
    accuracy_speaking INT DEFAULT 0,
    accuracy_listening INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'graded'
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classroom Streaks & Momentum
CREATE TABLE IF NOT EXISTS classroom_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID UNIQUE REFERENCES classrooms(id) ON DELETE CASCADE,
    streak_days INT DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    aura_xp INT DEFAULT 0
);

-- ─── 5. PREMIUM EXAM SYSTEM SCHEMAS ────────────────────────────────────────

-- Exams Configuration Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    exam_type VARCHAR(50) NOT NULL, -- 'quick', 'sprint', 'midterm', 'final', 'ielts'
    time_limit_minutes INT DEFAULT 45,
    max_score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exam Sections Table (Modular sections)
CREATE TABLE IF NOT EXISTS exam_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    skill_type VARCHAR(50) NOT NULL, -- 'listening', 'speaking', 'reading', 'vocabulary', 'dictation'
    order_index INT DEFAULT 0
);

-- Exam Questions Table
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES exam_sections(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    audio_url VARCHAR(512), -- for listening section
    max_replays INT DEFAULT 2, -- listening play limit
    options JSONB, -- multiple choice choices e.g. ["A", "B", "C"]
    correct_answer TEXT,
    speaking_prompt TEXT, -- prompt for AI speaking engine
    order_index INT DEFAULT 0
);

-- Exam Attempts Table
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'paused'
    score INT DEFAULT 0
);

-- Exam Answers Table
CREATE TABLE IF NOT EXISTS exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES exam_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN,
    speaking_audio_url VARCHAR(512), -- speech submission link
    speaking_accuracy INT DEFAULT 0,
    speaking_rhythm INT DEFAULT 0,
    speaking_confidence INT DEFAULT 0
);

-- Exam Results & Analytics Table
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID UNIQUE REFERENCES exam_attempts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    final_score INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    accuracy_percentage INT DEFAULT 0
);

-- Skill Breakdowns
CREATE TABLE IF NOT EXISTS skill_breakdowns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    listening_mastery INT DEFAULT 50, -- 0-100 scale
    speaking_mastery INT DEFAULT 50,
    reading_mastery INT DEFAULT 50,
    vocabulary_mastery INT DEFAULT 50,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
