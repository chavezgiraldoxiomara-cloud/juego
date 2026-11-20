import React from 'react';
import { Box, Layers, MonitorOff } from 'lucide-react';
import { cycleRenderMode, hasWebGL, useRenderMode } from '../three/prefs';
import { sound } from '../utils/audio';

/** Interruptor de presentación: 3D calidad alta → 3D calidad baja → 2D clásico. */
export const RenderModeToggle: React.FC = () => {
  const mode = useRenderMode();
  const supported = hasWebGL();

  const label = mode === 'high' ? '3D: ALTA' : mode === 'low' ? '3D: BAJA' : '2D';
  const Icon = mode === 'high' ? Box : mode === 'low' ? Layers : MonitorOff;
  const title = !supported
    ? 'Este dispositivo no admite gráficos 3D: se muestra la versión 2D'
    : 'Cambiar calidad gráfica (3D alta, 3D baja o 2D)';

  return (
    <button
      disabled={!supported}
      onClick={() => {
        sound.playClick();
        cycleRenderMode();
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-slate-950/80 backdrop-blur text-cyan-400 hover:text-cyan-200 hover:border-cyan-400 hover:bg-cyan-950/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-rajdhani tracking-wider cursor-pointer"
      title={title}
      aria-label={`${title}. Modo actual: ${label}`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden 2xl:inline font-semibold">{label}</span>
    </button>
  );
};
