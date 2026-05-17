"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Mic, 
  Play, 
  BookOpen, 
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface Question {
  id: string;
  type: "listening" | "speaking" | "reading";
  prompt: string;
  audioUrl?: string;
  maxReplays?: number;
  options?: string[];
  passage?: string;
}

const MOCK_QUESTIONS: Question[] = [
  // Listening Section
  { 
    id: "q1", 
    type: "listening", 
    prompt: "According to the speaker, what is the main driver of changes in global microclimates?", 
    audioUrl: "climate_lecture.mp3", 
    maxReplays: 2, 
    options: [
      "Solar flares and cosmological cycles",
      "Human industrial activities and localized deforestation",
      "Natural migration patterns of migratory species",
      "Fluctuations in geothermal energy releases"
    ] 
  },
  { 
    id: "q2", 
    type: "listening", 
    prompt: "Dictation: Fill in the missing words from the second part of the lecture.", 
    audioUrl: "dictation_part.mp3", 
    maxReplays: 2 
  },
  // Speaking Section
  { 
    id: "q3", 
    type: "speaking", 
    prompt: "Read the following academic statement aloud. Pay attention to rhythmic pauses and natural phoneme connections:", 
    passage: "The rapid fluctuation of oceanic currents has directly affected local ecological balances, creating an environment ripe for microclimate anomalies." 
  },
  // Reading Section
  { 
    id: "q4", 
    type: "reading", 
    prompt: "Based on the text, what does the author imply about future research priorities?", 
    passage: "Academic institutions have historically prioritized superficial climatological indicators over systemic oceanic fluctuations. However, new telemetry models have demonstrated that ocean currents serve as the foundational drivers of atmospheric moisture. Consequently, the research focus is inevitably shifting toward deep-water thermal profiling, which researchers believe will unlock long-term projection capabilities.", 
    options: [
      "Climatological indicators will remain the primary research focus.",
      "Academic priority is transitioning toward deep-water thermal profiling.",
      "Ocean telemetry models will be replaced by atmospheric satellites.",
      "Moisture calculations should be completely disregarded."
    ] 
  }
];

