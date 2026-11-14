export type SectionId =
  | 'inicio'
  | 'cerebro'
  | 'olvido'
  | 'lisosoma'
  | 'circadiano'
  | 'bibliografia';

export type DisciplineKey =
  | 'Ingeniería'
  | 'Derecho'
  | 'Medicina'
  | 'Psicología'
  | 'Educación';

export interface BrainHotspot {
  id: string;
  code: string;
  title: string;
  shortLabel: string;
  circuitType: string;
  neurotransmitters: string;
  coordinates: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  };
  regulatedMechanism: string;
  dysregulatedMechanism: string;
  universityApplication: string;
  caseReference: string;
  differentialModel: string;
  verificationQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
}

export interface LysosomeEntry {
  id: string;
  discipline: DisciplineKey;
  subject: string;
  basuraReutilizable: string;
  procesamientoLisosomal: string;
  componenteReciclado: string;
  neurobiologicalMechanism: string;
  isCustom?: boolean;
  pruned?: boolean;
}

export interface ApaReference {
  id: string;
  citation: string;
  url: string;
  accessLabel: string;
  summary: string;
  topic: string;
}

export const MODULE_METADATA = {
  institution: 'Corporación Universitaria del Caribe (CECAR)',
  program: 'Diplomado de Formación en Docencia Universitaria · Grupo 2026-2 (Sincelejo)',
  moduleTitle: 'Del Cerebro al Aula: Un Aprendizaje Multidimensional',
  tutor: 'Mg. Amaury Chagui Hernández',
  totalHours: 20,
  sessions: 2,
  cohortSize: 26,
  competence:
    'Analiza la relación entre el funcionamiento cerebral, las emociones y la metacognición con los procesos de aprendizaje en el aula, aplicando estrategias neurodidácticas que favorezcan un aprendizaje integral y significativo.',
  learningOutcomes: [
    'Caracterizar los circuitos neurobiológicos de la regulación emocional, la recompensa dopaminérgica y el control atencional en situaciones universitarias complejas.',
    'Modelar matemáticamente el decaimiento mnémico y programar intervalos de repaso espaciado para mitigar la pendiente de olvido.',
    'Transformar contenidos declarativos perecederos en competencias genéricas duraderas mediante el esquema de autofagia neurocognitiva.',
    'Evaluar la incidencia de la luz azul nocturna, la privación del sueño y la depuración glinfática sobre la memoria de trabajo y el desempeño docente.'
  ],
  thematicAxes: [
    {
      axis: 'Temática 1',
      title: 'Neurodidáctica de la Emoción',
      focus: 'Red Amígdala-vmPFC, contención en escenarios aversivos (Caso Detachment) y Error de Predicción de Dopamina.'
    },
    {
      axis: 'Temática 2',
      title: 'Perceptrón Significativo: Memoria y Lenguaje',
      focus: 'Curva del olvido (dR/dt = -kR), poda sináptica lisosomal y limpieza glinfática en fases No-REM y REM.'
    },
    {
      axis: 'Temática 3',
      title: 'Atención y Metaconsciencia',
      focus: 'Sistema acoplado Atención-Metacognición (redes de Posner) y canal de flujo (Reto ≈ Habilidad).'
    },
    {
      axis: 'Temática 4',
      title: 'Sapiens Resolutivo (ABP / ABR)',
      focus: 'Inhibición de la economía cognitiva ciega en la corteza prefrontal dorsolateral ante problemas complejos.'
    }
  ]
};

