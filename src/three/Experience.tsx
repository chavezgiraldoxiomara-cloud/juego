import { lazy, Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, useProgress } from '@react-three/drei';
import { useScene } from './store';
import { useReducedMotion } from './prefs';
import { CameraRig } from './camera/CameraRig';
import { Sky } from './objects/Sky';
import { PORTAL_COLORS } from '../data/scene3d';

// Carga diferida: cada pantalla y el posprocesado viajan en su propio paquete.
const TitleScene = lazy(() => import('./scenes/TitleScene'));
const MapScene = lazy(() => import('./scenes/MapScene'));
const DimScene = lazy(() => import('./scenes/DimScene'));
const Effects = lazy(() => import('./effects/Effects'));

interface ExperienceProps {
  quality: 'high' | 'low';
}

/**
 * Lienzo 3D único y persistente, situado detrás de la interfaz HTML.
 * Escucha los eventos de puntero desde #root, de modo que la interfaz sigue
 * siendo HTML accesible y los objetos 3D siguen siendo clicables.
 */
export default function Experience({ quality }: ExperienceProps) {
  const screen = useScene((s) => s.screen);
  const dimensionId = useScene((s) => s.dimensionId);
  const reducedMotion = useReducedMotion();
  const [degraded, setDegraded] = useState(false);
  const lockQuality = useMemo(() => new URLSearchParams(window.location.search).has('calidadfija'), []);
  const low = quality === 'low' || degraded;
  const eventSource = useMemo(() => document.getElementById('root')!, []);
  const tint = screen === 'dimension' && dimensionId ? PORTAL_COLORS[dimensionId].main : '#22d3ee';

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        eventSource={eventSource}
        eventPrefix="client"
        style={{ pointerEvents: 'none' }}
        dpr={low ? 1 : [1, 2]}
        shadows={!low}
        camera={{ fov: 42, near: 0.1, far: 240, position: [0, 2.5, 14] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#030712');
          scene.fog = new THREE.FogExp2('#120f33', 0.012);
        }}
      >
        {!lockQuality && quality === 'high' && <PerformanceMonitor onDecline={() => setDegraded(true)} />}
        <CameraRig still={reducedMotion} />
        <Sky tint={tint} lowQuality={low} still={reducedMotion} />
        <Suspense fallback={null}>
          {screen === 'title' && <TitleScene still={reducedMotion} />}
          {screen === 'map' && <MapScene still={reducedMotion} />}
          {screen === 'dimension' && <DimScene key={dimensionId} still={reducedMotion} shadows={!low} />}
        </Suspense>
        {!low && (
          <Suspense fallback={null}>
            <Effects />
          </Suspense>
        )}
      </Canvas>
      <LoadingPill />
    </div>
  );
}

function LoadingPill() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-slate-950/85 backdrop-blur text-[11px] font-rajdhani font-bold tracking-widest text-cyan-300 uppercase">
      Cargando escena · {Math.round(progress)}%
    </div>
  );
}
