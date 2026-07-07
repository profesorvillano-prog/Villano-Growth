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

export type Person = "Sebastián" | "Rodrigo" | "Patricio" | "Javier" | "Cliente" | "Setter";

export const TEAM: { name: Person; role: string; initials: string }[] = [
  { name: "Javier", role: "Gestión del panel · SOPs · Automatizaciones · Finanzas por cliente", initials: "JA" },
  { name: "Rodrigo", role: "Ongoing cercano · WhatsApp 1ª línea · Reuniones · Meta Ads", initials: "RO" },
  { name: "Patricio", role: "Contenido orgánico · Planificación Notion · Métricas por pieza", initials: "PA" },
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

export interface KPI {
  person: Person;
  accion: string;
  meta: number;
  actual: number;
  kri: string;
}

export const KPIS: KPI[] = [
  // Patricio — orgánico
  { person: "Patricio", accion: "Revisión semanal de rendimiento por cuenta", meta: 3, actual: 2, kri: "Leads orgánicos · interacción" },
  { person: "Patricio", accion: "Piezas publicadas con ≥1 semana de antelación", meta: 6, actual: 5, kri: "Constancia → alcance" },
  { person: "Patricio", accion: "Métricas por pieza cargadas en Notion DB", meta: 6, actual: 3, kri: "Ideas ganadoras detectadas" },
  { person: "Patricio", accion: "Ajuste de planificación en Notion post-análisis", meta: 3, actual: 2, kri: "Tasa de guardados/compartidos" },
  // Rodrigo — ongoing + Meta
  { person: "Rodrigo", accion: "WhatsApps de clientes con última respuesta nuestra", meta: 100, actual: 92, kri: "Retención de clientes" },
  { person: "Rodrigo", accion: "Reuniones de la semana confirmadas", meta: 4, actual: 4, kri: "Show-up de reuniones" },
  { person: "Rodrigo", accion: "Revisión de campañas Meta (con Sebastián)", meta: 3, actual: 2, kri: "CPL · fatiga de anuncios" },
  // Sebastián — funnels + campañas
  { person: "Sebastián", accion: "Iteraciones de creativos / campañas", meta: 2, actual: 2, kri: "ROAS · costo por agenda" },
  { person: "Sebastián", accion: "QA de funnels (LP → lead → agenda)", meta: 3, actual: 3, kri: "CVR del embudo" },
  { person: "Sebastián", accion: "Automatizaciones nuevas o corregidas", meta: 1, actual: 1, kri: "Show-up · velocidad de respuesta" },
  // Javier — gestión
  { person: "Javier", accion: "Auditoría de avance del equipo (panel)", meta: 1, actual: 1, kri: "% SOP cumplido" },
  { person: "Javier", accion: "Cierre financiero por cliente", meta: 1, actual: 1, kri: "Margen por cliente" },
  { person: "Javier", accion: "Avance de automatizaciones documentado", meta: 1, actual: 0, kri: "Horas ahorradas / procesos" },
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

export const FINANZAS: ClientFinance[] = [
  { clientId: "family", modelo: "Proyecto interno (100%)", feeMensual: 0, inversionAds: 800, facturacionCliente: 2670, ingresoAgencia: 2670, margen: 1490 },
  { clientId: "marcelo", modelo: "Retainer + 35% rev share", feeMensual: 250, inversionAds: 850, facturacionCliente: 1142, ingresoAgencia: 650, margen: 310 },
  { clientId: "ezequiel", modelo: "Setup $2k + retainer $500", feeMensual: 500, inversionAds: 120, facturacionCliente: 0, ingresoAgencia: 500, margen: 260 },
];

// ---------------- Campañas de Meta (análisis por campaña) ----------------

export interface Campaign {
  clientId: string;
  tipo: "HT" | "LT";
  nombre: string;
  estado: "activa" | "aprendizaje" | "pausada";
  inversion: number;
  resultados: number;      // leads (HT) o compras (LT)
  costoPorResultado: number;
  roas: number | null;
}

export const CAMPAIGNS: Campaign[] = [
  { clientId: "family", tipo: "HT", nombre: "VSL Frío · Padres 28-45", estado: "activa", inversion: 520, resultados: 24, costoPorResultado: 21.7, roas: 4.1 },
  { clientId: "family", tipo: "HT", nombre: "Retarget · Vieron VSL 50%", estado: "activa", inversion: 180, resultados: 7, costoPorResultado: 25.7, roas: 3.2 },
  { clientId: "family", tipo: "HT", nombre: "Testimonios · Lookalike 2%", estado: "aprendizaje", inversion: 100, resultados: 2, costoPorResultado: 50, roas: null },
  { clientId: "marcelo", tipo: "HT", nombre: "VSL Salchicha enfermo · Frío", estado: "activa", inversion: 400, resultados: 18, costoPorResultado: 22.2, roas: 1.9 },
  { clientId: "marcelo", tipo: "HT", nombre: "Autoridad veterinaria · Frío", estado: "aprendizaje", inversion: 160, resultados: 8, costoPorResultado: 20, roas: null },
  { clientId: "marcelo", tipo: "LT", nombre: "Ebook Pack Starter · Frío", estado: "activa", inversion: 210, resultados: 17, costoPorResultado: 12.4, roas: 2.6 },
  { clientId: "marcelo", tipo: "LT", nombre: "Ebook · Retarget IG 30d", estado: "activa", inversion: 80, resultados: 5, costoPorResultado: 16, roas: 2.1 },
  { clientId: "ezequiel", tipo: "HT", nombre: "Sanando Autoinmune · VSL Frío", estado: "aprendizaje", inversion: 120, resultados: 6, costoPorResultado: 20, roas: null },
  { clientId: "family", tipo: "LT", nombre: "Guía descargable · Frío", estado: "activa", inversion: 150, resultados: 11, costoPorResultado: 13.6, roas: 2.9 },
  { clientId: "family", tipo: "LT", nombre: "Mini-oferta · Retarget IG", estado: "activa", inversion: 90, resultados: 6, costoPorResultado: 15, roas: 2.2 },
  { clientId: "ezequiel", tipo: "LT", nombre: "Mini-curso piel · Frío", estado: "aprendizaje", inversion: 80, resultados: 3, costoPorResultado: 26.7, roas: 1.8 },
];

// ---------------- Rendimiento semanal de orgánico (3-4 métricas clave) ----------------

export interface OrganicWeekRow {
  label: string;
  values: (number | null)[];
  fmt?: "pct" | "n";
}

export const ORGANIC_WEEKS: Record<string, OrganicWeekRow[]> = {
  family: [
    { label: "Alcance", values: [11200, 12800, 15400, null], fmt: "n" },
    { label: "Interacción", values: [4.2, 4.6, 5.1, null], fmt: "pct" },
    { label: "Guardados + compartidos", values: [180, 210, 250, null], fmt: "n" },
    { label: "Mensajes / DMs", values: [14, 17, 21, null], fmt: "n" },
  ],
  marcelo: [
    { label: "Alcance", values: [6900, 7200, 8600, null], fmt: "n" },
    { label: "Interacción", values: [3.4, 3.8, 4.2, null], fmt: "pct" },
    { label: "Guardados + compartidos", values: [70, 85, 110, null], fmt: "n" },
    { label: "Mensajes / DMs", values: [11, 12, 15, null], fmt: "n" },
  ],
  ezequiel: [
    { label: "Alcance", values: [900, 1600, 2400, null], fmt: "n" },
    { label: "Interacción", values: [5.8, 6.1, 6.6, null], fmt: "pct" },
    { label: "Guardados + compartidos", values: [28, 41, 55, null], fmt: "n" },
    { label: "Mensajes / DMs", values: [3, 5, 7, null], fmt: "n" },
  ],
};

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
    nombre: "Ezequiel",
    nicho: "Autoinmunes de la piel · medicina funcional",
    oferta: "Sanando Autoinmune (high ticket)",
    initials: "EZ",
    color: "#a78bfa",
    metaSlugs: ["ezequiel", "sanando_autoinmune", "autoinmune"],
    cicloAncla: "2026-07-06",
    estrategia: {
      pilares: "50% Nutrición · 50% Atracción (dolor)",
      frecuenciaFeed: "1 video + 1 carrusel / semana",
      historias: "L autoridad · X conversión · V educación",
      tono: "Profesional, simple, sin agresividad",
    },
  },
];

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
      cadencia: "dias", dias: [day], R: "Patricio", A: "Rodrigo",
    });
  });
  if (plan.historiasModo !== "no") {
    const dias = plan.historiasModo === "lunvie" ? [0, 1, 2, 3, 4] : plan.historiasModo === "dias" ? plan.historiasDias : [];
    acts.push({
      id: `gen-${clientId}-hist`,
      clientId, area: "organico",
      nombre: plan.historiasModo === "diaria" ? "Publicar historia (diaria)" : "Publicar historia",
      cadencia: plan.historiasModo === "diaria" ? "diaria" : "dias",
      dias, R: "Patricio", A: "Rodrigo",
    });
  }
  return acts;
}

