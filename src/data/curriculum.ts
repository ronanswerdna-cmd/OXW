import { 
  SubjectInfo, 
  LevelId, 
  ObjectiveId, 
  StudentProfile, 
  LearningRoadmap, 
  ExamPaper, 
  QuizQuestion,
  ExerciseItem
} from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'maths',
    name: 'Mathématiques',
    icon: 'Calculator',
    color: '#2563EB',
    badgeBg: '#EFF6FF',
    badgeText: '#1E40AF',
    topics: [
      'Équations du 2nd degré',
      'Fonctions exponentielles & logarithmes',
      'Dérivation & convexité',
      'Géométrie dans l\'espace & vecteurs',
      'Probabilités conditionnelles & lois continues',
      'Suites arithmético-géométriques & récurrence'
    ]
  },
  {
    id: 'physique',
    name: 'Physique-Chimie',
    icon: 'Atom',
    color: '#0D9488',
    badgeBg: '#F0FDFA',
    badgeText: '#115E59',
    topics: [
      'Lois de Newton & mécanique céleste',
      'Cinétique chimique & vitesse de réaction',
      'Ondes mécaniques & effet Doppler',
      'Thermodynamique & transferts thermiques',
      'Réactions acido-basiques & pH-métrie',
      'Énergie électrique & circuits RC'
    ]
  },
  {
    id: 'francais',
    name: 'Français & Littérature',
    icon: 'BookOpen',
    color: '#B45309',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    topics: [
      'Dissertation littéraire & argumentation',
      'Commentaire de texte linéaire & stylistique',
      'Figures de style & rhétorique',
      'Le théâtre au XVIIe et XIXe siècle',
      'La poésie du XIXe au XXe siècle',
      'La littérature d\'idées des Lumières'
    ]
  },
  {
    id: 'histoire',
    name: 'Histoire-Géographie',
    icon: 'Landmark',
    color: '#DC2626',
    badgeBg: '#FEF2F2',
    badgeText: '#991B1B',
    topics: [
      'La Guerre Froide & relations internationales (1947-1991)',
      'La mondialisation : mobilités, flux et réseaux',
      'La France sous la Ve République',
      'Les dynamiques territoriales de la France',
      'Gouverner une démocratie en temps de crise'
    ]
  },
  {
    id: 'philosophie',
    name: 'Philosophie',
    icon: 'Feather',
    color: '#7C3AED',
    badgeBg: '#F5F3FF',
    badgeText: '#5B21B6',
    topics: [
      'La conscience, l\'inconscient et le sujet',
      'La liberté et le déterminisme',
      'Le devoir, la morale et le bonheur',
      'La vérité, la science et la technique',
      'L\'État, la justice et le droit'
    ]
  },
  {
    id: 'svt',
    name: 'SVT (Sciences de la Vie)',
    icon: 'Dna',
    color: '#16A34A',
    badgeBg: '#F0FDF4',
    badgeText: '#166534',
    topics: [
      'Génétique & diversification des génomes',
      'Tectonique des plaques & géologie',
      'Immunologie & réponses immunitaires',
      'Le système nerveux & la commande motrice',
      'Écosystèmes & flux de matière'
    ]
  },
  {
    id: 'anglais',
    name: 'Anglais (LV1)',
    icon: 'Globe',
    color: '#4F46E5',
    badgeBg: '#EEF2FF',
    badgeText: '#3730A3',
    topics: [
      'Essay writing & structured vocabulary',
      'Art and power / Innovations in societies',
      'Grammar: conditional structures & modals',
      'Listening comprehension & note taking'
    ]
  },
  {
    id: 'ses',
    name: 'SES (Économie & Social)',
    icon: 'TrendingUp',
    color: '#0284C7',
    badgeBg: '#F0F9FF',
    badgeText: '#075985',
    topics: [
      'Sources de la croissance économique',
      'Commerce international & mondialisation',
      'Stratification sociale & inégalités',
      'Politiques économiques et monétaires'
    ]
  }
];

