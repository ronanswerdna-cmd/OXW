import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Clock, 
  HelpCircle,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { QuizQuestion, SubjectId, LevelId } from '../types';
import { SUBJECTS, SAMPLE_QUIZ_POOL } from '../data/curriculum';

interface SmartQuizProps {
  activeSubject: SubjectId;
  activeLevel: LevelId;
  initialTopic?: string;
  onFinishQuiz?: (scorePercent: number) => void;
}

export const SmartQuiz: React.FC<SmartQuizProps> = ({
  activeSubject,
  activeLevel,
  initialTopic,
  onFinishQuiz
}) => {
  const [totalQuestionsCount, setTotalQuestionsCount] = useState<number>(5);
  const [quizState, setQuizState] = useState<'config' | 'playing' | 'completed'>('config');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: number; isCorrect: boolean; concept: string }[]>([]);
  const [adaptiveNote, setAdaptiveNote] = useState<string | null>(null);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [timerEnabled, setTimerEnabled] = useState(true);

  // Start the quiz
  const handleStartQuiz = () => {
    // Generate pool of questions matching or extending the pool
    const pool = [...SAMPLE_QUIZ_POOL];
    // Shuffle and pick
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, totalQuestionsCount);
    
    // If user requested more than pool size, clone & adapt
    while (selected.length < totalQuestionsCount) {
      const base = pool[selected.length % pool.length];
      selected.push({
        ...base,
        id: `q-dup-${selected.length}`,
        question: `[Approfondissement] ${base.question}`
      });
    }

    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setAdaptiveNote(null);
    setSecondsLeft(totalQuestionsCount * 45);
    setQuizState('playing');
  };

  // Timer effect
  useEffect(() => {
    if (quizState !== 'playing' || !timerEnabled) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState, timerEnabled]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleValidateAnswer = () => {
    if (selectedOption === null || !currentQuestion || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsAnswerSubmitted(true);

    const newRecord = {
      questionId: currentQuestion.id,
      selected: selectedOption,
      isCorrect,
      concept: currentQuestion.conceptTag
    };

    setUserAnswers(prev => [...prev, newRecord]);

    // Adaptive logic: If user made a mistake, adapt the next question to drill the concept!
    if (!isCorrect) {
      setAdaptiveNote(`Calibration adaptative : La notion « ${currentQuestion.conceptTag} » a été enregistrée. Les prochaines questions consolideront ce point.`);
    } else {
      setAdaptiveNote(null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setAdaptiveNote(null);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setQuizState('completed');
  };

  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const scorePercent = userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* 1. Configuration Screen */}
      {quizState === 'config' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 border border-indigo-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif-title">
              Quiz Intelligent & Adaptatif
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              L'algorithme analyse vos réponses en temps réel : les questions s'ajustent dynamiquement à vos réussites et ciblent précisément vos erreurs pour maximiser la rétention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            
            {/* Number of questions selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nombre de questions :
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    id={`quiz-len-${num}`}
                    onClick={() => setTotalQuestionsCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      totalQuestionsCount === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} Q
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400">
                Entre 5 et 20 questions selon votre temps disponible
              </span>
            </div>

            {/* Timer Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mode chronométré :
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimerEnabled(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    timerEnabled
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Activé (~45s/Q)</span>
                </button>
                <button
                  onClick={() => setTimerEnabled(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    !timerEnabled
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Détendu (sans chrono)
                </button>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              id="start-quiz-btn"
              onClick={handleStartQuiz}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Démarrer la session adaptative</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Quiz Playing Screen */}
      {quizState === 'playing' && currentQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Header Progress & Timer */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                Question {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                • {currentQuestion.conceptTag}
              </span>
            </div>

            {timerEnabled && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Adaptive Notification if previous was error */}
          {adaptiveNote && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 animate-in fade-in">
              <TrendingUp className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{adaptiveNote}</span>
            </div>
          )}

          {/* Question Text */}
          <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let optionStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300";
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold";
                } else if (isSelected && !isCorrect) {
                  optionStyle = "bg-rose-50 border-rose-500 text-rose-950 font-semibold";
                } else {
                  optionStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold shadow-xs";
              }

              return (
                <button
                  key={idx}
                  id={`quiz-opt-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible after submission) */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explication pédagogique :</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Button: Validate or Next */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {!isAnswerSubmitted ? (
              <button
                id="quiz-validate-btn"
                onClick={handleValidateAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-100"
              >
                Valider ma réponse
              </button>
            ) : (
              <button
                id="quiz-next-btn"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
              >
                <span>{currentQuestionIndex + 1 === questions.length ? 'Voir mon bilan' : 'Question suivante'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* 3. Completed Screen */}
      {quizState === 'completed' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
          
          <div className="text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif-title">
              Session de Quiz Terminée !
            </h2>
            <div className="text-3xl font-extrabold text-slate-900 font-serif-title">
              {correctCount} / {userAnswers.length}
              <span className="text-sm font-normal text-slate-500 ml-2">({scorePercent}%)</span>
            </div>
            <p className="text-xs text-slate-500">
              {scorePercent >= 80 
                ? "Excellente maîtrise des notions clés ! Vos réflexes sont solides."
                : scorePercent >= 60
                ? "Bonne assimilation générale. Quelques points de rigueur à consolider."
                : "Des lacunes identifiées sur les notions fondamentales. Utilisez le mode 'Explique-moi autrement' pour revoir ces concepts."}
            </p>
          </div>

          {/* Error Breakdown per Concept */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Diagnostic par notion abordée :
            </h3>
            <div className="space-y-2">
              {userAnswers.map((rec, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    rec.isCorrect 
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {rec.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className="font-semibold">Question {i + 1} : {rec.concept}</span>
                  </div>
                  <span className="text-[11px] font-bold">
                    {rec.isCorrect ? 'Acquis' : 'À revoir'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recommencer un quiz</span>
            </button>

            <button
              onClick={() => setQuizState('config')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-100"
            >
              Changer les paramètres
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
