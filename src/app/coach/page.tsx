"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, RefreshCw, Trophy, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import AICoachPanel from "@/components/coach/AICoachPanel";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

const SENTENCES = [
  { text: "The key to success is consistency, not talent.", translation: "Chìa khóa của thành công là sự nhất quán, không phải tài năng." },
  { text: "I appreciate your perspective on this matter.", translation: "Tôi trân trọng góc nhìn của bạn về vấn đề này." },
  { text: "Let's cut to the chase and discuss the main points.", translation: "Hãy đi thẳng vào vấn đề và thảo luận các điểm chính." },
  { text: "She demonstrated remarkable resilience under pressure.", translation: "Cô ấy đã thể hiện khả năng phục hồi đáng kinh ngạc dưới áp lực." },
  { text: "The economy is gradually recovering from the recession.", translation: "Nền kinh tế đang dần hồi phục sau cuộc suy thoái." },
];

export default function CoachPage() {
  const [current, setCurrent] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const next = () => {
    if (current < SENTENCES.length - 1) {
      setCurrent(current + 1);
    } else {
      setSessionComplete(true);
    }
  };

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <Section className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {!sessionComplete ? (
                <motion.div
                  key="coach-flow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                      <Link href="/" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all">
                        <ArrowLeft size={24} />
                      </Link>
                      <div>
                        <Badge variant="violet" className="mb-1">Cinematic Coach</Badge>
                        <h1 className="text-xl font-bold font-display">Luyện Nói Tự Tin</h1>
                      </div>
                    </div>
                    <div className="text-sm font-mono text-white/40">
                      Mục tiêu {current + 1} / {SENTENCES.length}
                    </div>
                  </div>

                  <div className="glass-card rounded-[48px] border-white/5 overflow-hidden shadow-glow-violet/10">
                    <AICoachPanel 
                      sentence={SENTENCES[current].text} 
                      translation={SENTENCES[current].translation}
                      onClose={() => {}}
                    />
                    <div className="p-12 pt-0 flex justify-center">
                      <button 
                        onClick={next}
                        className="flex items-center gap-2 text-white/40 hover:text-white font-bold uppercase tracking-[0.2em] text-xs transition-all"
                      >
                        Bỏ qua câu này <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="session-complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 py-20"
                >
                  <div className="w-24 h-24 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-glow-gold">
                    <Trophy size={48} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-display font-black">Phiên Tập Hoàn Tất!</h2>
                    <p className="text-xl text-white/60 max-w-lg mx-auto">
                      Bạn đã hoàn thành 5 thử thách luyện nói với phong thái cực kỳ tự tin. 
                      Hành trình trở thành nhân vật chính của bạn đang tiến triển tốt.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <button 
                      onClick={() => { setCurrent(0); setSessionComplete(false); }}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl glass font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
                    >
                      <RefreshCw size={20} /> Luyện tập lại
                    </button>
                    <Link 
                      href="/"
                      className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-white text-black font-display font-black shadow-glow-gold hover:scale-105 transition-all"
                    >
                      Về trang chủ
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>
      </main>
    </div>
  );
}
