"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Settings2, 
  GripVertical,
  Music,
  Mic,
  BookOpen,
  FileText,
  Video,
  Award,
  MoreVertical,
  PlusCircle,
  Sparkles
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  type: string;
  order_index: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language' | 'Getting Started' | 'Exam';
  order_index: number;
  activities: Activity[];
}

interface UnitEditorClientProps {
  unit: {
    id: string;
    title: string;
    lessons: Lesson[];
  };
}

export default function UnitEditorClient({ unit }: UnitEditorClientProps) {
  const [lessons, setLessons] = useState(unit.lessons);

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'Listening': return <Music size={18} />;
      case 'Speaking': return <Mic size={18} />;
      case 'Reading': return <BookOpen size={18} />;
      case 'Writing': return <FileText size={18} />;
      case 'Language': return <Sparkles size={18} />;
      case 'Getting Started': return <Video size={18} />;
      case 'Exam': return <Award size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Lessons Sidebar/List */}
      <div className="xl:col-span-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Lộ trình bài học</h3>
          <button className="text-amber-500 hover:text-amber-400 transition-colors">
            <PlusCircle size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {lessons.sort((a,b) => a.order_index - b.order_index).map((lesson) => (
            <motion.div
              key={lesson.id}
              whileHover={{ x: 4 }}
              className="group flex items-center gap-3 p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-amber-500 transition-colors">
                {getLessonIcon(lesson.type)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{lesson.type}</span>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-500 truncate transition-colors">{lesson.title}</h4>
              </div>
              <div className="text-white/10 group-hover:text-white/40">
                <GripVertical size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activities / Content Editor Area */}
      <div className="xl:col-span-8 space-y-6">
        <div className="rounded-[32px] border border-white/5 bg-[#1a1a1a] p-8 min-h-[600px] flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-20 h-20 rounded-full bg-white/2 border border-white/5 flex items-center justify-center text-white/10">
              <BookOpen size={40} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-white">Chọn một bài học để bắt đầu biên tập</h3>
              <p className="text-white/30 text-sm max-w-xs mx-auto italic">Thêm câu hỏi, audio, video và các hoạt động tương tác cho bài học này.</p>
           </div>
           
           <div className="flex items-center gap-3 pt-4">
              <button className="px-6 py-3 rounded-2xl bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                 <Plus size={16} /> Thêm Hoạt động (Activity)
              </button>
              <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                 <Sparkles size={16} /> Gợi ý bởi AI
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
