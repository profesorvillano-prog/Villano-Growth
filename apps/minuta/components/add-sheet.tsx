"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/components/plan-context";
import { Sheet, Stepper } from "@/components/ui";
import { fmtPortions } from "@/lib/nutrition";
import type { Food, GroupKey } from "@/lib/types";

export type AddResult = { batchId: string } | null;

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function AddSheet({
  open,
  onClose,
  mealLabel,
  suggestedGroups,
  remaining,
  onAdd,
  onSetPortions,
}: {
  open: boolean;
  onClose: () => void;
  mealLabel: string;
  suggestedGroups: GroupKey[];
  remaining: Partial<Record<GroupKey, number>>;
  onAdd: (args: {
    food: Food | null;
    nombre: string;
    groupKey: GroupKey;
    portions: number;
  }) => Promise<AddResult>;
  onSetPortions: (batchId: string, portions: number) => void;
}) {
  const { foods, groups, groupsByKey } = usePlan();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<GroupKey | "sugeridos" | null>(null);
  const [added, setAdded] = useState<Record<string, { batchId: string; portions: number }>>({});
  const [customGroupOpen, setCustomGroupOpen] = useState(false);
  const [frequent, setFrequent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQ("");
      setAdded({});
      setCustomGroupOpen(false);
      setFilter(null);
      return;
    }
    setFilter(suggestedGroups.length ? "sugeridos" : null);
    const supabase = createClient();
    supabase
      .from("minuta_food_usage")
      .select("food_id,veces")
      .order("veces", { ascending: false })
      .limit(14)
      .then(({ data }) => setFrequent((data ?? []).map((r) => r.food_id as string)));
  }, [open, suggestedGroups.length]);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    const freqRank = new Map(frequent.map((id, i) => [id, i]));
    const suggested = new Set(suggestedGroups);

    return foods
      .filter((f) => {
        if (nq && !norm(f.nombre).includes(nq)) return false;
        if (!nq) {
          if (filter === "sugeridos") return suggested.has(f.group_key);
          if (filter) return f.group_key === filter;
        } else if (filter && filter !== "sugeridos") {
          return f.group_key === filter;
        }
        return true;
      })
      .sort((a, b) => {
        if (!nq) {
          const fa = freqRank.get(a.id) ?? 99;
          const fb = freqRank.get(b.id) ?? 99;
          if (fa !== fb) return fa - fb;
        }
        const sa = suggested.has(a.group_key) ? 0 : 1;
        const sb = suggested.has(b.group_key) ? 0 : 1;
        if (sa !== sb) return sa - sb;
        return a.nombre.localeCompare(b.nombre, "es");
      })
      .slice(0, 120);
  }, [foods, q, filter, frequent, suggestedGroups]);

  const exactMatch = useMemo(
    () => foods.some((f) => norm(f.nombre) === norm(q.trim())),
    [foods, q],
  );

  async function addFood(food: Food) {
    const res = await onAdd({ food, nombre: food.nombre, groupKey: food.group_key, portions: 1 });
    if (res) setAdded((prev) => ({ ...prev, [food.id]: { batchId: res.batchId, portions: 1 } }));
  }

  async function addCustom(groupKey: GroupKey) {
    const nombre = q.trim();
    if (!nombre) return;
    const res = await onAdd({ food: null, nombre, groupKey, portions: 1 });
    if (res) setAdded((prev) => ({ ...prev, [`custom:${nombre}`]: { batchId: res.batchId, portions: 1 } }));
    setCustomGroupOpen(false);
    setQ("");
  }

  const addedCount = Object.keys(added).length;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Agregar a ${mealLabel}`}
      footer={
        <button
          onClick={onClose}
          className="h-11 w-full rounded-xl bg-gold font-semibold text-black active:scale-[0.99]"
        >
          {addedCount ? `Listo · ${addedCount} agregado${addedCount > 1 ? "s" : ""}` : "Listo"}
        </button>
      }
    >
      <div className="sticky top-0 z-10 space-y-3 border-b border-line bg-bg px-5 pb-3 pt-3">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar alimento…"
          className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-gold"
        />
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {suggestedGroups.length > 0 && (
            <FilterChip
              label="Sugeridos"
              active={filter === "sugeridos"}
              onClick={() => setFilter(filter === "sugeridos" ? null : "sugeridos")}
            />
          )}
          {groups.map((g) => {
            const left = remaining[g.key];
            return (
              <FilterChip
                key={g.key}
                label={
                  left === undefined || g.is_free
                    ? g.short_label
                    : `${g.short_label} · ${fmtPortions(left)}`
                }
                color={g.color}
                active={filter === g.key}
                onClick={() => setFilter(filter === g.key ? null : g.key)}
              />
            );
          })}
        </div>
      </div>

      <ul className="divide-y divide-line px-5">
        {q.trim() && !exactMatch && (
          <li className="py-3">
            {!customGroupOpen ? (
              <button
                onClick={() => setCustomGroupOpen(true)}
                className="text-sm font-medium text-gold"
              >
                + Agregar «{q.trim()}» como alimento libre
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted">¿A qué grupo lo cuento?</p>
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <FilterChip
                      key={g.key}
                      label={g.short_label}
                      color={g.color}
                      onClick={() => addCustom(g.key)}
                    />
                  ))}
                </div>
              </div>
            )}
          </li>
        )}

        {list.map((f) => {
          const g = groupsByKey[f.group_key];
          const state = added[f.id];
          const extra = f.extra_group ? groupsByKey[f.extra_group] : null;
          return (
            <li key={f.id} className="flex items-center gap-3 py-2.5">
              <button
                onClick={() => !state && addFood(f)}
                className="min-w-0 flex-1 text-left"
                disabled={!!state}
              >
                <p className="truncate text-sm font-medium">{f.nombre}</p>
                <p className="truncate text-xs text-muted">
                  <span style={{ color: g?.color }}>●</span> {f.portion_label}
                  {extra && ` · +1 ${extra.short_label.toLowerCase()}`}
                  {f.nota ? ` · ${f.nota}` : ""}
                </p>
              </button>
              {state ? (
                <Stepper
                  value={state.portions}
                  onChange={(v) => {
                    setAdded((prev) => ({ ...prev, [f.id]: { ...state, portions: v } }));
                    onSetPortions(state.batchId, v);
                  }}
                />
              ) : (
                <button
                  onClick={() => addFood(f)}
                  aria-label={`Agregar ${f.nombre}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-lg text-gold active:bg-surface-2"
                >
                  +
                </button>
              )}
            </li>
          );
        })}

        {list.length === 0 && !q.trim() && (
          <li className="py-6 text-center text-sm text-muted">No hay alimentos en este filtro.</li>
        )}
      </ul>
      <div className="h-4" />
    </Sheet>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active?: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active ? "border-gold text-ink" : "border-line text-muted"
      }`}
    >
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
      {label}
    </button>
  );
}
