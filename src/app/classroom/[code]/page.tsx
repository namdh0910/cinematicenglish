"use client";
import { useState, useEffect, Suspense, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar, 
  Award, 
  Zap, 
  Play, 
  ChevronRight, 
  Flame,
  User,
  ArrowLeft
} from "lucide-react";
import { joinClassroomByCode, getStudentClassroomDetail, getStudentAssignments } from "@/app/actions/classroom";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { trackTelemetry } from "@/lib/observability/observability";

function ClassroomHubContent() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'checking' | 'joining' | 'success' | 'ready' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState("");
  const [classroom, setClassroom] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadClassroomData = async (classCode: string) => {
    try {
      const detail = await getStudentClassroomDetail(classCode);
      if (detail) {
        if (detail.isMember) {
          setClassroom(detail);
          setStatus('ready');
          
          // Pull assignments with submission records
          const list = await getStudentAssignments(detail.id);
          setAssignments(list);
        } else {
          // User is not a member yet, trigger joining flow
          setStatus('joining');
          const joinRes = await joinClassroomByCode(classCode);
          if (joinRes.success && joinRes.data) {
            setStatus('success');
            trackTelemetry('classroom_joined', { classCode });
            // Re-fetch after successful join to load full dashboard
            setTimeout(async () => {
              const updatedDetail = await getStudentClassroomDetail(classCode);
              if (updatedDetail) {
                setClassroom(updatedDetail);
                setStatus('ready');
                const list = await getStudentAssignments(updatedDetail.id);
                setAssignments(list);
              }
            }, 1500);
          } else {
            setStatus('error');
            setErrorMsg(joinRes.error ?? "Không thể kết nối vào lớp học.");
          }
        }
      } else {
        setStatus('error');
        setErrorMsg("Mã lớp học không tồn tại trên hệ thống.");
      }
    } catch (err) {
      console.error("Load classroom details error:", err);
      setStatus('error');
      setErrorMsg("Không thể kết nối máy chủ dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      loadClassroomData(code);
    }
  }, [code]);

  // Loading/Transition screens
  if (loading || status === 'checking') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-violet-400 mx-auto" size={32} />
          <p className="text-white/40 text-sm">Đang xác thực thông tin phòng học...</p>
        </div>
      </div>
    );
  }

  if (status === 'joining') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto">
            <GraduationCap size={28} className="text-violet-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display font-black text-white animate-pulse">Đang ghi danh bạn vào lớp...</h2>
            <p className="text-white/40 text-sm font-mono">Mã lớp: {code}</p>
          </div>
          <Loader2 size={32} className="animate-spin text-violet-400 mx-auto" />
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display font-black text-white">Kết nối lớp học thành công!</h2>
            <p className="text-white/40 text-sm">Chào mừng bạn gia nhập thành viên. Đang thiết lập bảng học tập...</p>
          </div>
          <Loader2 size={20} className="animate-spin text-white/30 mx-auto" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display font-black text-white">Không thể kết nối</h2>
            <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">{errorMsg}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setLoading(true);
                loadClassroomData(code);
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-sm hover:bg-amber-400 transition-colors"
            >
              Thử lại
            </button>
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Về bảng điều khiển
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="page-top pb-20">
        <Section container={true} className="space-y-10">
          
          {/* Header section with back shortcut */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/learn">
              <span className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <ArrowLeft size={14} /> Quay về Trung tâm
              </span>
            </Link>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-4 py-1.5 text-xs text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bạn đang ở trong phòng học trực tuyến
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT COLUMN: ACTIVE ASSIGNMENTS & FEED */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black tracking-widest text-violet-400 uppercase">
                  Classroom Feed (Bảng Tin Lớp Học)
                </span>
                <h1 className="text-4xl font-display font-black text-white">{classroom.name}</h1>
                <p className="text-xs text-white/40">
                  Giáo viên quản lý: <span className="text-white/60 font-bold">{classroom.teacher?.full_name || 'Chưa cập nhật'}</span> ({classroom.teacher?.email})
                </p>
              </div>

              {/* Assignments Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/30">Nhiệm vụ do giáo viên giao</h3>

                {assignments.length === 0 ? (
                  <Card className="p-10 border-white/5 bg-white/[0.01] text-center space-y-2">
                    <span className="text-2xl block">🎉</span>
                    <h4 className="text-sm font-bold text-white">Lớp học chưa có bài tập nào</h4>
                    <p className="text-xs text-white/30 max-w-xs mx-auto">
                      Giáo viên của bạn hiện chưa giao bài tập nào. Hãy tập trung luyện tập tự do tại khu vực Luyện nói AI.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {assignments.map((item) => {
                      const isCompleted = item.mySubmission !== null;
                      const lessonLink = item.activity_type === "lesson" 
                        ? `/learn/lesson/${item.activity_id}?assignmentId=${item.id}`
                        : `/learn/lesson/lesson-u1l2?assignmentId=${item.id}`; // Graceful fallback
                      
                      return (
                        <div 
                          key={item.id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isCompleted 
                              ? 'bg-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/20' 
                              : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={item.activity_type === 'exam' ? 'rose' : 'violet'} className="py-0 px-1.5 uppercase font-mono text-[8px] tracking-wider">
                                {item.activity_type === 'exam' ? 'Khảo thí' : 'Bài học'}
                              </Badge>
                              <span className="text-xs text-white/30 font-mono flex items-center gap-1">
                                <Calendar size={10} /> Hạn nộp: {new Date(item.due_at).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                            
                            {isCompleted && (
                              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
                                <CheckCircle2 size={12} />
                                Đã hoàn thành: Điểm số {item.mySubmission.score}% (Nói: {item.mySubmission.accuracy_speaking || 0}%, Nghe: {item.mySubmission.accuracy_listening || 0}%)
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center">
                            {isCompleted ? (
                              <Link href={lessonLink}>
                                <button className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                                  Ôn tập lại
                                </button>
                              </Link>
                            ) : (
                              <Link href={lessonLink}>
                                <button className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-amber-400 hover:scale-105 transition-all flex items-center gap-1.5 shadow-glow-gold">
                                  Làm bài ngay <Play size={10} fill="currentColor" />
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR LEADERBOARD & METRICS */}
            <div className="space-y-6">
              {/* Classroom Invite Card */}
              <Card className="p-6 border-white/5 bg-gradient-to-br from-violet-950/10 to-black space-y-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase">Mã tham gia lớp học</span>
                  <h4 className="text-3xl font-mono font-black text-white tracking-wider">{classroom.code}</h4>
                  <p className="text-[10px] text-white/40">Chia sẻ mã này với bạn bè để cùng nhau luyện nói tiếng Anh.</p>
                </div>
              </Card>

              {/* Classroom Leaderboard */}
              <Card className="p-6 border-white/5 bg-white/[0.01] space-y-6">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Award size={16} className="text-amber-500 animate-bounce" /> Bảng Vinh Danh Lớp Học
                  </h3>
                  <p className="text-[10px] text-white/30">Cập nhật điểm hào quang XP theo thời gian thực.</p>
                </div>

                <div className="space-y-3">
                  {classroom.leaderboard?.map((student: any, idx: number) => {
                    const isCurrentUser = student.id === classroom.userId; // Highlight user logic if we have userId, or keep styling clean
                    
                    return (
                      <div 
                        key={student.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          idx === 0 
                            ? 'bg-amber-500/5 border-amber-500/20' 
                            : 'bg-white/[0.01] border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 text-center font-mono font-black text-xs ${
                            idx === 0 ? 'text-amber-400' : (idx === 1 ? 'text-slate-300' : (idx === 2 ? 'text-amber-600' : 'text-white/20'))
                          }`}>
                            {idx + 1}
                          </span>
                          
                          <div className="w-8 h-8 rounded-lg overflow-hidden glass border border-white/10 shrink-0">
                            <img src={student.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          </div>

                          <div>
                            <span className="text-xs font-bold text-white block truncate max-w-[120px]">{student.name}</span>
                            <span className="text-[8px] font-mono text-white/40 uppercase">Thành viên lớp</span>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className="text-xs font-mono font-black text-amber-500 block">+{student.xp} XP</span>
                          {student.streak > 0 && (
                            <span className="text-[8px] font-mono font-bold text-emerald-400 flex items-center gap-0.5 justify-end">
                              <Flame size={10} className="text-amber-500" /> {student.streak} ngày
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>

        </Section>
      </main>
    </div>
  );
}

export default function StudentClassroomHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <ClassroomHubContent />
    </Suspense>
  );
}
