"use client";
import { TrendingUp, Award, Flame, Activity } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function StudentEvolutionProfile() {
  return (
    <Card className="p-5 border-white/5 bg-white/[0.01] space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Student Evolution Profile</h4>
        <span className="text-[9px] text-white/20 uppercase font-mono">Genetics Indexer</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "CEFR Growth", value: "B2 -> C1", desc: "Cohort Progression rate", icon: TrendingUp, color: "text-violet-400" },
          { label: "Vocabulary Mastery", value: "412 words", desc: "Spaced repetition target", icon: Award, color: "text-amber-500" },
          { label: "Avg Speaking Rhythm", value: "88%", desc: "Natural conversational", icon: Activity, color: "text-cyan-400" },
          { label: "Participation Rhythm", value: "98.2%", desc: "Daily active aura protected", icon: Flame, color: "text-emerald-400" }
        ].map((stat, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">
              {stat.label}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <stat.icon size={14} className={stat.color} />
              <h5 className="text-xs font-mono font-black text-white">{stat.value}</h5>
            </div>
            <span className="text-[8px] text-white/20 block">{stat.desc}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
