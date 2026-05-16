"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import QuizNodeFactory from "./QuizNodeFactory";
import FeedbackLayer from "./FeedbackLayer";

interface InteractiveOverlayProps {
  isActive: boolean;
  checkpoint: any;
  onComplete: (isCorrect: boolean, responseTime: number) => void;
}

export default function InteractiveOverlay({ 
  isActive, 
  checkpoint, 
  onComplete 
}: InteractiveOverlayProps) {
  const [startTime, setStartTime] = useState(0);
  const [feedbackStatus, setFeedbackStatus] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (isActive) {
      setStartTime(Date.now());
      setFeedbackStatus(null);
    }
  }, [isActive, checkpoint]);

  const handleAnswer = (isCorrect: boolean) => {
    const responseTime = Date.now() - startTime;
    setFeedbackStatus(isCorrect ? "correct" : "wrong");
    
    // Smooth transition back after feedback
    setTimeout(() => {
      onComplete(isCorrect, responseTime);
    }, isCorrect ? 1200 : 2000);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-black/40"
        >
          {/* Cinematic Bokeh Background Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" 
            />
          </div>

          <div className="w-full max-w-xl relative z-10">
            {feedbackStatus ? (
              <FeedbackLayer status={feedbackStatus} questionData={checkpoint.question_data} />
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <QuizNodeFactory 
                  type={checkpoint.type} 
                  data={checkpoint.question_data} 
                  onAnswer={handleAnswer} 
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
