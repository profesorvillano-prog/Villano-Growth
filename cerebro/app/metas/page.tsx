"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress } from "@/components/ui";
import { AddBtn, DeleteBtn, ENum, ESelect, EText } from "@/components/editable";
import { Area, CLIENTS, Goal, fmtVal } from "@/lib/data";
import { useData } from "@/lib/db";
import {
  GOAL_OBJETIVOS, PERIODOS, computeGoalActual, inferObjetivo, isAutoMetric,
  metricDef, objetivoByKey, objetivoForMetric,
} from "@/lib/goal-metrics";

const OBJ_OPTS = GOAL_OBJETIVOS.map((o) => ({ value: o.key, label: `${o.emoji} ${o.label}` }));
const PERIODO_OPTS = PERIODOS.map((p) => ({ value: p.value, label: p.label }));
const OBJ_AREA: Record<string, Area> = {
  ventas: "ventas", facturacion: "ventas", leads: "embudos", agendas: "embudos",
  alcance: "organico", interaccion: "organico", contenido: "organico",
  roas: "trafico", inversion: "trafico", manual: "ventas",
};

export default function MetasPage() {
  const { goals, update } = useData();

  const setGoal = (index: number, patch: Partial<Goal>) =>
    update("goals", goals.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  const removeGoal = (index: number) => update("goals", goals.filter((_, i) => i !== index));
  const addGoal = (clientId: string, g: Partial<Goal>) => {
    const obj = objetivoByKey((g as any).objKey ?? "manual");
    update("goals", [
      ...goals,
      {
        clientId,
        area: OBJ_AREA[obj?.key ?? "manual"] ?? "ventas",
        nombre: g.nombre ?? "Nueva meta",
        actual: 0,
        objetivo: g.objetivo ?? obj?.sugerido ?? 100,
        fmt: g.fmt ?? "n",
        plazo: g.periodo === "semana" ? "Semana" : g.periodo === "mes" ? "Mes" : g.periodo === "ciclo" ? "Ciclo" : "Histórico",
        metrica: obj?.metrica ?? "manual",
        periodo: g.periodo ?? obj?.periodo ?? "mes",
      },
    ]);
  };

  return (
    <Shell title="Metas" sub="Escribí qué querés lograr — el software detecta la métrica y el progreso se calcula solo">
      <div className="grid gap-4 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const clientGoals = goals.map((g, index) => ({ g, index })).filter(({ g }) => g.clientId === c.id);
          return (
            <Card key={c.id}>
              <CardHead title={c.nombre} sub={`${clientGoals.length} metas activas`} />
              <ul className="space-y-4 px-5 py-4">
                {clientGoals.map(({ g, index }) => (
                  <GoalRow key={index} g={g} index={index} color={c.color} setGoal={setGoal} removeGoal={removeGoal} />
                ))}
                <li><NewMetaForm color={c.color} onAdd={(g) => addGoal(c.id, g)} /></li>
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-dim">
        Elegís un <span className="text-mute">objetivo</span> en lenguaje simple (Ventas, Leads, Alcance…) y el sistema lo conecta con la fuente correcta
        (Meta Ads, Instagram, GHL, Ventas o Contenido). El valor <span className="text-mute">actual</span> se calcula solo, semana a semana. “Otra” = carga manual.
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
  const objActual = objetivoForMetric(g.metrica);

  const onObjetivo = (key: string) => {
    const o = objetivoByKey(key);
    if (!o) return;
    setGoal(index, { metrica: o.metrica, periodo: o.periodo, fmt: metricDef(o.metrica)?.fmt ?? "n" });
  };

  return (
    <li className="group/row rounded-xl border border-line/70 bg-panel/30 p-3">
      <div className="mb-2 flex items-start justify-between gap-2 text-sm">
        <EText value={g.nombre} onSave={(v) => setGoal(index, { nombre: v })} className="text-sm text-ink" />
        <DeleteBtn onClick={() => removeGoal(index)} />
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <ESelect value={objActual.key} options={OBJ_OPTS} onSave={onObjetivo} />
        {auto && <ESelect value={g.periodo ?? "mes"} options={PERIODO_OPTS} onSave={(v) => setGoal(index, { periodo: v })} />}
        {auto && (
          <span className="inline-flex items-center gap-1 text-[10px] text-dim" title={objActual.hint}>
            <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-warn" : "bg-ok"}`} />
            {loading ? "calculando…" : "auto"}
          </span>
        )}
      </div>

      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={`font-medium tabular-nums ${met ? "text-ok" : "text-ink"}`}>
          {auto ? (
            <span title={`Calculado desde: ${objActual.hint}`}>{fmtVal(actual, fmt)}</span>
          ) : (
            <ENum value={g.actual} fmt={g.fmt} onSave={(v) => setGoal(index, { actual: v ?? 0 })} />
          )}
          <span className="font-normal text-dim"> / </span>
          <ENum value={g.objetivo} fmt={fmt} onSave={(v) => setGoal(index, { objetivo: v ?? 0 })} className="text-dim" />
        </span>
        <span className="text-dim">{pct}%</span>
      </div>
      <Progress pct={pct} color={met ? "#34d399" : color} h={5} />
    </li>
  );
}

// Nueva meta: escribís qué querés y el software detecta el objetivo (métrica).
function NewMetaForm({ color, onAdd }: { color: string; onAdd: (g: Partial<Goal> & { objKey: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [objKey, setObjKey] = useState("manual");
  const [touched, setTouched] = useState(false);
  const [periodo, setPeriodo] = useState("mes");
  const [objetivo, setObjetivo] = useState(100);

  // Autodetección desde el nombre (si el usuario no eligió a mano)
  useEffect(() => {
    if (touched) return;
    const inf = inferObjetivo(nombre);
    if (inf) { setObjKey(inf.key); setPeriodo(inf.periodo); setObjetivo(inf.sugerido); }
  }, [nombre, touched]);

  const obj = objetivoByKey(objKey)!;
  const detectado = !touched && inferObjetivo(nombre);

  const pick = (k: string) => {
    setTouched(true); setObjKey(k);
    const o = objetivoByKey(k);
    if (o) { setPeriodo(o.periodo); setObjetivo(o.sugerido); }
  };
  const save = () => {
    if (!nombre.trim()) return;
    onAdd({ objKey, nombre: nombre.trim(), periodo, objetivo, fmt: metricDef(obj.metrica)?.fmt ?? "n" });
    setNombre(""); setObjKey("manual"); setTouched(false); setPeriodo("mes"); setObjetivo(100); setOpen(false);
  };

  if (!open) return <AddBtn onClick={() => setOpen(true)}>Meta</AddBtn>;

  return (
    <div className="rounded-xl border border-line bg-panel/50 p-3">
      <input
        autoFocus
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="¿Qué querés lograr? (ej. Vender 10 programas este mes)"
        className="mb-2 w-full rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/60"
      />
      {detectado && (
        <p className="mb-2 text-[11px] text-ok">Detectado: {detectado.emoji} {detectado.label} · <span className="text-dim">{detectado.hint}</span></p>
      )}
      <div className="mb-2 grid gap-2 sm:grid-cols-3">
        <label className="text-[11px] text-mute">
          Objetivo
          <select value={objKey} onChange={(e) => pick(e.target.value)} className="mt-1 w-full cursor-pointer rounded-lg border border-line bg-panel px-2 py-1.5 text-xs text-ink outline-none focus:border-accent/60">
            {GOAL_OBJETIVOS.map((o) => <option key={o.key} value={o.key}>{o.emoji} {o.label}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-mute">
          Período
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="mt-1 w-full cursor-pointer rounded-lg border border-line bg-panel px-2 py-1.5 text-xs text-ink outline-none focus:border-accent/60">
            {PERIODOS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-mute">
          Objetivo (nº)
          <input type="number" value={objetivo} onChange={(e) => setObjetivo(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line bg-panel px-2 py-1.5 text-xs text-ink outline-none focus:border-accent/60" />
        </label>
      </div>
      <p className="mb-3 text-[11px] text-dim">Fuente: <span className="text-mute">{obj.hint}</span>. El progreso se calcula solo (salvo “Otra”, que la cargás vos).</p>
      <div className="flex items-center gap-2">
        <button onClick={save} className="rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ background: color }}>Crear meta</button>
        <button onClick={() => setOpen(false)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-mute hover:text-ink">Cancelar</button>
      </div>
    </div>
  );
}
