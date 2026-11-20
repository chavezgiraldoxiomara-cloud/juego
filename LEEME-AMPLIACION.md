# Ampliación: cinemáticas narradas, recursos interactivos y diario

Esta versión añade contenido de lectura sin cambiar la tecnología del proyecto
(React + TypeScript + Vite + Three.js). Se inicia igual que antes:
`iniciar-juego.bat` o `npm install` y `npm run dev`.

## Qué hay de nuevo

- **Video de introducción** al empezar una aventura nueva (se puede saltar).
- **Cinemática ampliada por misión** (2:20 a 2:45): imagen por escena, voz del
  navegador, subtítulos y botones de pausar, repetir, saltar y cambiar de escena.
- **Exploración de la habitación**: tres objetos por misión abren un video
  complementario, una imagen interactiva y un minijuego de comprensión lectora.
- **Invitación a leer** al terminar cada misión: fragmento, «Leer más» y pregunta.
- **Diario de Gregor**: 15 páginas, 5 sellos y hasta 300 puntos de lectura.

## Dónde se edita cada cosa

| Quiero cambiar…                        | Archivo                         |
| -------------------------------------- | ------------------------------- |
| Guiones de las cinemáticas             | `src/data/cinematicas.ts`       |
| Recursos, minijuegos, lecturas, diario | `src/data/recursos.ts`          |
| Enlace del botón «Abrir el libro»      | `ENLACE_LIBRO` en `recursos.ts` |
| Videos reales y subtítulos             | `public/assets/videos/`         |
| Ilustraciones de escenas y diagramas   | `public/assets/vinetas/`        |

## Cómo poner un video real

Copia el archivo en `public/assets/videos/` con el nombre que indica
`LEEME.txt` de esa carpeta y reinicia el juego. Si el archivo existe, el juego
lo usa; si no, reproduce la cinemática narrada. No hay que tocar código.

## Publicación

`npm run build` genera la carpeta `dist/`. Debe publicarse en la raíz de un
dominio (Netlify, Vercel, Firebase Hosting), porque las rutas de los assets
empiezan por `/assets/`.
