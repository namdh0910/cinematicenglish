export interface Activity {
  id: string;
  title: string;
  type: 'multiple_choice' | 'fill_blanks' | 'shadowing' | 'dictation' | 'matching';
  instructions: string;
  content: any;
  order_index: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Language' | 'Getting Started' | 'Exam';
  activities: Activity[];
  video_url?: string;
  videoUrl?: string;
  unit?: {
    id: string;
    title: string;
    grade?: {
      id: string;
      title: string;
    };
  };
}

export interface SpeakingResult {
  score: number;
  remark: string;
  feedbackText: string;
  wordEvaluations?: Array<{
    word: string;
    status: 'correct' | 'imperfect' | 'missing' | 'filler';
    accuracy: number;
  }>;
}
