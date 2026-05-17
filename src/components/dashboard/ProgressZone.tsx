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
          { label: "Đánh giá CEFR", value: "Trình độ C1", sub: "Chỉ số toàn cầu", trend: "+1 cấp độ", trendColor: "text-emerald-400" },
          { label: "Độ chuẩn phát âm", value: "91%", sub: "Độ chính xác âm vị", trend: "+1.2% mỗi tuần", trendColor: "text-emerald-400" },
          { label: "Tốc độ nói (Fluency)", value: "132 WPM", sub: "Tự nhiên như bản xứ", trend: "Ổn định", trendColor: "text-white/40" },
          { label: "Chỉ số Bền bỉ", value: "98.2%", sub: "Khiên hào quang bảo vệ", trend: "Khiên Tối đa", trendColor: "text-violet-400" },
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
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Tiến trình nói trôi chảy</h3>
            <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Biểu đồ năng lực 5 tuần qua</span>
          </div>

          <div className="space-y-2">
            {[
              { week: "Tuần 5 (Hiện tại)", accuracy: 91, fluency: 89, cefr: "C1", active: true },
              { week: "Tuần 4", accuracy: 89, fluency: 86, cefr: "C1" },
              { week: "Tuần 3", accuracy: 85, fluency: 82, cefr: "B2" },
              { week: "Tuần 2", accuracy: 82, fluency: 78, cefr: "B2" },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                  p.active ? "border-violet-500 bg-violet-600/5" : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">{p.week}</span>
                  <span className="text-[9px] text-white/30 uppercase font-bold block">Chỉ số CEFR: {p.cefr}</span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs font-bold text-right">
                  <span className="text-emerald-400">{p.accuracy}% Chính xác</span>
                  <span className="text-violet-400">{p.fluency}% Trôi chảy</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phoneme Micro Matrix & Recovery Insights */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Ma trận Âm vị & Khắc phục</h3>

            <Card className="p-4 border-white/5 bg-white/[0.01] space-y-4">
              <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Lời khuyên khắc phục từ AI</span>
              
              <div className="space-y-3">
                {[
                  { ph: "Âm vô thanh /θ/ (th)", rate: "84%", trend: "Giảm 4%", color: "text-amber-500", desc: "Đặt nhẹ đầu lưỡi giữa hai hàm răng khi phát âm âm này." },
                  { ph: "Âm hữu thanh /ð/ (th)", rate: "88%", trend: "Ổn định", color: "text-white/40", desc: "Rung dây thanh quản tự nhiên để tạo âm chuẩn xác." }
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
                    Xem phân tích đầy đủ <ChevronRight size={10} />
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
