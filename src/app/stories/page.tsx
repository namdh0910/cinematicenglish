"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Sparkles } from "lucide-react";
import { STORIES } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";

export default function StoriesPage() {
  const categories = ["Tất cả", "Tâm Lý Học", "Điện Ảnh", "Kinh Doanh", "Triết Học", "Giao Tiếp"];

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <main className="pt-24 pb-12">
        <Section>
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Badge variant="violet" className="mb-2">Thư viện</Badge>
              <h1 className="text-display mb-2">Kho Câu Chuyện Điện Ảnh</h1>
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
            {STORIES.map((story, i) => (
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
