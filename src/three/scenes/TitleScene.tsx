import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Island } from '../objects/Island';
import { Portal } from '../objects/Portal';

interface TitleSceneProps {
  still: boolean;
}

/** Pantalla de título: el gran portal del sistema de calabozos sobre su isla. */
export default function TitleScene({ still }: TitleSceneProps) {
  const rings = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!rings.current || still) return;
    rings.current.children[0].rotation.z += delta * 0.07;
    rings.current.children[1].rotation.z -= delta * 0.05;
    rings.current.children[2].rotation.z += delta * 0.03;
  });

  return (
    <group>
      <hemisphereLight args={['#8b96ff', '#120f2e', 1.4]} />
      <directionalLight position={[4, 8, 6]} intensity={1.5} color="#c7d2fe" />
      <directionalLight position={[-6, 4, -10]} intensity={1.1} color="#a855f7" />

      <Island radius={5.6} depth={6.5} seed={3} position={[0, -2.2, -3]}>
        <Portal color="#22d3ee" color2="#4f46e5" status="active" still={still} scale={2.7} />
      </Island>
      <Island radius={1.7} depth={2.6} seed={8} position={[-7.5, 0.9, -5.5]}>
        <Portal color="#a855f7" color2="#4f46e5" status="available" still={still} scale={0.75} rotation={[0, 0.5, 0]} />
      </Island>
      <Island radius={1.5} depth={2.2} seed={12} position={[7.2, 2.1, -6.5]}>
        <Portal color="#f59e0b" color2="#dc2626" status="available" still={still} scale={0.7} rotation={[0, -0.5, 0]} />
      </Island>
      <Island radius={1.1} depth={1.8} seed={21} position={[-4.2, -2.6, 1.5]} />
      <Island radius={0.9} depth={1.5} seed={34} position={[5, -2.2, 2]} />

      {/* Círculos rúnicos del sistema, detrás del portal */}
      <group ref={rings} position={[0, 2.52, -3.5]}>
        <mesh>
          <ringGeometry args={[4.5, 4.53, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[5.4, 5.44, 6]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[6.4, 6.42, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.22} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
