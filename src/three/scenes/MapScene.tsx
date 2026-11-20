import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { DIMENSIONS } from '../../data/dimensions';
import { PORTAL_COLORS } from '../../data/scene3d';
import { Island } from '../objects/Island';
import { Portal, type PortalStatus } from '../objects/Portal';
import { glowMat, mat } from '../objects/kit';
import { portalPlacement } from '../camera/layout';
import { useScene } from '../store';
import { FinaleStage } from '../objects/FinaleStage';

interface MapSceneProps {
  still: boolean;
}

function statusOf(dimId: number, completed: number[]): PortalStatus {
  if (completed.includes(dimId)) return 'completed';
  const unlocked = dimId === 1 || completed.includes(dimId - 1);
  return unlocked ? 'active' : 'locked';
}

/** Mapa del mundo: cinco islas con su portal, unidas por un sendero de energía. */
export default function MapScene({ still }: MapSceneProps) {
  const completed = useScene((s) => s.completed);
  const focusDim = useScene((s) => s.focusDim);
  const warpDim = useScene((s) => s.warpDim);
  const finale = useScene((s) => s.finale);

  return (
    <group>
      <hemisphereLight args={['#8b96ff', '#120f2e', 1.5]} />
      <directionalLight position={[3, 9, 8]} intensity={1.7} color="#c7d2fe" />
      <directionalLight position={[-6, 4, -10]} intensity={1.1} color="#a855f7" />

      {DIMENSIONS.map((dim) => {
        const place = portalPlacement(dim.id);
        // Recompensa final, paso 1: los portales se encienden uno a uno
        const status: PortalStatus =
          finale.open && finale.step === 1
            ? dim.id - 1 <= finale.portalIndex
              ? 'completed'
              : 'dormant'
            : statusOf(dim.id, completed);
        const colors = PORTAL_COLORS[dim.id];
        const focused = finale.open ? status === 'completed' : focusDim === dim.id;
        return (
          <Island
            key={dim.id}
            radius={1.9}
            depth={3 + (dim.id % 2) * 0.8}
            seed={dim.id * 5}
            position={place.position}
            rotation={[0, place.rotationY, 0]}
          >
            <Portal
              color={colors.main}
              color2={colors.alt}
              status={status}
              focused={focused}
              still={still}
              onFocus={() => {
                if (!useScene.getState().warpDim) useScene.setState({ focusDim: dim.id });
              }}
              onSelect={() => {
                const state = useScene.getState();
                if (state.warpDim) return;
                if (state.focusDim !== dim.id) useScene.setState({ focusDim: dim.id });
                else state.handlers.onPortal?.(dim.id);
              }}
            />
            {status === 'completed' && <Medallion still={still} />}
            {!warpDim && !finale.open && (
              <Html position={[0, 3.75, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
                <PortalLabel dimId={dim.id} title={dim.title} status={status} focused={focused} />
              </Html>
            )}
          </Island>
        );
      })}

      <EnergyPath completed={completed} />
      {finale.open && <FinaleStage still={still} />}
    </group>
  );
}

function PortalLabel({ dimId, title, status, focused }: { dimId: number; title: string; status: PortalStatus; focused: boolean }) {
  const tone =
    status === 'completed'
      ? 'border-emerald-400/70 text-emerald-200'
      : status === 'locked'
      ? 'border-slate-700 text-slate-500'
      : 'border-cyan-400/70 text-cyan-100';
  return (
    <div
      className={`w-max max-w-[150px] sm:max-w-[190px] px-2.5 py-1.5 rounded-xl border bg-slate-950/80 backdrop-blur text-center transition-all duration-300 ${tone} ${
        focused ? 'scale-110 shadow-lg shadow-cyan-500/30' : 'opacity-80'
      }`}
    >
      <div className="font-cinzel font-bold text-[11px] sm:text-xs leading-tight">
        <span className="text-amber-300">{dimId}.</span> {title.replace(`DIMENSIÓN ${dimId}. `, '')}
      </div>
    </div>
  );
}

/** Insignia dorada que flota sobre un portal superado. */
function Medallion({ still }: { still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!ref.current || still) return;
    ref.current.rotation.y += delta * 0.9;
    ref.current.position.y = 0.55 + Math.sin(clock.elapsedTime * 1.4) * 0.06;
  });
  const gold = mat('#fbbf24', { emissive: '#f59e0b', glow: 0.9, metal: 0.8, rough: 0.3 });
  return (
    <group ref={ref} position={[0, 0.55, 1.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={gold}>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 8]} />
      </mesh>
      <mesh scale={[0.1, 0.16, 0.05]} material={glowMat('#fff3c4')}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
}

/** Sendero de energía entre islas: brilla en los tramos ya recorridos. */
function EnergyPath({ completed }: { completed: number[] }) {
  const segments = useMemo(() => {
    return [1, 2, 3, 4].map((dimId) => {
      const from = portalPlacement(dimId).position;
      const to = portalPlacement(dimId + 1).position;
      const middle = from.clone().lerp(to, 0.5);
      middle.y -= 0.9;
      middle.z += 1.9;
      const curve = new THREE.CatmullRomCurve3([
        from.clone().add(new THREE.Vector3(0.4, 0.05, 1.7)),
        middle,
        to.clone().add(new THREE.Vector3(-0.4, 0.05, 1.7))
      ]);
      return { dimId, geometry: new THREE.TubeGeometry(curve, 24, 0.035, 5, false) };
    });
  }, []);

  return (
    <group>
      {segments.map(({ dimId, geometry }) => {
        const walked = completed.includes(dimId);
        return (
          <mesh key={dimId} geometry={geometry}>
            <meshBasicMaterial
              color={walked ? '#67e8f9' : '#64748b'}
              transparent
              opacity={walked ? 0.95 : 0.45}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
