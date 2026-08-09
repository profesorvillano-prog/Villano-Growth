"use client";

// Editor compacto de definiciones de acciones (para Agencia · Acciones).
// En vez del grid semana×días, una lista por área: cada acción es una fila corta
// con nombre, área, cadencia, R/A y días. Menos extenso y saturado que el grid.

import { AREAS, Action, Area, Cadence, DAY_LABELS, Person, clientById } from "@/lib/data";
import { useData } from "@/lib/db";
import { AddBtn, DeleteBtn, ESelect, EText } from "./editable";

const AREA_ORDER: Area[] = ["organico", "trafico", "embudos", "ventas", "agencia"];
const PEOPLE_OPTS = (["Sebastián", "Rodrigo", "Francisco", "Javier", "Cliente", "Setter"] as Person[]).map((p) => ({ value: p, label: p }));
const CAD_OPTS: { value: Cadence; label: string }[] = [
  { value: "diaria", label: "Diaria" },
  { value: "dias", label: "Días fijos" },
  { value: "semanal", label: "Semanal" },
  { value: "14d", label: "Quincenal" },
];
const AREA_OPTS = AREA_ORDER.map((a) => ({ value: a, label: AREAS[a].label }));

export function ActionManager({ filter, addClientId }: { filter: (a: Action) => boolean; addClientId: string | null }) {
  const { actions, update } = useData();

  const setAction = (index: number, patch: Partial<Action>) =>
    update("actions", actions.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  const removeAction = (index: number) => update("actions", actions.filter((_, i) => i !== index));
  const addAction = (area: Area) =>
    update("actions", [
      ...actions,
      { id: `x-${Math.random().toString(36).slice(2, 8)}`, clientId: addClientId, area, nombre: "Nueva acción", cadencia: "semanal" as Cadence, dias: [0], R: "Francisco" as Person, A: "Rodrigo" as Person },
    ]);
  const toggleDay = (index: number, a: Action, d: number) => {
    let dias = a.cadencia === "diaria" ? [0, 1, 2, 3, 4, 5, 6] : [...(a.dias ?? [])];
    dias = dias.includes(d) ? dias.filter((x) => x !== d) : [...dias, d].sort((x, y) => x - y);
    setAction(index, { cadencia: a.cadencia === "diaria" ? "dias" : a.cadencia, dias });
  };

  const rows = actions.map((a, index) => ({ a, index })).filter(({ a }) => filter(a));

  return (
    <div className="divide-y divide-line/60">
      {AREA_ORDER.map((area) => {
        const group = rows.filter(({ a }) => a.area === area);
        if (!group.length) return null;
        return (
          <div key={area} className="px-5 py-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: AREAS[area].color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: AREAS[area].color, boxShadow: `0 0 6px ${AREAS[area].color}88` }} />
                {AREAS[area].label} · {group.length}
              </span>
              <AddBtn onClick={() => addAction(area)}>Acción</AddBtn>
            </div>
            <ul className="space-y-2">
              {group.map(({ a, index }) => {
                const c = clientById(a.clientId);
                return (
                  <li key={a.id} className="group/row rounded-xl border border-line bg-panel/40 px-3 py-2.5 transition-colors hover:border-line">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold" style={c ? { background: c.color + "22", color: c.color } : { background: "#26262e", color: "#8f8f9d" }}>{c?.initials ?? "AG"}</span>
                        <EText value={a.nombre} onSave={(v) => setAction(index, { nombre: v })} className="text-sm" />
                      </div>
                      <DeleteBtn onClick={() => removeAction(index)} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <ESelect value={a.area} options={AREA_OPTS} onSave={(v) => setAction(index, { area: v as Area })} />
                      <ESelect value={a.cadencia} options={CAD_OPTS} onSave={(v) => setAction(index, { cadencia: v as Cadence })} />
                      <span className="flex items-center gap-1 text-[11px] text-dim">R <ESelect value={a.R} options={PEOPLE_OPTS} onSave={(v) => setAction(index, { R: v as Person })} /></span>
                      <span className="flex items-center gap-1 text-[11px] text-dim">A <ESelect value={a.A} options={PEOPLE_OPTS} onSave={(v) => setAction(index, { A: v as Person })} /></span>
                      {a.cadencia !== "diaria" && (
                        <div className="flex items-center gap-0.5">
                          {DAY_LABELS.map((l, d) => {
                            const on = (a.dias ?? []).includes(d);
                            return (
                              <button
                                key={d}
                                onClick={() => toggleDay(index, a, d)}
                                title={`${l}: ${on ? "quitar" : "agregar"}`}
                                className={`flex h-6 w-6 items-center justify-center rounded-md border text-[10px] font-semibold transition-colors ${on ? "border-accent bg-accent/25 text-accent2" : "border-line/60 text-dim hover:border-accent/40 hover:text-mute"}`}
                              >
                                {l}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      {rows.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-dim">Sin acciones en este filtro.</p>
          <div className="mt-3 flex justify-center"><AddBtn onClick={() => addAction("organico")}>Crear acción</AddBtn></div>
        </div>
      )}
    </div>
  );
}
