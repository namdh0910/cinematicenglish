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
  { title: "My New School", desc: "Giới thiệu trường học, lớp học và bạn bè thân thuộc", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop", progress: 60, lessons: 12, difficulty: "Dễ", color: "#6366F1" },
  { title: "My Home", desc: "Miêu tả chi tiết ngôi nhà, các phòng và đồ vật trong nhà", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop", progress: 40, lessons: 10, difficulty: "Dễ", color: "#6366F1" },
  { title: "My Friends", desc: "Mô tả tính cách bạn bè và các hoạt động vui chơi dã ngoại", img: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=600&auto=format&fit=crop", progress: 20, lessons: 11, difficulty: "Trung bình", color: "#6366F1" },
  { title: "Neighbourhood", desc: "Khám phá khu vực xung quanh và chỉ đường đến địa điểm", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600&auto=format&fit=crop", progress: 0, lessons: 9, difficulty: "Trung bình", color: "#6366F1" },
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
    <div className="min-h-screen bg-[#050816] text-[var(--text-primary)] font-sans flex overflow-hidden selection:bg-[var(--accent-primary)]/30">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-[240px] shrink-0 border-r border-[var(--border-subtle)] flex flex-col justify-between bg-[rgba(15,23,42,0.72)] backdrop-blur-[24px] relative z-20 h-screen sticky top-0 overflow-y-auto hidden md:flex custom-scrollbar">
        <div className="p-5">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.3)] group-hover:scale-105 transition-transform duration-300">
              <Play size={15} fill="white" className="ml-0.5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-base tracking-tight text-white leading-none">Cinematic</h1>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-[0.1em]">Học Tiếng Anh Tự Nhiên</p>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 border ${
                    isActive 
                      ? "bg-purple-500/10 text-purple-300 border-purple-500/20 font-semibold shadow-[0_2px_12px_rgba(124,58,237,0.08)]" 
                      : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04] font-medium border-transparent"
                  }`}
                >
                  <link.icon size={16} className={isActive ? "text-purple-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" : "text-slate-500 group-hover:text-slate-300"} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5">
          {/* PRO Card - Premium Sleek Styling */}
          <div className="bg-[rgba(17,25,40,0.92)] border border-white/[0.05] rounded-2xl p-4.5 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#7C3AED] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-bold text-white text-xs">Hội Viên VIP</span>
              <Sparkles size={11} className="text-purple-400" fill="currentColor" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium mb-3.5 leading-relaxed">
              Luyện nói AI & học qua phim không giới hạn
            </p>
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold py-2 rounded-xl transition-all active:scale-95 shadow-[0_4px_12px_rgba(124,58,237,0.2)]">
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#050816]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-8 h-[72px] flex items-center justify-between shrink-0">
          
          {/* Search Bar Cinematic */}
          <div className="hidden lg:flex items-center gap-2.5 bg-[rgba(15,23,42,0.72)] border border-white/[0.06] rounded-full px-4 py-2 w-full max-w-sm transition-all focus-within:border-purple-500/50 focus-within:bg-[rgba(17,25,40,0.92)] focus-within:shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài học, thư viện phim..." 
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
            />
          </div>

          {/* Right Stats & Profile */}
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-amber-500/8 border border-amber-500/15 rounded-full px-3 py-1">
                <Flame size={14} className="text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" fill="currentColor" />
                <span className="text-xs font-bold text-amber-300">{streakCount} ngày</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-500/8 border border-purple-500/15 rounded-full px-3 py-1">
                <Sparkles size={14} className="text-purple-400 drop-shadow-[0_0_6px_rgba(124,58,237,0.4)]" fill="currentColor" />
                <span className="text-xs font-bold text-purple-300">{profile?.gems || 560} XP</span>
              </div>
            </div>
            
            <div className="w-px h-6 bg-[var(--border-subtle)]" />
            
            <button className="text-[var(--text-muted)] hover:text-white transition-colors relative p-1.5 rounded-full hover:bg-white/[0.04]">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--status-danger)] shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </button>
            
            <button className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 flex items-center justify-center text-sm font-bold text-[var(--accent-primary)] overflow-hidden hover:scale-105 transition-transform duration-300">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.full_name ? profile.full_name.charAt(0) : "A"
              )}
            </button>
          </div>
        </header>

        {/* 3. MAIN DASHBOARD CONTENT GRID */}
        <div className="flex-1 flex flex-col xl:flex-row gap-6 p-4 md:p-[32px] max-w-[1400px] w-full mx-auto pb-24 md:pb-[32px] relative z-10">
          
          {/* MIDDLE COLUMN */}
          <main className="flex-1 space-y-10 min-w-0">
            
            {/* Hero Welcome Banner - Premium Startup Style */}
            <div 
              className="relative rounded-[24px] border border-white/[0.05] overflow-hidden flex flex-col lg:flex-row lg:h-[360px] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl group"
              style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(10, 15, 30, 0.85) 100%)' }}
            >
              {/* Soft purple/blue internal aura glow */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-[#7C3AED] blur-[130px] opacity-15 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#2563EB] blur-[130px] opacity-10 pointer-events-none" />
              
              {/* Left Content (Greeting, Stats, CTA) - 62% width */}
              <div className="w-full lg:w-[62%] p-6 lg:p-10 z-10 flex flex-col justify-between h-full relative">
                <div>
                  <p className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Chào mừng trở lại</p>
                  <h2 className="text-4xl md:text-5xl lg:text-[72px] font-black text-white tracking-tight leading-[0.95] mb-4">
                    Chào, {profile?.full_name ? profile.full_name.split(' ')[0] : "Học viên"}! <span className="text-3xl lg:text-4xl">👋</span>
                  </h2>
                  <p className="text-base md:text-lg text-slate-400 font-medium max-w-[560px] leading-relaxed mb-6">
                    Bắt đầu luyện phản xạ nói tự nhiên và tích lũy chuỗi Aura hôm nay.
                  </p>
                </div>
                
                <div className="flex flex-col gap-6">
                  {/* Stats Row - Mini Glass Cards Horizontal */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[620px]">
                    {[
                      { label: "Chuỗi học tập", value: `${streakCount} ngày`, icon: Flame, iconColor: "text-amber-500 bg-amber-500/10" },
                      { label: "Bài đã học", value: "28 bài", icon: CheckCircle2, iconColor: "text-emerald-500 bg-emerald-500/10" },
                      { label: "Độ chính xác", value: "92%", icon: Target, iconColor: "text-blue-500 bg-blue-500/10" },
                      { label: "XP tích lũy", value: `${profile?.gems || 560} XP`, icon: Sparkles, iconColor: "text-purple-500 bg-purple-500/10" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-md rounded-2xl p-3 flex flex-col justify-between transition-all hover:bg-white/[0.05] hover:border-white/[0.08] hover:-translate-y-0.5 duration-300">
                        <span className="uppercase text-[9px] font-bold text-slate-500 tracking-[0.12em] block mb-2">{stat.label}</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${stat.iconColor}`}>
                            <stat.icon size={13} fill={stat.icon === Flame || stat.icon === Sparkles ? "currentColor" : "none"} />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{stat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Learning CTA Button - Large Pill */}
                  <button 
                    onClick={() => setActiveTab("sgk")}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#8B5CF6] hover:to-[#3B82F6] text-white font-bold h-12 px-8 rounded-full transition-all hover:-translate-y-0.5 w-max shadow-[0_4px_25px_rgba(124,58,237,0.35)] active:scale-98 duration-200 cursor-pointer"
                  >
                    <Play size={15} fill="currentColor" /> Học tiếp lộ trình
                  </button>
                </div>
              </div>

              {/* Right Decorative Illustration - 38% width */}
              <div className="w-full lg:w-[38%] relative h-[240px] lg:h-full overflow-hidden p-4 lg:p-0">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050816] lg:from-[rgba(10,15,30,0.95)] via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop" 
                  alt="Cinematic Background" 
                  loading="lazy"
                  className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity rounded-2xl lg:rounded-none group-hover:scale-105 duration-1000 transition-transform"
                />
                
                {/* Floating Quote Card with High Glassmorphism & Edge Highlight */}
                <div className="absolute bottom-4 lg:bottom-8 right-4 left-4 lg:left-[-40px] z-20 bg-black/40 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                  <p className="text-xs text-white/90 font-medium italic leading-relaxed">
                    "Language is the road map of a culture. It tells you where its people come from and where they are going."
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">— Rita Mae Brown</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-purple-500/10">Trích dẫn hay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: CONTINUE LEARNING (Học tiếp: Lộ trình SGK) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Lộ trình học của bạn
                </h3>
                
                {/* Curriculum Grade Tabs */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 hide-scroll-mobile">
                    {sgkTabs.map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveSgkTab(tab)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                          activeSgkTab === tab 
                            ? "bg-[#7C3AED] text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]" 
                            : "bg-[rgba(17,25,40,0.92)] text-[var(--text-muted)] hover:text-white border border-white/5"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Scroll Cards (16:9 Aspect Ratio) */}
              <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 -mx-4 px-4 sm:-mx-8 sm:px-8 snap-x">
                {mockSgkUnits.map((unit, idx) => (
                  <div key={idx} className="shrink-0 w-[290px] sm:w-[350px] bg-[rgba(17,25,40,0.92)] border border-white/[0.05] rounded-[24px] overflow-hidden group snap-start cursor-pointer flex flex-col justify-between transition-all duration-350 hover:-translate-y-1.5 hover:bg-[rgba(30,41,59,0.95)] hover:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                    
                    {/* Thumbnail 180px with cinematic overlay */}
                    <div className="relative h-[180px] w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/90 via-transparent to-transparent z-10" />
                      <img 
                        src={unit.img} 
                        alt={unit.title} 
                        loading="lazy"
                        className="w-full h-full object-cover brightness-[1.05] group-hover:scale-[1.05] transition-transform duration-500"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase text-white tracking-widest">
                        Unit {idx + 1}
                      </div>
                      <div className="absolute top-3.5 right-3.5 z-20 bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase text-white tracking-widest shadow-md">
                        {unit.difficulty}
                      </div>
                    </div>
                    
                    {/* Content - 20px padding */}
                    <div className="p-5 flex flex-col gap-5 flex-1 justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 leading-tight">{unit.title}</h4>
                        <p className="text-xs text-slate-400 mt-2 font-medium line-clamp-2 leading-relaxed">{unit.desc}</p>
                      </div>
                      
                      {/* Double-column Progress + CTA Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto gap-4">
                        {/* Progress Left */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>TIẾN ĐỘ</span>
                            <span className="text-white font-black">{unit.progress}%</span>
                          </div>
                          <div className="w-full h-[6px] bg-white/8 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                              style={{ width: `${unit.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* CTA Right */}
                        <button 
                          className="h-10 px-4 rounded-full text-white text-xs font-bold flex items-center justify-center transition-all bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:brightness-115 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_12px_rgba(124,58,237,0.25)] shrink-0 duration-200 cursor-pointer"
                        >
                          Học <ArrowRight size={13} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: PHƯƠNG PHÁP HỌC (Feature Cards) */}
            <div className="space-y-6 mt-10">
              <h3 className="text-2xl font-bold tracking-tight text-white">Phương pháp học tập</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    icon: BookOpen, 
                    title: "Chương trình SGK", 
                    desc: "Học từ vựng, ngữ pháp Lớp 6 - 12 trực quan bám sát chương trình Bộ Giáo Dục.", 
                    stats: "Lớp 6 - Lớp 12 • 12k học sinh", 
                    color: "#2563EB", 
                    badgeColor: "text-blue-400 bg-blue-500/10 border border-blue-500/10",
                    btnText: "Học ngay", 
                    btnStyle: "bg-blue-600/10 text-blue-300 border-blue-500/20 hover:bg-blue-600 hover:text-white",
                    bgGrad: "from-blue-600/[0.06] via-transparent to-transparent",
                    borderColor: "border-blue-500/15",
                    iconGlow: "shadow-[0_0_15px_rgba(37,99,235,0.3)] bg-blue-500/10",
                    pattern: "bg-gradient-to-br from-blue-500/[0.03] to-transparent"
                  },
                  { 
                    icon: Play, 
                    title: "Học qua Phim", 
                    desc: "Luyện nghe nói tự nhiên qua các trích đoạn phim Hollywood hấp dẫn chân thực nhất.", 
                    stats: "500+ trích đoạn • Hot nhất", 
                    color: "#7C3AED", 
                    badgeColor: "text-purple-400 bg-purple-500/10 border border-purple-500/10",
                    btnText: "Khám phá", 
                    btnStyle: "bg-purple-600/10 text-purple-300 border-purple-500/20 hover:bg-purple-600 hover:text-white",
                    bgGrad: "from-purple-600/[0.06] via-transparent to-transparent",
                    borderColor: "border-purple-500/15",
                    iconGlow: "shadow-[0_0_15px_rgba(124,58,237,0.3)] bg-purple-500/10",
                    pattern: "bg-gradient-to-br from-purple-500/[0.03] to-transparent"
                  },
                  { 
                    icon: Mic, 
                    title: "Luyện nói với AI", 
                    desc: "Luyện phát âm chuẩn Mỹ 1-1 với trợ lý AI thông minh, sửa lỗi sai phát âm tức thì.", 
                    stats: "AI chấm điểm • 150 online", 
                    color: "#EC4899", 
                    badgeColor: "text-pink-400 bg-pink-500/10 border border-pink-500/10",
                    btnText: "Luyện ngay", 
                    btnStyle: "bg-pink-600/10 text-pink-300 border-pink-500/20 hover:bg-pink-600 hover:text-white",
                    bgGrad: "from-pink-600/[0.06] via-transparent to-transparent",
                    borderColor: "border-pink-500/15",
                    iconGlow: "shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-pink-500/10",
                    pattern: "bg-gradient-to-br from-pink-500/[0.03] to-transparent"
                  },
                ].map((action, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-[rgba(17,25,40,0.92)] border ${action.borderColor} rounded-[24px] p-5 text-left relative overflow-hidden flex flex-col justify-between min-h-[250px] group transition-all duration-350 hover:-translate-y-1.5 hover:bg-[rgba(30,41,59,0.95)] hover:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]`}
                  >
                    {/* Decorative abstract backdrop pattern */}
                    <div className={`absolute inset-0 ${action.pattern} pointer-events-none`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGrad} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] transition-all duration-300 ${action.iconGlow}`}>
                        <action.icon size={20} color={action.color} fill={action.icon === Play ? action.color : "none"} />
                      </div>
                      <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
                    </div>
                    
                    <div className="relative z-10 mt-5">
                      <h4 className="text-base font-bold text-white leading-snug">{action.title}</h4>
                      <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed line-clamp-2">{action.desc}</p>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 relative z-10">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${action.badgeColor}`}>
                        {action.stats}
                      </span>
                      
                      <button className={`h-8 px-4 rounded-full text-xs font-bold border transition-all active:scale-95 duration-300 cursor-pointer ${action.btnStyle}`}>
                        {action.btnText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Luyện nói phổ biến */}
            <div className="space-y-6 mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Luyện giao tiếp phổ biến
                </h3>
                <a href="#" className="text-xs text-purple-400 font-bold hover:underline">Xem tất cả</a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { title: "Gọi Cà Phê ở London", desc: "Học cách giao tiếp tự tin khi gọi đồ uống tại quán cà phê nước Anh.", level: "Cơ bản", duration: "5 phút", color: "from-blue-600/10 to-transparent", border: "border-blue-500/10", icon: Headphones, iconColor: "text-blue-400" },
                  { title: "Phỏng vấn xin việc (IT)", desc: "Trả lời các câu hỏi tình huống kinh niên của nhà tuyển dụng nước ngoài.", level: "Nâng cao", duration: "10 phút", color: "from-purple-600/10 to-transparent", border: "border-purple-500/10", icon: Mic, iconColor: "text-purple-400" },
                  { title: "Làm thủ tục tại Sân Bay", desc: "Giao tiếp trôi chảy với nhân viên hải quan và làm thủ tục bay dễ dàng.", level: "Trung cấp", duration: "7 phút", color: "from-pink-600/10 to-transparent", border: "border-pink-500/10", icon: Navigation, iconColor: "text-pink-400" }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-[rgba(17,25,40,0.92)] border border-white/[0.05] rounded-[24px] p-5 flex flex-col justify-between min-h-[170px] group relative overflow-hidden transition-all duration-350 hover:-translate-y-1.5 hover:bg-[rgba(30,41,59,0.95)] hover:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <item.icon size={16} className={item.iconColor} />
                      </div>
                      <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-bold uppercase tracking-wider">{item.level}</span>
                    </div>
                    <div className="relative z-10 mt-4">
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="relative z-10 flex items-center justify-between pt-3.5 border-t border-white/5 mt-4">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.duration}</span>
                      <button className="text-xs text-purple-400 font-bold group-hover:text-white flex items-center gap-1">Luyện ngay <ChevronRight size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Phim đang hot */}
            <div className="space-y-6 mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Phim đang hot
                </h3>
                <a href="#" className="text-xs text-purple-400 font-bold hover:underline">Xem tất cả</a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { title: "Harry Potter & Hòn Đá Phù Thủy", topic: "Giao tiếp Hằng Ngày", reward: "+120 XP", img: "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?q=80&w=600&auto=format&fit=crop", views: "3.2k học" },
                  { title: "The Avengers (Siêu Anh Hùng)", topic: "Hành động & Tiếng lóng", reward: "+150 XP", img: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=600&auto=format&fit=crop", views: "4.8k học" },
                  { title: "Friends (Những Người Bạn)", topic: "Thành ngữ & Kết bạn", reward: "+100 XP", img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop", views: "5.1k học" }
                ].map((movie, idx) => (
                  <div key={idx} className="bg-[rgba(17,25,40,0.92)] border border-white/[0.05] rounded-[24px] overflow-hidden group cursor-pointer flex flex-col justify-between transition-all duration-350 hover:-translate-y-1.5 hover:bg-[rgba(30,41,59,0.95)] hover:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/90 via-transparent to-transparent z-10" />
                      <img src={movie.img} alt={movie.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:opacity-85" />
                      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-11 h-11 rounded-full bg-purple-600/90 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                          <Play size={18} fill="white" className="ml-0.5 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-purple-400 uppercase tracking-widest">{movie.reward}</div>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 gap-3.5">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 leading-tight">{movie.title}</h4>
                        <span className="text-[10px] text-slate-500 font-bold block mt-1 uppercase tracking-wider">{movie.topic}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                        <span className="text-[10px] text-slate-400 font-medium">{movie.views}</span>
                        <button className="text-[10px] bg-purple-600/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full font-bold group-hover:bg-purple-600 group-hover:text-white transition-all cursor-pointer">Học ngay</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* RIGHT COLUMN (WIDGETS) - Premium Rounded Glass */}
          <aside className="w-full xl:w-[340px] shrink-0 space-y-6">
            
            {/* Leaderboard Widget (Bảng vàng tiến bộ) */}
            <div 
              className="border border-white/5 rounded-3xl p-6 shadow-xl space-y-5 backdrop-blur-xl"
              style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 30, 0.95) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-amber-500" />
                  <h4 className="text-base font-bold text-white tracking-tight">Bảng vàng tiến bộ</h4>
                </div>
                <a href="#" className="text-xs text-purple-400 font-bold hover:underline">Chi tiết</a>
              </div>
              
              {/* Leaderboard Rankings */}
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Hoàng Nam", xp: "1.450 XP", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop", color: "text-yellow-400", medal: "🥇" },
                  { rank: 2, name: "Minh Thư", xp: "1.220 XP", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", color: "text-slate-300", medal: "🥈" },
                  { rank: 3, name: "Khánh Vy", xp: "980 XP", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop", color: "text-amber-600", medal: "🥉" }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5 transition-all hover:bg-white/[0.05] hover:scale-[1.01] duration-200">
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
              className="border border-white/5 rounded-3xl p-6 shadow-xl space-y-5 backdrop-blur-xl"
              style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 30, 0.95) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-purple-400" />
                  <h4 className="text-base font-bold text-white tracking-tight">Nhiệm vụ hôm nay</h4>
                </div>
                <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hằng ngày</span>
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
                      <span className="text-slate-400 text-[10px] font-bold">{quest.current}/{quest.target}</span>
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
              <div className="bg-gradient-to-br from-purple-500/15 via-[rgba(15,23,42,0.92)] to-[rgba(15,23,42,0.92)] border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden shadow-xl">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur-lg border-t border-[var(--border-subtle)] pb-safe">
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
