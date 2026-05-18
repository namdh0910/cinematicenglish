"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const simplifiedLinks = [
  { label: "Khám phá", href: "/stories" },
  { label: "Học tiếp", href: "/dashboard" }
];

const NAV_HEIGHT = 72;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<'guest' | 'student' | 'teacher' | 'admin'>('guest');

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then((result: any) => {
      const session = result?.data?.session;
      if (session) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single().then((profileResult: any) => {
          if (profileResult?.data?.role) setRole(profileResult.data.role);
          else setRole('student');
        });
      }
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent py-2"
        }`}
        style={{ height: `${NAV_HEIGHT}px` }}
      >
        <div className="container-custom h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={closeMenu}>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Play size={16} fill="black" className="ml-1 text-black" />
            </div>
            <span className="font-display font-black text-lg tracking-tight">Cinematic</span>
          </Link>

          {/* Desktop Nav - Ultra Simplified */}
          <nav className="hidden md:flex items-center gap-8">
            {role !== 'guest' && simplifiedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-bold text-white/60 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {role === 'guest' ? (
              <>
                <Link href="/login" className="text-sm font-bold text-white/80 hover:text-white">Đăng nhập</Link>
                <Link href="/signup" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform">
                  Bắt đầu
                </Link>
              </>
            ) : (
              <Link href="/#pricing" className="px-5 py-2.5 rounded-full bg-violet-600 text-white text-sm font-black uppercase tracking-widest hover:bg-violet-500 transition-colors shadow-glow-violet">
                Gói PRO
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-[80px] px-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {role !== 'guest' && simplifiedLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className="text-2xl font-display font-black text-white border-b border-white/10 pb-4"
                >
                  {l.label}
                </Link>
              ))}
              
              {role === 'guest' ? (
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/login" onClick={closeMenu} className="py-4 text-center rounded-2xl bg-white/10 font-bold text-white">Đăng nhập</Link>
                  <Link href="/signup" onClick={closeMenu} className="py-4 text-center rounded-2xl bg-white text-black font-black uppercase">Bắt đầu miễn phí</Link>
                </div>
              ) : (
                <Link href="/#pricing" onClick={closeMenu} className="mt-8 py-4 text-center rounded-2xl bg-violet-600 text-white font-black uppercase tracking-widest shadow-glow-violet">
                  Nâng cấp PRO
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
