"use client";
import { motion } from "framer-motion";
import { SpeakingResult } from "../types";

interface SpeakingFeedbackProps {
  isAnalyzing: boolean;
  aiResponse: SpeakingResult | null;
  isRecording: boolean;
  WaveformComponent: React.ComponentType;
}

export default function SpeakingFeedback({ 
  isAnalyzing, 
  aiResponse, 
  isRecording, 
  WaveformComponent 
}: SpeakingFeedbackProps) {
  if (isAnalyzing) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full shadow-glow-gold"
        />
        <span className="text-xs font-black uppercase tracking-widest text-amber-400/80">AI Đang Lắng Nghe...</span>
      </motion.div>
    );
  }

  if (aiResponse) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="text-center space-y-2"
      >
        <h3 className="text-3xl font-display font-black text-white flex items-center justify-center gap-2">
          {aiResponse.remark}
        </h3>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black">
          Độ tự tin: {aiResponse.score}%
        </div>
      </motion.div>
    );
  }

  if (isRecording) {
    return <WaveformComponent />;
  }

  return (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      className="text-xs font-black uppercase tracking-[0.2em] text-white/80 text-center"
    >
      Bấm Mic và nhại lại câu thoại
    </motion.p>
  );
}
