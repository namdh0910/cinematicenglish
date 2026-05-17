"use client";

interface PracticeProgressBarProps {
  current: number;
  total: number;
  combo: number;
}

export default function PracticeProgressBar({ current, total, combo }: PracticeProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest uppercase">
        <span className="text-white/30">Challenge {current}/{total}</span>
        {combo > 1 && (
          <span className="text-amber-500 flex items-center gap-1 animate-bounce">
            🔥 COMBO x{combo}
          </span>
        )}
        <span className="text-violet-400">{percentage}% COMPLETE</span>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
