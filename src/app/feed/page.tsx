"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ArrowLeft, Heart, Bookmark, Share2, Volume2, ChevronUp, Sparkles, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import { FEED_ITEMS } from "@/lib/data";

export default function FeedPage() {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const item = FEED_ITEMS[current];

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -80) next();
    else if (info.offset.y > 80) prev();
  };

  const next = () => setCurrent((c) => Math.min(c + 1, FEED_ITEMS.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const toggleLike = (id: string) => setLiked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleSave = (id: string) => setSaved((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div className="bg-primary min-h-screen overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 relative flex flex-col">
        {/* Header Overlay */}
        <div className="container-custom py-4 flex items-center justify-between z-30">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-glass-hover transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="violet" className="px-3 py-1 font-bold">Khám phá</Badge>
            <span className="text-xs font-black font-mono text-muted">{current + 1} / {FEED_ITEMS.length}</span>
          </div>
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center border-accent-gold/30">
            <Flame size={18} className="text-accent-gold" />
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <motion.div 
            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
          >
            Vuốt để khám phá
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -100, scale: 0.9, rotateX: -20 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={handleDragEnd}
              className="w-full max-w-[400px] h-[75vh] px-4 cursor-grab active:cursor-grabbing z-10"
            >
              <Card 
                padding="none" 
                className={`w-full h-full relative overflow-hidden bg-gradient-to-br ${item.color} flex flex-col items-center justify-center p-8 text-center border-white/20`}
                hover={false}
              >
                {/* Background FX */}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                {/* Content Header */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/20">{item.category}</Badge>
                </div>
                
                <button className="absolute top-6 right-6 w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <Volume2 size={18} />
                </button>

                {/* Main Content */}
                <div className="relative z-10 w-full">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {item.type === "quote" && (
                      <div className="space-y-6">
                        <div className="text-6xl mb-4">“</div>
                        <p className="text-2xl md:text-3xl font-display font-black leading-tight italic tracking-tight">{item.content}</p>
                        <div className="flex flex-col items-center gap-2 pt-4">
                          <div className="w-8 h-1 bg-white/40 rounded-full" />
                          <p className="text-sm font-bold uppercase tracking-widest text-white/80">{item.author}</p>
                        </div>
                      </div>
                    )}
                    
                    {item.type === "phrase" && (
                      <div className="space-y-6">
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white">Thành ngữ quyền lực</Badge>
                        <p className="text-4xl font-display font-black tracking-tighter leading-none">{item.content}</p>
                        {item.meaning && (
                          <p className="text-lg font-medium text-white/90 leading-snug">
                            {item.meaning}
                          </p>
                        )}
                        {item.example && (
                          <Card className="bg-black/30 border-white/10 p-4" hover={false}>
                            <p className="text-sm italic text-white/80">"{item.example}"</p>
                          </Card>
                        )}
                      </div>
                    )}

                    {item.type === "word" && (
                      <div className="space-y-4">
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white">Từ vựng SGK</Badge>
                        <p className="text-5xl font-display font-black tracking-tighter">{item.content}</p>
                        {item.phonetic && <p className="font-mono text-base font-bold text-white/70 italic">{item.phonetic}</p>}
                        {item.meaning && (
                          <p className="text-lg font-medium text-white/90">
                            {item.meaning}
                          </p>
                        )}
                        {item.example && (
                          <Card className="bg-black/30 border-white/10 p-4" hover={false}>
                            <p className="text-sm italic text-white/80">"{item.example}"</p>
                          </Card>
                        )}
                      </div>
                    )}


                  </motion.div>
                </div>

                {/* Nav Cue */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <motion.div 
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-1 opacity-40"
                  >
                    <ChevronUp size={24} className="rotate-180" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Action Sidebar */}
          <div className="absolute right-6 md:right-[calc(50%-250px)] bottom-1/4 flex flex-col gap-6 z-20">
            {[
              { icon: <Heart size={24} />, action: () => toggleLike(item.id), active: liked.has(item.id), color: "#f43f5e", label: "Thích" },
              { icon: <Bookmark size={24} />, action: () => toggleSave(item.id), active: saved.has(item.id), color: "#f5c842", label: "Lưu" },
              { icon: <Share2 size={24} />, action: () => {}, active: false, color: "#06b6d4", label: "Chia sẻ" },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.2, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={a.action}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-xl ${
                    a.active ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10"
                  } border`}
                  style={{ color: a.active ? a.color : "white" }}
                >
                  {a.icon}
                </motion.button>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{a.label}</span>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {FEED_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-500 rounded-full ${
                  i === current ? "w-10 bg-accent-violet-bright" : "w-2 bg-white/20"
                } h-2`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
