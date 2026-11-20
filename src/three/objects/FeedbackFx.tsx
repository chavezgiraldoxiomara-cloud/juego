import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScene } from '../store';

/** Pulso de luz y onda rúnica en el suelo cuando se valida una respuesta. */
export function FeedbackFx({ still }: { still: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  const ring = useRef<THREE.Mesh>(null);
  const pulse = useRef({ value: 0, color: new THREE.Color('#22d3ee') });

  useEffect(
    () =>
      useScene.subscribe((state, previous) => {
        if (state.feedback === previous.feedback || state.feedback === 'idle') return;
        pulse.current.value = 1;
        pulse.current.color.set(state.feedback === 'success' ? '#22d3ee' : '#f43f5e');
      }),
    []
  );

  useFrame((_, delta) => {
    const p = pulse.current;
    p.value = THREE.MathUtils.damp(p.value, 0, still ? 6 : 1.8, delta);
    if (light.current) {
      light.current.color.copy(p.color);
      light.current.intensity = p.value * 70;
    }
    if (ring.current) {
      const material = ring.current.material as THREE.MeshBasicMaterial;
      material.color.copy(p.color);
      material.opacity = p.value * 0.9;
      const spread = still ? 3 : 1 + (1 - p.value) * 4.5;
      ring.current.scale.setScalar(spread);
      ring.current.visible = p.value > 0.01;
    }
  });

  return (
    <group position={[0, 0.24, 0.3]}>
      <pointLight ref={light} intensity={0} distance={12} position={[0, 2.2, 1]} />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.92, 1, 48]} />
        <meshBasicMaterial transparent opacity={0} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
