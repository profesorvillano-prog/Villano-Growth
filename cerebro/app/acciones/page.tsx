"use client";

// Agencia · Gestión del Action Tracker (visualización compacta).
// Se CREAN/EDITAN las acciones (nombre, área, R/A, cadencia, días) en una lista
// por área — no el grid de marcado (eso es en Semana). El rendimiento va arriba,
// colapsable, para no saturar.

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Stat, AreaBadge } from "@/components/ui";
import { ActionManager } from "@/components/action-manager";
import { AREAS, Action, Area, CLIENTS, Person, actionAppliesOn } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/db";
import { useStore } from "@/lib/store";
import { weekDates, isoKey } from "@/lib/date";
import { AdminOnly } from "@/components/admin-only";

const PERSONS: Person[] = ["Sebastián", "Rodrigo", "Francisco", "Javier"];

const AREA_KEYS = Object.keys(AREAS) as Area[];

export default function AccionesPage() {
  const [area, setArea] = useState<Area | "todas">("todas");
  const [client, setClient] = useState<string>("todos");
  const [who, setWho] = useState<Person | "todos">("todos");
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";

  const pred = (a: Action) =>
    (area === "todas" || a.area === area) &&
    (client === "todos" || (client === "agencia" ? a.clientId === null : a.clientId === client)) &&
    (who === "todos" || a.R === who || a.A === who);

  const addClientId = client === "todos" || client === "agencia" ? null : client;

  return (
    <Shell title="Acciones · Gestión del tracker" sub="Crear y editar acciones (R ejecuta · A revisa · cadencia · días)">
      <AdminOnly isAdmin={isAdmin} area="las acciones del tracker">
        <Rendimiento filter={pred} />

        <Card className="mt-4">
          <CardHead title="Acciones recurrentes" sub="Elegí la categoría arriba y editá en línea. Se refleja en Semana." />
          {/* Selector de categoría (área) — principal */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-5 py-3">
            <button
              onClick={() => setArea("todas")}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${area === "todas" ? "border-accent/50 bg-accent/12 text-accent2" : "border-line bg-panel/50 text-mute hover:border-accent/40 hover:text-ink"}`}
            >
              Todas
            </button>
            {AREA_KEYS.map((k) => {
              const on = area === k;
              return (
                <button
                  key={k}
                  onClick={() => setArea(k)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${on ? "border-accent/50 bg-accent/12 text-ink" : "border-line bg-panel/50 text-mute hover:border-accent/40 hover:text-ink"}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: AREAS[k].color, boxShadow: on ? `0 0 6px ${AREAS[k].color}` : undefined }} />
                  {AREAS[k].label}
                </button>
              );
            })}
          </div>
          {/* Filtros secundarios: cliente y persona */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-2.5">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-panel/70 p-1">
              <FilterBtn active={client === "todos"} onClick={() => setClient("todos")}>Todos</FilterBtn>
              <FilterBtn active={client === "agencia"} onClick={() => setClient("agencia")}>Agencia</FilterBtn>
              {CLIENTS.map((c) => (
                <FilterBtn key={c.id} active={client === c.id} onClick={() => setClient(c.id)}>{c.nombre.split(" ")[0]}</FilterBtn>
              ))}
            </div>
            <span className="text-[11px] text-dim">·</span>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-panel/70 p-1">
              <FilterBtn active={who === "todos"} onClick={() => setWho("todos")}>Todo el equipo</FilterBtn>
              {PERSONS.map((p) => (
                <FilterBtn key={p} active={who === p} onClick={() => setWho(p)}>{p}</FilterBtn>
              ))}
            </div>
          </div>
          <ActionManager filter={pred} addClientId={addClientId} />
        </Card>
      </AdminOnly>
    </Shell>
  );
}

// Rendimiento compacto y colapsable.
function Rendimiento({ filter }: { filter: (a: Action) => boolean }) {
  const { actions } = useData();
  const { done } = useStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <Card className="px-5 py-4 text-sm text-dim">Cargando rendimiento…</Card>;

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
  const tone = pct >= 70 ? "text-ok" : pct >= 40 ? "text-warn" : "text-bad";

  return (
    <Card>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-ink">Rendimiento de la semana</span>
          <span className={`text-sm font-semibold tabular-nums ${tone}`}>{pct}%</span>
          <span className="text-xs text-dim">{ok}/{total} marcadas · {filtered.length} acciones</span>
        </div>
        <span className="text-xs text-mute">{open ? "ocultar ▲" : "ver detalle ▾"}</span>
      </button>
      {open && (
        <>
          <div className="grid grid-cols-2 gap-3 border-t border-line px-5 py-4 sm:grid-cols-4">
            <Stat label="Cumplimiento" value={pct + "%"} tone={pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad"} hint={`${ok}/${total} marcadas`} />
            <Stat label="Acciones activas" value={String(filtered.length)} hint="en el filtro" />
            <Stat label="Instancias" value={String(total)} hint="acciones × días" />
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
        </>
      )}
    </Card>
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
