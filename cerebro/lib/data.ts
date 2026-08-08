// Tipos y datos demo del Cerebro Villano.
// La taxonomía replica los Excels de métricas (Feed, Historias, ADS HT/LT) y el PRD.

export type Area = "organico" | "trafico" | "embudos" | "ventas" | "agencia";

export const AREAS: Record<Area, { label: string; color: string }> = {
  organico: { label: "Orgánico", color: "#34d399" },
  trafico: { label: "Tráfico", color: "#60a5fa" },
  embudos: { label: "Embudos", color: "#a78bfa" },
  ventas: { label: "Ventas", color: "#fbbf24" },
  agencia: { label: "Agencia", color: "#8f8f9d" },
};

export type Person = "Sebastián" | "Rodrigo" | "Francisco" | "Javier" | "Cliente" | "Setter";

export const TEAM: { name: Person; role: string; initials: string }[] = [
  { name: "Javier", role: "Gestión del panel · SOPs · Automatizaciones · Finanzas por cliente", initials: "JA" },
  { name: "Rodrigo", role: "Ongoing cercano · WhatsApp 1ª línea · Reuniones · Meta Ads", initials: "RO" },
  { name: "Francisco", role: "Contenido orgánico · Planificación Notion · Métricas por pieza", initials: "FR" },
  { name: "Sebastián", role: "Funnels · Optimización de campañas · Creativos · Automatizaciones", initials: "SE" },
];

// Proceso de contenido (SOP fijo, 8 pasos) y estados visibles en el Notion del cliente
export const PROCESS_STEPS = [
  "Investigación (dummy account → ideas ganadoras)",
  "Planificación",
  "Guión",
  "Revisión",
  "Grabación",
  "Edición",
  "Programación",
  "Análisis (métricas)",
] as const;

export const NOTION_STATES = ["Planificado", "Revisado", "Grabado", "Publicado"] as const;

// ---------------- KPI → KRI por miembro ----------------
// KPI = acción semanal literal · KRI = resultado que esa acción influye

export type KpiCadencia = "semanal" | "mensual";

export interface KPI {
  id: string;
  person: Person;
  accion: string;
  meta: number;              // objetivo de veces por período
  cadencia: KpiCadencia;     // semanal | mensual — el conteo se reinicia cada período
  kri: string;
}

// El progreso (cuántas veces se realizó en el período actual) NO vive acá:
// se guarda por período en Supabase (lib/kpi.tsx), así se reinicia solo cada
// semana/mes y queda histórico. Acá solo va la definición del KPI.
export const KPIS: KPI[] = [
  // Francisco — orgánico
  { id: "k-fr-1", person: "Francisco", accion: "Revisión de rendimiento por cuenta", meta: 3, cadencia: "semanal", kri: "Leads orgánicos · interacción" },
  { id: "k-fr-2", person: "Francisco", accion: "Piezas publicadas con ≥1 semana de antelación", meta: 6, cadencia: "semanal", kri: "Constancia → alcance" },
  { id: "k-fr-3", person: "Francisco", accion: "Métricas por pieza cargadas en Notion DB", meta: 6, cadencia: "semanal", kri: "Ideas ganadoras detectadas" },
  { id: "k-fr-4", person: "Francisco", accion: "Ajuste de planificación en Notion post-análisis", meta: 3, cadencia: "semanal", kri: "Tasa de guardados/compartidos" },
  // Rodrigo — ongoing + Meta
  { id: "k-ro-1", person: "Rodrigo", accion: "WhatsApps de clientes con última respuesta nuestra", meta: 100, cadencia: "semanal", kri: "Retención de clientes" },
  { id: "k-ro-2", person: "Rodrigo", accion: "Reuniones de la semana confirmadas", meta: 4, cadencia: "semanal", kri: "Show-up de reuniones" },
  { id: "k-ro-3", person: "Rodrigo", accion: "Revisión de campañas Meta (con Sebastián)", meta: 3, cadencia: "semanal", kri: "CPL · fatiga de anuncios" },
  // Sebastián — funnels + campañas
  { id: "k-se-1", person: "Sebastián", accion: "Iteraciones de creativos / campañas", meta: 2, cadencia: "semanal", kri: "ROAS · costo por agenda" },
  { id: "k-se-2", person: "Sebastián", accion: "QA de funnels (LP → lead → agenda)", meta: 3, cadencia: "semanal", kri: "CVR del embudo" },
  { id: "k-se-3", person: "Sebastián", accion: "Automatizaciones nuevas o corregidas", meta: 1, cadencia: "semanal", kri: "Show-up · velocidad de respuesta" },
  // Javier — gestión
  { id: "k-ja-1", person: "Javier", accion: "Auditoría de avance del equipo (panel)", meta: 1, cadencia: "semanal", kri: "% SOP cumplido" },
  { id: "k-ja-2", person: "Javier", accion: "Cierre financiero por cliente", meta: 1, cadencia: "mensual", kri: "Margen por cliente" },
  { id: "k-ja-3", person: "Javier", accion: "Avance de automatizaciones documentado", meta: 1, cadencia: "mensual", kri: "Horas ahorradas / procesos" },
];

