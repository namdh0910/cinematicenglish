"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Play, LogOut, Flame, LayoutDashboard, Sparkles, User, BookOpen, Trophy, Target, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const simplifiedLinks = [
  { label: "Học SGK", href: "/learn?tab=learn", baseHref: "/learn", tab: "learn", icon: BookOpen },
  { label: "Chữ cái", href: "/learn?tab=alphabet", baseHref: "/learn", tab: "alphabet", icon: Globe },
  { label: "Bảng xếp hạng", href: "/learn?tab=leaderboard", baseHref: "/learn", tab: "leaderboard", icon: Trophy },
  { label: "Nhiệm vụ", href: "/learn?tab=quests", baseHref: "/learn", tab: "quests", icon: Target },
  { label: "Hồ sơ", href: "/learn?tab=profile", baseHref: "/learn", tab: "profile", icon: User }
];

const NAV_HEIGHT = 72;

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  subscriptionPlan: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const isLightMode = pathname.startsWith("/learn") || pathname.startsWith("/dashboard") || pathname.startsWith("/journal") || pathname.startsWith("/feed");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // Mobile menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Desktop profile dropdown state
  
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("learn");

  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setActiveTab(params.get("tab") || "learn");
      }
    };
    
    handleUrlChange();
    
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [pathname]);

  // Load auth state and listen to changes
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const fetchUserData = async (userId: string, email: string) => {
      try {
        // 1. Fetch Profile Info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, role, subscription_plan')
          .eq('id', userId)
          .single();

        if (profileData) {
          setRole(profileData.role === 'admin' ? 'admin' : 'student');
          setProfile({
            id: userId,
            email: email,
            fullName: profileData.full_name || email.split('@')[0],
            avatarUrl: profileData.avatar_url || '',
            subscriptionPlan: profileData.subscription_plan || 'free',
            role: profileData.role || 'student'
          });
        } else {
          // Fallback if profile trigger hasn't finished yet
          setRole('student');
          setProfile({
            id: userId,
            email: email,
            fullName: email.split('@')[0],
            avatarUrl: '',
            subscriptionPlan: 'free',
            role: 'student'
          });
        }

        // 2. Fetch Streak Info
        const { data: streakData } = await supabase
          .from('daily_streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .single();

        if (streakData) {
          setStreakCount(streakData.current_streak);
        } else {
          setStreakCount(0);
        }
      } catch (err) {
        console.error("Error loading user details:", err);
      }
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id, session.user.email || '');
      } else {
        // Clear state if no session
        setRole('guest');
        setProfile(null);
        setStreakCount(0);
      }
    });

    // Listen to changes (auto-detect login, logout, session expiration)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUserData(session.user.id, session.user.email || '');
      } else {
        setRole('guest');
        setProfile(null);
        setStreakCount(0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Block body scroll when mobile menu open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      
      // Clear state
      setRole('guest');
      setProfile(null);
      setStreakCount(0);
      closeMenu();
      
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100"
        style={{ height: `${NAV_HEIGHT}px` }}
      >
        <div className="w-full max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={closeMenu}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md bg-[#3B82F6]">
              <Play size={14} fill="white" className="ml-0.5 text-white" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-[#1A1A18]">Global Success</span>
          </Link>

          {/* Desktop Nav Links (Only if logged in) */}
          {role !== 'guest' && (
            <nav className="hidden md:flex items-center gap-8">
               {simplifiedLinks.map((l) => {
                const isActive = pathname === l.baseHref && activeTab === l.tab;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-[14px] font-medium tracking-[-0.01em] transition-colors flex items-center gap-1.5 pb-[2px] ${
                      isActive 
                        ? "text-[#3B82F6] border-b-2 border-[#3B82F6]" 
                        : "text-[#3D3D3B] hover:text-[#3B82F6] hover:border-b-2 hover:border-[#3B82F6]"
                    }`}
                  >
                    <l.icon size={15} />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-5">
            {role === 'guest' ? (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-blue-600 text-white rounded-2xl px-6 py-2 font-bold shadow-[0_6px_0_rgb(37,99,235)] active:shadow-[0_0px_0_rgb(37,99,235)] active:translate-y-[6px] transition-all hover:brightness-105"
                >
                  Học miễn phí
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4" ref={dropdownRef}>
                
                {/* Streak flame indicator */}
                <div className="flex items-center gap-1 px-[10px] py-[4px] bg-[#FFF3E0] text-[#B45309] rounded-[20px] font-semibold text-[13px] select-none border border-[#FFE0B2]">
                  <Flame size={14} className="fill-[#B45309] text-[#B45309]" />
                  <span>{streakCount} NGÀY</span>
                </div>

                {/* Avatar drop target */}
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 focus:outline-none"
                    aria-label="User menu"
                  >
                    {profile?.avatarUrl ? (
                      <img 
                        src={profile.avatarUrl} 
                        alt={profile.fullName} 
                        className="w-8 h-8 rounded-full border border-white/20 hover:border-violet-500 transition-colors object-cover" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-[#3B82F6] transition-colors flex items-center justify-center text-xs font-black uppercase shadow-sm">
                        {profile?.fullName ? profile.fullName.charAt(0) : <User size={14} />}
                      </div>
                    )}
                  </button>

                  {/* Desktop Dropdown card */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 mt-3 w-56 border rounded-2xl p-3 shadow-2xl flex flex-col gap-1.5 ${
                          isLightMode
                            ? "bg-white/95 border-slate-200/80 text-slate-800"
                            : "bg-black/90 border-white/10 text-white"
                        }`}
                      >
                        {/* User Profile header */}
                        <div className={`p-2 border-b mb-1.5 flex flex-col gap-0.5 ${isLightMode ? "border-slate-100" : "border-white/5"}`}>
                          <p className={`text-xs font-black truncate max-w-full ${isLightMode ? "text-slate-800" : "text-white"}`}>{profile?.fullName}</p>
                          <p className={`text-[10px] truncate max-w-full ${isLightMode ? "text-slate-400" : "text-white/40"}`}>{profile?.email}</p>
                          
                          {/* Plan Badge */}
                          <div className="mt-1.5 self-start">
                            {profile?.subscriptionPlan === 'free' ? (
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${isLightMode ? "bg-slate-100 text-slate-600" : "bg-white/10 text-white/70"}`}>
                                Free Plan
                              </span>
                            ) : (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-violet-600 text-white flex items-center gap-0.5 animate-pulse shadow-glow-violet">
                                <Sparkles size={8} fill="white" />
                                PRO Member
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dropdown Options */}
                        <Link href="/learn?tab=learn" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <BookOpen size={14} />
                          Học SGK
                        </Link>

                        <Link href="/learn?tab=alphabet" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <Globe size={14} />
                          Chữ cái
                        </Link>

                        <Link href="/learn?tab=leaderboard" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <Trophy size={14} />
                          Bảng xếp hạng
                        </Link>

                        <Link href="/learn?tab=quests" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <Target size={14} />
                          Nhiệm vụ
                        </Link>

                        <Link href="/learn?tab=profile" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <User size={14} />
                          Hồ sơ
                        </Link>

                        {profile?.subscriptionPlan === 'free' && (
                          <Link href="/#pricing" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-black transition-colors ${
                            isLightMode ? "text-[#3B82F6] hover:text-blue-700 hover:bg-blue-50" : "text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                          }`}>
                            <Sparkles size={14} fill="currentColor" />
                            Nâng cấp PRO
                          </Link>
                        )}

                        <div className={`h-px my-1 ${isLightMode ? "bg-slate-100" : "bg-white/5"}`} />

                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-bold transition-colors text-left"
                        >
                          <LogOut size={14} />
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${isLightMode ? "text-slate-800" : "text-white"}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-[#F7F7F5] pt-[80px] px-6 md:hidden flex flex-col justify-between pb-8"
          >
            <div className="flex flex-col gap-6 mt-4">
              
              {/* Profile Card if Logged in */}
              {role !== 'guest' && profile && (
                <div className="flex items-center gap-3 p-4 bg-[#FFFFFF] border border-[#EBEBEA] rounded-2xl shadow-sm">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.fullName} 
                      className="w-12 h-12 rounded-full border border-blue-200 object-cover" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-sm font-black uppercase text-[#3B82F6] shadow-sm">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#1A1A18] truncate">{profile.fullName}</p>
                    <p className="text-xs text-[#6B6B68] truncate">{profile.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#FFF3E0] border border-[#FFE0B2] px-2 py-0.5 rounded-full text-[#B45309] text-[10px] font-black">
                        <Flame size={10} className="fill-[#B45309]" />
                        <span>{streakCount} NGÀY</span>
                      </div>
                      
                      {profile.subscriptionPlan === 'pro' && (
                        <div className="flex items-center gap-0.5 bg-[#3B82F6] text-white px-2 py-0.5 rounded text-[10px] font-black">
                          <Sparkles size={8} fill="white" />
                          <span>PRO</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4">
                {role !== 'guest' ? (
                  <>
                    <Link
                      href="/learn?tab=learn"
                      onClick={closeMenu}
                      className="text-lg font-bold text-[#3D3D3B] hover:text-[#3B82F6] flex items-center gap-3 py-3 border-b border-[#EBEBEA]"
                    >
                      <BookOpen size={18} />
                      Học SGK
                    </Link>

                    <Link
                      href="/learn?tab=alphabet"
                      onClick={closeMenu}
                      className="text-lg font-bold text-[#3D3D3B] hover:text-[#3B82F6] flex items-center gap-3 py-3 border-b border-[#EBEBEA]"
                    >
                      <Globe size={18} />
                      Chữ cái
                    </Link>

                    <Link
                      href="/learn?tab=leaderboard"
                      onClick={closeMenu}
                      className="text-lg font-bold text-[#3D3D3B] hover:text-[#3B82F6] flex items-center gap-3 py-3 border-b border-[#EBEBEA]"
                    >
                      <Trophy size={18} />
                      Bảng xếp hạng
                    </Link>

                    <Link
                      href="/learn?tab=quests"
                      onClick={closeMenu}
                      className="text-lg font-bold text-[#3D3D3B] hover:text-[#3B82F6] flex items-center gap-3 py-3 border-b border-[#EBEBEA]"
                    >
                      <Target size={18} />
                      Nhiệm vụ
                    </Link>

                    <Link
                      href="/learn?tab=profile"
                      onClick={closeMenu}
                      className="text-lg font-bold text-[#3D3D3B] hover:text-[#3B82F6] flex items-center gap-3 py-3 border-b border-[#EBEBEA]"
                    >
                      <User size={18} />
                      Hồ sơ
                    </Link>

                    {profile?.subscriptionPlan === 'free' && (
                      <Link
                        href="/#pricing"
                        onClick={closeMenu}
                        className="text-lg font-black text-[#3B82F6] flex items-center gap-3 py-3 border-b border-[#EBEBEA]"
                      >
                        <Sparkles size={18} fill="currentColor" />
                        Nâng cấp PRO
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    <Link 
                      href="/login" 
                      onClick={closeMenu} 
                      className="py-4 text-center rounded-2xl bg-[#FFFFFF] border border-[#EBEBEA] font-bold text-[#3D3D3B] shadow-sm hover:bg-[#EFF6FF]"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={closeMenu} 
                      className="py-4 text-center rounded-2xl bg-[#3B82F6] text-white font-black uppercase tracking-wider shadow-md hover:bg-[#2563EB]"
                    >
                      Bắt đầu miễn phí
                    </Link>
                  </div>
                )}
              </nav>
            </div>

            {/* Logout at bottom for mobile logged in */}
            {role !== 'guest' && (
              <button
                onClick={handleLogout}
                className="w-full py-4 text-center rounded-2xl bg-red-50 border border-red-200 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100"
              >
                <LogOut size={16} />
                Đăng xuất tài khoản
              </button>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
