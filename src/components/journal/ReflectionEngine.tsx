'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Zap, Coffee, Moon, Sun, Check, MessageSquare } from 'lucide-react';

interface ReflectionEngineProps {
  onClose: () => void;
  onSave: (reflection: { content: string, tags: string[] }) => void;
  prompt?: string;
  mood?: 'the-void' | 'the-pulse' | 'the-calm';
}

const EMOTIONAL_TAGS = [
  { id: 'calm', label: 'Calm', icon: Moon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'powerful', label: 'Powerful', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'inspired', label: 'Inspired', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  { id: 'focused', label: 'Focused', icon: Sun, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'reflective', label: 'Reflective', icon: Coffee, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { id: 'brave', label: 'Courageous', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' },
];

export default function ReflectionEngine({ onClose, onSave, prompt = "What stayed with you?", mood = 'the-void' }: ReflectionEngineProps) {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleTag = (id: string) => {
    setSelectedTags(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!content.trim() && selectedTags.length === 0) return;
    setIsSaving(true);
    setTimeout(() => {
      onSave({ content, tags: selectedTags });
      setIsSaving(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-xl bg-[#0d0d18] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative"
      >
        {/* Background Atmosphere */}
        <div className={`absolute -right-40 -top-40 w-80 h-80 rounded-full blur-[120px] opacity-20 ${
          mood === 'the-void' ? 'bg-violet-900' :
          mood === 'the-pulse' ? 'bg-amber-900' : 'bg-blue-900'
        }`} />

        <div className="relative z-10 p-10 md:p-14">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3 text-white/40">
              <MessageSquare size={16} />
              <span className="text-[10px] uppercase tracking-[0.4em]">Personal Reflection</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} className="text-white/40" />
            </button>
          </div>

          {/* Prompt */}
          <div className="space-y-4 mb-10">
            <h2 className="text-3xl font-display font-black leading-tight text-white">{prompt}</h2>
            <div className="h-px w-12 bg-white/20" />
          </div>

          {/* Emotional Tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            {EMOTIONAL_TAGS.map((tag) => {
              const isActive = selectedTags.includes(tag.id);
              const Icon = tag.icon;
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? `${tag.bg} border-${tag.color.split('-')[1]}-500/50 ${tag.color} scale-105 shadow-[0_0_20px_rgba(139,92,246,0.1)]` 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{tag.label}</span>
                </button>
              );
            })}
          </div>

          {/* Text Input */}
          <div className="relative mb-12">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your thoughts... (Optional)"
              className="w-full bg-transparent border-none text-xl md:text-2xl text-white/80 placeholder:text-white/20 focus:ring-0 resize-none min-h-[120px] font-light leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/20 italic">"This app remembers who you are becoming."</p>
            <button
              onClick={handleSave}
              disabled={isSaving || (!content.trim() && selectedTags.length === 0)}
              className={`px-10 py-4 rounded-3xl font-display font-black text-lg transition-all duration-500 flex items-center gap-3 ${
                isSaving ? 'bg-green-500 text-white' : 'bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
              }`}
            >
              {isSaving ? (
                <>
                  <Check size={20} />
                  <span>Preserved</span>
                </>
              ) : (
                <>
                  <span>Preserve Moment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
