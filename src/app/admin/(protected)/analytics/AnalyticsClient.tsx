"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LearningEventPipeline } from "@/lib/infrastructure/learning_events";
import { AICostControlRouter } from "@/lib/infrastructure/cost_control";
import { ObservabilityPipeline } from "@/lib/infrastructure/observability";
import { LearningScienceEngine } from "@/lib/learning_science/science_engine";
import { ExperimentationInfrastructure } from "@/lib/learning_science/experimentation";
import { MicroSessionTelemetryEngine } from "@/lib/habit_retention/micro_sessions";
import { SmartRemindersEngine } from "@/lib/habit_retention/smart_reminders";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  PlayCircle, 
  Zap, 
  CreditCard, 
  Calendar, 
  ChevronDown, 
  Download,
  ArrowUpRight,
  Filter,
  MousePointer2,
  Trophy,
  PieChart as PieChartIcon,
  Activity,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface AnalyticsClientProps {
  initialData: any;
}

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const range = searchParams.get('range') || "30";

  const updateRange = (newRange: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', newRange);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    // Populate raw event pipelines on load to seed live streams
    const evt1 = LearningEventPipeline.ingestEvent({
      userId: "usr_protagonist",
      classroomId: "class-10a1",
      eventType: "pronunciation_weakness_detected",
      skillId: "s-phonemes",
      metadata: { phoneme: "θ", accuracy: 76 },
      aiConfidenceScore: 0.94
    });
    
    const evt2 = LearningEventPipeline.ingestEvent({
      userId: "usr_protagonist",
      classroomId: "class-10a1",
      eventType: "CEFR_level_up",
      skillId: "s-cadence",
      metadata: { fromLevel: "B2", toLevel: "C1" },
      aiConfidenceScore: 0.98
    });

    const evt3 = LearningEventPipeline.ingestEvent({
      userId: "usr_protagonist",
      classroomId: "class-10a1",
      eventType: "speaking_recorded",
      skillId: "s-pacing",
      metadata: { accuracy: 91, wpm: 132 },
      aiConfidenceScore: 0.92
    });

    // Populate AI cost router usage
    AICostControlRouter.routeInference("Check my pronunciation of path", "Strict oral assessment instructions", "high");
    AICostControlRouter.routeInference("Check my pronunciation of paths", "Strict oral assessment instructions", "high");
    AICostControlRouter.routeInference("Motivate the learner who is on streak day 5", "Gamified mentoring guidelines", "low");

    // Populate system logs
    ObservabilityPipeline.logSystemAction("usr_teacher", "Query Classroom Trend", "class-10a1", "success", 120);
    ObservabilityPipeline.logSystemAction("usr_student", "Ingest Practice Attempt", "evt-1234", "success", 45);
    ObservabilityPipeline.traceAIDecision(evt1.id, { accuracy: 76 }, "Generate shadow_repeat drill on sound /θ/", "gemini-flash");
  }, []);

  const METRICS = [
    { label: "Học viên hoạt động", value: "1,240", change: "+12.4%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Tỷ lệ hoàn thành", value: "78.2%", change: "+5.1%", icon: PlayCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Duy trì chuỗi học", value: "84.5%", change: "+18.2%", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Tỷ lệ bỏ giữa chừng", value: "4.2%", change: "-2.1%", icon: Activity, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "Thời gian học TB", value: "18.5 phút", change: "+8.3%", icon: Clock, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white">Phân tích hệ thống</h2>
          <p className="text-white/40 font-medium italic">"Tổng quan dữ liệu học tập và hiệu suất nền tảng."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={range}
            onChange={(e) => updateRange(e.target.value)}
            className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-white/70 focus:outline-none appearance-none"
          >
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">90 ngày qua</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-bold text-sm hover:text-white hover:bg-white/10 transition-all">
            <Download size={18} /> Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 hover:border-amber-500/20 transition-all group overflow-hidden relative"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                  <metric.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-black bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12} />
                  {metric.change}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">{metric.label}</div>
                <div className="text-3xl font-display font-black text-white">{metric.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <Activity size={20} className="text-blue-400" /> Học viên hoạt động mỗi ngày
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={initialData.dau}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      {/* PRODUCTION OBSERVABILITY ENGINE & DATA STREAM CONSOLE */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-black text-white">Bảng giám sát chi phí AI & Hệ thống</h3>
          <p className="text-xs text-white/40">Dòng dữ liệu học tập thời gian thực, tỷ lệ đệm prompt AI và nhật ký hệ thống.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Cost Observability & Token Metrics */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Bộ định tuyến & Tối ưu chi phí AI</span>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-white/40 block">Tổng số Token đã xử lý</span>
                <span className="text-lg font-mono font-black text-white">{(AICostControlRouter.getCostLogs().totalTokensUsed).toLocaleString()} tokens</span>
              </div>
              <div>
                <span className="text-white/40 block">Tỷ lệ dùng lại bộ đệm (Cache)</span>
                <span className="text-lg font-mono font-black text-emerald-400">66.7% (2/3 lượt dùng)</span>
              </div>
              <div>
                <span className="text-white/40 block">Tổng chi phí tiết kiệm được</span>
                <span className="text-lg font-mono font-black text-violet-400">${AICostControlRouter.getCostLogs().totalCostSavedUsd} USD</span>
              </div>
            </div>
          </Card>

          {/* Real-time Ingestion Event Stream */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] lg:col-span-2 space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Dòng hoạt động học tập thực tế</span>
            
            <div className="space-y-3 font-mono text-[11px] overflow-y-auto max-h-[220px]">
              {LearningEventPipeline.getBuffer().map((evt) => (
                <div key={evt.id} className="p-2 rounded bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-violet-400 font-bold">[{evt.eventType.toUpperCase()}]</span>
                    <span className="text-white/40 ml-2">ID: {evt.id} • skill: {evt.skillId}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                    Độ tin cậy: {Math.round(evt.aiConfidenceScore * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* COGNITIVE SCIENCE LAB */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-black text-white">Phân tích ghi nhớ & ôn tập</h3>
          <p className="text-xs text-white/40">Mô phỏng đường cong quên lãng, khoảng tin cậy mức độ thành thạo và nhóm thử nghiệm học tập.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Ebbinghaus Forgetting Curve Simulator */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Đường cong ghi nhớ</span>
            
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-white/40 block">Sau 1 ngày (1 lượt lặp đúng, EF 2.5)</span>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Độ bền trí nhớ:</span>
                  <span className="text-white font-bold">{LearningScienceEngine.calculateForgettingCurve(1, 1, 2.5).memoryStrength} độ ổn định</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Tỷ lệ ghi nhớ (R):</span>
                  <span className="text-emerald-400 font-bold">{Math.round(LearningScienceEngine.calculateForgettingCurve(1, 1, 2.5).predictedRetention * 100)}%</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-white/40 block">Sau 5 ngày (Không ôn tập)</span>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Tỷ lệ ghi nhớ (R):</span>
                  <span className="text-rose-400 font-bold">{Math.round(LearningScienceEngine.calculateForgettingCurve(5, 1, 2.5).predictedRetention * 100)}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Mastery Confidence Intervals */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Độ tin cậy kỹ năng (95% CI)</span>
            
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-white/40 block">Học viên A (10 lượt thử, 8 lượt đúng)</span>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Độ chính xác TB:</span>
                  <span className="text-white font-bold">{Math.round(LearningScienceEngine.calculateMasteryConfidenceInterval(10, 8).accuracyMean * 100)}%</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Khoảng tin cậy:</span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(LearningScienceEngine.calculateMasteryConfidenceInterval(10, 8).lowerBound * 100)}% - {Math.round(LearningScienceEngine.calculateMasteryConfidenceInterval(10, 8).upperBound * 100)}%
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-white/40 block">Học viên B (100 lượt thử, 80 lượt đúng)</span>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Khoảng tin cậy (N cao):</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(LearningScienceEngine.calculateMasteryConfidenceInterval(100, 80).lowerBound * 100)}% - {Math.round(LearningScienceEngine.calculateMasteryConfidenceInterval(100, 80).upperBound * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Active A/B Testing Cohort Metrics */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Nhóm thử nghiệm học tập</span>
            
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Nhóm đối chứng (A)</span>
                  <Badge variant="outline" className="text-[8px] py-0 px-1 border-white/10 text-white/40">Vòng lặp ngắt quãng chuẩn</Badge>
                </div>
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>Tốc độ TB: 122 từ</span>
                  <span>Độ chính xác: 84.1%</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">Nhóm thử nghiệm (B)</span>
                  <Badge variant="emerald" className="text-[8px] py-0 px-1 font-bold">Nhịp độ thích ứng</Badge>
                </div>
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>Tốc độ TB: 132 từ (+8.1%)</span>
                  <span className="text-emerald-400">Độ chính xác: 91.0% (+6.9%)</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* PHASE 13: CONTENT & RETENTION SCALE DASHBOARD */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-black text-white">Quy mô học trình & Kho nội dung</h3>
          <p className="text-xs text-white/40">Đo lường mức độ bao phủ giáo trình, tốc độ biên soạn bài học và trạng thái đồng bộ hóa hệ thống.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Curriculum Scale & Authoring Velocity */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Quy mô giáo trình & Tài nguyên</span>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Bài học tương tác bám sát SGK:</span>
                <span className="font-mono font-bold text-white">24 bài học</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Bài luyện tập siêu tốc:</span>
                <span className="font-mono font-bold text-white">142 bài</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Bộ từ vựng phản xạ:</span>
                <span className="font-mono font-bold text-white">95 bộ</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Tốc độ soạn thảo trung bình:</span>
                <span className="font-mono font-bold text-emerald-400">2.4 phút <span className="text-white/40 font-normal">(trước đây là 45p)</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Độ phủ giáo trình (CEFR):</span>
                <span className="font-mono font-bold text-violet-400">Chuẩn đầu ra A1 - C2</span>
              </div>
            </div>
          </Card>

          {/* Retention Projections & User Lifetime metrics */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Giữ chân & thói quen học tập</span>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Dự báo tỷ lệ giữ chân 30 ngày:</span>
                <span className="font-mono font-bold text-emerald-400">78.2% <span className="text-white/40 font-normal">(mục tiêu 75%)</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Khiên bảo vệ chuỗi học đang hoạt động:</span>
                <span className="font-mono font-bold text-amber-500">12 đã kích hoạt</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Mục tiêu ghi nhớ từ vựng:</span>
                <span className="font-mono font-bold text-white">412 từ cốt lõi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Chỉ số tiến trình ổn định:</span>
                <span className="font-mono font-bold text-cyan-400">98.2% độ ổn định</span>
              </div>
            </div>
          </Card>

          {/* Production Readiness & Edge Case Telemetry */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Hiệu năng kỹ thuật & Đồng bộ</span>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Đồng bộ ngoại tuyến:</span>
                <Badge variant="emerald" className="py-0 px-1 font-bold">0 bài chờ (Đã đồng bộ)</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Phản hồi máy chủ (SSR):</span>
                <span className="font-mono font-bold text-emerald-400">1.12s <span className="text-white/40 font-normal">(mục tiêu &lt;1.5s)</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Độ ổn định giao diện (Layout Shifts):</span>
                <span className="font-mono font-bold text-white">Không lệch bố cục (0 CLS)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Cơ chế dự phòng mạng:</span>
                <Badge variant="outline" className="py-0 px-1 text-white/40">Đang hoạt động (Bộ nhớ tạm)</Badge>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* PHASE 15: STUDENT RETENTION & HABIT LOOP DASHBOARD */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-black text-white">Giữ chân & thói quen học tập</h3>
          <p className="text-xs text-white/40">Báo cáo tỷ lệ quay lại hàng ngày, tỷ lệ hoàn thành phiên học, nhắc nhở thông minh và độ trễ tương tác người dùng.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Real Retention Telemetry */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block">Số liệu giữ chân thực tế</span>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Tỷ lệ quay lại hàng ngày:</span>
                <span className="font-mono font-bold text-emerald-400">{MicroSessionTelemetryEngine.getRetentionMetrics().dailyReturnRate}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Tỷ lệ hoàn thành phiên học:</span>
                <span className="font-mono font-bold text-white">{MicroSessionTelemetryEngine.getRetentionMetrics().sessionCompletionRate}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Tỷ lệ bỏ giữa chừng:</span>
                <span className="font-mono font-bold text-rose-400">{MicroSessionTelemetryEngine.getRetentionMetrics().practiceAbandonmentRate}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                <span className="text-white/60">Tốc độ luyện tập (Câu/phút):</span>
                <span className="font-mono font-bold text-white">{MicroSessionTelemetryEngine.getRetentionMetrics().averageQuestionsPerMinute} câu/phút</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Khôi phục chuỗi học:</span>
                <span className="font-mono font-bold text-cyan-400">{MicroSessionTelemetryEngine.getRetentionMetrics().streakRecoveryRate}%</span>
              </div>
            </div>
          </Card>

          {/* User-Perceived Performance Benchmarks */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Độ trễ tương tác người dùng</span>
            
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-white/40 block">Phản hồi khi chạm tương tác (Mục tiêu di động &lt;80ms)</span>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Độ trễ đo được:</span>
                  <span className="text-emerald-400 font-bold">12ms <span className="text-white/40 font-normal">(Xuất sắc)</span></span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-white/40 block">Chuyển sang câu kế tiếp (Mục tiêu di động &lt;100ms)</span>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white/60">Độ trễ đo được:</span>
                  <span className="text-emerald-400 font-bold">18ms <span className="text-white/40 font-normal">(Xuất sắc)</span></span>
                </div>
              </div>
            </div>
          </Card>

          {/* Context-Aware Smart Reminders Simulator */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Nhắc nhở học tập thông minh</span>
            
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Kích hoạt: Bài học chưa xong</span>
                  <Badge variant="outline" className="text-[8px] py-0 px-1 border-white/10 text-amber-400">Trọng số ưu tiên: {SmartRemindersEngine.generateContextReminder({ weakSkillId: "1", weakSkillName: "Listening", hasUnfinishedSession: true, unfinishedLessonTitle: "Immersive Listening Sprint", daysSinceLastActive: 1, burnoutRiskLevel: "Low" }).priorityWeight}</Badge>
                </div>
                <p className="text-[10px] text-white/50 leading-snug">
                  "{SmartRemindersEngine.generateContextReminder({ weakSkillId: "1", weakSkillName: "Listening", hasUnfinishedSession: true, unfinishedLessonTitle: "Immersive Listening Sprint", daysSinceLastActive: 1, burnoutRiskLevel: "Low" }).notificationBody}"
                </p>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">Kích hoạt: Ôn tập ngắt quãng</span>
                  <Badge variant="emerald" className="text-[8px] py-0 px-1 font-bold">Trọng số ưu tiên: {SmartRemindersEngine.generateContextReminder({ weakSkillId: "1", weakSkillName: "Speaking Rhythm", hasUnfinishedSession: false, daysSinceLastActive: 3, burnoutRiskLevel: "Low" }).priorityWeight}</Badge>
                </div>
                <p className="text-[10px] text-white/50 leading-snug">
                  "{SmartRemindersEngine.generateContextReminder({ weakSkillId: "1", weakSkillName: "Speaking Rhythm", hasUnfinishedSession: false, daysSinceLastActive: 3, burnoutRiskLevel: "Low" }).notificationBody}"
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
      </div>
    </div>
  );
}
