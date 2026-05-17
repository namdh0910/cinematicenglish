'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EmotionalProfile } from '@/lib/data';
import { getAtmosphereSettings, getAdaptiveCoachTone } from '@/lib/intelligence';
// TODO: Import Supabase browser client here later to fetch real profile from DB
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export type AdaptiveMode = 'ambitious' | 'reflective' | 'momentum' | 'vulnerable' | 'focus';

interface AdaptiveContextType {
  mode: AdaptiveMode;
  setMode: (mode: AdaptiveMode) => void;
  profile: EmotionalProfile;
  atmosphere: any;
  coachTone: any;
}

const DEFAULT_EMOTIONAL_PROFILE: EmotionalProfile = {
  dominantMood: 'the-void',
  traits: { reflective: 0.6, ambitious: 0.5, vulnerable: 0.4, confident: 0.6 },
  preferredCategories: [],
  recentTags: [],
  pacingPreference: 'normal'
};

const AdaptiveContext = createContext<AdaptiveContextType | undefined>(undefined);

export function AdaptiveProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AdaptiveMode>('focus');
  const [profile, setProfile] = useState<EmotionalProfile>(DEFAULT_EMOTIONAL_PROFILE);

  // Fetch real user preferences from Supabase if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Here we will eventually load the real 'emotional_profile' json from profiles table
        // For now, keep the robust default to ensure UI stability.
      }
    };
    fetchProfile();
  }, []);

  // Update profile based on mode for demo purposes
  useEffect(() => {
    const newProfile = { ...profile };
    switch (mode) {
      case 'ambitious':
        newProfile.dominantMood = 'the-pulse';
        newProfile.traits = { reflective: 0.3, ambitious: 0.9, vulnerable: 0.2, confident: 0.8 };
        newProfile.pacingPreference = 'fast';
        break;
      case 'reflective':
        newProfile.dominantMood = 'the-void';
        newProfile.traits = { reflective: 0.9, ambitious: 0.3, vulnerable: 0.6, confident: 0.5 };
        newProfile.pacingPreference = 'slow';
        break;
      case 'momentum':
        newProfile.dominantMood = 'the-pulse';
        newProfile.traits = { reflective: 0.4, ambitious: 0.7, vulnerable: 0.3, confident: 0.9 };
        newProfile.pacingPreference = 'fast';
        break;
      case 'vulnerable':
        newProfile.dominantMood = 'the-calm';
        newProfile.traits = { reflective: 0.7, ambitious: 0.2, vulnerable: 0.8, confident: 0.4 };
        newProfile.pacingPreference = 'slow';
        break;
      case 'focus':
        newProfile.dominantMood = 'the-void';
        newProfile.traits = { reflective: 0.6, ambitious: 0.5, vulnerable: 0.4, confident: 0.6 };
        newProfile.pacingPreference = 'normal';
        break;
    }
    setProfile(newProfile);
  }, [mode]);

  const atmosphere = getAtmosphereSettings(profile);
  const coachTone = getAdaptiveCoachTone(profile);

  return (
    <AdaptiveContext.Provider value={{ mode, setMode, profile, atmosphere, coachTone }}>
      {children}
    </AdaptiveContext.Provider>
  );
}

export function useAdaptive() {
  const context = useContext(AdaptiveContext);
  if (context === undefined) {
    throw new Error('useAdaptive must be used within an AdaptiveProvider');
  }
  return context;
}
