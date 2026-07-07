"use client";

// Action Tracker con dos vistas:
//  · Hoy — checklist grande del día (por rol en vista personal: primero Ejecutas (R), luego Revisas (A))
//  · Semana — grilla acciones × días agrupada en secciones (áreas, o R/A en vista personal)
// Cada instancia tiene doble marca: R ejecuta · A revisa (trabajo en paralelo).

import { useEffect, useState } from "react";
import {
  AREAS, Action, Area, Cadence, DAY_LABELS, Person, actionAppliesOn, clientById,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { useData } from "@/lib/db";
import { todayIndex, todayLabel, weekDayNumbers } from "@/lib/date";
import { Avatar, AreaBadge } from "./ui";
import { AddBtn, DeleteBtn, ESelect, EText } from "./editable";

const AREA_ORDER: Area[] = ["organico", "trafico", "embudos", "ventas", "agencia"];
const PEOPLE_OPTS = (["Sebastián", "Rodrigo", "Patricio", "Javier", "Cliente", "Setter"] as Person[])
  .map((p) => ({ value: p, label: p }));
const CAD_OPTS: { value: Cadence; label: string }[] = [
  { value: "diaria", label: "diaria" },
  { value: "dias", label: "días fijos" },
  { value: "semanal", label: "semanal" },
  { value: "14d", label: "cada 14 días" },
];
const INITIALS: Record<string, string> = {
  Sebastián: "SE", Rodrigo: "RO", Patricio: "PA", Javier: "JA", Cliente: "CL", Setter: "IN",
};

type Row = { a: Action; index: number };
type Group = { key: string; title: string; color: string; rows: Row[] };

function buildGroups(rows: Row[], person: Person | null): Group[] {
  const byArea = (list: Row[]) =>
    [...list].sort((x, y) => AREA_ORDER.indexOf(x.a.area) - AREA_ORDER.indexOf(y.a.area));
  if (person) {
    return [
      { key: "R", title: `Ejecutas · R`, color: "#8b5cf6", rows: byArea(rows.filter(({ a }) => a.R === person)) },
      { key: "A", title: `Revisas · A`, color: "#34d399", rows: byArea(rows.filter(({ a }) => a.A === person && a.R !== person)) },
    ].filter((g) => g.rows.length > 0);
  }
  return AREA_ORDER
    .map((area) => ({ key: area, title: AREAS[area].label, color: AREAS[area].color, rows: rows.filter(({ a }) => a.area === area) }))
    .filter((g) => g.rows.length > 0);
}

export function TrackerGrid({
  filter, showClient = false, addClientId = null, person = null,
}: { filter: (a: Action) => boolean; showClient?: boolean; addClientId?: string | null; person?: Person | null }) {
  const { done, reviewed, toggle, toggleReviewed } = useStore();
  const { actions, update } = useData();
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState<"hoy" | "semana">("hoy");
  // -1 hasta montar (server y primer render cliente coinciden → sin desajuste)
  const [today, setToday] = useState(-1);
  useEffect(() => setToday(todayIndex()), []);

  const rows = actions.map((a, index) => ({ a, index })).filter(({ a }) => filter(a));
  const groups = buildGroups(rows, person);

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
        <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
          {(["hoy", "semana"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); if (m === "hoy") setEditing(false); }}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                mode === m ? "bg-accent text-white" : "text-mute hover:text-ink"
              }`}
            >
              {m === "hoy" ? "☀ Hoy" : "▦ Semana"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-[11px] text-dim sm:block">
            {person ? (
              <>Vista de <span className="font-medium text-ink">{person}</span> — primero lo que ejecuta, después lo que revisa</>
            ) : (
              <>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-[4px] border border-accent bg-accent align-middle" /> R ejecuta ·{" "}
                <span className="mx-1 inline-block h-1 w-4 rounded-full bg-ok align-middle" /> A revisó ·{" "}
                <span className="mx-1 inline-block h-1 w-4 rounded-full bg-warn/70 align-middle" /> falta revisión
              </>
            )}
          </p>
          {mode === "semana" && (
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
          )}
        </div>
      </div>

      {mode === "hoy" ? (
        <TodayView groups={groups} person={person} showClient={showClient} today={today} done={done} reviewed={reviewed} toggle={toggle} toggleReviewed={toggleReviewed} />
      ) : (
        <WeekView
          groups={groups}
          person={person}
          editing={editing}
          showClient={showClient}
          today={today}
          done={done}
          reviewed={reviewed}
          toggle={toggle}
          toggleReviewed={toggleReviewed}
          setAction={setAction}
          removeAction={removeAction}
          toggleDay={toggleDay}
        />
      )}
    </div>
  );
}

// ---------------- Vista HOY: checklist grande del día ----------------

function TodayView({
  groups, person, showClient, today, done, reviewed, toggle, toggleReviewed,
}: {
  groups: Group[];
  person: Person | null;
  showClient: boolean;
  today: number;
  done: Set<string>;
  reviewed: Set<string>;
  toggle: (k: string) => void;
  toggleReviewed: (k: string) => void;
}) {
  if (today < 0) return <p className="px-5 py-10 text-center text-sm text-dim">…</p>;
  const todayGroups = groups
    .map((g) => ({ ...g, rows: g.rows.filter(({ a }) => actionAppliesOn(a, today)) }))
    .filter((g) => g.rows.length > 0);

  if (todayGroups.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-dim">Nada programado para hoy 🎉</p>;
  }
  const dLabel = todayLabel();

  return (
    <div className="divide-y divide-line/60">
      {todayGroups.map((g) => {
        const doneCount = g.rows.filter(({ a }) =>
          g.key === "A" ? reviewed.has(`${a.id}-${today}`) : done.has(`${a.id}-${today}`)
        ).length;
        return (
          <div key={g.key} className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: g.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                {g.title} · {dLabel}
              </p>
              <span className="text-xs tabular-nums text-dim">{doneCount}/{g.rows.length}</span>
            </div>
            <ul className="space-y-2">
              {g.rows.map(({ a }) => {
                const key = `${a.id}-${today}`;
                const isDone = done.has(key);
                const isRev = reviewed.has(key);
                const asReviewer = person !== null && a.A === person && a.R !== person;
                const marked = asReviewer ? isRev : isDone;
                const cliente = clientById(a.clientId);
                return (
                  <li
                    key={a.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      marked ? "border-line/60 bg-panel/40" : "border-line bg-panel/70 hover:border-accent/30"
                    }`}
                  >
                    <button
                      onClick={() => (asReviewer ? toggleReviewed(key) : toggle(key))}
                      title={asReviewer ? "Marcar revisado (A)" : "Marcar ejecutado (R)"}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base transition-all ${
                        marked
                          ? asReviewer
                            ? "border-ok bg-ok text-bg shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                            : "border-accent bg-accent text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                          : "border-dashed border-accent/60 bg-accent/5 hover:bg-accent/20"
                      }`}
                    >
                      {marked ? "✓" : ""}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${marked ? "text-dim line-through" : ""}`}>
                        {showClient && <span className="mr-1.5">{cliente?.emoji ?? "🏢"}</span>}
                        {a.nombre}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <AreaBadge area={a.area} />
                        {!person && (
                          <span className="flex items-center gap-1 text-[11px] text-dim">
                            <Avatar name={a.R} size={16} /> ejecuta · <Avatar name={a.A} size={16} /> revisa
                          </span>
                        )}
                      </div>
                    </div>
                    {asReviewer ? (
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${isDone ? "border-ok/40 text-ok" : "border-warn/40 text-warn"}`}>
                        {isDone ? `${INITIALS[a.R]} ejecutó ✓` : `Falta ${INITIALS[a.R]}`}
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleReviewed(key)}
                        title={person ? `Revisión del A (${a.A})` : `A (${a.A}) marca revisado`}
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                          isRev
                            ? "border-ok bg-ok/15 text-ok"
                            : isDone
                            ? "border-warn/50 text-warn hover:bg-warn/10"
                            : "border-line text-dim hover:text-mute"
                        }`}
                      >
                        {isRev ? "Revisado ✓" : `Revisa ${INITIALS[a.A]}`}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Vista SEMANA: grilla acciones × días ----------------

function WeekView({
  groups, person, editing, showClient, today, done, reviewed, toggle, toggleReviewed, setAction, removeAction, toggleDay,
}: {
  groups: Group[];
  person: Person | null;
  editing: boolean;
  showClient: boolean;
  today: number;
  done: Set<string>;
  reviewed: Set<string>;
  toggle: (k: string) => void;
  toggleReviewed: (k: string) => void;
  setAction: (i: number, p: Partial<Action>) => void;
  removeAction: (i: number) => void;
  toggleDay: (i: number, a: Action, d: number) => void;
}) {
  const nums = weekDayNumbers();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-dim">
            <th className="w-[36%] py-2.5 pl-5 pr-3 text-left font-medium">Acción</th>
            <th className="px-2 py-2.5 text-left font-medium">R / A</th>
            {DAY_LABELS.map((d, i) => (
              <th key={d} className="px-1 py-2.5 text-center font-medium">
                <span
                  className={
                    i === today
                      ? "inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 font-semibold text-white"
                      : "text-dim"
                  }
                >
                  {d}<span className="ml-0.5 text-[9px] opacity-70">{nums[i]}</span>
                </span>
              </th>
            ))}
            <th className="px-3 py-2.5 text-right font-medium">{editing ? "" : "Sem."}</th>
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.key}>
            <tr>
              <td colSpan={10} className="border-t border-line bg-panel/70 py-2 pl-5">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: g.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                  {g.title}
                </span>
              </td>
            </tr>
            {g.rows.map(({ a, index }) => (
              <ActionRow
                key={a.id}
                a={a}
                index={index}
                editing={editing}
                showClient={showClient}
                showArea={person !== null}
                person={person}
                today={today}
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
        ))}
      </table>
    </div>
  );
}

function ActionRow({
  a, index, editing, showClient, showArea, person, today, done, reviewed, toggle, toggleReviewed, setAction, removeAction, toggleDay,
}: {
  a: Action;
  index: number;
  editing: boolean;
  showClient: boolean;
  showArea: boolean;
  person: Person | null;
  today: number;
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
          {showArea && !editing && <AreaBadge area={a.area} />}
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
        const isToday = d === today;
        const isFuture = today >= 0 && d > today;

        if (person) {
          const marked = asReviewer ? isRev : isDone;
          const onClick = () => !isFuture && (asReviewer ? toggleReviewed(key) : toggle(key));
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
