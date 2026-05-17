"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  Plus, 
  Layers, 
  GraduationCap,
  Sparkles,
  ArrowRight,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createGrade } from "@/app/admin/actions";

interface Grade {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface CurriculumClientProps {
  initialGrades: Grade[];
}

export default function CurriculumClient({ initialGrades }: CurriculumClientProps) {
  const router = useRouter();
  const [grades, setGrades] = useState(initialGrades);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    try {
      await createGrade({
        title,
        description,
        order_index: Number(orderIndex)
      });
      setTitle("");
      setDescription("");
      setOrderIndex(grades.length + 1);
      setShowModal(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error adding grade");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
      {/* Create New Grade Card */}
      <motion.button
        onClick={() => {
          setShowModal(true);
          setOrderIndex(grades.length + 1);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative h-48 rounded-[32px] border-2 border-dashed border-white/5 bg-white/2 hover:bg-white/5 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center gap-3"
      >
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
          <Plus size={24} />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-white/40 group-hover:text-amber-500">Thêm khối lớp mới</span>
      </motion.button>

      {/* Grade Cards */}
      {initialGrades.map((grade, index) => (
        <motion.div
          key={grade.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
          className="group relative h-48 rounded-[32px] bg-[#1a1a1a] border border-white/5 p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Glass Effect Overlay */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap size={80} />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="badge badge-gold">Grade</span>
              <span className="text-white/20 font-mono text-[10px]">#{grade.order_index}</span>
            </div>
            <h3 className="text-2xl font-display font-black text-white">{grade.title}</h3>
            <p className="text-xs text-white/40 line-clamp-2 italic">{grade.description}</p>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center -space-x-2">
              {/* Stats badges could go here */}
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Layers size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BookOpen size={14} />
              </div>
            </div>

            <Link 
              href={`/admin/curriculum/grade/${grade.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all"
            >
              Quản lý <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      ))}

      {/* Add Grade Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[32px] p-8 space-y-6 relative"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-display font-black text-white">Thêm Khối Lớp Mới</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Khối Lớp</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Grade 10, Grade 11"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mô Tả Chương Trình</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ví dụ: Chương trình Tiếng Anh Global Success mới nhất"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 h-24 resize-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                <input 
                  type="number" 
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                {isSubmitting ? "Đang thêm..." : "Tạo Khối Lớp"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