// Acciones fijas (no generadas por el plan de contenido)
const MANUAL_ACTIONS: Action[] = [
  // Family
  { id: "f-plan", clientId: "family", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Patricio", A: "Sebastián" },
  { id: "f-ads", clientId: "family", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "f-camp", clientId: "family", area: "trafico", nombre: "Revisar campañas · fatiga · CPL", cadencia: "semanal", dias: [2], R: "Rodrigo", A: "Sebastián" },
  { id: "f-fun", clientId: "family", area: "embudos", nombre: "Revisar conversión del funnel", cadencia: "semanal", dias: [4], R: "Sebastián", A: "Sebastián" },
  { id: "f-rev", clientId: "family", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
  // Marcelo
  { id: "m-plan", clientId: "marcelo", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Patricio", A: "Sebastián" },
  { id: "m-graba", clientId: "marcelo", area: "organico", nombre: "Cliente: revisar Notion + grabar", cadencia: "14d", dias: [1], R: "Cliente", A: "Rodrigo" },
  { id: "m-setter", clientId: "marcelo", area: "ventas", nombre: "Setter: gestionar chats y agendas", cadencia: "diaria", R: "Setter", A: "Rodrigo" },
  { id: "m-ads", clientId: "marcelo", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "m-rev", clientId: "marcelo", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
  // Ezequiel
  { id: "e-plan", clientId: "ezequiel", area: "organico", nombre: "Planificar contenido del ciclo", cadencia: "14d", dias: [0], R: "Patricio", A: "Sebastián" },
  { id: "e-graba", clientId: "ezequiel", area: "organico", nombre: "Cliente: grabar VSL + material", cadencia: "14d", dias: [1], R: "Cliente", A: "Rodrigo" },
  { id: "e-fun", clientId: "ezequiel", area: "embudos", nombre: "QA funnel HT (form → agenda)", cadencia: "semanal", dias: [2], R: "Sebastián", A: "Sebastián" },
  { id: "e-ads", clientId: "ezequiel", area: "trafico", nombre: "Cargar métricas de ads (semana)", cadencia: "semanal", dias: [4], R: "Javier", A: "Rodrigo" },
  { id: "e-rev", clientId: "ezequiel", area: "agencia", nombre: "Revisión de métricas (personal)", cadencia: "semanal", dias: [4], R: "Rodrigo", A: "Sebastián" },
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

// ---------------- Métricas de embudo (semanal, taxonomía del Excel) ----------------

export interface FunnelRow {
  label: string;
  values: (number | null)[]; // Sem 1..4
  fmt?: "usd" | "pct" | "x" | "n";
  benchmark?: string;
  status?: "ok" | "warn" | "bad"; // vs benchmark (demo)
  section?: string;
}

export const FUNNEL_HT: Record<string, FunnelRow[]> = {
  family: [
    { section: "Inversión & Tráfico — Meta Ads", label: "Inversión", values: [250, 250, 300, null], fmt: "usd" },
    { label: "Impresiones", values: [41200, 39800, 46500, null], fmt: "n" },
    { label: "CPM", values: [12.4, 13.1, 12.8, null], fmt: "usd", benchmark: "$10–23", status: "ok" },
    { label: "CTR (enlace)", values: [1.9, 1.6, 2.1, null], fmt: "pct", benchmark: ">1,5%", status: "ok" },
    { label: "CPC", values: [1.1, 1.4, 1.0, null], fmt: "usd", benchmark: "$1–2", status: "ok" },
    { section: "VSL / Landing — GHL", label: "Visitas LP", values: [430, 360, 510, null], fmt: "n" },
    { label: "Play rate", values: [44, 38, 47, null], fmt: "pct", benchmark: "30–50%+", status: "ok" },
    { section: "Lead & Agenda — GHL", label: "Leads / Opt-ins", values: [11, 8, 14, null], fmt: "n" },
    { label: "Tasa LP→Lead", values: [2.6, 2.2, 2.7, null], fmt: "pct", benchmark: "Frío 1–3%", status: "ok" },
    { label: "CPL", values: [22.7, 31.3, 21.4, null], fmt: "usd", benchmark: "$19–40", status: "ok" },
    { label: "Agendas", values: [4, 2, 6, null], fmt: "n" },
    { label: "Costo por agenda", values: [62, 125, 50, null], fmt: "usd", benchmark: "VSL frío $200+", status: "ok" },
    { section: "Cierre — GHL / Llamadas", label: "Show up rate", values: [75, 50, 83, null], fmt: "pct", benchmark: "50–80%", status: "ok" },
    { label: "Cierres", values: [1, 0, 2, null], fmt: "n" },
    { label: "Close rate", values: [33, 0, 40, null], fmt: "pct", benchmark: "Frío 10–25%", status: "warn" },
    { label: "Facturación", values: [890, 0, 1780, null], fmt: "usd" },
    { label: "ROAS", values: [3.6, 0, 5.9, null], fmt: "x", benchmark: "≥ 2–3x", status: "ok" },
  ],
  marcelo: [
    { section: "Inversión & Tráfico — Meta Ads", label: "Inversión", values: [180, 180, 200, null], fmt: "usd" },
    { label: "CPM", values: [9.8, 11.2, 10.4, null], fmt: "usd", benchmark: "$10–23", status: "ok" },
    { label: "CTR (enlace)", values: [1.3, 1.2, 1.5, null], fmt: "pct", benchmark: ">1,5%", status: "warn" },
    { section: "VSL / Landing — GHL", label: "Visitas LP", values: [310, 280, 340, null], fmt: "n" },
    { label: "Play rate", values: [29, 31, 33, null], fmt: "pct", benchmark: "30–50%+", status: "warn" },
    { section: "Lead & Agenda — GHL", label: "Leads / Opt-ins", values: [9, 7, 10, null], fmt: "n" },
    { label: "CPL", values: [20, 25.7, 20, null], fmt: "usd", benchmark: "$19–40", status: "ok" },
    { label: "Agendas", values: [2, 1, 3, null], fmt: "n" },
    { section: "Cierre — GHL / Llamadas", label: "Show up rate", values: [50, 100, 67, null], fmt: "pct", benchmark: "50–80%", status: "ok" },
    { label: "Cierres", values: [0, 0, 1, null], fmt: "n" },
    { label: "Close rate", values: [0, 0, 50, null], fmt: "pct", benchmark: "Frío 10–25%", status: "bad" },
    { label: "Facturación", values: [0, 0, 450, null], fmt: "usd" },
    { label: "ROAS", values: [0, 0, 2.3, null], fmt: "x", benchmark: "≥ 2–3x", status: "bad" },
  ],
  ezequiel: [
    { section: "Inversión & Tráfico — Meta Ads", label: "Inversión", values: [null, null, 120, null], fmt: "usd" },
    { label: "CPM", values: [null, null, 14.6, null], fmt: "usd", benchmark: "$10–23", status: "ok" },
    { label: "CTR (enlace)", values: [null, null, 2.4, null], fmt: "pct", benchmark: ">1,5%", status: "ok" },
    { section: "Lead & Agenda — GHL", label: "Leads / Opt-ins", values: [null, null, 6, null], fmt: "n" },
    { label: "CPL", values: [null, null, 20, null], fmt: "usd", benchmark: "$19–40", status: "ok" },
    { label: "Agendas", values: [null, null, 2, null], fmt: "n" },
    { section: "Cierre", label: "Cierres", values: [null, null, 0, null], fmt: "n" },
    { label: "Facturación", values: [null, null, 0, null], fmt: "usd" },
  ],
};

export const FUNNEL_LT: Record<string, FunnelRow[]> = {
  family: [
    { section: "Inversión & Tráfico — Meta Ads", label: "Inversión", values: [120, 130, 150, null], fmt: "usd" },
    { label: "CTR (enlace)", values: [2.1, 1.9, 2.3, null], fmt: "pct", benchmark: ">1,5%", status: "ok" },
    { label: "CPC", values: [0.8, 0.9, 0.7, null], fmt: "usd", benchmark: "$0,5–1,7", status: "ok" },
    { section: "Checkout & Venta — GHL", label: "Visitas LP", values: [640, 690, 780, null], fmt: "n" },
    { label: "Iniciar pago", values: [16, 18, 23, null], fmt: "n" },
    { label: "Compras (guía/mini)", values: [6, 7, 11, null], fmt: "n" },
    { label: "Tasa checkout→compra", values: [37, 39, 48, null], fmt: "pct", benchmark: "20–40%", status: "ok" },
    { label: "CVR total", values: [0.9, 1.0, 1.4, null], fmt: "pct", benchmark: "1–3%", status: "warn" },
    { label: "Ticket / AOV", values: [37, 37, 39, null], fmt: "usd" },
    { label: "Facturación", values: [222, 259, 429, null], fmt: "usd" },
    { label: "ROAS", values: [1.9, 2.0, 2.9, null], fmt: "x", benchmark: "3–5x", status: "warn" },
  ],
  marcelo: [
    { section: "Inversión & Tráfico — Meta Ads", label: "Inversión", values: [90, 90, 110, null], fmt: "usd" },
    { label: "CTR (enlace)", values: [1.8, 2.0, 2.2, null], fmt: "pct", benchmark: ">1,5%", status: "ok" },
    { label: "CPC", values: [0.7, 0.6, 0.6, null], fmt: "usd", benchmark: "$0,5–1,7", status: "ok" },
    { section: "Checkout & Venta — GHL", label: "Visitas LP", values: [520, 610, 700, null], fmt: "n" },
    { label: "Iniciar pago", values: [14, 19, 24, null], fmt: "n" },
    { label: "Compras (ebooks)", values: [5, 7, 10, null], fmt: "n" },
    { label: "Tasa checkout→compra", values: [36, 37, 42, null], fmt: "pct", benchmark: "20–40%", status: "ok" },
    { label: "CVR total", values: [1.0, 1.1, 1.4, null], fmt: "pct", benchmark: "1–3%", status: "ok" },
    { label: "Ticket / AOV", values: [27, 31, 34, null], fmt: "usd" },
    { label: "Facturación", values: [135, 217, 340, null], fmt: "usd" },
    { label: "ROAS", values: [1.5, 2.4, 3.1, null], fmt: "x", benchmark: "3–5x", status: "warn" },
  ],
  ezequiel: [
    { section: "Inversión & Tráfico — Meta Ads", label: "Inversión", values: [null, null, 80, null], fmt: "usd" },
    { label: "CTR (enlace)", values: [null, null, 2.2, null], fmt: "pct", benchmark: ">1,5%", status: "ok" },
    { label: "CPC", values: [null, null, 0.9, null], fmt: "usd", benchmark: "$0,5–1,7", status: "ok" },
    { section: "Checkout & Venta — GHL", label: "Visitas LP", values: [null, null, 320, null], fmt: "n" },
    { label: "Iniciar pago", values: [null, null, 8, null], fmt: "n" },
    { label: "Compras (mini-curso)", values: [null, null, 3, null], fmt: "n" },
    { label: "Tasa checkout→compra", values: [null, null, 38, null], fmt: "pct", benchmark: "20–40%", status: "ok" },
    { label: "CVR total", values: [null, null, 0.9, null], fmt: "pct", benchmark: "1–3%", status: "warn" },
    { label: "Ticket / AOV", values: [null, null, 47, null], fmt: "usd" },
    { label: "Facturación", values: [null, null, 141, null], fmt: "usd" },
    { label: "ROAS", values: [null, null, 1.8, null], fmt: "x", benchmark: "3–5x", status: "warn" },
  ],
};

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

export const ORGANIC: Record<string, OrganicSummary> = {
  family: { alcance: 48200, seguidores: 312, interaccion: 4.8, guardados: 640, mensajes: 58, leads: 17, piezasPlan: 4, piezasPublicadas: 4 },
  marcelo: { alcance: 26100, seguidores: 148, interaccion: 3.9, guardados: 290, mensajes: 41, leads: 12, piezasPlan: 4, piezasPublicadas: 3 },
  ezequiel: { alcance: 5400, seguidores: 89, interaccion: 6.2, guardados: 130, mensajes: 15, leads: 6, piezasPlan: 4, piezasPublicadas: 2 },
};

// ---------------- Ventas / resumen por cliente ----------------

export interface SalesSummary {
  facturacionCiclo: number;
  inversionCiclo: number;
  cierres: number;
  agendasPend: number;
  moneda: "USD";
}

export const SALES: Record<string, SalesSummary> = {
  family: { facturacionCiclo: 2670, inversionCiclo: 800, cierres: 3, agendasPend: 4, moneda: "USD" },
  marcelo: { facturacionCiclo: 1142, inversionCiclo: 850, cierres: 1, agendasPend: 2, moneda: "USD" },
  ezequiel: { facturacionCiclo: 0, inversionCiclo: 120, cierres: 0, agendasPend: 2, moneda: "USD" },
};

// ---------------- Metas ----------------

export interface Goal {
  clientId: string;
  area: Area;
  nombre: string;
  actual: number;
  objetivo: number;
  fmt: "usd" | "pct" | "x" | "n";
  plazo: string;
}

export const GOALS: Goal[] = [
  { clientId: "family", area: "ventas", nombre: "Facturación del mes", actual: 2670, objetivo: 4000, fmt: "usd", plazo: "Julio" },
  { clientId: "family", area: "trafico", nombre: "ROAS high ticket", actual: 3.3, objetivo: 3, fmt: "x", plazo: "Ciclo" },
  { clientId: "marcelo", area: "ventas", nombre: "Ventas de ebooks", actual: 22, objetivo: 40, fmt: "n", plazo: "Julio" },
  { clientId: "marcelo", area: "ventas", nombre: "Cierres HT con setter", actual: 1, objetivo: 4, fmt: "n", plazo: "Julio" },
  { clientId: "ezequiel", area: "embudos", nombre: "Agendas calificadas", actual: 2, objetivo: 10, fmt: "n", plazo: "Julio" },
  { clientId: "ezequiel", area: "organico", nombre: "Nuevos seguidores", actual: 89, objetivo: 500, fmt: "n", plazo: "Ago" },
];

// ---------------- Revisiones (ciclo 14 días) ----------------

export interface Review {
  clientId: string;
  ciclo: string;
  funciono: string[];
  noFunciono: string[];
  decisiones: string[];
  compromisos: { texto: string; R: Person; estado: "pendiente" | "hecho" }[];
}

export const REVIEWS: Review[] = [
  {
    clientId: "marcelo",
    ciclo: "22 jun – 5 jul",
    funciono: ["Ebooks despegando: 22 ventas, ROAS LT 3.1x en la semana 3", "Historias L–V sostenidas por primera vez"],
    noFunciono: ["Cierre por chat: leads calificados quemados por exceso de mensajes (audio 4:30 + VSL + link de pago)", "CTR de ads HT bajo benchmark (1,3% vs >1,5%)"],
    decisiones: ["Onboarding de Ina (setter) con 10% de comisión por venta de chat", "Feedback constructivo a Marcelo sobre proceso de venta", "Nuevos creativos con vestimenta veterinaria para autoridad"],
    compromisos: [
      { texto: "Reunión de presentación Ina ↔ Marcelo", R: "Rodrigo", estado: "pendiente" },
      { texto: "Inducción de tareas diarias a Ina", R: "Rodrigo", estado: "pendiente" },
      { texto: "Iterar creativos de ads HT (2 variantes)", R: "Rodrigo", estado: "pendiente" },
    ],
  },
  {
    clientId: "family",
    ciclo: "15 jun – 28 jun",
    funciono: ["ROAS 3.6x en semana 1", "Tasa de interacción 4,8% sobre el promedio del nicho"],
    noFunciono: ["Semana 2 sin cierres (show up 50%)"],
    decisiones: ["Recordatorios SMS + email antes de la llamada", "Duplicar presupuesto del creativo ganador"],
    compromisos: [
      { texto: "Configurar workflow de recordatorios en GHL", R: "Sebastián", estado: "hecho" },
      { texto: "Escalar campaña ganadora a $300/sem", R: "Rodrigo", estado: "hecho" },
    ],
  },
];

// ---------------- Alertas ----------------

export interface Alerta {
  tipo: "dato" | "accion" | "revision";
  texto: string;
  clientId: string | null;
}

export const ALERTAS: Alerta[] = [
  { tipo: "dato", texto: "Ezequiel: semana 4 de ads sin cargar (vence hoy)", clientId: "ezequiel" },
  { tipo: "accion", texto: "Marcelo: 'Cliente: revisar Notion + grabar' vencida hace 2 días", clientId: "marcelo" },
  { tipo: "revision", texto: "Ezequiel: primera revisión de ciclo agendada para el lunes", clientId: "ezequiel" },
];

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
