"use client";
import Link from "next/link";
import { 
  TrendingUp, 
  Mic, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Flame,
  Activity,
  FileText,
  Volume2
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ProgressZone() {
  return (
    <div className="space-y-10">
      
      {/* ─── RADAR SKILLS METRIC MATRIX ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "CEFR Rating", value: "C1 Level", sub: "Global Index", color: "text-violet-400" },
          { label: "Weekly Growth", value: "+12.4%", sub: "Progress Rate", color: "text-emerald-400" },
          { label: "Pronunciation Stability", value: "91%", sub: "Phoneme Accuracy", color: "text-amber-500" },
          { label: "Speaking Streak", value: "12 Days", sub: "Aura Consistency", color: "text-cyan-400" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6 border-white/5 bg-white/[0.01] space-y-1">
            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">{stat.label}</span>
            <h4 className={`text-2xl font-mono font-black ${stat.color}`}>{stat.value}</h4>
            <span className="text-[9px] text-white/30 block mt-1">{stat.sub}</span>
          </Card>
        ))}
      </div>

      {/* ─── SKILLS TIMELINE & HEATMAP PREVIEW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Weekly evolution reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Weekly Evolution Timeline</h3>
            <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Longitudinal Profiler</span>
          </div>

          <div className="space-y-3">
            {[
              { week: "Week 5 (Current)", accuracy: 91, fluency: 89, cefr: "C1", active: true },
              { week: "Week 4", accuracy: 89, fluency: 86, cefr: "C1" },
              { week: "Week 3", accuracy: 85, fluency: 82, cefr: "B2" },
              { week: "Week 2", accuracy: 82, fluency: 78, cefr: "B2" },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  p.active ? "border-violet-500 bg-violet-600/5" : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white block">{p.week}</span>
                  <span className="text-[9px] text-white/30 uppercase font-bold mt-0.5 block">CEFR Level: {p.cefr}</span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs font-bold text-right">
                  <span className="text-emerald-400">{p.accuracy}% Acc</span>
                  <span className="text-violet-400">{p.fluency}% Flu</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pronunciation Heatmap micro preview */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Heatmap & Matrix Portals</h3>

            <Card className="p-6 border-white/5 bg-white/[0.01] space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] text-violet-400 uppercase font-black tracking-widest">Speaking Intelligence</span>
                <h4 className="text-sm font-bold text-white">Full Phoneme Matrix</h4>
                <p className="text-xs text-white/40 leading-relaxed">
                  Xem bản đồ nhiệt phát âm chi tiết, các âm vị yếu (như θ, ð, ʃ) và nhận xét học thuật đầy đủ từ AI Coach.
                </p>
              </div>

              <Link href="/dashboard/speaking-analytics" className="block pt-2">
                <span className="w-full py-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer">
                  Open Fluency Matrix <ChevronRight size={12} />
                </span>
              </Link>
            </Card>
          </div>
        </div>

      </div>

    </div>
  );
}
