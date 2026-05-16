"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Save, 
  Upload, 
  MessageSquare, 
  Sparkles, 
  Mic, 
  Globe, 
  Tag, 
  Info,
  Brain,
  Type
} from "lucide-react";

export interface AICharacter {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  description: string;
  personality: string;
  systemPrompt: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  languageStyle: 'Formal' | 'Casual' | 'Mixed';
  topics: string[];
  openingMessage: string;
  status: 'active' | 'inactive';
  stats: {
    totalConversations: number;
    avgSessionLength: string;
    rating: number;
  };
}

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: AICharacter) => void;
  character: AICharacter | null;
}

const VOICE_OPTIONS = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const LANGUAGE_STYLES = ['Formal', 'Casual', 'Mixed'];
const DEFAULT_TOPICS = ['Psychology', 'Business', 'English Practice', 'Daily Life', 'Cinema', 'Philosophy'];

export default function CharacterModal({ isOpen, onClose, onSave, character }: CharacterModalProps) {
  const [formData, setFormData] = useState<Partial<AICharacter>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'ai' | 'voice'>('basic');

  useEffect(() => {
    if (character) {
      setFormData(character);
    } else {
      setFormData({
        name: "",
        role: "",
        emoji: "🤖",
        color: "#8b5cf6",
        description: "",
        personality: "",
        systemPrompt: "",
        voice: 'alloy',
        languageStyle: 'Casual',
        topics: [],
        openingMessage: "",
        status: 'active',
        stats: {
          totalConversations: 0,
          avgSessionLength: "0m",
          rating: 0
        }
      });
    }
  }, [character, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as AICharacter);
  };

  const toggleTopic = (topic: string) => {
    const currentTopics = formData.topics || [];
    if (currentTopics.includes(topic)) {
      setFormData({ ...formData, topics: currentTopics.filter(t => t !== topic) });
    } else {
      setFormData({ ...formData, topics: [...currentTopics, topic] });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] bg-[#1a1a1a] border border-white/10 rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl">
                {formData.emoji}
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white">
                  {character ? "Edit Character" : "New AI Character"}
                </h3>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                  {character ? `Configuring ${formData.name}` : "Create a new personality"}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-8 border-b border-white/5">
            {[
              { id: 'basic', label: 'Identity', icon: Info },
              { id: 'ai', label: 'Intelligence', icon: Brain },
              { id: 'voice', label: 'Audio & Style', icon: Mic },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-amber-500 text-amber-500' 
                    : 'border-transparent text-white/20 hover:text-white/40'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Sarah"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Role / Title</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Psychotherapist"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Avatar Emoji</label>
                      <input 
                        type="text" 
                        value={formData.emoji}
                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold text-center text-xl focus:outline-none focus:border-amber-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Theme Color</label>
                      <div className="flex items-center gap-3 w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4">
                        <input 
                          type="color" 
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                        />
                        <span className="text-xs font-mono text-white/40">{formData.color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Short Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Briefly describe the character's purpose..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Opening Message</label>
                    <textarea 
                      value={formData.openingMessage}
                      onChange={(e) => setFormData({ ...formData, openingMessage: e.target.value })}
                      rows={4}
                      placeholder="The first thing the character says to the user..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm italic focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-500" /> Personality Profile
                  </label>
                  <textarea 
                    value={formData.personality}
                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                    rows={4}
                    placeholder="Describe traits, quirks, values, and emotional tone..."
                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 px-8 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-2">
                    <Brain size={12} className="text-blue-500" /> System Prompt (Claude Instructions)
                  </label>
                  <textarea 
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    rows={12}
                    placeholder="Enter the full instruction set for the AI model..."
                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 px-8 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                  />
                  <p className="text-[10px] text-white/20 ml-4 italic">Use variables like {'{user_name}'} if applicable.</p>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-2">
                      <Mic size={12} /> OpenAI TTS Voice
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {VOICE_OPTIONS.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setFormData({ ...formData, voice: v as any })}
                          className={`py-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                            formData.voice === v 
                              ? 'bg-amber-500 border-amber-500 text-black' 
                              : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-2">
                      <Globe size={12} /> Language Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {LANGUAGE_STYLES.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({ ...formData, languageStyle: s as any })}
                          className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                            formData.languageStyle === s 
                              ? 'bg-blue-500 border-blue-500 text-white' 
                              : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-2">
                    <Tag size={12} /> Topics Allowed
                  </label>
                  <div className="flex flex-wrap gap-2 p-6 rounded-3xl bg-white/5 border border-white/5">
                    {DEFAULT_TOPICS.map(topic => {
                      const isSelected = formData.topics?.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' 
                              : 'bg-white/5 text-white/20 hover:text-white/40 border border-transparent'
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                    <button type="button" className="px-4 py-2 rounded-xl bg-white/5 border border-dashed border-white/10 text-[10px] font-bold text-white/10 hover:text-white/40 transition-all italic">
                      + Add Topic
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Footer Actions */}
          <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{formData.status}</span>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                className="text-[10px] font-bold text-white/20 hover:text-white underline underline-offset-4"
              >
                Toggle Status
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-white/40 hover:text-white transition-all"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-black font-black text-sm shadow-glow-amber hover:scale-105 active:scale-95 transition-all"
              >
                <Save size={18} strokeWidth={3} /> Save Character
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
