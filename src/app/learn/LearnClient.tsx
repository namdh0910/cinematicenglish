"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
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

const mockSgkUnits = [
  { title: "My New School", desc: "Giới thiệu trường học và bạn bè", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop", progress: 60, lessons: 12, difficulty: "Dễ", color: "#6366F1" },
  { title: "My Home", desc: "Miêu tả ngôi nhà và đồ vật", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop", progress: 40, lessons: 10, difficulty: "Dễ", color: "#6366F1" },
  { title: "My Friends", desc: "Bạn bè và các hoạt động", img: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=600&auto=format&fit=crop", progress: 20, lessons: 11, difficulty: "Trung bình", color: "#6366F1" },
  { title: "Neighbourhood", desc: "Khu vực xung quanh", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600&auto=format&fit=crop", progress: 0, lessons: 9, difficulty: "Trung bình", color: "#6366F1" },
];

export default function LearnClient({ initialGrades }: LearnClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("home");
  const [grades] = useState<Grade[]>(initialGrades);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [streakCount, setStreakCount] = useState<number>(0);
  const [activeSgkTab, setActiveSgkTab] = useState("Tất cả");

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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex overflow-hidden selection:bg-[var(--accent-primary)]/30">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-[220px] shrink-0 border-r border-[var(--border-subtle)] flex flex-col justify-between bg-[rgba(9,13,24,0.82)] backdrop-blur-[18px] relative z-20 h-screen sticky top-0 overflow-y-auto hidden md:flex custom-scrollbar">
        <div className="p-4">
          <Link href="/" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.25)]">
              <Play size={14} fill="white" className="ml-0.5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-base tracking-tight text-white leading-none">Cinematic</h1>
              <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">Học Tiếng Anh Tự Nhiên</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300 border ${
                    isActive 
                      ? "bg-purple-500/8 text-purple-400 border-purple-500/15 font-semibold shadow-[0_2px_12px_rgba(124,58,237,0.06)]" 
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/4 font-medium border-transparent"
                  }`}
                >
                  <link.icon size={16} className={isActive ? "text-purple-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]" : "text-slate-500 group-hover:text-slate-300"} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          {/* PRO Card - Slim & Refined */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-3.5 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--accent-primary)] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-bold text-[var(--text-primary)] text-xs">Hội Viên VIP</span>
              <Sparkles size={11} className="text-purple-400" fill="currentColor" />
            </div>
            <p className="text-[9px] text-[var(--text-muted)] font-medium mb-2.5">
              Luyện nói AI & học qua phim không giới hạn
            </p>
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-[10px] font-bold py-1.5 rounded-lg transition-all active:scale-95">
              Nâng cấp ngay
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
        <div className="flex-1 flex flex-col xl:flex-row gap-8 p-4 md:p-8 max-w-[1400px] w-full mx-auto pb-24 md:pb-8 relative z-10">
          
          {/* MIDDLE COLUMN */}
          <main className="flex-1 space-y-12 min-w-0">
            
            {/* Hero Welcome Banner - Cinematic */}
            <div 
              className="relative rounded-[24px] border border-[rgba(255,255,255,0.06)] overflow-hidden flex flex-col lg:flex-row lg:h-[340px] shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
              style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.82))' }}
            >
              
              {/* Left Content (Greeting, Stats, CTA) - 65% width */}
              <div className="w-full lg:w-8/12 p-6 lg:p-10 z-10 flex flex-col justify-between">
                <div>
                  <p className="text-purple-400 text-xs font-bold uppercase tracking-[0.15em] mb-2.5">Chào mừng trở lại</p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-3">
                    Chào, {profile?.full_name ? profile.full_name.split(' ')[0] : "Học viên"}! <span className="text-3xl lg:text-4xl">👋</span>
                  </h2>
                  <p className="text-sm lg:text-base text-slate-400 font-medium max-w-[540px] mb-6">
                    Bạn đã sẵn sàng để tiếp tục hành trình chinh phục tiếng Anh hôm nay chưa?
                  </p>
                </div>
                
                <div className="flex flex-col gap-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[580px]">
                    <div className="flex flex-col">
                      <span className="uppercase text-[11px] font-bold text-slate-500 tracking-[0.12em] block mb-1">Chuỗi học tập</span>
                      <span className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-1.5">
                        <Flame size={20} className="text-amber-500 shrink-0" fill="currentColor" /> {streakCount} ngày
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase text-[11px] font-bold text-slate-500 tracking-[0.12em] block mb-1">Bài đã học</span>
                      <span className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" /> 28 bài
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase text-[11px] font-bold text-slate-500 tracking-[0.12em] block mb-1">Độ chính xác</span>
                      <span className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-1.5">
                        <Target size={20} className="text-blue-500 shrink-0" /> 92%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase text-[11px] font-bold text-slate-500 tracking-[0.12em] block mb-1">XP tích lũy</span>
                      <span className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-1.5">
                        <Sparkles size={20} className="text-purple-500 shrink-0" fill="currentColor" /> 560 XP
                      </span>
                    </div>
                  </div>

                  {/* Continue Learning CTA Button */}
                  <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#8B5CF6] hover:to-[#3B82F6] text-white font-bold py-3 px-6.5 rounded-full transition-all hover-lift w-max shadow-[0_4px_20px_rgba(124,58,237,0.35)] active:scale-98">
                    <Play size={15} fill="currentColor" /> Học tiếp ngay
                  </button>
                </div>
              </div>

              {/* Right Decorative Illustration - 35% width */}
              <div className="w-full lg:w-4/12 relative h-[220px] lg:h-full overflow-hidden p-4 lg:p-0">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[rgba(15,23,42,0.95)] lg:from-[rgba(15,23,42,0.95)] via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Học viên thảo luận nhóm" 
                  loading="lazy"
                  className="w-full h-full object-cover object-center opacity-45 mix-blend-luminosity rounded-2xl lg:rounded-none"
                />
                
                {/* Floating Quote Card with High Glassmorphism */}
                <div className="absolute bottom-4 lg:bottom-6 right-4 left-4 lg:left-[-24px] z-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4.5 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                  <p className="text-xs text-white/90 font-medium italic leading-relaxed">
                    "Language is the road map of a culture. It tells you where its people come from and where they are going."
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">— Rita Mae Brown</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Trích dẫn hay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Chọn cách học */}
            <div className="space-y-5">
              <h3 className="text-3xl font-bold tracking-tight text-white">Phương pháp học tập</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    icon: BookOpen, 
                    title: "Chương trình SGK", 
                    desc: "Học từ vựng, ngữ pháp chuẩn Lớp 6 - Lớp 12 cực kỳ trực quan bám sát chương trình bộ giáo dục.", 
                    stats: "Lớp 6 - Lớp 12 • 12,4k học sinh", 
                    color: "#2563EB", 
                    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/10",
                    btnText: "Học ngay", 
                    btnStyle: "bg-blue-600/10 text-blue-300 border-blue-500/20 hover:bg-blue-600 hover:text-white",
                    bgGrad: "from-blue-600/8 via-transparent to-transparent",
                    borderColor: "border-blue-500/15"
                  },
                  { 
                    icon: Play, 
                    title: "Học qua Phim", 
                    desc: "Luyện nghe nói tự nhiên qua các trích đoạn bom tấn Hollywood hấp dẫn và chân thực nhất.", 
                    stats: "500+ trích đoạn • Cập nhật liên tục", 
                    color: "#7C3AED", 
                    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/10",
                    btnText: "Khám phá", 
                    btnStyle: "bg-purple-600/10 text-purple-300 border-purple-500/20 hover:bg-purple-600 hover:text-white",
                    bgGrad: "from-purple-600/8 via-transparent to-transparent",
                    borderColor: "border-purple-500/15"
                  },
                  { 
                    icon: Mic, 
                    title: "Luyện nói với AI", 
                    desc: "Luyện phát âm chuẩn Mỹ 1-1 với giáo viên bản xứ ảo thông minh, sửa lỗi sai tức thì.", 
                    stats: "AI chấm điểm • 150 bạn online", 
                    color: "#EC4899", 
                    badgeColor: "text-pink-400 bg-pink-500/10 border-pink-500/10",
                    btnText: "Luyện ngay", 
                    btnStyle: "bg-pink-600/10 text-pink-300 border-pink-500/20 hover:bg-pink-600 hover:text-white",
                    bgGrad: "from-pink-600/8 via-transparent to-transparent",
                    borderColor: "border-pink-500/15"
                  },
                ].map((action, idx) => (
                  <div 
                    key={idx} 
                    className={`premium-card premium-card-hover border ${action.borderColor} rounded-2xl p-[22px] text-left relative overflow-hidden flex flex-col justify-between min-h-[220px] group`}
                  >
                    {/* Glowing Accent Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGrad} opacity-0 group-hover:opacity-100 transition-opacity duration-750 pointer-events-none`} />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]">
                        <action.icon size={22} color={action.color} />
                      </div>
                      <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div className="relative z-10 mt-5">
                      <h4 className="text-lg font-bold text-white group-hover:text-white transition-colors">{action.title}</h4>
                      <p className="text-xs lg:text-sm text-slate-400 mt-2 font-medium leading-relaxed line-clamp-2">{action.desc}</p>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5 relative z-10">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${action.badgeColor}`}>
                        {action.stats}
                      </span>
                      
                      <button className={`h-8 px-4 rounded-full text-xs font-bold border transition-all active:scale-95 duration-200 cursor-pointer ${action.btnStyle}`}>
                        {action.btnText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Popular Lessons / Curriculum */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Học tiếp: Lộ trình SGK
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
                            ? "bg-[#7C3AED] text-white" 
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
                  <div key={idx} className="shrink-0 w-[280px] sm:w-[340px] premium-card premium-card-hover rounded-2xl overflow-hidden group snap-start cursor-pointer flex flex-col justify-between">
                    
                    {/* Thumbnail 180px */}
                    <div className="relative h-[180px] w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent z-10" />
                      <img 
                        src={unit.img} 
                        alt={unit.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase text-white tracking-widest">
                        Unit {idx + 1}
                      </div>
                      <div className="absolute top-3 right-3 z-20 bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase text-white tracking-widest shadow-md">
                        {unit.difficulty}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-[18px] flex flex-col gap-4 flex-1 justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">{unit.title}</h4>
                        <p className="text-sm text-slate-400 mt-1.5 line-clamp-2">{unit.desc}</p>
                      </div>
                      
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                          <span>Tiến độ</span>
                          <span className="text-white">{unit.progress}%</span>
                        </div>
                        <div className="w-full h-[6px] bg-white/8 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${unit.progress}%` }}
                          />
                        </div>
                      </div>
 
                      {/* Footer & CTA */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5 mt-auto">
                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <BookOpen size={13} className="text-slate-500" /> {unit.lessons} bài học
                        </div>
                        <button 
                          className="h-10 px-[18px] rounded-full text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 active:scale-95 shadow-[0_4px_12px_rgba(124,58,237,0.15)]"
                          style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)' }}
                        >
                          Học tiếp <ArrowRight size={13} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Luyện nói phổ biến */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Luyện giao tiếp phổ biến
                </h3>
                <a href="#" className="text-xs text-purple-400 font-bold hover:underline">Xem tất cả</a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { title: "Gọi Cà Phê ở London", desc: "Học cách giao tiếp tự tin khi gọi đồ uống tại quán cà phê nước Anh.", level: "Cơ bản", duration: "5 phút", color: "from-blue-600/10 to-transparent", border: "border-blue-500/10", icon: Headphones, iconColor: "text-blue-400" },
                  { title: "Phỏng vấn xin việc (IT)", desc: "Trả lời các câu hỏi tình huống kinh điển của nhà tuyển dụng nước ngoài.", level: "Nâng cao", duration: "10 phút", color: "from-purple-600/10 to-transparent", border: "border-purple-500/10", icon: Mic, iconColor: "text-purple-400" },
                  { title: "Làm thủ tục tại Sân Bay", desc: "Giao tiếp trôi chảy với nhân viên hải quan và làm thủ tục bay dễ dàng.", level: "Trung cấp", duration: "7 phút", color: "from-pink-600/10 to-transparent", border: "border-pink-500/10", icon: Navigation, iconColor: "text-pink-400" }
                ].map((item, idx) => (
                  <div key={idx} className={`premium-card premium-card-hover border ${item.border} rounded-2xl p-5 flex flex-col justify-between min-h-[160px] group relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                        <item.icon size={18} className={item.iconColor} />
                      </div>
                      <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-bold uppercase tracking-wider">{item.level}</span>
                    </div>
                    <div className="relative z-10 mt-4">
                      <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/5 mt-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.duration}</span>
                      <button className="text-xs text-purple-400 font-bold group-hover:text-white flex items-center gap-1">Luyện ngay <ChevronRight size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Phim đang hot */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Phim đang hot
                </h3>
                <a href="#" className="text-xs text-purple-400 font-bold hover:underline">Xem tất cả</a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { title: "Harry Potter & Hòn Đá Phù Thủy", topic: "Giao tiếp Hằng Ngày", reward: "+120 XP", img: "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?q=80&w=600&auto=format&fit=crop", views: "3.2k học" },
                  { title: "The Avengers (Biệt Đội Siêu Anh Hùng)", topic: "Hành động & Tiếng lóng", reward: "+150 XP", img: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=600&auto=format&fit=crop", views: "4.8k học" },
                  { title: "Friends (Những Người Bạn)", topic: "Thành ngữ & Kết bạn", reward: "+100 XP", img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop", views: "5.1k học" }
                ].map((movie, idx) => (
                  <div key={idx} className="premium-card premium-card-hover rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent z-10" />
                      <img src={movie.img} alt={movie.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:opacity-85" />
                      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-11 h-11 rounded-full bg-purple-600/90 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                          <Play size={18} fill="white" className="ml-0.5 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-purple-400 uppercase tracking-widest">{movie.reward}</div>
                    </div>
                    <div className="p-4.5 flex flex-col justify-between flex-1 gap-3.5">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 leading-tight">{movie.title}</h4>
                        <span className="text-[11px] text-slate-500 font-bold block mt-1 uppercase tracking-wider">{movie.topic}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 font-medium">{movie.views}</span>
                        <button className="text-[11px] bg-purple-600/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-bold group-hover:bg-purple-600 group-hover:text-white transition-all">Học ngay</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* RIGHT COLUMN (WIDGETS) */}
          <aside className="w-full xl:w-[340px] shrink-0 space-y-6">
            
            {/* Leaderboard Widget (Bảng vàng tiến bộ) */}
            <div 
              className="border border-white/5 rounded-2xl p-6 shadow-xl space-y-5"
              style={{ background: 'linear-gradient(180deg, rgba(26, 38, 68, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-amber-500" />
                  <h4 className="text-base font-bold text-white tracking-tight">Bảng vàng tiến bộ</h4>
                </div>
                <a href="#" className="text-xs text-purple-400 font-bold hover:underline">Chi tiết</a>
              </div>
              
              {/* Leaderboard Rankings */}
              <div className="space-y-3.5">
                {[
                  { rank: 1, name: "Hoàng Nam", xp: "1.450 XP", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop", color: "text-yellow-400", medal: "🥇" },
                  { rank: 2, name: "Minh Thư", xp: "1.220 XP", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", color: "text-slate-300", medal: "🥈" },
                  { rank: 3, name: "Khánh Vy", xp: "980 XP", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop", color: "text-amber-600", medal: "🥉" }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl p-2.5 transition-all hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black w-6 text-center ${user.color}`}>{user.medal}</span>
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <span className="text-xs font-semibold text-white">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{user.xp}</span>
                  </div>
                ))}

                {/* Current User Rank Position */}
                <div className="w-full h-px bg-white/5 my-2" />
                <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/15 rounded-xl p-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-purple-400 w-6 text-center">#12</span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-400">
                      {profile?.full_name ? profile.full_name.charAt(0) : "H"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-none">{profile?.full_name ? profile.full_name.split(' ')[0] : "Bạn"}</span>
                      <span className="text-[9px] text-purple-400 mt-1 font-semibold block leading-none">Cần thêm 3 bài học để thăng hạng</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-400">{(streakCount * 50 + 560).toLocaleString('vi-VN')} XP</span>
                </div>
              </div>
            </div>

            {/* Quests Widget (Nhiệm vụ hôm nay) */}
            <div 
              className="border border-white/5 rounded-2xl p-6 shadow-xl space-y-5"
              style={{ background: 'linear-gradient(180deg, rgba(26, 38, 68, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-purple-400" />
                  <h4 className="text-base font-bold text-white tracking-tight">Nhiệm vụ hôm nay</h4>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hằng ngày</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: "Hoàn thành 1 bài học SGK", current: 1, target: 1, done: true },
                  { text: "Luyện phát âm AI 5 phút", current: 2, target: 5, done: false },
                  { text: "Tích lũy 100 điểm XP hôm nay", current: 80, target: 100, done: false }
                ].map((quest, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={quest.done ? "text-slate-400 line-through flex items-center gap-1.5" : "text-white flex items-center gap-1.5"}>
                        {quest.done ? <CheckCircle2 size={13} className="text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                        {quest.text}
                      </span>
                      <span className="text-slate-400 text-[11px] font-bold">{quest.current} / {quest.target}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${quest.done ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}
                        style={{ width: `${(quest.current / quest.target) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign Up CTA Widget */}
            {role === 'guest' && (
              <div className="bg-gradient-to-br from-purple-500/15 via-[rgba(15,23,42,0.92)] to-[rgba(15,23,42,0.92)] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600 blur-[50px] opacity-25 pointer-events-none" />
                <h4 className="text-base font-bold text-white mb-2 relative z-10 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-purple-400" fill="currentColor" />
                  Lưu tiến trình học!
                </h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-5 relative z-10">
                  Đăng ký tài khoản miễn phí ngay hôm nay để ghi danh bảng vàng tiến bộ và mở khóa lộ trình học chuẩn.
                </p>
                <Link 
                  href="/signup" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs py-3 rounded-full transition-all text-center block relative z-10 shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover-lift"
                >
                  Tạo tài khoản miễn phí
                </Link>
              </div>
            )}

          </aside>

        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-lg border-t border-[var(--border-subtle)] pb-safe">
        <div className="flex items-center justify-around p-3">
          {sidebarLinks.slice(0, 5).map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"
                }`}
              >
                <link.icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]" : ""} />
                <span className="text-[10px] font-bold">{link.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
