"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { saveLessonProgress } from "@/app/actions/speaking";

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

interface DictationRoomProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    content: any; // { audioUrl: string, text: string, blanks?: string[] }
  };
}

export default function DictationRoom({ lesson }: DictationRoomProps) {
  const content = lesson.content || {};
  const audioUrl = content.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const sentenceText = content.text || "";
  const blanks = content.blanks || [];

  // Parse segments and correct blanks based on brackets
  const parts = sentenceText.split(/(\[.*?\])/g);
  
  // Find correct answers from bracketed items
  const bracketMatches = sentenceText.match(/\[(.*?)\]/g) || [];
  const parsedBlanks = bracketMatches.map((m: string) => m.slice(1, -1).trim());
  const finalBlanks = parsedBlanks.length > 0 ? parsedBlanks : blanks;

  // React States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]); // true for correct, false for incorrect
  const [shakeTrigger, setShakeTrigger] = useState<number[]>([]); // shake trigger values
  const [lives, setLives] = useState<number>(5);
  const [isFinished, setIsFinished] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize input state based on the blanks
  useEffect(() => {
    setUserInputs(new Array(finalBlanks.length).fill(""));
    setResults(new Array(finalBlanks.length).fill(false));
    setShakeTrigger(new Array(finalBlanks.length).fill(0));
  }, [finalBlanks.length]);

  // Check login session & initialize profile
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

  // Audio lifecycle
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };
    const onTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [audioUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error("Audio play failed:", err));
    }
  };

  const handleInputChange = (index: number, val: string) => {
    if (isChecked) return;
    const nextInputs = [...userInputs];
    nextInputs[index] = val;
    setUserInputs(nextInputs);
  };

  // Check user answers against correct values
  const checkAnswers = () => {
    let allCorrect = true;
    let blankIdx = 0;

    const nextResults = parts.map((part: string) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        const correctVal = part.slice(1, -1).trim();
        const userInput = userInputs[blankIdx] || "";
        const isCorrect = userInput.trim().toLowerCase() === correctVal.toLowerCase();

        if (!isCorrect) {
          allCorrect = false;
        }
        blankIdx++;
        return isCorrect;
      }
    }).filter((v: boolean | null): v is boolean => v !== null);

    setResults(nextResults);
    setIsChecked(true);

    if (!allCorrect) {
      // Deduct a life/heart if any blank is wrong
      setLives((prev) => Math.max(0, prev - 1));

      // Trigger shake animation for wrong fields
      const newShake = [...shakeTrigger];
      nextResults.forEach((res: boolean, idx: number) => {
        if (!res) newShake[idx] += 1;
      });
      setShakeTrigger(newShake);
    }
  };

  // Clear incorrect fields and try again
  const handleRetry = () => {
    const nextInputs = userInputs.map((input, idx) => {
      return results[idx] ? input : "";
    });
    setUserInputs(nextInputs);
    setIsChecked(false);
    setResults(new Array(finalBlanks.length).fill(false));
  };

  // Complete lesson & save database progress
  const handleContinue = () => {
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
  };

  // Reset entire practice room
  const handleRestart = () => {
    setUserInputs(new Array(finalBlanks.length).fill(""));
    setResults(new Array(finalBlanks.length).fill(false));
    setShakeTrigger(new Array(finalBlanks.length).fill(0));
    setIsChecked(false);
    setLives(5);
    setIsFinished(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setAudioProgress(0);
    }
  };

  // Progress Bar values
  const filledCount = userInputs.filter((input) => input.trim() !== "").length;
  const progressPercent = isChecked && results.every((r) => r) 
    ? 100 
    : finalBlanks.length > 0 
      ? Math.round((filledCount / finalBlanks.length) * 70) + 15
      : 15;

  const isAllInputsFilled = userInputs.length > 0 && userInputs.every((input) => input.trim() !== "");
  const isEverythingCorrect = isChecked && results.every((r) => r);

  // Render Golden Cup Celebration Arena on finished
  if (isFinished) {
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
            Bài Học Đã Hoàn Thành
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
              Cực Kỳ Xuất Sắc!
            </h2>
            <p className="text-slate-400 text-lg font-bold">
              Chúc mừng bạn đã hoàn thành xuất sắc thử thách nghe chép chính tả ngày hôm nay!
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
              <span className="text-2xl font-black text-green-700">100%</span>
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
              <RefreshCw size={16} className="stroke-[2.5]" /> Luyện tập lại
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

  // Focus Mode regular layout
  let blankCounter = 0;

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

      {/* 2. CENTRAL CONTENT (PRACTICE AREA - NGHE & ĐIỀN TỪ) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-8">
        
        {/* Giant Play Speaker Audio Button */}
        <div className="relative">
          {isPlaying && (
            <>
              <motion.div
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-blue-400 rounded-2xl z-0 pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-blue-300 rounded-2xl z-0 pointer-events-none"
              />
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className={`w-24 h-20 rounded-2xl text-white shadow-[0_6px_0_rgb(37,99,235)] active:translate-y-[6px] active:shadow-none cursor-pointer flex items-center justify-center z-10 relative border-none outline-none ${
              isPlaying ? "bg-blue-600 animate-pulse" : "bg-blue-500"
            }`}
            title="Nghe câu phát âm"
          >
            {isPlaying ? (
              <Pause size={38} className="fill-white stroke-none" />
            ) : (
              <Play size={38} className="fill-white stroke-none ml-1" />
            )}
          </motion.button>
        </div>

        {/* Instructions banner */}
        <p className="text-xs font-black text-blue-500 uppercase tracking-widest mt-2">
          Nghe đoạn băng và điền các từ còn thiếu bên dưới:
        </p>

        {/* Interactive Text Blanks Area */}
        <div className="w-full text-center leading-loose px-4">
          <div className="text-3xl font-bold text-slate-800 leading-relaxed mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-4 font-sans select-text">
            {parts.map((part: string, index: number) => {
              if (part.startsWith("[") && part.endsWith("]")) {
                const currentIdx = blankCounter++;
                const correctAnswer = part.slice(1, -1);
                
                const isCorrect = isChecked && results[currentIdx] === true;
                const isIncorrect = isChecked && results[currentIdx] === false;

                let inputStyle = "bg-slate-100 border-b-4 border-slate-300 rounded-lg w-36 mx-2 text-center text-blue-600 focus:border-blue-500 focus:bg-blue-50 outline-none transition-colors font-bold text-2xl py-1";
                if (isCorrect) {
                  inputStyle = "bg-green-50 border-b-4 border-green-500 text-green-600 rounded-lg w-36 mx-2 text-center outline-none cursor-default font-bold text-2xl py-1";
                } else if (isIncorrect) {
                  inputStyle = "bg-red-50 border-b-4 border-red-500 text-red-500 rounded-lg w-36 mx-2 text-center outline-none cursor-default font-bold text-2xl py-1";
                }

                return (
                  <motion.div
                    key={index}
                    animate={
                      shakeTrigger[currentIdx] > 0
                        ? {
                            x: [-8, 8, -8, 8, -4, 4, -2, 2, 0],
                            transition: { duration: 0.5 }
                          }
                        : {}
                    }
                    className="relative inline-flex flex-col items-center justify-center align-middle"
                  >
                    <input
                      type="text"
                      disabled={isChecked}
                      value={userInputs[currentIdx] || ""}
                      onChange={(e) => handleInputChange(currentIdx, e.target.value)}
                      placeholder="..."
                      className={inputStyle}
                      style={{ minWidth: "140px" }}
                    />
                    
                    {/* Error Correction small label */}
                    <AnimatePresence>
                      {isIncorrect && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs font-bold text-red-500 mt-1 select-all"
                        >
                          ({correctAnswer})
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              } else {
                return (
                  <span key={index} className="text-slate-700">
                    {part}
                  </span>
                );
              }
            })}
          </div>
        </div>
      </main>

      {/* 3. DYNAMIC STICKY BOTTOM ACTION BAR (DUOLINGO FOCUS FOOTER) */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 border-t p-6 transition-all duration-300 ease-in-out ${
        !isChecked 
          ? "bg-white border-gray-200" 
          : isEverythingCorrect 
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
                    Chính Tả Nghe Điền Từ
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Nhập tất cả các ô trống ở trên để kiểm tra kết quả.
                  </span>
                </div>

                {/* Submit checking action button */}
                <button
                  onClick={checkAnswers}
                  disabled={!isAllInputsFilled}
                  className={`w-full md:w-auto px-12 py-4 font-extrabold text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border-none outline-none ${
                    isAllInputsFilled
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_6px_0_rgb(37,99,235)] active:translate-y-[6px] active:shadow-none cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Kiểm tra
                </button>
              </motion.div>
            ) : isEverythingCorrect ? (
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
                    <h4 className="text-xl font-black tracking-tight leading-tight">Tuyệt vời!</h4>
                    <p className="text-xs font-bold opacity-95">
                      Chúc mừng bạn đã điền đúng toàn bộ các từ của câu nói!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full sm:w-auto px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(34,197,94)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  Tuyệt vời, Tiếp tục!
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
                    <h4 className="text-xl font-black tracking-tight leading-tight">Thử lại nhé</h4>
                    <p className="text-xs font-bold opacity-95">
                      Một số từ điền chưa chính xác. Kiểm tra gợi ý màu đỏ phía dưới ô điền nhé.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRetry}
                  className="w-full sm:w-auto px-12 py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(239,68,68)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  <RefreshCw size={16} className="stroke-[2.5]" /> Thử lại
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </footer>

    </div>
  );
}
