import type { RecursosMision } from '../types/recursos';

/**
 * RECURSOS INTERACTIVOS DE CADA MISIÓN
 *
 * Cada misión tiene tres recursos que se abren desde un objeto de su habitación 3D:
 *   1. una cápsula (video complementario narrado),
 *   2. una imagen interactiva con zonas para tocar,
 *   3. un minijuego de comprensión lectora.
 * Al terminar la misión aparece además una invitación a leer el libro.
 *
 * Las citas y fragmentos son traducción propia del original alemán de 1915
 * (dominio público). Las páginas del «diario de Gregor» NO son texto de Kafka:
 * son una recreación escrita para el juego a partir de la novela.
 *
 * Si quieres que el botón «Seguir leyendo» abra una edición en línea, escribe
 * su dirección en ENLACE_LIBRO. Vacío = el botón no aparece.
 */
export const ENLACE_LIBRO = '';

const V = '/assets/vinetas/';

export const RECURSOS: Record<number, RecursosMision> = {
  // ───────────────────────────── MISIÓN 1 ─────────────────────────────
  1: {
    mision: 1,
    sello: 'Sello del Testigo',
    recursos: [
      {
        id: 'm1_capsula',
        tipo: 'capsula',
        titulo: 'Franz Kafka: escribir de noche',
        objeto: {
          nombre: 'El libro sobre el baúl',
          lugar: 'Sobre el baúl de viaje, a los pies de la cama',
          posicion: [2.35, 0.5, -0.2],
          accesorio: 'libro',
          giroY: 0.4
        },
        diario: {
          titulo: 'Lo que pensé primero',
          texto: 'Lo primero que pensé no fue «¿qué soy?». Fue «el tren». Me da vergüenza escribirlo. Tengo patas que no conozco y solo calculo cuánto se enfadará el jefe.'
        },
        capsula: {
          id: 'cap_kafka',
          titulo: 'Franz Kafka: escribir de noche',
          video: 'capsula_kafka.mp4',
          preguntaFinal: 'Un empleado que escribe de noche sobre un empleado que no puede ir a trabajar. ¿Casualidad?',
          escenas: [
            {
              titulo: 'Praga, 1883',
              imagen: V + 'praga.svg',
              enPantalla: 'Silueta de Praga de noche: torres, puente y río.',
              foco: [50, 50],
              lineas: [
                { quien: 'narrador', texto: 'Franz Kafka nació en Praga en 1883, en una familia judía de lengua alemana.' },
                { quien: 'narrador', texto: 'Estudió Derecho y trabajó casi toda su vida en una compañía de seguros de accidentes de trabajo.' }
              ]
            },
            {
              titulo: 'Dos vidas',
              imagen: V + 'escritorio_noche.svg',
              enPantalla: 'Un escritorio con lámpara encendida; una figura escribe de espaldas.',
              foco: [60, 50],
              lineas: [
                { quien: 'narrador', texto: 'De día, oficina. De noche, escritura. Así vivió.' },
                { quien: 'narrador', texto: 'Escribió La metamorfosis en unas tres semanas, a finales de 1912. Se publicó en 1915.' }
              ]
            },
            {
              titulo: 'Lo que no se quemó',
              imagen: V + 'carta.svg',
              enPantalla: 'Una hoja manuscrita y una pluma.',
              foco: [50, 45],
              lineas: [
                { quien: 'narrador', texto: 'Publicó poco. Le pidió a su amigo Max Brod que quemara sus manuscritos cuando muriera.' },
                { quien: 'narrador', texto: 'Kafka murió en 1924, a los cuarenta años. Brod no le hizo caso, y por eso hoy podemos leerlo.' }
              ]
            }
          ]
        }
      },
      {
        id: 'm1_imagen',
        tipo: 'imagen',
        titulo: 'Árbol de personajes',
        objeto: {
          nombre: 'La fotografía de familia',
          lugar: 'En la pared del fondo, entre la ventana y el retrato',
          posicion: [-0.7, 2.15, -2.94],
          accesorio: 'marco'
        },
        diario: {
          titulo: 'Los que dependen de mí',
          texto: 'Papá, mamá, Grete. Cinco años llevando el dinero a casa. Al principio lo recibían con asombro; después se acostumbraron. Yo también. Solo Grete sigue siendo cercana.'
        },
        imagen: {
          titulo: 'La familia Samsa y quienes la rodean',
          imagen: V + 'arbol_personajes.svg',
          intro: 'Toca cada punto para saber quién es quién y qué relación tiene con Gregor al empezar la historia.',
          zonas: [
            { id: 'gregor', x: 30, y: 52, titulo: 'Gregor Samsa', texto: 'Viajante de comercio. Desde hace cinco años es el único sueldo de la casa. Detesta su trabajo, pero lo conserva para pagar la deuda de sus padres.' },
            { id: 'padre', x: 25, y: 29, titulo: 'El padre', texto: 'Su negocio quebró hace cinco años. Desde entonces no trabaja: desayuna durante horas leyendo periódicos. Es el primero en reaccionar con dureza.' },
            { id: 'madre', x: 75, y: 29, titulo: 'La madre', texto: 'Padece asma. Quiere a su hijo y lo defiende, pero no soporta verlo: se desmaya cada vez que lo tiene delante.' },
            { id: 'grete', x: 70, y: 52, titulo: 'Grete', texto: 'Tiene diecisiete años y toca el violín. Es la más cercana a Gregor: él quiere pagarle el conservatorio. Fíjate en cómo cambia a lo largo del libro.' },
            { id: 'apoderado', x: 16, y: 82, titulo: 'El apoderado y el jefe', texto: 'Representan la empresa. El apoderado aparece en casa a la primera hora de retraso: para ellos Gregor vale lo que produce.' },
            { id: 'criadas', x: 50, y: 82, titulo: 'Las criadas', texto: 'La cocinera pide irse el primer día. Anna, la criada, se queda un tiempo encerrada en la cocina. Al final solo viene una asistenta mayor, la única que no le teme.' },
            { id: 'huespedes', x: 84, y: 82, titulo: 'Los tres huéspedes', texto: 'Llegan en la tercera parte: tres señores con barba a quienes la familia alquila una habitación. Mandan en la casa… hasta que el señor Samsa los echa.' }
          ]
        }
      },
      {
        id: 'm1_juego',
        tipo: 'minijuego',
        titulo: 'Tres maneras de leer',
        objeto: {
          nombre: 'El despertador',
          lugar: 'Sobre la mesita, junto a la cama',
          posicion: [1.0, 1.05, -2.5]
        },
        diario: {
          titulo: 'Seis y media',
          texto: 'Puse el despertador a las cuatro. Sonó, estoy seguro. ¿Cómo pude seguir durmiendo con ese ruido que hace temblar los muebles? Nunca he faltado. Ni un solo día en cinco años.'
        },
        minijuego: {
          tipo: 'quiz',
          titulo: 'Tres maneras de leer',
          instruccion: 'Seis preguntas sobre el comienzo del libro. Dos se responden con lo que el texto dice, dos con lo que deja entender y dos con tu propio juicio.',
          preguntas: [
            {
              nivel: 'literal',
              pregunta: '¿Qué hora marca el despertador cuando Gregor lo mira?',
              opciones: ['Las cuatro en punto', 'Las cinco', 'Las seis y media', 'Las ocho'],
              correcta: 2,
              explicacion: 'Las seis y media. Lo había puesto a las cuatro para tomar el tren de las cinco.'
            },
            {
              nivel: 'literal',
              pregunta: '¿Qué imagen cuelga en la pared de su cuarto?',
              opciones: ['Una foto de su familia', 'Una dama con sombrero y pieles, recortada de una revista', 'Un paisaje de Praga', 'Su diploma de comercio'],
              correcta: 1,
              explicacion: 'El retrato de una dama con pieles que él mismo recortó y enmarcó. Volverá a ser importante en la misión 3.'
            },
            {
              nivel: 'inferencial',
              pregunta: 'Gregor acaba de transformarse y piensa sobre todo en el tren y en su jefe. ¿Qué deja entender eso?',
              opciones: ['Que no se ha dado cuenta del cambio', 'Que el trabajo ocupa su vida hasta el punto de taparlo todo', 'Que le encanta su profesión', 'Que está soñando'],
              correcta: 1,
              explicacion: 'El texto aclara que no es un sueño y que odia su empleo. Si aun así solo piensa en él, es porque su vida entera gira alrededor de esa obligación.'
            },
            {
              nivel: 'inferencial',
              pregunta: '¿Por qué no deja un trabajo que detesta?',
              opciones: ['Porque gana una fortuna', 'Porque sus padres le deben dinero al jefe y él paga la deuda', 'Porque su padre se lo prohíbe', 'Porque sueña con ser apoderado'],
              correcta: 1,
              explicacion: 'Lo dice él mismo: cuando reúna el dinero de la deuda, en cinco o seis años, le dirá al jefe lo que piensa y se irá.'
            },
            {
              nivel: 'crítica',
              pregunta: 'Kafka nunca explica por qué Gregor se transforma. ¿Qué efecto tiene esa decisión en el lector?',
              opciones: ['Ninguno: es un descuido del autor', 'Obliga a fijarse en cómo reaccionan todos, y no en la causa', 'Hace que el libro sea de ciencia ficción', 'Demuestra que Gregor es culpable de algo'],
              correcta: 1,
              explicacion: 'Sin causa que discutir, toda la atención se va a las reacciones: las de Gregor, las de su familia y las tuyas.'
            },
            {
              nivel: 'crítica',
              pregunta: '¿Cuál de estas situaciones actuales se parece más a la de Gregor en su primera mañana?',
              opciones: ['Alguien que gana la lotería', 'Alguien enfermo que solo piensa en que no puede faltar al trabajo', 'Alguien que se muda de ciudad', 'Alguien que estrena teléfono'],
              correcta: 1,
              explicacion: 'Por eso el libro sigue vigente: habla de personas que se miden a sí mismas por lo que rinden.'
            }
          ]
        }
      }
    ],
    lectura: {
      capitulo: 'Parte I · primeras páginas',
      fragmento: '«¿Qué me ha pasado?», pensó. No era un sueño. Su habitación, una auténtica habitación humana, solo que algo pequeña, seguía tranquila entre las cuatro paredes de siempre.',
      masTexto: 'Sobre la mesa, en la que estaba desplegado un muestrario de telas —Samsa era viajante—, colgaba el cuadro que hacía poco había recortado de una revista ilustrada y colocado en un bonito marco dorado. Representaba a una dama con sombrero y boa de piel, sentada muy erguida, que alzaba hacia el espectador un pesado manguito de piel en el que desaparecía todo su antebrazo.',
      dondeSeguir: 'Abre tu libro por la primera página y lee hasta que llaman a la puerta.',
      pregunta: 'En esas páginas Gregor mira el reloj varias veces. Cuéntalas. ¿Qué le importa más: su cuerpo o la hora?'
    }
  },

  // ───────────────────────────── MISIÓN 2 ─────────────────────────────
  2: {
    mision: 2,
    sello: 'Sello del Umbral',
    recursos: [
      {
        id: 'm2_capsula',
        tipo: 'capsula',
        titulo: 'Praga, 1912: la ciudad detrás de la puerta',
        objeto: {
          nombre: 'La ventana del cuarto',
          lugar: 'En la pared del fondo del cuarto de Gregor',
          posicion: [-2.2, 1.75, -2.7]
        },
        diario: {
          titulo: 'El apoderado en mi casa',
          texto: 'Una hora de retraso y ya mandaron al apoderado. ¿Somos todos unos sinvergüenzas para la empresa? Hablé mucho, hablé bien. Del otro lado dijeron que era una voz de animal.'
        },
        capsula: {
          id: 'cap_praga',
          titulo: 'Praga, 1912: la ciudad detrás de la puerta',
          video: 'capsula_praga.mp4',
          preguntaFinal: 'En un mundo así, ¿cuánto valía una persona cuando dejaba de producir?',
          escenas: [
            {
              titulo: 'Una ciudad del Imperio',
              imagen: V + 'praga.svg',
              enPantalla: 'Silueta de Praga y el río.',
              foco: [45, 50],
              lineas: [
                { quien: 'narrador', texto: 'En 1912 Praga pertenecía al Imperio austrohúngaro.' },
                { quien: 'narrador', texto: 'En sus calles convivían, no siempre en paz, checos, alemanes y judíos.' }
              ]
            },
            {
              titulo: 'Trenes y horarios',
              imagen: V + 'viajante.svg',
              enPantalla: 'Estación, tren y un viajante con su maleta de muestras.',
              foco: [70, 55],
              lineas: [
                { quien: 'narrador', texto: 'Era una ciudad de oficinas, bancos y comercios.' },
                { quien: 'narrador', texto: 'Un viajante como Gregor vivía entre trenes, horarios y hoteles, con comidas malas y sin amistades duraderas. Así lo cuenta él.' }
              ]
            },
            {
              titulo: 'Un solo sueldo',
              imagen: V + 'tres_puertas.svg',
              enPantalla: 'Interior de un apartamento: puertas cerradas y luz bajo ellas.',
              foco: [50, 60],
              lineas: [
                { quien: 'narrador', texto: 'Una familia de clase media vivía en un apartamento alquilado, con criada, y a menudo dependía de un solo sueldo.' },
                { quien: 'narrador', texto: 'Si alguien enfermaba, lo visitaba el médico del seguro. Gregor dice que para ese médico solo existe gente sana que no quiere trabajar.' }
              ]
            }
          ]
        }
      },
      {
        id: 'm2_imagen',
        tipo: 'imagen',
        titulo: 'Plano de la casa de los Samsa',
        objeto: {
          nombre: 'El papel de la mesita',
          lugar: 'Sobre la mesita del pasillo, a la izquierda',
          posicion: [-3.45, 1.0, 0.9]
        },
        diario: {
          titulo: 'Tres puertas',
          texto: 'Mi cuarto tiene tres puertas y por las tres me llamaron. Las cierro con llave cada noche: costumbre de hotel. Hoy esa costumbre me pareció, por un momento, una suerte.'
        },
        imagen: {
          titulo: 'La casa de los Samsa',
          imagen: V + 'plano_casa.svg',
          intro: 'El cuarto de Gregor está en el centro de la casa, rodeado por todos. Toca cada estancia para ver qué ocurre en ella.',
          nota: 'Kafka no da un plano: esta es una reconstrucción a partir de las pistas del texto, y los lectores no se ponen de acuerdo en los detalles. Compruébala mientras lees.',
          zonas: [
            { id: 'cuarto', x: 51.5, y: 22, titulo: 'El cuarto de Gregor', texto: 'Tres puertas y una ventana a la calle. Empieza siendo un dormitorio, luego una celda y al final un trastero.' },
            { id: 'sala', x: 22.5, y: 22, titulo: 'La sala de estar', texto: 'Aquí desayuna el padre, aquí espera el apoderado, aquí vuelan las manzanas y suena el violín. Cada vez que Gregor entra en ella, lo expulsan.' },
            { id: 'grete', x: 79, y: 22, titulo: 'El cuarto de Grete', texto: 'Desde aquí le habla en voz baja la primera mañana. Más adelante lo cederá a los huéspedes y dormirá en la sala.' },
            { id: 'vestibulo', x: 51.5, y: 63, titulo: 'El vestíbulo y la escalera', texto: 'Por aquí huye el apoderado. Es la salida al mundo: Gregor no volverá a cruzarla.' },
            { id: 'padres', x: 22.5, y: 63, titulo: 'El dormitorio de los padres', texto: 'De aquí salen los señores Samsa la última mañana, cuando la asistenta les anuncia lo ocurrido.' },
            { id: 'cocina', x: 79, y: 63, titulo: 'La cocina', texto: 'Territorio de las criadas. Cuando hay huéspedes, la familia come aquí y les deja la sala a ellos.' }
          ]
        }
      },
      {
        id: 'm2_juego',
        tipo: 'minijuego',
        titulo: '¿Quién lo dice?',
        objeto: {
          nombre: 'La puerta con la llave',
          lugar: 'En el centro, entre el pasillo y el cuarto',
          posicion: [0, 1.75, -0.3]
        },
        diario: {
          titulo: 'La llave',
          texto: 'Giré la llave con la boca. Dolió. Creí que me animaban: «¡Ánimo, Gregor!». Nadie lo dijo. Abrí yo solo, y cuando me vieron, la única que dio un paso hacia mí se cayó al suelo.'
        },
        minijuego: {
          tipo: 'citas',
          titulo: '¿Quién lo dice?',
          instruccion: 'Lee cada frase del libro y elige al personaje que la pronuncia o la piensa.',
          personajes: ['Gregor', 'La madre', 'El padre', 'Grete', 'El apoderado'],
          citas: [
            { cita: '«Gregor, son las siete menos cuarto. ¿No ibas a salir de viaje?»', personaje: 'La madre', explicacion: 'Es la primera voz que oye, suave, desde la puerta. Su preocupación es sincera… y también habla del tren.' },
            { cita: '«¡Qué profesión tan agotadora he elegido!»', personaje: 'Gregor', explicacion: 'Lo piensa en la cama, antes de preocuparse por su cuerpo.' },
            { cita: '«Gregor, ¿no estás bien? ¿Necesitas algo?»', personaje: 'Grete', explicacion: 'Es la única que pregunta por él y no por el trabajo.' },
            { cita: '«Era una voz de animal.»', personaje: 'El apoderado', explicacion: 'Con esa frase, dicha a los padres, Gregor deja de ser para la empresa un empleado.' },
            { cita: '«¡Anna! ¡Anna! ¡Trae enseguida un cerrajero!»', personaje: 'El padre', explicacion: 'El padre da órdenes; la madre, a la vez, envía a Grete por el médico.' },
            { cita: '«Su posición no es, ni mucho menos, la más segura.»', personaje: 'El apoderado', explicacion: 'Una amenaza de despido dicha delante de la familia, tras cinco años sin faltar un día.' }
          ]
        }
      }
    ],
    lectura: {
      capitulo: 'Parte I · final',
      fragmento: 'Entonces el padre le dio por detrás un empujón fuerte, ahora de veras liberador, y Gregor voló, sangrando con abundancia, hasta bien dentro de su cuarto. La puerta se cerró de golpe con el bastón; luego, por fin, se hizo el silencio.',
      masTexto: 'Unas líneas antes, el narrador cuenta: ninguna súplica de Gregor sirvió; ninguna fue siquiera entendida. Por más humildemente que girara la cabeza, el padre solo pisoteaba el suelo con más fuerza.',
      dondeSeguir: 'Lee las tres últimas páginas de la primera parte, desde que la puerta se abre.',
      pregunta: 'En toda esa escena el padre no dice una sola palabra: solo sisea. ¿Por qué crees que Kafka lo dejó sin voz justo ahí?'
    }
  },

  // ───────────────────────────── MISIÓN 3 ─────────────────────────────
  3: {
    mision: 3,
    sello: 'Sello de la Memoria',
    recursos: [
      {
        id: 'm3_capsula',
        tipo: 'capsula',
        titulo: 'Los objetos hablan: símbolos de la novela',
        objeto: {
          nombre: 'El retrato de la dama con pieles',
          lugar: 'En la pared del fondo',
          posicion: [0.15, 2.7, -2.8]
        },
        diario: {
          titulo: 'El cuadro',
          texto: 'Lo recorté de una revista y le hice un marco con la sierra de calar. Es lo único de este cuarto que elegí porque me gustaba. Que se lleven lo demás. Esto no.'
        },
        capsula: {
          id: 'cap_simbolos',
          titulo: 'Los objetos hablan: símbolos de la novela',
          video: 'capsula_simbolos.mp4',
          preguntaFinal: 'Si vaciaran tu cuarto, ¿qué objeto cubrirías con el cuerpo?',
          escenas: [
            {
              titulo: 'El retrato y los muebles',
              imagen: V + 'habitacion_simbolos.svg',
              enPantalla: 'El cuarto de Gregor: ventana, retrato, escritorio, canapé con sábana, cuenco y puerta.',
              foco: [48, 35],
              lineas: [
                { quien: 'narrador', texto: 'En este libro los objetos hablan. El retrato de la dama con pieles es lo único que Gregor eligió por gusto: lo defiende con el cuerpo.' },
                { quien: 'narrador', texto: 'Los muebles son su memoria. Sin ellos gana espacio para moverse, y pierde su pasado.' }
              ]
            },
            {
              titulo: 'La comida y la puerta',
              imagen: V + 'habitacion_simbolos.svg',
              enPantalla: 'Acercamiento al cuenco de leche y después a la puerta.',
              foco: [20, 80],
              lineas: [
                { quien: 'narrador', texto: 'La comida: lo que antes le gustaba ahora le repugna. Su gusto cambia antes que su mente.' },
                { quien: 'narrador', texto: 'La puerta: cerrada, entreabierta o con la llave por fuera, mide cuánto lo acepta la familia en cada momento.' }
              ]
            },
            {
              titulo: 'Lo que no se dibuja',
              imagen: V + 'puerta_entreabierta.svg',
              enPantalla: 'La familia vista desde la oscuridad. A Gregor no se le ve.',
              foco: [50, 50],
              lineas: [
                { quien: 'narrador', texto: 'Cuando el libro iba a publicarse, Kafka pidió al editor que en la portada no se dibujara al insecto, ni siquiera de lejos.' },
                { quien: 'narrador', texto: 'La palabra alemana que usa significa algo así como bicho o alimaña: un ser impreciso y despreciado. Cada lector tiene que imaginarlo.' }
              ]
            }
          ]
        }
      },
      {
        id: 'm3_imagen',
        tipo: 'imagen',
        titulo: 'La habitación de Gregor, objeto por objeto',
        objeto: {
          nombre: 'El cuaderno del escritorio',
          lugar: 'Sobre el escritorio que están sacando, a la izquierda',
          posicion: [-2.35, 0.98, -0.55],
          accesorio: 'libro',
          giroY: -0.3
        },
        diario: {
          titulo: 'El escritorio',
          texto: 'En ese escritorio hice los deberes de la escuela, del instituto, de la academia de comercio. Se lo llevan entre las dos, jadeando. Nadie me pregunta. No podrían entender la respuesta.'
        },
        imagen: {
          titulo: 'La habitación de Gregor',
          imagen: V + 'habitacion_simbolos.svg',
          intro: 'Toca cada objeto para leer qué papel cumple en la segunda parte del libro.',
          zonas: [
            { id: 'ventana', x: 17.5, y: 34, titulo: 'La ventana', texto: 'Se apoya en ella durante horas, recordando la libertad que sentía al mirar fuera. Pero su vista se nubla: ya no distingue el hospital de enfrente.' },
            { id: 'retrato', x: 48.5, y: 27, titulo: 'El retrato', texto: 'Recortado de una revista y enmarcado por él. Cuando vacían el cuarto, se pega al cristal para que no se lo quiten: defiende su último gusto humano.' },
            { id: 'escritorio', x: 48, y: 56, titulo: 'El escritorio', texto: 'Aquí hizo sus tareas desde niño. Cuando se lo llevan, Gregor comprende que le están quitando su historia.' },
            { id: 'canape', x: 81.5, y: 62, titulo: 'El canapé y la sábana', texto: 'Se esconde debajo para que Grete no tenga que verlo, y él mismo arrastra una sábana para taparse del todo. Tarda cuatro horas.' },
            { id: 'cuenco', x: 20, y: 83, titulo: 'El cuenco de leche', texto: 'Era su bebida favorita. Ahora la rechaza con asco y prefiere restos pasados. Grete lo descubre sin que él pueda decírselo.' },
            { id: 'puerta', x: 88, y: 32, titulo: 'La puerta', texto: 'Antes la cerraba él por dentro; ahora la llave está por fuera. Detrás de ella escucha todo lo que la familia dice sobre el dinero y sobre él.' }
          ]
        }
      },
      {
        id: 'm3_juego',
        tipo: 'minijuego',
        titulo: '¿Qué harías tú? ¿Qué pasa en el libro?',
        objeto: {
          nombre: 'El canapé con la sábana',
          lugar: 'En el rincón del fondo, a la derecha',
          posicion: [2.3, 1.05, -2.1]
        },
        diario: {
          titulo: 'Debajo del canapé',
          texto: 'Cargué la sábana sobre el lomo durante cuatro horas para que ella no tuviera que verme. Cuando entró y la vio, me pareció sorprender en sus ojos una mirada de gratitud.'
        },
        minijuego: {
          tipo: 'decisiones',
          titulo: '¿Qué harías tú? ¿Qué pasa en el libro?',
          instruccion: 'Ponte en el lugar de cada personaje, elige, y luego compara tu decisión con la del libro. Aquí no hay respuestas incorrectas: importa que puedas explicar la tuya.',
          dilemas: [
            {
              situacion: 'Eres Grete. Le dejaste a tu hermano su leche favorita y por la mañana el cuenco sigue lleno.',
              opciones: ['Insistir con la leche hasta que la tome', 'Llevarle comidas distintas para ver cuál elige', 'Dejar de llevarle comida', 'Avisar a tus padres y que decidan ellos'],
              enElLibro: 1,
              explicacion: 'Grete le lleva un surtido —verduras, huesos, queso, pan— y se retira para que coma tranquilo. Es el gesto más atento que alguien tiene con Gregor en todo el libro.'
            },
            {
              situacion: 'Eres Gregor. Tu hermana entra cada día a limpiar y notas que le cuesta mirarte.',
              opciones: ['Quedarte a la vista para que se acostumbre', 'Esconderte y taparte con una sábana', 'Intentar hablarle', 'Salir del cuarto para no molestar'],
              enElLibro: 1,
              explicacion: 'Se esconde bajo el canapé y se cubre con una sábana. Renuncia a ser visto para no hacerla sufrir.'
            },
            {
              situacion: 'Eres la madre. Tu hija quiere sacar todos los muebles para que Gregor tenga sitio donde trepar.',
              opciones: ['Aceptar: lo importante es su comodidad', 'Dejarlo todo como estaba, para cuando vuelva a ser él', 'Preguntarle a Gregor', 'Sacar solo la mitad'],
              enElLibro: 1,
              explicacion: 'La madre teme que vaciar el cuarto sea como renunciar a que mejore. Grete se impone y sacan los muebles. Gregor, al oírlas, se da cuenta de que su madre tiene razón.'
            },
            {
              situacion: 'Eres Gregor. Se están llevando tus cosas y solo puedes salvar una.',
              opciones: ['El escritorio de tus estudios', 'El retrato de la dama con pieles', 'La cómoda con tus herramientas', 'Ninguna: dejas que se lo lleven todo'],
              enElLibro: 1,
              explicacion: 'Trepa a la pared y cubre el retrato. No es lo más útil ni lo más valioso: es lo único que eligió porque le gustaba.'
            }
          ]
        }
      }
    ],
    lectura: {
      capitulo: 'Parte II · el vaciado del cuarto',
      fragmento: '¿De verdad quería que convirtieran su cálida habitación, cómodamente amueblada con muebles heredados, en una cueva por la que podría arrastrarse sin estorbo en todas direcciones, pero a costa de olvidar a la vez, rápida y totalmente, su pasado humano?',
      masTexto: 'Nada debía salir de allí; todo tenía que quedarse. No podía prescindir de la buena influencia de los muebles sobre su estado; y si los muebles le impedían arrastrarse sin sentido de un lado a otro, eso no era un perjuicio, sino una gran ventaja.',
      dondeSeguir: 'Busca en la segunda parte la conversación entre la madre y Grete dentro del cuarto, y sigue hasta que el padre vuelve a casa.',
      pregunta: 'Grete cree que ayuda a su hermano vaciando el cuarto. ¿Lo hace por él o también por ella? Busca en el texto una frase que apoye tu respuesta.'
    }
  },

  // ───────────────────────────── MISIÓN 4 ─────────────────────────────
  4: {
    mision: 4,
    sello: 'Sello de la Herida',
    recursos: [
      {
        id: 'm4_capsula',
        tipo: 'capsula',
        titulo: 'Carta al padre: Kafka y la autoridad',
        objeto: {
          nombre: 'El libro de la mesa familiar',
          lugar: 'Sobre la mesa de la sala, a la derecha',
          posicion: [2.4, 0.92, -1.2],
          accesorio: 'libro',
          giroY: 0.6
        },
        diario: {
          titulo: 'El uniforme',
          texto: '¿Este es mi padre? El que yo recordaba se hundía en el sillón. Este lleva botones dorados y me mira desde arriba. Sus botas son enormes. Supe enseguida que conmigo solo valdría la máxima severidad.'
        },
        capsula: {
          id: 'cap_padre',
          titulo: 'Carta al padre: Kafka y la autoridad',
          video: 'capsula_padre.mp4',
          preguntaFinal: '¿Puede alguien sentirse culpable sin haber hecho nada malo? ¿Le pasa eso a Gregor?',
          escenas: [
            {
              titulo: 'Una carta sin entregar',
              imagen: V + 'carta.svg',
              enPantalla: 'Una carta manuscrita que empieza «Querido padre».',
              foco: [50, 40],
              lineas: [
                { quien: 'narrador', texto: 'En 1919, siete años después de escribir La metamorfosis, Kafka redactó una carta de unas cien páginas para su padre, Hermann.' },
                { quien: 'narrador', texto: 'Hermann era un comerciante fuerte y autoritario. Franz escribe que ante él siempre se sintió pequeño y culpable. Nunca le entregó la carta.' }
              ]
            },
            {
              titulo: 'El que sube y el que baja',
              imagen: V + 'uniforme.svg',
              enPantalla: 'El uniforme del padre con sus botones dorados.',
              foco: [50, 30],
              lineas: [
                { quien: 'narrador', texto: 'En la novela, el padre recupera la fuerza justo cuando el hijo la pierde.' },
                { quien: 'narrador', texto: 'El uniforme, que no se quita ni para dormir, es la señal de esa autoridad recobrada.' }
              ]
            },
            {
              titulo: 'Cuidado con leerlo como un diario',
              imagen: V + 'manzana.svg',
              enPantalla: 'Las manzanas en el suelo.',
              foco: [55, 58],
              lineas: [
                { quien: 'narrador', texto: 'No conviene leer La metamorfosis como una autobiografía: Gregor no es Kafka.' },
                { quien: 'narrador', texto: 'Pero la carta ayuda a entender por qué la autoridad, la culpa y el castigo aparecen una y otra vez en sus libros.' }
              ]
            }
          ]
        }
      },
      {
        id: 'm4_imagen',
        tipo: 'imagen',
        titulo: 'El cambio de papeles',
        objeto: {
          nombre: 'La fotografía de la pared',
          lugar: 'En la pared del fondo de la sala, entre la puerta y la ventana',
          posicion: [0, 2.2, -2.94],
          accesorio: 'marco'
        },
        diario: {
          titulo: 'La foto de teniente',
          texto: 'En la pared de la sala cuelga mi foto del servicio militar: teniente, la mano en la espada, sonriendo. Entonces el uniforme lo llevaba yo, y exigía respeto. Ahora lo lleva él.'
        },
        imagen: {
          titulo: 'Antes y después: ¿quién sostiene la casa?',
          imagen: V + 'cambio_papeles.svg',
          intro: 'La transformación de Gregor transforma a todos. Toca cada círculo para ver cómo cambia cada miembro de la familia.',
          zonas: [
            { id: 'gregor', x: 89, y: 27.5, titulo: 'Gregor: de sostén a carga', texto: 'Era el único sueldo. Ahora depende de que alguien le lleve comida. Lo que más le duele no es su cuerpo: es no poder seguir ayudando.' },
            { id: 'padre', x: 89, y: 46.5, titulo: 'El padre: de la bata al uniforme', texto: 'Llevaba cinco años sin trabajar. Ahora es ordenanza de un banco, camina erguido y vuelve a mandar en casa.' },
            { id: 'madre', x: 89, y: 66, titulo: 'La madre: de enferma a costurera', texto: 'Pese al asma, cose ropa interior fina para una tienda hasta altas horas de la noche.' },
            { id: 'grete', x: 89, y: 85, titulo: 'Grete: de niña a quien decide', texto: 'Era «una niña algo inútil», según sus padres. Ahora trabaja de dependienta, estudia taquigrafía y francés, y es la experta de la familia en todo lo relativo a Gregor.' }
          ]
        }
      },
      {
        id: 'm4_juego',
        tipo: 'minijuego',
        titulo: 'Busca el símbolo',
        objeto: {
          nombre: 'El frutero del aparador',
          lugar: 'Sobre el aparador, en la pared izquierda',
          posicion: [-3.66, 1.25, 1.9]
        },
        diario: {
          titulo: 'La manzana',
          texto: 'Sigue ahí, en mi espalda. Nadie se atreve a quitarla. Por las noches dejan la puerta abierta y los miro desde lo oscuro. Hablan poco. Es casi como antes, pero yo estoy del otro lado.'
        },
        minijuego: {
          tipo: 'simbolos',
          titulo: 'Busca el símbolo',
          instruccion: 'Lee la pista y toca en la sala el objeto del que habla. También puedes elegirlo en la lista.',
          objetos: [
            { id: 'manzana', nombre: 'La manzana', posicion: [-1.75, 1.5, -2.15] },
            { id: 'gorra', nombre: 'La gorra del uniforme', posicion: [1.4, 0.95, -0.75] },
            { id: 'puerta', nombre: 'La puerta entreabierta', posicion: [-2.4, 2.1, -2.75] },
            { id: 'sillon', nombre: 'El sillón con la bata', posicion: [3.2, 1.15, 1.6] },
            { id: 'trastos', nombre: 'Los trastos amontonados', posicion: [-3.5, 0.95, -2.2] }
          ],
          retos: [
            { pista: 'Nadie se atreve a quitarla. Se queda donde cayó, como un recuerdo que todos pueden ver.', objeto: 'manzana', explicacion: 'La manzana incrustada en la espalda: la herida que el padre le deja y que la familia prefiere no tocar.' },
            { pista: 'Lleva un monograma dorado, probablemente el de un banco. Quien la usa ya no es el hombre cansado de antes.', objeto: 'gorra', explicacion: 'La gorra del uniforme: el padre la lanza sobre el canapé al entrar. Es su nueva autoridad.' },
            { pista: 'Es un permiso y también un límite: desde ahí puede mirar, pero no entrar.', objeto: 'puerta', explicacion: 'La puerta que le abren al anochecer tras la herida. Lo aceptan como espectador, no como miembro de la mesa.' },
            { pista: 'Ahí pasaba los días el hombre que Gregor recordaba, antes de que todo cambiara.', objeto: 'sillon', explicacion: 'El sillón y la bata del padre de antes: el que dependía del sueldo de su hijo.' },
            { pista: 'Lo que estorba en el resto de la casa acaba en su cuarto. ¿En qué se ha convertido él?', objeto: 'trastos', explicacion: 'Los trastos: cuando llegan los huéspedes, el cuarto de Gregor se vuelve depósito. Él pasa a ser una cosa más entre cosas.' }
          ]
        }
      }
    ],
    lectura: {
      capitulo: 'Parte III · comienzo',
      fragmento: 'La grave herida de Gregor, por la que sufrió más de un mes —la manzana quedó incrustada en la carne como recuerdo visible, pues nadie se atrevió a quitarla—, pareció recordarle incluso al padre que Gregor, pese a su triste y repugnante figura actual, era un miembro de la familia al que no se debía tratar como a un enemigo.',
      masTexto: 'Al contrario: frente a él, el deber de la familia mandaba tragarse la repugnancia y soportar, nada más que soportar.',
      dondeSeguir: 'Lee el final de la segunda parte (las manzanas) y las dos primeras páginas de la tercera.',
      pregunta: '«Soportar, nada más que soportar». ¿Es eso lo mismo que querer a alguien? ¿Cuánto tiempo crees que puede durar?'
    }
  },

  // ───────────────────────────── MISIÓN 5 ─────────────────────────────
  5: {
    mision: 5,
    sello: 'Sello del Lector',
    recursos: [
      {
        id: 'm5_capsula',
        tipo: 'capsula',
        titulo: '«Kafkiano»: por qué seguimos leyéndolo',
        objeto: {
          nombre: 'El libro de la mesa',
          lugar: 'Sobre la mesa de la familia, delante a la izquierda',
          posicion: [-1.2, 0.92, 1.6],
          accesorio: 'libro',
          giroY: -0.5
        },
        diario: {
          titulo: 'La música',
          texto: 'Grete tocaba y a ellos les aburría. A mí me pareció que alguien me mostraba el camino hacia un alimento que no conocía y que llevaba meses buscando. ¿Puede sentir eso un animal?'
        },
        capsula: {
          id: 'cap_kafkiano',
          titulo: '«Kafkiano»: por qué seguimos leyéndolo',
          video: 'capsula_kafkiano.mp4',
          preguntaFinal: 'De todas las lecturas posibles, ¿cuál es la tuya?',
          escenas: [
            {
              titulo: 'Una palabra',
              imagen: V + 'tres_puertas.svg',
              enPantalla: 'Puertas cerradas en un pasillo.',
              foco: [50, 50],
              lineas: [
                { quien: 'narrador', texto: 'Decimos «kafkiano» cuando alguien queda atrapado en una situación absurda que nadie le explica y de la que no puede salir.' },
                { quien: 'narrador', texto: 'La metamorfosis nunca dice por qué Gregor se transforma. Esa falta de explicación es deliberada.' }
              ]
            },
            {
              titulo: 'Muchas lecturas',
              imagen: V + 'viajante.svg',
              enPantalla: 'El viajante frente al tren.',
              foco: [70, 55],
              lineas: [
                { quien: 'narrador', texto: 'Se ha leído como una historia sobre el trabajo que deshumaniza. Sobre la enfermedad y el peso de cuidar a alguien.' },
                { quien: 'narrador', texto: 'Sobre la familia y la culpa. Sobre sentirse extraño en el propio cuerpo.' }
              ]
            },
            {
              titulo: 'Ninguna la agota',
              imagen: V + 'tranvia.svg',
              enPantalla: 'El tranvía al sol.',
              foco: [45, 60],
              lineas: [
                { quien: 'narrador', texto: 'Ninguna lectura la agota. Por eso, más de un siglo después, se sigue leyendo y discutiendo.' },
                { quien: 'narrador', texto: 'Tú acabas de recorrerla entera. Ahora te toca leerla y decidir.' }
              ]
            }
          ]
        }
      },
      {
        id: 'm5_imagen',
        tipo: 'imagen',
        titulo: 'Línea de tiempo de la historia',
        objeto: {
          nombre: 'La ventana del amanecer',
          lugar: 'En la pared del fondo de la sala, a la derecha',
          posicion: [2.5, 1.75, -2.7]
        },
        diario: {
          titulo: 'Lo que oí',
          texto: '«Tenemos que librarnos de él», dijo. No la culpo. Volví a mi cuarto sin que nadie me empujara; me asombró lo lejos que estaba. Ella cerró con llave y dijo: «¡Por fin!».'
        },
        imagen: {
          titulo: 'De la primera mañana al último amanecer',
          imagen: V + 'linea_tiempo.svg',
          intro: 'El libro tiene tres partes y cada una termina igual: Gregor sale de su cuarto y lo devuelven a él. Toca cada punto de la línea.',
          zonas: [
            { id: 't1', x: 11, y: 43, titulo: 'El despertar', texto: 'Parte I. Una mañana de lluvia, Gregor despierta transformado y solo piensa en el tren que perdió.' },
            { id: 't2', x: 28, y: 57, titulo: 'La puerta', texto: 'Parte I. Abre con la boca; el apoderado huye y el padre lo devuelve al cuarto a empujones. Primera expulsión.' },
            { id: 't3', x: 42, y: 43, titulo: 'La leche y la rutina', texto: 'Parte II. Grete lo alimenta y limpia el cuarto. Él escucha tras la puerta y se esconde bajo el canapé.' },
            { id: 't4', x: 58.5, y: 57, titulo: 'Los muebles y la manzana', texto: 'Parte II, unos dos meses después. Vacían el cuarto, la madre se desmaya y el padre lo ataca con manzanas. Segunda expulsión.' },
            { id: 't5', x: 72, y: 43, titulo: 'Los huéspedes', texto: 'Parte III. La familia trabaja, alquila una habitación y descuida a Gregor, que casi no come.' },
            { id: 't6', x: 81, y: 57, titulo: 'El violín', texto: 'Parte III. Atraído por la música, se deja ver. Los huéspedes se marchan indignados y Grete dicta sentencia. Tercera expulsión.' },
            { id: 't7', x: 88, y: 43, titulo: 'Las tres de la madrugada', texto: 'Gregor muere solo, pensando en su familia con cariño, cuando empieza a clarear. Es a finales de marzo.' },
            { id: 't8', x: 93, y: 57, titulo: 'El tranvía', texto: 'La familia sale al campo, hace planes y mira a Grete, que ha florecido. El libro termina con ella desperezándose al sol.' }
          ]
        }
      },
      {
        id: 'm5_juego',
        tipo: 'minijuego',
        titulo: 'Ordena la historia completa',
        objeto: {
          nombre: 'El violín',
          lugar: 'Flotando sobre el atril, en el centro de la sala',
          posicion: [1.5, 2.45, -0.3]
        },
        diario: {
          titulo: 'Última página',
          texto: 'Las tres. La manzana ya casi no duele. Pienso en ellos con cariño. Si de verdad debo irme, lo creo yo más que nadie. Por la ventana empieza a entrar algo de claridad.'
        },
        minijuego: {
          tipo: 'ordenar',
          titulo: 'Ordena la historia completa',
          instruccion: 'Coloca los ocho momentos en el orden en que ocurren. Usa las flechas para subir o bajar cada uno.',
          eventos: [
            'Gregor despierta transformado y ve que ha perdido el tren.',
            'El apoderado llega a la casa y Gregor abre la puerta con la boca.',
            'Grete descubre que su hermano ya no quiere la leche y le lleva otros alimentos.',
            'La madre y Grete vacían el cuarto; Gregor cubre el retrato con su cuerpo.',
            'El padre, de uniforme, le lanza manzanas y una se le queda en la espalda.',
            'La familia alquila una habitación a tres huéspedes.',
            'Grete toca el violín, Gregor sale de su cuarto y ella dice que hay que librarse de él.',
            'La familia sale en tranvía al campo y hace planes para el futuro.'
          ]
        }
      }
    ],
    lectura: {
      capitulo: 'Parte III · el violín y el final',
      fragmento: '¿Era un animal, si la música lo conmovía tanto? Le parecía que se le mostraba el camino hacia el alimento desconocido y anhelado.',
      masTexto: 'Pensaba en su familia con emoción y cariño. Su convicción de que tenía que desaparecer era, si cabe, aún más firme que la de su hermana. En ese estado de meditación vacía y apacible permaneció hasta que el reloj de la torre dio las tres de la madrugada.',
      dondeSeguir: 'Lee las últimas páginas, desde que la asistenta abre la puerta hasta la frase final.',
      pregunta: 'El libro no termina con Gregor, sino con Grete estirándose al sol. ¿Por qué crees que Kafka eligió esa última imagen?'
    }
  }
};

/** Puntos de lectura que otorga cada tipo de recurso. */
export const PUNTOS = { capsula: 10, imagen: 10, minijuego: 30, lectura: 10 };
export const PUNTOS_MAXIMOS = 5 * (PUNTOS.capsula + PUNTOS.imagen + PUNTOS.minijuego + PUNTOS.lectura);
