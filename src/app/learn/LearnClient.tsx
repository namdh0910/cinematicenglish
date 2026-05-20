"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
  Home, BookOpen, Layers, Library, Navigation, Trophy, Target, User, 
  Flame, Sparkles, Play, Headphones, Mic, Book, Zap, 
  ChevronRight, ChevronDown, Shield, Moon, Sun, ArrowRight, CheckCircle2, Gem, Heart, Search, Bell
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const [activeTab, setActiveTab] = useState("home");
  const [grades] = useState<Grade[]>(initialGrades);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [streakCount, setStreakCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (profileData) {
            setProfile(profileData);
            setRole(profileData.role === 'admin' ? 'admin' : 'student');
          }

          const { data: streakData } = await supabase
            .from('daily_streaks')
            .select('current_streak')
            .eq('user_id', session.user.id)
            .single();
            
          if (streakData) setStreakCount(streakData.current_streak);
        }
      } catch (err) {
        console.error("Error loading user details:", err);
      }
    };
    fetchUserData();
  }, []);

  const sidebarLinks = [
    { id: "home", label: "Trang chủ", icon: Home },
    { id: "sgk", label: "Học SGK", icon: BookOpen },
    { id: "topics", label: "Chủ đề", icon: Layers },
    { id: "library", label: "Thư viện phim", icon: Library },
    { id: "speaking", label: "Luyện Nói AI", icon: Mic },
    { id: "leaderboard", label: "Bảng xếp hạng", icon: Trophy },
    { id: "quests", label: "Nhiệm vụ", icon: Target },
    { id: "profile", label: "Hồ sơ", icon: User },
  ];

  const sgkTabs = ["Tất cả", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"];
  const [activeSgkTab, setActiveSgkTab] = useState("Tất cả");

  const mockSgkUnits = [
    { title: "My New School", desc: "Giới thiệu trường học và bạn bè", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop", progress: 60, lessons: 12, difficulty: "Dễ", color: "#6366F1" },
    { title: "My Home", desc: "Miêu tả ngôi nhà và đồ vật", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop", progress: 40, lessons: 10, difficulty: "Dễ", color: "#6366F1" },
    { title: "My Friends", desc: "Bạn bè và các hoạt động", img: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=600&auto=format&fit=crop", progress: 20, lessons: 11, difficulty: "Trung bình", color: "#6366F1" },
    { title: "Neighbourhood", desc: "Khu vực xung quanh", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600&auto=format&fit=crop", progress: 0, lessons: 9, difficulty: "Trung bình", color: "#6366F1" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex overflow-hidden selection:bg-[var(--accent-primary)]/30">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-[240px] shrink-0 border-r border-[var(--border-subtle)] flex flex-col justify-between bg-[var(--bg-primary)] relative z-20 h-screen sticky top-0 overflow-y-auto hidden md:flex custom-scrollbar">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Play size={16} fill="white" className="ml-1 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight text-white leading-none">Cinematic</h1>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Learn English Naturally</p>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 ${
                    isActive 
                      ? "bg-white/5 text-[var(--accent-primary)] shadow-[inset_0_0_20px_rgba(124,58,237,0.05)] border border-[var(--border-subtle)] font-bold drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]" 
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 font-medium border border-transparent"
                  }`}
                >
                  <link.icon size={18} className={isActive ? "text-[var(--accent-primary)] drop-shadow-[0_0_12px_rgba(124,58,237,0.8)]" : "text-slate-500"} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* PRO Card - Slim & Refined */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--accent-primary)] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-[var(--text-primary)] text-sm">PRO</span>
              <Sparkles size={12} className="text-[var(--accent-primary)]" fill="currentColor" />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-medium mb-3">
              Mở khóa luyện nói AI không giới hạn
            </p>
            <button className="w-full bg-[var(--accent-primary)] hover:brightness-110 text-white text-[11px] font-bold py-2 rounded-lg transition-all active:scale-95">
              Nâng cấp
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-8 h-[72px] flex items-center justify-between shrink-0">
          
          {/* Search Bar Cinematic */}
          <div className="hidden lg:flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full px-4 py-2 w-full max-w-sm transition-all focus-within:border-[var(--accent-primary)]/50 focus-within:shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài học, thư viện phim..." 
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
            />
          </div>

          {/* Right Stats & Profile */}
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Flame size={16} className="text-[var(--status-warning)] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" fill="currentColor" />
                <span className="text-sm font-bold text-[var(--text-primary)]">{streakCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[var(--accent-primary)] drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" fill="currentColor" />
                <span className="text-sm font-bold text-[var(--text-primary)]">{profile?.gems || 560}</span>
              </div>
            </div>
            
            <div className="w-px h-6 bg-[var(--border-subtle)]" />
            
            <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--status-danger)] shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
            </button>
            
            <button className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/50 flex items-center justify-center text-sm font-bold text-[var(--accent-primary)] overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.full_name ? profile.full_name.charAt(0) : "A"
              )}
            </button>
          </div>
        </header>

        {/* Dashboard Grid (Middle + Right) */}
        <div className="flex-1 flex flex-col xl:flex-row gap-8 p-8 max-w-[1600px] w-full mx-auto">
          
          {/* MIDDLE COLUMN */}
          <main className="flex-1 space-y-8 min-w-0">
            
            {/* Hero Welcome Banner */}
            <div className="relative rounded-[2.5rem] bg-[#16171E] border border-white/5 overflow-hidden p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#1E1B4B]/80 to-transparent pointer-events-none" />
              
              {/* Left Progress Chart */}
              <div className="relative shrink-0 w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#1F2937" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="54" 
                    stroke="url(#gradient)" strokeWidth="8" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - 0.85)}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-[#94A3B8] font-black uppercase tracking-widest">Tiến độ tuần</span>
                  <span className="text-2xl font-black text-white mt-0.5">85%</span>
                  <span className="text-[8px] text-[#34D399] font-bold mt-1">Mục tiêu 5 ngày</span>
                </div>
              </div>

              {/* Center Text */}
              <div className="flex-1 z-10 relative space-y-2">
                <p className="text-[#818CF8] text-xs font-black uppercase tracking-widest">Chào mừng trở lại</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                  Chào, {profile?.full_name ? profile.full_name.split(' ')[0] : "Học viên"}! <span className="text-3xl animate-wave">👋</span>
                </h2>
                <p className="text-sm text-slate-400 font-medium">Hôm nay bạn muốn học chủ đề gì?</p>
                
                {/* Stats Row */}
                <div className="flex items-center gap-6 pt-6">
                  <div className="text-center">
                    <p className="text-xl font-black text-white">5</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Ngày streak</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-xl font-black text-white">28</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Bài đã học</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-xl font-black text-[#818CF8]">92%</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Phát âm TB</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-xl font-black text-[#8B5CF6]">560</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1 flex items-center gap-1 justify-center">
                      <Sparkles size={10} /> XP tích lũy
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Decorative Image (Leo DiCaprio placeholder using Unsplash tuxedo man) */}
              <div className="absolute right-0 bottom-0 h-[120%] w-[40%] hidden lg:block opacity-90 mix-blend-screen pointer-events-none"
                   style={{
                     backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop')",
                     backgroundSize: "cover",
                     backgroundPosition: "center top",
                     WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)"
                   }}
              >
              </div>

              {/* Quote Card */}
              <div className="hidden lg:block absolute bottom-8 right-8 bg-[#0F1015]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-64 z-20 shadow-2xl">
                <p className="text-xs text-white/90 font-semibold italic leading-relaxed text-center">
                  "You miss 100% of the shots you don't take."
                </p>
                <p className="text-[10px] text-slate-400 text-center mt-2 font-black">— Wayne Gretzky</p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
            </div>

            {/* Quick Actions (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Headphones, title: "Luyện nghe", desc: "Nghe và nhại lại câu thoại", color: "#818CF8", bg: "from-[#312E81]/30 to-transparent" },
                { icon: Mic, title: "Luyện nói", desc: "AI chấm phát âm ngay", color: "#EC4899", bg: "from-[#831843]/30 to-transparent" },
                { icon: Book, title: "Từ vựng", desc: "Học từ vựng theo ngữ cảnh", color: "#6366F1", bg: "from-[#312E81]/30 to-transparent" },
                { icon: Zap, title: "Ôn tập", desc: "Củng cố kiến thức", color: "#F59E0B", bg: "from-[#78350F]/30 to-transparent" },
              ].map((action, idx) => (
                <button key={idx} className={`bg-[#13141C] hover:bg-[#1A1D2D] border border-white/5 rounded-3xl p-5 text-left transition-all group relative overflow-hidden flex flex-col justify-between min-h-[140px]`}>
                  <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${action.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="flex items-start justify-between relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <action.icon size={20} color={action.color} />
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="relative z-10 mt-4">
                    <h3 className="text-sm font-black text-white">{action.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Curriculum Horizontal Slider */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  Lộ trình SGK Global Success <Sparkles size={16} className="text-[#818CF8]" fill="currentColor" />
                </h3>
                
                {/* Filters */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 hide-scroll-mobile">
                    {sgkTabs.map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveSgkTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                          activeSgkTab === tab 
                            ? "bg-[#6366F1] text-white shadow-[0_2px_10px_rgba(99,102,241,0.3)]" 
                            : "bg-[#13141C] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <button className="hidden sm:flex items-center gap-2 bg-[#16171E] border border-white/5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white">
                    Sắp xếp: Mới nhất <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Cards */}
              <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 -mx-8 px-8 snap-x">
                {mockSgkUnits.map((unit, idx) => (
                  <div key={idx} className="shrink-0 w-[280px] sm:w-[320px] bg-[#13141C] border border-white/5 rounded-3xl overflow-hidden group cursor-pointer snap-start shadow-lg">
                    {/* Thumbnail */}
                    <div className="relative h-[160px] w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16171E] via-transparent to-transparent z-10" />
                      <img 
                        src={unit.img} 
                        alt={unit.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-white tracking-widest">
                        Unit {idx + 1} • Lớp 6
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-4 right-4 z-20 bg-[#10B981] px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-white tracking-widest shadow-md">
                          Đang học
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h4 className="text-lg font-black text-white">{unit.title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">{unit.desc}</p>
                      </div>
                      
                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>Tiến độ</span>
                          <span className="text-white">{unit.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#6366F1] rounded-full"
                            style={{ width: `${unit.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                            <BookOpen size={12} /> {unit.lessons} bài học
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> {unit.difficulty}
                          </span>
                        </div>
                        <button className="w-7 h-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center hover:bg-[#4F46E5] transition-colors shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* RIGHT COLUMN (WIDGETS) */}
          <aside className="w-full xl:w-[320px] shrink-0 space-y-6">
            
            {/* Leaderboard Widget */}
            <div className="bg-[#16171E] border border-white/5 rounded-[2rem] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black text-white">Bảng xếp hạng tuần</h4>
                <a href="#" className="text-[10px] text-[#818CF8] font-bold hover:underline">Xem tất cả</a>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
                <div className="w-12 h-12 bg-[#1E1B4B] border border-[#312E81] rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0">
                  <Shield size={20} className="text-[#818CF8]" fill="currentColor" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#818CF8]">Chưa xếp hạng</h5>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">Hoàn thành thêm 3 bài học để có thứ hạng đầu tiên!</p>
                </div>
              </div>
            </div>

            {/* Quests Widget */}
            <div className="bg-[#16171E] border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">Nhiệm vụ hằng ngày</h4>
                <a href="#" className="text-[10px] text-[#818CF8] font-bold hover:underline">Xem tất cả</a>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Kiếm 10 KN học tập</span>
                  <span className="text-slate-500 text-[10px] font-black">0 / 10 KN</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full relative overflow-hidden flex items-center pr-1 border border-white/5">
                  <div className="h-full bg-[#818CF8] rounded-full" style={{ width: "0%" }} />
                  <span className="absolute right-1 text-[10px]">🎁</span>
                </div>
              </div>
            </div>

            {/* Sign Up CTA Widget */}
            {role === 'guest' && (
              <div className="bg-gradient-to-br from-[#1E1B4B] to-[#0F172A] border border-[#312E81] rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6366F1] blur-[50px] opacity-30 pointer-events-none" />
                <h4 className="text-base font-black text-white mb-2 relative z-10">Lưu lại tiến trình của bạn!</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-5 relative z-10">
                  Tạo tài khoản miễn phí để lưu trữ mọi tiến trình học tập.
                </p>
                <Link 
                  href="/signup" 
                  className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] active:translate-y-[2px] active:shadow-none text-center block relative z-10"
                >
                  Đăng nhập / Tạo tài khoản
                </Link>
              </div>
            )}

          </aside>

        </div>
      </div>
      
    </div>
  );
}
