'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Camera, Send, MessageSquare, X, Check, Quote } from 'lucide-react';

interface SocialShareEngineProps {
  storyTitle: string;
  hookText: string;
  identity: string;
  onClose: () => void;
}

export default function SocialShareEngine({ storyTitle, hookText, identity, onClose }: SocialShareEngineProps) {
  const [activeTab, setActiveTab] = useState<'reel' | 'quote' | 'aura'>('quote');
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExported(true);
      setTimeout(() => setIsExported(false), 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[#0d0d18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-outfit">Create Shareable Moment</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{storyTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white/5 mx-6 mt-6 rounded-xl">
          {(['quote', 'reel', 'aura'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="p-6">
          <div className="aspect-[9/16] max-h-[400px] w-full mx-auto relative rounded-2xl overflow-hidden bg-primary border border-white/10 flex items-center justify-center p-8 group">
            {/* Background Effect */}
            <div className={`absolute inset-0 opacity-30 transition-all duration-700 ${
              activeTab === 'quote' ? 'bg-gradient-to-br from-violet-900/50 via-transparent to-transparent' :
              activeTab === 'reel' ? 'bg-gradient-to-tr from-amber-900/50 via-transparent to-transparent' :
              'bg-gradient-to-b from-blue-900/50 via-transparent to-transparent'
            }`} />
            
            {/* Quote Card Preview */}
            <AnimatePresence mode="wait">
              {activeTab === 'quote' && (
                <motion.div 
                  key="quote-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10 text-center"
                >
                  <Quote className="w-8 h-8 text-violet-500/50 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white leading-tight font-outfit italic">
                    "{hookText}"
                  </h3>
                  <div className="mt-8 flex flex-col items-center">
                    <div className="h-px w-12 bg-white/20 mb-4" />
                    <p className="text-xs text-white/40 tracking-widest uppercase">{identity}</p>
                    <p className="text-[10px] text-violet-400 mt-1 font-medium">CINEMATIC ENGLISH</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reel' && (
                <motion.div 
                  key="reel-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full space-y-4"
                >
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/3 bg-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                    <div className="h-4 w-full bg-white/20 rounded" />
                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                  </div>
                  <p className="text-[10px] text-amber-500 text-center pt-8 tracking-widest">KINETIC TYPOGRAPHY ACTIVE</p>
                </motion.div>
              )}

              {activeTab === 'aura' && (
                <motion.div 
                  key="aura-preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="w-32 h-32 rounded-full border border-blue-500/30 flex items-center justify-center relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-t-2 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                    />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-[8px] text-white/40 uppercase tracking-tighter">Day Streak</p>
                    </div>
                  </div>
                  <p className="mt-8 text-xs text-blue-400 font-medium tracking-widest uppercase">{identity}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/5 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
              <Camera className="w-5 h-5 text-white/60 group-hover:text-pink-400" />
            </button>
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
              <Send className="w-5 h-5 text-white/60 group-hover:text-blue-400" />
            </button>
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
              <MessageSquare className="w-5 h-5 text-white/60 group-hover:text-green-400" />
            </button>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isExported ? 'bg-green-500 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'
            }`}
          >
            {isExporting ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Processing...</span>
              </>
            ) : isExported ? (
              <>
                <Check className="w-5 h-5" />
                <span>Saved to Gallery</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Export High-Res</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
