import { useSyncExternalStore } from 'react';

/**
 * Preferencias de presentación 3D. Se guardan en una clave propia para no
 * tocar la forma de SaveState (METAMORFOSIS_SAVE_DATA_V2).
 */
export type RenderMode = 'high' | 'low' | '2d';

const PREFS_KEY = 'METAMORFOSIS_3D_PREFS';

let webglSupport: boolean | null = null;

export function hasWebGL(): boolean {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement('canvas');
      webglSupport = !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

function readStoredMode(): RenderMode {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.mode === 'high' || parsed.mode === 'low' || parsed.mode === '2d') return parsed.mode;
    }
  } catch {}
  // Ampliación: en celulares y equipos modestos se empieza en calidad baja
  // (sin sombras ni posprocesado). El jugador puede subirla con el botón 3D.
  try {
    const tactil = window.matchMedia('(pointer: coarse)').matches;
    const pocaMemoria = ((navigator as any).deviceMemory ?? 8) <= 4;
    if (tactil || pocaMemoria) return 'low';
  } catch {}
  return 'high';
}

let chosenMode: RenderMode = typeof window === 'undefined' ? '2d' : readStoredMode();
/** Se activa si el motor 3D falla en ejecución: el juego sigue en 2D. */
let runtimeFailed = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function effectiveMode(): RenderMode {
  if (runtimeFailed || !hasWebGL()) return '2d';
  return chosenMode;
}

export function setRenderMode(mode: RenderMode) {
  chosenMode = mode;
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ mode }));
  } catch {}
  emit();
}

export function cycleRenderMode() {
  const order: RenderMode[] = ['high', 'low', '2d'];
  setRenderMode(order[(order.indexOf(chosenMode) + 1) % order.length]);
}

export function reportRuntimeFailure() {
  runtimeFailed = true;
  emit();
}

export function useRenderMode(): RenderMode {
  return useSyncExternalStore(subscribe, effectiveMode, () => '2d' as RenderMode);
}

export function useIs3D(): boolean {
  return useRenderMode() !== '2d';
}

// --- Movimiento reducido ---------------------------------------------------

const motionQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

function subscribeMotion(listener: () => void) {
  motionQuery?.addEventListener('change', listener);
  return () => motionQuery?.removeEventListener('change', listener);
}

export function prefersReducedMotion(): boolean {
  return !!motionQuery?.matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
}
