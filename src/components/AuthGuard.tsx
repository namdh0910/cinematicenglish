'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  // If user is authenticated, render page content normally
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If NOT authenticated, show the gorgeous frosted-glass cinematic modal overlaying blurred children!
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blur the main children content behind the modal */}
      <div className="blur-2xl pointer-events-none select-none opacity-20">
        {children}
      </div>

      {/* Cinematic Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[12px]">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/15 via-transparent to-amber-500/5 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0a0a0f]/90 border border-white/10 rounded-[32px] p-8 md:p-10 text-center space-y-6 shadow-[0_0_50px_rgba(139,92,246,0.25)] overflow-hidden"
        >
          {/* Decorative radial lighting */}
          <div className="absolute -left-20 -top-20 w-44 h-44 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <GraduationCap size={32} className="text-white" />
          </div>

          {/* Heading */}
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-display font-black text-white leading-tight">
              Bắt đầu Hành trình Phản xạ
            </h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
              Vui lòng đăng nhập để lưu trữ tiến độ phản xạ của bạn và đồng bộ hóa các bài học phim hấp dẫn.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-2 relative z-10">
            <Link href="/signup" className="w-full">
              <button className="w-full py-4 rounded-2xl bg-white text-black font-display font-black uppercase text-xs tracking-widest hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)]">
                Đăng ký tài khoản
              </button>
            </Link>

            <Link href="/login" className="w-full">
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 font-display font-black uppercase text-xs tracking-widest transition-all">
                Đăng nhập
              </button>
            </Link>
          </div>

          {/* Home Link */}
          <Link href="/" className="inline-block text-[11px] text-white/30 hover:text-white/50 transition-colors uppercase tracking-widest font-black pt-2 relative z-10">
            Quay lại trang chủ
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
