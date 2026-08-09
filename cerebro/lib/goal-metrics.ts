"use client";

// Catálogo de métricas vivas para las Metas y su cálculo desde Supabase
// (datos que llegan por las automatizaciones de Make: Meta Ads, Instagram,
// GoHighLevel, Ventas, y el Planificador de contenido).
// El usuario define la meta (nombre, objetivo, métrica, período) y el valor
// "actual" se calcula solo, semana a semana, desde los datos reales.

import { supabase } from "./supabase";
import { CLIENTS } from "./data";

export type GoalPeriodo = "semana" | "ciclo" | "mes" | "total";
export const PERIODOS: { value: GoalPeriodo; label: string }[] = [
  { value: "semana", label: "Esta semana" },
  { value: "ciclo", label: "Ciclo (14 días)" },
  { value: "mes", label: "Últimos 30 días" },
  { value: "total", label: "Histórico" },
];

export interface GoalMetric {
  value: string;
  label: string;
  fuente: string;   // Meta Ads · Instagram · GHL · Ventas · Contenido · Manual
  fmt: "usd" | "pct" | "x" | "n";
}

export const GOAL_METRICS: GoalMetric[] = [
  { value: "manual", label: "Manual (lo cargo yo)", fuente: "Manual", fmt: "n" },
  // Meta Ads
  { value: "meta_spend", label: "Inversión Meta Ads", fuente: "Meta Ads", fmt: "usd" },
  { value: "meta_leads", label: "Leads generados (Meta)", fuente: "Meta Ads", fmt: "n" },
  { value: "meta_purchases", label: "Compras (Meta)", fuente: "Meta Ads", fmt: "n" },
  { value: "meta_roas", label: "ROAS (Meta)", fuente: "Meta Ads", fmt: "x" },
  // Instagram
  { value: "ig_alcance", label: "Alcance en Instagram", fuente: "Instagram", fmt: "n" },
  { value: "ig_guardados", label: "Guardados + compartidos", fuente: "Instagram", fmt: "n" },
  { value: "ig_interacciones", label: "Interacciones", fuente: "Instagram", fmt: "n" },
  { value: "ig_piezas", label: "Piezas publicadas (IG)", fuente: "Instagram", fmt: "n" },
  // GoHighLevel
  { value: "ghl_agendas", label: "Agendas (GHL)", fuente: "GHL", fmt: "n" },
  { value: "ghl_ventas", label: "Cierres / ventas (GHL)", fuente: "GHL", fmt: "n" },
  // Ventas
  { value: "ventas_facturacion", label: "Facturación (ventas)", fuente: "Ventas", fmt: "usd" },
  { value: "ventas_aprobadas", label: "Ventas aprobadas", fuente: "Ventas", fmt: "n" },
  // Planificador
  { value: "piezas_publicadas", label: "Piezas marcadas publicadas", fuente: "Contenido", fmt: "n" },
];

export const metricDef = (key?: string) => GOAL_METRICS.find((m) => m.value === key);
export const isAutoMetric = (key?: string) => !!key && key !== "manual";

// ---------------- Objetivos genéricos (lenguaje de negocio) ----------------
// El usuario elige un objetivo simple y el software mapea a la métrica técnica,
// período y formato. Así no hay que entender de qué tabla sale cada número.

export interface GoalObjetivo {
  key: string;
  label: string;      // en lenguaje de negocio
  emoji: string;
  metrica: string;    // métrica técnica a la que mapea
  periodo: GoalPeriodo;
  sugerido: number;   // objetivo sugerido por defecto
  hint: string;       // de dónde sale
}