export const LEVELS: { id: LevelId; label: string; sub: string }[] = [
  { id: 'college_6_5', label: 'Collège (6e - 5e)', sub: 'Bases méthodologiques & consolidation' },
  { id: 'college_4_3', label: 'Collège (4e - 3e / Brevet)', sub: 'Préparation au DNB et passage au lycée' },
  { id: 'lycee_seconde', label: 'Lycée (Seconde Générale)', sub: 'Transition méthodologique & choix de spécialités' },
  { id: 'lycee_premiere', label: 'Lycée (Première Spécialités)', sub: 'Épreuves anticipées de français & contrôle continu' },
  { id: 'lycee_terminale', label: 'Lycée (Terminale Bac)', sub: 'Préparation intensive au Baccalauréat & Grand Oral' },
  { id: 'superieur', label: 'Enseignement Supérieur', sub: 'CPGE / Université / Prépa Concours / Écoles' }
];

export const OBJECTIVES: { id: ObjectiveId; label: string; icon: string; desc: string }[] = [
  { 
    id: 'comprendre', 
    label: 'Comprendre un cours complexe', 
    icon: 'Lightbulb',
    desc: 'Assimiler les notions fondamentales, dépasser un blocage conceptuel' 
  },
  { 
    id: 'examen', 
    label: 'Préparer un examen ou concours', 
    icon: 'Award',
    desc: 'Bac, Brevet, Partiels : méthodologie, gestion du temps et épreuves types' 
  },
  { 
    id: 'exercices', 
    label: 'Faire des exercices d\'entraînement', 
    icon: 'CheckSquare',
    desc: 'Pratique intensive graduée du niveau facile au défi avec correction pas-à-pas' 
  },
  { 
    id: 'lacunes', 
    label: 'Combler des lacunes ciblées', 
    icon: 'TrendingUp',
    desc: 'Diagnostic de points faibles et exercices de remédiation ciblés' 
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Lucas Martin',
  level: 'lycee_terminale',
  targetExam: 'Baccalauréat Général 2026 (Spé Maths & Physique)',
  avatar: 'LM',
  streakDays: 6,
  weeklyGoal: {
    target: 20,
    current: 14,
    description: 'Résoudre 20 exercices de mathématiques',
    label: 'Résoudre 20 exercices de mathématiques'
  },
  weaknesses: [
    {
      concept: 'Équations du second degré & discriminant',
      subjectName: 'Mathématiques',
      subjectId: 'maths',
      failureCount: 4
    },
    {
      concept: 'Fractions & simplifications algébriques',
      subjectName: 'Mathématiques',
      subjectId: 'maths',
      failureCount: 3
    },
    {
      concept: 'Étude du signe de la dérivée',
      subjectName: 'Mathématiques',
      subjectId: 'maths',
      failureCount: 3
    },
    {
      concept: 'Lois de Newton & repères',
      subjectName: 'Physique-Chimie',
      subjectId: 'physique',
      failureCount: 2
    }
  ],
  progressBySubject: [
    { subjectId: 'maths', name: 'Mathématiques', percent: 72, hoursSpent: 14.5 },
    { subjectId: 'francais', name: 'Français & Philosophie', percent: 84, hoursSpent: 9.2 },
    { subjectId: 'physique', name: 'Physique-Chimie', percent: 61, hoursSpent: 11.0 },
    { subjectId: 'histoire', name: 'Histoire-Géographie', percent: 78, hoursSpent: 6.4 },
    { subjectId: 'anglais', name: 'Anglais (B2/C1)', percent: 89, hoursSpent: 5.1 }
  ]
};

export const DEFAULT_STUDENT_PROFILE = INITIAL_STUDENT_PROFILE;

export const INITIAL_PROGRESS_DATA = {
  subjects: [
    { id: 'maths', name: 'Mathématiques', progress: 72, hours: 14.5, trend: '+4% cette semaine' },
    { id: 'francais', name: 'Français & Philo', progress: 84, hours: 9.2, trend: '+6% cette semaine' },
    { id: 'physique', name: 'Physique-Chimie', progress: 61, hours: 11.0, trend: '+2% cette semaine' },
    { id: 'histoire', name: 'Histoire-Géo', progress: 78, hours: 6.4, trend: '+8% cette semaine' },
    { id: 'anglais', name: 'Anglais', progress: 89, hours: 5.1, trend: 'Stable' }
  ],
  weaknesses: [
    {
      id: 'eq2',
      subject: 'Mathématiques',
      topic: 'Équations du second degré & discriminant',
      severity: 'high' as const,
      errorRate: '42% d\'erreurs sur le calcul de racines complexes',
      actionPrompt: 'S\'entraîner sur les équations'
    },
    {
      id: 'frac',
      subject: 'Mathématiques',
      topic: 'Fractions & simplifications algébriques',
      severity: 'medium' as const,
      errorRate: '28% d\'oublis de factorisation préalable',
      actionPrompt: 'Fiche méthode fractions'
    },
    {
      id: 'deriv',
      subject: 'Mathématiques',
      topic: 'Étude des fonctions & signe de la dérivée',
      severity: 'high' as const,
      errorRate: '35% d\'oublis du domaine de validité',
      actionPrompt: 'Exercices guidés dérivées'
    },
    {
      id: 'newton',
      subject: 'Physique-Chimie',
      topic: 'Projection de la seconde loi de Newton',
      severity: 'medium' as const,
      errorRate: '31% d\'erreurs de signe sur les repères de Frenet',
      actionPrompt: 'Rappels de cours vecteurs'
    }
  ],
  recentSessions: [
    { id: 's1', date: 'Aujourd\'hui à 11h20', subject: 'Mathématiques', title: 'Quiz adaptatif : Fonctions exponentielles', score: '85%', duration: '18 min' },
    { id: 's2', date: 'Hier à 17h45', subject: 'Physique-Chimie', title: 'Session d\'examen : Cinétique & Catalyse', score: '14.5/20', duration: '40 min' },
    { id: 's3', date: 'Il y a 3 jours', subject: 'Français', title: 'Analyse et résumé : Baudelaire et les Fleurs du Mal', score: '92%', duration: '25 min' }
  ]
};

export const SAMPLE_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex-math-1',
    subject: 'maths',
    topic: 'Équations du second degré',
    difficulty: 'facile',
    question: 'Résoudre dans ℝ l\'équation suivante : 2x² - 8x + 6 = 0.',
    context: 'Niveau Première / Seconde : Identification des coefficients a, b, c et calcul du discriminant Δ.',
    hints: [
      'Identifiez d\'abord a, b et c dans la forme ax² + bx + c = 0.',
      'Calculez le discriminant avec la formule Δ = b² - 4ac.',
      'Quel est le signe de Δ ? Combien y a-t-il de racines ?'
    ],
    sampleSolution: '1. a = 2, b = -8, c = 6.\n2. Δ = (-8)² - 4(2)(6) = 64 - 48 = 16.\n3. Δ > 0, il y a deux solutions réelles distinctes :\n   x₁ = (-(-8) - √16) / (2 × 2) = (8 - 4) / 4 = 1\n   x₂ = (-(-8) + √16) / (2 × 2) = (8 + 4) / 4 = 3\nConclusion : S = {1, 3}.',
    keyFormulas: ['Δ = b² - 4ac', 'x = (-b ± √Δ) / 2a']
  },
  {
    id: 'ex-math-2',
    subject: 'maths',
    topic: 'Fonctions exponentielles & dérivation',
    difficulty: 'moyen',
    question: 'Soit la fonction f définie sur ℝ par f(x) = (2x - 3)e^(x). \n1. Calculer la dérivée f\'(x) en factorisant par e^(x).\n2. En déduire le tableau de variations de f sur ℝ.',
    context: 'Niveau Terminale : Utilisation de la formule de dérivation d\'un produit (uv)\' = u\'v + uv\'.',
    hints: [
      'Posez u(x) = 2x - 3 et v(x) = e^x. Calculez u\'(x) et v\'(x).',
      'Appliquez la formule (uv)\' = u\'v + uv\'.',
      'N\'oubliez pas que e^x est strictement positif pour tout réel x, le signe de f\' dépend donc uniquement du polynôme.'
    ],
    sampleSolution: '1. On pose u(x) = 2x - 3 donc u\'(x) = 2. On pose v(x) = e^x donc v\'(x) = e^x.\nf\'(x) = 2e^x + (2x - 3)e^x = (2 + 2x - 3)e^x = (2x - 1)e^x.\n2. Pour tout x ∈ ℝ, e^x > 0. Le signe de f\'(x) est donc celui de 2x - 1.\n- Pour x < 1/2 : f\'(x) < 0 (f est strictement décroissante).\n- Pour x = 1/2 : f\'(1/2) = 0 (minimum local valant f(1/2) = -2e^(0.5)).\n- Pour x > 1/2 : f\'(x) > 0 (f est strictement croissante).',
    keyFormulas: ['(uv)\' = u\'v + uv\'', '∀x ∈ ℝ, e^x > 0']
  },
  {
    id: 'ex-phys-1',
    subject: 'physique',
    topic: 'Deuxième loi de Newton & Chute libre',
    difficulty: 'moyen',
    question: 'Une bille de masse m = 150 g est lâchée sans vitesse initiale à t = 0 d\'une hauteur h = 20 m au-dessus du sol. On néglige tout frottement de l\'air (g = 9.81 m/s²).\n1. Établir l\'équation différentielle du mouvement selon l\'axe vertical descendant (Oz).\n2. Déterminer l\'expression de la vitesse v(t) et de la position z(t).\n3. Calculer la durée nécessaire pour atteindre le sol.',
    context: 'Niveau Terminale : Application rigoureuse de la 2nde loi de Newton dans un référentiel terrestre supposé galiléen.',
    hints: [
      'Définissez bien le système (la bille), le référentiel et le bilan des forces extérieures (uniquement le poids P).',
      'Appliquez ∑ F_ext = m·a.',
      'Projetez sur l\'axe vertical et intégrez deux fois par rapport au temps en tenant compte des conditions initiales à t=0.'
    ],
    sampleSolution: '1. Système : bille de masse m. Référentiel terrestre supposé galiléen. Force : P = mg vers le bas. 2nde loi : P = ma => mg = ma => a(t) = g = 9.81 m/s².\n2. Intégration avec v(0) = 0 : v(t) = g·t.\nPosition avec z(0) = 0 : z(t) = 1/2 g·t².\n3. Arrivée au sol lorsque z(t) = h = 20 m :\n1/2 g t² = 20 => t² = 40 / 9.81 ≈ 4.077 => t ≈ 2.02 secondes.',
    keyFormulas: ['∑ F_ext = m · a', 'z(t) = 1/2 g t² + v₀ t + z₀']
  },
  {
    id: 'ex-philo-1',
    subject: 'philosophie',
    topic: 'La liberté et l\'État',
    difficulty: 'difficile',
    question: '« L\'obéissance à la loi est-elle la condition ou la négation de la liberté ? » Rédigez une introduction complète de dissertation comprenant : amorce, définition des termes, problème philosophique (paradoxe) et annonce de plan en trois parties.',
    context: 'Épreuve écrite du Baccalauréat : Rigueur conceptuelle (distinction entre licence, liberté naturelle et liberté civile selon Rousseau).',
    hints: [
      'Opposez le sens commun (la loi comme contrainte qui réduit le choix) à la thèse républicaine de Rousseau (le contrat social).',
      'Définissez la "liberté" : pure absence d\'entrave (Hobbes) vs autonomie et loi qu\'on s\'est prescrite (Rousseau/Kant).',
      'Formulez la question centrale sous forme de tension aporétique.'
    ],
    sampleSolution: 'Introduction type :\n- Amorce : Spontanément, l\'individu perçoit la règle et l\'interdit juridique comme une entrave à ses désirs immédiats.\n- Définition : La liberté ne se réduit pourtant pas à la licence (faire tout ce qui plaît), mais implique la sécurité et l\'autonomie morale.\n- Problème : Comment la soumission à une contrainte légale peut-elle fonder l\'affranchissement individuel au lieu de l\'asservir ?\n- Annonce de plan :\nI. En apparence, la loi restreint la liberté naturelle au nom de l\'ordre social.\nII. Cependant, l\'état de nature soumet l\'homme à la tyrannie du plus fort : la loi commune est donc la garantie de la liberté civile.\nIII. Plus encore, l\'obéissance à la loi démocratique réalise la liberté politique comme autonomie : obéir à la loi que le peuple s\'est donnée, c\'est n\'obéir à aucun maître.',
    keyFormulas: ['« L\'obéissance à la loi qu\'on s\'est prescrite est liberté » (Rousseau)']
  }
];

