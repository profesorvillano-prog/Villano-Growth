"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/components/plan-context";
import { Sheet } from "@/components/ui";
import { fmtKcal } from "@/lib/nutrition";
import { todayISO } from "@/lib/dates";
import type { Food, GroupKey } from "@/lib/types";

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function FoodsView() {
  const { foods, groups, groupsByKey, meals, userId } = usePlan();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<GroupKey | null>(null);
  const [detail, setDetail] = useState<Food | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const visible = useMemo(() => {
    const nq = norm(q.trim());
    return foods.filter(
      (f) => (!filter || f.group_key === filter) && (!nq || norm(f.nombre).includes(nq)),
    );
  }, [foods, q, filter]);

  const sections = useMemo(() => {
    return groups
      .map((g) => ({ group: g, items: visible.filter((f) => f.group_key === g.key) }))
      .filter((s) => s.items.length > 0);
  }, [groups, visible]);

  async function quickLog(food: Food, mealKey: string) {
    const batchId = crypto.randomUUID();
    const fecha = todayISO();
    const rows = [
      {
        user_id: userId,
        fecha,
        meal_key: mealKey,
        food_id: food.id,
        nombre: food.nombre,
        group_key: food.group_key,
        portions: 1,
        batch_id: batchId,
      },
    ];
    if (food.extra_group && Number(food.extra_portions ?? 0) > 0) {
      rows.push({ ...rows[0], group_key: food.extra_group, portions: Number(food.extra_portions) });
    }
    const { error } = await supabase.from("minuta_entries").insert(rows);
    setDetail(null);
    setFlash(error ? "No se pudo guardar" : `${food.nombre} agregado a hoy`);
    setTimeout(() => setFlash(null), 2500);
  }

  async function deleteFood(food: Food) {
    await supabase.from("minuta_foods").delete().eq("id", food.id);
    setDetail(null);
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-20 space-y-3 border-b border-line bg-bg/95 px-5 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Alimentos</h1>
          <button
            onClick={() => setNewOpen(true)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-gold active:bg-surface-2"
          >
            + Nuevo
          </button>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar en la lista de intercambio…"
          className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-gold"
        />
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          <button
            onClick={() => setFilter(null)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              filter === null ? "border-gold text-ink" : "border-line text-muted"
            }`}
          >
            Todos
          </button>
          {groups.map((g) => (
            <button
              key={g.key}
              onClick={() => setFilter(g.key)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                filter === g.key ? "border-gold text-ink" : "border-line text-muted"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
              {g.short_label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-4">
        {sections.map(({ group, items }) => (
          <section key={group.key} className="mb-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold" style={{ color: group.color }}>
                {group.label}
              </h2>
              <span className="tnum text-[11px] text-muted">
                {fmtKcal(group.kcal)} kcal / porción
              </span>
            </div>
            {group.portion_hint && (
              <p className="mb-2 text-[11px] leading-relaxed text-muted">{group.portion_hint}</p>
            )}
            <ul className="card divide-y divide-line">
              {items.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setDetail(f)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left active:bg-surface-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{f.nombre}</span>
                      {f.nota && (
                        <span className="block truncate text-[11px] text-muted">{f.nota}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-muted">{f.portion_label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {sections.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted">Sin resultados para «{q}».</p>
            <button
              onClick={() => setNewOpen(true)}
              className="mt-3 text-sm font-medium text-gold"
            >
              + Crear «{q.trim()}»
            </button>
          </div>
        )}
      </div>

      {detail && (
        <Sheet open onClose={() => setDetail(null)} title={detail.nombre}>
          <div className="space-y-4 px-5 py-4">
            <div>
              <p className="text-xs text-muted">1 porción de {groupsByKey[detail.group_key]?.label.toLowerCase()}</p>
              <p className="text-xl font-semibold">{detail.portion_label}</p>
              {detail.gramos && <p className="text-xs text-muted">≈ {detail.gramos} g</p>}
            </div>

            {detail.extra_group && (
              <p className="rounded-xl border border-line bg-surface px-3 py-2 text-xs">
                Suma además {detail.extra_portions} porción de{" "}
                {groupsByKey[detail.extra_group]?.label.toLowerCase()}.
              </p>
            )}
            {detail.nota && <p className="text-xs text-muted">{detail.nota}</p>}

            <dl className="tnum grid grid-cols-4 gap-2 text-center">
              {(() => {
                const g = groupsByKey[detail.group_key];
                return (
                  <>
                    <Stat label="kcal" value={fmtKcal(g?.kcal ?? 0)} />
                    <Stat label="P" value={`${g?.protein_g ?? 0} g`} />
                    <Stat label="C" value={`${g?.carbs_g ?? 0} g`} />
                    <Stat label="G" value={`${g?.fat_g ?? 0} g`} />
                  </>
                );
              })()}
            </dl>

            <div>
              <p className="mb-2 text-xs text-muted">Agregar 1 porción a hoy</p>
              <div className="flex flex-wrap gap-2">
                {meals.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => quickLog(detail, m.meal_key)}
                    className="rounded-full border border-line px-3 py-2 text-xs font-medium active:bg-surface-2"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {detail.user_id && (
              <button
                onClick={() => deleteFood(detail)}
                className="text-xs text-[#ef6b5e]"
              >
                Eliminar de mis alimentos
              </button>
            )}
          </div>
        </Sheet>
      )}

      {newOpen && (
        <NewFoodSheet
          initialName={q.trim()}
          onClose={() => setNewOpen(false)}
          onSaved={() => {
            setNewOpen(false);
            router.refresh();
          }}
        />
      )}

      {flash && (
        <div className="fade-in fixed inset-x-0 bottom-16 z-40 mx-auto w-fit rounded-full border border-line bg-surface-2 px-4 py-2 text-sm">
          {flash}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-2 py-2">
      <dt className="text-[10px] text-muted">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}

function NewFoodSheet({
  initialName,
  onClose,
  onSaved,
}: {
  initialName: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { groups, userId } = usePlan();
  const supabase = useMemo(() => createClient(), []);
  const [nombre, setNombre] = useState(initialName);
  const [groupKey, setGroupKey] = useState<GroupKey>(groups[0]?.key ?? "cereales");
  const [portion, setPortion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!nombre.trim() || !portion.trim()) {
      setError("Completa el nombre y cuánto es una porción.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("minuta_foods").insert({
      user_id: userId,
      group_key: groupKey,
      nombre: nombre.trim(),
      portion_label: portion.trim(),
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Nuevo alimento"
      footer={
        <button
          onClick={save}
          disabled={saving}
          className="h-11 w-full rounded-xl bg-gold font-semibold text-black disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      }
    >
      <div className="space-y-4 px-5 py-4">
        <div>
          <label className="text-xs text-muted" htmlFor="nf-nombre">
            Nombre
          </label>
          <input
            id="nf-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-gold"
          />
        </div>
        <div>
          <p className="text-xs text-muted">Grupo</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g.key}
                onClick={() => setGroupKey(g.key)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  groupKey === g.key ? "border-gold text-ink" : "border-line text-muted"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                {g.short_label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted" htmlFor="nf-portion">
            ¿Cuánto es 1 porción?
          </label>
          <input
            id="nf-portion"
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
            placeholder="Ej: ¾ taza, 50 g, 1 unidad"
            className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-gold"
          />
        </div>
        {error && <p className="text-sm text-[#ef6b5e]">{error}</p>}
      </div>
    </Sheet>
  );
}
