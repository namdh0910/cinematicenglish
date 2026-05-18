"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Flame, TrendingUp, Clock, Save, X, Check, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Dữ liệu mẫu (sẽ được thay bằng dữ liệu thật từ Supabase)
const RECENT_LESSONS = [
  { id: "1", title: "The Dark Knight - Interrogation Scene", date: "Hôm nay", score: 92 },
  { id: "2", title: "The Godfather - An offer he can't refuse", date: "Hôm qua", score: 85 },
  { id: "3", title: "Steve Jobs - Stanford Commencement", date: "2 ngày trước", score: 88 },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
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
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (userProfile) {
          setProfile(userProfile);
          setEditName(userProfile.full_name || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#050508] min-h-screen text-white pb-24">
      <Navbar />
      
      <div className="w-full flex justify-center px-4 pt-28">
        <main className="w-full max-w-2xl space-y-8">
        
        {/* 1. WELCOME & SETTINGS */}
        <div className="flex items-center justify-between bg-[#101014] p-6 rounded-3xl border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black">
              Chào, <span className="text-amber-500">{profile?.full_name || 'Học viên'}</span>.
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-secondary font-bold">
              <Flame size={16} className="text-orange-500" /> Chuỗi học: <span className="text-white">5 ngày</span>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Settings size={20} className="text-white/60" />
          </button>
        </div>

        {/* 2. CONTINUE LEARNING (Primary CTA) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white/60 uppercase tracking-widest text-[11px]">Học tiếp</h2>
          <div className="relative p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-violet-600 to-indigo-900 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-black/30 text-[10px] font-black uppercase tracking-widest mb-2">Đang học dở</div>
                <h3 className="text-2xl font-display font-black text-white">The Wolf of Wall Street</h3>
                <p className="text-white/70 text-sm">Cảnh: Bài phát biểu bán hàng xuất sắc nhất.</p>
              </div>
              
              <Link href="/learn/lesson/wolf-1" className="shrink-0">
                <button className="w-full md:w-auto px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-glow-violet">
                  <Play size={18} fill="black" /> Học ngay
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. PRONUNCIATION PROGRESS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white/60 uppercase tracking-widest text-[11px]">Tiến độ phát âm</h2>
          <div className="bg-[#101014] p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold flex items-center gap-2"><Mic size={16} className="text-emerald-400"/> Độ tự tin (Fluency)</span>
              <span className="font-mono text-emerald-400 font-bold">85%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-emerald-400 shadow-glow-emerald" />
            </div>
            <p className="text-xs text-secondary">Bạn phát âm rất rõ ràng, cần cải thiện thêm ngữ điệu nối từ (linking words).</p>
          </div>
        </div>

        {/* 4. RECENT LESSONS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white/60 uppercase tracking-widest text-[11px]">Lịch sử luyện tập</h2>
          <div className="space-y-3">
            {RECENT_LESSONS.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#101014] border border-white/5 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{lesson.title}</h4>
                    <span className="text-xs text-secondary">{lesson.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-black font-mono">{lesson.score}</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/30">Điểm AI</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>

      {/* CÀI ĐẶT NHANH MODAL */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-black/80" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative z-10 w-full max-w-md bg-[#1a1a24] rounded-3xl md:rounded-[32px] p-6 space-y-6 border border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xl">Cài đặt</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 bg-white/10 rounded-full"><X size={16} /></button>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Tên hiển thị</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-black uppercase rounded-xl">Lưu thay đổi</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
