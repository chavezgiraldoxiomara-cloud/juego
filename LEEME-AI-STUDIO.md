# Cómo abrir este juego en Google AI Studio

Este proyecto ya tiene el formato de una app de AI Studio (Vite + React + TypeScript,
con metadata.json). Hay dos formas de cargarlo.

## Opción A (recomendada): desde GitHub
1. Crea un repositorio en GitHub y sube todos estos archivos (los de esta carpeta, no la carpeta).
2. En AI Studio entra a Build, pulsa el ícono "+" del cuadro de texto y elige
   "Import from GitHub". Selecciona el repositorio.

## Opción B: subiendo el ZIP
1. En AI Studio > Build, escribe cualquier cosa (por ejemplo "a") y crea la app.
2. Detén al agente y pídele el mensaje que está en MENSAJE-PARA-EL-AGENTE.txt.
3. Sube el ZIP o los archivos en el explorador de archivos y pulsa guardar.

## Qué NO debe cambiar el agente
- src/data/cinematicas.ts y src/data/recursos.ts: guiones, minijuegos y lecturas.
- vite.config.ts: la función videosDisponibles() permite cambiar las cinemáticas
  narradas por videos reales copiados en public/assets/videos/.
