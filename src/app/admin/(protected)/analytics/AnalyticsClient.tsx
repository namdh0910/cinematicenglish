"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LearningEventPipeline } from "@/lib/infrastructure/learning_events";
import { AICostControlRouter } from "@/lib/infrastructure/cost_control";
import { ObservabilityPipeline } from "@/lib/infrastructure/observability";
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
  Activity
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
    AICostControlRouter.routeInference("Motivate the learner who is on streak day 5", "Cinematic mentoring guidelines", "low");

    // Populate system logs
    ObservabilityPipeline.logSystemAction("usr_teacher", "Query Classroom Trend", "class-10a1", "success", 120);
    ObservabilityPipeline.logSystemAction("usr_student", "Ingest Practice Attempt", "evt-1234", "success", 45);
    ObservabilityPipeline.traceAIDecision(evt1.id, { accuracy: 76 }, "Generate shadow_repeat drill on sound /θ/", "gemini-flash");
  }, []);

  const METRICS = [
    { label: "Total Plays", value: initialData.totals.plays.toLocaleString(), change: "+18.2%", icon: PlayCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Users", value: initialData.totals.users.toLocaleString(), change: "+12.4%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Pro Subscriptions", value: initialData.totals.proUsers.toLocaleString(), change: "+5.1%", icon: CreditCard, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Active Stories", value: initialData.totals.stories.toLocaleString(), change: "0", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white">Intelligence Analytics</h2>
          <p className="text-white/40 font-medium italic">"Deciphering the emotional and growth patterns of the platform."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={range}
            onChange={(e) => updateRange(e.target.value)}
            className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-white/70 focus:outline-none appearance-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-bold text-sm hover:text-white hover:bg-white/10 transition-all">
            <Download size={18} /> Export Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Activity size={20} className="text-blue-400" /> Daily Active Users
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
          <h3 className="text-xl font-display font-black text-white">Observability & Cost Control Console</h3>
          <p className="text-xs text-white/40">Real-time telemetry event streams, API prompt caching ratios, and system audit logs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Cost Observability & Token Metrics */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">AI cost & prompt caching router</span>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-white/40 block">Total Tokens Processed</span>
                <span className="text-lg font-mono font-black text-white">{(AICostControlRouter.getCostLogs().totalTokensUsed).toLocaleString()} tokens</span>
              </div>
              <div>
                <span className="text-white/40 block">Prompt Cache Hit Rate</span>
                <span className="text-lg font-mono font-black text-emerald-400">66.7% (2/3 hits)</span>
              </div>
              <div>
                <span className="text-white/40 block">Cumulative Cost Saved</span>
                <span className="text-lg font-mono font-black text-violet-400">${AICostControlRouter.getCostLogs().totalCostSavedUsd} USD</span>
              </div>
            </div>
          </Card>

          {/* Real-time Ingestion Event Stream */}
          <Card className="p-6 border-white/5 bg-[#1a1a1a] lg:col-span-2 space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">Live Learning Event Pipeline Stream</span>
            
            <div className="space-y-3 font-mono text-[11px] overflow-y-auto max-h-[220px]">
              {LearningEventPipeline.getBuffer().map((evt) => (
                <div key={evt.id} className="p-2 rounded bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-violet-400 font-bold">[{evt.eventType.toUpperCase()}]</span>
                    <span className="text-white/40 ml-2">ID: {evt.id} • skill: {evt.skillId}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                    Confidence: {Math.round(evt.aiConfidenceScore * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
      </div>
    </div>
  );
}
