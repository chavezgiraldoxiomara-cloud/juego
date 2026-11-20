/**
 * Datos de PRESENTACIÓN 3D. No contiene contenido pedagógico: solo dónde se
 * ubican en la escena los elementos que ya existen en dimensions.ts,
 * indexados por id de dimensión / actividad / pista.
 */

export type Vec3 = [number, number, number];

/** Colores de energía de cada portal (derivados del degradado de su insignia). */
export const PORTAL_COLORS: Record<number, { main: string; alt: string }> = {
  1: { main: '#22d3ee', alt: '#2563eb' },
  2: { main: '#f59e0b', alt: '#dc2626' },
  3: { main: '#a855f7', alt: '#4f46e5' },
  4: { main: '#f43f5e', alt: '#b45309' },
  5: { main: '#fbbf24', alt: '#9333ea' }
};

/** Posición del marcador de cada pista dentro del escenario de su actividad. */
export const CLUE_ANCHORS: Record<string, Record<string, Vec3>> = {
  d1_act2: {
    reloj: [1.0, 1.1, -2.5],
    muestrario: [-0.55, 1.32, -2.45],
    retrato: [0.15, 2.8, -2.86]
  }
};

/** Posición del marcador de cada objeto seleccionable de `choose_objects`. */
export const OBJECT_ANCHORS: Record<string, Record<string, Vec3>> = {
  d3_act1: {
    leche_podrida: [-2.6, 0.22, 1.5],
    canape_manta: [2.3, 1.05, -2.1],
    cuadro_pieles: [0.15, 2.8, -2.86],
    monedas_oro: [-1.1, 0.5, -2.2],
    espada_cazador: [1.5, 1.2, 1.7]
  }
};

interface PortraitSpot {
  position: Vec3;
  rotationY: number;
  height: number;
  beam?: boolean;
}

const GUIDE_SPOT: PortraitSpot = { position: [-3.1, 1.75, 3.7], rotationY: 0.35, height: 1.6 };

/** Dónde aparece el retrato de cada personaje en el escenario de la dimensión. */
export const PORTRAIT_SPOTS: Record<number, Record<string, PortraitSpot>> = {
  1: {
    gregor_monstruo: { position: [2.25, 2.55, -2.2], rotationY: -0.15, height: 1.25 },
    gregor_humano: { position: [-3.86, 2.0, 1.75], rotationY: Math.PI / 2, height: 1.0 },
    sung_jinwoo: GUIDE_SPOT
  },
  2: {
    gregor_monstruo: { position: [-0.4, 1.55, -1.75], rotationY: 0.1, height: 1.35 },
    padre: { position: [1.7, 1.25, 1.1], rotationY: -0.35, height: 1.5, beam: true },
    madre: { position: [-0.9, 1.15, 1.5], rotationY: 0.15, height: 1.3, beam: true },
    grete: { position: [-3.86, 1.9, -1.7], rotationY: Math.PI / 2, height: 1.0 },
    sung_jinwoo: GUIDE_SPOT
  },
  3: {
    gregor_monstruo: { position: [1.0, 2.3, -2.9], rotationY: 0, height: 1.0 },
    grete: { position: [-1.7, 1.2, 0.4], rotationY: 0.35, height: 1.35, beam: true },
    madre: { position: [-0.3, 1.15, 1.2], rotationY: 0.1, height: 1.3, beam: true },
    sung_jinwoo: GUIDE_SPOT
  },
  4: {
    padre: { position: [1.3, 1.45, 0.5], rotationY: -0.5, height: 1.9, beam: true },
    madre: { position: [-0.3, 1.1, 1.7], rotationY: 0.1, height: 1.2, beam: true },
    grete: { position: [-3.86, 1.9, 1.2], rotationY: Math.PI / 2, height: 1.0 },
    gregor_monstruo: { position: [-2.2, 1.25, -2.2], rotationY: 0.25, height: 1.2 },
    sung_jinwoo: GUIDE_SPOT
  },
  5: {
    grete: { position: [0.6, 1.3, -0.4], rotationY: -0.1, height: 1.5, beam: true },
    padre: { position: [-3.86, 2.0, 1.6], rotationY: Math.PI / 2, height: 1.0 },
    madre: { position: [-3.86, 2.0, 0.4], rotationY: Math.PI / 2, height: 1.0 },
    gregor_monstruo: { position: [-2.3, 1.15, -1.9], rotationY: 0.35, height: 1.2 },
    sung_jinwoo: GUIDE_SPOT
  }
};

/** Pantalla flotante donde se proyecta el clip de la cinemática. */
export const SCREEN = {
  position: [0, 2.35, 4.4] as Vec3,
  width: 6.4,
  height: 3.6
};
