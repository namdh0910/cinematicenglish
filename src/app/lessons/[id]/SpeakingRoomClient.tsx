"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Mic, 
  Square, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  Volume2, 
  Star, 
  Award,
  Trophy,
  VolumeX
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { evaluateSpeaking } from "@/app/actions/speaking";

interface DialogLine {
  speaker: string;
  text: string;
}

interface WordEvaluation {
  word: string;
  status: "correct" | "imperfect" | "missing" | "filler";
  accuracy: number;
}

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

interface SpeakingRoomClientProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    units: {
      id: string;
      title: string;
      unit_no: string;
      grades: {
        id: string;
        title: string;
      };
    };
  };
}

export default function SpeakingRoomClient({ lesson }: SpeakingRoomClientProps) {
  // Parse dialogue data from database content
  const dialogs: DialogLine[] = Array.isArray(lesson.content)
    ? lesson.content
    : (typeof lesson.content === "string"
        ? JSON.parse(lesson.content)
        : (lesson.content?.dialogs || lesson.content?.sentences || []));

  const [activeTurn, setActiveTurn] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Recording and analysis states
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>(Array(30).fill(10));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  // Active evaluation results for current turn
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [currentWordEvaluations, setCurrentWordEvaluations] = useState<WordEvaluation[] | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);

  // Overall session scores history tracker
  const [dialogueScores, setDialogueScores] = useState<Array<{
    score: number;
    completed: boolean;
    wordEvaluations: WordEvaluation[];
    feedback: string;
  } | null>>(() => Array(dialogs.length).fill(null));

  // TTS Voice Model reading State
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Web Audio Refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const animationFrame = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check login session & initialize scores history array
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

  useEffect(() => {
    const drawMicWaveform = () => {
      if (!analyserRef.current || !isRecording) {
        setWaveform(Array(30).fill(10));
        return;
      }

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const newWaveform: number[] = [];
      for (let i = 0; i < 30; i++) {
        const raw = dataArray[i] || 0;
        // Normalizing mic frequency amplitude into clean 10% - 90% heights
        const height = Math.max(10, Math.round((raw / 255) * 80) + 10);
        newWaveform.push(height);
      }

      setWaveform(newWaveform);
      animationFrame.current = requestAnimationFrame(drawMicWaveform);
    };

    if (isRecording) {
      animationFrame.current = requestAnimationFrame(drawMicWaveform);
    } else {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      // Defer updating state to avoid react-hooks/set-state-in-effect
      const timer = setTimeout(() => {
        setWaveform(Array(30).fill(10));
      }, 0);
      return () => clearTimeout(timer);
    }
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isRecording]);

  // Start recording voice input
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext; // eslint-disable-line @typescript-eslint/no-explicit-any
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioUrl(URL.createObjectURL(blob));
        analyzeSpeech(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setMicError(null);
      setCurrentFeedback(null);
      setCurrentScore(null);
      setCurrentWordEvaluations(null);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicError("Vui lòng cấp quyền truy cập Micro trên trình duyệt để luyện nói nhé!");
    }
  };

  // Stop recording voice input
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    }
  };

  // Run AI Speech evaluation using Groq/OpenAI Whisper
  const analyzeSpeech = async (blob: Blob) => {
    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      try {
        const base64Audio = (reader.result as string).split(",")[1];
        const durationSeconds = audioChunks.current.length * 0.5 || 3;
        const currentSentence = dialogs[activeTurn]?.text || "";

        const result = await evaluateSpeaking({
          userId: userProfile?.id || "guest",
          audioBase64: base64Audio,
          targetSentence: currentSentence,
          durationSeconds: durationSeconds,
          lessonId: lesson.id,
        });

        if (result.success) {
          setCurrentScore(result.accuracy);
          setCurrentFeedback(result.coachFeedback);
          setCurrentWordEvaluations(result.wordEvaluations);

          // Save evaluated score into the dialogue history
          setDialogueScores((prev) => {
            const updated = [...prev];
            updated[activeTurn] = {
              score: result.accuracy,
              completed: result.accuracy >= 60,
              wordEvaluations: result.wordEvaluations,
              feedback: result.coachFeedback,
            };
            return updated;
          });
        } else {
          setCurrentFeedback(result.coachFeedback || "Không phân tích được phát âm. Thử nói lại nhé!");
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        setCurrentFeedback("Lỗi kết nối hệ thống chấm điểm AI. Vui lòng nói lại.");
      } finally {
        setIsAnalyzing(false);
      }
    };
  };

  // Play Native English Voice TTS model
  const speakSentence = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsPlayingTTS(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // Slower for clear comprehension

      utterance.onend = () => {
        setIsPlayingTTS(false);
      };

      utterance.onerror = () => {
        setIsPlayingTTS(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Move to next turn trigger
  const handleNextTurn = () => {
    if (activeTurn < dialogs.length - 1) {
      setActiveTurn((prev) => prev + 1);
      // Reset active turn states
      setAudioUrl(null);
      setCurrentScore(null);
      setCurrentFeedback(null);
      setCurrentWordEvaluations(null);
    }
  };

  // Reset active turn to try again
  const handleResetTurn = () => {
    setAudioUrl(null);
    setCurrentScore(null);
    setCurrentFeedback(null);
    setCurrentWordEvaluations(null);
  };

  // Calculate overall learning progression percentage
  const completedCount = dialogueScores.filter((s) => s !== null && s.completed).length;
  const progressPercent = dialogs.length > 0 ? Math.round((completedCount / dialogs.length) * 100) : 0;

  // Cleanup Web Audio handles
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-slate-800 pb-16 font-sans">
      {/* 1. ROOM HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{lesson.units?.grades?.title || "Khối lớp"}</span>
                <span>•</span>
                <span>{lesson.units?.unit_no || "Unit"}</span>
              </div>
              <h1 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                {lesson.title}
              </h1>
            </div>
          </div>

          {/* Progression Indicator Card */}
          <div className="flex items-center gap-4 shrink-0 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiến trình hội thoại</p>
              <p className="text-xs font-black text-slate-700">{completedCount} / {dialogs.length} hoàn thành</p>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                <circle 
                  cx="24" 
                  cy="24" 
                  r="20" 
                  fill="transparent" 
                  stroke="#3b82f6" 
                  strokeWidth="4" 
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-blue-600">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 2. LEFT COLUMN: VISUAL CONVERSATION DIALOGUE SCRIPT (Zalo/Messenger Chat Style) */}
          <section className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Kịch Bản Hội Thoại (Bấm để chọn vai)</h2>
              <span className="text-[10px] text-blue-500 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">SGK Global Success</span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm min-h-[350px] lg:min-h-[500px] flex flex-col gap-6 overflow-y-auto">
              {dialogs.map((dialog, index) => {
                const isActive = activeTurn === index;
                const isPhong = dialog.speaker?.toLowerCase().includes("phong");
                const hasScore = dialogueScores[index] !== null;
                const scoreData = dialogueScores[index];

                return (
                  <motion.div
                    key={index}
                    onClick={() => {
                      setActiveTurn(index);
                      handleResetTurn();
                    }}
                    whileHover={{ scale: 1.01 }}
                    className={`flex gap-3 cursor-pointer items-start transition-all p-3 rounded-2xl ${
                      isActive 
                        ? "bg-slate-50/80 ring-2 ring-blue-500/25 border-slate-200 shadow-sm" 
                        : "hover:bg-slate-50/40 border border-transparent"
                    } ${isPhong ? "flex-row" : "flex-row-reverse text-right"}`}
                  >
                    {/* Chat Bubble Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${
                      isPhong 
                        ? "bg-blue-600 text-white" 
                        : "bg-orange-500 text-white"
                    }`}>
                      {dialog.speaker[0].toUpperCase()}
                    </div>

                    {/* Chat Bubble Details */}
                    <div className={`flex flex-col max-w-[75%] gap-1 ${isPhong ? "items-start" : "items-end"}`}>
                      {/* Speaker Name */}
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        isPhong ? "text-blue-600" : "text-orange-600"
                      }`}>
                        {dialog.speaker}
                      </span>

                      {/* Bubble Text */}
                      <div className={`px-4.5 py-3 rounded-3xl text-sm leading-relaxed border ${
                        isActive
                          ? (isPhong 
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-orange-500 text-white border-orange-500 shadow-md")
                          : (isPhong 
                              ? "bg-blue-50/60 text-slate-800 border-blue-100/80" 
                              : "bg-orange-50/60 text-slate-800 border-orange-100/80")
                      }`}>
                        <p className="font-bold">{dialog.text}</p>
                      </div>

                      {/* Turn Status Indicators */}
                      <div className="flex items-center gap-1.5 mt-1">
                        {hasScore && scoreData && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            scoreData.score >= 80 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            <Star size={8} fill="currentColor" /> {scoreData.score}%
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider animate-pulse flex items-center gap-1">
                            <Mic size={10} /> Đang tập nói...
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* 3. RIGHT COLUMN: ACTION & EVALUATION HUB (VoiceRecorder & Light Mode Score Card) */}
          <section className="lg:col-span-6 space-y-6">
            
            {/* ACTIVE ACTION CARD */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-md space-y-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-orange-500" />
              
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Câu thoại cần phát âm</span>
                <div className="flex justify-center items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    dialogs[activeTurn]?.speaker?.toLowerCase().includes("phong")
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-orange-50 text-orange-600 border border-orange-100"
                  }`}>
                    {dialogs[activeTurn]?.speaker}
                  </span>
                </div>
              </div>

              {/* Huge target sentence text display */}
              <div className="py-4 space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight font-display">
                  &ldquo;{dialogs[activeTurn]?.text}&rdquo;
                </h3>
                
                {/* Premium Speech Synthesis TTS Button */}
                <button
                  onClick={() => speakSentence(dialogs[activeTurn]?.text)}
                  disabled={isPlayingTTS}
                  className={`mx-auto px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest border transition-all ${
                    isPlayingTTS 
                      ? "bg-slate-100 border-slate-200 text-slate-400" 
                      : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {isPlayingTTS ? (
                    <>
                      <VolumeX size={14} className="animate-bounce" /> Lắng nghe...
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} /> Nghe phát âm mẫu (AI)
                    </>
                  )}
                </button>
              </div>

              {/* 4. DYNAMIC MICROPHONE WAVEFORM RECORDER */}
              <div className="space-y-6">
                {/* Light Mode Web Audio visualizer */}
                <div className="h-28 flex items-end justify-center gap-1 px-4 pb-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-200/50" />
                  
                  {waveform.map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: h + "%" }}
                      className="w-1.5 rounded-full transition-all duration-75"
                      style={{
                        background: isRecording
                          ? "linear-gradient(to top, #3b82f6, #60a5fa)"
                          : "rgba(148, 163, 184, 0.2)",
                        minHeight: "6px"
                      }}
                    />
                  ))}

                  {isAnalyzing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20"
                    >
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full shadow-sm"
                      />
                      <span className="text-[10px] font-black tracking-widest uppercase text-blue-600">AI đang phân tích giọng đọc...</span>
                    </motion.div>
                  )}
                </div>

                {/* Recorder Control Buttons */}
                <div className="flex flex-col items-center gap-4">
                  {!audioUrl ? (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                          isRecording 
                            ? "bg-red-500 text-white shadow-red-500/20" 
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                        }`}
                      >
                        {isRecording ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
                      </motion.button>
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm animate-pulse"
                          >
                            ĐANG THU
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center gap-5 justify-center">
                      {/* Retry Button */}
                      <button
                        onClick={handleResetTurn}
                        className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                        title="Nói lại"
                      >
                        <RefreshCw size={18} />
                      </button>
                      
                      {/* Listen Playback Button */}
                      <button
                        onClick={() => audioUrl && new Audio(audioUrl).play()}
                        className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"
                        title="Nghe lại bài nói của bạn"
                      >
                        <Play size={26} fill="currentColor" className="ml-1" />
                      </button>

                      {/* Confirm and Proceed Button */}
                      <button
                        onClick={handleNextTurn}
                        disabled={activeTurn === dialogs.length - 1}
                        className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Lưu & Sang câu tiếp"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  )}

                  {micError && (
                    <div className="text-red-600 text-xs font-bold px-4 py-2 bg-red-50 rounded-xl border border-red-100 max-w-sm">
                      {micError}
                    </div>
                  )}

                  <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                    {isRecording ? "Chạm biểu tượng vuông để dừng & chấm điểm" : audioUrl ? "Lắng nghe hoặc thử lại câu thoại" : "Chạm biểu tượng Micro để bắt đầu nói"}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. THẺ KẾT QUẢ: PURE WHITE ACCURACY & FEEDBACK CARD */}
            <AnimatePresence>
              {!isRecording && currentFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg space-y-6 text-left relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                        <Award size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Đánh giá AI Coach</div>
                        <h4 className="text-sm font-bold text-slate-800">Kết quả luyện nói của em</h4>
                      </div>
                    </div>

                    {currentScore !== null && (
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl self-center md:self-auto">
                        <div className="text-right">
                          <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Độ chuẩn xác</p>
                          <p className="text-xs font-bold text-slate-600">
                            {currentScore >= 80 ? "Xuất sắc" : currentScore >= 60 ? "Khá tốt" : "Cần rèn luyện thêm"}
                          </p>
                        </div>
                        <span className={`text-3xl font-black font-display ${
                          currentScore >= 80 ? "text-emerald-600" :
                          currentScore >= 60 ? "text-amber-600" :
                          "text-rose-600"
                        }`}>
                          {currentScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Word-by-word visual highlight list on White Background */}
                  {currentWordEvaluations && currentWordEvaluations.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Chi tiết phát âm từng từ:</div>
                      <div className="flex flex-wrap gap-2 text-sm font-bold">
                        {currentWordEvaluations.map((w, idx) => (
                          <span 
                            key={idx}
                            className={`px-3 py-1 rounded-xl border transition-all ${
                              w.status === "correct" 
                                ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                                : w.status === "imperfect" 
                                ? "text-amber-700 bg-amber-50 border-amber-100" 
                                : "text-rose-700 bg-rose-50 border-rose-100 line-through decoration-rose-300"
                            }`}
                          >
                            {w.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Encouraging coach message */}
                  <div className="flex gap-4 items-start bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-sm shrink-0">
                      👩‍🏫
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider mb-0.5">Lời khuyên của Cô:</p>
                      <p className="text-xs text-slate-600 font-bold leading-relaxed">
                        {currentFeedback}
                      </p>
                    </div>
                  </div>

                  {/* Flow Action Trigger Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    {activeTurn < dialogs.length - 1 ? (
                      <button
                        onClick={handleNextTurn}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
                      >
                        Nói câu tiếp theo →
                      </button>
                    ) : (
                      <Link href="/dashboard" className="w-full">
                        <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center justify-center gap-2">
                          <Trophy size={14} fill="currentColor" /> Hoàn thành bài học!
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </div>
    </div>
  );
}
