import * as THREE from 'three';

/** Disposición de los 5 portales del mapa sobre un arco que mira a la cámara. */
const ARC_RADIUS = 13;
const ARC_STEP = 0.31;
const HEIGHTS = [0.25, -0.2, 0.35, -0.15, 0.2];

export function portalPlacement(dimId: number) {
  const index = dimId - 1;
  const angle = (index - 2) * ARC_STEP;
  return {
    position: new THREE.Vector3(Math.sin(angle) * ARC_RADIUS, HEIGHTS[index] ?? 0, ARC_RADIUS - Math.cos(angle) * ARC_RADIUS),
    rotationY: -angle,
    /** Dirección hacia la que mira el portal. */
    normal: new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle))
  };
}
