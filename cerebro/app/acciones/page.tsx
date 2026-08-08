"use client";

// Agencia · Gestión del Action Tracker.
// Acá se CREAN y EDITAN las acciones recurrentes: nombre, área, quién ejecuta (R),
// quién revisa (A), cadencia y días. No se marca (el marcado es de operación, en
// Semana) — acá se ve el rendimiento (cumplimiento de la semana).

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Stat, AreaBadge } from "@/components/ui";
import { TrackerGrid, AreaLegend } from "@/components/tracker";
import { Action, Area, CLIENTS, actionAppliesOn } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/db";
import { useStore } from "@/lib/store";
import { weekDates, isoKey } from "@/lib/date";
import { AdminOnly } from "@/components/admin-only";

export default function AccionesPage() {
  const [client, setClient] = useState<string>("todos");
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";

  const pred = (a: Action) =>
    client === "todos" || (client === "agencia" ? a.clientId === null : a.clientId === client);

  return (
    <Shell title="Acciones · Gestión del tracker" sub="Crear y editar acciones (R ejecuta · A revisa · cadencia · días) y ver rendimiento">
      <AdminOnly isAdmin={isAdmin} area="las acciones del tracker">
        <Rendimiento filter={pred} />
        <Card className="mt-4">
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
            <span className="text-[11px] text-dim">Las acciones nuevas se crean para el filtro elegido. Acá no se marca (eso es en Semana).</span>
          </div>
          <TrackerGrid
            filter={pred}
            showClient
            addClientId={client === "todos" || client === "agencia" ? null : client}
            manage
            canMark={false}
          />
        </Card>
      </AdminOnly>
    </Shell>
  );
}

// Rendimiento = cumplimiento real de la semana (marcas hechas en Semana).
function Rendimiento({ filter }: { filter: (a: Action) => boolean }) {
  const { actions } = useData();
  const { done } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Card className="p-5 text-sm text-dim">Cargando rendimiento…</Card>;

  const week = weekDates(0).map(isoKey);
  const filtered = actions.filter(filter);

  let total = 0, ok = 0;
  const porArea: Record<string, { total: number; ok: number }> = {};
  for (const a of filtered) {
    for (let d = 0; d < 7; d++) {
      if (!actionAppliesOn(a, d)) continue;
      total++;
      const marcada = done.has(`${a.id}|${week[d]}`);
      if (marcada) ok++;
      const pa = (porArea[a.area] ??= { total: 0, ok: 0 });
      pa.total++; if (marcada) pa.ok++;
    }
  }
  const pct = total ? Math.round((ok / total) * 100) : 0;
  const tone = pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad";

  return (
    <Card>
      <CardHead title="Rendimiento de la semana" sub="Cumplimiento real según lo marcado en Semana (operación)" />
      <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
        <Stat label="Cumplimiento" value={pct + "%"} tone={tone} hint={`${ok}/${total} marcadas`} />
        <Stat label="Acciones activas" value={String(filtered.length)} hint="en el filtro" />
        <Stat label="Instancias de la semana" value={String(total)} hint="acciones × días" />
        <Stat label="Completadas" value={String(ok)} tone={ok > 0 ? "ok" : undefined} />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-5 py-3">
        {(Object.keys(porArea) as Area[]).map((area) => {
          const a = porArea[area];
          const p = a.total ? Math.round((a.ok / a.total) * 100) : 0;
          return (
            <span key={area} className="flex items-center gap-2 text-xs">
              <AreaBadge area={area} />
              <span className={`tabular-nums ${p >= 70 ? "text-ok" : p >= 40 ? "text-warn" : "text-mute"}`}>{p}%</span>
              <span className="text-dim">({a.ok}/{a.total})</span>
            </span>
          );
        })}
      </div>
    </Card>
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
