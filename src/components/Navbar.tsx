"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const studentNavLinks = [
  { label: "Luyện nhanh", href: "/practice" },
  { label: "Thư viện", href: "/stories" },
  { label: "Học tập", href: "/learn" },
  { label: "Lớp học", href: "/classroom/eng10a1" },
  { label: "HLV Phát Âm", href: "/coach" },
];

const teacherNavLinks = [
  { label: "Quản lý Lớp", href: "/teacher" },
  { label: "Giao bài", href: "/teacher/assignments" },
];

const adminNavLinks = [
  { label: "Bảng điều khiển", href: "/admin" },
  { label: "Thống kê & Đo lường", href: "/admin/telemetry" },
];

const guestNavLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Thư viện", href: "/stories" },
];

// Actual navbar height in px (keep in sync with py-4/py-5 + logo 40px)
const NAV_HEIGHT = 72;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<'guest' | 'student' | 'teacher' | 'admin'>('guest');

  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => {
          if (data?.role) setRole(data.role as any);
          else setRole('student');
        });
      }
    });
  }, []);

  const navLinks = 
    role === 'admin' ? adminNavLinks : 
    role === 'teacher' ? teacherNavLinks : 
    role === 'student' ? studentNavLinks : 
    guestNavLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav py-3" : "py-4"
        }`}
        style={{ height: `${NAV_HEIGHT}px` }}
      >
        <div className="container-custom h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={closeMenu}>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow-violet"
              style={{ background: "var(--gradient-violet)" }}
            >
              <Zap size={18} className="text-white" fill="white" />
            </motion.div>
            <span className="font-display font-black text-lg tracking-tighter">
              Cinematic<span className="gradient-text-gold">English</span>
            </span>
          </Link>

          {/* Desktop Nav Links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs — hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            {role === 'guest' ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border-medium)", background: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-glass-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{ background: "var(--gradient-violet)" }}
                >
                  Bắt đầu ngay
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/dashboard'}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border-medium)", background: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-glass-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Bảng điều khiển
                </Link>
                {role === 'student' && (
                  <Link
                    href="/#pricing"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200"
                    style={{ background: "var(--gradient-violet)" }}
                  >
                    Gói Pro
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger — only visible on mobile */}
          <button
            className="md:hidden p-2.5 rounded-xl glass hover:bg-white/10 transition-colors active:scale-95 z-10"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} className="text-white" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={22} className="text-white" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs z-50 md:hidden flex flex-col"
              style={{
                background: "rgba(10, 10, 16, 0.98)",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 shrink-0"
                style={{ height: `${NAV_HEIGHT}px`, borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="font-display font-black text-sm gradient-text-gold uppercase tracking-widest">
                  Menu
                </span>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
                  aria-label="Đóng menu"
                >
                  <X size={18} className="text-white/70" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-semibold transition-all active:scale-95"
                      style={{ color: "var(--text-secondary)" }}
                      onTouchStart={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onTouchEnd={(e) => (e.currentTarget.style.background = "")}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA buttons at bottom */}
              <div
                className="px-4 py-6 space-y-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {role === 'guest' ? (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center w-full py-4 rounded-2xl text-sm font-bold border transition-all active:scale-95"
                      style={{ color: "var(--text-primary)", borderColor: "var(--border-medium)", background: "var(--bg-glass)" }}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="flex items-center justify-center w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
                      style={{ background: "var(--gradient-violet)" }}
                    >
                      Bắt đầu ngay ✦
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/dashboard'}
                      onClick={closeMenu}
                      className="flex items-center justify-center w-full py-4 rounded-2xl text-sm font-bold border transition-all active:scale-95"
                      style={{ color: "var(--text-primary)", borderColor: "var(--border-medium)", background: "var(--bg-glass)" }}
                    >
                      Bảng điều khiển
                    </Link>
                    {role === 'student' && (
                      <Link
                        href="/#pricing"
                        onClick={closeMenu}
                        className="flex items-center justify-center w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
                        style={{ background: "var(--gradient-violet)" }}
                      >
                        Gói Pro ✦
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
