"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Award
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { saveLessonProgress } from "@/app/actions/speaking";

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer (0, 1, 2, 3)
  explanation?: string; // AI Grammatical Explanation
}

interface QuizRoomProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    content: any; // { questions: QuizQuestion[] }
  };
}

export default function QuizRoom({ lesson }: QuizRoomProps) {
  const content = lesson.content || {};
  const rawQuestions = content.questions || [];

  // Fallback questions if none exist
  const fallbackQuestions: QuizQuestion[] = [
    {
      question: "Which word completes the sentence: 'She ___ to school every day'?",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: 1
    }
  ];

  const questions: QuizQuestion[] = rawQuestions.length > 0 ? rawQuestions : fallbackQuestions;

  // States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState<number>(5);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Fetch session & profile
  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (profile) setUserProfile(profile);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      }
    }
    checkSession();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  // Option letters helper
  const optionLetters = ["A", "B", "C", "D"];

  const handleSelectOption = (index: number) => {
    if (isChecked) return;
    setSelectedOptionIndex(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || isChecked) return;

    const correctIndex = currentQuestion.correctAnswer;
    const isAnswerCorrect = selectedOptionIndex === correctIndex;

    setIsCorrect(isAnswerCorrect);
    setIsChecked(true);

    if (isAnswerCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setLives((prev) => {
        const nextLives = Math.max(0, prev - 1);
        if (nextLives === 0) {
          setIsGameOver(true);
        }
        return nextLives;
      });
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsChecked(false);
    } else {
      // Last question completed -> Save progress & celebrate
      saveLessonProgress({
        userId: userProfile?.id || "guest",
        lessonId: lesson.id,
        isCompleted: true,
        lastActivityIndex: 0
      })
      .then(() => {
        setIsFinished(true);
      })
      .catch((err) => {
        console.error("Failed to save lesson progress:", err);
        setIsFinished(true); // fallback to finish anyway
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsChecked(false);
    setLives(5);
    setIsFinished(false);
    setIsGameOver(false);
    setCorrectCount(0);
  };

  // Progress Bar values
  const progressPercent = isFinished
    ? 100
    : Math.round((currentQuestionIndex / questions.length) * 100);

  // Render Game Over Screen
  if (isGameOver) {
    return (
      <div className="bg-[#F8FAFC] bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2F6] min-h-screen text-[#3D3D3B] flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans relative">
        {/* Ambient colored glowing lenses */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-rose-400/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 right-20 w-[400px] h-[400px] rounded-full bg-slate-400/5 blur-[150px] pointer-events-none" />

        <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between shrink-0 z-40 relative">
          <Link 
            href="/learn"
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full bg-white border border-slate-200 shadow-sm"
            title="Thoát"
          >
            <X size={20} className="stroke-[2.5]" />
          </Link>
          <div className="text-rose-500 font-black uppercase tracking-widest text-xs bg-rose-50 border border-rose-150 px-3.5 py-1.5 rounded-full shadow-sm">
            Trò Chơi Kết Thúc
          </div>
          <div className="w-10 h-10" />
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-8 relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="relative w-44 h-44 flex items-center justify-center shrink-0"
          >
            <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl z-0" />
            <span className="text-8xl drop-shadow-2xl z-10 select-none animate-bounce">💔</span>
          </motion.div>

          <div className="text-center space-y-4 max-w-lg bg-white/70 backdrop-blur-md border border-white/40 p-8 rounded-[2.5rem] shadow-xl">
            <h2 className="text-3xl md:text-4xl font-black text-rose-500 tracking-tight leading-tight uppercase">
              Hết Lượt Mất Rồi!
            </h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed px-4">
              Đừng nản lòng nhé! Bạn đã học được rất nhiều kiến thức hôm nay. Hãy thử sức lại ngay để chinh phục hoàn hảo thử thách này nhé!
            </p>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-200/60 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(225,29,72)] hover:brightness-105 active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none text-center"
            >
              <RefreshCw size={14} className="stroke-[3]" /> Chơi lại ngay
            </button>
            <Link 
              href="/learn"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-500 font-extrabold text-xs uppercase tracking-widest rounded-2xl border border-b-4 border-slate-200 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer outline-none text-center"
            >
              Quay lại bản đồ
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  // Render Golden Cup Celebration Arena on finished
  if (isFinished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="bg-[#F8FAFC] bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2F6] min-h-screen text-[#3D3D3B] flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans relative">
        {/* Soft cybernetic ambient lights */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 right-20 w-[400px] h-[400px] rounded-full bg-indigo-400/5 blur-[150px] pointer-events-none" />

        {/* Header - Simple Exit */}
        <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between shrink-0 z-40 relative">
          <Link 
            href="/learn"
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full bg-white border border-slate-200 shadow-sm"
            title="Thoát"
          >
            <X size={20} className="stroke-[2.5]" />
          </Link>
          <div className="text-emerald-600 font-black uppercase tracking-widest text-xs bg-emerald-50 border border-emerald-150 px-4 py-1.5 rounded-full shadow-sm">
            Phòng Thi Hoàn Thành
          </div>
          <div className="w-10 h-10" />
        </header>

        {/* Central Content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-8 relative z-10">
          {/* Glowing Golden Trophy */}
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.1 }}
            className="relative w-40 h-40 flex items-center justify-center shrink-0"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-yellow-400/25 rounded-full blur-2xl z-0"
            />
            <span className="text-8xl drop-shadow-[0_15px_25px_rgba(234,179,8,0.4)] z-10 select-none animate-float">🏆</span>
          </motion.div>

          {/* Heading */}
          <div className="text-center space-y-3 max-w-lg bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-[2.5rem] shadow-xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight uppercase">
              Cúp Vàng Danh Giá!
            </h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed px-4">
              Chúc mừng em đã xuất sắc hoàn thành xuất sắc các câu hỏi trắc nghiệm tiếng Anh ngày hôm nay!
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-2">
            {/* 1. Accuracy Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-emerald-250 bg-emerald-50/50 backdrop-blur-sm rounded-3xl p-4 text-center flex flex-col justify-center items-center shadow-sm select-none border-b-4 border-b-emerald-400 hover:-translate-y-1 active:translate-y-0 transition-all cursor-default"
            >
              <span className="text-3xl mb-1.5" role="img" aria-label="accuracy">🎯</span>
              <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider mb-0.5">Chính Xác</span>
              <span className="text-xl font-black text-emerald-700">{accuracy}%</span>
            </motion.div>

            {/* 2. XP Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-amber-250 bg-amber-50/50 backdrop-blur-sm rounded-3xl p-4 text-center flex flex-col justify-center items-center shadow-sm select-none border-b-4 border-b-amber-400 hover:-translate-y-1 active:translate-y-0 transition-all cursor-default"
            >
              <span className="text-3xl mb-1.5" role="img" aria-label="xp">⚡</span>
              <span className="text-[9px] font-black uppercase text-amber-600 tracking-wider mb-0.5">Điểm XP</span>
              <span className="text-xl font-black text-amber-700">+20 XP</span>
            </motion.div>

            {/* 3. Gems Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border border-cyan-250 bg-cyan-50/50 backdrop-blur-sm rounded-3xl p-4 text-center flex flex-col justify-center items-center shadow-sm select-none border-b-4 border-b-cyan-400 hover:-translate-y-1 active:translate-y-0 transition-all cursor-default"
            >
              <span className="text-3xl mb-1.5" role="img" aria-label="gems">💎</span>
              <span className="text-[9px] font-black uppercase text-cyan-600 tracking-wider mb-0.5">Đá Quý</span>
              <span className="text-xl font-black text-cyan-700">+10 Gems</span>
            </motion.div>
          </div>
        </main>

        {/* Footer actions */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-200/60 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-500 font-extrabold text-xs uppercase tracking-widest rounded-2xl border border-b-4 border-slate-200 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer outline-none text-center shadow-sm"
            >
              <RefreshCw size={14} className="stroke-[3]" /> Làm bài lại
            </button>
            <Link 
              href="/learn"
              className="w-full sm:w-auto px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(16,185,129)] hover:brightness-105 active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none text-center"
            >
              Tiếp tục
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] bg-gradient-to-br from-[#F8FAFC] via-[#EEF2F6] to-[#E2E8F0] min-h-screen text-[#3D3D3B] flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans relative">
      
      {/* Self-contained CSS animations injected for sheen, shake and sparkles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sheen {
          0% { transform: translateX(-150%) skewX(-12deg); }
          50% { transform: translateX(150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes floating-sparkle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-4px) scale(1.15); opacity: 1; }
        }
        .animate-sparkle {
          animation: floating-sparkle 1.5s infinite ease-in-out;
        }
      `}} />

      {/* Cybernetic glowing background lens flares */}
      <div className="absolute top-24 left-12 w-96 h-96 rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-48 right-16 w-[400px] h-[400px] rounded-full bg-emerald-400/5 blur-[150px] pointer-events-none" />

      {/* 1. ROOM HEADER - FOCUS MODE */}
      <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-6 shrink-0 z-40 relative">
        <Link 
          href="/learn"
          className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full bg-white border border-slate-200/80 shadow-sm"
          title="Thoát"
        >
          <X size={20} className="stroke-[2.5]" />
        </Link>

        {/* Thick Duolingo Green Progress Bar with Premium Glow Sheen Animation */}
        <div className="flex-1 h-5 bg-slate-200 rounded-full overflow-hidden relative shadow-inner border border-slate-300/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full relative"
          >
            {/* Dynamic Sweep Light */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-2/3 h-full"
              style={{
                animation: "sheen 2.5s infinite linear",
              }}
            />
          </motion.div>
        </div>

        {/* Hearts/Lives corner - Tactile Heart Badge */}
        <motion.div 
          animate={lives < 5 ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full font-black text-rose-500 text-sm shadow-sm select-none"
        >
          <span>❤️</span>
          <span>{lives}</span>
        </motion.div>
      </header>

      {/* 2. CENTRAL CONTENT (PRACTICE AREA - QUIZ QUESTION & ANSWERS) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-6 relative z-10">
        
        {/* Category Label */}
        <div className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50/50 border border-indigo-100/50 px-3 py-1 rounded-md">
          <HelpCircle size={14} /> Thử Thách Trắc Nghiệm
        </div>

        {/* Question Area - Masterpiece Glassmorphic Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(59,62,198,0.04)] p-8 md:p-10 mb-6 max-w-xl w-full text-center relative overflow-hidden">
          {/* Subtle colored card glow */}
          <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-relaxed select-text">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Options Grid (2x2) - Tactile 3D Cards */}
        <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-4 ${
          isChecked && selectedOptionIndex !== null && selectedOptionIndex !== currentQuestion.correctAnswer ? "animate-shake" : ""
        }`}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isAnswerCorrect = currentQuestion.correctAnswer === idx;

            let cardStyle = "bg-white text-slate-800 border-slate-200 shadow-[0_8px_0_#E2E8F0] hover:-translate-y-[2px] hover:shadow-[0_10px_0_#E2E8F0]";
            let badgeStyle = "bg-slate-50 text-slate-400 border-slate-200/60";

            if (isSelected) {
              cardStyle = "bg-[#EEF2FF] border-[#6366F1] text-[#312E81] shadow-[0_8px_0_#C7D2FE] hover:shadow-[0_8px_0_#C7D2FE] hover:-translate-y-0";
              badgeStyle = "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-sm";
            }

            if (isChecked) {
              if (isAnswerCorrect) {
                // Correct answer is highlighted in neon green
                cardStyle = "bg-[#ECFDF5] border-[#10B981] text-[#065F46] shadow-[0_8px_0_#A7F3D0] hover:shadow-[0_8px_0_#A7F3D0] hover:-translate-y-0 ring-2 ring-emerald-100";
                badgeStyle = "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-sm";
              } else if (isSelected) {
                // Chosen incorrect answer is highlighted in bright coral red
                cardStyle = "bg-[#FEF2F2] border-[#EF4444] text-[#991B1B] shadow-[0_8px_0_#FCA5A5] hover:shadow-[0_8px_0_#FCA5A5] hover:-translate-y-0 ring-2 ring-rose-100";
                badgeStyle = "bg-gradient-to-r from-rose-500 to-red-600 text-white border-rose-450 shadow-sm";
              } else {
                // Non-selected wrong answers are dimmed/faded
                cardStyle = "bg-white/50 border-slate-200 text-slate-400 opacity-50 shadow-[0_4px_0_#F1F5F9] hover:shadow-[0_4px_0_#F1F5F9] hover:-translate-y-0";
                badgeStyle = "bg-slate-50 text-slate-300 border-slate-100";
              }
            }

            return (
              <motion.button
                key={idx}
                whileTap={!isChecked ? { scale: 0.97 } : {}}
                onClick={() => handleSelectOption(idx)}
                disabled={isChecked}
                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer outline-none relative select-none ${cardStyle} ${
                  !isChecked ? "active:translate-y-[6px] active:shadow-[0_2px_0_#E2E8F0]" : ""
                }`}
              >
                {/* 3D Round Badge Indicator for A, B, C, D */}
                <span className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs uppercase shrink-0 transition-all ${badgeStyle}`}>
                  {optionLetters[idx]}
                </span>
                
                <span className="font-extrabold text-base leading-snug">{option}</span>
              </motion.button>
            );
          })}
        </div>

      </main>

      {/* 3. DYNAMIC STICKY BOTTOM ACTION BAR (DUOLINGO FOCUS FOOTER OVERHAULED WITH PREPEDU AI EXPLANATION) */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 border-t p-6 transition-all duration-500 ease-in-out ${
        !isChecked 
          ? "bg-white border-slate-200/80 shadow-[0_-15px_30px_rgba(0,0,0,0.01)]" 
          : isCorrect 
            ? "bg-[#ECFDF5]/95 border-emerald-200 backdrop-blur-md shadow-[0_-15px_40px_rgba(16,185,129,0.1)]" 
            : "bg-[#FEF2F2]/95 border-rose-200 backdrop-blur-md shadow-[0_-15px_40px_rgba(239,68,68,0.1)]"
      }`}>
        <div className="max-w-3xl mx-auto flex flex-col items-stretch gap-4 w-full">
          
          <AnimatePresence mode="wait">
            {!isChecked ? (
              /* State 1: Default state (Check answers) */
              <motion.div
                key="default-check"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex items-center justify-between gap-6"
              >
                {/* Left explanation instructions */}
                <div className="hidden md:flex flex-col items-start gap-1 flex-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Thử Thách Trắc Nghiệm tiếng anh
                  </span>
                  <span className="text-xs text-slate-500 font-bold leading-relaxed">
                    Chọn một lựa chọn đúng đắn và nhấn nút kiểm tra để phân tích cấu trúc bài thi nhé.
                  </span>
                </div>

                {/* Submit checking action button */}
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOptionIndex === null}
                  className={`w-full md:w-auto px-12 py-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border-none outline-none ${
                    selectedOptionIndex !== null
                      ? "bg-indigo-600 hover:bg-indigo-750 text-white shadow-[0_6px_0_#4338CA] active:translate-y-[6px] active:shadow-none cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Kiểm tra đáp án
                </button>
              </motion.div>
            ) : isCorrect ? (
              /* State 2: SUCCESS DYNAMIC STATE (Green theme) */
              <motion.div
                key="success-bar"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="w-full flex flex-col gap-4"
              >
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                  <div className="flex items-center gap-4 text-emerald-800 select-none text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_4px_0_#047857] shrink-0 animate-sparkle">
                      <CheckCircle2 size={26} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight leading-tight uppercase">Chính xác quá tuyệt vời!</h4>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">
                        Chúc mừng em! Bạn đã tìm ra lời giải chính xác cho câu hỏi này.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full sm:w-auto px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_6px_0_#047857] hover:brightness-105 active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none text-center"
                  >
                    Tiếp tục học
                  </button>
                </div>

                {/* AI Grammatical Review Sheet for correct answer */}
                <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-200/50 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">
                    <span>🤖 AI ĐÁNH GIÁ NĂNG LỰC:</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    Đáp án đúng là <strong className="text-emerald-600">"{currentQuestion.options[currentQuestion.correctAnswer]}"</strong>. Kỹ năng chia động từ ở thì Hiện tại đơn của em cực kỳ vững chắc! Trợ lý AI tặng thưởng <span className="text-amber-500">🏆 +10 XP</span> và <span className="text-cyan-500">💎 +5 Gems</span>!
                  </p>
                </div>
              </motion.div>
            ) : (
              /* State 3: FAILURE DYNAMIC STATE (Red theme) */
              <motion.div
                key="fail-bar"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="w-full flex flex-col gap-4"
              >
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                  <div className="flex items-center gap-4 text-rose-800 select-none text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-[0_4px_0_#9F1239] shrink-0">
                      <AlertCircle size={26} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight leading-tight uppercase">Đáp án chưa đúng rồi!</h4>
                      <p className="text-xs font-bold text-rose-700 mt-0.5">
                        Đừng lo lắng, hãy nghiên cứu giải thích chi tiết của trợ lý ảo AI bên dưới.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full sm:w-auto px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_6px_0_#9F1239] hover:brightness-105 active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none text-center"
                  >
                    Tiếp tục học
                  </button>
                </div>

                {/* PrepEdu AI detailed Grammatical Explanations Block */}
                <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-200/50 shadow-sm text-left">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1.5">
                    <span>🤖 AI PHÂN TÍCH LỖI SAI (PREPEDU VIRTUAL CLINIC):</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 leading-relaxed space-y-1">
                    <p>
                      Đáp án chính xác phải là: <strong className="text-emerald-600">"{currentQuestion.options[currentQuestion.correctAnswer]}"</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold italic mt-1 leading-relaxed">
                      Lý do: {currentQuestion.explanation || "Không có giải thích chi tiết cho câu hỏi này."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </footer>

    </div>
  );
}
