"use client";

// Dashboard agencia: salud por cliente, alertas y mi semana.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Semaforo, Stat, Avatar, ClientMark } from "@/components/ui";
import { ALERTAS, CLIENTS, SALES, complianceFor, fmtVal } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useData } from "@/lib/db";
import { todayLongLabel, weekRangeLabel } from "@/lib/date";

export default function Dashboard() {
  const { done } = useStore();
  const { goals, actions } = useData();
  const [range, setRange] = useState("");
  useEffect(() => setRange(weekRangeLabel()), []);

  return (
    <Shell title="Dashboard" sub={`${range ? "Semana del " + range + " · " : ""}vista agencia`} right={<PillHoy />}>
      <div className="grid gap-4 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const pct = complianceFor(actions.filter((a) => a.clientId === c.id), done);
          const sales = SALES[c.id];
          const roas = sales.inversionCiclo > 0 ? sales.facturacionCiclo / sales.inversionCiclo : 0;
          const estado = roas >= 2 && pct >= 30 ? "ok" : roas >= 1 || pct >= 30 ? "warn" : "bad";
          return (
            <Link key={c.id} href={`/clientes/${c.id}`} className="group">
              <Card className="h-full p-5 transition-colors group-hover:border-accent/40">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <ClientMark initials={c.initials} color={c.color} size={40} />
                    <div>
                      <p className="font-semibold leading-tight">{c.nombre}</p>
                      <p className="mt-0.5 text-xs text-mute">{c.nicho}</p>
                    </div>
                  </div>
                  <Semaforo estado={estado} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Stat label="Facturación" value={fmtVal(sales.facturacionCiclo, "usd")} hint="ciclo actual" />
                  <Stat label="ROAS" value={roas ? fmtVal(roas, "x") : "—"} tone={roas >= 2 ? "ok" : roas > 0 ? "warn" : undefined} hint="blended" />
                  <Stat label="Cierres" value={String(sales.cierres)} hint={`${sales.agendasPend} agendas pend.`} />
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-mute">Cumplimiento semanal</span>
                    <span className="font-medium tabular-nums text-ink">{pct}%</span>
                  </div>
                  <Progress pct={pct} color={c.color} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Mi semana" sub="Acciones que vencen hoy y mañana, por responsable" right={<Link href="/semana" className="text-xs font-medium text-accent2 hover:underline">Ver tracker completo →</Link>} />
          <ul className="divide-y divide-line/60">
            {[
              { txt: "Historias del día — Family Eaters", R: "Patricio", when: "Hoy", done: false },
              { txt: "Cargar métricas de ads (semana) — 3 clientes", R: "Javier", when: "Hoy", done: false },
              { txt: "Revisar conversión del funnel — Family", R: "Sebastián", when: "Hoy", done: false },
              { txt: "Setter: gestionar chats y agendas — Marcelo", R: "Setter", when: "Hoy", done: true },
              { txt: "Historias (L·X·V) — Ezequiel", R: "Patricio", when: "Mañana", done: false },
              { txt: "Cierre financiero semanal — Agencia", R: "Javier", when: "Mañana", done: false },
            ].map((t, i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-3">
                <span className={`flex h-5 w-5 items-center justify-center rounded-md border text-[10px] ${t.done ? "border-accent bg-accent text-white" : "border-line bg-soft/50"}`}>{t.done ? "✓" : ""}</span>
                <span className={`flex-1 text-sm ${t.done ? "text-dim line-through" : ""}`}>{t.txt}</span>
                <Avatar name={t.R} size={22} />
                <span className={`w-16 text-right text-xs ${t.when === "Hoy" ? "font-medium text-warn" : "text-dim"}`}>{t.when}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHead title="Alertas" sub="Lo que necesita atención" />
            <ul className="divide-y divide-line/60">
              {ALERTAS.map((a, i) => (
                <li key={i} className="flex items-start gap-3 px-5 py-3 text-sm">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.tipo === "dato" ? "bg-warn" : a.tipo === "accion" ? "bg-bad" : "bg-accent"}`} />
                  <span className="text-mute">{a.texto}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Metas del mes" right={<Link href="/metas" className="text-xs font-medium text-accent2 hover:underline">Todas →</Link>} />
            <ul className="space-y-3 px-5 py-4">
              {goals.slice(0, 3).map((g, i) => {
                const pct = Math.min(100, Math.round((g.actual / g.objetivo) * 100));
                return (
                  <li key={i}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-mute">{g.nombre}</span>
                      <span className="tabular-nums text-dim">{fmtVal(g.actual, g.fmt)} / {fmtVal(g.objetivo, g.fmt)}</span>
                    </div>
                    <Progress pct={pct} h={5} />
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function PillHoy() {
  const [label, setLabel] = useState("");
  useEffect(() => setLabel(todayLongLabel()), []);
  return (
    <span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">
      {label ? <span className="capitalize">{label}</span> : "Hoy"} · <span className="font-medium text-ink">2 revisiones esta semana</span>
    </span>
  );
}
