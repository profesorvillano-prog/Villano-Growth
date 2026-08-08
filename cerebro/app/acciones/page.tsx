"use client";

// Agencia · Gestión del Action Tracker.
// Acá se crean y editan las acciones recurrentes: nombre, área, quién ejecuta (R),
// quién revisa (A), cadencia y días de la semana. Operación solo las visualiza.

import { useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead } from "@/components/ui";
import { TrackerGrid, AreaLegend } from "@/components/tracker";
import { Action, CLIENTS } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { AdminOnly } from "@/components/admin-only";

export default function AccionesPage() {
  const [client, setClient] = useState<string>("todos");
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";

  const pred = (a: Action) =>
    client === "todos" || (client === "agencia" ? a.clientId === null : a.clientId === client);

  return (
    <Shell title="Acciones · Gestión del tracker" sub="Crear y editar acciones recurrentes: R ejecuta · A revisa · cadencia · días">
      <AdminOnly isAdmin={isAdmin} area="las acciones del tracker">
        <Card>
          <CardHead
            title="Acciones recurrentes"
            sub="Tocá “Editar acciones” para agregar, cambiar responsables, cadencia y días. Se refleja en Semana y en cada panel."
            right={<AreaLegend />}
          />
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-panel p-1">
              <FilterBtn active={client === "todos"} onClick={() => setClient("todos")}>Todos</FilterBtn>
              <FilterBtn active={client === "agencia"} onClick={() => setClient("agencia")}>Agencia</FilterBtn>
              {CLIENTS.map((c) => (
                <FilterBtn key={c.id} active={client === c.id} onClick={() => setClient(c.id)}>
                  {c.nombre.split(" ")[0]}
                </FilterBtn>
              ))}
            </div>
            <span className="text-[11px] text-dim">Las acciones nuevas se crean para el filtro elegido.</span>
          </div>
          <TrackerGrid
            filter={pred}
            showClient
            addClientId={client === "todos" || client === "agencia" ? null : client}
            manage
            canMark
          />
        </Card>
        <p className="mt-4 text-xs text-dim">
          Cadencias: diaria · días fijos (L–D) · semanal · quincenal (cada 15 días). Cada acción lleva su
          <span className="text-mute"> R</span> (ejecuta) y <span className="text-mute">A</span> (revisa). En operación esto se ve, no se edita.
        </p>
      </AdminOnly>
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
