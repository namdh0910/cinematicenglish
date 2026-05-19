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
  BookOpen,
  Volume2,
  Edit3,
  Flame
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
    <div className="bg-[#F5F7FB] min-h-screen text-[#3D3D3B] selection:bg-blue-100 overflow-x-hidden relative w-full flex flex-col items-center">
      <Navbar />

      {/* Soft Dark Top Bar Gradient to make transparent navbar text extremely readable */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#1A1A18]/3 via-transparent to-transparent pointer-events-none z-40" />

      {/* Decorative Soft Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-24 md:pt-14 md:pb-32 overflow-hidden w-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #EFF6FF 0%, #F5F7FB 100%)' }}>
        <div className="container-custom w-full max-w-7xl px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#3B82F6] text-xs font-bold uppercase tracking-widest shadow-sm select-none">
              <Sparkles size={12} className="text-[#3B82F6] animate-pulse" />
              BÁM SÁT CHƯƠNG TRÌNH SGK GLOBAL SUCCESS 1 - 12
            </span>
            
            <h1 className="text-[34px] md:text-[52px] font-black tracking-[-0.025em] leading-[1.1] text-[#1A1A18]">
              Nền tảng Luyện thi <br className="hidden md:block" />
              & Phát âm chuẩn <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#F59E0B]">
                Global Success AI
              </span>
            </h1>
            
            <p className="text-[16px] leading-[1.7] text-[#4B5563] max-w-xl font-medium">
              Giúp học sinh tự tin chinh phục kỹ năng nghe, phát âm chuẩn IPA bản xứ và đạt điểm số tối đa trong các kỳ thi học kỳ thông qua lộ trình học tập vui nhộn, lôi cuốn như trò chơi.
            </p>
            
            {/* Generous high-school EdTech Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full pt-4">
              <Link href="/signup" className="flex-1 sm:flex-initial">
                <button className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-base transition-all shadow-[0_4px_16px_rgba(59,130,246,0.30)] hover:-translate-y-[2px] active:scale-[0.98] cursor-pointer text-center whitespace-nowrap border-none">
                  🎒 Dành cho Học Sinh
                </button>
              </Link>
              <Link href="/signup" className="flex-1 sm:flex-initial">
                <button className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-white hover:bg-[#EFF6FF] text-[#3B82F6] border-2 border-[#3B82F6] font-bold text-base transition-all hover:-translate-y-[2px] active:scale-[0.98] cursor-pointer text-center whitespace-nowrap">
                  👨‍🏫 Dành cho Giáo Viên
                </button>
              </Link>
            </div>
            
            <p className="text-[11px] text-[#6B7280] flex items-center gap-2 font-black uppercase tracking-wider">
              <ShieldCheck size={16} className="text-[#22C55E]" /> Giáo trình chuẩn • AI chấm giọng nói 24/7
            </p>
          </motion.div>

          {/* Right Column: Welcoming Student Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 w-full flex justify-center"
          >
            <div className="w-full max-w-[420px] bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 relative space-y-6 overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-md text-base">
                    N
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A18]">Nam Khánh</h4>
                    <span className="text-[10px] font-bold text-[#6B7280]">Học sinh lớp 6 • VIP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF3E0] text-[#B45309] rounded-full text-[11px] font-black border border-[#FFE0B2] shadow-sm select-none">
                  <Flame size={12} className="fill-[#B45309] text-[#B45309] animate-pulse" />
                  <span>3 NGÀY</span>
                </div>
              </div>

              {/* Pronunciation Circle Score */}
              <div className="flex items-center gap-5 bg-[#F5F7FB] p-4 rounded-2xl border border-slate-100">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-white rounded-full border-4 border-[#3B82F6] shadow-sm">
                  <span className="font-mono font-black text-sm text-[#1A1A18]">87%</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1A1A18] uppercase tracking-wider">Phát âm AI hôm nay</h5>
                  <p className="text-[11px] text-[#4B5563] mt-1 font-medium">Giọng đọc xuất sắc! Đạt chuẩn 9/10 câu thoại.</p>
                </div>
              </div>

              {/* Learning Progress & CTA */}
              <div className="space-y-3.5 bg-[#F0F7FF] p-4 rounded-2xl border border-blue-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#3B82F6]">Unit 1: My New School</span>
                  <span className="font-bold text-[#4B5563]">Bài 2 / 12</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-blue-100/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '45%' }} />
                </div>
                
                <Link href="/signup">
                  <button className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:brightness-105 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none">
                    Tiếp tục học ngay 🚀
                  </button>
                </Link>
              </div>

              {/* Decorative mini stats bar */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Kinh nghiệm (XP)</span>
                  <span className="text-sm font-black text-[#F59E0B] mt-0.5 block">+120 XP</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Độ lưu loát</span>
                  <span className="text-sm font-black text-[#22C55E] mt-0.5 block">Khá tốt (A)</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. CORE OUTCOMES (MỤC TIÊU HỌC TẬP) */}
      <section className="py-24 md:py-32 bg-[#FFFFFF] border-y border-[#EBEBEA] relative w-full flex flex-col items-center justify-center">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1A1A18] text-center">
              Mục tiêu học tập thực tế
            </h2>
            <p className="text-[#6B6B68] text-xs md:text-sm max-w-2xl mx-auto font-medium text-center">
              Phương pháp thông minh giúp học sinh học sâu, nhớ lâu và làm chủ kỹ năng nói tiếng Anh hoàn toàn tự tin:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-items-center">
            {[
              { icon: BookOpen, title: "Làm chủ từ vựng cốt lõi", desc: "Không học vẹt từ đơn lẻ. Học sinh ghi nhớ từ vựng qua ngữ cảnh giao tiếp minh họa chân thực từ sách giáo khoa Global Success." },
              { icon: Mic, title: "Phát âm chuẩn IPA bản xứ", desc: "Công nghệ chấm điểm AI thông minh chỉnh sửa từng lỗi phát âm nhỏ nhất, giúp học sinh nói tiếng Anh tự nhiên đầy tự tin." },
              { icon: Trophy, title: "Bứt phá điểm thi học kỳ", desc: "Kho đề thi trắc nghiệm phong phú, sát thực tế bài học giúp củng cố ngữ pháp và đạt điểm số tối đa trong các kỳ kiểm tra." }
            ].map((b, i) => (
              <motion.div 
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="bg-[#FFFFFF] p-6 rounded-[14px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(37,99,235,0.08)] transition-all duration-300 flex flex-col justify-between w-full max-w-sm"
              >
                <div className="space-y-5">
                  <div className="w-10 h-10 bg-[#EFF6FF] rounded-[10px] flex items-center justify-center shadow-sm">
                    <b.icon size={20} className="text-[#2563EB]" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#1A1A18]">{b.title}</h3>
                  <p className="text-[#6B6B68] text-[13px] leading-relaxed font-medium">{b.desc}</p>
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
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1A1A18] text-center">
              Quy trình học bám sát lớp học
            </h2>
            <p className="text-[#6B6B68] text-xs md:text-sm max-w-2xl mx-auto font-medium text-center">
              Giúp học sinh tự học nhanh chóng và tiến bộ rõ rệt chỉ với 4 bước đơn giản:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl justify-items-center">
            {[
              { 
                step: "01", 
                name: "NGHE MẪU", 
                desc: "Nghe phát âm và nhấn trọng âm chuẩn xác từ giáo viên bản xứ, kèm theo các hình ảnh hội thoại minh họa sinh động bám sát bài học.", 
                icon: Volume2
              },
              { 
                step: "02", 
                name: "LUYỆN PHÁT ÂM", 
                desc: "Bấm Micro thu âm và đọc nhại lại theo âm điệu mẫu. Trực tiếp thực hành nói tự tin ngay tại nhà không sợ ngượng ngùng.", 
                icon: Mic
              },
              { 
                step: "03", 
                name: "AI ĐÁNH GIÁ CHẤM ĐIỂM", 
                desc: "Cô giáo AI phân tích giọng nói chi tiết, chỉ rõ từ nào em phát âm đúng màu xanh, từ nào chưa chuẩn màu đỏ để chỉnh sửa nhanh.", 
                icon: Sparkles
              },
              { 
                step: "04", 
                name: "LUYỆN NGHE CHÉP CHÍNH TẢ", 
                desc: "Thực hành điền từ còn thiếu vào ô trống để khắc sâu vốn từ vựng và củng cố toàn diện kỹ năng nghe hiểu ngữ pháp.", 
                icon: Edit3
              }
            ].map((s, i) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all w-full flex flex-col justify-between"
              >
                <div>
                  <div className="inline-block bg-[#EFF6FF] text-[#2563EB] text-[12px] font-bold px-[8px] py-[3px] rounded-[6px] mb-[10px]">
                    BƯỚC {s.step}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <s.icon size={20} className="text-[#2563EB] shrink-0" />
                    <h3 className="text-[18px] font-semibold text-[#1A1A18] leading-tight">
                      {s.name}
                    </h3>
                  </div>
                  <p className="text-[#6B6B68] text-sm leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEXTBOOK LIBRARIES ROADMAP */}
      <section className="py-24 md:py-32 bg-[#FFFFFF] border-y border-[#EBEBEA] w-full flex flex-col items-center justify-center">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1A1A18] text-center">
              Phòng Học Lộ Trình Sách Giáo Khoa
            </h2>
            <p className="text-[#6B6B68] text-xs md:text-sm max-w-2xl mx-auto font-medium text-center">
              Em hãy chọn bài học trong sách giáo khoa để ôn tập lý thuyết và bài tập ngay:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-items-center">
            {currentUnits.map((m, i) => {
              const barColor = "#0F6E56"; // Grade 6-9
              const isFirstOrSecond = i < 2;
              const statusText = isFirstOrSecond ? "Đang học" : "Chưa bắt đầu";
              const statusBg = isFirstOrSecond ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F1EFE8] text-[#5F5E5A]";
              
              return (
                <motion.div 
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl border border-[#EBEBEA] hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between h-full shadow-[0_1px_3px_rgba(0,0,0,0.06)] group w-full max-w-xs relative overflow-hidden"
                >
                  {/* Thumbnail Swatch */}
                  <div 
                    className="w-full h-[80px] rounded-t-xl" 
                    style={{
                      background: `linear-gradient(135deg, ${barColor}26 0%, ${barColor}0D 50%, ${barColor}1F 100%)`
                    }}
                  />
                  
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                          {statusText}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold uppercase tracking-wider">
                          {m.level}
                        </span>
                      </div>
                      
                      <h3 className="text-[15px] font-bold text-[#1A1A18] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {m.title}
                      </h3>
                      
                      <p className="text-[#6B6B68] text-xs leading-relaxed font-medium line-clamp-2">
                        {m.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EBEBEA] flex items-center justify-between">
                      {/* Unit count / Plays row */}
                      <span className="text-[13px] text-[#6B6B68] font-medium flex items-center gap-1">
                        <Trophy size={13} className="text-[#6B6B68]" />
                        {m.plays} bạn đang học
                      </span>
                      <Link href="/signup">
                        <button className="p-2 rounded-lg bg-slate-50 hover:bg-[#2563EB] text-slate-500 hover:text-white border border-[#EBEBEA] transition-all cursor-pointer">
                          <ArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* 4px Progress Bar at card bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#EFF6FF]">
                    <div 
                      className="h-full rounded-r-full"
                      style={{ 
                        backgroundColor: barColor, 
                        width: isFirstOrSecond ? "65%" : "0%" 
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS */}
      <section className="py-24 md:py-32 relative w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="container-custom w-full flex flex-col items-center justify-center">
          <div className="text-center mb-16 space-y-3 w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-slate-900 text-center">
              Chi phí hợp lý. Phát triển bền lâu
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-bold text-center">
              Học sinh được học thử miễn phí. Nâng cấp tài khoản lớp học Pro khi cần luyện thi chuyên sâu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl items-stretch justify-items-center">
            {/* Free Plan */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] p-[1.75rem] flex flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all w-full max-w-md">
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-black text-[#1A1A18]">Tài Khoản Học Thử</h3>
                <div className="text-3xl font-display font-black text-[#1A1A18]">
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
            <div className="bg-[#FFFFFF] border-2 border-[#3B82F6] rounded-[24px] p-[2rem] flex flex-col justify-between shadow-[0_10px_30px_rgba(59,130,246,0.08)] hover:scale-[1.02] relative overflow-hidden transition-all w-full max-w-md">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#DCFCE7] text-[#166534] px-[12px] py-[4px] rounded-[20px] text-[11px] font-black tracking-wide shadow-sm border border-[#BBF7D0]">
                Khuyến nghị
              </div>
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-black text-[#3B82F6] flex items-center gap-1.5">
                  <Sparkles size={16} fill="currentColor" />
                  Tài Khoản Pro Lớp Học
                </h3>
                <div className="text-3xl font-display font-black text-slate-900">
                  199.000đ <span className="text-xs text-slate-400 font-sans font-normal">/ tháng</span>
                </div>
                <ul className="space-y-4">
                  {['Mở khóa 100% lộ trình bám sát SGK', 'AI phân tích & chấm phát âm không giới hạn', 'Luyện nghe chép chính tả Dictation không giới hạn', 'Lưu từ vựng & cấu trúc ngữ pháp ôn thi', 'Nhận hỗ trợ ưu tiên từ giáo viên phụ trách'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600 font-bold">
                      <CheckCircle2 size={16} className="text-[#3B82F6] shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8 flex justify-center w-full">
                <button className="w-full py-4 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer border-none">
                  Nâng cấp tài khoản Pro
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-24 md:py-32 relative w-full flex flex-col items-center justify-center overflow-hidden">
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
