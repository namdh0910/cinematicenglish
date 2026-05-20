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
  BarChart3
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-slate-50">
      <Navbar />

      {/* 1. HERO SECTION (Mochi Centered Style) */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden px-4">
        {/* Background Decorative Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-custom flex flex-col items-center text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="bg-white text-indigo-600 rounded-full px-4 py-1.5 mb-8 text-sm font-bold flex items-center gap-2 shadow-sm border-none">
              <Sparkles size={16} className="text-amber-500" />
              Chương trình SGK Global Success
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-extrabold leading-[1.1] text-slate-900 tracking-tight max-w-4xl mx-auto">
              Luyện Phát Âm Trực Tuyến. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Chuẩn 10 Điểm SGK.
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl mt-8 max-w-2xl mx-auto font-medium">
              Giúp học sinh tự tin chinh phục kỹ năng nghe, phát âm chuẩn IPA bản xứ và đạt điểm số tối đa trong các kỳ thi học kỳ thông qua lộ trình học tập vui nhộn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full sm:w-auto justify-center">
              <Link href="/signup">
                {/* 3D Duolingo Button */}
                <button className="w-full sm:w-auto bg-blue-600 text-white rounded-2xl px-10 py-4 font-bold shadow-[0_6px_0_rgb(37,99,235)] active:shadow-[0_0px_0_rgb(37,99,235)] active:translate-y-[6px] transition-all hover:brightness-105 border-none cursor-pointer text-lg">
                  Bắt đầu học miễn phí
                </button>
              </Link>
              <Link href="/demo">
                {/* Secondary Pastel Button */}
                <button className="w-full sm:w-auto bg-blue-50 text-blue-600 rounded-2xl px-10 py-4 font-bold transition-all hover:bg-blue-100 text-lg cursor-pointer flex items-center justify-center gap-2 border-none">
                  Xem Demo <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Mockup (Overlapping 3D Cards) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-4xl mx-auto mt-20 h-64 md:h-[400px]"
          >
            {/* Card 1: Chat bubbles (Left Behind) */}
            <div className="absolute left-0 md:left-10 top-10 md:top-20 w-48 md:w-64 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.05)] border border-white z-10 transform -rotate-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-amber-600" />
                </div>
                <div className="bg-amber-50 rounded-2xl rounded-tl-none p-3 text-xs font-bold text-slate-700">
                  How are you today?
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mic size={14} className="text-blue-600" />
                </div>
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 text-xs font-bold shadow-sm">
                  I'm doing great, thanks!
                </div>
              </div>
            </div>

            {/* Card 3: Streak/Chart (Right Behind) */}
            <div className="absolute right-0 md:right-10 top-5 md:top-12 w-48 md:w-64 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.05)] border border-white z-10 transform rotate-3">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 text-sm">Tiến độ tuần</h4>
                <BarChart3 size={16} className="text-indigo-400" />
              </div>
              <div className="flex items-end justify-between h-24 gap-2">
                {[40, 70, 45, 90, 60, 85, 100].map((h, i) => (
                  <div key={i} className="w-full bg-indigo-50 rounded-t-lg flex flex-col justify-end">
                    <div className="w-full bg-indigo-400 rounded-t-lg" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Main Pronunciation (Center Front) */}
            <div className="absolute left-1/2 top-0 md:top-5 -translate-x-1/2 w-[90%] md:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(8,_112,_184,_0.1)] border-4 border-white z-20 p-6 md:p-8">
              
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 flex items-center gap-2 z-30 shadow-[0_10px_30px_rgba(8,_112,_184,_0.1)] border-none">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</p>
                  <p className="text-lg font-extrabold text-slate-900 leading-none">98%</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <Mic size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">My New School</h3>
                    <p className="text-sm text-slate-500 font-medium">Luyện nói câu hoàn chỉnh</p>
                  </div>
                </div>

                <div className="text-2xl md:text-3xl font-extrabold leading-relaxed text-center py-2">
                  <span className="text-emerald-500 bg-emerald-50 px-1 rounded">I </span>
                  <span className="text-emerald-500 bg-emerald-50 px-1 rounded">love </span>
                  <span className="text-rose-500 bg-rose-50 px-1 rounded underline decoration-wavy decoration-rose-300">studying</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-16 bg-slate-50 rounded-2xl p-4 overflow-hidden">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className="waveform-bar bg-blue-500"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                <div className="bg-indigo-50 rounded-2xl p-4 text-sm text-indigo-800 font-bold text-center">
                  Chú ý âm đuôi "ing" nhé!
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION (TalkPal Graphic Box Cards) */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Hệ sinh thái EdTech toàn diện
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Phương pháp học tập thông minh, sinh động giúp duy trì hứng thú mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Pronunciation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300 border-none overflow-hidden"
            >
              {/* Graphic Box */}
              <div className="bg-amber-100 h-48 relative overflow-hidden flex flex-col items-center justify-center p-6">
                <div className="w-full flex flex-col gap-3">
                  <div className="self-start bg-white text-slate-700 font-bold text-xs py-2 px-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Mic size={14} className="text-amber-500"/> Hello!
                  </div>
                  <div className="self-end bg-amber-500 text-white font-bold text-xs py-2 px-4 rounded-2xl rounded-tr-none shadow-sm">
                    Perfect pronunciation!
                  </div>
                  <div className="self-start bg-white text-slate-700 font-bold text-xs py-2 px-4 rounded-2xl rounded-tl-none shadow-sm opacity-50">
                    ...
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Phát âm chuẩn xác</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Công nghệ AI nhận diện giọng nói siêu việt, chỉ ra chính xác lỗi sai và cách khắc phục như một giáo viên bản ngữ.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Realtime Feedback */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300 border-none overflow-hidden"
            >
              {/* Graphic Box */}
              <div className="bg-emerald-100 h-48 relative overflow-hidden flex items-center justify-center p-6">
                <div className="bg-white p-4 rounded-3xl w-full shadow-sm flex flex-col items-center">
                  <div className="text-3xl font-black text-emerald-500 mb-2">98%</div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full w-[98%]"></div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Fluency Score</div>
                </div>
              </div>
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Phản hồi thời gian thực</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Nhận điểm số và nhận xét chi tiết ngay lập tức sau mỗi câu nói. Rèn luyện sự lưu loát và tự tin tuyệt đối.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Personalization */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300 border-none overflow-hidden"
            >
              {/* Graphic Box */}
              <div className="bg-indigo-100 h-48 relative overflow-hidden flex items-center justify-center p-6">
                 <div className="flex items-end justify-center w-full h-24 gap-3">
                  {[30, 50, 40, 80, 60, 100].map((h, i) => (
                    <div key={i} className="w-8 bg-white/40 rounded-t-xl flex flex-col justify-end overflow-hidden">
                      <div className="w-full bg-indigo-500 rounded-t-xl" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Lộ trình cá nhân hóa</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Hệ thống tự động phân tích điểm mạnh yếu để xây dựng lộ trình luyện nghe, chép chính tả và nói bám sát năng lực.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION (Retained Gamification Design) */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Sẵn sàng thay đổi cách bạn học?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
              Đầu tư vào tương lai với chi phí hợp lý. Không ràng buộc, hủy bất cứ lúc nào.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-blue-50 rounded-[2rem] p-10 flex flex-col transition-transform hover:-translate-y-1 border-none shadow-[0_10px_30px_rgba(8,_112,_184,_0.03)]"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tài Khoản Học Thử</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-8">
                0đ <span className="text-base text-slate-500 font-normal">/ mãi mãi</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['Học thử 3 phân cảnh bài học/ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu 20 từ vựng cốt lõi', 'Theo dõi lộ trình cơ bản'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-blue-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                {/* Secondary Pastel Button */}
                <button className="w-full py-4 rounded-2xl bg-white text-blue-600 font-bold transition-all border-none shadow-sm hover:shadow-md cursor-pointer text-lg">
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
              className="bg-slate-900 text-white rounded-[2rem] p-10 flex flex-col relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border-none"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-teal-400 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border-none">
                Phổ biến nhất
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-400" />
                Pro Lớp Học
              </h3>
              <div className="text-4xl font-extrabold text-white mb-8">
                199.000đ <span className="text-base text-slate-400 font-normal">/ tháng</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['Mở khóa 100% lộ trình bám sát SGK', 'AI chấm phát âm không giới hạn', 'Luyện Dictation không giới hạn', 'Lưu từ vựng & ngữ pháp ôn thi', 'Ưu tiên hỗ trợ 24/7'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 font-medium">
                    <CheckCircle2 size={20} className="text-blue-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                {/* 3D Duolingo Button for Pro */}
                <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-[0_6px_0_rgb(37,99,235)] active:shadow-[0_0px_0_rgb(37,99,235)] active:translate-y-[6px] transition-all hover:brightness-105 cursor-pointer border-none text-lg">
                  Nâng cấp Pro ngay
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white text-center">
        <div className="container-custom flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Cinematic</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <Link href="#" className="hover:text-blue-600 transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Bảo mật</Link>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            © 2026 Cinematic English. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
