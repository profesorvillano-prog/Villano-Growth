"use client";

// Tracker de la semana con dos visualizaciones:
//  · Agencia (semana) — todas las acciones, con filtro por cliente.
//  · Personal — se elige una persona y se ve SOLO lo suyo (ejecuta + revisa),
//    para que no se llene de tareas que no le corresponden.

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead } from "@/components/ui";
import { TrackerGrid, AreaLegend } from "@/components/tracker";
import { AREAS, Action, Area, CLIENTS, Person, complianceFor } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useData } from "@/lib/db";
import { weekRangeLabel } from "@/lib/date";

const PERSONS: Person[] = ["Sebastián", "Rodrigo", "Francisco", "Javier"];
const AREA_KEYS = Object.keys(AREAS) as Area[];

export default function SemanaPage() {
  const [mode, setMode] = useState<"agencia" | "personal">("agencia");
  const [who, setWho] = useState<Person>("Sebastián");
  const [client, setClient] = useState<string>("todos");
  const [area, setArea] = useState<Area | "todas">("todas");
  const { done } = useStore();
  const { actions } = useData();
  const [range, setRange] = useState("");
  useEffect(() => setRange(weekRangeLabel()), []);

  const pred = (a: Action) =>
    (area === "todas" || a.area === area) &&
    (mode === "agencia"
      ? client === "todos" || (client === "agencia" ? a.clientId === null : a.clientId === client)
      : a.R === who || a.A === who);

  const pct = complianceFor(actions.filter(pred), done);

  return (
    <Shell
      title="Semana"
      sub={`${range ? range + " · " : ""}${mode === "agencia" ? "vista de agencia — todas las acciones" : `vista personal — solo lo de ${who}`}`}
      right={<span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">Cumplimiento: <span className="font-semibold text-ink">{pct}%</span></span>}
    >
      <Card>
        <CardHead
          title="Action Tracker"
          sub="Clic para marcar · hoy resaltado · las acciones se crean/editan en Agencia · Acciones"
          right={<AreaLegend />}
        />

        {/* Toggle principal: Agencia vs Personal */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-panel/70 p-1">
            {([
              { key: "agencia", label: "Agencia · semana" },
              { key: "personal", label: "Personal" },
            ] as const).map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${mode === m.key ? "bg-accent text-white shadow-[0_2px_10px_-3px_rgb(139_92_246/0.6)]" : "text-mute hover:text-ink"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "agencia" ? (
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-panel/70 p-1">
              <FilterBtn active={client === "todos"} onClick={() => setClient("todos")}>Todos</FilterBtn>
              <FilterBtn active={client === "agencia"} onClick={() => setClient("agencia")}>Agencia</FilterBtn>
              {CLIENTS.map((c) => (
                <FilterBtn key={c.id} active={client === c.id} onClick={() => setClient(c.id)}>
                  {c.nombre.split(" ")[0]}
                </FilterBtn>
              ))}
            </div>
          ) : (
            <>
              <span className="text-[11px] text-dim">¿De quién?</span>
              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-panel/70 p-1">
                {PERSONS.map((p) => (
                  <FilterBtn key={p} active={who === p} onClick={() => setWho(p)}>{p}</FilterBtn>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filtro por categoría (área) para no ver todo en un chorro */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-5 py-2.5">
          <span className="mr-1 text-[11px] text-dim">Área:</span>
          <button
            onClick={() => setArea("todas")}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${area === "todas" ? "border-accent/50 bg-accent/12 text-accent2" : "border-line bg-panel/50 text-mute hover:text-ink"}`}
          >
            Todas
          </button>
          {AREA_KEYS.map((k) => {
            const on = area === k;
            return (
              <button
                key={k}
                onClick={() => setArea(k)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${on ? "border-accent/50 bg-accent/12 text-ink" : "border-line bg-panel/50 text-mute hover:text-ink"}`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: AREAS[k].color }} />
                {AREAS[k].label}
              </button>
            );
          })}
        </div>

        <TrackerGrid
          filter={pred}
          showClient={mode === "agencia"}
          person={mode === "personal" ? who : null}
          manage={false}
          canMark
        />
      </Card>

      <p className="mt-4 text-xs text-dim">
        {mode === "agencia"
          ? "Vista de agencia: todas las acciones de la semana. Usá el filtro por cliente para enfocarte en uno."
          : `Vista personal de ${who}: primero lo que ejecuta (R) y después lo que revisa (A). Solo aparece lo que le corresponde.`}
      </p>
    </Shell>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${active ? "bg-soft text-ink" : "text-mute hover:text-ink"}`}
    >
      {children}
    </button>
  );
}
