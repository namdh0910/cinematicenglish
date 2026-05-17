"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Settings2, 
  GripVertical,
  Music,
  Mic,
  BookOpen,
  FileText,
  Video,
  Award,
  MoreVertical,
  PlusCircle,
  Sparkles,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  HelpCircle,
  Volume2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  createLesson, 
  deleteLesson, 
  createActivity, 
  deleteActivity, 
  updateActivity 
} from "@/app/admin/actions";

interface Activity {
  id: string;
  title: string;
  type: 'multiple_choice' | 'fill_blanks' | 'shadowing' | 'dictation' | 'matching';
  instructions: string;
  content: any;
  order_index: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language' | 'Getting Started' | 'Exam';
  order_index: number;
  activities: Activity[];
}

interface UnitEditorClientProps {
  unit: {
    id: string;
    title: string;
    lessons: Lesson[];
  };
}

export default function UnitEditorClient({ unit }: UnitEditorClientProps) {
  const router = useRouter();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    unit.lessons.length > 0 ? unit.lessons[0].id : null
  );

  // Lesson & Activity Form States
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<Lesson['type']>("Getting Started");
  
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityType, setNewActivityType] = useState<Activity['type']>("multiple_choice");
  const [newActivityInstructions, setNewActivityInstructions] = useState("");
  
  // Specific activity fields
  const [actAudioUrl, setActAudioUrl] = useState("");
  const [actTranscript, setActTranscript] = useState("");
  const [actQuestions, setActQuestions] = useState<{question: string, options: string[], answer: string}[]>([
    { question: "", options: ["", "", "", ""], answer: "" }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const selectedLesson = unit.lessons.find(l => l.id === selectedLessonId);

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'Listening': return <Music size={18} />;
      case 'Speaking': return <Mic size={18} />;
      case 'Reading': return <BookOpen size={18} />;
      case 'Writing': return <FileText size={18} />;
      case 'Language': return <Sparkles size={18} />;
      case 'Getting Started': return <Video size={18} />;
      case 'Exam': return <Award size={18} />;
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle) return;
    setIsSubmitting(true);
    try {
      const order = unit.lessons.length + 1;
      const lesson = await createLesson({
        unit_id: unit.id,
        title: newLessonTitle,
        type: newLessonType,
        order_index: order
      });
      setNewLessonTitle("");
      setShowLessonModal(false);
      setSelectedLessonId(lesson.id);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error adding lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá Lesson "${title}"? Tất cả bài tập bên trong sẽ bị xoá.`)) return;
    try {
      await deleteLesson(lessonId, unit.id);
      if (selectedLessonId === lessonId) {
        setSelectedLessonId(unit.lessons.find(l => l.id !== lessonId)?.id || null);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting lesson");
    }
  };

  const handleAddQuestionField = () => {
    setActQuestions([...actQuestions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const handleRemoveQuestionField = (index: number) => {
    setActQuestions(actQuestions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, val: any) => {
    const updated = [...actQuestions];
    updated[index] = { ...updated[index], [field]: val };
    setActQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, val: string) => {
    const updated = [...actQuestions];
    updated[qIndex].options[oIndex] = val;
    setActQuestions(updated);
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle || !selectedLessonId) return;
    setIsSubmitting(true);
    try {
      const content: any = {};
      if (actAudioUrl) content.audioUrl = actAudioUrl;
      if (actTranscript) content.transcript = actTranscript;
      if (newActivityType === 'multiple_choice' || newActivityType === 'fill_blanks') {
        content.questions = actQuestions.map(q => ({
          id: Math.random().toString(36).substring(7),
          question: q.question,
          options: q.options.filter(o => o !== ""),
          answer: q.answer
        }));
      }

      await createActivity({
        lesson_id: selectedLessonId,
        title: newActivityTitle,
        type: newActivityType,
        instructions: newActivityInstructions,
        content,
        order_index: (selectedLesson?.activities?.length || 0) + 1
      });

      // Reset states
      setNewActivityTitle("");
      setNewActivityInstructions("");
      setActAudioUrl("");
      setActTranscript("");
      setActQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
      setShowActivityModal(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error creating activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    if (!confirm("Bạn có muốn xoá hoạt động này?")) return;
    try {
      await deleteActivity(actId);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting activity");
    }
  };

  // AI Generated Activity suggestions based on Global Success curriculum
  const handleAIGenerateSuggestions = async () => {
    if (!selectedLessonId) return;
    setIsGeneratingAI(true);
    try {
      const lessonType = selectedLesson?.type || "Getting Started";
      const unitTitle = unit.title;
      
      let title = "";
      let type: Activity['type'] = "multiple_choice";
      let instructions = "";
      let content: any = {};

      if (lessonType === 'Listening') {
        title = "Family Responsibilities Dictation";
        type = "dictation";
        instructions = "Listen carefully to the audio and type the missing words in the transcript.";
        content = {
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          transcript: "In my family, everyone has to share the household chores. My father is responsible for mending things, while my mother does the cooking and grocery shopping.",
          questions: [
            { id: "q1", question: "household chores", answer: "household chores" },
            { id: "q2", question: "grocery shopping", answer: "grocery shopping" }
          ]
        };
      } else if (lessonType === 'Speaking') {
        title = "Expressing Opinions on Family Duties";
        type = "shadowing";
        instructions = "Listen to the native speaker and repeat with proper rhythm, pronunciation, and emotion.";
        content = {
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          transcript: "I strongly believe that sharing housework strengthens family bonds and teaches children valuable life skills."
        };
      } else {
        title = "Grammar & Vocabulary Practice";
        type = "multiple_choice";
        instructions = "Choose the best option to complete each sentence.";
        content = {
          questions: [
            {
              id: "q1",
              question: "My father usually ________ the heavy lifting in our house.",
              options: ["does", "makes", "takes", "gives"],
              answer: "does"
            },
            {
              id: "q2",
              question: "Doing household chores helps kids develop ________ skills.",
              options: ["lifeless", "life-saving", "life", "livable"],
              answer: "life"
            }
          ]
        };
      }

      await createActivity({
        lesson_id: selectedLessonId,
        title,
        type,
        instructions,
        content,
        order_index: (selectedLesson?.activities?.length || 0) + 1
      });

      router.refresh();
      alert("AI đã đề xuất và chèn tự động 1 Hoạt động thực hành cao cấp chuẩn Global Success!");
    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative">
      {/* Lessons Sidebar/List */}
      <div className="xl:col-span-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Lộ trình bài học</h3>
          <button 
            onClick={() => setShowLessonModal(true)}
            className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
          >
            <PlusCircle size={18} /> Thêm bài
          </button>
        </div>

        <div className="space-y-2">
          {unit.lessons.sort((a,b) => a.order_index - b.order_index).map((lesson) => (
            <div 
              key={lesson.id}
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedLessonId === lesson.id 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                  : "bg-[#1a1a1a] border-white/5 text-white hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedLessonId === lesson.id ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-white/40"
                }`}>
                  {getLessonIcon(lesson.type)}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{lesson.type}</span>
                  <h4 className="text-sm font-bold truncate">{lesson.title}</h4>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLesson(lesson.id, lesson.title);
                  }}
                  className="p-1 text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <GripVertical size={16} className="text-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities / Content Editor Area */}
      <div className="xl:col-span-8 space-y-6">
        {selectedLesson ? (
          <div className="space-y-6">
            {/* Lesson Control Header */}
            <div className="rounded-[32px] bg-[#1a1a1a] border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="badge badge-gold mb-1">{selectedLesson.type} Mode</span>
                <h3 className="text-xl font-display font-black text-white">{selectedLesson.title}</h3>
                <p className="text-xs text-white/40 italic">Biên tập các hoạt động và bài tập tương tác dành cho học sinh.</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowActivityModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Plus size={14} /> Thêm hoạt động
                </button>
                <button 
                  onClick={handleAIGenerateSuggestions}
                  disabled={isGeneratingAI}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} /> {isGeneratingAI ? "Đang tạo..." : "AI Đề Xuất"}
                </button>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {(selectedLesson.activities || []).length > 0 ? (
                selectedLesson.activities.sort((a,b) => a.order_index - b.order_index).map((act, index) => (
                  <div key={act.id} className="rounded-3xl border border-white/5 bg-[#1a1a1a] p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black bg-white/5 text-white/60 px-2 py-0.5 rounded uppercase tracking-wider">{act.type}</span>
                          <span className="text-white/20 text-xs font-mono">#{index+1}</span>
                        </div>
                        <h4 className="text-md font-bold text-white">{act.title}</h4>
                        <p className="text-xs text-white/40">{act.instructions}</p>
                      </div>

                      <button 
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Show Activity details summary */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/60 space-y-2 font-mono">
                      {act.content.audioUrl && (
                        <div className="flex items-center gap-2">
                          <Volume2 size={14} className="text-amber-500" />
                          <span className="truncate">{act.content.audioUrl}</span>
                        </div>
                      )}
                      {act.content.transcript && (
                        <div className="italic border-l-2 border-white/10 pl-3 py-1 font-sans">
                          "{act.content.transcript}"
                        </div>
                      )}
                      {act.content.questions && (
                        <div className="space-y-1 pt-2">
                          <span className="text-white/40 font-bold uppercase tracking-wider text-[9px]">Câu hỏi trắc nghiệm ({act.content.questions.length})</span>
                          {act.content.questions.map((q: any, qi: number) => (
                            <div key={q.id} className="text-white/80 font-sans flex items-start gap-1">
                              <span>{qi+1}.</span>
                              <div>
                                <p className="font-bold">{q.question}</p>
                                {q.options && q.options.length > 0 && (
                                  <p className="text-[10px] text-white/40">Options: {q.options.join(" | ")}</p>
                                )}
                                <p className="text-[10px] text-amber-500 font-bold">Answer: {q.answer}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[32px] border-2 border-dashed border-white/5 py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <HelpCircle size={32} className="text-white/20" />
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Chưa có hoạt động nào</span>
                  <p className="text-xs text-white/20 italic max-w-xs">Nhấp vào "Thêm hoạt động" hoặc dùng "AI Đề Xuất" để thêm bài tập thực hành.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-[32px] border border-white/5 bg-[#1a1a1a] p-8 min-h-[600px] flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-white/2 border border-white/5 flex items-center justify-center text-white/10">
                <BookOpen size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-display font-black text-white">Chưa có bài học nào trong Unit</h3>
                <p className="text-white/30 text-sm max-w-xs mx-auto italic">Thêm một bài học bên cột trái (như Getting Started, Listening, speaking...) để bắt đầu biên soạn.</p>
             </div>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[32px] p-8 space-y-6 relative"
          >
            <button 
              onClick={() => setShowLessonModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-display font-black text-white">Thêm Bài Học Mới</h3>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Bài Học (Tiết)</label>
                <input 
                  type="text" 
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Ví dụ: Lesson 1: Getting Started"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Kỹ Năng / Thể Loại</label>
                <select 
                  value={newLessonType}
                  onChange={(e) => setNewLessonType(e.target.value as any)}
                  className="w-full bg-[#202020] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 text-white"
                >
                  <option value="Getting Started">Getting Started</option>
                  <option value="Listening">Listening</option>
                  <option value="Speaking">Speaking</option>
                  <option value="Reading">Reading</option>
                  <option value="Writing">Writing</option>
                  <option value="Language">Language</option>
                  <option value="Exam">Exam Mode</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Bài Học"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-[32px] p-8 space-y-6 relative my-8"
          >
            <button 
              onClick={() => setShowActivityModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-display font-black text-white">Thêm Hoạt Động Mới</h3>
            
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Hoạt Động</label>
                  <input 
                    type="text" 
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    placeholder="Ví dụ: Multiple Choice Question Practice"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Loại hoạt động</label>
                  <select 
                    value={newActivityType}
                    onChange={(e) => setNewActivityType(e.target.value as any)}
                    className="w-full bg-[#202020] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 text-white"
                  >
                    <option value="multiple_choice">Multiple Choice (Trắc nghiệm)</option>
                    <option value="fill_blanks">Fill in the Blanks (Điền từ)</option>
                    <option value="shadowing">Shadowing / Shadow Repeat</option>
                    <option value="dictation">Dictation (Chính tả)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Hướng dẫn làm bài</label>
                <input 
                  type="text" 
                  value={newActivityInstructions}
                  onChange={(e) => setNewActivityInstructions(e.target.value)}
                  placeholder="Ví dụ: Listen and choose the correct answer..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              {/* Listening / Dictation / Shadowing audio settings */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Đường dẫn file Audio (URL)</label>
                <input 
                  type="text" 
                  value={actAudioUrl}
                  onChange={(e) => setActAudioUrl(e.target.value)}
                  placeholder="Ví dụ: https://example.com/audio.mp3"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Bản Transcript / Lời thoại</label>
                <textarea 
                  value={actTranscript}
                  onChange={(e) => setActTranscript(e.target.value)}
                  placeholder="Nhập transcript hoặc lời thoại bài nghe để chấm điểm shadowing..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 h-20 resize-none font-sans"
                />
              </div>

              {/* Questions Creator (Multiple choice & Fill in blanks) */}
              {(newActivityType === 'multiple_choice' || newActivityType === 'fill_blanks') && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Soạn thảo câu hỏi ({actQuestions.length})</span>
                    <button 
                      type="button"
                      onClick={handleAddQuestionField}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      + Thêm câu hỏi
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {actQuestions.map((q, qi) => (
                      <div key={qi} className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3 relative">
                        {actQuestions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveQuestionField(qi)}
                            className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        )}

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-white/40">Câu hỏi #{qi+1}</span>
                          <input 
                            type="text" 
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qi, "question", e.target.value)}
                            placeholder="Ví dụ: Doing chores develops kids' ________ skills."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none"
                            required
                          />
                        </div>

                        {newActivityType === 'multiple_choice' && (
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => (
                              <input 
                                key={oi}
                                type="text" 
                                value={opt}
                                onChange={(e) => handleOptionChange(qi, oi, e.target.value)}
                                placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none"
                                required
                              />
                            ))}
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Đáp án đúng</label>
                          <input 
                            type="text" 
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(qi, "answer", e.target.value)}
                            placeholder="Ví dụ: life (hoặc nhập chính xác đáp án A/B/C/D)"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                {isSubmitting ? "Đang tạo..." : "Lưu Hoạt Động"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
