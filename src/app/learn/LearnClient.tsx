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
import { useRouter } from "next/navigation";
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
    { label: "Độ chính xác Nghe", value: "87%", emoji: "🗣️", color: "bg-[#E8F4FD]", trend: "+3.2% tuần này", trendColor: "text-[#1899D6]" },
    { label: "Độ tự tin Nói", value: "78%", emoji: "💬", color: "bg-[#E8F9EE]", trend: "+5.1% tuần này", trendColor: "text-[#58CC02]" },
    { label: "Từ vựng làm chủ", value: "92%", emoji: "📚", color: "bg-[#FFF8E7]", trend: "140 từ mới học", trendColor: "text-[#F59E0B]" },
    { label: "Sẵn sàng làm bài thi", value: "84%", emoji: "🏆", color: "bg-[#F2EDFC]", trend: "Chuẩn Global Success", trendColor: "text-[#8B5CF6]" }
  ];

  // Adaptive recommended missions
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
    <div className="bg-[#FFFFFF] lg:bg-[#F8FAFC] min-h-screen text-[#3D3D3B] flex font-sans">
      {/* Dynamic Top Navbar for mobile (automatically responsive) */}
      <Navbar />

      {/* 1. LEFT SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden lg:flex flex-col w-[256px] h-screen sticky top-0 bg-[#FFFFFF] border-r-2 border-[#E5E5E5] px-4 py-8 justify-between shrink-0 z-30">
        <div className="space-y-10">
          {/* Brand Logo with 3D button effect */}
          <Link href="/" className="flex items-center gap-3 px-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1899D6] shadow-[0_4px_0_#1482B5] active:translate-y-[4px] active:shadow-none transition-all">
              <Play size={16} fill="white" className="ml-0.5 text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-[#1A1A18]">Cinematic</span>
          </Link>

          {/* Navigation Links with Duolingo style active state */}
          <nav className="flex flex-col gap-2.5">
            {[
              { label: "HỌC", href: "/learn", icon: Home, active: true },
              { label: "CHỮ CÁI", href: "/learn", icon: Globe },
              { label: "BẢNG XẾP HẠNG", href: "/learn", icon: Trophy },
              { label: "NHIỆM VỤ", href: "/learn", icon: Target },
              { label: "CỬA HÀNG", href: "/#pricing", icon: ShoppingBag },
              { label: "HỒ SƠ", href: "/learn", icon: User },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  link.active
                    ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] shadow-[0_2px_0_#84D8FF]"
                    : "border-transparent text-[#777777] hover:bg-[#F7F7F7] hover:text-[#4B4B4B]"
                }`}
              >
                <link.icon size={20} className={link.active ? "text-[#1899D6]" : "text-[#777777]"} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User quick profile & logout */}
        <div className="border-t-2 border-[#E5E5E5] pt-6 px-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-100 text-[#3B82F6] flex items-center justify-center text-sm font-black uppercase shadow-sm">
                {profile?.full_name ? profile.full_name.charAt(0) : "H"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-[#1A1A18] truncate leading-none mb-1">
                {profile?.full_name || "Học viên"}
              </p>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#B45309] bg-[#FFF3E0] px-2 py-0.5 rounded-full border border-[#FFE0B2]">
                {profile?.subscription_plan === "pro" ? "PRO MEMBER" : "FREE PLAN"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-colors text-xs font-black uppercase tracking-wider text-center"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* 2. RESPONSIVE APP SHELL WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top status bar header */}
        <header className="lg:hidden flex items-center justify-between h-14 bg-white border-b-2 border-[#E5E5E5] px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <button 
              onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
              className="flex items-center gap-1 bg-[#F7F7F7] border-2 border-[#E5E5E5] px-2.5 py-1 rounded-xl text-xs font-black text-[#1A1A18]"
            >
              <span>🇺🇸</span>
              <span className="uppercase font-extrabold text-[10px]">Lớp 6</span>
              <ChevronDown size={12} className="text-[#777777]" />
            </button>

            {/* Mobile Grade Dropdown */}
            <AnimatePresence>
              {gradeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2 top-full w-48 bg-white border-2 border-[#E5E5E5] rounded-2xl p-2 shadow-xl z-50 flex flex-col gap-1"
                >
                  {grades.map((grade) => (
                    <Link
                      key={grade.id}
                      href={`/learn/grade/${grade.id}`}
                      className="px-3 py-2 rounded-xl text-xs font-extrabold text-[#3D3D3B] hover:bg-[#F7F7F7] flex items-center gap-2"
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

          {/* Gamified quick stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#FF9600] font-black text-xs">
              <Flame size={18} fill="#FF9600" className="text-[#FF9600]" /> 
              {profile?.streak || 0}
            </div>
            <div className="flex items-center gap-1 text-[#1CB0F6] font-black text-xs">
              💎 {profile?.gems || 500}
            </div>
            <div className="flex items-center gap-1 text-[#FF4B4B] font-black text-xs">
              ❤️ {profile?.lives || 5}
            </div>
          </div>
        </header>

        {/* 3-COLUMN MAIN LAYOUT GRID */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full pb-24 lg:pb-8">
          
          {/* CỘT GIỮA (Lộ trình lớp học, Ma trận năng lực) */}
          <main className="space-y-10 min-w-0">
            {/* Header Greeting Banner */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_4px_0_#E5E5E5]">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                  Chào mừng, <span className="text-[#1899D6]">{profile?.full_name || "Học viên"}</span>! 👋
                </h1>
                <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                  Hôm nay em muốn chinh phục bài học nào? Hệ thống chuẩn giáo trình phổ thông.
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="w-full md:max-w-xs relative shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-[#3D3D3B] placeholder:text-[#999999] focus:outline-none focus:border-[#1899D6] transition-all"
                />
              </div>
            </div>

            {/* Student Stats Matrix */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                <TrendingUp size={14} className="text-[#1899D6]" /> MA TRẬN CHỈ SỐ NĂNG LỰC
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-6 rounded-[2rem] border-2 border-[#E5E5E5] flex flex-col justify-between shadow-[0_4px_0_#E5E5E5] hover:border-[#1899D6] hover:shadow-[0_4px_0_#84D8FF] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color} text-3xl shadow-inner`}>
                        {stat.emoji}
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md ${stat.trendColor}`}>
                        {stat.trend}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[#777777] font-extrabold text-xs mb-1 uppercase tracking-wider">{stat.label}</h4>
                      <div className="text-3xl font-black text-[#1A1A18] tracking-tight">{stat.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Recovery Missions */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                <Brain size={14} className="text-[#8B5CF6]" /> BÀI TẬP ÔN LUYỆN KHUYÊN DÙNG
              </h3>

              <div className="space-y-3">
                {recoveryMissions.map((rec) => (
                  <div 
                    key={rec.id}
                    className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 shadow-[0_4px_0_#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#1899D6] transition-all"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#F2EDFC] text-[#8B5CF6] border-2 border-[#E1D4FB] px-2.5 py-0.5 rounded-full">{rec.skill}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#777777]">• {rec.difficulty}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A1A18] leading-tight truncate">{rec.title}</h4>
                      <p className="text-[10px] text-[#FF9600] font-black italic">{rec.reason}</p>
                    </div>

                    <button 
                      onClick={() => window.location.href = `/learn/lesson/${rec.lessonId}`}
                      className="px-5 py-3 rounded-2xl bg-[#1899D6] text-white text-[10px] font-black uppercase tracking-widest shrink-0 self-start md:self-auto cursor-pointer border-none shadow-[0_4px_0_#1482B5] active:shadow-none active:translate-y-[4px] transition-all hover:brightness-105"
                    >
                      BẮT ĐẦU NGAY <ArrowRight size={12} className="inline ml-1" />
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
                  const isHigh = titleLower.includes("10") || titleLower.includes("11") || titleLower.includes("12");
                  
                  // Grade Color Codes
                  const barColor = isCinematic ? "#8B5CF6" : isHigh ? "#1899D6" : "#58CC02";
                  const shadowColor = isCinematic ? "shadow-[0_4px_0_#8B5CF6]" : isHigh ? "shadow-[0_4px_0_#1899D6]" : "shadow-[0_4px_0_#58CC02]";

                  // Dynamic Emojis
                  let emojiBg = "bg-[#E8F9EE]";
                  let emoji = "🏫";
                  
                  if (isCinematic) {
                    emojiBg = "bg-[#F2EDFC]";
                    emoji = "🎬";
                  } else if (isHigh) {
                    emojiBg = "bg-[#E8F4FD]";
                    emoji = "🎒";
                  }

                  return (
                    <motion.div
                      key={grade.id}
                      whileHover={{ y: -4 }}
                      className="group relative flex flex-col justify-between h-[230px] bg-white border-2 border-[#E5E5E5] rounded-[2.5rem] p-6 shadow-[0_4px_0_#E5E5E5] hover:border-slate-300 transition-all duration-300 overflow-hidden"
                    >
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${emojiBg} text-3xl shadow-inner`}>
                          {emoji}
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-[#E8F9EE] text-[#58CC02] border border-[#B3F2C9]">
                          ĐANG HỌC
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="mt-4 flex-1 flex flex-col justify-end">
                        <h4 className="text-lg font-black text-[#1A1A18] leading-tight group-hover:text-[#1899D6] transition-colors">{grade.title}</h4>
                        <p className="text-xs text-[#777777] font-semibold mt-1 leading-snug line-clamp-2">{grade.description}</p>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] text-[#777777] font-black uppercase tracking-wider flex items-center gap-1">
                            <BookOpen size={14} className="text-[#1899D6]" /> 12 CHUYÊN ĐỀ
                          </span>
                          
                          <Link 
                            href={`/learn/grade/${grade.id}`}
                            className={`px-4 py-2.5 rounded-2xl bg-white border-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 ${shadowColor} active:translate-y-[4px] active:shadow-none cursor-pointer`}
                            style={{ 
                              color: barColor, 
                              borderColor: barColor + "40"
                            }}
                          >
                            VÀO HỌC <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>

                      {/* Bottom decorative color bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-slate-100">
                        <div 
                          className="h-full rounded-r-full"
                          style={{ 
                            backgroundColor: barColor, 
                            width: "60%" 
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
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

        {/* 4. MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-[#E5E5E5] flex items-center justify-around z-40 shadow-lg">
          {[
            { label: "HỌC", href: "/learn", icon: Home, active: true },
            { label: "LUYỆN TẬP", href: "/learn", icon: Globe },
            { label: "XẾP HẠNG", href: "/learn", icon: Trophy },
            { label: "NHIỆM VỤ", href: "/learn", icon: Target },
            { label: "HỒ SƠ", href: "/learn", icon: User },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 ${
                link.active ? "text-[#1899D6]" : "text-[#777777]"
              }`}
            >
              <link.icon size={22} className={link.active ? "text-[#1899D6]" : "text-[#777777]"} />
              <span className="text-[9px] font-black tracking-wider uppercase">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

