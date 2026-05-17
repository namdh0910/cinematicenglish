"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { 
  ChevronLeft,
  ClipboardList,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getTeacherClassrooms, getPublishedStories, createAssignment } from "@/app/actions/classroom";

interface Classroom {
  id: string;
  name: string;
}

export default function CreateAssignments() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"lesson" | "exam">("lesson");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7); // Default due date is 7 days from now
    return d.toISOString().split("T")[0];
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load classrooms and published stories on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [clses, sts] = await Promise.all([
          getTeacherClassrooms(),
          getPublishedStories()
        ]);
        setClassrooms(clses);
        setStories(sts);

        if (clses.length > 0) {
          setSelectedClass(clses[0].id);
        }
        if (sts.length > 0) {
          setSelectedActivityId(sts[0].id);
        }
      } catch (err) {
        console.error("Failed to load options:", err);
        setError("Không thể tải danh sách lớp học hoặc kho học liệu.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedClass) return;

    setError(null);
    startTransition(async () => {
      // Fallback activityId if there are no published stories in the database
      let actId = selectedActivityId;
      if (type === "lesson" && !actId) {
        actId = "00000000-0000-0000-0000-000000000000"; // Placeholder lesson UUID
      } else if (type === "exam") {
        actId = "11111111-1111-1111-1111-111111111111"; // Placeholder exam UUID
      }

      const result = await createAssignment({
        classroomId: selectedClass,
        title: title.trim(),
        activityType: type,
        activityId: actId,
        dueAt: new Date(dueDate).toISOString(),
      });

      if (result.success) {
        setSuccess(true);
        setTitle("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error ?? "Không thể giao bài tập. Vui lòng thử lại.");
      }
    });
  };

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="page-top pb-20">
        <Section container={true} className="space-y-10">
          
          {/* Top navigation path */}
          <div>
            <Link href="/teacher">
              <span className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <ChevronLeft size={14} /> Quay lại Trung tâm Quản lý Giáo viên
              </span>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Nhiệm vụ & Bài tập</span>
              <h1 className="text-3xl font-display font-black text-white">Giao bài tập mới</h1>
              <p className="text-xs text-white/40">Chọn lớp học mục tiêu, lựa chọn bài học hoặc đề thi, và điều phối tức thì.</p>
            </div>

            <Card className="p-8 border-white/5 bg-white/[0.01]">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="animate-spin text-violet-400" size={32} />
                  <p className="text-white/40 text-xs">Đang nạp danh sách lớp học và học liệu thực tế...</p>
                </div>
              ) : success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Giao bài tập thành công!</h3>
                  <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                    Học sinh trong lớp sẽ nhìn thấy bài tập trên Bảng học tập và Nhóm hoạt động lớp học của mình ngay lập tức.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {error && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs">
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Select Class */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Target Classroom (Lớp nhận bài)</label>
                    {classrooms.length === 0 ? (
                      <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        Bạn chưa có lớp học nào để giao bài. Vui lòng quay lại trang tổng quan và tạo một lớp học trước.
                      </div>
                    ) : (
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                        disabled={isPending}
                      >
                        {classrooms.map((cls) => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Assignment Title (Tiêu đề bài tập)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ví dụ: Luyện Shadowing âm /θ/ chủ đề Household Chores"
                      className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                      required
                      disabled={isPending}
                    />
                  </div>

                  {/* Coursework type selector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Task Type (Loại bài)</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                        disabled={isPending}
                      >
                        <option value="lesson">Immersive Lesson (Bài học)</option>
                        <option value="exam">Exam Sprint (Đề khảo thí)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Target Activity (Bài học mục tiêu)</label>
                      {type === "lesson" ? (
                        stories.length === 0 ? (
                          <select
                            disabled
                            className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white/40 cursor-not-allowed"
                          >
                            <option>Sử dụng bài học mặc định của hệ thống</option>
                          </select>
                        ) : (
                          <select
                            value={selectedActivityId}
                            onChange={(e) => setSelectedActivityId(e.target.value)}
                            className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                            disabled={isPending}
                          >
                            {stories.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title} ({s.difficulty})
                              </option>
                            ))}
                          </select>
                        )
                      ) : (
                        <select
                          value={selectedActivityId}
                          onChange={(e) => setSelectedActivityId(e.target.value)}
                          className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                          disabled={isPending}
                        >
                          <option value="ielts-foundation-test">Đề thi Mock IELTS Foundation</option>
                          <option value="midterm-exam">Đề thi khảo sát Giữa học kỳ I</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Due date */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Due Date (Hạn nộp bài)</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 font-mono cursor-pointer"
                      required
                      disabled={isPending}
                    />
                  </div>

                  {/* Dispatch Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPending || classrooms.length === 0}
                      className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>Đang giao bài... <Loader2 className="animate-spin" size={14} /></>
                      ) : (
                        <>Giao bài tập ngay <Send size={14} /></>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </Card>
          </div>

        </Section>
      </main>
    </div>
  );
}
