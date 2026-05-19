"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mic, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  GraduationCap, 
  BookOpen
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const currentUnits = [
    { title: 'Unit 1: My New School', desc: 'Từ vựng đồ dùng học tập, các hoạt động ở trường, và phát âm chuẩn /ʌ/ và /ɑː/.', emoji: '🏫', plays: '148k', level: 'Lớp 6', color: 'from-blue-600 to-cyan-500' },
    { title: 'Unit 2: My Home', desc: 'Từ vựng các phòng, đồ đạc trong nhà, và giới thiệu ngôi nhà mơ ước.', emoji: '🏡', plays: '112k', level: 'Lớp 6', color: 'from-violet-600 to-indigo-500' },
    { title: 'Unit 3: My Friends', desc: 'Tính từ miêu tả ngoại hình, tính cách của bạn bè, cùng hội thoại hàng ngày.', emoji: '🤝', plays: '91k', level: 'Lớp 6', color: 'from-orange-600 to-amber-500' },
    { title: 'Unit 4: My Neighbourhood', desc: 'Kỹ năng chỉ đường, tả khu phố xinh đẹp, và so sánh hơn của tính từ ngắn.', emoji: '🗺️', plays: '63k', level: 'Lớp 6', color: 'from-emerald-600 to-teal-500' },
  ];

  return (
    <div className="bg-[#030308] min-h-screen text-slate-100 selection:bg-violet-500/30 overflow-x-hidden relative">
      <Navbar />

      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-violet-400 text-xs font-black tracking-widest mx-auto shadow-2xl shadow-violet-500/5 select-none">
              <Sparkles size={12} className="animate-pulse text-violet-400" />
              BÁM SÁT CHƯƠNG TRÌNH SÁCH GIÁO KHOA GLOBAL SUCCESS
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.1] text-white">
              Nền tảng Luyện thi & Phát âm <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-orange-400 drop-shadow-[0_2px_10px_rgba(139,92,246,0.15)]">
                bám sát SGK Global Success
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold">
              Giúp học sinh từ cấp 1 đến cấp 3 tự tin làm chủ từ vựng, ngữ pháp và phát âm chuẩn xác theo đúng chương trình học trên lớp với công nghệ trí tuệ nhân tạo đột phá.
            </p>
            
            {/* Interactive glassmorphic CTA block */}
            <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[32px] border border-white/[0.06] max-w-2xl mx-auto space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-36 h-36 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-sm md:text-base font-extrabold text-slate-200">
                Bắt đầu nâng cao kết quả học tập tiếng Anh ngay hôm nay
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                    🎒 Dành cho Học Sinh
                  </button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-black uppercase tracking-widest transition-all border border-white/[0.08] hover:border-white/[0.15] shadow-lg hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                    👨‍🏫 Dành cho Giáo Viên
                  </button>
                </Link>
              </div>
            </div>
            
            <p className="mt-6 text-[10px] text-slate-500 flex items-center justify-center gap-2 font-black uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-500" /> Hệ thống học liệu bảo mật & trực quan 100%
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE OUTCOMES (MỤC TIÊU HỌC TẬP) */}
      <section className="py-20 relative border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white">
              Mục tiêu học tập thực tế
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto font-semibold">
              Phương pháp học tập thông minh giúp học sinh học sâu, nhớ lâu và làm chủ kỹ năng nói tiếng Anh hoàn toàn tự nhiên:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/30", glow: "rgba(59,130,246,0.15)", title: "Làm chủ từ vựng cốt lõi", desc: "Không học vẹt từ đơn lẻ. Học sinh ghi nhớ từ vựng qua ngữ cảnh giao tiếp minh họa chân thực từ sách giáo khoa Global Success." },
              { icon: Mic, color: "text-orange-400", bg: "bg-orange-500/10", border: "hover:border-orange-500/30", glow: "rgba(249,115,22,0.15)", title: "Phát âm chuẩn IPA bản xứ", desc: "Công nghệ chấm điểm AI thông minh chỉnh sửa từng lỗi phát âm nhỏ nhất, giúp học sinh nói tiếng Anh tự nhiên đầy tự tin." },
              { icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/30", glow: "rgba(16,185,129,0.15)", title: "Bứt phá điểm thi học kỳ", desc: "Kho đề thi trắc nghiệm phong phú, sát thực tế bài học giúp củng cố ngữ pháp và đạt điểm số tối đa trong các kỳ kiểm tra." }
            ].map((b, i) => (
              <motion.div 
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: `0 10px 30px ${b.glow}` }}
                className={`bg-white/[0.02] p-8 rounded-[28px] border border-white/[0.06] ${b.border} transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-5">
                  <div className={`w-12 h-12 rounded-2xl ${b.bg} ${b.color} flex items-center justify-center shadow-md`}>
                    <b.icon size={20} />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-white">{b.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE 4-STEP REFLEX LOOP */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-20 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
              LỘ TRÌNH 4 BƯỚC HỌC TẬP
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white">
              Quy trình học bám sát lớp học
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto font-semibold">
              Giúp học sinh tự học nhanh chóng và tiến bộ rõ rệt chỉ với 4 bước đơn giản:
            </p>
          </div>

          <div className="relative">
            {/* Glowing Connecting line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-indigo-500 -translate-x-1/2 z-0 opacity-40 shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
            
            <div className="space-y-12 relative z-10">
              {[
                { 
                  step: "01", 
                  name: "NGHE MẪU 🎧", 
                  desc: "Nghe phát âm và nhấn trọng âm chuẩn xác từ giáo viên bản xứ, kèm theo các hình ảnh hội thoại minh họa sinh động bám sát bài học.", 
                  dotColor: "bg-blue-500 shadow-blue-500/50"
                },
                { 
                  step: "02", 
                  name: "LUYỆN PHÁT ÂM 🗣️", 
                  desc: "Bấm Micro thu âm và đọc nhại lại theo âm điệu mẫu. Trực tiếp thực hành nói tự tin ngay tại nhà không sợ ngượng ngùng.", 
                  dotColor: "bg-orange-500 shadow-orange-500/50"
                },
                { 
                  step: "03", 
                  name: "AI ĐÁNH GIÁ CHẤM ĐIỂM 🤖", 
                  desc: "Cô giáo AI phân tích giọng nói chi tiết, chỉ rõ từ nào em phát âm đúng màu xanh, từ nào chưa chuẩn màu đỏ để chỉnh sửa nhanh.", 
                  dotColor: "bg-emerald-500 shadow-emerald-500/50"
                },
                { 
                  step: "04", 
                  name: "LUYỆN NGHE CHÉP CHÍNH TẢ 📝", 
                  desc: "Thực hành điền từ còn thiếu vào ô trống để khắc sâu vốn từ vựng và củng cố toàn diện kỹ năng nghe hiểu ngữ pháp.", 
                  dotColor: "bg-indigo-500 shadow-indigo-500/50"
                }
              ].map((s, i) => (
                <motion.div 
                  key={s.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Card content */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-[24px] border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-xl shadow-xl transition-all duration-300 space-y-3"
                    >
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[9px] font-black text-slate-400 tracking-wider">
                        BƯỚC {s.step}
                      </span>
                      <h3 className="text-base md:text-lg font-black text-white leading-tight">
                        {s.name}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                        {s.desc}
                      </p>
                    </motion.div>
                  </div>

                  {/* Connect dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div className={`w-8 h-8 rounded-full ${s.dotColor} flex items-center justify-center border-4 border-[#030308] shadow-[0_0_15px]`}>
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="hidden md:block w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEXTBOOK LIBRARIES ROADMAP */}
      <section className="py-20 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white">
              Phòng Học Lộ Trình Sách Giáo Khoa
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto font-semibold">
              Em hãy chọn bài học trong sách giáo khoa để ôn tập lý thuyết và bài tập ngay:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentUnits.map((m, i) => (
              <motion.div 
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/[0.01] p-6 rounded-[28px] border border-white/[0.06] hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 flex flex-col justify-between h-full shadow-lg group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[9px] font-black uppercase tracking-wider">
                      {m.level}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                    {m.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold line-clamp-3">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">
                    🔥 {m.plays} bạn đang học
                  </span>
                  <Link href="/signup">
                    <button className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-600 text-slate-400 hover:text-white border border-white/[0.05] transition-all cursor-pointer">
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white">
              Chi phí hợp lý. Phát triển bền lâu
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto font-semibold">
              Học sinh được học thử miễn phí. Nâng cấp tài khoản lớp học Pro khi cần luyện thi chuyên sâu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white/[0.01] border border-white/[0.06] rounded-[32px] p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-black text-white">Tài Khoản Học Thử</h3>
                <div className="text-3xl font-display font-black text-white">
                  0đ <span className="text-xs text-slate-500 font-sans font-normal">/ mãi mãi</span>
                </div>
                <ul className="space-y-4">
                  {['Học thử 3 phân cảnh bài học/ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu 20 từ vựng cốt lõi', 'Theo dõi lộ trình tiến độ'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-400 font-semibold">
                      <CheckCircle2 size={16} className="text-slate-600 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <button className="w-full py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white border border-white/[0.06] font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
                  Học thử miễn phí ngay
                </button>
              </Link>
            </div>

            {/* Pro Plan - Neon Highlighted Card */}
            <div className="bg-gradient-to-b from-violet-600/[0.08] to-indigo-600/[0.02] border-2 border-violet-500 rounded-[32px] p-8 flex flex-col justify-between shadow-2xl shadow-violet-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                Khuyên Dùng
              </div>
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-black text-violet-400 flex items-center gap-1.5">
                  <Sparkles size={16} fill="currentColor" />
                  Tài Khoản Pro Lớp Học
                </h3>
                <div className="text-3xl font-display font-black text-white">
                  199.000đ <span className="text-xs text-slate-500 font-sans font-normal">/ tháng</span>
                </div>
                <ul className="space-y-4">
                  {['Mở khóa 100% lộ trình bám sát SGK', 'AI phân tích & chấm phát âm không giới hạn', 'Luyện nghe chép chính tả Dictation không giới hạn', 'Lưu từ vựng & cấu trúc ngữ pháp ôn thi', 'Nhận hỗ trợ ưu tiên từ giáo viên phụ trách'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-300 font-semibold">
                      <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                  Nâng cấp tài khoản Pro
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-tr from-white/[0.01] to-white/[0.03] border border-white/[0.06] rounded-[36px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-2xl md:text-4xl font-display font-black mb-4 text-white leading-tight">
              Sẵn sàng học nói chuẩn IPA hôm nay?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mb-10 max-w-xl mx-auto font-semibold">
              Hãy bắt đầu tự ôn tập củng cố lý thuyết, làm bài tập trắc nghiệm và nâng cao điểm nói chuẩn theo chương trình SGK Global Success cùng cô giáo AI.
            </p>
            <div className="flex justify-center">
              <Link href="/signup">
                <button className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 cursor-pointer">
                  Bắt đầu học thử miễn phí
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-white/[0.04] bg-[#020206] text-center relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-white">Cinematic English</span>
          </div>
          <div className="flex gap-8 text-[10px] text-slate-500 font-black uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-white transition-colors">Bảo mật</Link>
          </div>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-2">
            © 2026 Cinematic English. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
