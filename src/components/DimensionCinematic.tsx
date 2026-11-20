import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Shield, Sparkles, Search } from 'lucide-react';
import { Dimension } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { CINEMATICAS, DURACION_CLIP_ORIGINAL } from '../data/cinematicas';
import { sound } from '../utils/audio';
import { marcarCinematica } from '../utils/progreso';
import { useIs3D } from '../three/prefs';
import { CinematicPlayer } from './CinematicPlayer';

interface DimensionCinematicProps {
  dimension: Dimension;
  onStartChallenges: () => void;
  /** Ampliación: pasa a la exploración de la habitación y sus recursos. */
  onExplore: () => void;
  onBackToMap: () => void;
}

export const DimensionCinematic: React.FC<DimensionCinematicProps> = ({
  dimension,
  onStartChallenges,
  onExplore,
  onBackToMap
}) => {
  const [portalIlluminating, setPortalIlluminating] = useState<boolean>(true);
  const is3d = useIs3D();
  const cinematica = CINEMATICAS[dimension.id];

  // Characters involved in this dimension
  const dimensionCharacters = dimension.characters.map((id) => CHARACTERS[id]).filter(Boolean);

  useEffect(() => {
    sound.playPortalWarp();
    // Portal illumination animation effect
    const timer = setTimeout(() => {
      setPortalIlluminating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [dimension.id]);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 overflow-x-hidden ${
        is3d ? 'bg-transparent' : 'bg-slate-950'
      }`}
    >
      {/* Background portal illumination overlay */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-40 bg-gradient-to-r from-cyan-600/30 via-purple-600/40 to-blue-600/30 backdrop-blur-sm ${
          portalIlluminating ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
        }`}
      />

      {/* Top Bar Navigation */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-4 sm:pr-40">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-300 font-rajdhani font-bold text-sm tracking-wider transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>REGRESAR AL MAPA</span>
        </button>

        <div className="text-center">
          <div className="text-xs font-rajdhani uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            PRESENTACIÓN CINEMATOGRÁFICA DE DIMENSIÓN
          </div>
          <h1 className="font-cinzel text-lg sm:text-2xl font-bold tracking-wide text-white glow-cyan">
            {dimension.title}
          </h1>
        </div>

        <div className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-200 text-xs font-rajdhani font-semibold">
          100 XP DISPONIBLES
        </div>
      </div>

      {/* Main Cinematic Centerpiece */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Video Screen with Controls */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Ampliación: cinemática narrada (o video real, si ya existe en assets/videos) */}
          <div className="relative">
            {/* En 3D la escena sigue detrás; este hueco mantiene el encuadre de la cámara */}
            {is3d && <div data-scene-window className="absolute inset-0 pointer-events-none" />}
            <CinematicPlayer
              cinematica={cinematica}
              onFin={(completa) => completa && marcarCinematica(dimension.id)}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-rajdhani">
            «{cinematica.titulo}» · El clip original duraba {DURACION_CLIP_ORIGINAL[dimension.id].toString().replace('.', ',')} s.
            Barra espaciadora: pausar o continuar.
          </p>

          {/* Subtitle & Literary Theme */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-slate-900/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-rajdhani font-bold uppercase tracking-wider text-cyan-400">
                Eje Temático Franz Kafka
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                {dimension.literaryTheme}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sung Jin-Woo Briefing & Characters */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Sung Jin-Woo Transmission Card */}
          <div className="relative rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 shadow-xl shadow-cyan-950/40 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-cyan-500/20">
              <img
                src={CHARACTERS.sung_jinwoo.avatar}
                alt="Sung Jin-Woo"
                className="w-14 h-16 rounded-xl object-cover object-top border-2 border-cyan-400 shadow-md shadow-cyan-500/30"
              />
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                  Transmisión del Cazador Guía
                </span>
                <h3 className="font-cinzel font-bold text-white text-base">Sung Jin-Woo</h3>
                <p className="text-[11px] text-cyan-400/90 font-rajdhani">Monarca de las Sombras</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed bg-cyan-950/20 p-3 rounded-xl border-l-2 border-cyan-400">
              «{dimension.briefing.sungJinWooIntro}»
            </p>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="text-[11px] font-rajdhani font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Objetivo Táctico</span>
              </div>
              <p className="text-xs text-slate-300">{dimension.briefing.objective}</p>
            </div>
          </div>

          {/* Involved Characters Roster */}
          <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="text-xs font-rajdhani font-bold tracking-wider text-slate-400 uppercase">
              Personajes de la Escena ({dimensionCharacters.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dimensionCharacters.map((char) => (
                <div
                  key={char.id}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-800 bg-slate-950/70"
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-8 h-10 rounded object-cover object-top border border-cyan-500/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-rajdhani font-bold text-slate-200 truncate">{char.name}</p>
                    <p className="text-[10px] text-cyan-400 truncate">{char.rankBadge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ampliación: primero explorar la habitación; los desafíos siguen disponibles */}
          <button
            onClick={() => {
              sound.playClick();
              onExplore();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-cinzel font-bold text-base sm:text-lg tracking-wider transition-all shadow-xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Search className="w-5 h-5" />
            <span>EXPLORAR LA HABITACIÓN</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onStartChallenges();
            }}
            className="w-full py-3 px-6 rounded-2xl border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-200 font-rajdhani font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>IR DIRECTO A LOS DESAFÍOS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
