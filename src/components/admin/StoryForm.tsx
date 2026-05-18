"use client";
import { useState, useEffect } from "react";
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
  Sparkles,
  Play,
  Settings,
  Film,
  MessageSquare,
  Award,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizBuilder from "./QuizBuilder";
import AIStoryGenerator from "./AIStoryGenerator";
import { 
  createStory, 
  updateStory,
  getStoryScenes, 
  createStoryScene, 
  updateStoryScene, 
  deleteStoryScene,
  getLessonForStory,
  createLessonForStory,
  getLessonSentences,
  createLessonSentence,
  updateLessonSentence,
  deleteLessonSentence,
  updateLessonFields
} from "@/app/admin/actions";
import { useRouter } from "next/navigation";

const storySchema = z.object({
  title: z.string().min(5, "Tiêu đề phải ít nhất 5 ký tự"),
  category: z.string(),
  description: z.string().min(20, "Mô tả cần chi tiết hơn một chút"),
  transcript: z.string().min(50, "Transcript quá ngắn cho một story"),
  tags: z.string(),
  emotionalTone: z.string().optional(),
  duration: z.string(),
  xp: z.number().min(0),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["Draft", "Published", "Archived"]),
  isPremium: z.boolean(),
  isFeatured: z.boolean(),
  thumbnailUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});

type StoryFormValues = z.infer<typeof storySchema>;

