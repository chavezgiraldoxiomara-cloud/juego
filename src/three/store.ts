import { create } from 'zustand';
import type { GameActivity } from '../types/game';

/**
 * Puente entre la lógica del juego (React/HTML) y la escena 3D.
 * La escena solo LEE este estado y avisa de clics; nunca valida respuestas.
 */
export interface Punto3D {
  id: string;
  etiqueta: string;
  posicion: [number, number, number];
  hecho: boolean;
  accesorio?: 'libro' | 'marco';
  giroY?: number;
}

export interface SceneState {
  screen: 'title' | 'map' | 'dimension';
  dimensionId: number | null;
  /** Ampliación: 'explore' (recursos de la habitación) y 'reading' (invitación a leer). */
  dimensionMode: 'cinematic' | 'explore' | 'activity' | 'reading';
  completed: number[];

  /** Portal enfocado en el mapa (1..5) y portal que se está cruzando. */
  focusDim: number;
  warpDim: number | null;
  /** Giro horizontal temporal mientras se arrastra en el mapa (radianes). */
  dragYaw: number;

  /** Actividad en curso y su estado visible. */
  activity: GameActivity | null;
  feedback: 'idle' | 'success' | 'failure';
  discoveredClues: string[];
  selectedObjects: string[];

  /** Secuencia de la recompensa final (se abre sobre el mapa). */
  finale: { open: boolean; step: number; portalIndex: number; chestOpening: boolean; chestOpened: boolean };

  /** Elemento <video> de la cinemática, proyectado como textura. */
  video: HTMLVideoElement | null;

  /**
   * Ampliación: puntos interactivos de la habitación (objetos que abren recursos
   * o candidatos del minijuego «Busca el símbolo»). La escena solo los dibuja.
   */
  puntos3d: Punto3D[];

  handlers: {
    onPunto?: (id: string) => void;
    onPortal?: (dimId: number) => void;
    onClue?: (clueId: string) => void;
    onObject?: (objectId: string) => void;
    onChest?: () => void;
  };
}

export const useScene = create<SceneState>(() => ({
  screen: 'title',
  dimensionId: null,
  dimensionMode: 'cinematic',
  completed: [],
  focusDim: 1,
  warpDim: null,
  dragYaw: 0,
  activity: null,
  feedback: 'idle',
  discoveredClues: [],
  selectedObjects: [],
  finale: { open: false, step: 1, portalIndex: 0, chestOpening: false, chestOpened: false },
  video: null,
  puntos3d: [],
  handlers: {}
}));

/** ¿El evento nació sobre la interfaz HTML? Entonces la escena lo ignora. */
export function isUiEvent(nativeEvent: Event): boolean {
  const target = nativeEvent.target as Element | null;
  if (!target || typeof target.closest !== 'function') return false;
  return !!target.closest('[data-ui], button, a, input, textarea, select, video');
}
