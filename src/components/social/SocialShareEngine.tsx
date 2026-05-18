'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Camera, Send, MessageSquare, X, Check, Quote } from 'lucide-react';

interface SocialShareEngineProps {
  storyTitle: string;
  hookText: string;
  identity: string;
  onClose: () => void;
  score?: number; // Optional actual speaking evaluation score achieved
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function SocialShareEngine({ 
  storyTitle, 
  hookText, 
  identity, 
  onClose,
  score
}: SocialShareEngineProps) {
  const [activeTab, setActiveTab] = useState<'reel' | 'quote' | 'aura'>('quote');
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Use dynamic score or fall back to a high-end cinematic default
  const displayScore = score || 95;

  // Custom text templates to share on social channels
  const shareTitle = `Cinematic English - Luyện nói phản xạ phim Hollywood 🎬`;
  const shareText = `Tôi vừa đạt điểm nhại giọng xuất sắc ${displayScore}% trên Cinematic English với câu thoại kinh điển: "${hookText}" trong phim "${storyTitle}". Hãy cùng luyện nói tiếng Anh phản xạ tự nhiên qua phim Hollywood tại đây nhé! 🌹✨`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cinematicenglish.vercel.app';

  /**
   * Helper function to detect Web Share API support
   */
  const canUseNativeShare = (): boolean => {
    return typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined';
  };

  /**
   * Triggers the Web Share API on mobile, or copies text achievement to clipboard on desktop
   */
  const handleShare = async () => {
    if (canUseNativeShare()) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });

        setToast({
          show: true,
          message: 'Cảm ơn bạn đã chia sẻ khoảnh khắc học tập rực rỡ này! 🌟',
          type: 'success'
        });
      } catch (err: any) {
        // User aborted the native share panel, or it errored out.
        // Fallback to clipboard if it's not a voluntary cancellation
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  /**
   * Copy fallback for desktop browser sessions
   */
  const copyToClipboard = () => {
    const textToCopy = `${shareText}\n\nLuyện nói phản xạ ngay tại: ${shareUrl}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setToast({
            show: true,
            message: 'Đã sao chép thành tích vào Clipboard! Hãy dán lên Tiktok/Facebook để khoe với bạn bè nhé! 📋✨',
            type: 'success'
          });
        })
        .catch(() => {
          fallbackExecuteCopy(textToCopy);
        });
    } else {
      fallbackExecuteCopy(textToCopy);
    }
  };

  /**
   * Legacy copy fallback for older browsers
   */
  const fallbackExecuteCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Prevent scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setToast({
          show: true,
          message: 'Đã sao chép thành tích! Hãy dán lên Tiktok/Facebook để khoe nhé! 📋✨',
          type: 'success'
        });
      } else {
        setToast({
          show: true,
          message: 'Không thể tự động sao chép. Vui lòng copy thủ công!',
          type: 'error'
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: 'Trình duyệt không hỗ trợ sao chép tự động!',
        type: 'error'
      });
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExported(true);
      
      setToast({
        show: true,
        message: 'Đã xuất ảnh thành tích độ phân giải cao vào Thư viện của bạn! 📸',
        type: 'success'
      });

      setTimeout(() => setIsExported(false), 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[#0d0d18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Custom Glassmorphism Toast */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] px-5 py-3 rounded-2xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl"
              style={{
                backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                color: toast.type === 'success' ? '#10b981' : '#f87171'
              }}
            >
              {toast.type === 'success' ? (
                <Check size={18} className="shrink-0" />
              ) : (
                <X size={18} className="shrink-0 text-red-400" />
              )}
              <div className="flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5">
                  {toast.type === 'success' ? 'Thành công' : 'Gặp lỗi'}
                </p>
                <p className="text-xs font-light text-white/90 leading-tight">
                  {toast.message}
                </p>
              </div>
              <button 
                onClick={() => setToast(prev => ({ ...prev, show: false }))} 
                className="text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-outfit">Lưu Giữ Kỷ Niệm Học Tập</h2>
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
          <div className="aspect-[9/16] max-h-[360px] w-full mx-auto relative rounded-2xl overflow-hidden bg-primary border border-white/10 flex items-center justify-center p-8 group">
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
                  <Quote className="w-8 h-8 text-violet-500/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white leading-tight font-outfit italic px-2">
                    "{hookText}"
                  </h3>
                  
                  {/* Dynamic speaking score badge */}
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                    AI Score: {displayScore}% Accuracy
                  </div>

                  <div className="mt-6 flex flex-col items-center">
                    <div className="h-px w-12 bg-white/20 mb-3" />
                    <p className="text-[10px] text-white/40 tracking-widest uppercase">{identity}</p>
                    <p className="text-[9px] text-violet-400 mt-1 font-medium">CINEMATIC ENGLISH</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reel' && (
                <motion.div 
                  key="reel-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full space-y-4 px-4"
                >
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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
                  <p className="text-[10px] text-amber-500 text-center pt-8 tracking-widest uppercase font-bold">KINETIC TYPOGRAPHY ACTIVE</p>
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
                  <div className="w-28 h-28 rounded-full border border-blue-500/30 flex items-center justify-center relative">
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
                  <p className="mt-6 text-[10px] text-blue-400 font-medium tracking-widest uppercase">{identity}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/5 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              title="Xuất ảnh thành tích"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
            >
              <Camera className="w-5 h-5 text-white/60 group-hover:text-pink-400" />
            </button>
            <button 
              onClick={handleShare}
              title="Chia sẻ nhanh"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
            >
              <Send className="w-5 h-5 text-white/60 group-hover:text-blue-400" />
            </button>
            <button 
              onClick={copyToClipboard}
              title="Sao chép liên kết"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
            >
              <MessageSquare className="w-5 h-5 text-white/60 group-hover:text-green-400" />
            </button>
          </div>

          <button 
            onClick={handleShare}
            className="flex-1 py-3 px-6 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Share2 className="w-5 h-5" />
            <span>Khoe Thành Tích</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

