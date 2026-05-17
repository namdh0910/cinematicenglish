"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SidebarProps {
  adminProfile?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
}

const navGroups = [
  {
    title: "TỔNG QUAN",
    items: [
      { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
    ]
  },
  {
    title: "NỘI DUNG HỌC",
    items: [
      { icon: BookOpen, label: "Câu chuyện", href: "/admin/stories" },
      { icon: GraduationCap, label: "Bài học", href: "/admin/curriculum" },
      { icon: HelpCircle, label: "Bài luyện", href: "/admin/quizzes" },
      { icon: BookOpen, label: "Từ vựng", href: "#" },
      { icon: Bot, label: "Nhân vật", href: "/admin/characters" },
    ]
  },
  {
    title: "LỚP HỌC",
    items: [
      { icon: Users, label: "Lớp học", href: "/teacher/classroom" },
      { icon: Users, label: "Giáo viên", href: "#" },
      { icon: Users, label: "Học sinh", href: "/admin/users" },
      { icon: BookOpen, label: "Bài giao", href: "#" },
    ]
  },
  {
    title: "PHÂN TÍCH",
    items: [
      { icon: BarChart2, label: "Hiệu suất học tập", href: "/admin/analytics" },
      { icon: BarChart2, label: "Giữ chân học viên", href: "/admin/analytics?tab=retention" },
      { icon: BarChart2, label: "Hoạt động hệ thống", href: "/admin/analytics?tab=system" },
    ]
  },
  {
    title: "HỆ THỐNG",
    items: [
      { icon: Settings, label: "Cấu hình", href: "/admin/settings" },
      { icon: Settings, label: "Nhật ký hệ thống", href: "/admin/settings?tab=logs" },
      { icon: Settings, label: "Cài đặt", href: "/admin/settings" },
    ]
  }
];

export default function Sidebar({ adminProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/admin/login");
  };

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
      <nav className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/20">
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-2 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/10" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="activeDot" className="w-1 h-1 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-white/5 space-y-4 bg-[#141414]/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 p-0.5 bg-gradient-to-tr from-amber-500 to-violet-500 overflow-hidden">
            <img 
              src={adminProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminProfile?.full_name || 'Admin'}`} 
              alt="Admin" 
              className="w-full h-full rounded-full bg-[#1a1a1a] object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white truncate">
              {adminProfile?.full_name || 'Nam Architect'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">
                {adminProfile?.role === 'admin' ? 'Quản trị viên' : 'Học viên'} • Đang hoạt động
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
