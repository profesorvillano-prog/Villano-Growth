"use client";

// Perfil de cliente: resumen, tracker, métricas por área, revisiones y estrategia.

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Stat, Avatar, AreaBadge } from "@/components/ui";
import { TrackerGrid } from "@/components/tracker";
import {
  CLIENTS, ContentPlan, DAY_LABELS, HistoriasModo,
  NOTION_STATES, ORGANIC, PROCESS_STEPS, REVIEWS, SALES,
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
          <OrganicLiveCard slugs={client.metaSlugs} color={client.color} />
          <Card>
            <CardHead title="Ejecución del plan de contenido" sub="La planificación y las métricas por pieza (reels, stories, carruseles, YouTube) viven en la base de Notion del cliente" />
            <div className="px-5 py-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-mute">Piezas publicadas vs plan del ciclo (≥1 semana de antelación)</span>
                <span className="tabular-nums text-ink">{org.piezasPublicadas}/{org.piezasPlan}</span>
              </div>
              <Progress pct={org.piezasPlan ? (org.piezasPublicadas / org.piezasPlan) * 100 : 0} color={client.color} />
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

// ---------- Meta Ads (adaptativo: espejo de cuenta o drill-down por anuncio) ----------

interface MetaRow {
  fecha: string; account_name: string | null; currency: string | null;
  campaign_id: string | null; campaign_name: string | null;
  adset_id: string | null; adset_name: string | null;
  ad_id: string | null; ad_name: string | null;
  thumbnail_url: string | null; preview_url: string | null;
  spend: number; impressions: number; clicks: number; ctr: number; cpc: number; reach: number;
  leads: number; purchases: number; purchase_value: number; roas_meta: number; synced_at?: string;
}

const META_COLS = "fecha, account_name, currency, campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name, thumbnail_url, preview_url, spend, impressions, clicks, ctr, cpc, reach, leads, purchases, purchase_value, roas_meta, synced_at";
const num = (v: unknown) => Number(v) || 0;

const NIVELES = [
  { idF: "campaign_id", nameF: "campaign_name", singular: "Campaña" },
  { idF: "adset_id", nameF: "adset_name", singular: "Conjunto" },
  { idF: "ad_id", nameF: "ad_name", singular: "Anuncio" },
] as const;
const PRESETS = [
  { d: 7, label: "7 días" }, { d: 14, label: "14 días" }, { d: 30, label: "30 días" }, { d: 90, label: "90 días" },
];
type Agg = { spend: number; impressions: number; clicks: number; leads: number; purchases: number; purchase_value: number };
const emptyAgg = (): Agg => ({ spend: 0, impressions: 0, clicks: 0, leads: 0, purchases: 0, purchase_value: 0 });
const addRow = (a: Agg, r: MetaRow) => {
  a.spend += num(r.spend); a.impressions += num(r.impressions); a.clicks += num(r.clicks);
  a.leads += num(r.leads); a.purchases += num(r.purchases); a.purchase_value += num(r.purchase_value); return a;
};

// Selector: si hay datos granulares (por campaña/anuncio) → drill-down; si no → espejo
function MetaLiveCard({ slugs, color }: { slugs: string[]; color: string }) {
  const [mode, setMode] = useState<"loading" | "empty" | "mirror" | "drill">("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      const gran = await supabase.from("campaign_metrics").select("id").in("cliente", slugs).not("campaign_id", "is", null).limit(1);
      if (!active) return;
      if (gran.data && gran.data.length) { setMode("drill"); return; }
      const any = await supabase.from("campaign_metrics").select("id").in("cliente", slugs).limit(1);
      if (!active) return;
      setMode(any.data && any.data.length ? "mirror" : "empty");
    })();
    return () => { active = false; };
  }, [slugs.join(",")]);

  if (mode === "loading") return <Card className="p-5 text-sm text-dim">Cargando Meta Ads…</Card>;
  if (mode === "empty") {
    return (
      <Card>
        <CardHead title="Meta Ads" sub="Sincronizado desde Facebook a Supabase" right={<span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-dim">sin datos aún</span>} />
        <p className="px-5 py-6 text-sm text-dim">Todavía no llegan métricas de este cliente. En cuanto la automatización cargue datos en <span className="text-mute">campaign_metrics</span>, aparecen acá automáticamente.</p>
      </Card>
    );
  }
  return mode === "drill" ? <MetaDrilldown slugs={slugs} color={color} /> : <MetaMirror slugs={slugs} />;
}

