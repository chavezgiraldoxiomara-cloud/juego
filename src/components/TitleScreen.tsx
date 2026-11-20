import React, { useEffect } from 'react';
import { Play, RotateCcw, Shield, Award, Sparkles, BookOpen } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';
import { useIs3D } from '../three/prefs';

interface TitleScreenProps {
  onStartGame: () => void;
  onContinueGame?: () => void;
  hasSavedProgress: boolean;
  savedXp: number;
  savedRank: string;
  onOpenCodex: () => void;
  /** Corrección: con una ventana abierta, Enter/Espacio no deben iniciar el juego. */
  blocked?: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onContinueGame,
  hasSavedProgress,
  savedXp,
  savedRank,
  onOpenCodex,
  blocked = false
}) => {
  const is3d = useIs3D();

  // Listen for Enter or Space to quickly start game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Corrección: se ignora si hay una ventana abierta o si el foco está en un botón.
      const tag = (e.target as HTMLElement)?.tagName;
      if (blocked || tag === 'BUTTON' || tag === 'VIDEO') return;
      if (e.key === 'Enter' || e.key === ' ') {
        sound.playPortalWarp();
        if (hasSavedProgress && onContinueGame) {
          onContinueGame();
        } else {
          onStartGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSavedProgress, onContinueGame, onStartGame, blocked]);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 overflow-hidden select-none ${
        is3d ? 'bg-transparent' : 'bg-[#030712]'
      }`}
    >
      {is3d ? (
        /* 3D: el portal y las islas viven en la escena; aquí solo un velo para la legibilidad */
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#030712]/90 via-[#030712]/35 to-[#030712]/60" />
      ) : (
        <>
          {/* Background Poster Artwork with Subtle Ken Burns Zoom */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/clips/map_poster.jpg"
              alt="Reino de los Portales"
              className="w-full h-full object-cover opacity-35 scale-105 animate-pulse-slow filter brightness-75 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-[#030712]/80" />
            <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
          </div>

          {/* Atmospheric magic circles & particle glows in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10 pointer-events-none animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-purple-500/15 pointer-events-none animate-spin-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-dashed border-cyan-400/20 pointer-events-none animate-spin-slow" />
        </>
      )}

      {/* Top Header Tag */}
      <div className="relative z-10 w-full max-w-6xl flex justify-between items-center gap-2 pt-2 pr-12 sm:pr-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-slate-950/70 backdrop-blur text-xs font-rajdhani text-cyan-400 font-bold tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>RPG Educativo · Franz Kafka × Estética Cazador</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenCodex();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/50 text-cyan-300 font-rajdhani font-bold text-xs tracking-wider transition-all cursor-pointer shadow-md"
        >
          <Shield className="w-4 h-4" />
          <span>CÓDICE DE PERSONAJES</span>
        </button>
      </div>

      {/* Centerpiece Hero: Bespoke Title Lockup */}
      <div className="relative z-10 max-w-3xl text-center my-auto py-8 space-y-6">
        {/* Futuristic System Prompt Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 text-xs sm:text-sm font-rajdhani font-bold tracking-widest uppercase shadow-lg shadow-cyan-950/60">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>[SISTEMA DE CALABOZOS LITERARIOS V2.0]</span>
        </div>

        {/* Title Lockup */}
        <div className={`space-y-2 ${is3d ? 'animate-float' : ''}`}>
          <h1 className="relative left-1/2 -translate-x-1/2 w-max font-cinzel text-[11vw] sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 tracking-wider glow-cyan drop-shadow-2xl">
            METAMORFOSIS
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-0.5 w-12 sm:w-20 bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="font-cinzel font-bold text-base sm:text-2xl text-cyan-300 tracking-[0.25em] uppercase glow-cyan">
              EL DESPERTAR DEL CAZADOR
            </span>
            <div className="h-0.5 w-12 sm:w-20 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </div>

        {/* Synopsis Tagline */}
        <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans font-normal opacity-90 px-4">
          Cruza las 5 dimensiones de la novela de Franz Kafka guiado por Sung Jin-Woo.
          Descifra la alienación, los recuerdos y la tragedia de Gregor Samsa a través de desafíos interactivos.
        </p>

        {/* Character Preview Avatars Strip */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
          <div className="relative group">
            <img
              src={CHARACTERS.gregor_humano.avatar}
              alt="Gregor Humano"
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl object-cover object-top border-2 border-cyan-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black/80 text-[9px] font-rajdhani text-cyan-300 font-bold border border-cyan-500/30">
              E
            </span>
          </div>

          <div className="relative group">
            <img
              src={CHARACTERS.gregor_monstruo.avatar}
              alt="Gregor Transformado"
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl object-cover object-top border-2 border-purple-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black/80 text-[9px] font-rajdhani text-purple-300 font-bold border border-purple-500/30">
              S
            </span>
          </div>

          <div className="relative group">
            <img
              src={CHARACTERS.sung_jinwoo.avatar}
              alt="Sung Jin-Woo"
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl object-cover object-top border-2 border-cyan-400 shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black/80 text-[9px] font-rajdhani text-cyan-300 font-bold border border-cyan-400">
              GUÍA
            </span>
          </div>

          <div className="relative group">
            <img
              src={CHARACTERS.grete.avatar}
              alt="Grete Samsa"
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl object-cover object-top border-2 border-indigo-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black/80 text-[9px] font-rajdhani text-indigo-300 font-bold border border-indigo-500/30">
              VIOLÍN
            </span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          {hasSavedProgress && onContinueGame ? (
            <>
              <button
                onClick={() => {
                  sound.playPortalWarp();
                  onContinueGame();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-cinzel font-bold text-base sm:text-lg tracking-wider transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>CONTINUAR MISIÓN ({savedXp} XP · RANGO {savedRank})</span>
              </button>

              <button
                onClick={() => {
                  sound.playPortalWarp();
                  onStartGame();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-300 font-cinzel font-bold text-sm tracking-wider transition-all cursor-pointer"
              >
                <span>NUEVA PARTIDA</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                sound.playPortalWarp();
                onStartGame();
              }}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-cinzel font-bold text-lg tracking-wider transition-all shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Play className="w-5 h-5 fill-current group-hover:translate-x-0.5 transition-transform" />
              <span>INICIAR AVENTURA</span>
            </button>
          )}
        </div>
      </div>

      {/* Flat Control Hint Line */}
      <div className="relative z-10 w-full max-w-4xl flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs font-rajdhani text-slate-400 tracking-wider uppercase border-t border-slate-800/80 pt-3">
        <span>Enter / Clic Iniciar</span>
        <span>•</span>
        <span>Flechas: cambiar de portal</span>
        <span>•</span>
        <span>Esc: cerrar ventanas</span>
        <span>•</span>
        <span className="text-cyan-400 font-bold">5 Dimensiones · 500 XP · Rango S</span>
      </div>
    </div>
  );
};
