"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress } from "@/components/ui";
import { AddBtn, DeleteBtn, ENum, ESelect, EText } from "@/components/editable";
import { AREAS, Area, CLIENTS, Goal, fmtVal } from "@/lib/data";
import { useData } from "@/lib/db";
import { GOAL_METRICS, PERIODOS, computeGoalActual, isAutoMetric, metricDef } from "@/lib/goal-metrics";

const AREA_OPTS = Object.entries(AREAS).map(([value, a]) => ({ value, label: a.label }));
const FMT_OPTS = [
  { value: "n", label: "#" },
  { value: "usd", label: "$" },
  { value: "pct", label: "%" },
  { value: "x", label: "x" },
];
const METRIC_OPTS = GOAL_METRICS.map((m) => ({ value: m.value, label: m.fuente === "Manual" ? m.label : `${m.fuente} · ${m.label}` }));
const PERIODO_OPTS = PERIODOS.map((p) => ({ value: p.value, label: p.label }));

export default function MetasPage() {
  const { goals, update } = useData();

  const setGoal = (index: number, patch: Partial<Goal>) => {
    update("goals", goals.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };
  const removeGoal = (index: number) => {
    update("goals", goals.filter((_, i) => i !== index));
  };
  const addGoal = (clientId: string) => {
    update("goals", [
      ...goals,
      { clientId, area: "ventas" as Area, nombre: "Nueva meta", actual: 0, objetivo: 100, fmt: "n" as const, plazo: "Semana", metrica: "manual", periodo: "semana" },
    ]);
  };

  return (
    <Shell title="Metas" sub="Definí la meta y el progreso se calcula solo desde Make · Instagram · Meta · GHL">
      <div className="grid gap-4 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const clientGoals = goals
            .map((g, index) => ({ g, index }))
            .filter(({ g }) => g.clientId === c.id);
          return (
            <Card key={c.id}>
              <CardHead title={c.nombre} sub={`${clientGoals.length} metas activas`} />
              <ul className="space-y-4 px-5 py-4">
                {clientGoals.map(({ g, index }) => (
                  <GoalRow key={index} g={g} index={index} color={c.color} setGoal={setGoal} removeGoal={removeGoal} />
                ))}
                <li>
                  <AddBtn onClick={() => addGoal(c.id)}>Meta</AddBtn>
                </li>
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-dim">
        Elegí una métrica viva (Meta Ads, Instagram, GHL, Ventas o Contenido) y un período, y el valor
        <span className="text-mute"> actual</span> se calcula solo con los datos que cargan las automatizaciones — no hay que tocarlo a mano.
        Para metas sin fuente automática, dejá la métrica en <span className="text-mute">Manual</span>.
      </p>
    </Shell>
  );
}

function GoalRow({
  g, index, color, setGoal, removeGoal,
}: {
  g: Goal;
  index: number;
  color: string;
  setGoal: (i: number, patch: Partial<Goal>) => void;
  removeGoal: (i: number) => void;
}) {
  const auto = isAutoMetric(g.metrica);
  const [computed, setComputed] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auto) { setComputed(null); return; }
    let active = true;
    setLoading(true);
    computeGoalActual(g.metrica!, g.clientId, g.periodo)
      .then((v) => { if (active) { setComputed(v); setLoading(false); } })
      .catch(() => { if (active) { setComputed(null); setLoading(false); } });
    return () => { active = false; };
  }, [auto, g.metrica, g.clientId, g.periodo]);

  const def = metricDef(g.metrica);
  const fmt = auto && def ? def.fmt : g.fmt;
  const actual = auto ? (computed ?? 0) : g.actual;
  const pct = g.objetivo ? Math.min(100, Math.round((actual / g.objetivo) * 100)) : 0;
  const met = actual >= g.objetivo && g.objetivo > 0;

  const onMetric = (v: string) => {
    const d = metricDef(v);
    setGoal(index, { metrica: v, ...(d && v !== "manual" ? { fmt: d.fmt } : {}) });
  };

  return (
    <li className="group/row">
      <div className="mb-1.5 flex items-start justify-between gap-2 text-sm">
        <EText value={g.nombre} onSave={(v) => setGoal(index, { nombre: v })} className="text-sm text-mute" />
        <div className="flex items-center gap-1.5">
          <ESelect value={g.area} options={AREA_OPTS} onSave={(v) => setGoal(index, { area: v as Area })} />
          <DeleteBtn onClick={() => removeGoal(index)} />
        </div>
      </div>

      {/* Fuente de la métrica */}
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <ESelect value={g.metrica ?? "manual"} options={METRIC_OPTS} onSave={onMetric} />
        {auto && <ESelect value={g.periodo ?? "semana"} options={PERIODO_OPTS} onSave={(v) => setGoal(index, { periodo: v })} />}
        {auto && (
          <span className="inline-flex items-center gap-1 text-[10px] text-dim">
            <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-warn" : "bg-ok"} ${loading ? "" : "animate-pulse"}`} />
            {loading ? "calculando…" : "en vivo"}
          </span>
        )}
      </div>

      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={`font-medium tabular-nums ${met ? "text-ok" : "text-ink"}`}>
          {auto ? (
            <span title="Calculado desde los datos reales">{fmtVal(actual, fmt)}</span>
          ) : (
            <ENum value={g.actual} fmt={g.fmt} onSave={(v) => setGoal(index, { actual: v ?? 0 })} />
          )}
          <span className="font-normal text-dim"> / </span>
          <ENum value={g.objetivo} fmt={fmt} onSave={(v) => setGoal(index, { objetivo: v ?? 0 })} className="text-dim" />
          {!auto && <ESelect value={g.fmt} options={FMT_OPTS} onSave={(v) => setGoal(index, { fmt: v as Goal["fmt"] })} className="ml-1.5" />}
        </span>
        <span className="flex items-center gap-1 text-dim">
          <EText value={g.plazo} onSave={(v) => setGoal(index, { plazo: v })} className="text-xs" />
          · {pct}%
        </span>
      </div>
      <Progress pct={pct} color={met ? "#34d399" : color} h={5} />
    </li>
  );
}
