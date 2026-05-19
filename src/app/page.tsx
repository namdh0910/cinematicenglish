"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, 
  Star, 
  Mic, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  Users 
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const currentUnits = [
    { title: 'Unit 1: My New School', desc: 'Từ vựng đồ dùng học tập, các hoạt động ở trường, và phát âm chuẩn /ʌ/ và /ɑː/.', emoji: '🏫', plays: '148k', level: 'Lớp 6' },
    { title: 'Unit 2: My Home', desc: 'Từ vựng các phòng, đồ đạc trong nhà, và giới thiệu ngôi nhà mơ ước.', emoji: '🏡', plays: '112k', level: 'Lớp 6' },
    { title: 'Unit 3: My Friends', desc: 'Tính từ miêu tả ngoại hình, tính cách của bạn bè, cùng hội thoại hàng ngày.', emoji: '🤝', plays: '91k', level: 'Lớp 6' },
    { title: 'Unit 4: My Neighbourhood', desc: 'Kỹ năng chỉ đường, tả khu phố xinh đẹp, và so sánh hơn của tính từ ngắn.', emoji: '🗺️', plays: '63k', level: 'Lớp 6' },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-slate-800 selection:bg-blue-100 overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-44 pb-16 md:pt-48 md:pb-24 px-4 text-center overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/5 via-orange-500/5 to-transparent blur-[100px] pointer-events-none" />
        
        <div className="container-custom max-w-4xl mx-auto space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mx-auto shadow-sm">
              ✨ BÁM SÁT CHƯƠNG TRÌNH SÁCH GIÁO KHOA GLOBAL SUCCESS
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.1] mb-6 text-slate-900 drop-shadow-sm">
              Nền tảng Luyện thi & Phát âm <br className="hidden md:block" />
              <span className="text-blue-600">bám sát SGK Global Success</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-bold">
              Giúp học sinh từ cấp 1 đến cấp 3 tự tin làm chủ từ vựng, ngữ pháp và phát âm chuẩn xác theo đúng chương trình học trên lớp.
            </p>
            
            {/* Textbook Kid Vector/CTA block */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-base font-black text-slate-800">Bắt đầu nâng cao kết quả học tập tiếng Anh ngay hôm nay</h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 text-white text-sm font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md hover:scale-102 active:scale-98">
                    🎒 Dành cho Học Sinh
                  </button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md hover:scale-102 active:scale-98">
                    👨‍🏫 Dành cho Giáo Viên
                  </button>
                </Link>
              </div>
            </div>
            
            <p className="mt-6 text-[10px] text-slate-400 flex items-center justify-center gap-2 font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-500" /> Hệ thống bảo mật 100% học liệu trực quan
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE OUTCOMES (MỤC TIÊU HỌC TẬP) */}
      <section className="py-16 bg-white border-y border-slate-200 relative">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900">Mục tiêu học tập thực tế</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-bold">Phương pháp thông minh giúp học sinh học sâu, nhớ lâu và làm chủ kỹ năng nói:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", title: "Làm chủ từ vựng cốt lõi", desc: "Không học vẹt từ đơn lẻ. Học sinh ghi nhớ từ vựng qua ngữ cảnh giao tiếp minh họa chân thực từ sách giáo khoa Global Success." },
              { icon: Mic, color: "text-orange-500", bg: "bg-orange-50", title: "Phát âm chuẩn IPA bản xứ", desc: "Công nghệ chấm điểm AI thông minh chỉnh sửa từng lỗi phát âm nhỏ nhất, giúp học sinh nói tiếng Anh tự nhiên đầy tự tin." },
              { icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50", title: "Bứt phá điểm thi học kỳ", desc: "Kho đề thi trắc nghiệm phong phú, sát thực tế bài học giúp củng cố ngữ pháp và đạt điểm số tối đa trong các kỳ kiểm tra." }
            ].map((b, i) => (
              <motion.div 
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F9FA] p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${b.bg} ${b.color} flex items-center justify-center shadow-sm`}>
                    <b.icon size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{b.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-bold">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE 4-STEP REFLEX LOOP (QUY TRÌNH HỌC PHẢN XẠ) */}
      <section className="py-16 relative">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest">LỘ TRÌNH 4 BƯỚC HỌC TẬP</span>
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900">Quy trình học bám sát lớp học</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-bold">Giúp học sinh tự học nhanh chóng chỉ với 4 bước đơn giản:</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 z-0 opacity-80" />
            
            <div className="space-y-10 relative z-10">
              {[
                { 
                  step: "01", 
                  name: "NGHE MẪU 🎧", 
                  desc: "Nghe phát âm và nhấn trọng âm chuẩn xác từ giáo viên bản xứ, kèm theo các hình ảnh hội thoại minh họa sinh động bám sát bài học.", 
                  glow: "bg-white border-slate-200",
                  dotColor: "bg-blue-600"
                },
                { 
                  step: "02", 
                  name: "LUYỆN PHÁT ÂM 🗣️", 
                  desc: "Bấm Micro thu âm và đọc nhại lại theo âm điệu mẫu. Trực tiếp thực hành nói tự tin ngay tại nhà không sợ ngượng ngùng.", 
                  glow: "bg-white border-slate-200",
                  dotColor: "bg-orange-500"
                },
                { 
                  step: "03", 
                  name: "AI ĐÁNH GIÁ CHẤM ĐIỂM 🤖", 
                  desc: "Cô giáo AI phân tích giọng nói chi tiết, chỉ rõ từ nào em phát âm đúng màu xanh, từ nào chưa chuẩn màu đỏ để chỉnh sửa nhanh.", 
                  glow: "bg-white border-slate-200",
                  dotColor: "bg-emerald-500"
                },
                { 
                  step: "04", 
                  name: "LUYỆN NGHE CHÉP CHÍNH TẢ 📝", 
                  desc: "Thực hành điền từ còn thiếu vào ô trống để khắc sâu vốn từ vựng và củng cố toàn diện kỹ năng nghe hiểu ngữ pháp.", 
                  glow: "bg-white border-slate-200",
                  dotColor: "bg-indigo-600"
                }
              ].map((s, i) => (
                <motion.div 
                  key={s.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Card content */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <div className={`p-6 rounded-3xl border shadow-sm ${s.glow} space-y-3`}>
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 tracking-wider">
                        BƯỚC {s.step}
                      </span>
                      <h3 className="text-lg font-black text-slate-800 leading-tight">
                        {s.name}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-bold">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connect dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div className={`w-8 h-8 rounded-full ${s.dotColor} flex items-center justify-center border-4 border-[#F8F9FA]`}>
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="hidden md:block w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEXTBOOK LIBRARIES ROADMAP (KHO BÀI HỌC SGK) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900">Phòng Học Lộ Trình Sách Giáo Khoa</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-bold">Em hãy chọn bài học trong sách giáo khoa để ôn tập lý thuyết và bài tập ngay:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentUnits.map((m, i) => (
              <motion.div 
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F9FA] p-6 rounded-3xl border border-slate-200 hover:border-blue-400 transition-all duration-300 flex flex-col justify-between h-full shadow-sm hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-wider">{m.level}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{m.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-bold line-clamp-3">{m.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">🔥 {m.plays} bạn đang học</span>
                  <Link href="/signup">
                    <button className="p-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 transition-all">
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
      <section className="py-16 relative">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900">Chi phí hợp lý. Phát triển bền lâu</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-bold">Học sinh được học thử miễn phí. Nâng cấp tài khoản lớp học Pro khi cần luyện thi chuyên sâu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-800">Tài Khoản Học Thử</h3>
                <div className="text-3xl font-display font-black text-slate-900">0đ <span className="text-xs text-slate-400 font-sans font-normal">/ mãi mãi</span></div>
                <ul className="space-y-4">
                  {['Học thử 3 phân cảnh bài học/ngày', '5 lượt AI chấm phát âm/ngày', 'Lưu 20 từ vựng cốt lõi', 'Theo dõi lộ trình tiến độ'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-500 font-bold">
                      <CheckCircle2 size={16} className="text-slate-300 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <button className="w-full py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-black text-xs uppercase tracking-wider transition-all">
                  Học thử miễn phí ngay
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-blue-500 rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Khuyên Dùng
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-black text-blue-600">Tài Khoản Pro Lớp Học</h3>
                <div className="text-3xl font-display font-black text-slate-900">199.000đ <span className="text-xs text-slate-400 font-sans font-normal">/ tháng</span></div>
                <ul className="space-y-4">
                  {['Mở khóa 100% lộ trình bám sát SGK', 'AI phân tích & chấm phát âm không giới hạn', 'Luyện nghe chép chính tả Dictation không giới hạn', 'Lưu từ vựng & cấu trúc ngữ pháp ôn thi', 'Nhận hỗ trợ ưu tiên từ giáo viên phụ trách'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600 font-bold">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <button className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/10">
                  Nâng cấp tài khoản Pro
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-sm">
          <h2 className="text-2xl md:text-4xl font-display font-black mb-4 text-slate-800 leading-tight">
            Sẵn sàng thay đổi cách con em học Tiếng Anh?
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mb-8 max-w-xl mx-auto font-bold">
            Hãy bắt đầu tự ôn tập củng cố lý thuyết, làm bài tập trắc nghiệm và nâng cao điểm nói chuẩn ngay hôm nay.
          </p>
          <div className="flex justify-center">
            <Link href="/signup">
              <button className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black uppercase tracking-widest transition-all shadow-sm">
                Bắt đầu học thử miễn phí
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 bg-white text-center">
        <div className="container-custom flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-lg text-slate-800">Cinematic English</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link href="#" className="hover:text-slate-600 transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Bảo mật</Link>
          </div>
          <p className="text-[10px] text-slate-300 font-bold">© 2026 Cinematic English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
