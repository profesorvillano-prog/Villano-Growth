"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePlan } from "@/components/plan-context";
import { fmtKcal, fmtPortions, macrosOf, portionsByGroup } from "@/lib/nutrition";
import { addDays, dayNumber, dayShort, todayISO, weekDays, weekLabel, weekStart } from "@/lib/dates";
import type { Entry } from "@/lib/types";

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function WeekView({
  start: initialStart,
  entries: initialEntries,
}: {
  start: string;
  entries: Entry[];
}) {
  const { groups, targets, plan } = usePlan();
  const supabase = useMemo(() => createClient(), []);
  const [start, setStart] = useState(initialStart);
  const [cache, setCache] = useState<Record<string, Entry[]>>({ [initialStart]: initialEntries });
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (cache[start]) return;
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("minuta_entries")
        .select("id,fecha,meal_key,food_id,nombre,group_key,portions,batch_id")
        .gte("fecha", start)
        .lte("fecha", addDays(start, 6));
      if (alive) setCache((prev) => ({ ...prev, [start]: (data ?? []) as Entry[] }));
    })();
    return () => {
      alive = false;
    };
  }, [start, cache, supabase]);

  useEffect(() => {
    const url = start === weekStart(todayISO()) ? "/semana" : `/semana?w=${start}`;
    window.history.replaceState(null, "", url);
  }, [start]);

  const entries = cache[start] ?? [];
  const days = weekDays(start);
  const today = todayISO();

  const byDay = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const d of days) map.set(d, []);
    for (const e of entries) map.get(e.fecha)?.push(e);
    return map;
  }, [entries, days]);

  const scoredGroups = groups.filter((g) => !g.is_free && (targets[g.key] ?? 0) > 0);

  function adherence(dayEntries: Entry[]) {
    if (!scoredGroups.length) return 0;
    const done = portionsByGroup(dayEntries);
    const sum = scoredGroups.reduce(
      (acc, g) => acc + Math.min(1, (done[g.key] ?? 0) / (targets[g.key] ?? 1)),
      0,
    );
    return sum / scoredGroups.length;
  }

  const pastOrToday = days.filter((d) => d <= today);
  const avgKcal = pastOrToday.length
    ? pastOrToday.reduce((a, d) => a + macrosOf(byDay.get(d) ?? [], groups).kcal, 0) /
      pastOrToday.length
    : 0;
  const avgAdh = pastOrToday.length
    ? pastOrToday.reduce((a, d) => a + adherence(byDay.get(d) ?? []), 0) / pastOrToday.length
    : 0;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 px-5 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStart(addDays(start, -7))}
            aria-label="Semana anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2"
          >
            ‹
          </button>
          <button onClick={() => setStart(weekStart(today))} className="text-center">
            <p className="text-sm font-semibold">{weekLabel(start)}</p>
            <p className="text-xs text-muted">
              {start === weekStart(today) ? "Esta semana" : "Toca para volver a hoy"}
            </p>
          </button>
          <button
            onClick={() => setStart(addDays(start, 7))}
            aria-label="Semana siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2"
          >
            ›
          </button>
        </div>
      </header>

      <div
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 60) setStart(addDays(start, dx < 0 ? 7 : -7));
          touchX.current = null;
        }}
        className="px-3 py-4"
      >
        <table className="w-full table-fixed border-separate border-spacing-x-1 border-spacing-y-1">
          <thead>
            <tr>
              <th className="w-[62px]" />
              {days.map((d) => (
                <th key={d} className="text-center">
                  <Link href={`/?d=${d}`} className="block">
                    <span
                      className={`block text-[10px] font-medium ${
                        d === today ? "text-gold" : "text-muted"
                      }`}
                    >
                      {dayShort(d)}
                    </span>
                    <span
                      className={`tnum block text-[11px] ${
                        d === today ? "font-semibold text-gold" : ""
                      }`}
                    >
                      {dayNumber(d)}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const target = targets[g.key] ?? 0;
              return (
                <tr key={g.key}>
                  <th className="text-left align-middle">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: g.color }}
                      />
                      <span className="truncate text-[10px] font-medium text-muted">
                        {g.short_label}
                      </span>
                    </span>
                  </th>
                  {days.map((d) => {
                    const done = portionsByGroup(byDay.get(d) ?? [])[g.key] ?? 0;
                    const pct = target > 0 ? Math.min(1, done / target) : done > 0 ? 1 : 0;
                    const over = target > 0 && done > target;
                    return (
                      <td key={d}>
                        <Link
                          href={`/?d=${d}`}
                          className="flex h-8 items-center justify-center rounded-md border text-[10px] font-medium tnum"
                          style={{
                            background: pct ? hexToRgba(g.color, 0.15 + pct * 0.55) : "transparent",
                            borderColor: over ? "#ef6b5e" : "var(--color-line)",
                            color: pct > 0.5 ? "#0a0a0b" : "var(--color-muted)",
                          }}
                        >
                          {done ? fmtPortions(done) : ""}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <th className="pt-2 text-left align-middle text-[10px] font-medium text-muted">
                kcal
              </th>
              {days.map((d) => (
                <td key={d} className="pt-2 text-center">
                  <span className="tnum text-[10px] text-muted">
                    {macrosOf(byDay.get(d) ?? [], groups).kcal
                      ? fmtKcal(macrosOf(byDay.get(d) ?? [], groups).kcal)
                      : "—"}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <th className="text-left align-middle text-[10px] font-medium text-muted">pauta</th>
              {days.map((d) => {
                const adh = adherence(byDay.get(d) ?? []);
                return (
                  <td key={d} className="text-center">
                    <span
                      className={`tnum text-[10px] ${adh >= 0.9 ? "text-gold" : "text-muted"}`}
                    >
                      {adh ? `${Math.round(adh * 100)}%` : "—"}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>

        <p className="mt-3 px-2 text-[11px] text-muted">
          Desliza de lado para cambiar de semana. Toca un día para abrirlo.
        </p>
      </div>

      <section className="mx-5 card px-4 py-3">
        <h2 className="text-sm font-semibold">Resumen de la semana</h2>
        <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div>
            <dt className="text-[10px] text-muted">kcal promedio</dt>
            <dd className="tnum text-base font-semibold">{fmtKcal(avgKcal)}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-muted">adherencia</dt>
            <dd className="tnum text-base font-semibold">{Math.round(avgAdh * 100)}%</dd>
          </div>
          <div>
            <dt className="text-[10px] text-muted">meta diaria</dt>
            <dd className="tnum text-base font-semibold">{fmtKcal(Number(plan.kcal ?? 0))}</dd>
          </div>
        </dl>
      </section>
      <div className="h-6" />
    </>
  );
}
