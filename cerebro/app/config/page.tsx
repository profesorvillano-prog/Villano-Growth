"use client";

import { Shell } from "@/components/shell";
import { Card, CardHead, Avatar } from "@/components/ui";
import { CLIENTS, TEAM } from "@/lib/data";

export default function ConfigPage() {
  return (
    <Shell title="Configuración" sub="Equipo, clientes y plantillas de acciones">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Equipo" sub="Roles de acceso: admin · miembro" />
          <ul className="divide-y divide-line/60">
            {TEAM.map((t) => (
              <li key={t.name} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={t.name} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-mute">{t.role}</p>
                </div>
                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-dim">
                  {t.name === "Sebastián" ? "Admin" : "Miembro"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead title="Clientes" sub="Ciclos de 14 días escalonados — nunca dos revisiones la misma semana" />
          <ul className="divide-y divide-line/60">
            {CLIENTS.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base" style={{ background: c.color + "22" }}>{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.nombre}</p>
                  <p className="truncate text-xs text-mute">{c.oferta}</p>
                </div>
                <span className="text-xs tabular-nums text-dim">ancla {c.cicloAncla.slice(5)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHead title="Principios del sistema" sub="Configuración que NO se toca por cliente" />
          <ul className="grid gap-3 px-5 py-4 text-sm text-mute sm:grid-cols-2">
            <li className="flex gap-2"><span className="text-accent2">·</span>El proceso semanal de contenido es fijo para todos: Selección → Creación → Revisión → Recepción → Edición → Programación → Medición.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>El plan del ciclo de 14 días queda sellado: las ideas nuevas van al backlog del ciclo siguiente.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>Toda acción tiene R (ejecuta) y A (responde). Sin dueño, no existe.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>Los entregables al infoproductor viven en Notion; el contenido se publica y mide en GHL. Esta app orquesta y decide.</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}
