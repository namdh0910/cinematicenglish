-- Cinematic English Phase 2.2: Premium Exam Ecosystem Database Schema

-- 1. Exams Configuration Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    exam_type VARCHAR(50) NOT NULL, -- 'quick', 'sprint', 'midterm', 'final', 'ielts'
    time_limit_minutes INT DEFAULT 45,
    max_score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Exam Sections Table (Modular sections: listening, speaking, reading)
CREATE TABLE IF NOT EXISTS exam_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    skill_type VARCHAR(50) NOT NULL, -- 'listening', 'speaking', 'reading', 'vocabulary', 'dictation'
    order_index INT DEFAULT 0
);

-- 3. Exam Questions Table
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

-- 4. Exam Attempts Table (Tracks student status and progress)
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

-- 5. Exam Answers Table
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

-- 6. Exam Results & Analytics Table
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID UNIQUE REFERENCES exam_attempts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    final_score INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    accuracy_percentage INT DEFAULT 0
);

-- 7. Skill Breakdowns (For longitudinal adaptive engine profiling)
CREATE TABLE IF NOT EXISTS skill_breakdowns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    listening_mastery INT DEFAULT 50, -- 0-100 scale
    speaking_mastery INT DEFAULT 50,
    reading_mastery INT DEFAULT 50,
    vocabulary_mastery INT DEFAULT 50,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
