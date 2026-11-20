import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowRight, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import type { Minijuego } from '../../types/recursos';
import { sound } from '../../utils/audio';

interface Props {
  juego: Minijuego;
  /** Puntuación de 0 a 1 al terminar. */
  onTerminar: (acierto: number) => void;
  /** Solo «Busca el símbolo»: último objeto tocado en la escena 3D. */
  toque?: { id: string; n: number } | null;
}

/** Baraja una lista sin alterar la original. */
function barajar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const tarjeta = 'p-4 rounded-xl border border-cyan-500/30 bg-slate-900/70';
const opcion =
  'w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all cursor-pointer disabled:cursor-default';
const seguir =
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-rajdhani font-bold text-sm tracking-wider cursor-pointer';

const COLOR_NIVEL: Record<string, string> = {
  literal: 'bg-cyan-950 text-cyan-300 border-cyan-500/50',
  inferencial: 'bg-purple-950 text-purple-300 border-purple-500/50',
  crítica: 'bg-amber-950 text-amber-300 border-amber-500/50'
};

/** Motor de los minijuegos de comprensión lectora. */
export const MiniGame: React.FC<Props> = ({ juego, onTerminar, toque }) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">{juego.instruccion}</p>
      {(juego.tipo === 'quiz' || juego.tipo === 'citas' || juego.tipo === 'simbolos') && (
        <Preguntas juego={juego} onTerminar={onTerminar} toque={toque} />
      )}
      {juego.tipo === 'decisiones' && <Decisiones juego={juego} onTerminar={onTerminar} />}
      {juego.tipo === 'ordenar' && <Ordenar juego={juego} onTerminar={onTerminar} />}
    </div>
  );
};

/* ── Quiz por niveles, citas ↔ personaje y búsqueda de símbolos comparten mecánica:
      una pregunta, varias opciones, una correcta y una explicación. ── */

interface Ronda {
  etiqueta?: string;
  enunciado: string;
  cita?: boolean;
  opciones: { id: string; texto: string }[];
  correcta: string;
  explicacion: string;
}

function construirRondas(juego: Extract<Minijuego, { tipo: 'quiz' | 'citas' | 'simbolos' }>): Ronda[] {
  if (juego.tipo === 'quiz') {
    return juego.preguntas.map((p) => ({
      etiqueta: `Lectura ${p.nivel}`,
      enunciado: p.pregunta,
      // Las opciones se barajan para que la correcta no esté siempre en el mismo sitio.
      opciones: barajar(p.opciones.map((texto, i) => ({ id: String(i), texto }))),
      correcta: String(p.correcta),
      explicacion: p.explicacion
    }));
  }
  if (juego.tipo === 'citas') {
    return barajar(juego.citas).map((c) => ({
      enunciado: c.cita,
      cita: true,
      opciones: juego.personajes.map((p) => ({ id: p, texto: p })),
      correcta: c.personaje,
      explicacion: c.explicacion
    }));
  }
  return juego.retos.map((r) => ({
    etiqueta: 'Pista',
    enunciado: r.pista,
    opciones: juego.objetos.map((o) => ({ id: o.id, texto: o.nombre })),
    correcta: r.objeto,
    explicacion: r.explicacion
  }));
}

