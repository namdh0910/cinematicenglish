"use client";
import { useState } from "react";
import { 
  Eye, 
  Trash2, 
  ShieldAlert, 
  ArrowUpCircle, 
  MoreHorizontal,
  Flame,
  Zap,
  BookOpen,
  Calendar
} from "lucide-react";
import { UserDetail } from "./UserDetailModal";

interface UserTableProps {
  users: UserDetail[];
  onViewUser: (user: UserDetail) => void;
}

export default function UserTable({ users, onViewUser }: UserTableProps) {
  const getPlanStyles = (plan: UserDetail['plan']) => {
    switch (plan) {
      case 'Pro': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Group': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-white/5 text-white/30 border-white/10';
    }
  };

  const getStatusStyles = (status: UserDetail['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400';
      case 'Banned': return 'bg-red-500/10 text-red-500';
      default: return 'bg-white/5 text-white/30';
    }
  };

  return (
    <div className="overflow-x-auto rounded-[32px] border border-white/5 bg-[#1a1a1a]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold">User Identity</th>
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold text-center">Plan</th>
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold text-center">Streak</th>
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold text-center">Stories</th>
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold text-center">XP Total</th>
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold">Last Pulse</th>
            <th className="p-6 text-[10px] uppercase tracking-widest text-white/30 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr 
              key={user.id} 
              className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => onViewUser(user)}
            >
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/5 overflow-hidden bg-white/5 shrink-0 group-hover:border-amber-500/30 transition-all">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors truncate">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-white/20 truncate">{user.email}</span>
                  </div>
                </div>
              </td>
              <td className="p-6">
                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getPlanStyles(user.plan)}`}>
                    {user.plan}
                  </span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <Flame size={14} className={user.streak > 10 ? "animate-pulse" : ""} />
                    <span className="text-sm font-black">{user.streak}</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/10 uppercase tracking-tighter">Days</span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <BookOpen size={14} />
                    <span className="text-sm font-bold">{user.storiesCompleted}</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/10 uppercase tracking-tighter">Completed</span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Zap size={14} fill="currentColor" className="opacity-40" />
                    <span className="text-sm font-black">{user.totalXP.toLocaleString()}</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/10 uppercase tracking-tighter">Points</span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-white/60 font-medium">{user.lastActive}</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(user.status)}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{user.status}</span>
                  </div>
                </div>
              </td>
              <td className="p-6">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onViewUser(user)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all" 
                    title="View Profile"
                  >
                    <Eye size={16} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/20 hover:text-amber-500 hover:bg-amber-500/10 transition-all" title="Upgrade Plan">
                    <ArrowUpCircle size={16} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Ban User">
                    <ShieldAlert size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