// ---------------- Finanzas por cliente (vista de Javier) ----------------

export interface ClientFinance {
  clientId: string;
  modelo: string;
  feeMensual: number;
  inversionAds: number;
  facturacionCliente: number;
  ingresoAgencia: number; // fee + rev share
  margen: number;         // ingreso - costos operativos asignados
}

export const FINANZAS: ClientFinance[] = [];

// ---------------- Rendimiento semanal de orgánico (3-4 métricas clave) ----------------

export interface OrganicWeekRow {
  label: string;
  values: (number | null)[];
  fmt?: "pct" | "n";
}

export const ORGANIC_WEEKS: Record<string, OrganicWeekRow[]> = {};

export interface Client {
  id: string;
  nombre: string;
  nicho: string;
  oferta: string;
  initials: string; // monograma profesional (reemplaza el emoji)
  color: string;
  metaSlugs: string[]; // posibles valores de campaign_metrics.cliente (Meta Ads)
  cicloAncla: string; // inicio del ciclo de 14 días vigente
  estrategia: {
    pilares: string;
    frecuenciaFeed: string;
    historias: string;
    tono: string;
  };
}

export const CLIENTS: Client[] = [
  {
    id: "family",
    nombre: "Family Eaters",
    nicho: "Alimentación infantil",
    oferta: "Programa / certificación (high ticket)",
    initials: "FE",
    color: "#34d399",
    metaSlugs: ["family_eaters", "family"],
    cicloAncla: "2026-06-29",
    estrategia: {
      pilares: "Nutrición (educación) · Atracción",
      frecuenciaFeed: "2 piezas / semana",
      historias: "Todos los días",
      tono: "Simple · basado en evidencia",
    },
  },
  {
    id: "marcelo",
    nombre: "Dr. Marcelo Hernán",
    nicho: "Nutrición natural · perros salchicha",
    oferta: "Asesoría online + ebooks (HT + LT)",
    initials: "MH",
    color: "#fbbf24",
    metaSlugs: ["marcelo", "dr_marcelo", "marcelo_hernan", "salchicha"],
    cicloAncla: "2026-06-22",
    estrategia: {
      pilares: "Nutrición y Salud · Atracción",
      frecuenciaFeed: "2 publicaciones / semana",
      historias: "Lunes a viernes",
      tono: "Educar antes de vender",
    },
  },
  {
    id: "ezequiel",
    nombre: "Ezequiel · Raíz Autoinmune",
    nicho: "Autoinmunes (Crohn, colitis) · salud metabólica",
    oferta: "Consulta pagada USD 60 → Programa autoinmune (high ticket)",
    initials: "EZ",
    color: "#a78bfa",
    metaSlugs: ["ezequiel", "sanando_autoinmune", "autoinmune", "raiz_autoinmune"],
    cicloAncla: "2026-08-04",
    estrategia: {
      pilares: "Autoridad clínica (autoinmune) · Educación en video",
      frecuenciaFeed: "2–3 publicaciones / semana (modo prueba)",
      historias: "L autoridad · X conversión · V educación",
      tono: "Profesional, simple, sin agresividad",
    },
  },
  {
    id: "fixus",
    nombre: "Fixus",
    nicho: "Kinesiología y rendimiento · Providencia (Chile)",
    oferta: "3 a 1 y Kinesiología · entrada paga → plan presencial",
    initials: "FX",
    color: "#38bdf8",
    metaSlugs: ["fixus", "fixus_3a1", "fixus_kine", "fixus_kinesiologia"],
    cicloAncla: "2026-08-04",
    estrategia: {
      pilares: "Educación del formato (3 a 1 / kine) · Prueba social",
      frecuenciaFeed: "2 / semana (orgánico abre conversación, no vende)",
      historias: "Lunes a viernes",
      tono: "Humano, sin tecnicismos",
    },
  },
];

