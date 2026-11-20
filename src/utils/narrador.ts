import type { Hablante } from '../types/recursos';

/**
 * Narrador: lee en voz alta con la síntesis de voz del navegador (Web Speech API).
 * No necesita archivos de audio ni conexión en la mayoría de equipos.
 * Si el navegador no tiene voz en español, el juego sigue solo con subtítulos.
 */
const sintesis: SpeechSynthesis | null =
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

let vozEs: SpeechSynthesisVoice | null = null;

function elegirVoz() {
  if (!sintesis) return;
  const voces = sintesis.getVoices();
  // Se prefiere español de Latinoamérica; si no hay, cualquier español.
  vozEs =
    voces.find((v) => /^es[-_](CO|MX|US|419)/i.test(v.lang)) ||
    voces.find((v) => /^es/i.test(v.lang)) ||
    null;
}

if (sintesis) {
  elegirVoz();
  sintesis.addEventListener?.('voiceschanged', elegirVoz);
}

/** Tono de voz de cada hablante, para distinguirlos un poco al oído. */
const TONO: Record<Hablante, number> = {
  narrador: 1,
  guia: 0.8,
  gregor: 0.9,
  padre: 0.7,
  madre: 1.25,
  grete: 1.35,
  apoderado: 0.85
};

export function hayVoz(): boolean {
  if (!vozEs) elegirVoz();
  return !!sintesis && !!vozEs;
}

/** Lee un texto. Llama a `alTerminar` cuando acaba (o si falla). */
export function decir(texto: string, quien: Hablante, alTerminar: () => void) {
  if (!sintesis || !hayVoz()) {
    alTerminar();
    return;
  }
  sintesis.cancel();
  const frase = new SpeechSynthesisUtterance(texto.replace(/[«»]/g, ''));
  frase.voice = vozEs;
  frase.lang = vozEs!.lang;
  frase.rate = 0.98;
  frase.pitch = TONO[quien] ?? 1;
  let avisado = false;
  const fin = () => {
    if (avisado) return;
    avisado = true;
    alTerminar();
  };
  frase.onend = fin;
  frase.onerror = fin;
  sintesis.speak(frase);
}

export function callar() {
  sintesis?.cancel();
}

/** Segundos que tarda en leerse una línea (para avanzar cuando no hay voz). */
export function duracionEstimada(texto: string): number {
  const palabras = texto.trim().split(/\s+/).length;
  return Math.max(2.2, palabras / 2.5 + 0.8);
}