// Espejo: muestra el snapshot más reciente (Meta ya lo calculó) — coincide 1:1
function MetaMirror({ slugs }: { slugs: string[] }) {
  const [rows, setRows] = useState<MetaRow[] | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("campaign_metrics").select(META_COLS).in("cliente", slugs).order("fecha", { ascending: false }).limit(50);
      if (!active) return;
      setRows((data ?? []) as MetaRow[]);
      if (data && data.length) setSyncedAt((data[0] as any).synced_at);
    })();
    return () => { active = false; };
  }, [slugs.join(",")]);
  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando…</Card>;

  const asOf = rows[0].fecha;
  const latest = rows.filter((r) => r.fecha === asOf);
  const cur = latest[0].currency || "";
  const money = (n: number) => `${cur ? cur + " " : "$"}${Math.round(n).toLocaleString("es-CL")}`;
  const tot = latest.reduce((a, r) => addRow(a, r), emptyAgg());
  const ctr = tot.impressions ? (tot.clicks / tot.impressions) * 100 : 0;
  const asOfLabel = new Date(asOf + "T00:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short" });

  return (
    <Card>
      <CardHead
        title="Meta Ads · últimos 30 días"
        sub="Espejo exacto de la cuenta en Meta Ads Manager (mismos números)"
        right={<span className="flex items-center gap-2 text-[11px] text-dim"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />al {asOfLabel}</span>}
      />
      <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
        <Stat label="Inversión (30 días)" value={money(tot.spend)} />
        <Stat label="Impresiones" value={tot.impressions.toLocaleString("es-CL")} />
        <Stat label="Clics" value={tot.clicks.toLocaleString("es-CL")} />
        <Stat label="CTR" value={tot.impressions ? ctr.toFixed(2) + "%" : "—"} />
      </div>
      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-dim">
              <th className="py-2 pl-5 pr-3 text-left font-medium">Cuenta</th>
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
            {latest.map((r, i) => {
              const rc = num(r.ctr) || (num(r.impressions) ? (num(r.clicks) / num(r.impressions)) * 100 : 0);
              const rcpc = num(r.cpc) || (num(r.clicks) ? num(r.spend) / num(r.clicks) : 0);
              return (
                <tr key={i} className="border-t border-line/60 hover:bg-soft/25">
                  <td className="py-2.5 pl-5 pr-3">{r.account_name || "Cuenta"} <span className="text-[10px] text-dim">· 30d</span></td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{money(num(r.spend))}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.impressions).toLocaleString("es-CL")}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.clicks).toLocaleString("es-CL")}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{rc.toFixed(2)}%</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mute">{money(rcpc)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{num(r.leads)}</td>
                  <td className="py-2.5 pl-3 pr-5 text-right tabular-nums">{num(r.purchases)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-5 py-2.5 text-[11px] text-dim">
        Espejo de <span className="text-mute">Últimos 30 días</span> de Meta. El total lo calcula Meta, no la app. Para filtrar por fecha y bajar hasta cada anuncio con su preview, la automatización debe cargar los datos a nivel anuncio (columnas <span className="text-mute">ad_id, thumbnail_url</span>). Última sync: {syncedAt ? new Date(syncedAt).toLocaleString("es-CL") : "—"}.
      </p>
    </Card>
  );
}

