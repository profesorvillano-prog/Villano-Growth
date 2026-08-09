"use client";

// Agencia · Gestión de KPIs del equipo.
// Se elige la persona con los chips de arriba y se editan SOLO sus KPIs (acción,
// cadencia semanal/mensual + semana del mes, objetivo y KRI). Así la pantalla no
// se satura con las 4 casillas ni se extiende de más al agregar.

import { useState } from "react";
import { Shell } from "@/components/shell";
import { Card, CardHead, Avatar } from "@/components/ui";
import { AddBtn, DeleteBtn, EText } from "@/components/editable";
import { KPI, KpiCadencia, Person, TEAM } from "@/lib/data";
import { useData } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { AdminOnly } from "@/components/admin-only";
import { SEMANA_MES_OPTS } from "@/lib/kpi";
import { PersonTabs } from "@/components/person-tabs";

export default function KpisPage() {
  const { kpis, update } = useData();
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";
  const [who, setWho] = useState<Person>(TEAM[0].name);

  const setKpi = (index: number, patch: Partial<KPI>) =>
    update("kpis", kpis.map((k, i) => (i === index ? { ...k, ...patch } : k)));
  const removeKpi = (index: number) => update("kpis", kpis.filter((_, i) => i !== index));
  const addKpi = (kpi: KPI) => update("kpis", [...kpis, kpi]);

  const member = TEAM.find((m) => m.name === who) ?? TEAM[0];
  const memberKpis = kpis.map((k, index) => ({ k, index })).filter(({ k }) => k.person === who);

  return (
    <Shell title="KPIs del equipo · Gestión" sub="Elegí la persona y definí sus KPIs; se ven y se marcan en Equipo · KPIs">
      <AdminOnly isAdmin={isAdmin} area="los KPIs del equipo">
        <PersonTabs who={who} onChange={setWho} count={(name) => kpis.filter((k) => k.person === name).length} />

        <Card className="mt-4">
          <CardHead
            title={member.name}
            sub={member.role}
            right={<div className="flex items-center gap-2"><span className="text-xs text-dim">{memberKpis.length} KPIs</span><Avatar name={member.name} size={28} /></div>}
          />
          <ul className="divide-y divide-line/60">
            {memberKpis.map(({ k, index }) => (
              <li key={k.id ?? index} className="group/row px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <EText value={k.accion} onSave={(v) => setKpi(index, { accion: v })} className="text-sm text-ink" />
                  <DeleteBtn onClick={() => removeKpi(index)} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <CadToggle value={k.cadencia ?? "semanal"} onChange={(c) => setKpi(index, { cadencia: c })} />
                  <MetaStepper value={k.meta} onChange={(v) => setKpi(index, { meta: Math.max(1, v) })} />
                  {(k.cadencia ?? "semanal") === "mensual" && (
                    <SemanaMesSelect value={k.semanaMes ?? 0} onChange={(v) => setKpi(index, { semanaMes: v })} />
                  )}
                </div>
                <p className="mt-2 text-[11px] text-dim">
                  KRI → <EText value={k.kri} onSave={(v) => setKpi(index, { kri: v })} className="text-[11px] text-mute" />
                </p>
              </li>
            ))}
            {memberKpis.length === 0 && <li className="px-5 py-6 text-sm text-dim">{member.name} todavía no tiene KPIs. Agregá el primero abajo.</li>}
            <li className="px-5 py-3.5"><AddKpiForm person={who} onAdd={addKpi} /></li>
          </ul>
        </Card>

        <p className="mt-4 text-xs text-dim">
          Cadencia: <span className="text-mute">X veces por semana</span> o <span className="text-mute">por mes</span> (con la semana del mes en que aparece).
          El progreso se marca y se ve en <span className="text-mute">Operación · Equipo · KPIs</span>.
        </p>
      </AdminOnly>
    </Shell>
  );
}

function CadToggle({ value, onChange }: { value: KpiCadencia; onChange: (c: KpiCadencia) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-line bg-panel p-1">
      {(["semanal", "mensual"] as KpiCadencia[]).map((c) => (
        <button key={c} onClick={() => onChange(c)} className={`rounded-md px-2.5 py-1 text-xs transition-colors ${value === c ? "bg-accent text-white" : "text-mute hover:text-ink"}`}>
          {c === "semanal" ? "Por semana" : "Por mes"}
        </button>
      ))}
    </div>
  );
}

function SemanaMesSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-mute">
      <span>Aparece en:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cursor-pointer rounded-lg border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-accent/60"
      >
        {SEMANA_MES_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function MetaStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-mute">Veces:</span>
      <button onClick={() => onChange(value - 1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">−</button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button onClick={() => onChange(value + 1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-mute hover:text-ink">＋</button>
    </div>
  );
}

function AddKpiForm({ person, onAdd }: { person: KPI["person"]; onAdd: (k: KPI) => void }) {
  const [open, setOpen] = useState(false);
  const [accion, setAccion] = useState("");
  const [cadencia, setCadencia] = useState<KpiCadencia>("semanal");
  const [meta, setMeta] = useState(3);
  const [kri, setKri] = useState("");
  const [semanaMes, setSemanaMes] = useState(0);

  const save = () => {
    if (!accion.trim()) return;
    onAdd({
      id: `k-${Math.random().toString(36).slice(2, 9)}`,
      person, accion: accion.trim(), cadencia, meta: Math.max(1, meta),
      kri: kri.trim() || "KRI que influye",
      ...(cadencia === "mensual" && semanaMes ? { semanaMes } : {}),
    });
    setAccion(""); setKri(""); setMeta(3); setCadencia("semanal"); setSemanaMes(0); setOpen(false);
  };

  if (!open) return <AddBtn onClick={() => setOpen(true)}>KPI</AddBtn>;

  return (
    <div className="rounded-xl border border-line bg-panel/50 p-3">
      <input autoFocus value={accion} onChange={(e) => setAccion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="Acción (ej. Revisar campañas)" className="mb-2 w-full rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/60" />
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <CadToggle value={cadencia} onChange={setCadencia} />
        <MetaStepper value={meta} onChange={(v) => setMeta(Math.max(1, v))} />
        {cadencia === "mensual" && <SemanaMesSelect value={semanaMes} onChange={setSemanaMes} />}
      </div>
      <input value={kri} onChange={(e) => setKri(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="KRI que influye (ej. CPL · retención)" className="mb-3 w-full rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/60" />
      <div className="flex items-center gap-2">
        <button onClick={save} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white">Agregar KPI</button>
        <button onClick={() => setOpen(false)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-mute hover:text-ink">Cancelar</button>
      </div>
    </div>
  );
}
