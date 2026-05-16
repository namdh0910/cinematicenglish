"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Sparkles, Trophy } from "lucide-react";
import AtmosphereLayer from "./AtmosphereLayer";
import TranscriptPanel from "./TranscriptPanel";
import AudioControls from "./AudioControls";
import AICoachPanel from "../coach/AICoachPanel";
import { STORIES, Story } from "@/lib/data";
import SocialShareEngine from "../social/SocialShareEngine";
import ReflectionEngine from "../journal/ReflectionEngine";
import { Share2 } from "lucide-react";
import Badge from "../ui/Badge";

interface StoryPlayerProps {
  storyId: string;
  onClose: () => void;
}

export default function StoryPlayer({ storyId, onClose }: StoryPlayerProps) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShadowing, setIsShadowing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showMomentum, setShowMomentum] = useState(false);
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load story data
  useEffect(() => {
    const story = STORIES.find(s => s.id === storyId);
    if (story) {
      setCurrentStory(story);
      // In a real app, duration would come from audio metadata
      setDuration(120); 
    }
  }, [storyId]);

  const handleSaveMoment = () => {
    const currentLine = currentStory?.transcript.find(l => currentTime >= l.startTime && currentTime <= l.endTime);
    if (currentLine && !savedQuotes.includes(currentLine.text)) {
      setSavedQuotes([...savedQuotes, currentLine.text]);
      // Show subtle feedback
    }
  };

  const handleFinishStory = () => {
    setShowMomentum(false);
    setShowReflection(true);
  };

  const handleSaveReflection = (reflection: { content: string, tags: string[] }) => {
    // In a real app, this would save to the DB/Context
    console.log("Saving reflection:", reflection);
    setShowReflection(false);
    onClose();
  };

  // Handle auto-focus mode
  useEffect(() => {
    const handleActivity = () => {
      setIsFocusMode(false);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        if (isPlaying) setIsFocusMode(true);
      }, 5000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isPlaying]);

  // Mock audio progress for the demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            setShowMomentum(true);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  if (!currentStory) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-[100] flex flex-col bg-black text-white selection:bg-amber-400/30 overflow-hidden"
    >
      <AtmosphereLayer mood={currentStory.mood} isFocusMode={isFocusMode} />

      {/* Header UI */}
      <motion.header 
        animate={{ opacity: isFocusMode ? 0 : 1, y: isFocusMode ? -20 : 0 }}
        className="relative z-[60] p-6 md:p-10 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 pointer-events-auto">
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-2">
                <Sparkles size={12} /> {currentStory.category}
              </div>
              <h2 className="text-lg font-display font-bold">{currentStory.title}</h2>
            </div>
          </div>
          
          <div className="pointer-events-auto flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10">
              <Trophy size={16} className="text-amber-400" />
              <span className="text-sm font-mono">+120 XP</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Experience Area */}
      <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden pt-[var(--safe-top)]">
        {/* Left: Atmospheric Visual & Controls */}
        <div className={`relative flex flex-col transition-all duration-1000 ease-cinematic ${isFocusMode ? 'flex-[0.3] md:flex-[0.4] opacity-40 grayscale blur-md pointer-events-none' : 'flex-1 md:flex-[0.6]'}`}>
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-6 md:space-y-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-48 h-48 md:w-80 md:h-80 rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl group border border-white/10"
            >
              <img src={currentStory.coverImage} alt={currentStory.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </motion.div>

            <div className="space-y-3 md:space-y-6 max-w-lg">
              <Badge variant="violet" className="px-3 py-1 text-[10px] tracking-[0.2em]">{currentStory.category}</Badge>
              <h1 className="text-3xl md:text-6xl font-display font-black tracking-tighter leading-[0.95]">{currentStory.title}</h1>
              <p className="text-secondary italic text-sm md:text-lg font-light leading-relaxed px-4 md:px-0">"{currentStory.hookLine}"</p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Transcript / Coach Panel */}
        <div className={`relative flex flex-col transition-all duration-1000 ease-cinematic bg-black/40 backdrop-blur-xl border-l border-white/5 z-50 ${isFocusMode || isShadowing ? 'flex-1 md:flex-[0.6]' : 'flex-0 md:flex-[0.4] h-0 md:h-auto overflow-hidden opacity-0 translate-y-20'}`}>
          <div className="flex-1 overflow-hidden relative flex flex-col">
            <AnimatePresence mode="wait">
              {isShadowing ? (
                <motion.div
                  key="coach"
                  initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full flex items-center justify-center"
                >
                  <AICoachPanel 
                    sentence={currentStory.challenge.sentence} 
                    translation={currentStory.challenge.translation} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="h-full w-full"
                >
                  <TranscriptPanel 
                    transcript={currentStory.transcript} 
                    currentTime={currentTime}
                    onLineClick={(time) => setCurrentTime(time)}
                    isShadowing={isShadowing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Cinematic State Transition Overlay */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-black z-[150] pointer-events-none"
      />

      {/* Footer Controls */}
      <motion.div 
        animate={{ opacity: isFocusMode ? 0 : 1, y: isFocusMode ? 20 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50"
      >
        <AudioControls 
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSeek={(time) => setCurrentTime(time)}
          onReplaySentence={() => {
            const currentLine = currentStory.transcript.find(l => currentTime >= l.startTime && currentTime <= l.endTime);
            if (currentLine) setCurrentTime(currentLine.startTime);
          }}
          isShadowing={isShadowing}
          onToggleShadowing={() => setIsShadowing(!isShadowing)}
          onSaveMoment={handleSaveMoment}
        />
      </motion.div>

      {/* Momentum Overlay */}
      <AnimatePresence mode="wait">
        {showMomentum && !showShareOverlay && !showReflection && (
          <motion.div 
            key="momentum"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90"
          >
            <div className="max-w-xl w-full text-center space-y-12">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
                  <Sparkles className="text-amber-400 w-10 h-10 opacity-60" />
                </div>
                <div className="text-amber-400 font-bold uppercase tracking-[0.4em] text-[10px]">Hành trình tiếp nối</div>
                <h3 className="text-5xl font-display font-black tracking-tight leading-tight">{currentStory.title}</h3>
                <p className="text-xl text-white/40 font-light italic font-serif">"Sức mạnh thực sự không nằm ở cơ bắp, mà ở sự im lặng."</p>
              </motion.div>

              <div className="flex flex-col gap-4">
                <button 
                  className="w-full py-6 rounded-3xl bg-white text-black font-display font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all"
                  onClick={handleFinishStory}
                >
                  Tiếp tục hành trình — 5s
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowShareOverlay(true)}
                    className="py-4 rounded-3xl bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                  >
                    <Share2 size={18} className="text-amber-400 opacity-60" />
                    Lưu giữ kỷ niệm
                  </button>
                  <button 
                    onClick={handleFinishStory}
                    className="py-4 rounded-3xl glass text-white/20 font-bold hover:text-white transition-all uppercase tracking-widest text-[10px]"
                  >
                    Nghỉ ngơi
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Overlay */}
      <AnimatePresence>
        {showShareOverlay && (
          <SocialShareEngine 
            storyTitle={currentStory.title}
            hookText={currentStory.hookLine}
            identity="Storywalker"
            onClose={() => setShowShareOverlay(false)}
          />
        )}
      </AnimatePresence>

      {/* Reflection Overlay */}
      <AnimatePresence>
        {showReflection && (
          <ReflectionEngine 
            mood={currentStory.mood}
            prompt="What stayed with you after this story?"
            onClose={() => {
              setShowReflection(false);
              onClose();
            }}
            onSave={handleSaveReflection}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
