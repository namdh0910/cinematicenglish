"use client";
import { useState } from "react";
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
import StoryTable, { StoryItem } from "@/components/admin/StoryTable";

const MOCK_STORIES: StoryItem[] = [
  { id: '1', title: 'The Godfather: Power Perception', category: 'Power & Influence', duration: '12:45', status: 'published', plays: 12402, quizzes: 5, xp: 250, createdAt: '2024-03-10', thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&auto=format&fit=crop' },
  { id: '2', title: 'Stoicism for Modern Chaos', category: 'Philosophy', duration: '08:20', status: 'published', plays: 8120, quizzes: 3, xp: 300, createdAt: '2024-03-08', thumbnail: 'https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=200&auto=format&fit=crop' },
  { id: '3', title: 'The Art of Negotiation', category: 'Business', duration: '15:10', status: 'draft', plays: 0, quizzes: 2, xp: 450, createdAt: '2024-03-12', thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200&auto=format&fit=crop' },
  { id: '4', title: 'Emotional Intelligence 101', category: 'Psychology', duration: '10:30', status: 'published', plays: 5400, quizzes: 4, xp: 150, createdAt: '2024-03-05', thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop' },
  { id: '5', title: 'Interstellar: Time & Sacrifice', category: 'Cinema', duration: '18:50', status: 'archived', plays: 15200, quizzes: 8, xp: 500, createdAt: '2024-02-28', thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=200&auto=format&fit=crop' },
  { id: '6', title: 'Steve Jobs: Reality Distortion', category: 'Business', duration: '09:15', status: 'published', plays: 7240, quizzes: 3, xp: 350, createdAt: '2024-03-01', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=200&auto=format&fit=crop' },
  { id: '7', title: 'The Matrix: Choice & Fate', category: 'Philosophy', duration: '14:20', status: 'draft', plays: 0, quizzes: 6, xp: 400, createdAt: '2024-03-14', thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop' },
  { id: '8', title: 'Social Dynamics & Mirroring', category: 'Psychology', duration: '11:45', status: 'published', plays: 4300, quizzes: 3, xp: 200, createdAt: '2024-02-25', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&auto=format&fit=crop' },
  { id: '9', title: 'House of Cards: Strategy', category: 'Power & Influence', duration: '16:30', status: 'published', plays: 6800, quizzes: 5, xp: 450, createdAt: '2024-02-20', thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=200&auto=format&fit=crop' },
  { id: '10', title: 'Inception: The Idea Seed', category: 'Cinema', duration: '20:10', status: 'published', plays: 9500, quizzes: 7, xp: 550, createdAt: '2024-02-15', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop' },
  { id: '11', title: 'Principles by Ray Dalio', category: 'Business', duration: '12:00', status: 'published', plays: 3200, quizzes: 4, xp: 300, createdAt: '2024-02-10', thumbnail: 'https://images.unsplash.com/photo-1454165833767-027ffea7025c?q=80&w=200&auto=format&fit=crop' },
  { id: '12', title: 'The Alchemist: Legend', category: 'Philosophy', duration: '07:45', status: 'published', plays: 12500, quizzes: 2, xp: 200, createdAt: '2024-01-30', thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop' },
  { id: '13', title: 'Deep Work Philosophy', category: 'Psychology', duration: '09:50', status: 'draft', plays: 0, quizzes: 3, xp: 350, createdAt: '2024-03-15', thumbnail: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=200&auto=format&fit=crop' },
  { id: '14', title: 'Wall Street: Greed', category: 'Business', duration: '14:00', status: 'archived', plays: 5600, quizzes: 4, xp: 400, createdAt: '2024-01-20', thumbnail: 'https://images.unsplash.com/photo-1611974717482-999556bbac4c?q=80&w=200&auto=format&fit=crop' },
  { id: '15', title: 'Blade Runner: Identity', category: 'Cinema', duration: '17:20', status: 'published', plays: 4800, quizzes: 6, xp: 450, createdAt: '2024-02-05', thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop' },
];

export default function StoriesPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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
          {/* Search & Basic Filters */}
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tiêu đề câu chuyện..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-white/60 flex items-center gap-2 hover:bg-white/10 transition-all">
                Category <ChevronDown size={14} />
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-white/60 flex items-center gap-2 hover:bg-white/10 transition-all">
                Status <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Sorting & View Toggle */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-white/60 flex items-center gap-2 hover:bg-white/10 transition-all">
              <SortDesc size={18} /> Sort: Newest <ChevronDown size={14} />
            </button>
            
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

        {/* Active Filters / Chips (Optional) */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mr-2">Active Filters:</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-amber-500/80 flex items-center gap-2">
              Status: Published <button className="hover:text-white">×</button>
            </span>
            <button className="text-[10px] font-bold text-white/20 hover:text-white underline underline-offset-4">Clear All</button>
          </div>
        </div>
      </div>

      {/* 3. Story Table Content */}
      <StoryTable stories={MOCK_STORIES} />
    </div>
  );
}
