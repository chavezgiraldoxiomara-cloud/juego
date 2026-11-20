import { create } from 'zustand';
import { RECURSOS, PUNTOS } from '../data/recursos';

/**
 * Progreso de los recursos nuevos (puntos de lectura, diario, sellos y preferencias
 * del reproductor). Se guarda aparte de la partida original para no alterar
 * su formato: clave METAMORFOSIS_RECURSOS_V1 de localStorage.
 */
const CLAVE = 'METAMORFOSIS_RECURSOS_V1';

interface Guardado {
  /** Puntos obtenidos por cada recurso completado (id → puntos). */
  recursos: Record<string, number>;
  /** Misiones cuya invitación a leer ya se abrió con «Leer más». */
  lecturas: number[];
  /** Respuestas escritas por el estudiante (pregunta de lectura y reflexiones). */
  respuestas: Record<string, string>;
  /** Cinemáticas vistas hasta el final. */
  cinematicas: number[];
  introVista: boolean;
  voz: boolean;
  subtitulos: boolean;
}

const INICIAL: Guardado = {
  recursos: {},
  lecturas: [],
  respuestas: {},
  cinematicas: [],
  introVista: false,
  voz: true,
  subtitulos: true
};

function cargar(): Guardado {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo) return { ...INICIAL, ...JSON.parse(crudo) };
  } catch {
    /* almacenamiento no disponible: se juega sin guardar */
  }
  return INICIAL;
}

export const useProgreso = create<Guardado>(() => cargar());

// Cada cambio se guarda automáticamente.
useProgreso.subscribe((estado) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* sin almacenamiento */
  }
});

/** Marca un recurso como completado; conserva la mejor puntuación. */
export function completarRecurso(id: string, puntos: number) {
  useProgreso.setState((s) => ({ recursos: { ...s.recursos, [id]: Math.max(s.recursos[id] ?? 0, puntos) } }));
}

export function marcarLectura(mision: number) {
  useProgreso.setState((s) => (s.lecturas.includes(mision) ? s : { lecturas: [...s.lecturas, mision] }));
}

export function marcarCinematica(mision: number) {
  useProgreso.setState((s) => (s.cinematicas.includes(mision) ? s : { cinematicas: [...s.cinematicas, mision] }));
}

export function guardarRespuesta(clave: string, texto: string) {
  useProgreso.setState((s) => ({ respuestas: { ...s.respuestas, [clave]: texto } }));
}

/** Borra todo el progreso de recursos (se llama al reiniciar la aventura). */
export function reiniciarProgreso() {
  const { voz, subtitulos } = useProgreso.getState();
  useProgreso.setState({ ...INICIAL, voz, subtitulos });
}

/** Puntos de lectura totales. */
export function calcularPuntos(s: Pick<Guardado, 'recursos' | 'lecturas'>): number {
  return Object.values(s.recursos).reduce((a, b) => a + b, 0) + s.lecturas.length * PUNTOS.lectura;
}

/** ¿Están completos los tres recursos de la misión? (da el sello) */
export function tieneSello(mision: number, recursos: Record<string, number>): boolean {
  return RECURSOS[mision].recursos.every((r) => r.id in recursos);
}
