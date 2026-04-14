import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Trophy, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';

type Question = {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
  options: number[];
};

export default function App() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);

  const generateQuestion = useCallback(() => {
    const isAddition = Math.random() > 0.5;
    let n1, n2, ans;
    const op = isAddition ? '+' : '-';

    if (isAddition) {
      n1 = Math.floor(Math.random() * 90) + 1;
      n2 = Math.floor(Math.random() * (100 - n1)) + 1;
      ans = n1 + n2;
    } else {
      n1 = Math.floor(Math.random() * 99) + 2;
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      ans = n1 - n2;
    }

    // Generate options
    const optionsSet = new Set<number>([ans]);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAns = ans + offset;
      if (wrongAns > 0 && wrongAns <= 100 && wrongAns !== ans) {
        optionsSet.add(wrongAns);
      } else {
        const randomWrong = Math.floor(Math.random() * 100) + 1;
        if (randomWrong !== ans) optionsSet.add(randomWrong);
      }
    }

    setQuestion({
      num1: n1,
      num2: n2,
      operator: op,
      answer: ans,
      options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
    });
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (selected: number) => {
    if (feedback === 'correct') return;

    if (selected === question?.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        generateQuestion();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setFeedback(null);
      }, 500);
    }
  };

  if (!question) return null;

  return (
    <div className={`min-h-screen bg-macaron-blue flex flex-col items-center justify-center p-4 transition-all duration-500 ${shake ? 'animate-shake' : ''}`}>
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full shadow-sm"
      >
        <Trophy className="text-yellow-500 w-6 h-6" />
        <span className="text-2xl font-bold text-gray-700">得分: {score}</span>
      </motion.div>

      {/* Main Question Card */}
      <motion.div
        key={question.num1 + question.operator + question.num2}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white rounded-[60px] shadow-2xl p-10 md:p-20 flex flex-col items-center gap-8 relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-macaron-pink rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-macaron-yellow rounded-full opacity-20 blur-3xl" />

        <div className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-800 tracking-wider flex items-center gap-4">
          <span>{question.num1}</span>
          <span className="text-macaron-pink">{question.operator}</span>
          <span>{question.num2}</span>
          <span className="text-macaron-green">=</span>
          <span className="text-gray-300">?</span>
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-macaron-green/90 flex flex-col items-center justify-center gap-4 z-10"
            >
              <CheckCircle2 className="w-24 h-24 text-white" />
              <span className="text-4xl font-bold text-white">太棒了!</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Options Grid */}
      <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
        {question.options.map((option, idx) => {
          const colors = [
            'bg-macaron-pink hover:bg-pink-300',
            'bg-macaron-orange hover:bg-orange-200',
            'bg-macaron-yellow hover:bg-yellow-200',
            'bg-macaron-purple hover:bg-purple-300'
          ];
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              className={`
                ${colors[idx % colors.length]}
                h-24 rounded-3xl text-4xl font-bold text-gray-700 shadow-lg
                transition-colors duration-200 flex items-center justify-center
                border-b-8 border-black/10 active:border-b-0
              `}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Footer Action */}
      <button 
        onClick={generateQuestion}
        className="mt-12 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <RefreshCcw className="w-5 h-5" />
        <span className="font-medium">换一题</span>
      </button>

      {/* Background Floating Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              rotate: 0 
            }}
            animate={{ 
              y: [null, '-20%', '20%'],
              rotate: 360 
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute"
          >
            <Star className={`w-8 h-8 ${['text-macaron-pink', 'text-macaron-yellow', 'text-macaron-green'][i % 3]}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
