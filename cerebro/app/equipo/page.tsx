"use client";

// Panel de gestión (Javier): KPI → KRI por miembro + análisis financiero por cliente.
// Todo editable en línea: clic sobre un valor para cambiarlo.

import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Avatar } from "@/components/ui";
import { AddBtn, DeleteBtn, ENum, EText } from "@/components/editable";
import { KPI, TEAM, clientById, fmtVal } from "@/lib/data";
import { useData } from "@/lib/db";

export default function EquipoPage() {
  const { kpis, finanzas, update } = useData();

  const setKpi = (index: number, patch: Partial<KPI>) =>
    update("kpis", kpis.map((k, i) => (i === index ? { ...k, ...patch } : k)));
  const removeKpi = (index: number) => update("kpis", kpis.filter((_, i) => i !== index));
  const addKpi = (person: KPI["person"]) =>
    update("kpis", [...kpis, { person, accion: "Nueva acción semanal", meta: 1, actual: 0, kri: "KRI que influye" }]);

  const setFin = (index: number, patch: Partial<(typeof finanzas)[number]>) =>
    update("finanzas", finanzas.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const totalIngreso = finanzas.reduce((s, f) => s + f.ingresoAgencia, 0);
  const totalMargen = finanzas.reduce((s, f) => s + f.margen, 0);

  return (
    <Shell
      title="Equipo · KPIs"
      sub="Panel de gestión — clic sobre cualquier acción, número o KRI para editarlo"
      right={
        <span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">
          Gestiona: <span className="font-medium text-ink">Javier</span>
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
                {memberKpis.map(({ k, index }) => {
                  const pct = k.meta ? Math.min(100, Math.round((k.actual / k.meta) * 100)) : 0;
                  const met = k.actual >= k.meta;
                  return (
                    <li key={index} className="group/row px-5 py-3">
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <EText value={k.accion} onSave={(v) => setKpi(index, { accion: v })} className="text-sm text-mute" />
                        <span className={`flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums ${met ? "text-ok" : "text-ink"}`}>
                          <ENum value={k.actual} onSave={(v) => setKpi(index, { actual: v ?? 0 })} />
                          /
                          <ENum value={k.meta} onSave={(v) => setKpi(index, { meta: v ?? 1 })} />
                          <DeleteBtn onClick={() => removeKpi(index)} />
                        </span>
                      </div>
                      <Progress pct={pct} h={4} color={met ? "#34d399" : "#8b5cf6"} />
                      <p className="mt-1.5 text-[11px] text-dim">
                        KRI → <EText value={k.kri} onSave={(v) => setKpi(index, { kri: v })} className="text-[11px] text-mute" />
                      </p>
                    </li>
                  );
                })}
                <li className="px-5 py-3">
                  <AddBtn onClick={() => addKpi(member.name)}>KPI semanal</AddBtn>
                </li>
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHead
          title="Análisis financiero por cliente"
          sub="Vista de Javier — todos los montos son editables"
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
              {finanzas.map((f, index) => {
                const c = clientById(f.clientId);
                return (
                  <tr key={f.clientId} className="border-t border-line/60 hover:bg-soft/30">
                    <td className="py-2.5 pl-5 pr-3 font-medium">{c?.emoji} {c?.nombre}</td>
                    <td className="px-3 py-2.5 text-xs text-mute">
                      <EText value={f.modelo} onSave={(v) => setFin(index, { modelo: v })} className="text-xs" />
                    </td>
                    <td className="px-3 py-2.5 text-right text-mute">
                      <ENum value={f.feeMensual} fmt="usd" onSave={(v) => setFin(index, { feeMensual: v ?? 0 })} />
                    </td>
                    <td className="px-3 py-2.5 text-right text-mute">
                      <ENum value={f.inversionAds} fmt="usd" onSave={(v) => setFin(index, { inversionAds: v ?? 0 })} />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <ENum value={f.facturacionCliente} fmt="usd" onSave={(v) => setFin(index, { facturacionCliente: v ?? 0 })} />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <ENum value={f.ingresoAgencia} fmt="usd" onSave={(v) => setFin(index, { ingresoAgencia: v ?? 0 })} />
                    </td>
                    <td className={`py-2.5 pl-3 pr-5 text-right font-semibold ${f.margen > 0 ? "text-ok" : "text-bad"}`}>
                      <ENum value={f.margen} fmt="usd" onSave={(v) => setFin(index, { margen: v ?? 0 })} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-dim">
        KPI = acción semanal literal · KRI = resultado que influye. Los cambios se guardan en este navegador (demo);
        con Supabase (fase 2) la edición queda compartida y restringida por rol al panel de gestión.
      </p>
    </Shell>
  );
}
