import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Motes } from './Motes';
import { seeded } from './kit';

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  varying vec3 vDir;
  uniform float uTime;
  uniform vec3 uTint;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    float h = vDir.y;
    vec3 deep = vec3(0.012, 0.027, 0.07);
    vec3 mid = vec3(0.035, 0.04, 0.16);
    vec3 horizon = vec3(0.16, 0.07, 0.34);
    vec3 col = mix(horizon, mid, smoothstep(-0.15, 0.35, h));
    col = mix(col, deep, smoothstep(0.3, 0.95, h));
    col = mix(col, deep * 0.6, smoothstep(-0.1, -0.8, h));

    vec2 uv = vec2(atan(vDir.z, vDir.x) * 1.6, h * 3.2);
    float clouds = fbm(uv * 1.4 + vec2(uTime * 0.012, 0.0));
    float band = smoothstep(0.75, 0.0, abs(h - 0.08));
    col += uTint * pow(clouds, 2.2) * band * 0.55;
    col += vec3(0.25, 0.1, 0.45) * pow(fbm(uv * 2.3 - uTime * 0.008), 3.0) * band * 0.5;

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface SkyProps {
  tint?: string;
  lowQuality?: boolean;
  still?: boolean;
}

/** Cielo del vacío dimensional: degradado nocturno, nebulosa, estrellas e islotes lejanos. */
export function Sky({ tint = '#22d3ee', lowQuality = false, still = false }: SkyProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uTint: { value: new THREE.Color(tint) } }),
    []
  );

  useFrame((_, delta) => {
    if (!material.current) return;
    if (!still) material.current.uniforms.uTime.value += delta;
    (material.current.uniforms.uTint.value as THREE.Color).lerp(new THREE.Color(tint), 0.04);
  });

  return (
    <group>
      <mesh scale={90} frustumCulled={false}>
        <sphereGeometry args={[1, 32, 20]} />
        <shaderMaterial
          ref={material}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          uniforms={uniforms}
          side={THREE.BackSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>
      <Stars radius={55} depth={28} count={lowQuality ? 700 : 2600} factor={3.2} saturation={0.4} fade speed={still ? 0 : 0.5} />
      <Motes count={lowQuality ? 40 : 130} color={tint} still={still} />
      <DistantShards count={lowQuality ? 10 : 22} still={still} />
    </group>
  );
}

/** Islotes de roca flotando a lo lejos, dibujados en una sola llamada (instancing). */
function DistantShards({ count, still }: { count: number; still: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shards = useMemo(() => {
    const random = seeded(77);
    return Array.from({ length: count }, () => {
      const angle = random() * Math.PI * 2;
      const radius = 40 + random() * 22;
      return {
        x: Math.cos(angle) * radius,
        y: -16 + random() * 20,
        z: Math.sin(angle) * radius - 6,
        scale: 0.5 + random() * 1.3,
        phase: random() * Math.PI * 2,
        spin: random() * Math.PI
      };
    });
  }, [count]);

  const place = (time: number) => {
    if (!ref.current) return;
    shards.forEach((shard, i) => {
      dummy.position.set(shard.x, shard.y + Math.sin(time * 0.25 + shard.phase) * 0.5, shard.z);
      dummy.rotation.set(Math.PI, shard.spin, 0);
      dummy.scale.set(shard.scale, shard.scale * 1.7, shard.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => place(0), [shards]);
  useFrame(({ clock }) => {
    if (!still) place(clock.elapsedTime);
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <coneGeometry args={[1, 2, 6]} />
      <meshStandardMaterial color="#2a3158" emissive="#1c2150" emissiveIntensity={0.9} flatShading roughness={1} />
    </instancedMesh>
  );
}
