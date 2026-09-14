"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/components/plan-context";
import { AddSheet, type AddResult } from "@/components/add-sheet";
import { Bar, Stepper, Toast } from "@/components/ui";
import { fmtKcal, fmtPortions, macrosOf, portionsByGroup } from "@/lib/nutrition";
import { addDays, longLabel, relativeLabel, todayISO } from "@/lib/dates";
import type { Entry, Food, GroupKey, Meal } from "@/lib/types";

type DayData = { entries: Entry[]; water: number; supps: string[] };

export function TodayView({
  date: initialDate,
  entries: initialEntries,
  water: initialWater,
  supps: initialSupps,
}: {
  date: string;
  entries: Entry[];
  water: number;
  supps: string[];
}) {
  const { plan, targets, meals, groups, groupsByKey, supplements, userId } = usePlan();
  const supabase = useMemo(() => createClient(), []);

  const [date, setDate] = useState(initialDate);
  const [cache, setCache] = useState<Record<string, DayData>>({
    [initialDate]: { entries: initialEntries, water: initialWater, supps: initialSupps },
  });
  const [loading, setLoading] = useState(false);
  const [addMeal, setAddMeal] = useState<Meal | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const day = cache[date];

  const showToast = useCallback((text: string, undo?: () => void) => {
    setToast({ text, undo });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Carga perezosa del día que falte en caché.
  useEffect(() => {
    if (cache[date]) return;
    let alive = true;
    setLoading(true);
    (async () => {
      const [entries, water, supps] = await Promise.all([
        supabase
          .from("minuta_entries")
          .select("id,fecha,meal_key,food_id,nombre,group_key,portions,batch_id")
          .eq("fecha", date)
          .order("created_at"),
        supabase.from("minuta_water").select("ml").eq("fecha", date).maybeSingle(),
        supabase.from("minuta_supplement_log").select("supplement_id").eq("fecha", date),
      ]);
      if (!alive) return;
      setCache((prev) => ({
        ...prev,
        [date]: {
          entries: (entries.data ?? []) as Entry[],
          water: water.data?.ml ?? 0,
          supps: (supps.data ?? []).map((r) => r.supplement_id as string),
        },
      }));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [date, cache, supabase]);

  // La URL sigue al día visible, sin recargar.
  useEffect(() => {
    const url = date === todayISO() ? "/" : `/?d=${date}`;
    window.history.replaceState(null, "", url);
  }, [date]);

  const entries = day?.entries ?? [];
  const consumed = portionsByGroup(entries);
  const macros = macrosOf(entries, groups);
  const remaining = useMemo(() => {
    const out: Partial<Record<GroupKey, number>> = {};
    for (const g of groups) {
      out[g.key] = Math.round(((targets[g.key] ?? 0) - (consumed[g.key] ?? 0)) * 100) / 100;
    }
    return out;
  }, [groups, targets, consumed]);

  const mutate = (fn: (d: DayData) => DayData) =>
    setCache((prev) => ({ ...prev, [date]: fn(prev[date] ?? { entries: [], water: 0, supps: [] }) }));

  async function addItem(
    meal: Meal,
    { food, nombre, groupKey, portions }: { food: Food | null; nombre: string; groupKey: GroupKey; portions: number },
  ): Promise<AddResult> {
    const batchId = crypto.randomUUID();
    const rows: Omit<Entry, "id">[] = [
      { fecha: date, meal_key: meal.meal_key, food_id: food?.id ?? null, nombre, group_key: groupKey, portions, batch_id: batchId },
    ];
    if (food?.extra_group && Number(food.extra_portions ?? 0) > 0) {
      rows.push({
        fecha: date,
        meal_key: meal.meal_key,
        food_id: food.id,
        nombre,
        group_key: food.extra_group,
        portions: portions * Number(food.extra_portions),
        batch_id: batchId,
      });
    }

    const optimistic = rows.map((r, i) => ({ ...r, id: `tmp-${batchId}-${i}` })) as Entry[];
    mutate((d) => ({ ...d, entries: [...d.entries, ...optimistic] }));

    const { data, error } = await supabase
      .from("minuta_entries")
      .insert(rows.map((r) => ({ ...r, user_id: userId })))
      .select("id,fecha,meal_key,food_id,nombre,group_key,portions,batch_id");

    if (error) {
      mutate((d) => ({ ...d, entries: d.entries.filter((e) => !e.id.startsWith(`tmp-${batchId}`)) }));
      showToast("No se pudo guardar");
      return null;
    }

    mutate((d) => ({
      ...d,
      entries: [
        ...d.entries.filter((e) => !e.id.startsWith(`tmp-${batchId}`)),
        ...((data ?? []) as Entry[]),
      ],
    }));
    return { batchId };
  }

  async function setPortions(batchId: string, portions: number) {
    mutate((d) => ({
      ...d,
      entries: d.entries.map((e) => (e.batch_id === batchId ? { ...e, portions } : e)),
    }));
    await supabase.from("minuta_entries").update({ portions }).eq("batch_id", batchId);
  }

  async function removeBatch(batchId: string) {
    const removed = entries.filter((e) => e.batch_id === batchId);
    mutate((d) => ({ ...d, entries: d.entries.filter((e) => e.batch_id !== batchId) }));
    await supabase.from("minuta_entries").delete().eq("batch_id", batchId);
    showToast(`${removed[0]?.nombre ?? "Registro"} eliminado`, async () => {
      const { data } = await supabase
        .from("minuta_entries")
        .insert(removed.map(({ id, ...r }) => ({ ...r, user_id: userId, batch_id: batchId })))
        .select("id,fecha,meal_key,food_id,nombre,group_key,portions,batch_id");
      mutate((d) => ({ ...d, entries: [...d.entries, ...((data ?? []) as Entry[])] }));
      setToast(null);
    });
  }

  async function setWater(ml: number) {
    const next = Math.max(0, ml);
    mutate((d) => ({ ...d, water: next }));
    await supabase.from("minuta_water").upsert({ user_id: userId, fecha: date, ml: next });
  }

  async function toggleSupp(id: string) {
    const on = day?.supps.includes(id);
    mutate((d) => ({
      ...d,
      supps: on ? d.supps.filter((s) => s !== id) : [...d.supps, id],
    }));
    if (on) {
      await supabase
        .from("minuta_supplement_log")
        .delete()
        .eq("supplement_id", id)
        .eq("fecha", date);
    } else {
      await supabase
        .from("minuta_supplement_log")
        .upsert({ user_id: userId, supplement_id: id, fecha: date });
    }
  }

  const rel = relativeLabel(date);
  const kcalTarget = Number(plan.kcal ?? 0);
  const allMet = groups.every(
    (g) => (targets[g.key] ?? 0) === 0 || (consumed[g.key] ?? 0) >= (targets[g.key] ?? 0),
  );

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 px-5 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDate(addDays(date, -1))}
            aria-label="Día anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2"
          >
            ‹
          </button>
          <button onClick={() => setDate(todayISO())} className="text-center">
            <p className="text-sm font-semibold capitalize">{rel ?? longLabel(date)}</p>
            <p className="text-xs capitalize text-muted">{rel ? longLabel(date) : ""}</p>
          </button>
          <button
            onClick={() => setDate(addDays(date, 1))}
            aria-label="Día siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2"
          >
            ›
          </button>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <p className="tnum text-2xl font-semibold tracking-tight">
            {fmtKcal(macros.kcal)}
            <span className="text-sm font-normal text-muted"> / {fmtKcal(kcalTarget)} kcal</span>
          </p>
          {allMet && <span className="pb-1 text-xs font-medium text-gold">Día completo ✓</span>}
        </div>
        <p className="tnum mt-0.5 text-xs text-muted">
          {Math.round(macros.protein)} P · {Math.round(macros.carbs)} C · {Math.round(macros.fat)} G
          {plan.protein_g
            ? ` · meta ${plan.protein_g} / ${plan.carbs_g} / ${plan.fat_g}`
            : ""}
        </p>
      </header>

      <section className="grid grid-cols-4 gap-2 px-5 py-4">
        {groups.map((g) => {
          const target = targets[g.key] ?? 0;
          const done = consumed[g.key] ?? 0;
          return (
            <div key={g.key} className="card px-2.5 py-2">
              <p className="truncate text-[10px] font-medium text-muted">{g.short_label}</p>
              <p className="tnum text-sm font-semibold">
                {fmtPortions(done)}
                <span className="text-[11px] font-normal text-muted">/{fmtPortions(target)}</span>
              </p>
              <Bar value={done} target={target} color={g.color} className="mt-1.5" />
            </div>
          );
        })}
      </section>

      <div className={`space-y-3 px-5 ${loading && !day ? "opacity-40" : ""}`}>
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            entries={entries.filter((e) => e.meal_key === meal.meal_key)}
            onAdd={() => setAddMeal(meal)}
            onSetPortions={setPortions}
            onRemove={removeBatch}
          />
        ))}

        <WaterCard ml={day?.water ?? 0} onChange={setWater} />

        {supplements.length > 0 && (
          <section className="card px-4 py-3">
            <h2 className="text-sm font-semibold">Suplementos</h2>
            <ul className="mt-2 space-y-1.5">
              {supplements.map((s) => {
                const on = day?.supps.includes(s.id) ?? false;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => toggleSupp(s.id)}
                      className="flex w-full items-center gap-3 py-1 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] ${
                          on ? "border-gold bg-gold text-black" : "border-line text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{s.nombre}</span>
                        <span className="block truncate text-xs text-muted">
                          {[s.dosis, s.cuando].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <div className="h-6" />

      {addMeal && (
        <AddSheet
          open
          onClose={() => setAddMeal(null)}
          mealLabel={addMeal.label}
          suggestedGroups={Object.keys(addMeal.targets) as GroupKey[]}
          remaining={remaining}
          onAdd={(args) => addItem(addMeal, args)}
          onSetPortions={setPortions}
        />
      )}

      {toast && <Toast text={toast.text} onUndo={toast.undo} />}
    </>
  );
}

function MealCard({
  meal,
  entries,
  onAdd,
  onSetPortions,
  onRemove,
}: {
  meal: Meal;
  entries: Entry[];
  onAdd: () => void;
  onSetPortions: (batchId: string, portions: number) => void;
  onRemove: (batchId: string) => void;
}) {
  const { groupsByKey } = usePlan();
  const consumed = portionsByGroup(entries);

  // Un alimento que suma a dos grupos se muestra una vez (por batch).
  const batches = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const list = map.get(e.batch_id) ?? [];
      list.push(e);
      map.set(e.batch_id, list);
    }
    return [...map.entries()];
  }, [entries]);

  const targetEntries = Object.entries(meal.targets) as [GroupKey, { min: number; max: number }][];

  return (
    <section className="card overflow-hidden">
      <header className="flex items-baseline justify-between px-4 pt-3">
        <h2 className="text-sm font-semibold">{meal.label}</h2>
        <span className="text-[11px] text-muted">{meal.horario}</span>
      </header>

      {targetEntries.length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 px-4 pt-2">
          {targetEntries.map(([key, t]) => {
            const g = groupsByKey[key];
            const done = consumed[key] ?? 0;
            const met = done >= t.min;
            return (
              <li key={key} className="tnum flex items-center gap-1.5 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: g?.color }} />
                <span className={met ? "text-muted line-through decoration-muted/50" : ""}>
                  {t.min === t.max ? t.min : `${t.min}-${t.max}`} {g?.short_label.toLowerCase()}
                </span>
                {done > 0 && <span className="text-muted">({fmtPortions(done)})</span>}
              </li>
            );
          })}
        </ul>
      )}

      {batches.length > 0 && (
        <ul className="mt-3 divide-y divide-line border-t border-line">
          {batches.map(([batchId, rows]) => {
            const primary = rows[0];
            const g = groupsByKey[primary.group_key];
            return (
              <li key={batchId} className="flex items-center gap-2 px-4 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{primary.nombre}</span>
                  <span className="block truncate text-[11px] text-muted">
                    {rows
                      .map((r) => `${fmtPortions(Number(r.portions))} ${groupsByKey[r.group_key]?.short_label.toLowerCase()}`)
                      .join(" + ")}
                  </span>
                </span>
                <span className="h-6 w-1 rounded-full" style={{ background: g?.color }} />
                <Stepper
                  value={Number(primary.portions)}
                  onChange={(v) => onSetPortions(batchId, v)}
                />
                <button
                  onClick={() => onRemove(batchId)}
                  aria-label={`Eliminar ${primary.nombre}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-surface-2"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {batches.length === 0 && meal.ejemplo && (
        <p className="px-4 pt-2 text-[11px] leading-relaxed text-muted">{meal.ejemplo}</p>
      )}

      <button
        onClick={onAdd}
        className="mt-3 w-full border-t border-line py-2.5 text-sm font-medium text-gold active:bg-surface-2"
      >
        + Agregar
      </button>
    </section>
  );
}

function WaterCard({ ml, onChange }: { ml: number; onChange: (ml: number) => void }) {
  const target = 2500;
  return (
    <section className="card px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Hidratación</h2>
          <p className="tnum text-xs text-muted">
            {(ml / 1000).toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / 2,0–2,5 L
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface-2 p-0.5">
          <button
            onClick={() => onChange(ml - 250)}
            aria-label="Quitar un vaso"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-line"
          >
            −
          </button>
          <span className="px-1 text-xs text-muted">vaso</span>
          <button
            onClick={() => onChange(ml + 250)}
            aria-label="Agregar un vaso"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-line"
          >
            +
          </button>
        </div>
      </div>
      <Bar value={ml} target={target} color="#57A0EA" className="mt-2.5" />
    </section>
  );
}
