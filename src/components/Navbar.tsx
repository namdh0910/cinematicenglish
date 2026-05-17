"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";

const navLinks = [
  { label: "Thư viện", href: "/stories" },
  { label: "Học tập", href: "/learn" },
  { label: "Lớp học", href: "/classroom/eng10a1" },
  { label: "HLV Phát Âm", href: "/coach" },
  { label: "Trò chuyện", href: "/chat" },
  { label: "Giáo viên", href: "/teacher" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav py-3" : "py-5"
        }`}
      >
        <div className="container-custom flex-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-violet"
              style={{ background: "var(--gradient-violet)" }}
            >
              <Zap size={20} className="text-white" fill="white" />
            </motion.div>
            <span className="font-display font-black text-xl tracking-tighter">
              Cinematic<span className="gradient-text-gold">English</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-all duration-200 text-secondary hover:text-primary"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </Button>
            <Button variant="primary" size="sm" onClick={() => window.location.href = '/#pricing'}>
              Gói Pro
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl glass hover:bg-glass-hover transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[64px] left-0 right-0 z-40 md:hidden glass-nav overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-4 rounded-xl text-base font-medium glass hover:bg-glass-hover transition-all"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="ghost" fullWidth onClick={() => { setOpen(false); window.location.href='/dashboard'; }}>
                  Dashboard
                </Button>
                <Button variant="primary" fullWidth onClick={() => { setOpen(false); window.location.href='/#pricing'; }}>
                  Gói Pro
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
