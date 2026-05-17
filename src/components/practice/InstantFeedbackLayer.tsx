"use client";
import { CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from "lucide-react";

interface InstantFeedbackLayerProps {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  xpAwarded: number;
  weakTag?: string;
  onContinue: () => void;
}

export default function InstantFeedbackLayer({
  isCorrect,
  correctAnswer,
  userAnswer,
  xpAwarded,
  weakTag,
  onContinue
}: InstantFeedbackLayerProps) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isCorrect 
        ? "border-emerald-500/20 bg-emerald-500/[0.02]" 
        : "border-rose-500/20 bg-rose-500/[0.02]"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle2 className="text-emerald-400 mt-0.5 shrink-0 animate-pulse" size={18} />
          ) : (
            <XCircle className="text-rose-400 mt-0.5 shrink-0 animate-pulse" size={18} />
          )}

          <div className="space-y-1">
            <h4 className={`text-xs font-black uppercase tracking-widest ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
              {isCorrect ? "Perfect accuracy" : "Correction resolved"}
            </h4>

            {isCorrect ? (
              <p className="text-[11px] text-white/70 leading-relaxed">
                Excellent pronunciation rhythm. Pacing and articulation calculated successfully. <span className="text-emerald-400 font-mono font-bold">+{xpAwarded} XP</span>
              </p>
            ) : (
              <div className="space-y-1 text-[11px]">
                <p className="text-white/40">
                  Your response: <span className="text-rose-400/80 font-mono">{userAnswer || "(empty)"}</span>
                </p>
                <p className="text-white/80">
                  Correct pattern: <span className="text-emerald-400 font-mono font-bold">{correctAnswer}</span>
                </p>
                {weakTag && (
                  <span className="inline-block mt-1 text-[8px] font-mono bg-amber-500/10 text-amber-500 py-0.5 px-2 rounded-md border border-amber-500/20">
                    Weakness Tagged: {weakTag}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onContinue}
          className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
            isCorrect 
              ? "bg-emerald-500 hover:bg-emerald-400 text-black" 
              : "bg-white hover:bg-amber-400 text-black"
          }`}
        >
          Next Challenge <ArrowRight size={10} />
        </button>

      </div>
    </div>
  );
}
