'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Flame, Clock, X, Mic, Sparkles, Trophy, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { STORIES } from "@/lib/data";

const getMovieImage = (title: string, fallbackUrl?: string) => {
  const t = title?.toLowerCase() || '';
  if (t.includes("godfather") || t.includes("bố già")) return "https://images.unsplash.com/photo-1627885449231-15b53ff9d10f?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("dark knight") || t.includes("batman")) return "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("forrest") || t.includes("gump")) return "https://images.unsplash.com/photo-1455243170701-d7031da7e9e6?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("titanic")) return "https://images.unsplash.com/photo-1500077423678-052445851415?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("lion king") || t.includes("vua sư tử")) return "https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("gladiator") || t.includes("võ sĩ giác đấu")) return "https://images.unsplash.com/photo-1590135319808-16e788bc535e?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("wolf of wall street")) return "https://images.unsplash.com/photo-1611972589053-2947b1897e06?auto=format&fit=crop&w=1200&q=80";
  
  return fallbackUrl && fallbackUrl.length > 5 ? fallbackUrl : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [avgFluency, setAvgFluency] = useState<number>(85);
  const [continueLesson, setContinueLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // 1. Fetch user profile
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (userProfile) {
          setProfile(userProfile);
          setEditName(userProfile.full_name || "");
        }

        // 2. Fetch daily streak
        const { data: streakData } = await supabase
          .from("daily_streaks")
          .select("current_streak")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (streakData) {
          setStreak(streakData.current_streak || 0);
        }

        // 3. Fetch speaking attempts for Fluency progress calculation
        const { data: attempts } = await supabase
          .from("speaking_attempts")
          .select("accuracy_score")
          .eq("user_id", session.user.id);

        if (attempts && attempts.length > 0) {
          const totalAccuracy = attempts.reduce((acc, curr) => acc + (curr.accuracy_score || 0), 0);
          setAvgFluency(Math.round(totalAccuracy / attempts.length));
        }

        // 4. Fetch recent lesson progress
        const { data: progressData } = await supabase
          .from("lesson_progress")
          .select(`
            is_completed,
            updated_at,
            lesson_id
          `)
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

        // 5. Fetch a lesson to continue (Continue Learning CTA)
        const { data: incompleteProgress } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", session.user.id)
          .eq("is_completed", false)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        let targetLessonId = "";
        let continueText = "Đang học dở";
        let lessonTitle = "Bố Già (The Godfather)";
        let lessonDesc = "Học cách giao tiếp đầy uy lực, sự tôn trọng và nghệ thuật thương lượng đẳng cấp từ thế giới ngầm.";

        if (incompleteProgress) {
          targetLessonId = incompleteProgress.lesson_id;
          continueText = "Học tiếp bài học";
        }

        if (targetLessonId) {
          const { data: lessonDetails } = await supabase
            .from("lessons")
            .select("id, title, description")
            .eq("id", targetLessonId)
            .single();

          if (lessonDetails) {
            lessonTitle = lessonDetails.title;
            lessonDesc = lessonDetails.description || "";
          }
        } else {
          // Get the first available published lesson in the database
          const { data: allLessons } = await supabase
            .from("lessons")
            .select("id, title, description")
            .eq("is_published", true)
            .order("created_at", { ascending: true })
            .limit(1);

          if (allLessons && allLessons.length > 0) {
            targetLessonId = allLessons[0].id;
            lessonTitle = allLessons[0].title;
            lessonDesc = allLessons[0].description || "";
            continueText = "Bắt đầu bài học mới";
          } else {
            // Static fallback to The Godfather
            targetLessonId = "00000000-0000-0000-0000-000000000001";
            continueText = "Đề xuất cho bạn";
          }
        }

        setContinueLesson({
          id: targetLessonId,
          title: lessonTitle,
          description: lessonDesc,
          statusText: continueText
        });
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function to match lesson IDs to their appropriate client route
   */
  const getLessonLink = (id: string) => {
    if (!id) return '/stories/00000000-0000-0000-0000-000000000001';
    if (id.includes('0000-0000') || id === '2ba75a92-2822-45fe-9040-1cf71ef4e522') {
      return `/stories/${id}`;
    }
    return `/learn/lesson/${id}`;
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#050508] min-h-screen text-white pb-24 relative overflow-hidden">
      <Navbar />

      {/* Decorative Blur Spheres */}
      <div className="absolute -left-40 top-20 w-96 h-96 rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute -right-40 top-80 w-96 h-96 rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />
      
      <div className="w-full flex justify-center px-4 pt-28">
        <main className="w-full max-w-4xl space-y-12 relative z-10">
        
          {/* 1. WELCOME & MOTIVATIONAL LEADERBOARD */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* User Profile Info Card */}
            <div className="flex-1 flex items-center justify-between bg-[#101014]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : 'H'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-display font-black leading-tight text-white drop-shadow-md">
                    Chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{profile?.full_name || 'Học viên'}</span>.
                  </h1>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/30">
                        <Flame size={18} className="fill-orange-500 animate-pulse" /> {streak} NGÀY STREAK
                      </span>
                      <span className="flex items-center gap-2 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)] bg-violet-500/10 px-3 py-1.5 rounded-lg border border-violet-500/30">
                        <Sparkles size={16} /> LEVEL: B2 - VOICE ARCHITECT
                      </span>
                    </div>
                  </div>

                  {/* Thành tựu gần đây */}
                  <div className="mt-5 pt-5 border-t border-white/5">
                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Thành tựu gần đây</h4>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 shadow-lg">
                        <Trophy size={14} /> Phản xạ nhanh
                      </div>
                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 shadow-lg">
                        <Sparkles size={14} /> Sẵn sàng nhập vai
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5"
              >
                <Settings size={18} className="text-white/60" />
              </button>
            </div>

            {/* Glowing Fluency score widget */}
            <div className="md:w-[320px] bg-[#101014]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                <span className="flex items-center gap-1.5"><Mic size={14} className="text-emerald-400" /> Trình Độ Nói AI</span>
                <span className="text-emerald-400 font-mono text-3xl font-black drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">{avgFluency}%</span>
              </div>
              <div className="space-y-3">
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-emerald-400/20 blur-xs rounded-full" 
                    style={{ width: `${avgFluency}%` }} 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgFluency}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] rounded-full relative z-10"
                  />
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed italic">
                  {avgFluency >= 80 
                    ? "Bạn phát âm rất rõ ràng, cần cải thiện thêm ngữ điệu nối từ (linking words) để nói tự nhiên hơn."
                    : "Hãy nhại giọng thật chuẩn các từ khóa cốt lõi để nâng cao điểm trôi chảy của mình nhé!"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. CONTINUE LEARNING (Bài Học Tiếp Theo) */}
          <div className="space-y-4">
            <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.25em]">Bài Học Tiếp Theo</h2>
            <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group min-h-[280px] flex items-end">
              
              {/* Background Cover Image with Ken Burns Zoom Effect */}
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] group-hover:scale-105" 
                   style={{ backgroundImage: `url('${getMovieImage(continueLesson?.title || 'The Wolf of Wall Street')}')` }} 
              />
              
              {/* Cinematic Vignette Gradients - Lighter for visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-[#050508]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/80 via-[#050508]/20 to-transparent" />
              <div className="absolute inset-0 bg-violet-950/20 mix-blend-color-dodge" />
              
              {/* Spotlight Glowing Ring */}
              <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />

              {/* Card Billboard Details */}
              <div className="relative z-10 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-black uppercase tracking-widest">
                    🎬 {continueLesson?.statusText || "BẮT ĐẦU BÀI HỌC MỚI"}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-black text-white leading-tight">
                    {continueLesson?.title || "Bố Già (The Godfather)"}
                  </h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed">
                    {continueLesson?.description || "Học cách giao tiếp đầy uy lực, sự tôn trọng và nghệ thuật thương lượng đẳng cấp từ thế giới ngầm."}
                  </p>
                </div>
                
                <Link href={getLessonLink(continueLesson?.id)} className="shrink-0">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-white text-black font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-neutral-100 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all"
                  >
                    <Play size={14} fill="black" /> HỌC NGAY
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. DISCOVER MORE (Khám phá thêm cho bạn) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.25em]">Khám Phá Thêm Cho Bạn</h2>
              <Link href="/stories" className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 uppercase tracking-wider">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STORIES.filter(s => s.id !== continueLesson?.id).slice(0, 2).map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#101014]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 relative"
                >
                  {/* Glowing Spotlight overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                  {/* Card Image Header */}
                  <div className="h-44 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                         style={{ backgroundImage: `url('${story.coverImage}')` }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101014] to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-wider text-amber-400 shadow-lg">
                      LEVEL {story.level}
                    </div>
                    <div className="absolute top-3 right-3 text-xl bg-white/5 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center border border-white/10">
                      {story.emoji}
                    </div>
                  </div>

                  {/* Card Text & CTAs */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-5 relative z-10">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">
                        {story.category}
                      </span>
                      <h4 className="text-xl font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    </div>

                    <Link href={`/stories/${story.id}`}>
                      <button className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:border-white/10">
                        <Play size={12} fill="currentColor" /> Bắt đầu nhại giọng
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 4. RECENT PRACTICE HISTORY */}
          <div className="space-y-4">
            <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.25em]">Lịch Sử Luyện Tập Gần Đây</h2>
            <div className="space-y-3">
              {recentLessons.length > 0 ? (
                recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-5 rounded-2xl bg-[#101014]/40 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{lesson.title}</h4>
                        <span className="text-xs text-white/40">{lesson.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-400 font-display font-black text-xs uppercase tracking-widest">
                        {lesson.isCompleted ? "ĐÃ HOÀN THÀNH" : "ĐANG HỌC DỞ"}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-white/20 mt-1">Trạng thái</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-[#101014]/20 border border-dashed border-white/10 rounded-2xl text-xs text-white/40 italic">
                  Chưa có lịch sử học gần đây. Hãy chọn "HỌC NGAY" ở trên để bắt đầu tích lũy phản xạ!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* CÀI ĐẶT NHANH MODAL */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%", scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%", scale: 0.95 }} className="relative z-10 w-full max-w-md bg-[#12121a] rounded-3xl md:rounded-[36px] p-8 space-y-6 border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xl flex items-center gap-2">
                  <Trophy size={18} className="text-amber-400" /> Cài đặt tài khoản
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={16} /></button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tên hiển thị</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors font-medium" 
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
                className="w-full py-4 bg-white hover:bg-neutral-100 text-black font-display font-black uppercase tracking-widest text-xs rounded-2xl transition-colors shadow-lg"
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

