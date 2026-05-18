"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Zap, Volume2, Award, RefreshCw, Mic, Square, Play, Pause, Check, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceRecorder } from "@/features/speaking/hooks/useVoiceRecorder";
import { Lesson } from "@/features/speaking/types";

interface LessonPlayerClientProps {
  lesson: Lesson;
}

export default function LessonPlayerClient({ lesson }: LessonPlayerClientProps) {
  const router = useRouter();
  
  // Sort and list activities
  const activities = lesson.activities?.sort((a, b) => a.order_index - b.order_index) || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpReward, setXpReward] = useState(0);

  // Video playback & Scene control states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

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

  // Dynamic Scene Boundaries based on index
  const startSceneTime = activeActivity?.content?.start_time ?? (currentIdx * 5);
  const endSceneTime = activeActivity?.content?.end_time ?? (startSceneTime + 5);

  // Sync video time on Scene/Activity change
  useEffect(() => {
    resetStateForNewScene();
  }, [currentIdx, activeActivity]);

  const resetStateForNewScene = () => {
    resetRecorder();
    setShowAICoach(false);
    setAiFeedback(null);
    setIsVideoPaused(true);
    setIsVideoPlaying(false);

    if (videoRef.current) {
      videoRef.current.currentTime = startSceneTime;
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  // Synchronize playback speed change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    
    // Auto Pause at the end of the current Scene
    if (video.currentTime >= endSceneTime) {
      video.pause();
      video.currentTime = endSceneTime;
      setIsVideoPaused(true);
      setIsVideoPlaying(false);
    }
  };

  const handlePlayScene = () => {
    if (videoRef.current) {
      // If video is at or past end, restart from beginning of scene
      if (videoRef.current.currentTime >= endSceneTime || videoRef.current.currentTime < startSceneTime) {
        videoRef.current.currentTime = startSceneTime;
      }
      videoRef.current.play().catch(console.error);
      setIsVideoPaused(false);
      setIsVideoPlaying(true);
    }
  };

  const handlePauseScene = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPaused(true);
      setIsVideoPlaying(false);
    }
  };

  // Mock AI Coach analysis on recording stop
  const handleStopRecording = () => {
    stopRecording();
    setIsAnalyzing(true);

    // Simulate high-fidelity AI Speech Assessment after 1.5 seconds
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAICoach(true);

      const transcript = activeActivity?.content?.transcript || "Silence is not empty.";
      const words = transcript.split(" ");
      
      // Build a premium mock word-by-word evaluation dataset
      const wordEvaluations = words.map((w: string, i: number) => {
        const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        let status: 'correct' | 'imperfect' | 'missing' = 'correct';
        if (i % 6 === 0) status = 'imperfect';
        if (i % 9 === 0) status = 'missing';
        
        return {
          word: cleanWord,
          status,
          accuracy: status === 'correct' ? 95 : status === 'imperfect' ? 68 : 0
        };
      });

      const accuracy = 90;
      const fluency = 85;
      const overall = Math.round((accuracy + fluency) / 2);

      setAiFeedback({
        overall,
        accuracy,
        fluency,
        coachFeedback: "Phát âm rất rõ ràng, trường hơi tốt. Tuy nhiên cần lưu ý ngắt nghỉ chính xác hơn ở các liên từ để câu thoại tự nhiên và truyền cảm hơn nữa nhé!",
        wordEvaluations
      });

      // Award XP
      setXpReward(prev => prev + Math.floor(overall * 1.5));
    }, 1500);
  };

  const handleNextScene = () => {
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
    resetStateForNewScene();
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

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-between overflow-x-hidden relative selection:bg-amber-500/30 text-white">
      {/* ─── HEADER BAR ──────────────────────────────────────────────────────── */}
      <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between z-10 shrink-0 bg-black/40 backdrop-blur-md">
        <Link 
          href={lesson.unit ? `/learn/grade/${lesson.unit.id}` : "/learn"}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Thoát
        </Link>

        <div className="text-center">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-0.5">Phân Cảnh</span>
          <span className="text-sm font-black text-white">
            {currentIdx + 1} / {activities.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-500 text-xs font-black shadow-glow-amber/10">
          <Zap size={13} fill="currentColor" /> {xpReward} XP
        </div>
      </header>

      {/* Progress timeline */}
      <div className="w-full bg-white/5 h-1 overflow-hidden shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500" 
          style={{ width: `${((currentIdx + 1) / activities.length) * 100}%` }}
        />
      </div>

      {/* ─── MAIN WORKSPACE (Split Screen on Desktop) ─────────────────────── */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 p-6 max-w-7xl mx-auto w-full items-stretch">
        
        {/* LEFT COLUMN (Player & Recorders) - lg:col-span-7 */}
        <div className="lg:col-span-7 flex flex-col space-y-6 justify-between">
          
          {/* A. CINEMATIC VIDEO CONTAINER */}
          <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col aspect-video shrink-0 group">
            <video
              ref={videoRef}
              src={lesson.video_url || lesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
              onTimeUpdate={handleTimeUpdate}
              playsInline
              className="w-full h-full object-cover z-10"
            />

            {/* Ambient dynamic background glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-20" />
            
            {/* Grain Overlay */}
            <div className="absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}></div>

            {/* Scene Controller Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/5 opacity-90 group-hover:opacity-100 transition-all">
              <div className="flex items-center gap-3">
                {isVideoPlaying ? (
                  <button 
                    onClick={handlePauseScene} 
                    className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    <Pause size={16} fill="black" />
                  </button>
                ) : (
                  <button 
                    onClick={handlePlayScene} 
                    className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow-amber/20"
                  >
                    <Play size={16} fill="black" className="ml-0.5" />
                  </button>
                )}

                <div>
                  <span className="text-[9px] font-black uppercase text-amber-500 block tracking-widest">Phạm vi Scene</span>
                  <span className="text-xs font-mono font-bold text-white/80">
                    {startSceneTime.toFixed(1)}s - {endSceneTime.toFixed(1)}s
                  </span>
                </div>
              </div>

              {/* Speed selectors */}
              <div className="flex items-center gap-1.5">
                {[0.75, 1.0, 1.25].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                      playbackSpeed === speed
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* B. HERO SUBTITLES CARD */}
          <div className="glass-card p-6 flex flex-col justify-center items-center text-center space-y-4 border border-white/5 min-h-[140px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-violet-600" />
            
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight leading-tight text-white drop-shadow-md">
              "{activeActivity.content?.transcript || "Silence is not empty."}"
            </h2>
            <p className="text-sm md:text-base text-white/40 italic font-medium max-w-xl">
              {activeActivity.content?.translation || "Sự im lặng mang trong mình sức nặng của ý nghĩa."}
            </p>
          </div>

          {/* C. RECORDER TRIGGER WORKSPACE */}
          <div className="glass-card p-6 flex flex-col items-center justify-center border border-white/5 relative">
            
            {/* Analyzing overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 rounded-[32px]">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full shadow-glow-gold"
                />
                <span className="text-xs font-black tracking-[0.2em] uppercase text-amber-500">Đang phân tích phát âm...</span>
              </div>
            )}

            <div className="text-center space-y-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                Shadowing Mode
              </span>
              <p className="text-xs text-white/40 font-medium max-w-xs">
                Xem hết phân cảnh, bấm Micro thu âm, nhại lại giọng và ngừng để AI Coach đánh giá.
              </p>
            </div>

            {/* Glowing micro controller */}
            <div className="flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? handleStopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isRecording 
                    ? 'bg-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse' 
                    : 'bg-white text-black hover:bg-amber-500 shadow-glow-white/10'
                }`}
              >
                {isRecording ? (
                  <Square size={24} fill="white" className="text-white" />
                ) : (
                  <Mic size={28} className="text-black" />
                )}
              </motion.button>

              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">
                {isRecording ? "ĐANG GHI ÂM (BẤM ĐỂ DỪNG)" : "BẤM ĐỂ THU ÂM"}
              </span>

              {micError && (
                <span className="text-xs text-red-400 font-bold px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl mt-2">
                  {micError}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (AI Coach Panel) - lg:col-span-5 */}
        <div className="lg:col-span-5 flex flex-col items-stretch">
          <AnimatePresence mode="wait">
            {showAICoach && aiFeedback ? (
              <motion.div
                key="ai-coach-report"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-6 flex flex-col justify-between border border-amber-500/20 shadow-glow-amber/5 h-full space-y-6"
              >
                <div className="space-y-6">
                  {/* Title */}
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-glow-amber/20 shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">AI Feedback</span>
                      <h4 className="text-base font-display font-black text-white">Kết Quả Phân Tích Từ Cô</h4>
                    </div>
                  </div>

                  {/* Overall score gauge */}
                  <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Điểm Tổng Thể</span>
                      <span className="text-xs text-amber-400 font-black mt-0.5 block flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> XUẤT SẮC
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-display font-black text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                        {aiFeedback.overall}%
                      </span>
                    </div>
                  </div>

                  {/* Dual metrics grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Phát âm (Accuracy)</span>
                      <h5 className="text-2xl font-display font-black text-emerald-400 mt-1">{aiFeedback.accuracy}%</h5>
                      <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${aiFeedback.accuracy}%` }} />
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Độ lưu loát (Fluency)</span>
                      <h5 className="text-2xl font-display font-black text-violet-400 mt-1">{aiFeedback.fluency}%</h5>
                      <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-violet-400" style={{ width: `${aiFeedback.fluency}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* AI Narrative Commentary */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block">Lời Khuyên Của Cô:</span>
                    <p className="text-xs text-white/80 leading-relaxed font-medium bg-white/[0.01] border border-white/5 p-4 rounded-2xl italic">
                      "{aiFeedback.coachFeedback}"
                    </p>
                  </div>

                  {/* Word-by-word highlighted detail */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block">Chi Tiết Từng Từ:</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {aiFeedback.wordEvaluations.map((w: any, idx: number) => (
                        <span 
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg border transition-all font-bold ${
                            w.status === 'correct' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' :
                            w.status === 'imperfect' ? 'text-amber-400 bg-amber-500/5 border-amber-500/10' :
                            'text-red-400 bg-red-500/5 border-red-500/10 line-through'
                          }`}
                        >
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NEXT SCENE TRIGGER */}
                <button
                  onClick={handleNextScene}
                  className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                >
                  {currentIdx < activities.length - 1 ? (
                    <>
                      Phân cảnh tiếp theo <ArrowRight size={14} />
                    </>
                  ) : (
                    <>
                      Hoàn thành bài học <Check size={14} />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="ai-coach-empty"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 border border-white/5 h-full opacity-60 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 border border-white/5 animate-pulse">
                  <Volume2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Đang Đợi Ghi Âm Giọng Bạn</h4>
                  <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                    Vui lòng phát phân cảnh phim để hiểu cảm xúc nhân vật, sau đó nhấn Micro thu âm để cô nghe phát âm của bạn.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* ─── IMMERSIVE SUCCESS ARENA ────────────────────────────────────────── */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07090e] flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-violet-500/5 to-transparent blur-[120px] pointer-events-none" />

            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-glow-amber animate-pulse">
              <Award size={48} />
            </div>

            <div className="space-y-3 relative z-10">
              <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">Nghi thức Đã Hoàn Thành</span>
              <h3 className="text-3xl font-display font-black text-white">Làm chủ Tiết học Thành công</h3>
              <p className="text-secondary text-sm max-w-sm mx-auto">
                Em đã hoàn thành xuất sắc tất cả câu nói của bài học "{lesson.title}". Sự tự tin nói của em đã tiến bộ vượt bậc!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-xs w-full py-6 border-y border-white/5 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Điểm thưởng</span>
                <h4 className="text-3xl font-display font-black text-amber-500 mt-1">+{xpReward} XP</h4>
              </div>
              <div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Trình độ</span>
                <h4 className="text-3xl font-display font-black text-emerald-400 mt-1">PROTAGONIST</h4>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
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
