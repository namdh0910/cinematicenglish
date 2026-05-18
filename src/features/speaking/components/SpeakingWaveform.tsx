"use client";
import { motion } from "framer-motion";

export default function SpeakingWaveform() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-end justify-center gap-1 h-12 w-48 mx-auto"
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: [12, Math.random() * 36 + 12, 12] }}
          transition={{ repeat: Infinity, duration: 0.4 + i * 0.05, ease: "easeInOut" }}
          className="w-1 rounded-full bg-red-500"
          style={{ minHeight: "8px" }}
        />
      ))}
    </motion.div>
  );
}