export const BRAIN_HOTSPOTS: BrainHotspot[] = [
  {
    id: 'amygdala-vmpfc',
    code: 'N-01',
    title: 'Red Amígdala – Corteza Prefrontal Ventromedial (vmPFC)',
    shortLabel: 'Amígdala / vmPFC',
    circuitType: 'Circuito de regulación emocional top-down y respuesta autonómica',
    neurotransmitters: 'GABA · Glutamato · Cortisol · Noradrenalina',
    coordinates: { x: 358, y: 318, targetX: 162, targetY: 282 },
    regulatedMechanism:
      'La vmPFC ejerce modulación inhibitoria gabaérgica sobre el núcleo basolateral de la amígdala. Ante un conflicto en el aula, la respiración lenta activa el nervio vago, reduce la descarga simpática y preserva la disponibilidad cognitiva del docente.',
    dysregulatedMechanism:
      'Secuestro amigdalino: la percepción de hostilidad o humillación dispara el eje HPA (cortisol/adrenalina), desconecta funcionalmente la corteza prefrontal y precipita respuestas impulsivas defensivas o evitación rígida.',
    universityApplication:
      'Caso situacional "Detachment" (Sr. Barthes y Jerry): la contención verbal firme sin escalada afectiva impide el contagio emocional aversivo, desactiva la reactividad límbica del estudiante y restituye la ventana de aprendizaje.',
    caseReference: 'Temática 1 · Escena situacional en aula y respiración consciente',
    differentialModel: 'dE/dt = -α·vmPFC(t) + β·Amenaza(t)',
    verificationQuestion: {
      prompt:
        'Durante una confrontación verbal hostil en el aula universitaria, ¿qué mecanismo neurobiológico explica la pérdida súbita de capacidad argumentativa si el docente responde desde la ira?',
      options: [
        'Sobreactivación amigdalina con elevación de catecolaminas que inhibe transitoriamente la transmisión sináptica en la corteza prefrontal.',
        'Consolidación acelerada en el hipocampo durante la fase REM diurna por exceso de serotonina.',
        'Activación inmediata del sistema glinfático que drena el líquido cefalorraquídeo hacia la corteza motora.'
      ],
      correctIndex: 0,
      rationale:
        'El estrés agudo eleva noradrenalina y cortisol, debilitando las conexiones recurrentes de la corteza prefrontal mientras potencia el procesamiento reactivo de la amígdala.'
    }
  },
  {
    id: 'vta-accumbens',
    code: 'N-02',
    title: 'Área Ventral Tegmental (VTA) – Núcleo Accumbens',
    shortLabel: 'VTA / Accumbens',
    circuitType: 'Vía mesolímbica de anticipación y Error de Predicción de Dopamina (EPD)',
    neurotransmitters: 'Dopamina (receptores D1 / D2)',
    coordinates: { x: 404, y: 342, targetX: 282, targetY: 274 },
    regulatedMechanism:
      'Retos calibrados con retroalimentación próxima generan disparos fásicos de dopamina desde el VTA hacia el estriado ventral. La dopamina sostiene la conducta exploratoria y la tolerancia al esfuerzo cognitivo.',
    dysregulatedMechanism:
      'Error de Predicción Negativo o saturación por pantallas: tareas ambiguas e inalcanzables deprimen la dopamina por debajo de la línea basal. El estudiante migra hacia estímulos de costo energético nulo (redes sociales o copia acrítica de IA).',
    universityApplication:
      'Taller vivencial EPD: alternar micro-retos alcanzables (acertijos lógicos con límite breve) y analizar el sesgo de automatización evita la deserción atencional en sesiones sincrónicas.',
    caseReference: 'Temática 1 · Experimento EPD (Reto equilibrado vs. Economía cognitiva)',
    differentialModel: 'EPD = Recompensa Observada − Recompensa Esperada',
    verificationQuestion: {
      prompt:
        'Desde la neurobiología de la recompensa, ¿por qué un estudiante universitario delega un ensayo completo a un modelo generativo sin leer la bibliografía?',
      options: [
        'Porque el sistema dopaminérgico responde únicamente a la relajación muscular posterior al sueño profundo.',
        'Porque la economía cognitiva prioriza la recompensa inmediata con mínimo gasto metabólico cuando la tarea carece de micro-logros intrínsecos.',
        'Porque la corteza visual primaria bloquea la lectura de textos académicos superiores a dos páginas.'
      ],
      correctIndex: 1,
      rationale:
        'Cuando el esfuerzo percibido supera la expectativa de recompensa o retroalimentación inmediata, el circuito mesolímbico favorece rutas de bajo costo biológico.'
    }
  },
  {
    id: 'hippocampus-glymphatic',
    code: 'N-03',
    title: 'Tríada Hipocampo – Neocórtex – Sistema Glinfático',
    shortLabel: 'Hipocampo / Glinfático',
    circuitType: 'Consolidación hebbiana, poda sináptica y depuración metabólica',
    neurotransmitters: 'Acetilcolina · Glutamato (NMDA/AMPA) · Adenosina',
    coordinates: { x: 382, y: 300, targetX: 486, targetY: 162 },
    regulatedMechanism:
      'Durante la vigilia atenta, el hipocampo indexa huellas episódicas; durante las ondas lentas No-REM, las reactiva hacia el neocórtex mientras los canales glinfáticos perivasculares expanden su flujo para depurar adenosina y péptidos beta-amiloides.',
    dysregulatedMechanism:
      'El trasnocho frente a pantallas inhibe la melatonina, recorta las fases No-REM/REM e impide la transferencia hipocampo-neocortical. La acumulación de adenosina y desechos metabólicos acelera la pendiente de olvido.',
    universityApplication:
      'Articular el repaso espaciado con higiene del sueño y pausas de consolidación evita evaluar únicamente retención efímera dependiente del hipocampo.',
    caseReference: 'Temática 2 · Curva del Olvido, Autofagia y Cronobiología',
    differentialModel: 'dR/dt = −k·R  |  R(t) = R₀·e^(−k·t)',
    verificationQuestion: {
      prompt:
        '¿Qué ocurre en la tríada hipocampo-neocórtex cuando un estudiante estudia de madrugada suprimiendo el sueño de ondas lentas?',
      options: [
        'Se optimiza la transferencia de esquemas hacia la corteza asociativa gracias al incremento de cortisol nocturno.',
        'Se interrumpe la reactivación sináptica nocturna y la depuración de adenosina, elevando la constante de olvido k.',
        'El hipocampo duplica su volumen de almacenamiento permanente sin requerir consolidación cortical.'
      ],
      correctIndex: 1,
      rationale:
        'La transferencia de memoria reciente a redes neocorticales duraderas y la limpieza glinfática requieren ciclos íntegros de sueño No-REM y REM.'
    }
  },
  {
    id: 'acc-posner',
    code: 'N-04',
    title: 'Corteza Cingulada Anterior (ACC) y Red Atencional de Posner',
    shortLabel: 'ACC / Red Posner',
    circuitType: 'Detección de conflicto cognitivo, alarma metacognitiva y orientación ejecutiva',
    neurotransmitters: 'Noradrenalina (Locus Coeruleus) · Acetilcolina · Dopamina',
    coordinates: { x: 294, y: 174, targetX: 446, targetY: 118 },
    regulatedMechanism:
      'La ACC monitoriza discrepancias entre la atención esperada y la atención real, activando la alarma metacognitiva M. Cuando el reto de la tarea equipara la habilidad (R ≈ H), el sistema alcanza estabilidad operativa (flujo).',
    dysregulatedMechanism:
      'La multitarea digital fragmenta el locus coeruleus: la atención A oscila de forma abrupta, la alarma metacognitiva M se retrasa o se agota, y el estudiante lee páginas enteras sin procesamiento semántico.',
    universityApplication:
      'Interrupciones activas cada 15 minutos en clase sincrónica, preguntas predictivas (ejercicio Emergence) y pausas de monitoreo consciente reactivan la ACC antes de la deriva atencional.',
    caseReference: 'Temática 3 · Sistema Atención-Metacognición y Estado de Flujo',
    differentialModel: 'dA/dt = −a·A + b·M  |  dM/dt = c·(A_ideal − A) − d·M',
    verificationQuestion: {
      prompt:
        'En el modelo acoplado Atención (A) – Metacognición (M), ¿qué condición caracteriza el estado de flujo durante una actividad universitaria?',
      options: [
        'El nivel de reto excede ampliamente la habilidad del estudiante, disparando la alarma M de forma continua.',
        'El equilibrio entre reto y habilidad mantiene A elevada y estable, reduciendo la brecha de error y silenciando la alarma M.',
        'La atención A desciende a cero mientras el estudiante cambia de pestaña cada dos minutos.'
      ],
      correctIndex: 1,
      rationale:
        'Cuando A real iguala la demanda de la tarea (equilibrio reto-habilidad), la discrepancia se aproxima a cero y el monitoreo metacognitivo no precisa intervenir con fricción.'
    }
  },
  {
    id: 'dlpfc',
    code: 'N-05',
    title: 'Corteza Prefrontal Dorsolateral (dlPFC)',
    shortLabel: 'dlPFC (Ejecutiva)',
    circuitType: 'Control ejecutivo, memoria de trabajo e inhibición de atajos cognitivos',
    neurotransmitters: 'Dopamina (mesocortical) · Noradrenalina · Glutamato',
    coordinates: { x: 186, y: 162, targetX: 256, targetY: 120 },
    regulatedMechanism:
      'La dlPFC sostiene representaciones activas en la memoria de trabajo, inhibe la respuesta intuitiva automática (economía cognitiva) y coordina el razonamiento hipotético-deductivo necesario en el aprendizaje basado en problemas (ABP/ABR).',
    dysregulatedMechanism:
      'La fatiga metabólica, la privación del sueño y el hábito de delegar el análisis a herramientas externas debilitan la activación sostenida de la dlPFC, dejando el juicio clínico o profesional a merced de heurísticos superficiales.',
    universityApplication:
      'Diseño de casos reales con dilemas deontológicos y ambigüedad controlada ("Sapiens Resolutivo"): obligan al estudiante a comparar hipótesis, detectar falacias y justificar decisiones.',
    caseReference: 'Temática 4 · Razonamiento profundo (ABP/ABR) y deontología',
    differentialModel: 'Capacidad Ejecutiva = f(Memoria de Trabajo, Inhibición, Descanso)',
    verificationQuestion: {
      prompt:
        '¿Por qué los estudios de caso con información ambigua y conflicto ético fortalecen la corteza prefrontal dorsolateral frente a las pruebas puramente memorísticas?',
      options: [
        'Porque exigen inhibir respuestas automáticas, sostener variables simultáneas en memoria de trabajo y evaluar consecuencias.',
        'Porque eliminan por completo la participación del sistema límbico y de la memoria episódica.',
        'Porque permiten responder por reconocimiento literal sin activar redes asociativas.'
      ],
      correctIndex: 0,
      rationale:
        'El Aprendizaje Basado en Problemas y Retos demanda control inhibitorio, flexibilidad cognitiva y actualización continua en la dlPFC.'
    }
  }
];

