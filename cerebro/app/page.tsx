"use client";

// Dashboard agencia: salud por cliente, alertas y mi semana.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Semaforo, Stat, Avatar, ClientMark } from "@/components/ui";
import { ALERTAS, Action, CLIENTS, SALES, actionAppliesOn, clientById, complianceFor, fmtVal } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useData } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { isBiweeklyWeek, isoKey, todayLongLabel, weekRangeLabel } from "@/lib/date";

export default function Dashboard() {
  const { done } = useStore();
  const { goals, actions, plans } = useData();
  const [range, setRange] = useState("");
  useEffect(() => setRange(weekRangeLabel()), []);

  const freqLabel = (id: string) => {
    const p = plans[id];
    if (!p) return "";
    const hist = p.historiasModo === "diaria" ? "diarias" : p.historiasModo === "lunvie" ? "L–V" : p.historiasModo === "dias" ? `${p.historiasDias.length}/sem` : "no";
    return `Feed ${p.feedDias.length}/sem · Historias ${hist}`;
  };

  return (
    <Shell title="Dashboard" sub={`${range ? "Semana del " + range + " · " : ""}vista agencia`} right={<PillHoy />}>
      <div className="grid gap-4 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const pct = complianceFor(actions.filter((a) => a.clientId === c.id), done);
          const nGoals = goals.filter((g) => g.clientId === c.id).length;
          const estado = pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad";
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
                  <Stat label="Plan feed" value={`${plans[c.id]?.feedDias.length ?? 0}/sem`} hint="por semana" />
                  <Stat label="Metas" value={String(nGoals)} hint="activas" />
                  <Stat label="Cumplim." value={pct + "%"} tone={pct >= 70 ? "ok" : pct >= 40 ? "warn" : undefined} hint="semanal" />
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-dim">
                  <span className="rounded-md bg-soft/60 px-1.5 py-0.5 text-mute">{freqLabel(c.id)}</span>
                </div>

                <div className="mt-3">
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
          <CardHead title="Mi semana" sub="Acciones reales que vencen hoy y mañana, por responsable" right={<Link href="/semana" className="text-xs font-medium text-accent2 hover:underline">Ver tracker completo →</Link>} />
          <MiSemana />
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

// "Mi semana" real: acciones del tracker que aplican hoy y mañana, con su check.
function MiSemana() {
  const { actions } = useData();
  const { done, toggle } = useStore();
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="px-5 py-8 text-center text-sm text-dim">Cargando…</div>;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const info = (d: Date) => ({ iso: isoKey(d), idx: (d.getDay() + 6) % 7, bi: isBiweeklyWeek(0, d) });
  const T = info(today);
  const M = info(tomorrow);
  const appliesOn = (a: Action, idx: number, bi: boolean) => (a.cadencia !== "14d" || bi) && actionAppliesOn(a, idx);

  type Item = { a: Action; when: "Hoy" | "Mañana"; iso: string };
  const items: Item[] = [];
  for (const a of actions) {
    if (appliesOn(a, T.idx, T.bi)) items.push({ a, when: "Hoy", iso: T.iso });
    else if (appliesOn(a, M.idx, M.bi)) items.push({ a, when: "Mañana", iso: M.iso });
  }
  items.sort((x, y) => (x.when === y.when ? 0 : x.when === "Hoy" ? -1 : 1));

  if (items.length === 0) return <p className="px-5 py-8 text-center text-sm text-dim">Nada para hoy ni mañana 🎉</p>;

  return (
    <ul className="divide-y divide-line/60">
      {items.map(({ a, when, iso }) => {
        const key = `${a.id}|${iso}`;
        const isDone = done.has(key);
        const c = clientById(a.clientId);
        const suffix = c ? ` — ${c.nombre}` : a.clientId === null ? " — Agencia" : "";
        return (
          <li key={key} className="flex items-center gap-3 px-5 py-3">
            <button
              onClick={() => isAdmin && toggle(key)}
              disabled={!isAdmin}
              title={isAdmin ? (isDone ? "Marcado" : "Marcar hecho") : "Solo la agencia marca"}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition-colors ${isDone ? "border-accent bg-accent text-white" : "border-line bg-soft/50"} ${isAdmin ? "hover:border-accent/50" : "cursor-default"}`}
            >
              {isDone ? "✓" : ""}
            </button>
            <span className={`flex-1 text-sm ${isDone ? "text-dim line-through" : ""}`}>{a.nombre}<span className="text-mute">{suffix}</span></span>
            <Avatar name={a.R} size={22} />
            <span className={`w-16 text-right text-xs ${when === "Hoy" ? "font-medium text-warn" : "text-dim"}`}>{when}</span>
          </li>
        );
      })}
    </ul>
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