// ---------------- Estrategia detallada por cliente (extraída de los docs de Drive) ----------------
// Se muestra en la pestaña Estrategia. Es la "estrategia viva" con embudo, oferta,
// canales, métricas y notas — la fuente y fecha quedan registradas.

export interface StrategyOffer {
  nombre: string;
  precio: string;
  nota?: string;
}

export interface StrategyDetail {
  resumen: string;
  embudo: string[];
  ofertas: StrategyOffer[];
  canales: string[];
  metricas: string[];
  agenda?: string;
  notas: string[];
  fuente: string;
}

export const STRATEGY_DETAIL: Record<string, StrategyDetail> = {
  fixus: {
    resumen:
      "Entrada barata paga → asistencia presencial → venta del plan grande en el centro. Dos embudos separados que nunca se mezclan: 3 a 1 y Kinesiología.",
    embudo: [
      "Anuncio (1 ángulo por avatar, nunca genérico)",
      "Landing con video de venta (2:30–3 min)",
      "Pago de entrada (filtra · mide · compromete)",
      "Captura de datos post-pago (RUT → boleta)",
      "Agenda con horarios reales del equipo",
      "Automatizaciones de asistencia (email + WhatsApp + recordatorios)",
      "Asiste al centro → venta presencial del plan",
    ],
    ofertas: [
      { nombre: "3 a 1 · clase de prueba", precio: "$8.990", nota: "meta subir a $10.000 · se descuenta del plan si continúa" },
      { nombre: "3 a 1 · plan mensual (2x/sem)", precio: "$98.000–$115.000", nota: "recurrente · trimestral −5%" },
      { nombre: "Kine · evaluación", precio: "$24.990", nota: "bajó desde $40.000 a propósito" },
      { nombre: "Kine · plan 10 sesiones", precio: "$300.000", nota: "reembolsable con orden médica" },
    ],
    canales: [
      "Meta Ads a landing dedicada (embudos separados, nunca a la web general)",
      "Orgánico: abrir conversaciones y marca, no venta directa",
    ],
    metricas: [
      "Costo por clase de prueba / evaluación vendida",
      "Tasa de asistencia (pagó → llegó)",
      "Conversión presencial (prueba→plan · eval→10 sesiones)",
      "Valor por lead (define cuánto se puede pagar por lead)",
    ],
    agenda:
      "Geo 3 a 1: Providencia (Metro Colón). Geo Kine: + Las Condes, Ñuñoa, La Reina. Viernes tarde y fin de semana con cobertura limitada.",
    notas: [
      "Pago por Xflow (preferido) o Mercado Pago. El CRM es solo para marketing (2 productos de entrada); el resto sigue en Xflow.",
      "Riesgo principal: pagar y no asistir → capa de recordatorios. Estandarizar la venta presencial entre profesores.",
      "Romper la confusión '3 a 1 = clase grupal' en la landing, o se pierde en el mostrador.",
    ],
    fuente: "Embudo Inicial FIXUS · reuniones 30/jul (Felipe) y 4/ago (Natalia)",
  },
  ezequiel: {
    resumen:
      "El recurso escaso es el tiempo de Ezequiel. Consulta pagada como filtro → programa autoinmune high ticket. Cada decisión reduce conversaciones no calificadas.",
    embudo: [
      "Contenido orgánico (autoridad) + palabra clave en DM ('autoinmune')",
      "Consulta de Valoración Metabólica USD 60 (el pago es el filtro)",
      "Agenda liberada post-pago, automatizada",
      "Consulta real con estructura de llamada de venta",
      "Programa autoinmune (USD 800–900)",
    ],
    ofertas: [
      { nombre: "Consulta de Valoración Metabólica", precio: "USD 60", nota: "se descuentan del programa · guía de 2 semanas si no compra" },
      { nombre: "Programa autoinmune", precio: "USD 900 lista · USD 800 piso", nota: "1 mes educativo + seguimiento a 3 meses · 3 sesiones 1a1 · charlas grupales" },
    ],
    canales: [
      "Orgánico: 2–3 publicaciones/sem + pauta ligera (seguidores/autoridad)",
      "Solo video: clips de consulta (Loom), curación anglosajona citada, casos de éxito, resúmenes en mapa mental",
      "Sin lead magnets en PDF",
    ],
    metricas: [
      "Consultas USD 60 vendidas",
      "Conversión consulta → programa (high ticket)",
      "Leads calificados por palabra clave",
      "Crecimiento de seguidores / autoridad",
    ],
    agenda:
      "Disponibilidad de consultas: Lun tarde · Mar mañana · Jue tarde · Vie mañana (Mié tarde no). Reunión semanal fija: lunes 15:00 ARG / 14:00 CL.",
    notas: [
      "Testeo en agosto: si el volumen no reacciona, se libera el flujo a un equipo de ventas (setter + closer) independiente de Ezequiel.",
      "Grabar por lotes (10–12 reels de una vez). La agencia envía guiones antes de grabar.",
      "Cobro repartido en 2–3 cuentas (carga impositiva AR ~40%). Plataforma/onboarding tipo Skool dentro del CRM al confirmar el pago.",
    ],
    fuente: "Estrategia Raíz Autoinmune · reunión 31/jul · ciclo agosto 2026",
  },
  marcelo: {
    resumen:
      "No se le vende lo mismo a todos. Escalera de conciencia N1–N5 y un filtro humano (INA) en el medio: ningún link de asesoría sale sin pasar por el setter.",
    embudo: [
      "Publicación con palabra clave (nutrición / hansel / salud)",
      "Comentario → DM automático (CRM LabCenter / ManyChat)",
      "Diagnóstico automático del caso del perro",
      "Setter INA califica, vende y cierra",
      "eBook (caso simple) o Asesoría high ticket (dolor instalado)",
    ],
    ofertas: [
      { nombre: "eBook Salchicha Pro (low ticket)", precio: "venta directa", nota: "palabra clave 'nutrición', flujo automático (máx 1/sem)" },
      { nombre: "Asesoría / método completo (high ticket)", precio: "cierre por conversación", nota: "'salud' o complejidad clínica → deriva a Marcelo" },
    ],
    canales: [
      "Carril 1: publicaciones nuevas con CTA (máxima prioridad, interés caliente hoy)",
      "Carril 2: publicaciones antiguas — 20–30 follow-ups/día a mano desde el IG de Marcelo",
      "Carril 3: lead magnets (1 por semana)",
      "Agosto 100% orgánico (sin pauta)",
    ],
    metricas: [
      "Comentarios y conversaciones iniciadas por día",
      "Follow-ups enviados y respondidos",
      "eBooks vendidos (LT) · Asesorías cerradas (HT)",
    ],
    agenda:
      "Palabras clave: nutrición (venta directa eBook, automática) · hansel (curioso, se define en conversación) · salud (dolor declarado → asesoría).",
    notas: [
      "INA califica, vende y cierra; deriva a Marcelo solo por complejidad clínica.",
      "Regla dura: si no compró solo por el flujo de 'nutrición', ningún link de pago sale sin que el setter lo envíe.",
      "Migrando ManyChat → LabCenter (CRM) como chat principal.",
    ],
    fuente: "Estrategia Agosto Dachshund (v2) + Flujos de conversación por CTA · 31/jul 2026",
  },
};

