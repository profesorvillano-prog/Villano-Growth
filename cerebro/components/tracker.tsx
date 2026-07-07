"use client";

// Action Tracker: acciones × días, agrupado por área (orgánico separado de tráfico).
// Cada celda tiene doble marca: cuadro superior = R ejecutó · franja inferior = A revisó.
// Modo edición: nombre, área, R/A, cadencia y días son editables; agregar y eliminar.

import { useState } from "react";
import {
  AREAS, Action, Area, Cadence, DAY_LABELS, Person, actionAppliesOn, clientById,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { useData } from "@/lib/db";
import { Avatar } from "./ui";
import { AddBtn, DeleteBtn, ESelect, EText } from "./editable";

const TODAY = 3; // jueves (demo)
const AREA_ORDER: Area[] = ["organico", "trafico", "embudos", "ventas", "agencia"];
const PEOPLE_OPTS = (["Sebastián", "Rodrigo", "Patricio", "Javier", "Cliente", "Setter"] as Person[])
  .map((p) => ({ value: p, label: p }));
const CAD_OPTS: { value: Cadence; label: string }[] = [
  { value: "diaria", label: "diaria" },
  { value: "dias", label: "días fijos" },
  { value: "semanal", label: "semanal" },
  { value: "14d", label: "cada 14 días" },
];

export function TrackerGrid({
  filter, showClient = false, addClientId = null, person = null,
}: { filter: (a: Action) => boolean; showClient?: boolean; addClientId?: string | null; person?: Person | null }) {
  const { done, reviewed, toggle, toggleReviewed } = useStore();
  const { actions, update } = useData();
  const [editing, setEditing] = useState(false);

  const rows = actions.map((a, index) => ({ a, index })).filter(({ a }) => filter(a));

  const setAction = (index: number, patch: Partial<Action>) =>
    update("actions", actions.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  const removeAction = (index: number) =>
    update("actions", actions.filter((_, i) => i !== index));
  const addAction = () =>
    update("actions", [
      ...actions,
      {
        id: `x-${Math.random().toString(36).slice(2, 8)}`,
        clientId: addClientId,
        area: "organico" as Area,
        nombre: "Nueva acción",
        cadencia: "semanal" as Cadence,
        dias: [0],
        R: "Patricio" as Person,
        A: "Rodrigo" as Person,
      },
    ]);

  const toggleDay = (index: number, a: Action, d: number) => {
    let dias = a.cadencia === "diaria" ? [0, 1, 2, 3, 4, 5, 6] : [...(a.dias ?? [])];
    dias = dias.includes(d) ? dias.filter((x) => x !== d) : [...dias, d].sort((x, y) => x - y);
    setAction(index, { cadencia: a.cadencia === "diaria" ? "dias" : a.cadencia, dias });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-2.5">
        <p className="text-[11px] text-dim">
          {person ? (
            <>Vista de <span className="font-medium text-ink">{person}</span> — una casilla por su rol: ejecuta (R) o revisa (A). Las iniciales dim indican quién falta.</>
          ) : (
            <>
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-[4px] border border-accent bg-accent align-middle" /> cuadro = R ejecuta (iniciales = falta) ·{" "}
              <span className="mx-1 inline-block h-1 w-4 rounded-full bg-ok align-middle" /> franja = A revisó ·{" "}
              <span className="mx-1 inline-block h-1 w-4 rounded-full bg-warn/70 align-middle" /> ámbar = falta revisión
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {editing && <AddBtn onClick={addAction}>Acción</AddBtn>}
          <button
            onClick={() => setEditing(!editing)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              editing ? "border-accent bg-accent text-white" : "border-line text-mute hover:border-accent/50 hover:text-ink"
            }`}
          >
            {editing ? "✓ Listo" : "✎ Editar acciones"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-dim">
              <th className="w-[36%] py-2.5 pl-5 pr-3 text-left font-medium">Acción</th>
              <th className="px-2 py-2.5 text-left font-medium">R / A</th>
              {DAY_LABELS.map((d, i) => (
                <th key={d} className="px-1 py-2.5 text-center font-medium">
                  <span className={i === TODAY ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent font-semibold text-white" : ""}>{d}</span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-right font-medium">{editing ? "" : "Sem."}</th>
            </tr>
          </thead>
          {AREA_ORDER.map((area) => {
            const group = rows.filter(({ a }) => a.area === area);
            if (group.length === 0) return null;
            return (
              <tbody key={area}>
                <tr>
                  <td colSpan={10} className="border-t border-line bg-panel/70 py-2 pl-5">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: AREAS[area].color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: AREAS[area].color }} />
                      {AREAS[area].label}
                    </span>
                  </td>
                </tr>
                {group.map(({ a, index }) => (
                  <ActionRow
                    key={a.id}
                    a={a}
                    index={index}
                    editing={editing}
                    showClient={showClient}
                    person={person}
                    done={done}
                    reviewed={reviewed}
                    toggle={toggle}
                    toggleReviewed={toggleReviewed}
                    setAction={setAction}
                    removeAction={removeAction}
                    toggleDay={toggleDay}
                  />
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}

const INITIALS: Record<string, string> = {
  Sebastián: "SE", Rodrigo: "RO", Patricio: "PA", Javier: "JA", Cliente: "CL", Setter: "IN",
};

function ActionRow({
  a, index, editing, showClient, person, done, reviewed, toggle, toggleReviewed, setAction, removeAction, toggleDay,
}: {
  a: Action;
  index: number;
  editing: boolean;
  showClient: boolean;
  person: Person | null;
  done: Set<string>;
  reviewed: Set<string>;
  toggle: (k: string) => void;
  toggleReviewed: (k: string) => void;
  setAction: (i: number, p: Partial<Action>) => void;
  removeAction: (i: number) => void;
  toggleDay: (i: number, a: Action, d: number) => void;
}) {
  const cells = Array.from({ length: 7 }, (_, d) => actionAppliesOn(a, d));
  const applicable = cells.filter(Boolean).length;
  const cliente = clientById(a.clientId);
  // rol de la persona filtrada en esta acción (si es A y no R, su casilla es la revisión)
  const asReviewer = person !== null && a.A === person && a.R !== person;
  const doneCount = cells.filter(
    (ap, d) => ap && (asReviewer ? reviewed.has(`${a.id}-${d}`) : done.has(`${a.id}-${d}`))
  ).length;

  return (
    <tr className="group/row border-t border-line/60 transition-colors hover:bg-soft/25">
      <td className="py-3 pl-5 pr-3">
        <div className="flex items-center gap-2">
          {showClient && <span title={cliente?.nombre ?? "Agencia"} className="text-sm">{cliente?.emoji ?? "🏢"}</span>}
          {editing ? (
            <EText value={a.nombre} onSave={(v) => setAction(index, { nombre: v })} className="text-sm" />
          ) : (
            <span className={a.R === "Cliente" || a.R === "Setter" ? "text-mute" : ""}>{a.nombre}</span>
          )}
        </div>
        {editing && (
          <div className="mt-1.5 flex items-center gap-2">
            <ESelect
              value={a.area}
              options={AREA_ORDER.map((ar) => ({ value: ar, label: AREAS[ar].label }))}
              onSave={(v) => setAction(index, { area: v as Area })}
            />
            <ESelect value={a.cadencia} options={CAD_OPTS} onSave={(v) => setAction(index, { cadencia: v as Cadence })} />
          </div>
        )}
      </td>
      <td className="px-2 py-3">
        {editing ? (
          <div className="flex flex-col gap-1">
            <ESelect value={a.R} options={PEOPLE_OPTS} onSave={(v) => setAction(index, { R: v as Person })} />
            <ESelect value={a.A} options={PEOPLE_OPTS} onSave={(v) => setAction(index, { A: v as Person })} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Avatar name={a.R} size={22} />
            <span className="text-dim">/</span>
            <Avatar name={a.A} size={18} />
          </div>
        )}
      </td>
      {cells.map((applies, d) => {
        if (editing) {
          const active = applies;
          return (
            <td key={d} className="px-1 py-3 text-center">
              <button
                onClick={() => toggleDay(index, a, d)}
                title={`${DAY_LABELS[d]}: ${active ? "quitar" : "agregar"}`}
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] font-semibold transition-all ${
                  active ? "border-accent bg-accent/25 text-accent2" : "border-line/60 text-dim hover:border-accent/40"
                }`}
              >
                {DAY_LABELS[d]}
              </button>
            </td>
          );
        }
        if (!applies) return <td key={d} className="px-1 py-3 text-center"><span className="mx-auto block h-8 w-7" /></td>;
        const key = `${a.id}-${d}`;
        const isDone = done.has(key);
        const isRev = reviewed.has(key);
        const isToday = d === TODAY;
        const isFuture = d > TODAY;

        // Vista personal: una sola casilla con el ticket del rol de esa persona
        if (person && !editing) {
          const marked = asReviewer ? isRev : isDone;
          const onClick = () => !isFuture && (asReviewer ? toggleReviewed(key) : toggle(key));
          // quién falta para que la celda quede completa del otro lado
          const otherPending = asReviewer ? !isDone : !isRev;
          const otherName = asReviewer ? a.R : a.A;
          return (
            <td key={d} className="px-1 py-3 text-center">
              <div className="mx-auto flex w-7 flex-col items-center gap-[3px]">
                <button
                  onClick={onClick}
                  disabled={isFuture}
                  title={asReviewer ? `Tu revisión (A) — ${DAY_LABELS[d]}` : `Tu ejecución (R) — ${DAY_LABELS[d]}`}
                  className={`flex h-6 w-7 items-center justify-center rounded-md border text-xs transition-all ${
                    marked
                      ? asReviewer
                        ? "border-ok bg-ok text-bg shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                        : "border-accent bg-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                      : isFuture
                      ? "cursor-default border-line/60 bg-transparent opacity-30"
                      : isToday
                      ? "border-dashed border-accent/70 bg-accent/10 hover:bg-accent/25"
                      : "border-line bg-soft/50 hover:border-accent/50"
                  }`}
                >
                  {marked ? "✓" : ""}
                </button>
                <span
                  title={otherPending && !isFuture ? `Falta ${otherName} (${asReviewer ? "ejecutar" : "revisar"})` : "Contraparte al día"}
                  className={`text-[8px] font-semibold leading-none ${
                    isFuture ? "opacity-0" : otherPending ? "text-warn/80" : "text-ok/70"
                  }`}
                >
                  {otherPending && !isFuture ? INITIALS[otherName] ?? "?" : "·"}
                </span>
              </div>
            </td>
          );
        }

        // Vista común (Todos): doble marca + quién falta por rellenar
        return (
          <td key={d} className="px-1 py-3 text-center">
            <div className="mx-auto flex w-7 flex-col items-center gap-[3px]">
              <button
                onClick={() => !isFuture && toggle(key)}
                disabled={isFuture}
                title={isDone ? `R (${a.R}) ejecutó — ${DAY_LABELS[d]}` : `Falta ejecutar: ${a.R} — ${DAY_LABELS[d]}`}
                className={`flex h-6 w-7 items-center justify-center rounded-md border text-xs transition-all ${
                  isDone
                    ? "border-accent bg-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                    : isFuture
                    ? "cursor-default border-line/60 bg-transparent opacity-30"
                    : isToday
                    ? "border-dashed border-accent/70 bg-accent/10 hover:bg-accent/25"
                    : "border-line bg-soft/50 hover:border-accent/50"
                }`}
              >
                {isDone ? "✓" : isFuture ? "" : <span className="text-[8px] font-semibold text-dim">{INITIALS[a.R] ?? ""}</span>}
              </button>
              <button
                onClick={() => !isFuture && toggleReviewed(key)}
                disabled={isFuture}
                title={
                  isRev
                    ? `A (${a.A}) revisó — ${DAY_LABELS[d]}`
                    : isDone
                    ? `Falta revisión de ${a.A} — ${DAY_LABELS[d]}`
                    : `A (${a.A}) revisa — ${DAY_LABELS[d]}`
                }
                className={`h-[5px] w-7 rounded-full transition-all ${
                  isRev
                    ? "bg-ok shadow-[0_0_6px_rgba(52,211,153,0.55)]"
                    : isFuture
                    ? "cursor-default bg-soft/40"
                    : isDone
                    ? "bg-warn/60 hover:bg-ok/50"
                    : "bg-soft hover:bg-ok/40"
                }`}
              />
            </div>
          </td>
        );
      })}
      <td className="px-3 py-3 text-right text-xs tabular-nums text-mute">
        {editing ? (
          <DeleteBtn onClick={() => removeAction(index)} title="Eliminar acción" />
        ) : (
          <span className={doneCount === applicable && applicable > 0 ? "font-semibold text-ok" : ""}>
            {doneCount}/{applicable}
          </span>
        )}
      </td>
    </tr>
  );
}

export function AreaLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-mute">
      {Object.entries(AREAS).map(([k, a]) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
          {a.label}
        </span>
      ))}
    </div>
  );
}
