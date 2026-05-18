-- =========================================================================
-- CINEMATIC ENGLISH — RLS REPAIR, TRIGGER RESILIENCY & 5 ICONIC LESSONS SEED
-- Target Database: Supabase (PostgreSQL 15+)
-- Movies: The Godfather, The Dark Knight, Forrest Gump, Titanic, The Lion King
-- =========================================================================

-- ─── 0. RESILIENT TRIGGER FUNCTION (IMMUNE TO MISSING updated_at COLUMN) ───
-- Rewritten with PL/pgSQL exception block to ignore error if table lacks updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN
        NEW.updated_at = NOW();
    EXCEPTION WHEN OTHERS THEN
        -- Gracefully catch and ignore the exception if the column does not exist
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 1. GUARANTEE updated_at COLUMNS EXIST ON CORE TABLES ─────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.story_scenes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.lesson_sentences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.daily_streaks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.quota_usage ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();


-- ─── 2. RLS INFINITE RECURSION REPAIR ───────────────────────────────────────
-- Dynamically find and drop EVERY single policy on profiles and stories to ensure zero leftovers
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
    END LOOP;

    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'stories' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.stories';
    END LOOP;
END $$;

-- Re-create clean, non-recursive policies on profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (TRUE); -- Allows reading all profiles without infinite recursion loops

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Re-create stories policies without recursion
CREATE POLICY "stories_read_published" ON public.stories
    FOR SELECT USING (is_published = TRUE); -- Simple, zero-join policy (100% recursion-proof!)

CREATE POLICY "stories_admin_all" ON public.stories
    FOR ALL USING (
      COALESCE((auth.jwt() ->> 'role'), '') = 'service_role' OR 
      EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      )
    );



-- ─── 3. SEED 5 ICONIC MOVIE STORIES ─────────────────────────────────────────
-- Insert Stories
INSERT INTO public.stories (id, title, description, thumbnail_url, difficulty, is_published)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'The Godfather',
    'Năm phát hành: 1972 | Thể loại: Tâm lý / Tội phạm. Luyện nói qua bộ phim tội phạm kinh điển kể về đế chế mafia gia tộc Corleone.',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    'medium',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'The Dark Knight',
    'Năm phát hành: 2008 | Thể loại: Hành động / Kịch tính. Luyện phát âm cùng những triết lý hỗn loạn sâu sắc của Joker và Batman.',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800',
    'easy',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Forrest Gump',
    'Năm phát hành: 1994 | Thể loại: Hài hước / Tâm lý. Chiêm nghiệm những triết lý giản dị mà sâu sắc về cuộc sống và tình yêu.',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    'easy',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Titanic',
    'Năm phát hành: 1997 | Thể loại: Lãng mạn / Tâm lý. Luyện phát âm tiếng Anh qua chuyện tình vĩnh cửu trên chuyến tàu huyền thoại.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    'medium',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'The Lion King',
    'Năm phát hành: 1994 | Thể loại: Hoạt hình / Phiêu lưu. Luyện nói qua hành trình tìm lại bản ngã và vương quyền đầy kiêu hãnh của Simba.',
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800',
    'hard',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  difficulty = EXCLUDED.difficulty,
  is_published = EXCLUDED.is_published;

-- ─── 4. SEED LESSONS ────────────────────────────────────────────────────────
-- Insert Lessons
INSERT INTO public.lessons (id, title, description, type, is_published)
VALUES
  (
    '00000000-0000-0000-0000-000000000011',
    'The Godfather: Lời đề nghị kinh điển',
    'Luyện nói câu thoại bất hủ thể hiện quyền lực tuyệt đối của Vito Corleone.',
    'Speaking',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000022',
    'The Dark Knight: Sao phải nghiêm trọng',
    'Luyện nói câu nói trứ danh định hình nên tính cách điên loạn của Joker.',
    'Speaking',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000033',
    'Forrest Gump: Hộp sô-cô-la cuộc đời',
    'Học cách so sánh ví von cuộc đời đầy thi vị của bà Gump.',
    'Speaking',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000044',
    'Titanic: Vua của thế giới',
    'Thể hiện cảm xúc hân hoan tột cùng của Jack trên mũi tàu Titanic.',
    'Speaking',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000055',
    'The Lion King: Hãy nhớ lại con là ai',
    'Luyện câu nói thức tỉnh bản lĩnh quân vương từ linh hồn vua cha Mufasa.',
    'Speaking',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  type = EXCLUDED.type,
  is_published = EXCLUDED.is_published;

-- ─── 5. SEED LESSON SENTENCES (WITH IPA PHONETIC & THRESHOLD METADATA) ──────
-- Insert Lesson Sentences
INSERT INTO public.lesson_sentences (
  id,
  lesson_id,
  order_index,
  transcript,
  translation,
  audio_url,
  thumbnail_url,
  start_time,
  end_time
)
VALUES
  -- 1. The Godfather
  (
    '00000000-0000-0000-0000-000000000111',
    '00000000-0000-0000-0000-000000000011',
    1,
    'I''m going to make him an offer he can''t refuse.',
    'Tôi sẽ đưa ra một lời đề nghị mà hắn ta không thể từ chối. [Phiên âm: /aɪm ˈɡoʊɪŋ tu meɪk hɪm ən ˈɒfə hiː kɑːnt rɪˈfjuːz/ | Phổ điểm đạt: 80]',
    '',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    0.0,
    10.0
  ),
  -- 2. The Dark Knight
  (
    '00000000-0000-0000-0000-000000000222',
    '00000000-0000-0000-0000-000000000022',
    1,
    'Why so serious?',
    'Sao phải nghiêm trọng thế? [Phiên âm: /waɪ soʊ ˈsɪəriəs/ | Phổ điểm đạt: 75]',
    '',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800',
    0.0,
    10.0
  ),
  -- 3. Forrest Gump
  (
    '00000000-0000-0000-0000-000000000333',
    '00000000-0000-0000-0000-000000000033',
    1,
    'Life is like a box of chocolates.',
    'Cuộc đời giống như một hộp sô-cô-la. [Phiên âm: /laɪf ɪz laɪk ə bɒks ɒv ˈtʃɒkləts/ | Phổ điểm đạt: 75]',
    '',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    0.0,
    10.0
  ),
  -- 4. Titanic
  (
    '00000000-0000-0000-0000-000000000444',
    '00000000-0000-0000-0000-000000000044',
    1,
    'I''m the king of the world!',
    'Tôi là vua của thế giới! [Phiên âm: /aɪm ðə kɪŋ ɒv ðə wɜːld/ | Phổ điểm đạt: 80]',
    '',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    0.0,
    10.0
  ),
  -- 5. The Lion King
  (
    '00000000-0000-0000-0000-000000000555',
    '00000000-0000-0000-0000-000000000055',
    1,
    'Remember who you are.',
    'Hãy nhớ lại con là ai. [Phiên âm: /rɪˈmembə huː juː ɑː/ | Phổ điểm đạt: 85]',
    '',
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800',
    0.0,
    10.0
  )
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  order_index = EXCLUDED.order_index,
  transcript = EXCLUDED.transcript,
  translation = EXCLUDED.translation,
  audio_url = EXCLUDED.audio_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time;
