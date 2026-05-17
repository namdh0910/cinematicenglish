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
  Volume2,
  TrendingDown
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ProgressZone() {
  return (
    <div className="space-y-6">
      
      {/* ─── INTELLIGENT METRICS CONSOLE (4-COL GRID) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CEFR Rating", value: "C1 Level", sub: "Global Indicator", trend: "+1 level", trendColor: "text-emerald-400" },
          { label: "Pronunciation Stability", value: "91%", sub: "Phoneme Accuracy", trend: "+1.2% weekly", trendColor: "text-emerald-400" },
          { label: "Fluency Pacing Index", value: "132 WPM", sub: "Natural Conversational", trend: "Stable", trendColor: "text-white/40" },
          { label: "Consistency Index", value: "98.2%", sub: "Aura Streak protected", trend: "Max Shield", trendColor: "text-violet-400" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 border-white/5 bg-white/[0.01] space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase block">{stat.label}</span>
            <h4 className="text-xl font-mono font-black text-white">{stat.value}</h4>
            <div className="flex justify-between items-center pt-1 text-[9px] font-mono">
              <span className="text-white/40">{stat.sub}</span>
              <span className={stat.trendColor}>{stat.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── SKILL TELEMETRY & PHONEME MICRO MATRIX ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Longitudinal progress graph */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Fluency timeline</h3>
            <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">5-Week longitudinal telemetry</span>
          </div>

          <div className="space-y-2">
            {[
              { week: "Week 5 (Current)", accuracy: 91, fluency: 89, cefr: "C1", active: true },
              { week: "Week 4", accuracy: 89, fluency: 86, cefr: "C1" },
              { week: "Week 3", accuracy: 85, fluency: 82, cefr: "B2" },
              { week: "Week 2", accuracy: 82, fluency: 78, cefr: "B2" },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                  p.active ? "border-violet-500 bg-violet-600/5" : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">{p.week}</span>
                  <span className="text-[9px] text-white/30 uppercase font-bold block">CEFR Index: {p.cefr}</span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs font-bold text-right">
                  <span className="text-emerald-400">{p.accuracy}% Acc</span>
                  <span className="text-violet-400">{p.fluency}% Flu</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phoneme Micro Matrix & Recovery Insights */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Phoneme Matrix & Recovery</h3>

            <Card className="p-4 border-white/5 bg-white/[0.01] space-y-4">
              <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase block">AI Recovery Insights</span>
              
              <div className="space-y-3">
                {[
                  { ph: "θ (th)", rate: "84%", trend: "Down 4%", color: "text-amber-500", desc: "Try placing your tongue between your teeth." },
                  { ph: "ð (th)", rate: "88%", trend: "Stable", color: "text-white/40", desc: "Vibrate vocal cords naturally to form the ð." }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-white">{item.ph}</span>
                      <span className={`font-mono ${item.color}`}>{item.rate} ({item.trend})</span>
                    </div>
                    <p className="text-[9px] text-white/40 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5">
                <Link href="/dashboard/speaking-analytics" className="block">
                  <span className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer">
                    Open Full Matrix <ChevronRight size={10} />
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </div>

      </div>

    </div>
  );
}
