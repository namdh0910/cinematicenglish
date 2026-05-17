"use client";
import { motion } from "framer-motion";
import { Sparkles, Trophy, BookOpen, Heart, Zap } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import { useAdaptive } from "@/context/AdaptiveContext";

interface AICoachPanelProps {
  sentence: string;
  translation: string;
  onClose?: () => void;
}

export default function AICoachPanel({ sentence, translation, onClose }: AICoachPanelProps) {
  const { coachTone, profile } = useAdaptive();

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 md:p-12 space-y-12">
      {/* Target Sentence Display */}
      <div className="text-center space-y-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-widest ${
            coachTone.style === 'challenging' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}
        >
          {coachTone.style === 'challenging' ? <Zap size={14} /> : <Heart size={14} />}
          {coachTone.style === 'challenging' ? 'Thử thách uy quyền' : 'Luyện nói nhẹ nhàng'}
        </motion.div>
        
        <h3 className="text-3xl md:text-5xl font-display font-black leading-tight tracking-tight text-white">
          "{sentence}"
        </h3>
        
        <p className="text-xl text-white/40 italic font-sans">
          {translation}
        </p>
      </div>

      {/* Voice Recorder Component */}
      <VoiceRecorder 
        sentence={sentence} 
        onComplete={(blob, feedback) => {
          console.log("Speaking practice complete", { blob, feedback });
        }}
      />

      {/* Speaking Momentum / Progress */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-4 rounded-2xl glass border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
            <Trophy size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-white/30">Chuỗi nói</div>
            <div className="text-sm font-bold">12 Ngày</div>
          </div>
        </div>
        <div className="p-4 rounded-2xl glass border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <BookOpen size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-white/30">Thiên hướng</div>
            <div className="text-sm font-bold capitalize">{profile?.dominantMood?.replace('the-', '') || 'Đang tải...'}</div>
          </div>
        </div>
      </div>

      {/* Premium Adaptive Guidance */}
      <div className="text-center space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
          AI Tone: {coachTone.style} focus
        </p>
        <p className="text-xs text-white/20 max-w-sm leading-relaxed mx-auto">
          {coachTone.feedbackFocus === 'encouragement' 
            ? "Hãy thả lỏng. AI đang lắng nghe nhịp điệu tự nhiên của bạn, không phán xét lỗi nhỏ." 
            : "AI đang phân tích sự quyết đoán và độ vang trong giọng nói của bạn. Hãy phát âm đầy nội lực."}
        </p>
      </div>
    </div>
  );
}
