"use client";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Bookmark, Play, Pause, RotateCcw, Settings2, ChevronDown, Volume2, Zap } from "lucide-react";
import { STORIES } from "@/lib/data";
import { useEffect } from "react";
import InteractiveOverlay from "@/components/stories/interactive/InteractiveOverlay";

const STORY_PARAGRAPHS = [
  {
    id: 1,
    text: "Power is not given. It is taken — quietly, patiently, and with the grace of someone who never reveals their intention.",
    words: ["Power", "is", "not", "given.", "It", "is", "taken", "—", "quietly,", "patiently,", "and", "with", "the", "grace", "of", "someone", "who", "never", "reveals", "their", "intention."],
  },
  {
    id: 2,
    text: "Robert Greene studied history's most dangerous men and found a disturbing truth: the rules of power have never changed — only the players.",
    words: ["Robert", "Greene", "studied", "history's", "most", "dangerous", "men", "and", "found", "a", "disturbing", "truth:", "the", "rules", "of", "power", "have", "never", "changed", "—", "only", "the", "players."],
  },
  {
    id: 3,
    text: "To be liked is temporary. To be feared is loud. But to be respected — silently, inevitably — that is the highest form of power.",
    words: ["To", "be", "liked", "is", "temporary.", "To", "be", "feared", "is", "loud.", "But", "to", "be", "respected", "—", "silently,", "inevitably", "—", "that", "is", "the", "highest", "form", "of", "power."],
  },
];

