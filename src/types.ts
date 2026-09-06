export type SubjectId = 
  | 'maths' 
  | 'physique' 
  | 'francais' 
  | 'histoire' 
  | 'svt' 
  | 'anglais' 
  | 'philosophie' 
  | 'ses';

export type LevelId = 
  | 'college_6_5' 
  | 'college_4_3' 
  | 'lycee_seconde' 
  | 'lycee_premiere' 
  | 'lycee_terminale' 
  | 'superieur';

export type ObjectiveId = 
  | 'comprendre' 
  | 'examen' 
  | 'exercices' 
  | 'lacunes';

export type DifficultyLevel = 'facile' | 'moyen' | 'difficile';

export type RephraseMode = 
  | 'simple' 
  | 'concret' 
  | 'analogie' 
  | 'schema' 
  | 'guide';

export interface StudentProfile {
  name: string;
  level: LevelId;
  targetExam?: string;
  avatar: string;
  streakDays: number;
  weeklyGoal: {
    target: number;
    current: number;
    description: string;
    label?: string;
  };
  weaknesses: {
    concept: string;
    subjectName: string;
    subjectId: SubjectId;
    failureCount: number;
  }[];
  progressBySubject: {
    subjectId: SubjectId;
    name: string;
    percent: number;
    hoursSpent: number;
  }[];
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  topics: string[];
}

export interface LearningRoadmap {
  subject: SubjectId;
  level: LevelId;
  objective: ObjectiveId;
  title: string;
  estimatedHours: number;
  steps: {
    id: string;
    stepNumber: number;
    title: string;
    description: string;
    type: 'cours' | 'exercice' | 'quiz' | 'synthese';
    completed: boolean;
    durationMin: number;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  rephraseSource?: {
    originalText: string;
    mode: RephraseMode;
  };
  suggestedFollowUps?: string[];
}

export interface ExerciseItem {
  id: string;
  subject: SubjectId;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  context?: string;
  hints: string[];
  sampleSolution: string;
  keyFormulas?: string[];
}

export interface ExerciseEvaluation {
  score: number; // 0 to 10
  feedback: string;
  strengths: string[];
  improvements: string[];
  stepByStepCorrection: string;
  recommendedPractice: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

export interface CourseAnalysisResult {
  title: string;
  subject: string;
  summary: string;
  keyConcepts: {
    term: string;
    definition: string;
    importance: 'essentiel' | 'approfondi';
  }[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  practiceExercises: {
    title: string;
    prompt: string;
    hint: string;
  }[];
}

export interface ExamPaper {
  id: string;
  title: string;
  subject: SubjectId;
  level: LevelId;
  durationMinutes: number;
  totalPoints: number;
  officialInstructions: string;
  sections: {
    id: string;
    title: string;
    points: number;
    description: string;
    questions: {
      id: string;
      number: string;
      text: string;
      subQuestions?: string[];
      points: number;
      expectedCriteria: string[];
    }[];
  }[];
}

export interface ExamResult {
  score: number; // out of 20
  mention: string;
  timeSpentMinutes: number;
  totalTimeMinutes: number;
  criteriaGrades: {
    name: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
  errorAnalysis: {
    category: 'Rigueur & Rédaction' | 'Erreur de calcul / Méthode' | 'Compréhension du sujet' | 'Gestion du temps';
    severity: 'haute' | 'moyenne' | 'faible';
    detail: string;
    recommendation: string;
  }[];
  strengths: string[];
  actionPlan: string[];
}
