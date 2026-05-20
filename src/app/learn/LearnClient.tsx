"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  Home,
  Globe,
  Trophy,
  Target,
  ShoppingBag,
  User,
  Flame,
  Zap,
  BookOpen,
  Award,
  Sparkles,
  Play,
  ArrowRight,
  Brain,
  TrendingUp,
  Search,
  GraduationCap,
  ChevronDown,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>("learn");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("learn");
    }
  }, [tabParam]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/learn?tab=${newTab}`, { scroll: false });
  };

  const [grades] = useState<Grade[]>(initialGrades);
  const [profile, setProfile] = useState<any>(null);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle clicking outside dynamic dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setGradeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Gamified metrics
  const stats = [
    { 
      label: "Độ chính xác Nghe", 
      value: "87%", 
      emoji: "🗣️", 
      color: "bg-[#E8F4FD]", 
      trend: "+3.2% tuần này", 
      trendColor: "text-[#1899D6]",
      accentColor: "#1899D6",
      borderColor: "hover:border-[#1899D6] hover:shadow-[0_6px_0_#84D8FF] border-[#E2EFFE]",
      bgGradient: "from-white to-[#F5FAFF]",
      badgeBg: "bg-[#E8F4FD]"
    },
    { 
      label: "Độ tự tin Nói", 
      value: "78%", 
      emoji: "💬", 
      color: "bg-[#E8F9EE]", 
      trend: "+5.1% tuần này", 
      trendColor: "text-[#58CC02]",
      accentColor: "#58CC02",
      borderColor: "hover:border-[#58CC02] hover:shadow-[0_6px_0_#A6E97E] border-[#E8FBEF]",
      bgGradient: "from-white to-[#F4FDF7]",
      badgeBg: "bg-[#E8F9EE]"
    },
    { 
      label: "Từ vựng làm chủ", 
      value: "92%", 
      emoji: "📚", 
      color: "bg-[#FFF8E7]", 
      trend: "140 từ mới học", 
      trendColor: "text-[#F59E0B]",
      accentColor: "#F59E0B",
      borderColor: "hover:border-[#F59E0B] hover:shadow-[0_6px_0_#FCDCA2] border-[#FFF6E2]",
      bgGradient: "from-white to-[#FFFDF5]",
      badgeBg: "bg-[#FFF8E7]"
    },
    { 
      label: "Sẵn sàng làm bài thi", 
      value: "84%", 
      emoji: "🏆", 
      color: "bg-[#F2EDFC]", 
      trend: "Chuẩn Global Success", 
      trendColor: "text-[#8B5CF6]",
      accentColor: "#8B5CF6",
      borderColor: "hover:border-[#8B5CF6] hover:shadow-[0_6px_0_#C5A6FA] border-[#F6F2FE]",
      bgGradient: "from-white to-[#FAF6FE]",
      badgeBg: "bg-[#F2EDFC]"
    }
  ];

  // Adaptive recommended missions
  const recoveryMissions = [
    {
      id: "rec-1",
      title: "Phòng Luyện Phát Âm AI (AI Virtual Speaking Room): Global citizen",
      skill: "AI Virtual Speaking",
      difficulty: "Trung cấp",
      xp: 200,
      reason: "🤖 Trợ lý ảo AI: Phát âm của em đang tiến bộ rất nhanh, thực hành shadowing ngay!",
      lessonId: "lesson-u1l2",
      themeColor: "#10B981",
      accentBg: "from-[#F4FDF7] via-white to-white",
      accentBorder: "border-[#E2F7E7]",
      hoverBorder: "hover:border-[#10B981] hover:shadow-[0_5px_0_#A7F3D0]",
      badge: "bg-[#E6F4EA] text-[#10B981] border-2 border-[#A7F3D0]",
      btnBg: "bg-[#10B981] shadow-[0_4px_0_#059669]",
      leftBar: "bg-[#10B981]",
      avatar: "🤖",
      statsText: "🎯 Độ trôi chảy (Fluency): 85% | Độ chính xác âm thoại: 78%"
    },
    {
      id: "rec-2",
      title: "Phòng Luyện Nghe & Viết (AI Virtual Dictation Room): Household Chores",
      skill: "AI Virtual Dictation",
      difficulty: "Nâng cao",
      xp: 150,
      reason: "⚡ Đang kích hoạt: Sửa đổi và ôn luyện chính tả ngữ pháp để nâng cao phản xạ nghe chép",
      lessonId: "lesson-u1l2",
      themeColor: "#8B5CF6",
      accentBg: "from-[#FAF6FE] via-white to-white",
      accentBorder: "border-[#E5D5FC]",
      hoverBorder: "hover:border-[#8B5CF6] hover:shadow-[0_5px_0_#C5A6FA]",
      badge: "bg-[#F2EDFC] text-[#8B5CF6] border-2 border-[#E1D4FB]",
      btnBg: "bg-[#8B5CF6] shadow-[0_4px_0_#7C3AED]",
      leftBar: "bg-[#8B5CF6]",
      avatar: "✍️",
      statsText: "⏱️ Tốc độ gõ trung bình: 45 wpm | Tỷ lệ viết đúng: 92%"
    }
  ];

  return (
    <div className="bg-[#F8FAFC] bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2F6] min-h-screen text-[#3D3D3B] flex flex-col w-full font-sans relative overflow-hidden">
      {/* Background glassmorphic glow elements */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-[400px] h-[400px] rounded-full bg-emerald-400/5 blur-[150px] pointer-events-none" />

      {/* Dynamic Top Navbar for mobile (automatically responsive) */}
      <Navbar />

      {/* 2. RESPONSIVE APP SHELL WRAPPER */}
      <div className="flex-1 flex flex-col items-center w-full min-h-screen">
        {/* 3-COLUMN MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
          
          {/* CỘT GIỮA (Lộ trình lớp học, Ma trận năng lực) */}
          <main className="space-y-10 min-w-0">
            {/* 1. HỌC TAB (Default Curriculum View) */}
            {activeTab === "learn" && (
              <>
                {/* Header Greeting Banner - PrepEdu Dual-Pane AI Console */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 md:p-8 flex flex-col lg:flex-row items-stretch justify-between gap-6 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] select-none">
                  {/* Cybernetic visual glows */}
                  <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
                  <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
                  
                  {/* Left Column: AI Status Panel */}
                  <div className="flex flex-col md:flex-row items-center gap-6 flex-1 relative z-10">
                    {/* Interactive Target Ring */}
                    <div className="relative shrink-0 flex items-center justify-center w-24 h-24 bg-slate-900/60 rounded-full border border-slate-700/50 p-2 shadow-inner">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="#334155" strokeWidth="6" fill="transparent" />
                        <circle 
                          cx="40" cy="40" r="34" 
                          stroke="#10B981" strokeWidth="6" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 * (1 - 0.78)}
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest leading-none">TARGET</span>
                        <span className="text-sm font-black text-white tracking-tight leading-none mt-1">9.0+</span>
                        <span className="text-[7.5px] text-emerald-400 font-extrabold tracking-wide mt-0.5">78% Đạt</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        <span className="bg-emerald-500/20 text-emerald-400 text-[8.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-emerald-500/30 shadow-sm flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                          ⚡ PrepEdu AI Console
                        </span>
                        <span className="bg-indigo-500/20 text-indigo-400 text-[8.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-indigo-500/30 shadow-sm">
                          Lộ trình cá nhân hóa
                        </span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                        Chào mừng, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 font-black">{profile?.full_name || "Học viên"}</span>! 👋
                      </h1>
                      <p className="text-xs text-slate-300 font-medium max-w-lg leading-relaxed">
                        Hệ thống đã phân tích năng lực hôm nay. Em có muốn tiếp tục bứt phá điểm số với <span className="text-emerald-400 font-bold">AI Virtual Speaking Room</span> hay các game của Quizlet dưới đây?
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Column: Premium Search Console */}
                  <div className="w-full lg:max-w-xs flex flex-col justify-center gap-3 shrink-0 z-10 relative border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-4 lg:pt-0 lg:pl-6">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Tìm khóa học, phòng luyện..."
                        className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                      <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Bộ lọc:</span>
                      <button className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase transition-colors">Tất cả</button>
                      <button className="bg-slate-900 text-slate-500 text-[8px] font-black px-2 py-1 rounded-md uppercase">Phòng Thi</button>
                      <button className="bg-slate-900 text-slate-500 text-[8px] font-black px-2 py-1 rounded-md uppercase">Lớp học</button>
                    </div>
                  </div>
                </div>

                {/* Student Stats Matrix */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#1899D6]" /> MA TRẬN CHỈ SỐ NĂNG LỰC CỦA EM
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white/95 backdrop-blur-md p-6 rounded-[2.2rem] border border-slate-200/80 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(59,62,198,0.06)] hover:border-slate-300 transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-1.5`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3.5">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color} text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-white`}>
                              {stat.emoji}
                            </div>
                            <div className={`text-[8px] font-black uppercase tracking-wider ${stat.badgeBg} ${stat.trendColor} px-2.5 py-1 rounded-full border border-slate-100/50 shadow-sm flex items-center gap-1`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              {stat.trend}
                            </div>
                          </div>
                          <h4 className="text-[#888888] font-black text-[9px] mb-1 uppercase tracking-widest leading-none">{stat.label}</h4>
                          <div className="text-3xl font-black text-[#1A1A18] tracking-tight flex items-baseline gap-1">
                            {stat.value}
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.accentColor }} />
                          </div>
                        </div>
                        
                        {/* High-Fidelity SVG Miniature Area Sparklines */}
                        <div className="w-full h-10 mt-3 relative overflow-hidden">
                          <svg viewBox="0 0 100 30" className="w-full h-full">
                            <defs>
                              <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={stat.accentColor} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={stat.accentColor} stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path 
                              d={`M 0,${25 - i*2} Q 20,${15 + i*2} 40,${10 - i*2} T 80,${20 - i} T 100,${5 + i}`} 
                              fill="none" 
                              stroke={stat.accentColor} 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                            />
                            <path 
                              d={`M 0,${25 - i*2} Q 20,${15 + i*2} 40,${10 - i*2} T 80,${20 - i} T 100,${5 + i} L 100,30 L 0,30 Z`} 
                              fill={`url(#grad-${i})`} 
                            />
                          </svg>
                        </div>

                        {/* AI Insights Hover Tooltip */}
                        <div className="absolute inset-x-4 bottom-14 bg-slate-900 text-white p-3 rounded-2xl text-[10px] font-extrabold leading-normal opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl border border-slate-800 z-20">
                          <p className="text-emerald-400 uppercase tracking-widest text-[7.5px] mb-1.5 flex items-center gap-1 font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            AI Insight
                          </p>
                          {i === 0 && "Phản xạ nghe âm gió của em đã tăng rõ rệt sau 2 bài chép ở Unit 1!"}
                          {i === 1 && "Độ chuẩn phát âm của âm đuôi /s/, /z/ tăng nhờ shadowing."}
                          {i === 2 && "Em đã làm chủ thêm 12 từ vựng khó về chủ đề Environment."}
                          {i === 3 && "Điểm trung bình mock test đạt 8.4, em đã sẵn sàng thi thật."}
                        </div>
                        
                        {/* Mini Sparkline Gauge */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-200/50">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: stat.value,
                              backgroundColor: stat.accentColor 
                            }} 
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation Recovery Missions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                      <Brain size={14} className="text-[#8B5CF6]" /> PHÒNG LUYỆN ẢO AI CỐT LÕI (AI VIRTUAL PRACTICE ROOMS)
                    </h3>
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Đang đồng bộ AI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {recoveryMissions.map((rec, recIdx) => (
                      <div 
                        key={rec.id}
                        className={`relative bg-white border border-slate-200 rounded-[2.2rem] p-5 md:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-5 hover:border-slate-350 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden pl-7 md:pl-8`}
                      >
                        {/* Elegant Left accent colored bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${rec.leftBar}`} />

                        <div className="space-y-3.5 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className={`text-[8.5px] font-black uppercase tracking-widest ${rec.badge} px-3 py-1 rounded-full shadow-sm`}>
                              {rec.skill}
                            </span>
                            <span className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
                              • {rec.difficulty}
                            </span>
                            <span className="text-[9.5px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shadow-sm flex items-center gap-0.5">
                              ✨ +{rec.xp} XP
                            </span>
                          </div>
                          
                          <h4 className="text-base font-black text-slate-800 leading-tight">
                            {rec.title}
                          </h4>
                          
                          {/* Rich Interactive Mockup of Virtual Rooms based on Index */}
                          {recIdx === 0 ? (
                            /* speaking room: animated sound column + Teacher Bee status */
                            <div className="space-y-2 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 h-6 py-1 bg-white border border-slate-200/60 rounded-xl px-2.5 shrink-0 shadow-sm">
                                  <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest mr-1">Phát âm AI:</span>
                                  <div className="flex items-end gap-0.5 h-full py-0.5 shrink-0">
                                    <span className="w-[2.5px] bg-[#10B981] rounded-full animate-[pulse_0.6s_infinite_alternate] h-[40%]" />
                                    <span className="w-[2.5px] bg-[#10B981] rounded-full animate-[pulse_0.4s_infinite_alternate] h-[80%]" />
                                    <span className="w-[2.5px] bg-[#10B981] rounded-full animate-[pulse_0.8s_infinite_alternate] h-[60%]" />
                                    <span className="w-[2.5px] bg-[#10B981] rounded-full animate-[pulse_0.5s_infinite_alternate] h-[100%]" />
                                    <span className="w-[2.5px] bg-[#10B981] rounded-full animate-[pulse_0.7s_infinite_alternate] h-[50%]" />
                                  </div>
                                </div>
                                <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 rounded-md text-[8px] px-1.5 py-0.5 font-black uppercase tracking-wider">
                                  Teacher Bee Online
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 mt-1">
                                <div className="bg-white p-1.5 rounded-xl text-center border border-slate-150 shadow-sm">
                                  <p className="text-[7.5px] text-slate-400 font-extrabold uppercase leading-none">Trôi chảy</p>
                                  <p className="text-[10px] font-black text-[#10B981] mt-0.5">85%</p>
                                </div>
                                <div className="bg-white p-1.5 rounded-xl text-center border border-slate-150 shadow-sm">
                                  <p className="text-[7.5px] text-slate-400 font-extrabold uppercase leading-none">Phát âm</p>
                                  <p className="text-[10px] font-black text-[#1899D6] mt-0.5">78%</p>
                                </div>
                                <div className="bg-white p-1.5 rounded-xl text-center border border-slate-150 shadow-sm">
                                  <p className="text-[7.5px] text-slate-400 font-extrabold uppercase leading-none">Ngữ điệu</p>
                                  <p className="text-[10px] font-black text-amber-500 mt-0.5">82%</p>
                                </div>
                              </div>
                              <p className="text-[#FF9600] font-black text-[9px] italic leading-tight pl-1">🤖 Trợ lý ảo AI: Phát âm rất tốt, bắt đầu luyện Shadowing ngay!</p>
                            </div>
                          ) : (
                            /* dictation room: transcript sheet highlighting corrections */
                            <div className="space-y-2">
                              <div className="bg-slate-900 text-[#E2E8F0] p-3.5 rounded-2xl font-mono text-[9px] leading-relaxed border border-slate-800 shadow-inner relative overflow-hidden">
                                <div className="absolute top-2 right-2 text-[7.5px] font-black text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded uppercase tracking-wider">
                                  Dictation Sheet
                                </div>
                                <p className="text-[#94A3B8]">
                                  Luyện viết chính tả câu SGK:
                                  <span className="block mt-1 text-[#E2E8F0] border-l-2 border-slate-700 pl-2">
                                    "I think we should do <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded font-black">household</span> tasks."
                                  </span>
                                </p>
                                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[8px] text-[#AFAFAF] font-sans">
                                  <span>⏱️ Tốc độ: <strong className="text-white font-extrabold">45 WPM</strong></span>
                                  <span>🎯 Tỉ lệ đúng: <strong className="text-emerald-400 font-extrabold">92%</strong></span>
                                </div>
                              </div>
                              <p className="text-[#FF9600] font-black text-[9px] italic leading-tight pl-1">⚡ Đang hoạt động: Thực hành nghe chép để bứt phá phản xạ viết nhanh.</p>
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => window.location.href = `/learn/lesson/${rec.lessonId}`}
                          className={`w-full py-3.5 rounded-2xl ${rec.btnBg} text-white text-[10px] font-black uppercase tracking-widest cursor-pointer border-none active:translate-y-[2px] transition-all hover:brightness-105 flex items-center justify-center gap-1.5 shadow-[0_4px_0_rgba(0,0,0,0.1)]`}
                        >
                          VÀO PHÒNG LUYỆN ẢO <ArrowRight size={12} className="stroke-[2.5]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* School Grade Library (Bento Selectors) */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                    <GraduationCap size={14} className="text-[#1899D6]" /> CHƯƠNG TRÌNH HỌC PHỔ THÔNG
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grades.map((grade) => {
                      const titleLower = grade.title.toLowerCase();
                      const isCinematic = titleLower.includes("cinematic") || titleLower.includes("phim");
                      const isLop6 = titleLower.includes("6");
                      const isGrade10 = titleLower.includes("10");
                      const isGrade11 = titleLower.includes("11");
                      const isGrade12 = titleLower.includes("12");

                      // Define VIP Theme configuration
                      let theme = {
                        cardBg: "bg-[#EAFBF0]", // Lớp 6 default (emerald green)
                        borderColor: "border-[#C2E7CC]",
                        hoverBorder: "hover:border-[#10B981]",
                        glowShadow: "shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.18)]",
                        titleColor: "text-[#065F46]",
                        descColor: "text-emerald-700/80",
                        accentColor: "#10B981",
                        badgeBg: "bg-[#E6F4EA] text-[#10B981] border-[#A7F3D0]",
                        btnBg: "bg-white border-[#10B981]/30 text-[#10B981] shadow-[0_4px_0_#10B981]",
                        btnHoverShadow: "hover:shadow-[0_4px_0_#10B981]",
                        moduleText: "text-emerald-600/80"
                      };

                      if (isCinematic) {
                        theme = {
                          cardBg: "bg-[#18181B]", // Elegant dark background for film
                          borderColor: "border-[#27272A]",
                          hoverBorder: "hover:border-[#F59E0B]",
                          glowShadow: "shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.22)]",
                          titleColor: "text-white",
                          descColor: "text-zinc-400",
                          accentColor: "#F59E0B",
                          badgeBg: "bg-[#27272A] text-[#F59E0B] border-[#F59E0B]/30",
                          btnBg: "bg-[#F59E0B] border-transparent text-black shadow-[0_4px_0_#B45309]",
                          btnHoverShadow: "hover:shadow-[0_4px_0_#B45309]",
                          moduleText: "text-[#F59E0B]"
                        };
                      } else if (isGrade10) {
                        theme = {
                          cardBg: "bg-[#3B3EC6]", // Solid Quizlet indigo blue
                          borderColor: "border-[#3B3EC6]",
                          hoverBorder: "hover:border-white/90",
                          glowShadow: "shadow-[0_8px_30px_rgba(59,62,198,0.1)] hover:shadow-[0_20px_40px_rgba(59,62,198,0.35)]",
                          titleColor: "text-white",
                          descColor: "text-indigo-100/90",
                          accentColor: "#FFFFFF",
                          badgeBg: "bg-white/10 text-white border-white/20",
                          btnBg: "bg-white border-transparent text-[#3B3EC6] shadow-[0_4px_0_#2A2C9F]",
                          btnHoverShadow: "hover:shadow-[0_4px_0_#2A2C9F]",
                          moduleText: "text-indigo-100"
                        };
                      } else if (isGrade11) {
                        theme = {
                          cardBg: "bg-[#F2EDFC]", // Royal purple pastel
                          borderColor: "border-[#EBE2FC]",
                          hoverBorder: "hover:border-[#8B5CF6]",
                          glowShadow: "shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(139,92,246,0.18)]",
                          titleColor: "text-[#5B21B6]",
                          descColor: "text-purple-700/80",
                          accentColor: "#8B5CF6",
                          badgeBg: "bg-[#F2EDFC] text-[#8B5CF6] border-[#E1D4FB]",
                          btnBg: "bg-white border-[#8B5CF6]/30 text-[#8B5CF6] shadow-[0_4px_0_#8B5CF6]",
                          btnHoverShadow: "hover:shadow-[0_4px_0_#8B5CF6]",
                          moduleText: "text-purple-600/80"
                        };
                      } else if (isGrade12) {
                        theme = {
                          cardBg: "bg-[#FDF2F8]", // Premium rose pink pastel
                          borderColor: "border-[#FBCFE8]",
                          hoverBorder: "hover:border-[#EC4899]",
                          glowShadow: "shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(236,72,153,0.18)]",
                          titleColor: "text-[#9D174D]",
                          descColor: "text-pink-700/80",
                          accentColor: "#EC4899",
                          badgeBg: "bg-[#FDF2F8] text-[#EC4899] border-[#FBCFE8]",
                          btnBg: "bg-white border-[#EC4899]/30 text-[#EC4899] shadow-[0_4px_0_#EC4899]",
                          btnHoverShadow: "hover:shadow-[0_4px_0_#EC4899]",
                          moduleText: "text-pink-600/80"
                        };
                      }

                      // Visual Mockup Renderer based on Grade Type - upgraded to high fidelity Quizlet & PrepEdu mockups
                      const renderVisualMockup = () => {
                        if (isLop6) {
                          // Lớp 6 (Emerald): Match Game board mini
                          return (
                            <div className="relative w-full h-[180px] bg-gradient-to-br from-[#E6F4EA]/60 to-[#F4FDF7]/60 rounded-3xl border border-[#C2E7CC]/50 flex flex-col justify-between p-3.5 overflow-hidden select-none">
                              {/* Match header with timer */}
                              <div className="flex items-center justify-between text-[8.5px] text-[#065F46] font-black uppercase tracking-widest border-b border-[#C2E7CC]/30 pb-1.5">
                                <span>🧩 Quizlet Match Game</span>
                                <span className="font-mono text-emerald-600 bg-white border border-[#C2E7CC]/60 px-2 py-0.5 rounded shadow-sm">
                                  ⏱️ 00:14.85
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5 w-full my-auto">
                                <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm h-[58px]">
                                  <span className="text-lg">🎒</span>
                                  <span className="text-[9px] font-black text-slate-700 mt-0.5">backpack</span>
                                </div>
                                <div className="bg-white border-2 border-[#10B981] rounded-2xl p-2 flex flex-col items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)] h-[58px] relative overflow-hidden">
                                  <span className="text-lg">📘</span>
                                  <span className="text-[9px] font-black text-[#10B981] mt-0.5">book</span>
                                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] flex items-center justify-center shadow">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" /></svg>
                                  </div>
                                </div>
                                <div className="bg-[#10B981] text-white rounded-2xl p-2 flex flex-col items-center justify-center shadow-md h-[58px] border border-emerald-600">
                                  <span className="text-[10px] font-black tracking-wide">sách</span>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col items-center justify-center shadow-sm h-[58px]">
                                  <span className="text-lg">✏️</span>
                                  <span className="text-[9px] font-black text-slate-700 mt-0.5">pencil</span>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (isGrade10) {
                          // Lớp 10 (Ocean Blue): Stacked 3D deck of flashcards
                          return (
                            <div className="relative w-full h-[180px] bg-gradient-to-br from-[#2E31A6]/90 to-[#3B3EC6]/90 rounded-3xl border border-[#3B3EC6] flex items-center justify-center p-3.5 overflow-hidden select-none">
                              {/* Background cards stacked */}
                              <div className="absolute w-[180px] h-[110px] bg-white/10 border border-white/20 rounded-2xl transform -rotate-[10deg] -translate-y-2 -translate-x-6 opacity-30 shadow-2xl" />
                              <div className="absolute w-[180px] h-[110px] bg-white/20 border border-white/25 rounded-2xl transform -rotate-[5deg] -translate-y-1 -translate-x-2 opacity-50 shadow-xl" />
                              
                              {/* Foreground active card */}
                              <div className="absolute w-[190px] h-[115px] bg-white rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.22)] p-4 flex flex-col justify-between transform rotate-[3deg] translate-x-3 border border-white transition-all duration-500 group-hover:rotate-[6deg] group-hover:scale-[1.05] group-hover:translate-x-5">
                                <div className="flex items-start justify-between">
                                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider">
                                    ☘️ Unit 3
                                  </span>
                                  <button className="text-xs text-slate-400">🔊</button>
                                </div>
                                <div className="my-auto text-center">
                                  <h5 className="text-[13px] font-black text-slate-800 tracking-tight uppercase">Biodiversity</h5>
                                  <p className="text-[9.5px] text-[#58CC02] font-black leading-none mt-1">Đa dạng sinh học</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[8px]">
                                  <span className="text-[#10B981] font-black flex items-center gap-0.5">
                                    ✓ Mastered
                                  </span>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider">Mặt trước 🔁</span>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (isGrade11) {
                          // Lớp 11 (Royal Purple): SVG circular score gauge diagnostics
                          return (
                            <div className="relative w-full h-[180px] bg-gradient-to-br from-[#FAF6FE] to-[#F2EDFC] rounded-3xl border border-[#EBE2FC]/60 flex items-center justify-center p-3.5 overflow-hidden select-none">
                              <div className="bg-white rounded-2xl shadow-[0_12px_24px_rgba(139,92,246,0.08)] border border-[#EBE2FC]/50 p-4 w-full max-w-[220px] flex items-center justify-between gap-3 transition-all duration-500 group-hover:scale-[1.03]">
                                <div className="space-y-2">
                                  <div className="text-[8.5px] text-slate-400 font-black uppercase tracking-widest">Thời gian còn lại</div>
                                  <div className="text-[13px] font-black text-slate-800 flex items-center gap-1">
                                    ⏱️ 14:59
                                  </div>
                                  <div className="pt-1 flex flex-col gap-1">
                                    <span className="text-[8.5px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                                      ✓ 17 Đúng
                                    </span>
                                    <span className="text-[8.5px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-0.5">
                                      ✗ 3 Sai
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="relative flex flex-col items-center justify-center shrink-0 w-20 h-20">
                                  <svg className="w-20 h-20 transform -rotate-90">
                                    <circle cx="40" cy="40" r="30" stroke="#F1F3F9" strokeWidth="6" fill="transparent" />
                                    <circle 
                                      cx="40" cy="40" r="30" 
                                      stroke="#8B5CF6" strokeWidth="6" fill="transparent" 
                                      strokeDasharray={2 * Math.PI * 30}
                                      strokeDashoffset={2 * Math.PI * 30 * (1 - 0.85)}
                                      strokeLinecap="round"
                                      className="drop-shadow-[0_0_6px_rgba(139,92,246,0.3)]"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xs font-black text-slate-800 tracking-tight leading-none">85%</span>
                                    <span className="text-[6.5px] text-[#8B5CF6] font-black uppercase tracking-widest mt-0.5">ĐẠT</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (isGrade12) {
                          // Lớp 12 (Rose Pink): Interactive spelling write-in answer with blinking cursor
                          return (
                            <div className="relative w-full h-[180px] bg-gradient-to-br from-[#FFF5F5]/40 to-[#FDF2F8]/60 rounded-3xl border border-[#FBCFE8]/50 flex items-center justify-center p-3.5 overflow-hidden select-none">
                              <div className="bg-white rounded-2xl border border-pink-100 shadow-[0_12px_24px_rgba(236,72,153,0.08)] p-4 w-full max-w-[230px] flex flex-col justify-between h-[135px] transition-all duration-500 group-hover:scale-[1.03]">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-[8.5px] font-black text-pink-500 uppercase tracking-widest leading-none mb-1">
                                    <span>✍️ QUIZLET SPELL MODE</span>
                                  </div>
                                  <h6 className="text-[10px] font-black text-slate-800 leading-tight">
                                    📚 "Cơ hội nghề nghiệp"
                                  </h6>
                                  <p className="text-[9.5px] text-slate-500 font-semibold italic mt-0.5">
                                    Great career <span className="border-b border-[#777777] px-1 font-black text-slate-800">_________</span> are ahead.
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="bg-[#E8F9EE] border border-[#B3F2C9] rounded-xl px-2.5 py-1.5 text-[9.5px] text-emerald-800 font-black flex items-center justify-between">
                                    <span className="flex items-center gap-0.5">
                                      opportunities<span className="w-[1.5px] h-3 bg-emerald-600 animate-[pulse_0.6s_infinite] inline-block" />
                                    </span>
                                    <span className="text-[#58CC02] text-[8px] uppercase tracking-wider font-black flex items-center gap-0.5">
                                      ✓ Đúng rồi!
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          // Cinematic Learning (Gold Carbon theme): Immersive Dark Video Player with active dictionary tooltip
                          return (
                            <div className="relative w-full h-[180px] bg-zinc-950 rounded-3xl border border-zinc-800 flex flex-col justify-between p-4 overflow-hidden select-none shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                              {/* Top Bar Player Controls */}
                              <div className="flex items-center justify-between text-[8px] text-zinc-500 font-extrabold border-b border-zinc-900 pb-2">
                                <span className="flex items-center gap-1 text-[#F59E0B] drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]">
                                  🎬 CINEMATIC PLAYER PRO
                                </span>
                                <span className="font-mono">01:42 / 03:05</span>
                              </div>
                              
                              {/* Dialogue Subtitles block */}
                              <div className="my-auto py-1.5 flex flex-col items-center justify-center text-center">
                                <p className="text-[11px] md:text-[11.5px] text-zinc-100 font-black leading-tight max-w-[200px]">
                                  "It's not about the <span className="text-[#F59E0B] font-extrabold underline decoration-wavy underline-offset-2 bg-[#F59E0B]/10 px-1 rounded border border-[#F59E0B]/20">destination</span>..."
                                </p>
                                
                                {/* Floating mini dictionary card */}
                                <div className="mt-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-[7.5px] font-black text-zinc-400 flex items-center gap-1 shadow-md scale-95 opacity-90">
                                  <span className="text-[#F59E0B]">destination (n):</span> điểm đến, đích đến
                                </div>
                              </div>
                              
                              {/* Seekbar and Player details */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="bg-zinc-900 h-1.5 rounded-full w-full relative border border-zinc-800">
                                    <div className="bg-[#F59E0B] h-full rounded-full w-[55%] relative flex items-center justify-end">
                                      <span className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-md border border-[#F59E0B]" />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-[7px] text-zinc-500 font-black">
                                  <span>Tập 2: The Journey</span>
                                  <span className="text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded font-black border border-[#F59E0B]/20">HD 1080p</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      };

                      return (
                        <Link 
                          key={grade.id}
                          href={`/learn/grade/${grade.id}`}
                          className="group block select-none"
                        >
                          <motion.div
                            whileHover={{ y: -10 }}
                            className={`relative flex flex-col justify-between h-[450px] ${theme.cardBg} border-2 ${theme.borderColor} rounded-[2.5rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] ${theme.hoverBorder} ${theme.glowShadow} transition-all duration-500 overflow-hidden`}
                          >
                            {/* Card Header area */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${theme.badgeBg} border shadow-sm flex items-center gap-1`}>
                                  <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                  Đang học
                                </span>
                                <span className="text-xl">{isCinematic ? "🎬" : isLop6 ? "🏫" : isGrade10 ? "🎒" : isGrade11 ? "📚" : "🎓"}</span>
                              </div>
                              <h4 className={`text-xl font-black ${theme.titleColor} tracking-tight text-center pb-2`}>
                                {grade.title}
                              </h4>
                            </div>

                            {/* Custom Visual Mockup Canvas */}
                            <div className="my-2.5">
                              {renderVisualMockup()}
                            </div>

                            {/* Card Footer details */}
                            <div className="space-y-3.5 z-10 pt-2 border-t border-dashed border-slate-200/50">
                              <p className={`text-xs ${theme.descColor} font-semibold leading-relaxed line-clamp-2 h-8`}>
                                {grade.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] ${theme.moduleText} font-black uppercase tracking-wider flex items-center gap-1.5`}>
                                  <BookOpen size={13} className="stroke-[2.5]" /> 12 CHUYÊN ĐỀ HỌC
                                </span>
                                
                                <button 
                                  className={`px-4.5 py-2.5 rounded-2xl bg-white border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shrink-0 ${theme.btnBg} group-hover:brightness-105 active:translate-y-[4px] active:shadow-none cursor-pointer`}
                                >
                                  VÀO HỌC <ArrowRight size={11} className="stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* 2. CHỮ CÁI TAB (Interactive Phonetics IPA Chart) */}
            {activeTab === "alphabet" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Bảng Chữ Cái Tiếng Anh Standard 🗣️
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Nhấp vào từng ký tự để nghe phát âm IPA chuẩn bản xứ và từ vựng ví dụ theo chuẩn sách giáo khoa Global Success!
                  </p>
                </div>

                {/* Alphabet grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[
                    { letter: "Aa", ipa: "/eɪ/", word: "Apple", vn: "Quả táo" },
                    { letter: "Bb", ipa: "/biː/", word: "Book", vn: "Quyển sách" },
                    { letter: "Cc", ipa: "/siː/", word: "Cat", vn: "Con mèo" },
                    { letter: "Dd", ipa: "/diː/", word: "Dog", vn: "Con chó" },
                    { letter: "Ee", ipa: "/iː/", word: "Egg", vn: "Quả trứng" },
                    { letter: "Ff", ipa: "/ɛf/", word: "Fish", vn: "Con cá" },
                    { letter: "Gg", ipa: "/dʒiː/", word: "Girl", vn: "Cô gái" },
                    { letter: "Hh", ipa: "/eɪtʃ/", word: "House", vn: "Ngôi nhà" },
                    { letter: "Ii", ipa: "/aɪ/", word: "Ice cream", vn: "Kem" },
                    { letter: "Jj", ipa: "/dʒeɪ/", word: "Juice", vn: "Nước ép" },
                    { letter: "Kk", ipa: "/keɪ/", word: "Kite", vn: "Cái diều" },
                    { letter: "Ll", ipa: "/ɛl/", word: "Lion", vn: "Sư tử" },
                    { letter: "Mm", ipa: "/ɛm/", word: "Milk", vn: "Sữa" },
                    { letter: "Nn", ipa: "/ɛn/", word: "Nose", vn: "Cái mũi" },
                    { letter: "Oo", ipa: "/oʊ/", word: "Orange", vn: "Quả cam" },
                    { letter: "Pp", ipa: "/piː/", word: "Pen", vn: "Bút viết" },
                    { letter: "Qq", ipa: "/kjuː/", word: "Queen", vn: "Nữ hoàng" },
                    { letter: "Rr", ipa: "/ɑːr/", word: "Rain", vn: "Cơn mưa" },
                    { letter: "Ss", ipa: "/ɛs/", word: "Sun", vn: "Mặt trời" },
                    { letter: "Tt", ipa: "/tiː/", word: "Train", vn: "Tàu hỏa" },
                    { letter: "Uu", ipa: "/juː/", word: "Umbrella", vn: "Cái ô" },
                    { letter: "Vv", ipa: "/viː/", word: "Van", vn: "Xe tải" },
                    { letter: "Ww", ipa: "/ˈdʌbəl.juː/", word: "Water", vn: "Nước" },
                    { letter: "Xx", ipa: "/ɛks/", word: "Xylophone", vn: "Đàn mộc cầm" },
                    { letter: "Yy", ipa: "/waɪ/", word: "Yo-yo", vn: "Đồ chơi yo-yo" },
                    { letter: "Zz", ipa: "/zɛd/", word: "Zoo", vn: "Sở thú" }
                  ].map((item) => (
                    <motion.button
                      key={item.letter}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        if (typeof window !== "undefined" && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                          const letterUtterance = new SpeechSynthesisUtterance(item.letter.charAt(0));
                          letterUtterance.lang = "en-US";
                          letterUtterance.rate = 0.8;
                          window.speechSynthesis.speak(letterUtterance);
                          
                          setTimeout(() => {
                            const wordUtterance = new SpeechSynthesisUtterance(item.word);
                            wordUtterance.lang = "en-US";
                            wordUtterance.rate = 0.9;
                            window.speechSynthesis.speak(wordUtterance);
                          }, 1000);
                        }
                      }}
                      className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 text-center shadow-[0_4px_0_#E5E5E5] hover:border-[#1899D6] hover:shadow-[0_4px_0_#84D8FF] active:translate-y-[4px] active:shadow-none transition-all flex flex-col items-center justify-between h-[150px]"
                    >
                      <span className="text-3xl font-black text-[#1A1A18] tracking-tight">{item.letter}</span>
                      <span className="text-xs font-black text-[#1899D6] bg-[#E8F4FD] px-2.5 py-0.5 rounded-full border border-blue-100">{item.ipa}</span>
                      <div className="text-[10px] text-[#777777] font-bold leading-tight">
                        <p className="text-[#1A1A18] font-black">{item.word}</p>
                        <p className="text-[8px] mt-0.5">{item.vn}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BẢNG XẾP HẠNG TAB (Trophy Leaderboard View) */}
            {activeTab === "leaderboard" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Bảng Thi Đua Học Tập Tuần Tuần 🛡️
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Học tập tích cực, duy trì Streak và tích lũy thật nhiều KN để đứng đầu bảng vàng vinh danh cùng bạn bè cả nước nhé!
                  </p>
                </div>

                {/* Podium Top 3 display */}
                <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-6 md:p-8 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-end justify-center gap-6 md:gap-10 pb-10">
                  {/* Rank 2 */}
                  <div className="flex flex-col items-center text-center order-2 md:order-1 mt-6 md:mt-0 flex-1 max-w-[150px] w-full">
                    <div className="text-3xl mb-1">🥈</div>
                    <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-200 text-2xl flex items-center justify-center shadow-inner relative z-10">👦</div>
                    {/* 3D block platform */}
                    <div className="w-full bg-gradient-to-t from-slate-200 to-slate-100 border border-slate-300 rounded-t-xl h-16 mt-2 flex flex-col items-center justify-center shadow-md relative">
                      <span className="font-black text-[11px] text-slate-800 truncate px-2 w-full mt-1">Đức Nam</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase mt-0.5">1,220 XP</span>
                    </div>
                  </div>

                  {/* Rank 1 */}
                  <div className="flex flex-col items-center text-center order-1 md:order-2 flex-1 max-w-[160px] w-full">
                    <div className="text-4xl mb-1 select-none animate-bounce">👑 🥇</div>
                    <div className="w-18 h-18 rounded-full bg-amber-50 border-4 border-amber-400 text-3xl flex items-center justify-center shadow-md relative z-10">
                      <span>👧</span>
                      <span className="absolute -top-2 -right-2 text-base animate-pulse">✨</span>
                    </div>
                    {/* 3D block platform - highest */}
                    <div className="w-full bg-gradient-to-t from-amber-200 to-amber-100 border border-amber-300 rounded-t-xl h-24 mt-2 flex flex-col items-center justify-center shadow-lg relative">
                      <span className="font-black text-xs text-amber-900 truncate px-2 w-full mt-1">Minh Anh</span>
                      <span className="text-[9.5px] font-black text-amber-700 uppercase mt-0.5">1,450 XP</span>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex flex-col items-center text-center order-3 flex-1 max-w-[150px] w-full">
                    <div className="text-3xl mb-1">🥉</div>
                    <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-200 text-2xl flex items-center justify-center shadow-inner relative z-10">👩</div>
                    {/* 3D block platform - lowest */}
                    <div className="w-full bg-gradient-to-t from-amber-100/50 to-slate-100 border border-slate-200 rounded-t-xl h-10 mt-2 flex flex-col items-center justify-center shadow-sm relative">
                      <span className="font-black text-[11px] text-slate-800 truncate px-2 w-full mt-1">Thu Thảo</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase mt-0.5">980 XP</span>
                    </div>
                  </div>
                </div>

                {/* Ranking list rows */}
                <div className="bg-white border-2 border-[#E5E5E5] rounded-[2rem] shadow-[0_4px_0_#E5E5E5] p-2 space-y-1">
                  {[
                    { rank: 1, name: "Nguyễn Minh Anh", xp: 1450, avatar: "👧", badge: "🥇", isCurrentUser: false },
                    { rank: 2, name: "Trần Đức Nam", xp: 1220, avatar: "👦", badge: "🥈", isCurrentUser: false },
                    { rank: 3, name: "Lê Thu Thảo", xp: 980, avatar: "👩", badge: "🥉", isCurrentUser: false },
                    { rank: 4, name: profile?.full_name || "Học viên (Em)", xp: 850, avatar: "⚡", badge: "⭐", isCurrentUser: true },
                    { rank: 5, name: "Phạm Hoàng Long", xp: 720, avatar: "🦁", badge: "", isCurrentUser: false },
                    { rank: 6, name: "Vũ Khánh Huyền", xp: 640, avatar: "🐱", badge: "", isCurrentUser: false },
                  ].map((row) => (
                    <div 
                      key={row.rank}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        row.isCurrentUser 
                          ? "border-[#1899D6] bg-[#E8F4FD] shadow-[0_2px_0_#84D8FF]" 
                          : "border-transparent hover:bg-slate-50 text-[#3D3D3B]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm w-6 text-center text-[#777777]">#{row.rank}</span>
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-inner select-none">
                          {row.avatar}
                        </div>
                        <div>
                          <p className={`text-xs font-black truncate max-w-full ${row.isCurrentUser ? "text-[#1899D6]" : "text-[#1A1A18]"}`}>
                            {row.name} {row.isCurrentUser && <span className="text-[9px] font-black uppercase text-[#B45309] bg-[#FFF3E0] px-1.5 py-0.5 rounded ml-1 border border-[#FFE0B2]">Bạn</span>}
                          </p>
                          <p className="text-[10px] text-[#777777] font-semibold mt-0.5">Học sinh tích cực</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.badge && <span className="text-base select-none">{row.badge}</span>}
                        <span className="text-xs font-black text-[#1A1A18] tracking-tight">{row.xp} KN</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NHIỆM VỤ TAB (Daily Quests checklist) */}
            {activeTab === "quests" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Nhiệm Vụ Hàng Ngày ⚡
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Hoàn thành các nhiệm vụ bên dưới để tích lũy điểm kinh nghiệm và mở khóa Rương báu vật Hoàng gia cực lớn!
                  </p>
                </div>

                {/* Progress bar and chest card */}
                <div className="bg-white/90 backdrop-blur-md border border-slate-250 p-6 md:p-8 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.02)] space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-[#1A1A18]">Rương Đá Quý Hàng Ngày</h4>
                      <p className="text-xs text-[#777777] font-semibold">Hoàn thành thêm 2 nhiệm vụ nữa để mở khóa rương!</p>
                    </div>
                    {/* Animated shaking treasure chest using Framer Motion */}
                    <motion.div 
                      whileHover={{ 
                        rotate: [0, -6, 6, -6, 6, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl select-none cursor-pointer"
                    >
                      🎁 🔒
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-[#3D3D3B]">
                      <span>Tiến độ mở khóa</span>
                      <span>1 / 3 Nhiệm vụ</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-[#E5E5E5] h-5 rounded-full relative overflow-hidden flex items-center pr-1 border border-slate-200">
                      <div className="bg-[#58CC02] h-full rounded-full transition-all duration-500 shadow-inner" style={{ width: "33%" }} />
                      <span className="absolute right-3 text-xs select-none">💎 50</span>
                    </div>
                  </div>
                </div>

                {/* Quest checklist cards */}
                <div className="space-y-4">
                  {[
                    { id: 1, title: "Tích lũy 10 KN học tập", desc: "Hoàn thành các bài luyện nghe chép hoặc luyện phát âm nói.", xp: 30, progress: "0 / 10 KN", percent: 0, done: false },
                    { id: 2, title: "Luyện phát âm chuẩn 5 câu thoại SGK", desc: "Sử dụng tính năng luyện phát âm nói AI đạt độ chính xác trên 75%.", xp: 50, progress: "2 / 5 câu", percent: 40, done: false },
                    { id: 3, title: "Duy trì Chuỗi học Streak 3 ngày", desc: "Vào học bài SGK liên tiếp 3 ngày để tăng bền vững phản xạ tiếng Anh.", xp: 100, progress: "3 / 3 ngày", percent: 100, done: true },
                  ].map((quest) => (
                    <div 
                      key={quest.id}
                      className={`bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_4px_0_#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-slate-300 ${
                        quest.done ? "bg-slate-50/50 opacity-90" : ""
                      }`}
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            quest.done 
                              ? "bg-[#E8F9EE] text-[#58CC02] border border-[#B3F2C9]" 
                              : "bg-[#FFF8E7] text-[#B45309] border border-[#FFE0B2]"
                          }`}>
                            {quest.done ? "Hoàn thành! 🎉" : "Đang thực hiện"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase">• Thưởng +{quest.xp} KN</span>
                        </div>
                        <h4 className={`text-sm font-black text-[#1A1A18] ${quest.done ? "line-through text-slate-400" : ""}`}>{quest.title}</h4>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed">{quest.desc}</p>
                        
                        {/* Progress slider */}
                        <div className="w-full max-w-sm pt-2">
                          <div className="flex items-center justify-between text-[9px] font-black text-[#777777] mb-1">
                            <span>Tiến trình</span>
                            <span>{quest.progress}</span>
                          </div>
                          <div className="w-full bg-[#E5E5E5] h-2 rounded-full overflow-hidden border border-slate-100">
                            <div className="bg-[#1899D6] h-full rounded-full transition-all" style={{ width: `${quest.percent}%` }} />
                          </div>
                        </div>
                      </div>

                      <button 
                        disabled={quest.done}
                        className={`px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer select-none ${
                          quest.done
                            ? "bg-slate-100 text-slate-400 border border-slate-200 shadow-none pointer-events-none"
                            : "bg-[#58CC02] text-white border-none shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-none"
                        }`}
                      >
                        {quest.done ? "Đã nhận quà" : "Bắt đầu ngay"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. HỒ SƠ TAB (Student profile & billing dashboard) */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Hồ Sơ Học Viên & Thống Kê 🎓
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Cá nhân hóa tài khoản học tập, xem chi tiết các chứng chỉ và cấu hình nâng cấp gói thành viên PRO của em.
                  </p>
                </div>

                {/* Profile Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left avatar card */}
                  <div className="bg-white border-2 border-[#E5E5E5] rounded-[2rem] shadow-[0_4px_0_#E5E5E5] p-6 text-center space-y-4 md:col-span-1">
                    <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-[#84D8FF] text-5xl flex items-center justify-center shadow-inner mx-auto select-none">
                      {profile?.full_name ? profile.full_name.charAt(0) : "⚡"}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#1A1A18] tracking-tight">{profile?.full_name || "Học viên"}</h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">{profile?.email || "student@global.edu"}</p>
                    </div>

                    <div className="pt-2">
                      {profile?.subscription_plan === "pro" ? (
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl px-4 py-2 text-xs font-black uppercase flex items-center justify-center gap-1 shadow-md animate-pulse">
                          <Sparkles size={12} fill="white" />
                          PRO MEMBER
                        </div>
                      ) : (
                        <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-2 text-xs font-black uppercase border border-slate-200">
                          FREE STUDENT
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2.5 bg-[#F7F7F7] border-2 border-[#E5E5E5] hover:bg-slate-50 text-xs font-black text-[#3D3D3B] rounded-xl transition-all shadow-[0_2px_0_#E5E5E5] active:translate-y-[2px] active:shadow-none cursor-pointer">
                      Thay ảnh đại diện
                    </button>
                  </div>

                  {/* Right stats dashboard */}
                  <div className="bg-white border-2 border-[#E5E5E5] rounded-[2rem] shadow-[0_4px_0_#E5E5E5] p-6 space-y-6 md:col-span-2">
                    <h4 className="text-base font-black text-[#1A1A18] border-b-2 border-slate-50 pb-2">Bảng Chỉ Số Học Tập</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Tổng điểm tích lũy</p>
                        <p className="text-2xl font-black text-[#1A1A18] mt-1">850 KN</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Chuỗi hoạt động</p>
                        <p className="text-2xl font-black text-[#FF9600] mt-1 flex items-center gap-1">
                          <Flame size={20} fill="#FF9600" className="text-[#FF9600]" />
                          {profile?.streak || 0} Ngày
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Đá quý tích lũy</p>
                        <p className="text-2xl font-black text-[#1CB0F6] mt-1">💎 {profile?.gems || 500}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Sinh mệnh hiện có</p>
                        <p className="text-2xl font-black text-[#FF4B4B] mt-1">❤️ {profile?.lives || 5}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 py-3 bg-[#1899D6] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_0_#1482B5] active:translate-y-[4px] active:shadow-none cursor-pointer">
                        Đổi mật khẩu
                      </button>
                      
                      {profile?.subscription_plan !== "pro" && (
                        <button 
                          onClick={() => window.location.href = "/#pricing"}
                          className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none cursor-pointer flex items-center justify-center gap-1 animate-bounce mt-2 sm:mt-0"
                        >
                          <Sparkles size={14} fill="white" />
                          Nâng cấp PRO ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* 3. CỘT PHẢI (Widgets Desktop) */}
          <aside className="hidden xl:flex flex-col gap-6 shrink-0 w-[360px]" ref={dropdownRef}>
            
            {/* Top Bar status metrics widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-5 rounded-3xl flex items-center justify-between shadow-[0_4px_0_#E5E5E5]">
              {/* Flag & grade switcher */}
              <div className="relative">
                <button
                  onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
                  className="flex items-center gap-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] px-3.5 py-1.5 rounded-2xl text-xs font-black text-[#1A1A18]"
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="uppercase font-black text-[10px] tracking-wider">LỚP 6</span>
                  <ChevronDown size={14} className="text-[#777777]" />
                </button>

                <AnimatePresence>
                  {gradeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 top-full w-56 bg-white border-2 border-[#E5E5E5] rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1"
                    >
                      {grades.map((grade) => (
                        <Link
                          key={grade.id}
                          href={`/learn/grade/${grade.id}`}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-[#3D3D3B] hover:bg-[#F7F7F7] flex items-center gap-2"
                          onClick={() => setGradeDropdownOpen(false)}
                        >
                          <span>🏫</span>
                          {grade.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status metrics */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[#FF9600] font-black text-xs select-none">
                  <Flame size={20} fill="#FF9600" className="text-[#FF9600]" /> 
                  {profile?.streak || 0}
                </div>
                <div className="flex items-center gap-1.5 text-[#1CB0F6] font-black text-xs select-none">
                  💎 {profile?.gems || 500}
                </div>
                <div className="flex items-center gap-1.5 text-[#FF4B4B] font-black text-xs select-none">
                  ❤️ {profile?.lives || 5}
                </div>
              </div>
            </div>

            {/* Padlocked Leaderboard widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-4">
              <h4 className="text-base font-black text-[#1A1A18]">Bảng xếp hạng tuần!</h4>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 bg-[#E8F4FD] border-2 border-[#B4DDF7] rounded-2xl flex items-center justify-center text-4xl shadow-inner select-none">
                  🛡️
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#1A1A18] font-black">Chưa xếp hạng</p>
                  <p className="text-[10px] text-[#777777] font-semibold leading-relaxed">
                    Hoàn thành thêm 3 bài học nữa để mở khóa bảng thi đua tuần và so tài cùng bạn bè nhé!
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Quests widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-[#1A1A18] flex items-center gap-1.5">
                  <Zap size={18} fill="#FF9600" className="text-[#FF9600]" />
                  Nhiệm vụ hằng ngày
                </h4>
                <a href="#" className="text-[10px] font-black text-[#1899D6] uppercase tracking-wider hover:underline">Xem tất cả</a>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-[#3D3D3B]">
                    <span>Kiếm 10 KN học tập</span>
                    <span className="text-[#777777]">0 / 10 KN</span>
                  </div>
                  
                  {/* Lightning progress bar */}
                  <div className="w-full bg-[#E5E5E5] h-4 rounded-full relative overflow-hidden flex items-center pr-1">
                    <div className="bg-[#FF9600] h-full rounded-full" style={{ width: "0%" }} />
                    <span className="absolute right-2 text-xs">🎁</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Login / Create profile widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-4">
              <h4 className="text-base font-black text-[#1A1A18]">Lưu lại tiến trình của em!</h4>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                Tạo một tài khoản Cinematic English miễn phí để lưu trữ mọi chứng chỉ, lịch sử và điểm số nhé!
              </p>
              
              <div className="space-y-3 pt-2">
                <Link 
                  href="/signup" 
                  className="w-full py-3.5 bg-[#58CC02] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block"
                >
                  Tạo hồ sơ miễn phí
                </Link>
                <Link 
                  href="/login" 
                  className="w-full py-3.5 bg-[#1899D6] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#1482B5] hover:brightness-105 active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block mt-3"
                >
                  Đăng nhập học ngay
                </Link>
              </div>
            </div>

            {/* Gamified Footer Links */}
            <footer className="px-4 text-[10px] text-[#AFAFAF] font-black uppercase tracking-wider flex flex-wrap gap-x-4 gap-y-2 justify-center leading-relaxed">
              <a href="#" className="hover:text-[#777777]">Giới thiệu</a>
              <a href="#" className="hover:text-[#777777]">Cửa hàng</a>
              <a href="#" className="hover:text-[#777777]">Hiệu quả</a>
              <a href="#" className="hover:text-[#777777]">Công việc</a>
              <a href="#" className="hover:text-[#777777]">Điều khoản</a>
              <a href="#" className="hover:text-[#777777]">Bảo mật</a>
            </footer>
          </aside>
        </div>
      </div>
    </div>
  );
}

