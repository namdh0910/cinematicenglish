"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  ChevronRight,
  ClipboardList
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Classroom {
  id: string;
  name: string;
  code: string;
  studentsCount: number;
  activeAssignments: number;
  weeklyStreak: number;
}

const INITIAL_CLASSROOMS: Classroom[] = [
  { id: "class-10a1", name: "Lớp 10A1 — Global Success", code: "ENG10A1", studentsCount: 28, activeAssignments: 2, weeklyStreak: 8 },
  { id: "class-11b2", name: "Lớp 11B2 — Advanced Speaking", code: "ENG11B2", studentsCount: 22, activeAssignments: 1, weeklyStreak: 14 },
];

export default function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass: Classroom = {
      id: `class-${Date.now()}`,
      name: newClassName,
      code: randomCode,
      studentsCount: 0,
      activeAssignments: 0,
      weeklyStreak: 0
    };
    
    setClassrooms([...classrooms, newClass]);
    setNewClassName("");
    setShowCreateModal(false);
  };

  return (
    <div className="bg-[#050508] min-h-screen text-white">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <Section container={true} className="space-y-10">
          
          {/* Top Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Classroom Ecosystem</span>
              <h1 className="text-3xl font-display font-black text-white">Teacher Command Hub</h1>
              <p className="text-xs text-white/40">Manage student groups, assign immersive coursework, and track progress.</p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/teacher/assignments">
                <span className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                  <ClipboardList size={14} /> New Assignment
                </span>
              </Link>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Create Class
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Classrooms", value: classrooms.length, icon: GraduationCap, color: "text-violet-400" },
              { label: "Total Students", value: classrooms.reduce((acc, c) => acc + c.studentsCount, 0), icon: Users, color: "text-amber-500" },
              { label: "Assignments Active", value: classrooms.reduce((acc, c) => acc + c.activeAssignments, 0), icon: BookOpen, color: "text-emerald-400" },
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

          {/* Classroom Listings (Linear-SaaS Clean Style) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Active Classrooms</h3>
            
            <div className="space-y-3">
              {classrooms.map((classroom) => (
                <Link key={classroom.id} href={`/teacher/classroom/${classroom.id}`}>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <h4 className="text-md font-bold text-white group-hover:text-violet-400 transition-colors">
                          {classroom.name}
                        </h4>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block mt-1">
                          Code: {classroom.code} • {classroom.studentsCount} Students
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <div className="hidden sm:block">
                        <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block">Streak</span>
                        <span className="text-xs font-mono font-bold text-amber-500">{classroom.weeklyStreak} Days</span>
                      </div>

                      <div className="hidden sm:block">
                        <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block">Active Tasks</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{classroom.activeAssignments} Tasks</span>
                      </div>

                      <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
                <h3 className="text-xl font-display font-black text-white">Create New Classroom</h3>
                <p className="text-xs text-white/40">Provide a descriptive name (e.g. Lớp 10A1 - Global Success).</p>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Lớp 12A2 — Immersive English"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                  autoFocus
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs hover:bg-amber-400 transition-colors"
                  >
                    Create
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
