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

  // Colors for each Unit theme
  const unitThemeColors = [
    { bg: "bg-[#58CC02]", border: "border-[#46A302]", text: "text-white", accent: "text-[#58CC02]" }, // Green (Duolingo Style)
    { bg: "bg-[#1CB0F6]", border: "border-[#1899D6]", text: "text-white", accent: "text-[#1CB0F6]" }, // Blue
    { bg: "bg-[#8B5CF6]", border: "border-[#7C3AED]", text: "text-white", accent: "text-[#8B5CF6]" }, // Violet
    { bg: "bg-[#FF9600]", border: "border-[#E68500]", text: "text-white", accent: "text-[#FF9600]" }  // Orange
  ];

  return (
    <div className="bg-sage-green min-h-screen text-[#3D3D3B] flex flex-col w-full font-sans">
      {/* Dynamic Top Navbar for mobile (automatically responsive) */}
      <Navbar />

      {/* 2. RESPONSIVE APP SHELL WRAPPER */}
      <div className="flex-1 flex flex-col items-center w-full min-h-screen">
        {/* 3-COLUMN MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
          
          {/* CỘT GIỮA (Lộ trình bài học cuộn rắn uốn lượn) */}
          <main className="space-y-6 min-w-0">
            {/* Header Breadcrumbs */}
            <div className="flex items-center justify-between">
              <Link 
                href="/learn" 
                className="inline-flex items-center gap-1.5 text-[#777777] hover:text-[#1A1A18] transition-colors text-xs font-black uppercase tracking-wider"
              >
                <ChevronLeft size={14} /> Quay lại màn hình lớp học
              </Link>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#1A1A18] tracking-tight">{grade.title}</h1>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed max-w-xl">{grade.description}</p>
            </div>

            {/* Semester Tabs Switcher (Duolingo Style tabs) */}
            <div className="flex border-b-2 border-[#E5E5E5] gap-4 overflow-x-auto no-scrollbar">
              {sortedSemesters.map((semester) => (
                <button
                  key={semester.id}
                  onClick={() => setActiveSemester(semester.id)}
                  className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-4 -mb-[2px] shrink-0 ${
                    activeSemester === semester.id 
                      ? "border-[#1899D6] text-[#1899D6]" 
                      : "border-transparent text-[#777777] hover:text-[#4B4B4B]"
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
                      
                      {/* Unit Milestone Header Banner (Green/Blue/Violet container) */}
                      <div className={`w-full max-w-md ${theme.bg} text-white p-5 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-[0_4px_0_rgba(0,0,0,0.15)] border-b-4 ${theme.border} my-8`}>
                        <div className="space-y-1 z-10 pr-2">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-black/15 px-2.5 py-0.5 rounded-full">
                            Chuyên đề {unit.order_index}
                          </span>
                          <h2 className="text-base font-black leading-snug">{unit.title}</h2>
                          <p className="text-[10px] opacity-80 leading-relaxed font-semibold line-clamp-1 italic">
                            {unit.description || "Bài tập tương tác chuẩn SGK phổ thông."}
                          </p>
                        </div>
                        
                        {/* 3D guide button */}
                        <button className={`px-4 py-2 bg-white text-xs font-black rounded-xl border-b-4 border-slate-200 active:border-b-0 active:translate-y-[4px] transition-all whitespace-nowrap z-10 cursor-pointer shrink-0 ${theme.accent}`}>
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
                                  {/* Connective line underneath the node button */}
                                  {lessonIdx < unit.lessons.length - 1 && (
                                    <div className={`w-2.5 h-14 absolute top-[76px] left-1/2 -translate-x-1/2 -z-10 rounded-full ${
                                      status === 'completed' ? 'bg-[#58CC02]' : 'bg-[#E5E5E5]'
                                    }`} />
                                  )}

                                  {/* Speech Bubble Tooltip for active next lesson */}
                                  {status === 'active' && (
                                    <div className="absolute -top-12 left-1/2 -translate-y-1 -translate-x-1/2 bg-[#58CC02] border-b-4 border-[#46A302] text-white text-[9px] font-black px-3.5 py-1.5 rounded-xl shadow-md uppercase tracking-wider animate-bounce z-10 whitespace-nowrap">
                                      BẮT ĐẦU
                                      {/* Tooltip pointer triangle */}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#58CC02]" />
                                    </div>
                                  )}

                                  {/* Mascot waving next to the active node */}
                                  {status === 'active' && (
                                    <div className={`absolute top-1 text-5xl select-none animate-float hidden md:block ${
                                      lessonIdx % 2 === 0 ? '-right-24' : '-left-24'
                                    }`}>
                                      🦉
                                      {/* Custom Cinematic Clapper Friend */}
                                      <span className="text-[10px] block font-black uppercase text-[#58CC02] text-center tracking-wide leading-none mt-1">DUO Owl</span>
                                    </div>
                                  )}

                                  {/* Winding 3D Circle Node Button */}
                                  {status === 'completed' ? (
                                    <button
                                      onClick={() => setSelectedLesson(lesson)}
                                      className="w-[72px] h-[72px] rounded-full bg-[#FFC800] border-b-[6px] border-[#E6A800] text-white flex items-center justify-center shadow-md active:translate-y-[4px] active:border-b-[2px] transition-all cursor-pointer hover:brightness-105"
                                    >
                                      <Award size={36} fill="white" />
                                    </button>
                                  ) : status === 'active' ? (
                                    <button
                                      onClick={() => setSelectedLesson(lesson)}
                                      className="w-[72px] h-[72px] rounded-full bg-[#58CC02] border-b-[6px] border-[#46A302] text-white flex items-center justify-center shadow-md active:translate-y-[4px] active:border-b-[2px] transition-all cursor-pointer hover:brightness-105"
                                    >
                                      <Play size={28} fill="white" className="ml-1" />
                                    </button>
                                  ) : (
                                    <button
                                      className="w-[72px] h-[72px] rounded-full bg-[#E5E5E5] border-b-[6px] border-[#CBD5E1] text-[#AFAFAF] flex items-center justify-center cursor-not-allowed select-none"
                                      onClick={() => alert("Bài học này đã bị khóa! Em hãy hoàn thành các bài học trước để mở khóa nhé 🔒")}
                                    >
                                      <Lock size={22} />
                                    </button>
                                  )}

                                  {/* Lesson brief indicator text */}
                                  <span className="text-[10px] font-black text-[#777777] uppercase tracking-wider mt-2.5 whitespace-nowrap max-w-[120px] truncate text-center">
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
                        <div className="flex flex-col items-center mt-6 relative translate-y-2">
                          <div className={`w-[72px] h-[72px] rounded-[22px] bg-slate-100 border-2 border-[#E5E5E5] flex items-center justify-center text-3xl shadow-inner select-none cursor-pointer hover:bg-slate-200 transition-colors`}>
                            🎁
                          </div>
                          <span className="text-[9px] font-black text-[#AFAFAF] uppercase tracking-widest mt-2">
                            Mốc quà thưởng
                          </span>
                        </div>

                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center rounded-[32px] border-2 border-dashed border-[#E5E5E5] text-[#777777] text-xs font-semibold italic max-w-sm w-full bg-white shadow-sm">
                  Không tìm thấy chuyên đề nào cho Học kỳ này.
                </div>
              )}
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
                  <span className="uppercase font-black text-[10px] tracking-wider">{grade.title.substring(0, 10)}</span>
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
                      <Link
                        href="/learn"
                        className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-[#3D3D3B] hover:bg-[#F7F7F7] flex items-center gap-2 border-b border-slate-100"
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

      {/* 5. GORGEOUS POPUP MODAL ON NODE CLICK (Duolingo Card style Popover) */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border-2 border-[#E5E5E5] rounded-[2.5rem] p-6 shadow-2xl max-w-sm w-full text-center relative border-b-[8px] border-b-[#E5E5E5]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedLesson(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center text-[#777777] hover:text-[#1A1A18] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Header Emoji bubble */}
              <div className="w-20 h-20 bg-[#E8F4FD] border-2 border-[#B4DDF7] rounded-full flex items-center justify-center text-4xl shadow-inner mx-auto mb-4 select-none animate-bounce">
                {getLessonIconEmoji(selectedLesson.type)}
              </div>

              {/* Lesson details */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1899D6] bg-[#DDF4FF] px-3 py-1 rounded-full">
                  {getLessonTypeLabel(selectedLesson.type)}
                </span>
                <h3 className="text-xl font-black text-[#1A1A18] tracking-tight mt-2">{selectedLesson.title}</h3>
                <p className="text-xs text-[#777777] font-semibold leading-relaxed px-4">
                  Chinh phục bài tập tương tác chuẩn Cinematic để tích lũy XP nhé!
                </p>
                
                {/* Rewards Indicator */}
                <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-black uppercase text-[#FF9600]">
                  <span>🎁 Thưởng +10 XP</span>
                  <span className="text-[#1CB0F6]">💎 +5 Kim cương</span>
                </div>
              </div>

              {/* CTA 3D Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/learn/lesson/${selectedLesson.id}`}
                  onClick={() => setSelectedLesson(null)}
                  className="w-full py-3.5 bg-[#58CC02] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block"
                >
                  BẮT ĐẦU HỌC (+10 XP)
                </Link>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="w-full py-3 bg-[#FFFFFF] border-2 border-[#E5E5E5] text-[#777777] rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#E5E5E5] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block"
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

