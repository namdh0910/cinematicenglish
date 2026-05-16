"use client";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  LayoutGrid, 
  List,
  SortDesc
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import StoryTable, { StoryItem } from "@/components/admin/StoryTable";

interface StoriesClientProps {
  initialStories: any[];
}

export default function StoriesClient({ initialStories }: StoriesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || "");

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
        
        <Link href="/admin/stories/new">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
            <Plus size={20} strokeWidth={3} /> Create New Story
          </button>
        </Link>
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
    </div>
  );
}
