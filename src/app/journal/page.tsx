'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Calendar, Mic, Sparkles, Quote, Trophy, Play, Music, PenTool } from 'lucide-react';
import { Memory } from '@/lib/data';
import Link from 'next/link';
import AtmosphereLayer from '@/components/player/AtmosphereLayer';

export default function CinematicJournal() {
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  // TODO: Fetch from Supabase
  const memories: Memory[] = [];

  return (
    <div className="min-h-screen bg-primary text-white selection:bg-violet-500/30 overflow-x-hidden">
      {/* Immersive Background */}
      <AtmosphereLayer mood={activeMemory?.mood || 'the-void'} isFocusMode={false} />

      {/* Header */}
      <header className="relative z-50 p-6 md:p-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all group">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase">Nhật ký Học tập</h1>
            <p className="text-xs text-white/40 uppercase tracking-[0.4em] mt-2">Hành trình Cảm xúc</p>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>
      </header>

      <main className="relative z-50 max-w-5xl mx-auto px-6 pb-24">
        {/* Identity Stats Overlay */}
        <section className="mb-16 text-center">
          <div className="inline-block p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl px-8 py-4">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Cấp độ hiện tại</p>
                <p className="text-xl font-display font-bold text-violet-400">Đang tải...</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Kí ức đã lưu</p>
                <p className="text-xl font-display font-bold">{memories.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline View */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent -translate-x-1/2 hidden md:block" />

          {memories.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-[32px] glass-card">
              <Sparkles size={32} className="mx-auto text-white/20 mb-4" />
              <h3 className="text-lg font-bold text-white/60">Chưa có kí ức nào</h3>
              <p className="text-sm text-white/40 mt-2">Hãy bắt đầu luyện tập để lưu lại những khoảnh khắc cảm xúc.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Timeline loop will go here */}
            </div>
          )}
        </div>
      </main>

      {/* Memory Detail Overlay */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90"
            onClick={() => setActiveMemory(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full p-12 rounded-[48px] bg-[#0d0d18] border border-white/10 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute -right-40 -bottom-40 w-80 h-80 rounded-full blur-[120px] opacity-20 ${
                activeMemory.mood === 'the-void' ? 'bg-violet-900' :
                activeMemory.mood === 'the-pulse' ? 'bg-amber-900' : 'bg-blue-900'
              }`} />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="text-white/40 text-xs font-mono uppercase tracking-[0.4em]">{activeMemory.date}</div>
                  <div className="px-4 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-white/60 uppercase tracking-widest">
                    {activeMemory.identityStage}
                  </div>
                </div>

                <h2 className="text-4xl font-display font-black leading-tight">{activeMemory.title}</h2>
                
                <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 ${
                  activeMemory.type === 'quote' ? 'italic font-serif text-2xl text-white/90 text-center leading-relaxed' : 'text-lg text-white/70 leading-relaxed'
                }`}>
                  {activeMemory.reflectionPrompt && (
                    <p className="text-[10px] text-violet-400 uppercase tracking-[0.3em] mb-4 font-bold">
                      Prompt: {activeMemory.reflectionPrompt}
                    </p>
                  )}
                  {activeMemory.type === 'quote' ? `"${activeMemory.content}"` : activeMemory.content}
                </div>

                {activeMemory.type === 'voice' && (
                  <div className="p-6 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Music className="text-amber-400" size={20} />
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Speaking Replay</span>
                      </div>
                      <span className="text-[10px] text-white/40">32s Recording</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                        <Play size={24} fill="black" className="ml-1" />
                      </button>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-[10px] text-white/40 font-mono">
                          <span>0:12</span>
                          <span>0:32</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '37%' }}
                            className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-400" />
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Identity Reinforcement</span>
                  </div>
                  <p className="text-xs text-white/60 italic">
                    {activeMemory.type === 'voice' ? "Your voice carries more certainty now." : 
                     activeMemory.type === 'milestone' ? "You've evolved past the Silent Observer." : 
                     "This reflection strengthens your Seeker identity."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
