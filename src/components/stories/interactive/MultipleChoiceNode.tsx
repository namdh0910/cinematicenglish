"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface MultipleChoiceNodeProps {
  data: {
    question: string;
    options: string[];
    correctIndex: number;
    context?: string;
  };
  onAnswer: (isCorrect: boolean) => void;
}

export default function MultipleChoiceNode({ data, onAnswer }: MultipleChoiceNodeProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        {data.context && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40"
          >
            {data.context}
          </motion.div>
        )}
        <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight">
          {data.question}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {data.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(index === data.correctIndex)}
            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 text-left group transition-all"
          >
            <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">
              {option}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-all">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-white/20 font-medium">
          Choose the most accurate interpretation to maintain momentum
        </p>
      </div>
    </div>
  );
}
