import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  CheckCircle,
  Play,
  Award,
  Crown,
  BookOpen,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Dimension, HunterRank } from '../types/game';
import { DIMENSIONS } from '../data/dimensions';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';
import { useIs3D, prefersReducedMotion } from '../three/prefs';
import { useScene } from '../three/store';
import { MapDock3D } from './MapDock3D';
import { NotebookPen } from 'lucide-react';
import { calcularPuntos, useProgreso } from '../utils/progreso';

interface WorldMapProps {
  completedMissions: number[];
  totalXp: number;
  currentRank: HunterRank;
  rankTitle: string;
  onSelectDimension: (dimId: number) => void;
  onOpenCodex: () => void;
  onOpenFinalReward: () => void;
  /** Ampliación: abre el diario de Gregor. */
  onOpenDiary: () => void;
  onResetProgress: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  completedMissions,
  totalXp,
  currentRank,
  rankTitle,
  onSelectDimension,
  onOpenCodex,
  onOpenFinalReward,
  onOpenDiary,
  onResetProgress
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [selectedInsigniaInfo, setSelectedInsigniaInfo] = useState<any | null>(null);

  const is3d = useIs3D();
  // 3D: durante la recompensa final la escena ocupa la pantalla y el HUD del mapa se oculta
  const finaleOpen = useScene((s) => s.finale.open);
  const warpTimer = useRef<number | undefined>(undefined);

  const allCompleted = completedMissions.length >= 5;
  const puntosLectura = useProgreso(calcularPuntos);

  // Guidance message from Sung Jin-Woo based on progress
  const getGuideMessage = () => {
    if (allCompleted) {
      return '«¡Magno logro, cazador! Has desentrañado los cinco calabozos de la metamorfosis. El título de Monarca de la Comprensión es tuyo.»';
    }
    const nextMission = DIMENSIONS.find((d) => !completedMissions.includes(d.id));
    if (!nextMission) return '';

    if (nextMission.id === 1) {
      return '«Cazador, la primera brecha dimensional está abierta. Gregor despierta desconcertado. Ingresa al portal y analiza su transformación.»';
    }
    if (nextMission.id === 2) {
      return '«La familia y el apoderado se agolpan ante la puerta cerrada. La incomunicación y el rechazo se ciernen sobre Gregor.»';
    }
    if (nextMission.id === 3) {
      return '«Grete y la madre intentan desmantelar la habitación. Salvemos los recuerdos humanos antes de que se desvanezcan.»';
    }
    if (nextMission.id === 4) {
      return '«El padre ha asumido una autoridad violenta. Cuidado con la lluvia de manzanas que amenaza la vida de Gregor.»';
    }
    if (nextMission.id === 5) {
      return '«El violín de Grete resuena en la última prueba. Acompaña a Gregor en la cumbre estética y el adiós de la novela.»';
    }
    return '';
  };

