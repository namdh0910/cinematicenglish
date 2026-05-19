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
  Award 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

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
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-slate-800 pb-24 relative overflow-hidden">
      <Navbar />

      {/* Decorative Warm Shapes */}
      <div className="absolute -left-40 top-20 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 top-80 w-96 h-96 rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
      
      <div className="w-full flex justify-center px-4 pt-28">
        <main className="w-full max-w-4xl space-y-8 relative z-10">
          
          {/* 1. PROFILE HEADER CARD */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* User Profile Card */}
            <div className="flex-1 flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-xl font-black text-white shadow-md">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : 'H'}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-black leading-tight text-slate-800">
                    Chào, <span className="text-blue-600">{profile?.full_name || 'Học viên'}</span>! 👋
                  </h1>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 text-xs font-bold">
                      <Flame size={14} className="fill-orange-500 animate-pulse" /> {streak} Ngày liên tiếp
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
                <Settings size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Speaking Proficiency Stats */}
            <div className="md:w-[280px] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span className="flex items-center gap-1.5"><Mic size={14} className="text-blue-500" /> Phát âm AI</span>
                <span className="text-blue-600 font-mono text-2xl font-black">{avgFluency}%</span>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgFluency}%` }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  {avgFluency >= 80 
                    ? "Giọng nói rõ ràng! Hãy tiếp tục rèn luyện kỹ năng nối từ nhé."
                    : "Luyện nói nhiều hơn để nâng cao điểm phát âm chuẩn của mình nha."}
                </p>
              </div>
            </div>
          </div>

          {/* 2. HERO SEARCH & HOMEWORK CODE SECTION (YourHomework Style) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 text-center">
            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
              <BookOpen className="text-blue-500" size={20} /> VÀO LỚP HỌC HÔM NAY
            </h3>
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập mã bài tập lớp học hoặc tìm kiếm bài học..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <button className="px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/10">
                Vào học ngay
              </button>
            </div>
          </div>

          {/* 3. QUICK GRID TOOLS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-3xl flex items-center gap-4 transition-all shadow-sm hover:shadow-md cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">🎤</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Chấm Phát Âm</h4>
                <p className="text-[10px] text-slate-500 font-medium">Luyện khẩu hình AI</p>
              </div>
            </div>
            <div className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-3xl flex items-center gap-4 transition-all shadow-sm hover:shadow-md cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">🎧</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Luyện Nghe (Dictation)</h4>
                <p className="text-[10px] text-slate-500 font-medium">Chép chính tả phản xạ</p>
              </div>
            </div>
            <div className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-3xl flex items-center gap-4 transition-all shadow-sm hover:shadow-md cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">📝</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Thi Trắc Nghiệm</h4>
                <p className="text-[10px] text-slate-500 font-medium">Đề luyện thi học kì</p>
              </div>
            </div>
          </div>

          {/* 4. SCHOOL & GRADE CATEGORY TABS */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm max-w-fit mx-auto">
              {[
                { id: "primary", label: "Tiểu học" },
                { id: "secondary", label: "Trung học Cơ sở (THCS)" },
                { id: "high", label: "Trung học Phổ thông (THPT)" }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    setSelectedSchool(lvl.id as any);
                    setSelectedGrade(lvl.id === "primary" ? "Lớp 3" : lvl.id === "secondary" ? "Lớp 6" : "Lớp 10");
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    selectedSchool === lvl.id 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Dynamic Grades selector */}
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedSchool === "primary" && ["Lớp 3", "Lớp 4", "Lớp 5"].map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedGrade === gr 
                      ? "bg-orange-500 border-orange-500 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {gr}
                </button>
              ))}
              {selectedSchool === "secondary" && ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"].map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedGrade === gr 
                      ? "bg-orange-500 border-orange-500 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {gr}
                </button>
              ))}
              {selectedSchool === "high" && ["Lớp 10", "Lớp 11", "Lớp 12"].map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedGrade === gr 
                      ? "bg-orange-500 border-orange-500 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {gr}
                </button>
              ))}
            </div>
          </div>

          {/* 5. SGK ROADMAP SECTION - Unit cards Global Success */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">Lộ Trình Sách Giáo Khoa: Global Success ({selectedGrade})</h2>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Học chuẩn bám sát SGK</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GLOBAL_SUCCESS_UNITS.map((unit) => (
                <motion.div
                  key={unit.id}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {/* Card Image */}
                  <div className="h-40 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-102" 
                         style={{ backgroundImage: `url('${unit.coverImage}')` }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-blue-600/90 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                      {unit.unitNo}
                    </div>
                    {unit.progress > 0 && (
                      <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-white">
                          <span>Đã học {unit.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${unit.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details & Actions */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {unit.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {unit.desc}
                      </p>
                    </div>

                    <Link href={`/learn`}>
                      <button className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-xs font-black uppercase tracking-wider text-blue-600 transition-all flex items-center justify-center gap-2">
                        <Play size={12} fill="currentColor" /> Vào bài học
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 6. RECENT ACTIVITY HISTORY */}
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Lịch Sử Luyện Tập Gần Đây</h2>
            <div className="space-y-3">
              {recentLessons.length > 0 ? (
                recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{lesson.title}</h4>
                        <span className="text-xs text-slate-400">{lesson.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                        {lesson.isCompleted ? "HOÀN THÀNH" : "ĐANG HỌC DỞ"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 italic font-medium">
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
