"use client";
import { motion } from "framer-motion";
import { 
  Users, 
  PlayCircle, 
  Clock, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "12,482", change: "+12.5%", icon: Users, color: "text-blue-400" },
  { label: "Story Plays", value: "84.2K", change: "+18.2%", icon: PlayCircle, color: "text-amber-500" },
  { label: "Avg. Immersion", value: "42m", change: "+5.4%", icon: Clock, color: "text-emerald-400" },
  { label: "Completion Rate", value: "64%", change: "+2.1%", icon: TrendingUp, color: "text-violet-400" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-display font-black tracking-tight">Vantage Point</h2>
        <p className="text-white/40 font-medium">Chào mừng trở lại, Nam. Đây là cái nhìn tổng quan về hệ sinh thái Cinematic của bạn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[32px] bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} />
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">{stat.label}</div>
              <div className="text-3xl font-display font-black tracking-tighter">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content (Placeholders) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-[400px] rounded-[40px] bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
          <span className="text-white/10 font-display font-bold uppercase tracking-widest">Immersion Analytics Chart</span>
        </div>
        <div className="h-[400px] rounded-[40px] bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
          <span className="text-white/10 font-display font-bold uppercase tracking-widest">Active Stories</span>
        </div>
      </div>
    </div>
  );
}
