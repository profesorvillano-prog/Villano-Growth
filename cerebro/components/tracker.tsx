"use client";

// Grilla del Action Tracker: acciones × días (L–D), con RACI y cumplimiento.

import { Action, DAY_LABELS, actionAppliesOn, clientById, AREAS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Avatar, AreaBadge } from "./ui";

const TODAY = 3; // jueves (demo)

export function TrackerGrid({ actions, showClient = false }: { actions: Action[]; showClient?: boolean }) {
  const { done, toggle } = useStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-dim">
            <th className="w-[40%] py-2 pl-5 pr-3 text-left font-medium">Acción</th>
            <th className="px-2 py-2 text-left font-medium">R / A</th>
            {DAY_LABELS.map((d, i) => (
              <th key={d} className="px-1 py-2 text-center font-medium">
                <span className={i === TODAY ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent font-semibold text-white" : ""}>{d}</span>
              </th>
            ))}
            <th className="px-3 py-2 text-right font-medium">Sem.</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => {
            const cells = Array.from({ length: 7 }, (_, d) => actionAppliesOn(a, d));
            const applicable = cells.filter(Boolean).length;
            const doneCount = cells.filter((ap, d) => ap && done.has(`${a.id}-${d}`)).length;
            const cliente = clientById(a.clientId);
            return (
              <tr key={a.id} className="border-t border-line/70 hover:bg-soft/30">
                <td className="py-2.5 pl-5 pr-3">
                  <div className="flex items-center gap-2">
                    {showClient && (
                      <span title={cliente?.nombre ?? "Agencia"} className="text-sm">{cliente?.emoji ?? "🏢"}</span>
                    )}
                    <span className={a.R === "Cliente" || a.R === "Setter" ? "text-mute" : ""}>{a.nombre}</span>
                  </div>
                  <div className="mt-1"><AreaBadge area={a.area} /></div>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1">
                    <Avatar name={a.R} size={22} />
                    <span className="text-dim">/</span>
                    <Avatar name={a.A} size={18} />
                  </div>
                </td>
                {cells.map((applies, d) => {
                  if (!applies) return <td key={d} className="px-1 py-2.5 text-center"><span className="mx-auto block h-7 w-7" /></td>;
                  const key = `${a.id}-${d}`;
                  const isDone = done.has(key);
                  const isToday = d === TODAY;
                  const isFuture = d > TODAY;
                  return (
                    <td key={d} className="px-1 py-2.5 text-center">
                      <button
                        onClick={() => !isFuture && toggle(key)}
                        disabled={isFuture}
                        aria-label={`${a.nombre} — ${DAY_LABELS[d]}`}
                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition-all ${
                          isDone
                            ? "border-accent bg-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                            : isFuture
                            ? "cursor-default border-line/60 bg-transparent opacity-30"
                            : isToday
                            ? "border-dashed border-accent/70 bg-accent/10 hover:bg-accent/25"
                            : "border-line bg-soft/50 hover:border-accent/50"
                        }`}
                      >
                        {isDone ? "✓" : ""}
                      </button>
                    </td>
                  );
                })}
                <td className="px-3 py-2.5 text-right text-xs tabular-nums text-mute">
                  <span className={doneCount === applicable && applicable > 0 ? "font-semibold text-ok" : ""}>
                    {doneCount}/{applicable}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
