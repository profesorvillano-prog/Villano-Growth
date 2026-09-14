"use client";

import { createContext, useContext, useMemo } from "react";
import type { PlanBundle } from "@/lib/data";
import type { Group, GroupKey } from "@/lib/types";

type Ctx = PlanBundle & {
  groupsByKey: Record<GroupKey, Group>;
};

const PlanContext = createContext<Ctx | null>(null);

export function PlanProvider({
  bundle,
  children,
}: {
  bundle: PlanBundle;
  children: React.ReactNode;
}) {
  const value = useMemo<Ctx>(() => {
    const groupsByKey = Object.fromEntries(
      bundle.groups.map((g) => [g.key, g]),
    ) as Record<GroupKey, Group>;
    return { ...bundle, groupsByKey };
  }, [bundle]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): Ctx {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan fuera de PlanProvider");
  return ctx;
}
