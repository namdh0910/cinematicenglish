"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  BookOpen, 
  Music, 
  Mic, 
  FileText, 
  Sparkles, 
  Video, 
  Award,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Lesson {
  id: string;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language' | 'Getting Started' | 'Exam';
  order_index: number;
}

interface Unit {
  id: string;
  title: string;
  description: string;
  order_index: number;
  cover_url?: string;
  lessons: Lesson[];
}

interface Semester {
  id: string;
  title: string;
  order_index: number;
  units: Unit[];
}

interface GradeClientProps {
  grade: {
    id: string;
    title: string;
    description: string;
    semesters: Semester[];
  };
}

export default function GradeClient({ grade }: GradeClientProps) {
  const [activeSemester, setActiveSemester] = useState<string>(
    grade.semesters.length > 0 ? grade.semesters[0].id : ""
  );

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'Listening': return <Music size={14} />;
      case 'Speaking': return <Mic size={14} />;
      case 'Reading': return <BookOpen size={14} />;
      case 'Writing': return <FileText size={14} />;
      case 'Language': return <Sparkles size={14} />;
      case 'Getting Started': return <Video size={14} />;
      case 'Exam': return <Award size={14} />;
    }
  };

  const getLessonTypeLabel = (type: Lesson['type']) => {
    switch (type) {
      case 'Listening': return 'Luyện nghe';
      case 'Speaking': return 'Luyện nói';
      case 'Reading': return 'Luyện đọc';
      case 'Writing': return 'Luyện viết';
      case 'Language': return 'Ngữ pháp & Từ vựng';
      case 'Getting Started': return 'Khởi động';
      case 'Exam': return 'Bài kiểm tra';
      default: return type;
    }
  };

  const selectedSemester = grade.semesters.find(s => s.id === activeSemester);

  return (
    <div className="bg-primary min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 container-custom space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/learn" 
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> Quay lại Học tập
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black text-white">{grade.title}</h1>
            <p className="text-secondary text-sm italic">{grade.description}</p>
          </div>
        </div>

        {/* Semester Tab Switchers */}
        <div className="flex border-b border-white/5 pb-1 gap-6 overflow-x-auto no-scrollbar">
          {grade.semesters.sort((a,b) => a.order_index - b.order_index).map((semester) => (
            <button
              key={semester.id}
              onClick={() => setActiveSemester(semester.id)}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 shrink-0 ${
                activeSemester === semester.id 
                  ? "border-amber-500 text-amber-500" 
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              {semester.title}
            </button>
          ))}
        </div>

        {/* Units / Episodes list */}
        <div className="space-y-8">
          {selectedSemester && selectedSemester.units && selectedSemester.units.length > 0 ? (
            selectedSemester.units.sort((a,b) => a.order_index - b.order_index).map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[36px] bg-[#1a1a1a]/50 border border-white/5 overflow-hidden p-6 md:p-8 flex flex-col lg:flex-row gap-8 hover:border-white/10 transition-all"
              >
                {/* Cover/Thumbnail */}
                <div className="w-full lg:w-72 h-44 rounded-3xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative flex items-center justify-center">
                  {unit.cover_url ? (
                    <img src={unit.cover_url} alt={unit.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-white/20">
                      <BookOpen size={40} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Unit {unit.order_index}</span>
                    </div>
                  )}
                  {/* Decorative badge */}
                  <Badge variant="gold" className="absolute top-4 left-4">Unit {unit.order_index}</Badge>
                </div>

                {/* Info and Lessons */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-display font-black text-white">{unit.title}</h2>
                    <p className="text-secondary text-sm leading-relaxed max-w-2xl italic">
                      {unit.description || "Hãy bắt đầu khám phá và chinh phục các bài tập tương tác trong Unit này."}
                    </p>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Các tiết học / Lessons</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unit.lessons && unit.lessons.length > 0 ? (
                        unit.lessons.sort((a,b) => a.order_index - b.order_index).map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/learn/lesson/${lesson.id}`}
                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-colors shrink-0">
                                {getLessonIcon(lesson.type)}
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block leading-none mb-1">{getLessonTypeLabel(lesson.type)}</span>
                                <h4 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors truncate">{lesson.title}</h4>
                              </div>
                            </div>
                            
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/10 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0">
                              <Play size={14} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              <ChevronRight size={16} className="group-hover:opacity-0 transition-opacity" />
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-2 py-6 text-center rounded-2xl border border-dashed border-white/5 text-white/20 text-xs italic">
                          Chưa có bài học nào được tạo cho Unit này.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center rounded-[32px] border border-dashed border-white/5 text-white/30 text-sm italic">
              Không tìm thấy Unit nào cho Học kỳ này.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
