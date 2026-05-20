"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
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
  ClipboardList,
  Folder,
  FolderOpen,
  FileText
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
  
  // Main data states
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [unitsMap, setUnitsMap] = useState<Record<string, Unit[]>>({});
  const [lessonsMap, setLessonsMap] = useState<Record<string, Lesson[]>>({});
  
  // Expanded tree nodes
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  
  // On-demand loading indicators
  const [loadingUnits, setLoadingUnits] = useState<Record<string, boolean>>({});
  const [loadingLessons, setLoadingLessons] = useState<Record<string, boolean>>({});

  // Active contextual IDs for Modal triggers
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Modals visibility
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  // Form states - Grade
  const [gradeTitle, setGradeTitle] = useState("");
  const [gradeDesc, setGradeDesc] = useState("");
  const [gradeOrder, setGradeOrder] = useState(1);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  // Form states - Unit
  const [unitNo, setUnitNo] = useState("");
  const [unitTitle, setUnitTitle] = useState("");
  const [unitDesc, setUnitDesc] = useState("");
  const [isSubmittingUnit, setIsSubmittingUnit] = useState(false);

  // Form states - Lesson
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"Speaking" | "Dictation" | "Quiz">("Speaking");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonDesc, setLessonDesc] = useState("");
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Dynamic lesson content states
  // Speaking: list of dialogues
  const [dialogues, setDialogues] = useState<Array<{ speaker: string; text: string; translation: string }>>([
    { speaker: "", text: "", translation: "" }
  ]);
  // Dictation: audio & text (blanks are auto-extracted from text)
  const [dictationAudioUrl, setDictationAudioUrl] = useState("");
  const [dictationPassage, setDictationPassage] = useState("");

  // Quiz: list of questions, options, and correctAnswer
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);
  };

  const removeQuizQuestion = (index: number) => {
    if (quizQuestions.length === 1) return;
    setQuizQuestions(quizQuestions.filter((_, idx) => idx !== index));
  };

  const handleQuizQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...quizQuestions];
    if (field === "question") {
      updated[index].question = value;
    } else if (field === "correctAnswer") {
      updated[index].correctAnswer = Number(value);
    }
    setQuizQuestions(updated);
  };

  const handleQuizOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[oIndex] = value;
    setQuizQuestions(updated);
  };

  const optionLetters = ["A", "B", "C", "D"];

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success"
  });

  // Display toast helper
  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Toggle Grade Expansion
  const toggleGrade = async (gradeId: string) => {
    const isExpanded = !expandedGrades[gradeId];
    setExpandedGrades(prev => ({ ...prev, [gradeId]: isExpanded }));

    if (isExpanded && !unitsMap[gradeId]) {
      setLoadingUnits(prev => ({ ...prev, [gradeId]: true }));
      try {
        const data = await getUnits(gradeId);
        setUnitsMap(prev => ({ ...prev, [gradeId]: data }));
      } catch (err) {
        console.error("Error loading units:", err);
        triggerToast("Lỗi khi tải danh sách Unit", "error");
      } finally {
        setLoadingUnits(prev => ({ ...prev, [gradeId]: false }));
      }
    }
  };

  // Toggle Unit Expansion
  const toggleUnit = async (unitId: string) => {
    const isExpanded = !expandedUnits[unitId];
    setExpandedUnits(prev => ({ ...prev, [unitId]: isExpanded }));

    if (isExpanded && !lessonsMap[unitId]) {
      setLoadingLessons(prev => ({ ...prev, [unitId]: true }));
      try {
        const data = await getLessons(unitId);
        setLessonsMap(prev => ({ ...prev, [unitId]: data }));
      } catch (err) {
        console.error("Error loading lessons:", err);
        triggerToast("Lỗi khi tải danh sách bài tập", "error");
      } finally {
        setLoadingLessons(prev => ({ ...prev, [unitId]: false }));
      }
    }
  };

  // Reload Units for a Grade
  const reloadUnits = async (gradeId: string) => {
    try {
      const data = await getUnits(gradeId);
      setUnitsMap(prev => ({ ...prev, [gradeId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  // Reload Lessons for a Unit
  const reloadLessons = async (unitId: string) => {
    try {
      const data = await getLessons(unitId);
      setLessonsMap(prev => ({ ...prev, [unitId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

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
        triggerToast("Đã tạo khối lớp mới thành công! 🎓");
      }
      setGradeTitle("");
      setGradeDesc("");
      setShowGradeModal(false);
    } catch (err) {
      console.error(err);
      triggerToast("Lỗi khi thêm khối lớp mới", "error");
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
        unit_no: unitNo || `Unit ${ (unitsMap[selectedGradeId] || []).length + 1 }`,
        title: unitTitle,
        description: unitDesc
      });
      if (newUnit) {
        await reloadUnits(selectedGradeId);
        // Auto expand grade
        setExpandedGrades(prev => ({ ...prev, [selectedGradeId]: true }));
        triggerToast("Đã tạo Unit mới thành công! 📖");
      }
      setUnitNo("");
      setUnitTitle("");
      setUnitDesc("");
      setShowUnitModal(false);
    } catch (err) {
      console.error(err);
      triggerToast("Lỗi khi thêm Unit mới", "error");
    } finally {
      setIsSubmittingUnit(false);
    }
  };

  // Speaking form handlers
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

  // Lesson Save Submit
  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !selectedUnitId) return;
    setIsSavingLesson(true);

    try {
      // Package dynamic JSON content depending on the active lesson type
      let contentJson: any = {};
      
      if (lessonType === "Speaking") {
        contentJson = {
          dialogs: dialogues.map(d => ({ speaker: d.speaker.trim(), text: d.text.trim(), translation: d.translation.trim() })),
          sentences: dialogues.map(d => ({ speaker: d.speaker.trim(), text: d.text.trim(), translation: d.translation.trim() })),
          dialogues: dialogues.map(d => ({ speaker: d.speaker.trim(), text: d.text.trim(), translation: d.translation.trim() }))
        };
      } else if (lessonType === "Dictation") {
        // Automatically extract bracketed words [...]
        const bracketMatches = dictationPassage.match(/\[(.*?)\]/g) || [];
        const extractedBlanks = bracketMatches.map(m => m.slice(1, -1).trim()).filter(b => b.length > 0);

        contentJson = {
          audioUrl: dictationAudioUrl.trim() || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          text: dictationPassage.trim(),
          blanks: extractedBlanks
        };
      } else if (lessonType === "Quiz") {
        contentJson = {
          questions: quizQuestions.map(q => ({
            question: q.question.trim(),
            options: q.options.map(opt => opt.trim()),
            correctAnswer: q.correctAnswer
          }))
        };
      }

      const newLesson = await createLesson({
        unit_id: selectedUnitId,
        title: lessonTitle.trim(),
        type: lessonType,
        order_index: Number(lessonOrder),
        description: lessonDesc.trim(),
        content: contentJson
      });

      if (newLesson) {
        await reloadLessons(selectedUnitId);
        // Auto expand unit
        setExpandedUnits(prev => ({ ...prev, [selectedUnitId]: true }));
        
        // Reset Lesson fields
        setLessonTitle("");
        setLessonDesc("");
        setDialogues([{ speaker: "", text: "", translation: "" }]);
        setDictationAudioUrl("");
        setDictationPassage("");
        setQuizQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
        setShowLessonModal(false);

        triggerToast("Đã tạo bài học thành công!");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Lỗi khi lưu bài tập", "error");
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string, unitId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bài tập này?")) return;
    try {
      await deleteLesson(lessonId, unitId);
      await reloadLessons(unitId);
      triggerToast("Đã xóa bài tập thành công!");
    } catch (err) {
      console.error(err);
      triggerToast("Lỗi khi xóa bài tập", "error");
    }
  };

  return (
    <div className="space-y-6 relative z-10 pb-20">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[1100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-semibold tracking-wide ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-400 animate-pulse" : "bg-red-400"} shrink-0`} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curriculum Command Center Tree View */}
      <div className="bg-[#121212] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-black tracking-tight text-white flex items-center gap-2.5">
              <GraduationCap className="text-amber-500" size={24} />
              Sơ Đồ Giáo Trình
            </h3>
            <p className="text-xs text-white/40 font-medium">Bản đồ cấu trúc và biên soạn học liệu thuộc chương trình học Global Success.</p>
          </div>
          
          <button
            onClick={() => {
              setGradeOrder(grades.length + 1);
              setShowGradeModal(true);
            }}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider text-[11px] shadow-[0_4px_0_rgba(217,119,6,0.3)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} strokeWidth={3} /> Thêm Khối Lớp mới
          </button>
        </div>

        {/* Tree Body */}
        <div className="space-y-4">
          {grades.length === 0 ? (
            <div className="py-20 text-center text-white/20 text-sm italic font-medium">
              Chưa có khối lớp học nào trong hệ thống. Vui lòng thêm khối lớp mới!
            </div>
          ) : (
            grades.map((grade) => {
              const isGradeExpanded = !!expandedGrades[grade.id];
              const gradeUnitsList = unitsMap[grade.id] || [];
              const isUnitsLoading = !!loadingUnits[grade.id];

              return (
                <div 
                  key={grade.id} 
                  className={`border rounded-3xl transition-all duration-300 ${
                    isGradeExpanded ? "bg-[#181818]/40 border-white/10" : "bg-[#181818]/15 border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* GRADE NODE HEADER */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <button
                      onClick={() => toggleGrade(grade.id)}
                      className="flex-1 flex items-center gap-3 text-left focus:outline-none group min-w-0"
                    >
                      <div className={`p-2 rounded-xl transition-all ${
                        isGradeExpanded ? "bg-amber-500/10 text-amber-500" : "bg-white/5 text-white/40 group-hover:text-white"
                      }`}>
                        {isGradeExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white/20">#{grade.order_index}</span>
                          <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {grade.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 truncate max-w-xl mt-0.5">{grade.description}</p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedGradeId(grade.id);
                          setUnitNo(`Unit ${gradeUnitsList.length + 1}`);
                          setShowUnitModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all uppercase tracking-wider flex items-center gap-1 shrink-0"
                        title="Thêm Unit mới vào khối này"
                      >
                        <Plus size={10} strokeWidth={3} /> Thêm Unit
                      </button>

                      <button
                        onClick={() => toggleGrade(grade.id)}
                        className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all shrink-0"
                      >
                        {isGradeExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* UNITS LIST (GRADE INNER CONTENT) */}
                  {isGradeExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-white/5">
                      {isUnitsLoading ? (
                        <div className="py-8 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="animate-spin text-amber-500" size={20} />
                          <span className="text-[10px] text-white/30 italic">Đang tải danh sách Unit...</span>
                        </div>
                      ) : gradeUnitsList.length === 0 ? (
                        <div className="py-6 text-center text-white/20 text-xs italic font-medium">
                          Khối lớp này chưa có Unit nào.
                        </div>
                      ) : (
                        <div className="space-y-3.5 pl-2 border-l border-white/5 mt-2 ml-4">
                          {gradeUnitsList.map((unit) => {
                            const isUnitExpanded = !!expandedUnits[unit.id];
                            const unitLessonsList = lessonsMap[unit.id] || [];
                            const isLessonsLoading = !!loadingLessons[unit.id];

                            return (
                              <div 
                                key={unit.id}
                                className={`border rounded-2xl transition-all duration-300 ${
                                  isUnitExpanded ? "bg-[#1d1d1d]/60 border-white/10" : "bg-[#181818]/40 border-white/5 hover:border-white/10"
                                }`}
                              >
                                {/* UNIT NODE HEADER */}
                                <div className="p-3.5 flex items-center justify-between gap-3">
                                  <button
                                    onClick={() => toggleUnit(unit.id)}
                                    className="flex-1 flex items-center gap-3 text-left focus:outline-none group min-w-0"
                                  >
                                    <div className={`p-1.5 rounded-lg transition-all ${
                                      isUnitExpanded ? "bg-violet-500/10 text-violet-400" : "bg-white/5 text-white/40 group-hover:text-white"
                                    }`}>
                                      <BookOpen size={15} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-violet-400 tracking-wider font-mono">
                                          {unit.unit_no}
                                        </span>
                                        <span className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors truncate">
                                          {unit.title}
                                        </span>
                                      </div>
                                      <p className="text-[9px] text-white/30 truncate mt-0.5">{unit.description}</p>
                                    </div>
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedUnitId(unit.id);
                                        setLessonOrder(unitLessonsList.length + 1);
                                        setLessonTitle("");
                                        setLessonDesc("");
                                        setDialogues([{ speaker: "", text: "", translation: "" }]);
                                        setDictationAudioUrl("");
                                        setDictationPassage("");
                                        setQuizQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
                                        setShowLessonModal(true);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-[9px] font-black text-violet-400 transition-all uppercase tracking-wider flex items-center gap-1 shrink-0"
                                    >
                                      <Plus size={10} strokeWidth={3} /> Thêm Bài Tập
                                    </button>

                                    <button
                                      onClick={() => toggleUnit(unit.id)}
                                      className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all shrink-0"
                                    >
                                      {isUnitExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </button>
                                  </div>
                                </div>

                                {/* LESSONS LIST (UNIT INNER CONTENT) */}
                                {isUnitExpanded && (
                                  <div className="px-4 pb-4 pt-1 border-t border-white/5">
                                    {isLessonsLoading ? (
                                      <div className="py-6 flex flex-col items-center justify-center gap-1.5">
                                        <Loader2 className="animate-spin text-violet-500" size={16} />
                                        <span className="text-[9px] text-white/30 italic">Đang tải danh sách bài tập...</span>
                                      </div>
                                    ) : unitLessonsList.length === 0 ? (
                                      <div className="py-4 text-center text-white/20 text-[10px] italic font-medium">
                                        Unit này chưa có bài tập nào. Hãy nhấn Thêm Bài Tập!
                                      </div>
                                    ) : (
                                      <div className="space-y-2 pl-2 border-l border-white/5 mt-1.5 ml-3">
                                        {unitLessonsList.map((lesson) => (
                                          <div
                                            key={lesson.id}
                                            className="p-2.5 bg-[#151515] border border-white/5 rounded-xl flex items-center justify-between gap-3 group/lesson"
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <FileText size={13} className="text-white/20 shrink-0" />
                                              <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${
                                                    lesson.type.toLowerCase() === "speaking" 
                                                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                                                      : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                  }`}>
                                                    {lesson.type}
                                                  </span>
                                                  <span className="text-[9px] font-mono text-white/20">#{lesson.order_index}</span>
                                                  <span className="text-xs font-semibold text-white/80 truncate">
                                                    {lesson.title}
                                                  </span>
                                                </div>
                                                {lesson.description && (
                                                  <p className="text-[9px] text-white/30 truncate mt-0.5">{lesson.description}</p>
                                                )}
                                              </div>
                                            </div>

                                            <button
                                              onClick={() => handleDeleteLesson(lesson.id, unit.id)}
                                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 opacity-0 group-hover/lesson:opacity-100 transition-opacity shrink-0"
                                              title="Xóa bài tập này"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
          MODALS ZONE
          ========================================================================= */}
      
      {/* 1. GRADE MODAL */}
      <AnimatePresence>
        {showGradeModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 space-y-6 relative text-white shadow-2xl"
            >
              <button 
                onClick={() => setShowGradeModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <GraduationCap className="text-amber-500" size={22} />
                  Thêm Khối Lớp Mới
                </h3>
                <p className="text-[11px] text-white/40 font-medium">Khởi tạo cấp học/khối lớp học mới bám sát sách Global Success</p>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Tên Khối Lớp</label>
                  <input 
                    type="text" 
                    value={gradeTitle}
                    onChange={(e) => setGradeTitle(e.target.value)}
                    placeholder="Ví dụ: Grade 10 - Global Success"
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 text-white transition-all font-semibold"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Mô Tả Chương Trình</label>
                  <textarea 
                    value={gradeDesc}
                    onChange={(e) => setGradeDesc(e.target.value)}
                    placeholder="Ví dụ: Chương trình Tiếng Anh học kỳ bám sát cải cách mới."
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 h-20 resize-none text-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                  <input 
                    type="number" 
                    value={gradeOrder}
                    onChange={(e) => setGradeOrder(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 text-white font-mono"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingGrade}
                  className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs shadow-[0_4px_0_rgba(217,119,6,0.3)] active:translate-y-[2px] active:shadow-none hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingGrade ? <Loader2 className="animate-spin" size={16} /> : "Tạo Khối Lớp"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. UNIT MODAL */}
      <AnimatePresence>
        {showUnitModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 space-y-6 relative text-white shadow-2xl"
            >
              <button 
                onClick={() => setShowUnitModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <BookOpen className="text-violet-500" size={22} />
                  Thêm Unit Mới
                </h3>
                <p className="text-[11px] text-white/40 font-medium">Khởi tạo bài học lớn (Unit) mới chứa trong khối lớp</p>
              </div>

              <form onSubmit={handleUnitSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Mã (No)</label>
                    <input 
                      type="text" 
                      value={unitNo}
                      onChange={(e) => setUnitNo(e.target.value)}
                      placeholder="VD: Unit 1"
                      className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white font-mono font-semibold"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Tiêu đề</label>
                    <input 
                      type="text" 
                      value={unitTitle}
                      onChange={(e) => setUnitTitle(e.target.value)}
                      placeholder="Ví dụ: Family Life"
                      className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Mô Tả Unit</label>
                  <textarea 
                    value={unitDesc}
                    onChange={(e) => setUnitDesc(e.target.value)}
                    placeholder="Ví dụ: Đời sống và nghĩa vụ gia đình..."
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 h-20 resize-none text-white"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingUnit}
                  className="w-full py-4 rounded-2xl bg-violet-500 text-white font-black uppercase tracking-widest text-xs shadow-[0_4px_0_rgba(109,40,217,0.3)] active:translate-y-[2px] active:shadow-none hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingUnit ? <Loader2 className="animate-spin" size={16} /> : "Tạo Unit mới"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DYNAMIC LESSON BUILDER MODAL */}
      <AnimatePresence>
        {showLessonModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-[32px] p-6 sm:p-8 space-y-6 relative text-white shadow-2xl max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setShowLessonModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-1 shrink-0">
                <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <ClipboardList className="text-blue-500" size={22} />
                  Bộ Đúc Bài Tập Thông Minh
                </h3>
                <p className="text-[11px] text-white/40 font-medium">Thiết lập bài học và nội dung đa phương tiện thông minh động.</p>
              </div>

              <form onSubmit={handleLessonSubmit} className="space-y-5 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                
                {/* Basic Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Tiêu đề bài tập</label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="Ví dụ: Luyện Phát Âm Unit 1"
                      className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Loại bài tập</label>
                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value as any)}
                      className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white font-semibold cursor-pointer"
                    >
                      <option value="Speaking">🗣️ Luyện Nói (Speaking)</option>
                      <option value="Dictation">🎧 Nghe Điền Từ (Dictation)</option>
                      <option value="Quiz">📝 Trắc Nghiệm (Quiz)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Mô tả bài tập</label>
                    <input
                      type="text"
                      value={lessonDesc}
                      onChange={(e) => setLessonDesc(e.target.value)}
                      placeholder="Ví dụ: Đoạn đối thoại mẫu giữa Phong và Nam..."
                      className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      value={lessonOrder}
                      onChange={(e) => setLessonOrder(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 text-white font-mono"
                      required
                    />
                  </div>
                </div>

                {/* DYNAMIC FORMS SECTION */}
                <div className="p-4 sm:p-5 bg-[#161616] border border-white/5 rounded-2xl space-y-4">
                  
                  {/* 1. DYNAMIC SPEAKING FORM */}
                  {lessonType === "Speaking" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Mic size={12} /> Cấu hình đoạn hội thoại speaking
                        </span>
                        <button
                          type="button"
                          onClick={addDialogueRow}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                        >
                          <Plus size={10} strokeWidth={3} /> Thêm câu thoại
                        </button>
                      </div>

                      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {dialogues.map((row, idx) => (
                          <div key={idx} className="p-3.5 bg-[#1e1e1e] border border-white/5 hover:border-white/10 rounded-xl space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => removeDialogueRow(idx)}
                              disabled={dialogues.length === 1}
                              className="absolute top-3 right-3 text-white/20 hover:text-red-400 disabled:opacity-30 transition-colors"
                              title="Xóa câu thoại"
                            >
                              <X size={15} />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-bold uppercase tracking-wider text-white/40">Nhân vật</label>
                                <input
                                  type="text"
                                  value={row.speaker}
                                  onChange={(e) => handleDialogueChange(idx, "speaker", e.target.value)}
                                  placeholder="Ví dụ: Phong"
                                  className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500/50 text-white font-semibold"
                                  required
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-0.5">
                                <label className="text-[8px] font-bold uppercase tracking-wider text-white/40">Câu thoại (Tiếng Anh)</label>
                                <input
                                  type="text"
                                  value={row.text}
                                  onChange={(e) => handleDialogueChange(idx, "text", e.target.value)}
                                  placeholder="Ví dụ: I love studying English, Phong."
                                  className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500/50 text-white"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold uppercase tracking-wider text-white/40">Dịch nghĩa (Tiếng Việt)</label>
                              <input
                                type="text"
                                value={row.translation}
                                onChange={(e) => handleDialogueChange(idx, "translation", e.target.value)}
                                placeholder="Ví dụ: Mình rất thích học tiếng Anh, Phong ạ."
                                className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500/50 text-white"
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. DYNAMIC DICTATION FORM */}
                  {lessonType === "Dictation" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-purple-400 uppercase tracking-widest border-b border-white/5 pb-2">
                        <Volume2 size={13} /> Cấu hình nghe điền từ dictation
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Đường dẫn Audio (URL)</label>
                        <input
                          type="url"
                          value={dictationAudioUrl}
                          onChange={(e) => setDictationAudioUrl(e.target.value)}
                          placeholder="https://example.com/audio/unit1-lesson.mp3"
                          className="w-full bg-[#121212] border border-white/5 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500/50 text-white font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Nội dung đoạn văn</label>
                        <textarea
                          value={dictationPassage}
                          onChange={(e) => setDictationPassage(e.target.value)}
                          placeholder="Ví dụ: I love [playing] football with my friends because it is extremely [fun]."
                          className="w-full bg-[#121212] border border-white/5 rounded-xl p-3.5 text-xs focus:outline-none focus:border-purple-500/50 text-white h-28 resize-none leading-relaxed font-semibold"
                          required
                        />
                        
                        <div className="p-3.5 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10px] text-purple-300 leading-relaxed font-medium space-y-1">
                          <span className="font-bold text-purple-400 block">💡 Hướng dẫn định dạng ô điền từ:</span>
                          Sử dụng cặp dấu ngoặc vuông <code className="bg-purple-950 px-1 py-0.5 rounded text-purple-200">[word]</code> bọc quanh từ cần ẩn đi để đúc thành ô trống cho học sinh nhập liệu.
                          <br />
                          VD: <code className="bg-purple-950 px-1 py-0.5 rounded text-purple-200">I love [playing] football.</code> sẽ tạo ô trống hiển thị và tự động trích xuất đáp án là <code className="bg-purple-950 px-1 py-0.5 rounded text-purple-200">playing</code>.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. DYNAMIC QUIZ FORM */}
                  {lessonType === "Quiz" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                          <HelpCircle size={13} /> Cấu hình câu hỏi trắc nghiệm
                        </span>
                        <button
                          type="button"
                          onClick={addQuizQuestion}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                        >
                          <Plus size={10} strokeWidth={3} /> Thêm câu hỏi
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {quizQuestions.map((q, qIdx) => (
                          <div key={qIdx} className="p-4 bg-[#1e1e1e] border border-white/5 hover:border-white/10 rounded-xl space-y-3 relative">
                            {quizQuestions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeQuizQuestion(qIdx)}
                                className="absolute top-3 right-3 text-white/20 hover:text-red-400 transition-colors"
                                title="Xóa câu hỏi"
                              >
                                <X size={15} />
                              </button>
                            )}

                            <div className="text-[10px] font-bold text-white/60">Câu hỏi #{qIdx + 1}</div>

                            <div className="space-y-1">
                              <label className="text-[8px] font-bold uppercase tracking-wider text-white/40">Nội dung câu hỏi</label>
                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuizQuestionChange(qIdx, "question", e.target.value)}
                                placeholder="Ví dụ: What is the capital of France?"
                                className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500/50 text-white font-semibold"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="space-y-1">
                                  <label className="text-[8px] font-bold uppercase tracking-wider text-white/40">Đáp án {optionLetters[oIdx]}</label>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleQuizOptionChange(qIdx, oIdx, e.target.value)}
                                    placeholder={`Nhập đáp án ${optionLetters[oIdx]}...`}
                                    className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500/50 text-white"
                                    required
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="space-y-1">
                              <label className="text-[8px] font-bold uppercase tracking-wider text-white/40">Đáp án đúng</label>
                              <select
                                value={q.correctAnswer}
                                onChange={(e) => handleQuizQuestionChange(qIdx, "correctAnswer", e.target.value)}
                                className="w-full bg-[#121212] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500/50 text-white cursor-pointer font-bold"
                              >
                                {optionLetters.map((letter, oIdx) => (
                                  <option key={oIdx} value={oIdx}>
                                    Đáp án {letter}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Form submit CTA */}
                <div className="pt-2 shrink-0">
                  <button
                    type="submit"
                    disabled={isSavingLesson}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs shadow-[0_4px_0_rgba(37,99,235,0.3)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isSavingLesson ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Đang lưu bài tập...
                      </>
                    ) : (
                      <>Tạo bài học mới</>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
