import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  ArrowLeft,
  Sparkles,
  Check,
  TrendingUp
} from 'lucide-react';
import { recordQuizCompletion } from '../services/progress';

interface Question {
  id: number;
  type: 'predict' | 'true_false' | 'multiple_choice';
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'predict',
    category: 'Superposition & Gates',
    question: "If the Hadamard (H) gate is applied to state |0⟩, what is the expected measurement probability distribution?",
    options: [
      "100% |0⟩",
      "100% |1⟩",
      "~50% |0⟩ and ~50% |1⟩",
      "75% |0⟩ and 25% |1⟩"
    ],
    correctIndex: 2,
    explanation: "H|0⟩ creates the equal superposition (|0⟩ + |1⟩)/√2. Measuring yields |0⟩ with probability |1/√2|² = 0.5 (50%) and |1⟩ with probability 0.5 (50%)."
  },
  {
    id: 2,
    type: 'true_false',
    category: 'Quantum Foundations',
    question: "A qubit in superposition is physically 0 and 1 at the exact same moment.",
    options: [
      "True",
      "False"
    ],
    correctIndex: 1,
    explanation: "False! A qubit is in a single, well-defined quantum state with complex probability amplitudes α and β. It is NOT physically in two classical states simultaneously."
  },
  {
    id: 3,
    type: 'predict',
    category: 'Quantum Gates',
    question: "If an X (Pauli-X) gate is applied to a qubit in state |0⟩, what is the resulting state?",
    options: [
      "|0⟩",
      "|1⟩",
      "(|0⟩ + |1⟩)/√2",
      "-|0⟩"
    ],
    correctIndex: 1,
    explanation: "The X gate acts as a quantum bit-flip (NOT gate), rotating the state by π about the X-axis of the Bloch sphere, mapping |0⟩ to |1⟩."
  },
  {
    id: 4,
    type: 'multiple_choice',
    category: 'Probability Amplitudes',
    question: "What is the conservation law relating the probability amplitudes α and β of a normalized single-qubit state |ψ⟩ = α|0⟩ + β|1⟩?",
    options: [
      "α + β = 1",
      "|α|² + |β|² = 1",
      "|α| + |β| = 1",
      "α² + β² = 0"
    ],
    correctIndex: 1,
    explanation: "According to Born's rule, total probability must sum to 1: P(0) + P(1) = |α|² + |β|² = 1."
  },
  {
    id: 5,
    type: 'predict',
    category: 'Entanglement & Circuits',
    question: "What state is prepared by starting with |00⟩, applying H to qubit 0, and then applying CNOT with control qubit 0 and target qubit 1?",
    options: [
      "(|00⟩ + |01⟩)/√2",
      "(|00⟩ + |11⟩)/√2 (Bell State |Φ⁺⟩)",
      "|11⟩",
      "(|01⟩ + |10⟩)/√2"
    ],
    correctIndex: 1,
    explanation: "H on q[0] creates (|0⟩+|1⟩)|0⟩/√2 = (|00⟩+|10⟩)/√2. The CNOT flips q[1] whenever q[0] is 1, producing the maximally entangled Bell state (|00⟩+|11⟩)/√2."
  },
  {
    id: 6,
    type: 'multiple_choice',
    category: 'Bloch Sphere',
    question: "On the Bloch sphere, which quantum states are located at the North and South poles, respectively?",
    options: [
      "|+⟩ and |−⟩",
      "|0⟩ and |1⟩",
      "|i⟩ and |−i⟩",
      "|00⟩ and |11⟩"
    ],
    correctIndex: 1,
    explanation: "By convention, |0⟩ is at the North pole (θ = 0) and |1⟩ is at the South pole (θ = π). Equal superpositions lie along the equator (θ = π/2)."
  },
  {
    id: 7,
    type: 'multiple_choice',
    category: 'Algorithms',
    question: "In the Deutsch-Jozsa algorithm with 2 input qubits, if all input qubits measure |00⟩, what does this prove about the oracle function?",
    options: [
      "The function is guaranteed balanced",
      "The function is guaranteed constant",
      "The oracle failed",
      "Nothing can be deduced without 2 more queries"
    ],
    correctIndex: 1,
    explanation: "In Deutsch-Jozsa, constructive interference concentrates 100% of amplitude on |00⟩ if and only if the function is constant. Any other outcome indicates a balanced function."
  },
  {
    id: 8,
    type: 'true_false',
    category: 'Algorithms',
    question: "Quantum search with Grover's algorithm is 'instant' because it checks all possible inputs in parallel.",
    options: [
      "True",
      "False"
    ],
    correctIndex: 1,
    explanation: "False! Quantum search is an iterative geometric rotation (amplitude amplification) taking O(√N) steps. It gradually amplifies the marked item's probability amplitude."
  },
  {
    id: 9,
    type: 'predict',
    category: 'Relative Phase',
    question: "If a qubit state has amplitudes α = 1/√2 and β = -1/√2, what is the probability of measuring |1⟩?",
    options: [
      "-50%",
      "0%",
      "50% (0.5)",
      "100%"
    ],
    correctIndex: 2,
    explanation: "Probability is the magnitude squared: P(1) = |β|² = |-1/√2|² = 1/2 = 0.5 (50%). The minus sign represents a relative phase of π, which affects interference, not individual probability!"
  },
  {
    id: 10,
    type: 'multiple_choice',
    category: 'Measurement',
    question: "What happens to a qubit in superposition when it is measured in the computational basis?",
    options: [
      "It preserves its superposition forever",
      "It irreversibly collapses into either |0⟩ or |1⟩",
      "It duplicates into two qubits",
      "Its phase rotates by 90 degrees"
    ],
    correctIndex: 1,
    explanation: "Measurement causes wavefunction collapse: the superposition is destroyed, and the qubit irreversibly takes on either classical state |0⟩ or |1⟩."
  }
];

