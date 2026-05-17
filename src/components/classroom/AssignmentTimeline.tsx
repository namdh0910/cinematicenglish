"use client";
import { Clock, CheckCircle2, AlertCircle, Volume2, Mic } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AssignmentTimeline() {
  const lifecycleTasks = [
    { title: "Shadowing Unit 1 Bài 2: Household Chores", status: "assigned", due: "2026-05-20", xp: 150, type: "Luyện nói", icon: Mic, color: "text-violet-400" },
    { title: "Thi thử IELTS Foundation Listening", status: "in_progress", due: "2026-05-22", xp: 250, type: "Bài kiểm tra", icon: Volume2, color: "text-cyan-400" },
    { title: "Luyện phục hồi phát âm /θ/", status: "submitted", due: "2026-05-18", xp: 100, type: "AI Phục hồi", icon: Clock, color: "text-amber-500" },
    { title: "Luyện nói hội thoại siêu tốc", status: "graded", score: "94%", due: "Completed", xp: 120, type: "Luyện nhanh", icon: CheckCircle2, color: "text-emerald-400" },
    { title: "Luyện phục hồi ngữ pháp Past Simple", status: "overdue", due: "2026-05-15", xp: 150, type: "Bài học chính khóa", icon: AlertCircle, color: "text-rose-400" }
  ];

  return (
    <Card className="p-5 border-white/5 bg-white/[0.01] space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Trạng thái bài tập</h4>
        <span className="text-[9px] text-white/20 uppercase font-mono">Theo thời gian thực</span>
      </div>

      <div className="space-y-4">
        {lifecycleTasks.map((task, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs border-b border-white/[0.02] pb-3 last:border-b-0 last:pb-0">
            <div className={`p-1.5 rounded-lg bg-white/5 shrink-0 ${task.color}`}>
              <task.icon size={14} />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <h5 className="font-bold text-white leading-snug">{task.title}</h5>
                <Badge 
                  variant={
                    task.status === "graded" || task.status === "submitted" 
                      ? "emerald" 
                      : (task.status === "overdue" ? "rose" : (task.status === "in_progress" ? "gold" : "violet"))
                  }
                  className="text-[8px] py-0 px-1.5 shrink-0 font-mono font-bold"
                >
                  {task.status === "assigned" ? "ĐÃ GIAO" :
                   task.status === "in_progress" ? "ĐANG LÀM" :
                   task.status === "submitted" ? "ĐÃ NỘP" :
                   task.status === "graded" ? "ĐÃ CHẤM" : "QUÁ HẠN"} {task.score && `• ${task.score}`}
                </Badge>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-white/30">
                <span>{task.type} • +{task.xp} XP</span>
                <span>Hạn: {task.due === "Completed" ? "Đã xong" : task.due}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
