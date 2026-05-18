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

const getMovieImage = (title: string, fallbackUrl?: string) => {
  const t = title.toLowerCase();
  if (t.includes("godfather") || t.includes("bố già")) return "https://images.unsplash.com/photo-1627885449231-15b53ff9d10f?auto=format&fit=crop&w=800&q=80"; // Mafia/classic vibe
  if (t.includes("dark knight") || t.includes("hiệp sĩ bóng đêm") || t.includes("batman")) return "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80"; // Dark city vibe
  if (t.includes("forrest") || t.includes("gump")) return "https://images.unsplash.com/photo-1455243170701-d7031da7e9e6?auto=format&fit=crop&w=800&q=80"; // Journey/bench vibe
  if (t.includes("titanic")) return "https://images.unsplash.com/photo-1500077423678-052445851415?auto=format&fit=crop&w=800&q=80"; // Ocean/ship vibe
  if (t.includes("lion king") || t.includes("vua sư tử")) return "https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=800&q=80"; // Savanna vibe
  if (t.includes("gladiator") || t.includes("võ sĩ giác đấu")) return "https://images.unsplash.com/photo-1590135319808-16e788bc535e?auto=format&fit=crop&w=800&q=80"; // Colosseum vibe
  if (t.includes("wolf of wall street")) return "https://images.unsplash.com/photo-1611972589053-2947b1897e06?auto=format&fit=crop&w=800&q=80"; // Wall street vibe
  if (t.includes("steve jobs")) return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"; // Tech vibe
  
  return fallbackUrl && fallbackUrl.length > 5 ? fallbackUrl : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"; // Generic cinematic film reel
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
          setStories(STORIES.map(s => ({ ...s, coverImage: getMovieImage(s.title, (s as any).coverImage) })));
          return;
        }

        if (data && data.length > 0) {
          const mappedStories = data.map((item) => {
            const title = item.title;
            return {
              id: item.id,
              title: item.title,
              description: item.description || "Học tiếng Anh qua thước phim kinh điển.",
              coverImage: getMovieImage(title, item.thumbnail_url),
              difficulty: item.difficulty,
              level: item.difficulty === 'easy' ? 'B1' : item.difficulty === 'medium' ? 'B2' : 'C1',
              color: getStoryColor(title),
              category: getStoryCategory(item.difficulty),
              duration: item.difficulty === 'easy' ? '05:00' : item.difficulty === 'medium' ? '08:00' : '12:00',
              plays: 1200 + Math.floor(Math.random() * 5000),
              xp: item.difficulty === 'easy' ? 200 : item.difficulty === 'medium' ? 300 : 400
            };
          });
          setStories(mappedStories);
        } else {
          setStories(STORIES.map(s => ({ ...s, coverImage: getMovieImage(s.title, (s as any).coverImage) })));
        }
      } catch (err) {
        console.error("Failed to load stories:", err);
        setStories(STORIES.map(s => ({ ...s, coverImage: getMovieImage(s.title, (s as any).coverImage) })));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <Card 
                key={story.id} 
                padding="none" 
                className="overflow-hidden group flex flex-col h-full rounded-[32px] drop-shadow-lg border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-glow-purple" 
                transition={{ delay: i * 0.05 }}
              >
                {/* 40%+ Image Area */}
                <div className="h-64 relative overflow-hidden bg-black shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent z-10" />
                  
                  {/* Grain Overlay */}
                  <div className="absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}></div>
                  
                  <motion.img 
                    src={story.coverImage}
                    alt={story.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = "/images/default-poster.svg";
                    }}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  
                  <Badge variant="violet" className="absolute top-4 right-4 z-30 backdrop-blur-md bg-black/40">{story.category}</Badge>
                  <div className="absolute bottom-4 left-6 flex gap-2 z-30">
                    <Badge variant="outline" className="bg-black/60 backdrop-blur-md font-bold">{story.level}</Badge>
                    <Badge variant="outline" className="bg-black/60 backdrop-blur-md font-bold">▶ {story.duration}</Badge>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1 bg-bg-primary z-30 relative -mt-4 rounded-t-[32px]">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-display font-black text-2xl leading-tight text-white group-hover:text-accent-gold transition-colors line-clamp-2 drop-shadow-md">
                      {story.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-secondary/80 leading-relaxed mb-6 line-clamp-3 flex-1 font-medium">
                    {story.description}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted mb-1 font-bold">Lượt học</span>
                      <span className="text-xs font-black text-white/80 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-accent-gold" />
                        {story.plays.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => window.location.href=`/stories/${story.id}`}
                      className="font-black tracking-wide"
                    >
                      Học ngay
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
