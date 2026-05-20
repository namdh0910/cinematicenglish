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
  GraduationCap
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen">
      <Navbar />

      {/* 1. HERO SECTION (Split 50/50 Layout) */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <div className="bg-indigo-50 text-indigo-700 rounded-full px-4 py-1 w-fit mb-6 text-xs font-bold flex items-center gap-2 border border-indigo-100">
              <Sparkles size={14} className="text-indigo-600" />
              ✨ Chương trình SGK Global Success
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
              Luyện Phát Âm <br /> Trực Tuyến. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
                Chuẩn 10 Điểm SGK.
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl mt-6 max-w-xl font-medium">
              Giúp học sinh tự tin chinh phục kỹ năng nghe, phát âm chuẩn IPA bản xứ và đạt điểm số tối đa trong các kỳ thi học kỳ thông qua lộ trình học tập vui nhộn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
              <Link href="/signup">
                <button className="w-full sm:w-auto bg-indigo-600 text-white rounded-full px-8 py-4 font-bold shadow-xl shadow-indigo-200 hover:-translate-y-1 hover:shadow-indigo-300 transition-all text-lg border-none cursor-pointer">
                  Bắt đầu học miễn phí
                </button>
              </Link>
              <Link href="/demo">
                <button className="w-full sm:w-auto bg-white text-slate-700 rounded-full px-8 py-4 font-bold shadow-sm border border-slate-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md transition-all text-lg cursor-pointer flex items-center justify-center gap-2">
                  Xem Demo <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Glassmorphism Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 blur-[80px] rounded-full pointer-events-none" />

            {/* Mockup Container */}
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-8 relative w-full max-w-md z-10">
              
              {/* Floating Accuracy Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-5 -right-5 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Accuracy</p>
                  <p className="text-xl font-extrabold text-slate-900">98%</p>
                </div>
              </motion.div>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Mic size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Phát âm hiện tại</h3>
                    <p className="text-xs text-slate-500">Unit 1: My New School</p>
                  </div>
                </div>

                {/* Subtitles Simulation */}
                <div className="text-2xl font-extrabold leading-relaxed text-center py-4">
                  <span className="text-emerald-500 bg-emerald-50 px-1 rounded">I </span>
                  <span className="text-emerald-500 bg-emerald-50 px-1 rounded">love </span>
                  <span className="text-rose-500 bg-rose-50 px-1 rounded underline decoration-wavy decoration-rose-300">studying</span>
                  <br/>
                  <span className="text-emerald-500 bg-emerald-50 px-1 rounded mt-2 inline-block">English</span>
                </div>

                {/* Waveform */}
                <div className="flex items-center justify-center gap-1.5 h-16 bg-slate-50 rounded-2xl border border-slate-100 p-4 overflow-hidden">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className="waveform-bar"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Feedback */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-800 font-medium">
                  <strong>AI Feedback:</strong> Chú ý âm đuôi "ing" trong từ "studying" nhé!
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION (Bento Grid) */}
      <section className="py-24 bg-white relative">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Hệ sinh thái EdTech toàn diện
            </h2>
            <p className="text-slate-500 text-lg">
              Mọi công cụ bạn cần để làm chủ tiếng Anh, được thiết kế tinh tế trong một nền tảng duy nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Bento Card 1: AI Whisper (Col Span 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <Mic size={240} className="text-indigo-600" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                  <Sparkles className="text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">AI Whisper Chấm Điểm</h3>
                <p className="text-slate-600 text-lg max-w-md">
                  Công nghệ nhận diện giọng nói siêu việt phân tích từng âm tiết, chỉ ra chính xác lỗi sai và cách khắc phục như một giáo viên bản ngữ.
                </p>
              </div>
            </motion.div>

            {/* Bento Card 2: Dictation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-xl hover:border-indigo-200 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <Headphones className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Luyện Nghe Chép Chính Tả</h3>
              <p className="text-slate-600">Phát triển tư duy ngôn ngữ nhạy bén thông qua bài tập Dictation thiết kế chuẩn mực.</p>
            </motion.div>

            {/* Bento Card 3: Vocabulary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-xl hover:border-indigo-200 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Từ Vựng Ngữ Cảnh</h3>
              <p className="text-slate-600">Ghi nhớ từ vựng qua trích đoạn hội thoại phim thực tế, không học vẹt từ đơn lẻ.</p>
            </motion.div>

            {/* Bento Card 4: Reports (Col Span 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-slate-900 text-white rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between h-full">
                <div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                    <LineChart className="text-indigo-300" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Báo cáo tiến độ chuẩn xác</h3>
                  <p className="text-slate-400 text-lg max-w-md">Theo dõi mọi chỉ số học tập, chuỗi ngày rèn luyện và nhận dự báo điểm số trực quan, chi tiết.</p>
                </div>
                {/* Decorative Chart elements */}
                <div className="hidden md:flex flex-1 w-full justify-end items-end gap-2 h-32 opacity-80">
                  <div className="w-8 bg-indigo-900 rounded-t-lg h-1/4"></div>
                  <div className="w-8 bg-indigo-800 rounded-t-lg h-2/4"></div>
                  <div className="w-8 bg-indigo-600 rounded-t-lg h-3/4"></div>
                  <div className="w-8 bg-indigo-500 rounded-t-lg h-full"></div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Sẵn sàng thay đổi cách bạn học?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Đầu tư vào tương lai với chi phí hợp lý. Không ràng buộc, hủy bất cứ lúc nào.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col hover:shadow-xl hover:border-slate-300 transition-all"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tài Khoản Học Thử</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-8">
                0đ <span className="text-base text-slate-500 font-normal">/ mãi mãi</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['Học thử 3 phân cảnh bài học/ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu 20 từ vựng cốt lõi', 'Theo dõi lộ trình cơ bản'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                    <CheckCircle2 size={20} className="text-slate-300 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className="w-full py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition-all border border-slate-200 cursor-pointer">
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
              className="bg-slate-900 text-white rounded-[2rem] p-10 flex flex-col relative ring-1 ring-indigo-500 shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-teal-400 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Phổ biến nhất
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" />
                Pro Lớp Học
              </h3>
              <div className="text-4xl font-extrabold text-white mb-8">
                199.000đ <span className="text-base text-slate-400 font-normal">/ tháng</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['Mở khóa 100% lộ trình bám sát SGK', 'AI chấm phát âm không giới hạn', 'Luyện Dictation không giới hạn', 'Lưu từ vựng & ngữ pháp ôn thi', 'Ưu tiên hỗ trợ 24/7'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 font-medium">
                    <CheckCircle2 size={20} className="text-indigo-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-transform transform hover:-translate-y-1 shadow-lg shadow-indigo-500/30 cursor-pointer border-none">
                  Nâng cấp Pro ngay
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="container-custom flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-slate-900">Cinematic</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Bảo mật</Link>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            © 2026 Cinematic English. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
