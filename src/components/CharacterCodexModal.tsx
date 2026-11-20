import React, { useState } from 'react';
import { X, Shield, Award, Sparkles, BookOpen } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character } from '../types/game';
import { sound } from '../utils/audio';

interface CharacterCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCharacterId?: string;
}

export const CharacterCodexModal: React.FC<CharacterCodexModalProps> = ({
  isOpen,
  onClose,
  defaultCharacterId = 'sung_jinwoo'
}) => {
  const charactersList = Object.values(CHARACTERS);
  const [selectedCharId, setSelectedCharId] = useState<string>(defaultCharacterId);

  if (!isOpen) return null;

  const selectedChar = CHARACTERS[selectedCharId] || charactersList[0];

  const handleSelect = (char: Character) => {
    sound.playClick();
    setSelectedCharId(char.id);
  };

  return (
    <div data-ui className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-slate-950 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-cyan-300">
                REGISTRO DE PERSONAJES DEL CAZADOR
              </h2>
              <p className="text-xs text-slate-400 font-rajdhani uppercase tracking-widest">
                Avatares Oficiales · Dimensión Kafkiana
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Character Selector & Detail Card */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Character List Selector */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-cyan-500/20 p-3 sm:p-4 overflow-y-auto max-h-48 md:max-h-none space-y-2 bg-slate-950/40">
            {charactersList.map((char) => {
              const isSelected = char.id === selectedChar.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelect(char)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-r from-cyan-950/60 to-blue-950/40 text-cyan-100 shadow-md shadow-cyan-950/50'
                      : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:border-cyan-500/30 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-12 h-14 object-cover object-top rounded-lg border border-cyan-500/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-rajdhani font-bold text-sm tracking-wide truncate text-cyan-200">
                      {char.name}
                    </div>
                    <div className="text-[11px] text-cyan-400/80 truncate">{char.rankBadge}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Character View */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col lg:flex-row gap-6 items-center lg:items-start bg-slate-900/20">
            {/* Visual Portrait Card */}
            <div className="relative group w-64 sm:w-72 shrink-0 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-xl shadow-cyan-950/40">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                className="w-full h-96 sm:h-[440px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Corner Sci-fi Reticles */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

              <div className="absolute bottom-3 inset-x-3 z-20 bg-slate-950/90 backdrop-blur p-2.5 rounded-xl border border-cyan-500/30 text-center">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase mb-1">
                  {selectedChar.rankBadge}
                </span>
                <p className="text-xs text-slate-300 font-medium truncate">{selectedChar.title}</p>
              </div>
            </div>

            {/* Lore and Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-rajdhani tracking-widest uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Perfil Oficial de Aventura</span>
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-cyan-100 tracking-wide mt-1">
                  {selectedChar.name}
                </h3>
                <p className="text-sm font-rajdhani font-semibold text-cyan-400/90 tracking-wider">
                  {selectedChar.role}
                </p>
              </div>

              {/* Quote Banner */}
              <div className="p-3.5 rounded-xl border-l-4 border-cyan-400 bg-cyan-950/25 text-slate-200 text-sm italic font-serif">
                {selectedChar.quote}
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-rajdhani font-bold tracking-wider text-slate-400 uppercase">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>Biografía y Rasgos</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedChar.description}
                </p>
              </div>

              {/* Literary Lore */}
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-rajdhani font-bold tracking-wider text-indigo-300 uppercase">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Simbolismo Literario (Franz Kafka)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedChar.lore}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-rajdhani font-bold tracking-wider text-sm transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
          >
            CERRAR CÓDICE
          </button>
        </div>
      </div>
    </div>
  );
};
