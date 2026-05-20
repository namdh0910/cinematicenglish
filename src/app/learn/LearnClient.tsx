"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  Home, BookOpen, Layers, Library, Navigation, Trophy, Target, User, 
  Flame, Sparkles, Play, Headphones, Mic, Zap, 
  ChevronRight, ChevronDown, Moon, Sun, ArrowRight, CheckCircle2, Search, Bell, Heart, Gift, Book
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
    desc: "Giới thiệu trường học và bạn bè", 
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop", 
    progress: 60, 
    lessons: 12, 
    difficulty: "Dễ", 
    color: "#6366F1",
    unitNum: 1
  },
  { 
    title: "My Home", 
    desc: "Miêu tả ngôi nhà và đồ vật", 
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop", 
    progress: 40, 
    lessons: 10, 
    difficulty: "Dễ", 
    color: "#6366F1",
    unitNum: 2
  },
  { 
    title: "My Friends", 
    desc: "Bạn bè và các hoạt động", 
    img: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=600&auto=format&fit=crop", 
    progress: 20, 
    lessons: 11, 
    difficulty: "Trung bình", 
    color: "#6366F1",
    unitNum: 3
  },
  { 
    title: "Neighbourhood", 
    desc: "Khu vực xung quanh", 
    img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600&auto=format&fit=crop", 
    progress: 0, 
    lessons: 9, 
    difficulty: "Trung bình", 
    color: "#6366F1",
    unitNum: 4
  },
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
    <div className="min-h-screen bg-[#070913] text-white font-sans flex flex-col overflow-x-hidden selection:bg-purple-500/30">
      
      {/* 1. TOP HORIZONTAL NAVBAR */}
      <header className="h-[72px] bg-[#090C16] border-b border-[#121727] px-8 flex items-center justify-between shrink-0 sticky top-0 z-50">
        
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.25)]">
            <Play size={13} fill="white" className="ml-0.5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm tracking-tight text-white leading-none">Cinematic</h1>
            <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Learn English Naturally</p>
          </div>
        </Link>

        {/* Center Horizontal Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Học SGK", id: "sgk" },
            { label: "Chủ đề", id: "topics" },
            { label: "Bảng xếp hạng", id: "leaderboard" },
            { label: "Nhiệm vụ", id: "quests" },
            { label: "Hồ sơ", id: "profile" }
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveTab(item.id)}
              className={`text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer ${
                activeTab === item.id 
                  ? "text-purple-400 border-b-2 border-purple-500 pb-1 mt-1" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Stats Pills */}
        <div className="flex items-center gap-3">
          {/* Flame Pill */}
          <div className="flex items-center gap-1 bg-[#2C1F10]/60 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-amber-500 shadow-[inset_0_0_8px_rgba(245,158,11,0.05)]">
            <Flame size={14} className="drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]" fill="currentColor" />
            <span>{streakCount} NGÀY</span>
          </div>

          {/* Gems Pill */}
          <div className="flex items-center gap-1 bg-[#102330]/60 border border-cyan-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-400 shadow-[inset_0_0_8px_rgba(6,182,212,0.05)]">
            <Sparkles size={14} className="drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]" fill="currentColor" />
            <span>{profile?.gems || 500}</span>
          </div>

          {/* Hearts Pill */}
          <div className="flex items-center gap-1 bg-[#2A1015]/60 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-red-500 shadow-[inset_0_0_8px_rgba(239,68,68,0.05)]">
            <Heart size={14} className="drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]" fill="currentColor" />
            <span>5</span>
          </div>

          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-full bg-[#3B2C8C] flex items-center justify-center text-xs font-bold text-white border border-[#4F3FB0] ml-2">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </header>

      {/* BODY WITH LEFT SIDEBAR AND MAIN AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT VERTICAL SIDEBAR */}
        <aside className="w-[240px] bg-[#090C16] border-r border-[#121727] flex flex-col justify-between shrink-0 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto custom-scrollbar hidden md:flex">
          <div className="p-4 space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 border ${
                    isActive 
                      ? "bg-[#1E1649] text-white border-[#3B258C] shadow-[0_2px_12px_rgba(124,58,237,0.1)]" 
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03] border-transparent"
                  }`}
                >
                  <link.icon size={15} className={isActive ? "text-purple-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" : "text-slate-500"} />
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 space-y-4">
            {/* VIP Card */}
            <div className="bg-[#0C101F] border border-[#1D2644] rounded-2xl p-4 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#7C3AED] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="font-black text-white text-[11px] tracking-wide uppercase">PRO ✦</span>
                <Sparkles size={11} className="text-purple-400" fill="currentColor" />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mb-3 leading-relaxed">
                Mở khóa toàn bộ nội dung Luyện nói không giới hạn
              </p>
              <button className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 text-white text-[10px] font-bold py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] cursor-pointer">
                Nâng cấp ngay
              </button>
            </div>

            {/* Dark/Light mode switch */}
            <div className="flex items-center justify-between border-t border-[#121727] pt-4">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Chế độ</span>
              <div className="flex items-center gap-1 bg-[#05070F] border border-white/5 rounded-full p-1 w-max">
                <button className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-[#1C2038] text-white flex items-center gap-1">
                  <Moon size={10} /> Tối
                </button>
                <button className="px-2.5 py-1 rounded-full text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <Sun size={10} /> Sáng
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* 3. MAIN DASHBOARD CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-y-auto h-[calc(100vh-72px)] p-6 md:p-8 relative">
          
          <div className="max-w-[1400px] w-full mx-auto flex flex-col xl:flex-row gap-6">
            
            {/* MIDDLE COLUMN */}
            <main className="flex-1 space-y-8 min-w-0">
              
              {/* HERO SECTION - Welcome Banner */}
              <div 
                className="relative rounded-[24px] border border-white/[0.04] overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[320px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                style={{ background: '#0C101F' }}
              >
                {/* Left side content (60%) */}
                <div className="w-full lg:w-[60%] p-8 z-10 flex flex-col justify-between h-full relative">
                  
                  {/* Greeting & Weekly progress */}
                  <div className="flex items-start gap-6">
                    {/* Circle Weekly progress SVG */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <svg className="w-[84px] h-[84px] transform -rotate-90">
                        <circle cx="42" cy="42" r="34" stroke="rgba(255,255,255,0.04)" strokeWidth="5" fill="transparent" />
                        <circle 
                          cx="42" 
                          cy="42" 
                          r="34" 
                          stroke="url(#progressGrad)" 
                          strokeWidth="5" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 * (1 - 0.85)}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">TIẾN ĐỘ</span>
                        <span className="text-sm font-black text-white mt-0.5 leading-none">85%</span>
                        <span className="text-[7px] font-bold text-[#10B981] mt-0.5 leading-none">MỤC TIÊU 5n</span>
                      </div>
                    </div>

                    {/* Welcome text */}
                    <div>
                      <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">Chào mừng trở lại</p>
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
                        Chào, Học viên! <span className="text-2xl">👋</span>
                      </h2>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        Hôm nay bạn muốn học chủ đề gì?
                      </p>
                    </div>
                  </div>

                  {/* Horizontal metrics row */}
                  <div className="grid grid-cols-4 gap-4 mt-8 border-t border-white/[0.04] pt-5">
                    {[
                      { value: streakCount || 5, label: "Ngày streak" },
                      { value: "28", label: "Bài đã học" },
                      { value: "92%", label: "Phát âm TB" },
                      { value: "560", label: "XP tích lũy", isXp: true }
                    ].map((metric, idx) => (
                      <div key={idx} className={`flex flex-col ${idx !== 3 ? 'border-r border-white/[0.04]' : ''}`}>
                        <div className="flex items-center gap-1">
                          <span className={`text-xl font-extrabold ${metric.isXp ? 'text-purple-400' : 'text-white'}`}>{metric.value}</span>
                          {metric.isXp && <Sparkles size={12} className="text-purple-400" fill="currentColor" />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{metric.label}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right side Gatsby Image (40%) */}
                <div className="w-full lg:w-[40%] relative h-[220px] lg:h-full overflow-hidden p-4 lg:p-0">
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0C101F] lg:from-[#0C101F] via-[#0C101F]/15 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" 
                    alt="Leonardo DiCaprio holding glass" 
                    className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity lg:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Floating quote card */}
                  <div className="absolute bottom-4 right-4 left-4 z-20 bg-[#0C101F]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                    <p className="text-[11px] text-white/90 font-medium italic leading-relaxed text-center">
                      "You miss 100% of the shots you don't take."
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center mt-1.5">— Wayne Gretzky</p>
                    
                    {/* Dot indicators */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION BUTTON PANELS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { title: "Luyện nghe", desc: "Nghe và nhại lại câu thoại", icon: Headphones },
                  { title: "Luyện nói", desc: "AI chấm phát âm ngay", icon: Mic },
                  { title: "Từ vựng", desc: "Học từ vựng theo ngữ cảnh", icon: BookOpen },
                  { title: "Ôn tập", desc: "Củng cố kiến thức", icon: Zap }
                ].map((panel, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#0C101F] border border-white/[0.04] rounded-2xl p-4.5 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:bg-[#12172D] hover:border-white/10 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
                        <panel.icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{panel.title}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-snug">{panel.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>

              {/* LỘ TRÌNH SGK SECTION */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    Lộ trình SGK Global Success <span className="text-purple-400">✦</span>
                  </h3>
                  
                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-white cursor-pointer transition-colors bg-[#0C101F] border border-white/5 px-3 py-1.5 rounded-lg">
                    <span>Sắp xếp: Mới nhất</span>
                    <ChevronDown size={12} />
                  </div>
                </div>

                {/* Filter grade tabs & Cards carousel */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                    {sgkTabs.map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveSgkTab(tab)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                          activeSgkTab === tab 
                            ? "bg-[#5856D6] text-white border-transparent shadow-[0_4px_12px_rgba(88,86,214,0.25)]" 
                            : "bg-transparent text-slate-400 hover:text-white border-white/[0.04]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Curriculum Cards Slider */}
                  <div className="relative flex items-center group/slider">
                    
                    <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar w-full snap-x scroll-smooth">
                      {mockSgkUnits.map((unit, idx) => (
                        <div 
                          key={idx} 
                          className="shrink-0 w-[300px] bg-[#0C101F] border border-white/[0.04] rounded-2xl overflow-hidden group snap-start cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-white/10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                        >
                          {/* Image thumbnail with gradient overlay */}
                          <div className="relative h-[160px] w-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0C101F] via-[#0C101F]/20 to-transparent z-10" />
                            <img 
                              src={unit.img} 
                              alt={unit.title} 
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              loading="lazy"
                            />
                            
                            {/* Top badge */}
                            <div className="absolute top-3 left-3 z-20 bg-[#10B981] px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase text-white tracking-widest">
                              Đang học
                            </div>
                            
                            {/* Inside image titles */}
                            <div className="absolute bottom-3 left-3 right-3 z-20">
                              <span className="bg-[#4F3FB0] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                                UNIT {unit.unitNum} - LỚP 6
                              </span>
                              <h4 className="text-sm font-extrabold text-white mt-1.5 tracking-tight group-hover:text-purple-400 transition-colors">{unit.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 line-clamp-1">{unit.desc}</p>
                            </div>
                          </div>
                          
                          {/* Card Footer Progress & Details */}
                          <div className="p-4 space-y-3.5">
                            {/* Progress bar */}
                            <div className="space-y-1">
                              <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#6366F1] rounded-full transition-all duration-700"
                                  style={{ width: `${unit.progress}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* Footer info row */}
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Book size={10} /> {unit.lessons} bài học
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {unit.difficulty}
                                </span>
                              </div>

                              <button className="w-7 h-7 rounded-full bg-[#1A1E35] hover:bg-purple-600 border border-white/5 flex items-center justify-center text-white transition-all active:scale-90">
                                <ArrowRight size={11} />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Carousel Next Arrow overlay */}
                    <button className="absolute right-2 z-20 w-9 h-9 rounded-full bg-[#0C101F]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-purple-600">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

            </main>

            {/* 4. RIGHT SIDEBAR WIDGETS */}
            <aside className="w-full xl:w-[340px] shrink-0 space-y-6">
              
              {/* Leaderboard Widget */}
              <div className="bg-[#0C101F] border border-white/[0.04] rounded-3xl p-5.5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">Bảng xếp hạng tuần</h4>
                  <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">Xem tất cả</a>
                </div>
                
                {/* Empty State visual shield */}
                <div className="bg-[#05070F] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#1A1F3B] border border-white/5 flex items-center justify-center shadow-lg shadow-black/40">
                    <Trophy size={18} className="text-slate-500" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h5 className="text-xs font-extrabold text-white">Chưa xếp hạng</h5>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Hoàn thành thêm 3 bài học để có thứ hạng đầu tiên!
                    </p>
                  </div>
                </div>
              </div>

              {/* Quests Widget */}
              <div className="bg-[#0C101F] border border-white/[0.04] rounded-3xl p-5.5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">Nhiệm vụ hằng ngày</h4>
                  <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">Xem tất cả</a>
                </div>
                
                {/* Task list with progress and gift icon */}
                <div className="bg-[#05070F] border border-white/5 rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-extrabold text-white">Kiếm 10 KN học tập</h5>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Tiến độ</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-500">0 / 10 KN</span>
                  </div>
                  
                  {/* Progress bar and gift row */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 w-0 transition-all duration-500" />
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
                      <Gift size={13} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Signup Widget */}
              <div className="bg-[#0C101F] border border-white/[0.04] rounded-3xl p-5.5 space-y-4 text-center">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-extrabold text-white">Lưu lại tiến trình của bạn!</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                    Tạo tài khoản miễn phí để lưu trữ mọi tiến trình học tập.
                  </p>
                </div>
                <Link 
                  href="/signup"
                  className="w-full bg-[#5856D6] hover:bg-[#4F4DD4] text-white text-xs font-bold py-3 rounded-2xl transition-all shadow-[0_4px_12px_rgba(88,86,214,0.25)] block text-center cursor-pointer"
                >
                  Đăng nhập / Tạo tài khoản
                </Link>
              </div>

            </aside>

          </div>
        </div>

      </div>

    </div>
  );
}
