"use client";
import MultipleChoiceNode from "./MultipleChoiceNode";
// import TapWordNode from "./TapWordNode";

interface QuizNodeFactoryProps {
  type: string;
  data: any;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizNodeFactory({ type, data, onAnswer }: QuizNodeFactoryProps) {
  switch (type) {
    case 'multiple_choice':
    case 'prediction':
    case 'emotional':
    case 'vocab':
      return <MultipleChoiceNode data={data} onAnswer={onAnswer} />;
    
    // Future implementations
    // case 'tap_word':
    //   return <TapWordNode data={data} onAnswer={onAnswer} />;
      
    default:
      return (
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
          <p className="text-white/60">Unknown interaction type: {type}</p>
          <button 
            onClick={() => onAnswer(true)}
            className="mt-4 px-6 py-2 bg-white/10 rounded-xl text-sm"
          >
            Skip
          </button>
        </div>
      );
  }
}