const VOCAB = [
  { word: "grace", definition: "vẻ thanh lịch và vẻ đẹp của cử động hoặc biểu đạt", example: "Cô ấy xử lý cuộc khủng hoảng với một sự thanh lịch phi thường." },
  { word: "intention", definition: "một điều dự định; một mục đích hoặc kế hoạch", example: "Ý định thực sự của anh ta chưa bao giờ được tiết lộ." },
  { word: "disturbing", definition: "gây lo lắng hoặc khó chịu", example: "Những phát hiện này thực sự gây khó chịu." },
];

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const story = STORIES.find((s) => s.id === id) || STORIES[0];
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [highlightMode, setHighlightMode] = useState(false);
  const [activeVocab, setActiveVocab] = useState<typeof VOCAB[0] | null>(null);
  const [progress, setProgress] = useState(42);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState<any>(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);

  // Mock Checkpoints
  const checkpoints = [
    {
      id: "cp1",
      timestamp_seconds: 5,
      type: "prediction",
      question_data: {
        context: "Context: Intentional Power",
        question: "Why does the narrator suggest power should be taken 'quietly'?",
        options: [
          "To avoid immediate resistance",
          "Because they are afraid",
          "To save energy for later",
          "It's just a tradition"
        ],
        correctIndex: 0
      }
    }
  ];

  // Simulated Timer for demo
  useEffect(() => {
    let interval: any;
    if (playing && !activeCheckpoint) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          // Check for checkpoint
          const cp = checkpoints.find(c => c.timestamp_seconds === next && !completedCheckpoints.includes(c.id));
          if (cp) {
            setPlaying(false);
            setActiveCheckpoint(cp);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing, activeCheckpoint, completedCheckpoints]);

  const handleCheckpointComplete = (isCorrect: boolean, responseTime: number) => {
    if (activeCheckpoint) {
      setCompletedCheckpoints([...completedCheckpoints, activeCheckpoint.id]);
    }
    setActiveCheckpoint(null);
    setPlaying(true);
    // In real app, we would send stats to Supabase here
  };

  const toggleSave = (word: string) => {
    setSavedWords((prev) => prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]);
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center gap-4 h-16">
            <Link href="/stories" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="font-bold font-display truncate">{story.title}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{story.category} · {story.level} · {story.duration}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-gold">+{story.xp} XP</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="progress-bar mx-0 -mb-px">
            <motion.div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div className="container-custom py-8 max-w-3xl">
        {/* Story cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`h-48 md:h-64 rounded-2xl bg-gradient-to-br ${story.color} flex items-center justify-center text-7xl mb-8 relative overflow-hidden`}
        >
          <div className="card-overlay" />
          <span className="relative z-10">{story.emoji}</span>
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="text-lg font-display font-bold mb-1">{story.title}</div>
            <div className="text-sm opacity-80">{story.description}</div>
          </div>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
            >
              {playing ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
            </button>

            {/* Waveform */}
            <div className="flex-1 flex items-center gap-[2px] h-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar flex-1"
                  style={{
                    height: `${Math.sin(i * 0.5) * 12 + 14}px`,
                    animationDelay: `${i * 0.04}s`,
                    animationPlayState: playing ? "running" : "paused",
                    opacity: i / 40 < progress / 100 ? 1 : 0.25,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeed(speed === 1.0 ? 0.75 : speed === 0.75 ? 0.5 : 1.0)}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold"
                style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" }}
              >
                {speed}×
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <RotateCcw size={16} style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setHighlightMode(!highlightMode)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: highlightMode ? "rgba(245,200,66,0.15)" : "rgba(255,255,255,0.05)",
                color: highlightMode ? "#f5c842" : "var(--text-secondary)",
                border: `1px solid ${highlightMode ? "rgba(245,200,66,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              ✏️ Chế độ Tô màu
            </button>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              💾 Đã lưu {savedWords.length} từ
            </span>
          </div>
        </motion.div>

        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 mb-8"
        >
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Volume2 size={18} style={{ color: "#a78bfa" }} /> Lời thoại
          </h2>
          {STORY_PARAGRAPHS.map((para, pi) => (
            <div key={para.id} className="glass-card p-5">
              <p className="text-base leading-relaxed" style={{ lineHeight: "2" }}>
                {para.words.map((word, wi) => {
                  const clean = word.replace(/[.,!?—:]/g, "").toLowerCase();
                  const isSaved = savedWords.includes(clean);
                  const isActive = activeWord === clean;
                  return (
                    <span key={wi}>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setActiveWord(clean);
                          const v = VOCAB.find((v) => v.word === clean);
                          setActiveVocab(v || null);
                          if (highlightMode) toggleSave(clean);
                        }}
                        className="cursor-pointer rounded px-0.5 transition-all"
                        style={{
                          background: isSaved ? "rgba(245,200,66,0.18)" : isActive ? "rgba(139,92,246,0.2)" : "transparent",
                          color: isSaved ? "#f5c842" : isActive ? "#a78bfa" : "inherit",
                          textDecoration: VOCAB.find((v) => v.word === clean) ? "underline dotted" : "none",
                          textDecorationColor: "#6366f1",
                        }}
                      >
                        {word}
                      </motion.span>
                      {" "}
                    </span>
                  );
                })}
              </p>
              <button
                className="mt-2 text-xs flex items-center gap-1"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setPlaying(!playing)}
              >
                <Play size={10} /> Nghe lại câu này
              </button>
            </div>
          ))}
        </motion.div>

        {/* Vocab popup */}
        <AnimatePresence>
          {activeVocab && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:max-w-sm glass-card p-5 z-50"
              style={{ borderColor: "rgba(139,92,246,0.35)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-display font-bold text-lg">{activeVocab.word}</div>
                <button onClick={() => setActiveVocab(null)} className="text-sm" style={{ color: "var(--text-secondary)" }}>✕</button>
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{activeVocab.definition}</p>
              <p className="text-xs italic mb-3" style={{ color: "var(--text-muted)" }}>"<span style={{ color: "#f5c842" }}>{activeVocab.example}</span>"</p>
              <button
                onClick={() => { toggleSave(activeVocab.word); }}
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{
                  background: savedWords.includes(activeVocab.word) ? "rgba(245,200,66,0.15)" : "rgba(139,92,246,0.15)",
                  color: savedWords.includes(activeVocab.word) ? "#f5c842" : "#a78bfa",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {savedWords.includes(activeVocab.word) ? "✓ Đã lưu" : "+ Lưu từ vựng"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grammar notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            🧠 Điểm nhấn Ngữ pháp
          </h2>
          <div className="space-y-4">
            {[
              {
                pattern: "not given → is taken",
                explanation: "Câu bị động được dùng để tạo hiệu ứng kịch tính. So sánh: 'Ai đó chiếm đoạt quyền lực' (chủ động) vs. 'Quyền lực bị chiếm đoạt' (bị động — tập trung vào hành động, không phải chủ thể).",
              },
              {
                pattern: "To be liked / To be feared",
                explanation: "Cụm từ nguyên mẫu được dùng làm chủ ngữ. Tạo ra tông giọng triết học, cân bằng đặc trưng của văn viết tiếng Anh cao cấp.",
              },
            ].map((g) => (
              <div key={g.pattern} className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="font-mono text-sm mb-1" style={{ color: "#a78bfa" }}>{g.pattern}</div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{g.explanation}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shadow speaking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-card p-6 text-center"
          style={{ borderColor: "rgba(6,182,212,0.2)" }}
        >
          <div className="text-2xl mb-2">🎤</div>
          <div className="font-display font-bold mb-2">Chế độ Shadow Speaking</div>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Nghe một câu, sau đó ghi âm lại chính mình. AI của chúng tôi sẽ chấm điểm phát âm của bạn ngay lập tức.
          </p>
          <Link href="/coach" className="btn-primary justify-center" style={{ display: "inline-flex" }}>
            <Zap size={16} /> Mở AI Coach
          </Link>
        </motion.div>
      </div>

      {/* Interactive Quiz Overlay */}
      <InteractiveOverlay 
        isActive={!!activeCheckpoint} 
        checkpoint={activeCheckpoint} 
        onComplete={handleCheckpointComplete} 
      />
    </div>
  );
}
