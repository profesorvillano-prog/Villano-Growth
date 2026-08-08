"use client";

// Progreso de KPIs por período, guardado en Supabase (tabla kpi_progress).
// Cada KPI tiene una cadencia (semanal | mensual): el conteo se lleva por período
// y se reinicia solo al empezar el siguiente. El histórico queda: cada período
// pasado conserva su valor. Realtime: se ve entre usuarios.

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { weekStart, isoKey } from "./date";
import type { KpiCadencia } from "./data";

const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Clave del período actual según cadencia.
export function currentPeriodKey(cad: KpiCadencia, now: Date = new Date()): string {
  if (cad === "mensual") return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return isoKey(weekStart(0, now));
}

// Lista de los últimos n períodos (viejo → actual) con etiqueta corta.
export function periodList(cad: KpiCadencia, n: number, now: Date = new Date()): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  if (cad === "mensual") {
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: MES[d.getMonth()] });
    }
  } else {
    for (let i = n - 1; i >= 0; i--) {
      const d = weekStart(-i, now);
      out.push({ key: isoKey(d), label: `${d.getDate()} ${MES[d.getMonth()]}` });
    }
  }
  return out;
}

const mkKey = (kpiId: string, periodo: string) => `${kpiId}|${periodo}`;

export function useKpiProgress() {
  const [map, setMap] = useState<Map<string, number>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("kpi_progress").select("kpi_id, periodo, valor");
      if (!active) return;
      const m = new Map<string, number>();
      for (const r of (data ?? []) as any[]) m.set(mkKey(r.kpi_id, r.periodo), Number(r.valor) || 0);
      setMap(m);
      setReady(true);
    })();

    const ch = supabase
      .channel("kpi_progress_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "kpi_progress" }, (payload) => {
        const row = (payload.new ?? payload.old) as any;
        const k = mkKey(row.kpi_id, row.periodo);
        setMap((prev) => {
          const nx = new Map(prev);
          if (payload.eventType === "DELETE") nx.delete(k);
          else nx.set(k, Number(row.valor) || 0);
          return nx;
        });
      })
      .subscribe();

    return () => { active = false; supabase.removeChannel(ch); };
  }, []);

  const get = useCallback((kpiId: string, periodo: string) => map.get(mkKey(kpiId, periodo)) ?? 0, [map]);

  const setValor = useCallback((kpiId: string, periodo: string, valor: number) => {
    const k = mkKey(kpiId, periodo);
    setMap((prev) => {
      const nx = new Map(prev);
      if (valor <= 0) nx.delete(k);
      else nx.set(k, valor);
      return nx;
    });
    if (valor <= 0) supabase.from("kpi_progress").delete().match({ kpi_id: kpiId, periodo }).then(() => {});
    else supabase.from("kpi_progress").upsert({ kpi_id: kpiId, periodo, valor, updated_at: new Date().toISOString() }).then(() => {});
  }, []);

  return { get, setValor, ready };
}
