"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Edit2, 
  Eye, 
  Trash2, 
  MoreHorizontal, 
  Play, 
  HelpCircle, 
  Zap,
  CheckCircle2,
  Clock,
  Archive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../ui/Badge";
import { deleteStory } from "@/app/admin/actions";

export interface StoryItem {
  id: string;
  thumbnail: string;
  title: string;
  category: string;
  duration: string;
  status: 'published' | 'draft' | 'archived';
  plays: number;
  quizzes: number;
  xp: number;
  createdAt: string;
}

interface StoryTableProps {
  stories: StoryItem[];
}

export default function StoryTable({ stories }: StoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === stories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stories.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa story "${title}" không?`)) {
      try {
        await deleteStory(id);
        // Page will revalidate via server action
      } catch (err) {
        console.error("Failed to delete story:", err);
        alert("Có lỗi xảy ra khi xóa story.");
      }
    }
  };

  const getStatusConfig = (status: StoryItem['status']) => {
    switch (status) {
      case 'published': return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, label: 'Published' };
      case 'draft': return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Clock, label: 'Draft' };
      case 'archived': return { color: 'text-white/30 bg-white/5 border-white/10', icon: Archive, label: 'Archived' };
    }
  };

  return (
    <div className="w-full">
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-6 p-4 rounded-2xl bg-amber-500 text-black flex items-center justify-between shadow-glow-amber"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">Đã chọn {selectedIds.length} mục</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-zinc-900 transition-colors">Publish</button>
              <button className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto rounded-[32px] border border-white/5 bg-[#1a1a1a]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-5 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === stories.length && stories.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-amber-500 accent-amber-500" 
                />
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-white/30 font-bold">Story</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-white/30 font-bold">Status</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-white/30 font-bold">Stats</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-white/30 font-bold">XP</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-white/30 font-bold">Date</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-white/30 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stories.map((story) => {
              const status = getStatusConfig(story.status);
              return (
                <tr key={story.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(story.id)}
                      onChange={() => toggleSelect(story.id)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-amber-500 accent-amber-500" 
                    />
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate group-hover:text-amber-500 transition-colors">
                          {story.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-white/20 uppercase font-bold tracking-wider">{story.category}</span>
                          <span className="text-white/10 text-[10px]">•</span>
                          <span className="text-[10px] text-white/20 font-mono">{story.duration}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                      <status.icon size={12} />
                      {status.label}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Play size={14} className="text-amber-500/50" />
                        <span className="text-xs font-mono">{story.plays}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/40">
                        <HelpCircle size={14} className="text-blue-500/50" />
                        <span className="text-xs font-mono">{story.quizzes}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Zap size={14} fill="currentColor" className="opacity-50" />
                      <span className="text-xs font-black">{story.xp}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs text-white/30 font-medium">{story.createdAt}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/stories/edit/${story.id}`}
                        title="Edit" 
                        className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <Link 
                        href={`/stories/${story.id}`}
                        target="_blank"
                        title="Preview" 
                        className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(story.id, story.title)}
                        title="Delete" 
                        className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="mt-8 flex items-center justify-between px-2">
        <div className="text-xs text-white/20 font-bold uppercase tracking-widest">Hiển thị 10 / 15 stories</div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/40 disabled:opacity-20 transition-all" disabled>Previous</button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-amber-500 text-black text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg bg-white/5 text-white/40 text-xs font-bold hover:bg-white/10">2</button>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/40 hover:bg-white/10 transition-all">Next</button>
        </div>
      </div>
    </div>
  );
}
