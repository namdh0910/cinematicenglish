"use client";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Mic, Volume2 } from "lucide-react";

interface AudioControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onReplaySentence: () => void;
  isShadowing: boolean;
  onToggleShadowing: () => void;
  onSaveMoment?: () => void;
}

export default function AudioControls({
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  onReplaySentence,
  isShadowing,
  onToggleShadowing,
  onSaveMoment
}: AudioControlsProps) {
  
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 md:p-12 z-50 flex justify-center">
      <div className="w-full max-w-4xl glass-card p-6 md:p-8 rounded-[32px] shadow-glow-violet/20 border-white/10 backdrop-blur-2xl">
        
        {/* Progress Bar & Waveform Area */}
        <div className="relative h-12 mb-8 group cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = x / rect.width;
          onSeek(pct * duration);
        }}>
          <div className="absolute inset-0 flex items-center gap-1 opacity-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 bg-white rounded-full" 
                style={{ height: `${Math.random() * 60 + 20}%` }} 
              />
            ))}
          </div>
          <motion.div 
            className="absolute inset-0 flex items-center gap-1 overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 bg-amber-400 rounded-full" 
                style={{ height: `${Math.random() * 60 + 20}%` }} 
              />
            ))}
          </motion.div>
          
          {/* Progress Handle */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-4 border-amber-500 z-20"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Controls Layout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onReplaySentence}
              className="p-3 text-white/60 hover:text-white transition-colors"
              title="Phát lại câu vừa rồi"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={onSaveMoment}
              className="p-3 text-white/60 hover:text-white transition-colors"
              title="Lưu giữ khoảnh khắc này"
            >
              <Bookmark size={20} />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={onTogglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-glow-gold"
            >
              {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} className="ml-1" fill="black" />}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onToggleShadowing}
              className={`p-3 rounded-xl transition-all ${isShadowing ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white'}`}
              title="Chế độ Shadowing"
            >
              <Mic size={20} />
            </button>
            <div className="hidden md:flex items-center gap-3 text-xs font-mono text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span className="opacity-20">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bookmark } from "lucide-react";
