"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  Zap, 
  Volume2, 
  Award, 
  RefreshCw, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Star,
  BookOpen,
  Image as ImageIcon,
  Headphones,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceRecorder } from "@/features/speaking/hooks/useVoiceRecorder";
import { Lesson } from "@/features/speaking/types";
import { evaluateSpeaking, saveSceneProgress } from "@/app/actions/speaking";

const PASSING_SCORE = 70;

function playTingSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (err) {
    console.warn("Could not play ting sound:", err);
  }
}

interface LessonPlayerClientProps {
  lesson: Lesson;
}

export default function LessonPlayerClient({ lesson }: LessonPlayerClientProps) {
  const router = useRouter();
  
  // Sort and list activities
  const activities = lesson.activities?.sort((a, b) => a.order_index - b.order_index) || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [xpReward, setXpReward] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  // Toggle modes: speaking vs dictation listening
  const [learningMode, setLearningMode] = useState<"speaking" | "listening">("speaking");

  const triggerParticles = () => {
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
    const newParticles = Array.from({ length: 24 }).map((_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 40 + Math.random() * 80;
      return {
        id: Date.now() + idx,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
      };
    });
    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  // Video playback & Scene control states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Dictation listening state
  const [dictationAnswers, setDictationAnswers] = useState<string[]>([]);
  const [dictationChecked, setDictationChecked] = useState(false);
  const [dictationResults, setDictationResults] = useState<boolean[]>([]);

  // Shadow Speaking recording states
  const {
    isRecording,
    audioBlob,
    audioUrl,
    micError,
    startRecording,
    stopRecording,
    reset: resetRecorder
  } = useVoiceRecorder();

  // AI Coach Feedback states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  const activeActivity = activities[currentIdx];

  const transcript = activeActivity?.content?.transcript || "";
  const translation = activeActivity?.content?.translation || "";

  // Dynamic Scene Boundaries based on index
  const startSceneTime = activeActivity?.content?.start_time ?? (currentIdx * 5);
  const endSceneTime = activeActivity?.content?.end_time ?? (startSceneTime + 5);

  // Dictation word slice generator
  const getDictationWords = (text: string) => {
    const words = text.split(" ");
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
      // Make every 3rd word longer than 2 letters a blank
      const isBlank = idx % 3 === 1 && cleanWord.length > 2;
      return {
        original: word,
        clean: cleanWord.toLowerCase(),
        isBlank
      };
    });
  };

  const dictationWords = getDictationWords(transcript);

  const hasVideo = !!(lesson.video_url || lesson.videoUrl);

  // Sync video/state on Scene/Activity change
  useEffect(() => {
    resetStateForNewScene();
    if (shouldAutoPlay) {
      setShouldAutoPlay(false);
      setTimeout(() => {
        if (hasVideo && videoRef.current) {
          videoRef.current.play().catch(console.error);
          setIsVideoPaused(false);
          setIsVideoPlaying(true);
        } else {
          handlePlayScene();
        }
      }, 150);
    }
  }, [currentIdx, activeActivity]);

  const resetStateForNewScene = () => {
    resetRecorder();
    setShowAICoach(false);
    setAiFeedback(null);
    setIsVideoPaused(true);
    setIsVideoPlaying(false);
    setDictationAnswers(Array(dictationWords.length).fill(""));
    setDictationChecked(false);
    setDictationResults([]);

    if (hasVideo && videoRef.current) {
      videoRef.current.currentTime = startSceneTime;
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  useEffect(() => {
    if (hasVideo && videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, hasVideo]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!hasVideo) return;
    const video = e.currentTarget;
    if (video.currentTime >= endSceneTime) {
      video.pause();
      video.currentTime = endSceneTime;
      setIsVideoPaused(true);
      setIsVideoPlaying(false);
    }
  };

  const handlePlayScene = () => {
    if (hasVideo && videoRef.current) {
      if (videoRef.current.currentTime >= endSceneTime || videoRef.current.currentTime < startSceneTime) {
        videoRef.current.currentTime = startSceneTime;
      }
      videoRef.current.play().catch(console.error);
      setIsVideoPaused(false);
      setIsVideoPlaying(true);
    } else {
      // Play sentence audio or fallback to SpeechSynthesis TTS
      const audioUrl = activeActivity?.content?.audioUrl;
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(console.error);
        setIsVideoPlaying(true);
        setIsVideoPaused(false);
        audio.onended = () => {
          setIsVideoPlaying(false);
          setIsVideoPaused(true);
        };
      } else {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          setIsVideoPlaying(true);
          setIsVideoPaused(false);
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(transcript);
          utterance.lang = "en-US";
          utterance.rate = 0.85;
          utterance.onend = () => {
            setIsVideoPlaying(false);
            setIsVideoPaused(true);
          };
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };

  const handlePauseScene = () => {
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPaused(true);
      setIsVideoPlaying(false);
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsVideoPaused(true);
      setIsVideoPlaying(false);
    }
  };

  // Listen for speaking recording completion to run AI STT
  useEffect(() => {
    if (audioBlob && learningMode === "speaking") {
      handleEvaluateAudio(audioBlob);
    }
  }, [audioBlob]);

  const handleEvaluateAudio = async (blob: Blob) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await evaluateSpeaking({
          userId: "guest",
          audioBase64: base64Audio,
          targetSentence: transcript,
          durationSeconds: 4,
          sentenceId: activeActivity?.id
        });

        setIsAnalyzing(false);
        if (response.success) {
          setShowAICoach(true);
          setAiFeedback({
            overall: response.accuracy,
            accuracy: response.accuracy,
            fluency: response.fluency,
            coachFeedback: response.coachFeedback,
            wordEvaluations: response.wordEvaluations?.map((w: any) => ({
              word: w.word,
              status: w.status === 'imperfect' ? 'incorrect' : w.status,
              accuracy: w.accuracy
            })) || []
          });
          
          if (response.accuracy >= PASSING_SCORE) {
            playTingSound();
            triggerParticles();
          }

          if (response.xpEarned) {
            setXpReward(prev => prev + response.xpEarned!);
          }

          saveSceneProgress({
            userId: "guest",
            lessonId: lesson.id,
            sceneIndex: currentIdx,
            highestScore: response.accuracy
          }).catch(err => console.error("Failed to save progress:", err));
        } else {
          alert(response.error || "Lỗi chấm điểm giọng nói.");
        }
      };
    } catch (err) {
      console.error("Evaluation error:", err);
      setIsAnalyzing(false);
      alert("Không thể phân tích file âm thanh.");
    }
  };

  const handleCheckDictation = () => {
    const results = dictationWords.map((dw, idx) => {
      if (!dw.isBlank) return true;
      const ans = dictationAnswers[idx]?.trim().toLowerCase();
      return ans === dw.clean;
    });

    setDictationResults(results);
    setDictationChecked(true);

    const blanks = dictationWords.filter(w => w.isBlank);
    const correctCount = blanks.filter((_, bIdx) => {
      const origIdx = dictationWords.findIndex((w, i) => w.isBlank && dictationWords.filter((x, y) => x.isBlank && y < i).length === bIdx);
      return results[origIdx];
    }).length;

    const score = blanks.length > 0 ? Math.round((correctCount / blanks.length) * 100) : 100;

    setShowAICoach(true);
    setAiFeedback({
      overall: score,
      accuracy: score,
      fluency: 100,
      coachFeedback: score >= 80 
        ? "Quá xuất sắc! Em nghe chuẩn xác 100% và viết rất đúng chính tả." 
        : "Em nghe còn thiếu một vài từ cốt lõi, hãy bấm nghe lại và sửa nhé!",
      wordEvaluations: dictationWords.map((w, idx) => ({
        word: w.original,
        status: w.isBlank ? (results[idx] ? 'correct' : 'incorrect') : 'correct'
      }))
    });

    if (score >= PASSING_SCORE) {
      playTingSound();
      triggerParticles();
      setXpReward(prev => prev + 25);
    }
  };

  const handleNextScene = () => {
    if (currentIdx < activities.length - 1) {
      setShouldAutoPlay(true);
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setIsFinished(false);
    setXpReward(0);
    resetStateForNewScene();
  };

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-slate-500 text-sm italic font-medium">Bài học này chưa có câu thoại học tập.</p>
        <Link href="/learn" className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm">
          Quay lại học tập
        </Link>
      </div>
    );
  }

  // Calculate dynamic star count (1-3 stars)
  const getStars = (score: number) => {
    if (score >= 80) return 3;
    if (score >= 50) return 2;
    return 1;
  };

  const starsCount = aiFeedback ? getStars(aiFeedback.overall) : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between overflow-x-hidden selection:bg-blue-200 text-slate-800">
      
      {/* ─── HEADER BAR ──────────────────────────────────────────────────────── */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between z-10 shrink-0 shadow-sm">
        <Link 
          href="/dashboard"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Thoát
        </Link>

        {/* Dynamic Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => { setLearningMode("speaking"); resetStateForNewScene(); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              learningMode === "speaking" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mic size={12} /> Nói
          </button>
          <button 
            onClick={() => { setLearningMode("listening"); resetStateForNewScene(); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              learningMode === "listening" ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Volume2 size={12} /> Nghe
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Câu học</span>
            <span className="text-sm font-black text-slate-700">{currentIdx + 1} / {activities.length}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full text-orange-600 text-xs font-black">
            <Zap size={13} fill="currentColor" /> {xpReward} XP
          </div>
        </div>
      </header>

      {/* Progress timeline */}
      <div className="w-full bg-slate-200 h-1.5 overflow-hidden shrink-0">
        <div 
          className="h-full bg-blue-600 transition-all duration-500" 
          style={{ width: `${((currentIdx + 1) / activities.length) * 100}%` }}
        />
      </div>

      {/* ─── MAIN WORKSPACE (Split Screen Layout) ─────────────────────── */}
      {/* ─── MAIN WORKSPACE ────────────────────────────────────────── */}
      {!hasVideo ? (
        /* CENTERED STUDY CARD LAYOUT (QUIZLET/DUOLINGO STYLE) FOR NON-VIDEO LESSONS */
        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto mt-6">
          <div className="w-full flex flex-col items-center space-y-8">
            
            {/* A. THE STUDY CARD */}
            <AnimatePresence mode="wait">
              {showAICoach && aiFeedback ? (
                /* AI COACH REPORT CARD (Centered) */
                <motion.div
                  key="scorecard-report-centered"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#FFFDF9] border-2 border-dashed border-slate-300 p-8 rounded-3xl shadow-lg w-full relative overflow-hidden space-y-6 text-left"
                >
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-emerald-500" />
                  
                  {/* Star Rating Display */}
                  <div className="flex justify-center items-center gap-2 pt-2">
                    {[1, 2, 3].map((sIndex) => {
                      const isActive = sIndex <= starsCount;
                      return (
                        <Star 
                          key={sIndex} 
                          size={28} 
                          className={isActive ? "text-amber-400 fill-amber-400 filter drop-shadow-sm" : "text-slate-200 fill-slate-100"} 
                        />
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-display font-black text-slate-800 uppercase tracking-widest">PHIẾU ĐIỂM AI COACH</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Học chuẩn bám sát Global Success</p>
                  </div>

                  {/* Main Score Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center border-y border-dashed border-slate-200 py-4">
                    <div className="border-r border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phát âm</span>
                      <h4 className={`text-xl font-black mt-0.5 ${aiFeedback.accuracy >= PASSING_SCORE ? "text-emerald-600" : "text-red-500"}`}>
                        {aiFeedback.accuracy}%
                      </h4>
                    </div>
                    <div className="border-r border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lưu loát</span>
                      <h4 className="text-xl font-black mt-0.5 text-blue-600">
                        {aiFeedback.fluency}%
                      </h4>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Xếp loại</span>
                      <h4 className={`text-xs font-black mt-1.5 uppercase ${aiFeedback.overall >= PASSING_SCORE ? "text-emerald-600" : "text-red-500"}`}>
                        {aiFeedback.overall >= PASSING_SCORE ? "Đạt yêu cầu" : "Cần cố gắng"}
                      </h4>
                    </div>
                  </div>

                  {/* Commentary */}
                  <p className="text-xs text-slate-600 text-center leading-relaxed font-semibold italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                    "{aiFeedback.coachFeedback}"
                  </p>

                  {/* Word-by-word accuracy checklist */}
                  {learningMode === "speaking" && aiFeedback.wordEvaluations && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {aiFeedback.wordEvaluations.map((w: any, idx: number) => {
                        const isCorrect = w.status === 'correct';
                        return (
                          <span 
                            key={idx}
                            className={`px-3 py-1 rounded-xl text-[10px] font-black ${
                              isCorrect 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-red-50 text-red-600 border border-red-100 line-through'
                            }`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Gamification Action buttons */}
                  <div className="pt-2">
                    {aiFeedback.overall < PASSING_SCORE ? (
                      <div className="flex gap-2">
                        <button
                          onClick={resetStateForNewScene}
                          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw size={13} className="animate-spin-slow" /> Thử lại ngay
                        </button>
                        <button
                          disabled
                          className="py-3 px-4 bg-slate-100 text-slate-300 border border-slate-200 font-bold uppercase text-xs tracking-widest rounded-xl cursor-not-allowed flex items-center justify-center"
                        >
                          Khóa 🔒
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleNextScene}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                      >
                        {currentIdx < activities.length - 1 ? (
                          <>Câu tiếp theo <ChevronRight size={14} /></>
                        ) : (
                          <>Hoàn thành bài học <Check size={14} /></>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* STUDY CARD (Non-video format) */
                <motion.div
                  key="study-card-centered"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100 w-full relative overflow-hidden space-y-6"
                >
                  {/* Textbook Page Header */}
                  <div className="flex items-center justify-center gap-2 pb-4 border-b border-slate-100">
                    <BookOpen className="text-blue-600" size={16} />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {lesson.unit?.title || "Tiếng Anh - Global Success"}
                    </span>
                  </div>

                  {learningMode === "speaking" ? (
                    /* SPEAKING MODE INTERACTIVE CARD */
                    <div className="py-6 space-y-4">
                      <h2 className="text-4xl font-bold text-slate-800 leading-normal tracking-tight font-display">
                        {transcript}
                      </h2>
                      <p className="text-lg text-slate-500 italic mt-4 block">
                        {translation}
                      </p>
                      
                      <div className="pt-6">
                        <button
                          onClick={handlePlayScene}
                          className="mx-auto px-5 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                          <Volume2 size={14} /> Nghe phát âm mẫu
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* LISTENING DICTATION MODE INTERACTIVE CARD */
                    <div className="py-6 space-y-6">
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap gap-x-2.5 gap-y-3.5 items-center justify-center">
                        {dictationWords.map((dw, idx) => {
                          if (!dw.isBlank) {
                            return (
                              <span key={idx} className="text-xl font-bold text-slate-800">
                                {dw.original}
                              </span>
                            );
                          }

                          const isCorrect = dictationResults[idx] === true;
                          const isIncorrect = dictationResults[idx] === false;

                          return (
                            <input
                              key={idx}
                              type="text"
                              disabled={dictationChecked}
                              value={dictationAnswers[idx] || ""}
                              onChange={(e) => {
                                const newAns = [...dictationAnswers];
                                newAns[idx] = e.target.value;
                                setDictationAnswers(newAns);
                              }}
                              placeholder="..."
                              className={`w-28 text-center border-b-2 font-black py-1 text-base focus:outline-none transition-all ${
                                isCorrect ? "border-emerald-500 text-emerald-600 bg-emerald-50 rounded" :
                                isIncorrect ? "border-red-500 text-red-600 bg-red-50 rounded" :
                                "border-blue-400 text-blue-600 focus:border-blue-600 bg-blue-50/30"
                              }`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handlePlayScene}
                          className="px-5 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                          <Volume2 size={14} /> Nghe Audio mẫu
                        </button>
                        
                        {!dictationChecked ? (
                          <button 
                            onClick={handleCheckDictation}
                            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
                          >
                            Kiểm tra kết quả
                          </button>
                        ) : (
                          <button 
                            onClick={resetStateForNewScene}
                            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                          >
                            Làm lại câu này
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* B. RECORDER CONTROL HUB (Tách biệt hẳn xuống bên dưới Card) */}
            {learningMode === "speaking" && !showAICoach && (
              <div className="w-full flex flex-col items-center justify-center space-y-4 mt-6">
                <div className="relative flex flex-col items-center">
                  
                  {isAnalyzing && (
                    <div className="absolute -top-16 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-md flex items-center gap-2 text-xs font-black text-blue-600">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                      />
                      AI đang chấm điểm...
                    </div>
                  )}

                  {!audioUrl ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                          isRecording 
                            ? "bg-red-500 text-white shadow-red-500/20 animate-pulse" 
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                        }`}
                      >
                        {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={32} />}
                      </motion.button>
                      
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-10 px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm animate-pulse"
                          >
                            ĐANG THU
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="flex items-center gap-5 justify-center">
                      {/* Retry Button */}
                      <button
                        onClick={resetRecorder}
                        className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                        title="Nói lại"
                      >
                        <RefreshCw size={18} />
                      </button>
                      
                      {/* Listen Playback Button */}
                      <button
                        onClick={() => audioUrl && new Audio(audioUrl).play()}
                        className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"
                        title="Nghe lại bài nói"
                      >
                        <Play size={26} fill="currentColor" className="ml-1" />
                      </button>

                      {/* Confirm and Proceed Button */}
                      <button
                        onClick={handleNextScene}
                        disabled={currentIdx === activities.length - 1}
                        className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Lưu & Sang câu tiếp"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {micError && (
                  <div className="text-red-600 text-xs font-bold px-4 py-2 bg-red-50 rounded-xl border border-red-100 max-w-sm text-center">
                    {micError}
                  </div>
                )}

                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-2 text-center">
                  {isRecording ? "Bấm nút vuông đỏ để dừng & chấm điểm" : audioUrl ? "Lắng nghe hoặc thử lại câu thoại" : "Chạm Micro để bắt đầu phát âm"}
                </p>
              </div>
            )}
            
          </div>
        </main>
      ) : (
        /* ORIGINAL MOVIE/VIDEO SPLIT SCREEN LAYOUT IF VIDEO EXISTS */
        <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 p-6 max-w-7xl mx-auto w-full items-stretch">
          
          {/* LEFT COLUMN: AUDIO / TEXTBOOK ILLUSTRATION */}
          <div className="lg:col-span-6 flex flex-col space-y-6 justify-between">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full space-y-4">
              
              {/* Textbook Page Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={18} />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    {hasVideo ? "Cinematic Learning" : (lesson.unit?.title || "Tiếng Anh - Global Success")}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-wider">
                  {hasVideo ? "Phim Điện Ảnh" : "Hội Thoại SGK"}
                </span>
              </div>

              {/* Illustration / Player Frame */}
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center group">
                {hasVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      src={lesson.video_url || lesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                      onTimeUpdate={handleTimeUpdate}
                      playsInline
                      className="w-full h-full object-cover z-10"
                    />
                    <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-black/60 text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-lg">
                      <ImageIcon size={10} /> Phim Minh Họa
                    </div>
                  </>
                ) : (
                  <>
                    {activeActivity?.content?.thumbnailUrl ? (
                      <img
                        src={activeActivity.content.thumbnailUrl}
                        alt="Textbook Illustration"
                        className="w-full h-full object-cover z-10 transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 z-10 select-none">
                        <div className="w-16 h-16 rounded-full bg-blue-50/80 flex items-center justify-center text-blue-500 border border-blue-100 shadow-inner">
                          <BookOpen className="w-8 h-8 animate-bounce-slow" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-blue-600 block tracking-widest">Global Success Curriculum</span>
                          <p className="text-sm font-black text-slate-700 max-w-sm mt-1">{lesson.title}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-blue-600 text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-lg">
                      <BookOpen size={10} /> Hình Minh Họa SGK
                    </div>
                  </>
                )}
              </div>

              {/* Textbook Audio Visualizer & Player console */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isVideoPlaying ? (
                    <button 
                      onClick={handlePauseScene} 
                      className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
                  >
                    <Pause size={16} fill="white" />
                  </button>
                ) : (
                  <button 
                    onClick={handlePlayScene} 
                    className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-blue-500/10"
                  >
                    <Play size={16} fill="white" className="ml-0.5" />
                  </button>
                )}
              </div>

                <div>
                  <span className="text-[9px] font-black uppercase text-blue-600 block tracking-widest">Hội thoại Audio</span>
                  {hasVideo ? (
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Phân cảnh: {startSceneTime.toFixed(1)}s - {endSceneTime.toFixed(1)}s
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">
                      Giọng Đọc Bản Xứ Chuẩn
                    </span>
                  )}
                </div>
              </div>

              {/* Speed Controller */}
              {hasVideo && (
                <div className="flex items-center gap-1">
                  {[0.8, 1.0, 1.2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all border ${
                        playbackSpeed === speed
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Helper tips */}
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
              <Headphones size={13} className="text-blue-500 shrink-0" />
              <span>Bấm phát Audio để nghe phát âm mẫu chuẩn, sau đó tiến hành tập luyện bên phải.</span>
            </div>
          </div>

        {/* RIGHT COLUMN: TEXT CONTEXT & SCORECARD */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* A. TEXT CARD (Transcript / Dictation blanks) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex-1 flex flex-col justify-center">
            
            {/* Header info */}
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="uppercase tracking-wider">Nội dung học tập</span>
              <span>{learningMode === "speaking" ? "Luyện phát âm" : "Luyện nghe viết"}</span>
            </div>

            {learningMode === "speaking" ? (
              /* SPEAKING TRANSCRIPT IN TEXTBOOK FORMAT */
              <div className="space-y-4">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center relative overflow-hidden">
                  <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                  <h3 className="text-xl md:text-2xl font-display font-black leading-tight text-slate-800">
                    "{transcript}"
                  </h3>
                </div>
                <p className="text-sm text-slate-400 italic text-center font-medium">
                  Bản dịch: {translation}
                </p>
              </div>
            ) : (
              /* DICTATION - BLANK BOXES IN TEXT */
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap gap-x-2 gap-y-3 items-center justify-center">
                  {dictationWords.map((dw, idx) => {
                    if (!dw.isBlank) {
                      return (
                        <span key={idx} className="text-base md:text-lg font-bold text-slate-800">
                          {dw.original}
                        </span>
                      );
                    }

                    // Render input blank box
                    const isCorrect = dictationResults[idx] === true;
                    const isIncorrect = dictationResults[idx] === false;

                    return (
                      <input
                        key={idx}
                        type="text"
                        disabled={dictationChecked}
                        value={dictationAnswers[idx] || ""}
                        onChange={(e) => {
                          const newAns = [...dictationAnswers];
                          newAns[idx] = e.target.value;
                          setDictationAnswers(newAns);
                        }}
                        placeholder="..."
                        className={`w-24 text-center border-b-2 font-black py-1 text-sm focus:outline-none transition-all ${
                          isCorrect ? "border-emerald-500 text-emerald-600 bg-emerald-50 rounded" :
                          isIncorrect ? "border-red-500 text-red-600 bg-red-50 rounded" :
                          "border-blue-400 text-blue-600 focus:border-blue-600 bg-blue-50/30"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  {!dictationChecked ? (
                    <button 
                      onClick={handleCheckDictation}
                      className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
                    >
                      Kiểm tra kết quả
                    </button>
                  ) : (
                    <button 
                      onClick={resetStateForNewScene}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                    >
                      Làm lại câu này
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* B. DYNAMIC PRACTICE OR REPORT CARD PORTAL */}
          <div className="relative">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30 rounded-3xl border border-slate-200">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
                />
                <span className="text-xs font-black tracking-widest uppercase text-blue-600">Đang chấm điểm phát âm...</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {showAICoach && aiFeedback ? (
                /* PHIẾU ĐIỂM REPORT CARD */
                <motion.div
                  key="scorecard-report"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#FFFDF9] border-2 border-dashed border-slate-300 p-6 rounded-3xl shadow-md flex flex-col space-y-5 relative overflow-hidden"
                >
                  {/* Decorative card stripes */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-emerald-500" />
                  
                  {/* Star Rating Display */}
                  <div className="flex justify-center items-center gap-2 pt-2">
                    {[1, 2, 3].map((sIndex) => {
                      const isActive = sIndex <= starsCount;
                      return (
                        <Star 
                          key={sIndex} 
                          size={28} 
                          className={isActive ? "text-amber-400 fill-amber-400 filter drop-shadow-sm" : "text-slate-200 fill-slate-100"} 
                        />
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-display font-black text-slate-800 uppercase tracking-widest">PHIẾU ĐIỂM AI COACH</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Học chuẩn bám sát Global Success</p>
                  </div>

                  {/* Main Score Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center border-y border-dashed border-slate-200 py-4">
                    <div className="border-r border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phát âm</span>
                      <h4 className={`text-xl font-black mt-0.5 ${aiFeedback.accuracy >= PASSING_SCORE ? "text-emerald-600" : "text-red-500"}`}>
                        {aiFeedback.accuracy}%
                      </h4>
                    </div>
                    <div className="border-r border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lưu loát</span>
                      <h4 className="text-xl font-black mt-0.5 text-blue-600">
                        {aiFeedback.fluency}%
                      </h4>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Xếp loại</span>
                      <h4 className={`text-xs font-black mt-1.5 uppercase ${aiFeedback.overall >= PASSING_SCORE ? "text-emerald-600" : "text-red-500"}`}>
                        {aiFeedback.overall >= PASSING_SCORE ? "Đạt yêu cầu" : "Cần cố gắng"}
                      </h4>
                    </div>
                  </div>

                  {/* Commentary */}
                  <p className="text-xs text-slate-600 text-center leading-relaxed font-semibold italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{aiFeedback.coachFeedback}"
                  </p>

                  {/* Word-by-word accuracy checklist */}
                  {learningMode === "speaking" && aiFeedback.wordEvaluations && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {aiFeedback.wordEvaluations.map((w: any, idx: number) => {
                        const isCorrect = w.status === 'correct';
                        return (
                          <span 
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              isCorrect 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-red-50 text-red-600 border border-red-100 line-through'
                            }`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Gamification Action buttons */}
                  <div className="pt-2">
                    {aiFeedback.overall < PASSING_SCORE ? (
                      <div className="flex gap-2">
                        <button
                          onClick={resetStateForNewScene}
                          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw size={13} className="animate-spin-slow" /> Thử lại ngay
                        </button>
                        <button
                          disabled
                          className="py-3 px-4 bg-slate-100 text-slate-300 border border-slate-200 font-bold uppercase text-xs tracking-widest rounded-xl cursor-not-allowed flex items-center justify-center"
                        >
                          Khóa 🔒
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleNextScene}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                      >
                        {currentIdx < activities.length - 1 ? (
                          <>Câu tiếp theo <ChevronRight size={14} /></>
                        ) : (
                          <>Hoàn thành bài học <Check size={14} /></>
                        )}
                      </button>
                    )}
                  </div>

                </motion.div>
              ) : (
                /* IN-PRACTICE INTERACTIVE CARD */
                <motion.div
                  key="scorecard-empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4"
                >
                  {learningMode === "speaking" ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-500 animate-pulse">
                        <Mic size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Học sinh bấm Micro thu âm</h4>
                        <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">
                          Nghe Audio bên trái, sau đó bấm nút Micro để luyện nói theo giọng đọc bản xứ.
                        </p>
                      </div>

                      {/* Mic recorder widget */}
                      <div className="pt-2 flex flex-col items-center gap-2">
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                            isRecording 
                              ? 'bg-red-500 text-white shadow-md animate-pulse' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                          }`}
                        >
                          {isRecording ? <Square size={16} fill="white" /> : <Mic size={20} />}
                        </button>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {isRecording ? "ĐANG THU ÂM (BẤM DỪNG)" : "BẤM ĐỂ NÓI"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-orange-500 animate-pulse">
                        <Headphones size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Điền từ vào chỗ trống</h4>
                        <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">
                          Nghe thật kỹ đoạn hội thoại bên trái, sau đó gõ đúng các từ còn thiếu trong ô trống ở phía trên.
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>
      )}

      {/* ─── SUCCESS ARENA PANEL ────────────────────────────────────────── */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-orange-500/5 to-transparent pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm animate-pulse">
              <Award size={40} />
            </div>

            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">Tuyệt vời!</span>
              <h3 className="text-2xl font-display font-black text-slate-800">Hoàn Thành Hoạt Động Bài Học</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
                Em đã hoàn thành rất tốt tất cả các câu thoại của bài học "{lesson.title}". Cố gắng rèn luyện mỗi ngày nhé!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-xs w-full py-5 border-y border-dashed border-slate-200 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Điểm thưởng</span>
                <h4 className="text-2xl font-display font-black text-orange-500 mt-1">+{xpReward} XP</h4>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Xếp hạng</span>
                <h4 className="text-2xl font-display font-black text-blue-600 mt-1">CHĂM CHỈ</h4>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
              <button 
                onClick={handleRestart}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} /> Luyện tập lại
              </button>
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-blue-500/10"
              >
                Về Trang Chủ Bảng Điều Khiển
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Arena */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed rounded-full pointer-events-none"
            style={{
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 8px ${p.color}`,
              zIndex: 100,
            }}
          />
        ))}
      </AnimatePresence>

    </div>
  );
}
