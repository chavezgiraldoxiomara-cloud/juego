import { Character } from '../types/game';

export const CHARACTERS: Record<string, Character> = {
  gregor_humano: {
    id: 'gregor_humano',
    name: 'Gregor Samsa (Humano)',
    title: 'Jugador E - Sobreviviente',
    role: 'Viajante de comercio y sostén económico familiar',
    rankBadge: 'Rango E',
    avatar: '/assets/aistudio/gregor_humano9_7b57933f.jpg',
    description:
      'Un joven viajante de comercio atrapado en una rutina asfixiante para saldar la deuda de sus padres. Trabaja incansablemente sin reconocimiento alguno, sosteniendo sobre sus hombros el bienestar de toda su familia.',
    quote: '«¿Qué me ha ocurrido? No era un sueño; su habitación, una auténtica habitación humana...»',
    lore: 'Representa la alienación laboral, el sacrificio silencioso y la deshumanización que sufre el individuo en la sociedad moderna antes de que ocurra la metamorfosis física.'
  },
  gregor_monstruo: {
    id: 'gregor_monstruo',
    name: 'Gregor Samsa (Transformado)',
    title: 'Forma Monstruo - Avatar de Supervivencia S-Rank',
    role: 'El marginado incomunicado / Conciencia pura',
    rankBadge: 'Forma Monstruo',
    avatar: '/assets/aistudio/gregor_transformado_302131af.jpg',
    description:
      'Al despertar una mañana tras un sueño intranquilo, Gregor se descubre transformado en un monstruoso insecto acorazado con numerosas patas débiles. A pesar de su apariencia exterior aterradora, conserva intacta su sensibilidad y anhelo humano.',
    quote: '«¿Acaso era un animal, cuando la música le conmovía tanto?»',
    lore: 'La transformación materializa la pérdida de utilidad productiva. Deja de ser un hijo proveedor para convertirse en una carga vergonzosa que la familia busca ocultar y aislar tras puertas cerradas.'
  },
  sung_jinwoo: {
    id: 'sung_jinwoo',
    name: 'Sung Jin-Woo',
    title: 'El Cazador Guía',
    role: 'Mentor dimensional y guía táctico',
    rankBadge: 'Monarca Guía',
    avatar: '/assets/aistudio/guia_sun_aaf144ab.jpg',
    description:
      'El cazador legendario que ha ascendido desde el rango más bajo. Conoce el peso de la soledad, el sacrificio y la lucha por sobrevivir cuando el mundo te da la espalda. Acompaña al estudiante a descifrar los misterios de cada dimensión.',
    quote: '«No se trata solo de sobrevivir al calabozo, cazador... se trata de comprender el alma humana.»',
    lore: 'Actúa como puente reflexivo entre las mecánicas RPG de superación y las profundas preguntas existenciales planteadas por Franz Kafka.'
  },
  padre: {
    id: 'padre',
    name: 'El Padre',
    title: 'La Autoridad y el Juicio',
    role: 'Patriarca severo y ejecutor de la expulsión',
    rankBadge: 'Autoridad Familiar',
    avatar: '/assets/aistudio/PADRE_c21fc645.jpg',
    description:
      'Un hombre severo y autoritario. Tras el declive de sus negocios, vivió en la indolencia mantenido por Gregor; no obstante, tras la transformación, retoma su uniforme bancario y ejerce una violencia despiadada contra su hijo.',
    quote: '«¡A su habitación! ¡Afuera!»',
    lore: 'Simboliza la figura del poder patriarcal represivo (un eco de la tensa relación de Franz Kafka con su propio padre, Hermann Kafka). Su agresión con manzanas marca el principio del fin de Gregor.'
  },
  madre: {
    id: 'madre',
    name: 'La Madre',
    title: 'La Fragilidad y la Angustia',
    role: 'Matriarca asmática y afecto paralizado',
    rankBadge: 'La Fragilidad',
    avatar: '/assets/aistudio/MADRE_e9b361d8.webp',
    description:
      'Aquejada de asma crónica y una fragilidad constante. Se debate entre el amor maternal hacia su primogénito y el espanto irremediable que le provoca contemplar su cuerpo monstruoso.',
    quote: '«¡Por piedad! ¡No le hagas daño, es nuestro hijo!»',
    lore: 'Encarna la impotencia y la parálisis emocional. Desea acercarse a Gregor, pero cada intento culmina en desmayos y crisis de ahogo, cediendo todo el control represivo al padre.'
  },
  grete: {
    id: 'grete',
    name: 'Grete Samsa',
    title: 'La Hermana - La Compasión y el Cambio',
    role: 'La cuidadora inicial convertida en jueza final',
    rankBadge: 'La Hermana',
    avatar: '/assets/grete_portrait.jpg',
    description:
      'Hermana de diecisiete años que al inicio asume con afecto el cuidado de Gregor: le lleva alimentos y limpia su habitación. Sin embargo, a medida que la carga se vuelve insostenible, su compasión muta en rencor y es ella quien decreta la necesidad de expulsarlo.',
    quote: '«Tenemos que intentar quitárnoslo de encima... No es posible vivir con una bestia semejante.»',
    lore: 'Su violín es el último lazo espiritual que conmueve a Gregor. Su evolución representa la dolorosa transformación del afecto en hastío utilitario y la emancipación de una nueva generación.'
  }
};
