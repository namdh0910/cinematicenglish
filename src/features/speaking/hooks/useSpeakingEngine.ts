"use client";
import { useState, useEffect, useRef } from "react";
import { evaluateSpeaking } from "@/app/actions/speaking";
import { trackTelemetry } from "@/lib/observability/observability";
import { Activity, SpeakingResult } from "../types";

export function useSpeakingEngine(lessonId: string, activities: Activity[]) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpReward, setXpReward] = useState(0);

  // Audio & Mic States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Evaluation Feedback
  const [aiResponse, setAiResponse] = useState<SpeakingResult | null>(null);

  // Recording stream refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Analytics refs
  const startTime = useRef<number>(Date.now());
  const hasLoggedCompletion = useRef<boolean>(false);

  const activeActivity = activities[currentIdx];

  // Track session abandonment/drop-off
  useEffect(() => {
    startTime.current = Date.now();
    hasLoggedCompletion.current = false;

    return () => {
      // If the component unmounts and the lesson has NOT been marked finished, log drop-off
      if (!hasLoggedCompletion.current && !isFinished && activities.length > 0) {
        const sessionDuration = Math.round((Date.now() - startTime.current) / 1000);
        trackTelemetry('session_abandoned', {
          lessonId,
          lastActivityIdx: currentIdx,
          totalActivities: activities.length,
          durationSeconds: sessionDuration
        });
      }
    };
  }, [lessonId, activities, isFinished]);

  // Auto-play model audio on activity enter
  useEffect(() => {
    setAiResponse(null);
    setIsPlaying(false);
    setIsRecording(false);
    setIsAnalyzing(false);

    if (activeActivity) {
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
    
    if (isRecording) stopRecording();

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

    // Track mic usage start
    trackTelemetry('speaking_started', {
      lessonId,
      activityId: activeActivity?.id,
      activityIdx: currentIdx
    });

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
      trackTelemetry('mic_permission_denied', { lessonId, error: String(err) });
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

        setXpReward(prev => prev + Math.floor(score * 1.2));

        // Auto-advance loop: wait 1.6 seconds then proceed to next sentence
        setTimeout(() => {
          handleAutoNext();
        }, 1600);
      } else {
        trackTelemetry('speaking_failed', { lessonId, error: res.error || "Evaluation failed" });
        alert(res.error || "Có lỗi xảy ra khi chấm điểm.");
      }
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      trackTelemetry('speaking_failed', { lessonId, error: String(err) });
    }
  };

  const handleAutoNext = () => {
    if (currentIdx < activities.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Completed lesson session
      hasLoggedCompletion.current = true;
      setIsFinished(true);

      const sessionDuration = Math.round((Date.now() - startTime.current) / 1000);
      trackTelemetry('speaking_completed', {
        lessonId,
        xpReward: xpReward,
        durationSeconds: sessionDuration
      });
    }
  };

  const handleRestart = () => {
    // Track repeat usage psychology
    trackTelemetry('retry_recording', { lessonId });
    
    setCurrentIdx(0);
    setIsFinished(false);
    setXpReward(0);
    setAiResponse(null);
    startTime.current = Date.now();
    hasLoggedCompletion.current = false;
  };

  return {
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
  };
}
