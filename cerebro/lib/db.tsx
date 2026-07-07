"use client";

// Estado compartido de la app en Supabase (tabla app_state, documento 'main').
// Todo el equipo lee y escribe el mismo estado; se refleja en vivo vía realtime.
// El plan de contenido genera acciones del tracker.

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import {
  ACTIONS, Action, CAMPAIGNS, Campaign, CLIENTS, CONTENT_PLANS, ContentPlan,
  FINANZAS, ClientFinance, GOALS, Goal, KPIS, KPI, genContentActions,
} from "./data";
import { supabase } from "./supabase";

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
  strategies: Object.fromEntries(CLIENTS.map((c) => [c.id, { ...c.estrategia, oferta: c.oferta }])),
  plans: JSON.parse(JSON.stringify(CONTENT_PLANS)),
};

const DOC_ID = "main";

interface DBCtx extends DBShape {
  update: <K extends keyof DBShape>(key: K, value: DBShape[K]) => void;
  setContentPlan: (clientId: string, plan: ContentPlan) => void;
  reset: () => void;
  synced: boolean;
}

const Ctx = createContext<DBCtx>({ ...SEED, update: () => {}, setContentPlan: () => {}, reset: () => {}, synced: false });

export function DataProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DBShape>(SEED);
  const [synced, setSynced] = useState(false);
  const skipNextRealtime = useRef(false);

  // Carga inicial + realtime
  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.from("app_state").select("data").eq("id", DOC_ID).maybeSingle();
      if (!active) return;
      if (data?.data) {
        setDb({ ...SEED, ...(data.data as Partial<DBShape>) });
      } else if (!error) {
        // Primera vez: sembrar el estado por defecto
        await supabase.from("app_state").upsert({ id: DOC_ID, data: SEED });
      }
      setSynced(true);
    })();

    const channel = supabase
      .channel("app_state_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "app_state", filter: `id=eq.${DOC_ID}` }, (payload) => {
        if (skipNextRealtime.current) { skipNextRealtime.current = false; return; }
        const next = (payload.new as any)?.data;
        if (next) setDb({ ...SEED, ...next });
      })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  const save = (next: DBShape) => {
    skipNextRealtime.current = true;
    supabase.from("app_state").upsert({ id: DOC_ID, data: next, updated_at: new Date().toISOString() }).then(() => {});
    return next;
  };

  const update = <K extends keyof DBShape>(key: K, value: DBShape[K]) => {
    setDb((prev) => save({ ...prev, [key]: value }));
  };

  const setContentPlan = (clientId: string, plan: ContentPlan) => {
    setDb((prev) => {
      const plans = { ...prev.plans, [clientId]: plan };
      const actions = prev.actions
        .filter((a) => !a.id.startsWith(`gen-${clientId}-`))
        .concat(genContentActions(clientId, plan));
      return save({ ...prev, plans, actions });
    });
  };

  const reset = () => setDb((prev) => save(SEED));

  return <Ctx.Provider value={{ ...db, update, setContentPlan, reset, synced }}>{children}</Ctx.Provider>;
}

export const useData = () => useContext(Ctx);
