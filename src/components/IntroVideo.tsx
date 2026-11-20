import React, { useEffect, useRef, useState } from 'react';
import { SkipForward } from 'lucide-react';

/** Ruta fija del video de introducción (incluido en el proyecto). */
const RUTA_INTRO = '/assets/videos/intro.mp4';

/**
 * El video de introducción viene incluido en el proyecto, así que siempre se intenta mostrar.
 * Corrección: antes dependía de la lista de videos que arma vite.config.ts al compilar;
 * en Google AI Studio esa lista podía llegar vacía y la intro desaparecía.
 * Si el archivo no carga, onError salta directo al mapa.
 */
export const hayIntro = () => true;

/**
 * Ampliación: video de introducción («Una mañana, todo cambió…»).
 * Se muestra al iniciar una aventura nueva y puede saltarse en cualquier momento.
 * El archivo solo se descarga cuando este componente aparece en pantalla.
 */
export const IntroVideo: React.FC<{ onFin: () => void }> = ({ onFin }) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  // Corrección: el servidor de Google AI Studio no admite peticiones por partes (Range),
  // y sin ellas Chrome puede quedarse pegado a mitad del video. Por eso se descarga
  // el archivo completo (2,5 MB) y se reproduce desde la memoria del navegador.
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let urlLocal: string | null = null;
    let vigente = true;
    fetch(RUTA_INTRO)
      .then((r) => {
        if (!r.ok) throw new Error('sin video');
        return r.blob();
      })
      .then((blob) => {
        if (!vigente) return;
        urlLocal = URL.createObjectURL(blob);
        setSrc(urlLocal);
      })
      // Si la descarga falla, se intenta la ruta directa como antes.
      .catch(() => vigente && setSrc(RUTA_INTRO));
    return () => {
      vigente = false;
      if (urlLocal) URL.revokeObjectURL(urlLocal);
    };
  }, []);

  useEffect(() => {
    // Si el navegador bloquea la reproducción con sonido, se intenta en silencio.
    const video = ref.current;
    if (!video || !src) return;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [src]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && onFin();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onFin]);

  return (
    <div data-ui className="fixed inset-0 z-[80] bg-black flex items-center justify-center animate-fadeIn">
      {src ? (
        <video
          ref={ref}
          src={src}
          poster="/assets/videos/intro_poster.jpg"
          playsInline
          controls
          onEnded={onFin}
          onError={onFin}
          className="w-full h-full object-contain"
        />
      ) : (
        <p className="font-rajdhani text-cyan-200 tracking-widest animate-pulse">CARGANDO INTRODUCCIÓN…</p>
      )}
      <button
        onClick={onFin}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-cyan-200 font-rajdhani font-bold text-sm tracking-wider cursor-pointer"
      >
        SALTAR INTRODUCCIÓN <SkipForward className="w-4 h-4" />
      </button>
    </div>
  );
};
