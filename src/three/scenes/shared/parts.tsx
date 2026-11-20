import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';
import { CHARACTERS } from '../../../data/characters';
import { PORTRAIT_SPOTS } from '../../../data/scene3d';
import { Island } from '../../objects/Island';
import { Block, Rod, mat } from '../../objects/kit';
import { PortraitPanel } from '../../objects/PortraitPanel';

/** Piezas de escenografía low-poly compartidas por los escenarios de las dimensiones. */

export const WOOD = '#5c3f29';
export const WOOD_DARK = '#40291a';
export const WOOD_LIGHT = '#775338';
export const BRASS = '#b9995a';
const brass = { metal: 0.75, rough: 0.35 };

type GroupProps = Omit<ThreeElements['group'], 'children'>;

interface RoomShellProps {
  seed: number;
  floor?: string;
  floorLine?: string;
  wall?: string;
  sideWall?: string;
  wainscot?: string;
  /** Altura de la pared izquierda (permite cortarla para ver el interior). */
  children: React.ReactNode;
}

/**
 * Diorama base: isla flotante, suelo de tablones, pared del fondo y pared
 * izquierda. Dentro, el suelo queda en y = 0, x ∈ [-4.2, 4.2], z ∈ [-3.2, 3.2].
 */
export function RoomShell({
  seed,
  floor = '#4d3827',
  floorLine = '#30221a',
  wall = '#3d5672',
  sideWall = '#364b63',
  wainscot = '#2d415a',
  children
}: RoomShellProps) {
  return (
    <group>
      <Island radius={4.4} depth={5.2} seed={seed} stretch={[1.22, 0.98]} />
      <group position={[0, 0.2, 0]}>
        <Block size={[8.4, 0.2, 6.4]} position={[0, -0.1, 0]} color={floor} />
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <Block key={x} size={[0.03, 0.012, 6.4]} position={[x, 0.006, 0]} color={floorLine} noShadow />
        ))}
        <Block size={[8.4, 3.4, 0.2]} position={[0, 1.7, -3.1]} color={wall} />
        <Block size={[8.4, 0.9, 0.06]} position={[0, 0.45, -2.98]} color={wainscot} noShadow />
        <Block size={[8.4, 0.06, 0.1]} position={[0, 0.93, -2.96]} color={WOOD} noShadow />
        <Block size={[0.2, 3.4, 6.4]} position={[-4.1, 1.7, 0]} color={sideWall} />
        <Block size={[0.06, 0.9, 6.4]} position={[-3.98, 0.45, 0]} color={wainscot} noShadow />
        {children}
      </group>
    </group>
  );
}

/** Marcas holográficas del sistema del cazador en las esquinas del diorama. */
export function SystemCorners({ color = '#22d3ee' }: { color?: string }) {
  const glow = { emissive: color, glow: 2.2 };
  return (
    <>
      {[
        [4.2, 3.2, 1, 1],
        [4.2, -3.2, 1, -1],
        [-4.2, 3.2, -1, 1]
      ].map(([x, z, sx, sz], i) => (
        <group key={i} position={[x, 0.02, z]}>
          <Block size={[0.6, 0.03, 0.03]} position={[-sx * 0.3, 0, 0]} color={color} options={glow} noShadow />
          <Block size={[0.03, 0.03, 0.6]} position={[0, 0, -sz * 0.3]} color={color} options={glow} noShadow />
        </group>
      ))}
    </>
  );
}

