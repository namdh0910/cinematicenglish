"use client";
import Link from "next/link";
import { Award, RefreshCw, Home, Sparkles, Flame, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface SessionSummaryProps {
  score: number;
  total: number;
  xpGained: number;
  accuracy: number;
  wpm: number;
  weakTags: string[];
  onReset: () => void;
}

export default function SessionSummary({
  score,
  total,
  xpGained,
  accuracy,
  wpm,
  weakTags,
  onReset
}: SessionSummaryProps) {
  return (
    <Card className="p-8 border-white/5 bg-gradient-to-br from-violet-950/10 to-black text-center space-y-6">
      
      {/* ─── MEDAL GLOW HEADER ─── */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center animate-bounce">
          <Award size={32} />
        </div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase">
          Practice Loop Completed
        </span>
        <h2 className="text-2xl font-display font-black text-white">
          Session Mastery Acquired
        </h2>
      </div>

      {/* ─── METRIC SCOREBOARD ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {[
          { label: "XP Gained", value: `+${xpGained}`, color: "text-amber-500" },
          { label: "Overall Accuracy", value: `${accuracy}%`, color: "text-emerald-400" },
          { label: "Speech Pacing", value: `${wpm} WPM`, color: "text-cyan-400" },
          { label: "Missions Resolved", value: `${score}/${total}`, color: "text-violet-400" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">
              {stat.label}
            </span>
            <h4 className={`text-lg font-mono font-black mt-1 ${stat.color}`}>
              {stat.value}
            </h4>
          </div>
        ))}
      </div>

      {/* ─── WEAKNESS INSIGHTS ─── */}
      {weakTags.length > 0 && (
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-left space-y-2">
          <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">
            AI Weakness Recovery Tagged
          </span>
          <div className="flex flex-wrap gap-2">
            {weakTags.map((tag, i) => (
              <Badge key={i} variant="outline" className="py-1 px-3 text-[9px] font-mono">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Hệ thống Đồ thị Kỹ năng (Skill Graph) đã tự động đánh dấu các kỹ năng con này để tối ưu hóa gợi ý phục hồi cho bài học ngày mai của bạn.
          </p>
        </div>
      )}

      {/* ─── ACTION BUTTONS ─── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={onReset}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={12} /> Practice Another Loop
        </button>

        <Link href="/dashboard">
          <span className="px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            <Home size={12} /> Dashboard Home
          </span>
        </Link>
      </div>

    </Card>
  );
}