export const GOAL_OBJETIVOS: GoalObjetivo[] = [
  { key: "ventas", label: "Ventas / cierres", emoji: "💰", metrica: "ghl_ventas", periodo: "mes", sugerido: 5, hint: "cierres del embudo (GHL)" },
  { key: "facturacion", label: "Facturación", emoji: "💵", metrica: "ventas_facturacion", periodo: "mes", sugerido: 5000, hint: "compras/pagos reales" },
  { key: "leads", label: "Leads / interesados", emoji: "🎯", metrica: "meta_leads", periodo: "mes", sugerido: 50, hint: "leads de Meta Ads" },
  { key: "agendas", label: "Agendas / reuniones", emoji: "📅", metrica: "ghl_agendas", periodo: "mes", sugerido: 20, hint: "agendas del embudo (GHL)" },
  { key: "alcance", label: "Alcance en Instagram", emoji: "📣", metrica: "ig_alcance", periodo: "mes", sugerido: 20000, hint: "alcance orgánico (IG)" },
  { key: "interaccion", label: "Interacción (guardados/comp.)", emoji: "💬", metrica: "ig_guardados", periodo: "mes", sugerido: 200, hint: "guardados + compartidos (IG)" },
  { key: "roas", label: "ROAS (retorno de ads)", emoji: "📈", metrica: "meta_roas", periodo: "mes", sugerido: 3, hint: "retorno de Meta Ads" },
  { key: "inversion", label: "Inversión en ads", emoji: "🪙", metrica: "meta_spend", periodo: "mes", sugerido: 1000, hint: "gasto en Meta Ads" },
  { key: "contenido", label: "Piezas publicadas", emoji: "🎬", metrica: "piezas_publicadas", periodo: "mes", sugerido: 8, hint: "piezas marcadas publicadas" },
  { key: "manual", label: "Otra (la cargo yo)", emoji: "✏️", metrica: "manual", periodo: "semana", sugerido: 100, hint: "sin fuente automática" },
];

export const objetivoByKey = (key: string) => GOAL_OBJETIVOS.find((o) => o.key === key);
// Dado el metrica técnico guardado, encontrar el objetivo genérico para mostrar.
export const objetivoForMetric = (metrica?: string): GoalObjetivo =>
  GOAL_OBJETIVOS.find((o) => o.metrica === metrica) ?? GOAL_OBJETIVOS[GOAL_OBJETIVOS.length - 1];

// Autodetección: adivina el objetivo desde el nombre de la meta.
export function inferObjetivo(nombre: string): GoalObjetivo | null {
  const t = (nombre || "").toLowerCase();
  const has = (...ws: string[]) => ws.some((w) => t.includes(w));
  if (has("factur", "ingres", "revenue", "usd", "$")) return objetivoByKey("facturacion")!;
  if (has("roas", "retorno")) return objetivoByKey("roas")!;
  if (has("invers", "gasto", "spend", "presupuesto", "pauta")) return objetivoByKey("inversion")!;
  if (has("venta", "cierre", "vender", "compra")) return objetivoByKey("ventas")!;
  if (has("lead", "interesad", "contacto")) return objetivoByKey("leads")!;
  if (has("agenda", "reunion", "reunión", "booking", "cita", "llamada")) return objetivoByKey("agendas")!;
  if (has("guardad", "compart", "interacc", "engagement")) return objetivoByKey("interaccion")!;
  if (has("alcance", "reach", "impresion", "seguidor")) return objetivoByKey("alcance")!;
  if (has("pieza", "publicad", "reel", "contenido", "post", "carrusel", "historia")) return objetivoByKey("contenido")!;
  return null;
}

const num = (v: unknown) => Number(v) || 0;

