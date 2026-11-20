import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, ChevronLeft, ChevronRight, Captions, Mic, MicOff } from 'lucide-react';
import type { Cinematica, Hablante } from '../types/recursos';
import { callar, decir, duracionEstimada, hayVoz } from '../utils/narrador';
import { rutaSubtitulos, rutaVideo } from '../utils/videos';
import { useProgreso } from '../utils/progreso';
import { sound } from '../utils/audio';

interface CinematicPlayerProps {
  cinematica: Cinematica;
  /** Se llama al terminar o al pulsar «Saltar». */
  onFin?: (completa: boolean) => void;
}

const NOMBRE: Record<Hablante, string> = {
  narrador: 'Narrador',
  guia: 'El guía',
  gregor: 'Gregor',
  padre: 'El padre',
  madre: 'La madre',
  grete: 'Grete',
  apoderado: 'El apoderado'
};

const boton =
  'flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all cursor-pointer';

/**
 * Reproductor de cinemáticas ampliadas.
 *  - Si existe el video real en public/assets/videos/, lo reproduce (carga diferida).
 *  - Si no, reproduce el guion como cinemática narrada: imagen por escena con
 *    movimiento lento, voz del navegador y subtítulos.
 * En ambos casos se puede pausar, repetir y saltar.
 */
export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({ cinematica, onFin }) => {
  const video = rutaVideo(cinematica.video);
  return video ? (
    <VideoReal cinematica={cinematica} src={video} onFin={onFin} />
  ) : (
    <Narrada cinematica={cinematica} onFin={onFin} />
  );
};

/* ───────────────────────── Video real ───────────────────────── */

const VideoReal: React.FC<{ cinematica: Cinematica; src: string; onFin?: (completa: boolean) => void }> = ({ cinematica, src, onFin }) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const subtitulos = rutaSubtitulos(cinematica.video);
  const poster = cinematica.escenas[0]?.imagen;

  return (
    <div data-ui className="flex flex-col gap-2">
      <div className="relative rounded-2xl overflow-hidden aspect-video border-2 border-cyan-500/40 bg-black">
        {/* preload="none": el video no se descarga hasta que se pulsa reproducir */}
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          onEnded={() => onFin?.(true)}
          className="w-full h-full object-contain bg-black"
        >
          {subtitulos && <track kind="subtitles" srcLang="es" label="Español" src={subtitulos} default />}
        </video>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            if (!ref.current) return;
            ref.current.currentTime = 0;
            ref.current.play().catch(() => {});
          }}
          className={`${boton} bg-slate-800 hover:bg-slate-700 text-slate-100`}
        >
          <RotateCcw className="w-4 h-4" /> REPETIR
        </button>
        <button
          onClick={() => {
            ref.current?.pause();
            onFin?.(false);
          }}
          className={`${boton} bg-slate-800 hover:bg-slate-700 text-slate-100`}
        >
          <SkipForward className="w-4 h-4" /> SALTAR
        </button>
        <span className="text-[11px] text-slate-400 font-rajdhani">
          Pausa y subtítulos: en los controles del propio video.
        </span>
      </div>
    </div>
  );
};

/* ───────────────────── Cinemática narrada ───────────────────── */

