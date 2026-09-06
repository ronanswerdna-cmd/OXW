import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RoadmapHero } from './components/RoadmapHero';
import { TutorChat } from './components/TutorChat';
import { ExerciseGenerator } from './components/ExerciseGenerator';
import { SmartQuiz } from './components/SmartQuiz';
import { CourseSummarizer } from './components/CourseSummarizer';
import { ExamMode } from './components/ExamMode';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';

import { SubjectId, LevelId, ObjectiveId, StudentProfile } from './types';
import { INITIAL_STUDENT_PROFILE, SUBJECTS } from './data/curriculum';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('parcours');
  const [activeSubject, setActiveSubject] = useState<SubjectId>('maths');
  const [activeLevel, setActiveLevel] = useState<LevelId>('lycee_terminale');
  const [activeObjective, setActiveObjective] = useState<ObjectiveId>('comprendre');
  const [activeTopic, setActiveTopic] = useState<string>('Équations du second degré');
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);

  const handleLaunchModule = (tab: string, contextPayload?: any) => {
    if (contextPayload?.subject) {
      setActiveSubject(contextPayload.subject);
    }
    if (contextPayload?.topic) {
      setActiveTopic(contextPayload.topic);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchPracticeFromDashboard = (tab: string, subject: SubjectId, topic?: string) => {
    setActiveSubject(subject);
    if (topic) setActiveTopic(topic);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased">
      
      {/* Top Academic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        setProfile={setProfile}
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Tab 1: Parcours & Accueil */}
        {activeTab === 'parcours' && (
          <RoadmapHero
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
            activeLevel={activeLevel}
            setActiveLevel={setActiveLevel}
            activeObjective={activeObjective}
            setActiveObjective={setActiveObjective}
            onLaunchModule={handleLaunchModule}
          />
        )}

        {/* Tab 2: Professeur IA + Explique-moi autrement */}
        {activeTab === 'tuteur' && (
          <TutorChat
            activeSubject={activeSubject}
            activeLevel={activeLevel}
            initialTopic={activeTopic}
            onNavigateToExercises={() => handleLaunchModule('exercices', { subject: activeSubject, topic: activeTopic })}
          />
        )}

        {/* Tab 3: Générateur d'exercices */}
        {activeTab === 'exercices' && (
          <ExerciseGenerator
            activeSubject={activeSubject}
            activeLevel={activeLevel}
            initialTopic={activeTopic}
            onSelectSubject={setActiveSubject}
          />
        )}

        {/* Tab 4: Quiz intelligent adaptatif */}
        {activeTab === 'quiz' && (
          <SmartQuiz
            activeSubject={activeSubject}
            activeLevel={activeLevel}
            initialTopic={activeTopic}
          />
        )}

        {/* Tab 5: Résumé de cours */}
        {activeTab === 'resume' && (
          <CourseSummarizer
            activeSubject={activeSubject}
            activeLevel={activeLevel}
          />
        )}

        {/* Tab 6: Mode Examen Blanc */}
        {activeTab === 'examen' && (
          <ExamMode
            activeSubject={activeSubject}
            activeLevel={activeLevel}
          />
        )}

        {/* Tab 7: Tableau de bord */}
        {activeTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            setProfile={setProfile}
            onLaunchPractice={handleLaunchPracticeFromDashboard}
          />
        )}

      </main>

      {/* Corporate / Academic Footer */}
      <Footer />

    </div>
  );
}
