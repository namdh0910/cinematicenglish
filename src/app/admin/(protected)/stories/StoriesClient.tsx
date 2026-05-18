"use client";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  LayoutGrid, 
  List,
  SortDesc,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import StoryTable, { StoryItem } from "@/components/admin/StoryTable";
import AIStoryGenerator from "@/components/admin/AIStoryGenerator";
import { saveAIComposedStory } from "@/app/admin/actions";

interface StoriesClientProps {
  initialStories: any[];
}

export default function StoriesClient({ initialStories }: StoriesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || "");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUseGenerated = async (aiData: any) => {
    setIsSaving(true);
    
    // Parse the transcript into individual speaking sentences
    const lines = aiData.transcript
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0 && !l.startsWith("(")); // Filter out stage directions

    const sentences = lines.map((line: string, idx: number) => {
      // Clean tags like [NARRATOR]: or Character:
      const cleaned = line.replace(/^\[?([A-Z0-9\s_-]+)\]?:\s*/i, "").trim();
      
      // Simple heuristic IPA generator
      const cleanWords = cleaned.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").split(/\s+/);
      const ipaWords = cleanWords.map(word => {
        return word
          .replace(/th/g, "θ")
          .replace(/ea/g, "iː")
          .replace(/oo/g, "uː")
          .replace(/ee/g, "iː")
          .replace(/ou/g, "aʊ")
          .replace(/sh/g, "ʃ")
          .replace(/ch/g, "tʃ")
          .replace(/ck/g, "k")
          .replace(/ph/g, "f")
          .replace(/tion/g, "ʃn");
      });
      const ipa = `/${ipaWords.join(" ")}/`;

      return {
        transcript: cleaned,
        translation_only: `[Bản dịch AI]: Cần hoàn chỉnh bản dịch cho câu: "${cleaned}"`,
        ipa,
        target_score: 80,
        start_time: idx * 6,
        end_time: (idx + 1) * 6,
        metadata: {
          pacing_type: idx === 0 ? "easy" : idx === lines.length - 1 ? "recovery" : "medium",
          speech_speed: "normal",
          emotion_type: "Inspiring",
          pronunciation_difficulty: "medium",
          shadowing_priority: "medium",
          replay_priority: "medium",
          accent_type: "US",
          dopamine_score: 80,
          difficulty_score: Math.min(100, Math.max(10, cleanWords.length * 6))
        }
      };
    });

    const payload = {
      story: {
        title: aiData.title,
        synopsis: aiData.description,
        difficulty: 'medium',
        thumbnail_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
      },
      scene: {
        video_url: aiData.videoUrl || 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        thumbnail_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
      },
      lesson: {
        title: `Luyện nói trích đoạn: ${aiData.title}`,
        description: `Rèn luyện phát âm tự nhiên và sắc sảo cùng câu thoại từ ${aiData.title}.`
      },
      sentences: sentences.slice(0, 5) // Cap at 5 scenes for optimal speaking pacing
    };

    try {
      const res = await saveAIComposedStory(payload);
      if (res.success) {
        setIsAiModalOpen(false);
        router.refresh();
      } else {
        alert("Lỗi lưu câu chuyện AI: " + res.error);
      }
    } catch (err) {
      console.error("Failed to save AI story:", err);
      alert("Có lỗi xảy ra khi lưu câu chuyện.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update URL when filters change
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters('query', searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white">Story Library</h2>
          <p className="text-white/40 font-medium italic">Quản lý và biên tập nội dung Cinematic English.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-purple border border-violet-500/30"
          >
            <Sparkles size={18} strokeWidth={3} /> AI Content Factory 🚀
          </button>

          <Link href="/admin/stories/new">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
              <Plus size={20} strokeWidth={3} /> Create New Story
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Filters & Toolbar */}
      <div className="p-6 rounded-[32px] bg-[#1a1a1a] border border-white/5 space-y-6">
        <div className="flex flex-col xl:flex-row gap-4 justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tiêu đề câu chuyện..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <select 
                onChange={(e) => updateFilters('category', e.target.value)}
                value={searchParams.get('category') || "All"}
                className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-white/60 focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
              >
                <option value="All">All Categories</option>
                <option value="Psychology">Psychology</option>
                <option value="Business">Business</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Cinema">Cinema</option>
                <option value="Power & Influence">Power & Influence</option>
              </select>

              <select 
                onChange={(e) => updateFilters('status', e.target.value)}
                value={searchParams.get('status') || "All"}
                className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-white/60 focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              onChange={(e) => updateFilters('sort', e.target.value)}
              value={searchParams.get('sort') || "created_at.desc"}
              className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-white/60 focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
            >
              <option value="created_at.desc">Newest First</option>
              <option value="created_at.asc">Oldest First</option>
              <option value="plays.desc">Most Popular</option>
              <option value="title.asc">A-Z</option>
            </select>
            
            <div className="h-10 w-px bg-white/5 mx-1" />
            
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white/10 text-amber-500' : 'text-white/20 hover:text-white/40'}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-amber-500' : 'text-white/20 hover:text-white/40'}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Story Table Content */}
      <StoryTable stories={initialStories} />

      {/* AI Content Factory Modal */}
      <AIStoryGenerator 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onUse={handleUseGenerated}
      />
    </div>
  );
}
