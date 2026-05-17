"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Bell, Search, LayoutGrid, Mic, Sparkles, Clock, GraduationCap, TrendingUp, BookOpen, Users, Save, X, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import HomeZone from "@/components/dashboard/HomeZone";
import LearnZone from "@/components/dashboard/LearnZone";
import ProgressZone from "@/components/dashboard/ProgressZone";
import SocialZone from "@/components/dashboard/SocialZone";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const AVATAR_PRESETS = [
  { name: "Felix (Học viên nam)", seed: "Felix", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { name: "Sarah (Học viên nữ)", seed: "Sarah", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Harley (Cá tính nam)", seed: "Harley", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harley" },
  { name: "Aneka (Cá tính nữ)", seed: "Aneka", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { name: "George (Tri thức)", seed: "George", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=George" },
  { name: "Lily (Năng động)", seed: "Lily", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily" },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  
  // Real Profile States
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userProfile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (userProfile) {
          setProfile(userProfile);
          setEditName(userProfile.full_name || "");
          setEditAvatar(userProfile.avatar_url || "");
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Họ và tên không được để trống!");
      return;
    }
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: editName.trim(),
            avatar_url: editAvatar.trim(),
            last_active: new Date().toISOString()
          })
          .eq("id", session.user.id);
        
        if (!error) {
          setProfile({
            ...profile,
            full_name: editName.trim(),
            avatar_url: editAvatar.trim()
          });
          setShowSettingsModal(false);
        } else {
          alert("Lỗi cập nhật: " + error.message);
        }
      }
    } catch (err) {
      alert("Lỗi hệ thống khi cập nhật profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  const currentAvatarUrl = editAvatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || 'Felix'}`;

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="page-top pb-20">
        <Section container={true}>
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-display font-black tracking-tight"
              >
                Chào buổi sáng, <span className="gradient-text-violet">{profile?.full_name || 'Học viên'}</span>.
              </motion.h1>
              <p className="text-lg text-secondary flex items-center gap-2">
                Học viên xuất sắc <span>•</span> <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">Cấp độ {profile?.role === 'admin' ? 'Quản trị viên' : (profile?.role === 'teacher' ? 'Giáo viên' : 'Protagonist')}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSettingsModal(true)} 
                className="p-3 rounded-2xl glass hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5 group"
                title="Cài đặt tài khoản"
              >
                <Settings size={20} className="text-secondary group-hover:rotate-45 transition-transform" />
                <span className="text-xs font-bold text-white/60 group-hover:text-white hidden sm:inline">Cài đặt</span>
              </button>
              
              <button className="p-3 rounded-2xl glass hover:bg-white/10 transition-all relative border border-white/5">
                <Bell size={20} className="text-secondary" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full border-2 border-primary" />
              </button>

              <div 
                onClick={() => setShowSettingsModal(true)}
                className="w-12 h-12 rounded-2xl glass flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer relative group"
                title="Đổi Avatar / Họ tên"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <img 
                      src={currentAvatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Settings size={14} className="text-white" />
                    </div>
                  </>
                )}
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
                    <HomeZone profile={profile} />
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
                    <ProgressZone profile={profile} />
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
              <div className="p-6 rounded-[32px] glass border border-white/5 space-y-6">
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
                    className="w-full py-4 rounded-xl bg-violet-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-violet-400 transition-all shadow-glow-violet block text-center"
                  >
                    <Mic size={18} /> Luyện nói ngay
                  </Link>
                </div>
              </div>

              {/* Lối tắt các phòng tính năng */}
              <div className="p-6 rounded-[32px] glass border border-white/5 space-y-4">
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

      {/* ─── SETTINGS MODAL (REAL PROFILE SETTINGS) ─── */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setShowSettingsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#0e0e12] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-6 md:p-8 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <Settings size={20} className="text-amber-500" /> Cập nhật thông tin cá nhân
                </h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  disabled={saving}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest block ml-1">Họ và tên</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    disabled={saving}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Avatar selection */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest block ml-1">Chọn ảnh đại diện hoạt họa</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = editAvatar === preset.url;
                      return (
                        <button
                          key={preset.seed}
                          type="button"
                          onClick={() => setEditAvatar(preset.url)}
                          disabled={saving}
                          className={`relative aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 transition-all p-1 flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400/5' : 'border-white/5 hover:border-white/20'}`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.seed} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                              <Check size={10} className="text-black font-black" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Avatar Seed or URL */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest block ml-1">Hoặc sử dụng Link ảnh ngoài (Tùy chọn)</label>
                  <input 
                    type="url"
                    value={editAvatar}
                    onChange={e => setEditAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    disabled={saving}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white/70 font-mono focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    disabled={saving}
                    className="flex-1 py-3.5 rounded-2xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-amber-400 text-black text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
