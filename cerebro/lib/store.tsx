"use client";

// Estado de checks del tracker con doble marca por celda:
// done = el R ejecutó · reviewed = el A revisó.
// Claves por FECHA real: `${actionId}|${YYYY-MM-DD}` — cada semana es independiente.
// Persiste en localStorage (demo); en producción → Supabase (action_instances).

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DONE_SEED, REVIEWED_SEED } from "./data";
import { weekDates, isoKey } from "./date";

interface Store {
  done: Set<string>;
  reviewed: Set<string>;
  toggle: (key: string) => void;
  toggleReviewed: (key: string) => void;
}

const Ctx = createContext<Store>({
  done: new Set(),
  reviewed: new Set(),
  toggle: () => {},
  toggleReviewed: () => {},
});

const KEY = "vos-checks-v2";

// Convierte seeds "actionId-dayIndex" a claves por fecha de la semana actual.
function seedToDateKeys(seeds: string[]): string[] {
  const iso = weekDates(0).map(isoKey);
  return seeds.map((s) => {
    const i = s.lastIndexOf("-");
    const id = s.slice(0, i);
    const day = parseInt(s.slice(i + 1), 10);
    return `${id}|${iso[day] ?? day}`;
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDone(new Set(parsed.done ?? []));
        setReviewed(new Set(parsed.reviewed ?? []));
        return;
      }
    } catch {}
    // Primera vez: sembrar el demo sobre la semana actual (fechas reales)
    setDone(new Set(seedToDateKeys(DONE_SEED)));
    setReviewed(new Set(seedToDateKeys(REVIEWED_SEED)));
  }, []);

  const persist = (d: Set<string>, r: Set<string>) => {
    try { localStorage.setItem(KEY, JSON.stringify({ done: [...d], reviewed: [...r] })); } catch {}
  };

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      persist(next, reviewed);
      return next;
    });
  };

  const toggleReviewed = (key: string) => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      persist(done, next);
      return next;
    });
  };

  return <Ctx.Provider value={{ done, reviewed, toggle, toggleReviewed }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
