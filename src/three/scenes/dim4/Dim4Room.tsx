import { Block, Rod } from '../../objects/kit';
import { Apple, DimensionPortraits, FloorRune, RoomLights, SpotOnFloor, SystemCorners } from '../shared/parts';
import { LivingRoom } from '../shared/LivingRoom';

interface RoomProps {
  still: boolean;
  shadows: boolean;
}

// Manzanas arrojadas: un reguero desde el aparador hasta la puerta de Gregor
const THROWN_APPLES: [number, number, number][] = [
  [-2.9, 0.1, 0.9],
  [-1.9, 0.1, 0.2],
  [-2.7, 0.1, -0.5],
  [-1.4, 0.1, -1.1],
  [-2.9, 0.1, -1.6],
  [-1.8, 0.1, -2.1],
  [-0.6, 0.1, -1.9],
  [-3.3, 0.1, -2.4]
];

/**
 * Dimensión 4 · «El Salón Familiar y el Bombardeo de Manzanas».
 * El salón bajo una luz rojiza: el frutero del aparador, el reguero de
 * manzanas hacia la puerta entreabierta de Gregor, la gorra de uniforme del
 * padre y los trastos amontonados junto al cuarto convertido en depósito.
 */
export default function Dim4Room({ still, shadows }: RoomProps) {
  return (
    <group>
      <RoomLights sky="#e3b4c0" ground="#1d1220" key="#ffd9c2" rim="#f43f5e" />
      <SpotOnFloor position={[1.2, 3.9, 2.6]} target={[-0.8, 0, -0.6]} color="#ffc2ae" intensity={280} shadows={shadows} />

      <LivingRoom
        seed={41}
        wall="#5a3340"
        sideWall="#4f2e3b"
        wainscot="#3a222c"
        doorOpen={0.75}
        windowColor="#7a6a8f"
        windowGlow={0.45}
        lampIntensity={30}
        tablePosition={[1.7, 0, -0.9]}
      >
        {/* Frutero del aparador */}
        <group position={[-3.66, 1.0, 1.9]}>
          <Rod radius={0.24} length={0.1} position={[0, 0.05, 0]} color="#8a6a45" />
          <Apple position={[-0.08, 0.17, 0.05]} />
          <Apple position={[0.09, 0.17, -0.04]} color="#a91f25" />
          <Apple position={[0.0, 0.26, 0.02]} color="#d13a2f" />
        </group>

        {THROWN_APPLES.map((position, i) => (
          <Apple key={i} position={position} rotation={[i * 0.7, i * 1.3, 0]} color={i % 2 ? '#a91f25' : '#c0262d'} />
        ))}
        {/* La manzana que queda incrustada */}
        <Apple position={[-1.75, 1.65, -2.15]} glow={1.4} scale={1.25} />
        <pointLight position={[-1.75, 1.65, -1.9]} color="#f43f5e" intensity={5} distance={2.5} />

        {/* Trastos junto al cuarto convertido en depósito */}
        <group position={[-3.5, 0, -2.45]}>
          <Block size={[0.7, 0.55, 0.6]} position={[0, 0.275, 0]} rotation={[0, 0.2, 0]} color="#4a3a2a" />
          <Block size={[0.5, 0.4, 0.45]} position={[0.05, 0.75, 0.02]} rotation={[0, -0.3, 0]} color="#5a4733" />
          <Rod radius={0.17} length={0.34} position={[0.62, 0.17, 0.3]} color="#3d4150" options={{ metal: 0.5, rough: 0.6 }} />
          <Rod radius={0.14} length={0.03} position={[0.62, 0.34, 0.3]} color="#6b6b70" />
        </group>

        {/* Sillón del padre, con la bata de sus días de indolencia */}
        <group position={[3.2, 0, 1.6]} rotation={[0, -0.6, 0]}>
          <Block size={[0.9, 0.4, 0.85]} position={[0, 0.25, 0]} color="#5a2a2a" />
          <Block size={[0.9, 0.75, 0.2]} position={[0, 0.8, 0.33]} color="#5a2a2a" />
          <Block size={[0.18, 0.34, 0.85]} position={[-0.45, 0.58, 0]} color="#4a2222" />
          <Block size={[0.18, 0.34, 0.85]} position={[0.45, 0.58, 0]} color="#4a2222" />
          <Block size={[0.6, 0.5, 0.08]} position={[0.1, 0.95, 0.2]} rotation={[0.25, 0, 0.1]} color="#8a7a66" />
        </group>

        {/* Gorra de uniforme con botón dorado, sobre la mesa */}
        <group position={[1.4, 0.88, -0.75]} rotation={[0, 0.4, 0]}>
          <Rod radius={0.14} length={0.1} position={[0, 0.05, 0]} color="#1f2c52" />
          <Block size={[0.24, 0.015, 0.14]} position={[0, 0.02, 0.15]} color="#12172b" noShadow />
          <Rod radius={0.025} length={0.02} position={[0, 0.06, 0.14]} rotation={[Math.PI / 2, 0, 0]} color="#fbbf24" options={{ emissive: '#f59e0b', glow: 0.9, metal: 0.8, rough: 0.3 }} />
        </group>

        <FloorRune position={[-0.9, 0.045, -0.5]} color="#f43f5e" accent="#f59e0b" radius={0.8} />
        <SystemCorners color="#f43f5e" />
      </LivingRoom>

      <DimensionPortraits dimensionId={4} still={still} tint="#f43f5e" />
    </group>
  );
}
