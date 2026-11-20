import { useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { mat, seeded } from './kit';

interface IslandProps extends Omit<ThreeElements['group'], 'children'> {
  radius?: number;
  depth?: number;
  seed?: number;
  /** Ancho/fondo distintos para islas alargadas (por ejemplo bajo una habitación). */
  stretch?: [number, number];
  children?: React.ReactNode;
}

/**
 * Isla de roca flotante low-poly. Su cara superior queda en y = 0, así que lo
 * que se coloque dentro se apoya directamente sobre ella.
 */
export function Island({ radius = 2.4, depth = 3.2, seed = 1, stretch = [1, 1], children, ...props }: IslandProps) {
  const details = useMemo(() => {
    const random = seeded(seed * 131 + 7);
    const stalactites = Array.from({ length: 6 }, () => {
      const angle = random() * Math.PI * 2;
      const distance = radius * (0.25 + random() * 0.55);
      return {
        x: Math.cos(angle) * distance,
        z: Math.sin(angle) * distance,
        length: depth * (0.35 + random() * 0.5),
        width: radius * (0.12 + random() * 0.14)
      };
    });
    const rocks = Array.from({ length: 5 }, () => {
      const angle = random() * Math.PI * 2;
      const distance = radius * (0.7 + random() * 0.22);
      return {
        x: Math.cos(angle) * distance,
        z: Math.sin(angle) * distance,
        size: 0.14 + random() * 0.26,
        spin: random() * Math.PI
      };
    });
    return { stalactites, rocks };
  }, [radius, depth, seed]);

  return (
    <group {...props}>
      <group scale={[stretch[0], 1, stretch[1]]}>
        {/* Capa de musgo */}
        <mesh position={[0, -0.04, 0]} material={mat('#1f4a52', { rough: 1 })} receiveShadow>
          <cylinderGeometry args={[radius * 0.98, radius, 0.08, 9]} />
        </mesh>
        {/* Losa de roca */}
        <mesh position={[0, -0.36, 0]} material={mat('#2c3757')} receiveShadow>
          <cylinderGeometry args={[radius, radius * 0.86, 0.56, 9]} />
        </mesh>
        {/* Raíz de la isla */}
        <mesh position={[0, -0.64 - depth / 2, 0]} rotation={[Math.PI, 0.4, 0]} material={mat('#1c2440', { emissive: '#1a2150', glow: 0.55 })}>
          <coneGeometry args={[radius * 0.86, depth, 7]} />
        </mesh>
        {details.stalactites.map((s, i) => (
          <mesh
            key={`s${i}`}
            position={[s.x, -0.6 - s.length / 2, s.z]}
            rotation={[Math.PI, i, 0]}
            material={mat('#171e36', { emissive: '#161c46', glow: 0.5 })}
          >
            <coneGeometry args={[s.width, s.length, 5]} />
          </mesh>
        ))}
        {details.rocks.map((r, i) => (
          <mesh
            key={`r${i}`}
            position={[r.x, r.size * 0.4, r.z]}
            rotation={[r.spin, r.spin * 2, 0]}
            material={mat('#34406a')}
            castShadow
          >
            <dodecahedronGeometry args={[r.size, 0]} />
          </mesh>
        ))}
      </group>
      {children}
    </group>
  );
}