export const SAMPLE_QUIZ_POOL: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Pour une équation ax² + bx + c = 0 avec a ≠ 0, que signifie un discriminant Δ = b² - 4ac strictement négatif dans l\'ensemble des réels ℝ ?',
    options: [
      'L\'équation admet deux solutions distinctes opposées',
      'L\'équation n\'admet aucune solution réelle',
      'L\'équation admet une solution unique nulle',
      'L\'équation admet une infinité de solutions réelles'
    ],
    correctIndex: 1,
    explanation: 'Lorsque Δ < 0, la racine carrée √Δ n\'est pas définie dans ℝ. La parabole ne coupe jamais l\'axe des abscisses, il n\'y a donc aucune solution réelle.',
    conceptTag: 'Équations du 2nd degré',
    difficulty: 'facile'
  },
  {
    id: 'q2',
    question: 'Quelle est la dérivée de la fonction f(x) = ln(3x² + 1) sur ℝ ?',
    options: [
      'f\'(x) = 1 / (3x² + 1)',
      'f\'(x) = 6x / (3x² + 1)',
      'f\'(x) = 6x · ln(3x² + 1)',
      'f\'(x) = 3 / (3x² + 1)'
    ],
    correctIndex: 1,
    explanation: 'Pour une fonction composée ln(u(x)), la règle de dérivation est (ln(u))\' = u\' / u. Ici u(x) = 3x² + 1 d\'où u\'(x) = 6x, donc f\'(x) = 6x / (3x² + 1).',
    conceptTag: 'Dérivation & Logarithmes',
    difficulty: 'moyen'
  },
  {
    id: 'q3',
    question: 'En mécanique classique, dans un mouvement circulaire uniforme de rayon R à vitesse v constante, que vaut le vecteur accélération ?',
    options: [
      'Nul car la norme de la vitesse ne varie pas',
      'Tangentiel de valeur v² / R',
      'Centripète (orienté vers le centre) de valeur v² / R',
      'Centrifuge de valeur v / R²'
    ],
    correctIndex: 2,
    explanation: 'Bien que la norme de la vitesse soit constante, la direction du vecteur vitesse tourne constamment. L\'accélération est purement normale (centripète) dirigée vers le centre, de norme a_N = v² / R.',
    conceptTag: 'Mécanique de Newton',
    difficulty: 'moyen'
  },
  {
    id: 'q4',
    question: 'Quelle figure de style consiste à employer un mot pour désigner un objet par une de ses parties significatives (ex: « cent voiles » pour cent bateaux) ?',
    options: [
      'Une métonymie ou synecdoque',
      'Une oxymore',
      'Une antiphrase',
      'Une anaphore'
    ],
    correctIndex: 0,
    explanation: 'La synecdoque (cas particulier de métonymie) exprime la partie pour le tout (« un toit » pour une maison, « les voiles » pour les navires).',
    conceptTag: 'Figures de style & Rhétorique',
    difficulty: 'facile'
  },
  {
    id: 'q5',
    question: 'Durant la Guerre Froide, quel événement survenu en octobre 1962 est généralement considéré comme le paroxysme des tensions nucléaires ?',
    options: [
      'Le blocus de Berlin',
      'La crise des missiles de Cuba',
      'La construction du mur de Berlin',
      'L\'incident de la Baie des Cochons'
    ],
    correctIndex: 1,
    explanation: 'La crise des missiles de Cuba (octobre 1962) opposa Kennedy et Khrouchtchev après la découverte de bases de missiles soviétiques à Cuba, frôlant un conflit thermonucléaire mondial direct.',
    conceptTag: 'Guerre Froide',
    difficulty: 'facile'
  },
  {
    id: 'q6',
    question: 'En mathématiques, si une suite (u_n) est croissante et majorée par un réel M, que peut-on affirmer avec certitude ?',
    options: [
      'Elle diverge vers +∞',
      'Elle est constante à partir d\'un certain rang',
      'Elle converge vers une limite finie L ≤ M',
      'Elle oscille périodiquement'
    ],
    correctIndex: 2,
    explanation: 'D\'après le théorème de convergence monotone, toute suite croissante et majorée converge vers une limite réelle finie L, et L ≤ M.',
    conceptTag: 'Suites numériques',
    difficulty: 'moyen'
  },
  {
    id: 'q7',
    question: 'Quelle est la définition philosophique de l\'« impératif catégorique » selon Emmanuel Kant ?',
    options: [
      'Un conseil d\'habileté pragmatique pour atteindre le bonheur personnel',
      'Un commandement moral absolu et inconditionné valable universellement',
      'Une règle imposée par la police et sanctionnée par les tribunaux',
      'Un instinct biologique d\'autoconservation de l\'espèce'
    ],
    correctIndex: 1,
    explanation: 'Pour Kant, l\'impératif catégorique ordonne l\'action pour elle-même, indépendamment de toute fin extérieure ou utilitaire (« Agis uniquement d\'après la maxime qui fait que tu peux vouloir en même temps qu\'elle devienne une loi universelle »).',
    conceptTag: 'Morale & Liberté',
    difficulty: 'difficile'
  }
];

