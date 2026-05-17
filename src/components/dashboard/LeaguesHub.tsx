"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Sparkles, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Award, 
  ChevronRight, 
  UserCheck, 
  GraduationCap, 
  Info,
  Calendar,
  Lock,
  ArrowUpRight,
  Flame
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface Competitor {
  rank: number;
  name: string;
  avatar: string;
  identity: string;
  xp: number;
  streak: number;
  accuracy: number;
  tag?: { text: string; type: "comeback" | "rising" | "consistent" };
}

const GLOBAL_LEAGUE_DATA: Competitor[] = [];

const CLASSROOM_LEAGUE_DATA: Competitor[] = [];

const LEAGUE_TIERS = [
  { id: "bronze", name: "Hạng Đồng", color: "#b45309", bg: "rgba(180, 83, 9, 0.05)", border: "rgba(180, 83, 9, 0.2)" },
  { id: "silver", name: "Hạng Bạc", color: "#64748b", bg: "rgba(100, 116, 139, 0.05)", border: "rgba(100, 116, 139, 0.2)" },
  { id: "gold", name: "Hạng Vàng", color: "#eab308", bg: "rgba(234, 179, 8, 0.05)", border: "rgba(234, 179, 8, 0.2)", active: true },
  { id: "platinum", name: "Hạng Bạch Kim", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.05)", border: "rgba(6, 182, 212, 0.2)" },
  { id: "aura", name: "Hạng Kim Cương", color: "#a855f7", bg: "rgba(168, 85, 247, 0.05)", border: "rgba(168, 85, 247, 0.2)" },
];

