import { EmotionalProfile, Story, STORIES } from './data';

/**
 * Calculates the best stories for a user based on their emotional profile.
 */
export function getAdaptiveRecommendations(profile: EmotionalProfile, count: number = 3): Story[] {
  return STORIES
    .filter(story => !profile.preferredCategories.includes(story.category)) // Mix new categories with preferred
    .sort((a, b) => {
      // Score based on dominant mood
      const moodScoreA = a.mood === profile.dominantMood ? 2 : 0;
      const moodScoreB = b.mood === profile.dominantMood ? 2 : 0;
      
      // Score based on traits (Simplified logic)
      const traitScoreA = profile.traits.reflective > 0.7 && a.mood === 'the-void' ? 1 : 0;
      const traitScoreB = profile.traits.reflective > 0.7 && b.mood === 'the-void' ? 1 : 0;
      
      return (moodScoreB + traitScoreB) - (moodScoreA + traitScoreA);
    })
    .slice(0, count);
}

/**
 * Determines the ideal AI Coach tone based on user confidence and mood.
 */
export function getAdaptiveCoachTone(profile: EmotionalProfile) {
  if (profile.traits.confident < 0.4) {
    return {
      style: 'supportive',
      pacing: 'gentle',
      vocabulary: 'accessible',
      feedbackFocus: 'encouragement'
    };
  }
  
  if (profile.traits.ambitious > 0.8) {
    return {
      style: 'challenging',
      pacing: 'intense',
      vocabulary: 'sophisticated',
      feedbackFocus: 'precision'
    };
  }
  
  return {
    style: 'balanced',
    pacing: 'conversational',
    vocabulary: 'standard',
    feedbackFocus: 'naturalism'
  };
}

/**
 * Adapts the atmosphere settings based on the emotional profile.
 */
export function getAtmosphereSettings(profile: EmotionalProfile) {
  const { reflective, ambitious, confident } = profile.traits;
  const isVoid = profile.dominantMood === 'the-void';
  const isPulse = profile.dominantMood === 'the-pulse';
  const isCalm = profile.dominantMood === 'the-calm';
  
  return {
    glowIntensity: ambitious > 0.7 ? 0.9 : (isCalm ? 0.3 : 0.5),
    motionPacing: profile.pacingPreference === 'slow' ? 0.4 : (profile.pacingPreference === 'fast' ? 1.2 : 0.8),
    grainOpacity: isVoid ? 0.12 : 0.04,
    blurStrength: reflective > 0.7 ? '3xl' : 'xl',
    contrastLevel: ambitious > 0.8 ? 'high' : 'normal',
    accentSaturation: ambitious > 0.8 ? 1.2 : (reflective > 0.8 ? 0.6 : 1.0),
    uiSpacing: reflective > 0.7 ? 'relaxed' : 'tight'
  };
}

/**
 * Reconnects the user with a past breakthrough moment.
 */
export function getMemoryInsight(memories: any[]) {
  const voiceMemories = memories.filter(m => m.type === 'voice');
  if (voiceMemories.length > 1) {
    const oldest = voiceMemories[0];
    return {
      type: 'comparison',
      title: 'Confidence Evolution',
      message: `Listen back to your recording from ${oldest.date}. Your voice carries significantly more presence today.`,
      action: 'Revisit Memory'
    };
  }
  return null;
}
