import React from 'react';
import { ShieldCheck, BookOpen, GraduationCap, Mail, Phone, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-100">
                O
              </div>
              <span className="font-bold text-slate-900 text-base tracking-tight">OXW CREATIV</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Le professeur particulier intelligent pour collégiens, lycéens et étudiants. Apprentissage différencié, méthode socratique et simulation d'examens en conditions réelles.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conforme aux programmes académiques</span>
            </div>
          </div>

          {/* Col 2: Modules pédagogiques */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Plateforme & Méthode
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-slate-900 cursor-pointer">Professeur particulier interactif</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Mode « Explique-moi autrement »</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Générateur d'exercices gradués</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Quiz adaptatif en temps réel</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Mode Examen blanc noté sur 20</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Fiches synthétiques & Flashcards</span></li>
            </ul>
          </div>

          {/* Col 3: Matières & Niveaux */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Niveaux préparés
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-slate-900 cursor-pointer">Collège (6e, 5e, 4e, 3e — Brevet)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Lycée Général & Technologique (Seconde, Première)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Baccalauréat Spécialités (Terminale)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Enseignement Supérieur (Prépas, Licence, BUT)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Concours & Certifications de langues</span></li>
            </ul>
          </div>

          {/* Col 4: Éthique & Contact */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Charte & Sécurité
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-slate-900 cursor-pointer">Protection des données (RGPD)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Charte de déontologie pédagogique</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Espace Établissements & Enseignants</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Mentions Légales & CGU</span></li>
            </ul>
            <div className="pt-2 text-[11px] text-slate-600">
              <div>Contact académique :</div>
              <div className="font-semibold text-slate-900">contact@oxw-creativ.edu</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line with status indicator */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} OXW CREATIV</span>
            <span className="hover:text-slate-600 cursor-pointer">Politique de confidentialité</span>
            <span className="hover:text-slate-600 cursor-pointer">Mentions légales</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Serveur IA : Opérationnel</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
