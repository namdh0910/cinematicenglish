"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Upload, 
  Music, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Zap, 
  Save, 
  Send,
  X,
  PlusCircle,
  Clock,
  Layout,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizBuilder from "./QuizBuilder";
import AIStoryGenerator from "./AIStoryGenerator";
import { createStory } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

const storySchema = z.object({
  title: z.string().min(5, "Tiêu đề phải ít nhất 5 ký tự"),
  category: z.string(),
  description: z.string().min(20, "Mô tả cần chi tiết hơn một chút"),
  transcript: z.string().min(50, "Transcript quá ngắn cho một story"),
  tags: z.string(),
  duration: z.string(),
  xp: z.number().min(0),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["Draft", "Published"]),
  isPremium: z.boolean(),
  isFeatured: z.boolean(),
  thumbnailUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});

type StoryFormValues = z.infer<typeof storySchema>;

export default function StoryForm() {
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      category: "Psychology",
      xp: 250,
      difficulty: "Intermediate",
      status: "Draft",
      isPremium: false,
      isFeatured: false,
    },
  });

  const onSubmit = async (data: StoryFormValues) => {
    try {
      // Defensive duration parsing
      let durationSeconds = 0;
      if (data.duration && data.duration.includes(":")) {
        const parts = data.duration.split(":");
        durationSeconds = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
      } else {
        durationSeconds = parseInt(data.duration) || 0;
      }

      const result = await createStory({
        title: data.title,
        synopsis: data.description,
        script: data.transcript,
        category: data.category.toLowerCase().replace(" & influence", ""),
        difficulty: data.difficulty.toLowerCase(),
        duration_seconds: durationSeconds,
        xp_value: data.xp,
        is_premium: data.isPremium,
        is_featured: data.isFeatured,
        status: data.status.toLowerCase(),
        thumbnail_url: data.thumbnailUrl,
        audio_url: data.audioUrl,
      });

      if (result.success) {
        router.push("/admin/stories");
      } else {
        alert(`Lỗi từ Database: ${result.error}\n\n(Vui lòng kiểm tra xem bạn đã chạy SQL tạo bảng 'stories' chưa ạ)`);
      }
    } catch (err: any) {
      console.error("Failed to create story:", err);
      alert("Lỗi không xác định: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-24">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
        {/* LEFT COLUMN: CONTENT (60%) */}
        <div className="xl:col-span-3 space-y-8">
          <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Layout size={20} className="text-amber-500" /> Nội dung chính
              </h3>
              <button 
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black hover:bg-amber-500/20 transition-all group"
              >
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" /> Generate with AI
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Story Title</label>
                <input 
                  {...register("title")}
                  placeholder="VD: The Godfather: Power Perception"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all font-display font-bold text-lg"
                />
                {errors.title && <p className="text-red-400 text-[10px] font-bold ml-4">{errors.title.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Category</label>
                <select 
                  {...register("category")}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                >
                  <option value="Psychology">Psychology</option>
                  <option value="Business">Business</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Cinema">Cinema</option>
                  <option value="Power & Influence">Power & Influence</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Synopsis / Description</label>
                <textarea 
                  {...register("description")}
                  rows={3}
                  placeholder="Tóm tắt ngắn gọn nội dung câu chuyện..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all resize-none text-sm"
                />
                {errors.description && <p className="text-red-400 text-[10px] font-bold ml-4">{errors.description.message}</p>}
              </div>

              {/* Transcript */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Transcript / Script</label>
                <textarea 
                  {...register("transcript")}
                  rows={15}
                  placeholder="Nhập nội dung kịch bản audio tại đây..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs leading-relaxed"
                />
                {errors.transcript && <p className="text-red-400 text-[10px] font-bold ml-4">{errors.transcript.message}</p>}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Tags (comma separated)</label>
                <input 
                  {...register("tags")}
                  placeholder="power, mindset, leadership"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                />
                {errors.tags && <p className="text-red-400 text-[10px] font-bold ml-4">{errors.tags.message}</p>}
              </div>
            </div>
          </div>

          {/* QUIZ SECTION */}
          <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5">
            <QuizBuilder transcript={watch("transcript")} />
          </div>
        </div>

        {/* RIGHT COLUMN: META & SETTINGS (40%) */}
        <div className="xl:col-span-2 space-y-8">
          <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-8 sticky top-[100px]">
            {/* Media Uploads */}
            <div className="space-y-6">
              {/* Thumbnail URL */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Thumbnail URL</label>
                <div className="space-y-3">
                  <input 
                    {...register("thumbnailUrl")}
                    placeholder="Dán link ảnh (https://...)"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                  <div className="aspect-video rounded-2xl border border-white/10 overflow-hidden bg-black/20 flex items-center justify-center">
                    {watch("thumbnailUrl") ? (
                      <img src={watch("thumbnailUrl")} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <ImageIcon className="text-white/10" size={24} />
                    )}
                  </div>
                </div>
              </div>

              {/* Audio URL */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Audio URL (Direct Link)</label>
                <div className="space-y-3">
                  <input 
                    {...register("audioUrl")}
                    placeholder="Dán link audio (mp3/wav)"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-white/5 flex items-center gap-3">
                    <Music className="text-amber-500" size={18} />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {watch("audioUrl") ? "Audio link detected" : "No audio link"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Numeric & Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    {...register("duration")}
                    placeholder="12:45"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                  />
                </div>
                {errors.duration && <p className="text-red-400 text-[10px] font-bold ml-4">{errors.duration.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">XP Reward</label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" size={16} />
                  <input 
                    {...register("xp", { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                  />
                </div>
                {errors.xp && <p className="text-red-400 text-[10px] font-bold ml-4">{errors.xp.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setValue("difficulty", level as any)}
                    className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      watch("difficulty") === level 
                        ? 'bg-amber-500 border-amber-500 text-black' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Trạng thái</div>
                  <div className="text-[10px] text-white/20 uppercase font-bold">Publish to live site</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setValue("status", watch("status") === "Draft" ? "Published" : "Draft")}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${watch("status") === "Published" ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${watch("status") === "Published" ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Gói Premium</div>
                  <div className="text-[10px] text-white/20 uppercase font-bold">Only for Pro Users</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setValue("isPremium", !watch("isPremium"))}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${watch("isPremium") ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${watch("isPremium") ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Featured Story</div>
                  <div className="text-[10px] text-white/20 uppercase font-bold">Highlight on Homepage</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setValue("isFeatured", !watch("isFeatured"))}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${watch("isFeatured") ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${watch("isFeatured") ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-display font-black text-lg shadow-glow-amber hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Send size={20} strokeWidth={3} /> Publish Story
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  className="py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                  <Save size={16} /> Save Draft
                </button>
                <button 
                  type="button"
                  className="py-3 rounded-xl bg-white/5 border border-white/5 text-white/20 text-xs font-bold hover:text-red-400 transition-all"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AIStoryGenerator 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onUse={(aiData) => {
          setValue("title", aiData.title);
          setValue("description", aiData.description);
          setValue("transcript", aiData.transcript);
          setValue("tags", aiData.tags);
          setValue("xp", aiData.xp);
          setIsAIModalOpen(false);
        }}
      />
    </form>
  );
}
