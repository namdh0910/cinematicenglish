"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Calendar, 
  CreditCard, 
  Zap, 
  BookOpen, 
  HelpCircle, 
  TrendingUp,
  History,
  ShieldAlert,
  ArrowUpRight,
  Award
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro' | 'Group';
  status: 'Active' | 'Inactive' | 'Banned';
  joinDate: string;
  lastActive: string;
  totalXP: number;
  storiesCompleted: number;
  quizzesCompleted: number;
  avgQuizScore: number;
  streak: number;
  subscription: {
    startDate: string;
    expiryDate: string;
    amountPaid: string;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    date: string;
  }>;
  xpHistory: Array<{
    day: string;
    xp: number;
  }>;
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail | null;
}

export default function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#1a1a1a] border border-white/10 rounded-[48px] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-amber-500/20 p-1 bg-gradient-to-tr from-amber-500/20 to-violet-500/20">
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full bg-zinc-900 object-cover" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#1a1a1a] ${
                  user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Inactive' ? 'bg-white/20' : 'bg-red-500'
                }`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-display font-black text-white">{user.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    user.plan === 'Pro' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    user.plan === 'Group' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-white/5 border-white/10 text-white/30'
                  }`}>
                    {user.plan} Plan
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-white/40">
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-white/20" /> {user.email}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-white/20" /> Joined {user.joinDate}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total XP', value: user.totalXP.toLocaleString(), icon: Zap, color: 'text-amber-500' },
                { label: 'Stories', value: user.storiesCompleted, icon: BookOpen, color: 'text-blue-400' },
                { label: 'Avg Score', value: `${user.avgQuizScore}%`, icon: Award, color: 'text-emerald-400' },
                { label: 'Streak', value: `${user.streak} Days`, icon: TrendingUp, color: 'text-rose-500' },
              ].map(stat => (
                <div key={stat.label} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className={`p-2 w-fit rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div className="text-2xl font-display font-black text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-white/20">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Chart & Activity */}
              <div className="lg:col-span-2 space-y-10">
                {/* XP Chart */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="font-bold text-white flex items-center gap-3">
                      <TrendingUp size={18} className="text-amber-500" /> XP Performance (Last 7 Days)
                    </h4>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Growth View</span>
                  </div>
                  <div className="h-[240px] w-full p-6 rounded-[32px] bg-black/20 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={user.xpHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          stroke="#ffffff10" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="xp" 
                          stroke="#f59e0b" 
                          strokeWidth={3} 
                          dot={{ fill: '#f59e0b', r: 4 }} 
                          activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                  <h4 className="font-bold text-white flex items-center gap-3 px-2">
                    <History size={18} className="text-blue-400" /> Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {user.recentActivity.map(item => (
                      <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                          <span className="text-sm text-white/70 font-medium">{item.action}</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Subscription & Actions */}
              <div className="space-y-10">
                {/* Subscription Card */}
                <div className="p-8 rounded-[40px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <CreditCard size={24} className="text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Subscription</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Current Plan</span>
                      <span className="text-sm font-bold text-white">{user.plan}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Amount Paid</span>
                      <span className="text-sm font-bold text-white">{user.subscription.amountPaid}</span>
                    </div>
                    <div className="w-full h-px bg-white/5" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Status</span>
                      <span className="text-xs font-bold text-emerald-400">Paid & Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Expires on</span>
                      <span className="text-xs font-mono text-white/60">{user.subscription.expiryDate}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                    Upgrade Subscription
                  </button>
                </div>

                {/* Admin Actions */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20 px-4">Admin Controls</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-amber-500/10 hover:border-amber-500/20 group transition-all">
                      <span className="text-sm font-bold text-white/60 group-hover:text-amber-500">Edit Permissions</span>
                      <ArrowUpRight size={16} className="text-white/20 group-hover:text-amber-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 group transition-all">
                      <span className="text-sm font-bold text-white/60 group-hover:text-red-500 flex items-center gap-2">
                        <ShieldAlert size={14} /> Ban User Account
                      </span>
                      <ArrowUpRight size={16} className="text-white/20 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
