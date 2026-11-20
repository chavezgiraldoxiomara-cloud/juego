import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

/**
 * Kit low-poly: una sola geometría de caja y de cilindro compartidas, y
 * materiales cacheados por color, para que todo el escenario use muy pocos
 * recursos de GPU.
 */
export const unitBox = new THREE.BoxGeometry(1, 1, 1);
export const unitCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

interface MatOptions {
  emissive?: string;
  glow?: number;
  rough?: number;
  metal?: number;
}

export function mat(color: string, options: MatOptions = {}): THREE.MeshStandardMaterial {
  const { emissive = '#000000', glow = 0, rough = 0.85, metal = 0 } = options;
  const key = `${color}|${emissive}|${glow}|${rough}|${metal}`;
  let material = materialCache.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: glow,
      roughness: rough,
      metalness: metal,
      flatShading: true
    });
    materialCache.set(key, material);
  }
  return material;
}

const glowCache = new Map<string, THREE.MeshBasicMaterial>();

/**
 * Material luminoso sin iluminación para gemas y runas pequeñas. Al no depender
 * de normales ni de luces, su brillo es siempre finito y el bloom no se dispara.
 */
export function glowMat(color: string): THREE.MeshBasicMaterial {
  let material = glowCache.get(color);
  if (!material) {
    material = new THREE.MeshBasicMaterial({ color, toneMapped: false });
    glowCache.set(color, material);
  }
  return material;
}

type MeshProps = Omit<ThreeElements['mesh'], 'scale'>;

interface BlockProps extends MeshProps {
  size: [number, number, number];
  color: string;
  options?: MatOptions;
  noShadow?: boolean;
}

/** Caja low-poly. `size` es ancho, alto, fondo. */
export function Block({ size, color, options, noShadow, ...props }: BlockProps) {
  return (
    <mesh
      geometry={unitBox}
      material={mat(color, options)}
      scale={size}
      castShadow={!noShadow}
      receiveShadow
      {...props}
    />
  );
}

interface RodProps extends MeshProps {
  radius: number;
  length: number;
  color: string;
  options?: MatOptions;
}

/** Cilindro low-poly (patas, tubos, discos). */
export function Rod({ radius, length, color, options, ...props }: RodProps) {
  return (
    <mesh
      geometry={unitCylinder}
      material={mat(color, options)}
      scale={[radius * 2, length, radius * 2]}
      castShadow
      receiveShadow
      {...props}
    />
  );
}

/** Generador pseudoaleatorio determinista (misma escena en cada carga). */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