export default function StoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'story' | 'scenes' | 'lesson'>('story');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Scenes management states
  const [scenes, setScenes] = useState<any[]>([]);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newSceneThumb, setNewSceneThumb] = useState("");

  // Lesson & Sentences states
  const [lesson, setLesson] = useState<any>(null);
  const [sentences, setSentences] = useState<any[]>([]);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState(false);

  // New sentence quick-form states
  const [newTranscript, setNewTranscript] = useState("");
  const [newTranslationOnly, setNewTranslationOnly] = useState("");
  const [newIpa, setNewIpa] = useState("");
  const [newTargetScore, setNewTargetScore] = useState(75);
  const [newStart, setNewStart] = useState(0);
  const [newEnd, setNewEnd] = useState(4);
  const [newAudioUrl, setNewAudioUrl] = useState("");
  const [newSentenceThumb, setNewSentenceThumb] = useState("");

  // Content Intelligence Accordions & States
  const [expandedMetaSentences, setExpandedMetaSentences] = useState<Record<string, boolean>>({});
  const [expandedNewMeta, setExpandedNewMeta] = useState(false);
  const [expandedSentences, setExpandedSentences] = useState<Record<string, boolean>>({});

  const [newPacingType, setNewPacingType] = useState("medium");
  const [newSpeechSpeed, setNewSpeechSpeed] = useState("normal");
  const [newEmotionType, setNewEmotionType] = useState("Inspiring");
  const [newPronunciationDifficulty, setNewPronunciationDifficulty] = useState("medium");
  const [newShadowingPriority, setNewShadowingPriority] = useState("medium");
  const [newReplayPriority, setNewReplayPriority] = useState("medium");
  const [newAccentType, setNewAccentType] = useState("US");
  const [newDopamineScore, setNewDopamineScore] = useState(70);
  const [newDifficultyScore, setNewDifficultyScore] = useState(50);

  // Helper to parse translation from DB
  function parseTranslation(rawTranslation: string) {
    const regex = /^(.*?)\[Phiên âm:\s*([^\s|]*)\s*\|\s*Phổ điểm đạt:\s*(\d+)\]$/;
    const match = rawTranslation?.match(regex);
    if (match) {
      return {
        translation: match[1].trim(),
        ipa: match[2],
        targetScore: parseInt(match[3], 10)
      };
    }
    return {
      translation: rawTranslation || "",
      ipa: "/.../",
      targetScore: initialData?.difficulty === "beginner" ? 75 : 85
    };
  }

  // Helper to bundle translation
  function bundleTranslation(translation: string, ipa: string, targetScore: number) {
    return `${translation.trim()} [Phiên âm: ${ipa.trim()} | Phổ điểm đạt: ${targetScore}]`;
  }

  // Extract emotional tone from tags
  const initialTone = initialData?.tags?.split(",").find((t: string) => t.trim().startsWith("tone:"))?.replace("tone:", "") || "";
  const initialCleanTags = initialData?.tags?.split(",").filter((t: string) => !t.trim().startsWith("tone:")).join(", ") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "Psychology",
      description: initialData?.synopsis || "",
      transcript: initialData?.script || "",
      tags: initialCleanTags,
      emotionalTone: initialTone || "Inspiring",
      duration: initialData?.duration_seconds ? `${Math.floor(initialData.duration_seconds / 60)}:${(initialData.duration_seconds % 60).toString().padStart(2, '0')}` : "",
      xp: initialData?.xp_value || 250,
      difficulty: initialData?.difficulty ? (initialData.difficulty.charAt(0).toUpperCase() + initialData.difficulty.slice(1)) as any : "Intermediate",
      status: initialData?.status ? (initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1)) as any : "Draft",
      isPremium: initialData?.is_premium || false,
      isFeatured: initialData?.is_featured || false,
      thumbnailUrl: initialData?.thumbnail_url || "",
      audioUrl: initialData?.audio_url || "",
    },
  });

  // Load scenes when tab changes
  useEffect(() => {
    if (initialData?.id && activeTab === 'scenes') {
      loadScenes();
    }
  }, [initialData?.id, activeTab]);

  // Load lesson & sentences when tab changes
  useEffect(() => {
    if (initialData?.id && activeTab === 'lesson') {
      loadLessonAndSentences();
    }
  }, [initialData?.id, activeTab]);

  async function loadScenes() {
    setLoadingScenes(true);
    const data = await getStoryScenes(initialData.id);
    setScenes(data);
    setLoadingScenes(false);
  }

  async function loadLessonAndSentences() {
    setLoadingLesson(true);
    const dbLesson = await getLessonForStory(initialData.title);
    if (dbLesson) {
      setLesson(dbLesson);
      const dbSentences = await getLessonSentences(dbLesson.id);
      setSentences(dbSentences);
    } else {
      setLesson(null);
      setSentences([]);
    }
    setLoadingLesson(false);
  }

  const handleAddScene = async () => {
    if (!newVideoUrl) return alert("Vui lòng nhập Video URL!");
    const res = await createStoryScene({
      story_id: initialData.id,
      order_index: scenes.length + 1,
      video_url: newVideoUrl,
      thumbnail_url: newSceneThumb
    });
    if (res.success) {
      setNewVideoUrl("");
      setNewSceneThumb("");
      loadScenes();
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleUpdateScene = async (id: string, updatedFields: any) => {
    const res = await updateStoryScene(id, updatedFields);
    if (res.success) {
      alert("Cập nhật phân cảnh thành công!");
      loadScenes();
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleDeleteScene = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phân cảnh này?")) {
      const res = await deleteStoryScene(id);
      if (res.success) {
        loadScenes();
      } else {
        alert("Lỗi: " + res.error);
      }
    }
  };

  const handleCreateLesson = async () => {
    setCreatingLesson(true);
    const res = await createLessonForStory(watch("title"), watch("description"));
    setCreatingLesson(false);
    if (res.success) {
      alert("Khởi tạo bài học thành công!");
      loadLessonAndSentences();
    } else {
      alert("Lỗi khởi tạo bài học: " + res.error);
    }
  };

  const handleAddSentence = async () => {
    if (!newTranscript || !newTranslationOnly) {
      return alert("Vui lòng điền English Quote và Bản dịch tiếng Việt!");
    }
    const finalTranslation = bundleTranslation(newTranslationOnly, newIpa || "/.../", newTargetScore);
    
    // Bundle content intelligence metadata
    const metadata = {
      pacing_type: newPacingType,
      speech_speed: newSpeechSpeed,
      emotion_type: newEmotionType,
      pronunciation_difficulty: newPronunciationDifficulty,
      shadowing_priority: newShadowingPriority,
      replay_priority: newReplayPriority,
      accent_type: newAccentType,
      dopamine_score: newDopamineScore,
      difficulty_score: newDifficultyScore
    };

    const res = await createLessonSentence({
      lesson_id: lesson.id,
      order_index: sentences.length + 1,
      transcript: newTranscript,
      translation: finalTranslation,
      start_time: Number(newStart),
      end_time: Number(newEnd),
      audio_url: newAudioUrl,
      thumbnail_url: newSentenceThumb || initialData?.thumbnail_url,
      metadata: metadata
    });

    if (res.success) {
      setNewTranscript("");
      setNewTranslationOnly("");
      setNewIpa("");
      setNewAudioUrl("");
      setNewSentenceThumb("");
      // Reset meta defaults
      setNewPacingType("medium");
      setNewSpeechSpeed("normal");
      setNewEmotionType("Inspiring");
      setNewPronunciationDifficulty("medium");
      setNewShadowingPriority("medium");
      setNewReplayPriority("medium");
      setNewAccentType("US");
      setNewDopamineScore(70);
      setNewDifficultyScore(50);
      setExpandedNewMeta(false);
      
      loadLessonAndSentences();
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleUpdateSentence = async (id: string, updatedFields: any) => {
    const res = await updateLessonSentence(id, updatedFields);
    if (res.success) {
      // Optimistically update local sentence fields to prevent jumpy reloads
      setSentences(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleMetaUpdate = async (sentenceId: string, currentMeta: any, key: string, value: any) => {
    const updatedMeta = { ...(currentMeta || {}), [key]: value };
    const res = await updateLessonSentence(sentenceId, { metadata: updatedMeta });
    if (res.success) {
      setSentences(prev => prev.map(s => s.id === sentenceId ? { ...s, metadata: updatedMeta } : s));
    } else {
      alert("Lỗi khi cập nhật trí tuệ câu thoại: " + res.error);
    }
  };

  const handleUpdateLessonStatus = async (newStatus: 'draft' | 'review' | 'published' | 'archived') => {
    if (!lesson?.id) return;
    const res = await updateLessonFields(lesson.id, { status: newStatus });
    if (res.success) {
      setLesson((prev: any) => ({ ...prev, status: newStatus }));
      alert(`Đã cập nhật trạng thái bài học thành: ${newStatus.toUpperCase()}`);
    } else {
      alert("Lỗi khi cập nhật trạng thái bài học: " + res.error);
    }
  };

  const handleDeleteSentence = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa câu thoại này?")) {
      const res = await deleteLessonSentence(id);
      if (res.success) {
        loadLessonAndSentences();
      } else {
        alert("Lỗi: " + res.error);
      }
    }
  };

  const onSubmit = async (data: StoryFormValues) => {
    try {
      let durationSeconds = 0;
      if (data.duration && data.duration.includes(":")) {
        const parts = data.duration.split(":");
        durationSeconds = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
      } else {
        durationSeconds = parseInt(data.duration) || 0;
      }

      // Format tags with emotional tone
      let finalTags = data.tags;
      if (data.emotionalTone) {
        const cleanedTags = data.tags.split(",").map(t => t.trim()).filter((t: string) => !t.startsWith("tone:")).join(",");
        finalTags = cleanedTags ? `${cleanedTags}, tone:${data.emotionalTone}` : `tone:${data.emotionalTone}`;
      }

      const storyData = {
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
        tags: finalTags
      };

      let result;
      if (initialData?.id) {
        const updated = await updateStory(initialData.id, storyData);
        result = { success: !!updated, data: updated };
      } else {
        result = await createStory(storyData);
      }

      if (result.success) {
        alert("Lưu câu chuyện thành công!");
        router.push("/admin/stories");
        router.refresh();
      } else {
        alert(`Lỗi: ${result.error || "Không thể lưu story"}`);
      }
    } catch (err: any) {
      console.error("Failed to save story:", err);
      alert("Lỗi không xác định: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* ─── TAB NAVIGATION BAR ────────────────────────────────────────── */}
      <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 max-w-lg">
        <button
          type="button"
          onClick={() => setActiveTab('story')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'story' ? 'bg-amber-500 text-black shadow-glow-amber' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Settings size={14} /> Thông tin phim
        </button>
        <button
          type="button"
          disabled={!initialData?.id}
          onClick={() => setActiveTab('scenes')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-20 flex items-center justify-center gap-2 ${
            activeTab === 'scenes' ? 'bg-amber-500 text-black shadow-glow-amber' : 'text-white/40 hover:text-white/60'
          }`}
          title={!initialData?.id ? "Hãy tạo và lưu story trước khi quản lý scenes" : ""}
        >
          <Film size={14} /> Phân cảnh (Scenes)
        </button>
        <button
          type="button"
          disabled={!initialData?.id}
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-20 flex items-center justify-center gap-2 ${
            activeTab === 'lesson' ? 'bg-amber-500 text-black shadow-glow-amber' : 'text-white/40 hover:text-white/60'
          }`}
          title={!initialData?.id ? "Hãy tạo và lưu story trước khi soạn thảo thoại" : ""}
        >
          <MessageSquare size={14} /> Lời thoại học tập
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── TAB 1: STORY INFO ─────────────────────────────────────────── */}
        {activeTab === 'story' && (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-12 pb-24"
          >
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
                        placeholder="VD: The Godfather"
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
                        <option value="Cinema">Cinema (Điện ảnh)</option>
                        <option value="Psychology">Psychology (Tâm lý học)</option>
                        <option value="Business">Business (Kinh doanh)</option>
                        <option value="Philosophy">Philosophy (Triết học)</option>
                        <option value="Creative">Creative (Sáng tạo)</option>
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
                        rows={10}
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
                        placeholder="mafia, crime, godfather"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                      />
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

                  {/* Emotional Tone & Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Emotional Tone</label>
                      <select 
                        {...register("emotionalTone")}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
                      >
                        <option value="Inspiring">Inspiring (Cảm hứng)</option>
                        <option value="Dramatic">Dramatic (Kịch tính)</option>
                        <option value="Melancholic">Melancholic (Trầm buồn)</option>
                        <option value="Heroic">Heroic (Hào hùng)</option>
                        <option value="Romantic">Romantic (Lãng mạn)</option>
                        <option value="Epic">Epic (Sử thi)</option>
                      </select>
                    </div>

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
                          <div className="text-sm font-bold text-white">Trạng thái xuất bản</div>
                          <div className="text-[10px] text-white/20 uppercase font-bold">Publish status</div>
                        </div>
                        <select 
                          {...register("status")}
                          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Draft">Draft (Bản nháp)</option>
                          <option value="Published">Published (Công khai)</option>
                          <option value="Archived">Archived (Lưu trữ)</option>
                        </select>
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

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl bg-amber-500 text-black font-display font-black text-lg shadow-glow-amber hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        <Send size={20} strokeWidth={3} /> Lưu thông tin phim
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
          </motion.form>
        )}

        {/* ─── TAB 2: SCENES COMPOSER ────────────────────────────────────── */}
        {activeTab === 'scenes' && initialData?.id && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 pb-24"
          >
            {/* Quick Add Card */}
            <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <PlusCircle size={20} className="text-amber-500" /> Thêm phân cảnh mới / Add Scene
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Video URL (link direct hoặc youtube)</label>
                  <input 
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Thumbnail URL (không bắt buộc)</label>
                  <input 
                    type="text"
                    value={newSceneThumb}
                    onChange={(e) => setNewSceneThumb(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm font-mono"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddScene}
                className="px-6 py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-amber"
              >
                + Thêm phân cảnh
              </button>
            </div>

            {/* Scenes List */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-white/30 ml-4">Danh sách phân cảnh hiện tại ({scenes.length})</h4>
              
              {loadingScenes ? (
                <div className="text-center py-10 text-white/40 text-xs italic">Đang tải phân cảnh...</div>
              ) : scenes.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {scenes.map((scene, idx) => (
                    <div key={scene.id} className="p-6 rounded-3xl bg-[#131317] border border-white/5 flex flex-col xl:flex-row gap-6 items-start xl:items-center">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-display font-black text-xl shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold tracking-widest text-white/20 ml-2">Video URL</label>
                          <input 
                            type="text" 
                            defaultValue={scene.video_url}
                            onBlur={(e) => handleUpdateScene(scene.id, { video_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-xs text-white/80 focus:border-amber-500/30 transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold tracking-widest text-white/20 ml-2">Thumbnail URL</label>
                          <input 
                            type="text" 
                            defaultValue={scene.thumbnail_url}
                            onBlur={(e) => handleUpdateScene(scene.id, { thumbnail_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-xs text-white/80 focus:border-amber-500/30 transition-all font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteScene(scene.id)}
                        className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 transition-all self-end xl:self-center"
                        title="Xóa phân cảnh"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 rounded-3xl border border-dashed border-white/10 text-white/30 text-xs italic">
                  Story này chưa có phân cảnh phim nào. Hãy thêm ở trên!
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── TAB 3: LESSON SENTENCES EDITOR ────────────────────────────── */}
        {activeTab === 'lesson' && initialData?.id && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 pb-24"
          >
            {loadingLesson ? (
              <div className="text-center py-20 text-white/40 text-xs italic">Đang truy vấn bài học liên kết...</div>
            ) : !lesson ? (
              <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 text-center space-y-6 py-16">
                <HelpCircle size={48} className="text-white/20 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Chưa có bài học luyện nói nào cho câu chuyện này</h3>
                  <p className="text-white/40 text-xs max-w-md mx-auto">
                    Để học viên có thể nhấp vào và luyện nói thực tế, câu chuyện cần một bài học liên kết mang tiêu đề chứa tên phim.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateLesson}
                  disabled={creatingLesson}
                  className="px-6 py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-amber disabled:opacity-30"
                >
                  {creatingLesson ? "Đang khởi tạo..." : "Khởi tạo bài học mới ngay"}
                </button>
              </div>
            ) : (
              <>
                {/* Associated Lesson Details banner with status workflow */}
                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold font-display">Bài học liên kết</span>
                    <h4 className="text-sm font-bold text-white">{lesson.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Workflow Status Selector */}
                    <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-xl">
                      {(['draft', 'review', 'published', 'archived'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleUpdateLessonStatus(s)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                            (lesson.status || 'draft') === s
                              ? 'bg-amber-500 text-black shadow-glow-amber'
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          {s === 'draft' ? 'Nháp' : s === 'review' ? 'Duyệt' : s === 'published' ? 'Đăng' : 'Kho'}
                        </button>
                      ))}
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                      {lesson.type}
                    </div>
                  </div>
                </div>

                {/* Quick Add Sentence Form */}
                <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <PlusCircle size={20} className="text-amber-500" /> Thêm câu thoại mới / Add Sentence
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">English Quote (Transcript)</label>
                      <input 
                        type="text"
                        value={newTranscript}
                        onChange={(e) => setNewTranscript(e.target.value)}
                        placeholder="VD: I'm gonna make him an offer he can't refuse."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Dịch nghĩa tiếng Việt</label>
                        <input 
                          type="text"
                          value={newTranslationOnly}
                          onChange={(e) => setNewTranslationOnly(e.target.value)}
                          placeholder="Tôi sẽ đưa ra lời đề nghị không thể chối từ."
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Phiên âm gợi ý IPA</label>
                        <input 
                          type="text"
                          value={newIpa}
                          onChange={(e) => setNewIpa(e.target.value)}
                          placeholder="/aɪm ˈɡɑːnə meɪk.../"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm font-mono text-amber-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Ngưỡng điểm đạt đạt tối thiểu</label>
                        <input 
                          type="number"
                          value={newTargetScore}
                          onChange={(e) => setNewTargetScore(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-amber-500/50 transition-all text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Bắt đầu (giây)</label>
                        <input 
                          type="number"
                          step="0.1"
                          value={newStart}
                          onChange={(e) => setNewStart(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Kết thúc (giây)</label>
                        <input 
                          type="number"
                          step="0.1"
                          value={newEnd}
                          onChange={(e) => setNewEnd(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Audio Sample URL</label>
                        <input 
                          type="text"
                          value={newAudioUrl}
                          onChange={(e) => setNewAudioUrl(e.target.value)}
                          placeholder="Link mp3/wav câu thoại"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Ảnh câu thoại URL</label>
                        <input 
                          type="text"
                          value={newSentenceThumb}
                          onChange={(e) => setNewSentenceThumb(e.target.value)}
                          placeholder="Link ảnh minh họa"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Content Intelligence Accordion (Quick Add) */}
                    <div className="border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => setExpandedNewMeta(!expandedNewMeta)}
                        className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        <Brain size={12} /> {expandedNewMeta ? "Ẩn chỉ số Trí tuệ nội dung" : "🧠 Thiết lập Trí tuệ & Pacing cảm xúc"}
                      </button>
                      
                      {expandedNewMeta && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Emotional Pacing</label>
                            <select
                              value={newPacingType}
                              onChange={(e) => setNewPacingType(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="easy">Easy (Khởi động)</option>
                              <option value="medium">Medium (Tăng tốc)</option>
                              <option value="hard">Hard (Thử thách)</option>
                              <option value="emotional payoff">Payoff (Cao trào cảm xúc)</option>
                              <option value="recovery">Recovery (Hồi sức/Thư giãn)</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Tốc độ thoại (Speed)</label>
                            <select
                              value={newSpeechSpeed}
                              onChange={(e) => setNewSpeechSpeed(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="slow">Slow (Chậm)</option>
                              <option value="normal">Normal (Vừa phải)</option>
                              <option value="fast">Fast (Nhanh)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Emotion Type</label>
                            <select
                              value={newEmotionType}
                              onChange={(e) => setNewEmotionType(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="Inspiring">Inspiring (Truyền cảm hứng)</option>
                              <option value="Dramatic">Dramatic (Kịch tính)</option>
                              <option value="Angry">Angry (Giận dữ/Mạnh mẽ)</option>
                              <option value="Sad">Sad (Trầm buồn/Sâu lắng)</option>
                              <option value="Romantic">Romantic (Lãng mạn)</option>
                              <option value="Epic">Epic (Hào hùng/Sử thi)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Độ khó phát âm</label>
                            <select
                              value={newPronunciationDifficulty}
                              onChange={(e) => setNewPronunciationDifficulty(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="low">Low (Dễ)</option>
                              <option value="medium">Medium (Trung bình)</option>
                              <option value="high">High (Khó)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Shadowing Priority</label>
                            <select
                              value={newShadowingPriority}
                              onChange={(e) => setNewShadowingPriority(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High (Uu tiên shadow)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Replay Priority</label>
                            <select
                              value={newReplayPriority}
                              onChange={(e) => setNewReplayPriority(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High (Ôn tập nhiều)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Accent Type</label>
                            <select
                              value={newAccentType}
                              onChange={(e) => setNewAccentType(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                            >
                              <option value="US">US (Giọng Mỹ)</option>
                              <option value="UK">UK (Giọng Anh)</option>
                              <option value="AU">AU (Giọng Úc)</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Dopamine Score</label>
                              <span className="text-[9px] font-mono text-amber-500 font-bold">{newDopamineScore}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={newDopamineScore}
                              onChange={(e) => setNewDopamineScore(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>

                          <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Difficulty Score</label>
                              <span className="text-[9px] font-mono text-amber-500 font-bold">{newDifficultyScore}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={newDifficultyScore}
                              onChange={(e) => setNewDifficultyScore(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleAddSentence}
                    className="px-6 py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-amber"
                  >
                    + Thêm câu thoại
                  </button>
                </div>

                {/* Sentences List */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-widest text-white/30 ml-4">Các câu thoại hiện tại ({sentences.length})</h4>

                  {sentences.length > 0 ? (
                    <div className="space-y-4">
                      {sentences.map((sentence, idx) => {
                        const parsed = parseTranslation(sentence.translation);
                        
                        // Collapsed Mode Layout (Extremely clean, modern list row)
                        if (!expandedSentences[sentence.id]) {
                          return (
                            <div key={sentence.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group/row">
                              <div className="flex items-center gap-4 flex-1">
                                <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 font-black text-xs flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="space-y-1 min-w-0">
                                  <div className="font-display font-bold text-sm text-white/90 group-hover/row:text-amber-500 transition-colors line-clamp-1">
                                    {sentence.transcript}
                                  </div>
                                  <div className="text-xs text-white/40 flex items-center gap-2 flex-wrap">
                                    <span className="line-clamp-1">{parsed.translation}</span>
                                    {parsed.ipa && parsed.ipa !== '/.../' && (
                                      <span className="font-mono text-amber-500/60 bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                                        {parsed.ipa}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                {/* Core intelligence summary badges */}
                                <div className="flex items-center gap-1.5 mr-2">
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
                                    {sentence.metadata?.accent_type || "US"}
                                  </span>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                                    {sentence.metadata?.emotion_type || "Inspiring"}
                                  </span>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                                    ⚡ {sentence.metadata?.dopamine_score || 70}
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => setExpandedSentences(prev => ({ ...prev, [sentence.id]: true }))}
                                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider transition-all"
                                >
                                  Biên soạn ⚙️
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSentence(sentence.id)}
                                  className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 transition-all"
                                  title="Xóa câu"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // Expanded Mode Layout (Full premium sentence editor card)
                        return (
                          <div key={sentence.id} className="p-8 rounded-[32px] bg-[#131317] border border-amber-500/20 space-y-6 relative group/card">
                            
                            {/* Header row with indexes and actions */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 font-black text-sm flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Thoại bài học</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedSentences(prev => ({ ...prev, [sentence.id]: false }))}
                                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider border border-white/10 transition-all animate-pulse"
                                >
                                  Thu gọn 🔼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSentence(sentence.id)}
                                  className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 transition-all"
                                  title="Xóa câu"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                              {/* Transcript Input */}
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">English Quote (Transcript)</label>
                                <input 
                                  type="text" 
                                  defaultValue={sentence.transcript}
                                  onBlur={(e) => handleUpdateSentence(sentence.id, { transcript: e.target.value })}
                                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-sm text-white font-bold focus:border-amber-500/30 transition-all"
                                />
                              </div>

                              {/* Nested separate editors for Translation breakdown */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Dịch nghĩa tiếng Việt</label>
                                  <input 
                                    type="text" 
                                    defaultValue={parsed.translation}
                                    onBlur={(e) => {
                                      const bundled = bundleTranslation(e.target.value, parsed.ipa, parsed.targetScore);
                                      handleUpdateSentence(sentence.id, { translation: bundled });
                                    }}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-sm text-white focus:border-amber-500/30 transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Phiên âm gợi ý IPA</label>
                                  <input 
                                    type="text" 
                                    defaultValue={parsed.ipa}
                                    onBlur={(e) => {
                                      const bundled = bundleTranslation(parsed.translation, e.target.value, parsed.targetScore);
                                      handleUpdateSentence(sentence.id, { translation: bundled });
                                    }}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-sm text-amber-500 font-mono focus:border-amber-500/30 transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Ngưỡng điểm đạt đạt tối thiểu</label>
                                  <input 
                                    type="number" 
                                    defaultValue={parsed.targetScore}
                                    onBlur={(e) => {
                                      const bundled = bundleTranslation(parsed.translation, parsed.ipa, Number(e.target.value));
                                      handleUpdateSentence(sentence.id, { translation: bundled });
                                    }}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-sm text-white font-mono focus:border-amber-500/30 transition-all"
                                  />
                                </div>
                              </div>

                              {/* Timings & Media */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Bắt đầu (giây)</label>
                                  <input 
                                    type="number" 
                                    step="0.1"
                                    defaultValue={sentence.start_time || 0}
                                    onBlur={(e) => handleUpdateSentence(sentence.id, { start_time: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 px-4 text-xs font-mono text-white/80"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Kết thúc (giây)</label>
                                  <input 
                                    type="number" 
                                    step="0.1"
                                    defaultValue={sentence.end_time || 4}
                                    onBlur={(e) => handleUpdateSentence(sentence.id, { end_time: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 px-4 text-xs font-mono text-white/80"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Audio Sample URL</label>
                                  <input 
                                    type="text" 
                                    defaultValue={sentence.audio_url || ""}
                                    onBlur={(e) => handleUpdateSentence(sentence.id, { audio_url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 px-4 text-xs font-mono text-white/80"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-4">Ảnh câu thoại URL</label>
                                  <input 
                                    type="text" 
                                    defaultValue={sentence.thumbnail_url || ""}
                                    onBlur={(e) => handleUpdateSentence(sentence.id, { thumbnail_url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 px-4 text-xs font-mono text-white/80"
                                  />
                                </div>
                              </div>

                              {/* Content Intelligence Accordion (Existing Cards) */}
                              <div className="border-t border-white/5 pt-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedMetaSentences(prev => ({ ...prev, [sentence.id]: !prev[sentence.id] }));
                                  }}
                                  className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                                >
                                  <Brain size={12} /> {expandedMetaSentences[sentence.id] ? "Ẩn chỉ số Trí tuệ nội dung" : "🧠 Hiển thị Trí tuệ & Pacing cảm xúc"}
                                </button>
                                
                                {expandedMetaSentences[sentence.id] && (
                                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Emotional Pacing</label>
                                      <select
                                        value={sentence.metadata?.pacing_type || "medium"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'pacing_type', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="easy">Easy (Khởi động)</option>
                                        <option value="medium">Medium (Tăng tốc)</option>
                                        <option value="hard">Hard (Thử thách)</option>
                                        <option value="emotional payoff">Payoff (Cao trào cảm xúc)</option>
                                        <option value="recovery">Recovery (Hồi sức/Thư giãn)</option>
                                      </select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Tốc độ thoại (Speed)</label>
                                      <select
                                        value={sentence.metadata?.speech_speed || "normal"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'speech_speed', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="slow">Slow (Chậm)</option>
                                        <option value="normal">Normal (Vừa phải)</option>
                                        <option value="fast">Fast (Nhanh)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Emotion Type</label>
                                      <select
                                        value={sentence.metadata?.emotion_type || "Inspiring"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'emotion_type', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="Inspiring">Inspiring (Truyền cảm hứng)</option>
                                        <option value="Dramatic">Dramatic (Kịch tính)</option>
                                        <option value="Angry">Angry (Giận dữ/Mạnh mẽ)</option>
                                        <option value="Sad">Sad (Trầm buồn/Sâu lắng)</option>
                                        <option value="Romantic">Romantic (Lãng mạn)</option>
                                        <option value="Epic">Epic (Hào hùng/Sử thi)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Độ khó phát âm</label>
                                      <select
                                        value={sentence.metadata?.pronunciation_difficulty || "medium"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'pronunciation_difficulty', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="low">Low (Dễ)</option>
                                        <option value="medium">Medium (Trung bình)</option>
                                        <option value="high">High (Khó)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Shadowing Priority</label>
                                      <select
                                        value={sentence.metadata?.shadowing_priority || "medium"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'shadowing_priority', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High (Uu tiên shadow)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Replay Priority</label>
                                      <select
                                        value={sentence.metadata?.replay_priority || "medium"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'replay_priority', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High (Ôn tập nhiều)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Accent Type</label>
                                      <select
                                        value={sentence.metadata?.accent_type || "US"}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'accent_type', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-xs text-white"
                                      >
                                        <option value="US">US (Giọng Mỹ)</option>
                                        <option value="UK">UK (Giọng Anh)</option>
                                        <option value="AU">AU (Giọng Úc)</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Dopamine Score</label>
                                        <span className="text-[9px] font-mono text-amber-500 font-bold">{sentence.metadata?.dopamine_score || 70}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={sentence.metadata?.dopamine_score || 70}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'dopamine_score', Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                      />
                                    </div>

                                    <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Difficulty Score</label>
                                        <span className="text-[9px] font-mono text-amber-500 font-bold">{sentence.metadata?.difficulty_score || 50}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={sentence.metadata?.difficulty_score || 50}
                                        onChange={(e) => handleMetaUpdate(sentence.id, sentence.metadata, 'difficulty_score', Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 rounded-3xl border border-dashed border-white/10 text-white/30 text-xs italic">
                      Bài học này chưa có câu thoại nào. Hãy thêm câu thoại ở trên để bắt đầu!
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
