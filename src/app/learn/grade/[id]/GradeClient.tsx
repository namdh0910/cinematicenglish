"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Home,
  Globe,
  Trophy,
  Target,
  ShoppingBag,
  User,
  Flame,
  Zap,
  ChevronDown,
  Award,
  Play,
  BookOpen,
  Music,
  Mic,
  FileText,
  Sparkles,
  Video,
  Lock,
  Check,
  Gift,
  LogOut,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Lesson {
  id: string;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language' | 'Getting Started' | 'Exam';
  order_index: number;
}

interface Unit {
  id: string;
  title: string;
  description: string;
  order_index: number;
  cover_url?: string;
  lessons: Lesson[];
}

interface Semester {
  id: string;
  title: string;
  order_index: number;
  units: Unit[];
}

interface GradeClientProps {
  grade: {
    id: string;
    title: string;
    description: string;
    semesters: Semester[];
  };
}

export default function GradeClient({ grade }: GradeClientProps) {
  const router = useRouter();
  const [activeSemester, setActiveSemester] = useState<string>(
    grade.semesters.length > 0 ? grade.semesters.sort((a,b) => a.order_index - b.order_index)[0].id : ""
  );
  const [profile, setProfile] = useState<any>(null);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfileAndProgress = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Fetch profile
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (userProfile) {
            setProfile(userProfile);
          }

          // Fetch completed lessons from lesson_progress
          const { data: progressData } = await supabase
            .from("lesson_progress")
            .select("lesson_id")
            .eq("user_id", session.user.id)
            .eq("is_completed", true);
          
          if (progressData) {
            const completedSet = new Set<string>(progressData.map((p: any) => p.lesson_id));
            setCompletedLessonIds(completedSet);
          }
        }
      } catch (err) {
        console.error("Error fetching profile and progress in GradeClient:", err);
      }
    };
    fetchProfileAndProgress();
  }, []);

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

  const getLessonIconEmoji = (type: Lesson['type']) => {
    switch (type) {
      case 'Listening': return '🎧';
      case 'Speaking': return '🗣️';
      case 'Reading': return '📚';
      case 'Writing': return '✍️';
      case 'Language': return '🧠';
      case 'Getting Started': return '🚀';
      case 'Exam': return '🏆';
      default: return '📝';
    }
  };

  const getLessonTypeLabel = (type: Lesson['type']) => {
    switch (type) {
      case 'Listening': return 'Luyện nghe';
      case 'Speaking': return 'Luyện nói';
      case 'Reading': return 'Luyện đọc';
      case 'Writing': return 'Luyện viết';
      case 'Language': return 'Ngữ pháp & Từ vựng';
      case 'Getting Started': return 'Khởi động';
      case 'Exam': return 'Bài kiểm tra';
      default: return type;
    }
  };

  // Semester sorting
  const sortedSemesters = [...grade.semesters].sort((a,b) => a.order_index - b.order_index);
  const selectedSemester = sortedSemesters.find(s => s.id === activeSemester);
  const sortedUnits = selectedSemester ? [...selectedSemester.units].sort((a,b) => a.order_index - b.order_index) : [];

  // Duolingo Snake Winding horizontal coordinates classes
  const windingPositions = [
    "translate-x-0",        // Center
    "translate-x-7 md:translate-x-12",   // Right
    "translate-x-12 md:translate-x-20",  // Far Right
    "translate-x-7 md:translate-x-12",   // Right
    "translate-x-0",        // Center
    "-translate-x-7 md:-translate-x-12",  // Left
    "-translate-x-12 md:-translate-x-20", // Far Left
    "-translate-x-7 md:-translate-x-12",  // Left
  ];

  // Colors for each Unit theme (Premium Gradient Themes)
  const unitThemeColors = [
    { bg: "bg-gradient-to-r from-emerald-500 to-teal-600", border: "border-emerald-600", text: "text-white", accent: "text-emerald-500" }, // Emerald (Premium green)
    { bg: "bg-gradient-to-r from-blue-500 to-indigo-600", border: "border-blue-600", text: "text-white", accent: "text-blue-500" }, // Azure (Premium blue)
    { bg: "bg-gradient-to-r from-purple-500 to-violet-600", border: "border-purple-600", text: "text-white", accent: "text-purple-500" }, // Royal (Premium purple)
    { bg: "bg-gradient-to-r from-amber-500 to-orange-600", border: "border-amber-600", text: "text-white", accent: "text-amber-500" }  // Amber (Premium gold)
  ];

  return (
    <div className="bg-[#F8FAFC] bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2F6] min-h-screen text-[#3D3D3B] flex flex-col w-full font-sans relative overflow-hidden">
      {/* Background glassmorphic glow elements */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-[400px] h-[400px] rounded-full bg-emerald-400/5 blur-[150px] pointer-events-none" />

      {/* Dynamic Top Navbar for mobile (automatically responsive) */}
      <Navbar />

      {/* 2. RESPONSIVE APP SHELL WRAPPER */}
      <div className="flex-1 flex flex-col items-center w-full min-h-screen relative z-10">
        {/* 3-COLUMN MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
          
          {/* CỘT GIỮA (Lộ trình bài học cuộn rắn uốn lượn) */}
          <main className="space-y-6 min-w-0">
            {/* Header Breadcrumbs */}
            <div className="flex items-center justify-between">
              <Link 
                href="/learn" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-wider bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/50 shadow-sm"
              >
                <ChevronLeft size={14} /> Quay lại màn hình lớp học
              </Link>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{grade.title}</h1>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xl">{grade.description}</p>
            </div>

            {/* Semester Tabs Switcher (Premium glass pill tabs) */}
            <div className="flex border-b border-slate-200/60 pb-3 gap-2 overflow-x-auto no-scrollbar">
              {sortedSemesters.map((semester) => (
                <button
                  key={semester.id}
                  onClick={() => setActiveSemester(semester.id)}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-xl cursor-pointer ${
                    activeSemester === semester.id 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200/50" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  {semester.title}
                </button>
              ))}
            </div>

            {/* MAIN DYNAMIC LESSON WINDING SNAKE TRAIL */}
            <div className="flex flex-col items-center py-6 w-full max-w-lg mx-auto relative">
              {sortedUnits.length > 0 ? (
                sortedUnits.map((unit, unitIdx) => {
                  const theme = unitThemeColors[unitIdx % unitThemeColors.length];
                  
                  return (
                    <div key={unit.id} className="w-full flex flex-col items-center">
                      
                      {/* Unit Milestone Header Banner (Glassmorphic Container with Ambient Glow) */}
                      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 p-5 rounded-[2.2rem] relative overflow-hidden flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-b-4 border-b-slate-200/80 my-8">
                        {/* Dynamic ambient color glow inside card */}
                        <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full ${theme.bg} opacity-15 blur-2xl pointer-events-none`} />
                        
                        <div className="space-y-1.5 z-10 pr-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${theme.bg} ${theme.text} border border-white/20`}>
                            Chuyên đề {unit.order_index}
                          </span>
                          <h2 className="text-base font-black text-slate-800 leading-snug">{unit.title}</h2>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold line-clamp-1 italic">
                            {unit.description || "Bài tập tương tác chuẩn SGK phổ thông."}
                          </p>
                        </div>
                        
                        {/* 3D guide button */}
                        <button className={`px-4 py-2 ${theme.bg} ${theme.text} text-xs font-black rounded-xl shadow-md border-b-4 ${theme.border} active:border-b-0 active:translate-y-[4px] hover:brightness-105 active:shadow-none transition-all whitespace-nowrap z-10 cursor-pointer shrink-0 border-none`}>
                          📖 HƯỚNG DẪN
                        </button>
                      </div>
 
                      {/* Render lessons of this unit in a snake winding line */}
                      <div className="flex flex-col items-center py-4 w-full relative">
                        {unit.lessons && unit.lessons.length > 0 ? (
                          [...unit.lessons]
                            .sort((a,b) => a.order_index - b.order_index)
                            .map((lesson, lessonIdx) => {
                              // Winding offset index calculation
                              const windClass = windingPositions[lessonIdx % windingPositions.length];
                              
                              // Dynamic progress state calculation
                              const sortedLessons = [...unit.lessons].sort((a, b) => a.order_index - b.order_index);
                              const isCompleted = completedLessonIds.has(lesson.id);
                              
                              let status: 'completed' | 'active' | 'locked' = 'locked';
                              if (isCompleted) {
                                status = 'completed';
                              } else {
                                const isFirstLesson = lessonIdx === 0;
                                const isPrevCompleted = !isFirstLesson && completedLessonIds.has(sortedLessons[lessonIdx - 1]?.id);
                                if (isFirstLesson || isPrevCompleted) {
                                  status = 'active';
                                } else {
                                  status = 'locked';
                                }
                              }
 
                              return (
                                <div 
                                  key={lesson.id}
                                  className={`flex flex-col items-center relative my-5 select-none ${windClass}`}
                                >
                                  {/* Connective line underneath the node button - Glowing neon style */}
                                  {lessonIdx < unit.lessons.length - 1 && (
                                    <div className={`w-3 h-16 absolute top-[72px] left-1/2 -translate-x-1/2 -z-10 rounded-full transition-all ${
                                      status === 'completed' 
                                        ? 'bg-gradient-to-b from-[#10B981] to-[#6366F1] shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                                        : 'bg-gradient-to-b from-slate-200 to-slate-200'
                                    }`} />
                                  )}
 
                                  {/* Speech Bubble Tooltip for active next lesson - Premium look */}
                                  {status === 'active' && (
                                    <div className="absolute -top-12 left-1/2 -translate-y-1 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-200/40 uppercase tracking-widest animate-bounce z-20 whitespace-nowrap border border-emerald-400/40">
                                      BẮT ĐẦU
                                      {/* Tooltip pointer triangle */}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-teal-500" />
                                    </div>
                                  )}
 
                                  {/* Mascot waving next to the active node - Sleek floating glass panel */}
                                  {status === 'active' && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                                      transition={{ 
                                        y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                                        default: { duration: 0.3 }
                                      }}
                                      className={`absolute top-0 w-28 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-xl hidden md:flex flex-col items-center text-center gap-1 z-10 select-none ${
                                        lessonIdx % 2 === 0 ? '-right-36' : '-left-36'
                                      }`}
                                    >
                                      <span className="text-3xl animate-bounce">🦉</span>
                                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Học tiếp nhé!</span>
                                      <div className="text-[8.5px] font-bold text-slate-400 leading-normal">
                                        Duo Owl khuyên em hoàn thành bài tập này!
                                      </div>
                                    </motion.div>
                                  )}
 
                                  {/* Winding 3D Circle Node Button - Premium Tactile Glass Beads */}
                                  {status === 'completed' ? (
                                    <button
                                      onClick={() => setSelectedLesson(lesson)}
                                      className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border border-yellow-200 shadow-[0_6px_0_#C27E00] text-white flex items-center justify-center active:translate-y-[4px] active:shadow-[0_2px_0_#C27E00] transition-all cursor-pointer hover:brightness-105 select-none relative z-10"
                                    >
                                      <Award size={36} fill="white" />
                                    </button>
                                  ) : status === 'active' ? (
                                    <div className="relative z-10">
                                      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md scale-125 animate-pulse -z-10" />
                                      <button
                                        onClick={() => setSelectedLesson(lesson)}
                                        className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-emerald-400 to-green-500 border border-green-300 shadow-[0_6px_0_#047857] text-white flex items-center justify-center active:translate-y-[4px] active:shadow-[0_2px_0_#047857] transition-all cursor-pointer hover:brightness-105 select-none"
                                      >
                                        <Play size={28} fill="white" className="ml-1" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="w-[72px] h-[72px] rounded-full bg-slate-200/60 backdrop-blur-sm border-2 border-slate-300/40 text-slate-400 flex items-center justify-center cursor-not-allowed select-none shadow-[0_4px_0_#CBD5E1]"
                                      onClick={() => alert("Bài học này đã bị khóa! Em hãy hoàn thành các bài học trước để mở khóa nhé 🔒")}
                                    >
                                      <Lock size={22} />
                                    </button>
                                  )}
 
                                  {/* Lesson brief indicator text */}
                                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider mt-2.5 whitespace-nowrap max-w-[120px] truncate text-center">
                                    {lesson.title}
                                  </span>
                                </div>
                              );
                            })
                        ) : (
                          <div className="py-6 text-center text-xs text-[#777777] font-semibold italic">
                            Chưa có bài học nào trong chuyên đề này.
                          </div>
                        )}
 
                        {/* Treasure Chest milestone box at the end of each unit path */}
                        <div className="flex flex-col items-center mt-8 relative translate-y-2 select-none">
                          <motion.div 
                            whileHover={{ rotate: [-3, 3, -3, 3, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            onClick={() => {
                              alert("🎉 Chúc mừng em! Hãy hoàn thành toàn bộ chuyên đề để mở rương báu nhận 100 Kim Cương quý giá nhé! 💎");
                            }}
                            className="w-20 h-20 rounded-[2.2rem] bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border border-yellow-200 flex items-center justify-center text-4xl shadow-[0_8px_0_#D97706] cursor-pointer hover:brightness-105 active:translate-y-[6px] active:shadow-none transition-all"
                          >
                            🎁
                          </motion.div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3.5">
                            Mốc quà thưởng
                          </span>
                        </div>
 
                      </div>
 
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center rounded-[32px] border border-dashed border-slate-300 text-slate-400 text-xs font-semibold italic max-w-sm w-full bg-white shadow-sm">
                  Không tìm thấy chuyên đề nào cho Học kỳ này.
                </div>
              )}
            </div>
          </main>

          {/* 3. CỘT PHẢI (Widgets Desktop) */}
          <aside className="hidden xl:flex flex-col gap-6 shrink-0 w-[360px]" ref={dropdownRef}>
            
            {/* Top Bar status metrics widget */}
            <div className="bg-white/75 backdrop-blur-xl border border-white/30 p-5 rounded-[2rem] flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.02)] border-b-4 border-b-slate-200/80">
              {/* Flag & grade switcher */}
              <div className="relative">
                <button
                  onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
                  className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-800 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="uppercase font-black text-[10px] tracking-wider">{grade.title.substring(0, 10)}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
 
                <AnimatePresence>
                  {gradeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 top-full w-56 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1"
                    >
                      <Link
                        href="/learn"
                        className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                        onClick={() => setGradeDropdownOpen(false)}
                      >
                        <span>🏫</span>
                        Xem tất cả các lớp
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
 
              {/* Status metrics */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs select-none">
                  <Flame size={20} fill="#F59E0B" className="text-amber-500" /> 
                  {profile?.streak || 0}
                </div>
                <div className="flex items-center gap-1.5 text-[#1CB0F6] font-black text-xs select-none">
                  💎 {profile?.gems || 500}
                </div>
                <div className="flex items-center gap-1.5 text-rose-500 font-black text-xs select-none">
                  ❤️ {profile?.lives || 5}
                </div>
              </div>
            </div>
 
            {/* Padlocked Leaderboard widget */}
            <div className="bg-white/75 backdrop-blur-xl border border-white/30 p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.02)] border-b-4 border-b-slate-200/80 space-y-4">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Bảng xếp hạng tuần!</h4>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner select-none">
                  🛡️
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-800 font-black">Chưa xếp hạng</p>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Hoàn thành thêm 3 bài học nữa để mở khóa bảng thi đua tuần và so tài cùng bạn bè nhé!
                  </p>
                </div>
              </div>
            </div>
 
            {/* Daily Quests widget */}
            <div className="bg-white/75 backdrop-blur-xl border border-white/30 p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.02)] border-b-4 border-b-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={18} fill="#FF9600" className="text-amber-500" />
                  Nhiệm vụ hằng ngày
                </h4>
                <a href="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-wider hover:underline">Xem tất cả</a>
              </div>
 
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600">
                    <span>Kiếm 10 KN học tập</span>
                    <span className="text-slate-400">0 / 10 KN</span>
                  </div>
                  
                  {/* Lightning progress bar */}
                  <div className="w-full bg-slate-200 h-4 rounded-full relative overflow-hidden flex items-center pr-1">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full" style={{ width: "0%" }} />
                    <span className="absolute right-2 text-xs">🎁</span>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Gamified Footer Links */}
            <footer className="px-4 text-[10px] text-slate-400 font-black uppercase tracking-wider flex flex-wrap gap-x-4 gap-y-2 justify-center leading-relaxed">
              <a href="#" className="hover:text-slate-600">Giới thiệu</a>
              <a href="#" className="hover:text-slate-600">Cửa hàng</a>
              <a href="#" className="hover:text-slate-600">Hiệu quả</a>
              <a href="#" className="hover:text-slate-600">Công việc</a>
              <a href="#" className="hover:text-slate-600">Điều khoản</a>
              <a href="#" className="hover:text-slate-600">Bảo mật</a>
            </footer>
          </aside>
        </div>
      </div>
 
      {/* 5. GORGEOUS POPUP MODAL ON NODE CLICK (PrepEdu Glass style Popover) */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.15)] max-w-sm w-full text-center relative border-b-[8px] border-b-slate-300"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedLesson(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
 
              {/* Header Emoji bubble */}
              <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-4xl shadow-inner mx-auto mb-4 select-none animate-bounce">
                {getLessonIconEmoji(selectedLesson.type)}
              </div>
 
              {/* Lesson details */}
              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full">
                  {getLessonTypeLabel(selectedLesson.type)}
                </span>
                <h3 className="text-xl font-black text-slate-850 tracking-tight mt-2.5">{selectedLesson.title}</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed px-4">
                  Chinh phục bài tập tương tác chuẩn Cinematic để tích lũy XP học tập nhé!
                </p>
                
                {/* Rewards Indicator */}
                <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-black uppercase text-amber-500">
                  <span>🎁 Thưởng +10 XP</span>
                  <span className="text-cyan-500">💎 +5 Kim cương</span>
                </div>
              </div>
 
              {/* CTA 3D Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/learn/lesson/${selectedLesson.id}`}
                  onClick={() => setSelectedLesson(null)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_5px_0_#047857] hover:brightness-105 active:translate-y-[5px] active:shadow-none transition-all cursor-pointer text-center block border-none"
                >
                  BẮT ĐẦU HỌC (+10 XP)
                </Link>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="w-full py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_#E2E8F0] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block"
                >
                  Bỏ qua
                </button>
              </div>
 
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

