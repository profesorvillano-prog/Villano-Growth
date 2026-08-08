"use client";

// Panel de gestión (Javier): KPI → KRI por miembro + análisis financiero por cliente.
// Agencia (admin) define y marca los KPIs; operación solo los ve. Cada KPI es
// accionable: se marca "realizado X de Y" y se refleja en el panel de cada usuario.

import { useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Avatar } from "@/components/ui";
import { AddBtn, DeleteBtn, ENum, EText } from "@/components/editable";
import { KPI, TEAM, clientById, fmtVal } from "@/lib/data";
import { useData } from "@/lib/db";
import { useAuth } from "@/lib/auth";

export default function EquipoPage() {
  const { kpis, finanzas, update } = useData();
  const { profile } = useAuth();
  const canEdit = profile?.rol === "admin"; // agencia edita · operación solo ve

  const setKpi = (index: number, patch: Partial<KPI>) =>
    update("kpis", kpis.map((k, i) => (i === index ? { ...k, ...patch } : k)));
  const removeKpi = (index: number) => update("kpis", kpis.filter((_, i) => i !== index));
  const addKpi = (kpi: KPI) => update("kpis", [...kpis, kpi]);

  const setFin = (index: number, patch: Partial<(typeof finanzas)[number]>) =>
    update("finanzas", finanzas.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const totalIngreso = finanzas.reduce((s, f) => s + f.ingresoAgencia, 0);
  const totalMargen = finanzas.reduce((s, f) => s + f.margen, 0);

  return (
    <Shell
      title="Equipo · KPIs"
      sub={canEdit ? "Agencia — definí y marcá los KPIs semanales; se reflejan en el panel de cada persona" : "Vista de operación — la agencia define y marca los KPIs"}
      right={
        <span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">
          {canEdit ? <>Editás como <span className="font-medium text-ink">agencia</span></> : <>Solo lectura</>}
        </span>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {TEAM.map((member) => {
          const memberKpis = kpis
            .map((k, index) => ({ k, index }))
            .filter(({ k }) => k.person === member.name);
          const cumplidos = memberKpis.filter(({ k }) => k.actual >= k.meta).length;
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
                  <KpiRow key={index} k={k} canEdit={canEdit} onChange={(patch) => setKpi(index, patch)} onRemove={() => removeKpi(index)} />
                ))}
                {memberKpis.length === 0 && !canEdit && (
                  <li className="px-5 py-4 text-xs text-dim">Sin KPIs cargados todavía.</li>
                )}
                {canEdit && (
                  <li className="px-5 py-3">
                    <AddKpiForm person={member.name} onAdd={addKpi} />
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
          sub={canEdit ? "Vista de agencia — todos los montos son editables" : "Solo lectura"}
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
                    <td className="px-3 py-2.5 text-xs text-mute">{canEdit ? <EText value={f.modelo} onSave={(v) => setFin(index, { modelo: v })} className="text-xs" /> : f.modelo}</td>
                    <td className="px-3 py-2.5 text-right text-mute">{canEdit ? <ENum value={f.feeMensual} fmt="usd" onSave={(v) => setFin(index, { feeMensual: v ?? 0 })} /> : fmtVal(f.feeMensual, "usd")}</td>
                    <td className="px-3 py-2.5 text-right text-mute">{canEdit ? <ENum value={f.inversionAds} fmt="usd" onSave={(v) => setFin(index, { inversionAds: v ?? 0 })} /> : fmtVal(f.inversionAds, "usd")}</td>
                    <td className="px-3 py-2.5 text-right">{canEdit ? <ENum value={f.facturacionCliente} fmt="usd" onSave={(v) => setFin(index, { facturacionCliente: v ?? 0 })} /> : fmtVal(f.facturacionCliente, "usd")}</td>
                    <td className="px-3 py-2.5 text-right">{canEdit ? <ENum value={f.ingresoAgencia} fmt="usd" onSave={(v) => setFin(index, { ingresoAgencia: v ?? 0 })} /> : fmtVal(f.ingresoAgencia, "usd")}</td>
                    <td className={`py-2.5 pl-3 pr-5 text-right font-semibold ${f.margen > 0 ? "text-ok" : "text-bad"}`}>{canEdit ? <ENum value={f.margen} fmt="usd" onSave={(v) => setFin(index, { margen: v ?? 0 })} /> : fmtVal(f.margen, "usd")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-dim">
        KPI = acción semanal literal · KRI = resultado que influye. La <span className="text-mute">agencia</span> (admin) define y marca los KPIs;
        en <span className="text-mute">operación</span> se ven en solo lectura. Los cambios se guardan en Supabase y se reflejan en vivo en cada panel.
      </p>
    </Shell>
  );
}

// ---------- Fila de KPI con control "realizado X de Y" ----------

function KpiRow({ k, canEdit, onChange, onRemove }: { k: KPI; canEdit: boolean; onChange: (patch: Partial<KPI>) => void; onRemove: () => void }) {
  const pct = k.meta ? Math.min(100, Math.round((k.actual / k.meta) * 100)) : 0;
  const met = k.actual >= k.meta && k.meta > 0;
  return (
    <li className="group/row px-5 py-3">
      <div className="mb-2 flex items-start justify-between gap-3 text-sm">
        {canEdit ? (
          <EText value={k.accion} onSave={(v) => onChange({ accion: v })} className="text-sm text-mute" />
        ) : (
          <span className="text-sm text-mute">{k.accion}</span>
        )}
        {canEdit && <DeleteBtn onClick={onRemove} />}
      </div>
      <KpiTracker
        actual={k.actual}
        meta={k.meta}
        met={met}
        editable={canEdit}
        onSetActual={(v) => onChange({ actual: v })}
        onSetMeta={(v) => onChange({ meta: Math.max(1, v) })}
      />
      <Progress pct={pct} h={4} color={met ? "#34d399" : "#8b5cf6"} />
      <p className="mt-1.5 text-[11px] text-dim">
        KRI → {canEdit ? <EText value={k.kri} onSave={(v) => onChange({ kri: v })} className="text-[11px] text-mute" /> : <span className="text-mute">{k.kri}</span>}
      </p>
    </li>
  );
}

// Control accionable: segmentos clicables si la meta es chica, +/− si es grande.
function KpiTracker({
  actual, meta, met, editable, onSetActual, onSetMeta,
}: {
  actual: number; meta: number; met: boolean; editable: boolean;
  onSetActual: (v: number) => void; onSetMeta: (v: number) => void;
}) {
  const clamp = (v: number) => Math.max(0, Math.min(meta, v));
  const color = met ? "#34d399" : "#8b5cf6";

  return (
    <div className="mb-1.5 flex items-center justify-between gap-3">
      {meta <= 10 ? (
        <div className="flex items-center gap-1">
          {Array.from({ length: meta }).map((_, i) => {
            const filled = i < actual;
            const next = actual === i + 1 ? i : i + 1; // clic en el actual → desmarca
            return (
              <button
                key={i}
                disabled={!editable}
                onClick={() => editable && onSetActual(next)}
                title={editable ? `Marcar ${i + 1} de ${meta}` : `${actual} de ${meta}`}
                className={`h-6 min-w-6 rounded-md border text-[10px] font-semibold transition-all ${editable ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
                style={filled
                  ? { background: color, borderColor: color, color: "#0b0b0e" }
                  : { borderColor: "#26262e", color: "#5d5d6b" }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {editable && (
            <button onClick={() => onSetActual(clamp(actual - 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">−</button>
          )}
          <span className="min-w-[52px] text-center text-sm font-semibold tabular-nums" style={{ color: met ? "#34d399" : undefined }}>{actual}<span className="text-dim"> / {meta}</span></span>
          {editable && (
            <button onClick={() => onSetActual(clamp(actual + 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">＋</button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium tabular-nums ${met ? "text-ok" : "text-mute"}`}>
          {met ? "✓ completo" : `${actual} de ${meta}`}
        </span>
        {editable && meta <= 10 && (
          <span className="flex items-center gap-0.5 text-[10px] text-dim">
            <button onClick={() => onSetMeta(meta - 1)} className="rounded px-1 hover:text-ink">−</button>
            meta
            <button onClick={() => onSetMeta(meta + 1)} className="rounded px-1 hover:text-ink">＋</button>
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- Alta de KPI (agencia) ----------

function AddKpiForm({ person, onAdd }: { person: KPI["person"]; onAdd: (k: KPI) => void }) {
  const [open, setOpen] = useState(false);
  const [accion, setAccion] = useState("");
  const [meta, setMeta] = useState(3);
  const [kri, setKri] = useState("");

  const save = () => {
    if (!accion.trim()) return;
    onAdd({ person, accion: accion.trim(), meta: Math.max(1, meta), actual: 0, kri: kri.trim() || "KRI que influye" });
    setAccion(""); setKri(""); setMeta(3); setOpen(false);
  };

  if (!open) return <AddBtn onClick={() => setOpen(true)}>KPI semanal</AddBtn>;

  return (
    <div className="rounded-xl border border-line bg-panel/50 p-3">
      <input
        autoFocus
        value={accion}
        onChange={(e) => setAccion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="Acción semanal (ej. Revisar campañas 3x)"
        className="mb-2 w-full rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/60"
      />
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-mute">Objetivo por semana:</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setMeta(Math.max(1, meta - 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">−</button>
          <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{meta}</span>
          <button onClick={() => setMeta(meta + 1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">＋</button>
        </div>
        <span className="text-[11px] text-dim">veces</span>
      </div>
      <input
        value={kri}
        onChange={(e) => setKri(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="KRI que influye (ej. CPL · retención)"
        className="mb-3 w-full rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/60"
      />
      <div className="flex items-center gap-2">
        <button onClick={save} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white">Agregar KPI</button>
        <button onClick={() => setOpen(false)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-mute hover:text-ink">Cancelar</button>
      </div>
    </div>
  );
}