/** Círculo rúnico en el suelo. */
export function FloorRune({ position, color = '#22d3ee', accent = '#a855f7', radius = 1 }: { position: [number, number, number]; color?: string; accent?: string; radius?: number }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.03, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <ringGeometry args={[radius * 0.76, radius * 0.78, 6]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface DoorProps extends GroupProps {
  /** Ángulo de apertura en radianes (0 = cerrada). */
  open?: number;
  color?: string;
  /** Color de la luz que se cuela bajo la puerta (opcional). */
  slit?: string;
  /** Llave puesta en la cerradura, con brillo. */
  keyGlow?: string;
}

/** Puerta con marco. Mira hacia +z; el eje de giro está en su borde izquierdo. */
export function Door({ open = 0, color = WOOD, slit, keyGlow, ...props }: DoorProps) {
  return (
    <group {...props}>
      <Block size={[0.1, 2.42, 0.14]} position={[-0.6, 1.21, 0]} color={WOOD_DARK} />
      <Block size={[0.1, 2.42, 0.14]} position={[0.6, 1.21, 0]} color={WOOD_DARK} />
      <Block size={[1.3, 0.1, 0.14]} position={[0, 2.37, 0]} color={WOOD_DARK} />
      <group position={[-0.55, 0, 0]} rotation={[0, open, 0]}>
        <group position={[0.55, 0, 0]}>
          <Block size={[1.1, 2.3, 0.08]} position={[0, 1.15, 0]} color={color} />
          <Block size={[0.75, 0.8, 0.1]} position={[0, 1.6, 0]} color={WOOD_DARK} noShadow />
          <Block size={[0.75, 0.7, 0.1]} position={[0, 0.6, 0]} color={WOOD_DARK} noShadow />
          <Block size={[0.16, 0.06, 0.16]} position={[0.4, 1.1, 0.02]} color={BRASS} options={brass} />
          {keyGlow && (
            <group position={[0.4, 0.95, 0.09]}>
              <Block size={[0.05, 0.05, 0.14]} color={keyGlow} options={{ emissive: keyGlow, glow: 2.4 }} noShadow />
              <mesh position={[0, 0, 0.1]} material={mat(keyGlow, { emissive: keyGlow, glow: 2.4 })}>
                <torusGeometry args={[0.05, 0.016, 5, 10]} />
              </mesh>
              <pointLight color={keyGlow} intensity={2.5} distance={2} position={[0, 0, 0.3]} />
            </group>
          )}
        </group>
      </group>
      {slit && (
        <>
          <Block size={[1.0, 0.03, 0.02]} position={[0, 0.02, 0.06]} color={slit} options={{ emissive: slit, glow: 2 }} noShadow />
          <pointLight position={[0, 0.3, 0.4]} color={slit} intensity={4} distance={3} />
        </>
      )}
    </group>
  );
}

/** Ventana sobre una pared. Mira hacia +z. */
export function WindowPane({ glowColor = '#9ab6dc', glow = 0.85, curtain = '#5b4463', ...props }: GroupProps & { glowColor?: string; glow?: number; curtain?: string }) {
  return (
    <group {...props}>
      <Block size={[1.5, 1.9, 0.04]} color={glowColor} options={{ emissive: glowColor, glow }} noShadow />
      <Block size={[1.7, 0.1, 0.1]} position={[0, 1.0, 0.02]} color={WOOD_DARK} />
      <Block size={[1.7, 0.12, 0.16]} position={[0, -1.0, 0.04]} color={WOOD_DARK} />
      <Block size={[0.1, 2.0, 0.1]} position={[-0.8, 0, 0.02]} color={WOOD_DARK} />
      <Block size={[0.1, 2.0, 0.1]} position={[0.8, 0, 0.02]} color={WOOD_DARK} />
      <Block size={[0.05, 1.9, 0.07]} position={[0, 0, 0.03]} color={WOOD_DARK} noShadow />
      <Block size={[1.5, 0.05, 0.07]} position={[0, 0.25, 0.03]} color={WOOD_DARK} noShadow />
      <Block size={[0.32, 2.2, 0.08]} position={[-1.02, -0.05, 0.1]} color={curtain} />
      <Block size={[0.32, 2.2, 0.08]} position={[1.02, -0.05, 0.1]} color={curtain} />
      <Rod radius={0.025} length={2.5} position={[0, 1.12, 0.12]} rotation={[0, 0, Math.PI / 2]} color={BRASS} options={brass} />
    </group>
  );
}

/** Mesa de cuatro patas. `size` = ancho, alto, fondo. */
export function Table({ size = [1.7, 0.78, 0.8], color = WOOD_LIGHT, cloth, ...props }: GroupProps & { size?: [number, number, number]; color?: string; cloth?: string }) {
  const [w, h, d] = size;
  return (
    <group {...props}>
      <Block size={[w, 0.07, d]} position={[0, h, 0]} color={color} />
      {cloth && <Block size={[w * 0.72, 0.02, d + 0.06]} position={[0, h + 0.045, 0]} color={cloth} noShadow />}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1]
      ].map(([sx, sz], i) => (
        <Rod key={i} radius={0.045} length={h - 0.03} position={[sx * (w / 2 - 0.08), (h - 0.03) / 2, sz * (d / 2 - 0.08)]} color={WOOD} />
      ))}
    </group>
  );
}

