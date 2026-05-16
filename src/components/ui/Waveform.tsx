"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WaveformProps {
  active?: boolean;
  bars?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function Waveform({
  active = false,
  bars = 24,
  height = 40,
  color = "var(--gradient-violet)",
  className = "",
}: WaveformProps) {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    setHeights(Array.from({ length: bars }, () => Math.random() * (height * 0.8) + (height * 0.2)));
  }, [bars, height]);

  return (
    <div className={`flex items-end justify-center gap-[3px] ${className}`} style={{ height: `${height}px` }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="waveform-bar"
          style={{
            width: "3px",
            background: color,
            height: active ? (heights[i] || 8) : "4px",
            opacity: active ? 1 : 0.2,
            transition: "height 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          animate={active ? {
            height: [heights[i], (heights[i] || 8) * 0.4, heights[i]]
          } : {}}
          transition={active ? {
            repeat: Infinity,
            duration: 0.6 + Math.random() * 0.4,
            ease: "easeInOut",
            delay: i * 0.05
          } : {}}
        />
      ))}
    </div>
  );
}
