"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

interface MigrationResult {
  success: boolean;
  message: string;
  details?: {
    storiesFound: number;
    unitsCreated: number;
    scenesMigrated: number;
  };
  error?: string;
}

/**
 * Server Action to automatically migrate legacy movie stories & scenes
 * into the new Grade -> Unit -> Lesson schema.
 */
export async function migrateLegacyMovies(): Promise<MigrationResult> {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Create or fetch Grade "Cinematic Learning"
    let gradeId: string;
    const { data: existingGrade, error: gradeFetchError } = await supabase
      .from("grades")
      .select("id")
      .eq("title", "Cinematic Learning")
      .maybeSingle();

    if (gradeFetchError) {
      console.error("Fetch grade error:", gradeFetchError);
      return { success: false, error: `Lỗi truy vấn khối lớp: ${gradeFetchError.message}`, message: "Thất bại" };
    }

    if (existingGrade) {
      gradeId = existingGrade.id;
    } else {
      const { data: newGrade, error: gradeInsertError } = await supabase
        .from("grades")
        .insert([
          {
            title: "Cinematic Learning",
            name: "Cinematic Learning",
            description: "Luyện phát âm Tiếng Anh qua các phân cảnh phim điện ảnh kinh điển.",
            order_index: 99,
          },
        ])
        .select("id")
        .single();

      if (gradeInsertError) {
        console.error("Insert grade error:", gradeInsertError);
        return { success: false, error: `Lỗi tạo khối lớp Cinematic Learning: ${gradeInsertError.message}`, message: "Thất bại" };
      }
      gradeId = newGrade.id;
    }

    // 2. Fetch all legacy stories
    const { data: legacyStories, error: storiesError } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: true });

    if (storiesError) {
      console.error("Fetch legacy stories error:", storiesError);
      return { success: false, error: `Lỗi lấy danh sách phim cũ: ${storiesError.message}`, message: "Thất bại" };
    }

    if (!legacyStories || legacyStories.length === 0) {
      return {
        success: true,
        message: "Không tìm thấy bộ phim (stories) cũ nào trong hệ thống để thực hiện di trú.",
        details: { storiesFound: 0, unitsCreated: 0, scenesMigrated: 0 }
      };
    }

    let unitsCreated = 0;
    let scenesMigrated = 0;

    // 3. Process each story
    for (const story of legacyStories) {
      // Find or create a corresponding Unit under the Cinematic Learning grade
      let unitId: string;
      const { data: existingUnit, error: unitFetchError } = await supabase
        .from("units")
        .select("id")
        .eq("grade_id", gradeId)
        .eq("title", story.title)
        .maybeSingle();

      if (unitFetchError) {
        console.error(`Fetch unit error for ${story.title}:`, unitFetchError);
        continue;
      }

      if (existingUnit) {
        unitId = existingUnit.id;
      } else {
        const { data: newUnit, error: unitInsertError } = await supabase
          .from("units")
          .insert([
            {
              grade_id: gradeId,
              title: story.title,
              unit_no: story.difficulty ? `Level: ${story.difficulty}` : "Movie",
              description: story.description || `Khóa học luyện phát âm qua phân cảnh phim ${story.title}.`,
              cover_image: story.thumbnail_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"
            },
          ])
          .select("id")
          .single();

        if (unitInsertError) {
          console.error(`Insert unit error for ${story.title}:`, unitInsertError);
          continue;
        }
        unitId = newUnit.id;
        unitsCreated++;
      }

      // Fetch implicit legacy lesson to get dialogue sentences
      const { data: legacyLesson } = await supabase
        .from("lessons")
        .select("id")
        .ilike("title", `%${story.title}%`)
        .limit(1)
        .maybeSingle();

      let legacySentences: Array<{
        id: string;
        order_index: number;
        transcript: string;
        translation: string;
        audio_url?: string;
        thumbnail_url?: string;
        start_time?: number;
        end_time?: number;
      }> = [];
      if (legacyLesson) {
        const { data: sentences } = await supabase
          .from("lesson_sentences")
          .select("*")
          .eq("lesson_id", legacyLesson.id)
          .order("order_index", { ascending: true });
        if (sentences) {
          legacySentences = sentences;
        }
      }

      // Fetch scenes for this legacy story
      const { data: legacyScenes, error: scenesError } = await supabase
        .from("story_scenes")
        .select("*")
        .eq("story_id", story.id)
        .order("order_index", { ascending: true });

      if (scenesError) {
        console.error(`Fetch scenes error for story ${story.title}:`, scenesError);
        continue;
      }

      if (legacyScenes && legacyScenes.length > 0) {
        for (let idx = 0; idx < legacyScenes.length; idx++) {
          const scene = legacyScenes[idx];
          
          // Match corresponding dialogue from the legacy sentences array by order_index
          const sentence = legacySentences.find(s => s.order_index === scene.order_index) || legacySentences[idx];

          // Construct the new Unified JSON content
          const sentencesList = sentence ? [
            {
              id: sentence.id,
              order_index: 1,
              transcript: sentence.transcript,
              translation: sentence.translation,
              audio_url: sentence.audio_url || "",
              thumbnail_url: sentence.thumbnail_url || scene.thumbnail_url || story.thumbnail_url || "",
              start_time: sentence.start_time || 0,
              end_time: sentence.end_time || 10
            }
          ] : [
            {
              order_index: 1,
              transcript: "Here is the first striking moment of the story.",
              translation: "Đây là khoảnh khắc ấn tượng đầu tiên của bộ phim.",
              audio_url: "",
              thumbnail_url: scene.thumbnail_url || story.thumbnail_url || "",
              start_time: idx * 8,
              end_time: (idx + 1) * 8
            }
          ];

          const newContent = {
            video_url: scene.video_url,
            thumbnail_url: scene.thumbnail_url || story.thumbnail_url || "",
            sentences: sentencesList
          };

          // Check if this lesson already exists under the corresponding unit
          const lessonTitle = `${story.title} - Scene ${scene.order_index}`;
          const { data: existingNewLesson } = await supabase
            .from("lessons")
            .select("id")
            .eq("unit_id", unitId)
            .eq("title", lessonTitle)
            .maybeSingle();

          if (existingNewLesson) {
            // Update existing lesson content to keep it in sync
            const { error: updateError } = await supabase
              .from("lessons")
              .update({
                content: newContent,
                type: "speaking"
              })
              .eq("id", existingNewLesson.id);

            if (updateError) {
              console.error(`Update lesson error for ${lessonTitle}:`, updateError);
            } else {
              scenesMigrated++;
            }
          } else {
            // Create a brand new lesson entry mapped to the unit
            const { error: insertError } = await supabase
              .from("lessons")
              .insert([
                {
                  unit_id: unitId,
                  title: lessonTitle,
                  description: `Bài học luyện nói phân cảnh điện ảnh thứ ${scene.order_index} trích từ bộ phim kinh điển "${story.title}".`,
                  type: "speaking",
                  content: newContent,
                  is_published: true
                }
              ]);

            if (insertError) {
              console.error(`Insert lesson error for ${lessonTitle}:`, insertError);
            } else {
              scenesMigrated++;
            }
          }
        }
      }
    }

    return {
      success: true,
      message: `Đồng nhất hóa dữ liệu thành công! Đã tạo ${unitsCreated} chủ đề phim mới, di trú thành công ${scenesMigrated} phân cảnh phim điện ảnh vào hệ thống bài học EdTech mới.`,
      details: {
        storiesFound: legacyStories.length,
        unitsCreated,
        scenesMigrated
      }
    };
  } catch (err) {
    console.error("Migration error:", err);
    return {
      success: false,
      message: "Có lỗi xảy ra trong quá trình di trú phim cũ.",
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}
