"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Mic, 
  TrendingUp, 
  Volume2, 
  Zap, 
  Sparkles,
  Info,
  Calendar,
  Layers,
  Activity,
  Award
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { SpeakingIntelligenceAnalyzer, SpeakingMetrics, VoiceHistoryPoint } from "@/lib/intelligence/speaking_intelligence";

const MOCK_SPEAKING_METRICS: SpeakingMetrics = {
  accuracy: 91,
  rhythm: 88,
  fluency: 89,
  confidence: 94,
  pacingWpm: 132,
  pauseCount: 2,
  fillerWords: ["um"],
  cefrLevel: "C1",
  weakPhonemes: ["θ (th)", "ð (th)", "ʃ (sh)"]
};

const MOCK_HISTORY: VoiceHistoryPoint[] = [
  { week: "Week 1", accuracyTrend: 78, fluencyTrend: 72, confidenceTrend: 80, cefrLevel: "B1" },
  { week: "Week 2", accuracyTrend: 82, fluencyTrend: 78, confidenceTrend: 84, cefrLevel: "B2" },
  { week: "Week 3", accuracyTrend: 85, fluencyTrend: 82, confidenceTrend: 88, cefrLevel: "B2" },
  { week: "Week 4", accuracyTrend: 89, fluencyTrend: 86, confidenceTrend: 91, cefrLevel: "C1" },
  { week: "Week 5", accuracyTrend: 91, fluencyTrend: 89, confidenceTrend: 94, cefrLevel: "C1" },
];