export const LYSOSOME_PRESETS: Record<DisciplineKey, LysosomeEntry[]> = {
  Ingeniería: [
    {
      id: 'ing-1',
      discipline: 'Ingeniería',
      subject: 'Ecuaciones Diferenciales y Modelado',
      basuraReutilizable:
        'Memorización mecánica de tablas de transformadas de Laplace y fórmulas aisladas sin contexto físico ni verificación dimensional.',
      procesamientoLisosomal:
        'Reto ABP: modelar la estabilidad térmica de una planta de procesamiento con falla en un sensor de retroalimentación y datos incompletos.',
      componenteReciclado:
        'Razonamiento sistémico, modelado dinámico de variables acopladas y criterio de seguridad operacional en ingeniería.',
      neurobiologicalMechanism:
        'La poda sináptica descarta el recuerdo literal de coeficientes y consolida esquemas causales en redes frontoparietales.'
    },
    {
      id: 'ing-2',
      discipline: 'Ingeniería',
      subject: 'Inteligencia Artificial y Ética de Datos',
      basuraReutilizable:
        'Sintaxis repetitiva de librerías obsoletas o listas de hiperparámetros copiados de repositorios sin análisis crítico.',
      procesamientoLisosomal:
        'Auditoría de un algoritmo de selección de personal con sesgo histórico documentado frente a un comité de cumplimiento normativo.',
      componenteReciclado:
        'Responsabilidad deontológica, pensamiento algorítmico crítico y evaluación de impacto socio-técnico.',
      neurobiologicalMechanism:
        'El conflicto cognitivo activa la dlPFC y la ACC, integrando principios éticos con validación matemática.'
    }
  ],
  Derecho: [
    {
      id: 'der-1',
      discipline: 'Derecho',
      subject: 'Derecho Constitucional y Procesal',
      basuraReutilizable:
        'Recitación literal de números de artículos y fechas de promulgación susceptibles de consulta instantánea en bases normativas.',
      procesamientoLisosomal:
        'Simulación de audiencia ante tutela con colisión entre derecho a la intimidad digital y transparencia administrativa en entidad pública.',
      componenteReciclado:
        'Ponderación jurídica, argumentación probatoria sólida y discernimiento deontológico en la toma de decisiones.',
      neurobiologicalMechanism:
        'El procesamiento asociativo reemplaza la huella declarativa frágil por redes semánticas de argumentación normativa.'
    },
    {
      id: 'der-2',
      discipline: 'Derecho',
      subject: 'Criminología y Política Criminal',
      basuraReutilizable:
        'Listado aislado de tipologías penales históricas memorizadas únicamente para una prueba de selección simple.',
      procesamientoLisosomal:
        'Estudio de caso sobre reincidencia juvenil usando modelos dinámicos de intervención comunitaria frente a medidas exclusivamente punitivas.',
      componenteReciclado:
        'Análisis empírico de política pública, lectura crítica de evidencia criminológica y enfoque diferencial.',
      neurobiologicalMechanism:
        'La carga emocional regulada ancla el caso en la memoria episódica y transfiere criterios analíticos a la corteza asociativa.'
    }
  ],
  Medicina: [
    {
      id: 'med-1',
      discipline: 'Medicina',
      subject: 'Semiología y Urgencias Clínicas',
      basuraReutilizable:
        'Listas extensas de epónimos raros y valores bioquímicos memorizados de forma descontextualizada la noche previa al examen.',
      procesamientoLisosomal:
        'Simulación clínica bajo presión temporal con paciente polimedicado que presenta disnea aguda, fibrilación y datos contradictorios de laboratorio.',
      componenteReciclado:
        'Diagnóstico diferencial integrado, gestión de la memoria de trabajo bajo estrés y comunicación clínica empática.',
      neurobiologicalMechanism:
        'Integra memoria procedimental, episódica y asociativa mientras regula la reactividad amigdalina en escenarios críticos.'
    },
    {
      id: 'med-2',
      discipline: 'Medicina',
      subject: 'Neuroanatomía y Farmacología',
      basuraReutilizable:
        'Memorización aislada de nombres de receptores sin comprender la cascada fisiológica ni las interacciones adversas.',
      procesamientoLisosomal:
        'Caso de polifarmacia geriátrica con alteración del ciclo sueño-vigilia, deterioro atencional y riesgo de síndrome confusional.',
      componenteReciclado:
        'Criterio terapéutico basado en mecanismos fisiopatológicos y prevención de iatrogenia.',
      neurobiologicalMechanism:
        'El conflicto diagnóstico obliga a reconstruir rutas causales en lugar de recuperar etiquetas verbales aisladas.'
    }
  ],
  Psicología: [
    {
      id: 'psi-1',
      discipline: 'Psicología',
      subject: 'Psicología Clínica y Terapias Contextuales',
      basuraReutilizable:
        'Memorización rígida de criterios diagnósticos categoriales sin lectura funcional de la conducta en contexto.',
      procesamientoLisosomal:
        'Análisis de viñeta clínica sobre evitación experiencial y desregulación afectiva en estudiante universitario con agotamiento crónico.',
      componenteReciclado:
        'Formulación clínica funcional, escucha terapéutica libre de juicio y flexibilidad psicológica aplicada.',
      neurobiologicalMechanism:
        'Modela la modulación vmPFC sobre el afecto aversivo y consolida habilidades metacognitivas clínicas.'
    },
    {
      id: 'psi-2',
      discipline: 'Psicología',
      subject: 'Neuropsicología Cognitiva',
      basuraReutilizable:
        'Tablas aisladas de subpruebas psicométricas memorizadas sin criterio de validez ecológica.',
      procesamientoLisosomal:
        'Estudio de caso diferencial entre déficit atencional primario y falla ejecutiva secundaria a privación crónica de sueño.',
      componenteReciclado:
        'Razonamiento pericial riguroso, integración neuropsicofisiológica y diseño de rehabilitación realista.',
      neurobiologicalMechanism:
        'Activa redes frontoparietales de contraste diagnóstico y depura sesgos heurísticos de confirmación.'
    }
  ],
  Educación: [
    {
      id: 'edu-1',
      discipline: 'Educación',
      subject: 'Didáctica Universitaria y Evaluación',
      basuraReutilizable:
        'Diapositivas sobrecargadas de definiciones textuales y cuestionarios de recuerdo literal replicables en segundos por un asistente digital.',
      procesamientoLisosomal:
        'Rediseño de una sesión sincrónica hostil o apática mediante aula invertida, respiración reguladora y estudio de caso contextualizado.',
      componenteReciclado:
        'Diseño neurodidáctico centrado en el estudiante, ética evaluativa frente a la IA y liderazgo emocional en el aula.',
      neurobiologicalMechanism:
        'Promueve la autofagia de prácticas transmisivas obsoletas y consolida esquemas metacognitivos docentes.'
    },
    {
      id: 'edu-2',
      discipline: 'Educación',
      subject: 'Currículo y Modalidad Virtual',
      basuraReutilizable:
        'Secuencias expositivas continuas de dos horas sin interacción ni verificación de comprensión.',
      procesamientoLisosomal:
        'Diseño de micro-retos cada 15 minutos con predicción lexical y cierre metacognitivo en grupos heterogéneos.',
      componenteReciclado:
        'Gestión dinámica de la atención virtual, calibración del canal de flujo y evaluación auténtica por competencias.',
      neurobiologicalMechanism:
        'Sincroniza la activación periódica del locus coeruleus y protege los picos de dopamina intrínseca.'
    }
  ]
};

