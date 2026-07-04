"use client";

// Tracker global de la semana: todas las acciones (agencia + clientes), filtrables.

import { useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead } from "@/components/ui";
import { TrackerGrid, AreaLegend } from "@/components/tracker";
import { ACTIONS, CLIENTS, Person, complianceFor } from "@/lib/data";
import { useStore } from "@/lib/store";

const PEOPLE: (Person | "Todos")[] = ["Todos", "Sebastián", "Rodrigo", "Patricio", "Javier"];

export default function SemanaPage() {
  const [who, setWho] = useState<(typeof PEOPLE)[number]>("Todos");
  const [client, setClient] = useState<string>("todos");
  const { done } = useStore();

  const filtered = ACTIONS.filter(
    (a) =>
      (who === "Todos" || a.R === who || a.A === who) &&
      (client === "todos" || (client === "agencia" ? a.clientId === null : a.clientId === client))
  );
  const pct = complianceFor(filtered, done);

  return (
    <Shell
      title="Semana"
      sub="29 jun – 5 jul · acciones recurrentes de agencia y clientes"
      right={<span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">Cumplimiento: <span className="font-semibold text-ink">{pct}%</span></span>}
    >
      <Card>
        <CardHead
          title="Action Tracker"
          sub="Clic para marcar · hoy resaltado · los días futuros se desbloquean a su fecha"
          right={<AreaLegend />}
        />
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
            {PEOPLE.map((p) => (
              <button
                key={p}
                onClick={() => setWho(p)}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${who === p ? "bg-accent text-white" : "text-mute hover:text-ink"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
            <FilterBtn active={client === "todos"} onClick={() => setClient("todos")}>Todos</FilterBtn>
            <FilterBtn active={client === "agencia"} onClick={() => setClient("agencia")}>🏢 Agencia</FilterBtn>
            {CLIENTS.map((c) => (
              <FilterBtn key={c.id} active={client === c.id} onClick={() => setClient(c.id)}>
                {c.emoji} {c.nombre.split(" ")[0]}
              </FilterBtn>
            ))}
          </div>
        </div>
        <TrackerGrid actions={filtered} showClient />
      </Card>

      <p className="mt-4 text-xs text-dim">
        Las instancias se generan solas según la cadencia de cada acción (diaria, días fijos, semanal, ciclo de 14 días escalonado por cliente).
        R = responsable ejecuta · A = accountable recibe la alerta si vence.
      </p>
    </Shell>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs transition-colors ${active ? "bg-soft text-ink" : "text-mute hover:text-ink"}`}
    >
      {children}
    </button>
  );
}
