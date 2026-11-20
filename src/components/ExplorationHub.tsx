import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Film, Gamepad2, Image as IconoImagen, NotebookPen, X } from 'lucide-react';
import { Dimension } from '../types/game';
import type { Recurso } from '../types/recursos';
import { PUNTOS, RECURSOS } from '../data/recursos';
import { completarRecurso, tieneSello, useProgreso } from '../utils/progreso';
import { sound } from '../utils/audio';
import { useIs3D } from '../three/prefs';
import { useScene } from '../three/store';
import { CinematicPlayer } from './CinematicPlayer';
import { InteractiveImage } from './recursos/InteractiveImage';
import { MiniGame } from './recursos/MiniGame';

interface ExplorationHubProps {
  dimension: Dimension;
  onStartChallenges: () => void;
  onBackToCinematic: () => void;
  onBackToMap: () => void;
  onOpenDiary: () => void;
}

const ICONO = { capsula: Film, imagen: IconoImagen, minijuego: Gamepad2 };
const TIPO = { capsula: 'Video complementario', imagen: 'Imagen interactiva', minijuego: 'Minijuego de lectura' };

/**
 * Ampliación: exploración de la habitación.
 * En 3D, cada recurso se abre tocando su objeto en la escena (marcador dorado).
 * La lista de la derecha abre los mismos recursos: sirve para el modo 2D,
 * para teclado y para lectores de pantalla.
 */
