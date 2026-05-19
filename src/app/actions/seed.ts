"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server Action to seed mock data for Vietnam's Global Success curriculum
 * into grades, units, and lessons tables.
 */
export async function seedGlobalSuccessData() {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Seed or fetch Grade "Lớp 6"
    let gradeId: string;
    const { data: existingGrade, error: gradeFetchError } = await supabase
      .from("grades")
      .select("id")
      .eq("title", "Lớp 6")
      .maybeSingle();

    if (gradeFetchError) {
      console.error("Fetch grade error:", gradeFetchError);
      return { success: false, error: `Lỗi truy vấn khối lớp: ${gradeFetchError.message}` };
    }

    if (existingGrade) {
      gradeId = existingGrade.id;
    } else {
      const { data: newGrade, error: gradeInsertError } = await supabase
        .from("grades")
        .insert([
          {
            title: "Lớp 6",
            name: "Lớp 6",
            description: "Chương trình Tiếng Anh Lớp 6 Global Success",
            order_index: 6,
          },
        ])
        .select("id")
        .single();

      if (gradeInsertError) {
        console.error("Insert grade error:", gradeInsertError);
        return { success: false, error: `Lỗi tạo khối lớp Lớp 6: ${gradeInsertError.message}` };
      }
      gradeId = newGrade.id;
    }

    // 2. Seed or fetch Unit "Unit 1: My New School" belonging to "Lớp 6"
    let unitId: string;
    const { data: existingUnit, error: unitFetchError } = await supabase
      .from("units")
      .select("id")
      .eq("grade_id", gradeId)
      .eq("title", "Unit 1: My New School")
      .maybeSingle();

    if (unitFetchError) {
      console.error("Fetch unit error:", unitFetchError);
      return { success: false, error: `Lỗi truy vấn Unit: ${unitFetchError.message}` };
    }

    if (existingUnit) {
      unitId = existingUnit.id;
    } else {
      const { data: newUnit, error: unitInsertError } = await supabase
        .from("units")
        .insert([
          {
            grade_id: gradeId,
            title: "Unit 1: My New School",
            unit_no: "Unit 1",
            description: "Từ vựng đồ dùng học tập, các hoạt động ở trường, và phát âm chuẩn /ʌ/ và /ɑː/.",
          },
        ])
        .select("id")
        .single();

      if (unitInsertError) {
        console.error("Insert unit error:", unitInsertError);
        return { success: false, error: `Lỗi tạo Unit 1: ${unitInsertError.message}` };
      }
      unitId = newUnit.id;
    }

    // 3. Seed or fetch a Speaking Lesson inside Unit 1
    const { data: existingLesson, error: lessonFetchError } = await supabase
      .from("lessons")
      .select("id")
      .eq("unit_id", unitId)
      .eq("title", "Speaking Practice: Introduction")
      .maybeSingle();

    if (lessonFetchError) {
      console.error("Fetch lesson error:", lessonFetchError);
      return { success: false, error: `Lỗi truy vấn Lesson: ${lessonFetchError.message}` };
    }

    if (!existingLesson) {
      const { error: lessonInsertError } = await supabase
        .from("lessons")
        .insert([
          {
            unit_id: unitId,
            title: "Speaking Practice: Introduction",
            description: "Luyện nói hội thoại mẫu giới thiệu bản thân bám sát Unit 1.",
            type: "speaking",
            content: [
              { speaker: "Phong", text: "Hi, Vy." },
              { speaker: "Vy", text: "Hi, Phong. Are you ready?" },
            ],
            is_published: true,
          },
        ]);

      if (lessonInsertError) {
        console.error("Insert lesson error:", lessonInsertError);
        return { success: false, error: `Lỗi tạo Lesson: ${lessonInsertError.message}` };
      }
    }

    // 4. Seed or fetch a Dictation Lesson inside Unit 1
    const { data: existingDictation, error: dictationFetchError } = await supabase
      .from("lessons")
      .select("id")
      .eq("unit_id", unitId)
      .eq("type", "dictation")
      .maybeSingle();

    if (dictationFetchError) {
      console.error("Fetch dictation lesson error:", dictationFetchError);
      return { success: false, error: `Lỗi truy vấn Dictation Lesson: ${dictationFetchError.message}` };
    }

    if (!existingDictation) {
      const { error: dictationInsertError } = await supabase
        .from("lessons")
        .insert([
          {
            unit_id: unitId,
            title: "Dictation Practice: Schoolyard activities",
            description: "Luyện nghe điền từ: Các hoạt động diễn ra trong sân trường.",
            type: "dictation",
            content: { 
              audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
              text: "The students are playing [football] in the schoolyard.", 
              blanks: ["football"] 
            },
            is_published: true,
          },
        ]);

      if (dictationInsertError) {
        console.error("Insert dictation lesson error:", dictationInsertError);
        return { success: false, error: `Lỗi tạo Dictation Lesson: ${dictationInsertError.message}` };
      }
    }

    return { 
      success: true, 
      message: "Mồi dữ liệu Global Success (Lớp 6 -> Unit 1 -> Lesson Speaking & Dictation) thành công!" 
    };
  } catch (err: any) {
    console.error("Unhandled seed error:", err);
    return { success: false, error: err.message || "Lỗi hệ thống không xác định." };
  }
}
