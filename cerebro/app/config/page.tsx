"use client";

import { useRef } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Avatar, ClientMark } from "@/components/ui";
import { CLIENTS, TEAM } from "@/lib/data";
import { useData } from "@/lib/db";

export default function ConfigPage() {
  const db = useData();
  const fileRef = useRef<HTMLInputElement>(null);

  const descargarBackup = () => {
    const { actions, goals, kpis, finanzas, strategies, plans, objetivos } = db;
    const payload = { _app: "villano-os", _ts: new Date().toISOString(), actions, goals, kpis, finanzas, strategies, plans, objetivos };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `villano-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restaurarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (confirm("¿Restaurar este backup? Reemplaza el estado actual del panel (acciones, metas, KPIs, estrategias, planes y objetivos).")) {
          db.restore(data);
          alert("Backup restaurado ✓");
        }
      } catch {
        alert("Archivo inválido: no es un backup JSON del panel.");
      }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  };
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
                <ClientMark initials={c.initials} color={c.color} size={32} />
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
            <li className="flex gap-2"><span className="text-accent2">·</span>Proceso de contenido fijo (SOP, 8 pasos): Investigación (dummy account) → Planificación → Guión → Revisión → Grabación → Edición → Programación → Análisis.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>El cliente solo ve 4 estados en su Notion: Planificado → Revisado → Grabado → Publicado. El resto es SOP interno de Francisco.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>Cada miembro tiene KPIs semanales literales que influyen sus KRIs. Si un KRI se desvía, se revisan los KPIs primero.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>Análisis rápido semanal por área (orgánico y Meta Ads) · análisis en equipo y entrega al cliente cada 14 días.</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>WhatsApp de clientes: siempre queda un mensaje o respuesta nuestra al final (Rodrigo, 1ª línea).</li>
            <li className="flex gap-2"><span className="text-accent2">·</span>Publicación con ≥1 semana de antelación; métricas por pieza en la base de Notion del cliente.</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHead title="Backup y seguridad" sub="Descargá una copia del estado del panel; si algo se borra, la volvés a subir." />
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <button onClick={descargarBackup} className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
            ⬇ Descargar backup JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-line px-3.5 py-2 text-sm text-mute transition-colors hover:border-accent/50 hover:text-ink">
            ⬆ Restaurar desde JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={restaurarBackup} className="hidden" />
          <button
            onClick={() => { if (confirm("¿Restablecer todos los datos al inicial? (bajá un backup antes por las dudas)")) db.reset(); }}
            className="ml-auto rounded-lg border border-line px-3 py-2 text-xs text-dim transition-colors hover:border-bad/50 hover:text-bad"
          >
            Restablecer
          </button>
        </div>
        <p className="border-t border-line px-5 py-3 text-[11px] text-dim">
          El backup guarda el estado compartido del panel (acciones, metas, KPIs, estrategias, planes, objetivos y finanzas).
          Las métricas en vivo (Meta/IG/GHL/Ventas) las alimenta Make y viven aparte. Recomendado: bajar un backup 1 vez por semana.
        </p>
      </Card>
    </Shell>
  );
}
