"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Sparkles, 
  Flame, 
  Volume2, 
  Mic, 
  Bookmark, 
  Award,
  Zap,
  ArrowRight,
  TrendingUp,
  Brain,
  Search
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface Grade {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface LearnClientProps {
  initialGrades: Grade[];
}

export default function LearnClient({ initialGrades }: LearnClientProps) {
  const [grades] = useState<Grade[]>(initialGrades);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Premium Simulated Student Metrics
  const stats = [
    { label: "Listening Accuracy", value: "87%", icon: Volume2, color: "text-blue-400 bg-blue-500/10", trend: "+3.2% this week" },
    { label: "Speaking Confidence", value: "78%", icon: Mic, color: "text-emerald-400 bg-emerald-500/10", trend: "+5.1% this week" },
    { label: "Vocabulary Mastery", value: "92%", icon: Bookmark, color: "text-amber-400 bg-amber-500/10", trend: "140 words learned" },
    { label: "Exam Readiness", value: "84%", icon: Award, color: "text-violet-400 bg-violet-500/10", trend: "Global Success Std" }
  ];

  // Adaptive recommendation system
  const recoveryMissions = [
    {
      id: "rec-1",
      title: "Dictation Skill Recovery: Family Life",
      skill: "Listening & Dictation",
      difficulty: "Intermediate",
      xp: 150,
      reason: "⚠️ Listening accuracy dropped to 68% in last practice",
      lessonId: "mock-lesson-listening"
    },
    {
      id: "rec-2",
      title: "Shadowing Challenge: Pronunciation of '-ed' endings",
      skill: "Speaking / Rhythm",
      difficulty: "Beginner",
      xp: 200,
      reason: "🔥 Hot practice: Complete 5-day speaking streak multiplier",
      lessonId: "mock-lesson-speaking"
    }
  ];

  return (
    <div className="bg-primary min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 container-custom space-y-12">
        {/* Welcome Hero banner */}
        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-violet-950/80 to-slate-900 border border-white/5 p-8 md:p-12">
          {/* Decorative neon lights */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="flex items-center gap-2">
              <Badge variant="violet" className="py-1 px-3">Global Success Syllabus</Badge>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-black uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Flame size={12} fill="currentColor" /> 5 Day Streak
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              Master English Like a <span className="gradient-text-gold">Cinema Protagonist</span>
            </h1>
            
            <p className="text-secondary text-sm md:text-base leading-relaxed">
              Dự án Global Success được tái cấu trúc thành một trải nghiệm nhập vai đỉnh cao. Tích hợp AI Coach, Phòng Luyện Thi Cinematic, và Hệ thống Nghe dictation/shadowing tiên tiến.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="primary" size="md" onClick={() => {
                const grade10 = grades.find(g => g.title.includes("10"));
                if (grade10) window.location.href = `/learn/grade/${grade10.id}`;
              }}>
                Resume Learning
              </Button>
              <Button variant="ghost" size="md">
                View My Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Student Stats Matrix */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
            <TrendingUp size={14} className="text-amber-500" /> Stats Aura Matrix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-white/5 bg-[#1a1a1a]/50 p-6 space-y-4 hover:border-white/10 hover:bg-[#1a1a1a] transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-display font-black text-white">{stat.value}</h4>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{stat.trend}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Adaptive Intelligence Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
              <Brain size={14} className="text-violet-400" /> Active Recovery Missions
            </h3>

            <div className="space-y-3">
              {recoveryMissions.map((rec) => (
                <div 
                  key={rec.id}
                  className="rounded-3xl border border-white/5 bg-gradient-to-r from-violet-950/20 to-white/[0.01] hover:border-violet-500/20 hover:from-violet-950/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">{rec.skill}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">• {rec.difficulty}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-amber-500/80 font-medium italic">{rec.reason}</p>
                  </div>

                  <button 
                    onClick={() => alert("Redirecting to mission player...")}
                    className="px-5 py-2.5 rounded-2xl bg-violet-500 text-white text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shrink-0 self-start md:self-auto"
                  >
                    Accept Mission <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side quick statistics */}
          <div className="lg:col-span-4 rounded-[32px] border border-white/5 bg-[#141414] p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Zap size={22} fill="currentColor" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-display font-black text-white">Daily Streak Momentum</h4>
                <p className="text-secondary text-xs leading-relaxed">
                  Duy trì việc ôn tập 15 phút mỗi ngày để nhân 3 số điểm kinh nghiệm (XP) và mở khóa các huy hiệu Archetype cao cấp.
                </p>
              </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "70%" }} />
            </div>
            
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
              <span>Goal: 15 mins/day</span>
              <span className="text-amber-500">70% Done</span>
            </div>
          </div>
        </div>

        {/* Netflix Grade Streaming Library */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
              <GraduationCap size={14} className="text-amber-500" /> Choose Your Grade Path
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {grades.map((grade) => (
              <motion.div
                key={grade.id}
                whileHover={{ y: -6 }}
                className="group relative rounded-[32px] bg-[#1a1a1a] border border-white/5 overflow-hidden flex flex-col justify-between h-56 p-8"
              >
                {/* Netflix-style overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0" />
                <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-amber-500/10 group-hover:scale-110 transition-all z-0">
                  <GraduationCap size={120} />
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-gold">Grade</span>
                    <span className="text-white/20 font-mono text-[10px]">#{grade.order_index}</span>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white">{grade.title}</h3>
                  <p className="text-xs text-white/40 line-clamp-2 italic">{grade.description}</p>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">12 Units • Active</span>
                  <Link 
                    href={`/learn/grade/${grade.id}`}
                    className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all flex items-center gap-2"
                  >
                    Enter Grade <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
