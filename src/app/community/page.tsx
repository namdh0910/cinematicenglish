"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Target, Award, Sparkles, Users, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
// TODO: LEADERBOARD will be fetched from Supabase using user total_xp and streaks

const CHALLENGES = [
  { title: "Chuỗi Nói 7 Ngày", desc: "Ghi âm giọng nói của bạn mỗi ngày trong tuần này", progress: 4, total: 7, reward: "500 XP + 🎤 Huy hiệu", color: "var(--accent-cyan)" },
  { title: "Marathon Truyện", desc: "Hoàn thành 5 câu chuyện trong tuần này", progress: 2, total: 5, reward: "300 XP", color: "var(--accent-violet)" },
  { title: "Bậc Thầy Từ Vựng", desc: "Lưu 30 từ mới trong tuần này", progress: 18, total: 30, reward: "200 XP + 📚 Huy hiệu", color: "var(--accent-gold)" },
];

export default function CommunityPage() {
  const [tab, setTab] = useState<"leaderboard" | "challenges" | "achievements">("leaderboard");

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <main className="pt-24 pb-12">
        <Section container={false} className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/learn" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-glass-hover transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1">
              <Badge variant="violet" className="mb-1">Cộng đồng</Badge>
              <h1 className="text-xl font-bold font-display">Thử thách & Xếp hạng</h1>
            </div>
            <Badge variant="emerald" className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              4,821 Trực tuyến
            </Badge>
          </div>

          {/* Tabs Area */}
          <Card padding="none" className="mb-10 p-1 bg-white/[0.03] border-white/10" hover={false}>
            <div className="flex gap-1">
              {[
                { key: "leaderboard", icon: <Trophy size={16} />, label: "Xếp hạng" },
                { key: "challenges", icon: <Target size={16} />, label: "Thử thách" },
                { key: "achievements", icon: <Award size={16} />, label: "Thành tích" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                    tab === t.key 
                      ? "bg-gradient-to-br from-accent-violet to-indigo-600 text-white shadow-glow-violet" 
                      : "text-secondary hover:text-primary hover:bg-white/5"
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {tab === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                    <Trophy size={12} className="text-accent-gold" />
                    Bảng xếp hạng tuần
                  </div>
                  <span className="text-[10px] font-bold text-muted uppercase">Chốt vào Chủ Nhật</span>
                </div>

                {/* Empty State / Loading State for Real Data */}
                <div className="text-center py-12 border border-dashed border-white/10 rounded-[32px] glass-card mt-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Trophy size={24} className="text-white/20" />
                  </div>
                  <h3 className="text-lg font-bold text-white/60">Bảng xếp hạng đang cập nhật</h3>
                  <p className="text-sm text-white/40 mt-2 max-w-sm mx-auto">Hệ thống đang tổng hợp điểm kinh nghiệm và xếp hạng từ toàn bộ học viên.</p>
                </div>
              </motion.div>
            )}

            {tab === "challenges" && (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {CHALLENGES.map((c, i) => (
                  <Card 
                    key={c.title} 
                    transition={{ delay: i * 0.1 }}
                    className="border-white/5"
                    padding="lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-bold text-lg mb-1">{c.title}</h3>
                        <p className="text-sm text-secondary leading-relaxed">{c.desc}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 bg-white/5 border-white/10" style={{ color: c.color }}>
                        {c.reward}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="progress-bar flex-1 h-2 bg-white/5">
                        <motion.div
                          className="progress-fill h-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(c.progress / c.total) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ background: c.color }}
                        />
                      </div>
                      <span className="text-xs font-black font-mono" style={{ color: c.color }}>{c.progress}/{c.total}</span>
                    </div>
                  </Card>
                ))}

                <Card className="text-center border-accent-gold/20" padding="lg">
                  <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Target size={32} className="text-accent-gold" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">Thử thách mới mỗi tuần</h3>
                  <p className="text-sm text-secondary max-w-sm mx-auto leading-relaxed">
                    Hoàn thành tất cả các mục tiêu để nhận ngay <span className="text-accent-gold font-bold">Huy hiệu Quán quân</span> và phần thưởng XP cực lớn.
                  </p>
                </Card>
              </motion.div>
            )}

            {tab === "achievements" && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { emoji: "🔥", name: "Chuỗi 7 ngày", desc: "Học tập liên tục 1 tuần", earned: true },
                  { emoji: "🎤", name: "Ghi âm đầu", desc: "Bài luyện nói đầu tiên", earned: true },
                  { emoji: "📖", name: "Mọt truyện", desc: "Xong câu chuyện đầu", earned: true },
                  { emoji: "🧠", name: "Thông thái", desc: "Lưu 50 từ vựng", earned: false },
                  { emoji: "🏆", name: "Top 10", desc: "Lọt top bảng tuần", earned: false },
                  { emoji: "⚡", name: "Siêu tốc", desc: "3 bài học/ngày", earned: false },
                  { emoji: "🌍", name: "Ngoại giao", desc: "Chat với 6 nhân vật", earned: false },
                  { emoji: "💎", name: "Kim cương", desc: "Chuỗi 30 ngày", earned: false },
                ].map((a, i) => (
                  <Card
                    key={a.name}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col items-center text-center p-6 ${a.earned ? "border-accent/20" : "opacity-30 grayscale"}`}
                  >
                    <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform">{a.emoji}</div>
                    <div className="font-bold text-sm mb-1">{a.name}</div>
                    <div className="text-[10px] text-secondary font-medium uppercase tracking-tight leading-relaxed">{a.desc}</div>
                    {a.earned && <Badge variant="emerald" className="mt-4 text-[9px] px-2 py-0.5">Đạt được ✓</Badge>}
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      </main>
    </div>
  );
}