export const OFFICIAL_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'bac-maths-2026',
    title: 'Épreuve Blanche de Mathématiques — Type Bac Général (Spécialité)',
    subject: 'maths',
    level: 'lycee_terminale',
    durationMinutes: 45, // condensed simulation for web app testing, but realistically framed
    totalPoints: 20,
    officialInstructions: 'Le sujet comporte 3 exercices indépendants. La clarté des raisonnements, la précision des justifications et la qualité de la rédaction seront prises en compte dans la notation à hauteur de 3 points sur 20.',
    sections: [
      {
        id: 'sec-1',
        title: 'Exercice 1 : Étude de fonction, convexité et primitives',
        points: 7,
        description: 'Soit f la fonction définie sur [0 ; +∞[ par f(x) = (3x + 1) e^(-x).',
        questions: [
          {
            id: 'q1-1',
            number: '1.',
            text: 'Déterminer la limite de f en +∞. Justifier rigoureusement en citant le théorème de croissance comparée.',
            points: 2,
            expectedCriteria: ['Factorisation ou forme indéterminée levée', 'Application propre de lim x e^-x = 0', 'Conclusion nette : lim f(x) = 0']
          },
          {
            id: 'q1-2',
            number: '2.',
            text: 'Calculer la fonction dérivée f\'(x) et démontrer que pour tout x ≥ 0, f\'(x) = (2 - 3x) e^(-x). Dresser le tableau de variations complet.',
            points: 3,
            expectedCriteria: ['Dérivation du produit (uv)\'', 'Factorisation par e^(-x)', 'Étude du signe de (2 - 3x)', 'Calcul du maximum f(2/3)']
          },
          {
            id: 'q1-3',
            number: '3.',
            text: 'Étudier la convexité de f sur [0 ; +∞[ en calculant la dérivée seconde f\'\'(x). Préciser les coordonnées de l\'éventuel point d\'inflexion.',
            points: 2,
            expectedCriteria: ['Calcul de f\'\'(x)', 'Recherche de l\'annulation avec changement de signe', 'Coordonnées exactes du point d\'inflexion']
          }
        ]
      },
      {
        id: 'sec-2',
        title: 'Exercice 2 : Probabilités & Arbres pondérés',
        points: 6,
        description: 'Un laboratoire pharmaceutique teste un dispositif de dépistage rapide.',
        questions: [
          {
            id: 'q2-1',
            number: '1.',
            text: 'Traduire l\'énoncé par un arbre pondéré complet et calculer la probabilité totale que le test soit positif P(T).',
            points: 3,
            expectedCriteria: ['Arbre avec branches et probabilités associées', 'Formule des probabilités totales citée et appliquée']
          },
          {
            id: 'q2-2',
            number: '2.',
            text: 'Sachant que le test d\'un patient est positif, calculer la probabilité P_T(M) qu\'il soit réellement malade (valeur prédictive positive). Commenter le résultat.',
            points: 3,
            expectedCriteria: ['Formule de Bayes ou conditionnelle P(M ∩ T) / P(T)', 'Calcul numérique arrondi à 10⁻³', 'Interprétation critique du paradoxe des faux positifs']
          }
        ]
      },
      {
        id: 'sec-3',
        title: 'Exercice 3 : Suites & Raisonnement par récurrence',
        points: 7,
        description: 'On considère la suite (u_n) définie par u₀ = 1 et pour tout n ∈ ℕ, u_{n+1} = 0.5 u_n + 3.',
        questions: [
          {
            id: 'q3-1',
            number: '1.',
            text: 'Démontrer par récurrence que pour tout entier naturel n, u_n ≤ 6.',
            points: 3,
            expectedCriteria: ['Initialisation pour n=0', 'Hypothèse de récurrence posée', 'Hérédité rigoureusement démontrée', 'Conclusion']
          },
          {
            id: 'q3-2',
            number: '2.',
            text: 'Montrer que la suite (u_n) est strictement croissante. En déduire qu\'elle converge et déterminer sa limite L.',
            points: 4,
            expectedCriteria: ['Calcul de u_{n+1} - u_n', 'Justification du signe grâce à la question précédente', 'Théorème de la convergence monotone cité', 'Résolution de l\'équation de point fixe L = 0.5 L + 3']
          }
        ]
      }
    ]
  },
  {
    id: 'brevet-hist-2026',
    title: 'Épreuve Blanche Brevet — Histoire-Géographie & EMC (Collège 3e)',
    subject: 'histoire',
    level: 'college_4_3',
    durationMinutes: 30,
    totalPoints: 20,
    officialInstructions: 'L\'épreuve évalue la maîtrise des repères chronologiques, la capacité à analyser un document historique et la précision de la rédaction argumentée.',
    sections: [
      {
        id: 'sec-b1',
        title: 'Partie 1 : Histoire — Civils et militaires dans la Première Guerre mondiale',
        points: 10,
        description: 'Analyse d\'un extrait de lettre de poilu et d\'une affiche de propagande de l\'arrière (1916).',
        questions: [
          {
            id: 'qb-1',
            number: '1.',
            text: 'Présentez les deux documents (nature, auteur, date, contexte historique de la guerre de tranchées).',
            points: 4,
            expectedCriteria: ['Identification complète du contexte', 'Vocabulaire adapté (tranchées, guerre totale, bourrage de crâne)']
          },
          {
            id: 'qb-2',
            number: '2.',
            text: 'Dans un développement construit d\'environ 15 à 20 lignes, expliquez comment la Première Guerre mondiale a constitué une guerre totale impliquant le front et l\'arrière.',
            points: 6,
            expectedCriteria: ['Mobilisation humaine (soldats, femmes dans les usines)', 'Mobilisation économique et financière', 'Mobilisation des esprits et censure']
          }
        ]
      },
      {
        id: 'sec-b2',
        title: 'Partie 2 : Géographie — Les aires urbaines en France',
        points: 10,
        description: 'Organisation spatiale du territoire français métropolitain.',
        questions: [
          {
            id: 'qb-3',
            number: '1.',
            text: 'Nommez les trois composantes d\'une aire urbaine et expliquez le phénomène de périurbanisation.',
            points: 5,
            expectedCriteria: ['Ville-centre, banlieue, couronne périurbaine', 'Migrations pendulaires et recherche de logements individuels']
          },
          {
            id: 'qb-4',
            number: '2.',
            text: 'Quelles sont les conséquences environnementales et en termes de transport liées à l\'étalement urbain ?',
            points: 5,
            expectedCriteria: ['Dépendance à la voiture individuelle', 'Artificialisation des sols agricoles', 'Émissions de gaz à effet de serre']
          }
        ]
      }
    ]
  }
];

