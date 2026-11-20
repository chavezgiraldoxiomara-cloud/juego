import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { ImagenInteractiva } from '../../types/recursos';
import { sound } from '../../utils/audio';

interface Props {
  imagen: ImagenInteractiva;
  /** Se llama cuando se han abierto todas las zonas. */
  onCompleta: () => void;
}

/** Imagen con zonas numeradas: al tocar una se lee su explicación. */
export const InteractiveImage: React.FC<Props> = ({ imagen, onCompleta }) => {
  const [vistas, setVistas] = useState<string[]>([]);
  const [activa, setActiva] = useState<string | null>(null);
  const zona = imagen.zonas.find((z) => z.id === activa);

  const abrir = (id: string) => {
    sound.playClick();
    setActiva(id);
    if (!vistas.includes(id)) {
      const nuevas = [...vistas, id];
      setVistas(nuevas);
      if (nuevas.length === imagen.zonas.length) {
        sound.playCorrect();
        onCompleta();
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">{imagen.intro}</p>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950">
            {/* loading="lazy": la imagen solo se descarga al abrir el recurso */}
            <img src={imagen.imagen} alt={imagen.titulo} loading="lazy" className="w-full h-auto block" />
            {imagen.zonas.map((z, i) => {
              const vista = vistas.includes(z.id);
              return (
                <button
                  key={z.id}
                  onClick={() => abrir(z.id)}
                  aria-label={z.titulo}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 font-rajdhani font-bold text-xs cursor-pointer transition-all ${
                    activa === z.id
                      ? 'bg-amber-400 border-white text-black scale-110'
                      : vista
                      ? 'bg-emerald-600/90 border-emerald-200 text-white'
                      : 'bg-cyan-600/90 border-cyan-200 text-white animate-pulse'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {imagen.nota && <p className="mt-2 text-[11px] text-slate-400 italic">{imagen.nota}</p>}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/70 min-h-[150px]" aria-live="polite">
            {zona ? (
              <>
                <h4 className="font-cinzel font-bold text-cyan-200">{zona.titulo}</h4>
                <p className="mt-1.5 text-sm text-slate-200 leading-relaxed texto-seleccionable">{zona.texto}</p>
              </>
            ) : (
              <p className="text-sm text-slate-400">Toca un número de la imagen.</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-rajdhani font-bold text-slate-300">
            <CheckCircle className={`w-4 h-4 ${vistas.length === imagen.zonas.length ? 'text-emerald-400' : 'text-slate-600'}`} />
            {vistas.length} / {imagen.zonas.length} zonas exploradas
          </div>
        </div>
      </div>
    </div>
  );
};
