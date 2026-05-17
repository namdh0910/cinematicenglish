"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Settings2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  Book,
  FileText,
  PlayCircle,
  MoreVertical,
  Trash2,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSemester, createUnit, deleteUnit } from "@/app/admin/actions";

interface Unit {
  id: string;
  title: string;
  description: string;
  order_index: number;
  cover_url?: string;
}

interface Semester {
  id: string;
  title: string;
  order_index: number;
  units: Unit[];
}

interface GradeDetailsClientProps {
  grade: {
    id: string;
    title: string;
    semesters: Semester[];
  };
}

export default function GradeDetailsClient({ grade }: GradeDetailsClientProps) {
  const router = useRouter();
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>(
    grade.semesters.map(s => s.id)
  );

  // Modals / forms state
  const [activeSemesterForUnit, setActiveSemesterForUnit] = useState<string | null>(null);
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [newUnitDesc, setNewUnitDesc] = useState("");
  const [newUnitOrder, setNewUnitOrder] = useState(1);

  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [newSemesterTitle, setNewSemesterTitle] = useState("");
  const [newSemesterOrder, setNewSemesterOrder] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSemester = (id: string) => {
    if (expandedSemesters.includes(id)) {
      setExpandedSemesters(expandedSemesters.filter(i => i !== id));
    } else {
      setExpandedSemesters([...expandedSemesters, id]);
    }
  };

  const handleAddSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemesterTitle) return;
    setIsSubmitting(true);
    try {
      await createSemester({
        grade_id: grade.id,
        title: newSemesterTitle,
        order_index: Number(newSemesterOrder)
      });
      setNewSemesterTitle("");
      setNewSemesterOrder(grade.semesters.length + 1);
      setShowSemesterModal(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error adding semester");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitTitle || !activeSemesterForUnit) return;
    setIsSubmitting(true);
    try {
      await createUnit({
        semester_id: activeSemesterForUnit,
        title: newUnitTitle,
        description: newUnitDesc,
        order_index: Number(newUnitOrder)
      });
      setNewUnitTitle("");
      setNewUnitDesc("");
      setActiveSemesterForUnit(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error adding unit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUnit = async (unitId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xoá Unit: "${title}"? Mọi bài học và hoạt động bên trong sẽ bị mất.`)) return;
    try {
      await deleteUnit(unitId);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting unit");
    }
  };

  return (
    <div className="space-y-6 relative">
      {grade.semesters.sort((a,b) => a.order_index - b.order_index).map((semester) => (
        <div key={semester.id} className="rounded-[32px] border border-white/5 bg-[#1a1a1a] overflow-hidden">
          {/* Semester Header */}
          <div 
            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
            onClick={() => toggleSemester(semester.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 font-black">
                {semester.order_index}
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">{semester.title}</h3>
                <p className="text-xs text-white/20 uppercase tracking-widest font-bold">
                  {semester.units?.length || 0} Units
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white/40">
                {expandedSemesters.includes(semester.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>

          {/* Units List */}
          <AnimatePresence>
            {expandedSemesters.includes(semester.id) && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-white/5"
              >
                <div className="p-4 space-y-3">
                  {(semester.units || []).sort((a,b) => a.order_index - b.order_index).map((unit) => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="text-white/10 group-hover:text-amber-500/40">
                        <GripVertical size={18} />
                      </div>
                      
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        {unit.cover_url ? (
                          <img src={unit.cover_url} alt={unit.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10">
                            <Book size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">Unit {unit.order_index}</span>
                          <span className="text-white/10 text-[10px]">•</span>
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest line-clamp-1">{unit.description}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors truncate">
                          {unit.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/curriculum/unit/${unit.id}`}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          Biên tập
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUnit(unit.id, unit.title);
                          }}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                          title="Delete Unit"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Unit Button */}
                  <button 
                    onClick={() => {
                      setActiveSemesterForUnit(semester.id);
                      setNewUnitOrder((semester.units?.length || 0) + 1);
                    }}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-white/5 hover:border-amber-500/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 text-white/20 hover:text-amber-500"
                  >
                    <Plus size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Thêm Unit mới</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Add Semester Button */}
      <button 
        onClick={() => {
          setShowSemesterModal(true);
          setNewSemesterOrder(grade.semesters.length + 1);
        }}
        className="w-full py-6 rounded-[32px] border-2 border-dashed border-white/5 hover:border-amber-500/20 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-2 text-white/20 hover:text-amber-500"
      >
        <Plus size={24} />
        <span className="text-sm font-bold uppercase tracking-widest">Thêm Học kỳ (Semester)</span>
      </button>

      {/* Add Semester Modal */}
      {showSemesterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[32px] p-8 space-y-6 relative"
          >
            <button 
              onClick={() => setShowSemesterModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-display font-black text-white">Thêm Học kỳ Mới</h3>
            <form onSubmit={handleAddSemester} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Học Kỳ</label>
                <input 
                  type="text" 
                  value={newSemesterTitle}
                  onChange={(e) => setNewSemesterTitle(e.target.value)}
                  placeholder="Ví dụ: Học kỳ 1, Học kỳ 2"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                <input 
                  type="number" 
                  value={newSemesterOrder}
                  onChange={(e) => setNewSemesterOrder(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                {isSubmitting ? "Đang thêm..." : "Tạo Học Kỳ"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Unit Modal */}
      {activeSemesterForUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[32px] p-8 space-y-6 relative"
          >
            <button 
              onClick={() => setActiveSemesterForUnit(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-display font-black text-white">Thêm Unit Mới</h3>
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Unit (Tiêu đề)</label>
                <input 
                  type="text" 
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  placeholder="Ví dụ: Unit 1: Family Life"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mô tả ngắn</label>
                <textarea 
                  value={newUnitDesc}
                  onChange={(e) => setNewUnitDesc(e.target.value)}
                  placeholder="Tóm tắt nội dung bài học..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 h-24 resize-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                <input 
                  type="number" 
                  value={newUnitOrder}
                  onChange={(e) => setNewUnitOrder(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                {isSubmitting ? "Đang thêm..." : "Tạo Unit"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
