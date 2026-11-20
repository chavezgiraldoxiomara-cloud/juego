import { lazy, Suspense } from 'react';
import { DIMENSIONS } from '../../data/dimensions';
import { useScene } from '../store';
import { FeedbackFx } from '../objects/FeedbackFx';
import { Puntos3D } from '../objects/Puntos3D';

// Cada escenario se descarga solo al entrar en su dimensión.
const ROOMS: Record<number, React.LazyExoticComponent<React.ComponentType<{ still: boolean; shadows: boolean }>>> = {
  1: lazy(() => import('./dim1/Dim1Room')),
  2: lazy(() => import('./dim2/Dim2Room')),
  3: lazy(() => import('./dim3/Dim3Room')),
  4: lazy(() => import('./dim4/Dim4Room')),
  5: lazy(() => import('./dim5/Dim5Room'))
};

interface DimSceneProps {
  still: boolean;
  shadows: boolean;
}

/** Escena de una dimensión: su escenario, la pantalla de la cinemática y los efectos de respuesta. */
export default function DimScene({ still, shadows }: DimSceneProps) {
  const dimensionId = useScene((s) => s.dimensionId);
  const mode = useScene((s) => s.dimensionMode);
  const dimension = DIMENSIONS.find((d) => d.id === dimensionId);
  if (!dimension) return null;
  const Room = ROOMS[dimension.id];

  return (
    <group>
      <Suspense fallback={null}>
        {Room && <Room still={still} shadows={shadows} />}
      </Suspense>
      {/* Ampliación: la cinemática se reproduce ahora en la interfaz (CinematicPlayer),
          así que la pantalla holográfica ya no se dibuja aquí. */}
      {/* Ampliación: objetos que abren recursos durante la exploración */}
      {mode === 'explore' && <Puntos3D still={still} />}
      <FeedbackFx still={still} />
    </group>
  );
}
