import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  RotateCw, 
  FileText, 
  HelpCircle, 
  CheckSquare,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CourseAnalysisResult, SubjectId, LevelId } from '../types';
import { SAMPLE_COURSE_TEXT, SUBJECTS } from '../data/curriculum';

interface CourseSummarizerProps {
  activeSubject: SubjectId;
  activeLevel: LevelId;
}

export const CourseSummarizer: React.FC<CourseSummarizerProps> = ({
  activeSubject,
  activeLevel
}) => {
  const [courseInput, setCourseInput] = useState(SAMPLE_COURSE_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'notions' | 'flashcards' | 'quiz' | 'exercices'>('resume');
  const [analysisResult, setAnalysisResult] = useState<CourseAnalysisResult | null>(null);

  // Flashcards navigation & flip state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  // Copied alert
  const [copied, setCopied] = useState(false);

  const handleAnalyzeCourse = async () => {
    if (!courseInput.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/course/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseText: courseInput,
          subject: SUBJECTS.find(s => s.id === activeSubject)?.name,
          title: "Cours importé"
        })
      });

      const data = await res.json();
      setAnalysisResult(data);
      setActiveTab('resume');
      setCurrentCardIndex(0);
      setIsCardFlipped(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFlashcard = analysisResult?.flashcards[currentCardIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Synthèse & Mémorisation Active</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title">
          Analyse de Cours, Flashcards & Quiz Instantanés
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Collez le contenu de votre cours ou de vos notes. Notre moteur pédagogique extrait la substantifique moelle : résumé clair, définitions indispensables, fiches de révision (flashcards), mini-quiz et exercices d'application.
        </p>
      </div>

      {/* Course Input Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Texte de votre cours :
          </label>
          <button
            onClick={() => setCourseInput(SAMPLE_COURSE_TEXT)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Charger l'exemple de cours (Lois de Newton)
          </button>
        </div>

        <textarea
          id="course-textarea-input"
          rows={6}
          value={courseInput}
          onChange={(e) => setCourseInput(e.target.value)}
          placeholder="Collez ici votre cours, un chapitre de manuel, ou vos notes de classe..."
          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-sans leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            id="analyze-course-btn"
            onClick={handleAnalyzeCourse}
            disabled={!courseInput.trim() || isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyse pédagogique en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Générer résumé, flashcards & quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Analysis Results Area */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          
          {/* Sub-tabs for the 5 generated components */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
            {[
              { id: 'resume', label: '1. Résumé synthétique', icon: FileText },
              { id: 'notions', label: '2. Notions clés', icon: CheckCircle2 },
              { id: 'flashcards', label: '3. Flashcards (Flip)', icon: Layers },
              { id: 'quiz', label: '4. Mini-Quiz', icon: HelpCircle },
              { id: 'exercices', label: '5. Exercices', icon: CheckSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`course-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Tab 1: Résumé */}
            {activeTab === 'resume' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-title">
                    {analysisResult.title}
                  </h3>
                  <button
                    onClick={handleCopySummary}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier le résumé'}</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {analysisResult.summary}
                </div>
              </div>
            )}

            {/* Tab 2: Notions Clés */}
            {activeTab === 'notions' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Vocabulaire & Concepts fondamentaux à retenir :
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysisResult.keyConcepts.map((c, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{c.term}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                          c.importance === 'essentiel' 
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.importance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {c.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Flashcards */}
            {activeTab === 'flashcards' && currentFlashcard && (
              <div className="space-y-6 max-w-xl mx-auto text-center">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Fiche {currentCardIndex + 1} sur {analysisResult.flashcards.length}</span>
                  <span>{masteredCards.size} acquise(s)</span>
                </div>

                {/* 3D Flip Card */}
                <div
                  id="flashcard-element"
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="min-h-[220px] p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col items-center justify-center relative select-none"
                >
                  <span className="text-[10px] font-semibold tracking-wider text-indigo-600 uppercase mb-3 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {currentFlashcard.category} • {isCardFlipped ? 'Réponse' : 'Question (Cliquez pour retourner)'}
                  </span>

                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-serif-title">
                    {isCardFlipped ? currentFlashcard.back : currentFlashcard.front}
                  </div>

                  <span className="absolute bottom-3 text-[11px] text-slate-400">
                    {isCardFlipped ? 'Cliquez pour revoir la question' : 'Cliquez pour vérifier la réponse'}
                  </span>
                </div>

                {/* Navigation & Mastery Controls */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCurrentCardIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={currentCardIndex === 0}
                    className="p-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all text-xs font-semibold flex items-center gap-1 text-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédente</span>
                  </button>

                  <button
                    onClick={() => {
                      const newSet = new Set(masteredCards);
                      if (newSet.has(currentFlashcard.id)) {
                        newSet.delete(currentFlashcard.id);
                      } else {
                        newSet.add(currentFlashcard.id);
                      }
                      setMasteredCards(newSet);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      masteredCards.has(currentFlashcard.id)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {masteredCards.has(currentFlashcard.id) ? '✓ Notée comme acquise' : 'Marquer comme acquise'}
                  </button>

                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCurrentCardIndex(prev => Math.min(analysisResult.flashcards.length - 1, prev + 1));
                    }}
                    disabled={currentCardIndex === analysisResult.flashcards.length - 1}
                    className="p-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all text-xs font-semibold flex items-center gap-1 text-slate-700"
                  >
                    <span>Suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Mini-Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Questions de contrôle immédiat :
                </h3>
                <div className="space-y-4">
                  {analysisResult.quiz.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="text-xs font-bold text-slate-900">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx} 
                            className={`p-2.5 rounded-lg border text-xs ${
                              oIdx === q.correctIndex 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        💡 {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Exercices */}
            {activeTab === 'exercices' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Exercices d'application directe :
                </h3>
                <div className="space-y-4">
                  {analysisResult.practiceExercises.map((ex, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">{ex.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{ex.prompt}</p>
                      {ex.hint && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                          <span className="font-bold">Indice méthodologique : </span>{ex.hint}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
