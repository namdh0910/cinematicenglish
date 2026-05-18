"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Sparkles } from "lucide-react";
import { STORIES } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const getStoryEmoji = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("godfather") || t.includes("bố già")) return "🌹";
  if (t.includes("dark knight") || t.includes("hiệp sĩ bóng đêm") || t.includes("batman")) return "🦇";
  if (t.includes("forrest") || t.includes("gump")) return "🏃";
  if (t.includes("titanic")) return "🚢";
  if (t.includes("lion king") || t.includes("vua sư tử")) return "🦁";
  return "🎬";
};

const getStoryColor = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("godfather")) return "from-red-950 to-bg-primary";
  if (t.includes("dark knight")) return "from-slate-900 to-bg-primary";
  if (t.includes("forrest")) return "from-amber-950 to-bg-primary";
  if (t.includes("titanic")) return "from-blue-950 to-bg-primary";
  if (t.includes("lion king")) return "from-yellow-950 to-bg-primary";
  return "from-violet-950 to-bg-primary";
};

const getStoryCategory = (difficulty: string) => {
  const diff = difficulty.toLowerCase();
  if (diff === 'easy' || diff === 'beginner') return "CƠ BẢN";
  if (diff === 'medium' || diff === 'intermediate') return "TRUNG CẤP";
  return "NÂNG CAO";
};

export default function StoriesPage() {
  const categories = ["Tất cả", "Tâm Lý Học", "Điện Ảnh", "Kinh Doanh", "Triết Học", "Giao Tiếp"];
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("is_published", true);
        
        if (error) {
          console.error("Supabase error loading stories:", error);
          setStories(STORIES);
          return;
        }

        if (data && data.length > 0) {
          const mappedStories = data.map((item) => {
            const title = item.title;
            return {
              id: item.id,
              title: item.title,
              description: item.description || "Học tiếng Anh qua thước phim kinh điển.",
              coverImage: item.thumbnail_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
              difficulty: item.difficulty,
              level: item.difficulty === 'easy' ? 'B1' : item.difficulty === 'medium' ? 'B2' : 'C1',
              emoji: getStoryEmoji(title),
              color: getStoryColor(title),
              category: getStoryCategory(item.difficulty),
              duration: item.difficulty === 'easy' ? '05:00' : item.difficulty === 'medium' ? '08:00' : '12:00',
              plays: 1200 + Math.floor(Math.random() * 5000),
              xp: item.difficulty === 'easy' ? 200 : item.difficulty === 'medium' ? 300 : 400
            };
          });
          setStories(mappedStories);
        } else {
          setStories(STORIES);
        }
      } catch (err) {
        console.error("Failed to load stories:", err);
        setStories(STORIES);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <main className="pt-24 pb-12">
        <Section>
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Badge variant="violet" className="mb-2">Thư viện</Badge>
              <h1 className="text-display mb-2 gradient-text-silver">Kho Câu Chuyện Điện Ảnh</h1>
              <p className="text-secondary">Học tiếng Anh qua những câu chuyện sâu sắc và lôi cuốn nhất.</p>
            </div>
            
            <div className="relative group max-w-md w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent-violet-bright transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Tìm câu chuyện, chủ đề..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl mr-2 shrink-0">
              <Filter size={14} className="text-muted" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Lọc theo</span>
            </div>
            {categories.map((cat, i) => (
              <button 
                key={cat}
                className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                  i === 0 
                    ? "bg-accent-violet/20 border-accent-violet/40 text-accent-violet-bright" 
                    : "bg-white/5 border-white/10 text-secondary hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <Card 
                key={story.id} 
                padding="none" 
                className="overflow-hidden group flex flex-col h-full" 
                transition={{ delay: i * 0.05 }}
              >
                <div className={`h-48 bg-gradient-to-br ${story.color} flex items-center justify-center text-6xl relative overflow-hidden`}>
                  <motion.span 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {story.emoji}
                  </motion.span>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <Badge variant="violet" className="absolute top-4 right-4 backdrop-blur-md bg-black/40">{story.category}</Badge>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge variant="outline" className="bg-black/60 backdrop-blur-md">{story.level}</Badge>
                    <Badge variant="outline" className="bg-black/60 backdrop-blur-md">▶ {story.duration}</Badge>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display font-bold text-xl leading-tight group-hover:text-accent-gold transition-colors line-clamp-1">{story.title}</h3>
                    <Badge variant="gold" className="shrink-0">+{story.xp} XP</Badge>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed mb-6 line-clamp-2 flex-1">
                    {story.description}
                  </p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted mb-1">Lượt nghe</span>
                      <span className="text-xs font-bold text-secondary flex items-center gap-1">
                        <Sparkles size={10} className="text-accent-gold" />
                        {story.plays.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => window.location.href=`/stories/${story.id}`}
                    >
                      Bắt đầu ngay
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
