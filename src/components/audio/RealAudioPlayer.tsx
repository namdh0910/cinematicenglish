"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Loader2, Volume2, RotateCcw, AlertTriangle } from "lucide-react";
import { getOrGenerateAudio } from "@/app/actions/audio";

interface RealAudioPlayerProps {
  text: string;
  category: "stories" | "dialogue" | "pronunciation" | "vocabulary";
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  autoPlay?: boolean;
  onEnded?: () => void;
  accentColor?: string;
}

export default function RealAudioPlayer({
  text,
  category,
  voice = "nova",
  autoPlay = false,
  onEnded,
  accentColor = "#f59e0b",
}: RealAudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // High-fidelity frequencies state for the real waveform
  const [frequencies, setFrequencies] = useState<number[]>(Array(30).fill(4));

  // 1. Fetch/Generate TTS Audio on text change
  useEffect(() => {
    let active = true;
    const fetchAudio = async () => {
      setLoading(true);
      setError(null);
      setAudioUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);

      try {
        const res = await getOrGenerateAudio({ text, category, voice });
        if (!active) return;

        if (res.success && res.audioUrl) {
          setAudioUrl(res.audioUrl);
          if (res.error) {
            console.warn("TTS warning:", res.error);
          }
        } else {
          setError(res.error || "Không thể tạo giọng nói AI.");
        }
      } catch (err) {
        if (active) {
          setError("Không thể kết nối đến máy chủ âm thanh.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAudio();

    return () => {
      active = false;
      cleanupAudio();
    };
  }, [text, category, voice]);

  // 2. Initialize Audio Element and Web Audio Context for visualizer
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onAudioEnded);

    if (autoPlay) {
      playAudio();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onAudioEnded);
      audio.pause();
    };
  }, [audioUrl]);

  // 3. Audio context setup for real-time AnalyserNode
  const setupWebAudio = () => {
    if (!audioRef.current) return;
    if (audioContextRef.current) return; // Already setup

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small size for 32 frequency bins

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser policies:", e);
    }
  };

  const cleanupAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
  };

  // 4. Animation loop to update real frequency waveform
  const updateWaveform = () => {
    if (!analyserRef.current || !isPlaying) {
      // If no analyser or paused, slowly decay the waves
      setFrequencies(prev => prev.map(v => Math.max(4, v - 1.5)));
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateWaveform);
      }
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Map frequency bins to UI bars (slice first 30 bins which contain vocal frequencies)
    const newFrequencies: number[] = [];
    for (let i = 0; i < 30; i++) {
      // Normalize to 4px to 48px height range
      const raw = dataArray[i] || 0;
      const normalized = Math.max(4, Math.round((raw / 255) * 48));
      newFrequencies.push(normalized);
    }

    setFrequencies(newFrequencies);
    animationRef.current = requestAnimationFrame(updateWaveform);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateWaveform);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Decay waves to initial state
      setFrequencies(Array(30).fill(4));
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const playAudio = async () => {
    if (!audioRef.current) return;

    setupWebAudio();
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((e) => {
        console.warn("Play blocked or failed:", e);
        setIsPlaying(false);
      });
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full bg-[#16161a] border border-white/5 rounded-3xl p-5 md:p-6 space-y-4">
      {/* Waveform Visualization - REAL FREQUENCIES ONLY */}
      <div className="h-16 flex items-center justify-center gap-1 overflow-hidden relative bg-black/20 rounded-2xl border border-white/[0.02]">
        {loading ? (
          <div className="flex items-center gap-2.5 text-xs text-white/40 font-bold uppercase tracking-wider animate-pulse">
            <Loader2 className="animate-spin text-amber-500" size={16} /> Đang tải âm thanh AI...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-xs text-red-400 font-bold p-3 text-center">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex items-end justify-center gap-[3px] w-full h-full px-6 pt-3 pb-2">
            {frequencies.map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-75"
                style={{
                  height: `${h}px`,
                  backgroundColor: isPlaying ? accentColor : "rgba(255,255,255,0.08)",
                  boxShadow: isPlaying ? `0 0 12px ${accentColor}aa` : "none",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress track */}
      {!loading && !error && audioUrl && (
        <div className="flex items-center gap-3 text-xs font-mono text-white/40">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleProgressBarChange}
            className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
          <span>{formatTime(duration)}</span>
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.04] pt-4">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={togglePlay}
            disabled={loading || !!error}
            className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
                playAudio();
              }
            }}
            disabled={loading || !!error}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
            title="Nghe lại từ đầu"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Speed Adjustment Node */}
        {!loading && !error && (
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            <span>Tốc độ:</span>
            {[0.8, 1.0, 1.2, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  playbackSpeed === speed ? "bg-amber-500/10 text-amber-500" : "hover:text-white hover:bg-white/5"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-black tracking-wider">
          <Volume2 size={12} className="text-amber-500" /> Hệ thống giọng nói thật
        </div>
      </div>
    </div>
  );
}