export const ExplorationHub: React.FC<ExplorationHubProps> = ({
  dimension,
  onStartChallenges,
  onBackToCinematic,
  onBackToMap,
  onOpenDiary
}) => {
  const is3d = useIs3D();
  const mision = RECURSOS[dimension.id];
  const hechos = useProgreso((s) => s.recursos);
  const [abierto, setAbierto] = useState<Recurso | null>(null);
  const [premio, setPremio] = useState<{ puntos: number; pagina: string } | null>(null);
  const [toque, setToque] = useState<{ id: string; n: number } | null>(null);

  // «Busca el símbolo» se juega con la escena a la vista, no en una ventana.
  const buscando = abierto?.tipo === 'minijuego' && abierto.minijuego.tipo === 'simbolos' ? abierto.minijuego : null;

  const abrir = (recurso: Recurso) => {
    sound.playClick();
    setPremio(null);
    setAbierto(recurso);
  };
  const cerrar = () => {
    setAbierto(null);
    setPremio(null);
  };
  const completar = (recurso: Recurso, acierto = 1) => {
    const puntos = Math.round(PUNTOS[recurso.tipo] * acierto);
    const nuevo = !(recurso.id in useProgreso.getState().recursos);
    completarRecurso(recurso.id, puntos);
    setPremio({ puntos, pagina: recurso.diario.titulo });
    if (nuevo) sound.playLevelUp();
  };

  // La escena 3D dibuja los objetos de los recursos (o los candidatos del minijuego de símbolos).
  const abrirRef = useRef(abrir);
  abrirRef.current = abrir;
  useEffect(() => {
    if (buscando) {
      useScene.setState((s) => ({
        puntos3d: buscando.objetos.map((o) => ({ id: o.id, etiqueta: o.nombre, posicion: o.posicion, hecho: false })),
        handlers: { ...s.handlers, onPunto: (id) => setToque((t) => ({ id, n: (t?.n ?? 0) + 1 })) }
      }));
    } else {
      useScene.setState((s) => ({
        puntos3d: mision.recursos.map((r) => ({
          id: r.id,
          etiqueta: r.objeto.nombre,
          posicion: r.objeto.posicion,
          accesorio: r.objeto.accesorio,
          giroY: r.objeto.giroY,
          hecho: r.id in hechos
        })),
        handlers: {
          ...s.handlers,
          onPunto: (id) => {
            const recurso = mision.recursos.find((r) => r.id === id);
            if (recurso) abrirRef.current(recurso);
          }
        }
      }));
    }
  }, [mision, hechos, buscando]);
  useEffect(
    () => () => useScene.setState((s) => ({ puntos3d: [], handlers: { ...s.handlers, onPunto: undefined } })),
    []
  );

  // Esc cierra el recurso abierto.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  const completos = mision.recursos.filter((r) => r.id in hechos).length;
  const sello = tieneSello(dimension.id, hechos);

  const aviso = premio && (
    <div className="mt-3 p-3 rounded-xl border border-amber-400/60 bg-amber-950/30 flex flex-wrap items-center gap-3 animate-fadeIn" aria-live="polite">
      <NotebookPen className="w-5 h-5 text-amber-300 shrink-0" />
      <p className="flex-1 text-sm text-amber-100">
        <strong>+{premio.puntos} puntos de lectura.</strong> Nueva página del diario de Gregor: «{premio.pagina}».
      </p>
      <button onClick={onOpenDiary} className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-rajdhani font-bold text-xs cursor-pointer">
        LEER EL DIARIO
      </button>
    </div>
  );

  return (
    <div className={`relative min-h-screen w-full flex flex-col p-3 sm:p-6 ${is3d ? 'bg-transparent' : 'bg-slate-950'}`}>
      {/* Barra superior */}
      <div data-ui className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-4 sm:pr-40">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-300 font-rajdhani font-bold text-sm tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>REGRESAR AL MAPA</span>
        </button>
        <div className="text-center">
          <div className="text-xs font-rajdhani uppercase tracking-widest text-amber-300 font-bold">
            EXPLORACIÓN · {dimension.scenarioName}
          </div>
          <h1 className="font-cinzel text-lg sm:text-2xl font-bold text-white">{dimension.title}</h1>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onOpenDiary();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-500/40 bg-slate-900/80 hover:bg-amber-950/40 text-amber-200 font-rajdhani font-bold text-sm tracking-wider cursor-pointer"
        >
          <NotebookPen className="w-4 h-4" /> DIARIO
        </button>
      </div>

      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Izquierda: la habitación */}
        <div className="lg:col-span-7">
          {is3d ? (
            <div data-scene-window className="min-h-[42vh] lg:min-h-[62vh] rounded-2xl" />
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 aspect-video bg-black">
              <img src={dimension.posterImage} alt={dimension.scenarioName} className="w-full h-full object-cover opacity-70" />
            </div>
          )}
          <p data-ui className="mt-2 text-xs text-slate-300 font-rajdhani text-center">
            {is3d
              ? 'Toca los marcadores dorados de la habitación, o usa la lista.'
              : 'Modo 2D: abre cada recurso desde la lista.'}
          </p>
        </div>

        {/* Derecha: lista de recursos, o el minijuego de símbolos */}
        <div data-ui className="lg:col-span-5 space-y-3">
          {buscando && abierto ? (
            <div className="p-4 rounded-2xl border-2 border-amber-400/50 bg-slate-950/90 backdrop-blur">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="font-cinzel font-bold text-amber-200">{abierto.titulo}</h2>
                <button onClick={cerrar} aria-label="Cerrar" className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <MiniGame juego={buscando} toque={toque} onTerminar={(a) => completar(abierto, a)} />
              {aviso}
            </div>
          ) : (
            <>
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="font-cinzel font-bold text-white">Recursos de la habitación</h2>
                  <span className="text-xs font-rajdhani font-bold text-amber-300">
                    {completos} / {mision.recursos.length}
                  </span>
                </div>
                {mision.recursos.map((recurso) => {
                  const Icono = ICONO[recurso.tipo];
                  const hecho = recurso.id in hechos;
                  return (
                    <button
                      key={recurso.id}
                      onClick={() => abrir(recurso)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        hecho
                          ? 'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400'
                          : 'border-amber-500/40 bg-slate-900/70 hover:border-amber-300'
                      }`}
                    >
                      <Icono className={`w-5 h-5 mt-0.5 shrink-0 ${hecho ? 'text-emerald-300' : 'text-amber-300'}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[10px] font-rajdhani font-bold uppercase tracking-widest text-slate-400">
                          {TIPO[recurso.tipo]} · {recurso.objeto.nombre}
                        </span>
                        <span className="block text-sm font-semibold text-white">{recurso.titulo}</span>
                        <span className="block text-[11px] text-slate-400">{recurso.objeto.lugar}</span>
                      </span>
                      {hecho ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[11px] font-rajdhani font-bold text-amber-300 shrink-0">+{PUNTOS[recurso.tipo]}</span>
                      )}
                    </button>
                  );
                })}
                <p className={`text-xs font-rajdhani font-bold ${sello ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {sello ? `✦ ${mision.sello} conseguido` : `Completa los tres para ganar el ${mision.sello}.`}
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onStartChallenges();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cinzel font-bold text-base tracking-wider shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>COMENZAR DESAFÍOS DEL CAZADOR</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToCinematic();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-300 font-rajdhani font-bold text-xs tracking-wider cursor-pointer"
              >
                VOLVER A VER LA CINEMÁTICA
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ventana del recurso abierto (todo menos «Busca el símbolo») */}
      {abierto && !buscando && (
        <div data-ui className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div role="dialog" aria-modal="true" aria-label={abierto.titulo} className="w-full max-w-4xl my-auto rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-cyan-500/20">
              <div className="min-w-0">
                <div className="text-[10px] font-rajdhani font-bold uppercase tracking-widest text-amber-300">
                  {TIPO[abierto.tipo]} · {abierto.objeto.nombre}
                </div>
                <h2 className="font-cinzel text-base sm:text-xl font-bold text-white truncate">{abierto.titulo}</h2>
              </div>
              <button onClick={cerrar} aria-label="Cerrar" className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {abierto.tipo === 'capsula' && (
                <CinematicPlayer cinematica={abierto.capsula} onFin={(completa) => completa && completar(abierto)} />
              )}
              {abierto.tipo === 'imagen' && <InteractiveImage imagen={abierto.imagen} onCompleta={() => completar(abierto)} />}
              {abierto.tipo === 'minijuego' && <MiniGame juego={abierto.minijuego} onTerminar={(a) => completar(abierto, a)} />}
              {aviso}
              <div className="mt-4 flex justify-end">
                <button onClick={cerrar} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-rajdhani font-bold text-sm cursor-pointer">
                  <BookOpen className="w-4 h-4" /> VOLVER A LA HABITACIÓN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
