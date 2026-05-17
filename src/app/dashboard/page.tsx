"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Settings, Bell, Search, LayoutGrid, Compass, Mic, Sparkles, Trophy, Clock, GraduationCap, TrendingUp, BookOpen, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import HomeZone from "@/components/dashboard/HomeZone";
import LearnZone from "@/components/dashboard/LearnZone";
import ProgressZone from "@/components/dashboard/ProgressZone";
import SocialZone from "@/components/dashboard/SocialZone";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <Section container={true}>
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-display font-black tracking-tight"
              >
                Chào buổi sáng, <span className="gradient-text-violet">Protagonist</span>.
              </motion.h1>
              <p className="text-lg text-secondary">
                Hôm nay là một ngày tuyệt vời để tiếp tục hành trình chuyển hóa của bạn.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 rounded-2xl glass hover:bg-white/10 transition-all">
                <Search size={20} className="text-secondary" />
              </button>
              <button className="p-3 rounded-2xl glass hover:bg-white/10 transition-all relative">
                <Bell size={20} className="text-secondary" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full border-2 border-primary" />
              </button>
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border-white/10 overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 w-fit mb-10 overflow-x-auto no-scrollbar">
            {[
              { id: 'home', label: 'Trung tâm', icon: LayoutGrid },
              { id: 'learn', label: 'Học tập', icon: BookOpen },
              { id: 'progress', label: 'Tiến trình', icon: TrendingUp },
              { id: 'social', label: 'Cộng đồng', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-black shadow-glow-gold' : 'text-white/40 hover:text-white'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'home' ? (
                  <motion.div
                    key="home-content"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <HomeZone />
                  </motion.div>
                ) : activeTab === 'learn' ? (
                  <motion.div
                    key="learn-content"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <LearnZone />
                  </motion.div>
                ) : activeTab === 'progress' ? (
                  <motion.div
                    key="progress-content"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ProgressZone />
                  </motion.div>
                ) : activeTab === 'social' ? (
                  <motion.div
                    key="social-content"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <SocialZone />
                  </motion.div>
                ) : (
                  <motion.div
                    key="other-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center glass rounded-[48px] border-white/5"
                  >
                    <p className="text-white/20 italic">Tính năng {activeTab} đang được đồng bộ hóa...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar / Quick Stats */}
            <aside className="space-y-6">
              <div className="p-6 rounded-[32px] glass border-white/5 space-y-6">
                <h3 className="font-display font-bold text-lg">Thống kê hào quang</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary font-bold uppercase tracking-widest">Độ trôi chảy</span>
                    <span className="text-xs font-mono text-emerald-400">+12%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-emerald-500 shadow-glow-emerald" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary font-bold uppercase tracking-widest">Sự tự tin</span>
                    <span className="text-xs font-mono text-amber-400">+8%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-amber-400 shadow-glow-gold" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link 
                    href="/coach"
                    className="w-full py-4 rounded-xl bg-violet-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-violet-400 transition-all shadow-glow-violet"
                  >
                    <Mic size={18} /> Luyện nói ngay
                  </Link>
                </div>
              </div>

              {/* Lối tắt các phòng tính năng */}
              <div className="p-6 rounded-[32px] glass border-white/5 space-y-4">
                <h3 className="font-display font-bold text-sm text-white/40 uppercase tracking-widest">Phòng tính năng</h3>
                
                <div className="space-y-2">
                  <Link href="/dashboard/speaking-analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer block">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors block">Phân tích phát âm AI</span>
                      <span className="text-[9px] text-white/30 font-bold uppercase block">CEFR & Fluency Matrix</span>
                    </div>
                  </Link>

                  <Link href="/exam/ielts-foundation-test" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer block">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">Đấu trường Khảo thí</span>
                      <span className="text-[9px] text-white/30 font-bold uppercase block">IELTS & Timed Exams</span>
                    </div>
                  </Link>

                  <Link href="/classroom/eng10a1" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer block">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                      <GraduationCap size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors block">Lớp học Học sinh</span>
                      <span className="text-[9px] text-white/30 font-bold uppercase block">ENG10A1 Feed & streak</span>
                    </div>
                  </Link>

                  <Link href="/teacher" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer block">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors block">Cổng Giáo viên</span>
                      <span className="text-[9px] text-white/30 font-bold uppercase block">Teacher Command Hub</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-[32px] bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20">
                <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <Sparkles size={16} /> Tip của ngày
                </h4>
                <p className="text-xs text-white/60 leading-relaxed italic">
                  "Hãy tập trung vào hơi thở khi luyện nói. Sự bình tĩnh chính là nền tảng của quyền lực ngôn ngữ."
                </p>
              </div>
            </aside>
          </div>
        </Section>
      </main>
    </div>
  );
}
