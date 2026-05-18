"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  ChevronLeft,
  Settings,
  Plus,
  Flame,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ClassroomHeatmap from "@/components/classroom/ClassroomHeatmap";
import AIInterventionPanel from "@/components/classroom/AIInterventionPanel";
import AssignmentTimeline from "@/components/classroom/AssignmentTimeline";
import StudentEvolutionProfile from "@/components/classroom/StudentEvolutionProfile";
import { getClassroomDetailForTeacher } from "@/app/actions/classroom";
import { Loader2, Copy, Check } from "lucide-react";
import { trackTelemetry } from "@/lib/observability/observability";

interface Student {
  id: string;
  name: string;
  avatar: string;
  speakingScore: number;
  listeningScore: number;
  streak: number;
  ritualsCompleted: number;
  status: "active" | "inactive" | "burnout";
}

interface Assignment {
  id: string;
  title: string;
  type: "lesson" | "exam";
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
}

const MOCK_STUDENTS: Student[] = [
  { id: "s1", name: "Nguyễn Hoàng Minh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang", speakingScore: 92, listeningScore: 95, streak: 24, ritualsCompleted: 14, status: "active" },
  { id: "s2", name: "Trần Minh Thư", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thu", speakingScore: 88, listeningScore: 94, streak: 18, ritualsCompleted: 12, status: "active" },
  { id: "s3", name: "Lê Anh Tuấn", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan", speakingScore: 85, listeningScore: 89, streak: 5, ritualsCompleted: 8, status: "burnout" },
  { id: "s4", name: "Phạm Lan Phương", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong", speakingScore: 91, listeningScore: 92, streak: 14, ritualsCompleted: 11, status: "active" },
  { id: "s5", name: "Vũ Bảo Nam", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam", speakingScore: 78, listeningScore: 82, streak: 3, ritualsCompleted: 4, status: "inactive" },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Unit 1 Lesson 2: Speaking Practice", type: "lesson", dueDate: "2026-05-20", submissionsCount: 4, totalStudents: 5 },
  { id: "a2", title: "Semester 1 Practice Exam Sprint", type: "exam", dueDate: "2026-05-25", submissionsCount: 2, totalStudents: 5 },
];

export default function TeacherClassroomDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams?.id || "";
  
  const [classroom, setClassroom] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load classroom and student submissions from Supabase
  useEffect(() => {
    if (!classId) return;

    const load = async () => {
      try {
        const data = await getClassroomDetailForTeacher(classId);
        if (data) {
          setClassroom(data);
          setStudents(data.students);
          setAssignments(data.assignments);
        } else {
          setError("Lớp học không tồn tại hoặc bạn không có quyền truy cập.");
        }
      } catch (err) {
        console.error("Load classroom detail error:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu lớp học.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId]);

  // Classroom global stats
  const avgSpeaking = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.speakingScore, 0) / students.length) 
    : 0;
  const avgListening = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.listeningScore, 0) / students.length) 
    : 0;
  const completionRate = (assignments.length > 0 && students.length > 0)
    ? Math.round(
        (assignments.reduce((acc, a) => acc + a.submissionsCount, 0) / 
        (assignments.length * students.length)) * 100
      )
    : 0;

  if (loading) {
    return (
      <div className="bg-primary min-h-screen text-white">
        <Navbar />
        <main className="page-top flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <Loader2 className="animate-spin text-violet-400 mx-auto" size={32} />
            <p className="text-white/40 text-sm">Đang tải thông tin lớp học...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="bg-primary min-h-screen text-white">
        <Navbar />
        <main className="page-top container-custom max-w-4xl py-20 text-center space-y-6">
          <AlertCircle className="text-red-400 mx-auto" size={48} />
          <h2 className="text-xl font-bold text-white">Lỗi truy cập lớp học</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">{error || "Lớp học không tồn tại."}</p>
          <Link href="/teacher" className="inline-block px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase text-xs hover:bg-amber-400 transition-colors">
            Quay về Trung tâm Giáo viên
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-[100dvh] text-white">
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

          {/* Classroom Title Info Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-display font-black text-white">
                  {classroom.name}
                </h1>
                <Badge variant="violet" className="py-0 px-2 font-mono">{classroom.code}</Badge>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Mã mời học sinh: <span className="font-mono font-bold text-amber-500">{classroom.code}</span> • Đã đăng ký: {students.length} học sinh
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/teacher/assignments">
                <span className="px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Plus size={14} /> Giao bài
                </span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Điểm nói trung bình lớp", value: `${avgSpeaking}%`, icon: TrendingUp, color: "text-amber-500" },
              { label: "Điểm nghe trung bình lớp", value: `${avgListening}%`, icon: Users, color: "text-violet-400" },
              { label: "Tỷ lệ hoàn thành bài học", value: `${completionRate}%`, icon: CheckCircle2, color: "text-emerald-400" },
            ].map((stat, idx) => (
              <Card key={idx} className="p-6 border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{stat.label}</span>
                  <h4 className="text-3xl font-mono font-black text-white mt-1">{stat.value}</h4>
                </div>
                <div className={`p-3.5 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
              </Card>
            ))}
          </div>

          {/* AI DIAGNOSTICS & COHORT HEATMAPS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <AIInterventionPanel />
            <ClassroomHeatmap />
            <StudentEvolutionProfile />
            <AssignmentTimeline />
          </div>

          {/* Student Roster & Active Assignments Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Student list */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Danh sách học sinh</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
                      <th className="pb-4">Học sinh</th>
                      <th className="pb-4">Speaking</th>
                      <th className="pb-4">Listening</th>
                      <th className="pb-4">Chuỗi ngày</th>
                      <th className="pb-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden glass border border-white/5">
                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">{student.name}</span>
                            <span className="text-[9px] text-white/30 uppercase font-bold mt-0.5 block">
                              Đã hoàn thành {student.ritualsCompleted} nhiệm vụ
                            </span>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-xs text-amber-500 font-bold">
                          {student.speakingScore}%
                        </td>
                        <td className="py-4 font-mono text-xs text-violet-400 font-bold">
                          {student.listeningScore}%
                        </td>
                        <td className="py-4 font-mono text-xs text-white/70">
                          {student.streak} ngày
                        </td>
                        <td className="py-4">
                          <Badge 
                            variant={student.status === "active" ? "emerald" : (student.status === "burnout" ? "rose" : "outline")} 
                            className="text-[9px]"
                          >
                            {student.status === "active" ? "Đang học tốt" : (student.status === "burnout" ? "Có dấu hiệu quá tải" : "Không hoạt động")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assignments pane */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Bài tập lớp học</h3>

              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const rate = Math.round((assignment.submissionsCount / assignment.totalStudents) * 100);
                  return (
                    <Card key={assignment.id} className="p-5 border-white/5 bg-white/[0.01] space-y-4">
                      <div>
                        <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block">{assignment.type === "lesson" ? "BÀI HỌC" : "BÀI THI"}</span>
                        <h4 className="text-sm font-bold text-white mt-1 leading-snug">{assignment.title}</h4>
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mt-1">
                          Hạn nộp: {assignment.dueDate}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end text-xs">
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Bài nộp</span>
                          <span className="font-mono font-bold text-white">{assignment.submissionsCount}/{assignment.totalStudents} ({rate}%)</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${rate}%` }} />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTENT OPERATIONS CONSOLE & EXPORT TOOLS */}
          <div className="pt-10 border-t border-white/5 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-black text-white">Công cụ quản lý lớp học</h3>
              <p className="text-xs text-white/40">Nhập giáo án JSON, xuất kết quả hàng loạt và giao bài tập nhanh dưới 60 giây.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Fast Assignment Dispatcher */}
              <Card className="p-6 border-white/5 bg-white/[0.01] space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Giao bài tập nhanh</span>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-white/60">Thời gian xử lý:</span>
                    <span className="text-emerald-400 font-bold">12ms <span className="text-white/40 font-normal">(Mục tiêu &lt;60s)</span></span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-white/60">Nhiệm vụ đã giao:</span>
                    <span className="text-white font-bold">3 bài tập đang chạy</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors">
                    Giao bài luyện siêu tốc Unit 3
                  </button>
                </div>
              </Card>

              {/* CSV Curriculum Import */}
              <Card className="p-6 border-white/5 bg-white/[0.01] space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Cổng nhập liệu CSV/JSON hàng loạt</span>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-white/60">Khả năng nhập dữ liệu:</span>
                    <span className="text-white font-bold">Hỗ trợ 10,000+ bài</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-white/60">Bài tập đã nạp:</span>
                    <span className="text-emerald-400 font-bold">1,000+ bài tập</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors">
                    Nhập giáo án JSON
                  </button>
                </div>
              </Card>

              {/* Roster Scores Export */}
              <Card className="p-6 border-white/5 bg-white/[0.01] space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Xuất bảng điểm học sinh</span>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-white/60">Cảnh báo học sinh:</span>
                    <span className="text-rose-400 font-bold">2 học sinh không hoạt động</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-white/60">Định dạng xuất:</span>
                    <span className="text-white font-bold">Bảng tính CSV</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-wider text-xs transition-colors">
                    Xuất bảng điểm (CSV)
                  </button>
                </div>
              </Card>

            </div>
          </div>

        </Section>
      </main>
    </div>
  );
}
