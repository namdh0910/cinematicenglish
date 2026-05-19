"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Sparkles, Users } from "lucide-react";
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
    <div className="bg-[#F7F7F5] min-h-screen text-[#3D3D3B]">
      <Navbar />

      <main className="pt-6 pb-12">
        <Section>
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-6">
            <div>
              <Badge variant="violet" className="mb-2">Thư viện</Badge>
              <h1 className="text-display mb-2 text-[#1A1A18]">Kho Câu Chuyện Điện Ảnh</h1>
              <p className="text-[#6B6B68] font-medium text-sm">Học tiếng Anh qua những câu chuyện sâu sắc và lôi cuốn nhất.</p>
            </div>
            
            <div className="relative group max-w-md w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Tìm câu chuyện, chủ đề..." 
                className="w-full bg-[#FFFFFF] border border-[#EBEBEA] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 text-[#3D3D3B] placeholder:text-[#6B6B68] transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl mr-2 shrink-0">
              <Filter size={14} className="text-[#4B5563]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Lọc theo</span>
            </div>
            {categories.map((cat, i) => {
              const isActive = i === 0;
              return (
                <button 
                  key={cat}
                  className="whitespace-nowrap transition-all border cursor-pointer"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    backgroundColor: isActive ? '#EFF6FF' : '#F3F4F6',
                    color: isActive ? '#1D4ED8' : '#4B5563',
                    borderColor: isActive ? '#BFDBFE' : '#E5E7EB'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#E9EAEC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <Card 
                key={story.id} 
                padding="none" 
                className="overflow-hidden group flex flex-col h-full rounded-[24px] border border-[#EBEBEA] hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-500" 
                transition={{ delay: i * 0.05 }}
              >
                {/* 40%+ Image Area */}
                <div className="h-64 relative overflow-hidden bg-black shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  
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
                  
                  <Badge variant="violet" className="absolute top-4 right-4 z-30 backdrop-blur-md bg-black/40 border-none">{story.category}</Badge>
                  <div className="absolute bottom-4 left-6 flex gap-2 z-30">
                    <Badge variant="outline" className="bg-black/60 backdrop-blur-md font-bold text-white border-white/20">{story.level}</Badge>
                    <Badge variant="outline" className="bg-black/60 backdrop-blur-md font-bold text-white border-white/20">▶ {story.duration}</Badge>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1 bg-[#FFFFFF] z-30 relative -mt-4 rounded-t-[24px]">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-display font-black text-2xl leading-tight text-[#1A1A18] group-hover:text-[#2563EB] transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-[#3D3D3B] leading-relaxed mb-6 line-clamp-3 flex-1 font-medium">
                    {story.description}
                  </p>
                  
                  {story.plays ? (
                    <div className="pt-6 border-t border-[#EBEBEA] flex items-center justify-between mt-auto w-full">
                      <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center' }}>
                        <Users size={14} className="text-[#6B7280]" />
                        <span>{story.plays.toLocaleString()} lượt học</span>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => window.location.href=`/stories/${story.id}`}
                        className="font-semibold tracking-wide bg-[#2563EB] hover:bg-[#1D4ED8]"
                      >
                        Học ngay
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
