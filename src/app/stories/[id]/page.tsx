"use client";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Bookmark, Play, Pause, RotateCcw, Settings2, ChevronDown, Volume2, Zap } from "lucide-react";
import { STORIES } from "@/lib/data";
import { useEffect, useRef } from "react";
import InteractiveOverlay from "@/components/stories/interactive/InteractiveOverlay";
import { getOrGenerateAudio } from "@/app/actions/audio";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import VoiceRecorder from "@/components/coach/VoiceRecorder";

const getStoryEmoji = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("godfather") || t.includes("bố già")) return "🌹";
  if (t.includes("dark knight") || t.includes("hiệp sĩ bóng đêm") || t.includes("batman")) return "🦇";
  if (t.includes("forrest") || t.includes("gump")) return "🏃";
  if (t.includes("titanic")) return "🚢";
  if (t.includes("lion king") || t.includes("vua sư tử")) return "🦁";
  return "🎬";
};

const getStoryColor = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("godfather")) return "from-red-950 to-bg-primary";
  if (t.includes("dark knight")) return "from-slate-900 to-bg-primary";
  if (t.includes("forrest")) return "from-amber-950 to-bg-primary";
  if (t.includes("titanic")) return "from-blue-950 to-bg-primary";
  if (t.includes("lion king")) return "from-yellow-950 to-bg-primary";
  return "from-violet-950 to-bg-primary";
};

