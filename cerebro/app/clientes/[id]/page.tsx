"use client";

// Perfil de cliente: resumen, tracker, métricas por área, revisiones y estrategia.

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Stat, Avatar, AreaBadge } from "@/components/ui";
import { TrackerGrid } from "@/components/tracker";
import { FunnelTable } from "@/components/metrics";
import {
  CLIENTS, Campaign, ContentPlan, DAY_LABELS, FUNNEL_HT, FUNNEL_LT, HistoriasModo,
  NOTION_STATES, ORGANIC, ORGANIC_WEEKS, PROCESS_STEPS, REVIEWS, SALES,
  complianceFor, distributeDays, fmtVal,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { StrategyData, useData } from "@/lib/db";
import { AddBtn, DeleteBtn, ENum, ESelect, EText } from "@/components/editable";

const TABS = ["Resumen", "Acciones", "Orgánico", "Ads HT", "Ads LT", "Revisiones", "Estrategia"] as const;

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
  const ht = FUNNEL_HT[id];
  const lt = FUNNEL_LT[id];
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
        {TABS.map((t) => {
          const disabled = (t === "Ads LT" && !lt) || (t === "Ads HT" && !ht);
          return (
            <button
              key={t}
              disabled={disabled}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                tab === t ? "bg-accent text-white" : disabled ? "cursor-not-allowed text-dim/50" : "text-mute hover:text-ink"
              }`}
            >
              {t}
            </button>
          );
        })}
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

      {tab === "Ads HT" && ht && (
        <div className="space-y-4">
          <CampaignsCard clientId={id} tipo="HT" />
          <Card>
            <CardHead title="Embudo semanal · High Ticket" sub="Meta Ads → VSL/Landing (GHL) → Lead → Agenda → Cierre · semáforo vs benchmark" />
            <FunnelTable rows={ht} />
          </Card>
        </div>
      )}

      {tab === "Ads LT" && lt && (
        <div className="space-y-4">
          <CampaignsCard clientId={id} tipo="LT" />
          <Card>
            <CardHead title="Embudo semanal · Low Ticket" sub="Meta Ads → VSL/Landing → Checkout → Compra" />
            <FunnelTable rows={lt} />
          </Card>
        </div>
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

const ESTADO_OPTS = [
  { value: "activa", label: "activa" },
  { value: "aprendizaje", label: "aprendizaje" },
  { value: "pausada", label: "pausada" },
];

function CampaignsCard({ clientId, tipo }: { clientId: string; tipo: "HT" | "LT" }) {
  const { campaigns, update } = useData();
  const rows = campaigns
    .map((c, index) => ({ c, index }))
    .filter(({ c }) => c.clientId === clientId && c.tipo === tipo);

  const setCampaign = (index: number, patch: Partial<Campaign>) =>
    update("campaigns", campaigns.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  const removeCampaign = (index: number) =>
    update("campaigns", campaigns.filter((_, i) => i !== index));
  const addCampaign = () =>
    update("campaigns", [
      ...campaigns,
      { clientId, tipo, nombre: "Nueva campaña", estado: "aprendizaje" as const, inversion: 0, resultados: 0, costoPorResultado: 0, roas: null },
    ]);

  return (
    <Card>
      <CardHead title="Por campaña" sub="Editable — decisiones de escala, iteración o pausa por campaña" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-dim">
              <th className="py-2 pl-5 pr-3 text-left font-medium">Campaña</th>
              <th className="px-3 py-2 text-left font-medium">Estado</th>
              <th className="px-3 py-2 text-right font-medium">Inversión</th>
              <th className="px-3 py-2 text-right font-medium">{tipo === "HT" ? "Leads" : "Compras"}</th>
              <th className="px-3 py-2 text-right font-medium">{tipo === "HT" ? "CPL" : "CPA"}</th>
              <th className="py-2 pl-3 pr-5 text-right font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ c, index }) => (
              <tr key={index} className="group/row border-t border-line/60 hover:bg-soft/30">
                <td className="py-2.5 pl-5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <EText value={c.nombre} onSave={(v) => setCampaign(index, { nombre: v })} className="text-sm" />
                    <DeleteBtn onClick={() => removeCampaign(index)} />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <ESelect value={c.estado} options={ESTADO_OPTS} onSave={(v) => setCampaign(index, { estado: v as Campaign["estado"] })} />
                </td>
                <td className="px-3 py-2.5 text-right text-mute">
                  <ENum value={c.inversion} fmt="usd" onSave={(v) => setCampaign(index, { inversion: v ?? 0 })} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <ENum value={c.resultados} onSave={(v) => setCampaign(index, { resultados: v ?? 0 })} />
                </td>
                <td className="px-3 py-2.5 text-right text-mute">
                  <ENum value={c.costoPorResultado} fmt="usd" onSave={(v) => setCampaign(index, { costoPorResultado: v ?? 0 })} />
                </td>
                <td className={`py-2.5 pl-3 pr-5 text-right font-medium ${c.roas === null ? "text-dim" : c.roas >= 2 ? "text-ok" : "text-warn"}`}>
                  <ENum value={c.roas} fmt="x" nullable onSave={(v) => setCampaign(index, { roas: v })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line px-5 py-3">
        <AddBtn onClick={addCampaign}>Campaña {tipo}</AddBtn>
      </div>
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