/** Silla. Su respaldo queda en +z. */
export function Chair({ color = WOOD, ...props }: GroupProps & { color?: string }) {
  return (
    <group {...props}>
      <Block size={[0.46, 0.05, 0.46]} position={[0, 0.47, 0]} color={color} />
      <Block size={[0.46, 0.62, 0.05]} position={[0, 0.8, 0.21]} color={color} />
      {[
        [-0.19, -0.19],
        [0.19, -0.19],
        [-0.19, 0.19],
        [0.19, 0.19]
      ].map(([x, z], i) => (
        <Rod key={i} radius={0.028} length={0.46} position={[x, 0.23, z]} color={WOOD_DARK} />
      ))}
    </group>
  );
}

/** Marco dorado con lienzo oscuro. Mira hacia +z. */
export function Picture({ size = [0.82, 1.02], ...props }: GroupProps & { size?: [number, number] }) {
  const [w, h] = size;
  return (
    <group {...props}>
      <Block size={[w, h, 0.07]} color="#c9a227" options={{ emissive: '#8a6a10', glow: 0.45, metal: 0.75, rough: 0.35 }} />
      <Block size={[w - 0.18, h - 0.18, 0.08]} color="#2a2233" noShadow />
      <Block size={[w - 0.32, h - 0.32, 0.085]} color="#3b3145" noShadow />
    </group>
  );
}

/** Lámpara de pie con pantalla cálida. */
export function FloorLamp({ color = '#ffcf8a', intensity = 22, ...props }: GroupProps & { color?: string; intensity?: number }) {
  return (
    <group {...props}>
      <Rod radius={0.2} length={0.05} position={[0, 0.025, 0]} color={WOOD_DARK} />
      <Rod radius={0.03} length={1.7} position={[0, 0.9, 0]} color={BRASS} options={brass} />
      <mesh position={[0, 1.85, 0]} material={mat(color, { emissive: color, glow: 1.6 })}>
        <cylinderGeometry args={[0.2, 0.34, 0.38, 8, 1, true]} />
      </mesh>
      <pointLight position={[0, 1.8, 0]} color={color} intensity={intensity} distance={9} />
    </group>
  );
}

/** Manzana. */
export function Apple({ color = '#c0262d', glow = 0, ...props }: GroupProps & { color?: string; glow?: number }) {
  return (
    <group {...props}>
      <mesh scale={[0.11, 0.1, 0.11]} material={mat(color, { emissive: color, glow, rough: 0.5 })} castShadow>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
      <Rod radius={0.008} length={0.05} position={[0, 0.11, 0]} color="#3b2a16" />
    </group>
  );
}

/** Luces comunes de un diorama interior. */
export function RoomLights({ sky = '#a9bdf0', ground = '#1c1836', key = '#c7d2fe', rim = '#a855f7', ambient = 1.35 }: { sky?: string; ground?: string; key?: string; rim?: string; ambient?: number }) {
  return (
    <>
      <hemisphereLight args={[sky, ground, ambient]} />
      <directionalLight position={[6, 7, 9]} intensity={1.5} color={key} />
      <directionalLight position={[-7, 5, -9]} intensity={1.0} color={rim} />
    </>
  );
}

/** Foco con sombras apuntando a un punto del suelo. */
export function SpotOnFloor({ position, target, color, intensity, shadows }: { position: [number, number, number]; target: [number, number, number]; color: string; intensity: number; shadows: boolean }) {
  const targetObject = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.set(...target);
    return object;
  }, [target[0], target[1], target[2]]);
  return (
    <>
      <primitive object={targetObject} />
      <spotLight
        position={position}
        target={targetObject}
        color={color}
        intensity={intensity}
        angle={1.05}
        penumbra={0.85}
        distance={22}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.002}
      />
    </>
  );
}

/** Retratos de los personajes de una dimensión, con sus imágenes originales. */
export function DimensionPortraits({ dimensionId, still, tint = '#22d3ee' }: { dimensionId: number; still: boolean; tint?: string }) {
  const spots = PORTRAIT_SPOTS[dimensionId] || {};
  return (
    <>
      {Object.entries(spots).map(([characterId, spot]) => {
        const character = CHARACTERS[characterId];
        if (!character) return null;
        const isGuide = characterId === 'sung_jinwoo';
        return (
          <PortraitPanel
            key={characterId}
            image={character.avatar}
            height={spot.height}
            position={spot.position}
            rotation={[0, spot.rotationY, 0]}
            color={characterId === 'gregor_monstruo' ? '#a855f7' : isGuide ? '#22d3ee' : tint}
            beam={isGuide || spot.beam}
            still={still}
          />
        );
      })}
    </>
  );
}
