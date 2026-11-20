import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { PORTAL_COLORS } from '../../data/scene3d';
import { isUiEvent, useScene } from '../store';
import { Island } from './Island';
import { Block, Rod, glowMat, mat } from './kit';
import { VideoScreen } from './VideoScreen';

export const FINALE_CENTER: [number, number, number] = [0, -0.4, 4.4];

const GOLD = { emissive: '#f59e0b', glow: 0.9, metal: 0.8, rough: 0.3 };

/**
 * Recompensa final en 3D. Refleja los pasos de FinalRewardModal: el cofre
 * legendario aparece, se abre al tocarlo y de él surgen la corona y el libro
 * abierto del emblema, las cinco insignias y la pantalla de victoria.
 */
export function FinaleStage({ still }: { still: boolean }) {
  const finale = useScene((s) => s.finale);
  const video = useScene((s) => s.video);
  const chest = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const emblem = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const showChest = finale.step >= 3;

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (chest.current) {
      const target = showChest ? 1 : 0.001;
      chest.current.scale.setScalar(THREE.MathUtils.damp(chest.current.scale.x, target, 5, delta));
      chest.current.rotation.z = finale.chestOpening && !still ? Math.sin(t * 38) * 0.035 : 0;
    }
    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, finale.chestOpened ? -1.9 : 0, 4, delta);
    }
    if (light.current) {
      const target = finale.chestOpened ? 20 : finale.chestOpening ? 30 : showChest ? 9 + Math.sin(t * 2.4) * 3 : 0;
      light.current.intensity = THREE.MathUtils.damp(light.current.intensity, target, 4, delta);
    }
    if (emblem.current) {
      const up = finale.chestOpened ? 1 : 0;
      emblem.current.scale.setScalar(THREE.MathUtils.damp(emblem.current.scale.x, up || 0.001, 3, delta));
      emblem.current.position.y = THREE.MathUtils.damp(emblem.current.position.y, up ? 2.0 : 0.6, 2.5, delta);
      if (!still) emblem.current.rotation.y += delta * 0.7;
    }
    if (orbit.current) {
      orbit.current.scale.setScalar(THREE.MathUtils.damp(orbit.current.scale.x, finale.chestOpened ? 1 : 0.001, 2.5, delta));
      if (!still) orbit.current.rotation.y -= delta * 0.5;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (isUiEvent(event.nativeEvent) || event.delta > 8) return;
    event.stopPropagation();
    useScene.getState().handlers.onChest?.();
  };
  const interactive = showChest && !finale.chestOpened;

  return (
    <group position={FINALE_CENTER}>
      <Island radius={1.9} depth={2.6} seed={77} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.3, 48]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} toneMapped={false} />
      </mesh>

      <group ref={chest} scale={0.001}>
        <group
          onClick={interactive ? handleClick : undefined}
          onPointerOver={interactive ? () => (document.body.style.cursor = 'pointer') : undefined}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          {/* Cuerpo */}
          <Block size={[1.3, 0.62, 0.85]} position={[0, 0.31, 0]} color="#4a2f1c" />
          <Block size={[1.34, 0.08, 0.89]} position={[0, 0.04, 0]} color="#fbbf24" options={GOLD} />
          <Block size={[0.1, 0.64, 0.89]} position={[-0.5, 0.31, 0]} color="#fbbf24" options={GOLD} />
          <Block size={[0.1, 0.64, 0.89]} position={[0.5, 0.31, 0]} color="#fbbf24" options={GOLD} />
          {/* Tapa con bisagra trasera */}
          <group ref={lid} position={[0, 0.62, -0.425]}>
            <group position={[0, 0, 0.425]}>
              <Block size={[1.3, 0.2, 0.85]} position={[0, 0.1, 0]} color="#5a3a22" />
              <Block size={[1.1, 0.12, 0.7]} position={[0, 0.25, 0]} color="#5a3a22" />
              <Block size={[0.1, 0.34, 0.89]} position={[-0.5, 0.16, 0]} color="#fbbf24" options={GOLD} />
              <Block size={[0.1, 0.34, 0.89]} position={[0.5, 0.16, 0]} color="#fbbf24" options={GOLD} />
              <Block size={[0.2, 0.26, 0.06]} position={[0, 0.02, 0.44]} color="#fde68a" options={{ emissive: '#fbbf24', glow: 1.6, metal: 0.8, rough: 0.3 }} />
            </group>
          </group>
        </group>
        <pointLight ref={light} color="#fbbf24" intensity={0} distance={9} position={[0, 0.9, 0.3]} />
      </group>

      {/* Emblema: la corona eterna sobre el libro abierto de Kafka */}
      <group ref={emblem} position={[0, 0.6, 0]} scale={0.001}>
        <group position={[0, -0.3, 0]}>
          <Block size={[0.5, 0.05, 0.62]} position={[-0.25, 0, 0]} rotation={[0, 0, 0.22]} color="#efe9d8" options={{ emissive: '#fde68a', glow: 0.5 }} />
          <Block size={[0.5, 0.05, 0.62]} position={[0.25, 0, 0]} rotation={[0, 0, -0.22]} color="#efe9d8" options={{ emissive: '#fde68a', glow: 0.5 }} />
          <Block size={[0.05, 0.08, 0.64]} position={[0, -0.07, 0]} color="#3b2a16" />
        </group>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat('#fbbf24', GOLD)}>
          <torusGeometry args={[0.28, 0.06, 6, 16]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.28, 0.38, Math.sin(angle) * 0.28]} material={mat('#fbbf24', GOLD)}>
              <coneGeometry args={[0.07, 0.28, 5]} />
            </mesh>
          );
        })}
        <pointLight color="#fde68a" intensity={10} distance={5} />
      </group>

      {/* Las cinco insignias, una por dimensión */}
      <group ref={orbit} position={[0, 1.55, 0]} scale={0.001}>
        {[1, 2, 3, 4, 5].map((dimId) => {
          const angle = ((dimId - 1) / 5) * Math.PI * 2;
          const color = PORTAL_COLORS[dimId].main;
          return (
            <group key={dimId} position={[Math.cos(angle) * 1.35, Math.sin(angle * 2) * 0.12, Math.sin(angle) * 1.35]}>
              <Rod radius={0.17} length={0.04} rotation={[Math.PI / 2, 0, 0]} color="#fbbf24" options={GOLD} />
              <mesh scale={[0.08, 0.12, 0.05]} material={glowMat(color)}>
                <octahedronGeometry args={[1, 0]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {finale.chestOpened && (
        <Suspense fallback={null}>
          <VideoScreen
            video={video}
            poster="/assets/clips/victory_poster.jpg"
            color="#fbbf24"
            still={still}
            position={[0, 5.3, -2.6]}
            size={0.78}
          />
        </Suspense>
      )}
    </group>
  );
}
