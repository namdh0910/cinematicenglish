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
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import { createClassroom, getTeacherClassrooms } from '@/app/actions/classroom';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load classrooms from Supabase on mount
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
        setClassrooms(prev => [{
          ...result.data,
          studentsCount: 0,
          activeAssignments: 0,
        }, ...prev]);
        setNewClassName('');
        setShowCreateModal(false);
      } else {
        setCreateError(result.error ?? 'Tạo lớp thất bại.');
      }
    });
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentsCount, 0);
  const totalAssignments = classrooms.reduce((acc, c) => acc + c.activeAssignments, 0);

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />

      <main className="page-top pb-20">
        <Section container={true} className="space-y-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Cổng Giáo viên</span>
              <h1 className="text-3xl font-display font-black text-white">Trung tâm Quản lý Lớp học</h1>
              <p className="text-xs text-white/40">Quản lý học sinh, giao bài tập và theo dõi tiến độ học tập.</p>
            </div>

            <div className="flex gap-3">
              <Link href="/teacher/assignments">
                <span className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                  <ClipboardList size={14} /> Giao bài tập
                </span>
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Tạo lớp học
              </button>
            </div>
          </div>

          {/* Error State */}
          {fetchError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {fetchError}
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Lớp học đang hoạt động', value: loading ? '—' : classrooms.length, icon: GraduationCap, color: 'text-violet-400' },
              { label: 'Tổng số học sinh', value: loading ? '—' : totalStudents, icon: Users, color: 'text-amber-500' },
              { label: 'Bài tập đang giao', value: loading ? '—' : totalAssignments, icon: BookOpen, color: 'text-emerald-400' },
            ].map((stat, idx) => (
              <Card key={idx} className="p-6 border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{stat.label}</span>
                  <h4 className="text-3xl font-mono font-black text-white mt-1">{stat.value}</h4>
                </div>
                <div className={`p-3.5 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
              </Card>
            ))}
          </div>

          {/* Classroom Listings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Danh sách lớp học</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 h-20 animate-pulse" />
                ))}
              </div>
            ) : classrooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center space-y-3">
                <GraduationCap size={32} className="text-white/20 mx-auto" />
                <p className="text-white/40 text-sm">Bạn chưa có lớp học nào.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-black hover:bg-amber-400 transition-colors"
                >
                  Tạo lớp học đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {classrooms.map((classroom) => (
                  <div key={classroom.id} className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors group">
                    <Link href={`/teacher/classroom/${classroom.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-md font-bold text-white group-hover:text-violet-400 transition-colors truncate">
                          {classroom.name}
                        </h4>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block mt-1">
                          {classroom.studentsCount} học sinh
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Classroom code with copy */}
                      <button
                        onClick={() => copyCode(classroom.code)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[11px] font-mono font-bold text-white/60 hover:text-white"
                        title="Sao chép mã lớp"
                      >
                        {copiedCode === classroom.code ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                        {classroom.code}
                      </button>

                      <Link href={`/teacher/classroom/${classroom.id}`}>
                        <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </Section>
      </main>

      {/* CREATE CLASS MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl border border-white/10 bg-[#121216] p-8 space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-display font-black text-white">Tạo lớp học mới</h3>
                <p className="text-xs text-white/40">Nhập tên lớp học của bạn. Mã tham gia sẽ được tạo tự động.</p>
              </div>

              {createError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateClass} className="space-y-4">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ví dụ: Lớp 12A2 — Tiếng Anh nâng cao"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-white/20"
                  autoFocus
                  disabled={isPending}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowCreateModal(false); setCreateError(null); setNewClassName(''); }}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    disabled={isPending}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-amber-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? (
                      <><Loader2 size={14} className="animate-spin" /> Đang tạo...</>
                    ) : (
                      'Tạo lớp học'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
