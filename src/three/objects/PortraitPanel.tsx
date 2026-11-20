import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { mat } from './kit';

interface PortraitPanelProps extends Omit<ThreeElements['group'], 'children'> {
  image: string;
  height?: number;
  color?: string;
  still?: boolean;
  /** Proyector holográfico bajo el panel. */
  beam?: boolean;
}

/**
 * Retrato enmarcado de un personaje. Usa su imagen original (sin modelar al
 * personaje en 3D), recortada desde arriba igual que `object-cover object-top`.
 */
export function PortraitPanel({ image, height = 1.2, color = '#22d3ee', still = false, beam = false, ...props }: PortraitPanelProps) {
  const inner = useRef<THREE.Group>(null);
  const base = useTexture(image);
  const width = height * 0.8;

  const texture = useMemo(() => {
    const t = base.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    const img = base.image as { width: number; height: number };
    const imageAspect = img.width / img.height;
    const panelAspect = width / height;
    if (imageAspect > panelAspect) {
      t.repeat.set(panelAspect / imageAspect, 1);
      t.offset.set((1 - t.repeat.x) / 2, 0);
    } else {
      t.repeat.set(1, imageAspect / panelAspect);
      t.offset.set(0, 1 - t.repeat.y);
    }
    t.needsUpdate = true;
    return t;
  }, [base, width, height]);

  useEffect(() => () => texture.dispose(), [texture]);

  const phase = useMemo(() => Math.random() * 6, []);
  useFrame(({ clock }) => {
    if (inner.current && !still) inner.current.position.y = Math.sin(clock.elapsedTime * 1.1 + phase) * 0.035;
  });

  return (
    <group {...props}>
      <group ref={inner}>
        <mesh position={[0, 0, -0.025]} scale={[width + 0.1, height + 0.1, 0.04]} material={mat(color, { emissive: color, glow: 1.5 })}>
          <boxGeometry />
        </mesh>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
      {beam && (
        <group position={[0, -height / 2 - 0.55, 0]}>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[width * 0.55, 0.9, 16, 1, true]} />
            <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.28, 0]} material={mat('#1b2438', { metal: 0.5, rough: 0.4 })}>
            <cylinderGeometry args={[0.2, 0.26, 0.14, 8]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
