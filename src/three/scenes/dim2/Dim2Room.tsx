import { Block, Rod } from '../../objects/kit';
import {
  BRASS,
  DimensionPortraits,
  Door,
  FloorLamp,
  FloorRune,
  RoomLights,
  RoomShell,
  SpotOnFloor,
  SystemCorners,
  Table,
  WindowPane,
  WOOD,
  WOOD_DARK
} from '../shared/parts';

interface RoomProps {
  still: boolean;
  shadows: boolean;
}

/**
 * Dimensión 2 · «El Umbral y las Tres Puertas de la Habitación».
 * Al fondo, la habitación de Gregor en penumbra con sus tres puertas; delante,
 * el pasillo iluminado donde la familia se agolpa. Un muro recortado separa
 * los dos mundos y solo la puerta central, con la llave puesta, los comunica.
 */
export default function Dim2Room({ still, shadows }: RoomProps) {
  return (
    <group>
      <RoomLights sky="#b9b4e8" ground="#1a1530" key="#ffe2c2" />
      <SpotOnFloor position={[0.5, 3.8, 3.0]} target={[0.2, 0, 0.9]} color="#ffd9a8" intensity={260} shadows={shadows} />
      {/* Penumbra violeta en el cuarto de Gregor */}
      <pointLight position={[0.3, 1.6, -1.9]} color="#8b5cf6" intensity={9} distance={5} />

      <RoomShell seed={23} floor="#59402d" wall="#2f3a55" sideWall="#3a4763" wainscot="#232c42">
        {/* --- Cuarto de Gregor (fondo), en sombra --- */}
        <Block size={[8.3, 0.02, 2.5]} position={[0, 0.011, -1.8]} color="#1f1c30" noShadow />
        <WindowPane position={[-2.2, 1.95, -2.97]} glowColor="#5d6f96" glow={0.4} curtain="#2e2740" />
        <group position={[1.4, 0, -2.25]}>
          <Block size={[1.5, 0.3, 1.5]} position={[0, 0.27, 0]} color="#2b1f1a" />
          <Block size={[1.4, 0.2, 1.4]} position={[0, 0.5, 0]} color="#6f6c7e" />
          <Block size={[1.5, 1.0, 0.1]} position={[0, 0.7, -0.72]} color="#2b1f1a" />
        </group>
        {/* Puerta lateral (habitación de la hermana) y puerta del fondo */}
        <Door position={[-3.96, 0, -1.8]} rotation={[0, Math.PI / 2, 0]} color="#3d2b21" />
        <Door position={[3.3, 0, -2.96]} color="#3d2b21" />

        {/* --- Muro del umbral, recortado para ver el interior --- */}
        <Block size={[3.3, 1.15, 0.18]} position={[-2.4, 0.575, -0.5]} color="#4d5b78" />
        <Block size={[3.5, 1.15, 0.18]} position={[2.45, 0.575, -0.5]} color="#4d5b78" />
        <Block size={[3.3, 0.06, 0.24]} position={[-2.4, 1.17, -0.5]} color="#2a3348" noShadow />
        <Block size={[3.5, 0.06, 0.24]} position={[2.45, 1.17, -0.5]} color="#2a3348" noShadow />
        {/* La puerta cerrada, con la llave en la cerradura */}
        <Door position={[0, 0, -0.5]} color={WOOD} keyGlow="#fbbf24" slit="#8b5cf6" />

        {/* --- Pasillo (primer plano), cálido --- */}
        <Block size={[5.4, 0.03, 1.3]} position={[0.1, 0.015, 1.25]} color="#5a2f2a" noShadow />
        <Block size={[5.0, 0.036, 0.9]} position={[0.1, 0.018, 1.25]} color="#74403a" noShadow />
        <FloorRune position={[0.1, 0.045, 1.25]} color="#f59e0b" accent="#dc2626" radius={0.55} />
        <FloorLamp position={[-3.4, 0, 2.5]} intensity={26} />
        <Table position={[-3.45, 0, 0.9]} size={[0.6, 0.8, 1.1]} />
        <Block size={[0.3, 0.02, 0.42]} position={[-3.45, 0.83, 0.9]} rotation={[0, 0.3, 0]} color="#d9d2c0" noShadow />

        {/* Bastón y periódico del padre */}
        <Rod radius={0.025} length={1.05} position={[2.55, 0.52, 0.55]} rotation={[0.25, 0, -0.12]} color="#1d1410" />
        <Rod radius={0.05} length={0.06} position={[2.6, 1.05, 0.42]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} />
        <Block size={[0.34, 0.03, 0.46]} position={[2.2, 0.02, 1.75]} rotation={[0, 0.5, 0]} color="#d9d2c0" noShadow />

        {/* Escalera por la que huye el apoderado */}
        <group position={[3.4, 0, 3.2]}>
          {[0, 1, 2, 3, 4].map((step) => (
            <Block key={step} size={[1.5, 0.2, 0.34]} position={[0, -0.1 - step * 0.2, 0.17 + step * 0.32]} color="#4a3423" />
          ))}
          {[0, 2, 4].map((step) => (
            <Rod key={step} radius={0.03} length={0.9} position={[0.7, 0.35 - step * 0.2, 0.17 + step * 0.32]} color={WOOD_DARK} />
          ))}
          <Rod radius={0.035} length={1.75} position={[0.7, 0.4, 0.8]} rotation={[1.0, 0, 0]} color={WOOD_DARK} />
          {/* Sombrero caído en la huida */}
          <group position={[-0.25, -0.38, 0.85]} rotation={[0.4, 0.3, 0.2]}>
            <Rod radius={0.18} length={0.02} color="#15151c" />
            <Rod radius={0.11} length={0.13} position={[0, 0.07, 0]} color="#15151c" />
          </group>
        </group>

        <SystemCorners color="#f59e0b" />
      </RoomShell>

      <DimensionPortraits dimensionId={2} still={still} tint="#f59e0b" />
    </group>
  );
}
