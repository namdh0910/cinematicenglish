"use client";
import { motion } from "framer-motion";
import { BookOpen, Mic, Sparkles, Flame, Trophy, ShieldCheck } from "lucide-react";
import { UserProgress, Mission } from "@/lib/data";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface MissionHubProps {
  progress: UserProgress;
}

const iconMap: Record<string, any> = {
  BookOpen: BookOpen,
  Mic: Mic,
  Sparkles: Sparkles,
};

export default function MissionHub({ progress }: MissionHubProps) {
  return (
    <div className="space-y-10">
      {/* ─── MOMENTUM AURA & IDENTITY ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Momentum Aura Visualization */}
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ backgroundColor: progress.auraColor }}
              />
              <div className="relative w-32 h-32 rounded-full glass border-white/10 flex flex-col items-center justify-center shadow-glow-violet/20">
                <Flame size={40} className="text-amber-400 mb-1" />
                <span className="text-3xl font-display font-black">{progress.streak}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Ngày duy trì</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Danh tính hiện tại</span>
                <Badge variant="violet" className="w-fit mx-auto md:mx-0">{progress.identity}</Badge>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-black mb-4">
                Đang tiến hóa thành <span className="gradient-text-gold">{progress.nextIdentity}</span>
              </h3>
              
              {/* Identity Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                <span>{progress.identity}</span>
                <span>{progress.nextIdentity}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Streak Protection / Comeback */}
        <Card className="flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 border-emerald-500/20">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <h4 className="font-bold mb-2">Lá Chắn Đang Hoạt Động</h4>
          <p className="text-xs text-secondary leading-relaxed">
            Hành trình của bạn được bảo vệ. Nếu bạn lỡ một ngày, hào quang sẽ không tắt.
          </p>
        </Card>
      </div>

      {/* ─── DAILY RITUALS (MISSIONS) ─── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" /> Nghi Thức Hằng Ngày
          </h2>
          <span className="text-xs font-mono text-white/40">Làm mới sau 14:22:05</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {progress.missions.map((mission) => {
            const Icon = iconMap[mission.icon] || BookOpen;
            const progressPercent = (mission.progress / mission.target) * 100;

            return (
              <Card 
                key={mission.id} 
                className={`relative group transition-all duration-500 ${mission.isCompleted ? 'bg-amber-400/5 border-amber-400/20' : 'hover:border-white/20'}`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl transition-colors ${mission.isCompleted ? 'bg-amber-400 text-black shadow-glow-gold' : 'bg-white/5 text-white/60 group-hover:text-white'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className={`font-bold transition-colors ${mission.isCompleted ? 'text-amber-400' : ''}`}>
                      {mission.title}
                    </h4>
                    <p className="text-xs text-secondary mt-1">{mission.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black tracking-widest uppercase text-white/20">Tiến độ</span>
                    <span className="text-xs font-mono">
                      {mission.isCompleted ? 'HOÀN THÀNH' : `${mission.progress}/${mission.target}`}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className={`h-full transition-colors ${mission.isCompleted ? 'bg-amber-400 shadow-glow-gold' : 'bg-white/20'}`}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/60 uppercase tracking-widest">
                    <Trophy size={10} /> +{mission.xpReward} XP
                  </div>
                  {mission.isCompleted && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-amber-400"
                    >
                      <ShieldCheck size={16} />
                    </motion.div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ─── EMOTIONAL HOOK ─── */}
      <div className="p-8 rounded-[32px] glass border-white/5 text-center">
        <p className="text-white/60 italic font-display text-lg">
          "Hào quang ngôn ngữ của bạn đang rực cháy hơn bao giờ hết. Đừng dừng lại, bạn đang trở thành phiên bản Protagonist thực thụ."
        </p>
      </div>
    </div>
  );
}
