"use client";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Users as UsersIcon,
  Download,
  Calendar,
  Zap,
  Award
} from "lucide-react";
import UserTable from "@/components/admin/UserTable";
import UserDetailModal, { UserDetail } from "@/components/admin/UserDetailModal";

const MOCK_USERS: UserDetail[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `user-${i + 1}`,
  name: [
    "Hoàng Nam", "Minh Thư", "Quốc Bảo", "Linh Đan", "Anh Tuấn", 
    "Elena Gilbert", "Stefan Salvatore", "Damon Salvatore", "Bonnie Bennett", "Caroline Forbes",
    "Tony Stark", "Steve Rogers", "Natasha Romanoff", "Bruce Banner", "Wanda Maximoff",
    "John Wick", "Thomas Shelby", "Walter White", "Jesse Pinkman", "Saul Goodman"
  ][i],
  email: `user${i + 1}@cinematic.ai`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 100}`,
  plan: i % 4 === 0 ? 'Pro' : i % 7 === 0 ? 'Group' : 'Free',
  status: i === 5 ? 'Banned' : i % 6 === 0 ? 'Inactive' : 'Active',
  joinDate: `2024-0${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 28) + 1}`,
  lastActive: `${Math.floor(Math.random() * 23) + 1}h ago`,
  totalXP: Math.floor(Math.random() * 15000) + 1000,
  storiesCompleted: Math.floor(Math.random() * 50) + 5,
  quizzesCompleted: Math.floor(Math.random() * 40) + 2,
  avgQuizScore: Math.floor(Math.random() * 20) + 75,
  streak: Math.floor(Math.random() * 45),
  subscription: {
    startDate: '2024-01-15',
    expiryDate: '2025-01-15',
    amountPaid: i % 4 === 0 ? '199k/mo' : i % 7 === 0 ? '599k/mo' : '0đ',
  },
  recentActivity: [
    { id: 'a1', action: "Listened to 'The Architect: Part I'", date: '2h ago' },
    { id: 'a2', action: "Completed 'Silence' Quiz (100%)", date: '3h ago' },
    { id: 'a3', action: "Unlocked 'Protagonist' Identity", date: '1d ago' },
    { id: 'a4', action: "Achieved 15-day Streak", date: '2d ago' },
    { id: 'a5', action: "Started 'Tâm Lý Học Quyền Lực'", date: '3d ago' },
  ],
  xpHistory: [
    { day: 'Mon', xp: Math.floor(Math.random() * 500) },
    { day: 'Tue', xp: Math.floor(Math.random() * 500) },
    { day: 'Wed', xp: Math.floor(Math.random() * 500) },
    { day: 'Thu', xp: Math.floor(Math.random() * 500) },
    { day: 'Fri', xp: Math.floor(Math.random() * 500) },
    { day: 'Sat', xp: Math.floor(Math.random() * 500) },
    { day: 'Sun', xp: Math.floor(Math.random() * 500) },
  ]
}));

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPlan, setFilterPlan] = useState("All Plans");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "All Plans" || user.plan === filterPlan;
    const matchesStatus = filterStatus === "All Status" || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleViewUser = (user: UserDetail) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-4">
            User Ecosystem
          </h2>
          <p className="text-white/40 font-medium italic">"Monitoring the growth and engagement of the Cinematic community."</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-6 py-4 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Active Now</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xl font-display font-black text-white">482</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/5" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">New Today</span>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-500" />
                <span className="text-xl font-display font-black text-white">+124</span>
              </div>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      {/* 2. Advanced Filters Toolbar */}
      <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-8 shadow-2xl">
        <div className="flex flex-col xl:flex-row gap-6 justify-between">
          <div className="flex flex-1 flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or ID..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
              />
            </div>

            {/* Select Filters */}
            <div className="flex gap-3">
              <div className="relative min-w-[140px]">
                <select 
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white/60 hover:text-white appearance-none focus:outline-none transition-all cursor-pointer"
                >
                  <option value="All Plans">All Plans</option>
                  <option value="Free">Free Plan</option>
                  <option value="Pro">Pro Plan</option>
                  <option value="Group">Group Plan</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white/60 hover:text-white appearance-none focus:outline-none transition-all cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
              </div>

              <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-white/40 flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all">
                <Calendar size={18} /> Date Range
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-l border-white/5 pl-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">View:</span>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button className="p-2 rounded-lg bg-white/10 text-amber-500">
                <UsersIcon size={20} />
              </button>
              <button className="p-2 rounded-lg text-white/20 hover:text-white/40">
                <Award size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Pills / Active Filters */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/10 mr-2">Results: {filteredUsers.length} Users</span>
          <div className="flex gap-2">
            {filterPlan !== "All Plans" && (
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 flex items-center gap-2">
                Plan: {filterPlan} <button onClick={() => setFilterPlan("All Plans")}>×</button>
              </span>
            )}
            {filterStatus !== "All Status" && (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-2">
                Status: {filterStatus} <button onClick={() => setFilterStatus("All Status")}>×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. User Table Section */}
      <UserTable users={filteredUsers} onViewUser={handleViewUser} />

      {/* 4. Detail Modal */}
      <UserDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
