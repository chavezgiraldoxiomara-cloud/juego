import React, { useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { Dimension } from '../../types/game';
import { ENLACE_LIBRO, PUNTOS, RECURSOS } from '../../data/recursos';
import { guardarRespuesta, marcarLectura, useProgreso } from '../../utils/progreso';
import { sound } from '../../utils/audio';
import { useIs3D } from '../../three/prefs';

interface Props {
  dimension: Dimension;
  onContinuar: () => void;
}

/**
 * Ampliación: invitación a leer. Aparece al completar los desafíos de una misión:
 * un fragmento corto del capítulo, el botón «Leer más» y una pregunta abierta.
 */
export const ReadingInvite: React.FC<Props> = ({ dimension, onContinuar }) => {
  const is3d = useIs3D();
  const lectura = RECURSOS[dimension.id].lectura;
  const clave = `lectura_${dimension.id}`;
  const leida = useProgreso((s) => s.lecturas.includes(dimension.id));
  const respuesta = useProgreso((s) => s.respuestas[clave] ?? '');
  const [ampliado, setAmpliado] = useState(leida);

  return (
    <div className={`relative min-h-screen w-full flex flex-col p-3 sm:p-6 ${is3d ? 'bg-transparent' : 'bg-slate-950'}`}>
      {is3d && <div data-scene-window className="h-[16vh] shrink-0" />}
      <div data-ui className="w-full max-w-3xl mx-auto my-auto rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-md p-5 sm:p-8 shadow-2xl space-y-4">
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-rajdhani font-bold tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-400 uppercase">
            Misión {dimension.id} superada · +100 XP
          </span>
          <h1 className="font-cinzel text-xl sm:text-3xl font-black text-white mt-3">Ahora, el libro</h1>
          <p className="text-xs font-rajdhani uppercase tracking-widest text-amber-300 mt-1">{lectura.capitulo}</p>
        </div>

        <blockquote className="p-4 sm:p-5 rounded-2xl border-l-4 border-amber-400 bg-amber-950/20 font-serif text-base sm:text-lg text-slate-100 leading-relaxed texto-seleccionable">
          <p>{lectura.fragmento}</p>
          {ampliado && <p className="mt-3 animate-fadeIn">{lectura.masTexto}</p>}
          <footer className="mt-3 text-[11px] font-sans not-italic text-slate-400">
            Franz Kafka, <em>La metamorfosis</em> (1915). Traducción hecha para este juego.
          </footer>
        </blockquote>

        {!ampliado ? (
          <div className="text-center">
            <button
              onClick={() => {
                sound.playCorrect();
                setAmpliado(true);
                marcarLectura(dimension.id);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-rajdhani font-bold tracking-wider cursor-pointer"
            >
              <BookOpen className="w-5 h-5" /> LEER MÁS · +{PUNTOS.lectura} PUNTOS
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-slate-700 bg-slate-950/60 flex flex-wrap items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="flex-1 text-sm text-slate-200">
              <strong>Sigue en tu libro:</strong> {lectura.dondeSeguir}
            </p>
            {ENLACE_LIBRO && (
              <a href={ENLACE_LIBRO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-200 text-xs font-rajdhani font-bold">
                ABRIR EL LIBRO <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        <div className="space-y-2">
          <p className="font-cinzel font-bold text-cyan-200 text-base sm:text-lg">{lectura.pregunta}</p>
          <textarea
            value={respuesta}
            onChange={(e) => guardarRespuesta(clave, e.target.value)}
            rows={3}
            placeholder="Escribe aquí tu idea (opcional). Se guarda en tu diario."
            className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onContinuar();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-rajdhani font-bold tracking-wider cursor-pointer"
          >
            VOLVER AL MAPA <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
