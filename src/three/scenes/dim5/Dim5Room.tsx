import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Block, Rod } from '../../objects/kit';
import { Motes } from '../../objects/Motes';
import { Chair, DimensionPortraits, FloorRune, RoomLights, SpotOnFloor, SystemCorners, WOOD_DARK } from '../shared/parts';
import { LivingRoom } from '../shared/LivingRoom';

interface RoomProps {
  still: boolean;
  shadows: boolean;
}

/**
 * Dimensión 5 · «El Salón Iluminado, el Concierto de Violín y la Madrugada».
 * El salón encendido para el concierto: el violín de Grete en el centro, las
 * sillas de los tres huéspedes, la puerta de Gregor abierta de par en par y,
 * en la ventana, la primera luz del amanecer.
 */
export default function Dim5Room({ still, shadows }: RoomProps) {
  return (
    <group>
      <RoomLights sky="#f0d9b4" ground="#1c1630" key="#fff0d2" rim="#9333ea" ambient={1.5} />
      <SpotOnFloor position={[1.6, 4.0, 2.2]} target={[1.2, 0, -0.3]} color="#ffe2a8" intensity={320} shadows={shadows} />

      <LivingRoom
        seed={53}
        wall="#4a3a5c"
        sideWall="#413352"
        wainscot="#32273f"
        doorOpen={1.35}
        windowColor="#ffc78a"
        windowGlow={1.15}
        lampIntensity={42}
        tablePosition={[-1.2, 0, 1.6]}
      >
        {/* Atril y violín */}
        <group position={[1.5, 0, -0.3]}>
          <Rod radius={0.025} length={1.15} position={[0, 0.575, 0]} color={WOOD_DARK} />
          <Rod radius={0.2} length={0.03} position={[0, 0.015, 0]} color={WOOD_DARK} />
          <Block size={[0.5, 0.36, 0.03]} position={[0, 1.25, 0.03]} rotation={[-0.3, 0, 0]} color="#3a2a1c" />
          <Block size={[0.4, 0.28, 0.01]} position={[0, 1.26, 0.055]} rotation={[-0.3, 0, 0]} color="#efe9d8" noShadow />
        </group>
        <Violin position={[1.5, 1.95, -0.3]} still={still} />
        <Motes count={36} color="#fbbf24" area={[2.4, 2.2, 2.0]} position={[1.5, 2.1, -0.3]} size={0.09} still={still} />

        {/* Sillas de los tres huéspedes, con sus sombreros */}
        {[-0.7, 0.2, 1.1].map((z, i) => (
          <group key={i} position={[3.3, 0, z]}>
            <Chair rotation={[0, Math.PI / 2, 0]} color="#3a2a22" />
            <group position={[0, 0.5, 0]} rotation={[0, i * 0.5, 0]}>
              <Rod radius={0.17} length={0.02} position={[0, 0.01, 0]} color="#15151c" />
              <Rod radius={0.105} length={0.13} position={[0, 0.075, 0]} color="#15151c" />
            </group>
          </group>
        ))}

        {/* Rastro de polvo que Gregor deja al avanzar hacia la música */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Block
            key={i}
            size={[0.34, 0.012, 0.16]}
            position={[-2.1 + i * 0.55, 0.045, -2.2 + i * 0.36]}
            rotation={[0, 0.6, 0]}
            color="#2b2433"
            noShadow
          />
        ))}

        <FloorRune position={[1.5, 0.045, -0.3]} color="#fbbf24" accent="#9333ea" radius={0.9} />
        <SystemCorners color="#fbbf24" />
      </LivingRoom>

      <DimensionPortraits dimensionId={5} still={still} tint="#fbbf24" />
    </group>
  );
}

/** Violín con su arco, suspendido en el aire mientras suena la última canción. */
function Violin({ position, still }: { position: [number, number, number]; still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current || still) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.5 + 0.3;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.1) * 0.05;
  });
  const body = '#8a4b1f';
  return (
    <group ref={ref} position={position} rotation={[0, 0.3, 0.25]} scale={1.5}>
      <Rod radius={0.17} length={0.07} position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} color={body} options={{ rough: 0.4 }} />
      <Rod radius={0.13} length={0.07} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} color={body} options={{ rough: 0.4 }} />
      <Block size={[0.2, 0.16, 0.07]} position={[0, 0, 0]} color={body} options={{ rough: 0.4 }} />
      <Block size={[0.05, 0.42, 0.04]} position={[0, 0.44, 0.01]} color="#2a170b" />
      <Rod radius={0.04} length={0.06} position={[0, 0.67, 0.01]} rotation={[0, 0, Math.PI / 2]} color="#2a170b" />
      <Block size={[0.035, 0.7, 0.008]} position={[0, 0.2, 0.045]} color="#efe9d8" options={{ emissive: '#fde68a', glow: 0.6 }} noShadow />
      <Block size={[0.06, 0.13, 0.02]} position={[0, -0.22, 0.045]} color="#15100c" noShadow />
      <Block size={[0.09, 0.015, 0.03]} position={[0, -0.06, 0.05]} color="#d9c9a3" noShadow />
      {/* Arco */}
      <group position={[0.28, 0.1, 0.06]} rotation={[0, 0, -0.5]}>
        <Rod radius={0.008} length={0.95} color="#3a2414" />
        <Block size={[0.006, 0.9, 0.012]} position={[0.02, 0, 0]} color="#f5f1e6" noShadow />
      </group>
      <pointLight color="#fbbf24" intensity={6} distance={3.5} position={[0, 0.1, 0.5]} />
    </group>
  );
}
