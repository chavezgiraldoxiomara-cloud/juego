import React, { useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';
import { rutaVideo } from '../utils/videos';

/** ¿Existe el video de introducción en public/assets/videos/? */
export const hayIntro = () => !!rutaVideo('intro.mp4');

/**
 * Ampliación: video de introducción («Una mañana, todo cambió…»).
 * Se muestra al iniciar una aventura nueva y puede saltarse en cualquier momento.
 * El archivo solo se descarga cuando este componente aparece en pantalla.
 */
export const IntroVideo: React.FC<{ onFin: () => void }> = ({ onFin }) => {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Si el navegador bloquea la reproducción con sonido, se intenta en silencio.
    const video = ref.current;
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
    const tecla = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && onFin();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onFin]);

  return (
    <div data-ui className="fixed inset-0 z-[80] bg-black flex items-center justify-center animate-fadeIn">
      <video
        ref={ref}
        src={rutaVideo('intro.mp4') ?? undefined}
        poster="/assets/videos/intro_poster.jpg"
        playsInline
        controls
        onEnded={onFin}
        onError={onFin}
        className="w-full h-full object-contain"
      />
      <button
        onClick={onFin}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-cyan-200 font-rajdhani font-bold text-sm tracking-wider cursor-pointer"
      >
        SALTAR INTRODUCCIÓN <SkipForward className="w-4 h-4" />
      </button>
    </div>
  );
};