export default function SpeakingAnalytics() {
  const [metrics, setMetrics] = useState<SpeakingMetrics>(MOCK_SPEAKING_METRICS);
  const [history, setHistory] = useState<VoiceHistoryPoint[]>(MOCK_HISTORY);

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="page-top pb-20">
        <Section container={true} className="space-y-10">
          
          {/* Top navigation path */}
          <div>
            <Link href="/learn">
              <span className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <ChevronLeft size={14} /> Về Lộ trình học
              </span>
            </Link>
          </div>

          {/* Title Info Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                <Mic size={12} /> Speaking Evolution Analytics
              </span>
              <h1 className="text-3xl font-display font-black text-white">Oral Fluency Matrix</h1>
              <p className="text-xs text-white/40">Longitudinal evaluation of phoneme accuracy, sentence pacing, and CEFR indicators.</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="violet" className="py-1 px-3 text-[10px] font-mono">CEFR Level: {metrics.cefrLevel}</Badge>
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest">
                Updated today, 10:24 AM
              </span>
            </div>
          </div>

          {/* LEARNING DNA PROFILE & AI REASONING SYSTEM */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning DNA Card */}
            <Card className="p-5 border-white/5 bg-gradient-to-br from-violet-950/10 to-black lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet-400" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-violet-400 uppercase">Learner DNA Profile</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-black text-white">Rhythm-Driven Speaker (C1)</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Bạn có phản xạ nhịp điệu (Rhythm & Stress) cực mạnh đạt 88%, giúp giọng nói luôn có nhạc điệu tự nhiên. Tuy nhiên, AI phát hiện bạn có xu hướng chững lại (vocal hesitation) khoảng 850ms trước các cụm từ chuyên ngành nhiều âm tiết (như "ecological"). Đây là cơ chế tự nhiên khi não bộ ưu tiên lục tìm từ vựng chất lượng cao trước khi cơ phát âm thực hiện hành động.
                </p>
              </div>
              <div className="pt-2 flex gap-4 text-[9px] font-mono text-white/30 border-t border-white/5">
                <span>Memory Retention: 95%</span>
                <span>Burnout Index: Low</span>
              </div>
            </Card>

            {/* AI Reasoning Insight Card */}
            <Card className="p-5 border-white/5 bg-white/[0.01] space-y-3">
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-500 uppercase block">AI Reasoning Insights</span>
              
              <div className="space-y-2.5">
                {[
                  { title: "Pause Penalty", desc: "Rhythm falls by 12% after silent periods exceeding 800ms." },
                  { title: "Numerical Surge", desc: "Listening accuracy drops 14% on rapid number clusters." },
                  { title: "Emotional Retain", desc: "Retain emotional vocabulary 32% longer in spaced-repetition." }
                ].map((insight, idx) => (
                  <div key={idx} className="space-y-0.5 text-[11px]">
                    <h5 className="font-bold text-white flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-amber-500" /> {insight.title}
                    </h5>
                    <p className="text-[9px] text-white/40 leading-snug">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Matrix Core Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Phoneme Accuracy", value: `${metrics.accuracy}%`, color: "text-emerald-400" },
              { label: "Stress & Rhythm", value: `${metrics.rhythm}%`, color: "text-violet-400" },
              { label: "Fluency Pacing", value: `${metrics.fluency}%`, color: "text-amber-500" },
              { label: "Confidence Index", value: `${metrics.confidence}%`, color: "text-cyan-400" },
            ].map((stat, idx) => (
              <Card key={idx} className="p-6 border-white/5 bg-white/[0.01]">
                <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">{stat.label}</span>
                <h4 className={`text-3xl font-mono font-black mt-1 ${stat.color}`}>{stat.value}</h4>
              </Card>
            ))}
          </div>

          {/* Interactive Heatmap & Week Progress Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Side: Heatmap and Voice Coach */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Pronunciation Heatmap */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Pronunciation Heatmap</h3>
                  <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Passage Walkthrough</span>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] leading-relaxed font-serif text-lg text-white/80 select-none">
                  {/* Words rendered as heat blocks */}
                  {[
                    { word: "The", score: "perfect" },
                    { word: "rapid", score: "perfect" },
                    { word: "fluctuation", score: "evolving" },
                    { word: "of", score: "perfect" },
                    { word: "oceanic", score: "perfect" },
                    { word: "currents", score: "evolving" },
                    { word: "has", score: "perfect" },
                    { word: "directly", score: "perfect" },
                    { word: "affected", score: "perfect" },
                    { word: "local", score: "perfect" },
                    { word: "ecological", score: "evolving" },
                    { word: "balances,", score: "perfect" },
                    { word: "creating", score: "perfect" },
                    { word: "an", score: "perfect" },
                    { word: "environment", score: "perfect" },
                    { word: "ripe", score: "perfect" },
                    { word: "for", score: "perfect" },
                    { word: "microclimate", score: "evolving" },
                    { word: "anomalies.", score: "perfect" }
                  ].map((item, idx) => (
                    <span 
                      key={idx} 
                      className={`inline-block mx-1 my-0.5 px-1 rounded transition-colors ${
                        item.score === "perfect" 
                          ? "hover:bg-emerald-500/10 text-emerald-400" 
                          : "hover:bg-amber-500/10 text-amber-400 border-b border-amber-500/30"
                      }`}
                    >
                      {item.word}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 text-[10px] font-mono text-white/30 justify-end">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500" /> Perfect Phoneme</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-500" /> Evolving Cadence</span>
                </div>
              </div>

              {/* AI Cinematic Speaking Mentor */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Speaking Mentor Assessment</h3>

                <Card className="p-6 border-white/5 bg-gradient-to-br from-violet-950/10 to-black space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">AI Cinematic Mentor</h4>
                      <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-0.5 block">Fluency Profiler</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed italic">
                    "Protagonist, your voice evolution is moving beautifully. Your rhythm has gained substantial consistency, allowing your confidence index to reach 94%. Let's continue pacing naturally at {metrics.pacingWpm} WPM without rushing the sentence boundaries. Focus on releasing stress naturally in syllables like 'fluctuation'."
                  </p>
                </Card>
              </div>

            </div>

            {/* Right Side: Longitudinal progress and weak phonemes */}
            <div className="space-y-8">
              
              {/* Weak Phoneme Clusters */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Weak Phoneme Clusters</h3>

                <div className="space-y-3">
                  {[
                    { ph: "θ (th)", word: "thought, path", tip: "Place your tongue between your teeth and exhale gently to form the θ sound." },
                    { ph: "ð (th)", word: "the, mother", tip: "Place your tongue between your teeth and vibrate vocal cords to produce ð." },
                    { ph: "ʃ (sh)", word: "she, ocean", tip: "Round your lips slightly and exhale with air passing over the tongue." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-amber-500">{item.ph}</span>
                        <span className="text-[9px] text-white/20 font-mono">Example: {item.word}</span>
                      </div>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        {item.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress History */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Fluency Timeline</h3>

                <div className="space-y-3">
                  {history.map((point, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">{point.week}</span>
                        <span className="text-[9px] text-white/30 uppercase font-bold mt-0.5 block">CEFR: {point.cefrLevel}</span>
                      </div>

                      <div className="flex items-center gap-6 text-right font-mono text-xs font-bold">
                        <span className="text-emerald-400">{point.accuracyTrend}% Acc</span>
                        <span className="text-violet-400">{point.fluencyTrend}% Flu</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </Section>
      </main>
    </div>
  );
}
