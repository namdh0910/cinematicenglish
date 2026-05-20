"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  X,
  AlertCircle
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { evaluateSpeaking } from "@/app/actions/speaking";

interface DialogLine {
  speaker: string;
  text: string;
  translation?: string;
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
  const [lives, setLives] = useState<number>(5);

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

  // Run AI Speech evaluation
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

          // Save evaluated score into dialogue history
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

          // Deduct life if score is less than 80% (SAI)
          if (result.accuracy < 80) {
            setLives((prev) => Math.max(0, prev - 1));
          }
        } else {
          setCurrentFeedback(result.coachFeedback || "Không phân tích được phát âm. Thử nói lại nhé!");
          setLives((prev) => Math.max(0, prev - 1));
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
      utterance.rate = 0.85;

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

  // Word-by-word highlight inside the target text area
  const renderWords = () => {
    const currentSentence = dialogs[activeTurn]?.text || "";
    
    if (currentWordEvaluations && currentWordEvaluations.length > 0) {
      return (
        <div className="flex flex-wrap gap-x-2 gap-y-2 font-display font-extrabold text-4xl md:text-5xl text-slate-800 leading-normal tracking-tight justify-center select-text">
          {currentWordEvaluations.map((w, idx) => {
            let colorClass = "text-slate-800";
            if (w.status === "correct") {
              colorClass = "text-emerald-500 hover:text-emerald-600";
            } else {
              // Highlight incorrect / imperfect / missing in RED
              colorClass = "text-red-500 hover:text-red-600";
            }

            return (
              <span 
                key={idx}
                className={`${colorClass} cursor-pointer transition-colors px-1 rounded-xl hover:bg-slate-50`}
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
      <h3 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-normal tracking-tight font-display select-text text-center">
        {currentSentence}
      </h3>
    );
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 flex flex-col justify-between overflow-x-hidden select-none pb-36 font-sans">
      
      {/* 1. ROOM HEADER - FOCUS MODE */}
      <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-6 shrink-0 z-40">
        {/* Grey Exit [X] button */}
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

      {/* 2. CENTRAL CONTENT (PRACTICE AREA - REDESIGNED FOCUS MODE) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center gap-10">
        
        {/* Breathing Mascot centered nicely above content */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl flex items-center justify-center shadow-md select-none shrink-0"
        >
          <span className="text-5xl">🤖</span>
        </motion.div>

        {/* Main English target sentence & audio play trigger */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-4 flex-wrap w-full max-w-2xl">
            <div className="flex-1 flex justify-center text-center">
              {renderWords()}
            </div>
            
            {/* Loudspeaker Button placed next to the English text */}
            <button
              onClick={() => speakSentence(dialogs[activeTurn]?.text)}
              disabled={isPlayingTTS}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 shadow-sm ${
                isPlayingTTS
                  ? "bg-gray-100 border-gray-200 text-gray-400 animate-pulse"
                  : "bg-blue-50 border-blue-200 text-blue-500 hover:bg-blue-100 hover:scale-105 active:scale-95"
              }`}
              title="Nghe phát âm mẫu"
            >
              {isPlayingTTS ? (
                <VolumeX size={24} className="animate-pulse" />
              ) : (
                <Volume2 size={24} className="stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Vietnamese Translation Row */}
          <p className="text-lg text-slate-400 font-semibold text-center max-w-xl">
            {dialogs[activeTurn]?.translation || "Nhấn nút loa bên cạnh để nghe cách phát âm chuẩn nhé."}
          </p>
        </div>

        {/* Teacher coach feedback box inside center content */}
        {currentFeedback && currentScore !== null && (
          <div className="w-full max-w-xl bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-3 text-left">
            <div className="text-2xl select-none">👩‍🏫</div>
            <div>
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider mb-0.5">Lời khuyên của Cô:</p>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                {currentFeedback}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 3. DYNAMIC STICKY BOTTOM ACTION BAR (DUOLINGO FOCUS FOOTER) */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 border-t p-6 transition-all duration-300 ease-in-out ${
        currentScore === null 
          ? "bg-white border-gray-200" 
          : currentScore >= 80 
            ? "bg-green-100 border-green-200 shadow-[0_-8px_30px_rgba(34,197,94,0.1)]" 
            : "bg-red-100 border-red-200 shadow-[0_-8px_30px_rgba(239,68,68,0.1)]"
      }`}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          
          <AnimatePresence mode="wait">
            {currentScore === null ? (
              /* State 1: Default / Recording State */
              <motion.div
                key="default-mic"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex items-center justify-between gap-6"
              >
                {/* Left instructions */}
                <div className="hidden md:flex flex-col items-start gap-1 flex-1">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    {isRecording ? "Đang thu âm..." : "Sẵn sàng luyện nói"}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {isRecording ? "Chạm mic để dừng và chấm điểm" : "Chạm biểu tượng Micro để bắt đầu nói"}
                  </span>
                </div>

                {/* Centered Giant Microphone Button */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
                        AI Đang Chấm Điểm...
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Recording Ping/Pulse Waves */}
                      {isRecording && (
                        <>
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.6 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-blue-400 rounded-full z-0"
                          />
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeOut" }}
                            className="absolute inset-0 bg-blue-300 rounded-full z-0"
                          />
                        </>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 z-10 relative cursor-pointer text-white bg-blue-500 hover:bg-blue-600 shadow-[0_6px_0_rgb(37,99,235)] active:translate-y-[6px] active:shadow-none border-none outline-none"
                        title={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                      >
                        {isRecording ? (
                          <Square size={24} fill="currentColor" />
                        ) : (
                          <Mic size={28} className="stroke-[2.5]" />
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Mic visualizer / error row */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-1 h-4 mt-2">
                      {waveform.slice(0, 15).map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: `${h * 0.15}px` }}
                          className="w-0.5 bg-blue-400 rounded-full"
                          style={{ minHeight: "2px" }}
                        />
                      ))}
                    </div>
                  )}

                  {micError && (
                    <span className="text-red-500 text-xs font-bold px-4 py-1.5 bg-red-50 rounded-xl border border-red-100 max-w-sm mt-2 animate-pulse text-center">
                      ⚠️ {micError}
                    </span>
                  )}
                </div>

                <div className="hidden md:block flex-1" />
              </motion.div>
            ) : currentScore >= 80 ? (
              /* State 2: SUCCESS DYNAMIC STATE (>80% - Green theme) */
              <motion.div
                key="success-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1"
              >
                {/* Left Congratulation message */}
                <div className="flex items-center gap-4 text-green-800 select-none text-center sm:text-left">
                  <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_4px_0_#15803d] shrink-0">
                    <CheckCircle2 size={28} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-tight">Tuyệt vời! ({currentScore}%)</h4>
                    <p className="text-xs font-bold opacity-95">
                      Bạn đã hoàn thành xuất sắc câu thoại này.
                    </p>
                  </div>
                </div>

                {/* Duolingo style tràn viền big continue button */}
                <button
                  onClick={handleNextTurn}
                  className="w-full sm:w-auto px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_rgb(34,197,94)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  {activeTurn < dialogs.length - 1 ? "Tuyệt vời, Tiếp tục!" : "Hoàn thành bài học! 🎉"}
                </button>
              </motion.div>
            ) : (
              /* State 3: FAILURE DYNAMIC STATE (<80% - Red theme) */
              <motion.div
                key="fail-bar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1"
              >
                {/* Left Try Again message */}
                <div className="flex items-center gap-4 text-red-800 select-none text-center sm:text-left">
                  <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_4px_0_#b91c1c] shrink-0">
                    <AlertCircle size={28} className="stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-tight">Thử lại nhé ({currentScore}%)</h4>
                    <p className="text-xs font-bold opacity-95">
                      Cần đạt trên 80% để tiếp tục. Hãy sửa lại phát âm các từ màu đỏ.
                    </p>
                  </div>
                </div>

                {/* Duolingo style Try again button */}
                <button
                  onClick={handleResetTurn}
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
