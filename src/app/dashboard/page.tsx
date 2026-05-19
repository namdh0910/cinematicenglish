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
  const [dbGrades, setDbGrades] = useState<{ id: string; title: string }[]>([]);
  
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

        const { data: gradesList } = await supabase
          .from("grades")
          .select("id, title");
        if (gradesList) {
          setDbGrades(gradesList);
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
    <div className="bg-[#F5F7FB] min-h-screen text-[#3D3D3B] pb-24 relative overflow-y-auto overflow-x-hidden">
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
        <main className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8 relative z-10">
          
          {/* SECTION: HỌC TIẾP & BẮT ĐẦU NHANH */}
          <section className="space-y-6 bg-[#F0F7FF] p-8 rounded-[32px] border border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#3B82F6]">
                <Sparkles size={14} className="fill-[#3B82F6] text-[#3B82F6]" />
              </span>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Học tiếp / Bắt đầu nhanh</h2>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
              {/* User Profile Card */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#FFFFFF] p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xl font-black text-white shadow-md">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'H'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">
                      Chào, <span className="text-[#3B82F6]">{profile?.full_name || 'Học viên'}</span>! 👋
                    </h1>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="flex items-center gap-1.5 text-[#B45309] bg-[#FFF3E0] px-3.5 py-1 rounded-full border border-[#FFE0B2] text-xs font-bold shadow-sm">
                        <Flame size={14} className="fill-[#B45309] text-[#B45309] animate-pulse" /> {streak} Ngày liên tiếp
                      </span>
                      <span className="flex items-center gap-1.5 text-[#3B82F6] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 text-xs font-black shadow-sm">
                        <GraduationCap size={14} /> Trình độ: {selectedGrade}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm cursor-pointer"
                >
                  <Settings size={18} className="text-gray-500 animate-spin-slow" />
                </button>
              </div>

              {/* Speaking Proficiency Stats */}
              <div className="lg:w-[320px] bg-[#FFFFFF] p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-[0.07em] text-[#6B7280] mb-[6px] flex items-center gap-1">
                    <Mic size={14} className="text-[#3B82F6]" /> Phát âm AI hôm nay
                  </span>
                  <span className="text-[32px] font-black text-gray-900 flex items-center gap-1.5 font-mono">
                    {avgFluency >= 80 ? (
                      <span className="text-[#22C55E] text-lg">▲</span>
                    ) : (
                      <span className="text-red-500 text-lg">▼</span>
                    )}
                    {avgFluency}%
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-[8px] bg-blue-50 rounded-[99px] overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${avgFluency}%` }}
                      transition={{ duration: 1.2 }}
                      className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-[99px]"
                    />
                  </div>
                  <p className="text-[10px] text-[#6B7280] font-medium italic">
                    {avgFluency >= 80 
                      ? "Giọng nói rõ ràng! Hãy tiếp tục rèn luyện nhé."
                      : "Luyện nói nhiều hơn để nâng cao điểm phát âm nha."}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Tool */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-3xl mx-auto w-full">
                <div className="md:col-span-3 relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm lớp học, bài học SGK..." 
                    className="w-full bg-[#F7F7F5] border border-gray-200 rounded-xl py-3.5 pl-12 pr-6 text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
                <button 
                  onClick={() => window.location.href = `/learn?q=${encodeURIComponent(searchQuery)}`}
                  className="w-full px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/10 hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer"
                >
                  Vào học ngay
                </button>
              </div>
              
              {/* Quick Actions for Dev */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4">
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

            {/* Quick Grid Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chấm Phát Âm */}
              <div 
                className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-5 cursor-pointer flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-300 group shadow-sm"
                onClick={() => window.location.href = '/learn'}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Mic size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Chấm Phát Âm</h4>
                  <p className="text-xs text-gray-500">Luyện phát âm AI chuẩn</p>
                </div>
              </div>

              {/* Luyện Nghe */}
              <div 
                className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-5 cursor-pointer flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-300 group shadow-sm"
                onClick={() => window.location.href = '/learn'}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Luyện Nghe</h4>
                  <p className="text-xs text-gray-500">Nghe chép chính tả</p>
                </div>
              </div>

              {/* Bài Thi */}
              <div 
                className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-5 cursor-pointer flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-300 group shadow-sm"
                onClick={() => window.location.href = '/learn'}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#D97706] flex items-center justify-center shrink-0">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Bài Thi</h4>
                  <p className="text-xs text-gray-500">Đề kiểm tra thi học kì</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. SCHOOL & GRADE CATEGORY TABS */}
          <div className="flex flex-col gap-5 w-full mb-10 pt-4 bg-white p-6 rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="text-center mb-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Chọn Cấp Học & Lớp của em</span>
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
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/10 border-none scale-102" 
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6] hover:border-[#3B82F6]/20"
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Grades selector pills */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-slate-100 w-full">
              {selectedSchool === "primary" && ["Lớp 3", "Lớp 4", "Lớp 5"].map((gr) => {
                const isActive = selectedGrade === gr;
                return (
                  <button
                    key={gr}
                    onClick={() => setSelectedGrade(gr)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/10 border-none scale-102" 
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6] hover:border-[#3B82F6]/20"
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
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/10 border-none scale-102" 
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6] hover:border-[#3B82F6]/20"
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
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/10 border-none scale-102" 
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6] hover:border-[#3B82F6]/20"
                    }`}
                  >
                    {gr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. SGK ROADMAP SECTION - Unit cards Global Success */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Lộ Trình Sách Giáo Khoa: Global Success ({selectedGrade})</h2>
              <span className="text-[11px] text-[#3B82F6] font-black uppercase tracking-[0.07em]">Học chuẩn bám sát SGK</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {GLOBAL_SUCCESS_UNITS.map((unit) => {
                const isCinematic = !unit.grade || unit.grade.includes("Cinematic");
                const isHigh = unit.grade?.includes("10") || unit.grade?.includes("11") || unit.grade?.includes("12");
                const barColor = isCinematic ? "#8B5CF6" : isHigh ? "#3B82F6" : "#22C55E";
                
                const isStudying = unit.badge === "Đang học" || unit.progress > 0;
                const statusText = isStudying ? "Đang học" : "Chưa bắt đầu";
                const statusBg = isStudying ? "bg-[#DCFCE7] text-[#166534]" : "bg-slate-100 text-slate-500";

                const matchingGrade = dbGrades.find((g) => g.title === (unit.grade || selectedGrade));
                const gradeHref = matchingGrade ? `/learn/grade/${matchingGrade.id}` : "/learn";

                return (
                  <motion.div
                    key={unit.id}
                    whileHover={{ y: -4, borderColor: '#3B82F6/20', boxShadow: '0 12px 30px rgba(59,130,246,0.06)' }}
                    className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100/80 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
                  >
                    <div>
                      {/* Thumbnail swatch */}
                      {unit.coverImage ? (
                        <div 
                          className="h-[120px] w-full bg-cover bg-center rounded-2xl mb-5 shadow-sm" 
                          style={{ backgroundImage: `url('${unit.coverImage}')` }}
                        />
                      ) : (
                        <div 
                          className="h-[120px] w-full rounded-2xl mb-5 shadow-sm" 
                          style={{
                            background: `linear-gradient(135deg, ${barColor}26 0%, ${barColor}0D 50%, ${barColor}1F 100%)`
                          }}
                        />
                      )}

                      {/* Details */}
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${statusBg}`}>
                            {statusText}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#3B82F6] border border-blue-100 text-[9px] font-black uppercase tracking-wider">
                            {unit.unitNo} • {unit.grade}
                          </span>
                        </div>

                        <h4 className="text-lg font-black text-gray-900 group-hover:text-[#3B82F6] transition-colors leading-tight line-clamp-1">
                          {unit.title}
                        </h4>

                        {/* Unit count row with icon */}
                        <div className="text-xs text-[#6B7280] font-bold flex items-center gap-1.5">
                          <BookOpen size={14} className="text-[#3B82F6]" />
                          <span>12 bài học luyện phản xạ</span>
                        </div>

                        <p className="text-xs text-[#6B7280] leading-relaxed font-medium line-clamp-2">
                          {unit.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link href={gradeHref}>
                        <button className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-xs font-black uppercase tracking-wider text-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <Play size={12} fill="currentColor" /> Vào bài học
                        </button>
                      </Link>
                    </div>

                    {/* 4px Progress Bar at card bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-blue-50 overflow-hidden rounded-b-2xl">
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
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Lịch Sử Luyện Tập Gần Đây</h2>
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
