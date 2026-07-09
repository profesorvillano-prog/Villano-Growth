"use client";

// Perfil de cliente: resumen, tracker, métricas por área, revisiones y estrategia.

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Stat, Avatar, AreaBadge } from "@/components/ui";
import { TrackerGrid } from "@/components/tracker";
import {
  CLIENTS, ContentPlan, DAY_LABELS, HistoriasModo,
  NOTION_STATES, ORGANIC, ORGANIC_WEEKS, PROCESS_STEPS, REVIEWS, SALES,
  complianceFor, distributeDays, fmtVal,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { StrategyData, useData } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { isoKey } from "@/lib/date";
import { AddBtn, DeleteBtn, ENum, ESelect, EText } from "@/components/editable";

const TABS = ["Resumen", "Acciones", "Orgánico", "Meta Ads", "Revisiones", "Estrategia"] as const;

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = CLIENTS.find((c) => c.id === id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Resumen");
  const { done } = useStore();
  const db = useData();

  if (!client) notFound();

  const pct = complianceFor(db.actions.filter((a) => a.clientId === id), done);
  const sales = SALES[id];
  const org = ORGANIC[id];
  const reviews = REVIEWS.filter((r) => r.clientId === id);
  const goals = db.goals.filter((g) => g.clientId === id);
  const estrategia = db.strategies[id] ?? { ...client.estrategia, oferta: client.oferta };

  return (
    <Shell
      title={client.nombre}
      sub={`${client.nicho} · ${client.oferta}`}
      right={
        <span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">
          Ciclo 14d desde <span className="font-medium text-ink">{client.cicloAncla.slice(5)}</span>
        </span>
      }
    >
      <nav className="mb-5 flex flex-wrap gap-1 rounded-xl border border-line bg-panel p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
              tab === t ? "bg-accent text-white" : "text-mute hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Resumen" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4"><Stat label="Facturación ciclo" value={fmtVal(sales.facturacionCiclo, "usd")} hint={`inversión ${fmtVal(sales.inversionCiclo, "usd")}`} /></Card>
            <Card className="p-4"><Stat label="ROAS blended" value={sales.inversionCiclo ? fmtVal(sales.facturacionCiclo / sales.inversionCiclo, "x") : "—"} tone={sales.facturacionCiclo / Math.max(1, sales.inversionCiclo) >= 2 ? "ok" : "warn"} /></Card>
            <Card className="p-4"><Stat label="Cumplimiento sem." value={pct + "%"} tone={pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad"} /></Card>
            <Card className="p-4"><Stat label="Leads orgánicos" value={String(org.leads)} hint={`${org.mensajes} mensajes`} /></Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHead title="Metas activas" />
              <ul className="space-y-3 px-5 py-4">
                {goals.length === 0 && <li className="text-sm text-dim">Sin metas definidas.</li>}
                {goals.map((g, i) => {
                  const p = Math.min(100, Math.round((g.actual / g.objetivo) * 100));
                  return (
                    <li key={i}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-mute">{g.nombre} <AreaBadge area={g.area} /></span>
                        <span className="tabular-nums text-dim">{fmtVal(g.actual, g.fmt)} / {fmtVal(g.objetivo, g.fmt)} · {g.plazo}</span>
                      </div>
                      <Progress pct={p} h={5} color={client.color} />
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card>
              <CardHead title="Última revisión" sub={reviews[0] ? `Ciclo ${reviews[0].ciclo}` : "Aún sin revisiones"} />
              {reviews[0] ? (
                <div className="space-y-3 px-5 py-4 text-sm">
                  <p><span className="font-medium text-ok">Funcionó:</span> <span className="text-mute">{reviews[0].funciono[0]}</span></p>
                  <p><span className="font-medium text-bad">No funcionó:</span> <span className="text-mute">{reviews[0].noFunciono[0]}</span></p>
                  <p><span className="font-medium text-accent2">Decisión:</span> <span className="text-mute">{reviews[0].decisiones[0]}</span></p>
                </div>
              ) : (
                <p className="px-5 py-4 text-sm text-dim">La primera revisión se genera al cerrar el ciclo de 14 días.</p>
              )}
            </Card>
          </div>
        </div>
      )}

      {tab === "Acciones" && (
        <Card>
          <CardHead title="Acciones recurrentes del cliente" sub="Incluye acciones del infoproductor y colaboradores (las marca su accountable)" />
          <TrackerGrid filter={(a) => a.clientId === id} addClientId={id} />
        </Card>
      )}

      {tab === "Orgánico" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Card className="p-4"><Stat label="Alcance" value={org.alcance.toLocaleString("es-CL")} /></Card>
            <Card className="p-4"><Stat label="Seguidores +" value={"+" + org.seguidores} /></Card>
            <Card className="p-4"><Stat label="Interacción" value={org.interaccion + "%"} tone="ok" /></Card>
            <Card className="p-4"><Stat label="Guardados" value={String(org.guardados)} /></Card>
            <Card className="p-4"><Stat label="Mensajes" value={String(org.mensajes)} /></Card>
            <Card className="p-4"><Stat label="Leads" value={String(org.leads)} tone="ok" /></Card>
          </div>
          <Card>
            <CardHead title="Rendimiento semanal" sub="Las 4 métricas clave para vender orgánico en Instagram — revisión semanal de Patricio" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-dim">
                    <th className="py-2 pl-5 pr-3 text-left font-medium">Métrica</th>
                    {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((s) => (
                      <th key={s} className="px-3 py-2 text-right font-medium">{s}</th>
                    ))}
                    <th className="py-2 pl-3 pr-5 text-right font-medium">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {(ORGANIC_WEEKS[id] ?? []).map((r, i) => {
                    const vals = r.values.filter((v): v is number => v !== null);
                    const up = vals.length >= 2 && vals[vals.length - 1] > vals[0];
                    return (
                      <tr key={i} className="border-t border-line/60 hover:bg-soft/30">
                        <td className="py-2 pl-5 pr-3 text-mute">{r.label}</td>
                        {r.values.map((v, j) => (
                          <td key={j} className={`px-3 py-2 text-right tabular-nums ${v === null ? "text-dim" : ""}`}>{fmtVal(v, r.fmt)}</td>
                        ))}
                        <td className={`py-2 pl-3 pr-5 text-right text-xs font-medium ${up ? "text-ok" : "text-warn"}`}>{up ? "↗ subiendo" : "→ plana"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <CardHead title="Ejecución del plan de contenido" sub="La planificación y las métricas por pieza (reels, stories, carruseles, YouTube) viven en la base de Notion del cliente" />
            <div className="px-5 py-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-mute">Piezas publicadas vs plan del ciclo (≥1 semana de antelación)</span>
                <span className="tabular-nums text-ink">{org.piezasPublicadas}/{org.piezasPlan}</span>
              </div>
              <Progress pct={(org.piezasPublicadas / org.piezasPlan) * 100} color={client.color} />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-dim">Estados en Notion del cliente:</span>
                {NOTION_STATES.map((s) => (
                  <span key={s} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-mute">{s}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-dim">Plan vigente: Feed {(db.plans[id]?.feedDias.length ?? 0)}/sem · Historias {db.plans[id]?.historiasModo === "diaria" ? "diarias" : db.plans[id]?.historiasModo === "lunvie" ? "L–V" : db.plans[id]?.historiasModo === "dias" ? `${db.plans[id]?.historiasDias.length}/sem` : "no"} · <span className="text-mute">se edita en Estrategia</span></p>
            </div>
          </Card>
        </div>
      )}

      {tab === "Meta Ads" && (
        <MetaLiveCard slugs={client.metaSlugs} color={client.color} />
      )}

      {tab === "Revisiones" && (
        <div className="space-y-4">
          {reviews.length === 0 && (
            <Card className="p-6 text-sm text-dim">La primera revisión se genera automáticamente al cerrar el ciclo de 14 días ({client.cicloAncla}).</Card>
          )}
          {reviews.map((r, i) => (
            <Card key={i}>
              <CardHead title={`Revisión · ciclo ${r.ciclo}`} sub="Snapshot + decisiones + compromisos" />
              <div className="grid gap-5 px-5 py-4 md:grid-cols-3">
                <ListBlock title="Funcionó" tone="text-ok" items={r.funciono} />
                <ListBlock title="No funcionó" tone="text-bad" items={r.noFunciono} />
                <ListBlock title="Decisiones" tone="text-accent2" items={r.decisiones} />
              </div>
              <div className="border-t border-line px-5 py-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dim">Compromisos</p>
                <ul className="space-y-2">
                  {r.compromisos.map((c, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md border text-[10px] ${c.estado === "hecho" ? "border-accent bg-accent text-white" : "border-line bg-soft/50"}`}>
                        {c.estado === "hecho" ? "✓" : ""}
                      </span>
                      <span className={c.estado === "hecho" ? "text-dim line-through" : "text-mute"}>{c.texto}</span>
                      <Avatar name={c.R} size={20} />
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Estrategia" && (
        <div className="space-y-4">
          <ContentPlanEditor
            plan={db.plans[id] ?? { feedTipo: "Publicación", feedDias: [1, 3], historiasModo: "diaria", historiasDias: [] }}
            onChange={(plan) => db.setContentPlan(id, plan)}
            color={client.color}
          />
          <Card>
            <CardHead title="Estrategia viva" sub="Editable — se revisa en la reunión mensual con el cliente. El proceso SOP y los estados de Notion son fijos." />
            <dl className="divide-y divide-line/60">
              {(
                [
                  ["Pilares de contenido", "pilares"],
                  ["Tono de comunicación", "tono"],
                  ["Oferta principal", "oferta"],
                ] as [string, keyof StrategyData][]
              ).map(([label, key]) => (
                <div key={key} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[220px_1fr]">
                  <dt className="text-xs font-medium uppercase tracking-wide text-dim">{label}</dt>
                  <dd className="text-sm text-mute">
                    <EText
                      value={estrategia[key]}
                      onSave={(v) => db.update("strategies", { ...db.strategies, [id]: { ...estrategia, [key]: v } })}
                      className="text-sm"
                    />
                  </dd>
                </div>
              ))}
              {[
                ["Proceso de contenido (SOP fijo)", PROCESS_STEPS.map((s) => s.split(" (")[0]).join(" → ")],
                ["Estados en Notion del cliente", NOTION_STATES.join(" → ")],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[220px_1fr]">
                  <dt className="text-xs font-medium uppercase tracking-wide text-dim">{k}</dt>
                  <dd className="text-sm text-dim">{v} <span className="ml-1 text-[10px]">🔒</span></dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}
    </Shell>
  );
}

// ---------- Editor del plan de contenido (frecuencia → acciones) ----------

function DayChips({ active, onToggle, color = "#8b5cf6" }: { active: number[]; onToggle: (d: number) => void; color?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {DAY_LABELS.map((label, d) => {
        const on = active.includes(d);
        return (
          <button
            key={d}
            onClick={() => onToggle(d)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
              on ? "text-white" : "border-line text-mute hover:border-accent/50 hover:text-ink"
            }`}
            style={on ? { background: color, borderColor: color } : undefined}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const HIST_MODOS: { value: HistoriasModo; label: string }[] = [
  { value: "diaria", label: "Todos los días" },
  { value: "lunvie", label: "Lun–Vie" },
  { value: "dias", label: "Días específicos" },
  { value: "no", label: "Sin historias" },
];

function ContentPlanEditor({ plan, onChange, color }: { plan: ContentPlan; onChange: (p: ContentPlan) => void; color: string }) {
  const set = (patch: Partial<ContentPlan>) => onChange({ ...plan, ...patch });
  const toggleFeed = (d: number) =>
    set({ feedDias: plan.feedDias.includes(d) ? plan.feedDias.filter((x) => x !== d) : [...plan.feedDias, d].sort((a, b) => a - b) });
  const toggleHist = (d: number) =>
    set({ historiasDias: plan.historiasDias.includes(d) ? plan.historiasDias.filter((x) => x !== d) : [...plan.historiasDias, d].sort((a, b) => a - b) });

  const histCount = plan.historiasModo === "diaria" ? 7 : plan.historiasModo === "lunvie" ? 5 : plan.historiasModo === "dias" ? plan.historiasDias.length : 0;

  return (
    <Card>
      <CardHead
        title="Plan de contenido"
        sub="La frecuencia se convierte en acciones del tracker (Semana y Hoy). Elegí cuántas y en qué días."
        right={
          <span className="rounded-full border px-2.5 py-1 text-[11px]" style={{ borderColor: color + "66", color }}>
            {plan.feedDias.length} feed/sem · {histCount ? `${histCount} historias/sem` : "sin historias"}
          </span>
        }
      />
      <div className="grid gap-6 px-5 py-5 lg:grid-cols-2">
        {/* FEED */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dim">Feed</p>
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="text-mute">Tipo de pieza:</span>
            <EText value={plan.feedTipo} onSave={(v) => set({ feedTipo: v })} className="text-sm text-ink" />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-mute">Publicaciones / semana:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => set({ feedDias: distributeDays(n) })}
                className={`h-7 w-7 rounded-lg border text-xs font-semibold transition-colors ${
                  plan.feedDias.length === n ? "border-accent bg-accent text-white" : "border-line text-mute hover:text-ink"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="text-[11px] text-dim">(reparte parejo)</span>
          </div>
          <p className="mb-1.5 text-[11px] text-dim">O elegí los días manualmente:</p>
          <DayChips active={plan.feedDias} onToggle={toggleFeed} color={color} />
          <p className="mt-3 text-[11px] text-dim">
            → Genera <span className="font-medium text-mute">{plan.feedDias.length}</span> acción(es) de feed, una por día elegido.
          </p>
        </div>

        {/* HISTORIAS */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dim">Historias</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {HIST_MODOS.map((m) => (
              <button
                key={m.value}
                onClick={() => set({ historiasModo: m.value })}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  plan.historiasModo === m.value ? "border-accent bg-accent text-white" : "border-line text-mute hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {plan.historiasModo === "dias" && (
            <>
              <p className="mb-1.5 text-[11px] text-dim">Días de historias:</p>
              <DayChips active={plan.historiasDias} onToggle={toggleHist} color={color} />
            </>
          )}
          <p className="mt-3 text-[11px] text-dim">
            {plan.historiasModo === "no"
              ? "→ No genera acción de historias."
              : `→ Genera 1 acción de historias que se marca ${histCount === 7 ? "cada día" : `${histCount} día(s) por semana`}.`}
          </p>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3 text-[11px] text-dim">
        Las acciones generadas aparecen en la pestaña <span className="text-mute">Acciones</span> y en <span className="text-mute">Semana</span>, y se completan como cualquier hábito. Editá el plan y se re-sincronizan solas.
      </p>
    </Card>
  );
}

// ---------- Explorador de Meta Ads (datos reales · filtro de fecha · drill-down) ----------

interface MetaRow {
  fecha: string; account_name: string | null; currency: string | null;
  campaign_id: string | null; campaign_name: string | null;
  adset_id: string | null; adset_name: string | null;
  ad_id: string | null; ad_name: string | null;
  thumbnail_url: string | null; preview_url: string | null;
  spend: number; impressions: number; clicks: number;
  leads: number; purchases: number; purchase_value: number; synced_at?: string;
}

const NIVELES = [
  { key: "campaign", idF: "campaign_id", nameF: "campaign_name", label: "Campañas", singular: "Campaña" },
  { key: "adset", idF: "adset_id", nameF: "adset_name", label: "Conjuntos", singular: "Conjunto" },
  { key: "ad", idF: "ad_id", nameF: "ad_name", label: "Anuncios", singular: "Anuncio" },
] as const;

const PRESETS: { d: number; label: string }[] = [
  { d: 7, label: "7 días" }, { d: 14, label: "14 días" }, { d: 30, label: "30 días" }, { d: 90, label: "90 días" },
];

type Agg = { spend: number; impressions: number; clicks: number; leads: number; purchases: number; purchase_value: number };
const emptyAgg = (): Agg => ({ spend: 0, impressions: 0, clicks: 0, leads: 0, purchases: 0, purchase_value: 0 });
function addRow(a: Agg, r: MetaRow) {
  a.spend += Number(r.spend) || 0; a.impressions += Number(r.impressions) || 0;
  a.clicks += Number(r.clicks) || 0; a.leads += Number(r.leads) || 0;
  a.purchases += Number(r.purchases) || 0; a.purchase_value += Number(r.purchase_value) || 0;
  return a;
}

function MetaLiveCard({ slugs, color }: { slugs: string[]; color: string }) {
  const [rows, setRows] = useState<MetaRow[] | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [preset, setPreset] = useState(30);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [path, setPath] = useState<{ id: string; name: string }[]>([]);

  // Inicializa el rango al montar (fecha real del navegador)
  useEffect(() => {
    const t = new Date();
    const f = new Date(); f.setDate(f.getDate() - 30 + 1);
    setTo(isoKey(t)); setFrom(isoKey(f));
  }, []);

  // Cambia el rango con un preset
  const applyPreset = (d: number) => {
    const t = new Date();
    const f = new Date(); f.setDate(f.getDate() - d + 1);
    setPreset(d); setTo(isoKey(t)); setFrom(isoKey(f)); setPath([]);
  };

  useEffect(() => {
    if (!from || !to) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("campaign_metrics")
        .select("fecha, account_name, currency, campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name, thumbnail_url, preview_url, spend, impressions, clicks, leads, purchases, purchase_value, synced_at")
        .in("cliente", slugs)
        .gte("fecha", from)
        .lte("fecha", to)
        .order("fecha", { ascending: false })
        .limit(2000);
      if (!active) return;
      const rs = (data ?? []) as MetaRow[];
      setRows(rs);
      if (rs.length) setSyncedAt((rs[0] as any).synced_at ?? null);
    })();
    return () => { active = false; };
  }, [slugs.join(","), from, to]);

  if (rows === null) return <Card className="p-6 text-sm text-dim">Cargando Meta Ads…</Card>;

  const cur = rows[0]?.currency || "CLP";
  const money = (n: number) => `${cur} ${Math.round(n).toLocaleString("es-CL")}`;

  // Filtra por el camino de drill-down actual
  let filtered = rows;
  path.forEach((step, i) => {
    const f = NIVELES[i].idF as keyof MetaRow;
    filtered = filtered.filter((r) => (r[f] ?? "") === step.id);
  });

  const depth = path.length;
  const nivel = NIVELES[depth]; // undefined si ya estamos en el máximo detalle
  const totals = filtered.reduce((a, r) => addRow(a, r), emptyAgg());

  // Agrupa por el nivel siguiente
  type Grp = { id: string; name: string; thumb: string | null; preview: string | null; agg: Agg };
  let groups: Grp[] = [];
  if (nivel) {
    const idF = nivel.idF as keyof MetaRow;
    const nameF = nivel.nameF as keyof MetaRow;
    const map = new Map<string, Grp>();
    for (const r of filtered) {
      const id = (r[idF] as string) ?? "";
      if (!id) continue; // no hay datos a este nivel
      const g = map.get(id) ?? { id, name: (r[nameF] as string) || id, thumb: r.thumbnail_url, preview: r.preview_url, agg: emptyAgg() };
      addRow(g.agg, r);
      if (!g.thumb && r.thumbnail_url) g.thumb = r.thumbnail_url;
      map.set(id, g);
    }
    groups = [...map.values()].sort((a, b) => b.agg.spend - a.agg.spend);
  }

  const ctr = (a: Agg) => (a.impressions ? (a.clicks / a.impressions) * 100 : 0);
  const cpc = (a: Agg) => (a.clicks ? a.spend / a.clicks : 0);
  const esAnuncio = nivel?.key === "ad";

  return (
    <Card>
      <CardHead
        title="Meta Ads"
        sub="Datos reales de la cuenta · filtrá por fecha y hacé clic para ver el detalle"
        right={
          <span className="flex items-center gap-2 text-[11px] text-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
            {syncedAt ? `sync ${new Date(syncedAt).toLocaleDateString("es-CL")}` : "en vivo"}
          </span>
        }
      />

      {/* Filtro de fecha */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
          {PRESETS.map((p) => (
            <button
              key={p.d}
              onClick={() => applyPreset(p.d)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${preset === p.d ? "bg-accent text-white" : "text-mute hover:text-ink"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-dim">o rango:</span>
        <input type="date" value={from} onChange={(e) => { setPreset(0); setFrom(e.target.value); setPath([]); }}
          className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
        <span className="text-dim">→</span>
        <input type="date" value={to} onChange={(e) => { setPreset(0); setTo(e.target.value); setPath([]); }}
          className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
      </div>

      {/* Breadcrumb de drill-down */}
      <div className="flex flex-wrap items-center gap-1.5 px-5 py-2.5 text-xs">
        <button onClick={() => setPath([])} className={`rounded px-1.5 py-0.5 ${depth === 0 ? "font-medium text-ink" : "text-accent2 hover:bg-soft"}`}>
          {rows[0]?.account_name || "Cuenta"}
        </button>
        {path.map((step, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-dim">›</span>
            <button onClick={() => setPath(path.slice(0, i + 1))} className={`rounded px-1.5 py-0.5 ${i === depth - 1 ? "font-medium text-ink" : "text-accent2 hover:bg-soft"}`}>
              {step.name}
            </button>
          </span>
        ))}
      </div>

      {/* Totales del nivel actual */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-4 sm:grid-cols-5">
        <Stat label="Inversión" value={money(totals.spend)} />
        <Stat label="Impresiones" value={totals.impressions.toLocaleString("es-CL")} />
        <Stat label="Clics" value={totals.clicks.toLocaleString("es-CL")} />
        <Stat label="CTR" value={ctr(totals).toFixed(2) + "%"} />
        <Stat label="Compras" value={String(totals.purchases)} tone={totals.purchases > 0 ? "ok" : undefined} />
      </div>

      {/* Tabla del nivel siguiente */}
      {!nivel ? (
        <p className="border-t border-line px-5 py-6 text-sm text-dim">Estás viendo el máximo detalle (anuncio).</p>
      ) : groups.length === 0 ? (
        <div className="border-t border-line px-5 py-6 text-sm text-dim">
          Sin desglose por <span className="text-mute">{nivel.singular.toLowerCase()}</span> en este período.
          <span className="block text-[11px]">Para el drill-down por campaña → conjunto → anuncio (con preview), la automatización debe cargar los datos a nivel anuncio en <span className="text-mute">campaign_metrics</span>.</span>
        </div>
      ) : (
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-dim">
                <th className="py-2 pl-5 pr-3 text-left font-medium">{nivel.singular}</th>
                <th className="px-3 py-2 text-right font-medium">Inversión</th>
                <th className="px-3 py-2 text-right font-medium">Impres.</th>
                <th className="px-3 py-2 text-right font-medium">Clics</th>
                <th className="px-3 py-2 text-right font-medium">CTR</th>
                <th className="px-3 py-2 text-right font-medium">CPC</th>
                <th className="px-3 py-2 text-right font-medium">Leads</th>
                <th className="py-2 pl-3 pr-5 text-right font-medium">Compras</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => !esAnuncio && setPath([...path, { id: g.id, name: g.name }])}
                  className={`border-t border-line/60 ${esAnuncio ? "" : "cursor-pointer"} hover:bg-soft/30`}
                >
                  <td className="py-2.5 pl-5 pr-3">
                    <div className="flex items-center gap-2.5">
                      {esAnuncio && (
                        g.thumb
                          ? <img src={g.thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                          : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-soft text-dim">🖼</span>
                      )}
                      <span className="flex items-center gap-1.5">
                        {g.name}
                        {!esAnuncio && <span className="text-accent2">›</span>}
                        {esAnuncio && g.preview && (
                          <a href={g.preview} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] text-accent2 hover:underline">ver en Meta ↗</a>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{money(g.agg.spend)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mute">{g.agg.impressions.toLocaleString("es-CL")}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mute">{g.agg.clicks.toLocaleString("es-CL")}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{ctr(g.agg).toFixed(2)}%</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mute">{money(cpc(g.agg))}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{g.agg.leads}</td>
                  <td className="py-2.5 pl-3 pr-5 text-right tabular-nums">{g.agg.purchases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="border-t border-line px-5 py-2.5 text-[11px] text-dim">
        Espejo de <span className="text-mute">campaign_metrics</span> (lo que llega de Meta). El total lo calcula Meta, no la app — por eso coincide.
      </p>
    </Card>
  );
}

function ListBlock({ title, tone, items }: { title: string; tone: string; items: string[] }) {
  return (
    <div>
      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${tone}`}>{title}</p>
      <ul className="space-y-1.5 text-sm text-mute">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2"><span className="text-dim">·</span>{t}</li>
        ))}
      </ul>
    </div>
  );
}
