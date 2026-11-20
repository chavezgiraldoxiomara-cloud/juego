import { Dimension } from '../types/game';

export const DIMENSIONS: Dimension[] = [
  {
    id: 1,
    slug: 'el-despertar-del-cazador',
    title: 'DIMENSIÓN 1. EL DESPERTAR DEL CAZADOR',
    subtitle: 'La transformación, el desconcierto y el inicio de una nueva realidad',
    description:
      'Gregor Samsa despierta una mañana para encontrarse aprisionado en un cuerpo incomprensible. El mundo exterior sigue girando con la implacable tiranía del tiempo y las obligaciones laborales.',
    characters: ['gregor_humano', 'gregor_monstruo', 'sung_jinwoo'],
    scenarioName: 'La Habitación de Gregor - El Despertar',
    literaryTheme: 'La alienación cotidiana, la pérdida de la normalidad física y el sometimiento laboral',
    videoClip: '/assets/clips/dim1_despertar.mp4',
    posterImage: '/assets/clips/dim1_poster.jpg',
    videoStartTime: 1.0,
    videoEndTime: 2.8,
    briefing: {
      sungJinWooIntro:
        'Cazador, has ingresado a la primera grieta dimensional. Observa con atención: el protagonista ha sufrido una transformación radical, pero su mente aún está encadenada a la rutina humana. Descifra la verdadera naturaleza de su desconcierto.',
      objective: 'Comprende el impacto psicológico de la metamorfosis y la deshumanización del trabajo.'
    },
    insignia: {
      id: 'insignia_despertar',
      name: 'Insignia del Despertar',
      title: 'El Ojo del Alba Sombrío',
      icon: 'Eye',
      color: 'from-cyan-500 to-blue-600',
      description: 'Otorgada por comprender el shock existencial de Gregor y la pérdida de su rol productivo.'
    },
    activities: [
      {
        id: 'd1_act1',
        type: 'multiple_choice',
        title: 'Desafío 1: La Preocupación Inmediata',
        instruction: 'Selecciona la opción correcta tras analizar el comportamiento inicial de Gregor Samsa.',
        xpReward: 25,
        hint: 'Revisa qué objeto en la pared consulta Gregor de manera obsesiva nada más despertar.',
        question:
          'Cuando Gregor comprueba que su cuerpo es el de un insecto monstruoso con caparazón duro y múltiples patas delgadas, ¿cuál es su principal e inmediata angustia psicológica?',
        options: [
          'Sentir pánico mortal por su salud y pedir auxilio médico inmediato a gritos.',
          'Darse cuenta de que ha perdido el tren de las cinco de la mañana y temer el enfado de su jefe.',
          'Buscar inmediatamente un arma o antídoto mágico para revertir la extraña maldición.',
          'Sentir alegría por liberarse por fin de sus compromisos sociales y laborales.'
        ],
        correctIndex: 1,
        explanation:
          'Franz Kafka expone la alienación moderna: el individuo está tan condicionado por su rutina laboral y la deuda económica que, aun convertido físicamente en un bicho, su prioridad sigue siendo no llegar tarde a la oficina.'
      },
      {
        id: 'd1_act2',
        type: 'detect_clues',
        title: 'Desafío 2: Exploración de Indicios en la Habitación',
        instruction:
          'Examina los tres elementos simbólicos clave presentes en el entorno inmediato de Gregor al despertar.',
        xpReward: 25,
        hint: 'Observa los objetos que representan el tiempo, el trabajo de viajante y su única aspiración estética.',
        sceneImage: '/assets/clips/dim1_poster.jpg',
        requiredCount: 3,
        clues: [
          {
            id: 'reloj',
            name: 'El Despertador de la Mesilla (6:30 AM)',
            symbolism:
              'Simboliza el control tiránico del tiempo productivo del sistema capitalista sobre la vida del empleado.',
            xPercent: 24,
            yPercent: 42,
            radiusPercent: 12
          },
          {
            id: 'muestrario',
            name: 'El Muestrario de Paños y Telas',
            symbolism:
              'El equipaje de viajante de comercio: evidencia de su vida itinerante, sin amigos duraderos ni descanso.',
            xPercent: 78,
            yPercent: 72,
            radiusPercent: 14
          },
          {
            id: 'retrato',
            name: 'El Retrato de la Dama en Pieles',
            symbolism:
              'Recortado de una revista ilustrada y enmarcado con esmero: su único anhelo personal de belleza y afecto.',
            xPercent: 50,
            yPercent: 26,
            radiusPercent: 12
          }
        ],
        explanation:
          'Estos tres elementos resumen la vida de Gregor antes del cambio: la tiranía del reloj, la servidumbre del muestrario de telas y el solitario marco dorado como vestigio de su anhelo humano.'
      },
      {
        id: 'd1_act3',
        type: 'fill_blank',
        title: 'Desafío 3: El Fragmento Inmortal de Kafka',
        instruction: 'Completa la emblemática frase con la que Franz Kafka inicia la novela.',
        xpReward: 25,
        hint: 'Kafka utiliza la palabra alemana "ungeheuren Ungeziefer" (monstruoso insecto o bicho inmundo).',
        preText: '«Al despertar Gregor Samsa una mañana, tras un sueño intranquilo, se encontró en su cama convertido en un',
        blankAnswer: 'monstruoso insecto',
        postText: '. Estaba echado sobre el quitinoso caparazón de su espalda...»',
        options: ['monstruoso insecto', 'guerrero legendario', 'cuervo sombrío', 'enfermo melancólico'],
        explanation:
          'La genialidad de Kafka radica en presentar lo fantástico con absoluta naturalidad documental desde la primera línea, sin justificaciones mágicas ni preámbulos.'
      },
      {
        id: 'd1_act4',
        type: 'reflection',
        title: 'Desafío 4: Reflexión del Cazador',
        instruction:
          'Escribe una breve reflexión crítica (mínimo 15 palabras) respondiendo a la pregunta existencial planteada.',
        xpReward: 25,
        hint: 'Piensa en cómo nos sentimos cuando estamos agotados y la sociedad solo nos valora por lo que producimos.',
        prompt:
          '¿Por qué crees que Kafka eligió transformar a Gregor precisamente en un insecto rastrero y vulnerable, en lugar de una criatura poderosa?',
        guidanceQuestions: [
          '¿Cómo se relaciona la figura del insecto con la insignificancia social?',
          '¿Representa el cuerpo del bicho la forma en que Gregor ya se sentía tratado por su jefe y su familia?'
        ],
        minWords: 15,
        explanation:
          'Excelente análisis. La metamorfosis no es un castigo externo, sino la manifestación biológica y visible de la pequeñez, el rechazo y la repugnancia que el sistema sentía por un obrero agotado.'
      }
    ]
  },
  {
    id: 2,
    slug: 'la-puerta-cerrada',
    title: 'DIMENSIÓN 2. LA PUERTA CERRADA',
    subtitle: 'La incomunicación, la reacción familiar y el umbral del aislamiento',
    description:
      'La familia y el apoderado llaman insistentemente ante la puerta cerrada. Cuando Gregor por fin logra abrirla con sus mandíbulas, el horror estalla y el umbral se convierte en una barrera infranqueable.',
    characters: ['gregor_monstruo', 'padre', 'madre', 'grete', 'sung_jinwoo'],
    scenarioName: 'El Umbral y las Tres Puertas de la Habitación',
    literaryTheme: 'La incomunicación interpersonal, el miedo a lo diferente y la exclusión familiar',
    videoClip: '/assets/clips/dim2_puerta.mp4',
    posterImage: '/assets/clips/dim2_poster.jpg',
    videoStartTime: 2.8,
    videoEndTime: 4.1,
    briefing: {
      sungJinWooIntro:
        'Segunda dimensión. La puerta es más que madera y cerraduras: representa el límite entre la pertenencia social y el repudio absoluto. Observa cómo cada miembro de la casa responde ante lo desconocido.',
      objective: 'Analiza las actitudes de la familia y el apoderado cuando descubren la condición de Gregor.'
    },
    insignia: {
      id: 'insignia_puerta',
      name: 'Insignia del Umbral Silenciado',
      title: 'El Cerrojo Infranqueable',
      icon: 'Lock',
      color: 'from-amber-500 to-red-600',
      description: 'Otorgada por desentrañar los mecanismos del rechazo, la incomunicación y el encierro.'
    },
    activities: [
      {
        id: 'd2_act1',
        type: 'matching',
        title: 'Desafío 1: Reacciones ante el Umbral',
        instruction: 'Empareja a cada personaje con su reacción inmediata al contemplar a Gregor fuera de la habitación.',
        xpReward: 35,
        hint: 'Recuerda quién huye espantado, quién se desmaya y quién reacciona con violencia física inmediata.',
        prompt: 'Une el personaje con su actitud en el pasillo:',
        pairs: [
          {
            id: 'p1',
            left: 'El Padre',
            right: 'Blande un bastón y un periódico, empujando con furia a Gregor de vuelta al encierro.'
          },
          {
            id: 'p2',
            left: 'La Madre',
            right: 'Retrocede espantada, tropieza con sus faldas y cae al suelo presa de un ahogo asmático.'
          },
          {
            id: 'p3',
            left: 'El Apoderado',
            right: 'Se cubre la boca con la mano, da pasos hacia atrás aterrorizado y huye por la escalera.'
          },
          {
            id: 'p4',
            left: 'Grete',
            right: 'Llora angustiada desde la habitación contigua y corre a buscar un médico y un cerrajero.'
          }
        ],
        explanation:
          'Nadie acude a consolar a Gregor; cada figura exterioriza el pánico desde su propio rol: la fuga cobarde del representante del poder laboral, la histeria materna y la agresión del padre protector de las apariencias.'
      },
      {
        id: 'd2_act2',
        type: 'true_false',
        title: 'Desafío 2: Juicio de Acontecimientos en la Puerta',
        instruction: 'Evalúa la veracidad de las siguientes afirmaciones sobre la comunicación de Gregor.',
        xpReward: 35,
        hint: 'Piensa en qué le ocurre a las cuerdas vocales de Gregor cuando intenta hablar por primera vez.',
        statements: [
          {
            id: 'tf1',
            statement:
              'A pesar de su empeño, cuando Gregor responde desde el interior, los demás ya no escuchan palabras inteligibles, sino un chillido animal penetrante.',
            isTrue: true,
            justification:
              'Kafka señala que su voz se mezcla con un doloroso silbido incontrolable que distorsiona sus palabras hasta hacerlas incomprensibles para el oído humano.'
          },
          {
            id: 'tf2',
            statement:
              'Gregor abre la puerta fácilmente con sus manos humanas antes de que su cuerpo empiece a mutar.',
            isTrue: false,
            justification:
              'Falso. Gregor carece de dientes o dedos articulados; tiene que girar la llave en la cerradura haciendo fuerza tenaz con sus mandíbulas, derramando un líquido pardusco.'
          },
          {
            id: 'tf3',
            statement:
              'El apoderado muestra empatía y le ofrece una baja laboral remunerada para que se recupere con calma.',
            isTrue: false,
            justification:
              'Falso. El apoderado solo acusa a Gregor de negligencia injustificada, bajas ventas y de comprometer el honor de la firma comercial.'
          }
        ],
        explanation:
          'La imposibilidad de comunicarse consuma el aislamiento: cuando el lenguaje humano fracasa, la sociedad degrada al individuo a la categoría de monstruo.'
      },
      {
        id: 'd2_act3',
        type: 'decision',
        title: 'Desafío 3: Clave Interpretativa del Aislamiento',
        instruction: 'Elige la interpretación literaria más fundamentada sobre el significado de la puerta cerrada.',
        xpReward: 30,
        hint: 'Considera si la puerta protege a Gregor del exterior o protege a la familia de su propia vergüenza.',
        scenario:
          'Durante casi toda la obra, Gregor permanece confinado tras la puerta de su dormitorio, la cual primero se atrancó desde adentro por hábito y luego fue cerrada con cerrojo desde afuera por la familia.',
        options: [
          {
            id: 'opt_utilidad',
            title: 'La Ruptura del Contrato de Utilidad',
            interpretation:
              'La puerta cerrada materializa cómo la familia solo toleraba a Gregor mientras generaba ingresos; al cesar su rentabilidad, su presencia resulta insoportable y debe ser invisibilizada.',
            literaryWeight: 'Interpretación fundamental en la crítica sociológica de Kafka.'
          },
          {
            id: 'opt_accidente',
            title: 'Un Simple Protocolo Sanitario',
            interpretation:
              'La familia simplemente temía contraer una enfermedad contagiosa transmitida por un parásito común.',
            literaryWeight: 'Superficial: reduce una alegoría existencial a un mero incidente biológico.'
          },
          {
            id: 'opt_malentendido',
            title: 'Un Malentendido Pasajero de Convivencia',
            interpretation:
              'Gregor solo necesitaba unas horas de reposo y la puerta se cerró accidentalmente por el viento.',
            literaryWeight: 'Errónea: ignora el rechazo sistemático y consciente de los Samsa.'
          }
        ],
        explanation:
          '¡Exacto! La puerta cerrada es el dispositivo social con el que la familia niega la tragedia: esconder al que ya no puede producir ni encajar en la fachada burguesa.'
      }
    ]
  },
  {
    id: 3,
    slug: 'el-inventario-de-los-recuerdos',
    title: 'DIMENSIÓN 3. EL INVENTARIO DE LOS RECUERDOS',
    subtitle: 'Los objetos simbólicos, el canapé y la lucha por retener la condición humana',
    description:
      'Grete asume el rol de cuidadora y propone desalojar los muebles de la habitación para que Gregor pueda trepar por paredes y techo. Pero retirar sus muebles equivale a despojarlo de su pasado humano.',
    characters: ['gregor_monstruo', 'grete', 'madre', 'sung_jinwoo'],
    scenarioName: 'La Habitación Despojada y los Muebles en Disputa',
    literaryTheme: 'La memoria afectiva, el despojo de la identidad y la resistencia del alma humana',
    videoClip: '/assets/clips/dim3_inventario.mp4',
    posterImage: '/assets/clips/dim3_poster.jpg',
    videoStartTime: 4.1,
    videoEndTime: 5.4,
    briefing: {
      sungJinWooIntro:
        'Tercera dimensión, cazador. Aquí se libra una batalla silenciosa por la memoria. Los objetos de una habitación no son cosas inertes; son los anclajes de lo que una vez fuimos. Descubre por qué Gregor está dispuesto a morir defendiendo una estampa en la pared.',
      objective: 'Descifra el simbolismo de los objetos cotidianos y la transformación de la relación con Grete.'
    },
    insignia: {
      id: 'insignia_recuerdos',
      name: 'Insignia de la Memoria Humana',
      title: 'El Retrato de Armiño',
      icon: 'BookOpen',
      color: 'from-purple-500 to-indigo-600',
      description: 'Otorgada por salvaguardar el valor de la memoria humana frente a la animalización impuesta.'
    },
    activities: [
      {
        id: 'd3_act1',
        type: 'choose_objects',
        title: 'Desafío 1: El Inventario Simbólico',
        instruction:
          'Selecciona los 3 objetos cruciales que condensan la evolución interior de Gregor en esta dimensión.',
        xpReward: 35,
        hint: 'Busca el alimento que ahora prefiere, el escondite bajo el cual se oculta por pudor y el cuadro que cubre con su pecho.',
        prompt: 'Haz clic sobre los objetos de mayor relevancia narrativa en el relato:',
        requiredIds: ['leche_podrida', 'canape_manta', 'cuadro_pieles'],
        objects: [
          {
            id: 'leche_podrida',
            name: 'El Cuenco de Leche Dulce con Pan vs Restos Podridos',
            iconName: 'Utensils',
            isImportant: true,
            symbolism:
              'Antes era su bebida favorita; ahora le repugna la leche fresca y prefiere verduras pasadas y quesos rancios, marcando la mutación de sus sentidos biológicos.'
          },
          {
            id: 'canape_manta',
            name: 'El Canapé Cubierto con la Sábana',
            iconName: 'Bed',
            isImportant: true,
            symbolism:
              'El refugio donde pasa horas aplastado; pide a Grete cubrirlo con una sábana para ahorrarle a su hermana el suplicio de ver su cuerpo.'
          },
          {
            id: 'cuadro_pieles',
            name: 'El Retrato de la Dama del Manguito de Pieles',
            iconName: 'Image',
            isImportant: true,
            symbolism:
              'El objeto sagrado al que se aferra pegando su vientre caliente al cristal frío para impedir que se lo lleven, símbolo de su anhelo de amor humano.'
          },
          {
            id: 'monedas_oro',
            name: 'Bolsa de Monedas de Oro Ocultas',
            iconName: 'Coins',
            isImportant: false,
            symbolism: 'No existe en la novela; la familia vivía endeudada y el dinero era una fuente de presión.'
          },
          {
            id: 'espada_cazador',
            name: 'Daga de Sombras del Cazador',
            iconName: 'Shield',
            isImportant: false,
            symbolism: 'Elemento RPG de fantasía ajeno al texto original de Kafka.'
          }
        ],
        explanation:
          'La comida rancia, el canapé del pudor y el cuadro de la dama representan los tres ejes: la biología transformada, la vergüenza familiar y la resistencia agónica de su humanidad.'
      },
      {
        id: 'd3_act2',
        type: 'ordering',
        title: 'Desafío 2: Cronología del Vaciado de la Habitación',
        instruction: 'Ordena cronológicamente los acontecimientos ocurridos durante el traslado de los muebles.',
        xpReward: 35,
        hint: 'Primero Grete propone la idea a la madre, luego mueven el baúl y el escritorio, y finalmente Gregor sale a proteger el cuadro.',
        prompt: 'Arrastra u ordena del 1 al 4 los hechos narrativos:',
        items: [
          {
            id: 'ord1',
            text: 'Grete convence a la madre de retirar los muebles para dejarle espacio a Gregor para trepar libremente.',
            correctOrder: 1
          },
          {
            id: 'ord2',
            text: 'La madre expresa su temor de que retirar los muebles haga creer a Gregor que han perdido toda esperanza de que vuelva a ser humano.',
            correctOrder: 2
          },
          {
            id: 'ord3',
            text: 'Entre jadeos, madre e hija sacan el pesado baúl y el viejo escritorio donde Gregor escribía sus tareas escolares.',
            correctOrder: 3
          },
          {
            id: 'ord4',
            text: 'Desesperado por salvar al menos un recuerdo de su pasado, Gregor sube por la pared y cubre el cristal del cuadro con su cuerpo.',
            correctOrder: 4
          }
        ],
        explanation:
          'El debate entre Grete (pragmática y deshumanizadora) y la madre (aferrada a la esperanza humana) anticipa la victoria del desarraigo: al vaciar su habitación, la convierten en una cueva.'
      },
      {
        id: 'd3_act3',
        type: 'matching',
        title: 'Desafío 3: El Dilema entre Cuerpo y Memoria',
        instruction: 'Asocia cada postura con el personaje que la sostiene en esta dimensión.',
        xpReward: 30,
        hint: 'Analiza qué busca cada uno: libertad física animal, conservar la esperanza o salvar el último vestigio estético.',
        prompt: 'Empareja la postura con su defensor:',
        pairs: [
          {
            id: 'dilema1',
            left: 'La Madre',
            right: 'Desea dejar los muebles intactos para que cuando Gregor sane encuentre todo exactamente como era.'
          },
          {
            id: 'dilema2',
            left: 'Grete',
            right: 'Afirma con orgullo de cuidadora que la habitación debe vaciarse para la comodidad del insecto.'
          },
          {
            id: 'dilema3',
            left: 'Gregor Samsa',
            right: 'Siente que perder el escritorio y el cuadro significa olvidar definitivamente su pasado humano.'
          }
        ],
        explanation:
          'Gregor comprende el terrorífico precio de la comodidad física: ganar espacio para arrastrarse como insecto significa renunciar para siempre a su identidad espiritual como hombre.'
      }
    ]
  },
  {
    id: 4,
    slug: 'el-jefe-de-la-sombra',
    title: 'DIMENSIÓN 4. EL JEFE DE LA SOMBRA',
    subtitle: 'La manzana incrustada, la autoridad del padre y el desván del olvido',
    description:
      'Tras el desmayo de la madre, el padre regresa transformado en un severo ordenanza bancario. En una persecución implacable, bombardea a su hijo con manzanas; una se incrusta en su espalda provocando una herida que jamás sanará.',
    characters: ['gregor_monstruo', 'padre', 'madre', 'grete', 'sung_jinwoo'],
    scenarioName: 'El Salón Familiar y el Bombardeo de Manzanas',
    literaryTheme: 'El castigo paterno, la vulnerabilidad física y la degradación del espacio doméstico',
    videoClip: '/assets/clips/dim4_jefe.mp4',
    posterImage: '/assets/clips/dim4_poster.jpg',
    videoStartTime: 5.4,
    videoEndTime: 6.4,
    briefing: {
      sungJinWooIntro:
        'Cazador, nos adentramos en la dimensión más sombría. El padre de Gregor ya no es el anciano derrotado que yacía en cama: viste un uniforme rígido y ejerce su autoridad como un verdugo. Descubre cómo una fruta cotidiana se transforma en un proyectil de dolor incurable.',
      objective: 'Examina la agresión paterna, el simbolismo de la manzana podrida y la degradación del hogar.'
    },
    insignia: {
      id: 'insignia_manzana',
      name: 'Insignia del Caparazón Herido',
      title: 'La Manzana de Ceniza',
      icon: 'HeartCrack',
      color: 'from-rose-500 to-amber-700',
      description: 'Otorgada por resistir el impacto del castigo patriarcal y la podredumbre del abandono.'
    },
    activities: [
      {
        id: 'd4_act1',
        type: 'multiple_choice',
        title: 'Desafío 1: El Ataque de las Manzanas',
        instruction: 'Selecciona la interpretación literaria correcta sobre la agresión cometida por el padre.',
        xpReward: 25,
        hint: 'Piensa en las consecuencias físicas y simbólicas de la manzana que queda clavada en el dorso de Gregor.',
        question:
          '¿Cuál es la trascendencia decisiva del ataque en el que el padre arroja manzanas del frutero contra Gregor?',
        options: [
          'Una manzana se hunde profundamente en su espalda quitinosa; nadie se atreve a extraerla y se pudre lentamente en su carne, mermando su movilidad de por vida.',
          'Las manzanas rebotan inofensivamente en su duro caparazón y el padre se rinde exhausto pidiendo perdón.',
          'Gregor come las manzanas con deleite, logrando recuperar temporalmente su aspecto humano original.',
          'Grete interviene valientemente derribando al padre para proteger a su hermano de cualquier agresión.'
        ],
        correctIndex: 0,
        explanation:
          'La manzana incrustada es uno de los símbolos más sobrecogedores de Kafka: alude a la caída bíblica y al castigo arbitrario del padre. La manzana podrida en el lomo de Gregor es el estigma vivo del repudio familiar.'
      },
      {
        id: 'd4_act2',
        type: 'fill_blank',
        title: 'Desafío 2: La Habitación Convertida en Trastero',
        instruction: 'Completa la descripción sobre la decadencia del aposento de Gregor.',
        xpReward: 25,
        hint: 'La familia alquila una habitación a tres caballeros y arroja todo lo inservible al cuarto de Gregor.',
        preText: 'Para obtener ingresos tras la quiebra, la familia hospeda a tres inquilinos y la habitación de Gregor se convierte en un',
        blankAnswer: 'depósito de trastos inservibles',
        postText: ', acumulando cenizas, muebles viejos, cajas y desperdicios que le impiden cualquier movimiento.',
        options: [
          'depósito de trastos inservibles',
          'templo sagrado de meditación',
          'salón de baile de lujo',
          'laboratorio de alquimia'
        ],
        explanation:
          'Gregor ya no es tratado como un enfermo, sino como un contenedor de suciedad. Los objetos que la familia no quiere que vean los tres huéspedes burgueses se tiran a su cuarto, consumando su total invisibilidad.'
      },
      {
        id: 'd4_act3',
        type: 'true_false',
        title: 'Desafío 3: El Poder Renovado del Padre',
        instruction: 'Analiza si las siguientes aseveraciones sobre la metamorfosis social del padre son verdaderas.',
        xpReward: 25,
        hint: 'Observa la paradoja: al enfermar Gregor, el padre recupera su energía y su puesto de trabajo.',
        statements: [
          {
            id: 'tf_padre1',
            statement:
              'Antes de la transformación, el padre pasaba los días hundido en un sillón con bata; tras el cambio, viste con orgullo un uniforme azul con botones dorados de ordenanza bancaria.',
            isTrue: true,
            justification:
              'Cierto. La debilidad de Gregor provoca la revitalización del padre, quien duerme incluso uniformado como si no pudiera despojarse de su renovada autoridad.'
          },
          {
            id: 'tf_padre2',
            statement:
              'La madre le quita el bastón al padre y asume ella misma el mando de la casa despidiendo a los tres huéspedes.',
            isTrue: false,
            justification:
              'Falso. La madre se abraza suplicante al cuello del padre pidiendo piedad por la vida de Gregor, manteniéndose en un estado de total subordinación.'
          },
          {
            id: 'tf_padre3',
            statement:
              'Como compensación por la herida, la familia decide abrir la puerta del salón al anochecer para que Gregor observe a la familia reunida desde la penumbra.',
            isTrue: true,
            justification:
              'Cierto. Durante un tiempo, abren la rendija para aliviar la culpa moral, permitiéndole atisbar en silencio el cuadro de la familia trabajando.'
          }
        ],
        explanation:
          'Existe una ley cruel en la novela: la vitalidad de la familia florece a expensas directas de la agonía física y emocional de Gregor.'
      },
      {
        id: 'd4_act4',
        type: 'decision',
        title: 'Desafío 4: Análisis del Silencio y la Culpa',
        instruction: 'Elige la interpretación más lúcida sobre la sumisión de Gregor durante el ataque.',
        xpReward: 25,
        hint: '¿Por qué Gregor nunca ataca a su padre ni intenta defenderse con violencia?',
        scenario:
          'Pese a poseer garras y mandíbulas, Gregor solo atina a correr en círculos desconcertado, implorando la piedad de su agresor sin ofrecer la menor resistencia física.',
        options: [
          {
            id: 'opt_culpa',
            title: 'La Culpa Filial Internalizada',
            interpretation:
              'Gregor asume la culpa moral de haber fallado como sostén económico; para él, el padre encarna una autoridad sagrada contra la cual rebelarse es impensable.',
            literaryWeight: 'Pilar central del pensamiento kafkiano sobre la relación con la figura paterna.'
          },
          {
            id: 'opt_cobardia',
            title: 'Mera Cobardía Biológica',
            interpretation: 'Los insectos carecen de valor marcial y por puro instinto huyen de cualquier sombra.',
            literaryWeight: 'Insuficiente: despoja a Gregor de su profunda vida moral y psicológica.'
          },
          {
            id: 'opt_juego',
            title: 'Un Juego Malentendido',
            interpretation: 'Gregor creyó que su padre le estaba lanzando frutas para que jugara a atraparlas.',
            literaryWeight: 'Totalmente ajena al dramatismo y rigor del texto literario.'
          }
        ],
        explanation:
          'Gregor no puede rebelarse porque comparte la lógica que lo condena: se siente culpable de existir sin ser productivo.'
      }
    ]
  },
  {
    id: 5,
    slug: 'la-ultima-cancion',
    title: 'DIMENSIÓN 5. LA ÚLTIMA CANCIÓN',
    subtitle: 'El violín de Grete, la sentencia final y la trascendencia del cazador',
    description:
      'Grete toca el violín para los huéspedes. Atraído por la melodía, Gregor abandona su escondite movido por un amor sublime. El escándalo desencadena la sentencia definitiva de la hermana y el amanecer de una nueva vida sin él.',
    characters: ['gregor_monstruo', 'grete', 'padre', 'madre', 'sung_jinwoo'],
    scenarioName: 'El Salón Iluminado, el Concierto de Violín y la Madrugada',
    literaryTheme: 'El arte como salvación, la muerte voluntaria por amor y la hipocresía de la normalidad',
    videoClip: '/assets/clips/dim5_cancion.mp4',
    posterImage: '/assets/clips/dim5_poster.jpg',
    videoStartTime: 6.4,
    videoEndTime: 7.8,
    briefing: {
      sungJinWooIntro:
        'Has alcanzado la quinta y última dimensión, cazador. Esta es la prueba cumbre. Cuando la música resuena, la frontera entre el monstruo y el ser humano se disuelve por completo. Escucha con atención el violín de Grete y acompaña a Gregor en su despedida.',
      objective: 'Interpreta el clímax estético de la obra, la sentencia de Grete y el desenlace final.'
    },
    insignia: {
      id: 'insignia_cancion',
      name: 'Insignia de la Melodía Eterna',
      title: 'El Violín Resonante',
      icon: 'Music',
      color: 'from-amber-400 via-rose-500 to-purple-600',
      description: 'Otorgada por comprender que la sensibilidad hacia el arte y el amor trasciende toda forma física.'
    },
    activities: [
      {
        id: 'd5_act1',
        type: 'multiple_choice',
        title: 'Desafío 1: El Poder Trascendente de la Música',
        instruction: 'Responde a la célebre interrogante que Gregor se formula al escuchar el violín de su hermana.',
        xpReward: 25,
        hint: 'Kafka contrasta la indiferencia grosera de los huéspedes con la devoción estética de Gregor.',
        question:
          'Mientras los tres huéspedes fuman aburridos ignorando el violín de Grete, Gregor avanza cautivado por la música y piensa: «¿Acaso era un animal, cuando la música le conmovía tanto?». ¿Qué nos revela este momento cumbre?',
        options: [
          'Que Gregor es el único ser verdaderamente humano y sensible en esa casa; la familia y los huéspedes son los verdaderos monstruos vacíos de espíritu.',
          'Que el violín tenía un hechizo sónico que aturde los oídos de cualquier artrópodo gigante.',
          'Que Gregor quería arrebatarle el violín para venderlo y pagar la renta atrasada a los huéspedes.',
          'Que deseaba asustar a los presentes para demostrar su superioridad física en el combate.'
        ],
        correctIndex: 0,
        explanation:
          'Es una de las frases más conmovedoras de la literatura universal: el cuerpo es de insecto, pero su alma es la única capaz de sentir la belleza pura del arte y el amor hacia su hermana.'
      },
      {
        id: 'd5_act2',
        type: 'matching',
        title: 'Desafío 2: La Sentencia de los Samsa',
        instruction: 'Empareja a cada miembro de la familia con su dictamen definitivo tras ser descubiertos por los huéspedes.',
        xpReward: 25,
        hint: 'Presta atención a quién pronuncia las palabras más tajantes: «Tenemos que intentar quitárnoslo de encima».',
        prompt: 'Une el personaje con su veredicto:',
        pairs: [
          {
            id: 'sent1',
            left: 'Grete (La Hermana)',
            right: 'Golpea la mesa y declara: «¡No quiero pronunciar el nombre de mi hermano ante este monstruo! Tenemos que librarnos de él».'
          },
          {
            id: 'sent2',
            left: 'El Padre',
            right: 'Asiente sombrío ante el argumento de Grete, murmurando: «Ojalá pudiera entendernos... si nos comprendiera, se marcharía por su cuenta».'
          },
          {
            id: 'sent3',
            left: 'Gregor Samsa',
            right: 'Comprende el deseo unánime de su familia; se da la vuelta penosamente con su cuerpo maltrecho y regresa a morir a su cuarto con amor y emoción hacia ellos.'
          }
        ],
        explanation:
          'Grete consuma la exclusión al negar su identidad: al llamarlo "eso" y negarle el nombre de hermano, allana el camino para su eliminación sin remordimiento moral.'
      },
      {
        id: 'd5_act3',
        type: 'ordering',
        title: 'Desafío 3: El Desenlace y el Nuevo Amanecer',
        instruction: 'Ordena la secuencia cronológica de los instantes finales de la novela.',
        xpReward: 25,
        hint: 'Desde el cierre con llave de la puerta hasta el paseo familiar en tranvía al sol de primavera.',
        prompt: 'Organiza del 1 al 4 los hechos del desenlace:',
        items: [
          {
            id: 'fin1',
            text: 'Gregor exhala su último aliento en la oscuridad de la madrugada, pensando en su familia con ternura y emoción.',
            correctOrder: 1
          },
          {
            id: 'fin2',
            text: 'Por la mañana, la sirvienta descubre el cadáver completamente seco y plano de Gregor y avisa a los señores Samsa.',
            correctOrder: 2
          },
          {
            id: 'fin3',
            text: 'El señor Samsa expulsa de la casa a los tres huéspedes estupefactos y despide a la sirvienta para cerrar el ciclo del horror.',
            correctOrder: 3
          },
          {
            id: 'fin4',
            text: 'Los padres y Grete toman un tranvía hacia las afueras, aliviados, observando cómo la joven hermana se ha convertido en una muchacha hermosa y casadera.',
            correctOrder: 4
          }
        ],
        explanation:
          'El final es desgarradoramente irónico: la muerte de Gregor no deja duelo, sino un florecimiento radiante y egoísta de la familia, que renace llena de planes burgueses.'
      },
      {
        id: 'd5_act4',
        type: 'reflection',
        title: 'Desafío 4: El Legado Crítico del Cazador',
        instruction:
          'Responde a la reflexión final (mínimo 20 palabras) demostrando tu comprensión integral de la obra.',
        xpReward: 25,
        hint: 'Conecta la historia de Gregor con la soledad de los ancianos, enfermos o personas que pierden su trabajo hoy en día.',
        prompt:
          'Como cazador que ha recorrido las cinco dimensiones: ¿Qué nos enseña la historia de Gregor Samsa sobre cómo trata nuestra sociedad actual a quienes dejan de ser "útiles" o se vuelven una carga?',
        guidanceQuestions: [
          '¿Existe hoy una tendencia a aislar y olvidar al vulnerable?',
          '¿Qué significa la frase de Sung Jin-Woo: "No se trata solo de sobrevivir, sino de comprender"?'
        ],
        minWords: 20,
        explanation:
          '¡Impresionante reflexión! Has demostrado la verdadera victoria del cazador: no vencer monstruos con espadas, sino adquirir empatía profunda para no convertirnos en los verdugos de nuestros propios semejantes.'
      }
    ]
  }
];
