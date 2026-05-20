"use client";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  Mic, 
  Volume2, 
  ChevronRight,
  Play
} from "lucide-react";
import Card from "@/components/ui/Card";

export default function LearnZone() {
  return (
    <div className="space-y-6">
      
      {/* ─── CONTINUE LEARNING QUICK LAUNCH ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 rounded-xl border border-white/5 bg-gradient-to-r from-violet-950/10 via-black to-black flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold tracking-widest text-violet-400 uppercase block">Tiếp tục học tập</span>
            <h4 className="text-xs font-bold text-white">Unit 1 Lesson 2: Household Chores</h4>
            <span className="text-[9px] text-white/40 block">Lớp 10 - Giáo trình chuẩn quốc gia GD&ĐT Việt Nam</span>
          </div>

          <Link href="/learn/lesson/lesson-u1l2">
            <span className="p-2 bg-white text-black hover:bg-amber-400 rounded-lg transition-colors flex items-center justify-center cursor-pointer shrink-0">
              <Play size={10} fill="currentColor" />
            </span>
          </Link>
        </div>

        <Card className="p-4 border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Nhiệm vụ đang giao</span>
            <h4 className="text-xs font-bold text-white">Bài tập Lớp ENG10A1</h4>
          </div>
          <Link href="/classroom/eng10a1">
            <span className="text-[9px] font-mono font-bold text-white/40 hover:text-white cursor-pointer flex items-center gap-0.5">
              Mở <ChevronRight size={10} />
            </span>
          </Link>
        </Card>
      </div>

      {/* ─── GLOBAL SUCCESS CURRICULUM PATHS ─── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Lộ trình học theo SGK mới</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { grade: "Lộ trình Tiếng Anh Lớp 10", desc: "10 Unit học • Giáo trình chuẩn quốc gia", status: "Đang học tập", color: "text-violet-400", href: "/learn/grade/grade-10" },
            { grade: "Lộ trình Tiếng Anh Lớp 11", desc: "10 Unit học • Bám sát cấu trúc ôn tập", status: "Đã mở khóa", color: "text-amber-500", href: "/learn/grade/grade-11" },
            { grade: "Lộ trình Tiếng Anh Lớp 12", desc: "8 Unit học • Chinh phục kỳ thi Quốc gia", status: "Đã mở khóa", color: "text-cyan-400", href: "/learn/grade/grade-12" },
          ].map((path, idx) => (
            <Link key={idx} href={path.href}>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-3 cursor-pointer group">
                <div className="space-y-0.5">
                  <span className={`text-[8px] font-mono font-bold tracking-widest uppercase block ${path.color}`}>{path.status}</span>
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">{path.grade}</h4>
                  <span className="text-[9px] text-white/30 block">{path.desc}</span>
                </div>
                <ChevronRight size={12} className="text-white/20 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── LABS & IMMERSION DEEP PRACTICE ─── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Phòng thực hành chuyên sâu</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Phòng Luyện Nghe", sub: "Nghe chép chính tả & Điều tốc", icon: Volume2, color: "text-violet-400", href: "/learn" },
            { name: "Phòng Nói AI Coach", sub: "Phân tích âm vị và ngữ điệu nói", icon: Mic, color: "text-amber-500", href: "/coach" },
            { name: "Phòng Luyện Thi IELTS", sub: "Thi thử IELTS & Khảo thí tính giờ", icon: Clock, color: "text-cyan-400", href: "/exam/ielts-foundation-test" },
          ].map((lab, idx) => (
            <Link key={idx} href={lab.href}>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-3 cursor-pointer group h-full">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg bg-white/5 ${lab.color} shrink-0`}>
                    <lab.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">{lab.name}</h4>
                    <span className="text-[9px] text-white/30 block mt-0.5">{lab.sub}</span>
                  </div>
                </div>
                <ChevronRight size={12} className="text-white/20 group-hover:text-white shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
