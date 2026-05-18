"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Film, 
  Video, 
  FileText, 
  Award, 
  Layers, 
  Loader2, 
  ChevronRight, 
  CheckCircle2 
} from "lucide-react";
import { generateStoryContent } from "@/app/admin/actions";

interface AIStoryGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onUse: (data: any) => void;
}

const CATEGORIES = ["Psychology", "Business", "Philosophy", "Cinema", "Power & Influence"];
const DIFFICULTIES = ["B1", "B2", "C1", "Advanced"];

export default function AIStoryGenerator({ isOpen, onClose }: AIStoryGeneratorProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Cinema",
    difficulty: "B2",
    videoUrl: "",
    subtitleUrl: ""
  });

  const [step, setStep] = useState(1); // 1 = Form, 2 = Slicing/Forging, 3 = Complete
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      alert("Vui lòng điền đầy đủ Tên phim và URL Video.");
      return;
    }

    setIsGenerating(true);
    setStep(2);
    
    // Animate some cool progress logs for that premium dopamine loop
    const logs = [
      "Đang kết nối cơ sở dữ liệu Supabase...",
      "Đang tải thông tin siêu dữ liệu phim...",
      "Phân tích cấu trúc file phụ đề...",
      "Đang cắt phụ đề thành các phân cảnh 5-10s...",
      "Đúc các bản ghi Story & story_scenes...",
      "Khởi tạo bài học và câu thoại luyện nói...",
      "Hoàn thành xuất sắc!"
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setLoadingMessage(logs[currentLog]);
        currentLog++;
      }
    }, 1200);

    try {
      const res = await generateStoryContent({
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        videoUrl: formData.videoUrl,
        subtitleUrl: formData.subtitleUrl
      });

      clearInterval(interval);

      if (res.success) {
        setLoadingMessage("Đã đúc xong nội dung!");
        setStep(3);
        setTimeout(() => {
          onClose();
          window.location.reload(); // Refresh the list
        }, 1500);
      } else {
        alert("Lỗi đúc nội dung: " + res.error);
        setStep(1);
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      alert("Có lỗi xảy ra trong quá trình đúc nội dung.");
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0e0e12]/95 border border-white/10 rounded-[36px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Decorative Glowing Rings */}
          <div className="absolute -left-20 -top-20 w-52 h-52 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-52 h-52 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <Sparkles size={20} className="text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">AI Content Factory</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Tự động hóa số hóa nội dung phim điện ảnh</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {step === 1 && (
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-5">
                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2 flex items-center gap-1.5">
                      <Film size={12} className="text-violet-400" /> Tên Phim / Tác Phẩm
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ví dụ: Bố Già (The Godfather)"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 transition-all"
                    />
                  </div>

                  {/* Two column layouts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2 flex items-center gap-1.5">
                        <Layers size={12} className="text-violet-400" /> Thể Loại
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-bold text-white/60 focus:outline-none appearance-none"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Difficulty level */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2 flex items-center gap-1.5">
                        <Award size={12} className="text-violet-400" /> Trình Độ
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-bold text-white/60 focus:outline-none appearance-none"
                      >
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Video URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2 flex items-center gap-1.5">
                      <Video size={12} className="text-violet-400" /> URL Video (YouTube hoặc MP4 trực tiếp)
                    </label>
                    <input 
                      type="url"
                      required
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 transition-all"
                    />
                  </div>

                  {/* Subtitle URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2 flex items-center gap-1.5">
                      <FileText size={12} className="text-violet-400" /> URL file phụ đề chuẩn (.vtt hoặc .srt) nếu có
                    </label>
                    <input 
                      type="text"
                      value={formData.subtitleUrl}
                      onChange={(e) => setFormData({ ...formData, subtitleUrl: e.target.value })}
                      placeholder="e.g. https://cinematic-english.com/subtitles/godfather.vtt"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-black font-display font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95"
                  >
                    Đúc nội dung <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="h-[300px] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full border-4 border-violet-500/10 border-t-violet-500"
                  />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400 animate-pulse" size={24} />
                </div>
                
                <div className="text-center space-y-3">
                  <p className="text-sm font-black text-white italic">{loadingMessage}</p>
                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 7, ease: "easeInOut" }}
                      className="h-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h4 className="text-xl font-display font-black text-white">Đã Đúc Xong Nội Dung!</h4>
                <p className="text-xs text-white/40">Danh sách kho truyện đang tự động tải lại...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
