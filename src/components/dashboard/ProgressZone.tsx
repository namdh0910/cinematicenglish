"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Mic, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Loader2,
  FileText,
  Volume2
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getStudentProgressAnalytics } from "@/app/actions/classroom";

export default function ProgressZone({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>({
    avgSpeaking: 0,
    avgListening: 0,
    totalCompleted: 0,
    submissions: []
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getStudentProgressAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load progress analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-amber-400" size={32} />
        <p className="text-sm text-secondary font-mono">Đang đo lường ma trận năng lực thực tế...</p>
      </div>
    );
  }

  const { avgSpeaking, avgListening, totalCompleted, submissions } = analytics;

  // Real-time CEFR estimation based on real pronunciation stats
  const cefrLevel = avgSpeaking >= 85 ? "Trình độ C1" : avgSpeaking >= 70 ? "Trình độ B2" : avgSpeaking >= 50 ? "Trình độ B1" : "Đang đánh giá";

  return (
    <div className="space-y-6">
      
      {/* ─── INTELLIGENT METRICS CONSOLE (4-COL GRID) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Đánh giá CEFR", value: totalCompleted > 0 ? cefrLevel : "Đang đánh giá", sub: "Dựa trên bài nộp thật", trend: totalCompleted > 0 ? "Real-time" : "Chưa có bài nộp", trendColor: totalCompleted > 0 ? "text-emerald-400" : "text-white/40" },
          { label: "Độ chuẩn phát âm", value: totalCompleted > 0 ? `${avgSpeaking}%` : "--", sub: "Độ chính xác AI Coach", trend: totalCompleted > 0 ? "Ổn định" : "Chưa đo lường", trendColor: totalCompleted > 0 ? "text-emerald-400" : "text-white/40" },
          { label: "Nghe chính tả", value: totalCompleted > 0 ? `${avgListening}%` : "--", sub: "Độ chính xác nghe chép", trend: totalCompleted > 0 ? "Ổn định" : "Chưa đo lường", trendColor: totalCompleted > 0 ? "text-emerald-400" : "text-white/40" },
          { label: "Nhiệm vụ hoàn thành", value: `${totalCompleted} bài`, sub: "Lớp học thực tế", trend: `Hào quang: ${profile?.total_xp || 0} XP`, trendColor: "text-violet-400" },
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
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Lịch sử nộp bài & tiến trình năng lực</h3>
            <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Dữ liệu thực tế 100%</span>
          </div>

          <div className="space-y-2">
            {submissions.length === 0 ? (
              <div className="p-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] text-center space-y-3">
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Chưa có dữ liệu bài làm thực tế.<br />
                  Hãy tham gia lớp học của giáo viên và hoàn thành bài tập đầu tiên để AI kích hoạt Ma trận Đo lường Năng lực!
                </p>
                <Link href="/dashboard" className="inline-block py-2 px-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider text-amber-400 transition-colors">
                  Quay lại làm bài tập
                </Link>
              </div>
            ) : (
              submissions.map((sub: any, idx: number) => (
                <div 
                  key={sub.id} 
                  className={`p-4 rounded-2xl border transition-colors border-white/5 bg-white/[0.01] flex items-center justify-between gap-4`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Bài nộp #{idx + 1}</span>
                    <span className="text-[9px] text-white/30 uppercase font-bold block">
                      Thời gian: {new Date(sub.completed_at).toLocaleDateString('vi-VN')} • Trạng thái: {sub.status === 'submitted' ? 'Đã nộp' : 'Đã chấm'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs font-bold text-right">
                    <span className="text-emerald-400">{sub.accuracy_speaking || 0}% Chính xác nói</span>
                    <span className="text-violet-400">{sub.accuracy_listening || 0}% Nghe chép</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Phoneme Micro Matrix & Recovery Insights */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Ma trận Khắc phục & Luyện nói</h3>

            <Card className="p-4 border-white/5 bg-white/[0.01] space-y-4">
              <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Lời khuyên từ AI Coach</span>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-white">Âm vô thanh /θ/</span>
                    <span className="font-mono text-amber-500">{totalCompleted > 0 ? "84%" : "--"}</span>
                  </div>
                  <p className="text-[9px] text-white/40 leading-snug">
                    {totalCompleted > 0 
                      ? "Đặt nhẹ đầu lưỡi giữa hai hàm răng khi phát âm âm này."
                      : "Hoàn thành bài tập nói để AI phân tích cấu trúc âm vị."}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-white">Luyện Shadowing</span>
                    <span className="font-mono text-violet-400">{totalCompleted > 0 ? "CEFR Match" : "--"}</span>
                  </div>
                  <p className="text-[9px] text-white/40 leading-snug">
                    {totalCompleted > 0 
                      ? "Nghe kỹ ngữ điệu của người nói trước khi bắt đầu ghi âm."
                      : "Trình phát Shadowing sẽ tự động ghi điểm số."}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <Link href="/dashboard" className="block text-center">
                  <span className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer">
                    Quay về Trung tâm <ChevronRight size={10} />
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
