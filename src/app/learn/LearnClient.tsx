"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  GraduationCap, 
  Sparkles, 
  Flame, 
  Volume2, 
  Mic, 
  Bookmark, 
  Award,
  Zap,
  ArrowRight,
  TrendingUp,
  Brain,
  Search
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface Grade {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface LearnClientProps {
  initialGrades: Grade[];
}

export default function LearnClient({ initialGrades }: LearnClientProps) {
  const [grades] = useState<Grade[]>(initialGrades);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error("Error fetching profile in LearnClient:", err);
      }
    };
    fetchProfile();
  }, []);

  // Premium Simulated Student Metrics (Localized to premium Vietnamese)
  const stats = [
    { label: "Độ chính xác Nghe", value: "87%", icon: Volume2, color: "text-blue-400 bg-blue-500/10", trend: "+3.2% tuần này" },
    { label: "Độ tự tin Nói", value: "78%", icon: Mic, color: "text-emerald-400 bg-emerald-500/10", trend: "+5.1% tuần này" },
    { label: "Từ vựng làm chủ", value: "92%", icon: Bookmark, color: "text-amber-400 bg-amber-500/10", trend: "Đã học 140 từ mới" },
    { label: "Sẵn sàng làm bài thi", value: "84%", icon: Award, color: "text-violet-400 bg-violet-500/10", trend: "Chuẩn Global Success" }
  ];

  // Adaptive recommendation system (Localized to premium Vietnamese)
  const recoveryMissions = [
    {
      id: "rec-1",
      title: "Phục hồi Kỹ năng Nghe Chép: Đời sống Gia đình (Household Chores)",
      skill: "Nghe & Chép chính tả",
      difficulty: "Trung cấp",
      xp: 150,
      reason: "⚠️ Độ chính xác nghe giảm xuống 68% trong bài luyện tập trước",
      lessonId: "lesson-u1l2"
    },
    {
      id: "rec-2",
      title: "Thử thách Shadowing: Luyện phát âm đuôi '-ed' chuẩn ngữ điệu",
      skill: "Luyện nói / Nhịp điệu",
      difficulty: "Cơ bản",
      xp: 200,
      reason: "🔥 Đang kích hoạt: Hoàn thành để nhân hệ số chuỗi học tập 5 ngày",
      lessonId: "lesson-u1l2"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar />

      <main className="page-top container-custom flex flex-col gap-12 w-full" style={{ paddingTop: '120px' }}>
        {/* Sleek Header: Welcome Student + Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-black text-slate-800">
              Chào mừng, <span className="text-blue-600">{profile?.full_name || 'Học viên'}</span>! 👋
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Hôm nay em muốn chinh phục bài học nào? Giáo trình chuẩn Global Success.
            </p>
          </div>
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học, chủ đề hoặc bài học..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Student Stats Matrix */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-500" /> Ma trận chỉ số năng lực
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 space-y-4 hover:border-slate-200 hover:shadow-md transition-all relative overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-display font-black text-slate-800">{stat.value}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.trend}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Adaptive Intelligence Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Brain size={14} className="text-violet-500" /> Nhiệm vụ phục hồi khuyết điểm AI đề xuất
            </h3>

            <div className="space-y-3">
              {recoveryMissions.map((rec) => (
                <div 
                  key={rec.id}
                  className="rounded-3xl border border-slate-100 bg-white hover:border-violet-100 hover:shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">{rec.skill}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">• {rec.difficulty}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800">{rec.title}</h4>
                    <p className="text-xs text-amber-600 font-medium italic">{rec.reason}</p>
                  </div>

                  <button 
                    onClick={() => window.location.href = `/learn/lesson/${rec.lessonId}`}
                    className="px-5 py-2.5 rounded-2xl bg-violet-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-violet-700 hover:scale-105 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer shadow-sm shadow-violet-500/10"
                  >
                    Nhận nhiệm vụ <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side quick statistics */}
          <div className="lg:col-span-4 rounded-[32px] border border-slate-100 bg-white p-8 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm">
                <Zap size={22} fill="currentColor" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-display font-black text-slate-800">Động lực học tập ngày</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Duy trì việc ôn tập 15 phút mỗi ngày để nhân 3 số điểm kinh nghiệm (XP) và mở khóa các danh hiệu Học viên Tiêu biểu.
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "70%" }} />
            </div>
            
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Mục tiêu: 15 phút/ngày</span>
              <span className="text-amber-600">Hoàn thành 70%</span>
            </div>
          </div>
        </div>

        {/* Netflix Grade Streaming Library */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <GraduationCap size={14} className="text-blue-500" /> Chọn lớp học của bạn
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {grades.map((grade) => (
              <motion.div
                key={grade.id}
                whileHover={{ y: -6 }}
                className="group relative rounded-xl bg-white border border-slate-100 overflow-hidden flex flex-col justify-between min-h-[14rem] h-auto p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                {/* Background decorative icon */}
                <div className="absolute top-0 right-0 p-6 text-slate-100 group-hover:text-blue-500/5 group-hover:scale-110 transition-all z-0">
                  <GraduationCap size={120} />
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">Lớp học</span>
                    <span className="text-slate-400 font-mono text-[10px]">#{grade.order_index}</span>
                  </div>
                  <h3 className="text-2xl font-display font-black text-slate-800">{grade.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 italic font-medium">{grade.description}</p>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">12 Unit • Đang chạy</span>
                  <Link 
                    href={`/learn/grade/${grade.id}`}
                    className="px-5 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Vào học ngay <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
