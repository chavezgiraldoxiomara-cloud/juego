import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { OBJECT_ANCHORS } from '../../data/scene3d';
import { isUiEvent, useScene } from '../store';

interface ObjectTargetProps {
  objectId: string;
  still: boolean;
  children: React.ReactNode;
}

/**
 * Envuelve un objeto del escenario que es una opción de `choose_objects`.
 * Todos los objetos (correctos o no) llevan el mismo marcador: la escena no
 * da pistas, solo refleja qué está seleccionado y avisa de los toques.
 */
export function ObjectTarget({ objectId, still, children }: ObjectTargetProps) {
  const activity = useScene((s) => s.activity);
  const selected = useScene((s) => s.selectedObjects.includes(objectId));
  const [hovered, setHovered] = useState(false);
  const marker = useRef<THREE.Group>(null);

  const option =
    activity?.type === 'choose_objects' ? activity.objects.find((o) => o.id === objectId) : undefined;
  const anchor = activity ? OBJECT_ANCHORS[activity.id]?.[objectId] : undefined;
  const active = !!option && !!anchor;

  useFrame(({ clock }, delta) => {
    if (!marker.current || still) return;
    marker.current.rotation.y += delta * 1.6;
    marker.current.position.y = 0.42 + Math.sin(clock.elapsedTime * 2.2 + objectId.length) * 0.05;
  });

  if (!active) return <>{children}</>;

  const color = selected ? '#c084fc' : '#22d3ee';

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (isUiEvent(event.nativeEvent) || event.delta > 8) return;
    event.stopPropagation();
    useScene.getState().handlers.onObject?.(objectId);
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
        <mesh position={[0, 0.2, 0]} onClick={handleClick} onPointerOver={handleOver} onPointerOut={handleOut}>
          <sphereGeometry args={[0.55, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <group ref={marker} position={[0, 0.42, 0]} scale={hovered || selected ? 1.3 : 1}>
          <mesh scale={[0.13, 0.2, 0.13]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </group>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={selected ? [0.2, 0.3, 24] : [0.2, 0.25, 24]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color={color} intensity={hovered ? 2.4 : 1.1} distance={2.4} position={[0, 0.75, 0.5]} />
        {(hovered || selected) && (
          <Html position={[0, 0.82, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
            <div
              className={`w-max max-w-[190px] px-2.5 py-1 rounded-lg border bg-slate-950/90 backdrop-blur text-center text-[11px] font-rajdhani font-bold leading-tight ${
                selected ? 'border-purple-400/80 text-purple-100' : 'border-cyan-400/70 text-cyan-100'
              }`}
            >
              {option!.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
