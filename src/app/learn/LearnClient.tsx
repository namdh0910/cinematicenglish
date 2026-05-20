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
            
            {/* Hero Welcome Banner - Cinematic */}
            <div className="relative rounded-[24px] bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden flex flex-col lg:flex-row min-h-[320px] shadow-2xl">
              
              {/* Left Content (Greeting, Stats, CTA) */}
              <div className="flex-1 p-8 lg:p-12 z-10 flex flex-col justify-center">
                <p className="text-[var(--accent-primary)] text-sm font-bold uppercase tracking-widest mb-2">Chào mừng trở lại</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-2">
                  Chào, {profile?.full_name ? profile.full_name.split(' ')[0] : "Học viên"}!
                </h2>
                <p className="text-sm text-[var(--text-muted)] font-medium mb-8 max-w-md">
                  Bạn đã sẵn sàng để tiếp tục hành trình chinh phục tiếng Anh hôm nay chưa?
                </p>
                
                {/* Horizontal Stats Cards */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 backdrop-blur-md">
                    <Flame size={18} className="text-[var(--text-muted)]" />
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider leading-none">Ngày streak</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] leading-tight">{streakCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 backdrop-blur-md">
                    <CheckCircle2 size={18} className="text-[var(--text-muted)]" />
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider leading-none">Bài đã học</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] leading-tight">28</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 backdrop-blur-md">
                    <Target size={18} className="text-[var(--text-muted)]" />
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider leading-none">Độ chính xác</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] leading-tight">92%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 backdrop-blur-md">
                    <Sparkles size={18} className="text-[var(--text-muted)]" />
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider leading-none">XP Tích lũy</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] leading-tight">560</p>
                    </div>
                  </div>
                </div>

                {/* Continue Learning CTA */}
                <button className="flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white font-bold py-3.5 px-8 rounded-full transition-all hover-lift w-max shadow-[0_4px_20px_rgba(124,58,237,0.4)]">
                  <Play size={16} fill="currentColor" /> Tiếp tục học
                </button>
              </div>

              {/* Right Decorative Illustration */}
              <div className="relative w-full lg:w-5/12 h-64 lg:h-auto min-h-[320px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-card)] via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Students learning" 
                  className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity"
                />
                
                {/* Quote Overlay */}
                <div className="absolute bottom-8 right-8 left-8 z-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <p className="text-sm text-white/90 font-medium italic leading-relaxed">
                    "Language is the road map of a culture. It tells you where its people come from and where they are going."
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2 font-bold">— Rita Mae Brown</p>
                </div>
              </div>
            </div>

            {/* Section 2: Chọn cách học */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Chọn cách học</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: BookOpen, title: "Học SGK", desc: "Bám sát chương trình chuẩn", color: "#2563EB", bg: "from-[var(--accent-secondary)]/20 to-transparent" },
                  { icon: Play, title: "Học Phim", desc: "Học qua các trích đoạn điện ảnh", color: "#7C3AED", bg: "from-[var(--accent-primary)]/20 to-transparent" },
                  { icon: Mic, title: "Luyện Nói AI", desc: "Giao tiếp với người bản xứ ảo", color: "#EC4899", bg: "from-pink-500/20 to-transparent" },
                ].map((action, idx) => (
                  <button key={idx} className={`bg-[var(--bg-card)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl p-6 text-left transition-all hover-lift group relative overflow-hidden flex flex-col justify-between min-h-[140px]`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="flex items-start justify-between relative z-10">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <action.icon size={24} color={action.color} />
                      </div>
                      <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                    </div>
                    <div className="relative z-10 mt-6">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{action.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Popular Lessons / Curriculum */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  Tiếp tục học: Lộ trình SGK
                </h3>
                
                {/* Filters */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 hide-scroll-mobile">
                    {sgkTabs.map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveSgkTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                          activeSgkTab === tab 
                            ? "bg-[var(--accent-primary)] text-white" 
                            : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Scroll Cards (16:9 Aspect Ratio) */}
              <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 -mx-8 px-8 snap-x">
                {mockSgkUnits.map((unit, idx) => (
                  <div key={idx} className="shrink-0 w-[280px] sm:w-[340px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden group hover-lift snap-start cursor-pointer">
                    
                    {/* Thumbnail 16:9 */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent z-10" />
                      <img 
                        src={unit.img} 
                        alt={unit.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[10px] font-bold uppercase text-white tracking-widest">
                        Unit {idx + 1}
                      </div>
                      <div className="absolute top-3 right-3 z-20 bg-[var(--status-success)]/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase text-white tracking-widest shadow-md">
                        {unit.difficulty}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex flex-col gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">{unit.title}</h4>
                        <p className="text-sm text-[var(--text-muted)] font-medium mt-1 line-clamp-2">{unit.desc}</p>
                      </div>
                      
                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase">
                          <span>Hoàn thành</span>
                          <span className="text-[var(--text-primary)]">{unit.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--accent-secondary)] rounded-full transition-all duration-1000"
                            style={{ width: `${unit.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] mt-auto">
                        <div className="text-sm text-[var(--text-muted)] font-medium flex items-center gap-1.5">
                          <BookOpen size={14} /> {unit.lessons} bài học
                        </div>
                        <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-[var(--accent-primary)] text-white text-sm font-bold flex items-center justify-center transition-colors group-hover:bg-[var(--accent-primary)] group-hover:shadow-[0_4px_15px_rgba(124,58,237,0.4)]">
                          Học tiếp <ArrowRight size={14} className="ml-1" />
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
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-[var(--text-primary)]">Bảng xếp hạng</h4>
                <a href="#" className="text-xs text-[var(--accent-primary)] font-bold hover:underline">Xem tất cả</a>
              </div>
              <div className="flex items-center gap-4 bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl p-4">
                <div className="w-12 h-12 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center shrink-0">
                  <Shield size={20} className="text-[var(--text-muted)]" fill="currentColor" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--text-muted)]">Chưa xếp hạng</h5>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Học thêm 3 bài để tham gia!</p>
                </div>
              </div>
            </div>

            {/* Quests Widget */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-[var(--text-primary)]">Nhiệm vụ</h4>
                <a href="#" className="text-xs text-[var(--accent-primary)] font-bold hover:underline">Xem tất cả</a>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                  <span>Kiếm 10 KN học tập</span>
                  <span className="text-[var(--text-muted)] text-xs">0 / 10 KN</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[var(--accent-secondary)] rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>

            {/* Sign Up CTA Widget */}
            {role === 'guest' && (
              <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent-primary)] blur-[50px] opacity-20 pointer-events-none" />
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 relative z-10">Lưu tiến trình học!</h4>
                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed mb-6 relative z-10">
                  Đăng ký tài khoản miễn phí để lưu lại quá trình chinh phục tiếng Anh của bạn.
                </p>
                <Link 
                  href="/signup" 
                  className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white font-bold text-sm py-3 rounded-full transition-all text-center block relative z-10 shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover-lift"
                >
                  Tạo tài khoản
                </Link>
              </div>
            )}

          </aside>

        </div>
      </div>
      
    </div>
  );
}
