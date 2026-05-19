'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Play, 
  Flame, 
  Clock, 
  X, 
  Mic, 
  Sparkles, 
  Trophy, 
  Search, 
  GraduationCap, 
  BookOpen, 
  ChevronRight, 
  Award,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { seedGlobalSuccessData } from "@/app/actions/seed";
import { migrateLegacyMovies } from "@/app/actions/migrateLegacyMovies";

const GLOBAL_SUCCESS_UNITS = [
  {
    id: "unit-1",
    unitNo: "Unit 1",
    title: "My New School",
    grade: "Lớp 6",
    desc: "Học từ vựng về đồ dùng học tập, các môn học, phát âm chuẩn /ʌ/ và /ɑː/.",
    coverImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    progress: 80,
    badge: "Đang học"
  },
  {
    id: "unit-2",
    unitNo: "Unit 2",
    title: "My Home",
    grade: "Lớp 6",
    desc: "Khám phá từ vựng về ngôi nhà, các loại phòng, đồ đạc trong phòng và giới thiệu ngôi nhà mơ ước.",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    progress: 45,
    badge: "Đang học"
  },
  {
    id: "unit-3",
    unitNo: "Unit 3",
    title: "My Friends",
    grade: "Lớp 6",
    desc: "Luyện phát âm chuẩn các tính từ miêu tả ngoại hình, tính cách của bạn bè và cấu trúc trò chuyện.",
    coverImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
    progress: 0,
    badge: "Chưa học"
  },
  {
    id: "unit-4",
    unitNo: "Unit 4",
    title: "My Neighbourhood",
    grade: "Lớp 6",
    desc: "Luyện kỹ năng so sánh hơn của tính từ ngắn và dài để miêu tả khu phố, con đường xinh đẹp.",
    coverImage: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80",
    progress: 0,
    badge: "Chưa học"
  }
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [avgFluency, setAvgFluency] = useState<number>(85);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<"primary" | "secondary" | "high">("secondary");
  const [selectedGrade, setSelectedGrade] = useState<string>("Lớp 6");
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  
  // States for Seeding Data & Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [seeding, setSeeding] = useState(false);
  const [migrating, setMigrating] = useState(false);

  async function fetchProfile() {
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
          setEditName(userProfile.full_name || "");
        }

        const { data: streakData } = await supabase
          .from("daily_streaks")
          .select("current_streak")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (streakData) {
          setStreak(streakData.current_streak || 0);
        }

        const { data: attempts } = await supabase
          .from("speaking_attempts")
          .select("accuracy_score")
          .eq("user_id", session.user.id);

        if (attempts && attempts.length > 0) {
          const totalAccuracy = attempts.reduce((acc, curr) => acc + (curr.accuracy_score || 0), 0);
          setAvgFluency(Math.round(totalAccuracy / attempts.length));
        }

        const { data: progressData } = await supabase
          .from("lesson_progress")
          .select(`is_completed, updated_at, lesson_id`)
          .eq("user_id", session.user.id)
          .order("updated_at", { ascending: false })
          .limit(3);

        if (progressData && progressData.length > 0) {
          const lessonIds = progressData.map(p => p.lesson_id);
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id, title, description")
            .in("id", lessonIds);

          if (lessons) {
            const mappedLessons = progressData.map(p => {
              const lessonInfo = lessons.find(l => l.id === p.lesson_id);
              const dateObj = new Date(p.updated_at);
              const formattedDate = dateObj.toLocaleDateString('vi-VN', { 
                day: 'numeric', 
                month: 'numeric', 
                year: 'numeric' 
              });
              
              return {
                id: p.lesson_id,
                title: lessonInfo?.title || "Bài học tiếng Anh",
                date: formattedDate,
                isCompleted: p.is_completed
              };
            });
            setRecentLessons(mappedLessons);
          }
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      fetchProfile();
    }, 0);
  }, []);

  const handleMigrate = async () => {
    setMigrating(true);
    try {
      const result = await migrateLegacyMovies();
      if (result.success) {
        setToast({
          show: true,
          message: result.message || "Đồng nhất hóa dữ liệu thành công!",
          type: "success"
        });
      } else {
        setToast({
          show: true,
          message: result.error || result.message || "Đồng nhất hóa thất bại!",
          type: "error"
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err instanceof Error ? err.message : "Lỗi kết nối máy chủ!",
        type: "error"
      });
    } finally {
      setMigrating(false);
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedGlobalSuccessData();
      if (result.success) {
        setToast({
          show: true,
          message: result.message || "Mồi dữ liệu thành công!",
          type: "success"
        });
        // Sync layout with seeded state
        fetchProfile();
      } else {
        setToast({
          show: true,
          message: result.error || "Mồi dữ liệu thất bại!",
          type: "error"
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err instanceof Error ? err.message : "Lỗi kết nối máy chủ!",
        type: "error"
      });
    } finally {
      setSeeding(false);
      // Auto dismiss
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#3D3D3B] pb-24 relative overflow-y-auto overflow-x-hidden">
      <Navbar />

      {/* Custom Premium Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-md px-6 py-4 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
              borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              color: '#ffffff'
            }}
          >
            {toast.type === 'success' ? (
              <Check size={20} className="shrink-0 text-white" />
            ) : (
              <X size={20} className="shrink-0 text-white" />
            )}
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider mb-0.5 text-white/80">
                {toast.type === 'success' ? 'Thành công' : 'Gặp lỗi'}
              </p>
              <p className="text-xs font-bold text-white leading-tight">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))} 
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Warm Shapes */}
      <div className="absolute -left-40 top-20 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 top-80 w-96 h-96 rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
      
      <div className="w-full flex justify-center px-4" style={{ paddingTop: '24px' }}>
        <main className="w-full max-w-4xl flex flex-col gap-8 relative z-10">
          
          {/* Hero Area Wrapper */}
          <div className="w-full rounded-2xl overflow-hidden mt-6" style={{ backgroundColor: '#F0F7FF', padding: '2rem 1.5rem 1.5rem', marginBottom: '1.5rem' }}>
            {/* 1. PROFILE HEADER CARD */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
              {/* User Profile Card */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#FFFFFF] p-8 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-xl font-black text-white shadow-md">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'H'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#1A1A18]">
                      Chào, <span className="text-[#2563EB]">{profile?.full_name || 'Học viên'}</span>! 👋
                    </h1>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="flex items-center gap-1.5 text-[#B45309] bg-[#FFF3E0] px-3 py-1 rounded-full border border-[#FFE0B2] text-xs font-semibold">
                        <Flame size={14} className="fill-[#B45309] text-[#B45309]" /> {streak} Ngày liên tiếp
                      </span>
                      <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-xs font-bold">
                        <GraduationCap size={14} /> Trình độ: {selectedGrade}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <Settings size={18} className="text-[#6B6B68]" />
                </button>
              </div>

              {/* Speaking Proficiency Stats */}
              <div className="md:w-[280px] bg-[#FFFFFF] p-[1rem_1.25rem] rounded-[12px] border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.07em] text-[#6B6B68] mb-[6px] flex items-center gap-1">
                    <Mic size={14} className="text-blue-500" /> Phát âm AI
                  </span>
                  <span className="text-[28px] font-bold text-[#1A1A18] flex items-center gap-1 font-mono">
                    {avgFluency >= 80 ? (
                      <span className="text-[#16A34A] text-lg font-bold">▲</span>
                    ) : (
                      <span className="text-[#DC2626] text-lg font-bold">▼</span>
                    )}
                    {avgFluency}%
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-[8px] bg-[#EFF6FF] rounded-[99px] overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${avgFluency}%` }}
                      transition={{ duration: 1.2 }}
                      className="h-full bg-[#2563EB] rounded-[99px]"
                    />
                  </div>
                  <p className="text-[10px] text-[#6B6B68] italic">
                    {avgFluency >= 80 
                      ? "Giọng nói rõ ràng! Hãy tiếp tục rèn luyện kỹ năng nối từ nhé."
                      : "Luyện nói nhiều hơn để nâng cao điểm phát âm chuẩn của mình nha."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. HERO SEARCH & HOMEWORK CODE SECTION (YourHomework Style) */}
          <div className="bg-[#FFFFFF] p-8 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-6 text-center w-full">
            <h3 className="text-[18px] font-bold text-[#1A1A18] flex items-center justify-center gap-2 tracking-tight">
              <BookOpen className="text-blue-500" size={22} /> Vào lớp học hôm nay
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-2xl mx-auto w-full">
              <div className="md:col-span-3 relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm lớp học, bài học SGK..." 
                  className="w-full bg-[#F7F7F5] border border-[#EBEBEA] rounded-xl py-3.5 pl-12 pr-6 text-sm font-bold text-[#3D3D3B] placeholder:text-[#6B6B68] focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={() => window.location.href = `/learn?q=${encodeURIComponent(searchQuery)}`}
                className="w-full px-[28px] py-[12px] rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-semibold text-[14px] transition-all shadow-[0_2px_8px_rgba(37,99,235,0.20)] hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer"
              >
                Vào học ngay
              </button>
            </div>
            
            {/* Quick Seeding Actions for Dev */}
            <div className="pt-4 border-t border-[#EBEBEA] flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 text-[10px] font-black uppercase tracking-widest text-amber-600 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 disabled:opacity-60 shadow-sm cursor-pointer"
              >
                {seeding ? "⏳ Đang mồi..." : "🎒 Tạo Dữ Liệu Mẫu (Global Success)"}
              </button>
              <button 
                onClick={handleMigrate}
                disabled={migrating}
                className="px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 disabled:opacity-60 shadow-sm cursor-pointer"
              >
                {migrating ? "⏳ Đang di trú..." : "🎬 Đồng Nhất Dữ Liệu Phim Cũ"}
              </button>
            </div>
          </div>

          {/* 3. QUICK GRID TOOLS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chấm Phát Âm */}
            <div 
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] p-[1rem_1.25rem] cursor-pointer flex items-center gap-[12px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition-all duration-300 group"
              onClick={() => window.location.href = '/learn'}
            >
              <div className="w-9 h-9 rounded-[8px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <Mic size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-[#1A1A18]">Chấm Phát Âm</h4>
                <p className="text-[11px] text-[#6B6B68]">Luyện phát âm AI chuẩn</p>
              </div>
            </div>

            {/* Luyện Nghe */}
            <div 
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] p-[1rem_1.25rem] cursor-pointer flex items-center gap-[12px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition-all duration-300 group"
              onClick={() => window.location.href = '/learn'}
            >
              <div className="w-9 h-9 rounded-[8px] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <BookOpen size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-[#1A1A18]">Luyện Nghe</h4>
                <p className="text-[11px] text-[#6B6B68]">Nghe điền chỗ trống phản xạ</p>
              </div>
            </div>

            {/* Bài Thi */}
            <div 
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] p-[1rem_1.25rem] cursor-pointer flex items-center gap-[12px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition-all duration-300 group"
              onClick={() => window.location.href = '/learn'}
            >
              <div className="w-9 h-9 rounded-[8px] bg-[#FFF7ED] text-[#D97706] flex items-center justify-center shrink-0">
                <Trophy size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-[#1A1A18]">Bài Thi</h4>
                <p className="text-[11px] text-[#6B6B68]">Đề kiểm tra thi học kì</p>
              </div>
            </div>
          </div>

          {/* 4. SCHOOL & GRADE CATEGORY TABS */}
          <div className="bg-[#FFFFFF] p-8 rounded-xl border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-6 w-full">
            <div className="text-center">
              <span className="text-[11px] font-bold text-[#6B6B68] uppercase tracking-[0.07em] block mb-2">Chọn Cấp Học & Lớp của em</span>
            </div>

            {/* School levels selector pills */}
            <div className="flex flex-wrap gap-3 justify-center w-full">
              {[
                { id: "primary", label: "Tiểu học" },
                { id: "secondary", label: "Trung học cơ sở (THCS)" },
                { id: "high", label: "Trung học phổ thông (THPT)" }
              ].map((lvl) => {
                const isActive = selectedSchool === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setSelectedSchool(lvl.id as any);
                      setSelectedGrade(lvl.id === "primary" ? "Lớp 3" : lvl.id === "secondary" ? "Lớp 6" : "Lớp 10");
                    }}
                    className={`text-xs transition-all cursor-pointer rounded-full px-5 py-2.5 font-bold ${
                      isActive 
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/10" 
                        : "bg-slate-100 text-[#3D3D3B] hover:bg-slate-200 border-none"
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Grades selector pills */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-[#EBEBEA] w-full">
              {selectedSchool === "primary" && ["Lớp 3", "Lớp 4", "Lớp 5"].map((gr) => {
                const isActive = selectedGrade === gr;
                return (
                  <button
                    key={gr}
                    onClick={() => setSelectedGrade(gr)}
                    className={`text-xs transition-all cursor-pointer rounded-full px-5 py-2.5 font-bold ${
                      isActive 
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/10" 
                        : "bg-slate-100 text-[#3D3D3B] hover:bg-slate-200 border-none"
                    }`}
                  >
                    {gr}
                  </button>
                );
              })}
              {selectedSchool === "secondary" && ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"].map((gr) => {
                const isActive = selectedGrade === gr;
                return (
                  <button
                    key={gr}
                    onClick={() => setSelectedGrade(gr)}
                    className={`text-xs transition-all cursor-pointer rounded-full px-5 py-2.5 font-bold ${
                      isActive 
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/10" 
                        : "bg-slate-100 text-[#3D3D3B] hover:bg-slate-200 border-none"
                    }`}
                  >
                    {gr}
                  </button>
                );
              })}
              {selectedSchool === "high" && ["Lớp 10", "Lớp 11", "Lớp 12"].map((gr) => {
                const isActive = selectedGrade === gr;
                return (
                  <button
                    key={gr}
                    onClick={() => setSelectedGrade(gr)}
                    className={`text-xs transition-all cursor-pointer rounded-full px-5 py-2.5 font-bold ${
                      isActive 
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/10" 
                        : "bg-slate-100 text-[#3D3D3B] hover:bg-slate-200 border-none"
                    }`}
                  >
                    {gr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. SGK ROADMAP SECTION - Unit cards Global Success */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-semibold text-[#1A1A18]">Lộ Trình Sách Giáo Khoa: Global Success ({selectedGrade})</h2>
              <span className="text-[11px] text-[#2563EB] font-bold uppercase tracking-[0.07em]">Học chuẩn bám sát SGK</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GLOBAL_SUCCESS_UNITS.map((unit) => {
                const isCinematic = !unit.grade || unit.grade.includes("Cinematic");
                const isHigh = unit.grade?.includes("10") || unit.grade?.includes("11") || unit.grade?.includes("12");
                const barColor = isCinematic ? "#534AB7" : isHigh ? "#185FA5" : "#0F6E56";
                
                const isStudying = unit.badge === "Đang học" || unit.progress > 0;
                const statusText = isStudying ? "Đang học" : "Chưa bắt đầu";
                const statusBg = isStudying ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F1EFE8] text-[#5F5E5A]";

                return (
                  <motion.div
                    key={unit.id}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-[#EBEBEA] rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-[#BFDBFE] relative pb-[4px]"
                  >
                    {/* Thumbnail swatch: height 80px */}
                    {unit.coverImage ? (
                      <div 
                        className="h-[80px] w-full bg-cover bg-center" 
                        style={{ backgroundImage: `url('${unit.coverImage}')` }}
                      />
                    ) : (
                      <div 
                        className="h-[80px] w-full" 
                        style={{
                          background: `linear-gradient(135deg, ${barColor}26 0%, ${barColor}0D 50%, ${barColor}1F 100%)`
                        }}
                      />
                    )}

                    {/* Details & Actions */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                            {statusText}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[9px] font-bold uppercase tracking-wider">
                            {unit.unitNo} • {unit.grade}
                          </span>
                        </div>

                        <h4 className="text-[16px] font-bold text-[#1A1A18] group-hover:text-[#2563EB] transition-colors">
                          {unit.title}
                        </h4>

                        {/* Unit count row with icon */}
                        <div className="text-[13px] text-[#6B6B68] font-medium flex items-center gap-1">
                          <BookOpen size={13} className="text-[#6B6B68]" />
                          <span>12 bài học luyện phản xạ</span>
                        </div>

                        <p className="text-xs text-[#6B6B68] leading-relaxed font-medium">
                          {unit.desc}
                        </p>
                      </div>

                      <Link href={`/learn`}>
                        <button className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-xs font-black uppercase tracking-wider text-[#2563EB] transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <Play size={12} fill="currentColor" /> Vào bài học
                        </button>
                      </Link>
                    </div>

                    {/* 4px Progress Bar at card bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#EFF6FF]">
                      <div 
                        className="h-full rounded-r-full"
                        style={{ 
                          backgroundColor: barColor, 
                          width: `${unit.progress}%` 
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 6. RECENT ACTIVITY HISTORY */}
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold text-[#6B6B68] uppercase tracking-[0.07em]">Lịch Sử Luyện Tập Gần Đây</h2>
            <div className="space-y-3">
              {recentLessons.length > 0 ? (
                recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-[#FFFFFF] border border-[#EBEBEA] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#BFDBFE] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F7F7F5] flex items-center justify-center text-[#6B6B68] border border-[#EBEBEA]">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[14px] text-[#1A1A18]">{lesson.title}</h4>
                        <span className="text-xs text-[#6B6B68]">{lesson.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#166534] rounded-lg border border-[#BBF7D0]">
                        {lesson.isCompleted ? "HOÀN THÀNH" : "ĐANG HỌC DỞ"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-[#FFFFFF] border border-dashed border-[#EBEBEA] rounded-xl text-xs text-[#6B6B68] italic font-medium">
                  Chưa có lịch sử học gần đây. Bấm vào bài học ở trên để tích lũy phản xạ!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* QUICK SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-250 flex items-end md:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%", scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%", scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 space-y-6 border border-slate-200 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-2">
                  <Award size={18} className="text-orange-500" /> Cài đặt tài khoản
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên hiển thị của bạn</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors font-bold" 
                />
              </div>
              <button 
                onClick={async () => {
                  try {
                    const supabase = createSupabaseBrowserClient();
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                      await supabase
                        .from("profiles")
                        .update({ full_name: editName })
                        .eq("id", session.user.id);
                      
                      setProfile((prev: any) => ({ ...prev, full_name: editName }));
                    }
                  } catch (err) {
                    console.error("Error updating profile name:", err);
                  }
                  setShowSettings(false);
                }} 
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-display font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-md shadow-blue-500/10"
              >
                Lưu thay đổi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
