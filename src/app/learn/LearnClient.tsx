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
  Search,
  BookOpen,
  School,
  Play
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
    { label: "Độ chính xác Nghe", value: "87%", emoji: "🗣️", color: "bg-blue-100", trend: "+3.2% tuần này" },
    { label: "Độ tự tin Nói", value: "78%", emoji: "💬", color: "bg-emerald-100", trend: "+5.1% tuần này" },
    { label: "Từ vựng làm chủ", value: "92%", emoji: "📚", color: "bg-amber-100", trend: "Đã học 140 từ mới" },
    { label: "Sẵn sàng làm bài thi", value: "84%", emoji: "🏆", color: "bg-violet-100", trend: "Chuẩn Global Success" }
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
    <div className="bg-[#F5F7FB] min-h-screen pb-20 text-[#3D3D3B]">
      <Navbar />

      <main className="page-top container-custom flex flex-col gap-12 w-full" style={{ paddingTop: '24px' }}>
        {/* Hero Area Wrapper */}
        <div className="w-full rounded-[32px] overflow-hidden mt-6 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent border border-blue-100/30 p-8 shadow-sm">
          {/* Sleek Header: Welcome Student + Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FFFFFF] p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-[#1A1A18]">
                Chào mừng, <span className="text-[#3B82F6]">{profile?.full_name || 'Học viên'}</span>! 👋
              </h1>
              <p className="text-sm leading-[1.7] text-[#6B7280] font-medium">
                Hôm nay em muốn chinh phục bài học nào? Giáo trình chuẩn Global Success.
              </p>
            </div>
            <div className="w-full md:max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học, chủ đề hoặc bài học..."
                className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-sm font-bold text-[#3D3D3B] placeholder:text-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Student Stats Matrix */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.07em] text-[#6B7280] flex items-center gap-2">
            <TrendingUp size={14} className="text-[#3B82F6]" /> Ma trận chỉ số năng lực
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const isFirstOrSecond = i < 2;
              const trendColor = isFirstOrSecond ? "text-[#22C55E]" : "text-[#6B7280]";
              const trendIcon = isFirstOrSecond ? "▲ " : "";
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:border-blue-100 hover:shadow-[0_12px_40px_rgba(59,130,246,0.08)] transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${stat.color} text-4xl shadow-sm`}>
                      {stat.emoji}
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md ${trendColor}`}>
                      {trendIcon}{stat.trend}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#6B7280] font-bold text-base mb-2">{stat.label}</h3>
                    <div className="text-5xl font-black text-[#1A1A18] tracking-tight">{stat.value}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Adaptive Intelligence Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.07em] text-[#6B7280] flex items-center gap-2">
              <Brain size={14} className="text-[#8B5CF6]" /> Nhiệm vụ phục hồi khuyết điểm AI đề xuất
            </h3>

            <div className="space-y-3">
              {recoveryMissions.map((rec) => (
                <div 
                  key={rec.id}
                  className="rounded-3xl border border-slate-100 bg-[#FFFFFF] hover:border-blue-100 hover:shadow-[0_8px_24px_rgba(59,130,246,0.04)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-purple-50 text-[#8B5CF6] border border-purple-100 px-2 py-0.5 rounded-full">{rec.skill}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">• {rec.difficulty}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#1A1A18]">{rec.title}</h4>
                    <p className="text-xs text-[#F59E0B] font-bold italic">{rec.reason}</p>
                  </div>

                  <button 
                    onClick={() => window.location.href = `/learn/lesson/${rec.lessonId}`}
                    className="px-6 py-3.5 rounded-2xl bg-[#3B82F6] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer border-none shadow-[0_4px_0_rgb(37,99,235)] active:shadow-[0_0px_0_rgb(37,99,235)] active:translate-y-[4px] transition-all hover:brightness-105"
                  >
                    Nhận nhiệm vụ <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side quick statistics */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-100 bg-[#FFFFFF] p-8 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#F59E0B] shadow-sm">
                <Zap size={22} fill="currentColor" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-[#1A1A18]">Động lực học tập ngày</h4>
                <p className="text-[#6B7280] text-xs leading-relaxed font-medium">
                  Duy trì việc ôn tập 15 phút mỗi ngày để nhân 3 số điểm kinh nghiệm (XP) và mở khóa các danh hiệu Học viên Tiêu biểu.
                </p>
              </div>
            </div>

            <div className="w-full bg-[#EFF6FF] rounded-full h-2">
              <div className="bg-[#3B82F6] h-2 rounded-full" style={{ width: "70%" }} />
            </div>
            
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#6B7280]">
              <span>Mục tiêu: 15 phút/ngày</span>
              <span className="text-[#B45309]">Hoàn thành 70%</span>
            </div>
          </div>
        </div>

        {/* Netflix Grade Streaming Library */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.07em] text-[#6B7280] flex items-center gap-2">
              <GraduationCap size={14} className="text-[#3B82F6]" /> Chọn lớp học của bạn
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {grades.map((grade) => {
              const titleLower = grade.title.toLowerCase();
              const isCinematic = titleLower.includes("cinematic") || titleLower.includes("phim");
              const isHigh = titleLower.includes("10") || titleLower.includes("11") || titleLower.includes("12");
              const barColor = isCinematic ? "#8B5CF6" : isHigh ? "#3B82F6" : "#22C55E";

              // Emoji configuration
              let emojiBg = "bg-green-100";
              let emoji = "🏫";
              
              if (isCinematic) {
                emojiBg = "bg-purple-100";
                emoji = "🎬";
              } else if (isHigh) {
                emojiBg = "bg-blue-100";
                emoji = "🎒";
              }
              
              const statusText = "Đang học";
              const statusBg = "bg-[#DCFCE7] text-[#166534]";

              return (
                <motion.div
                  key={grade.id}
                  whileHover={{ y: -6, borderColor: '#3B82F6/30', boxShadow: '0 20px 40px rgba(59,130,246,0.1)' }}
                  className="group relative flex flex-col justify-end h-56 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 overflow-hidden transition-all duration-300"
                >
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${statusBg}`}>
                      {statusText}
                    </span>
                    <span className="text-[#6B7280] bg-slate-50 px-2 py-1 rounded-md font-mono text-[10px] font-bold">#{grade.order_index}</span>
                  </div>

                  <div className={`absolute top-6 left-6 w-20 h-20 rounded-full flex items-center justify-center ${emojiBg} text-5xl shadow-inner`}>
                    {emoji}
                  </div>
                  
                  <div className="mt-24 relative z-10 flex flex-col h-full justify-end">
                    <h4 className="text-3xl font-extrabold text-[#1A1A18] group-hover:text-[#3B82F6] transition-colors leading-tight line-clamp-1">{grade.title}</h4>
                    <p className="text-base text-[#6B7280] font-medium mt-2 line-clamp-2 leading-relaxed">{grade.description}</p>
                    
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                      <span className="text-sm text-[#6B7280] font-bold flex items-center gap-1.5">
                        <BookOpen size={16} className="text-[#3B82F6]" />
                        12 Unit
                      </span>
                      <Link 
                        href={`/learn/grade/${grade.id}`}
                        className="px-5 py-3 rounded-2xl bg-blue-50 text-xs font-black text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all flex items-center gap-1.5 shadow-[0_4px_0_rgb(219,234,254)] hover:shadow-[0_4px_0_rgb(37,99,235)] active:shadow-[0_0px_0_rgb(37,99,235)] active:translate-y-[4px] cursor-pointer border-none"
                      >
                        Vào học <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* 6px Progress Bar at card bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#EFF6FF]">
                    <div 
                      className="h-full rounded-r-full"
                      style={{ 
                        backgroundColor: barColor, 
                        width: "50%" 
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
