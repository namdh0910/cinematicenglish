"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, Moon, Sun, ChevronRight, Command } from "lucide-react";
import { motion } from "framer-motion";

export default function TopBar() {
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const pathParts = pathname.split('/').filter(Boolean);
  const pageTitle = pathParts.length > 1 
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : "Tổng quan hệ thống";

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/20">Admin</span>
        <ChevronRight size={14} className="text-white/10" />
        <h1 className="text-sm font-bold text-white tracking-tight">{pageTitle}</h1>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for stories, users, or data..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded-md bg-white/5 border border-white/10">
            <Command size={10} className="text-white/40" />
            <span className="text-[10px] font-bold text-white/40">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group">
          <Bell size={20} className="text-white/60 group-hover:text-amber-500 transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#0f0f0f]" />
        </button>

        {/* Theme Toggle */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group">
          <Moon size={20} className="text-white/60 group-hover:text-amber-500 transition-colors" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/5 mx-2" />

        {/* Active Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live</span>
        </div>
      </div>
    </header>
  );
}
