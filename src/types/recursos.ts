/**
 * Tipos de los contenidos añadidos en la ampliación:
 * cinemáticas narradas, recursos interactivos y recompensas de lectura.
 */

export type Hablante = 'narrador' | 'guia' | 'gregor' | 'padre' | 'madre' | 'grete' | 'apoderado';

/** Una línea del guion: lo que se oye y se lee como subtítulo. */
export interface LineaGuion {
  quien: Hablante;
  texto: string;
}

/** Una escena del guion: lo que se ve mientras suenan sus líneas. */
export interface EscenaGuion {
  titulo: string;
  /** Imagen fija que se muestra (se mueve suavemente mientras dura la escena). */
  imagen: string;
  /** Descripción de lo que se ve en pantalla (para quien produzca el video real). */
  enPantalla: string;
  /** Punto de la imagen hacia el que se acerca la cámara, en % (x, y). */
  foco?: [number, number];
  lineas: LineaGuion[];
}

export interface Cinematica {
  id: string;
  titulo: string;
  /** Nombre del video real en public/assets/videos/. Si existe, sustituye a la narración. */
  video: string;
  escenas: EscenaGuion[];
  /** Pregunta que queda en pantalla al terminar. */
  preguntaFinal?: string;
}

/** Objeto del escenario 3D desde el que se abre un recurso. */
export interface ObjetoEscena {
  /** Nombre visible del objeto ("El libro sobre el baúl"). */
  nombre: string;
  /** Dónde está, explicado con palabras. */
  lugar: string;
  /** Posición del marcador dentro de la habitación 3D. */
  posicion: [number, number, number];
  /** Accesorio que se dibuja (si el objeto no existía ya en la habitación). */
  accesorio?: 'libro' | 'marco';
  giroY?: number;
}

export interface ZonaImagen {
  id: string;
  /** Posición del punto sobre la imagen, en %. */
  x: number;
  y: number;
  titulo: string;
  texto: string;
}

export interface ImagenInteractiva {
  titulo: string;
  imagen: string;
  intro: string;
  nota?: string;
  zonas: ZonaImagen[];
}

export type NivelLectura = 'literal' | 'inferencial' | 'crítica';

export interface PreguntaQuiz {
  nivel: NivelLectura;
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export type Minijuego =
  | { tipo: 'quiz'; titulo: string; instruccion: string; preguntas: PreguntaQuiz[] }
  | {
      tipo: 'citas';
      titulo: string;
      instruccion: string;
      personajes: string[];
      citas: { cita: string; personaje: string; explicacion: string }[];
    }
  | {
      tipo: 'decisiones';
      titulo: string;
      instruccion: string;
      dilemas: { situacion: string; opciones: string[]; enElLibro: number; explicacion: string }[];
    }
  | {
      tipo: 'simbolos';
      titulo: string;
      instruccion: string;
      objetos: { id: string; nombre: string; posicion: [number, number, number] }[];
      retos: { pista: string; objeto: string; explicacion: string }[];
    }
  | { tipo: 'ordenar'; titulo: string; instruccion: string; eventos: string[] };

export interface InvitacionLectura {
  capitulo: string;
  fragmento: string;
  /** Continuación que aparece al pulsar «Leer más». */
  masTexto: string;
  dondeSeguir: string;
  pregunta: string;
}

export type TipoRecurso = 'capsula' | 'imagen' | 'minijuego';

export interface RecursoBase {
  id: string;
  tipo: TipoRecurso;
  titulo: string;
  objeto: ObjetoEscena;
  /** Página del diario de Gregor que se desbloquea al completarlo. */
  diario: { titulo: string; texto: string };
}

export type Recurso =
  | (RecursoBase & { tipo: 'capsula'; capsula: Cinematica })
  | (RecursoBase & { tipo: 'imagen'; imagen: ImagenInteractiva })
  | (RecursoBase & { tipo: 'minijuego'; minijuego: Minijuego });

export interface RecursosMision {
  mision: number;
  sello: string;
  recursos: Recurso[];
  lectura: InvitacionLectura;
}
