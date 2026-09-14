"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/components/plan-context";
import { Stepper } from "@/components/ui";
import { fmtKcal, fmtPortions, targetMacros } from "@/lib/nutrition";
import type { GroupKey, Targets } from "@/lib/types";

export function PautaView() {
  const { plan, targets, meals, groups, groupsByKey, supplements } = usePlan();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [local, setLocal] = useState<Targets>(targets);
  const [saved, setSaved] = useState(false);

  const macros = targetMacros(local, groups);

  async function setTarget(key: GroupKey, portions: number) {
    setLocal((prev) => ({ ...prev, [key]: portions }));
    await supabase
      .from("minuta_plan_targets")
      .upsert({ plan_id: plan.id, group_key: key, portions });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    router.refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 px-5 pb-3 pt-4 backdrop-blur">
        <h1 className="text-lg font-semibold tracking-tight">{plan.nombre}</h1>
        <p className="text-xs text-muted">{plan.objetivo}</p>
      </header>

      <div className="space-y-4 px-5 py-4">
        <section className="card px-4 py-3">
          <div className="tnum grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[10px] text-muted">kcal</p>
              <p className="text-base font-semibold">{fmtKcal(macros.kcal)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted">proteína</p>
              <p className="text-base font-semibold">{Math.round(macros.protein)} g</p>
            </div>
            <div>
              <p className="text-[10px] text-muted">carbos</p>
              <p className="text-base font-semibold">{Math.round(macros.carbs)} g</p>
            </div>
            <div>
              <p className="text-[10px] text-muted">grasas</p>
              <p className="text-base font-semibold">{Math.round(macros.fat)} g</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Según la minuta: {fmtKcal(Number(plan.kcal ?? 0))} kcal · {plan.protein_g} P ·{" "}
            {plan.carbs_g} C · {plan.fat_g} G
            {plan.proximo_control ? ` · Próximo control: ${plan.proximo_control}` : ""}
          </p>
        </section>

        <section className="card px-4 py-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">Porciones diarias</h2>
            {saved && <span className="text-[11px] text-gold">Guardado ✓</span>}
          </div>
          <ul className="mt-2 divide-y divide-line">
            {groups.map((g) => (
              <li key={g.key} className="flex items-center gap-3 py-2">
                <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: g.color }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{g.label}</span>
                  <span className="block truncate text-[11px] text-muted">{g.portion_hint}</span>
                </span>
                <Stepper
                  value={local[g.key] ?? 0}
                  min={0}
                  step={1}
                  onChange={(v) => setTarget(g.key, v)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="card px-4 py-3">
          <h2 className="text-sm font-semibold">Tiempos de comida</h2>
          <ul className="mt-2 space-y-3">
            {meals.map((m) => (
              <li key={m.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-medium">{m.label}</h3>
                  <span className="text-[11px] text-muted">{m.horario}</span>
                </div>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {(Object.entries(m.targets) as [GroupKey, { min: number; max: number }][]).map(
                    ([key, t]) => (
                      <li key={key} className="tnum flex items-center gap-1.5 text-[11px]">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: groupsByKey[key]?.color }}
                        />
                        {t.min === t.max ? fmtPortions(t.min) : `${fmtPortions(t.min)}-${fmtPortions(t.max)}`}{" "}
                        {groupsByKey[key]?.short_label.toLowerCase()}
                      </li>
                    ),
                  )}
                </ul>
                {m.ejemplo && (
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{m.ejemplo}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {supplements.length > 0 && (
          <section className="card px-4 py-3">
            <h2 className="text-sm font-semibold">Suplementación</h2>
            <ul className="mt-2 space-y-2.5">
              {supplements.map((s) => (
                <li key={s.id}>
                  <p className="text-sm">{s.nombre}</p>
                  <p className="text-[11px] text-muted">
                    {[s.dosis, s.cuando].filter(Boolean).join(" · ")}
                  </p>
                  {s.nota && <p className="text-[11px] text-muted">{s.nota}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="card px-4 py-3">
          <h2 className="text-sm font-semibold">Hidratación</h2>
          <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
            <li>
              <span className="text-ink">Día:</span> 2 a 2,5 litros.
            </li>
            <li>
              <span className="text-ink">Pre ejercicio:</span> 500-600 ml 2-3 h antes; 200-300 ml
              10-20 min antes.
            </li>
            <li>
              <span className="text-ink">Durante:</span> 80-100% de lo que sudas (si sudas 15
              ml/min, 200-225 cc cada 15 min).
            </li>
            <li>
              <span className="text-ink">Post:</span> 125-150% del peso perdido en la sesión (900 g
              perdidos = 1,1 a 1,35 L en las primeras 3-5 h).
            </li>
            <li>Revisa el color de la orina para evaluar tu hidratación.</li>
          </ul>
        </section>

        {plan.notas?.length > 0 && (
          <section className="card px-4 py-3">
            <h2 className="text-sm font-semibold">Recomendaciones</h2>
            <ul className="mt-2 space-y-2">
              {plan.notas.map((n, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-muted">
                  <span className="text-gold">·</span>
                  {n}
                </li>
              ))}
            </ul>
          </section>
        )}

        <button
          onClick={signOut}
          className="w-full rounded-xl border border-line py-3 text-sm text-muted active:bg-surface-2"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="h-6" />
    </>
  );
}
