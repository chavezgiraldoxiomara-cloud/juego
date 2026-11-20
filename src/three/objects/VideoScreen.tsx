import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { SCREEN } from '../../data/scene3d';
import { glowMat, mat } from './kit';

interface VideoScreenProps {
  video: HTMLVideoElement | null;
  poster: string;
  color: string;
  still: boolean;
  position?: [number, number, number];
  size?: number;
}

/**
 * Pantalla holográfica de la cinemática. Proyecta el mismo <video> que
 * controla la interfaz (pausa, reinicio, velocidad), así que los controles
 * siguen funcionando igual; mientras el clip carga se ve su póster.
 */
export function VideoScreen({ video, poster, color, still, position = SCREEN.position, size = 1 }: VideoScreenProps) {
  const group = useRef<THREE.Group>(null);
  const posterTexture = useTexture(poster);
  posterTexture.colorSpace = THREE.SRGBColorSpace;
  const [ready, setReady] = useState(false);

  const videoTexture = useMemo(() => {
    if (!video) return null;
    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [video]);

  useEffect(() => {
    setReady(false);
    if (!video) return;
    const markReady = () => setReady(true);
    if (video.readyState >= 2) markReady();
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('playing', markReady);
    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('playing', markReady);
    };
  }, [video]);

  useEffect(() => () => videoTexture?.dispose(), [videoTexture]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const s = THREE.MathUtils.damp(group.current.scale.x, size, 5, delta);
    group.current.scale.setScalar(s);
    if (!still) group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.04;
  });

  const { width, height } = SCREEN;
  const glow = mat(color, { emissive: color, glow: 2.4 });
  const bracket = (x: number, y: number) => (
    <group key={`${x}${y}`} position={[(x * width) / 2, (y * height) / 2, 0.05]}>
      <mesh position={[-x * 0.22, y * 0.06, 0]} scale={[0.5, 0.05, 0.05]} material={glow}>
        <boxGeometry />
      </mesh>
      <mesh position={[x * 0.06, -y * 0.22, 0]} scale={[0.05, 0.5, 0.05]} material={glow}>
        <boxGeometry />
      </mesh>
    </group>
  );

  return (
    <group ref={group} position={position} scale={size * 0.86}>
      {/* Placa trasera y marco */}
      <mesh position={[0, 0, -0.06]} scale={[width + 0.22, height + 0.22, 0.08]} material={mat('#0b1222', { metal: 0.4, rough: 0.5 })}>
        <boxGeometry />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={ready && videoTexture ? videoTexture : posterTexture} color="#e2e2e2" toneMapped={false} />
      </mesh>
      {[-1, 1].flatMap((x) => [-1, 1].map((y) => bracket(x, y)))}
      {/* Emisores laterales */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 + 0.42), 0, 0]} scale={[0.12, 0.3, 0.12]} material={glowMat(color)}>
          <octahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
      <pointLight color={color} intensity={8} distance={9} position={[0, 0, 1.5]} />
    </group>
  );
}
