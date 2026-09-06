import React, { useState } from 'react';
import { 
  Compass, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  BookOpen, 
  Clock, 
  BarChart3, 
  Flame, 
  GraduationCap, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { StudentProfile, LevelId, SubjectId } from '../types';
import { LEVELS, SUBJECTS } from '../data/curriculum';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  activeSubject: SubjectId;
  setActiveSubject: (s: SubjectId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  setProfile,
  activeSubject,
  setActiveSubject
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'parcours', label: 'Parcours', icon: Compass },
    { id: 'tuteur', label: 'Professeur', icon: MessageSquare },
    { id: 'exercices', label: 'Exercices', icon: CheckSquare },
    { id: 'quiz', label: 'Quiz Intelligent', icon: Sparkles },
    { id: 'resume', label: 'Résumé de cours', icon: BookOpen },
    { id: 'examen', label: 'Mode Examen', icon: Clock, highlight: true },
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 }
  ];

  const currentLevelLabel = LEVELS.find(l => l.id === profile.level)?.label || 'Terminale';
  const currentSubjectObj = SUBJECTS.find(s => s.id === activeSubject);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('parcours')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-200">
              <span>O</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">OXW CREATIV</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                  Édition Pro
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-slate-900 bg-slate-100/80 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  } ${
                    item.highlight && !isActive ? 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/60' : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-indigo-600 text-white ml-0.5">
                      Pro
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Student Info & Quick Switcher */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-default"
              title={`${profile.streakDays} jours consécutifs de révision`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile.streakDays}j</span>
            </div>

            {/* Profile Dropdown matching Professional Polish avatar & title */}
            <div className="relative">
              <button
                id="profile-menu-button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {profile.avatar}
                  </div>
                </div>
                <div className="flex flex-col items-start pr-1">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider leading-none mb-0.5">
                    {currentLevelLabel}
                  </span>
                  <span className="text-sm font-medium text-slate-700 leading-tight">
                    {profile.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Compte élève certifié</div>
                    <div className="text-sm font-bold text-slate-900">{profile.name}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{profile.targetExam}</div>
                  </div>

                  <div className="px-4 py-3">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Changer de niveau
                    </label>
                    <select
                      value={profile.level}
                      onChange={(e) => {
                        setProfile(prev => ({ ...prev, level: e.target.value as LevelId }));
                      }}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {LEVELS.map(l => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                      <span className="font-medium">Objectif hebdo</span>
                      <span className="font-bold text-slate-900">{profile.weeklyGoal.current}/{profile.weeklyGoal.target} exos</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all" 
                        style={{ width: `${(profile.weeklyGoal.current / profile.weeklyGoal.target) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="px-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveTab('dashboard');
                      }}
                      className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      Voir mon tableau de bord complet →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{profile.streakDays}j</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : item.highlight
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                {profile.avatar}
              </div>
              <span className="text-xs font-bold text-slate-900">{profile.name}</span>
            </div>
            <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">{currentLevelLabel}</span>
          </div>
        </div>
      )}
    </header>
  );
};
