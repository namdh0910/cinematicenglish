"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Mic, 
  Play, 
  BookOpen, 
  Home, 
  Users, 
  Film, 
  ChevronRight,
  Headphones,
  GraduationCap,
  Bell,
  Search,
  MessageSquare,
  Award,
  Flame
} from 'lucide-react';
import Link from 'next/link';

export default function EnglishMasteryDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 lg:pb-8 overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION & HEADER */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">English Mastery</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 font-bold text-slate-600">
              <Link href="#" className="text-indigo-600">Học</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Phim</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Lộ trình</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Hồ sơ</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:block px-6 py-2.5 rounded-2xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-colors border-none cursor-pointer">
                Đặt lịch học miễn phí
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-700">
                H
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* DASHBOARD HEADER */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center shadow-inner">
              <span className="text-3xl">🎉</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Chào mừng, Học viên!</h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Mục tiêu: 15 phút/ngày – Hoàn thành 70%
              </p>
            </div>
          </div>
          <button className="w-full lg:w-auto bg-indigo-600 text-white rounded-2xl px-8 py-4 font-bold shadow-[0_4px_0_rgb(67,56,202)] active:shadow-[0_0px_0_rgb(67,56,202)] active:translate-y-[4px] transition-all hover:brightness-105 border-none cursor-pointer text-base">
            Xem Demo Ngay
          </button>
        </section>

        {/* 2. SKILL MATRIX */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Ma trận Năng lực</h2>
            <Link href="#" className="text-sm font-bold text-indigo-600 hover:underline">Xem chi tiết</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Phát âm chuẩn", score: "87%", color: "bg-indigo-50", text: "text-indigo-600", icon: <Mic size={20}/>, trend: "+0.25 tuần" },
              { title: "Tự tin nói", score: "78%", color: "bg-emerald-50", text: "text-emerald-600", icon: <MessageSquare size={20}/>, trend: "+1.2 tuần" },
              { title: "Từ vựng làm chủ", score: "92%", color: "bg-amber-50", text: "text-amber-600", icon: <BookOpen size={20}/>, trend: "+0.5 tuần" },
              { title: "Sẵn sàng thi", score: "84%", color: "bg-rose-50", text: "text-rose-600", icon: <Award size={20}/>, trend: "+2.0 tuần" },
            ].map((skill, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-none flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${skill.color} ${skill.text}`}>
                    {skill.icon}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    <TrendingUp size={12} /> {skill.trend}
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-500 font-bold text-sm mb-1">{skill.title}</h3>
                  <div className="text-3xl font-black text-slate-900">{skill.score}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. PRONUNCIATION PRACTICE HERO & 3. AI PRONUNCIATION CARD */}
        <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(8,112,184,0.07)] border-none">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Practice Info */}
            <div className="p-8 lg:p-12 bg-indigo-50/50 flex flex-col justify-center">
              <div className="bg-indigo-100 text-indigo-700 w-fit px-3 py-1 rounded-xl text-xs font-bold mb-6">Đang học</div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight">
                Luyện phát âm trực tuyến <br className="hidden lg:block"/>
                <span className="text-indigo-600">Chuẩn 10 điểm SGK</span>
              </h2>
              <p className="text-slate-600 font-medium mb-8">
                Hệ thống AI sẽ phân tích giọng nói của bạn, chỉ ra lỗi sai và hướng dẫn sửa chi tiết đến từng âm vị.
              </p>
              
              <div className="space-y-3 w-full max-w-md">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Tiến độ Unit 1</span>
                  <span className="text-indigo-600">65%</span>
                </div>
                <div className="h-3 w-full bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* AI Whisper Mockup */}
            <div className="p-8 lg:p-12 flex items-center justify-center bg-slate-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500"/> AI Whisper Chấm Điểm
                  </h3>
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-sm">
                    98%
                  </div>
                </div>

                <div className="text-center py-6 border-y border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Unit 1: My New School</p>
                  <div className="text-2xl font-black text-slate-800">
                    <span className="text-emerald-500 bg-emerald-50 px-1 rounded mx-0.5">I</span>
                    <span className="text-emerald-500 bg-emerald-50 px-1 rounded mx-0.5">love</span>
                    <span className="text-rose-500 bg-rose-50 px-1 rounded mx-0.5 underline decoration-wavy decoration-rose-300">studying</span>
                    <span className="text-emerald-500 bg-emerald-50 px-1 rounded mx-0.5">English</span>
                  </div>
                </div>

                <div className="bg-rose-50 rounded-2xl p-4 text-sm font-bold text-rose-700 mt-6 border-none">
                  💡 Chú ý âm "ing" trong từ "studying" nhé!
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button className="flex-1 bg-indigo-600 text-white rounded-2xl py-4 font-bold shadow-[0_4px_0_rgb(67,56,202)] active:shadow-[0_0px_0_rgb(67,56,202)] active:translate-y-[4px] transition-all flex justify-center items-center gap-2 border-none cursor-pointer">
                    <Mic size={18} /> Ghi âm lại
                  </button>
                  <button className="w-14 h-[52px] bg-slate-100 text-slate-600 rounded-2xl flex justify-center items-center font-bold hover:bg-slate-200 transition-colors border-none cursor-pointer">
                    <Headphones size={20} />
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="#" className="text-xs font-bold text-indigo-600 hover:underline">Luyện nghe chép chính tả →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COURSE / LESSON LIST (Global Success) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Sách giáo khoa Global Success</h2>
            <Link href="#" className="text-sm font-bold text-indigo-600 hover:underline">Tất cả bài học</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "My New School", desc: "Học từ vựng trường học, đồ dùng và phát âm /ʌ/ /ɑː/", icon: <Home size={24}/>, color: "bg-blue-100 text-blue-600" },
              { title: "My Home", desc: "Từ vựng phòng ốc, đồ đạc và luyện nói về ngôi nhà mơ ước", icon: <Home size={24}/>, color: "bg-amber-100 text-amber-600" },
              { title: "My Friends", desc: "Mô tả tính cách, ngoại hình và luyện phản xạ giao tiếp", icon: <Users size={24}/>, color: "bg-emerald-100 text-emerald-600" }
            ].map((unit, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-none flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${unit.color}`}>
                    {unit.icon}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">Unit {i+1}: {unit.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">{unit.desc}</p>
                  <div className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-1.5">
                    <BookOpen size={14}/> 12 bài học
                  </div>
                </div>
                <button className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl font-bold transition-colors border-none cursor-pointer flex items-center justify-center gap-2">
                  <Play size={16} className="fill-slate-800"/> Vào bài học
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CLASS SELECTION TABLE */}
        <section className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-none">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Chọn Khối Lớp Của Bạn</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {["Tiểu học", "Lớp 6", "Grade 10", "Grade 11"].map((tab, i) => (
              <button 
                key={i} 
                className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-none cursor-pointer ${i === 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {[
              { grade: "Lớp 6", program: "Chương trình Global Success", bg: "bg-blue-50", iconCol: "text-blue-500" },
              { grade: "Lớp 10", program: "Chương trình Global Success", bg: "bg-emerald-50", iconCol: "text-emerald-500" },
              { grade: "Lớp 11", program: "Chương trình Global Success", bg: "bg-amber-50", iconCol: "text-amber-500" }
            ].map((cls, i) => (
              <div key={i} className={`relative flex flex-col justify-start h-40 ${cls.bg} rounded-3xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer overflow-hidden border-none`}>
                <h4 className="text-2xl font-bold text-slate-800 z-10">{cls.grade}</h4>
                <p className="text-sm text-slate-500 font-medium mt-1 z-10">{cls.program}</p>
                <div className={`absolute bottom-[-10px] right-[-10px] opacity-80 ${cls.iconCol}`}>
                  <GraduationCap size={100} strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MOVIE LIBRARY (Cinematic Netflix Style) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Film className="text-indigo-600"/> Cinematic – Học tiếng Anh qua phim
            </h2>
          </div>
          
          {/* Chips */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
            {["Tất cả", "Tâm lý học", "Hành động", "Lãng mạn", "Hoạt hình"].map((chip, i) => (
              <button 
                key={i} 
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border-none cursor-pointer ${i === 0 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'}`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Horizontal Scroll Movies */}
          <div className="flex gap-6 overflow-x-auto pb-8 pt-2 hide-scrollbar snap-x after:content-[''] after:min-w-[24px]">
            {[
              { title: "The Godfather", year: "1972", genre: "Tâm lý", views: "12N", gradient: "from-amber-800 to-rose-900" },
              { title: "The Dark Knight", year: "2008", genre: "Hành động", views: "45N", gradient: "from-slate-800 to-slate-900" },
              { title: "Forrest Gump", year: "1994", genre: "Tâm lý", views: "34N", gradient: "from-emerald-600 to-teal-800" },
              { title: "Titanic", year: "1997", genre: "Lãng mạn", views: "89N", gradient: "from-blue-600 to-indigo-900" },
              { title: "The Lion King", year: "1994", genre: "Hoạt hình", views: "102N", gradient: "from-orange-500 to-amber-700" }
            ].map((movie, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="min-w-[200px] md:min-w-[240px] snap-center cursor-pointer group"
              >
                <div className="w-full aspect-[2/3] rounded-3xl bg-white border border-slate-100 relative overflow-hidden shadow-md mb-4 flex items-center justify-center p-6 text-center">
                  {/* Fake Poster Abstract */}
                  <h3 className="text-slate-900 font-black text-2xl leading-tight">{movie.title.toUpperCase()}</h3>
                  
                  {/* Luyện nói Badge */}
                  <div className="absolute top-4 left-4 bg-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-600 border border-slate-200 flex items-center gap-1.5">
                    <Mic size={12}/> Luyện nói
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-200 text-indigo-600">
                      <Play size={24} className="fill-indigo-600" />
                    </div>
                  </div>
                </div>
                <h4 className="font-extrabold text-slate-900 line-clamp-1">{movie.title}</h4>
                <div className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2">
                  <span>{movie.year}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{movie.genre}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-indigo-600">{movie.views} lượt học</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 8. ADDITIONAL FEATURES (Gamification) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 lg:pb-0">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-1 transition-transform">
            <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-1/4 translate-y-1/4">
              <Mic size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <Flame className="text-amber-300" size={24}/>
              </div>
              <h3 className="text-2xl font-black mb-2">Thử thách Shadowing</h3>
              <p className="font-medium text-white/80 mb-6 max-w-[80%] line-clamp-2">Luyện phát âm đuôi -ed một cách tự nhiên như người bản xứ.</p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-50 active:scale-95 transition-all border-none cursor-pointer">
                Bắt đầu thử thách
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-transform">
            <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-1/4 translate-y-1/4">
              <Headphones size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="text-white" size={24}/>
              </div>
              <h3 className="text-2xl font-black mb-2">Luyện nghe chép chính tả</h3>
              <p className="font-medium text-white/80 mb-6 max-w-[80%] line-clamp-2">Phát triển tư duy ngôn ngữ qua các bài tập Dictation thiết kế chuẩn mực.</p>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-50 active:scale-95 transition-all border-none cursor-pointer">
                Vào luyện nghe
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 lg:hidden z-50 flex justify-around items-center">
        <Link href="#" className="flex flex-col items-center gap-1 text-indigo-600">
          <Home size={24} className="fill-indigo-100" />
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600">
          <BookOpen size={24} />
          <span className="text-[10px] font-bold">Bài học</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600">
          <Film size={24} />
          <span className="text-[10px] font-bold">Phim</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600">
          <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
            H
          </div>
          <span className="text-[10px] font-bold">Hồ sơ</span>
        </Link>
      </div>

    </div>
  );
}
