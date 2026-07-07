"use client";

import { Shell } from "@/components/shell";
import { Card, CardHead, Progress } from "@/components/ui";
import { AddBtn, DeleteBtn, ENum, ESelect, EText } from "@/components/editable";
import { AREAS, Area, CLIENTS, Goal, fmtVal } from "@/lib/data";
import { useData } from "@/lib/db";

const AREA_OPTS = Object.entries(AREAS).map(([value, a]) => ({ value, label: a.label }));
const FMT_OPTS = [
  { value: "n", label: "#" },
  { value: "usd", label: "$" },
  { value: "pct", label: "%" },
  { value: "x", label: "x" },
];

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
      { clientId, area: "ventas" as Area, nombre: "Nueva meta", actual: 0, objetivo: 100, fmt: "n" as const, plazo: "Mes" },
    ]);
  };

  return (
    <Shell title="Metas" sub="Objetivos por cliente y área — clic sobre cualquier valor para editarlo">
      <div className="grid gap-4 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const clientGoals = goals
            .map((g, index) => ({ g, index }))
            .filter(({ g }) => g.clientId === c.id);
          return (
            <Card key={c.id}>
              <CardHead title={`${c.emoji} ${c.nombre}`} sub={`${clientGoals.length} metas activas`} />
              <ul className="space-y-4 px-5 py-4">
                {clientGoals.map(({ g, index }) => {
                  const pct = g.objetivo ? Math.min(100, Math.round((g.actual / g.objetivo) * 100)) : 0;
                  const met = g.actual >= g.objetivo;
                  return (
                    <li key={index} className="group/row">
                      <div className="mb-1.5 flex items-start justify-between gap-2 text-sm">
                        <EText value={g.nombre} onSave={(v) => setGoal(index, { nombre: v })} className="text-sm text-mute" />
                        <div className="flex items-center gap-1.5">
                          <ESelect value={g.area} options={AREA_OPTS} onSave={(v) => setGoal(index, { area: v as Area })} />
                          <DeleteBtn onClick={() => removeGoal(index)} />
                        </div>
                      </div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className={`font-medium tabular-nums ${met ? "text-ok" : "text-ink"}`}>
                          <ENum value={g.actual} fmt={g.fmt} onSave={(v) => setGoal(index, { actual: v ?? 0 })} />
                          <span className="font-normal text-dim"> / </span>
                          <ENum value={g.objetivo} fmt={g.fmt} onSave={(v) => setGoal(index, { objetivo: v ?? 0 })} className="text-dim" />
                          <ESelect value={g.fmt} options={FMT_OPTS} onSave={(v) => setGoal(index, { fmt: v as Goal["fmt"] })} className="ml-1.5" />
                        </span>
                        <span className="flex items-center gap-1 text-dim">
                          <EText value={g.plazo} onSave={(v) => setGoal(index, { plazo: v })} className="text-xs" />
                          · {pct}%
                        </span>
                      </div>
                      <Progress pct={pct} color={met ? "#34d399" : c.color} h={5} />
                    </li>
                  );
                })}
                <li>
                  <AddBtn onClick={() => addGoal(c.id)}>Meta</AddBtn>
                </li>
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-dim">
        Los cambios se guardan en este navegador (demo). Con Supabase (fase 2) serán compartidos y con permisos por rol.
        El valor "actual" luego se calculará solo desde las métricas — por ahora es editable para validar el flujo.
      </p>
    </Shell>
  );
}
