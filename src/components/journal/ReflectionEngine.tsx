'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Zap, Coffee, Moon, Sun, Check, MessageSquare } from 'lucide-react';
import { saveReflection } from '@/app/actions/reflection';

interface ReflectionEngineProps {
  onClose: () => void;
  onSave?: (reflection: { content: string, tags: string[] }) => void;
  prompt?: string;
  mood?: 'the-void' | 'the-pulse' | 'the-calm';
  lessonId: string; // Dynamic identifier mapped to the lesson/story database record
}

const EMOTIONAL_TAGS = [
  { id: 'calm', label: 'Calm', icon: Moon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'powerful', label: 'Powerful', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'inspired', label: 'Inspired', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  { id: 'focused', label: 'Focused', icon: Sun, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'reflective', label: 'Reflective', icon: Coffee, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { id: 'brave', label: 'Courageous', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' },
];

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function ReflectionEngine({ 
  onClose, 
  onSave, 
  prompt = "What stayed with you?", 
  mood = 'the-void',
  lessonId
}: ReflectionEngineProps) {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const toggleTag = (id: string) => {
    setSelectedTags(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!content.trim() && selectedTags.length === 0) return;
    
    setIsSaving(true);
    
    // Map selected tags array into a single descriptive string for database tracking
    const emotionTag = selectedTags.join(', ') || 'reflective';
    
    try {
      const result = await saveReflection({
        lessonId: lessonId || 'general-lesson',
        emotionTag,
        note: content,
      });

      if (result.success) {
        // Display premium glassmorphism success toast
        setToast({
          show: true,
          message: 'Nhật ký cảm xúc học tập đã được lưu trữ an toàn trong khoảnh khắc của bạn! 🌹',
          type: 'success'
        });

        // Trigger optional callback for component updates
        if (onSave) {
          onSave({ content, tags: selectedTags });
        }

        // Delay close slightly so student can appreciate the gorgeous success state
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        // Display dynamic database error toast
        setToast({
          show: true,
          message: result.error || 'Gặp sự cố khi lưu nhật ký. Vui lòng đăng nhập lại!',
          type: 'error'
        });
      }
    } catch (err: any) {
      setToast({
        show: true,
        message: err.message || 'Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng!',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-xl bg-[#0d0d18] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative"
      >
        {/* Custom Toast Notification inside the card */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-md px-6 py-4 rounded-3xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl"
              style={{
                backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                color: toast.type === 'success' ? '#10b981' : '#f87171'
              }}
            >
              {toast.type === 'success' ? (
                <Check size={20} className="shrink-0" />
              ) : (
                <X size={20} className="shrink-0 text-red-400" />
              )}
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  {toast.type === 'success' ? 'Lưu thành công' : 'Gặp lỗi lưu trữ'}
                </p>
                <p className="text-xs font-light text-white/90 leading-tight">
                  {toast.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              placeholder="Cảm nghĩ của bạn về thước phim vừa nhại... (Không bắt buộc)"
              className="w-full bg-transparent border-none text-xl md:text-2xl text-white/80 placeholder:text-white/20 focus:ring-0 resize-none min-h-[120px] font-light leading-relaxed outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/20 italic">"This app remembers who you are becoming."</p>
            <button
              onClick={handleSave}
              disabled={isSaving || (!content.trim() && selectedTags.length === 0)}
              className={`px-10 py-4 rounded-3xl font-display font-black text-lg transition-all duration-500 flex items-center gap-3 ${
                isSaving 
                  ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-95' 
                  : 'bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
              }`}
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <span>Lưu Khoảnh Khắc</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

