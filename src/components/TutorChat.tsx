import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  ArrowRight,
  SplitSquareVertical,
  CheckCircle,
  MessageSquare,
  Compass
} from 'lucide-react';
import { ChatMessage, SubjectId, LevelId, RephraseMode } from '../types';
import { SUBJECTS, LEVELS } from '../data/curriculum';

interface TutorChatProps {
  activeSubject: SubjectId;
  activeLevel: LevelId;
  initialTopic?: string;
  onNavigateToExercises?: () => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({
  activeSubject,
  activeLevel,
  initialTopic,
  onNavigateToExercises
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: `Bonjour ! Je suis votre professeur particulier pour **${
        SUBJECTS.find(s => s.id === activeSubject)?.name || 'vos cours'
      }** (${LEVELS.find(l => l.id === activeLevel)?.label || 'Lycée'}).\n\nQue ce soit pour débloquer une notion complexe, vérifier une méthode ou préparer une épreuve, dites-moi sur quel sujet vous souhaitez travailler aujourd'hui !`,
      timestamp: 'À l\'instant',
      suggestedFollowUps: [
        "Je ne comprends pas les équations du second degré.",
        "Comment bien structurer une dissertation de français ?",
        "Peux-tu m'expliquer la deuxième loi de Newton ?"
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [activeRephraseMessageId, setActiveRephraseMessageId] = useState<string | null>(null);
  const [rephrasingMode, setRephrasingMode] = useState<RephraseMode | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Read aloud helper
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speechActive) {
      window.speechSynthesis.cancel();
      setSpeechActive(false);
      return;
    }
    // Strip markdown formatting for cleaner speech
    const clean = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);
    setSpeechActive(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: 'À l\'instant'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query.trim(),
          subject: SUBJECTS.find(s => s.id === activeSubject)?.name,
          level: LEVELS.find(l => l.id === activeLevel)?.label,
          history: messages.slice(-4).map(m => ({ role: m.sender, content: m.text }))
        })
      });

      const data = await response.json();
      const tutorMsg: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: 'tutor',
        text: data.text || "Poursuivons notre réflexion ensemble. Quelle est la première étape selon vous ?",
        timestamp: 'À l\'instant',
        suggestedFollowUps: data.suggestedFollowUps || [
          "🔄 Je n'ai pas compris (explique-moi autrement)",
          "Donne-moi un exemple concret",
          "Faisons un exercice ensemble"
        ]
      };
      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      console.error(err);
      // Resilient fallback message
      const tutorMsg: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: 'tutor',
        text: `Prenons un moment pour décomposer cette notion : pour progresser, identifiez d'abord les données que vous connaissez déjà, puis la formule clé à mobiliser.\n\nQuelle est votre première intuition sur ce problème ?`,
        timestamp: 'À l\'instant',
        suggestedFollowUps: [
          "🔄 Je n'ai pas compris (explique-moi autrement)",
          "Donne-moi un exemple simple",
          "Passer à la pratique"
        ]
      };
      setMessages(prev => [...prev, tutorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Feature 5: Mode "Explique-moi autrement"
  const handleRephrase = async (messageText: string, mode: RephraseMode) => {
    setIsLoading(true);
    setRephrasingMode(mode);

    try {
      const response = await fetch('/api/tutor/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: messageText.slice(0, 300),
          mode,
          subject: SUBJECTS.find(s => s.id === activeSubject)?.name,
          level: LEVELS.find(l => l.id === activeLevel)?.label
        })
      });

      const data = await response.json();
      const rephraseMsg: ChatMessage = {
        id: `rephrase-${Date.now()}`,
        sender: 'tutor',
        text: data.text,
        timestamp: 'À l\'instant',
        rephraseSource: {
          originalText: messageText.slice(0, 100) + '...',
          mode
        },
        suggestedFollowUps: [
          "C'est beaucoup plus clair maintenant !",
          "Donne-moi un petit exercice pour tester si j'ai compris",
          "Peux-tu encore détailler une étape ?"
        ]
      };
      setMessages(prev => [...prev, rephraseMsg]);
      setActiveRephraseMessageId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setRephrasingMode(null);
    }
  };

  const rephraseModesList: { id: RephraseMode; label: string; icon: string; desc: string }[] = [
    { id: 'simple', label: 'Explication simple', icon: '💡', desc: 'Vulgarisée sans jargon inutile' },
    { id: 'concret', label: 'Exemple concret', icon: '🍎', desc: 'Ancré dans une situation de la vie réelle' },
    { id: 'analogie', label: 'Analogie imagée', icon: '🌉', desc: 'Une métaphore visuelle marquante' },
    { id: 'schema', label: 'Schéma & étapes', icon: '🗺️', desc: 'Étapes fléchées et repère mental' },
    { id: 'guide', label: 'Exercice guidé', icon: '✏️', desc: 'Résolution pas-à-pas avec questions' }
  ];

  const currentSubject = SUBJECTS.find(s => s.id === activeSubject);
  const currentLevel = LEVELS.find(l => l.id === activeLevel);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Editorial Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 font-serif-title">
            {currentSubject?.name} : {initialTopic || 'Second Degré & Notions Clés'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Session d'apprentissage personnalisée • {currentLevel?.label}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToExercises && (
            <button
              onClick={onNavigateToExercises}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Générer des exercices</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px] sm:h-[660px] relative overflow-hidden">
        
        {/* Chat Sub-header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">
              Votre Professeur IA
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>En ligne & interactif</span>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isTutor = msg.sender === 'tutor';
            const isRephrase = !!msg.rephraseSource;

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isTutor ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm ${
                    isTutor
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isTutor ? 'P' : 'MA'}
                </div>

                {/* Message Bubble & Content */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  
                  {isRephrase && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-tight">
                      <RotateCcw className="w-3 h-3 text-rose-600" />
                      <span>Reformulation pédagogique</span>
                    </div>
                  )}

                  <div
                    className={`leading-relaxed whitespace-pre-line text-sm ${
                      isTutor
                        ? 'bg-slate-50 p-5 rounded-2xl rounded-tl-none border border-slate-100 text-slate-800'
                        : 'bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md shadow-indigo-100'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actions Bar for Tutor Messages */}
                  {isTutor && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      
                      {/* Explique-moi autrement button */}
                      <button
                        id={`rephrase-btn-${msg.id}`}
                        onClick={() => {
                          setActiveRephraseMessageId(
                            activeRephraseMessageId === msg.id ? null : msg.id
                          );
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
                          activeRephraseMessageId === msg.id
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100'
                        }`}
                        title="Explique-moi autrement"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Je n'ai pas compris (explique autrement)</span>
                      </button>

                      {/* Text-to-speech button */}
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        title="Écouter l'explication"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        {speechActive ? <VolumeX className="w-4 h-4 text-indigo-600" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="text-[11px] text-slate-400 ml-auto">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Drawer for "Explique-moi autrement" options */}
                  {activeRephraseMessageId === msg.id && (
                    <div className="mt-3 p-4 bg-white rounded-xl border border-rose-100 shadow-sm space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Comment préférez-vous que je réexplique ?
                        </span>
                        <button
                          onClick={() => setActiveRephraseMessageId(null)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-slate-700"
                        >
                          Fermer
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {rephraseModesList.map((mode) => (
                          <button
                            key={mode.id}
                            id={`rephrase-choice-${mode.id}`}
                            onClick={() => handleRephrase(msg.text, mode.id)}
                            disabled={isLoading}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all flex items-start gap-2.5 text-xs"
                          >
                            <span className="text-base leading-none mt-0.5">{mode.icon}</span>
                            <div>
                              <div className="font-bold text-slate-900">{mode.label}</div>
                              <div className="text-[10px] text-slate-500">{mode.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {isTutor && msg.suggestedFollowUps && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg transition-all text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                P
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                </div>
                <span>Le professeur formule son explication socratique...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              id="tutor-chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question ici (ex: « Je ne comprends pas le calcul du discriminant »)..."
              disabled={isLoading}
              className="flex-1 h-12 px-5 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />

            {/* Explique-moi autrement quick trigger */}
            <button
              type="button"
              onClick={() => {
                const lastTutorMsg = [...messages].reverse().find(m => m.sender === 'tutor');
                if (lastTutorMsg) {
                  setActiveRephraseMessageId(lastTutorMsg.id);
                }
              }}
              className="h-12 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl flex flex-col items-center justify-center transition-colors shadow-sm shrink-0"
              title="Explique-moi autrement"
            >
              <span className="text-[10px] font-bold uppercase leading-none">Je n'ai pas</span>
              <span className="text-[10px] font-bold uppercase leading-none mt-0.5">Compris</span>
            </button>

            <button
              type="submit"
              id="tutor-chat-send"
              disabled={!inputValue.trim() || isLoading}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-indigo-200 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-[11px] text-slate-400 text-center mt-2 font-medium">
            Pédagogie active • Pas de réponse brute : travaillez votre démarche avec le professeur
          </div>
        </div>

      </div>

    </div>
  );
};
