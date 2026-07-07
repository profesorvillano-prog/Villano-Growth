"use client";

// Capa de datos editable: seeds de lib/data.ts + persistencia en localStorage.
// El plan de contenido (frecuencia de feed/historias) genera acciones del tracker.
// En fase 2 (Supabase) este provider se reemplaza por consultas reales con permisos.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  ACTIONS, Action, CAMPAIGNS, Campaign, CLIENTS, CONTENT_PLANS, ContentPlan,
  FINANZAS, ClientFinance, GOALS, Goal, KPIS, KPI, genContentActions,
} from "./data";

export interface StrategyData {
  pilares: string;
  frecuenciaFeed: string;
  historias: string;
  tono: string;
  oferta: string;
}

export interface DBShape {
  actions: Action[];
  campaigns: Campaign[];
  goals: Goal[];
  kpis: KPI[];
  finanzas: ClientFinance[];
  strategies: Record<string, StrategyData>;
  plans: Record<string, ContentPlan>;
}

const SEED: DBShape = {
  actions: ACTIONS,
  campaigns: CAMPAIGNS,
  goals: GOALS,
  kpis: KPIS,
  finanzas: FINANZAS,
  strategies: Object.fromEntries(
    CLIENTS.map((c) => [c.id, { ...c.estrategia, oferta: c.oferta }])
  ),
  plans: JSON.parse(JSON.stringify(CONTENT_PLANS)),
};

const KEY = "vos-db-v2";

interface DBCtx extends DBShape {
  update: <K extends keyof DBShape>(key: K, value: DBShape[K]) => void;
  setContentPlan: (clientId: string, plan: ContentPlan) => void;
  reset: () => void;
}

const Ctx = createContext<DBCtx>({ ...SEED, update: () => {}, setContentPlan: () => {}, reset: () => {} });

export function DataProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DBShape>(SEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDb({ ...SEED, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const persist = (next: DBShape) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return next;
  };

  const update = <K extends keyof DBShape>(key: K, value: DBShape[K]) => {
    setDb((prev) => persist({ ...prev, [key]: value }));
  };

  // Actualiza el plan y regenera las acciones "gen-<cliente>-" de ese cliente
  const setContentPlan = (clientId: string, plan: ContentPlan) => {
    setDb((prev) => {
      const plans = { ...prev.plans, [clientId]: plan };
      const actions = prev.actions
        .filter((a) => !a.id.startsWith(`gen-${clientId}-`))
        .concat(genContentActions(clientId, plan));
      return persist({ ...prev, plans, actions });
    });
  };

  const reset = () => {
    try { localStorage.removeItem(KEY); } catch {}
    setDb(SEED);
  };

  return <Ctx.Provider value={{ ...db, update, setContentPlan, reset }}>{children}</Ctx.Provider>;
}

export const useData = () => useContext(Ctx);
