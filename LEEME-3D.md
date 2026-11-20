# Metamorfosis: El Despertar del Cazador — versión 3D

Versión 3D del juego original. El contenido pedagógico (preguntas, respuestas,
pistas, explicaciones, personajes, XP, rangos e insignias) es el mismo: los
archivos `src/data/dimensions.ts`, `src/data/characters.ts` y
`src/types/game.ts` no se modificaron. La carpeta del juego 2D original queda
intacta al lado de esta.

## Cómo jugar en tu computador

1. Instala [Node.js](https://nodejs.org) (versión LTS) si no lo tienes.
2. Haz doble clic en `iniciar-juego.bat`.
   La primera vez instala las dependencias; después abre el juego en
   `http://localhost:3000`.

Alternativa manual, en una terminal dentro de esta carpeta:

```
npm install
npm run dev
```

Para generar la versión lista para publicar en la web: `npm run build`
(el resultado queda en `dist/`).

## Calidad gráfica

El botón con el cubo (arriba a la derecha, bajo el de sonido) cambia entre
**3D alta**, **3D baja** y **2D**. Si el equipo no admite WebGL, o la escena 3D
falla, el juego pasa solo a la versión 2D clásica. Con «movimiento reducido»
activado en el sistema operativo se desactivan los movimientos de cámara.

## Qué hay en 3D

| Pantalla | En 3D |
|---|---|
| Título | Gran portal sobre islas flotantes |
| Mapa | Cinco portales en arco (bloqueado, activo, completado), insignias y cruce de portal |
| Cinemática | El clip de cada dimensión proyectado en una pantalla dentro de la escena |
| Dimensión 1 | La habitación de Gregor al despertar; las tres pistas se tocan en la escena |
| Dimensión 2 | El umbral: el cuarto en penumbra, la puerta con la llave y el pasillo de la familia |
| Dimensión 3 | La habitación a medio vaciar; los cinco objetos se eligen en la escena |
| Dimensión 4 | El salón y el reguero de manzanas hacia la puerta de Gregor |
| Dimensión 5 | El salón iluminado, el violín, las sillas de los huéspedes y el amanecer |
| Recompensa final | Los portales se encienden, el cofre se abre al tocarlo y aparecen la corona, el libro, las cinco insignias y el video de victoria |

Todas las actividades conservan además su panel y sus listas en pantalla, así
que el juego completo se puede jugar con teclado o lector de pantalla.

## Dónde está cada cosa

- `src/three/` — todo lo 3D, separado de la lógica del juego.
  - `Experience.tsx`: lienzo único y persistente.
  - `store.ts`: puente de estado entre el juego y la escena (la escena solo lee y avisa de clics).
  - `prefs.ts`: modo de render, detección de WebGL, movimiento reducido.
  - `camera/`: director de cámara; encuadra la escena en el hueco `[data-scene-window]` del diseño.
  - `scenes/`: título, mapa y un escenario por dimensión (`dim1` a `dim5`); `shared/` tiene las piezas comunes.
  - `objects/`: portal, isla, cielo, pantalla de video, retratos, marcadores de pistas y objetos, cofre final.
  - `effects/`: bloom, viñeta y tonemapping (solo en calidad alta).
- `src/data/scene3d.ts` — posiciones y colores de la presentación 3D.
- `src/components/` — la interfaz original, con una rama 3D en cada pantalla.
  `MapDock3D.tsx` y `RenderModeToggle.tsx` son nuevos.

Las partidas guardadas usan la misma clave (`METAMORFOSIS_SAVE_DATA_V2`) y el
mismo formato que la versión 2D.
