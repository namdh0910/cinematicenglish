"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft,
  ClipboardList,
  Calendar,
  Send,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Classroom {
  id: string;
  name: string;
}

const CLASSROOMS: Classroom[] = [
  { id: "class-10a1", name: "Lớp 10A1 — Global Success" },
  { id: "class-11b2", name: "Lớp 11B2 — Advanced Speaking" },
];

export default function CreateAssignments() {
  const [selectedClass, setSelectedClass] = useState(CLASSROOMS[0].id);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"lesson" | "exam">("lesson");
  const [activity, setActivity] = useState("Unit 1 Lesson 3: Dictation");
  const [dueDate, setDueDate] = useState("2026-05-20");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle("");
    }, 3000);
  };

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <Section container={true} className="space-y-10">
          
          {/* Top navigation path */}
          <div>
            <Link href="/teacher">
              <span className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <ChevronLeft size={14} /> Back to Teacher Command Hub
              </span>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Classroom Coursework</span>
              <h1 className="text-3xl font-display font-black text-white">Assign Task</h1>
              <p className="text-xs text-white/40">Select a class, target lesson/exam, and dispatch instantly to the student feed.</p>
            </div>

            <Card className="p-8 border-white/5 bg-white/[0.01]">
              {success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Task Dispatched Successfully</h3>
                  <p className="text-xs text-white/40 max-w-xs">
                    Students will find the coursework in their personal classroom feeds instantly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Select Class */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Target Classroom</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                    >
                      {CLASSROOMS.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Assignment Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Unit 1 Family Life: Speaking Shadowing"
                      className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                      required
                    />
                  </div>

                  {/* Coursework type selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Task Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="lesson">Immersive Lesson</option>
                        <option value="exam">Exam Sprint</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Target Activity</label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                      >
                        {type === "lesson" ? (
                          <>
                            <option value="U1L1">Unit 1 Lesson 1: Pronunciation</option>
                            <option value="U1L2">Unit 1 Lesson 2: Shadowing</option>
                            <option value="U1L3">Unit 1 Lesson 3: Dictation</option>
                          </>
                        ) : (
                          <>
                            <option value="MTE">Mid-Term Practice Exam</option>
                            <option value="FTE">Final Practice Exam Sprint</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Due date */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Dispatch Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                    >
                      Dispatch Assignment <Send size={14} />
                    </button>
                  </div>

                </form>
              )}
            </Card>
          </div>

        </Section>
      </main>
    </div>
  );
}
