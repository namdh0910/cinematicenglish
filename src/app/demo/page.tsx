"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Star, ChevronLeft } from "lucide-react";
import VoiceRecorder from "@/components/coach/VoiceRecorder";

export default function DemoPage() {
  const [completed, setCompleted] = useState(false);

  const handleComplete = (blob: Blob, feedback: string) => {
    setCompleted(true);
  };

  return (
    <div className="min-h-[100dvh] bg-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <Link href="/login" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold">
          <ChevronLeft size={16} /> Quay lại
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
            <GraduationCap size={16} className="text-black" />
          </div>
          <span className="text-sm font-display font-black text-white">Cinematic<span className="text-amber-500">English</span></span>
        </div>
      </div>

      <div className="w-full max-w-2xl relative z-10 space-y-12 py-20">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              Học thử miễn phí
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
              Thử thách Luyện nói
            </h1>
            <p className="text-white/60 mt-4 max-w-lg mx-auto">
              Cấp quyền Micro và thử đọc câu bên dưới với nhịp điệu tự nhiên nhất. Cô giáo AI sẽ lắng nghe và phân tích ngay lập tức!
            </p>
          </motion.div>
        </div>

        {/* Demo Sentence */}
        <div className="p-8 rounded-[32px] bg-[#141414] border border-white/5 text-center shadow-2xl">
          <p className="text-xl md:text-3xl font-bold text-white italic leading-relaxed">
            "I strongly believe that sharing housework strengthens family bonds."
          </p>
          <p className="text-sm text-secondary mt-4">
            (Tôi tin tưởng mạnh mẽ rằng việc chia sẻ việc nhà sẽ củng cố sự gắn kết gia đình.)
          </p>
        </div>

        {/* Recorder */}
        <VoiceRecorder 
          sentence="I strongly believe that sharing housework strengthens family bonds."
          onComplete={handleComplete}
          accentColor="#eab308"
        />

        {/* Conversion CTA after complete */}
        {completed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-1 text-amber-500 mb-2">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-white text-center">Tuyệt vời! Bạn có tiềm năng rất lớn.</h3>
            <p className="text-sm text-secondary text-center mb-4 max-w-md">
              Tạo tài khoản miễn phí để lưu lại quá trình luyện tập và nhận lộ trình cá nhân hóa từ giáo viên.
            </p>
            <Link href="/signup">
              <button className="px-8 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-glow-gold flex items-center gap-2">
                Đăng ký để học tiếp <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
