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
  MoreVertical
} from "lucide-react";
import Link from "next/link";

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
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>(
    grade.semesters.map(s => s.id)
  );

  const toggleSemester = (id: string) => {
    if (expandedSemesters.includes(id)) {
      setExpandedSemesters(expandedSemesters.filter(i => i !== id));
    } else {
      setExpandedSemesters([...expandedSemesters, id]);
    }
  };

  return (
    <div className="space-y-6">
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
                  {semester.units.length} Units
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all">
                <Settings2 size={18} />
              </button>
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
                  {semester.units.sort((a,b) => a.order_index - b.order_index).map((unit) => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="text-white/10 group-hover:text-amber-500/40 cursor-grab">
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
                        <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Unit Button */}
                  <button className="w-full py-4 rounded-2xl border-2 border-dashed border-white/5 hover:border-amber-500/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 text-white/20 hover:text-amber-500">
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
      <button className="w-full py-6 rounded-[32px] border-2 border-dashed border-white/5 hover:border-amber-500/20 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-2 text-white/20 hover:text-amber-500">
        <Plus size={24} />
        <span className="text-sm font-bold uppercase tracking-widest">Thêm Học kỳ (Semester)</span>
      </button>
    </div>
  );
}
