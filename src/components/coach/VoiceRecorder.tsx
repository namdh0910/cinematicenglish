"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RefreshCw, CheckCircle2, MessageSquareHeart, Sparkles } from "lucide-react";

interface VoiceRecorderProps {
  sentence: string;
  onComplete: (blob: Blob, feedback: string) => void;
  accentColor?: string;
}

export default function VoiceRecorder({ sentence, onComplete, accentColor = "#f59e0b" }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(10));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      const updateWaveform = () => {
        setWaveform(prev => prev.map(() => Math.random() * 60 + 20));
        animationFrame.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();
    } else {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      setWaveform(Array(40).fill(10));
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        analyzeSpeech();
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setFeedback(null);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeSpeech = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setFeedback("Hệ thống chấm điểm AI đang được nâng cấp cho phiên bản Beta. Hiện tại, bản thu âm của bạn đã được lưu lại cục bộ thành công.");
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10">
      {/* Waveform Visualization */}
      <div className="h-40 flex items-center justify-center gap-1 sm:gap-1.5 px-4 sm:px-6 bg-white/5 rounded-[32px] sm:rounded-[40px] backdrop-blur-2xl border border-white/10 relative overflow-hidden group w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
        
        {waveform.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: h + "%" }}
            className={`w-1 sm:w-1.5 rounded-full transition-colors duration-500 ${
              i >= 20 ? "hidden sm:block" : ""
            }`}
            style={{ 
              background: isRecording ? `linear-gradient(to top, ${accentColor}, #fff)` : 'rgba(255,255,255,0.1)',
              boxShadow: isRecording ? `0 0 20px ${accentColor}44` : 'none'
            }}
          />
        ))}

        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-4 z-20"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full shadow-glow-gold"
            />
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-amber-400">AI đang thấu cảm giọng nói...</span>
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
              {isRecording ? <Square size={36} fill="white" /> : <Mic size={40} fill="black" />}
            </motion.button>
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-glow-red"
                >
                  Đang ghi âm
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setAudioUrl(null); setFeedback(null); }}
              className="w-16 h-16 rounded-full glass border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white"
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
        
        <p className="text-sm font-bold tracking-widest uppercase opacity-20">
          {isRecording ? "Chạm để dừng & phân tích" : audioUrl ? "Lắng nghe hoặc thử lại" : "Chạm để bắt đầu luyện nói"}
        </p>
      </div>

      {/* AI Emotional Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={60} className="text-amber-400" />
            </div>
            <div className="flex gap-4 md:gap-6 items-start relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-glow-gold shrink-0">
                <MessageSquareHeart size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2">Người cố vấn AI</div>
                <p className="text-lg md:text-2xl text-white leading-relaxed font-display font-medium">"{feedback}"</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sự tự tin: Rất cao
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
