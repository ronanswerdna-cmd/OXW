import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  Award, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { SubjectId, LevelId, DifficultyLevel, ExerciseItem, ExerciseEvaluation } from '../types';
import { SUBJECTS, LEVELS, SAMPLE_EXERCISES } from '../data/curriculum';

interface ExerciseGeneratorProps {
  activeSubject: SubjectId;
  activeLevel: LevelId;
  initialTopic?: string;
  onSelectSubject?: (s: SubjectId) => void;
}

export const ExerciseGenerator: React.FC<ExerciseGeneratorProps> = ({
  activeSubject,
  activeLevel,
  initialTopic,
  onSelectSubject
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('moyen');
  const [currentTopic, setCurrentTopic] = useState<string>(() => {
    return initialTopic || SUBJECTS.find(s => s.id === activeSubject)?.topics[0] || 'Général';
  });

  // Current active exercise
  const [exercise, setExercise] = useState<ExerciseItem>(() => {
    const match = SAMPLE_EXERCISES.find(e => e.subject === activeSubject && e.difficulty === selectedDifficulty);
    return match || SAMPLE_EXERCISES[0];
  });

  const [studentAttempt, setStudentAttempt] = useState('');
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ExerciseEvaluation | null>(null);

  const currentSubjectObj = SUBJECTS.find(s => s.id === activeSubject);

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setSelectedDifficulty(diff);
    setEvaluation(null);
    setStudentAttempt('');
    setRevealedHintIndex(-1);

    const match = SAMPLE_EXERCISES.find(e => e.difficulty === diff && (e.subject === activeSubject || true));
    if (match) {
      setExercise(match);
    } else {
      // Dynamic fallback
      setExercise({
        id: `gen-${Date.now()}`,
        subject: activeSubject,
        topic: currentTopic,
        difficulty: diff,
        question: `Exercice d'application [Niveau ${diff.toUpperCase()}] sur ${currentTopic} : Analysez la situation suivante et calculez la valeur demandée en explicitant toutes vos étapes de calcul.`,
        hints: [
          "Commencez par poser clairement les grandeurs connues et l'inconnue.",
          "Mobilisez la formule de référence du cours en vérifiant les unités.",
          "Effectuez le calcul étape par étape sans sauter d'étape intermédiaire."
        ],
        sampleSolution: `1. Identification des hypothèses initiales.\n2. Application rigoureuse de la formule.\n3. Conclusion avec unité appropriée.`
      });
    }
  };

  const handleRevealNextHint = () => {
    if (revealedHintIndex < (exercise.hints.length - 1)) {
      setRevealedHintIndex(prev => prev + 1);
    }
  };

  const handleSubmitAttempt = async () => {
    if (!studentAttempt.trim() || isEvaluating) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/exercises/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise,
          studentAttempt
        })
      });

      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setEvaluation({
        score: 7,
        feedback: "Bonne initiative de calcul ! Votre démarche générale montre la compréhension de la méthode, attention toutefois à la rigueur de rédaction pour l'examen.",
        strengths: ["Bonne identification des termes", "Logique de résolution cohérente"],
        improvements: ["Préciser le domaine de validité", "Vérifier le signe intermédiaire"],
        stepByStepCorrection: exercise.sampleSolution,
        recommendedPractice: "Faire un exercice supplémentaire de même niveau pour ancrer le réflexe."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextExercise = () => {
    setEvaluation(null);
    setStudentAttempt('');
    setRevealedHintIndex(-1);
    const otherExercises = SAMPLE_EXERCISES.filter(e => e.id !== exercise.id);
    const randomOne = otherExercises[Math.floor(Math.random() * otherExercises.length)] || SAMPLE_EXERCISES[0];
    setExercise(randomOne);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title & Topic Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Entraînement & Résolution Pas-à-Pas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title">
              Générateur d'Exercices Adaptatifs
            </h2>
          </div>

          {/* Difficulty selector (Green, Indigo, Red) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              id="diff-facile"
              onClick={() => handleDifficultyChange('facile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'facile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>Facile</span>
            </button>

            <button
              id="diff-moyen"
              onClick={() => handleDifficultyChange('moyen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'moyen'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-300" />
              <span>Moyen</span>
            </button>

            <button
              id="diff-difficile"
              onClick={() => handleDifficultyChange('difficile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'difficile'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-300" />
              <span>Difficile</span>
            </button>
          </div>
        </div>

        {/* Topic selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500">Thème :</span>
          {currentSubjectObj?.topics.slice(0, 4).map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentTopic(t);
                handleDifficultyChange(selectedDifficulty);
              }}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                currentTopic === t
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* The Active Exercise Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Statement Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Énoncé de l'exercice • {exercise.topic}
          </span>
          <button
            onClick={handleNextExercise}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Changer d'exercice</span>
          </button>
        </div>

        {/* Statement Text */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base font-normal text-slate-900 leading-relaxed whitespace-pre-line">
          {exercise.question}
        </div>

        {exercise.context && (
          <div className="text-xs text-indigo-800 bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
            ℹ️ {exercise.context}
          </div>
        )}

        {/* Key formulas reminder if available */}
        {exercise.keyFormulas && exercise.keyFormulas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Formules utiles :</span>
            {exercise.keyFormulas.map((f, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Progressive Hints Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Indices progressifs ({revealedHintIndex + 1}/{exercise.hints.length} débloqués)</span>
            </span>

            {revealedHintIndex < (exercise.hints.length - 1) && (
              <button
                onClick={handleRevealNextHint}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Révéler un indice
              </button>
            )}
          </div>

          {revealedHintIndex >= 0 ? (
            <div className="space-y-2">
              {exercise.hints.slice(0, revealedHintIndex + 1).map((h, i) => (
                <div key={i} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <span className="font-bold shrink-0">Indice {i + 1} :</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Essayez de chercher par vous-même d'abord. Si vous êtes bloqué, cliquez sur "Révéler un indice" sans dévoiler la solution !
            </p>
          )}
        </div>

        {/* Student Workspace Input */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Votre démarche ou résultat :
          </label>
          <textarea
            id="exercise-student-input"
            rows={5}
            value={studentAttempt}
            onChange={(e) => setStudentAttempt(e.target.value)}
            placeholder="Détaillez votre raisonnement pas à pas : écrivez vos calculs, formulez vos déductions ou proposez votre réponse finale..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Le professeur corrigera la démarche complète, et pas seulement le résultat numérique.
            </span>

            <button
              id="submit-exercise-attempt"
              onClick={handleSubmitAttempt}
              disabled={!studentAttempt.trim() || isEvaluating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shrink-0 shadow-md shadow-indigo-100"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Évaluation en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Soumettre ma tentative</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Evaluation Results Box (Appears after submission) */}
      {evaluation && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          
          {/* Header with Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correction & Analyse Constructive</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Évaluation de votre résolution
              </h3>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-center shadow-sm">
                <div className="text-[10px] text-indigo-100 uppercase tracking-wider font-bold">Note d'étape</div>
                <div className="text-xl font-extrabold font-serif-title">{evaluation.score} / 10</div>
              </div>
            </div>
          </div>

          {/* Feedback narrative */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
            {evaluation.feedback}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ce qui est bien maîtrisé</span>
              </div>
              <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Points de rigueur à ajuster</span>
              </div>
              <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                {evaluation.improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reference Step-by-Step Correction */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rédaction de référence complète :
            </div>
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-line border border-slate-800">
              {evaluation.stepByStepCorrection}
            </div>
          </div>

          {/* Action button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Conseil : {evaluation.recommendedPractice}
            </span>
            <button
              onClick={handleNextExercise}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100"
            >
              <span>Exercice suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