export default function LeaguesHub() {
  const [activeLeagueTab, setActiveLeagueTab] = useState<"global" | "classroom">("global");
  const [selectedTier, setSelectedTier] = useState("gold");

  const activeCompetitors = activeLeagueTab === "global" ? GLOBAL_LEAGUE_DATA : CLASSROOM_LEAGUE_DATA;
  const currentTier = LEAGUE_TIERS.find(t => t.id === selectedTier) || LEAGUE_TIERS[2];

  return (
    <div className="space-y-6">
      {/* ─── LEAGUE PROGRESSION HEADER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        <div className="lg:col-span-3 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-3">
            {LEAGUE_TIERS.map((tier) => {
              const isActive = tier.id === selectedTier;
              return (
                <button
                   key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  style={{ 
                    color: tier.color,
                    backgroundColor: isActive ? tier.bg : "transparent",
                    borderColor: isActive ? tier.color : "rgba(255,255,255,0.05)"
                  }}
                  className={`px-5 py-3 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive ? "shadow-glow-gold/10 scale-102" : "opacity-40 hover:opacity-85"
                  }`}
                >
                  <Trophy size={14} /> {tier.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Đặt lại Đấu trường</span>
          <span className="text-xs font-mono font-bold text-amber-500 flex items-center justify-end gap-1.5 mt-1">
            <Calendar size={14} /> Chủ Nhật, 23:59
          </span>
        </div>
      </div>

      {/* ─── DUAL ARENA SELECTOR (GLOBAL & CLASSROOM) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveLeagueTab("global")}
                className={`text-lg font-display font-black transition-colors ${
                  activeLeagueTab === "global" ? "text-white" : "text-white/30 hover:text-white/60"
                }`}
              >
                Bảng xếp hạng Toàn quốc
              </button>
              <button
                onClick={() => setActiveLeagueTab("classroom")}
                className={`text-lg font-display font-black transition-colors flex items-center gap-2 ${
                  activeLeagueTab === "classroom" ? "text-white" : "text-white/30 hover:text-white/60"
                }`}
              >
                Đấu trường Lớp học <GraduationCap size={16} className="text-violet-400" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <Info size={12} /> Top 3 Thăng hạng
            </div>
          </div>

          {/* ─── LEADERBOARD TABLE ─── */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {activeCompetitors.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-dashed border-white/10 glass">
                  <Trophy size={20} className="mx-auto text-white/20 mb-2" />
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Đang tổng hợp dữ liệu</p>
                </div>
              ) : (
                activeCompetitors.map((competitor, idx) => {
                  const isUser = competitor.name.includes("Bạn");
                  return (
                    <motion.div
                      key={competitor.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ 
                        borderColor: isUser ? currentTier.color : "rgba(255,255,255,0.05)",
                        backgroundColor: isUser ? currentTier.bg : "rgba(255,255,255,0.01)"
                      }}
                      className={`rounded-xl border p-3 md:p-3.5 flex items-center justify-between gap-4 transition-all hover:border-white/10 ${
                        isUser ? "shadow-glow-gold/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Indicator */}
                        <span className={`w-6 text-center font-mono font-black text-sm ${
                          competitor.rank <= 3 ? "text-amber-500" : "text-white/20"
                        }`}>
                          #{competitor.rank}
                        </span>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden glass border-white/5 shrink-0">
                          <img src={competitor.avatar} alt={competitor.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${isUser ? "text-white" : "text-white/80"}`}>
                              {competitor.name}
                            </h4>
                            {competitor.tag && (
                              <Badge 
                                variant={competitor.tag.type === "comeback" ? "rose" : (competitor.tag.type === "rising" ? "gold" : "violet")} 
                                className="text-[8px] py-0 px-2"
                              >
                                {competitor.tag.text}
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider block mt-0.5">
                            {competitor.identity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 text-right">
                        {/* Consistency score */}
                        <div className="hidden sm:block">
                          <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block">Độ chính xác</span>
                          <span className="text-xs font-mono font-bold text-white/70">{competitor.accuracy}%</span>
                        </div>
                        
                        {/* Streak */}
                        <div className="hidden sm:block">
                          <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block">Chuỗi ngày</span>
                          <span className="text-xs font-mono font-bold text-amber-500 flex items-center justify-end gap-1">
                            <Flame size={12} /> {competitor.streak} ngày
                          </span>
                        </div>

                        {/* XP */}
                        <div>
                          <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block">Điểm tuần</span>
                          <span className="text-sm font-mono font-black text-white flex items-center justify-end gap-1">
                            <Zap size={12} className="text-amber-500" fill="currentColor" /> {competitor.xp} XP
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── CLASSROOM / GROUP RITUAL PANEL ─── */}
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
              Mục tiêu chung Lớp học <Users size={18} className="text-amber-500" />
            </h3>
          </div>

          <Card className="p-6 bg-gradient-to-br from-violet-950/10 to-black border-white/5 space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest">Nhóm đang hoạt động</span>
              <h4 className="text-md font-bold text-white">Lớp 11A1 — Giáo trình mới Group</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Hợp tác cùng cả lớp tích luỹ XP hàng tuần để mở khoá **Lá Chắn Bảo Vệ** bảo vệ chuỗi học tập cho tất cả thành viên.
              </p>
            </div>

            {/* Target Progress Milestone */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-end text-xs">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Cột mốc chung</span>
                <span className="font-mono font-bold text-white">8.450 / 10.000 XP</span>
              </div>
              
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[84.5%] bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-glow-violet/30" />
              </div>
              
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider block text-center">
                Còn thiếu 1.550 XP để mở khoá Lá Chắn tuần này
              </span>
            </div>

            {/* Class Ritual Missions */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">Nhiệm vụ Nhóm</span>
              
              <div className="space-y-2.5">
                {[
                  { text: "15 thành viên hoàn thành Nghi thức học tập", progress: "12/15" },
                  { text: "Đạt trung bình Độ chuẩn phát âm > 88%", progress: "86.5%" }
                ].map((mission, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/60 font-medium">{mission.text}</span>
                    <span className="font-mono font-bold text-amber-400">{mission.progress}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Mature social quote */}
          <div className="p-6 rounded-[28px] border border-white/5 bg-white/[0.01] text-center">
            <p className="text-xs text-white/40 leading-relaxed italic">
              "Luyện tập tiếng Anh không đơn độc. Bạn đang cùng tập thể 11A1 xây dựng nền tảng ngôn ngữ vững chắc hướng ra toàn cầu."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
