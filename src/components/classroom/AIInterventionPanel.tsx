"use client";
import { Sparkles, AlertTriangle, ShieldAlert, Award, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AIInterventionPanel() {
  const alerts = [
    { student: "Lê Anh Tuấn", issue: "Nguy cơ mất động lực & đứt chuỗi học", desc: "Không có hoạt động trong 3 ngày liên tiếp. Chỉ số tiến trình giảm 12%.", recommendation: "Kích hoạt khiên bảo vệ chuỗi học hoặc phân bổ ngày nghỉ ngơi.", priority: "Nguy cấp", color: "text-rose-400", bg: "bg-rose-500/10" },
    { student: "Vũ Bảo Nam", issue: "Phát âm cụm /θ/ giảm sút", desc: "Độ chính xác trung bình giảm dưới 80% với nhóm âm /θ/.", recommendation: "Giao bài luyện phục hồi 'Shadowing cụm âm /θ/'.", priority: "Cao", color: "text-amber-500", bg: "bg-amber-500/10" }
  ];

  return (
    <Card className="p-5 border-white/5 bg-gradient-to-br from-violet-950/10 to-black space-y-4">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <Sparkles size={16} className="text-violet-400 animate-pulse" />
        <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Gợi ý hỗ trợ học viên</h4>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, idx) => (
          <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-white">{alert.student}</span>
              <Badge variant="outline" className={`py-0.5 px-2 text-[8px] font-mono font-bold ${alert.color} ${alert.bg}`}>
                {alert.priority.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-white/80">{alert.issue}</h5>
              <p className="text-[10px] text-white/40 leading-relaxed">{alert.desc}</p>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1 text-[10px] leading-relaxed">
              <span className="font-mono text-violet-400 font-bold block">Hành động đề xuất:</span>
              <p className="text-white/60">{alert.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
