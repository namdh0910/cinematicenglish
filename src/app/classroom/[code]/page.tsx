'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, GraduationCap, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { joinClassroomByCode } from '@/app/actions/classroom';

function JoinClassroomContent() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase();

  const [status, setStatus] = useState<'joining' | 'success' | 'error' | 'already'>('joining');
  const [errorMsg, setErrorMsg] = useState('');
  const [classroomName, setClassroomName] = useState('');

  useEffect(() => {
    if (!code) return;

    const join = async () => {
      const result = await joinClassroomByCode(code);
      if (result.success && result.data) {
        setClassroomName(result.data.name ?? '');
        setStatus('success');
        // Redirect to dashboard after 2s
        setTimeout(() => router.push('/dashboard'), 2500);
      } else {
        if (result.error?.includes('đã là thành viên')) {
          setStatus('already');
          setClassroomName('lớp học này');
        } else {
          setStatus('error');
          setErrorMsg(result.error ?? 'Có lỗi xảy ra.');
        }
      }
    };

    join();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto">
          <GraduationCap size={28} className="text-violet-400" />
        </div>

        {/* Joining state */}
        {status === 'joining' && (
          <>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-black text-white">Đang tham gia lớp học...</h2>
              <p className="text-white/40 text-sm">Mã lớp: <span className="font-mono font-bold text-white">{code}</span></p>
            </div>
            <Loader2 size={32} className="animate-spin text-violet-400 mx-auto" />
          </>
        )}

        {/* Success state */}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-black text-white">Tham gia thành công!</h2>
              <p className="text-white/40 text-sm">
                Bạn đã tham gia <span className="text-white font-bold">{classroomName}</span>.
                Đang chuyển hướng về Bảng học tập...
              </p>
            </div>
            <Loader2 size={20} className="animate-spin text-white/30 mx-auto" />
          </>
        )}

        {/* Already a member */}
        {status === 'already' && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Users size={32} className="text-amber-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-black text-white">Bạn đã ở trong lớp này rồi</h2>
              <p className="text-white/40 text-sm">Bạn đã là thành viên của {classroomName}.</p>
            </div>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-amber-400 transition-colors"
            >
              Về Bảng học tập
            </Link>
          </>
        )}

        {/* Error state */}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-black text-white">Không thể tham gia</h2>
              <p className="text-white/40 text-sm">{errorMsg}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-sm hover:bg-amber-400 transition-colors"
              >
                Thử lại
              </button>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function JoinClassroomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <JoinClassroomContent />
    </Suspense>
  );
}
