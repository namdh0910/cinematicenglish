'use client';
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  GraduationCap,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Share2,
  X,
  Zap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import { createClassroom, getTeacherClassrooms } from '@/app/actions/classroom';
import { trackTelemetry } from '@/lib/observability/observability';

interface Classroom {
  id: string;
  name: string;
  code: string;
  teacher_id: string;
  created_at: string;
  studentsCount: number;
  activeAssignments: number;
}

export default function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Post-creation success state
  const [newlyCreated, setNewlyCreated] = useState<Classroom | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTeacherClassrooms();
        setClassrooms(data);
      } catch (err) {
        setFetchError('Không thể tải danh sách lớp học. Vui lòng làm mới trang.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      setCreateError('Vui lòng nhập tên lớp học.');
      return;
    }
    setCreateError(null);
    startTransition(async () => {
      const result = await createClassroom({ name: newClassName });
      if (result.success && result.data) {
        const created: Classroom = { ...result.data, studentsCount: 0, activeAssignments: 0 };
        setClassrooms(prev => [created, ...prev]);
        setNewClassName('');
        setShowCreateModal(false);
        setNewlyCreated(created);
        trackTelemetry('classroom_created', { name: created.name });
      } else {
        setCreateError(result.error ?? 'Tạo lớp thất bại. Vui lòng thử lại.');
      }
    });
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // fallback for Android WebView
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const shareZalo = (code: string, name: string) => {
    const text = encodeURIComponent(`Thầy/Cô mời em vào lớp "${name}" trên Cinematic English. Mã lớp: ${code}\nTải ngay: https://cinematicenglish.vn`);
    window.open(`https://zalo.me/share?text=${text}`, '_blank');
  };

  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentsCount, 0);
  const totalAssignments = classrooms.reduce((acc, c) => acc + c.activeAssignments, 0);

  return (
    <div className="bg-primary min-h-[100dvh] text-white">
      <Navbar />

      <main className="page-top pb-24">
        <Section container={true} className="space-y-8">

          {/* Header — Mobile first */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Cổng Giáo viên</span>
              <h1 className="text-2xl md:text-3xl font-display font-black text-white">Quản lý Lớp học</h1>
              <p className="text-xs text-white/40">Tạo lớp, giao bài và theo dõi tiến độ học sinh.</p>
            </div>

            {/* Primary CTA — One big button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-amber-500 text-black font-black text-base hover:bg-amber-400 active:scale-95 transition-all shadow-glow-gold"
            >
              <Plus size={20} /> Tạo lớp học mới
            </button>
          </div>

          {/* Error */}
          {fetchError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {fetchError}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Lớp học', value: loading ? '—' : classrooms.length, icon: GraduationCap, color: 'text-violet-400' },
              { label: 'Học sinh', value: loading ? '—' : totalStudents, icon: Users, color: 'text-amber-500' },
              { label: 'Bài đang giao', value: loading ? '—' : totalAssignments, icon: BookOpen, color: 'text-emerald-400' },
            ].map((stat, idx) => (
              <Card key={idx} className="p-4 border-white/5 bg-white/[0.01] flex flex-col items-center gap-2 text-center">
                <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <div className="text-2xl font-mono font-black text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-wide">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Access */}
          <Link href="/teacher/assignments">
            <div className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Giao bài tập</div>
                  <div className="text-[11px] text-white/40">Tạo bài luyện nói và nghe cho học sinh</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </div>
          </Link>

          {/* Classroom List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Danh sách lớp học</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 h-24 animate-pulse" />
                ))}
              </div>
            ) : classrooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center space-y-4">
                <GraduationCap size={40} className="text-white/20 mx-auto" />
                <div className="space-y-1">
                  <p className="text-white/60 font-bold">Chưa có lớp học nào</p>
                  <p className="text-xs text-white/30">Bấm "Tạo lớp học mới" để bắt đầu và chia sẻ mã lớp cho học sinh!</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 rounded-xl bg-white text-black font-black hover:bg-amber-400 transition-colors"
                >
                  Tạo lớp học đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 space-y-3 hover:border-white/10 transition-colors"
                  >
                    {/* Classroom name row */}
                    <Link href={`/teacher/classroom/${classroom.id}`} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{classroom.name}</h4>
                        <span className="text-[10px] font-mono text-white/30">
                          {classroom.studentsCount} học sinh • {classroom.activeAssignments} bài đang giao
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-white/20 shrink-0" />
                    </Link>

                    {/* Classroom code + actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Mã lớp:</span>
                        <span className="font-mono font-black text-amber-400 text-lg tracking-widest">{classroom.code}</span>
                      </div>
                      <button
                        onClick={() => copyCode(classroom.code)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-bold text-white/60 hover:text-white"
                        title="Sao chép mã lớp"
                      >
                        {copiedCode === classroom.code ? (
                          <><Check size={14} className="text-emerald-400" /> Đã chép</>
                        ) : (
                          <><Copy size={14} /> Sao chép</>
                        )}
                      </button>
                      <button
                        onClick={() => shareZalo(classroom.code, classroom.name)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 active:scale-95 transition-all text-xs font-bold text-blue-400"
                        title="Chia sẻ qua Zalo"
                      >
                        <Share2 size={14} /> Zalo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </Section>
      </main>

      {/* === CREATE MODAL === */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121216] p-6 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-black text-white">Tạo lớp học mới</h3>
                  <p className="text-xs text-white/40">Mã lớp sẽ được tạo tự động để chia sẻ cho học sinh.</p>
                </div>
                <button
                  onClick={() => { setShowCreateModal(false); setCreateError(null); setNewClassName(''); }}
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {createError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Tên lớp học</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ví dụ: 12A2 — Tiếng Anh"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-violet-500 placeholder:text-white/20"
                    autoFocus
                    disabled={isPending}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black text-base hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isPending ? (
                    <><Loader2 size={18} className="animate-spin" /> Đang tạo lớp...</>
                  ) : (
                    <><GraduationCap size={18} /> Tạo lớp học</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === POST-CREATION SUCCESS OVERLAY === */}
      <AnimatePresence>
        {newlyCreated && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-[#0d1a0f] p-8 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Check size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-white">Tạo lớp thành công!</h3>
                <p className="text-sm text-white/50">Chia sẻ mã này cho học sinh để các em tham gia lớp.</p>
              </div>

              {/* BIG CODE DISPLAY */}
              <div className="p-6 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                <div className="text-xs text-white/30 uppercase tracking-widest font-bold">Mã tham gia lớp</div>
                <div className="text-5xl font-mono font-black text-amber-400 tracking-[0.3em]">
                  {newlyCreated.code}
                </div>
                <div className="text-xs text-white/30">{newlyCreated.name}</div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyCode(newlyCreated.code)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-bold text-sm text-white active:scale-95"
                >
                  {copiedCode === newlyCreated.code ? (
                    <><Check size={16} className="text-emerald-400" /> Đã chép</>
                  ) : (
                    <><Copy size={16} /> Sao chép</>
                  )}
                </button>
                <button
                  onClick={() => shareZalo(newlyCreated.code, newlyCreated.name)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 transition-colors font-bold text-sm text-blue-400 active:scale-95"
                >
                  <Share2 size={16} /> Chia sẻ Zalo
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link href={`/teacher/assignments?classroom=${newlyCreated.id}`}>
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 transition-colors font-bold text-sm text-violet-400 active:scale-95">
                    <Zap size={16} /> Giao bài ngay
                  </button>
                </Link>
                <button
                  onClick={() => setNewlyCreated(null)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-bold text-sm text-white/60 active:scale-95"
                >
                  Xong
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
