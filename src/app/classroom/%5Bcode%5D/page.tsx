"use client";
import { useState, use } from "react";
import Link from "next/link";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck,
  Flame,
  Award,
  Zap,
  ArrowRight,
  ChevronRight,
  Volume2,
  Mic,
  Clock,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Assignment {
  id: string;
  title: string;
  type: "lesson" | "exam";
  dueDate: string;
  points: number;
  isCompleted: boolean;
}

interface Classmate {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  accuracy: number;
  isUser?: boolean;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Unit 1 Lesson 2: Household Chores speaking shadowing", type: "lesson", dueDate: "2026-05-20", points: 150, isCompleted: false },
  { id: "a2", title: "Mid-Term Practice Exam Vocabulary Sprint", type: "exam", dueDate: "2026-05-25", points: 250, isCompleted: true },
];

const MOCK_CLASSMATES: Classmate[] = [
  { rank: 1, name: "Nguyễn Hoàng Minh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang", xp: 1850, streak: 24, accuracy: 96 },
  { rank: 2, name: "Trần Minh Thư", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thu", xp: 1620, streak: 18, accuracy: 94 },
  { rank: 3, name: "You (Protagonist)", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", xp: 1480, streak: 12, accuracy: 92, isUser: true },
  { rank: 4, name: "Phạm Lan Phương", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong", xp: 1280, streak: 14, accuracy: 91 },
  { rank: 5, name: "Lê Anh Tuấn", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan", xp: 950, streak: 5, accuracy: 89 },
];

export default function StudentClassroom({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const code = (resolvedParams?.code || "").toUpperCase();
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);

  // Mark task as completed
  const handleStartTask = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, isCompleted: true } : a));
  };

  return (
    <div className="bg-[#050508] min-h-screen text-white">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <Section container={true} className="space-y-10">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-display font-black text-white">
                  Classroom Chamber: {code === "ENG11B2" ? "Advanced Speaking" : "10A1 — Global Success"}
                </h1>
                <Badge variant="violet" className="py-0 px-2 font-mono">{code}</Badge>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                Teacher: <span className="font-bold text-white/60">Thầy Minh Hoàng</span> • You are connected as a Student
              </p>
            </div>

            <div className="flex gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 items-center gap-1.5">
              <ShieldCheck size={16} /> Streak Shield Active
            </div>
          </div>

          {/* Group Streak Shield & Leaderboard Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Assignments & Collective Shield Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Collective Progress Shield */}
              <div className="rounded-3xl border border-white/5 bg-gradient-to-r from-violet-950/10 via-black to-black p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block">Classroom Momentum</span>
                    <h3 className="text-lg font-bold text-white mt-1">Classroom Streak Shield</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg">
                    8,450 / 10,000 XP
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-amber-500 shadow-glow-violet/30" style={{ width: "84.5%" }} />
                  </div>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider text-center">
                    Còn thiếu 1,550 XP để kích hoạt tấm khiên bảo vệ Streak tuần này
                  </p>
                </div>
              </div>

              {/* Coursework Assignments Feed */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Active Coursework</h3>

                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        assignment.isCompleted ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-white/[0.01] hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          assignment.isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/60"
                        }`}>
                          {assignment.type === "lesson" ? <Mic size={18} /> : <Clock size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">{assignment.type}</span>
                            {assignment.isCompleted && <Badge variant="emerald" className="text-[8px] py-0 px-2">Completed</Badge>}
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1 leading-snug">{assignment.title}</h4>
                          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mt-1">
                            Due: {assignment.dueDate} • Reward: +{assignment.points} XP
                          </span>
                        </div>
                      </div>

                      <div>
                        {assignment.isCompleted ? (
                          <div className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold">
                            <CheckCircle2 size={16} /> Done
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartTask(assignment.id)}
                            className="px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                          >
                            Start Coursework <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Classroom Leaderboard Column */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Class Leaderboard</h3>

              <div className="space-y-3">
                {MOCK_CLASSMATES.map((classmate, idx) => (
                  <div
                    key={classmate.name}
                    style={{ 
                      borderColor: classmate.isUser ? "rgba(139, 92, 246, 0.4)" : "rgba(255,255,255,0.05)",
                      backgroundColor: classmate.isUser ? "rgba(139, 92, 246, 0.05)" : "rgba(255,255,255,0.01)"
                    }}
                    className="rounded-2xl border p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center font-mono font-black text-xs ${
                        classmate.rank <= 3 ? "text-amber-500" : "text-white/20"
                      }`}>
                        #{classmate.rank}
                      </span>
                      
                      <div className="w-8 h-8 rounded-lg overflow-hidden glass border border-white/5">
                        <img src={classmate.avatar} alt={classmate.name} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white/80">{classmate.name}</h4>
                        <span className="text-[9px] font-mono text-white/30">{classmate.accuracy}% accuracy</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-black text-white flex items-center gap-1">
                        <Zap size={10} className="text-amber-500" fill="currentColor" /> {classmate.xp} XP
                      </span>
                      <span className="text-[8px] font-mono text-amber-500 flex items-center justify-end gap-0.5 mt-0.5">
                        <Flame size={8} /> {classmate.streak}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </Section>
      </main>
    </div>
  );
}
