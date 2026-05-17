"use client";
import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Sparkles, 
  ChevronDown,
  Volume2,
  Settings,
  Info,
  Loader2,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'listen_choose' | 'vocab_match';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

interface QuizBuilderProps {
  transcript?: string;
  onUpdate?: (questions: QuizQuestion[]) => void;
}

const QUESTION_TYPES = [
  { id: 'multiple_choice', label: 'Multiple Choice', icon: CheckCircle2 },
  { id: 'true_false', label: 'True / False', icon: HelpCircle },
  { id: 'fill_blank', label: 'Fill in the Blank', icon: Type },
  { id: 'listen_choose', label: 'Listen & Choose', icon: Volume2 },
  { id: 'vocab_match', label: 'Vocabulary Match', icon: Settings },
];

export default function QuizBuilder({ transcript, onUpdate }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuizQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: "",
      options: type === 'multiple_choice' ? ["Option 1", "Option 2", "Option 3", "Option 4"] : (type === 'true_false' ? ["True", "False"] : []),
      correctAnswer: type === 'true_false' ? 0 : "",
      explanation: "",
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
    setShowTypeDropdown(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const generateWithAI = async () => {
    if (!transcript) {
      alert("Vui lòng nhập Transcript trước khi dùng AI để tạo Quiz!");
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI Generation delay
    setTimeout(() => {
      const aiQuestions: QuizQuestion[] = [
        { 
          id: Math.random().toString(36).substr(2, 9),
          type: 'multiple_choice', 
          question: "What was the main motivation of the protagonist in this scene?", 
          options: ["Revenge", "Family Legacy", "Money", "Survival"], 
          correctAnswer: 1, 
          explanation: "Dựa vào đoạn hội thoại về tổ tiên và di sản gia đình ở phút thứ 2.", 
          points: 10 
        },
        { 
          id: Math.random().toString(36).substr(2, 9),
          type: 'fill_blank', 
          question: "The character says: 'Keep your friends close, but your _______ closer.'", 
          options: [], 
          correctAnswer: "enemies", 
          explanation: "Đây là câu thoại kinh điển trong phim.", 
          points: 10 
        },
      ];
      setQuestions([...questions, ...aiQuestions]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <HelpCircle size={24} className="text-blue-400" /> Bài tập đính kèm ({questions.length})
        </h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button 
            type="button"
            onClick={generateWithAI}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest hover:bg-violet-500/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Tạo bằng AI
          </button>
          
          <div className="relative w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue"
            >
              <Plus size={14} strokeWidth={3} /> Thêm câu hỏi
            </button>
            
            <AnimatePresence>
              {showTypeDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#2a2a2a] border border-white/10 p-2 shadow-2xl z-[150]"
                >
                  {QUESTION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => addQuestion(type.id as QuestionType)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-white/5 text-sm text-white/70 hover:text-white transition-all"
                    >
                      <type.icon size={16} className="text-blue-400" />
                      {type.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <AnimatePresence>
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="group p-8 rounded-[40px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all space-y-8"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="cursor-grab text-white/10 hover:text-white/30 transition-colors">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">#{index + 1}</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                      {q.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="p-2 rounded-xl text-white/10 hover:text-red-400 hover:bg-red-400/5 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Question Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Nội dung câu hỏi</label>
                <input 
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Conditional Options Input */}
              {['multiple_choice', 'true_false', 'listen_choose'].includes(q.type) && (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Các đáp án</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-3 group/opt">
                        <button 
                          type="button"
                          onClick={() => updateQuestion(q.id, { correctAnswer: optIdx })}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            q.correctAnswer === optIdx ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-white/10'
                          }`}
                        >
                          {q.correctAnswer === optIdx && <CheckCircle2 size={14} strokeWidth={3} />}
                        </button>
                        <input 
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...q.options];
                            newOptions[optIdx] = e.target.value;
                            updateQuestion(q.id, { options: newOptions });
                          }}
                          className={`flex-1 bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm transition-all focus:outline-none ${
                            q.correctAnswer === optIdx ? 'border-emerald-500/30' : ''
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fill in the Blank Input */}
              {q.type === 'fill_blank' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Đáp án đúng (Từ)</label>
                  <input 
                    type="text"
                    value={q.correctAnswer as string}
                    onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                    className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl py-4 px-6 text-emerald-400 font-mono text-sm focus:outline-none"
                    placeholder="VD: enemies"
                  />
                </div>
              )}

              {/* Footer Meta: Explanation & Points */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4 flex items-center gap-2">
                    <Info size={12} /> Giải thích
                  </label>
                  <textarea 
                    value={q.explanation}
                    onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-6 text-xs text-white/60 focus:outline-none transition-all resize-none"
                    placeholder="Giải thích lý do đáp án này đúng..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Điểm số</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" size={14} />
                    <input 
                      type="number"
                      value={q.points}
                      onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length === 0 && (
          <div className="py-24 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Sparkles className="text-white/10" size={40} />
            </div>
            <h4 className="text-white/40 font-bold mb-2 uppercase tracking-widest">Chưa có thử thách nào</h4>
            <p className="text-white/20 text-sm max-w-xs mx-auto">
              Sử dụng nút "Add Question" hoặc thử tính năng AI "Generate with AI" để bắt đầu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
