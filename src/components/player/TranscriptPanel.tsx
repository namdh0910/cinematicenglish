"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TranscriptLine } from "@/lib/data";

interface TranscriptPanelProps {
  transcript: TranscriptLine[];
  currentTime: number;
  onLineClick: (time: number) => void;
  isShadowing: boolean;
}

export default function TranscriptPanel({ 
  transcript, 
  currentTime, 
  onLineClick,
  isShadowing 
}: TranscriptPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Find the active line index
  const activeIndex = transcript.findIndex(
    line => currentTime >= line.startTime && currentTime <= line.endTime
  );

  // Auto-scroll logic
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const line = activeLineRef.current;
      
      const scrollPos = line.offsetTop - (container.offsetHeight / 3);
      container.scrollTo({
        top: scrollPos,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-6 py-32 scrollbar-hide mask-fade-edges"
    >
      <div className="max-w-2xl mx-auto space-y-12">
        {transcript.map((line, index) => {
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.3,
                scale: isActive ? 1.05 : 1,
                y: isActive ? 0 : 10,
              }}
              onClick={() => onLineClick(line.startTime)}
              className={`cursor-pointer transition-all duration-500 group relative`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute -inset-x-4 -inset-y-2 bg-white/5 blur-xl rounded-2xl z-0"
                />
              )}
              
              <div className="relative z-10">
                <p className={`text-2xl md:text-3xl font-display font-medium leading-relaxed tracking-tight ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {line.text.split(" ").map((word, i) => (
                    <span 
                      key={i} 
                      className="hover:text-amber-400 transition-colors inline-block mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Word interaction logic here
                        console.log("Word clicked:", word);
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
                
                <AnimatePresence>
                  {(isActive || isShadowing) && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 0.6, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-lg text-secondary mt-4 font-sans leading-relaxed"
                    >
                      {line.translation}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