// ---------------- Acciones recurrentes (tracker) ----------------

export type Cadence = "diaria" | "dias" | "semanal" | "14d";

export interface Action {
  id: string;
  clientId: string | null; // null = agencia
  area: Area;
  nombre: string;
  cadencia: Cadence;
  dias?: number[]; // 0=Lun … 6=Dom (para cadencia "dias" o el día objetivo de "semanal")
  R: Person;
  A: Person;
}

// ---------------- Plan de contenido → genera acciones de orgánico ----------------
// La frecuencia de feed e historias de la estrategia se traduce en acciones
// concretas del tracker (una por día asignado). IDs con prefijo "gen-<cliente>-".

export type HistoriasModo = "diaria" | "lunvie" | "dias" | "no";

export interface ContentPlan {
  feedTipo: string;      // ej. "Carrusel/Video"
  feedDias: number[];    // días de publicación de feed (0=Lun … 6=Dom)
  historiasModo: HistoriasModo;
  historiasDias: number[]; // solo si historiasModo === "dias"
}

export const CONTENT_PLANS: Record<string, ContentPlan> = {
  family: { feedTipo: "Carrusel/Video", feedDias: [1, 3], historiasModo: "diaria", historiasDias: [] },
  marcelo: { feedTipo: "Carrusel/Reel", feedDias: [1, 3], historiasModo: "lunvie", historiasDias: [] },
  ezequiel: { feedTipo: "Video+Carrusel", feedDias: [1, 3], historiasModo: "dias", historiasDias: [0, 2, 4] },
  fixus: { feedTipo: "Reel/Educativo", feedDias: [1, 3], historiasModo: "lunvie", historiasDias: [] },
};