export const Practice: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const q = QUESTIONS[currentIdx];
  const hasAnsweredCurrent = selectedAnswer !== null;

  const handleSelectOption = (idx: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    const newAnswered = answeredCount + 1;
    setAnsweredCount(newAnswered);

    if (newAnswered === QUESTIONS.length) {
      const finalScore = isCorrect ? score + 1 : score;
      recordQuizCompletion(finalScore, QUESTIONS.length);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredCount(0);
    setIsFinished(false);
  };

  const scorePct = Math.round((score / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen quantum-grid-bg text-black-olive">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-gray hover:text-slate-gray transition-colors shadow-neu-raised hover:shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-slate-gray rounded-xl">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black-olive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black-olive tracking-tight">Quantum Practice & Quiz</h1>
                <p className="text-xs text-black-olive/70">Test and reinforce your quantum mechanics and circuit concepts</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-floral-white text-xs font-mono">
              <span className="text-black-olive/70">Score: </span>
              <span className="text-slate-gray font-bold">{score}</span>
              <span className="text-black-olive/70"> / {QUESTIONS.length}</span>
            </div>
          </div>
        </div>

        {/* Quiz Container */}
        {!isFinished ? (
          <div className="space-y-6">
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-black-olive/70">
                <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
                <span>Category: {q.category}</span>
              </div>
              <div className="h-1.5 bg-floral-white rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 shadow-neu-raised hover:shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-slate-gray rounded-xl"
                  style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-floral-white space-y-6" shadow-neu-raised>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-floral-white text-slate-gray">
                  {q.type.replace('_', ' ')}
                </span>
                <h2 className="text-lg md:text-xl font-semibold text-black-olive leading-snug">
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((option, idx) => {
                  let btnStyle = "bg-floral-white  hover: text-black-olive";
                  let icon = null;

                  if (hasAnsweredCurrent) {
                    if (idx === q.correctIndex) {
                      btnStyle = "bg-floral-white  text-slate-gray  ";
                      icon = <CheckCircle2 className="w-4 h-4 text-slate-gray flex-shrink-0" />;
                    } else if (idx === selectedAnswer) {
                      btnStyle = "bg-floral-white  text-slate-gray  ";
                      icon = <XCircle className="w-4 h-4 text-slate-gray flex-shrink-0" />;
                    } else {
                      btnStyle = "bg-floral-white  text-black-olive/70 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnsweredCurrent}
                      className={`w-full p-4 rounded-xl  text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-xl bg-floral-white flex items-center justify-center font-mono text-xs text-black-olive/70">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Box */}
              {hasAnsweredCurrent && (
                <div className={`p-4 rounded-xl  text-xs leading-relaxed space-y-1.5 transition-all ${
                  selectedAnswer === q.correctIndex
                    ? 'bg-floral-white  text-slate-gray'
                    : 'bg-floral-white  text-slate-gray'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {selectedAnswer === q.correctIndex ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-gray" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-slate-gray" />
                        <span>Incorrect — Let's Review:</span>
                      </>
                    )}
                  </div>
                  <p className="text-black-olive">{q.explanation}</p>
                </div>
              )}

              {/* Navigation Button */}
              {hasAnsweredCurrent && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl hover: hover: text-floral-white font-semibold text-xs transition-all flex items-center gap-2 shadow-neu-raised hover:shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-slate-gray"
                  >
                    <span>{currentIdx === QUESTIONS.length - 1 ? 'View Final Results' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* Quiz Results Summary Screen */
          <div className="p-8 rounded-2xl bg-floral-white text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-black-olive">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black-olive">Quiz Completed!</h2>
              <p className="text-sm text-black-olive/70">
                You scored <strong className="text-slate-gray">{score} out of {QUESTIONS.length}</strong> ({scorePct}%).
              </p>
            </div>

            {/* Performance Rating */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-floral-white text-xs text-black-olive" shadow-neu-raised>
              {scorePct >= 80 ? (
                <p>🎉 <strong>Outstanding grasp of quantum concepts!</strong> You are ready to design complex multi-qubit algorithms in the Lab.</p>
              ) : scorePct >= 50 ? (
                <p>👍 <strong>Solid foundation!</strong> Review the Bloch sphere and phase kickback lessons to sharpen your intuition.</p>
              ) : (
                <p>📚 <strong>Great effort!</strong> Revisit the Quantum Basics module to reinforce superposition amplitudes and Born's rule.</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-floral-white hover:bg-floral-white text-black-olive font-semibold text-xs transition-colors flex items-center gap-2 shadow-neu-raised hover:shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-slate-gray"
              >
                <RotateCcw className="w-4 h-4" /> Retake Quiz
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-xl hover: hover: text-floral-white font-semibold text-xs transition-all flex items-center gap-2 shadow-neu-raised hover:shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-slate-gray"
              >
                <TrendingUp className="w-4 h-4" /> View on Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Practice;
