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
  Volume2,
  AlertTriangle,
  Compass,
  Zap,
  BookOpen,
  HelpCircle
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function HomeZone() {
  return (
    <div className="space-y-4">
      
      {/* ─── TOP SECTION: 12-COLUMN RESPONSIBLE GRID ─── */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Continue Learning card (5-Col) */}
        <div className="col-span-12 md:col-span-5 p-4 rounded-2xl border border-white/5 bg-gradient-to-r from-violet-950/10 via-black to-black flex flex-col justify-between space-y-4 min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" /> Active Path
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">U1 Lesson 2: Household Chores</h3>
            <p className="text-[10px] text-white/40 leading-normal max-w-sm">
              Luyện phát âm & chép chính tả chủ đề Đời sống gia đình (GD&ĐT chuẩn).
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/30">Next: Shadowing exercise</span>
            <Link href="/learn/lesson/lesson-u1l2">
              <span className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer">
                Resume <Play size={8} fill="currentColor" />
              </span>
            </Link>
          </div>
        </div>

        {/* Daily Ritual Progress (3-Col) */}
        <Card className="col-span-12 md:col-span-3 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[140px] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase">Daily Ritual</span>
            <span className="text-[9px] font-mono text-amber-500 font-bold">2/3 Done</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-white/60">
              <span className="truncate">Shadowing Segment</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="flex justify-between text-[10px] text-white/60">
              <span className="truncate">Dictation Quiz</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="flex justify-between text-[10px] text-white/60">
              <span className="truncate">Pronunciation focus</span>
              <span className="text-white/30">0/1</span>
            </div>
          </div>

          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[66%]" />
          </div>
        </Card>

        {/* Upcoming Exam (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-rose-400 uppercase">Assessment</span>
            <h4 className="text-xs font-bold text-white truncate leading-snug">Mock IELTS Foundation</h4>
            <span className="text-[9px] text-white/30 block mt-0.5">30 mins • Timed</span>
          </div>

          <Link href="/exam/ielts-foundation-test">
            <span className="text-[9px] font-mono font-bold text-white/40 group-hover:text-white flex items-center gap-0.5 cursor-pointer hover:underline">
              Open Portal <ChevronRight size={10} />
            </span>
          </Link>
        </Card>

        {/* Aura Momentum (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-emerald-400 uppercase">Aura Score</span>
            <h4 className="text-xl font-mono font-black text-white">92.4%</h4>
            <span className="text-[9px] text-emerald-400/80 font-mono font-bold block mt-0.5">+1.2% weekly</span>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block">Consistent state</span>
        </Card>

      </div>

      {/* ─── MIDDLE SECTION: ACADEMIC CORE ─── */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Active Assignments (4-Col) */}
        <Card className="col-span-12 md:col-span-4 p-4 border-white/5 bg-white/[0.01] space-y-3">
          <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">Active Coursework</span>
          
          <Link href="/classroom/eng10a1" className="block">
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-3 cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400">
                  <Volume2 size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors truncate max-w-[150px]">U1 Lesson 2: Household Chores</h4>
                  <span className="text-[9px] text-white/30 block mt-0.5">Due: 3 days • +150 XP</span>
                </div>
              </div>
              <ChevronRight size={12} className="text-white/20" />
            </div>
          </Link>
        </Card>

        {/* Weak Skills Recovery (3-Col) */}
        <Card className="col-span-12 md:col-span-3 p-4 border-white/5 bg-white/[0.01] space-y-3">
          <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Weak Skills Recovery</span>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">θ (th) voiceless</span>
              <Badge variant="outline" className="py-0 px-1 text-[8px] font-mono">Restorative</Badge>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">ð (th) voiced</span>
              <Badge variant="outline" className="py-0 px-1 text-[8px] font-mono">Restorative</Badge>
            </div>
          </div>
        </Card>

        {/* Speaking Streak (3-Col) */}
        <Card className="col-span-6 md:col-span-3 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Speaking Streak</span>
            <h4 className="text-md font-bold text-white flex items-center gap-1">
              <Flame size={14} className="text-amber-500" /> 12 Days Consistency
            </h4>
            <p className="text-[9px] text-white/40">Shield protected by Class collective streak.</p>
          </div>

          <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-cyan-400 w-[80%]" />
          </div>
        </Card>

        {/* Vocabulary Expansion (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">Vocabulary</span>
            <h4 className="text-xl font-mono font-black text-white">412</h4>
            <span className="text-[9px] text-emerald-400 font-mono font-bold block mt-0.5">+14 words today</span>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase block">A2-C1 Range</span>
        </Card>

      </div>

      {/* ─── BOTTOM SECTION: FORECASTING & INTEL ─── */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* AI Coach Insight (4-Col) */}
        <Card className="col-span-12 md:col-span-4 p-4 border-white/5 bg-gradient-to-br from-violet-950/10 to-black space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase block">AI Speaking Mentor</span>
          </div>
          <p className="text-[10px] text-white/60 leading-relaxed italic">
            "Your rhythm is superb, C1 Voice Architect. Focus on releasing stress naturally in syllables like 'fluctuation' inside your next dialogue."
          </p>
        </Card>

        {/* Tomorrow Forecast (3-Col) */}
        <Card className="col-span-12 md:col-span-3 p-4 border-white/5 bg-white/[0.01] space-y-2">
          <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Tomorrow Engine Vault</span>
          
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-white/60">Node: The Negotiation Chamber</span>
          </div>
          <p className="text-[9px] text-white/40 leading-relaxed">
            Locked mystery element approaching. Midnight reset unlocks node.
          </p>
        </Card>

        {/* Weekly Growth (3-Col) */}
        <Card className="col-span-6 md:col-span-3 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">Weekly Growth Rate</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-xl font-mono font-black text-white">+8.4%</span>
              <TrendingUp size={14} className="text-emerald-400 pb-0.5" />
            </div>
            <p className="text-[9px] text-white/40">Relative mastery metrics calculated today.</p>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase block">Excellent pace</span>
        </Card>

        {/* Recent Achievements (2-Col) */}
        <Card className="col-span-6 md:col-span-2 p-4 border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Achievements</span>
            <h4 className="text-md font-bold text-white flex items-center gap-0.5 truncate">
              🏆 Voice Architect
            </h4>
            <span className="text-[9px] text-white/30 block mt-0.5">Tier 4 unlocked</span>
          </div>

          <span className="text-[8px] font-mono text-white/30 uppercase block">5 active badges</span>
        </Card>

      </div>

    </div>
  );
}