  const handlePortalClick = (dim: Dimension, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sound.playError();
      return;
    }
    sound.playPortalWarp();
    if (is3d && !prefersReducedMotion()) {
      // 3D: la cámara cruza el portal antes de cambiar de pantalla
      if (useScene.getState().warpDim) return;
      useScene.setState({ focusDim: dim.id, warpDim: dim.id });
      warpTimer.current = window.setTimeout(() => {
        useScene.setState({ warpDim: null });
        onSelectDimension(dim.id);
      }, 850);
      return;
    }
    onSelectDimension(dim.id);
  };

  // Los portales 3D avisan aquí cuando se hace clic sobre ellos
  const portalClickRef = useRef(handlePortalClick);
  portalClickRef.current = handlePortalClick;
  useEffect(() => {
    useScene.setState((state) => ({
      handlers: {
        ...state.handlers,
        onPortal: (dimId: number) => {
          const dim = DIMENSIONS.find((d) => d.id === dimId);
          if (!dim) return;
          const done = useScene.getState().completed;
          portalClickRef.current(dim, dim.id === 1 || done.includes(dim.id - 1));
        }
      }
    }));
    return () => {
      window.clearTimeout(warpTimer.current);
      useScene.setState((state) => ({ warpDim: null, handlers: { ...state.handlers, onPortal: undefined } }));
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 overflow-x-hidden ${
        is3d ? 'bg-transparent' : 'bg-[#030712]'
      } ${is3d && finaleOpen ? 'invisible' : ''}`}
    >
      {/* Background Realm Map Image (solo 2D: en 3D el fondo es la escena) */}
      {!is3d && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src="/assets/clips/map_poster.jpg"
            alt="Mapa de Dimensiones"
            className="w-full h-full object-cover opacity-25 filter brightness-70 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]/90" />
          <div className="absolute inset-0 scanlines opacity-20" />
        </div>
      )}

      {/* TOP HUNTER HUD */}
      <header data-ui className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-md shadow-2xl shadow-cyan-950/40">
        {/* Left: Player Badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                completedMissions.length >= 1
                  ? CHARACTERS.gregor_monstruo.avatar
                  : CHARACTERS.gregor_humano.avatar
              }
              alt="Avatar de Jugador"
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl object-cover object-top border-2 border-cyan-400 shadow-md shadow-cyan-500/30"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-rajdhani font-bold bg-cyan-950 text-cyan-300 border border-cyan-400 uppercase whitespace-nowrap">
              Rango {currentRank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide">
                Gregor Samsa
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-rajdhani font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                {completedMissions.length >= 1 ? 'FORMA TRANSFORMADA' : 'FORMA HUMANA'}
              </span>
            </div>
            <p className="text-xs font-rajdhani text-cyan-300/90 font-semibold tracking-wider">
              {rankTitle}
            </p>
          </div>
        </div>

        {/* Center: XP Bar & Status */}
        <div className="w-full md:w-80 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-rajdhani font-bold">
            <span className="text-slate-400 uppercase tracking-wider">EXPERIENCIA ACUMULADA</span>
            <span className="text-amber-300 tabular-nums">{totalXp} / 500 XP</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 transition-all duration-700 shadow-sm shadow-cyan-400"
              style={{ width: `${(totalXp / 500) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-rajdhani text-slate-400">
            <span>Rango E (0)</span>
            <span>Rango C (200)</span>
            <span>Rango A (400)</span>
            <span className="text-amber-400 font-bold">Rango S (500)</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenCodex();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/30 bg-slate-900 hover:bg-cyan-950/40 text-cyan-300 font-rajdhani font-bold text-xs tracking-wider cursor-pointer transition-all"
            title="Ver Códice de Personajes"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">CÓDICE</span>
          </button>

          {/* Ampliación: diario de Gregor y puntos de lectura */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenDiary();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/40 bg-slate-900 hover:bg-amber-950/40 text-amber-200 font-rajdhani font-bold text-xs tracking-wider cursor-pointer transition-all"
            title="Diario de Gregor y puntos de lectura"
          >
            <NotebookPen className="w-4 h-4" />
            <span className="hidden sm:inline">DIARIO</span>
            <span className="tabular-nums">{puntosLectura}</span>
          </button>

          {allCompleted && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenFinalReward();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-rajdhani font-black text-xs tracking-wider cursor-pointer transition-all shadow-lg shadow-amber-500/30 animate-pulse"
            >
              <Crown className="w-4 h-4" />
              <span>RECOMPENSA FINAL</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              setShowResetConfirm(true);
            }}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-rose-950/40 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
            title="Reiniciar Progreso"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* SUNG JIN-WOO TRANSMISSION BANNER */}
      <div data-ui className="relative z-10 w-full max-w-7xl mx-auto my-3">
        <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#0a1426] to-slate-950 backdrop-blur shadow-lg">
          <img
            src={CHARACTERS.sung_jinwoo.avatar}
            alt="Sung Jin-Woo"
            className="w-11 h-13 rounded-lg object-cover object-top border border-cyan-400 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-rajdhani uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUNG JIN-WOO · EL CAZADOR GUÍA</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 italic font-serif truncate sm:whitespace-normal">
              {getGuideMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* FIVE DIMENSIONS PORTALS: escena 3D con ficha, o cuadrícula 2D clásica */}
      {is3d ? (
        <MapDock3D completedMissions={completedMissions} onEnter={handlePortalClick} />
      ) : (
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DIMENSIONS.map((dim, idx) => {
            const isCompleted = completedMissions.includes(dim.id);
            // Dimension 1 unlocked by default; others unlocked when previous completed
            const isUnlocked = dim.id === 1 || completedMissions.includes(dim.id - 1);
            const isCurrentTarget = isUnlocked && !isCompleted;

            return (
              <div
                key={dim.id}
                onClick={() => handlePortalClick(dim, isUnlocked)}
                className={`relative group rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between p-4 ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-gradient-to-b from-slate-900/90 via-[#081816]/90 to-slate-950/90 hover:border-emerald-400 cursor-pointer shadow-lg shadow-emerald-950/40'
                    : isCurrentTarget
                    ? 'border-cyan-400 bg-gradient-to-b from-slate-900/95 via-[#0b1b2d]/95 to-slate-950/95 cursor-pointer shadow-xl shadow-cyan-500/20 hover:scale-[1.02] ring-2 ring-cyan-400/40'
                    : isUnlocked
                    ? 'border-blue-500/40 bg-slate-900/70 hover:border-blue-400 cursor-pointer'
                    : 'border-slate-800/80 bg-slate-950/60 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Poster Artwork Header */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700/60 mb-3 bg-black">
                  <img
                    src={dim.posterImage}
                    alt={dim.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isUnlocked ? 'group-hover:scale-105' : 'grayscale'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Status Indicator Pill */}
                  <div className="absolute top-2 right-2">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-[10px] font-rajdhani font-bold text-emerald-300">
                        <CheckCircle className="w-3 h-3" />
                        100 XP
                      </span>
                    ) : isCurrentTarget ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-[10px] font-rajdhani font-bold text-cyan-300 animate-pulse">
                        <Play className="w-3 h-3 fill-current" />
                        ACTIVA
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-950/90 border border-blue-400 text-[10px] font-rajdhani font-bold text-blue-300">
                        DISPONIBLE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-rajdhani font-bold text-slate-400">
                        <Lock className="w-3 h-3" />
                        BLOQUEADA
                      </span>
                    )}
                  </div>

                  {/* Dimension Number Ring */}
                  <div className="absolute bottom-2 left-2 w-8 h-8 rounded-lg bg-black/80 backdrop-blur border border-cyan-500/40 flex items-center justify-center font-cinzel font-bold text-cyan-300 text-sm">
                    {dim.id}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-2">
                  <div className="text-[10px] font-rajdhani font-bold uppercase tracking-wider text-cyan-400">
                    Dimensión {dim.id} · 100 XP
                  </div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {dim.title.replace(`DIMENSIÓN ${dim.id}. `, '')}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {dim.subtitle}
                  </p>
                </div>

                {/* Footer Strip */}
                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {dim.characters.map((charId) => {
                      const char = CHARACTERS[charId];
                      if (!char) return null;
                      return (
                        <img
                          key={charId}
                          src={char.avatar}
                          alt={char.name}
                          className="inline-block w-6 h-7 rounded object-cover object-top border border-cyan-500/30"
                          title={char.name}
                        />
                      );
                    })}
                  </div>

                  <div className="text-xs font-rajdhani font-bold flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>{isCompleted ? 'REPASAR' : isUnlocked ? 'INGRESAR' : 'BLOQUEADO'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      )}

      {/* BOTTOM INSIGNIAS RIBBON */}
      <footer data-ui className="relative z-20 w-full max-w-7xl mx-auto mt-4 p-3 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur flex flex-wrap items-center justify-between gap-3 text-xs font-rajdhani">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Insignias de Aventura ({completedMissions.length} / 5):</span>
          </span>

          <div className="flex items-center gap-2">
            {DIMENSIONS.map((dim) => {
              const isEarned = completedMissions.includes(dim.id);
              return (
                <button
                  key={dim.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedInsigniaInfo(dim.insignia);
                  }}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                    isEarned
                      ? 'border-amber-400 bg-amber-950/50 text-amber-300 shadow-sm shadow-amber-500/30'
                      : 'border-slate-800 bg-slate-900/50 text-slate-600'
                  }`}
                  title={`${dim.insignia.name}: ${dim.insignia.description}`}
                >
                  {dim.id}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Metamorfosis: El Despertar del Cazador · Franz Kafka RPG Educativo
        </div>
      </footer>

      {/* Insignia Detail Modal */}
      {selectedInsigniaInfo && (
        <div data-ui className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm p-5 rounded-2xl border-2 border-amber-400/80 bg-slate-950 text-center space-y-3 shadow-2xl">
            <Award className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="font-cinzel text-lg font-bold text-white">
              {selectedInsigniaInfo.name}
            </h3>
            <p className="text-xs font-rajdhani font-bold text-cyan-400">
              {selectedInsigniaInfo.title}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedInsigniaInfo.description}
            </p>
            <button
              onClick={() => setSelectedInsigniaInfo(null)}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-rajdhani font-bold text-xs cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div data-ui className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl border-2 border-rose-500/60 bg-slate-950 text-center space-y-4 shadow-2xl">
            <RotateCcw className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="font-cinzel text-xl font-bold text-white">¿Reiniciar la Aventura?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Se restablecerá todo el progreso actual ({totalXp} XP), permitiéndote comenzar nuevamente desde
              la Dimensión 1.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-rajdhani font-bold cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-rajdhani font-bold cursor-pointer shadow-lg shadow-rose-950/50"
              >
                SÍ, REINICIAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
