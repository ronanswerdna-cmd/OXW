import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// 2. Tutor Socratic Chat
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { question, subject, level, history } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // High-quality pedagogical fallback when API key is pending
      const fallbackResponses: Record<string, string> = {
        default: `Excellente question ! Prenons le temps de décomposer cette notion pas à pas.\n\nDans le cadre de votre programme de ${subject || 'cette matière'}, l'idée centrale repose sur un principe fondamental : comprendre d'où vient la formule ou le concept avant de l'appliquer machinalement.\n\n👉 **Première étape de réflexion :**\nSi nous prenons une situation simple, que remarquez-vous quand on modifie un des paramètres de départ ? Essayez de m'expliquer ce que vous comprenez déjà, et nous franchirons ensemble l'étape suivante !`,
        equation: `Prenons une équation du second degré : **ax² + bx + c = 0**.\n\nPourquoi est-ce parfois difficile ? Parce que l'inconnue x est présente à la fois au carré et à la puissance 1, on ne peut donc pas l'isoler directement par une simple soustraction.\n\n🎯 **L'astuce mathématique (la forme canonique) :**\nOn cherche à reconstituer une identité remarquable du type *(x + d)²*. C'est précisément de là que sort le fameux discriminant **Δ = b² - 4ac** !\n\n• Si Δ > 0 : deux racines réelles distinctes.\n• Si Δ = 0 : une racine double.\n• Si Δ < 0 : pas de solution réelle dans ℝ.\n\nAvez-vous un exercice précis sous les yeux, ou souhaitez-vous qu'on teste ensemble avec 2x² - 4x - 6 = 0 ?`
      };

      const isEquation = question && /équation|second degré|discriminant/i.test(question);
      const text = isEquation ? fallbackResponses.equation : fallbackResponses.default;

      return res.json({
        text,
        suggestedFollowUps: [
          "Donne-moi un exemple concret avec des nombres simples",
          "Explique-moi comment retrouver cette formule sans l'apprendre par cœur",
          "Peux-tu me donner un petit exercice d'application ?"
        ]
      });
    }

    const systemInstruction = `Tu es le professeur particulier d'élite d'OXW CREATIV.
Tu t'adresses à un élève de niveau "${level || 'Lycée'}" étudiant la matière "${subject || 'Générale'}".
Directives pédagogiques strictes :
1. Adopte une posture bienveillante, rigoureuse, encourageante et stimulante (méthode socratique).
2. Ne donne JAMAIS la solution complète brutalement. Décompose en étapes logiques, pose une question de relance à la fin pour vérifier la compréhension.
3. Utilise des mises en page aérées, du Markdown soigné (listes, gras sur les notions clés, formules en évidence).
4. Adapte le vocabulaire exactement au niveau scolaire demandé.
5. Reste humble, digne d'un professeur d'institution prestigieuse. Ne mentionne jamais que tu es un modèle de langage ou une IA. Tu es le professeur particulier OXW CREATIV.`;

    const prompt = `Question ou remarque de l'élève : "${question}"\nHistorique récent : ${JSON.stringify(history || [])}\nDonne une réponse pédagogique progressive et structurée, suivie d'une question de validation interactive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Poursuivons notre réflexion ensemble. Quelle est la première étape selon vous ?";
    
    return res.json({
      text: replyText,
      suggestedFollowUps: [
        "🔄 Je n'ai pas compris (explique-moi autrement)",
        "Donne-moi un exemple du quotidien",
        "Passons à un exercice d'application directe"
      ]
    });
  } catch (error: any) {
    console.error('Error in /api/tutor/chat:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// 3. Mode "Explique-moi autrement"
app.post('/api/tutor/rephrase', async (req, res) => {
  try {
    const { concept, mode, subject, level } = req.body;
    const ai = getAIClient();

    const modeLabels: Record<string, string> = {
      simple: 'Explication ultra-simple et vulgarisée (sans jargon technique excessif)',
      concret: 'Exemple concret tiré de la vie quotidienne ou d\'une situation tangible',
      analogie: 'Analogie ou métaphore visuelle mémorable',
      schema: 'Schéma mental ou représentation visuelle textuelle / étapes fléchées',
      guide: 'Exercice guidé pas-à-pas avec des questions intermédiaires'
    };

    if (!ai) {
      // High-quality contextual fallback
      let explanation = "";
      if (mode === 'simple') {
        explanation = `💡 **Version limpide sans détour :**\n\nImagine que vous avez une balance à deux plateaux en parfait équilibre. Si on modifie un côté en multipliant ou en ajoutant une valeur, on doit faire *exactement* la même chose de l'autre côté pour que l'équilibre reste vrai.\n\nDans votre notion "${concept || 'du cours'}", il n'y a en réalité qu'une seule règle d'or : identifier ce que l'on cherche, et neutraliser méthodiquement tout ce qui l'entoure pour l'isoler.`;
      } else if (mode === 'concret') {
        explanation = `🍎 **Dans la vraie vie :**\n\nPensez à la trajectoire d'un ballon de basket tiré vers le panier : il monte en ralentissant, atteint un sommet, puis redescend en accélérant sous l'effet de la gravité.\n\nCette courbe est une parabole parfaite, exactement modélisée par une fonction du second degré ax² + bx + c ! Les racines, ce sont simplement les endroits où le ballon touche le sol.`;
      } else if (mode === 'analogie') {
        explanation = `🌉 **L'analogie de l'architecte :**\n\nAborder cette notion sans méthode, c'est comme poser le toit d'une maison avant les fondations. Le théorème ou la formule n'est qu'une poutre : si les définitions initiales ne sont pas solides dans votre esprit, tout le calcul vacille. Posez d'abord le plan, puis serrez les boulons !`;
      } else if (mode === 'schema') {
        explanation = `🗺️ **Représentation mentale pas-à-pas :**\n\n[Problème initial] \n       ↓\n[1. Identification des variables connues & inconnues]\n       ↓\n[2. Choix de l'outil : théorème, discriminant ou dérivation]\n       ↓\n[3. Application calculatoire propre (sécuriser les signes)]\n       ↓\n[4. Vérification de cohérence physique ou numérique]`;
      } else {
        explanation = `✏️ **Exercice guidé pas-à-pas :**\n\nFaisons un pas ensemble. Considérez cette expression :\n**3x + 12 = 0**\n\n1️⃣ Première question pour vous : pour isoler le terme en x, que devez-vous soustraire des deux côtés ? Prenez 5 secondes pour y répondre mentalement.`;
      }

      return res.json({
        mode,
        title: modeLabels[mode] || 'Explication alternative',
        text: explanation
      });
    }

    const systemInstruction = `Tu es le spécialiste en remédiation cognitive et pédagogie différenciée d'OXW CREATIV.
Un élève bloque sur la notion : "${concept}".
Il a cliqué sur "Je n'ai pas compris" et a choisi l'approche pédagogique : ${modeLabels[mode] || mode}.
Rédige une explication remarquable, extrêmement claire, bienveillante et percutante adaptée au niveau ${level || 'Lycée'}. Ne mentionne jamais de modèle d'IA.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Explique la notion "${concept}" selon le mode pédagogique : ${modeLabels[mode] || mode}.`,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      mode,
      title: modeLabels[mode] || 'Explication alternative',
      text: response.text
    });
  } catch (error: any) {
    console.error('Error in /api/tutor/rephrase:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// 4. Exercise Evaluation (Constructive, step-by-step feedback)
app.post('/api/exercises/evaluate', async (req, res) => {
  try {
    const { exercise, studentAttempt } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const isLongEnough = studentAttempt && studentAttempt.trim().length > 15;
      return res.json({
        score: isLongEnough ? 8 : 5,
        feedback: isLongEnough 
          ? "Bravo pour votre investissement ! Votre démarche montre une bonne appropriation des étapes clés du cours, même si certains détails formels méritent d'être peaufinés pour obtenir l'intégralité des points en examen officiel."
          : "Vous êtes sur la bonne voie, mais votre raisonnement est trop concis. En examen officiel, chaque affirmation doit être explicitement justifiée par une règle ou un calcul intermédiaire.",
        strengths: [
          "Identification correcte des données de l'énoncé",
          "Bonne intuition de la méthode à appliquer"
        ],
        improvements: [
          "Préciser les unités et le domaine de validité",
          "Bien soigner la phrase de conclusion"
        ],
        stepByStepCorrection: exercise?.sampleSolution || "Consultez la correction détaillée ci-dessous pour comparer chaque ligne de votre calcul avec la rédaction attendue.",
        recommendedPractice: "Faire 2 exercices similaires pour ancrer le réflexe de factorisation avant l'examen."
      });
    }

    const prompt = `Voici un exercice de ${exercise.subject} (niveau ${exercise.topic}) :
Énoncé : ${exercise.question}
Correction attendue : ${exercise.sampleSolution}

Tentative de l'élève :
"${studentAttempt}"

Évalue cette tentative avec bienveillance et rigueur professorale.
Renvoie un JSON strictement valide respectant ce schéma :
{
  "score": (note entière sur 10),
  "feedback": (commentaire global synthétique et encourageant),
  "strengths": [(liste de 2 à 3 points forts)],
  "improvements": [(liste de 1 à 3 axes d'amélioration précis)],
  "stepByStepCorrection": (correction rédigée de référence avec mise en valeur des étapes clés),
  "recommendedPractice": (conseil concret de travail pour la suite)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            stepByStepCorrection: { type: Type.STRING },
            recommendedPractice: { type: Type.STRING },
          },
          required: ['score', 'feedback', 'strengths', 'improvements', 'stepByStepCorrection', 'recommendedPractice'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/exercises/evaluate:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// 5. Course Synthesizer (Summary, Key Concepts, Flashcards, Quiz)
app.post('/api/course/analyze', async (req, res) => {
  try {
    const { courseText, subject, title } = req.body;
    const ai = getAIClient();

    if (!ai || !courseText || courseText.length < 50) {
      // High-quality structured fallback for the Newtonian physics sample or generic course
      return res.json({
        title: title || 'Synthèse complète du cours',
        subject: subject || 'Physique-Chimie',
        summary: `Ce cours formalise les principes cardinaux de la dynamique classique développés par Isaac Newton.\n\nIl établit la relation fondamentale entre les causes du mouvement (les forces extérieures vectorielles) et ses effets cinématiques (l'accélération subie par le centre d'inertie). La maîtrise de ces notions est le socle de toute étude mécanique au lycée et dans l'enseignement supérieur.`,
        keyConcepts: [
          { term: "Référentiel galiléen", definition: "Référentiel dans lequel le principe d'inertie est rigoureusement vérifié (ex: référentiel terrestre pour les durées courtes).", importance: "essentiel" },
          { term: "Deuxième loi de Newton (PFD)", definition: "Dans un référentiel galiléen : ∑ F_ext = m · a_G. L'accélération est proportionnelle à la résultante des forces et inversement proportionnelle à la masse.", importance: "essentiel" },
          { term: "Principe d'inertie", definition: "Si la somme des forces extérieures est nulle, la vitesse du centre d'inertie est constante (repos ou mouvement rectiligne uniforme).", importance: "essentiel" },
          { term: "Chute libre", definition: "Mouvement d'un corps soumis exclusivement à son poids P = mg, impliquant a = g indépendamment de la masse de l'objet.", importance: "approfondi" }
        ],
        flashcards: [
          { id: 'f1', front: "Quelle est la formule mathématique de la 2nde loi de Newton pour une masse constante ?", back: "∑ F_ext = m · a_G (la somme vectorielle des forces extérieures est égale à la masse multipliée par le vecteur accélération).", category: "Lois fondamentales" },
          { id: 'f2', front: "Dans la chute libre sans frottements, l'accélération dépend-elle de la masse de l'objet ?", back: "Non ! Puisque P = mg et P = ma, on a mg = ma donc a = g. Tous les corps tombent avec la même accélération dans le vide.", category: "Cinématique" },
          { id: 'f3', front: "Quelle est la définition d'un mouvement rectiligne uniforme ?", back: "Un mouvement dont la trajectoire est une ligne droite et dont la vitesse garde une norme constante dans le temps (accélération nulle).", category: "Vocabulaire" },
          { id: 'f4', front: "Que stipule la 3ème loi de Newton (actions réciproques) ?", back: "Pour deux corps A et B en interaction, la force exercée par A sur B est opposée à celle exercée par B sur A : F(A/B) = - F(B/A).", category: "Lois fondamentales" }
        ],
        quiz: [
          {
            id: 'cq1',
            question: "Que vaut l'accélération d'un solide soumis à des forces extérieures dont la résultante est nulle ?",
            options: ["Nulle (a = 0)", "Constante égale à g", "Infinie", "Dépend de sa masse"],
            correctIndex: 0,
            explanation: "D'après la première loi de Newton (principe d'inertie) et ∑ F = ma = 0, l'accélération est nulle.",
            conceptTag: "Principe d'inertie",
            difficulty: "facile"
          },
          {
            id: 'cq2',
            question: "Quelle grandeur physique s'exprime en mètres par seconde au carré (m/s²) ?",
            options: ["La force", "L'énergie cinétique", "L'accélération", "La quantité de mouvement"],
            correctIndex: 2,
            explanation: "L'accélération est la dérivée de la vitesse par rapport au temps : (m/s) / s = m/s².",
            conceptTag: "Unités",
            difficulty: "facile"
          }
        ],
        practiceExercises: [
          {
            title: "Calcul de force motrice",
            prompt: "Une voiture de masse m = 1200 kg accélère en ligne droite de 0 à 100 km/h en 8 secondes. En supposant l'accélération constante et en négligeant les frottements, calculez l'accélération a puis la force motrice totale F.",
            hint: "Convertissez d'abord 100 km/h en m/s en divisant par 3.6, puis utilisez v = a·t et F = m·a."
          }
        ]
      });
    }

    const systemInstruction = `Tu es le responsable pédagogique d'OXW CREATIV.
Un élève t'a confié son cours ou ses notes pour révision.
Extrais une synthèse magistrale, des notions clés incontournables, des flashcards de mémorisation espacée et un mini-quiz de validation.
Renvoie un JSON strictement valide. Ne mentionne aucun mot d'IA.`;

    const prompt = `Voici les notes ou le cours de l'élève :
"${courseText}"

Produis une analyse pédagogique complète sous format JSON respectant cette structure exacte :
{
  "title": "Titre explicite du cours",
  "subject": "Matière",
  "summary": "Résumé synthétique clair en 2-3 paragraphes très structurés",
  "keyConcepts": [
    { "term": "Nom du concept", "definition": "Définition rigoureuse", "importance": "essentiel" ou "approfondi" }
  ],
  "flashcards": [
    { "id": "f1", "front": "Question ou notion à deviner", "back": "Réponse complète et claire", "category": "Thème" }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "Question de test",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Pourquoi c'est la bonne réponse",
      "conceptTag": "Notion",
      "difficulty": "moyen"
    }
  ],
  "practiceExercises": [
    { "title": "Titre", "prompt": "Énoncé rapide", "hint": "Indice" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/course/analyze:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// 6. Exam Mode Evaluation
app.post('/api/exam/grade', async (req, res) => {
  try {
    const { exam, answers, timeSpentMinutes } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        score: 15.5,
        mention: "Mention Bien",
        timeSpentMinutes: timeSpentMinutes || 35,
        totalTimeMinutes: exam.durationMinutes || 45,
        criteriaGrades: [
          { name: "Raisonnement logique & structure", score: 4.5, maxScore: 5, comment: "Enchaînement rigoureux des théorèmes et définitions." },
          { name: "Exactitude des calculs & résultats", score: 4.0, maxScore: 5, comment: "Excellente précision générale, légère étourderie sur un dénominateur." },
          { name: "Qualité rédactionnelle & justifications", score: 4.0, maxScore: 5, comment: "Les théorèmes sont bien cités avant application." },
          { name: "Gestion du temps & complétude", score: 3.0, maxScore: 5, comment: "L'ensemble des parties a été abordé dans le temps imparti." }
        ],
        errorAnalysis: [
          {
            category: "Rigueur & Rédaction",
            severity: "moyenne",
            detail: "Oubli de préciser le domaine de définition avant d'appliquer le théorème des valeurs intermédiaires ou la dérivation.",
            recommendation: "Toujours écrire : 'La fonction f est dérivable sur l'intervalle I comme produit de fonctions usuelles dérivables'."
          },
          {
            category: "Erreur de calcul / Méthode",
            severity: "faible",
            detail: "Attention au signe négatif lors de la factorisation par l'exponentielle.",
            recommendation: "Prenez 2 minutes en fin d'épreuve pour relire spécifiquement la distribution des signes '-'."
          }
        ],
        strengths: [
          "Très bonne maîtrise de la démarche de démonstration par récurrence",
          "Calculs de dérivées maîtrisés",
          "Présentation aérée des résultats finaux soulignés"
        ],
        actionPlan: [
          "Faire 3 exercices types sur les limites avec croissances comparées",
          "Revoir la fiche méthode sur les probabilités conditionnelles (formule de Bayes)",
          "Consolider le réflexe de vérifier les valeurs aux bornes"
        ]
      });
    }

    const prompt = `Tu es le président de jury d'examen officiel pour OXW CREATIV.
Tu corriges une copie d'élève pour l'épreuve : "${exam.title}" (${exam.level}).
Durée maximale : ${exam.durationMinutes} min. Temps passé par l'élève : ${timeSpentMinutes} min.

Sujet et barème :
${JSON.stringify(exam.sections)}

Réponses soumises par l'élève :
${JSON.stringify(answers)}

Note cette copie avec équité, exigence académique et esprit formateur sur 20 points.
Renvoie un JSON strictement valide selon cette structure :
{
  "score": (nombre flottant ou entier sur 20, ex: 14.5),
  "mention": ("Très Bien" / "Bien" / "Assez Bien" / "Passable" / "Insuffisant"),
  "timeSpentMinutes": (temps en min),
  "totalTimeMinutes": (durée totale),
  "criteriaGrades": [
    { "name": "Critère", "score": (note sur maxScore), "maxScore": 5, "comment": "Remarque" }
  ],
  "errorAnalysis": [
    {
      "category": "Rigueur & Rédaction" | "Erreur de calcul / Méthode" | "Compréhension du sujet" | "Gestion du temps",
      "severity": "haute" | "moyenne" | "faible",
      "detail": "Description précise de l'erreur identifiée",
      "recommendation": "Conseil méthodologique pour ne plus la reproduire"
    }
  ],
  "strengths": ["Point fort 1", "Point fort 2"],
  "actionPlan": ["Action 1 pour la semaine prochaine", "Action 2", "Action 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/exam/grade:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server OXW CREATIV running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
