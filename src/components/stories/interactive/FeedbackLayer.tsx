"use client";
import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";

interface FeedbackLayerProps {
  status: "correct" | "wrong";
  questionData: any;
}

export default function FeedbackLayer({ status, questionData }: FeedbackLayerProps) {
  const isCorrect = status === "correct";

  return (
    <div className="text-center space-y-8">
      {/* Visual Aura */}
      <div className="relative flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 ${
            isCorrect ? "bg-emerald-500 shadow-glow-emerald" : "bg-white/10"
          }`}
        >
          {isCorrect ? (
            <Check size={40} strokeWidth={4} className="text-black" />
          ) : (
            <X size={40} strokeWidth={4} className="text-white/40" />
          )}
        </motion.div>

        {/* Momentum Ripple */}
        {isCorrect && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-emerald-500 rounded-full blur-xl"
          />
        )}
      </div>

      <div className="space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-display font-black tracking-tight ${
            isCorrect ? "text-emerald-400" : "text-white/80"
          }`}
        >
          {isCorrect ? "Perfect Momentum" : "A Moment for Reflection"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-sm mx-auto"
        >
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-amber-500 font-bold">
              <Zap size={20} fill="currentColor" />
              <span className="text-xl">+15 XP Momentum Burst</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/40 text-sm leading-relaxed">
                The essence was: <span className="text-white/80 italic">"{questionData.options[questionData.correctIndex]}"</span>
              </p>
              <p className="text-xs text-white/20">
                Correctness is a path, not a destination. Let's continue.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