export const APA_REFERENCES: ApaReference[] = [
  {
    id: 'ref-mora-2021',
    topic: 'Neuroeducación y Emoción',
    citation:
      'Mora, F. (2021). Neuroeducación: solo se puede aprender aquello que se ama. Alianza Editorial.',
    url: 'https://www.colegar.com/colegar/archivo_aporte_id209_1599168691253.pdf',
    accessLabel: 'Acceso digital PDF',
    summary:
      'Expone los mecanismos mediante los cuales la curiosidad y la activación emocional regulada abren las puertas atencionales previas a cualquier proceso cognitivo complejo en el aula.'
  },
  {
    id: 'ref-bueno-2019',
    topic: 'Neurociencia Educativa',
    citation:
      'Bueno i Torrens, D. (2019). Neurociencia para educadores: todo lo que los educadores siempre han querido saber sobre el cerebro de sus alumnos. Ediciones Octaedro.',
    url: 'https://elibro-net.ezproxy.cecar.edu.co:2443/es/ereader/bibliocecar/118682?page=29',
    accessLabel: 'Biblioteca CECAR (eLibro)',
    summary:
      'Traduce hallazgos sobre plasticidad sináptica, memoria y estrés académico en criterios operativos para la planificación didáctica y la evaluación universitaria.'
  },
  {
    id: 'ref-portellano-2018',
    topic: 'Funciones Ejecutivas',
    citation:
      'Portellano Pérez, J. A. (2018). Neuroeducación y funciones ejecutivas. Editorial CEPE.',
    url: 'https://elibro-net.ezproxy.cecar.edu.co:2443/es/ereader/bibliocecar/156566?page=1',
    accessLabel: 'Biblioteca CECAR (eLibro)',
    summary:
      'Detalla la arquitectura funcional de la corteza prefrontal dorsolateral, ventromedial y cingulada anterior en el control inhibitorio, la memoria de trabajo y la metacognición.'
  },
  {
    id: 'ref-corsi-2017',
    topic: 'Dopamina y Ritmos Circadianos',
    citation:
      'Corsi-Cabrera, M., & Mendoza, J. (2017). Dopamine: A modulator of circadian rhythms in the central nervous system. Frontiers in Cellular Neuroscience, 11, 74.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5357627/',
    accessLabel: 'Texto completo en PMC',
    summary:
      'Analiza el acoplamiento bidireccional entre el sistema dopaminérgico y los osciladores circadianos, explicando cómo la alteración nocturna deprime la atención y la motivación diurnas.'
  },
  {
    id: 'ref-reichert-2016',
    topic: 'Adenosina y Memoria de Trabajo',
    citation:
      'Reichert, C., Maire, M., Schmidt, C., & Cajochen, C. (2016). Sleep-wake regulation and its impact on working memory performance: The role of adenosine. Biology, 5(1), 11.',
    url: 'https://www.mdpi.com/2079-7737/5/1/11',
    accessLabel: 'Texto completo en MDPI',
    summary:
      'Documenta cómo la acumulación homeostática de adenosina durante la vigilia prolongada deteriora el rendimiento ejecutivo prefrontal y la memoria operativa.'
  },
  {
    id: 'ref-autophagy-2022',
    topic: 'Autofagia y Sistema Glinfático',
    citation:
      'Scientific Archives. (2022). Impact of sleep on autophagy and neurodegenerative disease: Sleeping your mind clear. Journal of Brain and Neuroscience Research, 3(1), 12-19.',
    url: 'https://www.scientificarchives.com/article/impact-of-sleep-on-autophagy-and-neurodegenerative-disease-sleeping-your-mind-clear',
    accessLabel: 'Texto completo en Scientific Archives',
    summary:
      'Describe la relación entre descanso profundo, autofagia celular y depuración glinfática de metabolitos tóxicos, sustentando la analogía del reciclaje neurocognitivo.'
  },
  {
    id: 'ref-galenos-2024',
    topic: 'Cronobiología y Memoria',
    citation:
      'Galenos, J. (2024). Investigating the relationship between circadian rhythm and learning-memory. Journal of Turkish Sleep Medicine, 11(2), 112-118.',
    url: 'https://jag.journalagent.com/jtsm/',
    accessLabel: 'Texto completo en JTSM',
    summary:
      'Examina la dependencia molecular de la potenciación a largo plazo respecto a las fases de sueño de ondas lentas y REM dentro del ciclo circadiano de 24 horas.'
  },
  {
    id: 'ref-uceda-2023',
    topic: 'Atención y Aprendizaje',
    citation:
      'Uceda Gutiérrez, S., Donoso González, M., & Reiriz Rojas, M. (Coords.). (2023). Perspectivas psicobiológicas y pedagógicas del aprendizaje y la atención: aportes a la neurociencia educativa. LA LEY Soluciones Legales.',
    url: 'https://elibro-net.ezproxy.cecar.edu.co:2443/es/ereader/bibliocecar/295504?page=1',
    accessLabel: 'Biblioteca CECAR (eLibro)',
    summary:
      'Integra modelos de redes atencionales y autorregulación cognitiva aplicados al diseño de entornos virtuales y presenciales de educación superior.'
  }
];
