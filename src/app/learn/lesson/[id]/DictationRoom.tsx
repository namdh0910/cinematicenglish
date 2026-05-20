"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ChevronLeft, 
  Sparkles,
  Award,
  Zap
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface DictationRoomProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    content: any; // { audioUrl: string, text: string, blanks: string[] }
  };
}

export default function DictationRoom({ lesson }: DictationRoomProps) {
  const content = lesson.content || {};
  const audioUrl = content.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const sentenceText = content.text || "";
  const blanks = content.blanks || [];

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]); // true for correct, false for incorrect
  const [shakeTrigger, setShakeTrigger] = useState<number[]>([]); // track triggers for shake
  
  const [showCelebration, setShowCelebration] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize input state based on the blanks
  useEffect(() => {
    setUserInputs(new Array(blanks.length).fill(""));
    setResults(new Array(blanks.length).fill(false));
    setShakeTrigger(new Array(blanks.length).fill(0));
  }, [blanks.length]);

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
    const onLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
  };

  const handleInputChange = (index: number, val: string) => {
    if (isChecked) return; // lock inputs after checking
    const nextInputs = [...userInputs];
    nextInputs[index] = val;
    setUserInputs(nextInputs);
  };

  const checkAnswers = () => {
    let allCorrect = true;
    const nextResults = userInputs.map((input, idx) => {
      const correctVal = blanks[idx] || "";
      const isCorrect = input.trim().toLowerCase() === correctVal.trim().toLowerCase();
      if (!isCorrect) {
        allCorrect = false;
        // Trigger shake by updating trigger value
        const nextShake = [...shakeTrigger];
        nextShake[idx] += 1;
        setShakeTrigger(nextShake);
      }
      return isCorrect;
    });

    setResults(nextResults);
    setIsChecked(true);

    if (allCorrect) {
      setShowCelebration(true);
    }
  };

  const resetDictation = () => {
    setUserInputs(new Array(blanks.length).fill(""));
    setResults(new Array(blanks.length).fill(false));
    setShakeTrigger(new Array(blanks.length).fill(0));
    setIsChecked(false);
    setShowCelebration(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setAudioProgress(0);
    }
  };

  // Parsing the sentence to extract segments and blanks
  const parts = sentenceText.split(/(\[.*?\])/g);
  let blankCounter = 0;

  return (
    <div className="bg-[#F5F7FB] min-h-screen pb-20 text-[#3D3D3B]">
      <Navbar />

      {/* Decorative Warm Shapes */}
      <div className="absolute -left-40 top-20 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 top-80 w-96 h-96 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Header breadcrumb */}
      <header className="max-w-4xl mx-auto px-6 pt-8 flex items-center justify-between w-full relative z-10">
        <Link 
          href="/learn"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Thoát Dictation
        </Link>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full text-orange-600 text-xs font-black shadow-sm">
          <Zap size={13} fill="currentColor" /> 200 XP
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh] relative z-10">
        
        {/* Core Dictation Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.03)] p-10 md:p-12 w-full space-y-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" />

          {/* Section Indicator */}
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles size={12} className="fill-[#8B5CF6]" /> Practice Mode: Dictation
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{lesson.title}</h1>
            <p className="text-xs text-slate-400 font-bold">{lesson.description}</p>
          </div>

          {/* Audio Controller Panel */}
          <div className="w-full max-w-md bg-slate-50 border border-slate-100 p-6 rounded-3xl flex flex-col items-center gap-4 shadow-inner">
            <div className="flex items-center gap-4 w-full">
              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isPlaying 
                    ? "bg-[#8B5CF6] text-white shadow-purple-500/20" 
                    : "bg-[#3B82F6] text-white shadow-blue-500/20"
                }`}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </motion.button>

              <div className="flex-1 space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  {isPlaying ? "Đang phát âm thanh..." : "Bấm nút để nghe đoạn âm thanh"}
                </span>
                
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                  if (!audioRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  audioRef.current.currentTime = pct * audioRef.current.duration;
                }}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full transition-all duration-150"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Text Blanks Area */}
          <div className="py-6 w-full text-center leading-loose">
            <div className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-relaxed flex flex-wrap items-center justify-center gap-x-2 gap-y-3 font-display">
              {parts.map((part: string, index: number) => {
                if (part.startsWith("[") && part.endsWith("]")) {
                  const currentIdx = blankCounter++;
                  const isCorrect = isChecked && results[currentIdx] === true;
                  const isIncorrect = isChecked && results[currentIdx] === false;
                  
                  return (
                    <motion.div
                      key={index}
                      animate={shakeTrigger[currentIdx] > 0 ? {
                        x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
                        transition: { duration: 0.5 }
                      } : {}}
                      className="relative inline-flex items-center"
                    >
                      <input
                        type="text"
                        disabled={isChecked}
                        value={userInputs[currentIdx] || ""}
                        onChange={(e) => handleInputChange(currentIdx, e.target.value)}
                        placeholder="..."
                        className={`px-4 py-2 border-2 bg-slate-50 text-slate-800 rounded-2xl font-black text-center focus:outline-none transition-all duration-300 w-44 text-xl md:text-2xl ${
                          isCorrect ? "border-emerald-500 text-emerald-600 bg-emerald-50/50" :
                          isIncorrect ? "border-red-500 text-red-600 bg-red-50/50" :
                          "border-slate-200 focus:border-[#3B82F6] focus:bg-white focus:shadow-md"
                        }`}
                      />
                      
                      {/* Check/Cross Visual Indicator */}
                      <AnimatePresence>
                        {isCorrect && (
                          <motion.span 
                            initial={{ scale: 0, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -right-7 text-emerald-500"
                          >
                            <CheckCircle size={20} fill="currentColor" className="text-white fill-emerald-500" />
                          </motion.span>
                        )}
                        {isIncorrect && (
                          <motion.span 
                            initial={{ scale: 0, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -right-7 text-red-500"
                          >
                            <XCircle size={20} fill="currentColor" className="text-white fill-red-500" />
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

          {/* Action buttons */}
          <div className="w-full max-w-sm pt-6">
            {!isChecked ? (
              <button
                onClick={checkAnswers}
                disabled={userInputs.some(val => !val.trim())}
                className="w-full py-4 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer border-none"
              >
                Kiểm tra đáp án
              </button>
            ) : (
              <div className="flex gap-4 w-full">
                <button
                  onClick={resetDictation}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] cursor-pointer"
                >
                  <RefreshCw size={14} /> Làm lại
                </button>
                
                <Link
                  href="/learn"
                  className="flex-1 py-4 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 active:scale-[0.99] cursor-pointer text-center"
                >
                  Hoàn thành <Award size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Celebration modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[36px] border border-slate-100 shadow-2xl p-8 max-w-md w-full text-center space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 to-teal-400" />
                
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-inner animate-bounce">
                  <CheckCircle size={44} fill="currentColor" className="text-white fill-emerald-500" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Xuất sắc! 🎉</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Em đã điền từ nghe được chính xác 100%! Hãy tiếp tục rèn luyện kỹ năng nghe chép để bứt phá tiếng Anh mỗi ngày nhé.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-100/50 p-4 rounded-2xl flex items-center justify-between text-orange-700">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Zap size={14} fill="currentColor" /> Điểm thưởng
                  </span>
                  <span className="text-xl font-black">+200 XP</span>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowCelebration(false)}
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Xem lại bài
                  </button>
                  <Link
                    href="/learn"
                    className="flex-1 py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 text-center"
                  >
                    Trở về Dashboard
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
