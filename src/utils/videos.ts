/**
 * Videos reales disponibles en public/assets/videos/.
 * La lista la escribe vite.config.ts al arrancar o compilar: basta con copiar
 * un archivo a esa carpeta (y reiniciar el juego) para que se use.
 */
declare const __VIDEOS_DISPONIBLES__: string[];

const lista: string[] = typeof __VIDEOS_DISPONIBLES__ !== 'undefined' ? __VIDEOS_DISPONIBLES__ : [];

/** Devuelve la ruta del archivo si existe; si no, null. */
export function rutaVideo(nombre: string): string | null {
  return lista.includes(nombre) ? `/assets/videos/${nombre}` : null;
}

/** Subtítulos .vtt con el mismo nombre que el video, si existen. */
export function rutaSubtitulos(nombre: string): string | null {
  return rutaVideo(nombre.replace(/\.\w+$/, '.vtt'));
}
