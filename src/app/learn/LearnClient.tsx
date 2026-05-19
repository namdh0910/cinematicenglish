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
    <div className="bg-[#F7F7F5] min-h-screen pb-20 text-[#3D3D3B]">
      <Navbar />

      <main className="page-top container-custom flex flex-col gap-12 w-full" style={{ paddingTop: '24px' }}>
        {/* Hero Area Wrapper */}
        <div className="w-full rounded-2xl overflow-hidden mt-6" style={{ backgroundColor: '#F0F7FF', padding: '1.5rem 1.5rem 1rem', marginBottom: '1.5rem' }}>
          {/* Sleek Header: Welcome Student + Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FFFFFF] p-8 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A1A18]">
                Chào mừng, <span className="text-[#2563EB]">{profile?.full_name || 'Học viên'}</span>! 👋
              </h1>
              <p className="text-[15px] leading-[1.7] text-[#6B6B68] font-medium">
                Hôm nay em muốn chinh phục bài học nào? Giáo trình chuẩn Global Success.
              </p>
            </div>
            <div className="w-full md:max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học, chủ đề hoặc bài học..."
                className="w-full bg-[#F7F7F5] border border-[#EBEBEA] rounded-xl py-3.5 pl-12 pr-6 text-sm font-bold text-[#3D3D3B] placeholder:text-[#6B6B68] focus:outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Student Stats Matrix */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#6B6B68] flex items-center gap-2">
            <TrendingUp size={14} className="text-[#2563EB]" /> Ma trận chỉ số năng lực
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const isFirstOrSecond = i < 2;
              const trendColor = isFirstOrSecond ? "text-[#16A34A]" : "text-[#6B6B68]";
              const trendIcon = isFirstOrSecond ? "▲ " : "";
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-[12px] border border-[#EBEBEA] bg-[#FFFFFF] p-[1rem_1.25rem] space-y-4 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6B6B68] uppercase tracking-[0.07em]">{stat.label}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF6FF] text-[#2563EB]`}>
                      <stat.icon size={16} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[28px] font-bold text-[#1A1A18] font-mono">{stat.value}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${trendColor}`}>
                      {trendIcon}{stat.trend}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Adaptive Intelligence Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#6B6B68] flex items-center gap-2">
              <Brain size={14} className="text-violet-500" /> Nhiệm vụ phục hồi khuyết điểm AI đề xuất
            </h3>

            <div className="space-y-3">
              {recoveryMissions.map((rec) => (
                <div 
                  key={rec.id}
                  className="rounded-xl border border-[#EBEBEA] bg-[#FFFFFF] hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">{rec.skill}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6B68]">• {rec.difficulty}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#1A1A18]">{rec.title}</h4>
                    <p className="text-xs text-amber-600 font-medium italic">{rec.reason}</p>
                  </div>

                  <button 
                    onClick={() => window.location.href = `/learn/lesson/${rec.lessonId}`}
                    className="px-5 py-2.5 rounded-[10px] bg-[#2563EB] text-white text-xs font-semibold uppercase tracking-wider hover:bg-blue-750 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer border-none shadow-[0_2px_8px_rgba(37,99,235,0.20)]"
                  >
                    Nhận nhiệm vụ <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side quick statistics */}
          <div className="lg:col-span-4 rounded-xl border border-[#EBEBEA] bg-[#FFFFFF] p-8 space-y-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm">
                <Zap size={22} fill="currentColor" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-[#1A1A18]">Động lực học tập ngày</h4>
                <p className="text-[#6B6B68] text-xs leading-relaxed font-medium">
                  Duy trì việc ôn tập 15 phút mỗi ngày để nhân 3 số điểm kinh nghiệm (XP) và mở khóa các danh hiệu Học viên Tiêu biểu.
                </p>
              </div>
            </div>

            <div className="w-full bg-[#EFF6FF] rounded-full h-2">
              <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: "70%" }} />
            </div>
            
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#6B6B68]">
              <span>Mục tiêu: 15 phút/ngày</span>
              <span className="text-[#B45309]">Hoàn thành 70%</span>
            </div>
          </div>
        </div>

        {/* Netflix Grade Streaming Library */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#6B6B68] flex items-center gap-2">
              <GraduationCap size={14} className="text-[#2563EB]" /> Chọn lớp học của bạn
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {grades.map((grade) => {
              const titleLower = grade.title.toLowerCase();
              const isCinematic = titleLower.includes("cinematic") || titleLower.includes("phim");
              const isHigh = titleLower.includes("10") || titleLower.includes("11") || titleLower.includes("12");
              const barColor = isCinematic ? "#534AB7" : isHigh ? "#185FA5" : "#0F6E56";

              // Thumbnail configuration
              let thumbBg = "#E1F5EE";
              let thumbIconColor = "#0F6E56";
              let ThumbIcon = School;
              
              if (isCinematic) {
                thumbBg = "#EEEDFE";
                thumbIconColor = "#534AB7";
                ThumbIcon = Play;
              } else if (isHigh) {
                thumbBg = "#E6F1FB";
                thumbIconColor = "#185FA5";
                ThumbIcon = BookOpen;
              }
              
              const statusText = "Đang học";
              const statusBg = "bg-[#DCFCE7] text-[#166534]";

              return (
                <motion.div
                  key={grade.id}
                  whileHover={{ y: -2 }}
                  className="group relative rounded-xl bg-white border border-[#EBEBEA] overflow-hidden flex flex-col justify-between min-h-[14rem] h-auto shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-[#BFDBFE] transition-all duration-300 pb-[4px]"
                >
                  {/* Thumbnail Swatch */}
                  <div 
                    className="w-full h-[100px] rounded-t-[10px] flex items-center justify-center shrink-0" 
                    style={{ backgroundColor: thumbBg }}
                  >
                    <ThumbIcon size={32} style={{ color: thumbIconColor }} />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                          {statusText}
                        </span>
                        <span className="text-[#6B6B68] font-mono text-[10px]">#{grade.order_index}</span>
                      </div>
                      <h3 className="text-[20px] font-bold text-[#1A1A18] group-hover:text-[#2563EB] transition-colors">{grade.title}</h3>
                      <p className="text-xs text-[#6B6B68] leading-relaxed font-medium line-clamp-2">{grade.description}</p>
                    </div>

                    <div className="flex items-center justify-between relative z-10 pt-3 border-t border-[#EBEBEA]">
                      {/* Unit count row with icon */}
                      <span className="text-[13px] text-[#6B6B68] font-medium flex items-center gap-1">
                        <BookOpen size={13} className="text-[#6B6B68]" />
                        12 Unit • Đang học
                      </span>
                      <Link 
                        href={`/learn/grade/${grade.id}`}
                        className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[11px] font-semibold text-[#2563EB] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Vào học <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* 4px Progress Bar at card bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#EFF6FF]">
                    <div 
                      className="h-full rounded-r-full"
                      style={{ 
                        backgroundColor: barColor, 
                        width: "50%" // progress indicator
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
