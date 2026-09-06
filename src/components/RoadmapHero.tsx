import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Play, 
  Layers, 
  Zap, 
  Award,
  ChevronRight
} from 'lucide-react';
import { SubjectId, LevelId, ObjectiveId, LearningRoadmap } from '../types';
import { SUBJECTS, LEVELS, OBJECTIVES } from '../data/curriculum';

interface RoadmapHeroProps {
  activeSubject: SubjectId;
  setActiveSubject: (s: SubjectId) => void;
  activeLevel: LevelId;
  setActiveLevel: (l: LevelId) => void;
  activeObjective: ObjectiveId;
  setActiveObjective: (o: ObjectiveId) => void;
  onLaunchModule: (tab: string, contextPayload?: any) => void;
}

export const RoadmapHero: React.FC<RoadmapHeroProps> = ({
  activeSubject,
  setActiveSubject,
  activeLevel,
  setActiveLevel,
  activeObjective,
  setActiveObjective,
  onLaunchModule
}) => {
  const [customTopic, setCustomTopic] = useState('');
  const [generatedRoadmap, setGeneratedRoadmap] = useState<LearningRoadmap | null>(() => {
    // Generate initial default roadmap
    return createMockRoadmap('maths', 'lycee_terminale', 'comprendre');
  });
  const [isGenerating, setIsGenerating] = useState(false);

  function createMockRoadmap(sub: SubjectId, lvl: LevelId, obj: ObjectiveId, topic?: string): LearningRoadmap {
    const subjectObj = SUBJECTS.find(s => s.id === sub) || SUBJECTS[0];
    const levelObj = LEVELS.find(l => l.id === lvl) || LEVELS[4];
    const chosenTopic = topic && topic.trim() ? topic.trim() : subjectObj.topics[0];

    const steps = [
      {
        id: 'st-1',
        stepNumber: 1,
        title: `Fondements conceptuels : ${chosenTopic}`,
        description: 'Dialogue socratique avec le professeur pour assimiler les définitions et identifier les pièges classiques.',
        type: 'cours' as const,
        completed: true,
        durationMin: 15
      },
      {
        id: 'st-2',
        stepNumber: 2,
        title: 'Entraînement guidé : Application directe',
        description: 'Résolution de 3 exercices gradués avec correction étape par étape et indices progressifs.',
        type: 'exercice' as const,
        completed: false,
        durationMin: 25
      },
      {
        id: 'st-3',
        stepNumber: 3,
        title: 'Diagnostic adaptatif : Quiz intelligent',
        description: 'Évaluation calibrée de 10 questions pour cibler précisément les notions encore fragiles.',
        type: 'quiz' as const,
        completed: false,
        durationMin: 15
      },
      {
        id: 'st-4',
        stepNumber: 4,
        title: 'Ancrage mémoriel : Fiche & Flashcards',
        description: 'Synthèse des formules indispensables et révision par répétition espacée.',
        type: 'synthese' as const,
        completed: false,
        durationMin: 10
      },
      {
        id: 'st-5',
        stepNumber: 5,
        title: 'Validation en conditions réelles : Mode Examen',
        description: 'Épreuve blanche chronométrée notée sur 20 avec rapport détaillé d\'erreurs.',
        type: 'exercice' as const,
        completed: false,
        durationMin: 30
      }
    ];

    return {
      subject: sub,
      level: lvl,
      objective: obj,
      title: `Parcours Réussite : ${chosenTopic} (${levelObj.label})`,
      estimatedHours: 1.6,
      steps
    };
  }

  const handleGenerateRoadmap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedRoadmap(createMockRoadmap(activeSubject, activeLevel, activeObjective, customTopic));
      setIsGenerating(false);
    }, 400);
  };

  const selectedSubjectObj = SUBJECTS.find(s => s.id === activeSubject);

  return (
    <div className="space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto pt-6 sm:pt-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Méthode Pédagogique Active & Différenciée</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-serif-title">
          Votre professeur particulier, <br className="hidden sm:inline" />
          <span className="text-indigo-600">
            rigoureusement adapté
          </span> à votre niveau.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Choisissez votre matière, votre niveau et votre objectif du jour. 
          Notre algorithme pédagogique conçoit instantanément votre parcours sur-mesure pour transformer vos lacunes en points forts.
        </p>
      </div>

      {/* Primary Configuration Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Column 1: Subject */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>1. Matière</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map((sub) => {
                const isSelected = activeSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    id={`subject-select-${sub.id}`}
                    onClick={() => {
                      setActiveSubject(sub.id);
                      setGeneratedRoadmap(createMockRoadmap(sub.id, activeLevel, activeObjective, customTopic));
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{sub.name}</span>
                    <span className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {sub.topics.length} notions clés
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Level */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>2. Niveau scolaire</span>
            </div>
            <div className="space-y-2">
              {LEVELS.map((lvl) => {
                const isSelected = activeLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    id={`level-select-${lvl.id}`}
                    onClick={() => {
                      setActiveLevel(lvl.id);
                      setGeneratedRoadmap(createMockRoadmap(activeSubject, lvl.id, activeObjective, customTopic));
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{lvl.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {lvl.sub}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3: Objective */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>3. Objectif ciblé</span>
            </div>
            <div className="space-y-2">
              {OBJECTIVES.map((obj) => {
                const isSelected = activeObjective === obj.id;
                return (
                  <button
                    key={obj.id}
                    id={`objective-select-${obj.id}`}
                    onClick={() => {
                      setActiveObjective(obj.id);
                      setGeneratedRoadmap(createMockRoadmap(activeSubject, activeLevel, obj.id, customTopic));
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{obj.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {obj.desc}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Custom Notion or Chapitre Input */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Chapitre ou notion spécifique (optionnel) :
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder={`Ex: ${selectedSubjectObj?.topics[0] || 'Équations du second degré'}...`}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="sm:self-end">
            <button
              id="generate-roadmap-button"
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calibration du parcours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Générer mon parcours</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Roadmap Display */}
      {generatedRoadmap && (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <span>Parcours d'apprentissage personnalisé</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {generatedRoadmap.estimatedHours}h estimées
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title">
                {generatedRoadmap.title}
              </h2>
            </div>
            
            <button
              onClick={() => onLaunchModule('tuteur', { subject: activeSubject, topic: customTopic || selectedSubjectObj?.topics[0] })}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto shadow-md shadow-indigo-100"
            >
              <span>Démarrer l'étape 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline of Steps */}
          <div className="space-y-3">
            {generatedRoadmap.steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-all shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {step.durationMin} min
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {step.stepNumber === 1 && (
                      <button
                        onClick={() => onLaunchModule('tuteur', { subject: activeSubject, topic: customTopic || selectedSubjectObj?.topics[0] })}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Questionner le tuteur</span>
                      </button>
                    )}

                    {step.stepNumber === 2 && (
                      <button
                        onClick={() => onLaunchModule('exercices', { subject: activeSubject, topic: customTopic || selectedSubjectObj?.topics[0] })}
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>S'entraîner</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {step.stepNumber === 3 && (
                      <button
                        onClick={() => onLaunchModule('quiz', { subject: activeSubject, topic: customTopic || selectedSubjectObj?.topics[0] })}
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>Lancer le Quiz</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {step.stepNumber === 4 && (
                      <button
                        onClick={() => onLaunchModule('resume', { subject: activeSubject, topic: customTopic || selectedSubjectObj?.topics[0] })}
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>Voir la fiche</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {step.stepNumber === 5 && (
                      <button
                        onClick={() => onLaunchModule('examen', { subject: activeSubject, topic: customTopic || selectedSubjectObj?.topics[0] })}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Simuler l'épreuve</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="max-w-5xl mx-auto pt-6 border-t border-slate-200">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            L'excellence pédagogique en 5 piliers
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-serif-title">
            Tout ce dont l'élève a besoin pour réussir
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => onLaunchModule('tuteur')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Professeur particulier socratique</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ne donne jamais la réponse toute faite : guide l'élève par le questionnement et s'adapte à son rythme d'apprentissage.
            </p>
          </div>

          <div 
            onClick={() => onLaunchModule('tuteur')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Mode « Explique-moi autrement »</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Un bouton "Je n'ai pas compris" pour reformuler instantanément par une analogie, un exemple concret ou un schéma.
            </p>
          </div>

          <div 
            onClick={() => onLaunchModule('examen')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-sm font-bold text-slate-900">Mode Examen blanc</h3>
              <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded">Exclusif</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conditions réelles d'examen avec chronomètre, barème officiel sur 20 et rapport analytique des erreurs.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
