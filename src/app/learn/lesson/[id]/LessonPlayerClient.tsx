"use client";
import { ChevronLeft, Zap, Volume2, Award, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Modular speaking feature components & hooks
import { useSpeakingEngine } from "@/features/speaking/hooks/useSpeakingEngine";
import SpeakingMic from "@/features/speaking/components/SpeakingMic";
import SpeakingWaveform from "@/features/speaking/components/SpeakingWaveform";
import SpeakingFeedback from "@/features/speaking/components/SpeakingFeedback";
import { Lesson } from "@/features/speaking/types";

interface LessonPlayerClientProps {
  lesson: Lesson;
}

export default function LessonPlayerClient({ lesson }: LessonPlayerClientProps) {
  const router = useRouter();
  
  // Filter and sort speaking activities
  const activities = lesson.activities?.sort((a, b) => a.order_index - b.order_index) || [];
  
  // Core Speaking engine hook
  const {
    currentIdx,
    isFinished,
    xpReward,
    isPlaying,
    isRecording,
    isAnalyzing,
    aiResponse,
    activeActivity,
    playModelSpeech,
    startRecording,
    stopRecording,
    handleRestart
  } = useSpeakingEngine(lesson.id, activities);

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
    <div className="min-h-screen bg-[#050508] flex flex-col justify-between overflow-hidden relative">
      
      {/* ─── HEADER BAR ──────────────────────────────────────────────────────── */}
      <header className="px-4 py-4 border-b border-white/5 flex items-center justify-between z-10 shrink-0 bg-black/40 backdrop-blur-md">
        <Link 
          href={lesson.unit ? `/learn/grade/${lesson.unit.id}` : "/learn"}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Thoát
        </Link>

        <div className="text-center">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            Câu {currentIdx + 1} / {activities.length}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-500 text-xs font-black">
          <Zap size={12} fill="currentColor" /> {xpReward} XP
        </div>
      </header>

      {/* ─── MAIN APP CONTENT (40% VIDEO / 60% SPEAKING WORKSPACE) ───────────── */}
      <main className="flex-1 flex flex-col justify-between select-none">
        
        {/* A. 40% VIDEO / VISUAL SUPPORT AREA */}
        <div className="h-[35vh] md:h-[40vh] w-full relative flex items-center justify-center bg-black overflow-hidden border-b border-white/5 shrink-0 px-4 py-3">
          {(lesson.video_url || lesson.videoUrl) ? (
            <video
              src={lesson.video_url || lesson.videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain rounded-2xl shadow-2xl z-20 border border-white/10 bg-zinc-950"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 border border-white/5 rounded-2xl p-6 text-center space-y-4 z-20 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                <Volume2 size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-white/80 font-bold text-sm">Video đang được tải lên...</p>
                <p className="text-white/40 text-xs font-medium">Bản ghi âm hướng dẫn phát âm vẫn sẵn sàng bên dưới</p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playModelSpeech}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
                  isPlaying ? 'bg-amber-500 text-black shadow-glow-amber' : 'bg-white/15 text-white border border-white/10'
                } transition-all`}
              >
                <Volume2 size={14} fill={isPlaying ? "black" : "none"} /> Nghe giọng mẫu
              </motion.button>
            </div>
          )}

          {/* Cinematic dynamic background glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
          
          <motion.div 
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-xl"
            style={{ 
              backgroundImage: `url('${activeActivity.content?.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'}')`
            }}
          />
        </div>

        {/* B. 60% SPEAKING AREA (HERO SUBTITLES + MIC + FEEDBACK) */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between items-center bg-[#07070a] relative">
          
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
              <SpeakingFeedback 
                isAnalyzing={isAnalyzing}
                aiResponse={aiResponse}
                isRecording={isRecording}
                WaveformComponent={SpeakingWaveform}
              />
            </div>
          </div>

          {/* C. CENTERED GIANT MIC PRIMARY ACTION */}
          <SpeakingMic 
            isRecording={isRecording}
            isAnalyzing={isAnalyzing}
            onClick={isRecording ? stopRecording : startRecording}
          />

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
