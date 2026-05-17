'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { trackTelemetry } from '@/lib/observability/observability';
import { useEffect } from 'react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'user';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'teacher'>(defaultRole as 'user' | 'teacher');

  useEffect(() => {
    trackTelemetry('signup_started', { role: defaultRole });
  }, [defaultRole]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) { setError('Vui lòng nhập họ và tên.'); return; }
    if (!email.trim()) { setError('Vui lòng nhập email.'); return; }
    if (password.length < 8) { setError('Mật khẩu phải có ít nhất 8 ký tự.'); return; }

    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
          },
          // emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.');
        } else if (authError.message.includes('Password should')) {
          setError('Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.');
        } else {
          setError(authError.message);
        }
        return;
      }

      // If email confirmation is disabled in Supabase, session is immediate
      if (data.session) {
        trackTelemetry('signup_completed', { role });
        router.push('/dashboard');
        router.refresh();
      } else {
        // Require email confirmation
        setSuccess(true);
        trackTelemetry('signup_completed', { role, requiresEmailConfirmation: true });
      }
    } catch (err: any) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display font-black text-white">Kiểm tra hộp thư!</h2>
            <p className="text-white/40 text-sm">
              Chúng tôi đã gửi link xác nhận tới <span className="text-white font-bold">{email}</span>.
              Nhấp vào link để hoàn tất đăng ký.
            </p>
          </div>
          <Link href="/login" className="inline-block px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-amber-400 transition-colors">
            Về trang đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px]" />
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
          <p className="text-white/40 text-sm mt-3">Bắt đầu hành trình miễn phí</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 space-y-5">
          <div className="space-y-1">
            <h1 className="text-xl font-display font-black text-white">Tạo tài khoản</h1>
            <p className="text-white/40 text-xs">Miễn phí. Không cần thẻ tín dụng.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'user' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Học sinh / THPT
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'teacher' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Giáo viên
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 transition-colors disabled:opacity-50"
              />
            </div>

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
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  autoComplete="new-password"
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
              {/* Password strength hint */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 12 ? 'bg-emerald-500' : 'bg-amber-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                role === 'teacher' ? 'Đăng ký Giáo viên' : 'Đăng ký miễn phí'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/40">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Đăng nhập
            </Link>
          </p>

          <p className="text-center text-[10px] text-white/20 leading-relaxed">
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <span className="underline cursor-pointer">Điều khoản sử dụng</span>{' '}
            và{' '}
            <span className="underline cursor-pointer">Chính sách bảo mật</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
