"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RefreshCw, CheckCircle2, MessageSquareHeart, Sparkles, ShieldCheck, Star } from "lucide-react";
import { trackTelemetry } from "@/lib/observability/observability";
import { evaluateSpeaking } from "@/app/actions/speaking";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

interface VoiceRecorderProps {
  sentence: string;
  onComplete: (blob: Blob, feedback: string) => void;
  accentColor?: string;
}

export default function VoiceRecorder({ sentence, onComplete, accentColor = "#f59e0b" }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>(Array(30).fill(10));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  
  const [score, setScore] = useState<number | null>(null);
  const [wordEvaluations, setWordEvaluations] = useState<any[] | null>(null);
  const [isGated, setIsGated] = useState(false);
  const [gatedMessage, setGatedMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session?.user);
      } catch (err) {
        console.error("Session check error:", err);
      }
    }
    checkSession();
  }, []);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const animationFrame = useRef<number | null>(null);

  // Web Audio refs for real microphone visualization
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Initialize Web Audio context for real-time visualization
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small fftSize for 32 frequency bins

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
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        analyzeSpeech(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setFeedback(null);
      setMicError(null);
      trackTelemetry('speaking_started', { sentence });
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicError("Vui lòng cấp quyền truy cập Micro trên trình duyệt để luyện nói nhé!");
      trackTelemetry('mic_permission_denied', { error: String(err) });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      // Stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    }
  };

  // Real-time animation loop pulling actual voice frequency from microphone
  const drawMicWaveform = () => {
    if (!analyserRef.current || !isRecording) {
      setWaveform(Array(30).fill(10));
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Map first 30 frequency bins directly to waveform heights (0% to 100%)
    const newWaveform: number[] = [];
    for (let i = 0; i < 30; i++) {
      const raw = dataArray[i] || 0;
      // Convert 0-255 frequency amplitude to 10% - 90% scale
      const height = Math.max(10, Math.round((raw / 255) * 80) + 10);
      newWaveform.push(height);
    }

    setWaveform(newWaveform);
    animationFrame.current = requestAnimationFrame(drawMicWaveform);
  };

  useEffect(() => {
    if (isRecording) {
      animationFrame.current = requestAnimationFrame(drawMicWaveform);
    } else {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      setWaveform(Array(30).fill(10));
    }
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isRecording]);

  const analyzeSpeech = (blob: Blob) => {
    setIsAnalyzing(true);
    
    // Check guest quota per session (limit to 1 free attempt per session)
    if (!isLoggedIn) {
      const guestAttempt = sessionStorage.getItem('guest_demo_attempt');
      if (guestAttempt === 'true') {
        setIsGated(true);
        setGatedMessage("Hạn ngạch học thử miễn phí của phiên này đã hết. Hãy tạo tài khoản để tiếp tục luyện phát âm!");
        setIsAnalyzing(false);
        return;
      }
      sessionStorage.setItem('guest_demo_attempt', 'true');
    }

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      try {
        const base64Audio = (reader.result as string).split(',')[1];
        const durationSeconds = audioChunks.current.length * 0.5 || 3;
        
        const result = await evaluateSpeaking({
          userId: 'guest',
          audioBase64: base64Audio,
          targetSentence: sentence,
          durationSeconds: durationSeconds,
        });

        if (result.success) {
          setScore(result.accuracy);
          setFeedback(result.coachFeedback);
          setWordEvaluations(result.wordEvaluations);
          
          if (onComplete) {
            onComplete(blob, result.coachFeedback);
          }
        } else if (result.gated) {
          setIsGated(true);
          setGatedMessage(result.error || "Hạn ngạch luyện nói hôm nay đã hết.");
        } else {
          setFeedback(result.coachFeedback || "Không phân tích được phát âm. Thử nói lại nhé!");
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        setFeedback("Lỗi kết nối hệ thống chấm điểm AI. Vui lòng nói lại.");
      } finally {
        setIsAnalyzing(false);
        trackTelemetry('speaking_completed', { sentence });
      }
    };
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10">
      {/* Waveform Visualization - REAL MICROPHONE FREQUENCIES */}
      <div className="h-40 flex items-end justify-center gap-1.5 px-6 pb-6 bg-[#16161a] rounded-[32px] sm:rounded-[40px] border border-white/5 relative overflow-hidden group w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {waveform.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: h + "%" }}
            className="w-1.5 rounded-full transition-all duration-75"
            style={{ 
              background: isRecording 
                ? `linear-gradient(to top, ${accentColor}, #fff)` 
                : 'rgba(255,255,255,0.06)',
              boxShadow: isRecording ? `0 0 16px ${accentColor}88` : 'none',
              minHeight: '8px'
            }}
          />
        ))}

        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center gap-4 z-20"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full shadow-glow-gold"
            />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-amber-400">Cô đang nghe phân tích phát âm...</span>
          </motion.div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex flex-col items-center gap-8">
        {!audioUrl ? (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500 scale-110 shadow-glow-red' : 'bg-white text-black shadow-glow-gold'}`}
            >
              {isRecording ? <Square size={36} fill="white" className="text-white" /> : <Mic size={40} className="text-black" />}
            </motion.button>
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-glow-red"
                >
                  Đang ghi âm
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { 
                setAudioUrl(null); 
                setFeedback(null); 
                setScore(null);
                setWordEvaluations(null);
                setIsGated(false);
                setGatedMessage(null);
                trackTelemetry('retry_recording');
              }}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white"
            >
              <RefreshCw size={24} />
            </button>
            <button 
              onClick={() => audioUrl && new Audio(audioUrl).play()}
              className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-glow-gold"
            >
              <Play size={40} fill="black" className="ml-1" />
            </button>
            <button 
              onClick={() => audioBlob && onComplete(audioBlob, feedback || "")}
              className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-all shadow-glow-emerald"
            >
              <CheckCircle2 size={24} />
            </button>
          </div>
        )}
        
        {micError && (
          <div className="text-rose-400 text-xs text-center font-bold px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20 max-w-sm">
            {micError}
          </div>
        )}

        <p className="text-xs font-black tracking-widest uppercase opacity-30 text-center">
          {isRecording ? "Chạm để dừng & phân tích" : audioUrl ? "Lắng nghe hoặc thử lại" : "Chạm để bắt đầu luyện nói"}
        </p>
      </div>

      {/* AI Emotional Feedback & Score Card */}
      <AnimatePresence>
        {isGated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-red-500/10 border border-red-500/20 backdrop-blur-xl relative overflow-hidden w-full text-left"
          >
            <div className="flex gap-4 md:gap-6 items-start relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white shrink-0">
                <ShieldCheck size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-2">Hạn ngạch học thử</div>
                <p className="text-lg md:text-xl text-white leading-relaxed font-display font-medium">
                  {gatedMessage || "Hạn ngạch luyện nói miễn phí của phiên này đã hết."}
                </p>
                <p className="text-sm text-secondary mt-2">
                  Hãy đăng ký tài khoản hoàn toàn miễn phí để mở khóa hơn 500+ kịch bản phim và tiếp tục luyện nói không giới hạn cùng AI Coach!
                </p>
                <div className="mt-6">
                  <Link href="/signup">
                    <button className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-glow-gold">
                      Đăng ký miễn phí ngay →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!isGated && feedback && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden space-y-6 w-full text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={60} className="text-amber-400" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10 justify-between">
              <div className="flex gap-4 md:gap-6 items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-glow-gold shrink-0">
                  <MessageSquareHeart size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Giáo viên AI</div>
                  <p className="text-lg md:text-2xl text-white leading-relaxed font-display font-medium">"{feedback}"</p>
                </div>
              </div>

              {score !== null && (
                <div className="flex flex-col items-center shrink-0 self-center md:self-auto bg-black/40 px-6 py-4 rounded-2xl border border-white/5 min-w-[100px]">
                  <span className="text-[10px] uppercase font-black tracking-widest text-muted mb-1">Điểm AI</span>
                  <span className={`text-4xl font-display font-black ${
                    score < 60 ? 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]' :
                    score < 80 ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]' :
                    'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  }`}>
                    {score}%
                  </span>
                </div>
              )}
            </div>

            {/* Word-by-word visual highlight */}
            {wordEvaluations && wordEvaluations.length > 0 && (
              <div className="pt-6 border-t border-white/5 space-y-3 relative z-10">
                <div className="text-[10px] uppercase tracking-widest font-black text-muted">Chi tiết phát âm từng từ:</div>
                <div className="flex flex-wrap gap-2 text-base font-bold">
                  {wordEvaluations.map((w, idx) => (
                    <span 
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        w.status === 'correct' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' :
                        w.status === 'imperfect' ? 'text-amber-400 bg-amber-500/5 border-amber-500/10' :
                        'text-red-500 bg-red-500/5 border-red-500/10 line-through'
                      }`}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guest / Demo Special conversion CTA */}
            {!isLoggedIn && (
              <div className="pt-6 border-t border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 bg-gradient-to-r from-amber-500/5 via-violet-500/5 to-transparent p-4 md:p-6 rounded-2xl border border-white/5 w-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-wider ml-1">Đột Phá Luyện Nói</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Bạn đang làm rất tốt!</h4>
                  <p className="text-xs text-secondary max-w-md">Đăng ký tài khoản miễn phí để mở khóa lộ trình học qua 500+ bộ phim bom tấn đỉnh cao cùng AI Coach.</p>
                </div>
                <Link href="/signup" className="shrink-0">
                  <button className="w-full lg:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-glow-gold">
                    Đăng ký miễn phí để luyện thêm 500+ trích đoạn →
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
