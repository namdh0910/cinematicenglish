"use client";
import Link from "next/link";
import { ChevronLeft, Zap, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import PracticeSession from "@/components/practice/PracticeSession";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function PracticePage() {
  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="page-top pb-20">
        <Section container={true} className="space-y-8">
          
          {/* Top navigation path */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/learn">
              <span className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <ChevronLeft size={14} /> Về Bảng điều khiển
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Badge variant="violet" className="py-1 px-3 text-[9px] font-mono flex items-center gap-1 uppercase tracking-wider">
                <Zap size={10} className="animate-pulse" /> High-frequency loop
              </Badge>
            </div>
          </div>

          {/* Title Header */}
          <div className="border-b border-white/5 pb-6 space-y-2">
            <h1 className="text-3xl font-display font-black text-white">Hệ thống Luyện phản xạ</h1>
            <p className="text-xs text-white/40 max-w-xl leading-relaxed">
              Trình luyện tập thần tốc 500ms. Phục hồi phát âm yếu, củng cố vốn từ vựng và cải thiện nhịp điệu giao tiếp liên tục không gián đoạn.
            </p>
          </div>

          {/* Dual Grid: Session and Side Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Middle: Live Session Cockpit */}
            <div className="lg:col-span-2">
              <PracticeSession />
            </div>

            {/* Right Side: Quick Action Rules */}
            <aside className="space-y-4">
              <Card className="p-5 border-white/5 bg-white/[0.01] space-y-3">
                <h4 className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
                  <Info size={12} /> Quy định luyện tập
                </h4>

                <div className="space-y-2.5 text-xs text-white/60 leading-relaxed">
                  <p>
                    <strong className="text-white">1. Ultra-fast rhythm:</strong> Mọi thử thách đều được thiết kế để thao tác dưới 15 giây.
                  </p>
                  <p>
                    <strong className="text-white">2. Continuous Combo:</strong> Trả lời đúng liên tiếp để tích lũy COMBO nhân điểm số XP.
                  </p>
                  <p>
                    <strong className="text-white">3. Memory Anchor:</strong> Sai sót sẽ tự động cập nhật trực tiếp lên đồ thị kỹ năng AI cá nhân để đề xuất lại ngày mai.
                  </p>
                </div>
              </Card>
            </aside>

          </div>

        </Section>
      </main>
    </div>
  );
}
