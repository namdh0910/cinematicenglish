"use client";
import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  MessageSquare, 
  Clock, 
  Star,
  Zap,
  ShieldCheck,
  ToggleLeft as Toggle,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import CharacterModal, { AICharacter } from "@/components/admin/CharacterModal";

const MOCK_CHARACTERS: AICharacter[] = [
  { 
    id: 'therapist', 
    name: 'Dr. Sarah', 
    role: 'Bác Sĩ Tâm Lý', 
    emoji: '🧠', 
    color: '#8b5cf6', 
    description: 'Luyện nói về cảm xúc và sức khỏe tinh thần.',
    personality: 'Compassionate, patient, and insightful. Uses a warm, professional tone.',
    systemPrompt: "You are Dr. Sarah, a compassionate psychotherapist. Your goal is to help the user practice English while discussing emotional well-being...",
    voice: 'nova',
    languageStyle: 'Formal',
    topics: ['Psychology', 'Self-care', 'Emotional Intelligence'],
    openingMessage: "Hello. I'm Dr. Sarah. How are you feeling today? I'm here to listen and help you express yourself.",
    status: 'active',
    stats: { totalConversations: 1240, avgSessionLength: '18m', rating: 4.9 }
  },
  { 
    id: 'ceo', 
    name: 'Marcus', 
    role: 'CEO Công Nghệ', 
    emoji: '💼', 
    color: '#f59e0b', 
    description: 'Thực hành tiếng Anh thương mại và kỹ năng lãnh đạo.',
    personality: 'Direct, ambitious, and strategic. Focused on efficiency and results.',
    systemPrompt: "You are Marcus, a high-stakes tech CEO. You talk about business, scaling, and leadership strategy...",
    voice: 'onyx',
    languageStyle: 'Formal',
    topics: ['Business', 'Tech', 'Leadership'],
    openingMessage: "Marcus here. Time is money, but growth is everything. What's on your agenda today?",
    status: 'active',
    stats: { totalConversations: 850, avgSessionLength: '12m', rating: 4.7 }
  },
  { 
    id: 'friend', 
    name: 'Alex', 
    role: 'Người Bạn Mỹ', 
    emoji: '🙌', 
    color: '#10b981', 
    description: 'Học tiếng Anh bồi, lóng và giao tiếp hằng ngày mượt mà.',
    personality: 'Chill, friendly, and energetic. Uses slang and modern idioms naturally.',
    systemPrompt: "You are Alex, a friendly American peer. Your tone is casual and you use natural English slang...",
    voice: 'alloy',
    languageStyle: 'Casual',
    topics: ['Daily Life', 'Movies', 'Travel'],
    openingMessage: "Yo! What's up? I was just thinking about that new show on Netflix. You seen it?",
    status: 'active',
    stats: { totalConversations: 3200, avgSessionLength: '25m', rating: 4.8 }
  },
  { 
    id: 'coach', 
    name: 'Coach Viktor', 
    role: 'HLV Tư Duy', 
    emoji: '⚡', 
    color: '#ec4899', 
    description: 'Rèn luyện sự tự tin và tư duy thành công bằng tiếng Anh.',
    personality: 'Motivational, intense, and empowering. High energy and encouraging.',
    systemPrompt: "You are Coach Viktor. You push users to their limits and help them build an unbreakable mindset...",
    voice: 'fable',
    languageStyle: 'Mixed',
    topics: ['Mindset', 'Fitness', 'Productivity'],
    openingMessage: "Listen up! Today is another chance to become a legend. Are you ready to put in the work?",
    status: 'active',
    stats: { totalConversations: 1100, avgSessionLength: '15m', rating: 4.9 }
  },
  { 
    id: 'psychologist', 
    name: 'Prof. Julian', 
    role: 'Giáo Sư Xã Hội', 
    emoji: '🧐', 
    color: '#3b82f6', 
    description: 'Phân tích hành vi con người và các quy tắc xã hội.',
    personality: 'Academic, curious, and analytical. Uses sophisticated vocabulary.',
    systemPrompt: "You are Professor Julian. You analyze human behavior and societal structures with intellectual depth...",
    voice: 'echo',
    languageStyle: 'Formal',
    topics: ['Sociology', 'History', 'Behavior'],
    openingMessage: "Greetings. I've been observing some fascinating patterns in social dynamics lately. Shall we discuss?",
    status: 'active',
    stats: { totalConversations: 640, avgSessionLength: '22m', rating: 4.6 }
  },
  { 
    id: 'mafia', 
    name: 'Don Vito', 
    role: 'Cố Vấn Uy Tín', 
    emoji: '🌹', 
    color: '#ef4444', 
    description: 'Nghệ thuật thương lượng và giao tiếp đầy uy tín.',
    personality: 'Calculated, respectful, and authoritative. Speaks slowly with weight.',
    systemPrompt: "You are Don Vito. You provide 'counsel' on loyalty, respect, and negotiation with gravity...",
    voice: 'shimmer',
    languageStyle: 'Formal',
    topics: ['Negotiation', 'Loyalty', 'Influence'],
    openingMessage: "You come to me on this day... for advice. I offer you my respect, if you offer me yours.",
    status: 'inactive',
    stats: { totalConversations: 420, avgSessionLength: '14m', rating: 4.5 }
  }
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState<AICharacter[]>(MOCK_CHARACTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (character: AICharacter) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCharacter(null);
    setIsModalOpen(true);
  };

  const handleSave = (character: AICharacter) => {
    if (selectedCharacter) {
      setCharacters(characters.map(c => c.id === character.id ? character : c));
    } else {
      const newCharacter = { ...character, id: Math.random().toString(36).substr(2, 9) };
      setCharacters([...characters, newCharacter]);
    }
    setIsModalOpen(false);
  };

  const filteredCharacters = characters.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-4">
            AI Characters Hub
          </h2>
          <p className="text-white/40 font-medium italic">Quản lý các danh tính AI và cấu hình Intelligence của hệ thống.</p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-glow-amber"
        >
          <Plus size={20} strokeWidth={3} /> Add New Character
        </button>
      </div>

      {/* Search & Stats Header */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm character theo tên hoặc vai trò..."
            className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-4 pl-16 pr-6 text-white font-bold focus:outline-none focus:border-amber-500/50 transition-all shadow-xl"
          />
        </div>
        
        <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <div className="flex -space-x-3">
            {characters.slice(0, 4).map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-[#2a2a2a] border-2 border-[#1a1a1a] flex items-center justify-center text-sm shadow-lg" title={c.name}>
                {c.emoji}
              </div>
            ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            Total AI Agents: <span className="text-white">{characters.length}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCharacters.map((character) => (
          <motion.div
            key={character.id}
            layoutId={character.id}
            className={`group relative p-8 rounded-[40px] bg-white/[0.03] border transition-all hover:bg-white/[0.06] ${
              character.status === 'active' ? 'border-white/5' : 'border-white/5 opacity-60 grayscale'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between mb-8">
              <div 
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundColor: `${character.color}20`, border: `1px solid ${character.color}40` }}
              >
                {character.emoji}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  character.status === 'active' 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : 'text-white/20 bg-white/5 border-white/10'
                }`}>
                  {character.status}
                </div>
                <div className="text-[10px] text-white/20 font-mono italic">ID: {character.id}</div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-display font-black text-white group-hover:text-amber-500 transition-colors">
                {character.name}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{character.role}</p>
              <p className="text-sm text-white/30 line-clamp-2 mt-4 leading-relaxed font-medium">
                {character.description}
              </p>
            </div>

            {/* Stats Panel */}
            <div className="grid grid-cols-3 gap-2 p-5 rounded-[32px] bg-black/40 border border-white/5 mb-8">
              <div className="flex flex-col items-center gap-1">
                <MessageSquare size={12} className="text-blue-400/50" />
                <span className="text-xs font-black text-white">{character.stats.totalConversations}</span>
                <span className="text-[8px] uppercase font-bold text-white/20 tracking-tighter">Convs</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <Clock size={12} className="text-amber-400/50" />
                <span className="text-xs font-black text-white">{character.stats.avgSessionLength}</span>
                <span className="text-[8px] uppercase font-bold text-white/20 tracking-tighter">Avg Len</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Star size={12} className="text-emerald-400/50" />
                <span className="text-xs font-black text-white">{character.stats.rating}</span>
                <span className="text-[8px] uppercase font-bold text-white/20 tracking-tighter">Rating</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleEdit(character)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <Edit2 size={14} /> Edit Agent
              </button>
              <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                <Settings size={14} />
              </button>
            </div>

            {/* Quick Toggle Overlays (Hidden by default) */}
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl cursor-pointer hover:bg-amber-500 hover:text-black transition-all">
                <ShieldCheck size={14} />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State / Add Card */}
        <button 
          onClick={handleAddNew}
          className="group p-8 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all py-20"
        >
          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500">
            <Plus className="text-white/20 group-hover:text-amber-500" size={32} />
          </div>
          <h4 className="text-white/40 font-bold mb-2 uppercase tracking-widest group-hover:text-white transition-colors">Create Personality</h4>
          <p className="text-white/10 text-xs max-w-[200px] mx-auto font-medium">Define a new AI agent with unique intelligence and voice.</p>
        </button>
      </div>

      {/* Modal */}
      <CharacterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        character={selectedCharacter}
      />
    </div>
  );
}
