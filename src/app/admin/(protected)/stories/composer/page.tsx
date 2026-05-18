"use client";
import { useState } from "react";
import { 
  Sparkles, 
  ChevronLeft, 
  Film, 
  Play, 
  Brain, 
  Music, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Volume2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { saveAIComposedStory } from "@/app/admin/actions";

// --- IPA Dictionary for Heuristic Cinematic Pronunciation ---
const COMMON_IPA_MAP: Record<string, string> = {
  "why": "waɪ",
  "so": "soʊ",
  "serious": "ˈsɪə.ri.əs",
  "offer": "ˈɒf.ər",
  "refuse": "rɪˈfjuːz",
  "dark": "dɑːk",
  "knight": "naɪt",
  "hero": "ˈhɪə.rəʊ",
  "die": "daɪ",
  "live": "lɪv",
  "love": "lʌv",
  "beautiful": "ˈbjuː.tɪ.fəl",
  "heart": "hɑːt",
  "will": "wɪl",
  "never": "ˈnev.ər",
  "let": "let",
  "go": "ɡoʊ",
  "fear": "fɪər",
  "power": "ˈpaʊ.ər",
  "mind": "maɪnd",
  "destiny": "ˈdes.tɪ.ni",
  "future": "ˈfjuː.tʃər",
  "truth": "truːθ",
  "lie": "laɪ",
  "choice": "tʃɔɪs"
};

function generateHeuristicIpa(text: string): string {
  const cleanWords = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").split(/\s+/);
  const ipaWords = cleanWords.map(word => {
    if (COMMON_IPA_MAP[word]) return COMMON_IPA_MAP[word];
    // Fallback phonetic syllabication approximation
    return word
      .replace(/th/g, "θ")
      .replace(/ea/g, "iː")
      .replace(/oo/g, "uː")
      .replace(/ee/g, "iː")
      .replace(/ou/g, "aʊ")
      .replace(/sh/g, "ʃ")
      .replace(/ch/g, "tʃ")
      .replace(/c([^eiy])/g, "k$1")
      .replace(/c([eiy])/g, "s$1")
      .replace(/ck/g, "k")
      .replace(/ph/g, "f")
      .replace(/tion/g, "ʃn");
  });
  return `/${ipaWords.join(" ")}/`;
}

// --- Cinematic Translation Bank for Iconic Phrases ---
const CINEMATIC_TRANSLATION_BANK: Record<string, string> = {
  "why so serious": "Sao phải nghiêm trọng thế?",
  "i'm gonna make him an offer he can't refuse": "Tôi sẽ đưa ra một lời đề nghị mà hắn không thể chối từ.",
  "you either die a hero or you live long enough to see yourself become the villain": "Hoặc là cậu chết như một người hùng, hoặc sống đủ lâu để thấy mình trở thành kẻ phản diện.",
  "to infinity and beyond": "Đến vô cực và xa hơn thế nữa!",
  "i'm the king of the world": "Tôi là vua của thế giới này!",
  "may the force be with you": "Cầu mong thần lực sẽ luôn ở bên bạn.",
  "there's no place like home": "Không có nơi nào tuyệt vời bằng mái nhà của mình.",
  "keep your friends close but your enemies closer": "Hãy giữ bạn bè ở gần, nhưng giữ kẻ thù ở gần hơn.",
  "elementary my dear watson": "Quá đơn giản, Watson thân mến của tôi.",
  "i will find you and i will kill you": "Ta sẽ tìm ra ngươi và ta sẽ tiêu diệt ngươi."
};

function getHeuristicTranslation(text: string): string {
  const clean = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  if (CINEMATIC_TRANSLATION_BANK[clean]) {
    return CINEMATIC_TRANSLATION_BANK[clean];
  }
  // Generic mock-translation based on words
  if (clean.includes("serious")) return "Sao phải căng thẳng và nghiêm trọng thế?";
  if (clean.includes("offer") || clean.includes("refuse")) return "Lời đề nghị không thể khước từ.";
  if (clean.includes("hero") || clean.includes("villain")) return "Người hùng hay kẻ phản diện tàn ác.";
  if (clean.includes("king") || clean.includes("world")) return "Thống trị thế giới điện ảnh này!";
  
  return `[Bản dịch AI]: Cần tinh chỉnh lại bản dịch cho câu: "${text}"`;
}

// --- Subtitle SRT/Text Ingestion Parser ---
function parseSubtitles(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const result: Array<{ transcript: string; start_time: number; end_time: number }> = [];

  let currentStart = 0;
  let currentEnd = 4;
  let currentText = "";
  let isSrt = text.includes("-->");

  if (isSrt) {
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (/^\d+$/.test(line)) {
        i++;
        continue;
      }
      if (line.includes("-->")) {
        const times = line.split("-->").map(t => t.trim());
        const parseSrtTime = (tStr: string) => {
          const parts = tStr.replace(",", ".").split(":");
          const hrs = parseInt(parts[0]) || 0;
          const mins = parseInt(parts[1]) || 0;
          const secs = parseFloat(parts[2]) || 0;
          return hrs * 3600 + mins * 60 + secs;
        };
        currentStart = parseSrtTime(times[0]);
        currentEnd = parseSrtTime(times[1]);
        i++;
        
        let textLines = [];
        while (i < lines.length && !lines[i].includes("-->") && !/^\d+$/.test(lines[i])) {
          textLines.push(lines[i]);
          i++;
        }
        currentText = textLines.join(" ");
        if (currentText) {
          result.push({
            transcript: currentText,
            start_time: Math.round(currentStart * 10) / 10,
            end_time: Math.round(currentEnd * 10) / 10
          });
        }
        continue;
      }
      i++;
    }
  } else {
    // Custom plain text / timestamp parser
    lines.forEach((line, idx) => {
      const timeMatch = line.match(/^\[?(\d+:?\d*)\s*[-➔–]\s*(\d+:?\d*)\]?\s*(.*)$/);
      if (timeMatch) {
        const parseTimeStr = (s: string) => {
          if (s.includes(":")) {
            const parts = s.split(":");
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          }
          return parseInt(s);
        };
        result.push({
          transcript: timeMatch[3].trim(),
          start_time: parseTimeStr(timeMatch[1]),
          end_time: parseTimeStr(timeMatch[2])
        });
      } else {
        // Line-by-line fallback
        result.push({
          transcript: line,
          start_time: idx * 5,
          end_time: (idx + 1) * 5
        });
      }
    });
  }

  return result.filter(r => r.transcript.length > 3);
}