export const SAMPLE_COURSE_TEXT = `LES LOIS DE NEWTON ET LE MOUVEMENT D'UN CORPS

1. Définition du système et du référentiel
En mécanique classique, toute analyse d'un mouvement nécessite de définir au préalable :
- Le système étudié (le corps matériel modélisé par son centre de masse G affecté de la masse totale m).
- Le référentiel d'étude (souvent le référentiel terrestre supposé galiléen pour des expériences de courte durée devant la période de rotation de la Terre).
- Le repère d'espace (O, i, j, k) et l'origine des dates (t = 0).

2. Vecteurs cinématiques fondamentaux
- Vecteur position : OM(t) = x(t)i + y(t)j + z(t)k
- Vecteur vitesse : v(t) = d(OM)/dt (tangent à la trajectoire au point considéré)
- Vecteur accélération : a(t) = dv/dt = d²(OM)/dt² (orienté vers l'intérieur de la concavité de la trajectoire)

3. Les trois lois de Newton
• Première loi (Principe d'inertie) :
Dans un référentiel galiléen, si la somme vectorielle des forces extérieures appliquées à un système est nulle (∑ F_ext = 0), alors son centre d'inertie G est soit au repos, soit animé d'un mouvement rectiligne uniforme (v = constante).

• Deuxième loi (Principe fondamental de la dynamique) :
Dans un référentiel galiléen, la somme des forces extérieures appliquées à un système de masse constante m est égale au produit de sa masse par le vecteur accélération de son centre d'inertie :
∑ F_ext = m · a_G = m · (dv_G / dt)

• Troisième loi (Principe des actions réciproques) :
Pour deux corps A et B en interaction, la force exercée par A sur B est rigoureusement opposée à celle exercée par B sur A :
F_{A/B} = - F_{B/A}

4. Application à la chute libre parabolique
Dans le cas d'un projectile lancé dans le champ de pesanteur uniforme g sans frottements d'air :
La seule force est le poids P = m · g.
D'après la 2ème loi : m · g = m · a => a(t) = g.
L'accélération est indépendante de la masse du corps (universalité de la chute libre découverte par Galilée).
Par intégration successive, on obtient les équations horaires et l'équation de la trajectoire z(x) qui est une parabole tournée vers le bas.`;
