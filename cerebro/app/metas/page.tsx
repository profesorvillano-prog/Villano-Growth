"use client";

import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, AreaBadge } from "@/components/ui";
import { CLIENTS, GOALS, clientById, fmtVal } from "@/lib/data";

export default function MetasPage() {
  return (
    <Shell title="Metas" sub="Objetivos por cliente y área — el progreso se calcula desde las métricas cargadas">
      <div className="grid gap-4 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const goals = GOALS.filter((g) => g.clientId === c.id);
          return (
            <Card key={c.id}>
              <CardHead title={`${c.emoji} ${c.nombre}`} sub={`${goals.length} metas activas`} />
              <ul className="space-y-4 px-5 py-4">
                {goals.map((g, i) => {
                  const pct = Math.min(100, Math.round((g.actual / g.objetivo) * 100));
                  const met = g.actual >= g.objetivo;
                  return (
                    <li key={i}>
                      <div className="mb-1.5 flex items-start justify-between gap-2 text-sm">
                        <span className="text-mute">{g.nombre}</span>
                        <AreaBadge area={g.area} />
                      </div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className={`font-medium tabular-nums ${met ? "text-ok" : "text-ink"}`}>
                          {fmtVal(g.actual, g.fmt)} <span className="font-normal text-dim">/ {fmtVal(g.objetivo, g.fmt)}</span>
                        </span>
                        <span className="text-dim">{g.plazo} · {pct}%</span>
                      </div>
                      <Progress pct={pct} color={met ? "#34d399" : c.color} h={5} />
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-dim">
        Sin doble carga: cada meta apunta a una métrica del sistema (facturación, ROAS, agendas, seguidores…) y se actualiza sola.
      </p>
    </Shell>
  );
}
