import React, { useEffect, useState } from 'react';
import { Award, Lock, NotebookPen, Printer, X } from 'lucide-react';
import { DIMENSIONS } from '../../data/dimensions';
import { PUNTOS_MAXIMOS, RECURSOS } from '../../data/recursos';
import { calcularPuntos, tieneSello, useProgreso } from '../../utils/progreso';
import { sound } from '../../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Reflexiones escritas en los desafíos del juego original. */
  reflexiones: Record<string, string>;
}

/**
 * Ampliación: diario de Gregor, puntos de lectura, sellos y respuestas del estudiante.
 * Cada recurso completado desbloquea una página del diario.
 */
export const DiaryModal: React.FC<Props> = ({ isOpen, onClose, reflexiones }) => {
  const progreso = useProgreso();
  const [pestana, setPestana] = useState<'diario' | 'respuestas'>('diario');

  useEffect(() => {
    if (!isOpen) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const puntos = calcularPuntos(progreso);
  const paginas = Object.keys(progreso.recursos).length;
  const respuestas = [
    ...DIMENSIONS.flatMap((d) =>
      d.activities
        .filter((a) => a.type === 'reflection' && reflexiones[a.id])
        .map((a) => ({ titulo: `Misión ${d.id} · ${a.title}`, texto: reflexiones[a.id] }))
    ),
    ...DIMENSIONS.filter((d) => progreso.respuestas[`lectura_${d.id}`]?.trim()).map((d) => ({
      titulo: `Misión ${d.id} · ${RECURSOS[d.id].lectura.pregunta}`,
      texto: progreso.respuestas[`lectura_${d.id}`]
    }))
  ];

  return (
    <div data-ui className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div role="dialog" aria-modal="true" aria-label="Diario de Gregor" className="w-full max-w-4xl my-auto rounded-2xl border border-amber-400/50 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <NotebookPen className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-100">Diario de Gregor</h2>
              <p className="text-[11px] font-rajdhani uppercase tracking-widest text-slate-400">
                {puntos} / {PUNTOS_MAXIMOS} puntos de lectura · {paginas} / 15 páginas
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 pt-3 flex gap-2 print:hidden">
          {(['diario', 'respuestas'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                sound.playClick();
                setPestana(p);
              }}
              className={`px-4 py-1.5 rounded-lg font-rajdhani font-bold text-xs tracking-wider cursor-pointer ${
                pestana === p ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {p === 'diario' ? 'PÁGINAS Y SELLOS' : `MIS RESPUESTAS (${respuestas.length})`}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {pestana === 'diario' && (
            <>
              <p className="text-[11px] text-slate-400 italic">
                Estas páginas no son de Kafka: están escritas para el juego a partir de la novela. Compáralas con el libro.
              </p>
              {DIMENSIONS.map((d) => {
                const mision = RECURSOS[d.id];
                const sello = tieneSello(d.id, progreso.recursos);
                return (
                  <section key={d.id}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-cinzel font-bold text-white text-sm sm:text-base">
                        Misión {d.id}. {d.title.replace(`DIMENSIÓN ${d.id}. `, '')}
                      </h3>
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-rajdhani font-bold ${
                          sello ? 'border-amber-400 bg-amber-950/50 text-amber-200' : 'border-slate-700 text-slate-500'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" /> {mision.sello}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {mision.recursos.map((r) => {
                        const abierta = r.id in progreso.recursos;
                        return (
                          <article
                            key={r.id}
                            className={`p-3 rounded-xl border min-h-[130px] ${
                              abierta ? 'border-amber-500/40 bg-[#1a1408]' : 'border-slate-800 bg-slate-950/60'
                            }`}
                          >
                            {abierta ? (
                              <>
                                <h4 className="font-serif italic text-amber-200 text-sm">{r.diario.titulo}</h4>
                                <p className="mt-1.5 font-serif text-[13px] text-slate-200 leading-relaxed texto-seleccionable">
                                  {r.diario.texto}
                                </p>
                              </>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center gap-1.5 text-center text-slate-500">
                                <Lock className="w-5 h-5" />
                                <p className="text-[11px] font-rajdhani">Se abre con: {r.objeto.nombre}</p>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </>
          )}

          {pestana === 'respuestas' && (
            <>
              {respuestas.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Aquí se guardan tus reflexiones y tus respuestas a las preguntas de lectura.
                </p>
              ) : (
                respuestas.map((r, i) => (
                  <article key={i} className="p-3 rounded-xl border border-slate-700 bg-slate-950/60">
                    <h4 className="text-xs font-rajdhani font-bold text-cyan-300">{r.titulo}</h4>
                    <p className="mt-1 text-sm text-slate-100 whitespace-pre-wrap texto-seleccionable">{r.texto}</p>
                  </article>
                ))
              )}
              <button
                onClick={() => window.print()}
                className="print:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-rajdhani font-bold text-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" /> IMPRIMIR O GUARDAR EN PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
