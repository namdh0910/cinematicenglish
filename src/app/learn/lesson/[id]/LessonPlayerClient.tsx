"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, Square, Mic, Award, Zap, Volume2, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { evaluateSpeaking } from "@/app/actions/speaking";

interface Activity {
  id: string;
  title: string;
  type: 'multiple_choice' | 'fill_blanks' | 'shadowing' | 'dictation' | 'matching';
  instructions: string;
  content: any;
  order_index: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language' | 'Getting Started' | 'Exam';
  activities: Activity[];
  unit?: {
    id: string;
    title: string;
    grade?: {
      id: string;
      title: string;
    };
  };
}

interface LessonPlayerClientProps {
  lesson: Lesson;
}

export default function LessonPlayerClient({ lesson }: LessonPlayerClientProps) {
  const router = useRouter();
  
  // Filter all activities to only treat them as shadowing/speaking lines
  const activities = lesson.activities?.sort((a,b) => a.order_index - b.order_index) || [];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpReward, setXpReward] = useState(0);

  // Audio & Mic States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Recording stream refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // AI Evaluation Feedback
  const [aiResponse, setAiResponse] = useState<{
    score: number;
    remark: string;
    feedbackText: string;
    wordEvaluations?: any[];
  } | null>(null);

  const activeActivity = activities[currentIdx];

  // Auto-play model audio on activity enter
  useEffect(() => {
    setAiResponse(null);
    setIsPlaying(false);
    setIsRecording(false);
    setIsAnalyzing(false);

    if (activeActivity) {
      // Auto-trigger audio play after a small delay
      const t = setTimeout(() => {
        playModelSpeech();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [currentIdx, activeActivity]);

  // Voice synthesis/audio play for movie line
  const playModelSpeech = () => {
    if (!activeActivity) return;
    setIsPlaying(true);
    
    // Stop recording if any
    if (isRecording) stopRecording();

    // Prefer model speech synthesis or standard browser text-to-speech if audioUrl is empty
    const sentenceText = activeActivity.content?.transcript || activeActivity.title || "Silence is not empty.";
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.lang = 'en-US';
      
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural'));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  // Start Mic Audio capture
  const startRecording = async () => {
    setAiResponse(null);
    setIsRecording(true);
    audioChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        analyzeAndScoreAudio(blob);
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.error("Mic access error:", err);
      setIsRecording(false);
      alert("Vui lòng cấp quyền truy cập Micro trên trình duyệt để ghi âm luyện nói!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Base64 helper
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Call Speech AI Evaluation
  const analyzeAndScoreAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      const base64Audio = await blobToBase64(audioBlob);
      const sentenceText = activeActivity.content?.transcript || activeActivity.title || "Silence is not empty.";
      
      const res = await evaluateSpeaking({
        userId: "student-1",
        audioBase64: base64Audio,
        targetSentence: sentenceText,
        durationSeconds: 4
      });

      setIsAnalyzing(false);

      if (res.success) {
        const score = res.accuracy || 75;
        
        // Dopamine-driven emotional feedback map
        let remark = "Rất tốt! 👌";
        if (score >= 90) remark = "Quá xuất sắc! 🔥";
        else if (score >= 75) remark = "Nghe tự nhiên hơn rồi! 💖";
        else if (score >= 50) remark = "Cố lên một chút nữa! 💪";
        else remark = "Hãy nghe lại và thử lại nhé! 🌟";

        setAiResponse({
          score,
          remark,
          feedbackText: res.coachFeedback,
          wordEvaluations: res.wordEvaluations
        });

        // XP increment
        setXpReward(prev => prev + Math.floor(score * 1.2));

        // Auto-advance loop: wait 1.5 seconds then proceed to next sentence
        setTimeout(() => {
          handleAutoNext();
        }, 1600);
      } else {
        alert(res.error || "Có lỗi xảy ra khi chấm điểm.");
      }
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  const handleAutoNext = () => {
    if (currentIdx < activities.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setIsFinished(false);
    setXpReward(0);
    setAiResponse(null);
  };

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-secondary text-sm italic">Bài học này chưa có câu thoại nào được tạo.</p>
        <Link href="/learn" className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest">
          Quay lại học tập
        </Link>
      </div>
    );
  }

  // Theme
  const bgTheme = "bg-[#050508]";

  return (
    <div className={`min-h-screen ${bgTheme} flex flex-col justify-between overflow-hidden relative`}>
      
      {/* ─── HEADER BAR ──────────────────────────────────────────────────────── */}
      <header className="px-4 py-4 border-b border-white/5 flex items-center justify-between z-10 shrink-0 bg-black/40 backdrop-blur-md">
        <Link 
          href={lesson.unit ? `/learn/grade/${lesson.unit.id}` : "/learn"}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Thoát
        </Link>

        <div className="text-center">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Câu {currentIdx + 1} / {activities.length}</span>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-500 text-xs font-black">
          <Zap size={12} fill="currentColor" /> {xpReward} XP
        </div>
      </header>

      {/* ─── MAIN APP CONTENT (40% VIDEO / 60% SPEAKING WORKSPACE) ───────────── */}
      <main className="flex-1 flex flex-col justify-between select-none">
        
        {/* A. 40% VIDEO / VISUAL SUPPORT AREA */}
        <div className="h-[35vh] md:h-[40vh] w-full relative flex items-center justify-center bg-black overflow-hidden border-b border-white/5 shrink-0">
          {/* Simulated movie screen overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
          
          {/* Subtle moving cinematic glow background */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center opacity-60 filter blur-xs"
            style={{ 
              backgroundImage: `url('${activeActivity.content?.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'}')`
            }}
          />

          {/* Clean audio playing waveform pulse */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-violet-600/30 flex items-center justify-center pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Centered Movie Play Audio Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={playModelSpeech}
            className={`w-20 h-20 rounded-full flex items-center justify-center z-20 ${isPlaying ? 'bg-amber-500 text-black shadow-glow-amber' : 'bg-white/10 text-white border border-white/20 backdrop-blur-md'} transition-all`}
          >
            <Volume2 size={36} fill={isPlaying ? "black" : "none"} />
          </motion.button>
        </div>

        {/* B. 60% SPEAKING AREA (HERO SUBTITLES + MIC + FEEDBACK) */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between items-center bg-[#07070a] relative">
          
          {/* Progress timeline indicator */}
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden absolute top-0 left-0">
            <div 
              className="h-full bg-amber-500 transition-all duration-500" 
              style={{ width: `${((currentIdx + 1) / activities.length) * 100}%` }}
            />
          </div>

          <div className="w-full flex-1 flex flex-col justify-center space-y-6">
            {/* HERO SUBTITLES */}
            <div className="space-y-3 px-2 text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight text-white drop-shadow-lg">
                {aiResponse?.wordEvaluations ? (
                  <span className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
                    {aiResponse.wordEvaluations.map((w: any, idx: number) => {
                      let color = "text-white";
                      if (w.status === "correct") color = "text-emerald-400";
                      else if (w.status === "imperfect") color = "text-amber-400";
                      else if (w.status === "missing") color = "text-red-400 line-through";
                      return (
                        <span key={idx} className={color}>{w.word}</span>
                      );
                    })}
                  </span>
                ) : (
                  `"${activeActivity.content?.transcript || "Silence is not empty."}"`
                )}
              </h2>
              <p className="text-base md:text-lg text-white/40 italic font-medium leading-relaxed max-w-lg mx-auto">
                {activeActivity.content?.translation || "Sự im lặng mang trong mình sức nặng của ý nghĩa."}
              </p>
            </div>

            {/* DYNAMIC EMOTIONAL AI FEEDBACK DISPLAY */}
            <div className="h-28 flex flex-col items-center justify-center relative">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full shadow-glow-gold"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400/80">AI Đang Lắng Nghe...</span>
                  </motion.div>
                ) : aiResponse ? (
                  <motion.div 
                    key="feedback"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="text-center space-y-2"
                  >
                    <h3 className="text-3xl font-display font-black text-white flex items-center justify-center gap-2">
                      {aiResponse.remark}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black">
                      Độ tự tin: {aiResponse.score}%
                    </div>
                  </motion.div>
                ) : isRecording ? (
                  /* Fake Waveform Animation Response on Recording state */
                  <motion.div 
                    key="recording"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end justify-center gap-1 h-12 w-48"
                  >
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [12, Math.random() * 36 + 12, 12] }}
                        transition={{ repeat: Infinity, duration: 0.4 + i * 0.05, ease: "easeInOut" }}
                        className="w-1 rounded-full bg-red-500"
                        style={{ minHeight: "8px" }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.p 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="text-xs font-black uppercase tracking-[0.2em] text-white/80"
                  >
                    Bấm Mic và nhại lại câu thoại
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* C. CENTERED GIANT MIC PRIMARY ACTION */}
          <div className="w-full pb-8 flex justify-center items-center shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-glow-red scale-110' 
                  : 'bg-white text-black shadow-glow-gold'
              } disabled:opacity-50`}
            >
              {isRecording ? <Square size={36} fill="white" className="text-white" /> : <Mic size={44} className="text-black" />}
            </motion.button>
          </div>

        </div>

      </main>

      {/* ─── IMMERSIVE SUCCESS ARENA ────────────────────────────────────────── */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050508] flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-glow-amber animate-pulse">
              <Award size={48} />
            </div>

            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest">Nghi thức Đã Hoàn Thành</span>
              <h3 className="text-3xl font-display font-black text-white">Làm chủ Tiết học Thành công</h3>
              <p className="text-secondary text-sm max-w-sm mx-auto">
                Em đã hoàn thành xuất sắc tất cả câu nói của bài học "{lesson.title}". Sự tự tin nói của em đã tiến bộ vượt bậc!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-xs w-full py-6 border-y border-white/5">
              <div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Điểm thưởng</span>
                <h4 className="text-3xl font-display font-black text-amber-500 mt-1">+{xpReward} XP</h4>
              </div>
              <div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Trình độ</span>
                <h4 className="text-3xl font-display font-black text-emerald-400 mt-1">PROTAGONIST</h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-xs">
              <button 
                onClick={handleRestart}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white/70 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Luyện tập lại
              </button>
              <button 
                onClick={() => {
                  if (lesson.unit) {
                    router.push(`/learn/grade/${lesson.unit.id}`);
                  } else {
                    router.push("/learn");
                  }
                }}
                className="w-full py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                Tiếp tục lộ trình
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
