"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ChevronDown, Star, Flame, ArrowRight, Sparkles, Volume2, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import StoryPlayer from "@/components/player/StoryPlayer";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { STORIES, TESTIMONIALS, PRICING, AI_CHARACTERS } from "@/lib/data";
import { AnimatePresence } from "framer-motion";

/* ── Animated background orbs ── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-violet w-[700px] h-[700px] -top-48 left-1/4 opacity-60" />
      <div className="orb orb-gold w-[400px] h-[400px] top-1/3 right-0 opacity-50" />
      <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-10 opacity-40" />
    </div>
  );
}

/* ── Waveform ── */
function Waveform({ active }: { active: boolean }) {
  const [heights, setHeights] = useState<number[]>([]);
  useEffect(() => {
    setHeights(Array.from({ length: 24 }, () => Math.random() * 32 + 8));
  }, []);

  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: active ? (heights[i] || 8) : "8px",
            animationDelay: `${i * 0.05}s`,
            animationPlayState: active ? "running" : "paused",
            opacity: active ? 1 : 0.3,
            transition: "height 0.2s",
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <HeroBackground />
        <div className="container-custom relative z-10 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center"
          >
            <Badge variant="violet" className="mb-8 px-4 py-1.5">
              <Sparkles size={12} className="mr-2" /> Học Tiếng Anh Cùng AI — Phiên bản Beta
            </Badge>

            <h1 className="text-hero mb-6" style={{ textAlign: 'center', fontFamily: 'var(--font-display), sans-serif' }}>
              Học Tiếng Anh Như{" "}
              <span className="gradient-text-gold">Netflix</span>,{" "}
              <br className="hidden md:block" />
              Không Phải Trường Học.
            </h1>

            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-secondary text-center font-sans">
              Những câu chuyện điện ảnh. Huấn luyện viên AI. Giao tiếp thực tế. Không còn những bài tập ngữ pháp nhàm chán — chỉ còn sự{" "}
              <span style={{ color: 'var(--accent-violet-bright)', display: 'inline' }}>lôi cuốn, ám ảnh và tiếng Anh</span>
              {" "}thấm sâu vào tâm trí bạn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full">
              <Button variant="gold" size="lg" onClick={() => setActiveStoryId('1')}>
                <Flame size={18} /> Bắt đầu miễn phí — Không cần thẻ
              </Button>
              <Button variant="ghost" size="lg" onClick={() => setDemoPlaying(!demoPlaying)}>
                <Volume2 size={18} /> {demoPlaying ? "Dừng nghe" : "Nghe thử câu chuyện"}
              </Button>
            </div>

            {/* Demo waveform card */}
            <div className="glass-card max-w-xl mx-auto p-5" style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '576px' }}>
              <button
                onClick={() => setDemoPlaying(!demoPlaying)}
                className="w-12 h-12 rounded-full flex-center pulse-ring"
                style={{ background: "var(--gradient-violet)", flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {demoPlaying ? <span className="text-white font-bold text-lg">‖</span> : <Play size={18} className="text-white ml-0.5" />}
              </button>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="text-sm font-semibold mb-2">Tâm Lý Học Của Quyền Lực — Bản nghe thử</div>
                <Waveform active={demoPlaying} />
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>1:24</div>
            </div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-16 flex justify-center opacity-40"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-12 border-y border-subtle">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "380K+", label: "Người học tích cực" },
            { value: "4.9★", label: "Đánh giá ứng dụng" },
            { value: "194", label: "Quốc gia" },
            { value: "98%", label: "Tỷ lệ giới thiệu" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-display font-black gradient-text-violet mb-1">{s.value}</div>
              <div className="text-sm text-secondary">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <Section>
        <div className="text-center mb-16">
          <Badge variant="violet" className="mb-4">Tại sao chọn Cinematic English</Badge>
          <h2 className="text-display mb-4">
            Giải trí <span className="gradient-text-gold">kết hợp</span> học tập
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-secondary">
            Quên đi những bài tập ngữ pháp khô khan. Chúng tôi xây dựng trải nghiệm học tập mà bạn thực sự khao khát mỗi ngày.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🎬", title: "Câu Chuyện Điện Ảnh", desc: "Lời dẫn truyện đầy lôi cuốn về tâm lý, triết học, kinh doanh. Học tiếng Anh như đang xem phim tài liệu Netflix.", color: "var(--accent-violet)" },
            { icon: "🤖", title: "AI Coach Phát Âm", desc: "Ghi âm giọng nói của bạn. Nhận điểm số phát âm, phản hồi về sự trôi chảy và tốc độ ngay lập tức từ AI.", color: "var(--accent-cyan)" },
            { icon: "🎭", title: "Chat Với Nhân Vật AI", desc: "Trò chuyện với bác sĩ tâm lý, CEO, trùm Mafia hoặc một người bạn Mỹ. Giọng nói và trí nhớ thực tế.", color: "var(--accent-gold)" },
            { icon: "📱", title: "Khám Phá Kiểu TikTok", desc: "Lướt qua các bài học siêu ngắn — thành ngữ, danh ngôn, cụm từ quyền lực — được thiết kế để gây nghiện.", color: "var(--accent-rose)" },
            { icon: "🔥", title: "Chuỗi Streak & XP", desc: "Thăng cấp mỗi ngày. Tích lũy XP, mở khóa thành tích, giữ lửa chuỗi học tập và cạnh tranh trên bảng xếp hạng.", color: "var(--accent-orange)" },
            { icon: "🌍", title: "Cộng Đồng Toàn Cầu", desc: "Học cùng hơn 380,000 học viên khác. Thử thách hằng tuần, hệ thống bạn bè và bảng vinh danh công khai.", color: "var(--accent-emerald)" },
          ].map((f, i) => (
            <Card key={f.title} transition={{ delay: i * 0.05 }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid var(--border-subtle)` }}>
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-secondary">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── STORIES PREVIEW ─── */}
      <Section className="bg-secondary/30">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <Badge variant="gold" className="mb-3">Thư Viện Câu Chuyện</Badge>
            <h2 className="text-display">
              Những Câu Chuyện <span className="gradient-text-violet">Chạm Đến Cảm Xúc</span>
            </h2>
          </div>
          <Button variant="ghost" onClick={() => window.location.href='/stories'}>
            Xem Tất Cả <ArrowRight size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.map((story, i) => (
            <Card key={story.id} padding="none" className="overflow-hidden group" transition={{ delay: i * 0.1 }}>
              <div className={`h-40 bg-gradient-to-br ${story.color} flex items-center justify-center text-5xl relative`}>
                <span>{story.emoji}</span>
                <div className="absolute inset-0 bg-black/20" />
                <Badge variant="violet" className="absolute top-3 right-3">{story.category}</Badge>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="outline" className="bg-black/50 backdrop-blur-md">▶ {story.duration}</Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-base leading-tight group-hover:text-accent-gold transition-colors">{story.title}</h3>
                  <Badge variant="gold" className="shrink-0 text-[10px]">+{story.xp} XP</Badge>
                </div>
                <p className="text-sm mb-4 line-clamp-2 text-secondary">{story.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">🎧 {story.plays} plays</span>
                  <button 
                    onClick={() => setActiveStoryId(story.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-accent-violet-bright hover:gap-2 transition-all cursor-pointer"
                  >
                    Nghe ngay <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── AI CHARACTERS ─── */}
      <Section>
        <div className="text-center mb-12">
          <Badge variant="emerald" className="mb-4">Nhân Vật AI</Badge>
          <h2 className="text-display mb-4">
            Thực Hành Với <span className="gradient-text-gold">Những Cá Tính Thật</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto text-secondary">
            Sáu nhân vật AI độc đáo. Mỗi người có giọng nói, tính cách và phong cách trò chuyện riêng biệt.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AI_CHARACTERS.map((c, i) => (
            <Card key={c.id} transition={{ delay: i * 0.05 }} className="group">
              <div className="text-3xl mb-3">{c.emoji}</div>
              <div className="font-bold font-display mb-0.5">{c.name}</div>
              <div className="text-xs mb-2" style={{ color: c.color }}>{c.role}</div>
              <p className="text-xs leading-relaxed text-secondary">{c.description}</p>
              <Link href={`/chat?character=${c.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all" style={{ color: c.color }}>
                Trò chuyện ngay <ArrowRight size={10} />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── TESTIMONIALS ─── */}
      <Section className="bg-secondary/30">
        <div className="text-center mb-12">
          <Badge variant="violet" className="mb-4">Cảm Nhận Học Viên</Badge>
          <h2 className="text-display">
            Người Thật, <span className="gradient-text-gold">Kết Quả Thật</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.name} transition={{ delay: i * 0.1 }}>
              <div className="flex gap-1 mb-4">
                {Array(5).fill(0).map((_, j) => <Star key={j} size={14} className="fill-accent-gold text-accent-gold" />)}
              </div>
              <p className="text-sm leading-relaxed mb-5 text-secondary">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-glow-violet"
                  style={{ background: "var(--gradient-violet)" }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-secondary">{t.role} · {t.country}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── PRICING ─── */}
      <Section id="pricing">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-4">Bảng Giá</Badge>
          <h2 className="text-display mb-4">
            Đầu Tư <span className="gradient-text-violet">Xứng Đáng</span> Cho Bản Thân
          </h2>
          <p className="text-lg max-w-xl mx-auto text-secondary">
            Bắt đầu miễn phí. Nâng cấp khi bạn sẵn sàng mở khóa toàn bộ trải nghiệm điện ảnh.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((plan, i) => (
            <Card key={plan.name} transition={{ delay: i * 0.1 }} className={`relative ${plan.highlight ? "border-accent shadow-glow-violet" : ""}`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="violet" className="px-4 py-1.5">{plan.badge}</Badge>
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-semibold mb-1 text-secondary">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-display font-black">{plan.price}</span>
                  <span className="text-sm text-secondary">/{plan.period}</span>
                </div>
                <p className="text-sm text-secondary">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="text-accent-emerald shrink-0">✓</span>
                    <span className="text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? "primary" : "ghost"} fullWidth>
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── FINAL CTA ─── */}
      <Section>
        <Card className="p-12 md:p-20 text-center relative overflow-hidden border-accent" hover={false}>
          <div className="orb orb-violet w-80 h-80 -top-20 left-1/2 -translate-x-1/2 opacity-30" />
          <div className="relative z-10">
            <h2 className="text-display mb-4">
              Hành Trình Tiếng Anh Của Bạn<br />
              Bắt Đầu <span className="gradient-text-gold">Ngay Hôm Nay</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto text-secondary">
              Gia nhập cùng hơn 380,000 học viên đã chọn những câu chuyện thay vì sách giáo khoa. Không cần thẻ tín dụng.
            </p>
            <Button variant="gold" size="lg" className="px-10 py-5">
              <Flame size={20} /> Bắt Đầu Học Miễn Phí
            </Button>
          </div>
        </Card>
      </Section>

      {/* ─── STORY PLAYER VERTICAL SLICE ─── */}
      <AnimatePresence>
        {activeStoryId && (
          <StoryPlayer 
            storyId={activeStoryId} 
            onClose={() => setActiveStoryId(null)} 
          />
        )}
      </AnimatePresence>

      {/* ─── ONBOARDING FLOW ─── */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow 
            onComplete={() => {
              localStorage.setItem("hasSeenOnboarding", "true");
              setShowOnboarding(false);
            }} 
          />
        )}
      </AnimatePresence>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 border-t border-subtle bg-secondary/20">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-glow-violet" style={{ background: "var(--gradient-violet)" }}>
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg">Cinematic<span className="gradient-text-gold">English</span></span>
          </div>
          <div className="flex gap-6 text-sm text-secondary">
            <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Liên hệ</Link>
          </div>
          <div className="text-sm text-muted">
            © 2025 Cinematic English. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
