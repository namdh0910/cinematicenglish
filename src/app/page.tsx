"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mic, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  BookOpen,
  Headphones,
  LineChart,
  GraduationCap,
  MessageCircle,
  BarChart3,
  Play
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#DDF4FF] selection:text-[#1899D6]">
      {/* Dynamic Keyframes for Soundwave Pulse & Floating Animation */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1.2s infinite ease-in-out alternate;
        }
        .animate-floating {
          animation: floating 4s infinite ease-in-out;
        }
      `}</style>

      <Navbar />

      {/* 1. HERO SECTION (Responsive Two-Column Gamified Grid) */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden px-4 md:px-8 border-b-2 border-[#E5E5E5] bg-white">
        {/* Background Education Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="container-custom max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8"
            >
              {/* SGK Badge */}
              <div className="bg-[#FFF8E7] text-[#B45309] rounded-2xl px-5 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-2 border-[#FFE0B2] shadow-sm select-none">
                <Sparkles size={14} className="text-amber-500 fill-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                Chương trình SGK Global Success
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black leading-[1.15] text-[#1A1A18] tracking-tight">
                Luyện Phát Âm <br />
                <span className="text-[#1899D6] relative">
                  Trực Tuyến.
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#84D8FF] -z-10 rounded-full" />
                </span><br />
                <span className="text-[#58CC02]">Chuẩn 10 Điểm SGK.</span>
              </h1>
              
              <p className="text-[#777777] text-base md:text-lg max-w-xl font-semibold leading-relaxed">
                Giúp học sinh tự tin chinh phục kỹ năng nghe, phát âm chuẩn IPA bản xứ và đạt điểm số tối đa trong các kỳ thi học kỳ thông qua lộ trình học tập tương tác vui nhộn!
              </p>

              {/* Cute Waving AI Robot Mascot Greeting */}
              <div className="w-full max-w-md bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-[2rem] p-5 flex items-center gap-4 text-left shadow-[0_4px_0_#84D8FF] animate-floating select-none">
                <div className="text-5xl shrink-0">🤖</div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#1899D6] uppercase tracking-widest leading-none">AI Teacher</p>
                  <p className="text-xs font-bold text-[#1A1A18] leading-snug">
                    Chào bạn! Mình là AI Tutor. Cùng mình luyện nói tiếng Anh cực dễ, rinh điểm 10 về tặng bố mẹ nhé! 🚀
                  </p>
                </div>
              </div>
              
              {/* Gamified 3D CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-[#58CC02] text-white rounded-2xl px-8 py-4 font-black uppercase tracking-wider text-sm shadow-[0_5px_0_#46A302] active:translate-y-[5px] active:shadow-none hover:brightness-105 cursor-pointer border-none transition-all">
                    Bắt đầu học miễn phí
                  </button>
                </Link>
                <Link href="/demo" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-[#1899D6] rounded-2xl px-8 py-4 font-black uppercase tracking-wider text-sm border-2 border-[#E5E5E5] shadow-[0_4px_0_#E5E5E5] active:translate-y-[4px] active:shadow-none hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-center gap-2">
                    Xem Demo <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Premium Responsive Speak Mockup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center w-full relative pt-6"
            >
              {/* Interactive Mockup Container */}
              <div className="w-full max-w-sm bg-white border-2 border-[#E5E5E5] rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_0_#E5E5E5] relative select-none">
                
                {/* Floating Accuracy Badge */}
                <div className="absolute -top-6 right-4 bg-white border-2 border-[#E5E5E5] rounded-2xl p-3 flex items-center gap-2 shadow-[0_4px_0_#E5E5E5] z-20">
                  <div className="w-8 h-8 rounded-full bg-[#E8F9EE] flex items-center justify-center text-xl shadow-inner shrink-0">
                    ✅
                  </div>
                  <div>
                    <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider leading-none">Accuracy</p>
                    <p className="text-base font-black text-[#58CC02] leading-none mt-1">98%</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F4FD] flex items-center justify-center text-2xl shadow-inner shrink-0">
                      🗣️
                    </div>
                    <div>
                      <h3 className="font-black text-[#1A1A18] text-base leading-tight">My New School</h3>
                      <p className="text-[10px] text-[#777777] font-extrabold uppercase tracking-wider mt-0.5">Luyện nói câu hoàn chỉnh</p>
                    </div>
                  </div>

                  {/* Speak Phrase highlight box */}
                  <div className="text-2xl font-black leading-relaxed text-center py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl">
                    <span className="text-[#58CC02] bg-[#E8F9EE] px-1.5 py-0.5 rounded-lg border border-[#B3F2C9]">I </span>{" "}
                    <span className="text-[#58CC02] bg-[#E8F9EE] px-1.5 py-0.5 rounded-lg border border-[#B3F2C9]">love </span>{" "}
                    <span className="text-[#FF4B4B] bg-[#FFDFE0] px-1.5 py-0.5 rounded-lg border border-[#FFC4C6] underline decoration-wavy decoration-rose-400">studying</span>
                  </div>

                  {/* Responsive Waveform Graphic */}
                  <div className="flex items-center justify-center gap-1.5 h-14 bg-[#F7F7F7] rounded-2xl p-4 overflow-hidden border-2 border-dashed border-[#E5E5E5]">
                    {[20, 50, 35, 75, 45, 90, 55, 80, 30, 65, 25, 45].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-[#1899D6] rounded-full animate-pulse-slow shrink-0"
                        style={{ 
                          height: `${h}%`,
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* AI Tip bubble */}
                  <div className="bg-[#FFF8E7] border-2 border-[#FFE0B2] rounded-2xl p-4 text-[11px] text-[#B45309] font-black text-center shadow-inner leading-relaxed">
                    💡 Tips: Chú ý phát âm rõ âm đuôi "ing" nhé!
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION (Duolingo Style Bento Selectors) */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container-custom max-w-6xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A18] tracking-tight">
              Hệ sinh thái EdTech toàn diện
            </h2>
            <p className="text-[#777777] text-base font-semibold leading-relaxed">
              Phương pháp học tập thông minh, hoạt họa sinh động giúp duy trì hứng thú học tiếng Anh mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Pronunciation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[2.5rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_#E5E5E5] hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Bento Graphic Box */}
              <div className="bg-[#FFF8E7] h-44 relative overflow-hidden flex items-center justify-center p-6 border-b-2 border-[#E5E5E5]">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-[#FFE0B2] text-4xl shadow-md">
                  🗣️
                </div>
                {/* Floating bubbles */}
                <div className="absolute top-8 left-12 bg-white text-[#1A1A18] font-black text-[10px] py-1 px-3 rounded-full border border-slate-100 shadow-sm">Hello!</div>
                <div className="absolute bottom-8 right-10 bg-[#58CC02] text-white font-black text-[10px] py-1 px-3 rounded-full shadow-sm">Perfect! ✨</div>
              </div>
              {/* Content */}
              <div className="p-8 space-y-2">
                <h3 className="text-xl font-black text-[#1A1A18]">Phát âm chuẩn xác</h3>
                <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                  Công nghệ AI nhận diện giọng nói siêu việt, chỉ ra chính xác lỗi sai và cách khắc phục chi tiết như một giáo viên bản ngữ.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Realtime Feedback */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[2.5rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_#E5E5E5] hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Bento Graphic Box */}
              <div className="bg-[#E8F9EE] h-44 relative overflow-hidden flex items-center justify-center p-6 border-b-2 border-[#E5E5E5]">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-[#B3F2C9] text-4xl shadow-md z-10">
                  ⚡
                </div>
                <div className="absolute bottom-4 left-6 right-6 bg-white p-3 rounded-2xl border-2 border-slate-100 flex items-center justify-between shadow-sm">
                  <span className="text-[10px] font-black text-[#777777]">Accuracy Score</span>
                  <span className="text-xs font-black text-[#58CC02]">98%</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-8 space-y-2">
                <h3 className="text-xl font-black text-[#1A1A18]">Phản hồi tức thì</h3>
                <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                  Nhận điểm số và nhận xét âm vị chi tiết ngay lập tức sau mỗi câu nói. Rèn luyện phản xạ lưu loát và tự tin tuyệt đối.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Personalization */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[2.5rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_#E5E5E5] hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Bento Graphic Box */}
              <div className="bg-[#E8F4FD] h-44 relative overflow-hidden flex items-center justify-center p-6 border-b-2 border-[#E5E5E5]">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-[#84D8FF] text-4xl shadow-md">
                  🎯
                </div>
                {/* Visual Chart path */}
                <div className="absolute inset-0 flex items-end justify-around px-8 opacity-20 pointer-events-none">
                  {[20, 40, 30, 60, 50, 80].map((val, idx) => (
                    <div key={idx} className="w-4 bg-[#1899D6] rounded-t-lg" style={{ height: `${val}%` }} />
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="p-8 space-y-2">
                <h3 className="text-xl font-black text-[#1A1A18]">Lộ trình cá nhân hóa</h3>
                <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                  Hệ thống tự động phân tích điểm mạnh yếu để xây dựng lộ trình luyện nghe, nói và thi học kỳ bám sát năng lực học sinh.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION (Aligned & Perfectly Symmetrical) */}
      <section className="py-20 bg-white border-t-2 border-[#E5E5E5]">
        <div className="container-custom max-w-6xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A18] tracking-tight">
              Sẵn sàng thay đổi cách bạn học?
            </h2>
            <p className="text-[#777777] text-base font-semibold leading-relaxed">
              Đầu tư vào tương lai với chi phí hợp lý nhất. Không ràng buộc, hủy bất cứ lúc nào.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8FAFC] border-2 border-[#E5E5E5] rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-full shadow-[0_6px_0_#E5E5E5] hover:border-slate-300 transition-all duration-300"
            >
              <div>
                <h3 className="text-lg font-black text-[#1A1A18] mb-1">Tài Khoản Học Thử</h3>
                <div className="text-3xl font-black text-[#1A1A18] mb-8 mt-2">
                  0đ <span className="text-xs text-[#777777] font-extrabold uppercase">/ mãi mãi</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {['Học thử 3 phân cảnh bài học/ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu trữ 20 từ vựng cốt lõi', 'Theo dõi tiến độ học tập cơ bản'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-[#3D3D3B] font-bold">
                      <span className="text-[#1899D6] shrink-0 text-base leading-none">✔️</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="w-full">
                <button className="w-full py-4 rounded-2xl bg-white border-2 border-[#E5E5E5] text-[#1899D6] font-black uppercase tracking-wider text-xs shadow-[0_4px_0_#E5E5E5] active:translate-y-[4px] active:shadow-none hover:bg-slate-50 transition-all cursor-pointer">
                  Bắt đầu miễn phí
                </button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A18] border-2 border-[#3D3D3B] text-white rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-full relative shadow-[0_6px_0_#1899D6] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-4 right-8 bg-[#FF9600] text-white border-2 border-[#E67E00] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
                Phổ biến nhất ✨
              </div>
              
              <div>
                <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
                  Pro Lớp Học 👑
                </h3>
                <div className="text-3xl font-black text-white mb-8 mt-2">
                  199.000đ <span className="text-xs text-[#AFAFAF] font-extrabold uppercase">/ tháng</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {['Mở khóa 100% lộ trình bám sát SGK', 'AI chấm phát âm không giới hạn', 'Luyện Dictation không giới hạn', 'Lưu trữ từ vựng & ngữ pháp ôn tập', 'Độ ưu tiên hỗ trợ trực tiếp 24/7'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-slate-200 font-bold">
                      <span className="text-[#58CC02] shrink-0 text-base leading-none">✔️</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="w-full">
                <button className="w-full py-4 rounded-2xl bg-[#1899D6] text-white font-black uppercase tracking-wider text-xs shadow-[0_5px_0_#1482B5] active:translate-y-[5px] active:shadow-none hover:brightness-105 transition-all border-none cursor-pointer">
                  Nâng cấp Pro ngay
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-white border-t-2 border-[#E5E5E5] text-center select-none">
        <div className="container-custom max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1899D6] shadow-[0_4px_0_#1482B5]">
              <Play size={16} fill="white" className="ml-0.5 text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-[#1A1A18]">Cinematic</span>
          </div>
          <div className="flex gap-8 text-xs font-black uppercase tracking-wider text-[#777777]">
            <Link href="#" className="hover:text-[#1899D6] transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-[#1899D6] transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-[#1899D6] transition-colors">Bảo mật</Link>
          </div>
          <p className="text-[#AFAFAF] text-[10px] font-black uppercase tracking-widest mt-4">
            © 2026 Cinematic English. All rights reserved. Master standard education.
          </p>
        </div>
      </footer>
    </div>
  );
}
