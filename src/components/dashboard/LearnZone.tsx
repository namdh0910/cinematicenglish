"use client";
import Link from "next/link";
import { 
  BookOpen, 
  Tv, 
  Clock, 
  Mic, 
  Volume2, 
  FileText,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function LearnZone() {
  return (
    <div className="space-y-10">
      
      {/* ─── CURRICULUM PATHS ─── */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Curriculum Paths (Global Success)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { grade: "Lớp 10", desc: "Global Success Grade 10", units: 10, href: "/learn/grade/10" },
            { grade: "Lớp 11", desc: "Global Success Grade 11", units: 10, href: "/learn/grade/11" },
            { grade: "Lớp 12", desc: "Global Success Grade 12", units: 8, href: "/learn/grade/12" },
          ].map((path, idx) => (
            <Link key={idx} href={path.href}>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all cursor-pointer group">
                <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block">GD&ĐT Curriculum</span>
                <h4 className="text-lg font-display font-black text-white group-hover:text-violet-400 transition-colors mt-2">{path.grade}</h4>
                <p className="text-xs text-white/40 mt-1">{path.desc} • {path.units} Units</p>
                <div className="mt-4 flex items-center justify-end text-[10px] font-mono text-white/30 group-hover:text-white transition-colors">
                  Explore curriculum <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── STORY UNIVERSES & EXAMS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Story Universes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Story Universes</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "The Negotiation Chamber", tag: "Business English", img: "https://api.dicebear.com/7.x/identicon/svg?seed=negotiation" },
              { title: "Midnight Telemetry", tag: "Tech & Science", img: "https://api.dicebear.com/7.x/identicon/svg?seed=telemetry" },
            ].map((story, idx) => (
              <Link key={idx} href="/stories">
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors cursor-pointer group">
                  <div className="h-32 bg-white/5 flex items-center justify-center border-b border-white/5 relative">
                    <img src={story.img} alt={story.title} className="w-16 h-16 opacity-40 group-hover:opacity-80 transition-opacity" />
                    <Badge variant="violet" className="absolute top-3 left-3 text-[8px] py-0 px-2">{story.tag}</Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{story.title}</h4>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-1 block">2 Chapters • 12 Nodes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Labs & Collections */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Immersion Labs</h3>

          <div className="space-y-3">
            {[
              { name: "Listening Lab", sub: "Speed, transcript dictation", icon: Volume2, color: "text-violet-400", href: "/learn" },
              { name: "Speaking Lab", sub: "Pronunciation, shadow repeats", icon: Mic, color: "text-amber-500", href: "/coach" },
              { name: "Exam Collections", sub: "Timed tests, IELTS mocks", icon: Clock, color: "text-cyan-400", href: "/exam/ielts-foundation-test" },
            ].map((lab, idx) => (
              <Link key={idx} href={lab.href}>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex items-center justify-between gap-3 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-white/5 ${lab.color}`}>
                      <lab.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">{lab.name}</h4>
                      <span className="text-[9px] text-white/30 mt-0.5 block">{lab.sub}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
