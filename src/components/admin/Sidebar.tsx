"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Bot, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  Zap,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BookOpen, label: "Stories", href: "/admin/stories" },
  { icon: HelpCircle, label: "Quizzes", href: "/admin/quizzes" },
  { icon: Bot, label: "AI Characters", href: "/admin/characters" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart2, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-[#1a1a1a] border-r border-white/5 flex flex-col h-screen z-[100] shrink-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Zap size={18} className="text-black" fill="black" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm tracking-tighter leading-none">
              CINEMATIC<span className="text-amber-500">EN</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/10" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="activeDot" className="w-1 h-1 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-white/5 space-y-4 bg-[#141414]/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 p-0.5 bg-gradient-to-tr from-amber-500 to-violet-500">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nam" 
              alt="Admin" 
              className="w-full h-full rounded-full bg-[#1a1a1a]"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white truncate">Nam Architect</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Lead Director</span>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
