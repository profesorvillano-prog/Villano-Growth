"use client";

// Perfil de cliente: resumen, tracker, métricas por área, revisiones y estrategia.

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Stat, Avatar, AreaBadge } from "@/components/ui";
import { TrackerGrid } from "@/components/tracker";
import {
  CLIENTS, ContentPlan, DAY_LABELS, HistoriasModo,
  NOTION_STATES, PROCESS_STEPS, REVIEWS,
  complianceFor, distributeDays, fmtVal,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { StrategyData, useData } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { isoKey } from "@/lib/date";
import { AddBtn, DeleteBtn, ENum, ESelect, EText } from "@/components/editable";

const TABS = ["Resumen", "Acciones", "Orgánico", "Meta Ads", "High Ticket", "Revisiones", "Estrategia"] as const;

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = CLIENTS.find((c) => c.id === id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Resumen");
  const { done } = useStore();
  const db = useData();

  if (!client) notFound();

  // Cada negocio muestra solo sus pestañas: High Ticket solo si tiene embudo HT.
  const tabs = TABS.filter((t) => t !== "High Ticket" || client.highTicket);

  const pct = complianceFor(db.actions.filter((a) => a.clientId === id), done);
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
        {tabs.map((t) => (
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
            <Card className="p-4"><Stat label="Cumplimiento sem." value={pct + "%"} tone={pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad"} hint="acciones del tracker" /></Card>
            <Card className="p-4"><Stat label="Plan de feed" value={`${db.plans[id]?.feedDias.length ?? 0}/sem`} hint={`historias ${db.plans[id]?.historiasModo === "diaria" ? "diarias" : db.plans[id]?.historiasModo === "lunvie" ? "L–V" : db.plans[id]?.historiasModo === "dias" ? "por días" : "no"}`} /></Card>
            <Card className="p-4"><Stat label="Metas activas" value={String(goals.length)} hint="ver pestaña Metas" /></Card>
            <Card className="p-4"><Stat label="Áreas activas" value="4" hint="orgánico · tráfico · embudos · ventas" /></Card>
          </div>

          <Card className="p-5">
            <p className="text-sm text-mute">Las métricas de negocio de <span className="font-medium text-ink">{client.nombre}</span> se ven en sus pestañas con datos reales:</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button onClick={() => setTab("Meta Ads")} className="rounded-lg border border-line px-3 py-1.5 text-mute transition-colors hover:border-accent/50 hover:text-ink">Meta Ads →</button>
              <button onClick={() => setTab("Orgánico")} className="rounded-lg border border-line px-3 py-1.5 text-mute transition-colors hover:border-accent/50 hover:text-ink">Orgánico →</button>
              {client.highTicket && (
                <button onClick={() => setTab("High Ticket")} className="rounded-lg border border-line px-3 py-1.5 text-mute transition-colors hover:border-accent/50 hover:text-ink">High Ticket →</button>
              )}
              <button onClick={() => setTab("Acciones")} className="rounded-lg border border-line px-3 py-1.5 text-mute transition-colors hover:border-accent/50 hover:text-ink">Acciones →</button>
            </div>
          </Card>
        </div>
      )}

      {tab === "Acciones" && (
        <Card>
          <CardHead title="Acciones recurrentes del cliente" sub="Incluye acciones del infoproductor y colaboradores (las marca su accountable)" />
          <TrackerGrid filter={(a) => a.clientId === id} addClientId={id} />
        </Card>
      )}

      {tab === "Orgánico" && (
        <OrganicLiveCard slugs={client.metaSlugs} color={client.color} />
      )}

      {tab === "Meta Ads" && (
        <MetaLiveCard slugs={client.metaSlugs} color={client.color} />
      )}

      {tab === "High Ticket" && client.highTicket && (
        <HighTicketCard slugs={client.metaSlugs} color={client.color} />
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

  // Cada fila es el acumulado de 30d de un anuncio capturado en una fecha.
  // Para no sumar snapshots repetidos, tomamos la fila más reciente por anuncio en el rango.
  const latestByAd = new Map<string, MetaRow>();
  for (const r of rows) {
    const k = r.ad_id ?? r.adset_id ?? r.campaign_id ?? "";
    const prev = latestByAd.get(k);
    if (!prev || (r.fecha ?? "") > (prev.fecha ?? "")) latestByAd.set(k, r);
  }
  let filtered = [...latestByAd.values()];
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

// ---------- Embudo High Ticket (desde los pipelines de GoHighLevel) ----------

interface HtRow {
  fecha: string; pipeline_name: string | null;
  mensajes: number; respuestas: number; propuestas: number;
  bookings: number; asistencias: number; ventas: number; facturacion: number; synced_at?: string;
}

function HighTicketCard({ slugs, color }: { slugs: string[]; color: string }) {
  const [rows, setRows] = useState<HtRow[] | null>(null);
  const [preset, setPreset] = useState(30);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const t = new Date(); const f = new Date(); f.setDate(f.getDate() - 30 + 1);
    setTo(isoKey(t)); setFrom(isoKey(f));
  }, []);
  const applyPreset = (d: number) => {
    const t = new Date(); const f = new Date(); f.setDate(f.getDate() - d + 1);
    setPreset(d); setTo(isoKey(t)); setFrom(isoKey(f));
  };
  useEffect(() => {
    if (!from || !to) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("ht_pipeline")
        .select("fecha, pipeline_name, mensajes, respuestas, propuestas, bookings, asistencias, ventas, facturacion, synced_at")
        .in("cliente", slugs).gte("fecha", from).lte("fecha", to).limit(1000);
      if (!active) return;
      setRows((data ?? []) as HtRow[]);
    })();
    return () => { active = false; };
  }, [slugs.join(","), from, to]);

  const FilterBar = (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
      <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
        {PRESETS.map((p) => (
          <button key={p.d} onClick={() => applyPreset(p.d)} className={`rounded-md px-2.5 py-1 text-xs transition-colors ${preset === p.d ? "bg-accent text-white" : "text-mute hover:text-ink"}`}>{p.label}</button>
        ))}
      </div>
      <span className="text-[11px] text-dim">o rango:</span>
      <input type="date" value={from} onChange={(e) => { setPreset(0); setFrom(e.target.value); }} className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
      <span className="text-dim">→</span>
      <input type="date" value={to} onChange={(e) => { setPreset(0); setTo(e.target.value); }} className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
    </div>
  );

  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando High Ticket…</Card>;

  const t = rows.reduce((a, r) => {
    a.mensajes += num(r.mensajes); a.respuestas += num(r.respuestas); a.propuestas += num(r.propuestas);
    a.bookings += num(r.bookings); a.asistencias += num(r.asistencias); a.ventas += num(r.ventas); a.facturacion += num(r.facturacion);
    return a;
  }, { mensajes: 0, respuestas: 0, propuestas: 0, bookings: 0, asistencias: 0, ventas: 0, facturacion: 0 });

  const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
  // Etapas del embudo con su conversión respecto a la etapa anterior
  const etapas = [
    { label: "Mensajes recibidos", val: t.mensajes, conv: null as number | null, sub: "entradas al pipeline" },
    { label: "Respuestas", val: t.respuestas, conv: pct(t.respuestas, t.mensajes), sub: "ratio de respuesta" },
    { label: "Propuestas de agenda", val: t.propuestas, conv: pct(t.propuestas, t.respuestas), sub: "respuesta → propuesta" },
    { label: "Agendados / bookings", val: t.bookings, conv: pct(t.bookings, t.propuestas), sub: "propuesta → agenda" },
    { label: "Asistencias (show)", val: t.asistencias, conv: pct(t.asistencias, t.bookings), sub: "agenda → asistencia" },
    { label: "Ventas (cierres)", val: t.ventas, conv: pct(t.ventas, t.asistencias), sub: "cierre sobre asistencias" },
  ];
  const maxVal = Math.max(1, ...etapas.map((e) => e.val));

  return (
    <Card>
      <CardHead
        title="Embudo High Ticket"
        sub="Mensaje → respuesta → agenda → asistencia → venta · desde los pipelines de GoHighLevel"
        right={<span className="flex items-center gap-2 text-[11px] text-dim"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />{rows.length ? "en vivo" : "sin datos"}</span>}
      />
      {FilterBar}

      {rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-dim">
          Sin datos en este período. Cuando conectemos el pipeline de <span className="text-mute">GoHighLevel</span>, la app carga los conteos por stage en <span className="text-mute">ht_pipeline</span> y el embudo se llena solo.
        </p>
      ) : (
        <>
          {/* KPIs globales */}
          <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
            <Stat label="Mensajes → Booking" value={pct(t.bookings, t.mensajes).toFixed(1) + "%"} />
            <Stat label="Show up rate" value={pct(t.asistencias, t.bookings).toFixed(1) + "%"} tone={pct(t.asistencias, t.bookings) >= 50 ? "ok" : "warn"} />
            <Stat label="Cierre (venta/show)" value={pct(t.ventas, t.asistencias).toFixed(1) + "%"} tone={pct(t.ventas, t.asistencias) >= 25 ? "ok" : "warn"} />
            <Stat label="Ventas" value={String(t.ventas)} tone={t.ventas > 0 ? "ok" : undefined} />
          </div>

          {/* Embudo visual */}
          <div className="space-y-2 border-t border-line px-5 py-5">
            {etapas.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-40 shrink-0 text-sm text-mute">{e.label}</div>
                <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-soft/40">
                  <div className="flex h-full items-center rounded-lg px-3 text-sm font-semibold text-bg transition-all"
                    style={{ width: `${Math.max(12, (e.val / maxVal) * 100)}%`, background: color }}>
                    {e.val}
                  </div>
                </div>
                <div className="w-32 shrink-0 text-right text-xs">
                  {e.conv === null ? <span className="text-dim">—</span> : (
                    <span className={e.conv >= 50 ? "text-ok" : e.conv >= 20 ? "text-warn" : "text-bad"}>{e.conv.toFixed(1)}%</span>
                  )}
                  <span className="block text-[10px] text-dim">{e.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="border-t border-line px-5 py-2.5 text-[11px] text-dim">
        Réplica del análisis de high ticket que hoy llevás en planilla, pero automático: cada stage del pipeline de GHL (conversación → agendado → asistió → ganado) alimenta <span className="text-mute">ht_pipeline</span>.
      </p>
    </Card>
  );
}

// ---------- Orgánico en vivo (Instagram, por pieza — tabla organic_content) ----------

interface OrgRow {
  media_id: string; tipo: string | null; producto: string | null;
  caption: string | null; permalink: string | null; publicado: string | null; fecha: string | null;
  thumbnail_url: string | null; media_url: string | null;
  alcance: number; impresiones: number; reproducciones: number;
  likes: number; comentarios: number; guardados: number; compartidos: number;
  interacciones: number; respuestas: number; toques_adelante: number; toques_atras: number; salidas: number;
}

type OrgCat = "reel" | "carrusel" | "post" | "story" | "otro";
// Usa media_type (tipo) y media_product_type (producto) de la API de Instagram
function categoria(r: OrgRow): OrgCat {
  const t = (r.tipo || "").toUpperCase();
  const p = (r.producto || "").toUpperCase();
  if (p.includes("STOR")) return "story";
  if (p.includes("REEL") || t === "VIDEO") return "reel";
  if (t === "CAROUSEL_ALBUM") return "carrusel";
  if (t === "IMAGE" || p === "FEED") return "post";
  return "otro";
}
const CAT_LABEL: Record<OrgCat, string> = { reel: "Reel", carrusel: "Carrusel", post: "Post", story: "Story", otro: "Otro" };
const CAT_ICON: Record<OrgCat, string> = { reel: "🎬", carrusel: "🖼", post: "📷", story: "📖", otro: "📄" };
const ORG_FILTROS: { key: string; label: string }[] = [
  { key: "todo", label: "Todo (feed)" }, { key: "post", label: "Post" }, { key: "reel", label: "Reel" }, { key: "otro", label: "Otro" }, { key: "story", label: "Stories" },
];
const ORG_FECHAS: { key: string; dias: number | null; label: string }[] = [
  { key: "todo", dias: null, label: "Todo" }, { key: "30", dias: 30, label: "30 días" }, { key: "90", dias: 90, label: "90 días" }, { key: "365", dias: 365, label: "12 meses" },
];

function OrganicLiveCard({ slugs, color }: { slugs: string[]; color: string }) {
  const [rows, setRows] = useState<OrgRow[] | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todo");
  const [rango, setRango] = useState("todo");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("organic_content")
        .select("media_id, tipo, producto, caption, permalink, publicado, fecha, thumbnail_url, media_url, alcance, impresiones, reproducciones, likes, comentarios, guardados, compartidos, interacciones, respuestas, toques_adelante, toques_atras, salidas, synced_at")
        .in("cliente", slugs)
        .order("publicado", { ascending: false, nullsFirst: false })
        .limit(500);
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
        <CardHead title="Rendimiento orgánico · Instagram" right={<span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-dim">sin datos aún</span>} />
        <p className="px-5 py-6 text-sm text-dim">Este negocio todavía no tiene datos de Instagram sincronizados. Cuando la automatización cargue piezas en <span className="text-mute">organic_content</span>, aparecen acá.</p>
      </Card>
    );
  }

  const num = (v: unknown) => Number(v) || 0;
  const rowDate = (r: OrgRow) => (r.fecha || (r.publicado ? r.publicado.slice(0, 10) : ""));
  const fdate = (d: string | null) => (d ? new Date((d.length === 10 ? d + "T00:00:00" : d)).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "2-digit" }) : "—");
  const short = (c: string | null) => (c ? (c.length > 60 ? c.slice(0, 60) + "…" : c) : "(sin texto)");

  // Filtro de fecha
  const applyRango = (key: string) => {
    setRango(key);
    const p = ORG_FECHAS.find((x) => x.key === key);
    if (p && p.dias) { const t = new Date(); const f = new Date(); f.setDate(f.getDate() - p.dias); setFrom(isoKey(f)); setTo(isoKey(t)); }
    else { setFrom(""); setTo(""); }
  };
  const inRange = (r: OrgRow) => {
    if (!from && !to) return true;
    const d = rowDate(r);
    return (!from || d >= from) && (!to || d <= to);
  };

  // Filtro de tipo (Post agrupa imagen + carrusel)
  const catFiltro = (r: OrgRow) => {
    const c = categoria(r);
    if (filtro === "todo") return c !== "story";
    if (filtro === "post") return c === "post" || c === "carrusel";
    return c === filtro;
  };
  const shown = rows.filter((r) => inRange(r) && catFiltro(r));
  const esStoryView = filtro === "story";

  const tot = shown.reduce((a, r) => {
    a.alcance += num(r.alcance); a.repro += num(r.reproducciones);
    a.guardComp += num(r.guardados) + num(r.compartidos);
    a.inter += num(r.interacciones) || num(r.likes) + num(r.comentarios);
    a.resp += num(r.respuestas); a.salidas += num(r.salidas);
    return a;
  }, { alcance: 0, repro: 0, guardComp: 0, inter: 0, resp: 0, salidas: 0 });

  return (
    <Card>
      <CardHead
        title="Rendimiento orgánico · Instagram"
        sub="Datos reales por pieza · filtrá por tipo y fecha, y abrí cada publicación"
        right={<span className="flex items-center gap-2 text-[11px] text-dim"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />{syncedAt ? `sync ${new Date(syncedAt).toLocaleDateString("es-CL")}` : "en vivo"}</span>}
      />
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
          {ORG_FILTROS.map((f) => (
            <button key={f.key} onClick={() => setFiltro(f.key)} className={`rounded-md px-2.5 py-1 text-xs transition-colors ${filtro === f.key ? "bg-accent text-white" : "text-mute hover:text-ink"}`}>{f.label}</button>
          ))}
        </div>
        <span className="ml-1 text-[11px] text-dim">fecha:</span>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
          {ORG_FECHAS.map((f) => (
            <button key={f.key} onClick={() => applyRango(f.key)} className={`rounded-md px-2 py-1 text-xs transition-colors ${rango === f.key ? "bg-soft text-ink" : "text-mute hover:text-ink"}`}>{f.label}</button>
          ))}
        </div>
        <input type="date" value={from} onChange={(e) => { setRango("custom"); setFrom(e.target.value); }} className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
        <span className="text-dim">→</span>
        <input type="date" value={to} onChange={(e) => { setRango("custom"); setTo(e.target.value); }} className="rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60" />
      </div>

      {/* KPIs del filtro */}
      <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
        <Stat label={esStoryView ? "Stories" : "Piezas"} value={String(shown.length)} />
        <Stat label="Alcance" value={tot.alcance.toLocaleString("es-CL")} />
        {esStoryView
          ? <><Stat label="Respuestas" value={tot.resp.toLocaleString("es-CL")} tone="ok" /><Stat label="Salidas" value={tot.salidas.toLocaleString("es-CL")} tone="warn" /></>
          : <><Stat label="Guardados + comp." value={tot.guardComp.toLocaleString("es-CL")} tone="ok" /><Stat label="Interacciones" value={tot.inter.toLocaleString("es-CL")} /></>}
      </div>

      {/* Tabla */}
      {shown.length === 0 ? (
        <p className="border-t border-line px-5 py-6 text-sm text-dim">Sin {esStoryView ? "stories" : "piezas"} en este filtro/período.</p>
      ) : (
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[780px] border-collapse text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-dim">
                <th className="py-2 pl-5 pr-3 text-left font-medium">{esStoryView ? "Story" : "Publicación"}</th>
                <th className="px-3 py-2 text-right font-medium">Alcance</th>
                {esStoryView ? (
                  <>
                    <th className="px-3 py-2 text-right font-medium">Respuestas</th>
                    <th className="px-3 py-2 text-right font-medium">Toques →</th>
                    <th className="px-3 py-2 text-right font-medium">Toques ←</th>
                    <th className="py-2 pl-3 pr-5 text-right font-medium">Salidas</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-2 text-right font-medium">Reprod.</th>
                    <th className="px-3 py-2 text-right font-medium">Likes</th>
                    <th className="px-3 py-2 text-right font-medium">Coment.</th>
                    <th className="px-3 py-2 text-right font-medium">Guard.</th>
                    <th className="py-2 pl-3 pr-5 text-right font-medium">Comp.</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const cat = categoria(r);
                const img = r.thumbnail_url || r.media_url;
                const titulo = r.caption && r.caption.trim() ? short(r.caption) : `${CAT_LABEL[cat]} · ${fdate(rowDate(r))}`;
                return (
                  <tr key={r.media_id} className="border-t border-line/60 hover:bg-soft/25">
                    <td className="py-2.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        {img
                          ? <img src={img} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                          : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg" style={{ background: color + "1f" }}>{CAT_ICON[cat]}</span>}
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: color + "22", color }}>{CAT_LABEL[cat]}</span>
                            {r.permalink
                              ? <a href={r.permalink} target="_blank" rel="noreferrer" className="truncate hover:underline">{titulo}</a>
                              : <span className="truncate">{titulo}</span>}
                          </span>
                          <span className="block text-[10px] text-dim">{fdate(rowDate(r))}{r.permalink ? " · ver en Instagram ↗" : ""}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.alcance).toLocaleString("es-CL")}</td>
                    {esStoryView ? (
                      <>
                        <td className="px-3 py-2.5 text-right tabular-nums">{num(r.respuestas).toLocaleString("es-CL")}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.toques_adelante).toLocaleString("es-CL")}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.toques_atras).toLocaleString("es-CL")}</td>
                        <td className="py-2.5 pl-3 pr-5 text-right tabular-nums text-warn">{num(r.salidas).toLocaleString("es-CL")}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.reproducciones).toLocaleString("es-CL")}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{num(r.likes).toLocaleString("es-CL")}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-mute">{num(r.comentarios).toLocaleString("es-CL")}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-ok">{num(r.guardados).toLocaleString("es-CL")}</td>
                        <td className="py-2.5 pl-3 pr-5 text-right tabular-nums">{num(r.compartidos).toLocaleString("es-CL")}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="border-t border-line px-5 py-2.5 text-[11px] text-dim">
        Datos reales de Instagram. Si la pieza no tiene texto, se nombra por tipo y fecha. La miniatura aparece cuando la automatización cargue <span className="text-mute">thumbnail_url</span>/<span className="text-mute">media_url</span> desde la API de Instagram; mientras tanto se ve el ícono del tipo. El enlace abre la publicación real.
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
