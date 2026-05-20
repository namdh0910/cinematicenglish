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
  VolumeX,
  X,
  AlertCircle
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
              completed: result.accuracy >= 80,
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

  // Word-by-word highlight inside bubble (ELSA style)
  const renderWords = () => {
    const currentSentence = dialogs[activeTurn]?.text || "";
    
    if (currentWordEvaluations && currentWordEvaluations.length > 0) {
      return (
        <div className="flex flex-wrap gap-x-2 gap-y-1 font-extrabold text-3xl md:text-4xl text-slate-800 leading-normal tracking-tight font-display select-text">
          {currentWordEvaluations.map((w, idx) => {
            let colorClass = "text-slate-800";
            if (w.status === "correct") {
              colorClass = "text-emerald-500 hover:text-emerald-600";
            } else if (w.status === "imperfect") {
              colorClass = "text-amber-500 hover:text-amber-600";
            } else if (w.status === "missing") {
              colorClass = "text-rose-500 line-through decoration-rose-300 hover:text-rose-600";
            }

            return (
              <span 
                key={idx}
                className={`${colorClass} cursor-pointer transition-colors px-0.5 rounded hover:bg-slate-50`}
                onClick={() => speakSentence(w.word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,""))}
                title={`Độ chính xác: ${w.accuracy}% (Bấm để nghe từ này)`}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      );
    }

    return (
      <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-normal tracking-tight font-display select-text">
        {currentSentence}
      </h3>
    );
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-slate-800 flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans">
      {/* 1. ROOM HEADER - FOCUS MODE */}
      <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-6 shrink-0 z-40">
        {/* Exit button */}
        <Link 
          href="/learn"
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100/80"
          title="Thoát"
        >
          <X size={28} className="stroke-[2.5]" />
        </Link>

        {/* Duolingo progress bar */}
        <div className="flex-1 h-4 bg-slate-200/60 rounded-full overflow-hidden border border-slate-300/30 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] relative"
          >
            {/* Shiny overlay for realistic 3D feel */}
            <div className="absolute top-0.5 inset-x-1 h-1 bg-white/20 rounded-full" />
          </motion.div>
        </div>

        {/* Completion Stats / Hearts or Streaks (e.g. Flame emoji) */}
        <div className="flex items-center gap-1.5 font-extrabold text-amber-500 text-base md:text-lg select-none">
          <span>🔥</span>
          <span>{completedCount}</span>
        </div>
      </header>

      {/* 2. CENTERED CONTENT */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-6 flex flex-col items-center justify-center gap-8 md:gap-10">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-10">
          
          {/* Mascot Teacher: Cute breathing/floating robot/teacher container */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-blue-100 to-indigo-50 border-2 border-blue-200 rounded-3xl flex items-center justify-center shadow-lg shrink-0 select-none"
          >
            <span className="text-5xl md:text-6xl">🤖</span>
            {/* Little status light */}
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-5 h-5 rounded-full shadow-sm animate-pulse" />
          </motion.div>

          {/* Chat Bubble: Contains the giant English target text and speaker icon */}
          <div className="relative bg-white border-2 border-slate-200/80 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-xl flex-1 flex flex-col gap-6
            before:content-[''] before:absolute before:left-1/2 before:-top-3 before:-translate-x-1/2 before:w-6 before:h-6 before:bg-white before:border-l-2 before:border-t-2 before:border-slate-200/80 before:rotate-45 before:rounded-tl-md
            md:before:left-auto md:before:-left-3 md:before:top-12 md:before:-translate-x-0 md:before:border-t-0 md:before:border-l-2 md:before:border-b-2 md:before:rotate-45 md:before:rounded-bl-md"
          >
            {/* Speaker/Speaker Role Tag */}
            <div className="flex items-center justify-between gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                dialogs[activeTurn]?.speaker?.toLowerCase().includes("phong")
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-orange-50 text-orange-600 border border-orange-100"
              }`}>
                {dialogs[activeTurn]?.speaker}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Câu {activeTurn + 1} / {dialogs.length}
              </span>
            </div>

            {/* Giant target sentence text display */}
            <div className="flex gap-4 items-start justify-between">
              <div className="flex-1 text-left">
                {renderWords()}
              </div>
              
              {/* Compact Speaker Icon */}
              <button
                onClick={() => speakSentence(dialogs[activeTurn]?.text)}
                disabled={isPlayingTTS}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                  isPlayingTTS 
                    ? "bg-slate-100 border-slate-200 text-slate-400" 
                    : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 shadow-sm"
                }`}
                title="Nghe phát âm mẫu"
              >
                {isPlayingTTS ? (
                  <VolumeX size={20} className="animate-pulse" />
                ) : (
                  <Volume2 size={20} className="stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* Encouraging coach advice if any */}
            {currentFeedback && currentScore !== null && (
              <div className="flex gap-3 items-start bg-slate-50 border border-slate-100 p-4 rounded-2xl mt-2">
                <div className="text-xl select-none">👩‍🏫</div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider mb-0.5">Lời khuyên của Cô:</p>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    {currentFeedback}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 3. DYNAMIC STICKY BOTTOM ACTION BAR */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-t pb-8 pt-6 px-6 ${
        currentScore === null 
          ? "bg-white border-slate-200/80 shadow-[0_-8px_30px_rgb(0,0,0,0.03)]" 
          : currentScore >= 80 
            ? "bg-[#d7f5db] border-t-2 border-[#b8ebd0]" 
            : "bg-[#ffdfe0] border-t-2 border-[#ffc4c6]"
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          
          <AnimatePresence mode="wait">
            {currentScore === null ? (
              /* State 1: Default / Recording State */
              <motion.div
                key="default-mic"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex flex-col items-center gap-4 py-2"
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-sm" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
                      AI đang phân tích giọng đọc...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {/* Giant 3D microphone button */}
                    <div className="relative">
                      {/* Recording expanding waves */}
                      {isRecording && (
                        <>
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.6 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-red-400 rounded-full z-0"
                          />
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeOut" }}
                            className="absolute inset-0 bg-red-300 rounded-full z-0"
                          />
                        </>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 z-10 relative cursor-pointer text-white ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600 shadow-[0_6px_0_#b91c1c] active:translate-y-[6px] active:shadow-none"
                            : "bg-blue-500 hover:bg-blue-600 shadow-[0_6px_0_#1d4ed8] active:translate-y-[6px] active:shadow-none"
                        }`}
                        title={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                      >
                        {isRecording ? (
                          <Square size={28} fill="currentColor" />
                        ) : (
                          <Mic size={32} className="stroke-[2.5]" />
                        )}
                      </motion.button>
                    </div>

                    {/* Microphone input visualizer */}
                    {isRecording && (
                      <div className="flex items-center justify-center gap-1 h-6">
                        {waveform.slice(0, 15).map((h, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: `${h * 0.25}px` }}
                            className="w-1 bg-red-400 rounded-full"
                            style={{ minHeight: "4px" }}
                          />
                        ))}
                      </div>
                    )}

                    {micError ? (
                      <span className="text-red-500 text-xs font-bold px-4 py-1.5 bg-red-50 rounded-xl border border-red-100 max-w-sm mt-1 animate-pulse">
                        ⚠️ {micError}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {isRecording ? "Đang thu âm... Chạm nút đỏ để chấm điểm" : "Chạm biểu tượng Micro để bắt đầu nói"}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ) : currentScore >= 80 ? (
              /* State 2: Success Graded State (>80%) */
              <motion.div
                key="success-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1"
              >
                {/* Left message */}
                <div className="flex items-center gap-4 text-[#155724] select-none text-center sm:text-left">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_4px_0_#0f766e] shrink-0">
                    <CheckCircle2 size={28} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-tight">Tuyệt vời! ({currentScore}%)</h4>
                    <p className="text-sm font-semibold opacity-95">
                      Bạn đã hoàn thành xuất sắc câu thoại này.
                    </p>
                  </div>
                </div>

                {/* Right button */}
                <button
                  onClick={handleNextTurn}
                  className="w-full sm:w-auto px-10 py-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_5px_0_#3fa001] active:translate-y-[5px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {activeTurn < dialogs.length - 1 ? (
                    "Tiếp tục"
                  ) : (
                    <>
                      <Trophy size={16} fill="currentColor" /> Hoàn thành bài học! 🎉
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              /* State 3: Failure Graded State (<80%) */
              <motion.div
                key="fail-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1"
              >
                {/* Left message */}
                <div className="flex items-center gap-4 text-[#721c24] select-none text-center sm:text-left">
                  <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-[0_4px_0_#9f1239] shrink-0">
                    <AlertCircle size={28} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-tight">Thử lại một chút nhé ({currentScore}%)</h4>
                    <p className="text-sm font-semibold opacity-95">
                      Cần đạt trên 80% để hoàn thành. Hãy sửa các từ màu đỏ.
                    </p>
                  </div>
                </div>

                {/* Right button */}
                <button
                  onClick={handleResetTurn}
                  className="w-full sm:w-auto px-10 py-4 bg-[#ff4b4b] hover:bg-[#ea4343] text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_5px_0_#ea2b2b] active:translate-y-[5px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={16} className="stroke-[2.5]" /> Thử lại ngay
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </footer>
    </div>
  );
}
