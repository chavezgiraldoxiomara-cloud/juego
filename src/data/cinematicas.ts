import type { Cinematica } from '../types/recursos';

/**
 * GUIONES DE LAS CINEMÁTICAS AMPLIADAS (una por misión).
 *
 * Cada escena tiene una imagen fija y sus líneas. El juego las reproduce como
 * cinemática narrada: muestra la imagen con un movimiento lento, lee las líneas
 * con la voz del navegador y las escribe como subtítulos.
 *
 * Cuando exista el video real, basta con guardarlo en public/assets/videos/
 * con el nombre indicado en `video` (y sus subtítulos con el mismo nombre y
 * extensión .vtt). El juego lo detecta al arrancar y lo usa en lugar de la narración.
 *
 * Las citas son traducción propia del original alemán de 1915 (dominio público).
 */

const V = '/assets/vinetas/';
const C = '/assets/clips/';
const F = '/assets/frames/';
const A = '/assets/aistudio/';

export const CINEMATICAS: Record<number, Cinematica> = {
  1: {
    id: 'cine_1',
    titulo: 'La mañana en que todo cambió',
    video: 'dim1_ampliada.mp4',
    preguntaFinal: 'No gritó ni pidió ayuda: solo temía llegar tarde. ¿Qué dice eso de la vida que llevaba?',
    escenas: [
      {
        titulo: 'La grieta',
        imagen: F + 'frame_02.jpg',
        enPantalla: 'El portal se abre sobre un dormitorio en penumbra. Lluvia en la ventana.',
        foco: [45, 60],
        lineas: [
          { quien: 'guia', texto: 'Cazador, esta grieta no lleva a un calabozo. Lleva a un dormitorio de Praga, una mañana de lluvia.' },
          { quien: 'guia', texto: 'Observa antes de juzgar.' }
        ]
      },
      {
        titulo: 'Seis y media',
        imagen: V + 'despertador.svg',
        enPantalla: 'Primer plano del despertador sobre la cómoda: las seis y media. Gotas en el cristal.',
        foco: [64, 44],
        lineas: [
          { quien: 'narrador', texto: 'Gregor Samsa es viajante de comercio. Vende telas de ciudad en ciudad.' },
          { quien: 'narrador', texto: 'Cada día se levanta a las cuatro para tomar el tren de las cinco.' },
          { quien: 'narrador', texto: 'Hoy el despertador marca las seis y media. El tren ya se fue.' }
        ]
      },
      {
        titulo: 'Un cuerpo que no obedece',
        imagen: F + 'frame_03.jpg',
        enPantalla: 'Gregor transformado, visto a contraluz. La cámara no se detiene en los detalles.',
        foco: [48, 45],
        lineas: [
          { quien: 'narrador', texto: 'Al despertar de un sueño intranquilo descubre que su cuerpo ya no es el suyo.' },
          { quien: 'narrador', texto: 'Una espalda dura como una coraza, un vientre abombado, muchas patas finas que no le obedecen.' },
          { quien: 'gregor', texto: '¿Qué me ha pasado?' },
          { quien: 'narrador', texto: 'No es un sueño. Su habitación sigue ahí: la mesa con el muestrario de telas y el retrato de una dama con pieles que él mismo recortó y enmarcó.' }
        ]
      },
      {
        titulo: 'Lo que de verdad le preocupa',
        imagen: V + 'viajante.svg',
        enPantalla: 'Andén de estación. Un hombre con maleta mira un tren que se va.',
        foco: [75, 55],
        lineas: [
          { quien: 'narrador', texto: 'Y sin embargo, Gregor casi no piensa en su cuerpo. Piensa en el trabajo.' },
          { quien: 'gregor', texto: '¡Qué profesión tan agotadora he elegido! Día tras día de viaje.' },
          { quien: 'narrador', texto: 'Odia ese empleo, pero no puede dejarlo: sus padres le deben dinero al jefe.' },
          { quien: 'narrador', texto: 'Calcula que le faltan cinco o seis años para pagar la deuda.' }
        ]
      },
      {
        titulo: 'El sostén de la casa',
        imagen: A + 'gregor_humano9_7b57933f.jpg',
        enPantalla: 'Gregor antes de la transformación, con la mochila al hombro.',
        foco: [50, 25],
        lineas: [
          { quien: 'narrador', texto: 'Desde que el negocio del padre quebró, hace cinco años, Gregor mantiene a todos.' },
          { quien: 'narrador', texto: 'Al padre, a la madre y a Grete, su hermana de diecisiete años.' },
          { quien: 'narrador', texto: 'Su plan secreto es pagarle el conservatorio, porque ella toca el violín.' }
        ]
      },
      {
        titulo: 'Tres puertas, tres voces',
        imagen: V + 'tres_puertas.svg',
        enPantalla: 'Las tres puertas del cuarto. Se ilumina cada una cuando habla quien está detrás.',
        foco: [50, 50],
        lineas: [
          { quien: 'narrador', texto: 'Entonces llaman a la puerta. Primero la madre, con suavidad.' },
          { quien: 'madre', texto: 'Gregor, son las siete menos cuarto. ¿No ibas a salir de viaje?' },
          { quien: 'narrador', texto: 'Luego el padre, con el puño. Y por la otra puerta, la hermana, en voz baja.' },
          { quien: 'grete', texto: 'Gregor, ¿no estás bien? ¿Necesitas algo?' }
        ]
      },
      {
        titulo: 'Una voz que ya no es suya',
        imagen: F + 'frame_02.jpg',
        enPantalla: 'Gregor de espaldas en la penumbra. El sonido de su voz se distorsiona.',
        foco: [30, 70],
        lineas: [
          { quien: 'narrador', texto: 'Gregor contesta y se asusta al oírse: bajo su voz de siempre se mezcla un pitido doloroso.' },
          { quien: 'narrador', texto: 'Todavía cree que es un resfriado. Todavía cree que alcanzará el tren de las siete.' }
        ]
      },
      {
        titulo: 'La pregunta del guía',
        imagen: C + 'dim1_poster.jpg',
        enPantalla: 'Regreso al portal. La pregunta queda escrita en pantalla.',
        foco: [20, 60],
        lineas: [
          { quien: 'guia', texto: 'Fíjate: no ha gritado ni ha pedido ayuda. Solo teme llegar tarde.' },
          { quien: 'guia', texto: '¿Qué dice eso de la vida que llevaba antes de transformarse?' }
        ]
      }
    ]
  },

  2: {
    id: 'cine_2',
    titulo: 'La puerta',
    video: 'dim2_ampliada.mp4',
    preguntaFinal: 'Él entendió cada palabra; ellos, ninguna de las suyas. ¿Quién quedó realmente encerrado?',
    escenas: [
      {
        titulo: 'La grieta',
        imagen: C + 'dim2_poster.jpg',
        enPantalla: 'La puerta del cuarto vista desde dentro; siluetas al otro lado.',
        foco: [70, 50],
        lineas: [
          { quien: 'guia', texto: 'Segunda grieta. Detrás de esa puerta hay un hijo; delante, una familia y un jefe.' },
          { quien: 'guia', texto: 'Mira quién da un paso hacia él y quién retrocede.' }
        ]
      },
      {
        titulo: 'El apoderado',
        imagen: V + 'tres_puertas.svg',
        enPantalla: 'Las tres puertas. Una cuarta voz, seca, se suma a las de la familia.',
        foco: [50, 40],
        lineas: [
          { quien: 'narrador', texto: 'Gregor lleva apenas un rato de retraso y la empresa ya envió a su casa al apoderado en persona. Así de vigilado vive.' },
          { quien: 'apoderado', texto: 'Señor Samsa, ¿qué ocurre? Se atrinchera en su cuarto y preocupa gravemente a sus padres.' },
          { quien: 'narrador', texto: 'Y delante de todos insinúa que su rendimiento ha sido malo y que su puesto no es nada seguro.' }
        ]
      },
      {
        titulo: 'La defensa que nadie entiende',
        imagen: A + 'gregor_humano9_7b57933f.jpg',
        enPantalla: 'El Gregor de antes, como él aún se imagina. El audio de su voz se rompe.',
        foco: [50, 20],
        lineas: [
          { quien: 'narrador', texto: 'Gregor responde atropelladamente: que ya se levanta, que tomará el tren de las ocho, que no lo despidan.' },
          { quien: 'narrador', texto: 'Afuera nadie entiende una palabra.' },
          { quien: 'apoderado', texto: 'Era una voz de animal.' },
          { quien: 'narrador', texto: 'La madre manda a Grete por el médico; el padre, a la criada por un cerrajero.' }
        ]
      },
      {
        titulo: 'La llave',
        imagen: V + 'llave.svg',
        enPantalla: 'Primerísimo plano de la cerradura. La llave gira despacio. Una gota oscura cae.',
        foco: [55, 45],
        lineas: [
          { quien: 'narrador', texto: 'Nadie espera al cerrajero. Gregor, sin manos, gira la llave con la boca.' },
          { quien: 'narrador', texto: 'Se hace daño: un líquido oscuro le cae de la mandíbula.' },
          { quien: 'narrador', texto: 'Lo anima imaginar que todos lo alientan desde el otro lado.' }
        ]
      },
      {
        titulo: 'Se abre',
        imagen: F + 'frame_04.jpg',
        enPantalla: 'La puerta entreabierta: luz cálida y tres siluetas que se apartan.',
        foco: [72, 55],
        lineas: [
          { quien: 'narrador', texto: 'La puerta se abre. El apoderado se tapa la boca y retrocede.' },
          { quien: 'narrador', texto: 'La madre da dos pasos hacia su hijo y se desploma entre sus faldas.' },
          { quien: 'narrador', texto: 'El padre aprieta el puño; luego mira la sala, se cubre los ojos y llora.' }
        ]
      },
      {
        titulo: 'El único tranquilo',
        imagen: F + 'frame_04.jpg',
        enPantalla: 'Gregor en el umbral. Al fondo, la escalera por la que huye el apoderado.',
        foco: [25, 45],
        lineas: [
          { quien: 'narrador', texto: 'Gregor es el único que conserva la calma. Pide comprensión, promete trabajar, ruega al apoderado que hable bien de él.' },
          { quien: 'narrador', texto: 'Pero el hombre ya huye escaleras abajo.' }
        ]
      },
      {
        titulo: 'El bastón',
        imagen: A + 'PADRE_c21fc645.jpg',
        enPantalla: 'El padre avanza con un bastón y un periódico. La puerta se cierra de golpe. Negro.',
        foco: [50, 25],
        lineas: [
          { quien: 'narrador', texto: 'Entonces el padre toma el bastón que el apoderado olvidó y un periódico, y lo empuja de vuelta, pisoteando y siseando.' },
          { quien: 'narrador', texto: 'Gregor se atasca en la puerta y se hiere un costado. Un último empujón lo lanza dentro.' },
          { quien: 'narrador', texto: 'La puerta se cierra de un golpe con el bastón. Luego, por fin, silencio.' }
        ]
      },
      {
        titulo: 'La pregunta del guía',
        imagen: C + 'dim2_poster.jpg',
        enPantalla: 'La puerta cerrada. La pregunta queda escrita en pantalla.',
        foco: [60, 50],
        lineas: [
          { quien: 'guia', texto: 'Gregor entendió cada palabra; ellos, ninguna de las suyas.' },
          { quien: 'guia', texto: '¿Quién quedó realmente encerrado: él, o los que cerraron la puerta?' }
        ]
      }
    ]
  },

  3: {
    id: 'cine_3',
    titulo: 'Lo que se llevan',
    video: 'dim3_ampliada.mp4',
    preguntaFinal: 'Un cuarto vacío le da libertad; un cuarto con muebles le recuerda quién fue. ¿Qué habrías defendido tú?',
    escenas: [
      {
        titulo: 'La grieta',
        imagen: C + 'dim3_poster.jpg',
        enPantalla: 'Objetos flotando: un cuenco, pan, libros, un retrato enmarcado.',
        foco: [50, 45],
        lineas: [
          { quien: 'guia', texto: 'Tercera grieta. Aquí no hay enemigos: hay muebles.' },
          { quien: 'guia', texto: 'Vigila qué objetos defiende Gregor y pregúntate por qué.' }
        ]
      },
      {
        titulo: 'La leche',
        imagen: F + 'frame_05.jpg',
        enPantalla: 'El cuenco de leche con trozos de pan, intacto.',
        foco: [38, 62],
        lineas: [
          { quien: 'narrador', texto: 'Al anochecer, Grete le deja un cuenco de leche dulce con trocitos de pan: su plato preferido.' },
          { quien: 'narrador', texto: 'A Gregor ahora le repugna. Ella lo nota y, sin decir nada, le trae un surtido para averiguar qué le gusta.' },
          { quien: 'narrador', texto: 'Verduras pasadas, huesos, un queso que él mismo había declarado incomible. Eso es lo que come.' }
        ]
      },
      {
        titulo: 'El canapé y la sábana',
        imagen: V + 'habitacion_simbolos.svg',
        enPantalla: 'El canapé cubierto por una sábana que cuelga hasta el suelo.',
        foco: [80, 60],
        lineas: [
          { quien: 'narrador', texto: 'Grete es la única que entra. Para ahorrarle el susto, Gregor se esconde bajo el canapé.' },
          { quien: 'narrador', texto: 'Un día carga una sábana sobre el lomo hasta cubrirse por completo. Tarda cuatro horas.' },
          { quien: 'narrador', texto: 'Es su manera de cuidarla.' }
        ]
      },
      {
        titulo: 'Lo que oye tras la puerta',
        imagen: V + 'caja.svg',
        enPantalla: 'Una caja de caudales sobre una mesa; monedas y un papel.',
        foco: [52, 50],
        lineas: [
          { quien: 'narrador', texto: 'Pegado a la puerta, escucha a la familia hablar de dinero.' },
          { quien: 'narrador', texto: 'Así descubre que del negocio quebrado había quedado un pequeño capital, y que el padre guardó parte de lo que él entregaba cada mes.' },
          { quien: 'narrador', texto: 'Gregor se alegra de esa previsión. No se pregunta por qué nadie se lo dijo.' }
        ]
      },
      {
        titulo: 'La ventana',
        imagen: V + 'ventana.svg',
        enPantalla: 'La ventana y una silla. Los edificios de enfrente se van borrando en gris.',
        foco: [50, 40],
        lineas: [
          { quien: 'narrador', texto: 'Pasa las horas apoyado en la ventana. Pero cada día ve peor.' },
          { quien: 'narrador', texto: 'El hospital de enfrente se borra, y la calle parece un desierto gris.' }
        ]
      },
      {
        titulo: 'La duda de la madre',
        imagen: A + 'MADRE_e9b361d8.webp',
        enPantalla: 'La madre, con las manos juntas, detenida en mitad del cuarto.',
        foco: [50, 22],
        lineas: [
          { quien: 'narrador', texto: 'Grete decide vaciar el cuarto para que él pueda trepar por las paredes. La madre duda.' },
          { quien: 'madre', texto: '¿No parecerá que, al quitarle los muebles, renunciamos a toda esperanza de que mejore?' },
          { quien: 'narrador', texto: 'Gregor la oye y comprende: en dos meses sin hablar con nadie casi había olvidado que fue humano.' }
        ]
      },
      {
        titulo: 'El retrato',
        imagen: F + 'frame_05.jpg',
        enPantalla: 'El retrato de la dama con pieles en su marco dorado.',
        foco: [80, 30],
        lineas: [
          { quien: 'narrador', texto: 'Se llevan la cómoda. Se llevan el escritorio donde hizo sus tareas de niño.' },
          { quien: 'narrador', texto: 'Entonces Gregor sale, trepa a la pared y cubre con su cuerpo el retrato de la dama con pieles.' },
          { quien: 'narrador', texto: 'Eso no se lo llevará nadie.' }
        ]
      },
      {
        titulo: '«¡Gregor!»',
        imagen: '/assets/grete_portrait.jpg',
        enPantalla: 'Grete, de frente. Levanta el puño.',
        foco: [55, 30],
        lineas: [
          { quien: 'narrador', texto: 'La madre lo ve sobre la pared y se desmaya. Grete levanta el puño.' },
          { quien: 'grete', texto: '¡Gregor!' },
          { quien: 'narrador', texto: 'Es la primera palabra que le dirige desde la transformación. Y es una amenaza.' }
        ]
      },
      {
        titulo: 'La pregunta del guía',
        imagen: C + 'dim3_poster.jpg',
        enPantalla: 'Los objetos vuelven a flotar. La pregunta queda escrita en pantalla.',
        foco: [75, 30],
        lineas: [
          { quien: 'guia', texto: 'Un cuarto vacío le daría libertad para moverse; un cuarto con muebles le recuerda quién fue.' },
          { quien: 'guia', texto: '¿Qué habrías defendido tú?' }
        ]
      }
    ]
  },

  4: {
    id: 'cine_4',
    titulo: 'El uniforme y la manzana',
    video: 'dim4_ampliada.mp4',
    preguntaFinal: 'El padre recuperó el uniforme y la voz; Gregor perdió las dos. ¿Tenía que caer uno para que el otro se levantara?',
    escenas: [
      {
        titulo: 'La grieta',
        imagen: C + 'dim4_poster.jpg',
        enPantalla: 'Una figura oscura y un estallido rojo.',
        foco: [45, 45],
        lineas: [
          { quien: 'guia', texto: 'Cuarta grieta. El jefe de este calabozo no es un monstruo: es un padre.' },
          { quien: 'guia', texto: 'Observa cómo cambió él mientras su hijo caía.' }
        ]
      },
      {
        titulo: 'El padre de antes',
        imagen: A + 'PADRE_c21fc645.jpg',
        enPantalla: 'El padre, cansado, en penumbra.',
        foco: [50, 25],
        lineas: [
          { quien: 'narrador', texto: 'Gregor recordaba a un hombre cansado, hundido en su sillón, en bata.' },
          { quien: 'narrador', texto: 'Un hombre que apenas se levantaba para saludarlo cuando él volvía de viaje.' }
        ]
      },
      {
        titulo: 'El padre de ahora',
        imagen: V + 'uniforme.svg',
        enPantalla: 'El uniforme azul con botones dorados, de cuerpo entero.',
        foco: [50, 35],
        lineas: [
          { quien: 'narrador', texto: 'El que entra esta tarde es otro: erguido, con un uniforme azul de botones dorados, como los ordenanzas de los bancos.' },
          { quien: 'narrador', texto: 'Mientras Gregor dejaba de sostener la casa, el padre volvió a trabajar.' }
        ]
      },
      {
        titulo: 'El malentendido',
        imagen: '/assets/grete_portrait.jpg',
        enPantalla: 'Grete en la puerta, sin aliento.',
        foco: [55, 28],
        lineas: [
          { quien: 'narrador', texto: 'Grete solo alcanza a decir que la madre se desmayó y que Gregor se escapó. El padre entiende lo peor.' },
          { quien: 'padre', texto: '¡Ya me lo esperaba! Siempre se lo dije a ustedes.' }
        ]
      },
      {
        titulo: 'La persecución',
        imagen: F + 'frame_06.jpg',
        enPantalla: 'Vueltas alrededor de la sala. Las botas del padre, enormes, en primer plano.',
        foco: [35, 50],
        lineas: [
          { quien: 'narrador', texto: 'Lo persigue alrededor de la sala. Gregor se asombra del tamaño gigantesco de las suelas de sus botas.' },
          { quien: 'narrador', texto: 'Por cada paso del padre, él necesita un sinfín de movimientos. Se queda sin aire.' }
        ]
      },
      {
        titulo: 'Las manzanas',
        imagen: V + 'manzana.svg',
        enPantalla: 'Manzanas rojas que ruedan por el suelo oscuro.',
        foco: [55, 58],
        lineas: [
          { quien: 'narrador', texto: 'Entonces algo rueda a su lado: una manzana. El padre se llenó los bolsillos en el frutero y las lanza una tras otra.' },
          { quien: 'narrador', texto: 'Una le roza la espalda. La siguiente se le hunde en el lomo.' }
        ]
      },
      {
        titulo: 'La madre',
        imagen: A + 'MADRE_e9b361d8.webp',
        enPantalla: 'La madre corre hacia el padre. La imagen se nubla.',
        foco: [50, 22],
        lineas: [
          { quien: 'narrador', texto: 'Lo último que Gregor ve antes de que se le nuble la vista es a su madre.' },
          { quien: 'narrador', texto: 'Corre, se abraza al padre y le suplica que le perdone la vida a su hijo.' }
        ]
      },
      {
        titulo: 'La puerta entreabierta',
        imagen: V + 'puerta_entreabierta.svg',
        enPantalla: 'Desde la oscuridad del cuarto: la familia bajo la lámpara, al otro lado de la puerta.',
        foco: [52, 50],
        lineas: [
          { quien: 'narrador', texto: 'La manzana queda ahí, pudriéndose; nadie se atreve a sacarla. La herida le dura más de un mes.' },
          { quien: 'narrador', texto: 'Y parece recordarle al padre que Gregor, pese a todo, es de la familia.' },
          { quien: 'narrador', texto: 'Desde entonces, cada anochecer le dejan abierta la puerta de la sala. Desde su oscuridad, él los mira coser, estudiar, dormirse bajo la lámpara.' }
        ]
      },
      {
        titulo: 'La pregunta del guía',
        imagen: C + 'dim4_poster.jpg',
        enPantalla: 'La figura del padre. La pregunta queda escrita en pantalla.',
        foco: [25, 40],
        lineas: [
          { quien: 'guia', texto: 'El padre recuperó el uniforme y la voz; Gregor perdió las dos cosas.' },
          { quien: 'guia', texto: '¿Era necesario que uno cayera para que el otro se levantara?' }
        ]
      }
    ]
  },

  5: {
    id: 'cine_5',
    titulo: 'La última canción',
    video: 'dim5_ampliada.mp4',
    preguntaFinal: 'Grete estira su cuerpo joven al sol. ¿Final feliz, o el comienzo de otra metamorfosis?',
    escenas: [
      {
        titulo: 'La grieta',
        imagen: C + 'dim5_poster.jpg',
        enPantalla: 'Grete con el violín; notas de luz en el aire.',
        foco: [70, 45],
        lineas: [
          { quien: 'guia', texto: 'Última grieta. No habrá combate. Solo un violín, una decisión y un amanecer.' },
          { quien: 'guia', texto: 'Quédate hasta el final: el libro no termina donde crees.' }
        ]
      },
      {
        titulo: 'Una casa cansada',
        imagen: V + 'puerta_entreabierta.svg',
        enPantalla: 'La familia bajo la lámpara, vista desde el cuarto oscuro.',
        foco: [50, 60],
        lineas: [
          { quien: 'narrador', texto: 'Todos trabajan y vuelven agotados. El padre se duerme con el uniforme puesto.' },
          { quien: 'narrador', texto: 'La madre cose ropa fina para una tienda. Grete es dependienta y por las noches estudia taquigrafía y francés.' },
          { quien: 'narrador', texto: 'Ya casi nadie limpia el cuarto de Gregor, que se va llenando de trastos.' }
        ]
      },
      {
        titulo: 'Los huéspedes',
        imagen: V + 'huespedes.svg',
        enPantalla: 'Tres hombres de barba sentados a la mesa de los Samsa.',
        foco: [50, 45],
        lineas: [
          { quien: 'narrador', texto: 'Para ganar algo más, alquilan una habitación a tres señores serios, de barba, que exigen orden.' },
          { quien: 'narrador', texto: 'Gregor casi ha dejado de comer.' }
        ]
      },
      {
        titulo: 'El violín',
        imagen: '/assets/grete_scene.jpg',
        enPantalla: 'Grete toca. Al fondo, una sombra avanza hacia la música.',
        foco: [60, 45],
        lineas: [
          { quien: 'narrador', texto: 'Una noche Grete toca el violín y los huéspedes le piden que lo haga en la sala. Pronto se aburren.' },
          { quien: 'narrador', texto: 'Gregor, en cambio, avanza cubierto de polvo, atraído por la música.' },
          { quien: 'gregor', texto: '¿Era un animal, si la música lo conmovía tanto?' },
          { quien: 'narrador', texto: 'Sueña con decirle que él iba a pagarle el conservatorio.' }
        ]
      },
      {
        titulo: 'Lo descubren',
        imagen: V + 'huespedes.svg',
        enPantalla: 'Un huésped señala hacia el suelo. Los tres se ponen de pie.',
        foco: [50, 35],
        lineas: [
          { quien: 'narrador', texto: 'Un huésped lo señala. Los tres anuncian que se van y que no pagarán nada.' },
          { quien: 'narrador', texto: 'El violín cae del regazo de la madre con un sonido largo.' }
        ]
      },
      {
        titulo: 'La sentencia',
        imagen: '/assets/grete_portrait.jpg',
        enPantalla: 'Grete golpea la mesa. El padre, sentado, asiente.',
        foco: [55, 28],
        lineas: [
          { quien: 'grete', texto: 'No quiero pronunciar el nombre de mi hermano delante de este monstruo. Tenemos que intentar librarnos de él.' },
          { quien: 'padre', texto: 'Si él nos entendiera…' },
          { quien: 'narrador', texto: 'Gregor los entiende. Vuelve a su cuarto con esfuerzo; nadie lo empuja. Grete echa la llave apenas entra.' },
          { quien: 'grete', texto: '¡Por fin!' }
        ]
      },
      {
        titulo: 'Las tres de la madrugada',
        imagen: V + 'reloj_torre.svg',
        enPantalla: 'El reloj de la torre marca las tres. El horizonte empieza a aclarar.',
        foco: [50, 45],
        lineas: [
          { quien: 'narrador', texto: 'Piensa en su familia con emoción y cariño. Está convencido, aún más que su hermana, de que debe desaparecer.' },
          { quien: 'narrador', texto: 'Oye dar las tres en el reloj de la torre. Ve empezar a clarear tras la ventana. Y su cabeza se inclina por última vez.' }
        ]
      },
      {
        titulo: 'El tranvía',
        imagen: V + 'tranvia.svg',
        enPantalla: 'Un tranvía bajo el sol, camino del campo. Tres pasajeros.',
        foco: [45, 60],
        lineas: [
          { quien: 'narrador', texto: 'Por la mañana, la asistenta encuentra el cuerpo. Los Samsa despiden a los huéspedes y se toman el día libre.' },
          { quien: 'narrador', texto: 'Salen en tranvía al campo, bajo un sol tibio. Hablan del futuro, de mudarse a una casa más pequeña.' },
          { quien: 'narrador', texto: 'Y los padres notan que Grete se ha convertido en una joven hermosa, a la que pronto habrá que buscarle un buen marido.' }
        ]
      },
      {
        titulo: 'La pregunta del guía',
        imagen: F + 'frame_09.jpg',
        enPantalla: 'El mapa de los portales. La pregunta queda escrita en pantalla.',
        foco: [50, 50],
        lineas: [
          { quien: 'guia', texto: 'Ella estira su cuerpo joven al sol. ¿Es un final feliz, o el comienzo de otra metamorfosis?' },
          { quien: 'guia', texto: 'Lee las últimas páginas y decide.' }
        ]
      }
    ]
  }
};

/** Duración real de los clips originales (segundos), medida con ffprobe. */
export const DURACION_CLIP_ORIGINAL: Record<number, number> = { 1: 1.8, 2: 1.3, 3: 1.3, 4: 1.0, 5: 1.4 };
