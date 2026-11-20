import React, { useEffect, useRef } from 'react';
import { Lock, CheckCircle, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dimension } from '../types/game';
import { DIMENSIONS } from '../data/dimensions';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';
import { useScene } from '../three/store';

interface MapDock3DProps {
  completedMissions: number[];
  onEnter: (dim: Dimension, isUnlocked: boolean) => void;
}

/**
 * Mapa en modo 3D. Los portales están en la escena; este componente reserva el
 * hueco donde se ven ([data-scene-window]) y muestra la ficha del portal
 * enfocado con los mismos textos y estados que las tarjetas 2D. Todo es
 * accesible por teclado: flechas para cambiar de portal, botón para ingresar.
 */
export const MapDock3D: React.FC<MapDock3DProps> = ({ completedMissions, onEnter }) => {
  const focusDim = useScene((s) => s.focusDim);
  const warpDim = useScene((s) => s.warpDim);
  const drag = useRef<{ startX: number; active: boolean }>({ startX: 0, active: false });

  // Al llegar al mapa se enfoca la siguiente dimensión pendiente
  useEffect(() => {
    const next = DIMENSIONS.find((d) => !completedMissions.includes(d.id));
    useScene.setState({ focusDim: next ? next.id : DIMENSIONS.length, warpDim: null, dragYaw: 0 });
  }, [completedMissions]);

  const moveFocus = (step: number) => {
    const current = useScene.getState().focusDim;
    const next = Math.min(DIMENSIONS.length, Math.max(1, current + step));
    if (next !== current) {
      sound.playClick();
      useScene.setState({ focusDim: next });
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (event.key === 'ArrowRight') moveFocus(1);
      if (event.key === 'ArrowLeft') moveFocus(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Arrastrar para mirar alrededor; un arrastre largo pasa al portal vecino
  const handlePointerDown = (event: React.PointerEvent) => {
    drag.current = { startX: event.clientX, active: true };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      const yaw = Math.max(-0.45, Math.min(0.45, (dx / window.innerWidth) * 1.1));
      useScene.setState({ dragYaw: yaw });
    };
    const onUp = (e: PointerEvent) => {
      const dx = e.clientX - drag.current.startX;
      drag.current.active = false;
      useScene.setState({ dragYaw: 0 });
      if (Math.abs(dx) > 70) moveFocus(dx < 0 ? 1 : -1);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const dim = DIMENSIONS.find((d) => d.id === focusDim) || DIMENSIONS[0];
  const isCompleted = completedMissions.includes(dim.id);
  const isUnlocked = dim.id === 1 || completedMissions.includes(dim.id - 1);
  const isCurrentTarget = isUnlocked && !isCompleted;

  return (
    <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col py-2">
      {/* Hueco por el que se ve (y se toca) la escena 3D */}
      <div
        data-scene-window
        onPointerDown={handlePointerDown}
        className="flex-1 min-h-[40vh] cursor-grab active:cursor-grabbing touch-pan-y"
      />

      {/* Ficha del portal enfocado */}
      <div
        data-ui
        className="w-full max-w-3xl mx-auto flex items-stretch gap-2"
        role="group"
        aria-label="Selector de dimensiones"
      >
        <button
          onClick={() => moveFocus(-1)}
          disabled={focusDim <= 1}
          aria-label="Dimensión anterior"
          className="hidden sm:block px-2 rounded-xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur text-cyan-300 hover:bg-cyan-950/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          aria-live="polite"
          className={`flex-1 min-w-0 rounded-2xl border-2 p-3 sm:p-4 backdrop-blur-md transition-colors duration-300 ${
            isCompleted
              ? 'border-emerald-500/60 bg-slate-950/85'
              : isCurrentTarget
              ? 'border-cyan-400 bg-slate-950/85 shadow-xl shadow-cyan-500/20'
              : 'border-slate-800/80 bg-slate-950/80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-rajdhani font-bold uppercase tracking-wider text-cyan-400">
                  Dimensión {dim.id} · 100 XP
                </span>
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
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white leading-snug mt-1">
                {dim.title.replace(`DIMENSIÓN ${dim.id}. `, '')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-0.5">{dim.subtitle}</p>
            </div>

            <div className="hidden sm:flex -space-x-1.5 shrink-0 pt-1">
              {dim.characters.map((charId) => {
                const char = CHARACTERS[charId];
                if (!char) return null;
                return (
                  <img
                    key={charId}
                    src={char.avatar}
                    alt={char.name}
                    title={char.name}
                    className="inline-block w-7 h-9 rounded object-cover object-top border border-cyan-500/40"
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Dimensiones">
              {DIMENSIONS.map((d) => {
                const done = completedMissions.includes(d.id);
                const open = d.id === 1 || completedMissions.includes(d.id - 1);
                return (
                  <button
                    key={d.id}
                    role="tab"
                    aria-selected={d.id === focusDim}
                    aria-label={`${d.title}${done ? ' (completada)' : open ? '' : ' (bloqueada)'}`}
                    onClick={() => {
                      sound.playClick();
                      useScene.setState({ focusDim: d.id });
                    }}
                    className={`w-7 h-7 rounded-lg border font-cinzel font-bold text-xs cursor-pointer transition-all ${
                      d.id === focusDim
                        ? 'border-cyan-300 bg-cyan-500 text-black scale-110'
                        : done
                        ? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-300'
                        : open
                        ? 'border-cyan-500/50 bg-slate-900 text-cyan-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-600'
                    }`}
                  >
                    {d.id}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onEnter(dim, isUnlocked)}
              disabled={!!warpDim}
              aria-disabled={!isUnlocked}
              className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl grow sm:grow-0 font-rajdhani font-bold text-sm tracking-wider transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 cursor-pointer hover:scale-[1.03]'
                  : 'border border-slate-800 bg-slate-900/70 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{isCompleted ? 'REPASAR' : isUnlocked ? 'INGRESAR' : 'BLOQUEADO'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => moveFocus(1)}
          disabled={focusDim >= DIMENSIONS.length}
          aria-label="Dimensión siguiente"
          className="hidden sm:block px-2 rounded-xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur text-cyan-300 hover:bg-cyan-950/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Destello al cruzar el portal */}
      {warpDim && (
        <div className="fixed inset-0 z-30 pointer-events-none animate-warp bg-gradient-to-r from-cyan-600/30 via-purple-600/40 to-blue-600/30" />
      )}
    </main>
  );
};
