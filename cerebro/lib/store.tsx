"use client";

// Estado de checks del tracker: en memoria + localStorage (demo).
// En producción esta capa se reemplaza por Supabase (ver supabase/schema.sql).

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DONE_SEED } from "./data";

interface Store {
  done: Set<string>;
  toggle: (key: string) => void;
}

const Ctx = createContext<Store>({ done: new Set(), toggle: () => {} });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Set<string>>(new Set(DONE_SEED));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cerebro-done");
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem("cerebro-done", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  return <Ctx.Provider value={{ done, toggle }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
