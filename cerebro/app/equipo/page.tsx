"use client";

// Panel de gestión (Javier): KPI → KRI por miembro + análisis financiero por cliente.

import { Shell } from "@/components/shell";
import { Card, CardHead, Progress, Avatar } from "@/components/ui";
import { FINANZAS, KPIS, TEAM, clientById, fmtVal } from "@/lib/data";

export default function EquipoPage() {
  const totalIngreso = FINANZAS.reduce((s, f) => s + f.ingresoAgencia, 0);
  const totalMargen = FINANZAS.reduce((s, f) => s + f.margen, 0);

  return (
    <Shell
      title="Equipo · KPIs"
      sub="Panel de gestión — acciones semanales (KPI) y los resultados que influyen (KRI)"
      right={
        <span className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-mute">
          Gestiona: <span className="font-medium text-ink">Javier</span>
        </span>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {TEAM.map((member) => {
          const kpis = KPIS.filter((k) => k.person === member.name);
          const cumplidos = kpis.filter((k) => k.actual >= k.meta).length;
          return (
            <Card key={member.name}>
              <CardHead
                title={member.name}
                sub={member.role}
                right={
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold tabular-nums ${cumplidos === kpis.length ? "text-ok" : "text-warn"}`}>
                      {cumplidos}/{kpis.length} KPIs
                    </span>
                    <Avatar name={member.name} size={28} />
                  </div>
                }
              />
              <ul className="divide-y divide-line/60">
                {kpis.map((k, i) => {
                  const pct = Math.min(100, Math.round((k.actual / k.meta) * 100));
                  const met = k.actual >= k.meta;
                  return (
                    <li key={i} className="px-5 py-3">
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="text-mute">{k.accion}</span>
                        <span className={`shrink-0 text-xs font-medium tabular-nums ${met ? "text-ok" : "text-ink"}`}>
                          {k.actual}/{k.meta}
                        </span>
                      </div>
                      <Progress pct={pct} h={4} color={met ? "#34d399" : "#8b5cf6"} />
                      <p className="mt-1.5 text-[11px] text-dim">
                        KRI → <span className="text-mute">{k.kri}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHead
          title="Análisis financiero por cliente"
          sub="Vista de Javier — modelo, ingreso de agencia y margen del ciclo"
          right={
            <span className="text-xs text-mute">
              Total: <span className="font-semibold text-ink">{fmtVal(totalIngreso, "usd")}</span> · Margen: <span className={`font-semibold ${totalMargen > 0 ? "text-ok" : "text-bad"}`}>{fmtVal(totalMargen, "usd")}</span>
            </span>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
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
              {FINANZAS.map((f) => {
                const c = clientById(f.clientId);
                return (
                  <tr key={f.clientId} className="border-t border-line/60 hover:bg-soft/30">
                    <td className="py-2.5 pl-5 pr-3 font-medium">{c?.emoji} {c?.nombre}</td>
                    <td className="px-3 py-2.5 text-xs text-mute">{f.modelo}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{f.feeMensual ? fmtVal(f.feeMensual, "usd") : "—"}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-mute">{fmtVal(f.inversionAds, "usd")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtVal(f.facturacionCliente, "usd")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtVal(f.ingresoAgencia, "usd")}</td>
                    <td className={`py-2.5 pl-3 pr-5 text-right font-semibold tabular-nums ${f.margen > 0 ? "text-ok" : "text-bad"}`}>{fmtVal(f.margen, "usd")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-dim">
        KPI = acción semanal literal de cada miembro · KRI = resultado del negocio que esa acción influye.
        Si un KRI se desvía, la conversación empieza por sus KPIs — no por opiniones.
      </p>
    </Shell>
  );
}
