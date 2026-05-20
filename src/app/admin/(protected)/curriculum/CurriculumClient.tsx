"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  Plus, 
  Layers, 
  GraduationCap,
  Sparkles,
  ArrowRight,
  X,
  Trash2,
  Loader2,
  HelpCircle,
  Volume2,
  Mic,
  ClipboardList
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  createGrade, 
  createUnitNew, 
  createLesson, 
  deleteLesson,
  getUnits,
  getLessons
} from "@/app/admin/actions";

interface Grade {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface Unit {
  id: string;
  grade_id: string;
  title: string;
  unit_no: string;
  description: string;
  cover_image?: string;
}

interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  type: string;
  order_index: number;
  description?: string;
  content?: any;
}

interface CurriculumClientProps {
  initialGrades: Grade[];
}

export default function CurriculumClient({ initialGrades }: CurriculumClientProps) {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(
    initialGrades.length > 0 ? initialGrades[0].id : null
  );

  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // Modals / add states
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeTitle, setGradeTitle] = useState("");
  const [gradeDesc, setGradeDesc] = useState("");
  const [gradeOrder, setGradeOrder] = useState(1);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitNo, setUnitNo] = useState("");
  const [unitTitle, setUnitTitle] = useState("");
  const [unitDesc, setUnitDesc] = useState("");
  const [isSubmittingUnit, setIsSubmittingUnit] = useState(false);

  // Lesson Form states
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"Speaking" | "Dictation" | "Quiz">("Speaking");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonDesc, setLessonDesc] = useState("");
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Dynamic lesson content states
  // Speaking: dialogue array
  const [dialogues, setDialogues] = useState<Array<{ speaker: string; text: string; translation: string }>>([
    { speaker: "", text: "", translation: "" }
  ]);
  // Dictation: audio & text & blanks
  const [dictationAudioUrl, setDictationAudioUrl] = useState("");
  const [dictationPassage, setDictationPassage] = useState("");
  const [dictationBlanks, setDictationBlanks] = useState("");
  // Quiz: question & options & correct option index
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState(0);

  // Load units when grade changes
  useEffect(() => {
    if (selectedGradeId) {
      setIsLoadingUnits(true);
      setSelectedUnitId(null);
      setLessons([]);
      
      getUnits(selectedGradeId)
        .then((data) => {
          setUnits(data);
          if (data.length > 0) {
            setSelectedUnitId(data[0].id);
          }
        })
        .catch((err) => console.error("Error loading units:", err))
        .finally(() => setIsLoadingUnits(false));
    } else {
      setUnits([]);
      setSelectedUnitId(null);
      setLessons([]);
    }
  }, [selectedGradeId]);

  // Load lessons when unit changes
  useEffect(() => {
    if (selectedUnitId) {
      setIsLoadingLessons(true);
      getLessons(selectedUnitId)
        .then((data) => {
          setLessons(data);
          setLessonOrder(data.length + 1);
        })
        .catch((err) => console.error("Error loading lessons:", err))
        .finally(() => setIsLoadingLessons(false));
    } else {
      setLessons([]);
      setLessonOrder(1);
    }
  }, [selectedUnitId]);

  // Handle Grade Submit
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeTitle) return;
    setIsSubmittingGrade(true);
    try {
      const newGrade = await createGrade({
        title: gradeTitle,
        description: gradeDesc,
        order_index: Number(gradeOrder)
      });
      if (newGrade) {
        setGrades([...grades, newGrade].sort((a, b) => a.order_index - b.order_index));
        setSelectedGradeId(newGrade.id);
      }
      setGradeTitle("");
      setGradeDesc("");
      setShowGradeModal(false);
    } catch (err) {
      console.error(err);
      alert("Error adding grade");
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  // Handle Unit Submit
  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitTitle || !selectedGradeId) return;
    setIsSubmittingUnit(true);
    try {
      const newUnit = await createUnitNew({
        grade_id: selectedGradeId,
        unit_no: unitNo || `Unit ${units.length + 1}`,
        title: unitTitle,
        description: unitDesc
      });
      if (newUnit) {
        setUnits([...units, newUnit]);
        setSelectedUnitId(newUnit.id);
      }
      setUnitNo("");
      setUnitTitle("");
      setUnitDesc("");
      setShowUnitModal(false);
    } catch (err) {
      console.error(err);
      alert("Error adding unit");
    } finally {
      setIsSubmittingUnit(false);
    }
  };

  // Dialogue array helper controls
  const addDialogueRow = () => {
    setDialogues([...dialogues, { speaker: "", text: "", translation: "" }]);
  };
  const removeDialogueRow = (index: number) => {
    if (dialogues.length === 1) return;
    setDialogues(dialogues.filter((_, idx) => idx !== index));
  };
  const handleDialogueChange = (index: number, field: "speaker" | "text" | "translation", value: string) => {
    const updated = [...dialogues];
    updated[index][field] = value;
    setDialogues(updated);
  };

  // Quiz options changes
  const handleQuizOptionChange = (idx: number, val: string) => {
    const updated = [...quizOptions];
    updated[idx] = val;
    setQuizOptions(updated);
  };

  // Lesson Save Submit
  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !selectedUnitId) return;
    setIsSavingLesson(true);

    try {
      // Structure JSON content based on lesson type
      let contentJson: any = {};
      if (lessonType === "Speaking") {
        // Save both dialogues & sentences array for complete backward/forward compatibility
        contentJson = {
          dialogs: dialogues.map(d => ({ speaker: d.speaker, text: d.text, translation: d.translation })),
          sentences: dialogues.map(d => ({ speaker: d.speaker, text: d.text, translation: d.translation })),
          dialogues: dialogues.map(d => ({ speaker: d.speaker, text: d.text, translation: d.translation }))
        };
      } else if (lessonType === "Dictation") {
        contentJson = {
          audioUrl: dictationAudioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          text: dictationPassage,
          blanks: dictationBlanks.split(",").map(b => b.trim()).filter(b => b.length > 0)
        };
      } else if (lessonType === "Quiz") {
        contentJson = {
          question: quizQuestion,
          options: quizOptions,
          correctAnswer: Number(quizCorrectAnswer)
        };
      }

      const newLesson = await createLesson({
        unit_id: selectedUnitId,
        title: lessonTitle,
        type: lessonType,
        order_index: Number(lessonOrder),
        description: lessonDesc,
        content: contentJson
      });

      if (newLesson) {
        // Refresh lessons list
        const updated = await getLessons(selectedUnitId);
        setLessons(updated);
        setLessonOrder(updated.length + 1);
        
        // Reset Lesson fields
        setLessonTitle("");
        setLessonDesc("");
        setDialogues([{ speaker: "", text: "", translation: "" }]);
        setDictationAudioUrl("");
        setDictationPassage("");
        setDictationBlanks("");
        setQuizQuestion("");
        setQuizOptions(["", "", "", ""]);
        setQuizCorrectAnswer(0);

        alert("Thêm bài tập mới thành công! 🎉");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding lesson");
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bài tập này?")) return;
    if (!selectedUnitId) return;
    try {
      await deleteLesson(lessonId, selectedUnitId);
      const updated = await getLessons(selectedUnitId);
      setLessons(updated);
      setLessonOrder(updated.length + 1);
    } catch (err) {
      console.error(err);
      alert("Error deleting lesson");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[700px] relative z-10">
      
      {/* =========================================================================
          COLUMN 1: GRADES PANEL (Khối Lớp)
          ========================================================================= */}
      <div className="w-full lg:w-[25%] bg-[#121212] border border-white/5 rounded-[32px] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight text-white flex items-center gap-2">
              <GraduationCap className="text-amber-500" size={20} />
              Khối Lớp (Grades)
            </h3>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">
              {grades.length} Lớp
            </span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
            {grades.map((grade) => {
              const isSelected = selectedGradeId === grade.id;
              return (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGradeId(grade.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500/50 text-white shadow-lg"
                      : "bg-[#181818]/60 border-white/5 hover:border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-mono text-white/20 group-hover:text-amber-500/40">#{grade.order_index}</span>
                    <span className="font-bold text-sm truncate">{grade.title}</span>
                    <span className="text-[10px] text-white/30 truncate mt-0.5">{grade.description}</span>
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform duration-300 ${
                      isSelected ? "translate-x-1 text-amber-500" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setGradeOrder(grades.length + 1);
            setShowGradeModal(true);
          }}
          className="mt-6 w-full py-4 border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-amber-500 bg-white/2 hover:bg-amber-500/[0.02] transition-all text-xs font-black uppercase tracking-wider"
        >
          <Plus size={16} /> Thêm Khối Lớp mới
        </button>
      </div>

      {/* =========================================================================
          COLUMN 2: UNITS PANEL (Bài Học)
          ========================================================================= */}
      <div className="w-full lg:w-[30%] bg-[#121212] border border-white/5 rounded-[32px] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight text-white flex items-center gap-2">
              <BookOpen className="text-violet-500" size={20} />
              Bài Học (Units)
            </h3>
            <span className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold">
              {units.length} Units
            </span>
          </div>

          {!selectedGradeId ? (
            <div className="py-20 text-center text-white/20 text-xs italic font-medium">
              Vui lòng chọn Khối Lớp trước.
            </div>
          ) : isLoadingUnits ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-violet-500" size={24} />
              <span className="text-xs text-white/20 italic font-medium">Đang tải danh sách Unit...</span>
            </div>
          ) : units.length === 0 ? (
            <div className="py-20 text-center text-white/20 text-xs italic font-medium">
              Khối lớp này chưa có Unit nào.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              {units.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-violet-500/10 border-violet-500/50 text-white shadow-lg"
                        : "bg-[#181818]/60 border-white/5 hover:border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black text-violet-500 uppercase tracking-wider">{unit.unit_no}</span>
                      <span className="font-bold text-sm truncate mt-0.5">{unit.title}</span>
                      <span className="text-[10px] text-white/30 truncate mt-0.5">{unit.description}</span>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform duration-300 ${
                        isSelected ? "translate-x-1 text-violet-400" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedGradeId && (
          <button
            onClick={() => {
              setUnitNo(`Unit ${units.length + 1}`);
              setShowUnitModal(true);
            }}
            className="mt-6 w-full py-4 border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-violet-400 bg-white/2 hover:bg-violet-500/[0.02] transition-all text-xs font-black uppercase tracking-wider"
          >
            <Plus size={16} /> Thêm Unit mới
          </button>
        )}
      </div>

      {/* =========================================================================
          COLUMN 3: LESSONS & CREATION FORM PANEL (Bài Tập)
          ========================================================================= */}
      <div className="w-full lg:w-[45%] bg-[#121212] border border-white/5 rounded-[32px] p-6 flex flex-col space-y-6">
        
        {/* Current Lessons View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight text-white flex items-center gap-2">
              <ClipboardList className="text-blue-500" size={20} />
              Bài Tập (Lessons)
            </h3>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
              {lessons.length} Bài tập
            </span>
          </div>

          {!selectedUnitId ? (
            <div className="py-12 text-center text-white/20 text-xs italic font-medium border border-white/5 rounded-2xl bg-[#181818]/20">
              Vui lòng chọn Unit trước để quản lý bài tập.
            </div>
          ) : isLoadingLessons ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 border border-white/5 rounded-2xl bg-[#181818]/20">
              <Loader2 className="animate-spin text-blue-500" size={20} />
              <span className="text-xs text-white/20 italic font-medium">Đang tải danh sách bài tập...</span>
            </div>
          ) : lessons.length === 0 ? (
            <div className="py-12 text-center text-white/20 text-xs italic font-medium border border-white/5 rounded-2xl bg-[#181818]/20">
              Unit này chưa có bài tập nào. Hãy thêm bài mới bên dưới!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3.5 bg-[#181818]/80 border border-white/5 rounded-2xl flex items-center justify-between gap-3 group"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        lesson.type.toLowerCase() === "speaking" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        lesson.type.toLowerCase() === "dictation" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {lesson.type}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">#{lesson.order_index}</span>
                    </div>
                    <span className="font-bold text-xs text-white truncate mt-1">{lesson.title}</span>
                    <span className="text-[9px] text-white/30 truncate">{lesson.description}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa bài tập"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lesson Creator Form */}
        {selectedUnitId && (
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white/50">Thêm Bài Tập Mới</h4>
            </div>

            <form onSubmit={handleLessonSubmit} className="space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              
              {/* Row 1: Title and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Tiêu đề bài tập</label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Ví dụ: Luyện Phát Âm Bài 1"
                    className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Loại bài tập (Type)</label>
                  <select
                    value={lessonType}
                    onChange={(e) => setLessonType(e.target.value as any)}
                    className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white cursor-pointer"
                  >
                    <option value="Speaking">🗣️ Luyện Phát Âm (Speaking)</option>
                    <option value="Dictation">🎧 Nghe Điền Từ (Dictation)</option>
                    <option value="Quiz">📝 Thi Trắc Nghiệm (Quiz)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Description and Order */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Mô tả bài học</label>
                  <input
                    type="text"
                    value={lessonDesc}
                    onChange={(e) => setLessonDesc(e.target.value)}
                    placeholder="Tóm tắt ngắn mục tiêu bài tập..."
                    className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white"
                    required
                  />
                </div>
              </div>

              {/* DYNAMIC CONTENT INPUTS */}
              <div className="p-4 bg-[#161616] border border-white/5 rounded-2xl space-y-4">
                
                {/* 1. SPEAKING FORM */}
                {lessonType === "Speaking" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Mic size={12} /> Cấu hình đoạn hội thoại speaking
                      </span>
                      <button
                        type="button"
                        onClick={addDialogueRow}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1"
                      >
                        <Plus size={10} /> Thêm dòng
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {dialogues.map((row, idx) => (
                        <div key={idx} className="p-3 bg-[#1e1e1e] border border-white/5 rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => removeDialogueRow(idx)}
                            disabled={dialogues.length === 1}
                            className="absolute top-2 right-2 text-white/20 hover:text-red-400 disabled:opacity-30 disabled:hover:text-white/20"
                          >
                            <X size={14} />
                          </button>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold uppercase tracking-wider text-white/30">Nhân vật</label>
                              <input
                                type="text"
                                value={row.speaker}
                                onChange={(e) => handleDialogueChange(idx, "speaker", e.target.value)}
                                placeholder="Ví dụ: Nam"
                                className="w-full bg-[#121212] border border-white/5 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-amber-500/50 text-white"
                                required
                              />
                            </div>
                            <div className="col-span-2 space-y-0.5">
                              <label className="text-[8px] font-bold uppercase tracking-wider text-white/30">Câu thoại (Tiếng Anh)</label>
                              <input
                                type="text"
                                value={row.text}
                                onChange={(e) => handleDialogueChange(idx, "text", e.target.value)}
                                placeholder="Ví dụ: How are you doing today?"
                                className="w-full bg-[#121212] border border-white/5 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-amber-500/50 text-white"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[8px] font-bold uppercase tracking-wider text-white/30">Câu dịch (Tiếng Việt)</label>
                            <input
                              type="text"
                              value={row.translation}
                              onChange={(e) => handleDialogueChange(idx, "translation", e.target.value)}
                              placeholder="Ví dụ: Hôm nay bạn thế nào?"
                              className="w-full bg-[#121212] border border-white/5 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-amber-500/50 text-white"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. DICTATION FORM */}
                {lessonType === "Dictation" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                      <Volume2 size={12} /> Cấu hình nghe điền từ dictation
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Đường dẫn Audio (URL)</label>
                      <input
                        type="url"
                        value={dictationAudioUrl}
                        onChange={(e) => setDictationAudioUrl(e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                        className="w-full bg-[#121212] border border-white/5 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-500/50 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Đoạn văn chứa chỗ trống [...]</label>
                      <textarea
                        value={dictationPassage}
                        onChange={(e) => setDictationPassage(e.target.value)}
                        placeholder="Ví dụ: I love learning [...] because it is extremely [...] for my future."
                        className="w-full bg-[#121212] border border-white/5 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-500/50 text-white h-20 resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Từ điền chính xác (cách nhau bằng dấu phẩy)</label>
                      <input
                        type="text"
                        value={dictationBlanks}
                        onChange={(e) => setDictationBlanks(e.target.value)}
                        placeholder="Ví dụ: English, useful"
                        className="w-full bg-[#121212] border border-white/5 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-500/50 text-white"
                        required
                      />
                      <span className="text-[8px] text-white/20 italic block">Các từ này khớp theo thứ tự các ký hiệu [...] trong đoạn văn.</span>
                    </div>
                  </div>
                )}

                {/* 3. QUIZ FORM */}
                {lessonType === "Quiz" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <HelpCircle size={12} /> Cấu hình câu hỏi trắc nghiệm
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Câu hỏi (Question)</label>
                      <textarea
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                        placeholder="Nhập câu hỏi tại đây..."
                        className="w-full bg-[#121212] border border-white/5 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500/50 text-white h-16 resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">4 Đáp án lựa chọn</label>
                      <div className="grid grid-cols-2 gap-2">
                        {quizOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="space-y-0.5">
                            <span className="text-[8px] font-bold uppercase text-white/30">Đáp án {String.fromCharCode(65 + oIdx)}</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleQuizOptionChange(oIdx, e.target.value)}
                              placeholder={`Lựa chọn ${String.fromCharCode(65 + oIdx)}`}
                              className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500/50 text-white"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Đáp án đúng</label>
                      <select
                        value={quizCorrectAnswer}
                        onChange={(e) => setQuizCorrectAnswer(Number(e.target.value))}
                        className="w-full bg-[#121212] border border-white/5 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500/50 text-white cursor-pointer"
                      >
                        <option value={0}>Đáp án A</option>
                        <option value={1}>Đáp án B</option>
                        <option value={2}>Đáp án C</option>
                        <option value={3}>Đáp án D</option>
                      </select>
                    </div>
                  </div>
                )}

              </div>

              {/* Form submit CTA */}
              <button
                type="submit"
                disabled={isSavingLesson}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs transition-transform flex items-center justify-center gap-2"
              >
                {isSavingLesson ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Đang lưu bài học...
                  </>
                ) : (
                  <>Lưu bài học</>
                )}
              </button>

            </form>
          </div>
        )}

      </div>

      {/* =========================================================================
          MODALS AREA
          ========================================================================= */}
      {/* 1. GRADE MODAL */}
      {showGradeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 space-y-6 relative text-white"
          >
            <button 
              onClick={() => setShowGradeModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-black text-white">Thêm Khối Lớp Mới</h3>
              <p className="text-xs text-white/40">Định nghĩa khối lớp học bám sát sách Global Success</p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Khối Lớp</label>
                <input 
                  type="text" 
                  value={gradeTitle}
                  onChange={(e) => setGradeTitle(e.target.value)}
                  placeholder="Ví dụ: Grade 10 - Global Success"
                  className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 text-white"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mô Tả Chương Trình</label>
                <textarea 
                  value={gradeDesc}
                  onChange={(e) => setGradeDesc(e.target.value)}
                  placeholder="Ví dụ: Chương trình Tiếng Anh lớp 10 học kỳ 1 và 2 bám sát sách giáo khoa mới nhất"
                  className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 h-24 resize-none text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                <input 
                  type="number" 
                  value={gradeOrder}
                  onChange={(e) => setGradeOrder(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 text-white"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmittingGrade}
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingGrade ? <Loader2 className="animate-spin" size={16} /> : "Tạo Khối Lớp"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. UNIT MODAL */}
      {showUnitModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 space-y-6 relative text-white"
          >
            <button 
              onClick={() => setShowUnitModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-black text-white">Thêm Unit Mới</h3>
              <p className="text-xs text-white/40">Định nghĩa bài học/chương trình học bám sát sách Global Success</p>
            </div>

            <form onSubmit={handleUnitSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mã Unit (No)</label>
                  <input 
                    type="text" 
                    value={unitNo}
                    onChange={(e) => setUnitNo(e.target.value)}
                    placeholder="Ví dụ: Unit 1"
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white"
                    required
                  />
                </div>
                
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tên Unit (Tiêu đề)</label>
                  <input 
                    type="text" 
                    value={unitTitle}
                    onChange={(e) => setUnitTitle(e.target.value)}
                    placeholder="Ví dụ: Family Life"
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mô Tả Unit</label>
                <textarea 
                  value={unitDesc}
                  onChange={(e) => setUnitDesc(e.target.value)}
                  placeholder="Ví dụ: Đời sống gia đình và trách nhiệm của thành viên."
                  className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 h-24 resize-none text-white"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmittingUnit}
                className="w-full py-4 rounded-2xl bg-violet-500 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingUnit ? <Loader2 className="animate-spin" size={16} /> : "Tạo Unit mới"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