const Preguntas: React.FC<{
  juego: Extract<Minijuego, { tipo: 'quiz' | 'citas' | 'simbolos' }>;
  onTerminar: (acierto: number) => void;
  toque?: { id: string; n: number } | null;
}> = ({ juego, onTerminar, toque }) => {
  const rondas = useMemo(() => construirRondas(juego), [juego]);
  const [n, setN] = useState(0);
  const [fallos, setFallos] = useState<string[]>([]);
  const [resuelta, setResuelta] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const ronda = rondas[n];

  const elegir = (id: string) => {
    if (resuelta || fin || fallos.includes(id)) return;
    if (id === ronda.correcta) {
      sound.playCorrect();
      // Solo cuenta como acierto si se responde bien al primer intento.
      if (fallos.length === 0) setAciertos((a) => a + 1);
      setResuelta(true);
    } else {
      sound.playError();
      setFallos((f) => [...f, id]);
    }
  };

  // Toque llegado desde la escena 3D («Busca el símbolo»).
  useEffect(() => {
    if (toque) elegir(toque.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toque?.n]);

  const avanzar = () => {
    sound.playClick();
    if (n >= rondas.length - 1) {
      setFin(true);
      onTerminar(aciertos / rondas.length);
    } else {
      setN(n + 1);
      setFallos([]);
      setResuelta(false);
    }
  };

  if (fin) {
    return (
      <div className={`${tarjeta} text-center space-y-2`}>
        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
        <p className="font-cinzel font-bold text-white">
          {aciertos} de {rondas.length} al primer intento
        </p>
        <p className="text-sm text-slate-300">
          {aciertos === rondas.length
            ? 'Lectura impecable.'
            : 'Las que fallaste son buenas razones para volver al texto.'}
        </p>
      </div>
    );
  }

  return (
    <div className={tarjeta}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-rajdhani font-bold text-slate-400">
          {n + 1} / {rondas.length}
        </span>
        {ronda.etiqueta && (
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-rajdhani font-bold uppercase tracking-widest ${
              COLOR_NIVEL[ronda.etiqueta.replace('Lectura ', '')] ?? 'bg-slate-800 text-slate-300 border-slate-600'
            }`}
          >
            {ronda.etiqueta}
          </span>
        )}
      </div>
      <p className={`text-base text-white leading-relaxed mb-3 texto-seleccionable ${ronda.cita ? 'italic font-serif' : 'font-semibold'}`}>
        {ronda.enunciado}
      </p>
      <div className={`grid gap-2 ${ronda.cita ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {ronda.opciones.map((o) => {
          const fallada = fallos.includes(o.id);
          const acertada = resuelta && o.id === ronda.correcta;
          return (
            <button
              key={o.id}
              onClick={() => elegir(o.id)}
              disabled={resuelta || fallada}
              className={`${opcion} ${
                acertada
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-100'
                  : fallada
                  ? 'border-rose-500/50 bg-rose-950/30 text-rose-300/70 line-through'
                  : 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-cyan-400'
              }`}
            >
              {o.texto}
            </button>
          );
        })}
      </div>
      <div className="mt-3 min-h-[3rem]" aria-live="polite">
        {!resuelta && fallos.length > 0 && (
          <p className="flex items-center gap-2 text-sm text-rose-300">
            <XCircle className="w-4 h-4 shrink-0" /> No es esa. Vuelve a pensarlo.
          </p>
        )}
        {resuelta && (
          <div className="space-y-2 animate-fadeIn">
            <p className="text-sm text-emerald-200 leading-relaxed">{ronda.explicacion}</p>
            <button onClick={avanzar} className={seguir}>
              {n >= rondas.length - 1 ? 'TERMINAR' : 'SIGUIENTE'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── ¿Qué harías tú? Se elige y luego se compara con el libro (sin respuestas incorrectas). ── */

const Decisiones: React.FC<{
  juego: Extract<Minijuego, { tipo: 'decisiones' }>;
  onTerminar: (acierto: number) => void;
}> = ({ juego, onTerminar }) => {
  const [n, setN] = useState(0);
  const [eleccion, setEleccion] = useState<number | null>(null);
  const [coincidencias, setCoincidencias] = useState(0);
  const [fin, setFin] = useState(false);
  const dilema = juego.dilemas[n];

  const elegir = (i: number) => {
    if (eleccion !== null) return;
    sound.playClick();
    setEleccion(i);
    if (i === dilema.enElLibro) setCoincidencias((c) => c + 1);
  };
  const avanzar = () => {
    if (n >= juego.dilemas.length - 1) {
      setFin(true);
      sound.playCorrect();
      onTerminar(1); // se puntúa por participar y comparar, no por coincidir
    } else {
      setN(n + 1);
      setEleccion(null);
    }
  };

  if (fin) {
    return (
      <div className={`${tarjeta} text-center space-y-2`}>
        <BookOpen className="w-10 h-10 text-cyan-300 mx-auto" />
        <p className="font-cinzel font-bold text-white">
          Coincidiste con el libro en {coincidencias} de {juego.dilemas.length} decisiones
        </p>
        <p className="text-sm text-slate-300">
          Donde no coincidiste, pregúntate: ¿qué sabía el personaje que tú no, o qué no se atrevía a hacer?
        </p>
      </div>
    );
  }

  return (
    <div className={tarjeta}>
      <span className="text-xs font-rajdhani font-bold text-slate-400">
        {n + 1} / {juego.dilemas.length}
      </span>
      <p className="text-base text-white font-semibold leading-relaxed my-2">{dilema.situacion}</p>
      <div className="grid gap-2">
        {dilema.opciones.map((texto, i) => (
          <button
            key={i}
            onClick={() => elegir(i)}
            disabled={eleccion !== null}
            className={`${opcion} ${
              eleccion === null
                ? 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-cyan-400'
                : i === dilema.enElLibro
                ? 'border-amber-400 bg-amber-950/40 text-amber-100'
                : i === eleccion
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-100'
                : 'border-slate-800 bg-slate-950/40 text-slate-500'
            }`}
          >
            {texto}
            {eleccion !== null && i === eleccion && <span className="ml-2 text-[10px] font-rajdhani font-bold uppercase text-cyan-300">· tu elección</span>}
            {eleccion !== null && i === dilema.enElLibro && <span className="ml-2 text-[10px] font-rajdhani font-bold uppercase text-amber-300">· en el libro</span>}
          </button>
        ))}
      </div>
      {eleccion !== null && (
        <div className="mt-3 space-y-2 animate-fadeIn" aria-live="polite">
          <p className="text-sm text-slate-200 leading-relaxed">{dilema.explicacion}</p>
          <button onClick={avanzar} className={seguir}>
            {n >= juego.dilemas.length - 1 ? 'TERMINAR' : 'SIGUIENTE'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Ordenar los acontecimientos de la historia ── */

const Ordenar: React.FC<{
  juego: Extract<Minijuego, { tipo: 'ordenar' }>;
  onTerminar: (acierto: number) => void;
}> = ({ juego, onTerminar }) => {
  const [orden, setOrden] = useState<number[]>(() => {
    // Se baraja hasta que el resultado no coincida con el orden correcto.
    let mezcla = barajar(juego.eventos.map((_, i) => i));
    while (mezcla.every((v, i) => v === i)) mezcla = barajar(mezcla);
    return mezcla;
  });
  const [intentos, setIntentos] = useState(0);
  const [resultado, setResultado] = useState<'pendiente' | 'mal' | 'bien'>('pendiente');

  const mover = (pos: number, paso: number) => {
    const destino = pos + paso;
    if (destino < 0 || destino >= orden.length || resultado === 'bien') return;
    sound.playClick();
    const copia = [...orden];
    [copia[pos], copia[destino]] = [copia[destino], copia[pos]];
    setOrden(copia);
    setResultado('pendiente');
  };

  const comprobar = () => {
    const bien = orden.every((v, i) => v === i);
    setIntentos(intentos + 1);
    if (bien) {
      sound.playCorrect();
      setResultado('bien');
      // Puntuación completa al primer intento; baja un poco con cada intento extra.
      onTerminar(Math.max(0.5, 1 - intentos * 0.17));
    } else {
      sound.playError();
      setResultado('mal');
    }
  };

  return (
    <div className={tarjeta}>
      <ol className="space-y-2">
        {orden.map((evento, pos) => (
          <li
            key={evento}
            className={`flex items-center gap-2 p-2.5 rounded-xl border ${
              resultado === 'bien'
                ? 'border-emerald-500/60 bg-emerald-950/30'
                : resultado === 'mal' && evento === pos
                ? 'border-emerald-500/40 bg-slate-950/60'
                : 'border-slate-700 bg-slate-950/60'
            }`}
          >
            <span className="w-7 h-7 shrink-0 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
              {pos + 1}
            </span>
            <span className="flex-1 text-sm text-slate-100">{juego.eventos[evento]}</span>
            <button onClick={() => mover(pos, -1)} disabled={pos === 0} aria-label="Subir" className="p-2 rounded-lg bg-slate-800 text-slate-200 disabled:opacity-30 cursor-pointer">
              <ArrowUp className="w-4 h-4" />
            </button>
            <button onClick={() => mover(pos, 1)} disabled={pos === orden.length - 1} aria-label="Bajar" className="p-2 rounded-lg bg-slate-800 text-slate-200 disabled:opacity-30 cursor-pointer">
              <ArrowDown className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3" aria-live="polite">
        {resultado !== 'bien' && (
          <button onClick={comprobar} className={seguir}>
            COMPROBAR ORDEN
          </button>
        )}
        {resultado === 'mal' && (
          <p className="text-sm text-rose-300">
            Todavía no. Los que quedaron con borde verde ya están en su sitio.
          </p>
        )}
        {resultado === 'bien' && (
          <p className="flex items-center gap-2 text-sm text-emerald-200">
            <CheckCircle className="w-4 h-4" /> Ese es el orden del libro: tres partes, tres salidas, tres expulsiones.
          </p>
        )}
      </div>
    </div>
  );
};
