"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Flame,
  Volume2,
  AlertTriangle,
  Compass,
  Zap,
  BookOpen,
  HelpCircle,
  Loader2,
  Plus,
  GraduationCap
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getStudentClassrooms, getStudentAssignments } from "@/app/actions/classroom";
import { useRouter } from "next/navigation";

export default function HomeZone({ profile }: { profile: any }) {
  const router = useRouter();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const rawClses = await getStudentClassrooms();
        // Safe mapping in case classroom is returned as an array or object from PostgREST joins
        const clses = (rawClses || []).map((item: any) => {
          const classroomData = Array.isArray(item.classroom) ? item.classroom[0] : item.classroom;
          return {
            ...item,
            classroom: classroomData
          };
        });
        setClassrooms(clses);
        
        const allTasks: any[] = [];
        for (const item of clses) {
          if (item.classroom?.id) {
            const tasks = await getStudentAssignments(item.classroom.id);
            const pending = tasks.filter((t: any) => t.mySubmission === null);
            pending.forEach((t: any) => {
              allTasks.push({
                ...t,
                classroomCode: item.classroom.code,
                classroomName: item.classroom.name
              });
            });
          }
        }
        setActiveTasks(allTasks);
      } catch (err) {
        console.error("HomeZone load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    router.push(`/classroom/${joinCode.trim().toUpperCase()}`);
  };
  return (
    <div className="space-y-4">
      
      {/* ─── TOP SECTION: 12-COLUMN RESPONSIBLE GRID ─── */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Continue Learning card (5-Col) */}
        <div className="col-span-12 md:col-span-5 p-4 rounded-2xl border border-white/5 bg-gradient-to-r from-violet-950/10 via-black to-black flex flex-col justify-between space-y-4 min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" /> Lộ trình học tập chính
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">U1 Lesson 2: Household Chores</h3>
            <p className="text-[10px] text-white/40 leading-normal max-w-sm">
              Luyện phát âm & nghe chép chính tả chủ đề Đời sống gia đình (chuẩn GD&ĐT).
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/30">Tiếp theo: Luyện nói nhại âm</span>
            <Link href="/learn/lesson/lesson-u1l2">
              <span className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer">
                Học tiếp <Play size={8} fill="currentColor" />
              </span>
            </Link>
          </div>
        </div>

        {/* Daily Ritual Progress (3-Col) */}
        <Card className="col-span-12 md:col-span-3 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[140px] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase">Nhiệm vụ trong ngày</span>
            <span className="text-[9px] font-mono text-amber-500 font-bold">Xong 2/3</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-white/60">
              <span className="truncate">Luyện nói nhại âm</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="flex justify-between text-[10px] text-white/60">
              <span className="truncate">Nghe chép chính tả</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="flex justify-between text-[10px] text-white/60">
              <span className="truncate">Tinh chỉnh phát âm</span>
              <span className="text-white/30">0/1</span>
            </div>
          </div>

          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[66%]" />
          </div>
        </Card>

        {/* Upcoming Exam (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-rose-400 uppercase">Bài kiểm tra</span>
            <h4 className="text-xs font-bold text-white truncate leading-snug">Mock IELTS Foundation</h4>
            <span className="text-[9px] text-white/30 block mt-0.5">30 phút • Có tính giờ</span>
          </div>

          <Link href="/exam/ielts-foundation-test">
            <span className="text-[9px] font-mono font-bold text-white/40 group-hover:text-white flex items-center gap-0.5 cursor-pointer hover:underline">
              Làm bài ngay <ChevronRight size={10} />
            </span>
          </Link>
        </Card>

        {/* Aura Momentum (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-emerald-400 uppercase">Tỷ lệ chuyên cần</span>
            <h4 className="text-xl font-mono font-black text-white">92.4%</h4>
            <span className="text-[9px] text-emerald-400/80 font-mono font-bold block mt-0.5">+1.2% tuần này</span>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block">Duy trì thói quen</span>
        </Card>

      </div>

      {/* ─── MIDDLE SECTION: ACADEMIC CORE ─── */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Active Assignments (4-Col) */}
        <Card className="col-span-12 md:col-span-4 p-4 border-white/5 bg-white/[0.01] space-y-3 flex flex-col justify-between min-h-[180px]">
          <div className="space-y-2">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">
              Nhiệm vụ lớp học ({activeTasks.length})
            </span>
            
            {loading ? (
              <div className="py-6 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/20" size={16} />
              </div>
            ) : activeTasks.length === 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] text-white/40 leading-normal">
                  Bạn không có bài tập chưa hoàn thành nào.
                </p>
                {classrooms.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-violet-400 block">Lớp học đã tham gia:</span>
                    <div className="flex flex-wrap gap-1 max-h-[60px] overflow-y-auto no-scrollbar">
                      {classrooms.map((c: any) => (
                        <Link key={c.classroom.id} href={`/classroom/${c.classroom.code}`}>
                          <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-white hover:bg-white/10 transition-colors cursor-pointer inline-block">
                            {c.classroom.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar">
                {activeTasks.slice(0, 3).map((task) => (
                  <Link key={task.id} href={`/classroom/${task.classroomCode}`} className="block">
                    <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-3 cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 shrink-0">
                          <GraduationCap size={12} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-white group-hover:text-violet-400 transition-colors truncate max-w-[140px]">
                            {task.title}
                          </h4>
                          <span className="text-[8px] text-white/30 block mt-0.5 truncate max-w-[140px]">
                            {task.classroomName}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={10} className="text-white/20 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick classroom join input */}
          <form onSubmit={handleJoinClass} className="pt-2 border-t border-white/5 flex gap-2">
            <input 
              type="text"
              maxLength={6}
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              placeholder="Nhập mã lớp (6 ký tự)"
              disabled={joining}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-violet-500 font-mono placeholder:text-white/20 uppercase"
            />
            <button 
              type="submit"
              disabled={joining || joinCode.length < 5}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              {joining ? <Loader2 size={8} className="animate-spin" /> : "Vào Lớp"}
            </button>
          </form>
        </Card>

        {/* Weak Skills Recovery (3-Col) */}
        <Card className="col-span-12 md:col-span-3 p-4 border-white/5 bg-white/[0.01] space-y-3">
          <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Phục hồi kỹ năng khuyết điểm</span>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Âm vô thanh /θ/ (th)</span>
              <Badge variant="outline" className="py-0 px-1 text-[8px] font-mono">Cần sửa gấp</Badge>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Âm hữu thanh /ð/ (th)</span>
              <Badge variant="outline" className="py-0 px-1 text-[8px] font-mono">Cần sửa gấp</Badge>
            </div>
          </div>
        </Card>

        {/* Speaking Streak (3-Col) */}
        <Card className="col-span-6 md:col-span-3 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Chuỗi luyện phát âm</span>
            <h4 className="text-md font-bold text-white flex items-center gap-1">
              <Flame size={14} className="text-amber-500" /> Bền bỉ {profile?.current_streak || 0} Ngày
            </h4>
            <p className="text-[9px] text-white/40">Đang được bảo vệ bởi chuỗi liên tục của lớp học.</p>
          </div>

          <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500" 
              style={{ width: `${Math.min(100, ((profile?.current_streak || 0) / 10) * 100)}%` }}
            />
          </div>
        </Card>

        {/* Vocabulary Expansion (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">Kho từ vựng tích lũy</span>
            <h4 className="text-xl font-mono font-black text-white">412</h4>
            <span className="text-[9px] text-emerald-400 font-mono font-bold block mt-0.5">+14 từ hôm nay</span>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase block">Dải từ A2 - C1</span>
        </Card>

      </div>

      {/* ─── BOTTOM SECTION: FORECASTING & INTEL ─── */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* AI Coach Insight (4-Col) */}
        <Card className="col-span-12 md:col-span-4 p-4 border-white/5 bg-gradient-to-br from-violet-950/10 to-black space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Cố vấn Luyện nói AI</span>
          </div>
          <p className="text-[10px] text-white/60 leading-relaxed italic">
            "Nhịp điệu nói của em rất xuất sắc, chuẩn C1 Voice Architect. Hãy chú ý thả lỏng hơi thở tự nhiên hơn ở các âm tiết nhấn như 'fluctuation' trong hội thoại tới."
          </p>
        </Card>

        {/* Tomorrow Forecast (3-Col) */}
        <Card className="col-span-12 md:col-span-3 p-4 border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Thử thách ngày mai</span>
          
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-white/60">Bài học: Nhà đàm phán tài ba</span>
          </div>
          <p className="text-[9px] text-white/40 leading-relaxed">
            Thử thách bí ẩn đang chờ đón. Hãy quay lại vào lúc nửa đêm để mở khóa bài học tiếp theo.
          </p>
        </Card>

        {/* Weekly Growth (3-Col) */}
        <Card className="col-span-6 md:col-span-3 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">Tốc độ tăng trưởng tuần</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-xl font-mono font-black text-white">+8.4%</span>
              <TrendingUp size={14} className="text-emerald-400 pb-0.5" />
            </div>
            <p className="text-[9px] text-white/40">Chỉ số năng lực tương đối tính đến hôm nay.</p>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase block">Tiến độ rất xuất sắc</span>
        </Card>

        {/* Recent Achievements (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Danh hiệu & Huy hiệu</span>
            <h4 className="text-md font-bold text-white flex items-center gap-0.5 truncate">
              🏆 Voice Architect
            </h4>
            <span className="text-[9px] text-white/30 block mt-0.5">Đã mở khóa Cấp 4</span>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase block">5 huy hiệu đang hoạt động</span>
        </Card>

      </div>

    </div>
  );
}