// Drill-down por fecha: cuenta → campaña → conjunto → anuncio (con preview)
function MetaDrilldown({ slugs, color }: { slugs: string[]; color: string }) {
  const [rows, setRows] = useState<MetaRow[] | null>(null);
  const [preset, setPreset] = useState(30);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [path, setPath] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const t = new Date(); const f = new Date(); f.setDate(f.getDate() - 30 + 1);
    setTo(isoKey(t)); setFrom(isoKey(f));
  }, []);
  const applyPreset = (d: number) => {
    const t = new Date(); const f = new Date(); f.setDate(f.getDate() - d + 1);
    setPreset(d); setTo(isoKey(t)); setFrom(isoKey(f)); setPath([]);
  };
  useEffect(() => {
    if (!from || !to) return;
    let active = true;
    (async () => {
      const { data } = await supabase.from("campaign_metrics").select(META_COLS).in("cliente", slugs).gte("fecha", from).lte("fecha", to).limit(3000);
      if (!active) return;
      setRows((data ?? []) as MetaRow[]);
    })();
    return () => { active = false; };
  }, [slugs.join(","), from, to]);

  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando Meta Ads…</Card>;
  const cur = rows[0]?.currency || "CLP";
  const money = (n: number) => `${cur} ${Math.round(n).toLocaleString("es-CL")}`;

  let filtered = rows;
  path.forEach((step, i) => {
    const f = NIVELES[i].idF as keyof MetaRow;
    filtered = filtered.filter((r) => (r[f] ?? "") === step.id);
  });
  const depth = path.length;
  const nivel = NIVELES[depth];
  const totals = filtered.reduce((a, r) => addRow(a, r), emptyAgg());

  type Grp = { id: string; name: string; thumb: string | null; preview: string | null; agg: Agg };
  let groups: Grp[] = [];
  if (nivel) {
    const idF = nivel.idF as keyof MetaRow; const nameF = nivel.nameF as keyof MetaRow;
    const map = new Map<string, Grp>();
    for (const r of filtered) {
      const id = (r[idF] as string) ?? "";
      if (!id) continue;
      const g = map.get(id) ?? { id, name: (r[nameF] as string) || id, thumb: r.thumbnail_url, preview: r.preview_url, agg: emptyAgg() };
      addRow(g.agg, r);
      if (!g.thumb && r.thumbnail_url) g.thumb = r.thumbnail_url;
      map.set(id, g);
    }
    groups = [...map.values()].sort((a, b) => b.agg.spend - a.agg.spend);
  }
  const ctr = (a: Agg) => (a.impressions ? (a.clicks / a.impressions) * 100 : 0);
  const cpc = (a: Agg) => (a.clicks ? a.spend / a.clicks : 0);
  const esAnuncio = nivel?.singular === "Anuncio";

  return (
    <Card>
      <CardHead title="Meta Ads" sub="Datos reales · filtrá por fecha y hacé clic para bajar el detalle" right={<span className="flex items-center gap-2 text-[11px] text-dim"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />en vivo</span>} />
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
          {PRESETS.map((p) => (
            <button key={p.d} onClick={() => applyPreset(p.d)} className={`rounded-md px-2.5 py-1 text-xs transition-colors ${preset === p.d ? "bg-accent text-white" : "text-mute hover:text-ink"}`}>{p.label}</button>
          ))}
        </div>
        <span className="text-[11px] text-dim">o rango:</span>
        <input type="date" value={from} onChange={(e) => { setPreset(0); setFrom(e.target.value); setPath([]); }} className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
        <span className="text-dim">→</span>
        <input type="date" value={to} onChange={(e) => { setPreset(0); setTo(e.target.value); setPath([]); }} className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
      </div>
      <div className="flex flex-wrap items-center gap-1.5 px-5 py-2.5 text-xs">
        <button onClick={() => setPath([])} className={`rounded px-1.5 py-0.5 ${depth === 0 ? "font-medium text-ink" : "text-accent2 hover:bg-soft"}`}>{rows[0]?.account_name || "Cuenta"}</button>
        {path.map((step, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-dim">›</span>
            <button onClick={() => setPath(path.slice(0, i + 1))} className={`rounded px-1.5 py-0.5 ${i === depth - 1 ? "font-medium text-ink" : "text-accent2 hover:bg-soft"}`}>{step.name}</button>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 pb-4 sm:grid-cols-5">
        <Stat label="Inversión" value={money(totals.spend)} />
        <Stat label="Impresiones" value={totals.impressions.toLocaleString("es-CL")} />
        <Stat label="Clics" value={totals.clicks.toLocaleString("es-CL")} />
        <Stat label="CTR" value={ctr(totals).toFixed(2) + "%"} />
        <Stat label="Compras" value={String(totals.purchases)} tone={totals.purchases > 0 ? "ok" : undefined} />
      </div>
      {!nivel ? (
        <p className="border-t border-line px-5 py-6 text-sm text-dim">Estás viendo el máximo detalle (anuncio).</p>
      ) : groups.length === 0 ? (
        <p className="border-t border-line px-5 py-6 text-sm text-dim">Sin desglose por {nivel.singular.toLowerCase()} en este período.</p>
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
                <tr key={g.id} onClick={() => !esAnuncio && setPath([...path, { id: g.id, name: g.name }])} className={`border-t border-line/60 ${esAnuncio ? "" : "cursor-pointer"} hover:bg-soft/30`}>
                  <td className="py-2.5 pl-5 pr-3">
                    <div className="flex items-center gap-2.5">
                      {esAnuncio && (g.thumb
                        ? <img src={g.thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                        : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-soft text-dim">🖼</span>)}
                      <span className="flex items-center gap-1.5">
                        {g.name}
                        {!esAnuncio && <span className="text-accent2">›</span>}
                        {esAnuncio && g.preview && <a href={g.preview} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] text-accent2 hover:underline">ver en Meta ↗</a>}
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
      <p className="border-t border-line px-5 py-2.5 text-[11px] text-dim">Espejo de <span className="text-mute">campaign_metrics</span> (lo que llega de Meta). Los totales se calculan sumando el rango elegido.</p>
    </Card>
  );
}

// ---------- Orgánico en vivo (Instagram, por pieza — tabla organic_content) ----------

interface OrgRow {
  media_id: string; tipo: string | null; producto: string | null;
  caption: string | null; permalink: string | null; publicado: string | null; fecha: string | null;
  alcance: number; impresiones: number; reproducciones: number;
  likes: number; comentarios: number; guardados: number; compartidos: number;
  interacciones: number; respuestas: number; toques_adelante: number; toques_atras: number; salidas: number;
}

function esStory(r: OrgRow) {
  const t = (r.producto || r.tipo || "").toLowerCase();
  return t.includes("stor");
}

function OrganicLiveCard({ slugs, color: _color }: { slugs: string[]; color: string }) {
  const [rows, setRows] = useState<OrgRow[] | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("organic_content")
        .select("media_id, tipo, producto, caption, permalink, publicado, fecha, alcance, impresiones, reproducciones, likes, comentarios, guardados, compartidos, interacciones, respuestas, toques_adelante, toques_atras, salidas, synced_at")
        .in("cliente", slugs)
        .order("publicado", { ascending: false, nullsFirst: false })
        .limit(200);
      if (!active) return;
      setRows((data ?? []) as OrgRow[]);
      if (data && data.length) setSyncedAt((data[0] as any).synced_at);
    })();
    return () => { active = false; };
  }, [slugs.join(",")]);

  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando orgánico…</Card>;
  if (rows.length === 0) {
    return (
      <Card>
        <CardHead title="Rendimiento orgánico · Instagram" sub="Reels, posts y stories sincronizados desde Instagram (Supabase)" right={<span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-dim">sin datos aún</span>} />
        <p className="px-5 py-6 text-sm text-dim">Todavía no llegan métricas de orgánico. En cuanto conectes Instagram en Make y la automatización cargue datos en <span className="text-mute">organic_content</span>, el rendimiento por reel y por story aparece acá automáticamente.</p>
      </Card>
    );
  }

  const num = (v: unknown) => Number(v) || 0;
  const stories = rows.filter(esStory);
  const pieces = rows.filter((r) => !esStory(r));

  const totAlcance = rows.reduce((s, r) => s + num(r.alcance), 0);
  const totRepro = pieces.reduce((s, r) => s + num(r.reproducciones), 0);
  const totGuardComp = pieces.reduce((s, r) => s + num(r.guardados) + num(r.compartidos), 0);
  const totInter = pieces.reduce((s, r) => s + (num(r.interacciones) || num(r.likes) + num(r.comentarios)), 0);

  const fdate = (d: string | null) => (d ? new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short" }) : "—");
  const short = (c: string | null) => (c ? (c.length > 42 ? c.slice(0, 42) + "…" : c) : "—");
  const tipoLabel = (r: OrgRow) => {
    const t = (r.producto || r.tipo || "").toLowerCase();
    if (t.includes("reel")) return "Reel";
    if (t.includes("carousel") || t.includes("album")) return "Carrusel";
    if (t.includes("video") || t.includes("igtv")) return "Video";
    return "Post";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4"><Stat label="Alcance (piezas)" value={totAlcance.toLocaleString("es-CL")} /></Card>
        <Card className="p-4"><Stat label="Reproducciones" value={totRepro.toLocaleString("es-CL")} /></Card>
        <Card className="p-4"><Stat label="Guardados + comp." value={totGuardComp.toLocaleString("es-CL")} tone="ok" /></Card>
        <Card className="p-4"><Stat label="Interacciones" value={totInter.toLocaleString("es-CL")} /></Card>
      </div>

      <Card>
        <CardHead
          title="Reels y posts"
          sub="Rendimiento por pieza (datos reales de Instagram)"
          right={<span className="flex items-center gap-2 text-[11px] text-dim"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />{syncedAt ? `sync ${new Date(syncedAt).toLocaleDateString("es-CL")}` : "en vivo"}</span>}
        />
        {pieces.length === 0 ? (
          <p className="px-5 py-6 text-sm text-dim">Sin reels/posts registrados todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-dim">
                  <th className="py-2 pl-5 pr-3 text-left font-medium">Pieza</th>
                  <th className="px-3 py-2 text-right font-medium">Alcance</th>
                  <th className="px-3 py-2 text-right font-medium">Reprod.</th>
                  <th className="px-3 py-2 text-right font-medium">Likes</th>
                  <th className="px-3 py-2 text-right font-medium">Coment.</th>
                  <th className="px-3 py-2 text-right font-medium">Guard.</th>
                  <th className="py-2 pl-3 pr-5 text-right font-medium">Comp.</th>
                </tr>
              </thead>
              <tbody>
                {pieces.map((r) => (
                  <tr key={r.media_id} className="border-t border-line/60 hover:bg-soft/25">
                    <td className="py-2.5 pl-5 pr-3">
                      {r.permalink ? <a href={r.permalink} target="_blank" rel="noreferrer" className="hover:underline">{short(r.caption)}</a> : short(r.caption)}
                      <span className="text-[10px] text-dim"> · {tipoLabel(r)} · {fdate(r.publicado)}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.alcance).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.reproducciones).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{num(r.likes).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.comentarios).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ok">{num(r.guardados).toLocaleString("es-CL")}</td>
                    <td className="py-2.5 pl-3 pr-5 text-right tabular-nums">{num(r.compartidos).toLocaleString("es-CL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardHead title="Stories" sub="Rendimiento por story (datos reales de Instagram)" />
        {stories.length === 0 ? (
          <p className="px-5 py-6 text-sm text-dim">Sin stories registradas todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-dim">
                  <th className="py-2 pl-5 pr-3 text-left font-medium">Story</th>
                  <th className="px-3 py-2 text-right font-medium">Alcance</th>
                  <th className="px-3 py-2 text-right font-medium">Respuestas</th>
                  <th className="px-3 py-2 text-right font-medium">Toques →</th>
                  <th className="px-3 py-2 text-right font-medium">Toques ←</th>
                  <th className="py-2 pl-3 pr-5 text-right font-medium">Salidas</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((r) => (
                  <tr key={r.media_id} className="border-t border-line/60 hover:bg-soft/25">
                    <td className="py-2.5 pl-5 pr-3">{short(r.caption) === "—" ? "Story" : short(r.caption)} <span className="text-[10px] text-dim">· {fdate(r.publicado)}</span></td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.alcance).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{num(r.respuestas).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.toques_adelante).toLocaleString("es-CL")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.toques_atras).toLocaleString("es-CL")}</td>
                    <td className="py-2.5 pl-3 pr-5 text-right tabular-nums text-warn">{num(r.salidas).toLocaleString("es-CL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="px-1 text-[11px] text-dim">
        Data cruda tal como llega de Instagram (tabla <span className="text-mute">organic_content</span>). Sin números manuales ni inventados.
      </p>
    </div>
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
