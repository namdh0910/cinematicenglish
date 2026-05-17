"use client";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ClassroomHeatmap() {
  const phonemes = [
    { sound: "θ (th) voiceless", accuracy: 76, status: "Critical Recovery", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { sound: "ð (th) voiced", accuracy: 82, status: "Evolving", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { sound: "ʃ (sh) sibilant", accuracy: 91, status: "Stable Mastery", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { sound: "æ (short a)", accuracy: 88, status: "Stable Mastery", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { sound: "ŋ (ng)", accuracy: 95, status: "High Performance", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" }
  ];

  return (
    <Card className="p-5 border-white/5 bg-white/[0.01] space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Phoneme Weakness Heatmap</h4>
        <span className="text-[9px] text-white/20 uppercase font-mono">Class Aggregate</span>
      </div>

      <div className="space-y-3">
        {phonemes.map((ph, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs">
            <span className="font-mono font-bold text-white/80">{ph.sound}</span>
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold ${ph.color}`}>{ph.accuracy}%</span>
              <Badge variant="outline" className={`py-0.5 px-2 text-[8px] font-mono font-bold ${ph.color} ${ph.bg} ${ph.border}`}>
                {ph.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
