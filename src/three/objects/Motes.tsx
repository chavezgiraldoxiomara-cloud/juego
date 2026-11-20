import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { seeded } from './kit';

const vertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  varying float vTwinkle;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.35 + aSeed * 6.28) * 0.6;
    p.x += cos(uTime * 0.22 + aSeed * 12.56) * 0.45;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uScale / max(-mv.z, 0.5), 1.0, 64.0);
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.3 + aSeed * 40.0);
  }
`;

// Disco suave con caída acotada: nunca produce valores infinitos, así el bloom
// no puede «quemar» el fotograma.
const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor * 1.4, alpha * alpha * vTwinkle * 0.85);
  }
`;

interface MotesProps {
  count: number;
  color: string;
  area?: [number, number, number];
  position?: [number, number, number];
  size?: number;
  still?: boolean;
}

/** Motas de energía flotando en el aire (una sola llamada de dibujo). */
export function Motes({ count, color, area = [26, 12, 18], position = [0, 3, 0], size = 0.16, still = false }: MotesProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const random = seeded(count * 13 + 5);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * area[0];
      positions[i * 3 + 1] = (random() - 0.5) * area[1];
      positions[i * 3 + 2] = (random() - 0.5) * area[2];
      seeds[i] = random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count, area[0], area[1], area[2]]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: size }, uScale: { value: 600 }, uColor: { value: new THREE.Color(color) } }),
    []
  );

  useFrame(({ size: viewport }, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    if (!still) u.uTime.value += delta;
    u.uScale.value = viewport.height * 1.3;
    (u.uColor.value as THREE.Color).lerp(new THREE.Color(color), 0.04);
  });

  return (
    <points geometry={geometry} position={position} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
