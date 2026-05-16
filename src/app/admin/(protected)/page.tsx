"use client";
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

// --- MOCK DATA ---
const stats = [
  { label: "Total Users", value: "12,482", change: "+12%", icon: Users, color: "text-blue-400" },
  { label: "Active Stories", value: "42", change: "0", icon: BookOpen, color: "text-emerald-400" },
  { label: "Total Plays", value: "1,248,300", change: "+18%", icon: PlayCircle, color: "text-amber-500" },
  { label: "Pro Subscribers", value: "1,240", change: "+5.4%", icon: CreditCard, color: "text-violet-400" },
];

const activity = [
  { id: 1, user: "Elena Gilbert", action: "listened to 'The Godfather'", time: "2m ago", avatar: "7x/avataaars/svg?seed=Elena" },
  { id: 2, user: "Stefan Salvatore", action: "completed 'Stoicism 101' Quiz", time: "15m ago", avatar: "7x/avataaars/svg?seed=Stefan" },
  { id: 3, user: "Damon Salvatore", action: "joined as Pro Subscriber", time: "42m ago", avatar: "7x/avataaars/svg?seed=Damon" },
  { id: 4, user: "Bonnie Bennett", action: "saved 'The Dark Knight' quote", time: "1h ago", avatar: "7x/avataaars/svg?seed=Bonnie" },
  { id: 5, user: "Caroline Forbes", action: "listened to 'The Pulse'", time: "3h ago", avatar: "7x/avataaars/svg?seed=Caroline" },
];

const topStories = [
  { title: "The Godfather", category: "Cinema", plays: "12,402", completion: "92%", xp: "250" },
  { title: "Stoicism 101", category: "Philosophy", plays: "8,120", completion: "88%", xp: "300" },
  { title: "Business Negotiation", category: "Business", plays: "7,840", completion: "74%", xp: "450" },
  { title: "The Dark Knight", category: "Cinema", plays: "6,920", completion: "95%", xp: "200" },
  { title: "Morning Rituals", category: "Psychology", plays: "5,400", completion: "82%", xp: "150" },
];

const dauData = [
  { name: "Mon", dau: 4200 },
  { name: "Tue", dau: 5100 },
  { name: "Wed", dau: 4800 },
  { name: "Thu", dau: 6200 },
  { name: "Fri", dau: 5800 },
  { name: "Sat", dau: 7500 },
  { name: "Sun", dau: 8400 },
];

const categoryData = [
  { name: "Psychology", plays: 2400 },
  { name: "Business", plays: 4567 },
  { name: "Philosophy", plays: 1398 },
  { name: "Cinema", plays: 9800 },
  { name: "Drama", plays: 3908 },
];

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function DetailedDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white">System Pulse</h2>
          <p className="text-white/40 font-medium italic">"Real-time visibility into the Cinematic English ecosystem."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
            <Plus size={18} strokeWidth={3} /> Create Story
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 font-bold text-sm hover:bg-white/10 transition-all">
            <HelpCircle size={18} /> Add Quiz
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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
              <h3 className="font-bold text-lg">Daily Active Users</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Past 7 Days</span>
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
            <h3 className="font-bold text-lg">Plays by Category</h3>
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

      {/* 4. Activity & Top Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Stories Table */}
        <div className="lg:col-span-3 p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Trophy size={18} />
              </div>
              <h3 className="font-bold text-lg">Top Stories This Week</h3>
            </div>
            <button className="text-xs font-bold text-amber-500 uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
                  <th className="pb-4 font-bold">Story Title</th>
                  <th className="pb-4 font-bold">Category</th>
                  <th className="pb-4 font-bold">Plays</th>
                  <th className="pb-4 font-bold text-right">Comp. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topStories.map((story) => (
                  <tr key={story.title} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-sm group-hover:text-amber-500 transition-colors">{story.title}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-white/40 border border-white/5 uppercase tracking-widest">
                        {story.category}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-xs text-white/60">{story.plays}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-xs">{story.completion}</span>
                        <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 opacity-60" 
                            style={{ width: story.completion }} 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Clock size={18} />
              </div>
              <h3 className="font-bold text-lg">Pulse Activity</h3>
            </div>
          </div>
          
          <div className="space-y-6">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5">
                  <img src={`https://api.dicebear.com/${item.avatar}`} alt={item.user} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{item.user}</h4>
                    <span className="text-[10px] text-white/20 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate">{item.action}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white/20 hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
            Load More Activity
          </button>
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
