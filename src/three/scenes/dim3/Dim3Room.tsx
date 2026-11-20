import { Block, Rod, mat } from '../../objects/kit';
import { ObjectTarget } from '../../objects/ObjectTarget';
import {
  BRASS,
  DimensionPortraits,
  Door,
  FloorRune,
  Picture,
  RoomLights,
  RoomShell,
  SpotOnFloor,
  SystemCorners,
  Table,
  WindowPane
} from '../shared/parts';

interface RoomProps {
  still: boolean;
  shadows: boolean;
}

/**
 * Dimensión 3 · «La Habitación Despojada y los Muebles en Disputa».
 * La misma habitación, a medio vaciar: el escritorio y el baúl arrastrados
 * hacia la puerta, la huella del armario en la pared, el canapé cubierto con
 * la sábana y el retrato que Gregor se niega a perder.
 */
export default function Dim3Room({ still, shadows }: RoomProps) {
  const gold = { emissive: '#f59e0b', glow: 0.8, metal: 0.8, rough: 0.3 };
  return (
    <group>
      <RoomLights />
      <SpotOnFloor position={[-2.3, 3.1, -2.3]} target={[0.2, 0, 0.4]} color="#d5e3ff" intensity={300} shadows={shadows} />

      <RoomShell seed={31}>
        <WindowPane position={[-2.3, 1.95, -2.97]} />
        {/* Puerta abierta por donde salen los muebles */}
        <Door position={[-3.96, 0, 0.6]} rotation={[0, Math.PI / 2, 0]} open={-1.15} slit="#ffb86b" />

        {/* Huellas de lo que ya se llevaron */}
        <Block size={[0.02, 2.2, 1.4]} position={[-3.985, 1.15, -2.15]} color="#4d6682" noShadow />
        <Block size={[1.5, 1.6, 0.02]} position={[2.9, 0.82, -2.985]} color="#4a6480" noShadow />
        <Block size={[0.5, 0.012, 2.6]} position={[-1.2, 0.008, -1.5]} rotation={[0, 0.45, 0]} color="#5e4632" noShadow />
        <Block size={[0.5, 0.012, 2.2]} position={[-2.3, 0.008, -0.4]} rotation={[0, 0.9, 0]} color="#5e4632" noShadow />

        {/* Escritorio y baúl, arrastrados hacia la puerta */}
        <Table position={[-2.35, 0, -0.55]} rotation={[0, 0.55, 0]} size={[1.5, 0.78, 0.75]} />
        <group position={[-0.95, 0, -1.05]} rotation={[0, -0.35, 0]}>
          <Block size={[1.05, 0.5, 0.6]} position={[0, 0.25, 0]} color="#6a4a2e" />
          <Block size={[0.07, 0.52, 0.62]} position={[-0.3, 0.25, 0]} color="#2c1e14" noShadow />
          <Block size={[0.07, 0.52, 0.62]} position={[0.3, 0.25, 0]} color="#2c1e14" noShadow />
          <Block size={[0.1, 0.08, 0.03]} position={[0, 0.36, 0.31]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
        </group>
        {/* Alfombra enrollada */}
        <Rod radius={0.16} length={2.3} position={[0.2, 0.16, 2.35]} rotation={[0, 0.12, Math.PI / 2]} color="#4d2433" />

        {/* --- Opciones de «choose_objects» --- */}
        <ObjectTarget objectId="canape_manta" still={still}>
          <group position={[2.3, 0, -2.3]}>
            <Block size={[1.9, 0.34, 0.8]} position={[0, 0.3, 0]} color="#4a2f3a" />
            <Block size={[1.9, 0.62, 0.16]} position={[0, 0.72, -0.34]} color="#4a2f3a" />
            <Block size={[0.16, 0.5, 0.8]} position={[-0.95, 0.5, 0]} color="#3d2630" />
            <Block size={[0.16, 0.5, 0.8]} position={[0.95, 0.5, 0]} color="#3d2630" />
            {/* La sábana que lo cubre */}
            <Block size={[2.15, 0.035, 1.0]} position={[0, 0.5, 0.06]} rotation={[0.03, 0, 0.02]} color="#d8d3c6" />
            <Block size={[2.15, 0.5, 0.035]} position={[0, 0.25, 0.56]} rotation={[0.06, 0, 0]} color="#cfc9bb" />
            <mesh position={[0.3, 0.58, 0.1]} scale={[0.5, 0.1, 0.35]} rotation={[0, 0.6, 0]} material={mat('#e2ddd1')} castShadow>
              <dodecahedronGeometry args={[1, 0]} />
            </mesh>
          </group>
        </ObjectTarget>

        <ObjectTarget objectId="cuadro_pieles" still={still}>
          <Picture position={[0.15, 2.25, -2.96]} />
        </ObjectTarget>

        <ObjectTarget objectId="leche_podrida" still={still}>
          <group position={[-2.6, 0, 1.5]}>
            <Rod radius={0.17} length={0.09} position={[0, 0.045, 0]} color="#d9d4c4" />
            <Rod radius={0.14} length={0.092} position={[0, 0.046, 0]} color="#f6f3ea" />
            <Block size={[0.12, 0.06, 0.09]} position={[0.03, 0.1, 0.02]} rotation={[0, 0.5, 0.2]} color="#c8a877" noShadow />
            <Rod radius={0.2} length={0.02} position={[0.48, 0.01, 0.12]} color="#8d8a80" />
            <mesh position={[0.44, 0.06, 0.1]} scale={0.07} material={mat('#5c6b2e')}>
              <dodecahedronGeometry args={[1, 0]} />
            </mesh>
            <mesh position={[0.55, 0.05, 0.18]} scale={0.055} material={mat('#6b4a2a')}>
              <dodecahedronGeometry args={[1, 0]} />
            </mesh>
            <mesh position={[0.5, 0.05, 0.03]} scale={[0.07, 0.04, 0.05]} material={mat('#b9a45a')}>
              <dodecahedronGeometry args={[1, 0]} />
            </mesh>
          </group>
        </ObjectTarget>

        <ObjectTarget objectId="monedas_oro" still={still}>
          <group position={[-1.1, 0, -2.2]}>
            <mesh position={[0, 0.2, 0]} scale={[0.22, 0.24, 0.22]} material={mat('#7a6a45')} castShadow>
              <dodecahedronGeometry args={[1, 0]} />
            </mesh>
            <Rod radius={0.07} length={0.1} position={[0, 0.43, 0]} color="#6b5c3b" />
            <Rod radius={0.085} length={0.02} position={[0, 0.39, 0]} color="#3b2a16" />
            {[
              [0.3, 0.05, 0.0],
              [0.22, 0.25, 0.4],
              [-0.28, 0.12, -0.3]
            ].map(([x, z, spin], i) => (
              <Rod key={i} radius={0.055} length={0.016} position={[x, 0.01 + i * 0.002, z]} rotation={[0, spin, 0]} color="#fbbf24" options={gold} />
            ))}
          </group>
        </ObjectTarget>

        <ObjectTarget objectId="espada_cazador" still={still}>
          <group position={[1.5, 0, 1.7]}>
            <mesh position={[0, 0.2, 0]} material={mat('#2b3654')} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.28, 0.4, 7]} />
            </mesh>
            <group position={[0, 0.75, 0]} rotation={[0, 0, Math.PI]}>
              {/* Hoja: material sin iluminación para que nunca se «queme» con el bloom */}
              <mesh position={[0, 0.02, 0]} scale={[0.05, 0.26, 0.025]}>
                <octahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color="#8b7fe0" />
              </mesh>
              <Block size={[0.2, 0.03, 0.04]} position={[0, -0.24, 0]} color="#3a3156" noShadow />
              <Rod radius={0.02} length={0.14} position={[0, -0.32, 0]} color="#1d1830" />
            </group>
          </group>
        </ObjectTarget>

        <FloorRune position={[0.3, 0.045, 0.6]} color="#a855f7" accent="#22d3ee" />
        <SystemCorners color="#a855f7" />
      </RoomShell>

      <DimensionPortraits dimensionId={3} still={still} tint="#a855f7" />
    </group>
  );
}