// Distribuye N publicaciones de forma pareja a lo largo de la semana (L–D)
export function distributeDays(n: number): number[] {
  if (n <= 0) return [];
  if (n >= 7) return [0, 1, 2, 3, 4, 5, 6];
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(Math.round((i * 7) / n) % 7);
  return [...new Set(out)].sort((a, b) => a - b);
}

export function genContentActions(clientId: string, plan: ContentPlan): Action[] {
  const acts: Action[] = [];
  plan.feedDias.forEach((day, i) => {
    acts.push({
      id: `gen-${clientId}-feed-${day}`,
      clientId, area: "organico",
      nombre: `Publicar feed · ${plan.feedTipo}${plan.feedDias.length > 1 ? ` (${i + 1}/${plan.feedDias.length})` : ""}`,
      cadencia: "dias", dias: [day], R: "Francisco", A: "Rodrigo",
    });
  });
  if (plan.historiasModo !== "no") {
    const dias = plan.historiasModo === "lunvie" ? [0, 1, 2, 3, 4] : plan.historiasModo === "dias" ? plan.historiasDias : [];
    acts.push({
      id: `gen-${clientId}-hist`,
      clientId, area: "organico",
      nombre: plan.historiasModo === "diaria" ? "Publicar historia (diaria)" : "Publicar historia",
      cadencia: plan.historiasModo === "diaria" ? "diaria" : "dias",
      dias, R: "Francisco", A: "Rodrigo",
    });
  }
  return acts;
}