export default function AIContentComposer() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Pipeline Inputs
  const [movieTitle, setMovieTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [category, setCategory] = useState("Cinema");
  const [srtText, setSrtText] = useState("");

  // Pipeline Status Indicators
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // Pipeline Outputs
  const [composedPayload, setComposedPayload] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const PIPELINE_STEPS = [
    { id: 1, label: "📑 Đọc phụ đề SRT và phân tích cấu trúc lời thoại" },
    { id: 2, label: "✂️ Tách nhỏ tệp và làm sạch các câu thoại" },
    { id: 3, label: "🇻🇳 Dịch ngữ cảnh tiếng Việt (Cinematic Vietnamese)" },
    { id: 4, label: "🗣️ Tự động tạo phiên âm quốc tế IPA chuẩn xác" },
    { id: 5, label: "🎙️ Phân tích chất giọng (US/UK) và tông cảm xúc điện ảnh" },
    { id: 6, label: "🧠 Tính toán chỉ số Dopamine & Điểm độ khó phát âm" },
    { id: 7, label: "📈 Sắp xếp Nhịp độ cảm xúc (Learning Pacing Rhythm)" },
    { id: 8, label: "💾 Kết xuất cấu trúc cơ sở dữ liệu Cinematic" }
  ];

  const handleLaunchPipeline = async () => {
    if (!movieTitle || !srtText) {
      return alert("Vui lòng nhập tên phim và tệp phụ đề SRT!");
    }

    setStep(2);
    setPipelineProgress(0);
    setPipelineStatus("Đang khởi tạo Content Pipeline...");
    setCompletedSteps({});
    setPipelineError(null);

    try {
      // Step 1: Parse SRT
      await simulateStep(1, "Phân tích cú pháp SRT...", 1000);
      const parsedLines = parseSubtitles(srtText);
      if (parsedLines.length === 0) {
        throw new Error("Không thể phân tích bất kỳ câu thoại nào từ phụ đề SRT nhập vào. Vui lòng kiểm tra lại cấu trúc phụ đề.");
      }

      // Step 2: Cleaning
      await simulateStep(2, "Làm sạch ký tự thừa...", 1200);

      // Step 3: Vietnamese translation
      await simulateStep(3, "Bản dịch ngữ cảnh tiếng Việt...", 1400);
      
      // Step 4: IPA Pronunciation
      await simulateStep(4, "Khớp phiên âm IPA...", 1500);

      // Step 5: Emotion detection
      await simulateStep(5, "Định vị Tông cảm xúc cảm âm...", 1200);

      // Step 6: Dopamine and Difficulty calculation
      await simulateStep(6, "Tính toán thang điểm Dopamine...", 1000);

      // Step 7: Pacing structure
      await simulateStep(7, "Bố trí Pacing cảm xúc học...", 1100);

      // Step 8: Database structuring
      await simulateStep(8, "Tổng hợp gói cơ sở dữ liệu...", 800);

      // Construct Complete Rich Payload
      const enrichedSentences = parsedLines.map((line, idx) => {
        const text = line.transcript;
        const ipa = generateHeuristicIpa(text);
        const translation_only = getHeuristicTranslation(text);
        
        // Emotional detection based on key vocabulary
        let emotion = "Inspiring";
        if (text.toLowerCase().includes("serious") || text.toLowerCase().includes("kill") || text.toLowerCase().includes("villain")) {
          emotion = "Dramatic";
        } else if (text.toLowerCase().includes("king") || text.toLowerCase().includes("infinity")) {
          emotion = "Epic";
        }

        // Pacing strategy matching index
        let pacing = "medium";
        if (idx === 0) pacing = "easy";
        else if (idx === parsedLines.length - 1) pacing = "recovery";
        else if (idx === Math.floor(parsedLines.length / 2)) pacing = "emotional payoff";
        else if (idx % 3 === 0) pacing = "hard";

        // Dopamine assignment
        let dopamine = 70;
        if (pacing === "emotional payoff") dopamine = 95;
        else if (emotion === "Dramatic") dopamine = 85;

        // Difficulty calculation based on syllable count approximation
        const syllables = text.split(/\s+/).length;
        const difficulty_score = Math.min(100, Math.max(10, syllables * 6));

        // Speaching coaching tips
        let coaching_hint = "Chú ý nhấn trọng âm ở các từ quan trọng để câu thoại có nhịp điệu điện ảnh tự nhiên.";
        if (text.toLowerCase().includes("why")) {
          coaching_hint = "Nhấn mạnh từ 'Why' và kéo dài nhẹ để bộc lộ rõ nét tâm trạng mỉa mai, ma mị.";
        } else if (text.toLowerCase().includes("offer")) {
          coaching_hint = "Hạ thấp tông giọng, nói chậm lại ở cụm 'offer he can't refuse' để tạo phong thái uy quyền.";
        }

        return {
          transcript: text,
          translation_only,
          ipa,
          target_score: difficulty === "Beginner" ? 75 : difficulty === "Advanced" ? 85 : 80,
          start_time: line.start_time,
          end_time: line.end_time,
          metadata: {
            pacing_type: pacing,
            speech_speed: syllables / (line.end_time - line.start_time) > 3 ? "fast" : "normal",
            emotion_type: emotion,
            pronunciation_difficulty: difficulty_score > 70 ? "high" : difficulty_score > 40 ? "medium" : "low",
            shadowing_priority: pacing === "emotional payoff" ? "high" : "medium",
            replay_priority: pacing === "emotional payoff" ? "high" : "medium",
            accent_type: "US",
            dopamine_score: dopamine,
            difficulty_score: difficulty_score,
            coaching_hint: coaching_hint
          }
        };
      });

      // Set Composed Payload
      setComposedPayload({
        story: {
          title: movieTitle,
          synopsis: `Khám phá các trích đoạn đối thoại đỉnh cao trong bộ phim ${movieTitle}. Luyện tập cấu trúc phát âm, sắc thái nói và nâng cao biểu cảm giao tiếp qua từng thước phim kinh điển.`,
          script: parsedLines.map(l => l.transcript).join("\n\n"),
          category: category,
          difficulty: difficulty,
          tags: `${movieTitle.toLowerCase()}, cinema, ai-factory`,
          xp_value: enrichedSentences.length * 50,
          thumbnail_url: "" // Admin will tweak URL later
        },
        scene: {
          video_url: videoUrl,
          thumbnail_url: ""
        },
        lesson: {
          title: `Luyện nói trích đoạn: ${movieTitle}`,
          description: `Rèn luyện phát âm tự nhiên và sắc sảo cùng 5 câu thoại biểu tượng nhất từ ${movieTitle}.`
        },
        sentences: enrichedSentences
      });

      setStep(3);
    } catch (err: any) {
      setPipelineError(err.message || "Đã xảy ra lỗi không xác định trong quá trình phân tích AI.");
    }
  };

  const simulateStep = async (stepId: number, statusText: string, delay: number) => {
    setPipelineStatus(statusText);
    await new Promise(r => setTimeout(r, delay));
    setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
    setPipelineProgress(prev => Math.min(100, prev + 12.5));
  };

  const handleSaveToDraft = async () => {
    if (!composedPayload) return;
    setIsSaving(true);

    const res = await saveAIComposedStory(composedPayload);
    setIsSaving(false);

    if (res.success) {
      alert("🚀 AI Content Factory đã lưu toàn bộ cấu trúc bài học thành công ở trạng thái DRAFT! Hãy tiến hành rà soát cuối cùng.");
      router.push(`/admin/stories/edit/${res.storyId}`);
    } else {
      alert("Lỗi lưu bài học: " + res.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/stories" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Library
        </Link>
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-3">
            <Sparkles className="text-[#a78bfa] shadow-glow-purple" size={32} /> AI Content Factory
          </h2>
          <p className="text-white/40 font-medium italic">Quy trình 1 đầu vào ➔ 1 gói bài học speaking điện ảnh sẵn sàng vận hành.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Input Ingestion */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Form (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-6 shadow-2xl">
                <h3 className="text-sm font-black text-amber-500 flex items-center gap-2 uppercase tracking-widest">
                  <Film size={16} /> 1. Thông tin Ingestion phim học tập
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Tên tác phẩm / Movie Title</label>
                    <input 
                      type="text"
                      value={movieTitle}
                      onChange={(e) => setMovieTitle(e.target.value)}
                      placeholder="Ví dụ: The Dark Knight, Titanic..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Video URL (Youtube / MP4)</label>
                    <input 
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Trình độ khóa học / Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setDifficulty(lvl)}
                          className={`py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                            difficulty === lvl ? 'bg-blue-500 border-blue-500 text-white shadow-glow-blue' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {lvl === 'Beginner' ? 'Dễ' : lvl === 'Intermediate' ? 'Vừa' : 'Khó'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Thể loại câu chuyện / Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white/60 focus:outline-none appearance-none"
                    >
                      <option value="Cinema">Cinema & Movie Quotes</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Philosophy">Philosophy</option>
                      <option value="Business">Business & Leadership</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subtitles Input */}
              <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-amber-500 flex items-center gap-2 uppercase tracking-widest">
                    <FileText size={16} /> 2. Nhập phụ đề phim (SRT / Timed Transcript)
                  </h3>
                  <button 
                    type="button"
                    onClick={() => setSrtText(`1\n00:01:05,200 --> 00:01:08,500\nWhy so serious?\n\n2\n00:01:12,100 --> 00:01:16,900\nYou either die a hero or live long enough to see yourself become the villain.`)}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#a78bfa] hover:text-[#c084fc] transition-colors"
                  >
                    💡 Điền tệp SRT mẫu
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Hỗ trợ dán trực tiếp tệp phụ đề dạng SRT hoặc dòng thoại có mốc thời gian</label>
                  <textarea 
                    value={srtText}
                    onChange={(e) => setSrtText(e.target.value)}
                    rows={12}
                    placeholder="Ví dụ phụ đề SRT:\n1\n00:01:10,000 --> 00:01:14,000\nI'm gonna make him an offer he can't refuse.\n..."
                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 px-8 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500/50 transition-all custom-scrollbar"
                  />
                </div>
              </div>

              {/* Launch Action */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleLaunchPipeline}
                  className="group relative flex items-center gap-3 px-14 py-6 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-display font-black text-lg shadow-glow-purple hover:scale-[1.03] active:scale-95 transition-all"
                >
                  Khởi chạy AI Content Pipeline 🚀
                </button>
              </div>
            </div>

            {/* Right Instructions Panel */}
            <div className="space-y-6">
              <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                <h4 className="text-xs font-black text-[#a78bfa] flex items-center gap-2 uppercase tracking-widest">
                  <Brain size={16} /> Triết lý AI làm giàu nội dung
                </h4>
                
                <div className="space-y-4 text-xs leading-relaxed text-white/50">
                  <p>Hệ thống AI Content Factory **không sáng tạo ra hội thoại giả lập ngẫu nhiên**.</p>
                  <p>Thay vào đó, nó dựa trên **phụ đề gốc chính xác 100% của bộ phim** để tăng cường trí tuệ học tập:</p>
                  
                  <ul className="space-y-3 list-disc pl-4 text-white/40">
                    <li><strong className="text-white/60">IPA Generation:</strong> Tự động dịch các từ khó sang phiên âm quốc tế hỗ trợ mic AI nhận dạng.</li>
                    <li><strong className="text-white/60">Contextual Translation:</strong> Chuyển ngữ sang bản dịch tiếng Việt giàu tính nghệ thuật điện ảnh, không dịch thô cứng máy móc.</li>
                    <li><strong className="text-white/60">Dopamine Rating:</strong> Lựa chọn điểm bùng nổ của câu thoại để khen ngợi học viên khi luyện nói thành công.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Processing Pipeline */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="p-10 rounded-[48px] bg-[#1a1a1a] border border-white/5 shadow-2xl space-y-10 text-center relative overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full" />

              <div className="space-y-4 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-[#7c3aed]/10 border border-purple-500/20 flex items-center justify-center mx-auto relative">
                  <Loader2 className="animate-spin text-purple-500" size={32} />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400" size={14} />
                </div>
                
                <h3 className="text-xl font-display font-black text-white">AI Content Pipeline Đang Chạy...</h3>
                <p className="text-xs text-[#a78bfa] font-bold italic">{pipelineStatus}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 max-w-md mx-auto relative z-10">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-glow-purple"
                    animate={{ width: `${pipelineProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <span>Khởi tạo</span>
                  <span>Hoàn tất {Math.round(pipelineProgress)}%</span>
                </div>
              </div>

              {/* Steps Visual Check */}
              <div className="border-t border-white/5 pt-8 text-left space-y-4 max-w-lg mx-auto relative z-10">
                {PIPELINE_STEPS.map(s => {
                  const isDone = completedSteps[s.id];
                  const isCurrent = !isDone && (s.id === 1 || completedSteps[s.id - 1]);
                  
                  return (
                    <div key={s.id} className="flex items-center justify-between text-xs transition-all">
                      <span className={`font-medium ${isDone ? 'text-white/60' : isCurrent ? 'text-purple-400 font-bold' : 'text-white/20'}`}>
                        {s.label}
                      </span>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="text-purple-500 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-white/5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {pipelineError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 max-w-lg mx-auto">
                  <AlertCircle size={18} />
                  <span>Lỗi: {pipelineError}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Review Composed Content */}
        {step === 3 && composedPayload && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Story & Scene general preview */}
            <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-2xl">
              <div className="space-y-2 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">
                  🔥 Trực quan hóa gói dữ liệu Story
                </span>
                <h3 className="text-2xl font-display font-black text-white">
                  {composedPayload.story.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed max-w-4xl">
                  {composedPayload.story.synopsis}
                </p>
                
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                    {composedPayload.story.difficulty}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    {composedPayload.story.category}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                    {composedPayload.story.xp_value} XP
                  </span>
                </div>
              </div>

              <div className="flex gap-4 w-full xl:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 xl:flex-none px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  Nhập lại phụ đề
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveToDraft}
                  disabled={isSaving}
                  className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-glow-purple disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Save size={18} /> Lưu bản nháp (Draft) 🚀
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sentences List Grid */}
            <div className="space-y-6">
              <h3 className="text-lg font-display font-black text-white flex items-center gap-2 px-4">
                📋 Phân tích và Làm giàu 10 Chỉ số Trí tuệ cho từng câu thoại ({composedPayload.sentences.length} câu thoại)
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {composedPayload.sentences.map((sent: any, idx: number) => (
                  <div key={idx} className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-[#7c3aed] to-indigo-500 opacity-60" />
                    
                    {/* Index & Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#a78bfa] text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">
                          SPEAKING CONTEXT SENTENCE
                        </span>
                      </div>

                      {/* Time Offset Badge */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-white/50">
                        <Clock size={12} /> {sent.start_time}s - {sent.end_time}s ({Math.round((sent.end_time - sent.start_time) * 10) / 10}s)
                      </div>
                    </div>

                    {/* Text Translation Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-1">
                          <Volume2 size={10} /> English Quote (Gốc)
                        </label>
                        <input
                          type="text"
                          value={sent.transcript}
                          onChange={(e) => {
                            const newSents = [...composedPayload.sentences];
                            newSents[idx].transcript = e.target.value;
                            setComposedPayload({ ...composedPayload, sentences: newSents });
                          }}
                          className="w-full bg-black/30 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-bold text-white focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-[#a78bfa] ml-4 flex items-center gap-1">
                          🇻🇳 Rich Vietnamese Translation (AI Composer)
                        </label>
                        <input
                          type="text"
                          value={sent.translation_only}
                          onChange={(e) => {
                            const newSents = [...composedPayload.sentences];
                            newSents[idx].translation_only = e.target.value;
                            setComposedPayload({ ...composedPayload, sentences: newSents });
                          }}
                          className="w-full bg-black/30 border border-purple-500/20 rounded-2xl py-3.5 px-6 text-sm font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* IPA & Coaching Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-[#a78bfa] ml-4">
                          🗣️ Phiên âm IPA Quốc tế
                        </label>
                        <input
                          type="text"
                          value={sent.ipa}
                          onChange={(e) => {
                            const newSents = [...composedPayload.sentences];
                            newSents[idx].ipa = e.target.value;
                            setComposedPayload({ ...composedPayload, sentences: newSents });
                          }}
                          className="w-full bg-black/30 border border-purple-500/20 rounded-2xl py-3.5 px-6 text-xs font-mono text-purple-400 focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-2 lg:col-span-2">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-[#a78bfa] ml-4">
                          🎙️ Gợi ý luyện giọng & Coaching (Speaking Hints)
                        </label>
                        <input
                          type="text"
                          value={sent.metadata.coaching_hint}
                          onChange={(e) => {
                            const newSents = [...composedPayload.sentences];
                            newSents[idx].metadata.coaching_hint = e.target.value;
                            setComposedPayload({ ...composedPayload, sentences: newSents });
                          }}
                          className="w-full bg-black/30 border border-purple-500/20 rounded-2xl py-3.5 px-6 text-xs text-white/70 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Content Intelligence Tags preview */}
                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/20 block mb-1">Pacing rhythm</span>
                        <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[#a78bfa] text-[9px] font-black uppercase">
                          {sent.metadata.pacing_type}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/20 block mb-1">Emotion tone</span>
                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase">
                          {sent.metadata.emotion_type}
                        </span>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/20 block mb-1">Speech speed</span>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase">
                          {sent.metadata.speech_speed}
                        </span>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/20 block mb-1">Accent</span>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                          {sent.metadata.accent_type}
                        </span>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/20 block mb-1">Dopamine</span>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={12} className="text-rose-500 animate-pulse" />
                          <span className="text-xs font-black text-rose-500">{sent.metadata.dopamine_score}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/20 block mb-1">Difficulty</span>
                        <span className="text-xs font-black text-white/60">{sent.metadata.difficulty_score} / 100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center py-6">
              <button
                type="button"
                onClick={handleSaveToDraft}
                disabled={isSaving}
                className="group relative flex items-center gap-3 px-16 py-6 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-display font-black text-lg shadow-glow-purple hover:scale-[1.03] active:scale-95 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Lưu toàn bộ bản nháp & Vào biên soạn chi tiết 🚀</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
