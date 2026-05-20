"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  PlayCircle, 
  CreditCard, 
  Plus, 
  HelpCircle, 
  BarChart2, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  MoreVertical
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell
} from "recharts";
import Link from "next/link";
import { getDashboardStats } from "@/app/admin/actions";

const dauData = [
  { name: "T2", dau: 4200 },
  { name: "T3", dau: 5100 },
  { name: "T4", dau: 4800 },
  { name: "T5", dau: 6200 },
  { name: "T6", dau: 5800 },
  { name: "T7", dau: 7500 },
  { name: "CN", dau: 8400 },
];

const categoryData = [
  { name: "Tiếng Anh 6", plays: 2400 },
  { name: "Tiếng Anh 10", plays: 9800 },
  { name: "Tiếng Anh 11", plays: 4567 },
  { name: "Tiếng Anh 12", plays: 3908 },
  { name: "Luyện IELTS", plays: 1398 },
];

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function DetailedDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pb-12 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2 w-64 h-12 bg-white/5 rounded-2xl" />
          <div className="w-48 h-10 bg-white/5 rounded-2xl" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-[#1a1a1a] border border-white/5 rounded-[32px]" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[420px] bg-[#1a1a1a] border border-white/5 rounded-[40px]" />
          <div className="h-[420px] bg-[#1a1a1a] border border-white/5 rounded-[40px]" />
        </div>
      </div>
    );
  }

  // Map stats values
  const statsList = [
    { label: "Tổng học viên", value: data?.stats?.totalUsers?.toLocaleString() || "0", change: "+12%", icon: Users, color: "text-blue-400" },
    { label: "Bài học hệ thống", value: data?.stats?.totalLessons?.toLocaleString() || "0", change: "0", icon: BookOpen, color: "text-emerald-400" },
    { label: "Tổng lượt luyện tập", value: data?.stats?.totalPlays?.toLocaleString() || "0", change: "+18%", icon: PlayCircle, color: "text-amber-500" },
    { label: "Hội viên cao cấp", value: data?.stats?.totalProUsers?.toLocaleString() || "0", change: "+5.4%", icon: CreditCard, color: "text-violet-400" },
  ];



  // Map latest registered users
  const recentActivities = data?.latestUsers?.map((u: any, idx: number) => {
    const times = ["2 phút trước", "15 phút trước", "42 phút trước", "1 giờ trước", "3 giờ trước"];
    const actions = [
      "đã gia nhập hàng ngũ học viên mới",
      "đã khởi tạo lộ trình luyện nói",
      "đã đăng ký trải nghiệm thử",
      "đã tham gia câu lạc bộ Global Success",
      "đã kích hoạt tài khoản thành công"
    ];
    return {
      id: u.id,
      user: u.full_name || "Học viên ẩn danh",
      action: actions[idx % actions.length],
      time: times[idx % times.length],
      avatar: u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.full_name || 'User'}`
    };
  }) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white">Tổng quan hệ thống</h2>
          <p className="text-white/40 font-medium italic">"Thông tin trực quan theo thời gian thực về hệ sinh thái Global Success English."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/admin/curriculum">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
              <Plus size={18} strokeWidth={3} /> Quản lý bài học
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[32px] bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
          >
            {/* Subtle Glow Background */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-all" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {stat.change !== "0" && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12} />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="space-y-1 relative z-10">
              <div className="text-[10px] uppercase font-black tracking-[0.25em] text-white/50">{stat.label}</div>
              <div className="text-4xl font-display font-black tracking-tighter text-white drop-shadow-sm">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: DAU */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <TrendingUp size={18} />
              </div>
              <h3 className="font-bold text-lg">Học viên hoạt động mỗi ngày</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">7 ngày qua</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="dau" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ fill: '#3b82f6', r: 4 }} 
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Categories */}
        <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <BarChart2 size={18} />
            </div>
            <h3 className="font-bold text-lg">Lượt học theo danh mục</h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="plays" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Activity Feed */}
      <div className="grid grid-cols-1 gap-6">
        {/* Activity Feed */}
        <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Clock size={18} />
              </div>
              <h3 className="font-bold text-lg">Học viên mới hoạt động</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.length > 0 ? (
              recentActivities.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 shrink-0">
                    <img src={item.avatar} alt={item.user} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate">{item.user}</h4>
                      <span className="text-[10px] text-white/20 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-white/40 truncate">{item.action}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-white/30 text-xs italic">Chưa có học viên nào hoạt động gần đây.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Trophy icon component since it's not imported
function Trophy({ size, className = "" }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
