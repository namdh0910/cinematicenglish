"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, Play, ChevronRight, Volume2, ShieldCheck, Flame } from "lucide-react";
import AtmosphereLayer from "../player/AtmosphereLayer";
import VoiceRecorder from "../coach/VoiceRecorder";

type Step = 'entry' | 'identity' | 'teaser' | 'speaking' | 'complete';

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('entry');
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null);

  // Auto-advance from entry
  useEffect(() => {
    if (step === 'entry') {
      const timer = setTimeout(() => setStep('identity'), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white selection:bg-amber-400/30 overflow-hidden">
      <AtmosphereLayer mood={step === 'entry' ? 'the-void' : 'the-pulse'} isFocusMode={false} />
      
      <AnimatePresence mode="wait">
        {step === 'entry' && (
          <motion.div 
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-amber-400 font-bold uppercase tracking-[0.6em] text-[10px] mb-6 opacity-60">Cinematic English</div>
              <h1 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.9]">
                Đây là nơi <br /> tiếng nói của bạn <br /><span className="gradient-text-violet">thay đổi</span>.
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2, duration: 1.5 }}
              className="text-lg md:text-xl max-w-xl font-display italic font-light"
            >
              "Bước vào thế giới của những câu chuyện."
            </motion.p>
          </motion.div>
        )}

        {step === 'identity' && (
          <motion.div 
            key="identity"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-16"
          >
            <div className="text-center space-y-6 max-w-2xl">
              <h2 className="text-3xl md:text-6xl font-display font-black tracking-tighter leading-tight">Bạn chọn hóa thân thành <br /> ai trong hành trình này?</h2>
              <p className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-bold">Lựa chọn bản sắc khởi đầu</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {[
                { id: 'protagonist', title: 'The Protagonist', desc: 'Người làm chủ nhịp điệu và dẫn dắt mọi cuộc hội thoại.', icon: Flame, color: '#f59e0b' },
                { id: 'observer', title: 'The Silent Observer', desc: 'Thấu hiểu sự tĩnh lặng và sức nặng của từng từ ngữ.', icon: Sparkles, color: '#8b5cf6' },
              ].map((idnt) => (
                <button
                  key={idnt.id}
                  onClick={() => { setSelectedIdentity(idnt.id); setStep('teaser'); }}
                  className="p-10 rounded-[40px] glass border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-700 text-left group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <idnt.icon size={120} />
                  </div>
                  <idnt.icon className="mb-8 group-hover:scale-110 transition-transform duration-700 opacity-40" style={{ color: idnt.color }} size={40} />
                  <h3 className="text-2xl font-display font-bold mb-3 uppercase tracking-wider">{idnt.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed font-light max-w-[240px]">{idnt.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'teaser' && (
          <motion.div 
            key="teaser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-12"
          >
            <div className="max-w-4xl w-full space-y-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse border border-white/10">
                  <Volume2 size={32} className="text-white/40" />
                </div>
                <h2 className="text-2xl font-display font-medium tracking-tight">Lắng nghe sự tĩnh lặng...</h2>
              </div>

              <div className="glass-card p-12 md:p-20 rounded-[48px] border-white/5 text-center space-y-8 shadow-[0_0_50px_rgba(139,92,246,0.05)]">
                <p className="text-3xl md:text-5xl font-display font-medium leading-tight italic text-white/90">
                  "The most powerful person in the room is often the one who speaks the least."
                </p>
                <div className="flex justify-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-amber-400/50 animate-bounce" />
                  <div className="w-1 h-1 rounded-full bg-amber-400/50 animate-bounce delay-150" />
                  <div className="w-1 h-1 rounded-full bg-amber-400/50 animate-bounce delay-300" />
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setStep('speaking')}
                  className="px-12 py-5 rounded-3xl bg-white text-black font-display font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-3"
                >
                  Bắt đầu hóa thân <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'speaking' && (
          <motion.div 
            key="speaking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-12"
          >
            <div className="text-center space-y-6 max-w-3xl">
              <div className="text-amber-400 font-bold uppercase tracking-[0.4em] text-[10px]">Cột mốc đầu tiên</div>
              <h2 className="text-3xl md:text-6xl font-display font-black italic tracking-tighter">"Silence is not empty."</h2>
              <p className="text-white/30 italic font-light tracking-wide">Sự im lặng mang trong mình sức nặng của ý nghĩa.</p>
            </div>

            <VoiceRecorder 
              sentence="Silence is not empty." 
              onComplete={() => setStep('complete')}
            />

            <button 
              onClick={() => setStep('complete')}
              className="px-6 py-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              Bỏ qua thử thách
            </button>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div 
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-12"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <ShieldCheck size={48} />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-8xl font-display font-black tracking-tighter">Chuyển hóa bắt đầu.</h2>
              <p className="text-xl text-white/40 max-w-xl mx-auto font-display italic font-light leading-relaxed">
                "Chào mừng bạn, {selectedIdentity === 'protagonist' ? 'The Protagonist' : 'The Observer'}. <br />Thế giới điện ảnh đang chờ đợi tiếng nói của bạn."
              </p>
            </div>

            <button 
              onClick={onComplete}
              className="px-16 py-6 rounded-3xl bg-white text-black font-display font-black text-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Bắt đầu hành trình
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
