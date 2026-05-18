-- =========================================================================
-- CINEMATIC ENGLISH — CONTENT INTELLIGENCE DATABASE MIGRATION
-- Features: Sentence Intelligence Metadata (JSONB), Lesson Pacing & Workflow (Draft, Review, Published, Archived)
-- =========================================================================

-- 1. Thêm cột metadata kiểu JSONB cho bảng lesson_sentences để lưu trữ Content Intelligence
ALTER TABLE public.lesson_sentences 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Thêm cột status kiểu TEXT cho bảng lessons để hỗ trợ Content Workflow quản lý trạng thái
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' 
CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- 3. Tạo chỉ mục tìm kiếm GIN trên cột metadata để tối ưu hiệu suất gợi ý thuật toán (Recommendation Engine) sau này
CREATE INDEX IF NOT EXISTS lesson_sentences_metadata_gin_idx ON public.lesson_sentences USING gin (metadata);
