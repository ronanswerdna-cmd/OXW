import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Target, 
  Flame, 
  Clock, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { StudentProfile, SubjectId } from '../types';
import { SUBJECTS } from '../data/curriculum';

interface DashboardProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onLaunchPractice: (tab: string, subject: SubjectId, topic?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  setProfile,
  onLaunchPractice
}) => {
  const handleIncrementWeeklyGoal = () => {
    setProfile(prev => ({
      ...prev,
      weeklyGoal: {
        ...prev.weeklyGoal,
        current: Math.min(prev.weeklyGoal.target, prev.weeklyGoal.current + 1)
      }
    }));
  };

  const currentGoalPercent = Math.round((profile.weeklyGoal.current / profile.weeklyGoal.target) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Student Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold font-serif-title shadow-sm shadow-indigo-200">
            {profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title">
                Tableau de Bord de {profile.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
                {profile.targetExam}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Synthèse en temps réel de votre progression, vos points d'effort et vos objectifs d'examen.
            </p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-lg sm:text-xl">
              <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
              <span>{profile.streakDays} jours</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Série en cours</span>
          </div>

          <div className="h-8 w-[1px] bg-slate-200" />

          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              15.2<span className="text-xs font-normal text-slate-400">/20</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Moyenne examens</span>
          </div>
        </div>
      </div>

      {/* Grid: Weekly Goal & Targeted Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 🎯 Objectif de la semaine */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Objectif de la semaine</span>
            </div>
            <button
              onClick={handleIncrementWeeklyGoal}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Valider un exercice</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {profile.weeklyGoal.label}
              </h3>
              <span className="text-xs font-bold text-indigo-600 font-mono">
                {profile.weeklyGoal.current} / {profile.weeklyGoal.target}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${currentGoalPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{currentGoalPercent}% accompli</span>
              <span>Encore {Math.max(0, profile.weeklyGoal.target - profile.weeklyGoal.current)} exercices</span>
            </div>
          </div>

          <button
            onClick={() => onLaunchPractice('exercices', 'maths')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100"
          >
            <span>Continuer la série d'exercices</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ⚠️ Ses points faibles ciblés */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Points forts & Faibles</span>
          </div>

          <div className="space-y-2.5">
            {profile.weaknesses.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/60 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{w.concept}</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[10px] font-bold">
                      À revoir
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {w.subjectName} • {w.failureCount} erreurs récentes
                  </div>
                </div>

                <button
                  onClick={() => onLaunchPractice('tuteur', w.subjectId, w.concept)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-indigo-600 flex items-center gap-1 transition-all shadow-sm"
                >
                  <span>S'entraîner</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400">
            Mis à jour automatiquement après chaque quiz et exercice soumis.
          </p>
        </div>

      </div>

      {/* 📊 Progression par Matière */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Programme Annuel & Maîtrise Globale</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif-title">
              Ma Progression par Matière
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Moyenne générale de complétion : 77%
          </span>
        </div>

        <div className="space-y-4">
          {profile.progressBySubject.map((item) => {
            const isHigh = item.percent >= 80;
            const isMid = item.percent >= 65 && item.percent < 80;

            return (
              <div key={item.subjectId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.hoursSpent}h de travail)
                    </span>
                  </div>
                  <span className="font-mono text-indigo-600 font-bold">{item.percent}%</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isHigh ? 'bg-emerald-500' : isMid ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Recommendation matching Conseil du Professeur IA */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-indigo-900 block mb-0.5">Conseil du Professeur IA</span>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Vous avez progressé de +14% en Physique-Chimie cette semaine. Concentrez-vous aujourd'hui sur le calcul du discriminant pour valider définitivement le chapitre du Second Degré !
              </p>
            </div>
          </div>
          <button
            onClick={() => onLaunchPractice('tuteur', 'maths', 'Équations du second degré')}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shrink-0 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            Revoir la notion
          </button>
        </div>

      </div>

    </div>
  );
};
