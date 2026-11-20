import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeElements, type ThreeEvent } from '@react-three/fiber';
import { glowMat, mat } from './kit';
import { isUiEvent } from '../store';

const vortexVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const vortexFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPower;
  uniform vec3 uColor;
  uniform vec3 uColor2;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = atan(p.y, p.x + 0.00001);
    float armsA = pow(sin(a * 4.0 + r * 10.0 - uTime * 2.1) * 0.5 + 0.5, 2.5);
    float armsB = pow(sin(a * 7.0 - r * 16.0 + uTime * 1.3) * 0.5 + 0.5, 3.0);
    float glow = clamp(armsA * 0.7 + armsB * 0.5, 0.0, 1.0);
    float core = smoothstep(0.72, 0.1, r);
    float rim = smoothstep(1.0, 0.86, r) * smoothstep(0.35, 0.95, r);
    vec3 col = mix(uColor2, uColor, glow) * (0.18 + glow * 1.05);
    col += uColor * rim * 0.9;
    col *= mix(1.0, 0.06, core);
    float alpha = smoothstep(1.0, 0.9, r) * (0.3 + 0.7 * glow * (1.0 - core * 0.75));
    gl_FragColor = vec4(col * uPower, alpha * clamp(uPower, 0.0, 1.0));
  }
`;

export type PortalStatus = 'locked' | 'dormant' | 'available' | 'active' | 'completed';

interface PortalProps extends Omit<ThreeElements['group'], 'onClick'> {
  color: string;
  color2: string;
  status: PortalStatus;
  focused?: boolean;
  still?: boolean;
  onSelect?: () => void;
  onFocus?: () => void;
}

/** Portal dimensional: aro de piedra con runas y vórtice de energía. Centro en y = 1.75. */
export function Portal({ color, color2, status, focused = false, still = false, onSelect, onFocus, ...props }: PortalProps) {
  const vortex = useRef<THREE.ShaderMaterial>(null);
  const runes = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const locked = status === 'locked' || status === 'dormant';
  const energy = status === 'completed' ? '#34d399' : color;
  const energy2 = status === 'completed' ? '#0f766e' : color2;

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 10 },
      uPower: { value: 0 },
      uColor: { value: new THREE.Color(energy) },
      uColor2: { value: new THREE.Color(energy2) }
    }),
    []
  );

  useFrame((_, delta) => {
    const targetPower = locked ? 0 : focused ? 1.35 : status === 'active' ? 1.05 : 0.85;
    if (vortex.current) {
      const u = vortex.current.uniforms;
      if (!still) u.uTime.value += delta * (focused ? 1.5 : 1);
      u.uPower.value = THREE.MathUtils.damp(u.uPower.value, targetPower, 4, delta);
      (u.uColor.value as THREE.Color).lerp(new THREE.Color(energy), 0.08);
      (u.uColor2.value as THREE.Color).lerp(new THREE.Color(energy2), 0.08);
    }
    if (runes.current && !still) runes.current.rotation.z += delta * (locked ? 0 : focused ? 0.5 : 0.18);
    if (light.current) {
      light.current.intensity = THREE.MathUtils.damp(light.current.intensity, locked ? 0 : focused ? 26 : 12, 4, delta);
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (isUiEvent(event.nativeEvent) || event.delta > 8) return;
    event.stopPropagation();
    onSelect?.();
  };

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    if (isUiEvent(event.nativeEvent)) return;
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
    onFocus?.();
  };

  const stone = locked ? '#222a40' : '#33405f';
  const runeMaterial = locked ? mat('#1e2538') : glowMat(energy);

  return (
    <group {...props}>
      {/* Escalones y círculo rúnico del suelo */}
      <mesh position={[0, 0.07, 0]} material={mat('#2b3654')} receiveShadow>
        <cylinderGeometry args={[1.5, 1.65, 0.14, 10]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} material={mat('#35426a')} receiveShadow>
        <cylinderGeometry args={[1.12, 1.25, 0.12, 10]} />
      </mesh>
      {!locked && (
        <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.82, 0.9, 40]} />
          <meshBasicMaterial color={energy} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      )}

      <group position={[0, 1.75, 0]}>
        {/* Aro de piedra */}
        <mesh material={mat(stone)} castShadow>
          <torusGeometry args={[1.27, 0.22, 5, 12]} />
        </mesh>
        {/* Runas engastadas */}
        <group ref={runes}>
          {[0, 1, 2, 3].map((i) => {
            const angle = Math.PI / 4 + (i * Math.PI) / 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 1.27, Math.sin(angle) * 1.27, 0.16]}
                rotation={[0, 0, angle]}
                scale={[0.16, 0.22, 0.1]}
                material={runeMaterial}
              >
                <octahedronGeometry args={[1, 0]} />
              </mesh>
            );
          })}
        </group>
        {/* Fondo oscuro y vórtice */}
        <mesh position={[0, 0, -0.03]}>
          <circleGeometry args={[1.12, 40]} />
          <meshBasicMaterial color="#02040a" />
        </mesh>
        <mesh>
          <circleGeometry args={[1.14, 48]} />
          <shaderMaterial
            ref={vortex}
            vertexShader={vortexVertex}
            fragmentShader={vortexFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {status === 'locked' && <Seal />}
        <pointLight ref={light} color={energy} intensity={0} distance={7} decay={2} position={[0, 0, 0.8]} />

        {/* Zona de clic amplia e invisible */}
        {(onSelect || onFocus) && (
          <mesh onClick={handleClick} onPointerOver={handleOver} onPointerOut={() => (document.body.style.cursor = '')}>
            <cylinderGeometry args={[1.55, 1.55, 0.7, 16]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** Sello de un portal bloqueado: cadenas cruzadas y candado. */
function Seal() {
  const iron = mat('#3a4156', { metal: 0.6, rough: 0.5 });
  return (
    <group position={[0, 0, 0.14]}>
      <mesh rotation={[0, 0, Math.PI / 4]} scale={[2.5, 0.09, 0.07]} material={iron}>
        <boxGeometry />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]} scale={[2.5, 0.09, 0.07]} material={iron}>
        <boxGeometry />
      </mesh>
      <mesh position={[0, -0.08, 0.06]} scale={[0.42, 0.36, 0.14]} material={mat('#565f7a', { metal: 0.7, rough: 0.4 })}>
        <boxGeometry />
      </mesh>
      <mesh position={[0, 0.14, 0.06]} material={iron}>
        <torusGeometry args={[0.13, 0.04, 5, 10, Math.PI]} />
      </mesh>
    </group>
  );
}