const Narrada: React.FC<{ cinematica: Cinematica; onFin?: (completa: boolean) => void }> = ({ cinematica, onFin }) => {
  // El guion se aplana en una lista de líneas, cada una con su escena.
  const lineas = useMemo(
    () => cinematica.escenas.flatMap((escena, e) => escena.lineas.map((linea) => ({ ...linea, e }))),
    [cinematica]
  );
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [terminada, setTerminada] = useState(false);
  const voz = useProgreso((s) => s.voz);
  const subtitulos = useProgreso((s) => s.subtitulos);
  const finAvisado = useRef(false);
  const saltada = useRef(false);

  const actual = lineas[Math.min(indice, lineas.length - 1)];
  const escena = cinematica.escenas[actual.e];
  const duracionEscena = useMemo(
    () => escena.lineas.reduce((total, l) => total + duracionEstimada(l.texto), 0),
    [escena]
  );
  const total = useMemo(() => lineas.reduce((t, l) => t + duracionEstimada(l.texto), 0), [lineas]);

  // Al cambiar de cinemática se empieza de nuevo.
  useEffect(() => {
    setIndice(0);
    setReproduciendo(true);
    setTerminada(false);
    finAvisado.current = false;
  }, [cinematica.id]);

  // Avance: cada línea se lee (o se espera su tiempo de lectura) y pasa a la siguiente.
  useEffect(() => {
    if (!reproduciendo || terminada) return;
    let vigente = true;
    let reloj: number | undefined;
    const siguiente = () => {
      if (!vigente) return;
      vigente = false;
      window.clearTimeout(reloj);
      if (indice >= lineas.length - 1) {
        setTerminada(true);
        setReproduciendo(false);
      } else {
        setIndice(indice + 1);
      }
    };
    const espera = duracionEstimada(actual.texto);
    if (voz && hayVoz() && !sound.isMuted()) {
      decir(actual.texto, actual.quien, () => (reloj = window.setTimeout(siguiente, 350)));
      // Red de seguridad: algunos navegadores no avisan cuando la voz termina.
      reloj = window.setTimeout(siguiente, (espera * 2 + 4) * 1000);
    } else {
      reloj = window.setTimeout(siguiente, espera * 1000);
    }
    return () => {
      vigente = false;
      window.clearTimeout(reloj);
      callar();
    };
  }, [indice, reproduciendo, terminada, voz, lineas, actual]);

  // Al llegar al final se avisa una sola vez (para dar puntos, desbloquear, etc.).
  useEffect(() => {
    if (terminada && !finAvisado.current) {
      finAvisado.current = true;
      onFin?.(!saltada.current);
    }
  }, [terminada, onFin]);

  // Se precarga solo la imagen de la escena siguiente (carga diferida del resto).
  useEffect(() => {
    const proxima = cinematica.escenas[actual.e + 1];
    if (proxima) new Image().src = proxima.imagen;
  }, [actual.e, cinematica]);

  const alternar = () => {
    sound.playClick();
    if (terminada) return repetir();
    setReproduciendo((r) => !r);
  };
  const repetir = () => {
    saltada.current = false;
    finAvisado.current = false;
    setIndice(0);
    setTerminada(false);
    setReproduciendo(true);
  };
  const irAEscena = (paso: number) => {
    const destino = Math.max(0, Math.min(cinematica.escenas.length - 1, actual.e + paso));
    setIndice(lineas.findIndex((l) => l.e === destino));
    setTerminada(false);
  };
  const saltar = () => {
    saltada.current = true;
    callar();
    setReproduciendo(false);
    setTerminada(true);
  };

  // Barra espaciadora: pausar o continuar.
  const alternarRef = useRef(alternar);
  alternarRef.current = alternar;
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.code !== 'Space' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      alternarRef.current();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  const esRetrato = /aistudio\/|grete_portrait/.test(escena.imagen);
  const foco = escena.foco ?? [50, 50];
  const minutos = Math.floor(total / 60);
  const segundos = Math.round(total % 60);

  return (
    <div data-ui className="flex flex-col gap-2">
      <div className="relative rounded-2xl overflow-hidden aspect-video border-2 border-cyan-500/40 bg-black shadow-2xl shadow-cyan-950/60">
        {/* Imagen de la escena. La clave reinicia la animación al cambiar de escena. */}
        <img
          key={`${cinematica.id}-${actual.e}`}
          src={escena.imagen}
          alt={escena.enPantalla}
          className={`absolute inset-0 w-full h-full animate-fadeIn cine-zoom ${esRetrato ? 'object-contain' : 'object-cover'}`}
          style={{
            transformOrigin: `${foco[0]}% ${foco[1]}%`,
            animationName: 'fadeIn, cineZoom',
            animationDuration: `0.6s, ${duracionEscena + 2}s`,
            animationPlayState: reproduciendo ? 'running' : 'paused'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

        {/* Título de la escena */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded bg-black/70 border border-cyan-500/40 text-[11px] font-rajdhani tracking-widest text-cyan-300 font-bold uppercase">
            {actual.e + 1}/{cinematica.escenas.length} · {escena.titulo}
          </span>
          <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-rajdhani text-slate-300 border border-slate-700">
            ≈ {minutos}:{String(segundos).padStart(2, '0')} min
          </span>
        </div>

        {/* Pantalla final: la pregunta que queda abierta */}
        {terminada && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 bg-black/75 text-center animate-fadeIn">
            {cinematica.preguntaFinal && (
              <p className="font-cinzel text-base sm:text-xl text-cyan-100 max-w-xl leading-relaxed">
                {cinematica.preguntaFinal}
              </p>
            )}
            <button onClick={repetir} className={`${boton} bg-cyan-600 hover:bg-cyan-500 text-white`}>
              <RotateCcw className="w-4 h-4" /> VER DE NUEVO
            </button>
          </div>
        )}

        {/* Subtítulos */}
        {subtitulos && !terminada && (
          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-center" aria-live="polite">
            <div className="inline-block max-w-3xl px-3 py-2 rounded-lg bg-black/80 texto-seleccionable">
              {actual.quien !== 'narrador' && (
                <span className="block text-[10px] sm:text-xs font-rajdhani font-bold uppercase tracking-widest text-amber-300">
                  {NOMBRE[actual.quien]}
                </span>
              )}
              <span
                className={`text-sm sm:text-lg leading-snug text-white ${
                  actual.quien === 'narrador' ? '' : 'italic font-serif'
                }`}
              >
                {actual.quien === 'narrador' || actual.quien === 'guia' ? actual.texto : `«${actual.texto}»`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Barra de avance */}
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden" aria-hidden>
        <div
          className="h-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${terminada ? 100 : (indice / lineas.length) * 100}%` }}
        />
      </div>

      {/* Controles: pausar, repetir, cambiar de escena, saltar, subtítulos y voz */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button onClick={alternar} className={`${boton} bg-cyan-600 hover:bg-cyan-500 text-white`} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}>
          {reproduciendo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{reproduciendo ? 'PAUSAR' : 'REPRODUCIR'}</span>
        </button>
        <button onClick={() => { sound.playClick(); repetir(); }} className={`${boton} bg-slate-800 hover:bg-slate-700 text-slate-100`}>
          <RotateCcw className="w-4 h-4" /> <span>REPETIR</span>
        </button>
        <button onClick={() => irAEscena(-1)} className={`${boton} bg-slate-800 hover:bg-slate-700 text-slate-100`} aria-label="Escena anterior">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => irAEscena(1)} className={`${boton} bg-slate-800 hover:bg-slate-700 text-slate-100`} aria-label="Escena siguiente">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => { sound.playClick(); saltar(); }} className={`${boton} bg-slate-800 hover:bg-slate-700 text-slate-100`}>
          <SkipForward className="w-4 h-4" /> <span>SALTAR</span>
        </button>
        <span className="flex-1" />
        <button
          onClick={() => useProgreso.setState({ subtitulos: !subtitulos })}
          aria-pressed={subtitulos}
          className={`${boton} ${subtitulos ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}
        >
          <Captions className="w-4 h-4" /> <span className="hidden sm:inline">SUBTÍTULOS</span>
        </button>
        <button
          onClick={() => useProgreso.setState({ voz: !voz })}
          aria-pressed={voz}
          className={`${boton} ${voz ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}
        >
          {voz ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />} <span className="hidden sm:inline">VOZ</span>
        </button>
      </div>
    </div>
  );
};
