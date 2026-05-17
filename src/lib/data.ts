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
    id: '1',
    title: 'Tâm Lý Học Của Quyền Lực',
    category: 'TÂM LÝ HỌC',
    description: 'Khám phá cách những người ảnh hưởng nhất lịch sử làm chủ các quy tắc ngầm của quyền lực.',
    duration: '12:45',
    plays: '48.2K',
    audioUrl: '/audio/power.mp3',
    coverImage: '/images/power.jpg',
    mood: 'the-void',
    hookLine: 'Sức mạnh thực sự không nằm ở cơ bắp, mà ở sự im lặng.',
    color: 'from-violet-950 to-bg-primary',
    emoji: '👑',
    xp: 250,
    level: 'B2',
    transcript: [
      { id: '1-1', startTime: 0, endTime: 5, text: "Power is not just about control. It's about perception.", translation: "Quyền lực không chỉ là sự kiểm soát. Nó là về nhận thức." },
      { id: '1-2', startTime: 6, endTime: 12, text: "The most powerful person in the room is often the one who speaks the least.", translation: "Người quyền lực nhất trong phòng thường là người nói ít nhất." },
      { id: '1-3', startTime: 13, endTime: 20, text: "They listen. they observe. And they wait for the perfect moment.", translation: "Họ lắng nghe. Họ quan sát. Và họ chờ đợi thời điểm hoàn hảo." },
      { id: '1-4', startTime: 21, endTime: 30, text: "Silence is not empty. It's full of answers.", translation: "Sự im lặng không hề trống rỗng. Nó đầy rẫy những câu trả lời." },
    ],
    challenge: {
      sentence: "The most powerful person in the room is often the one who speaks the least.",
      translation: "Người quyền lực nhất trong phòng thường là người nói ít nhất."
    }
  },
  {
    id: '2',
    title: 'Lời Nói Của Một Ông Trùm Mafia',
    category: 'ĐIỆN ẢNH',
    description: 'Học cách giao tiếp đầy uy lực, sự tôn trọng và nghệ thuật thương lượng từ thế giới ngầm.',
    duration: '18:20',
    plays: '91.7K',
    audioUrl: '/audio/mafia.mp3',
    coverImage: '/images/mafia.jpg',
    mood: 'the-pulse',
    hookLine: 'Trong thế giới ngầm, lời nói chính là khế ước máu.',
    color: 'from-red-950 to-bg-primary',
    emoji: '🌹',
    xp: 350,
    level: 'C1',
    transcript: [
      { id: '2-1', startTime: 0, endTime: 4, text: "In my world, respect is earned, never given.", translation: "Trong thế giới của tôi, sự tôn trọng được gây dựng, không bao giờ được ban phát." },
      { id: '2-2', startTime: 5, endTime: 10, text: "A man who doesn't spend time with his family can never be a real man.", translation: "Một người đàn ông không dành thời gian cho gia đình không bao giờ có thể là một người đàn ông thực thụ." },
      { id: '2-3', startTime: 11, endTime: 18, text: "Keep your friends close, but your enemies closer.", translation: "Hãy giữ bạn bè ở gần, nhưng kẻ thù thì phải gần hơn." },
    ],
    challenge: {
      sentence: "Respect is earned, never given.",
      translation: "Sự tôn trọng được gây dựng, không bao giờ được ban phát."
    }
  },
  {
    id: '3',
    title: 'Kỷ Luật Trên Cả Động Lực',
    category: 'KINH DOANH',
    description: 'Tại sao cảm hứng là nhất thời nhưng thói quen mới là thứ đưa bạn đến thành công.',
    duration: '8:15',
    plays: '63.4K',
    audioUrl: '/audio/discipline.mp3',
    coverImage: '/images/discipline.jpg',
    mood: 'the-calm',
    hookLine: 'Động lực giúp bạn bắt đầu, nhưng kỷ luật mới đưa bạn về đích.',
    color: 'from-amber-950 to-bg-primary',
    emoji: '⚡',
    xp: 200,
    level: 'B1',
    transcript: [
      { id: '3-1', startTime: 0, endTime: 5, text: "Motivation is what gets you started. Discipline is what keeps you going.", translation: "Động lực là thứ giúp bạn bắt đầu. Kỷ luật là thứ giúp bạn tiếp tục." },
    ],
    challenge: {
      sentence: "Motivation is what gets you started. Discipline is what keeps you going.",
      translation: "Động lực là thứ giúp bạn bắt đầu. Kỷ luật là thứ giúp bạn tiếp tục."
    }
  },
  {
    id: '4',
    title: 'Triết Học Về Sự Cô Độc',
    category: 'TRIẾT HỌC',
    description: 'Nietzsche, Camus và nghịch lý hiện đại của việc cô đơn trong một thế giới kết nối.',
    duration: '22:40',
    plays: '37.1K',
    audioUrl: '/audio/solitude.mp3',
    coverImage: '/images/solitude.jpg',
    mood: 'the-void',
    hookLine: 'Cô đơn là cái giá của sự tự do tuyệt đối.',
    color: 'from-blue-950 to-bg-primary',
    emoji: '🦅',
    xp: 450,
    level: 'C2',
    transcript: [],
    challenge: {
      sentence: "Solitude is the price of absolute freedom.",
      translation: "Cô đơn là cái giá của sự tự do tuyệt đối."
    }
  },
  {
    id: '5',
    title: 'Bí Mật Của Những Thiên Tài Sáng Tạo',
    category: 'SÁNG TẠO',
    description: 'Phân tích quy trình làm việc của Da Vinci, Jobs và những bộ óc vĩ đại nhất.',
    duration: '14:30',
    plays: '39K',
    audioUrl: '/audio/creative.mp3',
    coverImage: '/images/creative.jpg',
    mood: 'the-pulse',
    hookLine: 'Sáng tạo chỉ là sự kết nối các điểm lại với nhau.',
    color: 'from-emerald-950 to-bg-primary',
    emoji: '💡',
    xp: 300,
    level: 'B2',
    transcript: [],
    challenge: {
      sentence: "Creativity is just connecting things.",
      translation: "Sáng tạo chỉ là sự kết nối các điểm lại với nhau."
    }
  },
  {
    id: '6',
    title: 'Nghệ Thuật Kể Chuyện Của Kẻ Phản Diện',
    category: 'ĐIỆN ẢNH',
    description: 'Tại sao chúng ta bị thu hút bởi những kẻ phản diện? Phân tích tâm lý và ngôn ngữ.',
    duration: '13:10',
    plays: '52K',
    audioUrl: '/audio/villain.mp3',
    coverImage: '/images/villain.jpg',
    mood: 'the-pulse',
    hookLine: 'Kẻ phản diện là nhân vật chính trong câu chuyện của chính họ.',
    color: 'from-rose-950 to-bg-primary',
    emoji: '🃏',
    xp: 400,
    level: 'C1',
    transcript: [],
    challenge: {
      sentence: "A villain is just a protagonist in their own story.",
      translation: "Kẻ phản diện là nhân vật chính trong câu chuyện của chính họ."
    }
  },
  {
    id: 'power-1',
    title: 'The Architect: Part I - Silence',
    category: 'POWER & INFLUENCE',
    description: 'The first lesson in authority: Control the air in the room by not filling it.',
    duration: '05:20',
    plays: '1.2K',
    audioUrl: '/audio/power-1.mp3',
    coverImage: '/images/architect-1.jpg',
    mood: 'the-void',
    hookLine: 'The loudest person in the room is often the most insecure.',
    color: 'from-indigo-950 to-bg-primary',
    emoji: '🏛️',
    xp: 250,
    level: 'B2',
    metadata: {
      emotionalTone: 'The Void',
      difficulty: 'B2',
      speakingIntensity: 'Medium',
      pacingProfile: 'Slow-Burn',
      bingeChain: 'ArchitectOfPower',
      vocabFocus: ['Strategic Silence', 'Vacuum of Power'],
      viralHooks: [
        { id: 'vh1', text: "Authority is not a shout. It is the vacuum you create.", type: 'quote' },
        { id: 'vh2', text: "Control the air in the room by not filling it.", type: 'moment' }
      ]
    },
    transcript: [
      { id: 'p1-1', startTime: 0, endTime: 5, text: "Listen carefully. [pause] Authority is not a shout.", translation: "Nghe kỹ này. Quyền lực không phải là một tiếng hét." },
      { id: 'p1-2', startTime: 6, endTime: 12, text: "It is the vacuum you create... when you refuse to speak.", translation: "Nó là khoảng trống bạn tạo ra... khi bạn từ chối lên tiếng." },
    ],
    challenge: {
      sentence: "Authority is not a shout. It is the vacuum you create.",
      translation: "Quyền lực không phải là một tiếng hét. Nó là khoảng trống bạn tạo ra."
    }
  },
  {
    id: 'power-2',
    title: 'The Architect: Part II - The Move',
    category: 'POWER & INFLUENCE',
    description: 'Every action must be calculated. Learn to move with quiet precision.',
    duration: '06:15',
    plays: '850',
    audioUrl: '/audio/power-2.mp3',
    coverImage: '/images/architect-2.jpg',
    mood: 'the-pulse',
    hookLine: 'Never let them see your next move. Let them feel it.',
    color: 'from-amber-950 to-bg-primary',
    emoji: '♟️',
    xp: 300,
    level: 'C1',
    metadata: {
      emotionalTone: 'The Pulse',
      difficulty: 'C1',
      speakingIntensity: 'High',
      pacingProfile: 'High-Stakes',
      bingeChain: 'ArchitectOfPower',
      vocabFocus: ['Quiet Precision', 'Calculated Risk'],
      viralHooks: [
        { id: 'vh3', text: "Never let them see your next move. Let them feel it.", type: 'quote' }
      ]
    },
    transcript: [
      { id: 'p2-1', startTime: 0, endTime: 4, text: "Movement is easy. Precision is hard.", translation: "Di chuyển thì dễ. Sự chính xác mới khó." },
      { id: 'p2-2', startTime: 5, endTime: 10, text: "A calculated risk is just... a plan that hasn't finished yet.", translation: "Một rủi ro có tính toán chỉ là... một kế hoạch chưa hoàn thành xong." },
    ],
    challenge: {
      sentence: "Never let them see your next move. Let them feel it.",
      translation: "Đừng bao giờ để họ thấy bước đi tiếp theo của bạn. Hãy để họ cảm nhận nó."
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
