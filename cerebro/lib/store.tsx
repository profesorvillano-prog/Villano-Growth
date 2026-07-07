"use client";

// Estado de checks del tracker con doble marca por celda:
// done = el R ejecutó · reviewed = el A revisó. Persiste en localStorage (demo);
// en producción esta capa se reemplaza por Supabase (action_instances).

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DONE_SEED, REVIEWED_SEED } from "./data";

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

const KEY = "vos-checks-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Set<string>>(new Set(DONE_SEED));
  const [reviewed, setReviewed] = useState<Set<string>>(new Set(REVIEWED_SEED));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.done) setDone(new Set(parsed.done));
        if (parsed.reviewed) setReviewed(new Set(parsed.reviewed));
      }
    } catch {}
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
