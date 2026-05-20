"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  Home,
  Globe,
  Trophy,
  Target,
  ShoppingBag,
  User,
  Flame,
  Zap,
  BookOpen,
  Award,
  Sparkles,
  Play,
  ArrowRight,
  Brain,
  TrendingUp,
  Search,
  GraduationCap,
  ChevronDown,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Grade {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface LearnClientProps {
  initialGrades: Grade[];
}

export default function LearnClient({ initialGrades }: LearnClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>("learn");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("learn");
    }
  }, [tabParam]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/learn?tab=${newTab}`, { scroll: false });
  };

  const [grades] = useState<Grade[]>(initialGrades);
  const [profile, setProfile] = useState<any>(null);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error("Error fetching profile in LearnClient:", err);
      }
    };
    fetchProfile();
  }, []);

  // Handle clicking outside dynamic dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setGradeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Gamified metrics
  const stats = [
    { label: "Độ chính xác Nghe", value: "87%", emoji: "🗣️", color: "bg-[#E8F4FD]", trend: "+3.2% tuần này", trendColor: "text-[#1899D6]" },
    { label: "Độ tự tin Nói", value: "78%", emoji: "💬", color: "bg-[#E8F9EE]", trend: "+5.1% tuần này", trendColor: "text-[#58CC02]" },
    { label: "Từ vựng làm chủ", value: "92%", emoji: "📚", color: "bg-[#FFF8E7]", trend: "140 từ mới học", trendColor: "text-[#F59E0B]" },
    { label: "Sẵn sàng làm bài thi", value: "84%", emoji: "🏆", color: "bg-[#F2EDFC]", trend: "Chuẩn Global Success", trendColor: "text-[#8B5CF6]" }
  ];

  // Adaptive recommended missions
  const recoveryMissions = [
    {
      id: "rec-1",
      title: "Phục hồi Kỹ năng Nghe Chép: Đời sống Gia đình (Household Chores)",
      skill: "Nghe & Chép chính tả",
      difficulty: "Trung cấp",
      xp: 150,
      reason: "⚠️ Độ chính xác nghe giảm xuống 68% trong bài luyện tập trước",
      lessonId: "lesson-u1l2"
    },
    {
      id: "rec-2",
      title: "Thử thách Shadowing: Luyện phát âm đuôi '-ed' chuẩn ngữ điệu",
      skill: "Luyện nói / Nhịp điệu",
      difficulty: "Cơ bản",
      xp: 200,
      reason: "🔥 Đang kích hoạt: Hoàn thành để nhân hệ số chuỗi học tập 5 ngày",
      lessonId: "lesson-u1l2"
    }
  ];

  return (
    <div className="bg-sage-green min-h-screen text-[#3D3D3B] flex flex-col w-full font-sans">
      {/* Dynamic Top Navbar for mobile (automatically responsive) */}
      <Navbar />

      {/* 2. RESPONSIVE APP SHELL WRAPPER */}
      <div className="flex-1 flex flex-col items-center w-full min-h-screen">
        {/* 3-COLUMN MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
          
          {/* CỘT GIỮA (Lộ trình lớp học, Ma trận năng lực) */}
          <main className="space-y-10 min-w-0">
            {/* 1. HỌC TAB (Default Curriculum View) */}
            {activeTab === "learn" && (
              <>
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_4px_0_#E5E5E5]">
                  <div className="space-y-1.5">
                    <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                      Chào mừng, <span className="text-[#1899D6]">{profile?.full_name || "Học viên"}</span>! 👋
                    </h1>
                    <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                      Hôm nay em muốn chinh phục bài học nào? Hệ thống chuẩn giáo trình phổ thông.
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="w-full md:max-w-xs relative shrink-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài học..."
                      className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-[#3D3D3B] placeholder:text-[#999999] focus:outline-none focus:border-[#1899D6] transition-all"
                    />
                  </div>
                </div>

                {/* Student Stats Matrix */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#1899D6]" /> MA TRẬN CHỈ SỐ NĂNG LỰC
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-6 rounded-[2rem] border-2 border-[#E5E5E5] flex flex-col justify-between shadow-[0_4px_0_#E5E5E5] hover:border-[#1899D6] hover:shadow-[0_4px_0_#84D8FF] transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color} text-3xl shadow-inner`}>
                            {stat.emoji}
                          </div>
                          <div className={`text-[9px] font-black uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md ${stat.trendColor}`}>
                            {stat.trend}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[#777777] font-extrabold text-xs mb-1 uppercase tracking-wider">{stat.label}</h4>
                          <div className="text-3xl font-black text-[#1A1A18] tracking-tight">{stat.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation Recovery Missions */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                    <Brain size={14} className="text-[#8B5CF6]" /> BÀI TẬP ÔN LUYỆN KHUYÊN DÙNG
                  </h3>

                  <div className="space-y-3">
                    {recoveryMissions.map((rec) => (
                      <div 
                        key={rec.id}
                        className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 shadow-[0_4px_0_#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#1899D6] transition-all"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-[#F2EDFC] text-[#8B5CF6] border-2 border-[#E1D4FB] px-2.5 py-0.5 rounded-full">{rec.skill}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#777777]">• {rec.difficulty}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-[#1A1A18] leading-tight truncate">{rec.title}</h4>
                          <p className="text-[10px] text-[#FF9600] font-black italic">{rec.reason}</p>
                        </div>

                        <button 
                          onClick={() => window.location.href = `/learn/lesson/${rec.lessonId}`}
                          className="px-5 py-3 rounded-2xl bg-[#1899D6] text-white text-[10px] font-black uppercase tracking-widest shrink-0 self-start md:self-auto cursor-pointer border-none shadow-[0_4px_0_#1482B5] active:shadow-none active:translate-y-[4px] transition-all hover:brightness-105"
                        >
                          BẮT ĐẦU NGAY <ArrowRight size={12} className="inline ml-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* School Grade Library (Bento Selectors) */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#999999] flex items-center gap-2">
                    <GraduationCap size={14} className="text-[#1899D6]" /> CHƯƠNG TRÌNH HỌC PHỔ THÔNG
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grades.map((grade) => {
                      const titleLower = grade.title.toLowerCase();
                      const isCinematic = titleLower.includes("cinematic") || titleLower.includes("phim");
                      const isHigh = titleLower.includes("10") || titleLower.includes("11") || titleLower.includes("12");
                      
                      // Grade Color Codes
                      const barColor = isCinematic ? "#8B5CF6" : isHigh ? "#1899D6" : "#58CC02";
                      const shadowColor = isCinematic ? "shadow-[0_4px_0_#8B5CF6]" : isHigh ? "shadow-[0_4px_0_#1899D6]" : "shadow-[0_4px_0_#58CC02]";

                      // Dynamic Emojis
                      let emojiBg = "bg-[#E8F9EE]";
                      let emoji = "🏫";
                      
                      if (isCinematic) {
                        emojiBg = "bg-[#F2EDFC]";
                        emoji = "🎬";
                      } else if (isHigh) {
                        emojiBg = "bg-[#E8F4FD]";
                        emoji = "🎒";
                      }

                      return (
                        <motion.div
                          key={grade.id}
                          whileHover={{ y: -4 }}
                          className="group relative flex flex-col justify-between h-[230px] bg-white border-2 border-[#E5E5E5] rounded-[2.5rem] p-6 shadow-[0_4px_0_#E5E5E5] hover:border-slate-300 transition-all duration-300 overflow-hidden"
                        >
                          {/* Top Header Badge */}
                          <div className="flex items-center justify-between">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${emojiBg} text-3xl shadow-inner`}>
                              {emoji}
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-[#E8F9EE] text-[#58CC02] border border-[#B3F2C9]">
                              ĐANG HỌC
                            </span>
                          </div>

                          {/* Content details */}
                          <div className="mt-4 flex-1 flex flex-col justify-end">
                            <h4 className="text-lg font-black text-[#1A1A18] leading-tight group-hover:text-[#1899D6] transition-colors">{grade.title}</h4>
                            <p className="text-xs text-[#777777] font-semibold mt-1 leading-snug line-clamp-2">{grade.description}</p>
                            
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                              <span className="text-[10px] text-[#777777] font-black uppercase tracking-wider flex items-center gap-1">
                                <BookOpen size={14} className="text-[#1899D6]" /> 12 CHUYÊN ĐỀ
                              </span>
                              
                              <Link 
                                href={`/learn/grade/${grade.id}`}
                                className={`px-4 py-2.5 rounded-2xl bg-white border-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 ${shadowColor} active:translate-y-[4px] active:shadow-none cursor-pointer`}
                                style={{ 
                                  color: barColor, 
                                  borderColor: barColor + "40"
                                }}
                              >
                                VÀO HỌC <ArrowRight size={10} />
                              </Link>
                            </div>
                          </div>

                          {/* Bottom decorative color bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-slate-100">
                            <div 
                              className="h-full rounded-r-full"
                              style={{ 
                                backgroundColor: barColor, 
                                width: "60%" 
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* 2. CHỮ CÁI TAB (Interactive Phonetics IPA Chart) */}
            {activeTab === "alphabet" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Bảng Chữ Cái Tiếng Anh Standard 🗣️
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Nhấp vào từng ký tự để nghe phát âm IPA chuẩn bản xứ và từ vựng ví dụ theo chuẩn sách giáo khoa Global Success!
                  </p>
                </div>

                {/* Alphabet grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[
                    { letter: "Aa", ipa: "/eɪ/", word: "Apple", vn: "Quả táo" },
                    { letter: "Bb", ipa: "/biː/", word: "Book", vn: "Quyển sách" },
                    { letter: "Cc", ipa: "/siː/", word: "Cat", vn: "Con mèo" },
                    { letter: "Dd", ipa: "/diː/", word: "Dog", vn: "Con chó" },
                    { letter: "Ee", ipa: "/iː/", word: "Egg", vn: "Quả trứng" },
                    { letter: "Ff", ipa: "/ɛf/", word: "Fish", vn: "Con cá" },
                    { letter: "Gg", ipa: "/dʒiː/", word: "Girl", vn: "Cô gái" },
                    { letter: "Hh", ipa: "/eɪtʃ/", word: "House", vn: "Ngôi nhà" },
                    { letter: "Ii", ipa: "/aɪ/", word: "Ice cream", vn: "Kem" },
                    { letter: "Jj", ipa: "/dʒeɪ/", word: "Juice", vn: "Nước ép" },
                    { letter: "Kk", ipa: "/keɪ/", word: "Kite", vn: "Cái diều" },
                    { letter: "Ll", ipa: "/ɛl/", word: "Lion", vn: "Sư tử" },
                    { letter: "Mm", ipa: "/ɛm/", word: "Milk", vn: "Sữa" },
                    { letter: "Nn", ipa: "/ɛn/", word: "Nose", vn: "Cái mũi" },
                    { letter: "Oo", ipa: "/oʊ/", word: "Orange", vn: "Quả cam" },
                    { letter: "Pp", ipa: "/piː/", word: "Pen", vn: "Bút viết" },
                    { letter: "Qq", ipa: "/kjuː/", word: "Queen", vn: "Nữ hoàng" },
                    { letter: "Rr", ipa: "/ɑːr/", word: "Rain", vn: "Cơn mưa" },
                    { letter: "Ss", ipa: "/ɛs/", word: "Sun", vn: "Mặt trời" },
                    { letter: "Tt", ipa: "/tiː/", word: "Train", vn: "Tàu hỏa" },
                    { letter: "Uu", ipa: "/juː/", word: "Umbrella", vn: "Cái ô" },
                    { letter: "Vv", ipa: "/viː/", word: "Van", vn: "Xe tải" },
                    { letter: "Ww", ipa: "/ˈdʌbəl.juː/", word: "Water", vn: "Nước" },
                    { letter: "Xx", ipa: "/ɛks/", word: "Xylophone", vn: "Đàn mộc cầm" },
                    { letter: "Yy", ipa: "/waɪ/", word: "Yo-yo", vn: "Đồ chơi yo-yo" },
                    { letter: "Zz", ipa: "/zɛd/", word: "Zoo", vn: "Sở thú" }
                  ].map((item) => (
                    <motion.button
                      key={item.letter}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        if (typeof window !== "undefined" && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                          const letterUtterance = new SpeechSynthesisUtterance(item.letter.charAt(0));
                          letterUtterance.lang = "en-US";
                          letterUtterance.rate = 0.8;
                          window.speechSynthesis.speak(letterUtterance);
                          
                          setTimeout(() => {
                            const wordUtterance = new SpeechSynthesisUtterance(item.word);
                            wordUtterance.lang = "en-US";
                            wordUtterance.rate = 0.9;
                            window.speechSynthesis.speak(wordUtterance);
                          }, 1000);
                        }
                      }}
                      className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 text-center shadow-[0_4px_0_#E5E5E5] hover:border-[#1899D6] hover:shadow-[0_4px_0_#84D8FF] active:translate-y-[4px] active:shadow-none transition-all flex flex-col items-center justify-between h-[150px]"
                    >
                      <span className="text-3xl font-black text-[#1A1A18] tracking-tight">{item.letter}</span>
                      <span className="text-xs font-black text-[#1899D6] bg-[#E8F4FD] px-2.5 py-0.5 rounded-full border border-blue-100">{item.ipa}</span>
                      <div className="text-[10px] text-[#777777] font-bold leading-tight">
                        <p className="text-[#1A1A18] font-black">{item.word}</p>
                        <p className="text-[8px] mt-0.5">{item.vn}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BẢNG XẾP HẠNG TAB (Trophy Leaderboard View) */}
            {activeTab === "leaderboard" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Bảng Thi Đua Học Tập Tuần Tuần 🛡️
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Học tập tích cực, duy trì Streak và tích lũy thật nhiều KN để đứng đầu bảng vàng vinh danh cùng bạn bè cả nước nhé!
                  </p>
                </div>

                {/* Podium Top 3 display */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] flex flex-col md:flex-row items-center justify-center gap-10">
                  {/* Rank 2 */}
                  <div className="flex flex-col items-center text-center order-2 md:order-1 mt-6 md:mt-0">
                    <div className="text-4xl">🥈</div>
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 text-3xl flex items-center justify-center shadow-inner mt-2">👦</div>
                    <p className="font-black text-sm text-[#1A1A18] mt-2">Trần Đức Nam</p>
                    <span className="text-[10px] font-black text-[#777777] uppercase bg-slate-50 px-2.5 py-0.5 rounded-full mt-1 border border-slate-100">1,220 XP</span>
                  </div>

                  {/* Rank 1 */}
                  <div className="flex flex-col items-center text-center order-1 md:order-2">
                    <div className="text-5xl animate-bounce">🏆 🥇</div>
                    <div className="w-20 h-20 rounded-full bg-[#FFF8E7] border-4 border-[#FFD700] text-4xl flex items-center justify-center shadow-md mt-2 relative">
                      <span>👧</span>
                      <span className="absolute -top-3 -right-3 text-lg animate-pulse">✨</span>
                    </div>
                    <p className="font-black text-base text-[#1A1A18] mt-2">Nguyễn Minh Anh</p>
                    <span className="text-xs font-black text-[#B45309] uppercase bg-[#FFF3E0] px-3 py-1 rounded-full mt-1 border border-[#FFE0B2]">1,450 XP</span>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex flex-col items-center text-center order-3 mt-6 md:mt-0">
                    <div className="text-4xl">🥉</div>
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 text-3xl flex items-center justify-center shadow-inner mt-2">👩</div>
                    <p className="font-black text-sm text-[#1A1A18] mt-2">Lê Thu Thảo</p>
                    <span className="text-[10px] font-black text-[#777777] uppercase bg-slate-50 px-2.5 py-0.5 rounded-full mt-1 border border-slate-100">980 XP</span>
                  </div>
                </div>

                {/* Ranking list rows */}
                <div className="bg-white border-2 border-[#E5E5E5] rounded-[2rem] shadow-[0_4px_0_#E5E5E5] p-2 space-y-1">
                  {[
                    { rank: 1, name: "Nguyễn Minh Anh", xp: 1450, avatar: "👧", badge: "🥇", isCurrentUser: false },
                    { rank: 2, name: "Trần Đức Nam", xp: 1220, avatar: "👦", badge: "🥈", isCurrentUser: false },
                    { rank: 3, name: "Lê Thu Thảo", xp: 980, avatar: "👩", badge: "🥉", isCurrentUser: false },
                    { rank: 4, name: profile?.full_name || "Học viên (Em)", xp: 850, avatar: "⚡", badge: "⭐", isCurrentUser: true },
                    { rank: 5, name: "Phạm Hoàng Long", xp: 720, avatar: "🦁", badge: "", isCurrentUser: false },
                    { rank: 6, name: "Vũ Khánh Huyền", xp: 640, avatar: "🐱", badge: "", isCurrentUser: false },
                  ].map((row) => (
                    <div 
                      key={row.rank}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        row.isCurrentUser 
                          ? "border-[#1899D6] bg-[#E8F4FD] shadow-[0_2px_0_#84D8FF]" 
                          : "border-transparent hover:bg-slate-50 text-[#3D3D3B]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm w-6 text-center text-[#777777]">#{row.rank}</span>
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-inner select-none">
                          {row.avatar}
                        </div>
                        <div>
                          <p className={`text-xs font-black truncate max-w-full ${row.isCurrentUser ? "text-[#1899D6]" : "text-[#1A1A18]"}`}>
                            {row.name} {row.isCurrentUser && <span className="text-[9px] font-black uppercase text-[#B45309] bg-[#FFF3E0] px-1.5 py-0.5 rounded ml-1 border border-[#FFE0B2]">Bạn</span>}
                          </p>
                          <p className="text-[10px] text-[#777777] font-semibold mt-0.5">Học sinh tích cực</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.badge && <span className="text-base select-none">{row.badge}</span>}
                        <span className="text-xs font-black text-[#1A1A18] tracking-tight">{row.xp} KN</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NHIỆM VỤ TAB (Daily Quests checklist) */}
            {activeTab === "quests" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Nhiệm Vụ Hàng Ngày ⚡
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Hoàn thành các nhiệm vụ bên dưới để tích lũy điểm kinh nghiệm và mở khóa Rương báu vật Hoàng gia cực lớn!
                  </p>
                </div>

                {/* Progress bar and chest card */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-[#1A1A18]">Rương Đá Quý Hàng Ngày</h4>
                      <p className="text-xs text-[#777777] font-semibold">Hoàn thành thêm 2 nhiệm vụ nữa để mở khóa rương!</p>
                    </div>
                    <div className="text-5xl select-none animate-pulse">🎁 🔒</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-[#3D3D3B]">
                      <span>Tiến độ mở khóa</span>
                      <span>1 / 3 Nhiệm vụ</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-[#E5E5E5] h-5 rounded-full relative overflow-hidden flex items-center pr-1 border border-slate-200">
                      <div className="bg-[#58CC02] h-full rounded-full transition-all duration-500 shadow-inner" style={{ width: "33%" }} />
                      <span className="absolute right-3 text-xs select-none">💎 50</span>
                    </div>
                  </div>
                </div>

                {/* Quest checklist cards */}
                <div className="space-y-4">
                  {[
                    { id: 1, title: "Tích lũy 10 KN học tập", desc: "Hoàn thành các bài luyện nghe chép hoặc luyện phát âm nói.", xp: 30, progress: "0 / 10 KN", percent: 0, done: false },
                    { id: 2, title: "Luyện phát âm chuẩn 5 câu thoại SGK", desc: "Sử dụng tính năng luyện phát âm nói AI đạt độ chính xác trên 75%.", xp: 50, progress: "2 / 5 câu", percent: 40, done: false },
                    { id: 3, title: "Duy trì Chuỗi học Streak 3 ngày", desc: "Vào học bài SGK liên tiếp 3 ngày để tăng bền vững phản xạ tiếng Anh.", xp: 100, progress: "3 / 3 ngày", percent: 100, done: true },
                  ].map((quest) => (
                    <div 
                      key={quest.id}
                      className={`bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_4px_0_#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-slate-300 ${
                        quest.done ? "bg-slate-50/50 opacity-90" : ""
                      }`}
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            quest.done 
                              ? "bg-[#E8F9EE] text-[#58CC02] border border-[#B3F2C9]" 
                              : "bg-[#FFF8E7] text-[#B45309] border border-[#FFE0B2]"
                          }`}>
                            {quest.done ? "Hoàn thành! 🎉" : "Đang thực hiện"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase">• Thưởng +{quest.xp} KN</span>
                        </div>
                        <h4 className={`text-sm font-black text-[#1A1A18] ${quest.done ? "line-through text-slate-400" : ""}`}>{quest.title}</h4>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed">{quest.desc}</p>
                        
                        {/* Progress slider */}
                        <div className="w-full max-w-sm pt-2">
                          <div className="flex items-center justify-between text-[9px] font-black text-[#777777] mb-1">
                            <span>Tiến trình</span>
                            <span>{quest.progress}</span>
                          </div>
                          <div className="w-full bg-[#E5E5E5] h-2 rounded-full overflow-hidden border border-slate-100">
                            <div className="bg-[#1899D6] h-full rounded-full transition-all" style={{ width: `${quest.percent}%` }} />
                          </div>
                        </div>
                      </div>

                      <button 
                        disabled={quest.done}
                        className={`px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer select-none ${
                          quest.done
                            ? "bg-slate-100 text-slate-400 border border-slate-200 shadow-none pointer-events-none"
                            : "bg-[#58CC02] text-white border-none shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-none"
                        }`}
                      >
                        {quest.done ? "Đã nhận quà" : "Bắt đầu ngay"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. HỒ SƠ TAB (Student profile & billing dashboard) */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Header Greeting Banner */}
                <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 rounded-[2rem] shadow-[0_4px_0_#E5E5E5]">
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">
                    Hồ Sơ Học Viên & Thống Kê 🎓
                  </h1>
                  <p className="text-xs text-[#777777] font-semibold leading-relaxed mt-1">
                    Cá nhân hóa tài khoản học tập, xem chi tiết các chứng chỉ và cấu hình nâng cấp gói thành viên PRO của em.
                  </p>
                </div>

                {/* Profile Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left avatar card */}
                  <div className="bg-white border-2 border-[#E5E5E5] rounded-[2rem] shadow-[0_4px_0_#E5E5E5] p-6 text-center space-y-4 md:col-span-1">
                    <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-[#84D8FF] text-5xl flex items-center justify-center shadow-inner mx-auto select-none">
                      {profile?.full_name ? profile.full_name.charAt(0) : "⚡"}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#1A1A18] tracking-tight">{profile?.full_name || "Học viên"}</h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">{profile?.email || "student@global.edu"}</p>
                    </div>

                    <div className="pt-2">
                      {profile?.subscription_plan === "pro" ? (
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl px-4 py-2 text-xs font-black uppercase flex items-center justify-center gap-1 shadow-md animate-pulse">
                          <Sparkles size={12} fill="white" />
                          PRO MEMBER
                        </div>
                      ) : (
                        <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-2 text-xs font-black uppercase border border-slate-200">
                          FREE STUDENT
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2.5 bg-[#F7F7F7] border-2 border-[#E5E5E5] hover:bg-slate-50 text-xs font-black text-[#3D3D3B] rounded-xl transition-all shadow-[0_2px_0_#E5E5E5] active:translate-y-[2px] active:shadow-none cursor-pointer">
                      Thay ảnh đại diện
                    </button>
                  </div>

                  {/* Right stats dashboard */}
                  <div className="bg-white border-2 border-[#E5E5E5] rounded-[2rem] shadow-[0_4px_0_#E5E5E5] p-6 space-y-6 md:col-span-2">
                    <h4 className="text-base font-black text-[#1A1A18] border-b-2 border-slate-50 pb-2">Bảng Chỉ Số Học Tập</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Tổng điểm tích lũy</p>
                        <p className="text-2xl font-black text-[#1A1A18] mt-1">850 KN</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Chuỗi hoạt động</p>
                        <p className="text-2xl font-black text-[#FF9600] mt-1 flex items-center gap-1">
                          <Flame size={20} fill="#FF9600" className="text-[#FF9600]" />
                          {profile?.streak || 0} Ngày
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Đá quý tích lũy</p>
                        <p className="text-2xl font-black text-[#1CB0F6] mt-1">💎 {profile?.gems || 500}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <p className="text-[9px] text-[#777777] font-black uppercase tracking-wider">Sinh mệnh hiện có</p>
                        <p className="text-2xl font-black text-[#FF4B4B] mt-1">❤️ {profile?.lives || 5}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 py-3 bg-[#1899D6] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_0_#1482B5] active:translate-y-[4px] active:shadow-none cursor-pointer">
                        Đổi mật khẩu
                      </button>
                      
                      {profile?.subscription_plan !== "pro" && (
                        <button 
                          onClick={() => window.location.href = "/#pricing"}
                          className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none cursor-pointer flex items-center justify-center gap-1 animate-bounce mt-2 sm:mt-0"
                        >
                          <Sparkles size={14} fill="white" />
                          Nâng cấp PRO ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* 3. CỘT PHẢI (Widgets Desktop) */}
          <aside className="hidden xl:flex flex-col gap-6 shrink-0 w-[360px]" ref={dropdownRef}>
            
            {/* Top Bar status metrics widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-5 rounded-3xl flex items-center justify-between shadow-[0_4px_0_#E5E5E5]">
              {/* Flag & grade switcher */}
              <div className="relative">
                <button
                  onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
                  className="flex items-center gap-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] px-3.5 py-1.5 rounded-2xl text-xs font-black text-[#1A1A18]"
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="uppercase font-black text-[10px] tracking-wider">LỚP 6</span>
                  <ChevronDown size={14} className="text-[#777777]" />
                </button>

                <AnimatePresence>
                  {gradeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 top-full w-56 bg-white border-2 border-[#E5E5E5] rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1"
                    >
                      {grades.map((grade) => (
                        <Link
                          key={grade.id}
                          href={`/learn/grade/${grade.id}`}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-[#3D3D3B] hover:bg-[#F7F7F7] flex items-center gap-2"
                          onClick={() => setGradeDropdownOpen(false)}
                        >
                          <span>🏫</span>
                          {grade.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status metrics */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[#FF9600] font-black text-xs select-none">
                  <Flame size={20} fill="#FF9600" className="text-[#FF9600]" /> 
                  {profile?.streak || 0}
                </div>
                <div className="flex items-center gap-1.5 text-[#1CB0F6] font-black text-xs select-none">
                  💎 {profile?.gems || 500}
                </div>
                <div className="flex items-center gap-1.5 text-[#FF4B4B] font-black text-xs select-none">
                  ❤️ {profile?.lives || 5}
                </div>
              </div>
            </div>

            {/* Padlocked Leaderboard widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-4">
              <h4 className="text-base font-black text-[#1A1A18]">Bảng xếp hạng tuần!</h4>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 bg-[#E8F4FD] border-2 border-[#B4DDF7] rounded-2xl flex items-center justify-center text-4xl shadow-inner select-none">
                  🛡️
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#1A1A18] font-black">Chưa xếp hạng</p>
                  <p className="text-[10px] text-[#777777] font-semibold leading-relaxed">
                    Hoàn thành thêm 3 bài học nữa để mở khóa bảng thi đua tuần và so tài cùng bạn bè nhé!
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Quests widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-[#1A1A18] flex items-center gap-1.5">
                  <Zap size={18} fill="#FF9600" className="text-[#FF9600]" />
                  Nhiệm vụ hằng ngày
                </h4>
                <a href="#" className="text-[10px] font-black text-[#1899D6] uppercase tracking-wider hover:underline">Xem tất cả</a>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-[#3D3D3B]">
                    <span>Kiếm 10 KN học tập</span>
                    <span className="text-[#777777]">0 / 10 KN</span>
                  </div>
                  
                  {/* Lightning progress bar */}
                  <div className="w-full bg-[#E5E5E5] h-4 rounded-full relative overflow-hidden flex items-center pr-1">
                    <div className="bg-[#FF9600] h-full rounded-full" style={{ width: "0%" }} />
                    <span className="absolute right-2 text-xs">🎁</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Login / Create profile widget */}
            <div className="bg-white border-2 border-[#E5E5E5] p-6 rounded-[2rem] shadow-[0_4px_0_#E5E5E5] space-y-4">
              <h4 className="text-base font-black text-[#1A1A18]">Lưu lại tiến trình của em!</h4>
              <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                Tạo một tài khoản Cinematic English miễn phí để lưu trữ mọi chứng chỉ, lịch sử và điểm số nhé!
              </p>
              
              <div className="space-y-3 pt-2">
                <Link 
                  href="/signup" 
                  className="w-full py-3.5 bg-[#58CC02] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block"
                >
                  Tạo hồ sơ miễn phí
                </Link>
                <Link 
                  href="/login" 
                  className="w-full py-3.5 bg-[#1899D6] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#1482B5] hover:brightness-105 active:translate-y-[4px] active:shadow-none transition-all cursor-pointer text-center block mt-3"
                >
                  Đăng nhập học ngay
                </Link>
              </div>
            </div>

            {/* Gamified Footer Links */}
            <footer className="px-4 text-[10px] text-[#AFAFAF] font-black uppercase tracking-wider flex flex-wrap gap-x-4 gap-y-2 justify-center leading-relaxed">
              <a href="#" className="hover:text-[#777777]">Giới thiệu</a>
              <a href="#" className="hover:text-[#777777]">Cửa hàng</a>
              <a href="#" className="hover:text-[#777777]">Hiệu quả</a>
              <a href="#" className="hover:text-[#777777]">Công việc</a>
              <a href="#" className="hover:text-[#777777]">Điều khoản</a>
              <a href="#" className="hover:text-[#777777]">Bảo mật</a>
            </footer>
          </aside>
        </div>
      </div>
    </div>
  );
}

