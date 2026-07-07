"use client";

// Capa de datos editable: seeds de lib/data.ts + persistencia en localStorage.
// En fase 2 (Supabase) este provider se reemplaza por consultas reales con
// permisos: la edición queda restringida al panel de gestión (Javier) o al
// responsable del módulo.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  CAMPAIGNS, Campaign, CLIENTS, FINANZAS, ClientFinance, GOALS, Goal, KPIS, KPI,
} from "./data";

export interface StrategyData {
  pilares: string;
  frecuenciaFeed: string;
  historias: string;
  tono: string;
  oferta: string;
}

export interface DBShape {
  campaigns: Campaign[];
  goals: Goal[];
  kpis: KPI[];
  finanzas: ClientFinance[];
  strategies: Record<string, StrategyData>;
}

const SEED: DBShape = {
  campaigns: CAMPAIGNS,
  goals: GOALS,
  kpis: KPIS,
  finanzas: FINANZAS,
  strategies: Object.fromEntries(
    CLIENTS.map((c) => [c.id, { ...c.estrategia, oferta: c.oferta }])
  ),
};

const KEY = "vos-db-v1";

interface DBCtx extends DBShape {
  update: <K extends keyof DBShape>(key: K, value: DBShape[K]) => void;
  reset: () => void;
}

const Ctx = createContext<DBCtx>({ ...SEED, update: () => {}, reset: () => {} });

export function DataProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DBShape>(SEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDb({ ...SEED, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const update = <K extends keyof DBShape>(key: K, value: DBShape[K]) => {
    setDb((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const reset = () => {
    try { localStorage.removeItem(KEY); } catch {}
    setDb(SEED);
  };

  return <Ctx.Provider value={{ ...db, update, reset }}>{children}</Ctx.Provider>;
}

export const useData = () => useContext(Ctx);
