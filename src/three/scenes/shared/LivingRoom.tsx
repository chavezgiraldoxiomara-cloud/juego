import { Block, Rod } from '../../objects/kit';
import { BRASS, Chair, Door, FloorLamp, RoomShell, Table, WindowPane, WOOD, WOOD_DARK } from './parts';

interface LivingRoomProps {
  seed: number;
  wall: string;
  sideWall: string;
  wainscot: string;
  /** Apertura de la puerta del cuarto de Gregor (radianes). */
  doorOpen: number;
  windowColor: string;
  windowGlow: number;
  lampIntensity: number;
  tablePosition: [number, number, number];
  children?: React.ReactNode;
}

/**
 * Salón de los Samsa, base de las dimensiones 4 y 5: mesa familiar, aparador,
 * lámpara, ventana y, al fondo, la puerta del cuarto de Gregor.
 */
export function LivingRoom({
  seed,
  wall,
  sideWall,
  wainscot,
  doorOpen,
  windowColor,
  windowGlow,
  lampIntensity,
  tablePosition,
  children
}: LivingRoomProps) {
  return (
    <RoomShell seed={seed} floor="#5b412c" wall={wall} sideWall={sideWall} wainscot={wainscot}>
      {/* Puerta del cuarto de Gregor: detrás solo hay oscuridad */}
      <Block size={[1.1, 2.3, 0.02]} position={[-2.4, 1.15, -2.985]} color="#06050c" noShadow />
      <Door position={[-2.4, 0, -2.93]} open={doorOpen} slit="#8b5cf6" />
      <WindowPane position={[2.5, 1.95, -2.97]} glowColor={windowColor} glow={windowGlow} curtain="#4a2f3f" />

      {/* Aparador */}
      <group position={[-3.68, 0, 1.9]}>
        <Block size={[0.6, 0.95, 1.9]} position={[0, 0.475, 0]} color={WOOD} />
        <Block size={[0.68, 0.05, 2.0]} position={[0, 0.97, 0]} color={WOOD_DARK} />
        <Block size={[0.02, 0.6, 0.02]} position={[0.31, 0.5, 0]} color="#1a120c" noShadow />
        <Block size={[0.04, 0.1, 0.04]} position={[0.32, 0.55, -0.12]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
        <Block size={[0.04, 0.1, 0.04]} position={[0.32, 0.55, 0.12]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
      </group>

      {/* Mesa familiar */}
      <group position={tablePosition}>
        <Table size={[2.2, 0.8, 1.15]} cloth="#d9d2c0" />
        <Chair position={[-0.6, 0, -0.85]} rotation={[0, Math.PI, 0]} />
        <Chair position={[0.6, 0, -0.85]} rotation={[0, Math.PI, 0]} />
        <Chair position={[0, 0, 0.9]} />
        <Rod radius={0.16} length={0.02} position={[0.5, 0.86, 0.1]} color="#e8e2d4" />
        <Rod radius={0.16} length={0.02} position={[-0.5, 0.86, -0.1]} color="#e8e2d4" />
      </group>

      <FloorLamp position={[3.6, 0, -2.3]} intensity={lampIntensity} />
      {/* Alfombra del salón */}
      <Block size={[3.6, 0.03, 2.3]} position={[0.4, 0.015, 0.4]} color="#43202c" noShadow />
      <Block size={[3.2, 0.036, 1.9]} position={[0.4, 0.018, 0.4]} color="#5a2b3a" noShadow />
      {children}
    </RoomShell>
  );
}