function rangeStart(periodo?: string): string | null {
  if (!periodo || periodo === "total") return null;
  const days = periodo === "semana" ? 7 : periodo === "ciclo" ? 14 : 30;
  const d = new Date();
  d.setDate(d.getDate() - days + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const VENTA_OK = ["approved", "complete", "completed", "paid", "active", "won"];

// Calcula el valor actual de una meta desde los datos reales.
// Devuelve null si la métrica no es auto (manual) o no se reconoce.
export async function computeGoalActual(metrica: string, clientId: string, periodo?: string): Promise<number | null> {
  if (!isAutoMetric(metrica)) return null;
  const client = CLIENTS.find((c) => c.id === clientId);
  const slugs = client?.metaSlugs ?? [clientId];
  const from = rangeStart(periodo);

  // Meta Ads: las filas son snapshots acumulados por anuncio → tomamos la más
  // reciente por anuncio dentro del rango para no sumar duplicados.
  if (metrica.startsWith("meta_")) {
    let q = supabase
      .from("campaign_metrics")
      .select("fecha, ad_id, adset_id, campaign_id, spend, leads, purchases, purchase_value")
      .in("cliente", slugs);
    if (from) q = q.gte("fecha", from);
    const { data } = await q.limit(5000);
    if (!data) return 0;
    const latest = new Map<string, any>();
    for (const r of data as any[]) {
      const k = r.ad_id ?? r.adset_id ?? r.campaign_id ?? "";
      const prev = latest.get(k);
      if (!prev || (r.fecha ?? "") > (prev.fecha ?? "")) latest.set(k, r);
    }
    const rows = [...latest.values()];
    const spend = rows.reduce((a, r) => a + num(r.spend), 0);
    if (metrica === "meta_spend") return spend;
    if (metrica === "meta_leads") return rows.reduce((a, r) => a + num(r.leads), 0);
    if (metrica === "meta_purchases") return rows.reduce((a, r) => a + num(r.purchases), 0);
    if (metrica === "meta_roas") {
      const pv = rows.reduce((a, r) => a + num(r.purchase_value), 0);
      return spend ? Math.round((pv / spend) * 100) / 100 : 0;
    }
  }

  // Instagram: una fila por pieza con su propia fecha → sumar dentro del rango.
  if (metrica.startsWith("ig_")) {
    const { data } = await supabase
      .from("organic_content")
      .select("fecha, publicado, alcance, guardados, compartidos, interacciones, likes, comentarios, producto")
      .in("cliente", slugs)
      .limit(2000);
    if (!data) return 0;
    const inRange = (r: any) => {
      if (!from) return true;
      const d = r.fecha || (r.publicado ? String(r.publicado).slice(0, 10) : "");
      return d >= from;
    };
    const rows = (data as any[]).filter((r) => inRange(r) && !String(r.producto || "").toUpperCase().includes("STOR"));
    if (metrica === "ig_alcance") return rows.reduce((a, r) => a + num(r.alcance), 0);
    if (metrica === "ig_guardados") return rows.reduce((a, r) => a + num(r.guardados) + num(r.compartidos), 0);
    if (metrica === "ig_interacciones") return rows.reduce((a, r) => a + (num(r.interacciones) || num(r.likes) + num(r.comentarios)), 0);
    if (metrica === "ig_piezas") return rows.length;
  }

  // GoHighLevel: conteos por día → sumar dentro del rango.
  if (metrica.startsWith("ghl_")) {
    let q = supabase.from("ht_pipeline").select("fecha, bookings, ventas").in("cliente", slugs);
    if (from) q = q.gte("fecha", from);
    const { data } = await q.limit(2000);
    if (!data) return 0;
    if (metrica === "ghl_agendas") return (data as any[]).reduce((a, r) => a + num(r.bookings), 0);
    if (metrica === "ghl_ventas") return (data as any[]).reduce((a, r) => a + num(r.ventas), 0);
  }

  // Ventas: un evento por compra/pago.
  if (metrica.startsWith("ventas_")) {
    let q = supabase.from("ventas").select("fecha, monto, estado").in("cliente", slugs);
    if (from) q = q.gte("fecha", from);
    const { data } = await q.limit(2000);
    if (!data) return 0;
    const ok = (data as any[]).filter((r) => VENTA_OK.some((s) => String(r.estado || "").toLowerCase().includes(s)));
    if (metrica === "ventas_facturacion") return ok.reduce((a, r) => a + num(r.monto), 0);
    if (metrica === "ventas_aprobadas") return ok.length;
  }

  // Planificador de contenido.
  if (metrica === "piezas_publicadas") {
    let q = supabase.from("content_pieces").select("fecha_pub").eq("cliente", clientId).eq("estado", "Publicado");
    if (from) q = q.gte("fecha_pub", from);
    const { data } = await q.limit(2000);
    return data ? data.length : 0;
  }

  return null;
}
