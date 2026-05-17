"use client";
import Link from "next/link";
import { 
  Play, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Flame,
  Volume2
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function HomeZone() {
  return (
    <div className="space-y-8">
      {/* ─── CONTINUE LEARNING HEADER HERO ─── */}
      <div className="rounded-3xl border border-white/5 bg-gradient-to-r from-violet-950/20 via-black to-black p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <Badge variant="violet" className="py-0 px-2 font-mono text-[9px]">ACTIVE CURRICULUM PATH</Badge>
          <h3 className="text-xl md:text-2xl font-display font-black text-white">Unit 1 Lesson 2: Household Chores</h3>
          <p className="text-xs text-white/50 max-w-md leading-relaxed">
            Tiếp tục bài học luyện phát âm và nghe chép chính tả theo chủ đề Đời sống gia đình của Bộ GD&ĐT.
          </p>
        </div>

        <Link href="/learn/lesson/lesson-u1l2">
          <span className="px-6 py-3.5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0">
            Continue Practice <Play size={12} fill="currentColor" />
          </span>
        </Link>
      </div>

      {/* ─── DUAL GRID: DAILY MISSION & MOMENTUM ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Ritual */}
        <Card className="p-6 border-white/5 bg-white/[0.01] space-y-4 md:col-span-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Daily Ritual Target
            </h4>
            <span className="text-[10px] font-mono text-amber-500 font-bold">2/3 completed</span>
          </div>

          <div className="space-y-3">
            {[
              { title: "Complete 1 dictation segment", done: true },
              { title: "Record 2 reading sentences", done: true },
              { title: "Shadowing practice (3 mins)", done: false }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                  task.done ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10"
                }`}>
                  {task.done && "✓"}
                </div>
                <span className={task.done ? "text-white/40 line-through" : "text-white/70"}>{task.title}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[66%]" />
            </div>
          </div>
        </Card>

        {/* Speaking Momentum */}
        <Card className="p-6 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">Speaking Momentum</span>
            <h4 className="text-3xl font-mono font-black text-white">C1 Level</h4>
            <span className="text-[9px] text-emerald-400 font-mono font-bold mt-1 block">91% average accuracy</span>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/30">
            <span>Streak status</span>
            <span className="text-amber-500 flex items-center gap-0.5"><Flame size={10} /> 12 days active</span>
          </div>
        </Card>

      </div>

      {/* ─── COURSEWORK FEED & EXAMS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Assignments */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Assignments</h3>
          
          <Link href="/classroom/eng10a1" className="block">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-4 cursor-pointer group">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
                  <Volume2 size={16} />
                </div>
                <div>
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">Lớp 10A1 • Thầy Hoàng</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors mt-0.5">Unit 1 Lesson 2: Household Chores shadowing</h4>
                  <span className="text-[10px] text-white/40 font-mono block mt-1">Due: 2026-05-20 • +150 XP</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>

        {/* Upcoming Exams */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Upcoming Exams</h3>

          <Link href="/exam/ielts-foundation-test" className="block">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-4 cursor-pointer group">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">Assessment Portal</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">Mock IELTS Foundation Exam sprint</h4>
                  <span className="text-[10px] text-white/40 font-mono block mt-1">Time Limit: 30 Mins • Standard graded</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
