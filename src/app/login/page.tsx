'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn.');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <GraduationCap size={18} className="text-black" />
            </div>
            <span className="text-lg font-display font-black">Cinematic<span className="text-amber-500">English</span></span>
          </Link>
          <p className="text-white/40 text-sm mt-3">Nền tảng học Tiếng Anh cao cấp</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 space-y-5">
          <div className="space-y-1">
            <h1 className="text-xl font-display font-black text-white">Đăng nhập</h1>
            <p className="text-white/40 text-xs">Tiếp tục hành trình học tập của bạn</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hoten@email.com"
                autoComplete="email"
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Mật khẩu</label>
                <Link href="/forgot-password" className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs">hoặc</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-xs text-white/40">
            Chưa có tài khoản?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Đăng ký miễn phí
            </Link>
          </p>

          {/* Teacher link */}
          <p className="text-center text-[11px] text-white/20">
            Là giáo viên?{' '}
            <Link href="/signup?role=teacher" className="text-white/40 hover:text-white/60 transition-colors">
              Đăng ký tài khoản giáo viên
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
