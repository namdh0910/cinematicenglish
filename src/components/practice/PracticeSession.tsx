"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck } from "lucide-react";
import PracticeProgressBar from "./PracticeProgressBar";
import RapidChallengeCard, { ChallengeData } from "./RapidChallengeCard";
import InstantFeedbackLayer from "./InstantFeedbackLayer";
import SessionSummary from "./SessionSummary";
import { SkillGraphManager, INITIAL_SKILL_GRAPH } from "@/lib/skill_graph";
import { LearningIntelligenceEngine } from "@/intelligence/learning_intelligence";
import { MemoryRetentionManager, MemorizedItem } from "@/intelligence/memory_retention";

const MOCK_CHALLENGES: ChallengeData[] = [
  {
    id: "rap-1",
    type: "dictation",
    prompt: "Listen to sentence and transcribe the vocabulary correctly:",
    correctAnswer: "ecological",
    audioUrl: "/audio/ecological.mp3",
    weakTag: "Vocabulary mastery"
  },
  {
    id: "rap-2",
    type: "multiple_choice",
    prompt: "Choose the correct conversational stress meaning of 'anomaly':",
    options: ["A normal state", "A deviation from rule", "A dynamic system", "A static preview"],
    correctAnswer: "A deviation from rule",
    weakTag: "Vocabulary recall"
  },
  {
    id: "rap-3",
    type: "shadow_repeat",
    prompt: "Speak sentence exactly: 'The negotiation chamber is locked.'",
    correctAnswer: "The negotiation chamber is locked.",
    audioUrl: "/audio/negotiation.mp3",
    weakTag: "Phoneme accuracy (θ, ð, ʃ)"
  },
  {
    id: "rap-4",
    type: "missing_word",
    prompt: "Complete dialogue sentence: 'The rapid fluctuation ___ oceanic currents affects local habitats.'",
    correctAnswer: "of",
    weakTag: "Grammar & prepositions"
  },
  {
    id: "rap-5",
    type: "pronunciation_burst",
    prompt: "Speak unstable voiceless fricative phoneme: 'θ' (th)",
    correctAnswer: "θ",
    weakTag: "Phoneme accuracy (θ, ð, ʃ)"
  }
];

export default function PracticeSession() {
  const [challenges, setChallenges] = useState<ChallengeData[]>(MOCK_CHALLENGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pacingWpm, setPacingWpm] = useState(132);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [weakTagsIsolated, setWeakTagsIsolated] = useState<string[]>([]);
  
  // Connect skill graph active state
  const [skillGraph, setSkillGraph] = useState(INITIAL_SKILL_GRAPH);

  const currentChallenge = challenges[currentIndex];

  const handleAnswerSubmit = (answer: string) => {
    setUserAnswer(answer);
    
    // Evaluate correctness (case insensitive trim comparison)
    const correct = answer.toLowerCase().trim() === currentChallenge.correctAnswer.toLowerCase().trim();
    
    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      setCombo(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      setXp(prev => prev + 25 + combo * 5);
      
      // Update skill graph with a perfect 100 learning signal!
      if (currentChallenge.weakTag) {
        // Map common weakTags to internal subskill IDs
        const subId = currentChallenge.weakTag.includes("Phoneme") ? "s-phonemes" : "v-recall";
        const updated = SkillGraphManager.processLearningSignal(skillGraph, subId, 100);
        setSkillGraph(updated);
      }
    } else {
      setCombo(0);
      
      // Update skill graph with a recovery 40 learning signal!
      if (currentChallenge.weakTag) {
        const subId = currentChallenge.weakTag.includes("Phoneme") ? "s-phonemes" : "v-recall";
        const updated = SkillGraphManager.processLearningSignal(skillGraph, subId, 40);
        setSkillGraph(updated);
        
        // Isolate weakness
        setWeakTagsIsolated(prev => {
          if (prev.includes(currentChallenge.weakTag!)) return prev;
          return [...prev, currentChallenge.weakTag!];
        });
      }
    }
  };

  const handleNextChallenge = () => {
    setIsAnswerSubmitted(false);
    setUserAnswer("");

    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleResetSession = () => {
    setCurrentIndex(0);
    setCombo(0);
    setXp(0);
    setCorrectCount(0);
    setSessionCompleted(false);
    setIsAnswerSubmitted(false);
    setUserAnswer("");
    setWeakTagsIsolated([]);
  };

  if (sessionCompleted) {
    const accuracy = Math.round((correctCount / challenges.length) * 100);
    return (
      <div className="max-w-3xl mx-auto py-8">
        <SessionSummary 
          score={correctCount}
          total={challenges.length}
          xpGained={xp}
          accuracy={accuracy}
          wpm={pacingWpm}
          weakTags={weakTagsIsolated}
          onReset={handleResetSession}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* ProgressBar Console */}
      <PracticeProgressBar 
        current={currentIndex + 1}
        total={challenges.length}
        combo={combo}
      />

      {/* Interactive Core Challengers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <RapidChallengeCard 
            challenge={currentChallenge}
            onSubmit={handleAnswerSubmit}
            feedbackRendered={isAnswerSubmitted}
          />
        </motion.div>
      </AnimatePresence>

      {/* Feedback panel bottom drawers */}
      {isAnswerSubmitted && (
        <InstantFeedbackLayer 
          isCorrect={isAnswerCorrect}
          correctAnswer={currentChallenge.correctAnswer}
          userAnswer={userAnswer}
          xpAwarded={25 + combo * 5}
          weakTag={isAnswerCorrect ? undefined : currentChallenge.weakTag}
          onContinue={handleNextChallenge}
        />
      )}

    </div>
  );
}
