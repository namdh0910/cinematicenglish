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
      <div className="bg-[#EEF6F0] min-h-screen text-slate-800 flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans">
        <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between shrink-0 z-40">
          <Link 
            href="/learn"
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            title="Thoát"
          >
            <X size={28} className="stroke-[2.5]" />
          </Link>
          <div className="text-rose-500 font-bold uppercase tracking-wider text-sm">
            Trò Chơi Kết Thúc
          </div>
          <div className="w-10 h-10" />
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="relative w-40 h-40 flex items-center justify-center shrink-0"
          >
            <span className="text-8xl drop-shadow-lg z-10 select-none">💔</span>
          </motion.div>

          <div className="text-center space-y-4 max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-rose-500 tracking-tight leading-tight">
              Hết Lượt Mất Rồi!
            </h2>
            <p className="text-slate-400 text-lg font-bold">
              Đừng nản lòng nhé! Bạn có thể thử sức lại bất cứ lúc nào để chinh phục thử thách này.
            </p>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(225,29,72)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none text-center"
            >
              <RefreshCw size={16} className="stroke-[2.5]" /> Chơi lại ngay
            </button>
            <Link 
              href="/learn"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-500 font-extrabold text-sm uppercase tracking-widest rounded-2xl border-2 border-b-4 border-slate-200 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
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
      <div className="bg-[#EEF6F0] min-h-screen text-slate-800 flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans">
        {/* Header - Simple Exit */}
        <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between shrink-0 z-40">
          <Link 
            href="/learn"
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            title="Thoát"
          >
            <X size={28} className="stroke-[2.5]" />
          </Link>
          <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">
            Phòng Thi Hoàn Thành
          </div>
          <div className="w-10 h-10" />
        </header>

        {/* Central Content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-10">
          {/* Glowing Golden Trophy */}
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.1 }}
            className="relative w-40 h-40 flex items-center justify-center shrink-0"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl z-0"
            />
            <span className="text-8xl drop-shadow-[0_10px_15px_rgba(234,179,8,0.3)] z-10 select-none">🏆</span>
          </motion.div>

          {/* Heading */}
          <div className="text-center space-y-4 max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              Cúp Vàng Danh Giá!
            </h2>
            <p className="text-slate-400 text-lg font-bold">
              Chúc mừng bạn đã xuất sắc vượt qua các câu hỏi trắc nghiệm tiếng Anh ngày hôm nay!
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-4">
            {/* 1. Accuracy Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-2 border-b-4 border-green-200 bg-green-50/50 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-sm select-none hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-default"
            >
              <span className="text-3xl mb-1.5" role="img" aria-label="accuracy">🎯</span>
              <span className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-0.5">Chính Xác</span>
              <span className="text-2xl font-black text-green-700">{accuracy}%</span>
            </motion.div>

            {/* 2. XP Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-2 border-b-4 border-amber-200 bg-amber-50/50 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-sm select-none hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-default"
            >
              <span className="text-3xl mb-1.5" role="img" aria-label="xp">⚡</span>
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-0.5">Điểm XP</span>
              <span className="text-2xl font-black text-amber-700">+20 XP</span>
            </motion.div>

            {/* 3. Gems Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-2 border-b-4 border-cyan-200 bg-cyan-50/50 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-sm select-none hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-default"
            >
              <span className="text-3xl mb-1.5" role="img" aria-label="gems">💎</span>
              <span className="text-[10px] font-black uppercase text-cyan-600 tracking-widest mb-0.5">Đá Quý</span>
              <span className="text-2xl font-black text-cyan-700">+10 Gems</span>
            </motion.div>
          </div>
        </main>

        {/* Footer actions */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-500 font-extrabold text-sm uppercase tracking-widest rounded-2xl border-2 border-b-4 border-slate-200 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
            >
              <RefreshCw size={16} className="stroke-[2.5]" /> Làm bài lại
            </button>
            <Link 
              href="/learn"
              className="w-full sm:w-auto px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(34,197,94)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none text-center"
            >
              Tiếp tục
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-[#EEF6F0] min-h-screen text-slate-800 flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans">
      
      {/* 1. ROOM HEADER - FOCUS MODE */}
      <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-6 shrink-0 z-40">
        <Link 
          href="/learn"
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
          title="Thoát"
        >
          <X size={28} className="stroke-[2.5]" />
        </Link>

        {/* Thick Duolingo Green Progress Bar */}
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>

        {/* Hearts/Lives corner */}
        <div className="flex items-center gap-1.5 font-black text-rose-500 text-lg md:text-xl select-none">
          <span>❤️</span>
          <span>{lives}</span>
        </div>
      </header>

      {/* 2. CENTRAL CONTENT (PRACTICE AREA - QUIZ QUESTION & ANSWERS) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-6">
        
        {/* Category Label */}
        <div className="flex items-center gap-1.5 text-xs font-black text-blue-500 uppercase tracking-widest">
          <HelpCircle size={15} /> Thử Thách Trắc Nghiệm:
        </div>

        {/* Question Area */}
        <h2 className="text-2xl font-bold text-slate-800 text-center leading-relaxed max-w-xl mb-8">
          {currentQuestion.question}
        </h2>

        {/* 4 Options Grid (2x2) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isAnswerCorrect = currentQuestion.correctAnswer === idx;

            let cardStyle = "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-[0_4px_0_theme(colors.slate.200)]";
            let badgeStyle = "bg-slate-100 text-slate-500 border-slate-200";

            if (isSelected) {
              cardStyle = "bg-blue-50/50 border-blue-400 text-blue-800 shadow-[0_4px_0_theme(colors.blue.400)]";
              badgeStyle = "bg-blue-500 text-white border-blue-500";
            }

            if (isChecked) {
              if (isAnswerCorrect) {
                // Correct answer is highlighted in green
                cardStyle = "bg-green-50 border-green-500 text-green-700 shadow-[0_4px_0_theme(colors.green.500)]";
                badgeStyle = "bg-green-500 text-white border-green-500";
              } else if (isSelected) {
                // Chosen incorrect answer is highlighted in red
                cardStyle = "bg-red-50 border-red-500 text-red-700 shadow-[0_4px_0_theme(colors.red.500)]";
                badgeStyle = "bg-red-500 text-white border-red-500";
              } else {
                // Non-selected wrong answers are dimmed/faded
                cardStyle = "bg-white border-slate-200 text-slate-400 opacity-60 shadow-[0_4px_0_theme(colors.slate.100)]";
                badgeStyle = "bg-slate-50 text-slate-300 border-slate-100";
              }
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isChecked ? { scale: 1.02 } : {}}
                whileTap={!isChecked ? { scale: 0.98 } : {}}
                onClick={() => handleSelectOption(idx)}
                disabled={isChecked}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer outline-none relative select-none ${cardStyle} ${
                  !isChecked ? "active:translate-y-[4px] active:shadow-none" : ""
                }`}
              >
                {/* 3D Badge Indicator for A, B, C, D */}
                <span className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-sm uppercase shrink-0 transition-colors ${badgeStyle}`}>
                  {optionLetters[idx]}
                </span>
                
                <span className="font-semibold text-base leading-snug">{option}</span>
              </motion.button>
            );
          })}
        </div>

      </main>

      {/* 3. DYNAMIC STICKY BOTTOM ACTION BAR (DUOLINGO FOCUS FOOTER) */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 border-t p-6 transition-all duration-300 ease-in-out ${
        !isChecked 
          ? "bg-white border-gray-200" 
          : isCorrect 
            ? "bg-green-100 border-green-200 shadow-[0_-8px_30px_rgba(34,197,94,0.1)]" 
            : "bg-red-100 border-red-200 shadow-[0_-8px_30px_rgba(239,68,68,0.1)]"
      }`}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          
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
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Thử Thách Trắc Nghiệm
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Hãy lựa chọn đáp án chính xác nhất để vượt qua câu hỏi này.
                  </span>
                </div>

                {/* Submit checking action button */}
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOptionIndex === null}
                  className={`w-full md:w-auto px-12 py-4 font-extrabold text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border-none outline-none ${
                    selectedOptionIndex !== null
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_6px_0_rgb(37,99,235)] active:translate-y-[6px] active:shadow-none cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Kiểm tra
                </button>
              </motion.div>
            ) : isCorrect ? (
              /* State 2: SUCCESS DYNAMIC STATE (Green theme) */
              <motion.div
                key="success-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1"
              >
                <div className="flex items-center gap-4 text-green-800 select-none text-center sm:text-left">
                  <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_4px_0_#15803d] shrink-0">
                    <CheckCircle2 size={28} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-tight">Chính xác tuyệt vời!</h4>
                    <p className="text-xs font-bold opacity-95">
                      Bạn đã tìm ra đáp án đúng của thử thách này.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full sm:w-auto px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(34,197,94)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  Tiếp tục
                </button>
              </motion.div>
            ) : (
              /* State 3: FAILURE DYNAMIC STATE (Red theme) */
              <motion.div
                key="fail-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1"
              >
                <div className="flex items-center gap-4 text-red-800 select-none text-center sm:text-left">
                  <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_4px_0_#b91c1c] shrink-0">
                    <AlertCircle size={28} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-tight">Đáp án chưa đúng!</h4>
                    <p className="text-xs font-bold opacity-95">
                      Đáp án đúng được bôi màu xanh lá cây ở trên. Hãy ghi nhớ nhé!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full sm:w-auto px-12 py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(239,68,68)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  Tiếp tục
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </footer>

    </div>
  );
}
