export interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
}

export interface Story {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  audioUrl: string;
  coverImage: string;
  plays: string;
  mood: 'the-void' | 'the-pulse' | 'the-calm';
  hookLine: string;
  color: string;
  emoji: string;
  xp: number;
  level: string;
  transcript: TranscriptLine[];
  challenge: {
    sentence: string;
    translation: string;
  };
  // AI Engine Metadata
  metadata?: {
    emotionalTone: string;
    difficulty: string;
    speakingIntensity: 'Low' | 'Medium' | 'High';
    pacingProfile: 'Slow-Burn' | 'High-Stakes' | 'Ethereal' | 'Conversational';
    bingeChain?: string;
    vocabFocus: string[];
    viralHooks?: Array<{
      id: string;
      text: string;
      type: 'quote' | 'clip' | 'moment';
      startTime?: number;
    }>;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  icon: string;
  isCompleted: boolean;
}

export interface Memory {
  id: string;
  type: 'quote' | 'breakthrough' | 'milestone' | 'reflection' | 'voice';
  title: string;
  content: string;
  date: string;
  mood: 'the-void' | 'the-pulse' | 'the-calm';
  audioUrl?: string;
  identityStage: string;
  tags?: string[];
  reflectionPrompt?: string;
}

export interface EmotionalProfile {
  dominantMood: 'the-void' | 'the-pulse' | 'the-calm';
  traits: {
    reflective: number; // 0.0 - 1.0
    ambitious: number;
    vulnerable: number;
    confident: number;
  };
  preferredCategories: string[];
  recentTags: string[];
  pacingPreference: 'slow' | 'normal' | 'fast';
}

export interface UserProgress {
  streak: number;
  streakActive: boolean;
  xp: number;
  level: number;
  identity: string;
  nextIdentity: string;
  auraColor: string;
  missions: Mission[];
  memories: Memory[];
  emotionalProfile: EmotionalProfile;
}

export const STORIES: Story[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'The Godfather (Bố Già)',
    category: 'ĐIỆN ẢNH KINH ĐIỂN',
    description: 'Học cách giao tiếp đầy uy lực, sự tôn trọng và nghệ thuật thương lượng đẳng cấp từ thế giới ngầm.',
    duration: '12:45',
    plays: '148.2K',
    audioUrl: '/audio/godfather.mp3',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    mood: 'the-void',
    hookLine: "I'm going to make him an offer he can't refuse.",
    color: 'from-zinc-950 to-bg-primary',
    emoji: '🌹',
    xp: 250,
    level: 'B2',
    transcript: [
      { id: 'g1-1', startTime: 0, endTime: 5, text: "I'm going to make him an offer he can't refuse.", translation: "Tôi sẽ đưa ra một lời đề nghị mà hắn không thể từ chối." },
      { id: 'g1-2', startTime: 6, endTime: 12, text: "Keep your friends close, but your enemies closer.", translation: "Hãy giữ bạn bè ở gần, nhưng kẻ thù thì phải gần hơn." },
      { id: 'g1-3', startTime: 13, endTime: 22, text: "A man who doesn't spend time with his family can never be a real man.", translation: "Một người đàn ông không dành thời gian cho gia đình không bao giờ có thể là đàn ông thực thụ." },
    ],
    challenge: {
      sentence: "I'm going to make him an offer he can't refuse.",
      translation: "Tôi sẽ đưa ra một lời đề nghị mà hắn không thể từ chối."
    }
  },
  {
    id: '2ba75a92-2822-45fe-9040-1cf71ef4e522',
    title: 'Gladiator (Võ Sĩ Giác Đấu)',
    category: 'HÀNH ĐỘNG / KỊCH TÍNH',
    description: 'Cảm nhận tinh thần quả cảm, ý chí sắt đá và khả năng truyền cảm hứng trước đám đông của Maximus.',
    duration: '15:10',
    plays: '112.5K',
    audioUrl: '/audio/gladiator.mp3',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    mood: 'the-pulse',
    hookLine: "What we do in life echoes in eternity.",
    color: 'from-amber-950 to-bg-primary',
    emoji: '⚔️',
    xp: 350,
    level: 'B2',
    transcript: [
      { id: 'gl-1', startTime: 0, endTime: 6, text: "What we do in life echoes in eternity.", translation: "Những gì chúng ta làm trong cuộc sống sẽ vang vọng đến thiên thu." },
      { id: 'gl-2', startTime: 7, endTime: 14, text: "My name is Maximus Decimus Meridius, commander of the Armies of the North.", translation: "Ta là Maximus Decimus Meridius, tư lệnh các đoàn quân phương Bắc." },
      { id: 'gl-3', startTime: 15, endTime: 25, text: "Father to a murdered son, husband to a murdered wife. And I will have my vengeance.", translation: "Cha của đứa con bị sát hại, chồng của người vợ bị thảm sát. Và ta sẽ báo thù." }
    ],
    challenge: {
      sentence: "What we do in life echoes in eternity.",
      translation: "Những gì chúng ta làm trong cuộc sống sẽ vang vọng đến thiên thu."
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    title: 'The Dark Knight (Kỵ Sĩ Bóng Đêm)',
    category: 'ĐIỆN ẢNH HIỆN ĐẠI',
    description: 'Luyện nói tiếng Anh tông giọng trầm ấm, nội lực và học cách kiểm soát nhịp điệu cực đỉnh từ Batman & Joker.',
    duration: '18:20',
    plays: '91.7K',
    audioUrl: '/audio/darkknight.mp3',
    coverImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800',
    mood: 'the-void',
    hookLine: "Why so serious?",
    color: 'from-violet-950 to-bg-primary',
    emoji: '🃏',
    xp: 350,
    level: 'C1',
    transcript: [
      { id: 'dk-1', startTime: 0, endTime: 4, text: "Why so serious? Let's put a smile on that face!", translation: "Sao phải nghiêm túc thế? Hãy nở một nụ cười nào!" },
      { id: 'dk-2', startTime: 5, endTime: 11, text: "It's not who I am underneath, but what I do that defines me.", translation: "Dưới lớp mặt nạ tôi là ai không quan trọng, hành động của tôi mới định nghĩa tôi." },
      { id: 'dk-3', startTime: 12, endTime: 20, text: "You either die a hero, or you live long enough to see yourself become the villain.", translation: "Hoặc là ngươi hy sinh như anh hùng, hoặc sống đủ lâu để thấy mình trở thành kẻ phản diện." },
    ],
    challenge: {
      sentence: "Why so serious?",
      translation: "Sao phải nghiêm túc thế?"
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    title: 'Titanic (Thảm Họa Titanic)',
    category: 'TÌNH CẢM LÃNG MẠN',
    description: 'Học cách bộc lộ cảm xúc mãnh liệt, lời thoại ngọt ngào và nhịp điệu kể chuyện tự nhiên qua câu chuyện tình Jack & Rose.',
    duration: '08:15',
    plays: '63.4K',
    audioUrl: '/audio/titanic.mp3',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    mood: 'the-calm',
    hookLine: "I'm the king of the world!",
    color: 'from-blue-950 to-bg-primary',
    emoji: '🚢',
    xp: 200,
    level: 'B1',
    transcript: [
      { id: 't-1', startTime: 0, endTime: 5, text: "I'm the king of the world!", translation: "Tôi là vua của thế giới này!" },
      { id: 't-2', startTime: 6, endTime: 12, text: "Winning that ticket, Rose, was the best thing that ever happened to me.", translation: "Rose à, thắng được tấm vé đó là điều tuyệt vời nhất từng xảy đến với anh." },
      { id: 't-3', startTime: 13, endTime: 20, text: "Promise me you'll survive. That you won't give up, no matter what happens.", translation: "Hứa với anh là em sẽ sống sót. Em sẽ không bỏ cuộc, dù bất cứ điều gì xảy ra." }
    ],
    challenge: {
      sentence: "I'm the king of the world!",
      translation: "Tôi là vua của thế giới này!"
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    title: 'Forrest Gump (Cuộc Đời Forrest Gump)',
    category: 'CẢM HỨNG CUỘC SỐNG',
    description: 'Học phát âm rõ ràng, nhịp điệu chậm rãi nhưng đầy cảm xúc và triết lý sống quý giá từ Forrest Gump.',
    duration: '22:40',
    plays: '37.1K',
    audioUrl: '/audio/forrest.mp3',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    mood: 'the-calm',
    hookLine: "Life is like a box of chocolates.",
    color: 'from-amber-900 to-bg-primary',
    emoji: '🏃',
    xp: 450,
    level: 'B1',
    transcript: [
      { id: 'f-1', startTime: 0, endTime: 5, text: "Life is like a box of chocolates. You never know what you're gonna get.", translation: "Cuộc đời giống như một hộp sô-cô-la. Con không bao giờ biết trước mình sẽ nhận được gì." },
      { id: 'f-2', startTime: 6, endTime: 12, text: "My mama always said, you've got to put the past behind you before you can move on.", translation: "Mẹ con luôn bảo, con phải bỏ lại quá khứ phía sau trước khi có thể vững bước đi tiếp." }
    ],
    challenge: {
      sentence: "Life was like a box of chocolates. You never know what you're gonna get.",
      translation: "Cuộc đời giống như một hộp sô-cô-la. Con không bao giờ biết trước mình sẽ nhận được gì."
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    title: 'The Lion King (Vua Sư Tử)',
    category: 'GIA ĐÌNH / PHIÊU LƯU',
    description: 'Học tiếng Anh qua các lời thoại sâu sắc về tinh thần trách nhiệm, sự trưởng thành và quy luật tự nhiên.',
    duration: '14:30',
    plays: '39K',
    audioUrl: '/audio/lionking.mp3',
    coverImage: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800',
    mood: 'the-pulse',
    hookLine: "Remember who you are.",
    color: 'from-emerald-950 to-bg-primary',
    emoji: '🦁',
    xp: 300,
    level: 'B2',
    transcript: [
      { id: 'lk-1', startTime: 0, endTime: 6, text: "Remember who you are. You are my son, and the one true king.", translation: "Hãy nhớ con là ai. Con là con trai ta, và là vị vua chân chính duy nhất." },
      { id: 'lk-2', startTime: 7, endTime: 15, text: "The past can hurt. But the way I see it, you can either run from it, or learn from it.", translation: "Quá khứ có thể gây đau đớn. Nhưng theo ta, con có thể chọn chạy trốn hoặc học hỏi từ nó." }
    ],
    challenge: {
      sentence: "Remember who you are.",
      translation: "Hãy nhớ con là ai."
    }
  }
];

export const AI_CHARACTERS = [
  { id: 'therapist', name: 'Dr. Sarah', role: 'Bác Sĩ Tâm Lý', emoji: '🧠', color: '#8b5cf6', description: 'Luyện nói về cảm xúc và sức khỏe tinh thần.' },
  { id: 'ceo', name: 'Marcus', role: 'CEO Công Nghệ', emoji: '💼', color: '#f59e0b', description: 'Thực hành tiếng Anh thương mại và kỹ năng lãnh đạo.' },
  { id: 'friend', name: 'Alex', role: 'Người Bạn Mỹ', emoji: '🙌', color: '#10b981', description: 'Học tiếng Anh bồi, lóng và giao tiếp hằng ngày mượt mà.' },
  { id: 'coach', name: 'Coach Viktor', role: 'HLV Tư Duy', emoji: '⚡', color: '#ec4899', description: 'Rèn luyện sự tự tin và tư duy thành công bằng tiếng Anh.' },
  { id: 'psychologist', name: 'Prof. Julian', role: 'Giáo Sư Xã Hội', emoji: '🧐', color: '#3b82f6', description: 'Phân tích hành vi con người và các quy tắc xã hội.' },
  { id: 'mafia', name: 'Don Vito', role: 'Cố Vấn Uy Tín', emoji: '🌹', color: '#ef4444', description: 'Nghệ thuật thương lượng và giao tiếp đầy uy tín.' },
];

export const TESTIMONIALS = [
  { name: 'Hoàng Nam', role: 'Software Engineer', country: 'Vietnam', avatar: 'HN', text: 'Ứng dụng này thay đổi hoàn toàn cách tôi học. Nó không giống như đang học, mà giống như đang xem phim vậy.' },
  { name: 'Minh Thư', role: 'Marketing Manager', country: 'Vietnam', avatar: 'MT', text: 'Tôi đã thử mọi ứng dụng. Cinematic English là ứng dụng DUY NHẤT thực sự mang lại cảm xúc cho tôi. Phát âm của tôi cải thiện rõ rệt chỉ sau 3 tuần.' },
  { name: 'Quốc Bảo', role: 'Student', country: 'Vietnam', avatar: 'QB', text: 'Các câu chuyện rất dễ gây nghiện. Tôi đã thức đến 3 giờ sáng để học. Lần đầu tiên tôi thấy hứng thú với tiếng Anh đến vậy.' },
];

export const PRICING = [
  { name: 'Miễn phí', price: '0đ', period: 'mãi mãi', description: 'Bắt đầu hành trình điện ảnh của bạn', features: ['5 câu chuyện mỗi tháng', 'Chat AI cơ bản', 'Truy cập cộng đồng', 'Theo dõi chuỗi streak', 'Lưu 10 từ vựng/ngày'], highlight: false, cta: 'Bắt đầu ngay' },
  { name: 'Hội viên Pro', price: '199k', period: 'tháng', description: 'Trải nghiệm điện ảnh trọn vẹn', features: ['Không giới hạn câu chuyện', 'Huấn luyện viên phát âm AI', 'Toàn bộ 6 nhân vật AI', 'Phân tích phát âm chuyên sâu', 'Tải xuống học offline', 'Hỗ trợ ưu tiên', 'Truyện premium độc quyền'], highlight: true, badge: 'Phổ biến nhất', cta: 'Nâng cấp Pro' },
  { name: 'Gói Nhóm', price: '599k', period: 'tháng', description: 'Cho nhóm bạn & tổ chức', features: ['Mọi tính năng của Pro', 'Tối đa 10 người dùng', 'Bảng điều khiển quản lý', 'Phân tích tiến độ nhóm', 'Nhân vật AI tùy chỉnh', 'Hỗ trợ chuyên biệt', 'Truy cập API'], highlight: false, cta: 'Liên hệ đội ngũ' },
];

export const IDENTITY_STAGES = [
  "Silent Observer",
  "Seeker",
  "Speaker",
  "Storywalker",
  "Protagonist",
  "Director",
  "Voice Architect"
];




export const FEED_ITEMS = [
  {
    id: 'f1',
    type: 'quote',
    category: 'TRÍ TUỆ',
    content: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.",
    author: "John Milton",
    color: "from-violet-900 to-black"
  },
  {
    id: 'f2',
    type: 'phrase',
    category: 'QUYỀN LỰC',
    content: "Strategic Silence",
    meaning: "Sự im lặng chiến lược để làm chủ không gian.",
    example: "He used strategic silence to make the other side nervous.",
    color: "from-amber-900 to-black"
  },
  {
    id: 'f3',
    type: 'word',
    category: 'CẢM XÚC',
    content: "Ethereal",
    phonetic: "/iˈθɪə.ri.əl/",
    meaning: "Thanh tao, nhẹ nhàng như không thuộc về thế giới này.",
    example: "Her voice had an ethereal quality that calmed the room.",
    color: "from-emerald-900 to-black"
  }
];
