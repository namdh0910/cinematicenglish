"use client";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ClassroomHeatmap() {
  const phonemes = [
    { sound: "θ (th) vô thanh", accuracy: 76, status: "Cần cải thiện gấp", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { sound: "ð (th) hữu thanh", accuracy: 82, status: "Đang tiến bộ", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { sound: "ʃ (sh) âm xuýt", accuracy: 91, status: "Thành thạo ổn định", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { sound: "æ (a bẹt)", accuracy: 88, status: "Thành thạo ổn định", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { sound: "ŋ (âm mũi)", accuracy: 95, status: "Hiệu suất cao", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" }
  ];

  return (
    <Card className="p-5 border-white/5 bg-white/[0.01] space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Tổng hợp âm phát âm yếu</h4>
        <span className="text-[9px] text-white/20 uppercase font-mono">Trung bình cả lớp</span>
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
