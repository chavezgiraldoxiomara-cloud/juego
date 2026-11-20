import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CLUE_ANCHORS } from '../../data/scene3d';
import { isUiEvent, useScene } from '../store';

interface ClueTargetProps {
  clueId: string;
  still: boolean;
  children: React.ReactNode;
}

/**
 * Envuelve un objeto del escenario que es una pista de `detect_clues`.
 * Solo se activa si la actividad en curso contiene esa pista; al tocarlo avisa
 * a la lógica del juego (que es la que decide y muestra el simbolismo).
 */
export function ClueTarget({ clueId, still, children }: ClueTargetProps) {
  const activity = useScene((s) => s.activity);
  const found = useScene((s) => s.discoveredClues.includes(clueId));
  const [hovered, setHovered] = useState(false);
  const marker = useRef<THREE.Group>(null);

  const clue =
    activity?.type === 'detect_clues' ? activity.clues.find((c) => c.id === clueId) : undefined;
  const anchor = activity ? CLUE_ANCHORS[activity.id]?.[clueId] : undefined;
  const active = !!clue && !!anchor;

  useFrame(({ clock }, delta) => {
    if (!marker.current || still) return;
    marker.current.rotation.y += delta * 1.6;
    marker.current.position.y = 0.42 + Math.sin(clock.elapsedTime * 2.2) * 0.05;
  });

  if (!active) return <>{children}</>;

  const color = found ? '#34d399' : '#22d3ee';

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (isUiEvent(event.nativeEvent) || event.delta > 8) return;
    event.stopPropagation();
    useScene.getState().handlers.onClue?.(clueId);
  };
  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    if (isUiEvent(event.nativeEvent)) return;
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = '';
  };

  return (
    <group>
      <group onClick={handleClick} onPointerOver={handleOver} onPointerOut={handleOut}>
        {children}
      </group>

      <group position={anchor}>
        {/* Zona de toque generosa (también para pantallas táctiles) */}
        <mesh position={[0, 0.2, 0]} onClick={handleClick} onPointerOver={handleOver} onPointerOut={handleOut}>
          <sphereGeometry args={[0.55, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <group ref={marker} position={[0, 0.42, 0]} scale={hovered ? 1.3 : 1}>
          <mesh scale={[0.13, 0.2, 0.13]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </group>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.25, 24]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color={color} intensity={hovered ? 2.4 : 1.1} distance={2.4} position={[0, 0.75, 0.5]} />
        {(hovered || found) && (
          <Html position={[0, 0.82, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
            <div
              className={`w-max max-w-[180px] px-2.5 py-1 rounded-lg border bg-slate-950/90 backdrop-blur text-center text-[11px] font-rajdhani font-bold leading-tight ${
                found ? 'border-emerald-400/70 text-emerald-200' : 'border-cyan-400/70 text-cyan-100'
              }`}
            >
              {clue!.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