const getStoryCategory = (difficulty: string) => {
  const diff = difficulty.toLowerCase();
  if (diff === 'easy' || diff === 'beginner') return "CƠ BẢN";
  if (diff === 'medium' || diff === 'intermediate') return "TRUNG CẤP";
  return "NÂNG CAO";
};

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
  const [story, setStory] = useState<any>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [highlightMode, setHighlightMode] = useState(false);
  const [activeVocab, setActiveVocab] = useState<typeof VOCAB[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState<any>(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);
  
  const [activeParagraphText, setActiveParagraphText] = useState(STORY_PARAGRAPHS[0].text);
  const [isRecorderGlow, setIsRecorderGlow] = useState(false);
  const recorderRef = useRef<HTMLDivElement>(null);

  const handleScrollToRecorder = (e: React.MouseEvent) => {
    e.preventDefault();
    if (recorderRef.current) {
      recorderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsRecorderGlow(true);
      setTimeout(() => {
        setIsRecorderGlow(false);
      }, 1000);
    }
  };

  useEffect(() => {
    async function loadStoryData() {
      try {
        const supabase = createSupabaseBrowserClient();
        
        // 1. Fetch story from database
        const { data: dbStory, error: storyError } = await supabase
          .from("stories")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        let activeStory = null;

        if (dbStory) {
          activeStory = {
            id: dbStory.id,
            title: dbStory.title,
            description: dbStory.description || "Học tiếng Anh qua thước phim kinh điển.",
            coverImage: dbStory.thumbnail_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
            difficulty: dbStory.difficulty,
            level: dbStory.difficulty === 'easy' ? 'B1' : dbStory.difficulty === 'medium' ? 'B2' : 'C1',
            emoji: getStoryEmoji(dbStory.title),
            color: getStoryColor(dbStory.title),
            category: getStoryCategory(dbStory.difficulty),
            duration: dbStory.difficulty === 'easy' ? '05:00' : dbStory.difficulty === 'medium' ? '08:00' : '12:00',
            xp: dbStory.difficulty === 'easy' ? 200 : dbStory.difficulty === 'medium' ? 300 : 400
          };
        } else {
          // Fallback to static STORIES match if not in DB
          const staticMatch = STORIES.find((s) => s.id === id) || STORIES[0];
          activeStory = staticMatch;
        }

        setStory(activeStory);

        // 2. Fetch the corresponding lesson to link Mở AI Coach to a real lesson
        if (activeStory) {
          const { data: dbLesson } = await supabase
            .from("lessons")
            .select("id")
            .ilike("title", `%${activeStory.title}%`)
            .limit(1)
            .maybeSingle();

          if (dbLesson) {
            setLessonId(dbLesson.id);
          }
        }
      } catch (err) {
        console.error("Failed to load story details:", err);
        setStory(STORIES.find((s) => s.id === id) || STORIES[0]);
      } finally {
        setLoading(false);
      }
    }
    loadStoryData();
  }, [id]);

  // Real Audio Pipeline states
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playingParagraphId, setPlayingParagraphId] = useState<number | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Synchronize playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playClientSpeech = (text: string, onEnd?: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Microsoft Zira'))
      );
      if (premiumVoice) utterance.voice = premiumVoice;
      if (onEnd) utterance.onend = onEnd;
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };

  const handleCheckpointComplete = (isCorrect: boolean, responseTime: number) => {
    if (activeCheckpoint) {
      setCompletedCheckpoints([...completedCheckpoints, activeCheckpoint.id]);
    }
    setActiveCheckpoint(null);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setPlaying(true);
    }
  };

  const handlePlayPause = async () => {
    const fullText = STORY_PARAGRAPHS.map(p => p.text).join(" ");

    // If using speechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking && playingParagraphId === null) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    // If playing a paragraph, pause it first
    if (playingParagraphId !== null) {
      if (audioRef.current) audioRef.current.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingParagraphId(null);
    }

    if (audioUrl) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {
          setPlaying(true);
          playClientSpeech(fullText, () => setPlaying(false));
        });
        setPlaying(true);
      }
      return;
    }

    // Load full story audio
    setLoadingAudio(true);
    const res = await getOrGenerateAudio({
      text: fullText,
      category: 'stories',
      voice: 'nova'
    });

    setLoadingAudio(false);
    if (res.success && res.audioUrl) {
      setAudioUrl(res.audioUrl);
      const audio = new Audio(res.audioUrl);
      audio.playbackRate = speed;

      const fallbackToSpeech = () => {
        setPlaying(true);
        playClientSpeech(fullText, () => setPlaying(false));
      };

      audio.addEventListener('error', () => {
        fallbackToSpeech();
      });

      audio.addEventListener('timeupdate', () => {
        const cur = audio.currentTime;
        const dur = audio.duration || 1;
        setCurrentTime(Math.round(cur));
        setProgress(Math.round((cur / dur) * 100));

        // Check for checkpoints
        const next = Math.round(cur);
        const cp = checkpoints.find(c => c.timestamp_seconds === next && !completedCheckpoints.includes(c.id));
        if (cp) {
          audio.pause();
          setPlaying(false);
          setActiveCheckpoint(cp);
        }
      });

      audio.addEventListener('ended', () => {
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });

      audioRef.current = audio;
      audio.play().catch((err) => {
        console.warn("Play failed, using speech synthesis fallback:", err);
        fallbackToSpeech();
      });
      setPlaying(true);
    } else {
      setPlaying(true);
      playClientSpeech(fullText, () => setPlaying(false));
    }
  };

  const handlePlayParagraph = async (paraId: number, text: string) => {
    // If full audio is playing or speech is active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (playingParagraphId === null && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    }

    if (playingParagraphId === paraId) {
      if (playing) {
        audioRef.current?.pause();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
        setPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {
          setPlaying(true);
          playClientSpeech(text, () => {
            setPlaying(false);
            setPlayingParagraphId(null);
          });
        });
        setPlaying(true);
      }
      return;
    }

    // Stop current audio if any
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setLoadingAudio(true);
    setPlayingParagraphId(paraId);

    const res = await getOrGenerateAudio({
      text,
      category: 'stories',
      voice: 'nova'
    });

    setLoadingAudio(false);
    if (res.success && res.audioUrl) {
      const audio = new Audio(res.audioUrl);
      audio.playbackRate = speed;

      const fallbackToSpeech = () => {
        setPlaying(true);
        playClientSpeech(text, () => {
          setPlaying(false);
          setPlayingParagraphId(null);
        });
      };

      audio.addEventListener('error', () => {
        fallbackToSpeech();
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(Math.round(audio.currentTime));
      });

      audio.addEventListener('ended', () => {
        setPlaying(false);
        setPlayingParagraphId(null);
      });

      audioRef.current = audio;
      audio.play().catch((err) => {
        console.warn("Play failed, using speech synthesis fallback:", err);
        fallbackToSpeech();
      });
      setPlaying(true);
    } else {
      setPlaying(true);
      playClientSpeech(text, () => {
        setPlaying(false);
        setPlayingParagraphId(null);
      });
    }
  };

  const toggleSave = (word: string) => {
    setSavedWords((prev) => prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]);
  };

  if (loading || !story) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-secondary">Đang chuẩn bị thước phim...</p>
        </div>
      </div>
    );
  }

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
              onClick={handlePlayPause}
              disabled={loadingAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 ${
                loadingAudio ? "opacity-50 cursor-wait" : ""
              }`}
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
            >
              {loadingAudio ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : playing && playingParagraphId === null ? (
                <Pause size={18} className="text-white" />
              ) : (
                <Play size={18} className="text-white ml-0.5" />
              )}
            </button>

            {/* Real dynamic waveform */}
            <div className="flex-1 flex items-center gap-[2px] h-8 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => {
                const isActive = playing && playingParagraphId === null;
                const progressRatio = progress / 100;
                const barRatio = i / 40;
                
                return (
                  <div
                    key={i}
                    className="waveform-bar flex-1 rounded-full transition-all duration-300"
                    style={{
                      height: `${isActive ? Math.abs(Math.sin(currentTime + i * 0.15)) * 14 + 6 : 6}px`,
                      background: barRatio < progressRatio ? "linear-gradient(to top, #8b5cf6, #a78bfa)" : "rgba(255,255,255,0.08)",
                    }}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeed(speed === 1.0 ? 0.75 : speed === 0.75 ? 0.5 : speed === 0.5 ? 1.25 : speed === 1.25 ? 1.5 : 1.0)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all hover:bg-violet-500/20"
                style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" }}
              >
                {speed}×
              </button>
              <button 
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setProgress(0);
                    setCurrentTime(0);
                  }
                }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
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
          {STORY_PARAGRAPHS.map((para, pi) => {
            const isParagraphPlaying = playing && playingParagraphId === para.id;
            
            return (
              <div 
                key={para.id} 
                className={`glass-card p-5 transition-all duration-300 ${
                  isParagraphPlaying ? "border-violet-500/30 bg-violet-500/[0.02] shadow-glow-violet" : ""
                }`}
              >
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
                            setActiveParagraphText(para.text);
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
                  className={`mt-2 text-xs flex items-center gap-1.5 transition-colors font-bold ${
                    isParagraphPlaying ? "text-violet-400" : "text-[#8b5cf6]"
                  }`}
                  onClick={() => {
                    handlePlayParagraph(para.id, para.text);
                    setActiveParagraphText(para.text);
                  }}
                >
                  {isParagraphPlaying ? <Pause size={10} /> : <Play size={10} />} 
                  {isParagraphPlaying ? "Đang phát..." : "Nghe lại câu này"}
                </button>
              </div>
            );
          })}
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
          <button 
            onClick={handleScrollToRecorder} 
            className="btn-primary justify-center cursor-pointer" 
            style={{ display: "inline-flex" }}
          >
            <Zap size={16} /> Mở AI Coach 🎤
          </button>
        </motion.div>

        {/* Embedded AI Voice Studio component area */}
        <div 
          ref={recorderRef}
          className={`mt-10 p-6 md:p-8 rounded-[32px] bg-black/40 border transition-all duration-500 ${
            isRecorderGlow 
              ? "border-amber-400 ring-4 ring-amber-400/20 shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.02]" 
              : "border-white/5"
          }`}
        >
          <div className="text-center mb-6">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">AI Voice Coach</span>
            <h3 className="text-xl font-display font-black text-white">Phòng Luyện Nói Phản Xạ</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
              Đọc to câu thoại dưới đây để AI phân tích phát âm, ngữ điệu và độ lưu loát của bạn ngay lập tức.
            </p>
          </div>

          {/* Active Sentence to read */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center mb-8">
            <p className="text-lg md:text-xl font-bold text-white mb-2 leading-relaxed">
              "{activeParagraphText}"
            </p>
            <span className="text-[10px] text-white/40 uppercase font-black tracking-wider">
              Nhấp bất kỳ câu thoại hoặc từ nào ở trên để đổi câu luyện tập
            </span>
          </div>

          <VoiceRecorder 
            sentence={activeParagraphText}
            onComplete={(blob, feedback) => {
              console.log("Story recording complete", feedback);
            }}
            accentColor="#f59e0b"
          />
        </div>
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
