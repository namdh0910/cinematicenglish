"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Video, Mic, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import VoiceRecorder from "@/components/coach/VoiceRecorder";

// ─── INSTANT DEMO PLAYER ──────────────────────────────────────────────────
function DemoPlayer() {
  const sentence = "I'm going to make him an offer he can't refuse.";
  const playAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'en-US';
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
      );
      if (premiumVoice) utterance.voice = premiumVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 bg-[#0a0a0f] border-white/10 shadow-2xl">
      <div className="text-center space-y-5">
        <Badge variant="violet" className="px-4 py-1">Học thử ngay (Không cần đăng nhập)</Badge>
        <h3 className="text-2xl md:text-3xl font-display font-bold">Trích đoạn: The Godfather (1972)</h3>
        
        <div className="p-6 md:p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          
          <button 
            onClick={playAudio} 
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] z-10"
          >
            <Play size={24} fill="black" className="ml-1" />
          </button>
          
          <p className="text-xl md:text-2xl font-display italic text-white/90 z-10 text-center">
            "{sentence}"
          </p>
          <p className="text-sm text-white/50 z-10 text-center">
            "Tôi sẽ đưa ra một lời đề nghị mà hắn không thể từ chối."
          </p>
        </div>
      </div>
      
      <div className="pt-6 border-t border-white/5 space-y-6">
        <div className="text-center">
          <h4 className="text-base font-bold text-amber-500 mb-1">Đến lượt bạn</h4>
          <p className="text-sm text-secondary">Bấm ghi âm và đọc lại câu trên để AI chấm điểm phát âm:</p>
        </div>
        
        <VoiceRecorder 
          sentence={sentence} 
          onComplete={(blob, feedback) => {
            console.log("Demo recording complete");
          }} 
        />
      </div>
    </Card>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-primary min-h-screen text-white selection:bg-amber-500/30">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 text-center">
        <div className="container-custom max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="gold" className="mx-auto mb-6 px-4 py-1.5 font-bold tracking-widest uppercase">
              Ra mắt phiên bản 2.0
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1] mb-6">
              Học tiếng Anh qua phim <br className="hidden md:block" />
              <span className="gradient-text-violet">cùng AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              Luyện nghe, nói và phát âm tự nhiên như người bản xứ. Không bài tập ngữ pháp khô khan, chỉ có những trích đoạn điện ảnh lôi cuốn nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black text-base font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  Bắt đầu miễn phí
                </button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-white/30 flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> Không yêu cầu thẻ tín dụng
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. INSTANT DEMO */}
      <Section className="pt-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <DemoPlayer />
        </motion.div>
      </Section>

      {/* 3. BENEFITS */}
      <Section className="bg-secondary/40 border-y border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Phương pháp học khác biệt</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">Được thiết kế để giúp bạn giao tiếp tự tin chỉ sau 30 ngày, thông qua việc nhập vai vào các nhân vật yêu thích.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", title: "Luyện phản xạ", desc: "Học qua các tình huống giao tiếp thực tế trong phim, giúp não bộ phản xạ tiếng Anh tự nhiên không cần dịch trong đầu." },
            { icon: Mic, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "Sửa phát âm", desc: "Công nghệ AI độc quyền phân tích từng âm tiết, nhịp điệu và ngữ điệu để chỉnh sửa lỗi sai cho bạn ngay lập tức." },
            { icon: Video, color: "text-violet-400", bg: "bg-violet-500/10", title: "Học qua phim yêu thích", desc: "Hàng ngàn trích đoạn từ các bộ phim bom tấn Hollywood, giúp việc học trở nên gây nghiện và thú vị như xem Netflix." }
          ].map((b, i) => (
            <motion.div 
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card padding="lg" hover={false} className="h-full text-center space-y-5 bg-white/[0.02]">
                <div className={`w-16 h-16 rounded-3xl ${b.bg} ${b.color} flex items-center justify-center mx-auto`}>
                  <b.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">{b.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 4. SOCIAL PROOF */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Hàng ngàn học viên đã lột xác</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Minh Thư", role: "Nhân viên văn phòng", quote: "Lần đầu tiên tôi không thấy buồn ngủ khi học tiếng Anh. Nhại lại giọng của The Dark Knight làm tôi thấy mình rất ngầu!" },
            { name: "Hoàng Đức", role: "Sinh viên IT", quote: "AI chấm điểm cực chuẩn, chỉ ra đúng chỗ tôi hay nuốt âm. Phản xạ nghe của tôi tăng lên rõ rệt sau 3 tuần." },
            { name: "Thanh Trúc", role: "Freelancer", quote: "Giao diện siêu đẹp, cảm giác như đang dùng một app cao cấp của Apple vậy. Học tiếng Anh chưa bao giờ cuốn đến thế." }
          ].map((t, i) => (
            <Card key={t.name} className="bg-[#101014] border-white/5 space-y-4">
              <div className="flex gap-1 mb-2">
                {Array(5).fill(0).map((_, j) => <Star key={j} size={14} className="fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-secondary text-sm leading-relaxed italic">"{t.quote}"</p>
              <div className="pt-4 border-t border-white/5">
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="text-xs text-white/40">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. PRICING */}
      <Section className="bg-secondary/40 border-y border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Bắt đầu dễ dàng. Nâng cấp khi cần.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card padding="lg" className="bg-[#101014] border-white/5">
            <h3 className="text-xl font-bold mb-2">Gói Cơ Bản</h3>
            <div className="text-4xl font-display font-black mb-6 text-white">0đ <span className="text-sm text-secondary font-sans font-normal">/ mãi mãi</span></div>
            <ul className="space-y-4 mb-8">
              {['Học 3 video mỗi ngày', '5 lượt AI chấm điểm phát âm/ngày', 'Lưu 20 từ vựng', 'Theo dõi lộ trình học tập'].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-secondary">
                  <CheckCircle2 size={18} className="text-white/30 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button variant="ghost" fullWidth className="border border-white/10">Đăng ký miễn phí</Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card padding="lg" className="bg-gradient-to-b from-[#1a1528] to-[#101014] border-violet-500/30 relative shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <Badge variant="violet" className="px-3 py-1 font-bold shadow-glow-violet">Phổ Biến Nhất</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2 text-violet-300">Gói PRO</h3>
            <div className="text-4xl font-display font-black mb-6 text-white">199k <span className="text-sm text-secondary font-sans font-normal">/ tháng</span></div>
            <ul className="space-y-4 mb-8">
              {['Học không giới hạn video', 'AI chấm điểm phát âm vô hạn', 'Chat giao tiếp với 6 nhân vật AI', 'Lưu từ vựng không giới hạn', 'Tải video học Offline'].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/90">
                  <CheckCircle2 size={18} className="text-violet-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button variant="primary" fullWidth className="bg-violet-600 hover:bg-violet-500 text-white shadow-glow-violet">Nâng cấp PRO</Button>
            </Link>
          </Card>
        </div>
      </Section>

      {/* 6. FINAL CTA */}
      <Section>
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-violet-900/40 to-slate-900/40 border border-white/10 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-violet-500/10 blur-[100px] pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6 text-white relative z-10">
            Sẵn sàng thay đổi <br className="md:hidden" /> cách bạn học?
          </h2>
          <p className="text-lg text-secondary mb-10 relative z-10 max-w-xl mx-auto">
            Hàng ngàn học viên đã lột xác khả năng tiếng Anh của mình. Bây giờ đến lượt bạn.
          </p>
          <div className="relative z-10 flex justify-center">
            <Link href="/signup">
              <button className="px-10 py-5 rounded-2xl bg-white text-black text-lg font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-3">
                Bắt đầu học miễn phí
              </button>
            </Link>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050508] text-center">
        <div className="container-custom flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
              <Play size={14} fill="black" className="ml-0.5 text-black" />
            </div>
            <span className="font-display font-black text-lg">Cinematic English</span>
          </div>
          <div className="flex gap-6 text-sm text-secondary">
            <Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-white transition-colors">Bảo mật</Link>
          </div>
          <p className="text-xs text-white/20 mt-4">© 2026 Cinematic English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
