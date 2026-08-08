"use client";

// Operación · Equipo · KPIs — visualización y marcado del avance.
// Cada KPI tiene cadencia (X veces por semana o por mes): se marca por período,
// se reinicia solo y queda histórico. Las DEFINICIONES se gestionan en Agencia · KPIs.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Avatar } from "@/components/ui";
import { ENum, EText } from "@/components/editable";
import { KPI, KpiCadencia, TEAM, clientById, fmtVal } from "@/lib/data";
import { useData } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { currentPeriodKey, periodList, useKpiProgress, weekOfMonth } from "@/lib/kpi";

const CAD_LABEL: Record<KpiCadencia, string> = { semanal: "sem", mensual: "mes" };

export default function EquipoPage() {
  const { kpis, finanzas, update } = useData();
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";
  const { get, setValor, ready } = useKpiProgress();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const setFin = (index: number, patch: Partial<(typeof finanzas)[number]>) =>
    update("finanzas", finanzas.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const totalIngreso = finanzas.reduce((s, f) => s + f.ingresoAgencia, 0);
  const totalMargen = finanzas.reduce((s, f) => s + f.margen, 0);
  const kidOf = (k: KPI, index: number) => k.id ?? `legacy-${index}`;

  return (
    <Shell
      title="Equipo · KPIs"
      sub="Marcá el avance de la semana/mes · las definiciones se crean en Agencia · KPIs"
      right={isAdmin
        ? <Link href="/kpis" className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute transition-colors hover:border-accent/50 hover:text-ink">Gestionar KPIs ↗</Link>
        : <span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">Solo marcar</span>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {TEAM.map((member) => {
          const memberKpis = kpis.map((k, index) => ({ k, index })).filter(({ k }) => k.person === member.name);
          const cumplidos = mounted
            ? memberKpis.filter(({ k, index }) => get(kidOf(k, index), currentPeriodKey(k.cadencia ?? "semanal")) >= k.meta).length
            : 0;
          return (
            <Card key={member.name}>
              <CardHead
                title={member.name}
                sub={member.role}
                right={
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold tabular-nums ${cumplidos === memberKpis.length && memberKpis.length > 0 ? "text-ok" : "text-warn"}`}>
                      {cumplidos}/{memberKpis.length} KPIs
                    </span>
                    <Avatar name={member.name} size={28} />
                  </div>
                }
              />
              <ul className="divide-y divide-line/60">
                {memberKpis.map(({ k, index }) => (
                  <KpiRow key={kidOf(k, index)} k={k} kid={kidOf(k, index)} canMark ready={mounted && ready} get={get} setValor={setValor} />
                ))}
                {memberKpis.length === 0 && (
                  <li className="px-5 py-4 text-xs text-dim">
                    Sin KPIs todavía. {isAdmin && <Link href="/kpis" className="text-accent2 hover:underline">Cargalos en Agencia · KPIs →</Link>}
                  </li>
                )}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHead
          title="Análisis financiero por cliente"
          sub={isAdmin ? "Vista de agencia — montos editables" : "Solo lectura"}
          right={
            <span className="text-xs text-mute">
              Total: <span className="font-semibold text-ink">{fmtVal(totalIngreso, "usd")}</span> · Margen: <span className={`font-semibold ${totalMargen > 0 ? "text-ok" : "text-bad"}`}>{fmtVal(totalMargen, "usd")}</span>
            </span>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-dim">
                <th className="py-2 pl-5 pr-3 text-left font-medium">Cliente</th>
                <th className="px-3 py-2 text-left font-medium">Modelo</th>
                <th className="px-3 py-2 text-right font-medium">Fee mensual</th>
                <th className="px-3 py-2 text-right font-medium">Inversión ads</th>
                <th className="px-3 py-2 text-right font-medium">Facturación cliente</th>
                <th className="px-3 py-2 text-right font-medium">Ingreso agencia</th>
                <th className="py-2 pl-3 pr-5 text-right font-medium">Margen</th>
              </tr>
            </thead>
            <tbody>
              {finanzas.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-6 text-center text-sm text-dim">Sin datos financieros cargados todavía.</td></tr>
              )}
              {finanzas.map((f, index) => {
                const c = clientById(f.clientId);
                return (
                  <tr key={f.clientId} className="border-t border-line/60 hover:bg-soft/30">
                    <td className="py-2.5 pl-5 pr-3 font-medium">
                      <span className="flex items-center gap-2">
                        {c && <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: c.color + "22", color: c.color }}>{c.initials}</span>}
                        {c?.nombre}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-mute">{isAdmin ? <EText value={f.modelo} onSave={(v) => setFin(index, { modelo: v })} className="text-xs" /> : f.modelo}</td>
                    <td className="px-3 py-2.5 text-right text-mute">{isAdmin ? <ENum value={f.feeMensual} fmt="usd" onSave={(v) => setFin(index, { feeMensual: v ?? 0 })} /> : fmtVal(f.feeMensual, "usd")}</td>
                    <td className="px-3 py-2.5 text-right text-mute">{isAdmin ? <ENum value={f.inversionAds} fmt="usd" onSave={(v) => setFin(index, { inversionAds: v ?? 0 })} /> : fmtVal(f.inversionAds, "usd")}</td>
                    <td className="px-3 py-2.5 text-right">{isAdmin ? <ENum value={f.facturacionCliente} fmt="usd" onSave={(v) => setFin(index, { facturacionCliente: v ?? 0 })} /> : fmtVal(f.facturacionCliente, "usd")}</td>
                    <td className="px-3 py-2.5 text-right">{isAdmin ? <ENum value={f.ingresoAgencia} fmt="usd" onSave={(v) => setFin(index, { ingresoAgencia: v ?? 0 })} /> : fmtVal(f.ingresoAgencia, "usd")}</td>
                    <td className={`py-2.5 pl-3 pr-5 text-right font-semibold ${f.margen > 0 ? "text-ok" : "text-bad"}`}>{isAdmin ? <ENum value={f.margen} fmt="usd" onSave={(v) => setFin(index, { margen: v ?? 0 })} /> : fmtVal(f.margen, "usd")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-dim">
        KPI = acción con cadencia (X veces por <span className="text-mute">semana</span> o <span className="text-mute">mes</span>). El conteo se reinicia solo al empezar el período
        y queda el histórico. Las definiciones se crean en <span className="text-mute">Agencia · KPIs</span>; acá se ven{isAdmin ? " y se marcan" : " (solo lectura)"}.
      </p>
    </Shell>
  );
}

// ---------- Fila de KPI: marca del período actual + histórico (definición read-only) ----------

function KpiRow({
  k, kid, canMark, ready, get, setValor,
}: {
  k: KPI;
  kid: string;
  canMark: boolean;
  ready: boolean;
  get: (kpiId: string, periodo: string) => number;
  setValor: (kpiId: string, periodo: string, valor: number) => void;
}) {
  const cad: KpiCadencia = k.cadencia ?? "semanal";
  const periodKey = currentPeriodKey(cad);
  const actual = ready ? get(kid, periodKey) : 0;
  const pct = k.meta ? Math.min(100, Math.round((actual / k.meta) * 100)) : 0;
  const met = actual >= k.meta && k.meta > 0;
  const historial = ready ? periodList(cad, 8) : [];

  return (
    <li className="px-5 py-3">
      <div className="mb-2 flex items-start justify-between gap-3 text-sm">
        <span className="text-sm text-mute">{k.accion}</span>
        <div className="flex shrink-0 items-center gap-1.5">
          {cad === "mensual" && k.semanaMes ? <SemanaMesBadge target={k.semanaMes} ready={ready} /> : null}
          <span className="rounded-full border border-line px-1.5 py-0.5 text-[10px] text-dim">{k.meta}×/{CAD_LABEL[cad]}</span>
        </div>
      </div>

      <KpiTracker actual={actual} meta={k.meta} met={met} editable={canMark && ready} cad={cad} onSetActual={(v) => setValor(kid, periodKey, v)} />
      <Progress pct={pct} h={4} color={met ? "#34d399" : "#8b5cf6"} />

      {historial.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-dim">histórico:</span>
          <div className="flex items-center gap-1">
            {historial.map((p, i) => {
              const v = get(kid, p.key);
              const done = v >= k.meta && k.meta > 0;
              const partial = v > 0 && !done;
              const isCurrent = i === historial.length - 1;
              return (
                <span
                  key={p.key}
                  title={`${p.label}: ${v}/${k.meta}`}
                  className="h-3 w-3 rounded-[3px] border"
                  style={{
                    background: done ? "#34d399" : partial ? "#fbbf2455" : "transparent",
                    borderColor: isCurrent ? "#8b5cf6" : done ? "#34d399" : "#26262e",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-1.5 text-[11px] text-dim">KRI → <span className="text-mute">{k.kri}</span></p>
    </li>
  );
}

function SemanaMesBadge({ target, ready }: { target: number; ready: boolean }) {
  const wom = ready ? weekOfMonth() : 0;
  const toca = wom === target;
  return (
    <span
      title={toca ? "Toca esta semana del mes" : `Programado para la semana ${target} del mes`}
      className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
      style={toca
        ? { borderColor: "#34d399", color: "#34d399", background: "#34d39914" }
        : { borderColor: "#26262e", color: "#5d5d6b" }}
    >
      {toca ? "toca esta semana" : `sem ${target} del mes`}
    </span>
  );
}

function KpiTracker({
  actual, meta, met, editable, cad, onSetActual,
}: {
  actual: number; meta: number; met: boolean; editable: boolean; cad: KpiCadencia; onSetActual: (v: number) => void;
}) {
  const clamp = (v: number) => Math.max(0, Math.min(meta, v));
  const color = met ? "#34d399" : "#8b5cf6";
  const periodoLabel = cad === "semanal" ? "esta semana" : "este mes";

  return (
    <div className="mb-1.5 flex items-center justify-between gap-3">
      {meta <= 10 ? (
        <div className="flex items-center gap-1">
          {Array.from({ length: meta }).map((_, i) => {
            const filled = i < actual;
            const next = actual === i + 1 ? i : i + 1;
            return (
              <button
                key={i}
                disabled={!editable}
                onClick={() => editable && onSetActual(next)}
                title={editable ? `Marcar ${i + 1} de ${meta} (${periodoLabel})` : `${actual} de ${meta}`}
                className={`h-6 min-w-6 rounded-md border text-[10px] font-semibold transition-all ${editable ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
                style={filled ? { background: color, borderColor: color, color: "#0b0b0e" } : { borderColor: "#26262e", color: "#5d5d6b" }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {editable && <button onClick={() => onSetActual(clamp(actual - 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">−</button>}
          <span className="min-w-[52px] text-center text-sm font-semibold tabular-nums" style={{ color: met ? "#34d399" : undefined }}>{actual}<span className="text-dim"> / {meta}</span></span>
          {editable && <button onClick={() => onSetActual(clamp(actual + 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">＋</button>}
        </div>
      )}
      <span className={`text-xs font-medium tabular-nums ${met ? "text-ok" : "text-mute"}`}>{met ? "✓ completo" : `${actual} de ${meta}`}</span>
    </div>
  );
}
