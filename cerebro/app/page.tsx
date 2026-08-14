"use client";

// Dashboard agencia — vista de métricas rica (oscuro + acento coral).
// Números grandes, pills de estado, salud por cliente, objetivos y mi semana.

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress } from "@/components/ui";
import { Action, CLIENTS, actionAppliesOn, clientById, fmtVal } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useData } from "@/lib/db";
import { isBiweeklyWeek, isoKey, weekDates } from "@/lib/date";

const CORAL = "#f0473f"; // acento tipo las fotos

// Cumplimiento real de la semana (claves iso, como el tracker).
function realCompliance(actions: Action[], done: Set<string>, weekIso: string[]) {
  let total = 0, ok = 0;
  for (const a of actions) for (let d = 0; d < 7; d++) if (actionAppliesOn(a, d)) { total++; if (done.has(`${a.id}|${weekIso[d]}`)) ok++; }
  return { pct: total ? Math.round((ok / total) * 100) : 0, ok, total };
}

export default function Dashboard() {
  const { done } = useStore();
  const { goals, actions, objetivos } = useData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const weekIso = mounted ? weekDates(0).map(isoKey) : [];
  const agencia = mounted ? realCompliance(actions, done, weekIso) : { pct: 0, ok: 0, total: 0 };
  const objDone = objetivos.filter((o) => o.hecho).length;
  const tone = (p: number) => (p >= 70 ? "ok" : p >= 40 ? "warn" : "bad") as Tone;

  return (
    <Shell title="Dashboard" sub="Vista de agencia — métricas para no ir a ciegas" right={<StatusLine mounted={mounted} />}>
      {/* Fila hero de métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Cumplimiento semanal" value={agencia.pct + "%"} sub={`${agencia.ok} de ${agencia.total} acciones`} pill={estadoLabel(agencia.pct)} pillTone={tone(agencia.pct)} />
        <MetricCard label="Objetivos de la semana" value={`${objDone}/${objetivos.length}`} sub={objetivos.length ? "focos cumplidos" : "definí los 3 focos"} pill={objetivos.length && objDone === objetivos.length ? "completo" : "en curso"} pillTone={objetivos.length && objDone === objetivos.length ? "ok" : "coral"} />
        <MetricCard label="Metas activas" value={String(goals.length)} sub="conectadas a datos reales" pill="metas" pillTone="coral" />
        <MetricCard label="Clientes activos" value={String(CLIENTS.length)} sub="Family · Marcelo · Ezequiel · Fixus" pill="cartera" pillTone="coral" />
      </div>

      {/* Salud por cliente */}
      <section className="mt-6">
        <SectionTitle icon="◑" title="Salud por cliente" sub="Cumplimiento semanal y plan de contenido" />
        <div className="grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
          {CLIENTS.map((c) => {
            const r = mounted ? realCompliance(actions.filter((a) => a.clientId === c.id), done, weekIso) : { pct: 0, ok: 0, total: 0 };
            const nGoals = goals.filter((g) => g.clientId === c.id).length;
            const t = tone(r.pct);
            return (
              <Link key={c.id} href={`/clientes/${c.id}`} className="group">
                <Card hover className="h-full p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold" style={{ background: c.color + "1f", color: c.color, borderColor: c.color + "3a" }}>{c.initials}</span>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{c.nombre.split(" ").slice(0, 2).join(" ")}</p>
                        <p className="mt-0.5 text-[11px] text-mute">{nGoals} metas</p>
                      </div>
                    </div>
                    <StatePill tone={t}>{estadoLabel(r.pct)}</StatePill>
                  </div>
                  <p className="mt-4 text-[34px] font-bold leading-none tracking-tight tabular-nums">{r.pct}%</p>
                  <p className="mt-1 text-[11px] text-mute">{r.ok} de {r.total} acciones</p>
                  <div className="mt-3"><Progress pct={r.pct} color={c.color} /></div>
                  <span className="mt-3 inline-block text-[11px] font-semibold" style={{ color: CORAL }}>VER CLIENTE ↗</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mi semana + objetivos + metas */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Mi semana" sub="Acciones reales que vencen hoy y mañana, por responsable" right={<Link href="/semana" className="text-xs font-semibold" style={{ color: CORAL }}>VER TRACKER ↗</Link>} />
          <MiSemana />
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <ObjetivosSemana />
          <Card>
            <CardHead title="Metas del mes" right={<Link href="/metas" className="text-xs font-semibold" style={{ color: CORAL }}>TODAS ↗</Link>} />
            <ul className="space-y-3 px-5 py-4">
              {goals.length === 0 && <li className="text-xs text-dim">Sin metas todavía. Creá una en Metas.</li>}
              {goals.slice(0, 3).map((g, i) => {
                const pct = g.objetivo ? Math.min(100, Math.round((g.actual / g.objetivo) * 100)) : 0;
                return (
                  <li key={i}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-mute">{g.nombre}</span>
                      <span className="tabular-nums text-dim">{fmtVal(g.actual, g.fmt)} / {fmtVal(g.objetivo, g.fmt)}</span>
                    </div>
                    <Progress pct={pct} color={CORAL} h={5} />
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

// ---------- Piezas de estilo (tipo las fotos) ----------

type Tone = "ok" | "warn" | "bad" | "coral";

const TONE_CLS: Record<Tone, string> = {
  ok: "border-ok/25 bg-ok/10 text-ok",
  warn: "border-warn/25 bg-warn/10 text-warn",
  bad: "border-bad/25 bg-bad/10 text-bad",
  coral: "border-[#f0473f]/30 bg-[#f0473f]/10 text-[#ff7a70]",
};

function estadoLabel(pct: number) {
  return pct >= 70 ? "sano" : pct >= 40 ? "atención" : "crítico";
}

function StatePill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TONE_CLS[tone]}`}>{children}</span>;
}

function MetricCard({ label, value, sub, pill, pillTone }: { label: string; value: string; sub?: string; pill?: string; pillTone: Tone }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-dim">{label}</p>
        {pill && <StatePill tone={pillTone}>{pill}</StatePill>}
      </div>
      <p className="mt-2.5 text-[40px] font-bold leading-none tracking-tight tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-2 text-[11px] text-mute">{sub}</p>}
    </Card>
  );
}

function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: CORAL + "1f", color: CORAL }}>{icon}</span>
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {sub && <p className="text-[11px] text-mute">{sub}</p>}
      </div>
    </div>
  );
}

function StatusLine({ mounted }: { mounted: boolean }) {
  const [t, setT] = useState("");
  useEffect(() => { setT(new Date().toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })); }, [mounted]);
  return (
    <span className="hidden items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute sm:inline-flex">
      <span className="h-1.5 w-1.5 rounded-full bg-ok" style={{ boxShadow: "0 0 8px #34d399" }} />
      Al día{t ? ` · ${t}` : ""}
    </span>
  );
}

// ---------- Objetivos de la semana ----------

function ObjetivosSemana() {
  const { objetivos, update } = useData();
  const [nuevo, setNuevo] = useState("");
  const add = () => {
    if (!nuevo.trim()) return;
    update("objetivos", [...objetivos, { id: `o-${Math.random().toString(36).slice(2, 7)}`, texto: nuevo.trim(), hecho: false }]);
    setNuevo("");
  };
  const toggle = (id: string) => update("objetivos", objetivos.map((o) => (o.id === id ? { ...o, hecho: !o.hecho } : o)));
  const remove = (id: string) => update("objetivos", objetivos.filter((o) => o.id !== id));

  return (
    <Card>
      <CardHead title="Objetivos de la semana" sub="Se definen el lunes · el foco de la semana" right={<span className="text-[11px] text-dim">{objetivos.filter((o) => o.hecho).length}/{objetivos.length}</span>} />
      <ul className="divide-y divide-line/60">
        {objetivos.length === 0 && <li className="px-5 py-4 text-xs text-dim">Sin objetivos esta semana. Definí los 3 focos abajo.</li>}
        {objetivos.map((o) => (
          <li key={o.id} className="group flex items-center gap-3 px-5 py-2.5">
            <button
              onClick={() => toggle(o.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition-colors ${o.hecho ? "border-ok bg-ok text-bg" : "border-line bg-soft/50 hover:border-[#f0473f]/50"}`}
            >
              {o.hecho ? "✓" : ""}
            </button>
            <span className={`flex-1 text-sm ${o.hecho ? "text-dim line-through" : "text-ink"}`}>{o.texto}</span>
            <button onClick={() => remove(o.id)} className="text-dim opacity-0 transition-opacity hover:text-bad group-hover:opacity-100">×</button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 border-t border-line px-5 py-3">
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nuevo objetivo de la semana…"
          className="min-w-0 flex-1 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-[#f0473f]/60"
        />
        <button onClick={add} className="rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ background: CORAL }}>Agregar</button>
      </div>
    </Card>
  );
}

// ---------- Mi semana (acciones reales hoy/mañana) ----------

function MiSemana() {
  const { actions } = useData();
  const { done, toggle } = useStore();
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
        const suffix = c ? ` — ${c.nombre.split(" ").slice(0, 2).join(" ")}` : a.clientId === null ? " — Agencia" : "";
        return (
          <li key={key} className="flex items-center gap-3 px-5 py-3">
            <button
              onClick={() => toggle(key)}
              title={isDone ? "Marcado" : "Marcar hecho"}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition-colors ${isDone ? "border-ok bg-ok text-bg" : "border-line bg-soft/50 hover:border-[#f0473f]/50"}`}
            >
              {isDone ? "✓" : ""}
            </button>
            <span className={`flex-1 text-sm ${isDone ? "text-dim line-through" : ""}`}>{a.nombre}<span className="text-mute">{suffix}</span></span>
            <span className={`w-16 text-right text-xs ${when === "Hoy" ? "font-semibold" : "text-dim"}`} style={when === "Hoy" ? { color: CORAL } : undefined}>{when}</span>
          </li>
        );
      })}
    </ul>
  );
}