export default function ExamPlayer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = resolvedParams?.id || "";

  // Exam States
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [currentSection, setCurrentSection] = useState<"listening" | "speaking" | "reading">("listening");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Audio Playback simulation
  const [replaysUsed, setReplaysUsed] = useState<Record<string, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState(1.0);
  const [audioProgress, setAudioProgress] = useState(0);

  // Voice recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(false);
  const [speakingMetrics, setSpeakingMetrics] = useState<{
    accuracy: number;
    rhythm: number;
    confidence: number;
  } | null>(null);

  // Countdown timer
  useEffect(() => {
    if (examSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examSubmitted]);

  // Audio progress simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + (2.5 * audioPlaybackSpeed);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, audioPlaybackSpeed]);

  const activeQuestion = MOCK_QUESTIONS.filter(q => q.type === currentSection)[activeQuestionIdx] || MOCK_QUESTIONS[0];

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePlayAudio = (qId: string) => {
    const used = replaysUsed[qId] || 0;
    if (used >= 2) return; // play limit reached

    setReplaysUsed({ ...replaysUsed, [qId]: used + 1 });
    setIsPlayingAudio(true);
    setAudioProgress(0);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setSpeakingMetrics(null);
    setRecordedAudio(false);
    setTimeout(() => {
      setIsRecording(false);
      setRecordedAudio(true);
      setSpeakingMetrics({
        accuracy: 91,
        rhythm: 88,
        confidence: 94
      });
    }, 4000);
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
  };

  return (
    <div className="bg-primary min-h-screen text-white flex flex-col font-sans antialiased">
      
      {/* ─── FULL SCREEN FOCUS HEADER ─── */}
      <header className="border-b border-white/5 bg-[#08080c] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <span className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer block">
              <ChevronLeft size={16} />
            </span>
          </Link>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Mock IELTS Foundation — Section {currentSection.toUpperCase()}
            </h2>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
              Secure Assessment Mode • ID: {examId.substring(0, 8)}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-amber-500">
          <Clock size={14} /> {formatTime(timeLeft)}
        </div>
      </header>

      {/* ─── SECTION PROGRESS TABS ─── */}
      <div className="bg-[#0b0b10] px-8 py-3 border-b border-white/5 flex items-center gap-6">
        {[
          { id: "listening", label: "1. Listening Practice", icon: Volume2 },
          { id: "speaking", label: "2. Speaking Cohort", icon: Mic },
          { id: "reading", label: "3. Reading Telemetry", icon: BookOpen }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => {
              if (examSubmitted) return;
              setCurrentSection(sec.id as any);
              setActiveQuestionIdx(0);
            }}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              currentSection === sec.id 
                ? "text-violet-400 border-b-2 border-violet-500 pb-1" 
                : "text-white/30 hover:text-white/60"
            }`}
          >
            <sec.icon size={12} /> {sec.label}
          </button>
        ))}
      </div>

      {/* ─── EXAM ASSESSMENT WINDOW ─── */}
      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {examSubmitted ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle size={36} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-black text-white">Exam Attempt Saved</h2>
                <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                  Your academic test has been dispatched. Automatic speech assessments and listening profiles have been calculated.
                </p>
              </div>

              {/* Mock Results */}
              <Card className="p-6 max-w-md w-full border-white/5 bg-white/[0.01] grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">Total Score</span>
                  <span className="text-2xl font-mono font-black text-white">88/100</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">Listening</span>
                  <span className="text-2xl font-mono font-black text-violet-400">92%</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block">Speaking</span>
                  <span className="text-2xl font-mono font-black text-amber-500">91%</span>
                </div>
              </Card>

              <div className="pt-4">
                <Link href="/dashboard">
                  <span className="px-6 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors cursor-pointer">
                    Về Bảng điều khiển
                  </span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={currentSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-y-auto lg:overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-white/5"
            >
              
              {/* Left Column: Context / Stimulus */}
              <div className="p-8 space-y-6 overflow-y-auto">
                <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block">
                  Question Stimulus Source
                </span>

                {currentSection === "listening" && (
                  <div className="space-y-6">
                    <Card className="p-6 border-white/5 bg-white/[0.01] space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/30 uppercase">Academic Lecture Audio</span>
                        <div className="flex gap-1.5">
                          {[1.0, 1.25, 1.5].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setAudioPlaybackSpeed(speed)}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                                audioPlaybackSpeed === speed 
                                  ? "bg-white text-black" 
                                  : "bg-white/5 text-white/40 hover:text-white"
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Playback Progress Waveform simulation */}
                      <div className="space-y-3">
                        <div className="h-6 bg-white/5 rounded-lg flex items-center px-3 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 bg-violet-600/10 transition-all duration-100" style={{ width: `${audioProgress}%` }} />
                          {/* Visual Waveform bars */}
                          <div className="flex items-center gap-0.5 z-10 w-full justify-between opacity-40">
                            {Array.from({ length: 48 }).map((_, i) => (
                              <div key={i} className="w-[2px] bg-white rounded-full" style={{ height: `${Math.sin(i * 0.4) * 12 + 14}px` }} />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono text-white/30">
                          <span>Progress: {Math.round(audioProgress)}%</span>
                          <span>Replays used: {replaysUsed[activeQuestion.id] || 0} / 2</span>
                        </div>
                      </div>

                      {/* Trigger Play button */}
                      <button
                        onClick={() => handlePlayAudio(activeQuestion.id)}
                        disabled={isPlayingAudio || (replaysUsed[activeQuestion.id] || 0) >= 2}
                        className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:bg-white"
                      >
                        <Play size={14} /> Play Audio Stimulus
                      </button>
                    </Card>

                    <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] flex items-start gap-3">
                      <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        Under realistic examination conditions, audio stimulus is locked to **max 2 replays** and speeds cannot be adjusted once playing has initiated.
                      </p>
                    </div>
                  </div>
                )}

                {currentSection === "speaking" && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-white leading-relaxed">
                      {activeQuestion.prompt}
                    </h3>
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] font-serif text-lg leading-relaxed text-white/80 select-none italic">
                      "{activeQuestion.passage}"
                    </div>

                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/30 uppercase">Oral Recording Engine</span>
                        {isRecording && <span className="text-[9px] font-mono text-red-500 animate-pulse font-bold">RECORDING ONGOING...</span>}
                      </div>

                      {isRecording ? (
                        <div className="h-10 bg-red-950/10 rounded-lg flex items-center justify-center gap-1">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1 bg-red-500 rounded-full animate-bounce" 
                              style={{ 
                                height: `${Math.random() * 20 + 8}px`,
                                animationDelay: `${i * 0.1}s`
                              }} 
                            />
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={handleStartRecording}
                          className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                        >
                          <Mic size={14} /> Click to Record Reading response
                        </button>
                      )}

                      {/* Display Speech results simulation */}
                      {speakingMetrics && (
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">AI Oral Assessment metrics</span>
                          
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                              <span className="text-[8px] text-white/30 uppercase block">Accuracy</span>
                              <span className="text-sm font-mono font-bold text-white">{speakingMetrics.accuracy}%</span>
                            </div>
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                              <span className="text-[8px] text-white/30 uppercase block">Rhythm</span>
                              <span className="text-sm font-mono font-bold text-violet-400">{speakingMetrics.rhythm}%</span>
                            </div>
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                              <span className="text-[8px] text-white/30 uppercase block">Confidence</span>
                              <span className="text-sm font-mono font-bold text-amber-500">{speakingMetrics.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentSection === "reading" && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-white leading-relaxed">Reading Telemetry</h3>
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-xs leading-relaxed text-white/60 space-y-4 max-h-[300px] overflow-y-auto select-none">
                      <p>{activeQuestion.passage}</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Interactive assessment questions */}
              <div className="p-8 space-y-6 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-6">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">
                    Interactive Question Input
                  </span>

                  <h3 className="text-md font-bold text-white leading-relaxed">
                    {activeQuestion.prompt}
                  </h3>

                  {/* Multiple Choice Answers */}
                  {activeQuestion.options ? (
                    <div className="space-y-2.5">
                      {activeQuestion.options.map((option, idx) => {
                        const isSelected = answers[activeQuestion.id] === option;
                        return (
                          <button
                            key={idx}
                            onClick={() => setAnswers({ ...answers, [activeQuestion.id]: option })}
                            className={`w-full p-4 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                              isSelected 
                                ? "border-violet-500 bg-violet-600/5 text-white" 
                                : "border-white/5 bg-white/[0.01] hover:border-white/10 text-white/70"
                            }`}
                          >
                            <span>{option}</span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-violet-500 bg-violet-500" : "border-white/10"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    currentSection === "listening" && (
                      <div className="space-y-4">
                        <textarea
                          value={answers[activeQuestion.id] || ""}
                          onChange={(e) => setAnswers({ ...answers, [activeQuestion.id]: e.target.value })}
                          placeholder="Type the dictation passage here as you listen..."
                          className="w-full bg-[#121216] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-violet-500 h-[120px] resize-none"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Navigation and Submits */}
                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                  <button
                    disabled={activeQuestionIdx === 0}
                    onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40 transition-colors"
                  >
                    Previous Question
                  </button>

                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-3 rounded-xl bg-violet-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-violet-500 transition-colors"
                  >
                    Submit Exam Paper
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
