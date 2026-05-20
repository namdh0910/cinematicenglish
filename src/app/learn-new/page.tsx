"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  Home, BookOpen, Layers, Library, Navigation, Trophy, Target, User, 
  Flame, Sparkles, Play, Headphones, Mic, Zap, 
  ChevronRight, Moon, Sun, ArrowRight, CheckCircle2, Gift, Book, Heart, Star
} from "lucide-react";

interface Grade {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

const sidebarLinks = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "sgk", label: "Học SGK", icon: BookOpen },
  { id: "topics", label: "Chủ đề", icon: Layers },
  { id: "library", label: "Thư viện", icon: Library },
  { id: "speaking", label: "Lộ trình cá nhân", icon: Navigation },
  { id: "leaderboard", label: "Bảng xếp hạng", icon: Trophy },
  { id: "quests", label: "Nhiệm vụ", icon: Target },
  { id: "profile", label: "Hồ sơ", icon: User },
];

const sgkTabs = ["Tất cả", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"];

const mockSgkUnits = [
  { 
    title: "My New School", 
    desc: "Giới thiệu trường học và bạn bè mới", 
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop", 
    progress: 60, 
    lessons: 12, 
    difficulty: "Dễ", 
    unitNum: 1
  },
  { 
    title: "My Home", 
    desc: "Miêu tả ngôi nhà, phòng ngủ và các đồ vật", 
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop", 
    progress: 40, 
    lessons: 10, 
    difficulty: "Dễ", 
    unitNum: 2
  },
  { 
    title: "My Friends", 
    desc: "Bạn bè, hoạt động ngoại khóa và tính cách", 
    img: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=600&auto=format&fit=crop", 
    progress: 20, 
    lessons: 11, 
    difficulty: "Trung bình", 
    unitNum: 3
  },
  { 
    title: "Neighbourhood", 
    desc: "Khu phố, địa điểm xung quanh và đường xá", 
    img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600&auto=format&fit=crop", 
    progress: 0, 
    lessons: 9, 
    difficulty: "Trung bình", 
    unitNum: 4
  },
];

export default function LearnNewPage() {
  const [activeTab, setActiveTab] = useState("home");
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
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Container wrapper dividing page into Sidebar + Content columns */}
      <div className="flex-1 flex flex-col xl:flex-row w-full min-h-screen">
        
        {/* 1. LEFT COLUMN (Sidebar - 20% width) */}
        <aside className="w-full xl:w-[250px] bg-[#0A0E18] border-b xl:border-b-0 xl:border-r border-slate-800/80 flex flex-col justify-between shrink-0 p-5 xl:h-screen xl:sticky xl:top-0 overflow-y-auto">
          
          {/* Logo Area */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group px-2 py-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#4F46E5] flex items-center justify-center shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
                <Play size={14} fill="white" className="ml-0.5 text-white" />
              </div>
              <div>
                <h1 className="font-sans font-black text-base tracking-tight text-white leading-none">Cinematic</h1>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Learn English Naturally</p>
              </div>
            </Link>

            {/* Menu Links */}
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold tracking-wide transition-all duration-300 border ${
                      isActive 
                        ? "bg-[#151B2B] text-white border-slate-800 shadow-[0_4px_12px_rgba(139,92,246,0.1)]" 
                        : "text-slate-400 hover:text-white hover:bg-white/[0.02] border-transparent"
                    }`}
                  >
                    <link.icon size={16} className={isActive ? "text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "text-slate-500"} />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Area */}
          <div className="space-y-5 mt-8 xl:mt-0">
            {/* PRO upgrade banner */}
            <div className="bg-gradient-to-br from-purple-950/20 via-[#151B2B] to-[#151B2B] border border-purple-500/10 rounded-2xl p-4.5 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#8B5CF6] blur-3xl opacity-10 group-hover:opacity-20 pointer-events-none transition-opacity" />
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="font-black text-white text-[11px] tracking-wider uppercase">PRO ✦</span>
                <Star size={11} className="text-purple-400 fill-purple-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mb-3.5 leading-relaxed">
                Mở khóa toàn bộ nội dung Luyện nói AI & Shadowing không giới hạn.
              </p>
              <button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:brightness-110 text-white text-[10px] font-extrabold py-2.5 rounded-xl transition-all shadow-[0_4px_16px_rgba(139,92,246,0.2)] cursor-pointer">
                Nâng cấp ngay
              </button>
            </div>

            {/* Chế độ Sáng / Tối */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 px-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Chế độ</span>
              <div className="flex items-center gap-0.5 bg-[#080B13] border border-slate-800 rounded-full p-1 w-max">
                <button className="px-3 py-1 rounded-full text-[9px] font-extrabold bg-[#151B2B] text-white flex items-center gap-1">
                  <Moon size={9} /> Tối
                </button>
                <button className="px-3 py-1 rounded-full text-[9px] font-extrabold text-slate-500 flex items-center gap-1">
                  <Sun size={9} /> Sáng
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* 2 & 3. MAIN SECTION WRAPPER (Center 55% + Right 25%) */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 p-6 lg:p-8 max-w-[1440px] mx-auto w-full overflow-y-auto">
          
          {/* 2. CENTER COLUMN (55% width) */}
          <main className="flex-1 space-y-8 min-w-0">
            
            {/* HERO BANNER - Welcome Card */}
            <div className="relative bg-[#151B2B] border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8B5CF6]/5 blur-[80px] pointer-events-none rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#06B6D4]/5 blur-[80px] pointer-events-none rounded-full" />
              
              {/* Left Content Column (60%) */}
              <div className="flex-1 space-y-6 z-10 w-full">
                
                {/* Greeting & Circle Progress */}
                <div className="flex items-center gap-5">
                  
                  {/* SVG Circle Progress */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-[84px] h-[84px] transform -rotate-90">
                      <circle cx="42" cy="42" r="34" stroke="rgba(255,255,255,0.03)" strokeWidth="5.5" fill="transparent" />
                      <circle 
                        cx="42" 
                        cy="42" 
                        r="34" 
                        stroke="url(#purpleNeonGrad)" 
                        strokeWidth="5.5" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - 0.85)}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_rgba(139,92,246,0.3)]"
                      />
                      <defs>
                        <linearGradient id="purpleNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">TIẾN ĐỘ</span>
                      <span className="text-sm font-black text-white mt-0.5 leading-none">85%</span>
                      <span className="text-[7px] font-bold text-[#06B6D4] mt-0.5 leading-none">MỤC TIÊU 5n</span>
                    </div>
                  </div>

                  {/* Greetings Text */}
                  <div>
                    <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.18em] mb-1">Chào mừng trở lại</p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      Chào, Học viên! 👋
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Hôm nay bạn muốn học chủ đề gì?
                    </p>
                  </div>
                </div>

                {/* Top header stats bar pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-[#FFF3E0]/5 border border-amber-500/20 px-3 py-1.5 rounded-full text-[11px] font-bold text-amber-500 shadow-inner">
                    <Flame size={13} className="fill-amber-500" />
                    <span>{streakCount || 0} NGÀY</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#E0F7FA]/5 border border-cyan-500/20 px-3 py-1.5 rounded-full text-[11px] font-bold text-cyan-400 shadow-inner">
                    <Sparkles size={13} className="fill-cyan-400" />
                    <span>{profile?.gems || 500} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FFEBEE]/5 border border-red-500/20 px-3 py-1.5 rounded-full text-[11px] font-bold text-red-500 shadow-inner">
                    <Heart size={13} className="fill-red-500" />
                    <span>5</span>
                  </div>
                  {profile && (
                    <div className="flex items-center gap-2 ml-2 bg-slate-800/40 border border-slate-700/60 pl-2 pr-3 py-1 rounded-full">
                      <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[9px] font-black uppercase">
                        {profile?.full_name?.charAt(0) || "A"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 truncate max-w-[80px]">
                        {profile?.full_name?.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Gatsby suit photo & quote overlay (40%) */}
              <div className="w-full md:w-[220px] lg:w-[260px] h-[160px] md:h-full relative overflow-hidden rounded-2xl shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#151B2B] via-[#151B2B]/20 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" 
                  alt="Suit raise glass" 
                  className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-[1.02] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Float quote overlay card */}
                <div className="absolute bottom-3 right-3 left-3 z-20 bg-[#151B2B]/85 backdrop-blur-xl border border-slate-700/40 rounded-xl p-3 shadow-2xl">
                  <p className="text-[10px] text-white/95 font-medium italic leading-relaxed text-center">
                    "You miss 100% of the shots you don't take."
                  </p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider text-center mt-1">— Wayne Gretzky</p>
                  
                  {/* Dot Indicators */}
                  <div className="flex items-center justify-center gap-1 mt-2.5">
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>

            </div>

            {/* STATS ROW - 4 Horizontal Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: streakCount || 5, label: "Ngày streak", color: "text-amber-500", icon: Flame },
                { value: "28", label: "Bài đã học", color: "text-purple-400", icon: Book },
                { value: "92%", label: "Phát âm TB", color: "text-cyan-400", icon: Mic },
                { value: "560", label: "XP tích lũy", color: "text-[#8B5CF6]", icon: Sparkles, isXp: true }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-[#151B2B] border border-slate-800 rounded-2xl p-4 flex items-center justify-between transition-all hover:border-slate-700/60"
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-extrabold text-white">{stat.value}</span>
                      {stat.isXp && <stat.icon size={11} className={stat.color} fill="currentColor" />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">{stat.label}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={14} className={stat.color === 'text-amber-500' || stat.isXp ? 'fill-current' : ''} />
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS - Luyện nghe, Luyện nói, Từ vựng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Luyện nghe", desc: "Nghe và nhại lại thoại phim", icon: Headphones },
                { title: "Luyện nói", desc: "AI chấm phát âm ngay lập tức", icon: Mic },
                { title: "Từ vựng", desc: "Học từ vựng qua phim ảnh", icon: BookOpen }
              ].map((action, idx) => (
                <div 
                  key={idx}
                  className="bg-[#151B2B] border border-slate-800 rounded-2xl p-4.5 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:bg-[#1C243B] hover:border-purple-500/20 shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] shrink-0">
                      <action.icon size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{action.title}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-tight">{action.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>

            {/* ROADMAP - Lộ trình SGK (Horizontal Cards with bottom progress-bar) */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Lộ trình SGK Global Success <span className="text-[#8B5CF6]">✦</span>
                </h3>
                
                {/* Sorting drop */}
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-white cursor-pointer transition-colors bg-[#151B2B] border border-slate-800 px-3 py-1.5 rounded-lg">
                  <span>Sắp xếp: Mới nhất</span>
                  <ChevronRight size={10} className="rotate-90" />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                {sgkTabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveSgkTab(tab)}
                    className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer shrink-0 ${
                      activeSgkTab === tab 
                        ? "bg-[#8B5CF6] text-white border-transparent shadow-[0_4px_12px_rgba(139,92,246,0.25)]" 
                        : "bg-transparent text-slate-400 hover:text-white border-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Grid of horizontal cards with purple bottom progress-bars */}
              <div className="space-y-4">
                {mockSgkUnits.map((unit, idx) => (
                  <div 
                    key={idx}
                    className="relative bg-[#151B2B] border border-slate-800 rounded-3xl p-4.5 md:p-5 flex flex-row items-center gap-4.5 overflow-hidden group hover:border-purple-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
                  >
                    {/* Left cover thumbnail with badging */}
                    <div className="w-20 h-20 md:w-28 md:h-20 rounded-2xl overflow-hidden shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151B2B] via-transparent to-transparent z-10" />
                      <img 
                        src={unit.img} 
                        alt={unit.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 z-20 bg-[#10B981] px-2 py-0.5 rounded-md text-[8px] font-black uppercase text-white tracking-widest leading-none">
                        Đang học
                      </div>
                    </div>

                    {/* Middle details column */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20 text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider leading-none">
                          UNIT {unit.unitNum} - LỚP 6
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${unit.difficulty === 'Dễ' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {unit.difficulty}
                        </span>
                      </div>
                      
                      <h4 className="text-sm md:text-base font-extrabold text-white tracking-tight group-hover:text-[#8B5CF6] transition-colors leading-snug">
                        {unit.title}
                      </h4>
                      <p className="text-[10px] md:text-xs text-slate-400 font-medium line-clamp-1 leading-normal">
                        {unit.desc}
                      </p>
                    </div>

                    {/* Right circular CTA */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider hidden md:inline">
                        {unit.lessons} BÀI HỌC
                      </span>
                      <button className="w-8 h-8 rounded-full bg-slate-900/50 hover:bg-[#8B5CF6] border border-slate-800 group-hover:border-purple-500/20 flex items-center justify-center text-white transition-all active:scale-90">
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    {/* Absolute purple neon progress-bar at the absolute bottom edge of card */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80">
                      <div 
                        className="h-full bg-[#8B5CF6] transition-all duration-700"
                        style={{ width: `${unit.progress}%` }}
                      />
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </main>

          {/* 3. RIGHT COLUMN (25% width) */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            
            {/* Leaderboard Widget */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={15} className="text-amber-500 fill-amber-500/10" />
                  <h4 className="text-[11px] font-black uppercase text-white tracking-wider">Bảng xếp hạng tuần</h4>
                </div>
                <a href="#" className="text-[9px] font-extrabold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">Xem tất cả</a>
              </div>

              {/* Active Rank users list */}
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Hoàng Nam", xp: "1.450 XP", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop", color: "text-amber-400", medal: "🥇" },
                  { rank: 2, name: "Minh Thư", xp: "1.220 XP", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop", color: "text-slate-300", medal: "🥈" },
                  { rank: 3, name: "Khánh Vy", xp: "980 XP", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop", color: "text-amber-600", medal: "🥉" }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between bg-[#151B2B]/45 border border-slate-800 rounded-xl p-2.5 transition-all hover:bg-[#151B2B]/80 duration-200">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black w-5 text-center ${user.color}`}>{user.medal}</span>
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-slate-800" />
                      <span className="text-[11px] font-bold text-white">{user.name}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400">{user.xp}</span>
                  </div>
                ))}

                {/* Separator line */}
                <div className="h-px bg-slate-850/60 my-2" />

                {/* Logged user row position */}
                <div className="flex items-center justify-between bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 rounded-xl p-2.5 shadow-[inset_0_1px_4px_rgba(139,92,246,0.02)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-purple-400 w-5 text-center">#12</span>
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black text-purple-400 uppercase">
                      {profile?.full_name ? profile.full_name.charAt(0) : "H"}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block leading-none">{profile?.full_name ? profile.full_name.split(' ')[0] : "Học viên"}</span>
                      <span className="text-[8px] text-purple-400 mt-1 font-semibold block leading-none">Cần thêm 3 bài để lên hạng</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-purple-400">560 XP</span>
                </div>
              </div>
            </div>

            {/* Daily Quests Widget */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-[#8B5CF6]" />
                  <h4 className="text-[11px] font-black uppercase text-white tracking-wider">Nhiệm vụ hàng ngày</h4>
                </div>
                <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/15 px-2 py-0.5 rounded font-black uppercase tracking-wider leading-none">AURA</span>
              </div>

              <div className="space-y-4.5">
                {/* Quest 1 */}
                <div className="bg-[#151B2B]/45 border border-slate-850 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-[11px] font-bold text-white leading-none">Kiếm 10 KN học tập</h5>
                      <span className="text-[8px] text-slate-500 font-extrabold mt-1 block tracking-wider uppercase">TIẾN ĐỘ</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-500">0 / 10 KN</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 w-0 transition-all duration-500" />
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
                      <Gift size={11} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Quest 2 */}
                <div className="flex items-center justify-between text-xs font-semibold px-1">
                  <span className="text-slate-400 line-through flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    Hoàn thành 1 bài học SGK
                  </span>
                  <span className="text-slate-500 text-[10px] font-bold">1/1</span>
                </div>

                {/* Quest 3 */}
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                      Luyện nói AI 5 phút
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold">2/5</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-[40%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Signup CTA Box */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-500/5 via-slate-900/50 to-slate-900/50 border border-slate-800 p-5 space-y-4 text-center relative overflow-hidden">
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-white tracking-wider">Lưu lại tiến trình!</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                  Tạo tài khoản miễn phí để lưu trữ mọi tiến trình học tập và mở khóa lộ trình học chuẩn.
                </p>
              </div>
              <Link 
                href="/signup"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold py-3 rounded-2xl transition-all shadow-[0_4px_12px_rgba(139,92,246,0.2)] block text-center cursor-pointer"
              >
                Đăng nhập / Tạo tài khoản
              </Link>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
