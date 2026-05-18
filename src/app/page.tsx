"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Video, Mic, CheckCircle2, Zap, ShieldCheck, Film, Sparkles, Trophy, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import VoiceRecorder from "@/components/coach/VoiceRecorder";

// ─── INSTANT DEMO PLAYER (THE GODFATHER / GLADIATOR REAL QUOTES) ──────────────────────────────────────────────────
function DemoPlayer() {
  const [activeQuote, setActiveQuote] = useState<'godfather' | 'gladiator'>('godfather');
  
  const quotes = {
    godfather: {
      movie: "The Godfather (1972)",
      sentence: "I'm going to make him an offer he can't refuse.",
      translation: "Tôi sẽ đưa ra một lời đề nghị mà hắn không thể từ chối.",
      audioText: "I'm going to make him an offer he can't refuse.",
      bg: "from-zinc-950/80 to-zinc-900/80"
    },
    gladiator: {
      movie: "Gladiator (2000)",
      sentence: "What we do in life echoes in eternity.",
      translation: "Những gì chúng ta làm trong cuộc sống sẽ vang vọng đến thiên thu.",
      audioText: "What we do in life echoes in eternity.",
      bg: "from-amber-950/60 to-zinc-900/80"
    }
  };

  const current = quotes[activeQuote];

  const playAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(current.audioText);
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
    <Card className={`max-w-3xl mx-auto p-6 md:p-10 space-y-8 border-white/10 shadow-2xl transition-all duration-500 bg-gradient-to-b ${current.bg}`}>
      <div className="text-center space-y-5">
        <Badge variant="violet" className="px-4 py-1.5 font-bold tracking-widest uppercase shadow-glow-purple">Học thử ngay (Không cần đăng ký)</Badge>
        
        {/* Quote Switcher */}
        <div className="flex justify-center gap-4 p-1 rounded-2xl bg-black/40 border border-white/5 max-w-sm mx-auto">
          <button 
            onClick={() => setActiveQuote('godfather')}
            className={`flex-1 py-2 text-xs font-black rounded-xl uppercase tracking-wider transition-all ${activeQuote === 'godfather' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Bố Già 🌹
          </button>
          <button 
            onClick={() => setActiveQuote('gladiator')}
            className={`flex-1 py-2 text-xs font-black rounded-xl uppercase tracking-wider transition-all ${activeQuote === 'gladiator' ? 'bg-amber-500 text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Võ Sĩ Giác Đấu ⚔️
          </button>
        </div>

        <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white mt-4">{current.movie}</h3>
        
        <div className="p-6 md:p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button 
            onClick={playAudio} 
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] z-10 group"
          >
            <Play size={24} fill="black" className="ml-1 group-hover:scale-110 transition-transform" />
          </button>
          
          <p className="text-xl md:text-2xl font-display italic text-white/95 z-10 text-center font-bold">
            "{current.sentence}"
          </p>
          <p className="text-sm md:text-base text-amber-400/90 z-10 text-center font-medium italic">
            "{current.translation}"
          </p>
        </div>
      </div>
      
      <div className="pt-6 border-t border-white/5 space-y-6">
        <div className="text-center">
          <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-1">Đến lượt bạn nhại giọng</h4>
          <p className="text-xs text-white/40 font-medium">Bấm micro, nghe và đọc nhại lại theo ngữ khí của nhân vật phim:</p>
        </div>
        
        <VoiceRecorder 
          sentence={current.sentence} 
          onComplete={(blob, feedback) => {
            console.log("Demo recording complete", feedback);
          }} 
        />
      </div>
    </Card>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────
export default function HomePage() {
  const currentMovies = [
    { title: 'The Godfather (Bố Già)', desc: 'Giao tiếp đầy uy lực, nghệ thuật đàm phán và thuyết phục đỉnh cao.', emoji: '🌹', plays: '148k', level: 'B2' },
    { title: 'Gladiator (Võ Sĩ Giác Đấu)', desc: 'Ý chí sắt đá, dũng cảm và khả năng truyền cảm hứng trước vạn người.', emoji: '⚔️', plays: '112k', level: 'B2' },
    { title: 'The Dark Knight (Kỵ Sĩ Bóng Đêm)', desc: 'Nhịp điệu trầm ấm, kịch tính và kỹ năng làm chủ tông giọng nội lực.', emoji: '🃏', plays: '91k', level: 'C1' },
    { title: 'Titanic (Thảm Họa Titanic)', desc: 'Bộc lộ cảm xúc ngọt ngào, kịch tính và hội thoại đời thường chân thật.', emoji: '🚢', plays: '63k', level: 'B1' },
  ];

  return (
    <div className="bg-primary min-h-screen text-white selection:bg-amber-500/30 overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 text-center overflow-hidden">
        {/* Theater Lighting Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/10 via-violet-500/5 to-transparent blur-[120px] pointer-events-none" />
        
        <div className="container-custom max-w-4xl mx-auto space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="gold" className="mx-auto px-4 py-1.5 font-black tracking-widest uppercase shadow-glow-amber border-amber-500/20 bg-amber-950/40 text-amber-400">
              🎬 100% PHIM THỰC TẾ — KHÔNG CÓ BÀI TẬP KHÔ KHAN
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] mb-6">
              Luyện tiếng Anh qua <br className="hidden md:block" />
              <span className="gradient-text-amber font-serif italic">Sub Phim Thực Tế</span> cùng AI
            </h1>
            
            <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              Không học vẹt những câu giao tiếp giả định buồn tẻ. Chúng tôi giúp bạn nhập vai vào các trích đoạn điện ảnh huyền thoại để xây dựng phản xạ nghe nói tự nhiên, đầy cảm xúc.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
                  Bắt đầu học thử miễn phí 🚀
                </button>
              </Link>
            </div>
            
            <p className="mt-6 text-xs text-white/30 flex items-center justify-center gap-2 font-medium uppercase tracking-wider">
              <ShieldCheck size={14} className="text-amber-500" /> Không yêu cầu tài khoản thanh toán trước
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. INSTANT INTERACTIVE DEMO */}
      <Section className="pt-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-center"
        >
          <DemoPlayer />
        </motion.div>
      </Section>

      {/* 3. CORE OUTCOMES (KẾT QUẢ ĐẠT ĐƯỢC) */}
      <Section className="bg-secondary/40 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03),transparent)] pointer-events-none" />
        
        <div className="text-center mb-16 space-y-3 relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight gradient-text-silver">Mục tiêu học tập thực chiến</h2>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium italic">Chúng tôi tối ưu hóa phương pháp học để mang lại kết quả giao tiếp thực tiễn cho học viên Việt Nam:</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {[
            { icon: Film, color: "text-amber-500", bg: "bg-amber-500/10", title: "Nghe phim không cần sub", desc: "Không dịch từng từ trong đầu. Học trực tiếp qua cách nối âm, nuốt âm đặc trưng của người bản xứ trong các cảnh phim tốc độ cao." },
            { icon: Mic, color: "text-violet-400", bg: "bg-violet-500/10", title: "Nói tự nhiên đầy cảm xúc", desc: "Không nói đều đều robot. AI chấm điểm ngữ điệu, độ vang và cảm xúc giúp bạn làm chủ ngữ khí tự tin và lôi cuốn." },
            { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "Phản xạ giao tiếp vô thức", desc: "Khắc ghi từ vựng vào sâu tiềm thức thông qua việc gắn kết ngôn ngữ với hình ảnh, bối cảnh tâm lý của các bộ phim kinh điển." }
          ].map((b, i) => (
            <motion.div 
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card padding="lg" hover={true} className="h-full text-center space-y-5 bg-white/[0.01] border-white/5 hover:border-white/10 transition-all">
                <div className={`w-16 h-16 rounded-3xl ${b.bg} ${b.color} flex items-center justify-center mx-auto shadow-inner`}>
                  <b.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-white">{b.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-medium">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 4. THE 4-STEP REFLEX LOOP (QUY TRÌNH HỌC PHẢN XẠ) */}
      <Section className="relative">
        <div className="text-center mb-20 space-y-3">
          <Badge variant="violet" className="px-4 py-1.5 font-bold uppercase tracking-widest">LỘ TRÌNH 4 BƯỚC PHẢN XẠ</Badge>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight gradient-text-silver">Học nhại cốt lõi đầy gây nghiện</h2>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium">Bí quyết giúp bạn làm chủ cách phát âm tự nhiên chỉ qua các bước nhập vai tối giản:</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500/30 via-violet-500/30 to-cyan-500/30 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { step: "01", name: "NGHE sâu", desc: "Xem trích đoạn phim gốc thực tế dài 10 - 20 giây. Cảm nhận hoàn cảnh giao tiếp, biểu cảm khẩu hình và tốc độ tự nhiên của diễn viên.", border: "border-amber-500/30" },
              { step: "02", name: "NHẠI đuổi", desc: "Shadowing - Nói đuổi ngay theo câu thoại của nhân vật. Nhại lại chuẩn xác từ độ luyến láy, ngữ điệu đến điểm ngắt nghỉ.", border: "border-violet-500/30" },
              { step: "03", name: "AI CHẤM điểm", desc: "Công nghệ AI độc quyền phân tích âm phát ra. Chỉnh sửa chi tiết từng lỗi phát âm phát hiện được và chấm điểm trôi chảy.", border: "border-cyan-500/30" },
              { step: "04", name: "MỞ KHÓA tiếp", desc: "Vượt qua thử thách để tích lũy điểm thưởng XP phản xạ, thăng hạng tiến độ và mở khóa câu thoại tiếp theo trong cuộn phim.", border: "border-emerald-500/30" }
            ].map((s, i) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring" }}
              >
                <div className={`p-6 rounded-[32px] bg-[#0c0c0e] border ${s.border} text-center space-y-4 shadow-xl hover:scale-105 transition-all`}>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-500 font-mono font-black text-lg">
                    {s.step}
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">{s.name}</h4>
                  <p className="text-white/40 text-xs leading-relaxed font-medium">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. CURATED POPULAR STORIES PLACARDS (KHO PHIM THỰC TẾ) */}
      <Section className="bg-secondary/40 border-y border-white/5">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight gradient-text-silver">Phòng Chiếu Phim Học Tập</h2>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium">Bắt đầu ngay hôm nay với các trích đoạn điện ảnh huyền thoại được chọn lọc:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {currentMovies.map((m, i) => (
            <motion.div 
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative p-6 rounded-[32px] bg-gradient-to-b from-[#141416] to-[#0c0c0e] border border-white/5 group-hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between h-full shadow-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{m.emoji}</span>
                    <Badge variant="violet" className="text-[10px] uppercase font-bold">{m.level}</Badge>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-500 transition-colors font-display line-clamp-1">{m.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed font-medium line-clamp-3">{m.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">🔥 {m.plays} lượt học</span>
                  <Link href="/signup">
                    <button className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-black text-white transition-all">
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 6. REAL USER TESTIMONIALS */}
      <Section>
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight">Học viên Việt Nam nói gì?</h2>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium">Trải nghiệm nhại giọng đầy lôi cuốn và cải thiện phát âm vượt bậc:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Minh Thư", role: "Nhân viên văn phòng", quote: "Lần đầu tiên tôi không thấy buồn ngủ khi học tiếng Anh. Nhại lại giọng của Bố Già (The Godfather) làm tôi thấy tự tin giao tiếp hẳn lên!" },
            { name: "Hoàng Đức", role: "Sinh viên CNTT", quote: "AI chấm điểm cực chuẩn, chỉ ra đúng chỗ tôi hay nuốt âm. Phản xạ nghe của tôi tăng lên rõ rệt sau 3 tuần nhại giọng." },
            { name: "Thanh Trúc", role: "Freelancer", quote: "Giao diện tối đơn giản, trực quan, không rườm rà. Tôi có cảm hứng tự giác học mỗi tối như đang xem Netflix vậy." }
          ].map((t, i) => (
            <Card key={t.name} className="bg-[#0e0e10] border-white/5 space-y-4 p-6 md:p-8 rounded-[32px]">
              <div className="flex gap-1 mb-2">
                {Array(5).fill(0).map((_, j) => <Star key={j} size={14} className="fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-white/60 text-sm leading-relaxed italic font-medium">"{t.quote}"</p>
              <div className="pt-4 border-t border-white/5">
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="text-xs text-white/40">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 7. PRICING PLANS */}
      <Section className="bg-secondary/40 border-y border-white/5">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight">Học phí phù hợp. Hiệu quả bền lâu.</h2>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium">Học thử không giới hạn. Nâng cấp khi cần nâng cao phản xạ nói.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card padding="lg" className="bg-[#0c0c0e] border-white/5 rounded-[40px] p-8 md:p-10">
            <h3 className="text-xl font-black mb-2">Gói Cơ Bản</h3>
            <div className="text-4xl font-display font-black mb-6 text-white">0đ <span className="text-xs text-white/40 font-sans font-normal">/ mãi mãi</span></div>
            <ul className="space-y-4 mb-8">
              {['Học 3 phân cảnh phim mỗi ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu 20 từ vựng cốt lõi', 'Theo dõi lộ trình tiến độ cá nhân'].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/50 font-medium">
                  <CheckCircle2 size={18} className="text-white/20 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-sm uppercase tracking-wider transition-all border border-white/10">
                Bắt đầu học ngay
              </button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card padding="lg" className="bg-gradient-to-b from-[#1a1428] to-[#0c0c0e] border-amber-500/20 rounded-[40px] p-8 md:p-10 relative shadow-[0_0_40px_rgba(245,158,11,0.05)]">
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <Badge variant="gold" className="px-3 py-1 font-bold shadow-glow-amber">Được Đăng Ký Nhiều Nhất</Badge>
            </div>
            <h3 className="text-xl font-black mb-2 text-amber-400">Gói hội viên PRO</h3>
            <div className="text-4xl font-display font-black mb-6 text-white">199.000đ <span className="text-xs text-white/40 font-sans font-normal">/ tháng</span></div>
            <ul className="space-y-4 mb-8">
              {['Mở khóa 100% kho phim thực tế', 'AI phân tích & chấm giọng không giới hạn', 'IPA chi tiết & phản hồi nói đuổi', 'Lưu từ vựng & cấu trúc không giới hạn', 'Hỗ trợ offline & ưu tiên'].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/90 font-medium">
                  <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm uppercase tracking-wider transition-all shadow-glow-amber">
                Nâng cấp Hội Viên PRO
              </button>
            </Link>
          </Card>
        </div>
      </Section>

      {/* 8. FINAL CALL TO ACTION */}
      <Section>
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-950/40 to-zinc-900/40 border border-white/10 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-500/5 blur-[100px] pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6 text-white relative z-10 leading-tight">
            Sẵn sàng thay đổi <br /> cách bạn nghe nói tiếng Anh?
          </h2>
          <p className="text-sm md:text-lg text-white/60 mb-10 relative z-10 max-w-xl mx-auto font-medium">
            Hãy bắt đầu nhại lại các câu thoại trong những bộ phim bạn yêu quý nhất ngay hôm nay để có phản xạ nói tự nhiên, lưu loát.
          </p>
          <div className="relative z-10 flex justify-center">
            <Link href="/signup">
              <button className="px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-lg font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow-amber flex items-center gap-3">
                Bắt đầu học thử miễn phí
              </button>
            </Link>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050507] text-center">
        <div className="container-custom flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Film size={14} className="text-black" />
            </div>
            <span className="font-display font-black text-lg">Cinematic English</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40 font-medium">
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