// Acciones fijas (no generadas por el plan de contenido)
const MANUAL_ACTIONS: Action[] = [
  // Family
  { id: "f-plan", clientId: "family", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Francisco", A: "Sebastián" },
  { id: "f-ads", clientId: "family", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "f-camp", clientId: "family", area: "trafico", nombre: "Revisar campañas · fatiga · CPL", cadencia: "semanal", dias: [2], R: "Rodrigo", A: "Sebastián" },
  { id: "f-fun", clientId: "family", area: "embudos", nombre: "Revisar conversión del funnel", cadencia: "semanal", dias: [4], R: "Sebastián", A: "Sebastián" },
  { id: "f-rev", clientId: "family", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
  // Marcelo
  { id: "m-plan", clientId: "marcelo", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Francisco", A: "Sebastián" },
  { id: "m-graba", clientId: "marcelo", area: "organico", nombre: "Cliente: revisar Notion + grabar", cadencia: "14d", dias: [1], R: "Cliente", A: "Rodrigo" },
  { id: "m-setter", clientId: "marcelo", area: "ventas", nombre: "Setter: gestionar chats y agendas", cadencia: "diaria", R: "Setter", A: "Rodrigo" },
  { id: "m-ads", clientId: "marcelo", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "m-rev", clientId: "marcelo", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
  // Ezequiel
  { id: "e-plan", clientId: "ezequiel", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Francisco", A: "Sebastián" },
  { id: "e-graba", clientId: "ezequiel", area: "organico", nombre: "Cliente: grabar VSL + material", cadencia: "14d", dias: [1], R: "Cliente", A: "Rodrigo" },
  { id: "e-fun", clientId: "ezequiel", area: "embudos", nombre: "QA funnel HT (form → agenda)", cadencia: "semanal", dias: [2], R: "Sebastián", A: "Sebastián" },
  { id: "e-ads", clientId: "ezequiel", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "e-rev", clientId: "ezequiel", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
  // Fixus
  { id: "x-plan", clientId: "fixus", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Francisco", A: "Sebastián" },
  { id: "x-ads-3a1", clientId: "fixus", area: "trafico", nombre: "Revisar pauta 3 a 1 (landing dedicada)", cadencia: "semanal", dias: [2], R: "Rodrigo", A: "Sebastián" },
  { id: "x-ads-kine", clientId: "fixus", area: "trafico", nombre: "Revisar pauta Kinesiología (landing dedicada)", cadencia: "semanal", dias: [2], R: "Rodrigo", A: "Sebastián" },
  { id: "x-recordatorios", clientId: "fixus", area: "embudos", nombre: "QA automatizaciones de asistencia (recordatorios)", cadencia: "semanal", dias: [1], R: "Sebastián", A: "Sebastián" },
  { id: "x-med", clientId: "fixus", area: "ventas", nombre: "Marcar leads asistidos (ganado/perdido) en CRM", cadencia: "semanal", dias: [4], R: "Cliente", A: "Rodrigo" },
  { id: "x-ads", clientId: "fixus", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "x-rev", clientId: "fixus", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
  // Agencia
  { id: "a-org", clientId: null, area: "agencia", nombre: "Reunión Org. Semanal", cadencia: "semanal", dias: [0], R: "Rodrigo", A: "Sebastián" },
  { id: "a-met", clientId: null, area: "agencia", nombre: "Reunión de métricas (quincenal · cada 15 días)", cadencia: "14d", dias: [1], R: "Javier", A: "Sebastián" },
  { id: "a-fin", clientId: null, area: "agencia", nombre: "Cierre financiero semanal", cadencia: "semanal", dias: [4], R: "Javier", A: "Sebastián" },
];

// Estado inicial: manuales + acciones generadas desde los planes por defecto
export const ACTIONS: Action[] = [
  ...MANUAL_ACTIONS,
  ...Object.entries(CONTENT_PLANS).flatMap(([id, plan]) => genContentActions(id, plan)),
];

// Checks demo: revisados por el A esta semana (key: actionId-dayIndex)
export const REVIEWED_SEED: string[] = [
  "f-hist-0", "f-hist-1", "f-feed-1", "m-setter-0", "m-setter-1", "e-plan-0", "a-org-0",
];

// Checks demo ya hechos esta semana (key: actionId-dayIndex)
export const DONE_SEED: string[] = [
  "f-hist-0", "f-hist-1", "f-hist-2", "f-feed-1", "f-camp-2",
  "m-hist-0", "m-hist-1", "m-feed-1", "m-setter-0", "m-setter-1", "m-setter-2",
  "e-plan-0", "e-hist-0", "e-feed-1",
  "a-org-0", "a-met-2",
];


// ---------------- Orgánico (resumen por ciclo, KPIs del SOP) ----------------

export interface OrganicSummary {
  alcance: number;
  seguidores: number;
  interaccion: number; // %
  guardados: number;
  mensajes: number;
  leads: number;
  piezasPlan: number;
  piezasPublicadas: number;
}

export const ORGANIC: Record<string, OrganicSummary> = {};

// ---------------- Ventas / resumen por cliente ----------------

export interface SalesSummary {
  facturacionCiclo: number;
  inversionCiclo: number;
  cierres: number;
  agendasPend: number;
  moneda: "USD";
}

// Tipo de cambio usado para pasar la inversión de Meta (CLP) a USD.
// Editar acá si cambia. La inversión real de Family sale de Meta Ads.
export const TC_CLP_USD = 950;

export const SALES: Record<string, SalesSummary> = {};

// ---------------- Metas ----------------

export interface Goal {
  clientId: string;
  area: Area;
  nombre: string;
  actual: number;             // usado solo cuando metrica es "manual"/vacío
  objetivo: number;
  fmt: "usd" | "pct" | "x" | "n";
  plazo: string;
  metrica?: string;           // clave de métrica viva (ver lib/goal-metrics). Vacío/"manual" = carga manual
  periodo?: string;           // semana | ciclo | mes | total
}

export const GOALS: Goal[] = [];

// ---------------- Revisiones (ciclo 14 días) ----------------

export interface Review {
  clientId: string;
  ciclo: string;
  funciono: string[];
  noFunciono: string[];
  decisiones: string[];
  compromisos: { texto: string; R: Person; estado: "pendiente" | "hecho" }[];
}

export const REVIEWS: Review[] = [];

// ---------------- Alertas ----------------

export interface Alerta {
  tipo: "dato" | "accion" | "revision";
  texto: string;
  clientId: string | null;
}

export const ALERTAS: Alerta[] = [];

// ---------------- Helpers ----------------

export function fmtVal(v: number | null, fmt?: string): string {
  if (v === null || v === undefined) return "—";
  switch (fmt) {
    case "usd": return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 1 });
    case "pct": return v.toLocaleString("es-CL", { maximumFractionDigits: 1 }) + "%";
    case "x": return v.toLocaleString("es-CL", { maximumFractionDigits: 1 }) + "x";
    default: return v.toLocaleString("es-CL");
  }
}

export const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

// ¿La acción aplica al día d (0=Lun) de esta semana? (semana demo = semana 1 del ciclo para todos)
export function actionAppliesOn(a: Action, d: number): boolean {
  if (a.cadencia === "diaria") return true;
  if (a.cadencia === "dias") return a.dias?.includes(d) ?? false;
  return (a.dias ?? [0]).includes(d); // semanal y 14d: su día objetivo
}

export function clientById(id: string | null): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function complianceFor(actions: Action[], done: Set<string>): number {
  let total = 0, ok = 0;
  for (const a of actions) for (let d = 0; d < 7; d++) if (actionAppliesOn(a, d)) { total++; if (done.has(`${a.id}-${d}`)) ok++; }
  return total ? Math.round((ok / total) * 100) : 0;
}
