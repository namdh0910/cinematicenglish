import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SpeakingRoomClient from "./SpeakingRoomClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch lesson details with joined Unit and Grade relation details using new EdTech schema
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(`
      *,
      units (
        id,
        title,
        unit_no,
        grades (
          id,
          title
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !lesson) {
    console.error("Failed to fetch lesson detail:", error);
    redirect("/dashboard");
  }

  // Support both capitalized and lowercased lesson types (Speaking / speaking)
  const isSpeaking = lesson.type?.toLowerCase() === "speaking";

  if (!isSpeaking) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 text-slate-800">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl mx-auto">
            💡
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bài học không hỗ trợ Luyện Nói</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Hệ thống nhận thấy bài học này có thể thuộc cấu phần Dictation hoặc Trắc nghiệm khác. Xin vui lòng quay lại giao diện Lộ Trình để chọn bài luyện nói nhé!
          </p>
          <a
            href="/dashboard"
            className="inline-block w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
          >
            Quay lại Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <SpeakingRoomClient lesson={lesson} />;
}
