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
  actual: number;
  objetivo: number;
  fmt: "usd" | "pct" | "x" | "n";
  plazo: string;
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
