import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { isUiEvent, useScene, type Punto3D } from '../store';

/**
 * Ampliación: puntos interactivos de la habitación durante la exploración.
 * Cada punto es un objeto del escenario (un libro, un cuadro, la ventana…)
 * que al tocarse abre un recurso. La lista llega desde la interfaz a través
 * del estado compartido; aquí solo se dibuja y se avisa del toque.
 */
export function Puntos3D({ still }: { still: boolean }) {
  const puntos = useScene((s) => s.puntos3d);
  return (
    // Mismo desplazamiento vertical que usan las habitaciones.
    <group position={[0, 0.2, 0]}>
      {puntos.map((punto) => (
        <Punto key={punto.id} punto={punto} still={still} />
      ))}
    </group>
  );
}

function Punto({ punto, still }: { punto: Punto3D; still: boolean }) {
  const [encima, setEncima] = useState(false);
  const marcador = useRef<THREE.Group>(null);
  const color = punto.hecho ? '#34d399' : '#fbbf24';

  useFrame(({ clock }, delta) => {
    if (!marcador.current || still) return;
    marcador.current.rotation.y += delta * 1.6;
    marcador.current.position.y = 0.5 + Math.sin(clock.elapsedTime * 2.2 + punto.posicion[0]) * 0.06;
  });

  const tocar = (event: ThreeEvent<MouseEvent>) => {
    if (isUiEvent(event.nativeEvent) || event.delta > 8) return;
    event.stopPropagation();
    useScene.getState().handlers.onPunto?.(punto.id);
  };
  const entrar = (event: ThreeEvent<PointerEvent>) => {
    if (isUiEvent(event.nativeEvent)) return;
    event.stopPropagation();
    setEncima(true);
    document.body.style.cursor = 'pointer';
  };
  const salir = () => {
    setEncima(false);
    document.body.style.cursor = '';
  };

  return (
    <group position={punto.posicion}>
      {/* Accesorios sencillos para los objetos que no existían en la habitación */}
      {punto.accesorio === 'libro' && (
        <group rotation={[0, punto.giroY ?? 0, 0]}>
          <mesh position={[0, 0.045, 0]}>
            <boxGeometry args={[0.46, 0.09, 0.34]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.7} />
          </mesh>
          <mesh position={[0.012, 0.045, 0]}>
            <boxGeometry args={[0.44, 0.065, 0.3]} />
            <meshStandardMaterial color="#efe3c6" roughness={0.9} />
          </mesh>
        </group>
      )}
      {punto.accesorio === 'marco' && (
        <group>
          <mesh>
            <boxGeometry args={[0.62, 0.48, 0.05]} />
            <meshStandardMaterial color="#b98a3c" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.5, 0.36]} />
            <meshStandardMaterial color="#d8cdb4" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Zona de toque amplia, pensada también para pantallas táctiles */}
      <mesh position={[0, 0.25, 0]} onClick={tocar} onPointerOver={entrar} onPointerOut={salir}>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={marcador} position={[0, 0.5, 0]} scale={encima ? 1.35 : 1}>
        <mesh scale={[0.14, 0.22, 0.14]}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
      <pointLight color={color} intensity={encima ? 2.4 : 1.0} distance={2.4} position={[0, 0.8, 0.5]} />
      {(encima || punto.hecho) && (
        <Html position={[0, 0.95, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`w-max max-w-[180px] px-2.5 py-1 rounded-lg border bg-slate-950/90 text-center text-[11px] font-rajdhani font-bold leading-tight ${
              punto.hecho ? 'border-emerald-400/70 text-emerald-200' : 'border-amber-400/70 text-amber-100'
            }`}
          >
            {punto.etiqueta}
          </div>
        </Html>
      )}
    </group>
  );
}
