"use client";
import { useState } from "react";
import { motion } from "framer-motion";
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
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from "recharts";

// --- MOCK DATA ---
const METRICS = [
  { label: "Total Plays", value: "1,248,300", change: "+18.2%", icon: PlayCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "New Registrations", value: "4,240", change: "+12.4%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Pro Conversions", value: "842", change: "+5.1%", icon: CreditCard, color: "text-violet-400", bg: "bg-violet-400/10" },
  { label: "XP Distributed", value: "8.4M", change: "+24.8%", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const DAU_DATA = Array.from({ length: 30 }).map((_, i) => ({
  name: `Day ${i + 1}`,
  users: Math.floor(Math.random() * 5000) + 4000,
  active: Math.floor(Math.random() * 3000) + 2000,
}));

const CATEGORY_DATA = [
  { name: "Psychology", plays: 245000 },
  { name: "Business", plays: 182000 },
  { name: "Philosophy", plays: 156000 },
  { name: "Cinema", plays: 420000 },
  { name: "Power", plays: 289000 },
];

const RETENTION_DATA = [
  { name: "Day 1", rate: 82 },
  { name: "Day 3", rate: 64 },
  { name: "Day 7", rate: 48 },
  { name: "Day 14", rate: 35 },
  { name: "Day 30", rate: 22 },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 75000 },
  { month: "Jun", revenue: 89000 },
];

const TOP_STORIES = [
  { title: "The Architect: Part I", category: "Power", plays: "42.4K", completion: "92%", score: "88%", xp: "10.6M" },
  { title: "Stoicism 101", category: "Philosophy", plays: "38.2K", completion: "88%", score: "84%", xp: "11.4M" },
  { title: "The Godfather", category: "Cinema", plays: "35.1K", completion: "95%", score: "91%", xp: "8.7M" },
  { title: "Negotiation Mastery", category: "Business", plays: "28.4K", completion: "74%", score: "78%", xp: "12.7M" },
  { title: "Emotional EQ", category: "Psychology", plays: "24.2K", completion: "82%", score: "85%", xp: "3.6M" },
];

const FUNNEL_DATA = [
  { stage: "Registered", value: 100 },
  { stage: "Played 1 Story", value: 78 },
  { stage: "Completed Quiz", value: 52 },
  { stage: "Day 7 Return", value: 34 },
  { stage: "Pro Upgrade", value: 12 },
];

const COHORT_DATA = [
  { month: "January", size: 1200, weeks: [100, 82, 65, 48, 35] },
  { month: "February", size: 1540, weeks: [100, 78, 61, 42, null] },
  { month: "March", size: 1820, weeks: [100, 85, 68, null, null] },
  { month: "April", size: 2100, weeks: [100, 80, null, null, null] },
];

const COLORS = ["#f5c842", "#3b82f6", "#8b5cf6", "#10b981", "#f43f5e"];

export default function AnalyticsPage() {
  const [range, setRange] = useState("Last 30 days");

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-4">
            Intelligence Analytics
          </h2>
          <p className="text-white/40 font-medium italic">"Deciphering the emotional and growth patterns of the platform."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#1a1a1a] border border-white/5 text-sm font-bold text-white/70 hover:bg-white/10 transition-all">
              <Calendar size={18} className="text-amber-500" />
              {range}
              <ChevronDown size={14} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-bold text-sm hover:text-white hover:bg-white/10 transition-all">
            <Download size={18} /> Export Reports
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 hover:border-amber-500/20 transition-all group overflow-hidden relative"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-all flex items-center justify-center ${metric.bg}`}>
              <metric.icon size={48} />
            </div>
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

      {/* 3. Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DAU Line Chart */}
        <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-3">
              <Activity size={20} className="text-blue-400" /> Daily Active Users
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500/30" />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Baseline</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAU_DATA}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                <Area type="monotone" dataKey="active" stroke="#3b82f640" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plays by Category Bar Chart */}
        <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <PieChartIcon size={20} className="text-amber-500" /> Plays by Category
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Bar dataKey="plays" radius={[12, 12, 0, 0]}>
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Retention Area Chart */}
        <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-400" /> User Retention Curve
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RETENTION_DATA}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis unit="%" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Area type="stepAfter" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#colorRetention)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-8">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <CreditCard size={20} className="text-violet-400" /> Monthly Revenue (Pro)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis unit="k" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Funnel & Top Stories Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Engagement Funnel */}
        <div className="lg:col-span-2 p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-10">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <Filter size={20} className="text-amber-500" /> Conversion Funnel
          </h3>
          <div className="space-y-6">
            {FUNNEL_DATA.map((item, i) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                  <span>{item.stage}</span>
                  <span className="text-white">{item.value}%</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 opacity-80"
                  />
                  {i > 0 && (
                    <div className="absolute left-0 top-0 text-[8px] font-black text-black/40 pl-2 leading-4">
                      -{FUNNEL_DATA[i-1].value - item.value}% drop
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 mb-1">Overall Conversion</div>
            <div className="text-4xl font-display font-black text-amber-500">12.4%</div>
          </div>
        </div>

        {/* Top Stories Table */}
        <div className="lg:col-span-3 p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-8 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-3">
              <Trophy size={20} className="text-amber-500" /> Content Leaders
            </h3>
            <button className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-all">View Full Library</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
                  <th className="pb-4 font-bold">Story</th>
                  <th className="pb-4 font-bold">Plays</th>
                  <th className="pb-4 font-bold">Comp %</th>
                  <th className="pb-4 font-bold">Quiz</th>
                  <th className="pb-4 font-bold text-right">XP Dist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TOP_STORIES.map((story) => (
                  <tr key={story.title} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">{story.title}</span>
                        <span className="text-[9px] font-bold text-white/20 uppercase">{story.category}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-xs text-white/60">{story.plays}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{story.completion}</span>
                        <div className="w-10 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 opacity-40" style={{ width: story.completion }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-bold text-blue-400/80">{story.score}</td>
                    <td className="py-4 text-right font-black text-xs text-amber-500/70">{story.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Cohort Retention Table */}
      <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 space-y-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <MousePointer2 size={20} className="text-amber-500" /> Retention Cohorts
          </h3>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Intensity: <div className="w-20 h-2 bg-gradient-to-r from-amber-500/10 to-amber-500 rounded-full" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/20">
                <th className="p-4 text-left font-bold">Cohort Month</th>
                <th className="p-4 font-bold border-l border-white/5">Size</th>
                <th className="p-4 font-bold">Week 1</th>
                <th className="p-4 font-bold">Week 2</th>
                <th className="p-4 font-bold">Week 3</th>
                <th className="p-4 font-bold">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {COHORT_DATA.map((row) => (
                <tr key={row.month} className="border-t border-white/5">
                  <td className="p-4 text-left text-sm font-bold text-white">{row.month}</td>
                  <td className="p-4 font-mono text-xs text-white/40 border-l border-white/5">{row.size.toLocaleString()}</td>
                  {row.weeks.map((val, idx) => (
                    <td 
                      key={idx} 
                      className="p-4 transition-all"
                      style={{ 
                        backgroundColor: val ? `rgba(245, 200, 66, ${val / 200})` : 'transparent',
                        color: val ? (val > 60 ? '#000' : '#fff') : 'transparent'
                      }}
                    >
                      {val ? `${val}%` : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
