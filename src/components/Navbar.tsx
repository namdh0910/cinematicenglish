"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Play, LogOut, Flame, Compass, LayoutDashboard, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const simplifiedLinks = [
  { label: "Khám phá", href: "/stories", icon: Compass },
  { label: "Lịch sử học", href: "/dashboard", icon: LayoutDashboard }
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isLightMode
              ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
              : "bg-black/85 backdrop-blur-md border-b border-white/10"
            : "bg-transparent py-2"
        }`}
        style={{ height: `${NAV_HEIGHT}px` }}
      >
        <div className="container-custom h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={closeMenu}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ${isLightMode ? "bg-blue-600" : "bg-white"}`}>
              <Play size={14} fill={isLightMode ? "white" : "black"} className={`ml-0.5 ${isLightMode ? "text-white" : "text-black"}`} />
            </div>
            <span className={`font-display font-black text-lg tracking-tight ${isLightMode ? "text-slate-800" : "text-white"}`}>Cinematic</span>
          </Link>

          {/* Desktop Nav Links (Only if logged in) */}
          {role !== 'guest' && (
            <nav className="hidden md:flex items-center gap-8">
              {simplifiedLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                    isLightMode ? "text-slate-500 hover:text-slate-800" : "text-white/60 hover:text-white"
                  }`}
                >
                  <l.icon size={15} />
                  {l.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-5">
            {role === 'guest' ? (
              <>
                <Link href="/login" className={`text-sm font-bold transition-colors ${isLightMode ? "text-slate-600 hover:text-slate-800" : "text-white/70 hover:text-white"}`}>
                  Đăng nhập
                </Link>
                <Link href="/signup" className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md ${
                  isLightMode ? "bg-blue-600 text-white hover:bg-blue-750" : "bg-white text-black"
                }`}>
                  Bắt đầu
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4" ref={dropdownRef}>
                
                {/* Streak flame indicator */}
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black select-none border ${
                  isLightMode 
                    ? "bg-orange-50 border-orange-100 text-orange-600" 
                    : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                }`}>
                  <Flame size={14} className="fill-orange-500 animate-pulse" />
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
                      <div className={`w-8 h-8 rounded-full border transition-colors flex items-center justify-center text-xs font-black uppercase shadow-sm ${
                        isLightMode
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : "bg-violet-600 border-white/20 text-white shadow-glow-violet"
                      }`}>
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
                        <Link href="/stories" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <Compass size={14} />
                          Khám phá
                        </Link>

                        <Link href="/dashboard" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                          isLightMode ? "text-slate-600 hover:text-slate-800 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}>
                          <LayoutDashboard size={14} />
                          Lịch sử học
                        </Link>

                        {profile?.subscriptionPlan === 'free' && (
                          <Link href="/#pricing" onClick={closeMenu} className={`flex items-center gap-2 p-2 rounded-xl text-xs font-black transition-colors ${
                            isLightMode ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50" : "text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
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
            className="fixed inset-0 z-40 bg-black pt-[80px] px-6 md:hidden flex flex-col justify-between pb-8"
          >
            <div className="flex flex-col gap-6 mt-4">
              
              {/* Profile Card if Logged in */}
              {role !== 'guest' && profile && (
                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.fullName} 
                      className="w-12 h-12 rounded-full border border-white/20 object-cover" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-violet-600 border border-white/20 flex items-center justify-center text-sm font-black uppercase text-white shadow-glow-violet">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate">{profile.fullName}</p>
                    <p className="text-xs text-white/40 truncate">{profile.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-amber-500 text-[10px] font-black">
                        <Flame size={10} className="fill-amber-500" />
                        <span>{streakCount} NGÀY</span>
                      </div>
                      
                      {profile.subscriptionPlan === 'pro' && (
                        <div className="flex items-center gap-0.5 bg-violet-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
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
                      href="/stories"
                      onClick={closeMenu}
                      className="text-lg font-bold text-white/80 hover:text-white flex items-center gap-3 py-3 border-b border-white/5"
                    >
                      <Compass size={18} />
                      Khám phá
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="text-lg font-bold text-white/80 hover:text-white flex items-center gap-3 py-3 border-b border-white/5"
                    >
                      <LayoutDashboard size={18} />
                      Lịch sử học
                    </Link>

                    {profile?.subscriptionPlan === 'free' && (
                      <Link
                        href="/#pricing"
                        onClick={closeMenu}
                        className="text-lg font-black text-violet-400 flex items-center gap-3 py-3 border-b border-white/5 animate-pulse"
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
                      className="py-4 text-center rounded-2xl bg-white/5 border border-white/10 font-bold text-white"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={closeMenu} 
                      className="py-4 text-center rounded-2xl bg-white text-black font-black uppercase tracking-wider"
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
                className="w-full py-4 text-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold flex items-center justify-center gap-2"
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
