'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptive, AdaptiveMode } from '@/context/AdaptiveContext';
import { Zap, Moon, Sparkles, Heart, Eye } from 'lucide-react';

const MODES: { id: AdaptiveMode; label: string; icon: any; color: string }[] = [
  { id: 'ambitious', label: 'Ambitious', icon: Zap, color: 'text-amber-400' },
  { id: 'reflective', label: 'Reflective', icon: Moon, color: 'text-violet-400' },
  { id: 'momentum', label: 'Momentum', icon: Sparkles, color: 'text-emerald-400' },
  { id: 'vulnerable', label: 'Gentle', icon: Heart, color: 'text-pink-400' },
  { id: 'focus', label: 'Focus', icon: Eye, color: 'text-blue-400' },
];

export default function AdaptiveSwitcher() {
  const { mode, setMode, atmosphere } = useAdaptive();

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-30">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-2 rounded-2xl border border-white/10 flex items-center gap-1 shadow-2xl"
      >
        <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/40 border-r border-white/5 mr-1">
          Adaptive Engine
        </div>
        
        {MODES.map((m) => {
          const isActive = mode === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-2.5 rounded-xl transition-all duration-500 relative group ${
                isActive ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={isActive ? m.color : ''} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {m.label} Mode
              </div>

              {isActive && (
                <motion.div 
                  layoutId="active-mode"
                  className="absolute inset-0 rounded-xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                />
              )}
            </button>
          );
        })}

        {/* Debug Stats (Small) */}
        <div className="px-4 hidden lg:block">
          <div className="flex gap-4">
            <div className="text-[8px] uppercase tracking-tighter text-white/20">
              Glow: <span className="text-white/40">{(atmosphere.glowIntensity * 100).toFixed(0)}%</span>
            </div>
            <div className="text-[8px] uppercase tracking-tighter text-white/20">
              Pacing: <span className="text-white/40">{atmosphere.motionPacing}x</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
