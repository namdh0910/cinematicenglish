"use client";
import { useState } from "react";
import { Play, Volume2, Mic, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getOrGenerateAudio } from "@/app/actions/audio";

export interface ChallengeData {
  id: string;
  type: "dictation" | "multiple_choice" | "shadow_repeat" | "missing_word" | "vocabulary" | "pronunciation_burst";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
  weakTag?: string;
}

interface RapidChallengeCardProps {
  challenge: ChallengeData;
  onSubmit: (answer: string) => void;
  feedbackRendered: boolean;
}

export default function RapidChallengeCard({
  challenge,
  onSubmit,
  feedbackRendered
}: RapidChallengeCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const playClientSpeech = (text: string, onEnd?: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for clear dictation/reflex loop

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

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    const textToSpeak = challenge.correctAnswer;
    setIsPlaying(true);
    setLoadingAudio(true);

    const res = await getOrGenerateAudio({
      text: textToSpeak,
      category: 'pronunciation',
      voice: 'nova'
    });

    setLoadingAudio(false);
    if (res.success && res.audioUrl) {
      const audio = new Audio(res.audioUrl);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audio.addEventListener('error', () => {
        playClientSpeech(textToSpeak, () => setIsPlaying(false));
      });

      audio.play().catch(() => {
        playClientSpeech(textToSpeak, () => setIsPlaying(false));
      });
    } else {
      playClientSpeech(textToSpeak, () => setIsPlaying(false));
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || feedbackRendered) return;
    onSubmit(inputValue.trim());
  };

  const handleSelectOption = (opt: string) => {
    if (feedbackRendered) return;
    setSelectedOption(opt);
    onSubmit(opt);
  };

  const handleSimulateSpeech = () => {
    if (feedbackRendered) return;
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      onSubmit(challenge.correctAnswer);
    }, 1500);
  };

  return (
    <Card className="p-6 border-white/5 bg-white/[0.01] space-y-6">
      
      {/* ─── CHALLENGE HEADER ─── */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <Badge variant="violet" className="py-0 px-2 text-[8px] font-mono uppercase tracking-widest">
            {challenge.type.replace("_", " ")}
          </Badge>
          <h3 className="text-sm font-bold text-white leading-normal">
            {challenge.prompt}
          </h3>
        </div>

        {(challenge.audioUrl || challenge.type === "dictation" || challenge.type === "shadow_repeat") && (
          <button 
            onClick={handlePlayAudio}
            disabled={loadingAudio}
            className={`p-3 rounded-xl border transition-all shrink-0 cursor-pointer ${
              isPlaying 
                ? "bg-amber-500/20 border-amber-500/30 text-amber-400 font-bold" 
                : "bg-violet-600/10 border-violet-500/20 text-violet-400 hover:bg-violet-600/20"
            }`}
          >
            {loadingAudio ? (
              <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Volume2 size={16} className={isPlaying ? "animate-pulse" : ""} />
            )}
          </button>
        )}
      </div>

      {/* ─── DYNAMIC INTERACTION ZONE ─── */}
      <div className="pt-2">
        
        {/* Type 1: Dictation or Missing Word (Input Box) */}
        {(challenge.type === "dictation" || challenge.type === "missing_word") && (
          <form onSubmit={handleSubmitText} className="space-y-4">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={feedbackRendered}
              placeholder="Type exactly what you hear or the missing word..."
              className="w-full px-4 py-3.5 bg-black border border-white/5 rounded-xl text-xs font-mono text-white placeholder-white/20 focus:border-violet-500 focus:outline-none transition-colors"
            />
            {!feedbackRendered && (
              <button 
                type="submit"
                className="w-full py-3 bg-white hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Submit Answer
              </button>
            )}
          </form>
        )}

        {/* Type 2: Multiple Choice or Vocabulary (Large Target Grid) */}
        {(challenge.type === "multiple_choice" || challenge.type === "vocabulary") && challenge.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {challenge.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  disabled={feedbackRendered}
                  className={`w-full p-4 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    isSelected 
                      ? "border-violet-500 bg-violet-950/20 text-violet-400" 
                      : "border-white/5 bg-white/[0.01] hover:border-white/10 text-white/70"
                  }`}
                >
                  <span className="font-mono text-[9px] text-white/20 mr-2">0{i+1}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Type 3: Shadow Repeat or Pronunciation Burst (Vocal Capture) */}
        {(challenge.type === "shadow_repeat" || challenge.type === "pronunciation_burst") && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <button
              onClick={handleSimulateSpeech}
              disabled={feedbackRendered || isRecording}
              className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${
                isRecording 
                  ? "border-amber-500 bg-amber-500/10 text-amber-500 animate-pulse scale-105" 
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              }`}
            >
              <Mic size={24} className={isRecording ? "animate-bounce" : ""} />
            </button>
            
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
              {isRecording ? "Listening to phonemes..." : "Tap microphone to record voice"}
            </span>
          </div>
        )}

      </div>

    </Card>
  );
}
