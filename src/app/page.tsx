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
    <div className="bg-[#F8F9FA] min-h-screen text-slate-800 selection:bg-blue-100 overflow-x-hidden relative w-full flex flex-col items-center">
      <Navbar />

      {/* Soft Dark Top Bar Gradient to make transparent navbar text extremely readable */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none z-40" />

      {/* Decorative Soft Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/5 via-orange-500/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-44 pb-20 md:pt-52 md:pb-28 overflow-hidden w-full flex flex-col items-center justify-center text-center">
        <div className="container-custom max-w-4xl w-full flex flex-col items-center justify-center text-center space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center justify-center text-center space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 text-xs font-black uppercase tracking-widest shadow-sm select-none mx-auto">
              <Sparkles size={12} className="text-blue-500 animate-pulse" />
              BÁM SÁT CHƯƠNG TRÌNH SÁCH GIÁO KHOA GLOBAL SUCCESS
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.15] text-slate-900 w-full text-center">
              Nền tảng Luyện thi & Phát âm <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-orange-500">
                bám sát SGK Global Success
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-bold text-center">
              Giúp học sinh từ cấp 1 đến cấp 3 tự tin làm chủ từ vựng, ngữ pháp và phát âm chuẩn xác theo đúng chương trình học trên lớp với công nghệ AI phản xạ tự nhiên.
            </p>
            
            {/* Highly prominent, popped-out white CTA box */}
            <div className="bg-white w-full max-w-2xl mx-auto p-8 md:p-10 rounded-[32px] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)] transition-all duration-300 space-y-6 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-sm md:text-base font-black text-slate-800 text-center">
                Bắt đầu nâng cao kết quả học tập tiếng Anh ngay hôm nay
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                <Link href="/signup" className="w-full sm:w-auto flex justify-center">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.03] active:scale-[0.98] cursor-pointer text-center whitespace-nowrap">
                    🎒 Dành cho Học Sinh
                  </button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto flex justify-center">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] cursor-pointer text-center whitespace-nowrap">
                    👨‍🏫 Dành cho Giáo Viên
                  </button>
                </Link>
              </div>
            </div>
            
            <p className="mt-6 text-[10px] text-slate-400 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-center">
              <ShieldCheck size={14} className="text-emerald-500" /> Hệ thống bảo mật 100% học liệu trực quan
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE OUTCOMES (MỤC TIÊU HỌC TẬP) */}
      <section className="py-24 md:py-32 bg-white border-y border-slate-200/85 relative w-full flex flex-col items-center justify-center">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900 text-center">
              Mục tiêu học tập thực tế
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-bold text-center">
              Phương pháp thông minh giúp học sinh học sâu, nhớ lâu và làm chủ kỹ năng nói tiếng Anh hoàn toàn tự tin:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-items-center">
            {[
              { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-300", shadow: "hover:shadow-blue-500/10", title: "Làm chủ từ vựng cốt lõi", desc: "Không học vẹt từ đơn lẻ. Học sinh ghi nhớ từ vựng qua ngữ cảnh giao tiếp minh họa chân thực từ sách giáo khoa Global Success." },
              { icon: Mic, color: "text-orange-600", bg: "bg-orange-50", border: "hover:border-orange-300", shadow: "hover:shadow-orange-500/10", title: "Phát âm chuẩn IPA bản xứ", desc: "Công nghệ chấm điểm AI thông minh chỉnh sửa từng lỗi phát âm nhỏ nhất, giúp học sinh nói tiếng Anh tự nhiên đầy tự tin." },
              { icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-300", shadow: "hover:shadow-emerald-500/10", title: "Bứt phá điểm thi học kỳ", desc: "Kho đề thi trắc nghiệm phong phú, sát thực tế bài học giúp củng cố ngữ pháp và đạt điểm số tối đa trong các kỳ kiểm tra." }
            ].map((b, i) => (
              <motion.div 
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`bg-white p-8 rounded-[28px] border border-slate-200/60 ${b.border} shadow-[0_10px_30px_rgba(0,0,0,0.03)] ${b.shadow} transition-all duration-300 flex flex-col justify-between w-full max-w-sm`}
              >
                <div className="space-y-5">
                  <div className={`w-12 h-12 rounded-2xl ${b.bg} ${b.color} flex items-center justify-center shadow-sm`}>
                    <b.icon size={20} />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-slate-800">{b.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-bold">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE 4-STEP REFLEX LOOP */}
      <section className="py-24 md:py-32 relative w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-center mx-auto inline-block">
              LỘ TRÌNH 4 BƯỚC HỌC TẬP
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900 text-center">
              Quy trình học bám sát lớp học
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-bold text-center">
              Giúp học sinh tự học nhanh chóng và tiến bộ rõ rệt chỉ với 4 bước đơn giản:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl justify-items-center">
            {[
              { 
                step: "01", 
                name: "NGHE MẪU 🎧", 
                desc: "Nghe phát âm và nhấn trọng âm chuẩn xác từ giáo viên bản xứ, kèm theo các hình ảnh hội thoại minh họa sinh động bám sát bài học.", 
                dotColor: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                step: "02", 
                name: "LUYỆN PHÁT ÂM 🗣️", 
                desc: "Bấm Micro thu âm và đọc nhại lại theo âm điệu mẫu. Trực tiếp thực hành nói tự tin ngay tại nhà không sợ ngượng ngùng.", 
                dotColor: "text-orange-500",
                bg: "bg-orange-50"
              },
              { 
                step: "03", 
                name: "AI ĐÁNH GIÁ CHẤM ĐIỂM 🤖", 
                desc: "Cô giáo AI phân tích giọng nói chi tiết, chỉ rõ từ nào em phát âm đúng màu xanh, từ nào chưa chuẩn màu đỏ để chỉnh sửa nhanh.", 
                dotColor: "text-emerald-500",
                bg: "bg-emerald-50"
              },
              { 
                step: "04", 
                name: "LUYỆN NGHE CHÉP CHÍNH TẢ 📝", 
                desc: "Thực hành điền từ còn thiếu vào ô trống để khắc sâu vốn từ vựng và củng cố toàn diện kỹ năng nghe hiểu ngữ pháp.", 
                dotColor: "text-indigo-600",
                bg: "bg-indigo-50"
              }
            ].map((s, i) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all w-full flex flex-col space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${s.bg} ${s.dotColor}`}>
                    {s.step}
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-800 leading-tight flex-1">
                    {s.name}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEXTBOOK LIBRARIES ROADMAP */}
      <section className="py-20 bg-white border-y border-slate-200/85 w-full flex flex-col items-center justify-center">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900 text-center">
              Phòng Học Lộ Trình Sách Giáo Khoa
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-bold text-center">
              Em hãy chọn bài học trong sách giáo khoa để ôn tập lý thuyết và bài tập ngay:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-items-center">
            {currentUnits.map((m, i) => (
              <motion.div 
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-[28px] border border-slate-200/60 hover:border-blue-400 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between h-full shadow-[0_8px_25px_rgba(0,0,0,0.02)] group w-full max-w-xs"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-wider">
                      {m.level}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {m.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-bold line-clamp-3">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">
                    🔥 {m.plays} bạn đang học
                  </span>
                  <Link href="/signup">
                    <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-500 hover:text-white border border-slate-200/80 transition-all cursor-pointer">
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
      <section className="py-20 relative w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900 text-center">
              Chi phí hợp lý. Phát triển bền lâu
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-bold text-center">
              Học sinh được học thử miễn phí. Nâng cấp tài khoản lớp học Pro khi cần luyện thi chuyên sâu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl justify-items-center">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.05)] transition-all w-full max-w-md">
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-black text-slate-800">Tài Khoản Học Thử</h3>
                <div className="text-3xl font-display font-black text-slate-900">
                  0đ <span className="text-xs text-slate-400 font-sans font-normal">/ mãi mãi</span>
                </div>
                <ul className="space-y-4">
                  {['Học thử 3 phân cảnh bài học/ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu 20 từ vựng cốt lõi', 'Theo dõi lộ trình tiến độ'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-500 font-bold">
                      <CheckCircle2 size={16} className="text-slate-300 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8 flex justify-center w-full">
                <button className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
                  Học thử miễn phí ngay
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-blue-500 rounded-[32px] p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.14)] hover:scale-[1.01] relative overflow-hidden transition-all w-full max-w-md">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-orange-500 text-white px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                Khuyên Dùng
              </div>
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-black text-blue-600 flex items-center gap-1.5">
                  <Sparkles size={16} fill="currentColor" />
                  Tài Khoản Pro Lớp Học
                </h3>
                <div className="text-3xl font-display font-black text-slate-900">
                  199.000đ <span className="text-xs text-slate-400 font-sans font-normal">/ tháng</span>
                </div>
                <ul className="space-y-4">
                  {['Mở khóa 100% lộ trình bám sát SGK', 'AI phân tích & chấm phát âm không giới hạn', 'Luyện nghe chép chính tả Dictation không giới hạn', 'Lưu từ vựng & cấu trúc ngữ pháp ôn thi', 'Nhận hỗ trợ ưu tiên từ giáo viên phụ trách'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600 font-bold">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8 flex justify-center w-full">
                <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                  Nâng cấp tài khoản Pro
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-20 relative w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="bg-white border border-slate-200/80 rounded-[36px] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.08)] transition-all duration-300 w-full max-w-4xl flex flex-col items-center justify-center">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-2xl md:text-4xl font-display font-black mb-4 text-slate-900 leading-tight text-center">
              Sẵn sàng học nói chuẩn IPA hôm nay?
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mb-10 max-w-xl mx-auto font-bold text-center">
              Hãy bắt đầu tự ôn tập củng cố lý thuyết, làm bài tập trắc nghiệm và nâng cao điểm nói chuẩn theo chương trình SGK Global Success cùng cô giáo AI.
            </p>
            <div className="flex justify-center w-full">
              <Link href="/signup">
                <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 cursor-pointer text-center">
                  Bắt đầu học thử miễn phí
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-slate-200/80 bg-white text-center relative z-10 w-full flex flex-col items-center justify-center">
        <div className="container-custom flex flex-col items-center gap-6 w-full justify-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-slate-800">Cinematic English</span>
          </div>
          <div className="flex justify-center gap-8 text-[10px] text-slate-400 font-black uppercase tracking-widest w-full">
            <Link href="#" className="hover:text-slate-600 transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Bảo mật</Link>
          </div>
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-2 text-center">
            © 2026 Cinematic English. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
