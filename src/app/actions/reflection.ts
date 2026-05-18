'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

interface SaveReflectionParams {
  lessonId: string;
  emotionTag: string;
  note: string;
}

interface SaveReflectionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Saves a student's learning reflection (emotional tag & qualitative notes) to the database.
 * This Server Action validates authentication server-side before executing the database statement.
 */
export async function saveReflection({
  lessonId,
  emotionTag,
  note,
}: SaveReflectionParams): Promise<SaveReflectionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Retrieve the active authenticated user's session safely on the server side
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Bạn cần đăng nhập để lưu nhật ký cảm xúc học tập.',
      };
    }

    // Insert reflection record
    const { data, error } = await supabase
      .from('learning_reflections')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        emotion_tag: emotionTag,
        note: note,
      })
      .select()
      .single();

    if (error) {
      console.error('Database insertion failed for learning reflections:', error);
      return {
        success: false,
        error: `Không thể lưu nhật ký vào cơ sở dữ liệu: ${error.message}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error('Unexpected exception inside saveReflection Server Action:', err);
    return {
      success: false,
      error: err?.message || 'Đã xảy ra lỗi hệ thống không xác định.',
    };
  }
}
