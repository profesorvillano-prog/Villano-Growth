"use client";

// Perfil de cliente: resumen, tracker, planificador, tareas, calendario,
// métricas por área, accesos, revisiones y estrategia.

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Card, CardHead, Stat, Avatar } from "@/components/ui";
import { TrackerGrid } from "@/components/tracker";
import {
  CLIENTS, ContentPlan, DAY_LABELS, HistoriasModo,
  NOTION_STATES, PROCESS_STEPS, REVIEWS, STRATEGY_DETAIL,
  complianceFor, distributeDays,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { StrategyData, useData } from "@/lib/db";
import { EText } from "@/components/editable";
import { MetaLiveCard, OrganicLiveCard, HighTicketCard, VentasCard } from "@/components/metrics";
import { PlannerCard, TasksCard, CalendarCard, AccesosCard, StrategyDetailCard } from "@/components/collections";

type Tab =
  | "Resumen" | "Orgánico" | "Meta Ads" | "High Ticket" | "Ventas" | "Acciones" | "Revisiones"
  | "Planificador" | "Tareas" | "Calendario" | "Accesos" | "Estrategia";

const GROUPS = [
  { key: "agencia" as const, label: "Métricas · Agencia", tabs: ["Resumen", "Orgánico", "Meta Ads", "High Ticket", "Ventas", "Acciones", "Revisiones"] as Tab[] },
  { key: "cliente" as const, label: "Cliente", tabs: ["Planificador", "Tareas", "Calendario", "Accesos", "Estrategia"] as Tab[] },
];

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = CLIENTS.find((c) => c.id === id);
  const [group, setGroup] = useState<"agencia" | "cliente">("agencia");
  const [tab, setTab] = useState<Tab>("Resumen");
  const { done } = useStore();
  const db = useData();
  const activeGroup = GROUPS.find((g) => g.key === group)!;

  if (!client) notFound();

  const pct = complianceFor(db.actions.filter((a) => a.clientId === id), done);
  const reviews = REVIEWS.filter((r) => r.clientId === id);
  const goals = db.goals.filter((g) => g.clientId === id);
  const estrategia = db.strategies[id] ?? { ...client.estrategia, oferta: client.oferta };

  return (
    <Shell
      title={client.nombre}
      sub={`${client.nicho} · ${client.oferta}`}
      right={
        <a
          href={`/portal/${id}`}
          className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute transition-colors hover:border-accent/50 hover:text-ink"
          title="Ver la vista que ve el cliente"
        >
          Ver portal del cliente ↗
        </a>
      }
    >
      <div className="mb-5 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((g) => {
            const on = group === g.key;
            return (
              <button
                key={g.key}
                onClick={() => { setGroup(g.key); setTab(g.tabs[0]); }}
                className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  on ? "border-accent/50 bg-accent/12 text-accent2" : "border-line bg-panel/50 text-mute hover:border-accent/40 hover:text-ink"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        <nav className="flex flex-wrap gap-1 rounded-xl border border-line bg-panel/70 p-1">
          {activeGroup.tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3.5 py-1.5 text-sm transition-all ${
                tab === t ? "bg-accent text-white shadow-[0_2px_10px_-3px_rgb(139_92_246/0.6)]" : "text-mute hover:bg-soft/40 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {tab === "Resumen" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4"><Stat label="Cumplimiento sem." value={pct + "%"} tone={pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad"} hint="acciones del tracker" /></Card>
            <Card className="p-4"><Stat label="Plan de feed" value={`${db.plans[id]?.feedDias.length ?? 0}/sem`} hint={`historias ${db.plans[id]?.historiasModo === "diaria" ? "diarias" : db.plans[id]?.historiasModo === "lunvie" ? "L–V" : db.plans[id]?.historiasModo === "dias" ? "por días" : "no"}`} /></Card>
            <Card className="p-4"><Stat label="Metas activas" value={String(goals.length)} hint="ver pestaña Metas" /></Card>
            <Card className="p-4"><Stat label="Ciclo 14d desde" value={client.cicloAncla.slice(5)} hint="revisión escalonada" /></Card>
          </div>

          <Card className="p-5">
            <p className="text-sm text-mute">Las métricas de negocio de <span className="font-medium text-ink">{client.nombre}</span> se ven en sus pestañas con datos reales:</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(["Planificador", "Meta Ads", "Orgánico", "High Ticket", "Accesos"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className="rounded-lg border border-line px-3 py-1.5 text-mute transition-colors hover:border-accent/50 hover:text-ink">{t} →</button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "Planificador" && <PlannerCard clientId={id} color={client.color} />}
      {tab === "Tareas" && <TasksCard clientId={id} color={client.color} />}
      {tab === "Calendario" && <CalendarCard clientId={id} color={client.color} />}

      {tab === "Acciones" && (
        <Card>
          <CardHead title="Acciones recurrentes del cliente" sub="Incluye acciones del infoproductor y colaboradores (las marca su accountable)" />
          <TrackerGrid filter={(a) => a.clientId === id} addClientId={id} />
        </Card>
      )}

      {tab === "Orgánico" && <OrganicLiveCard slugs={client.metaSlugs} color={client.color} />}
      {tab === "Meta Ads" && <MetaLiveCard slugs={client.metaSlugs} color={client.color} />}
      {tab === "High Ticket" && <HighTicketCard slugs={client.metaSlugs} color={client.color} />}
      {tab === "Ventas" && <VentasCard slugs={client.metaSlugs} color={client.color} />}
      {tab === "Accesos" && <AccesosCard clientId={id} />}

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
          {STRATEGY_DETAIL[id] && <StrategyDetailCard detail={STRATEGY_DETAIL[id]} color={client.color} />}
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
