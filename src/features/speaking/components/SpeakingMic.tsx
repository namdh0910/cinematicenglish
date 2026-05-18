"use client";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

interface SpeakingMicProps {
  isRecording: boolean;
  isAnalyzing: boolean;
  onClick: () => void;
}

export default function SpeakingMic({ isRecording, isAnalyzing, onClick }: SpeakingMicProps) {
  return (
    <div className="w-full pb-8 flex justify-center items-center shrink-0">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={isAnalyzing}
        className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500 text-white shadow-glow-red scale-110' 
            : 'bg-white text-black shadow-glow-gold'
        } disabled:opacity-50 z-20`}
        aria-label={isRecording ? "Stop recording speaking practice" : "Start recording speaking practice"}
      >
        {isRecording ? (
          <Square size={36} fill="white" className="text-white" />
        ) : (
          <Mic size={44} className="text-black" />
        )}
      </motion.button>
    </div>
  );
}
