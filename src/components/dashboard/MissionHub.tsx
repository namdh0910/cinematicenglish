"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  Mic, 
  Volume2, 
  Zap, 
  Clock, 
  ChevronRight, 
  Award,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  X,
  Lock,
  Eye,
  SlidersHorizontal,
  VolumeX,
  Compass
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface UserProgress {
  streak: number;
  identity: string;
  nextIdentity: string;
  auraColor: string;
}

interface MissionHubProps {
  progress: UserProgress;
}

export default function MissionHub({ progress }: MissionHubProps) {
  // Ritual active state
  const [activeRitual, setActiveRitual] = useState(false);
  const [activeNode, setActiveNode] = useState(0); // 0: Dictation, 1: Shadowing, 2: Vocabulary
  const [ritualCompleted, setRitualCompleted] = useState(false);
  
  // Game states inside the daily loop
  const [dictationInput, setDictationInput] = useState("");
  const [dictationFeedback, setDictationFeedback] = useState<string[] | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSuccess, setRecordingSuccess] = useState(false);
  const [speechScores, setSpeechScores] = useState<{accuracy: number, rhythm: number} | null>(null);
  
  const [vocabOption, setVocabOption] = useState<string | null>(null);
  const [vocabChecked, setVocabChecked] = useState(false);
  const [examTimer, setExamTimer] = useState(30);

  const [earnedXP, setEarnedXP] = useState(0);
  const [streakCombo, setStreakCombo] = useState(1);

  // Fatigue & Tomorrow Engine States
  const [holdReveal, setHoldReveal] = useState(false);
  const [countdownText, setCountdownText] = useState("13:58:24");
  const [tomorrowMode, setTomorrowMode] = useState<{
    chamber: string;
    difficulty: number;
    tone: string;
    glow: string;
    description: string;
    reminder: string;
  }>({
    chamber: "Đấu trường Thương thuyết",
    difficulty: 4,
    tone: "Tranh biện Cường độ cao",
    glow: "rgba(139, 92, 246, 0.4)", // Violet
    description: "Chuẩn bị tham gia vào các tình huống thuyết phục tính giờ với đánh giá trực tiếp từ AI.",
    reminder: "Sự im lặng đang chờ đợi tiếng nói bản lĩnh của em một lần nữa."
  });

  // Calculate live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Next midnight
      const diff = tomorrow.getTime() - now.getTime();
      
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdownText(
        `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tomorrow Engine: Recovery Intelligence calculation
  // Determines tomorrow's parameters based on today's ritual score
  const runTomorrowEngineForecast = (score: number) => {
    if (score < 80) {
      // High fatigue / burnout risk -> Restorative calm session tomorrow
      setTomorrowMode({
        chamber: "Thung lũng Âm thanh êm dịu",
        difficulty: 2,
        tone: "Nhịp điệu Phục hồi",
        glow: "rgba(16, 185, 129, 0.4)", // Emerald
        description: "Hội thoại nhẹ nhàng, ít áp lực để em hấp thụ ngữ điệu tự nhiên và lấy lại sự tự tin.",
        reminder: "Những bước chân nhẹ nhàng hôm nay sẽ dẫn lối cho sự tự tin ngày mai."
      });
    } else {
      // High energy competence -> High stakes Quest tomorrow
      setTomorrowMode({
        chamber: "Đấu trường Thương thuyết",
        difficulty: 4,
        tone: "Tranh biện Cường độ cao",
        glow: "rgba(245, 200, 66, 0.4)", // Gold
        description: "Thử thách tranh biện nhanh có tính giờ nhằm rèn luyện áp lực phản xạ nói và làm chủ tốc độ.",
        reminder: "Sự im lặng đang chờ đợi tiếng nói bản lĩnh của em một lần nữa."
      });
    }
  };

  // Timer loop for Node 3 (Exam Sprint)
  useEffect(() => {
    if (!activeRitual || activeNode !== 2 || ritualCompleted) return;
    const interval = setInterval(() => {
      setExamTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNextNode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeRitual, activeNode, ritualCompleted]);

  // Audio Play Simulation
  const playSimulatedAudio = () => {
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Simulated play error: ", e));
  };

  // Node 1: Dictation verifier
  const handleVerifyDictation = () => {
    const clean = (w: string) => w.toLowerCase().replace(/[.,]/g, "").trim();
    const correctWords = ["sharing", "housework", "strengthens", "family", "bonds"];
    const userWords = dictationInput.split(" ").map(clean);
    
    setDictationFeedback(userWords);
    setEarnedXP(prev => prev + 100);
    setStreakCombo(prev => prev + 1);
  };

  // Node 2: Speech Recorder Simulator
  const handleRecordSpeech = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRecordingSuccess(true);
      const acc = 0; // Đang chờ tích hợp Whisper API thật
      const rhy = 0;
      setSpeechScores({ accuracy: acc, rhythm: rhy });
      setEarnedXP(prev => prev + 150);
      setStreakCombo(prev => prev + 1);
    }, 2500);
  };

  // Node 3: Vocab Quiz choice
  const handleSelectVocab = (opt: string) => {
    setVocabOption(opt);
    setVocabChecked(true);
    if (opt === "responsible") {
      setEarnedXP(prev => prev + 120);
      setStreakCombo(prev => prev + 1);
    } else {
      setStreakCombo(1);
    }
  };

  // Flow controllers
  const handleNextNode = () => {
    if (activeNode < 2) {
      setActiveNode(prev => prev + 1);
    } else {
      // Calculate overall ritual score (accuracy math)
      const mockScore = speechScores ? Math.floor((speechScores.accuracy + 92) / 2) : 92;
      runTomorrowEngineForecast(mockScore);
      setRitualCompleted(true);
    }
  };

  return (
    <div className="space-y-10 relative">
      <AnimatePresence>
        {!activeRitual ? (
          /* ─── LOBBY / COMMAND CENTER ─── */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Header Aura Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 relative overflow-hidden group p-8">
                {/* Background Pulsing Luxury Aura Orb */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Trophy size={140} />
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  {/* Aura Orb representation */}
                  <div className="relative">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.15, 0.35, 0.15] 
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full blur-[40px] pointer-events-none"
                      style={{ backgroundColor: progress.auraColor || "#8b5cf6" }}
                    />
                    <div className="relative w-32 h-32 rounded-full glass border-white/10 flex flex-col items-center justify-center shadow-glow-violet/20">
                      <Flame size={36} className="text-amber-500 mb-1" />
                      <span className="text-3xl font-display font-black">{progress.streak}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Chuỗi liên tục</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Tiến trình Danh hiệu</span>
                      <Badge variant="violet" className="w-fit mx-auto md:mx-0">{progress.identity}</Badge>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-black text-white">
                      Đang tiến hóa thành <span className="gradient-text-gold">{progress.nextIdentity}</span>
                    </h3>
                    
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-amber-500" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recovery Aura & Streak Protection */}
              <Card className="flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 border-emerald-500/10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="font-bold text-white mb-2">Lá chắn bảo vệ Chuỗi</h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Lá chắn đang kích hoạt để bảo vệ động lực của em. Nghỉ một ngày sẽ không làm mất chuỗi ngày học tập tích lũy.
                </p>
              </Card>
            </div>

            {/* Daily Ritual Launch Center */}
            <div className="rounded-[40px] border border-white/5 bg-gradient-to-r from-slate-950 via-slate-900 to-black p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="max-w-md mx-auto space-y-4">
                <Badge variant="gold" className="px-3 py-1">Mục tiêu Hôm nay</Badge>
                <h3 className="text-3xl font-display font-black text-white leading-tight">Nhiệm vụ Tiếng Anh hàng ngày đã sẵn sàng</h3>
                <p className="text-secondary text-sm leading-relaxed italic">
                  Một lộ trình tập trung 10 phút được cá nhân hóa: Luyện nghe sâu, Luyện nói nhại âm chấm điểm AI, và Trắc nghiệm phản xạ.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-xs font-bold text-white/30 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-amber-500" /> Nhiệm vụ Luyện nghe
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-violet-400" /> Trọng tâm Luyện nói
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-emerald-400" /> Phản xạ Siêu tốc
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveRitual(true);
                    setRitualCompleted(false);
                    setActiveNode(0);
                    setEarnedXP(0);
                  }}
                  className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:shadow-glow-gold hover:bg-amber-400 transition-all flex items-center gap-2 mx-auto"
                >
                  Bắt đầu Nghi thức <Play size={14} fill="currentColor" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ─── ACTIVE RITUAL MODE OVERLAY ─── */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary p-6 md:p-12 overflow-y-auto flex flex-col justify-between"
          >
            {/* Header ritual top bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <button 
                onClick={() => setActiveRitual(false)}
                className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
              >
                <X size={16} /> Thoát Nghi thức
              </button>

              <div className="text-center shrink-0">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Vòng lặp Nghi thức Tập trung</span>
                <h3 className="text-sm font-bold text-white">Chuyển hóa Hàng ngày</h3>
              </div>

              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full text-xs font-bold">
                <Zap size={14} className="text-amber-500" fill="currentColor" /> {earnedXP} XP
              </div>
            </div>

            {/* Ritual sequence player */}
            <div className="max-w-2xl w-full mx-auto my-auto space-y-8 py-8">
              {/* Timeline nodes progress */}
              <div className="flex items-center justify-between gap-2">
                {[0, 1, 2].map((nodeIdx) => (
                  <div 
                    key={nodeIdx}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                      nodeIdx === activeNode ? "bg-amber-500" : (nodeIdx < activeNode ? "bg-emerald-500" : "bg-white/5")
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {!ritualCompleted ? (
                  <motion.div
                    key={activeNode}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    {/* Node Content */}
                    {activeNode === 0 && (
                      /* NODE 1: Listening Dictation Ritual */
                      <div className="space-y-6">
                        <div className="space-y-2 text-center">
                          <Badge variant="violet" className="py-1 px-3">Tiết 1: Nghe sâu & Chính tả</Badge>
                          <h2 className="text-2xl md:text-3xl font-display font-black text-white">Chép chính tả Siêu tốc</h2>
                          <p className="text-secondary text-sm italic">Nghe câu thoại phim điện ảnh sau và điền từ còn thiếu vào ô trống.</p>
                        </div>

                        {/* Custom simulated audio card */}
                        <div className="rounded-3xl border border-white/5 bg-[#141414] p-6 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={playSimulatedAudio}
                              className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center hover:scale-105 transition-transform"
                            >
                              <Volume2 size={20} />
                            </button>
                            <div>
                              <h4 className="text-xs font-bold text-white">Đoạn âm thanh phim #14</h4>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Chạm để lắng nghe</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400">Tốc độ: 1.0x</span>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Văn bản em nghe được</label>
                          <input 
                            type="text"
                            value={dictationInput}
                            onChange={(e) => setDictationInput(e.target.value)}
                            placeholder="Nhập những gì em nghe được: 'Sharing housework strengthens family...'"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            onClick={handleVerifyDictation}
                            className="px-6 py-3 rounded-xl bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                          >
                            Kiểm tra Chính tả
                          </button>
                        </div>

                        {dictationFeedback && (
                          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Hệ thống: Độ chính xác tuyệt vời! Hãy chuyển sang phần luyện nói.
                          </div>
                        )}
                      </div>
                    )}

                    {activeNode === 1 && (
                      /* NODE 2: Speaking Shadowing Ritual */
                      <div className="space-y-6">
                        <div className="space-y-2 text-center">
                          <Badge variant="gold" className="py-1 px-3">Tiết 2: Nhịp điệu & Luyện nói</Badge>
                          <h2 className="text-2xl md:text-3xl font-display font-black text-white">Luyện nói nhại âm</h2>
                          <p className="text-secondary text-sm italic">Nghe câu thoại mẫu và nhắc lại với đúng nhịp điệu cảm xúc tự nhiên.</p>
                        </div>

                        {/* Text to shadow */}
                        <div className="p-6 rounded-3xl bg-[#141414] border border-white/5 text-center">
                          <p className="text-lg font-bold text-white italic">
                            "I strongly believe that sharing housework strengthens family bonds."
                          </p>
                        </div>

                        {/* Mic recording animation */}
                        <div className="flex flex-col items-center justify-center gap-4 py-4">
                          <motion.button 
                            onClick={handleRecordSpeech}
                            disabled={isRecording}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-glow-violet ${
                              isRecording ? "bg-red-500 animate-pulse" : "bg-violet-600 hover:bg-violet-500"
                            }`}
                          >
                            <Mic size={24} />
                          </motion.button>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                            {isRecording ? "Đang lắng nghe & phân tích ngữ điệu..." : "Chạm để Bắt đầu ghi âm"}
                          </span>
                        </div>

                        {/* Speach scores */}
                        {recordingSuccess && speechScores && (
                          <div className="rounded-2xl border border-white/5 bg-[#141414] p-4 grid grid-cols-2 gap-4 text-center">
                            <div>
                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Độ chuẩn phát âm</span>
                              <h5 className="text-xl font-bold text-emerald-400 mt-1">{speechScores.accuracy}%</h5>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Nhịp điệu & Trôi chảy</span>
                              <h5 className="text-xl font-bold text-amber-500 mt-1">{speechScores.rhythm}%</h5>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeNode === 2 && (
                      /* NODE 3: Vocabulary Exam Sprint */
                      <div className="space-y-6">
                        <div className="space-y-2 text-center">
                          <Badge variant="violet" className="py-1 px-3">Tiết 3: Đấu trường Từ vựng Siêu tốc</Badge>
                          <h2 className="text-2xl md:text-3xl font-display font-black text-white">Phản xạ Từ vựng</h2>
                          <p className="text-secondary text-sm italic">Chọn từ chính xác nhất để hoàn thành câu dưới áp lực thời gian.</p>
                        </div>

                        {/* Clock count */}
                        <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-xs font-black tracking-widest uppercase">
                          <Clock size={14} /> 00:{examTimer < 10 ? '0' : ''}{examTimer}
                        </div>

                        <div className="p-6 rounded-3xl bg-[#141414] border border-white/5">
                          <h4 className="text-md font-bold text-white">Everyone in my family has to be ________ for some chores.</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {["responsible", "respectful", "responsive", "reluctant"].map((opt) => {
                            const isSelected = vocabOption === opt;
                            const isCorrect = opt === "responsible";
                            let style = "bg-[#141414] border-white/5 text-white hover:border-white/20";
                            
                            if (vocabChecked) {
                              if (isCorrect) style = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                              else if (isSelected) style = "bg-red-500/10 border-red-500/30 text-red-400";
                            } else if (isSelected) {
                              style = "bg-amber-500/10 border-amber-500/30 text-amber-500";
                            }

                            return (
                              <button
                                key={opt}
                                disabled={vocabChecked}
                                onClick={() => handleSelectVocab(opt)}
                                className={`p-4 rounded-xl border text-sm font-bold text-left transition-all ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Navigation controllers */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      {streakCombo > 1 && (
                        <div className="flex items-center gap-1 text-xs font-black text-amber-500 uppercase tracking-widest animate-bounce">
                          <Zap size={14} fill="currentColor" /> Combo Chuỗi liên tục x{streakCombo}
                        </div>
                      )}
                      
                      <button
                        onClick={handleNextNode}
                        className="ml-auto px-6 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        {activeNode < 2 ? "Tiếp tục" : "Hoàn thành Nghi thức"} <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* RITUAL COMPLETED CEREMONY (INTEGRATING TOMORROW ENGINE V1) */
                  <motion.div
                    key="ceremony"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8 p-6 md:p-8"
                  >
                    {/* Subtle Celebration Badge & Reflection */}
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-glow-gold">
                      <Award size={32} />
                    </div>

                    <div className="space-y-2">
                      <Badge variant="violet" className="py-1 px-3">Chuỗi ngày học được duy trì</Badge>
                      <h2 className="text-3xl font-display font-black text-white">Nhiệm vụ Đã Hoàn Thành</h2>
                      <p className="text-secondary text-sm max-w-md mx-auto italic">
                        "{tomorrowMode.reminder}"
                      </p>
                    </div>

                    {/* Today's Results block */}
                    <div className="rounded-3xl border border-white/5 bg-[#141414]/60 p-5 max-w-sm mx-auto grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">XP Nhận được</span>
                        <h4 className="text-xl font-black text-amber-400">+{earnedXP} XP</h4>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Điểm chuẩn xác</span>
                        <h4 className="text-xl font-black text-emerald-400">
                          {speechScores ? speechScores.accuracy : 92}%
                        </h4>
                      </div>
                    </div>

                    {/* ─── TOMORROW ENGINE VAULT CHAMBER ─── */}
                    <div className="max-w-md mx-auto rounded-[32px] border border-white/5 bg-gradient-to-b from-[#11111e] to-black p-6 relative overflow-hidden space-y-4">
                      {/* Aura Color Indicator leak */}
                      <div 
                        className="absolute inset-0 rounded-full blur-[80px] pointer-events-none opacity-20 transition-all duration-700" 
                        style={{ backgroundColor: tomorrowMode.glow }}
                      />

                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock size={10} /> Thử thách ngày mai đang khóa
                        </span>
                        
                        <span className="font-mono text-xs font-bold text-amber-500 flex items-center gap-1">
                          <Clock size={12} className="animate-spin" style={{ animationDuration: "10s" }} /> {countdownText}
                        </span>
                      </div>

                      {/* Locked Content View */}
                      <AnimatePresence mode="wait">
                        {!holdReveal ? (
                          <motion.div 
                            key="locked"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-6 flex flex-col items-center justify-center gap-3 cursor-pointer group"
                            onClick={() => setHoldReveal(true)}
                          >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                              <Lock size={20} className="text-white/40 group-hover:text-amber-500 transition-colors" />
                            </div>
                            <h4 className="text-xs font-bold text-white/40 tracking-widest uppercase">Nhấp để xem trước thử thách ngày mai</h4>
                            <p className="text-[10px] text-white/20 italic">Zeigarnik tò mò sẵn sàng kích hoạt</p>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="revealed"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-left space-y-4 py-2 relative z-10"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest">{tomorrowMode.tone}</span>
                                <h4 className="text-lg font-display font-black text-white">{tomorrowMode.chamber}</h4>
                              </div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div 
                                    key={star} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      star <= tomorrowMode.difficulty ? "bg-amber-400" : "bg-white/10"
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <p className="text-xs text-white/60 leading-relaxed italic border-l-2 border-white/10 pl-3">
                              "{tomorrowMode.description}"
                            </p>

                            <div className="flex justify-between items-center text-[9px] font-bold text-white/30 uppercase tracking-widest pt-2 border-t border-white/5">
                              <span>Nhạc nền: Đại dương Tĩnh lặng</span>
                              <span>Mục tiêu: 150 XP</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Returning Controls */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setActiveRitual(false);
                          setActiveNode(0);
                        }}
                        className="px-8 py-3.5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                      >
                        Quay lại Phòng điều khiển
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
