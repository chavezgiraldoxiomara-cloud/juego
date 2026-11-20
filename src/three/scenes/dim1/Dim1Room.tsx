import { useMemo } from 'react';
import * as THREE from 'three';
import { CHARACTERS } from '../../../data/characters';
import { PORTRAIT_SPOTS } from '../../../data/scene3d';
import { Island } from '../../objects/Island';
import { Block, Rod, mat } from '../../objects/kit';
import { ClueTarget } from '../../objects/ClueTarget';
import { PortraitPanel } from '../../objects/PortraitPanel';

interface RoomProps {
  still: boolean;
  shadows: boolean;
}

const WOOD = '#5c3f29';
const WOOD_DARK = '#40291a';
const WOOD_LIGHT = '#775338';
const BRASS = '#b9995a';

/**
 * Dimensión 1 · «La Habitación de Gregor - El Despertar».
 * Diorama de la habitación al amanecer: la cama, la mesa con el muestrario de
 * telas, el despertador y el retrato enmarcado, flotando sobre una isla del
 * vacío dimensional. Todo está construido con cajas y cilindros low-poly.
 */
export default function Dim1Room({ still, shadows }: RoomProps) {
  const spots = PORTRAIT_SPOTS[1];
  const windowTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0.2, 0, 0.4);
    return target;
  }, []);

  return (
    <group>
      <Island radius={4.4} depth={5.2} seed={11} stretch={[1.22, 0.98]} />

      {/* Luz fría del amanecer que entra por la ventana */}
      <hemisphereLight args={['#a9bdf0', '#1c1836', 1.35]} />
      <primitive object={windowTarget} />
      <spotLight
        position={[-2.3, 2.9, -2.5]}
        target={windowTarget}
        color="#d5e3ff"
        intensity={300}
        angle={1.05}
        penumbra={0.85}
        distance={22}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.002}
      />
      <directionalLight position={[6, 7, 9]} intensity={1.5} color="#c7d2fe" />
      <directionalLight position={[-7, 5, -9]} intensity={1.0} color="#a855f7" />
      {/* Rendija cálida bajo la puerta: la familia al otro lado */}
      <pointLight position={[-3.7, 0.4, 0.6]} color="#ffb86b" intensity={5} distance={3.2} />

      <group position={[0, 0.2, 0]}>
        {/* --- Suelo --- */}
        <Block size={[8.4, 0.2, 6.4]} position={[0, -0.1, 0]} color="#4d3827" />
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <Block key={x} size={[0.03, 0.012, 6.4]} position={[x, 0.006, 0]} color="#30221a" noShadow />
        ))}
        <Block size={[2.8, 0.03, 1.8]} position={[-0.3, 0.015, 0.7]} color="#3a1c28" noShadow />
        <Block size={[2.4, 0.036, 1.4]} position={[-0.3, 0.018, 0.7]} color="#4d2433" noShadow />

        {/* --- Pared del fondo --- */}
        <Block size={[8.4, 3.4, 0.2]} position={[0, 1.7, -3.1]} color="#3d5672" />
        <Block size={[8.4, 0.9, 0.06]} position={[0, 0.45, -2.98]} color="#2d415a" noShadow />
        <Block size={[8.4, 0.06, 0.1]} position={[0, 0.93, -2.96]} color={WOOD} noShadow />

        {/* Ventana: mañana nublada */}
        <group position={[-2.3, 1.95, -2.97]}>
          <Block size={[1.5, 1.9, 0.04]} color="#9db8d6" options={{ emissive: '#9ab6dc', glow: 0.85 }} noShadow />
          <Block size={[1.7, 0.1, 0.1]} position={[0, 1.0, 0.02]} color={WOOD_DARK} />
          <Block size={[1.7, 0.12, 0.16]} position={[0, -1.0, 0.04]} color={WOOD_DARK} />
          <Block size={[0.1, 2.0, 0.1]} position={[-0.8, 0, 0.02]} color={WOOD_DARK} />
          <Block size={[0.1, 2.0, 0.1]} position={[0.8, 0, 0.02]} color={WOOD_DARK} />
          <Block size={[0.05, 1.9, 0.07]} position={[0, 0, 0.03]} color={WOOD_DARK} noShadow />
          <Block size={[1.5, 0.05, 0.07]} position={[0, 0.25, 0.03]} color={WOOD_DARK} noShadow />
          <Block size={[0.32, 2.2, 0.08]} position={[-1.02, -0.05, 0.1]} color="#5b4463" />
          <Block size={[0.32, 2.2, 0.08]} position={[1.02, -0.05, 0.1]} color="#5b4463" />
          <Rod radius={0.025} length={2.5} position={[0, 1.12, 0.12]} rotation={[0, 0, Math.PI / 2]} color={BRASS} options={{ metal: 0.7, rough: 0.4 }} />
        </group>

        {/* --- Pared izquierda y puerta cerrada --- */}
        <Block size={[0.2, 3.4, 6.4]} position={[-4.1, 1.7, 0]} color="#364b63" />
        <Block size={[0.06, 0.9, 6.4]} position={[-3.98, 0.45, 0]} color="#293c53" noShadow />
        <group position={[-3.96, 0, 0.6]}>
          <Block size={[0.08, 2.3, 1.1]} position={[0, 1.15, 0]} color={WOOD} />
          <Block size={[0.1, 2.42, 0.1]} position={[0, 1.21, -0.6]} color={WOOD_DARK} />
          <Block size={[0.1, 2.42, 0.1]} position={[0, 1.21, 0.6]} color={WOOD_DARK} />
          <Block size={[0.1, 0.1, 1.3]} position={[0, 2.37, 0]} color={WOOD_DARK} />
          <Block size={[0.1, 0.8, 0.75]} position={[0.02, 1.6, 0]} color={WOOD_DARK} noShadow />
          <Block size={[0.1, 0.7, 0.75]} position={[0.02, 0.6, 0]} color={WOOD_DARK} noShadow />
          <Block size={[0.12, 0.06, 0.16]} position={[0.07, 1.1, -0.4]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} />
          <Block size={[0.02, 0.03, 1.0]} position={[0.05, 0.02, 0]} color="#ffb86b" options={{ emissive: '#ffb86b', glow: 2 }} noShadow />
        </group>

        {/* Armario */}
        <group position={[-3.6, 0, -2.15]}>
          <Block size={[0.75, 2.3, 1.5]} position={[0, 1.15, 0]} color="#4d3524" />
          <Block size={[0.85, 0.1, 1.6]} position={[0, 2.35, 0]} color={WOOD_DARK} />
          <Block size={[0.02, 2.0, 0.03]} position={[0.385, 1.15, 0]} color="#1a120c" noShadow />
          <Block size={[0.05, 0.14, 0.04]} position={[0.4, 1.15, -0.1]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
          <Block size={[0.05, 0.14, 0.04]} position={[0.4, 1.15, 0.1]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
        </group>

        {/* Perchero con sombrero de viajante */}
        <group position={[-3.45, 0, 2.45]}>
          <Rod radius={0.035} length={1.8} position={[0, 0.9, 0]} color={WOOD_DARK} />
          <Rod radius={0.22} length={0.05} position={[0, 0.025, 0]} color={WOOD_DARK} />
          <Rod radius={0.2} length={0.03} position={[0, 1.82, 0]} color="#1a1a22" />
          <Rod radius={0.12} length={0.14} position={[0, 1.9, 0]} color="#1a1a22" />
        </group>

        {/* --- Mesa con el muestrario de telas --- */}
        <group position={[-0.15, 0, -2.5]}>
          <Block size={[1.7, 0.07, 0.8]} position={[0, 0.78, 0]} color={WOOD_LIGHT} />
          {[
            [-0.78, -0.33],
            [0.78, -0.33],
            [-0.78, 0.33],
            [0.78, 0.33]
          ].map(([x, z], i) => (
            <Rod key={i} radius={0.04} length={0.75} position={[x, 0.375, z]} color={WOOD} />
          ))}
        </group>
        <ClueTarget clueId="muestrario" still={still}>
          <group position={[-0.55, 0.815, -2.45]}>
            <Block size={[0.78, 0.17, 0.52]} position={[0, 0.085, 0]} color="#7a4f2f" />
            <Block size={[0.78, 0.52, 0.05]} position={[0, 0.4, -0.3]} rotation={[-0.22, 0, 0]} color="#684227" />
            <Block size={[0.8, 0.03, 0.06]} position={[0, 0.17, 0.25]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
            {['#7c2d3a', '#2f5d62', '#b08d57', '#3d3a6b', '#6b7a3a'].map((color, i) => (
              <Block
                key={color}
                size={[0.13, 0.26 - i * 0.02, 0.4]}
                position={[-0.28 + i * 0.14, 0.2, 0]}
                rotation={[0, 0, (i - 2) * 0.05]}
                color={color}
                noShadow
              />
            ))}
            {/* Muestras desplegadas sobre la mesa */}
            <Block size={[0.3, 0.02, 0.42]} position={[0.62, 0.012, 0.05]} rotation={[0, 0.25, 0]} color="#7c2d3a" noShadow />
            <Block size={[0.3, 0.02, 0.42]} position={[0.82, 0.024, -0.02]} rotation={[0, -0.18, 0]} color="#2f5d62" noShadow />
            <Block size={[0.3, 0.02, 0.42]} position={[1.02, 0.014, 0.08]} rotation={[0, 0.4, 0]} color="#b08d57" noShadow />
          </group>
        </ClueTarget>

        {/* Silla */}
        <group position={[0.1, 0, -1.72]} rotation={[0, 0.25, 0]}>
          <Block size={[0.46, 0.05, 0.46]} position={[0, 0.47, 0]} color={WOOD} />
          <Block size={[0.46, 0.62, 0.05]} position={[0, 0.8, 0.21]} color={WOOD} />
          {[
            [-0.19, -0.19],
            [0.19, -0.19],
            [-0.19, 0.19],
            [0.19, 0.19]
          ].map(([x, z], i) => (
            <Rod key={i} radius={0.028} length={0.46} position={[x, 0.23, z]} color={WOOD_DARK} />
          ))}
        </group>

        {/* --- Retrato de la dama, en su marco dorado --- */}
        <ClueTarget clueId="retrato" still={still}>
          <group position={[0.15, 2.25, -2.96]}>
            <Block size={[0.82, 1.02, 0.07]} color="#c9a227" options={{ emissive: '#8a6a10', glow: 0.45, metal: 0.75, rough: 0.35 }} />
            <Block size={[0.64, 0.84, 0.08]} color="#2a2233" noShadow />
            <Block size={[0.5, 0.7, 0.085]} color="#3b3145" noShadow />
          </group>
        </ClueTarget>

        {/* --- Mesilla y despertador --- */}
        <group position={[1.0, 0, -2.6]}>
          <Block size={[0.52, 0.62, 0.46]} position={[0, 0.31, 0]} color={WOOD} />
          <Block size={[0.56, 0.04, 0.5]} position={[0, 0.63, 0]} color={WOOD_DARK} />
          <Block size={[0.4, 0.16, 0.02]} position={[0, 0.42, 0.235]} color={WOOD_DARK} noShadow />
          <Block size={[0.08, 0.03, 0.03]} position={[0, 0.42, 0.25]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
        </group>
        <ClueTarget clueId="reloj" still={still}>
          <AlarmClock position={[1.0, 0.65, -2.5]} />
        </ClueTarget>

        {/* --- Cama --- */}
        <group position={[2.3, 0, -1.8]}>
          <Block size={[1.55, 1.15, 0.1]} position={[0, 0.72, -1.12]} color={WOOD} />
          <Block size={[1.55, 0.3, 2.2]} position={[0, 0.27, 0]} color={WOOD} />
          <Block size={[1.55, 0.62, 0.08]} position={[0, 0.45, 1.12]} color={WOOD} />
          <Block size={[1.42, 0.2, 2.1]} position={[0, 0.5, 0]} color="#cfc8b8" />
          <Block size={[0.95, 0.14, 0.45]} position={[0, 0.66, -0.75]} rotation={[0, 0.12, 0]} color="#e8e2d4" />
          <Block size={[1.48, 0.12, 1.3]} position={[0.02, 0.64, 0.4]} rotation={[0, 0.04, 0.03]} color="#62788d" />
          {/* Manta revuelta tras el sueño intranquilo */}
          <mesh position={[-0.2, 0.74, 0.1]} scale={[0.55, 0.16, 0.5]} rotation={[0.2, 0.5, 0]} material={mat('#6f8599')} castShadow>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh position={[0.35, 0.72, 0.65]} scale={[0.42, 0.13, 0.4]} rotation={[0, 1.1, 0.2]} material={mat('#6a8096')} castShadow>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          {[-0.74, 0.74].map((x) => (
            <Rod key={x} radius={0.05} length={1.4} position={[x, 0.7, -1.12]} color={WOOD_DARK} />
          ))}
        </group>

        {/* Baúl de viaje a los pies de la cama */}
        <group position={[2.35, 0, -0.2]} rotation={[0, -0.12, 0]}>
          <Block size={[0.85, 0.42, 0.5]} position={[0, 0.21, 0]} color="#6a4a2e" />
          <Block size={[0.06, 0.44, 0.52]} position={[-0.22, 0.21, 0]} color="#2c1e14" noShadow />
          <Block size={[0.06, 0.44, 0.52]} position={[0.22, 0.21, 0]} color="#2c1e14" noShadow />
          <Block size={[0.1, 0.08, 0.03]} position={[0, 0.3, 0.26]} color={BRASS} options={{ metal: 0.8, rough: 0.3 }} noShadow />
        </group>

        {/* --- Marcas holográficas del sistema del cazador --- */}
        <mesh position={[-0.3, 0.05, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.02, 1.05, 48]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <mesh position={[-0.3, 0.052, 0.7]} rotation={[-Math.PI / 2, 0, 0.4]}>
          <ringGeometry args={[0.78, 0.8, 6]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.5} toneMapped={false} />
        </mesh>
        {[
          [4.2, 3.2, 1, 1],
          [4.2, -3.2, 1, -1],
          [-4.2, 3.2, -1, 1]
        ].map(([x, z, sx, sz], i) => (
          <group key={i} position={[x, 0.02, z]}>
            <Block size={[0.6, 0.03, 0.03]} position={[-sx * 0.3, 0, 0]} color="#22d3ee" options={{ emissive: '#22d3ee', glow: 2.2 }} noShadow />
            <Block size={[0.03, 0.03, 0.6]} position={[0, 0, -sz * 0.3]} color="#22d3ee" options={{ emissive: '#22d3ee', glow: 2.2 }} noShadow />
          </group>
        ))}
      </group>

      {/* --- Retratos de los personajes de la escena (imágenes originales) --- */}
      {Object.entries(spots).map(([characterId, spot]) => {
        const character = CHARACTERS[characterId];
        if (!character) return null;
        const isGuide = characterId === 'sung_jinwoo';
        return (
          <PortraitPanel
            key={characterId}
            image={character.avatar}
            height={spot.height}
            position={spot.position}
            rotation={[0, spot.rotationY, 0]}
            color={characterId === 'gregor_monstruo' ? '#a855f7' : '#22d3ee'}
            beam={isGuide}
            still={still}
          />
        );
      })}
    </group>
  );
}

/** Despertador de campanas marcando las 6:30. */
function AlarmClock(props: { position: [number, number, number] }) {
  const brass = { metal: 0.75, rough: 0.35 };
  const hand = (clockAngle: number, length: number, width: number) => {
    const rad = (clockAngle * Math.PI) / 180;
    return (
      <Block
        size={[width, length, 0.012]}
        position={[(Math.sin(rad) * length) / 2, (Math.cos(rad) * length) / 2, 0.062]}
        rotation={[0, 0, -rad]}
        color="#16161d"
        noShadow
      />
    );
  };
  return (
    <group {...props} scale={1.55}>
      <group position={[0, 0.17, 0]}>
        <Rod radius={0.14} length={0.1} rotation={[Math.PI / 2, 0, 0]} color={BRASS} options={brass} />
        <Rod radius={0.115} length={0.104} rotation={[Math.PI / 2, 0, 0]} color="#efe6cf" options={{ emissive: '#efe6cf', glow: 0.35 }} />
        {hand(180, 0.095, 0.014)}
        {hand(195, 0.065, 0.02)}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <Block
              key={angle}
              size={[0.012, 0.022, 0.01]}
              position={[Math.sin(rad) * 0.095, Math.cos(rad) * 0.095, 0.058]}
              rotation={[0, 0, -rad]}
              color="#16161d"
              noShadow
            />
          );
        })}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.085, 0.15, 0]} scale={0.055} material={mat(BRASS, brass)} castShadow>
              <sphereGeometry args={[1, 8, 6]} />
            </mesh>
            <Rod radius={0.012} length={0.1} position={[side * 0.08, -0.15, 0]} rotation={[0, 0, side * 0.3]} color={BRASS} options={brass} />
          </group>
        ))}
        <Rod radius={0.01} length={0.06} position={[0, 0.18, 0]} color={BRASS} options={brass} />
      </group>
    </group>
  );
}
