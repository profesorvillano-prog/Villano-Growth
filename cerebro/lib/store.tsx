"use client";

// Marcas del tracker en Supabase (tabla checks). Clave local: `${actionId}|${YYYY-MM-DD}`.
// done = el R ejecutó · reviewed = el A revisó. Realtime: se ven entre usuarios.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabase";

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

// key "actionId|YYYY-MM-DD" → { action_id, day }
function parseKey(key: string): { action_id: string; day: string } {
  const i = key.lastIndexOf("|");
  return { action_id: key.slice(0, i), day: key.slice(i + 1) };
}
const toKey = (action_id: string, day: string) => `${action_id}|${day}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("checks").select("action_id, day, kind");
      if (!active || !data) return;
      const d = new Set<string>(), r = new Set<string>();
      for (const row of data as { action_id: string; day: string; kind: string }[]) {
        (row.kind === "reviewed" ? r : d).add(toKey(row.action_id, row.day));
      }
      setDone(d); setReviewed(r);
    })();

    const channel = supabase
      .channel("checks_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "checks" }, (payload) => {
        const row = (payload.new ?? payload.old) as { action_id: string; day: string; kind: string };
        const key = toKey(row.action_id, row.day);
        const setter = row.kind === "reviewed" ? setReviewed : setDone;
        setter((prev) => {
          const next = new Set(prev);
          if (payload.eventType === "DELETE") next.delete(key);
          else next.add(key);
          return next;
        });
      })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  const toggleKind = (key: string, kind: "done" | "reviewed", setter: React.Dispatch<React.SetStateAction<Set<string>>>, current: Set<string>) => {
    const { action_id, day } = parseKey(key);
    const has = current.has(key);
    // Optimista
    setter((prev) => {
      const next = new Set(prev);
      has ? next.delete(key) : next.add(key);
      return next;
    });
    if (has) {
      supabase.from("checks").delete().match({ action_id, day, kind }).then(() => {});
    } else {
      supabase.from("checks").upsert({ action_id, day, kind }).then(() => {});
    }
  };

  const toggle = (key: string) => toggleKind(key, "done", setDone, done);
  const toggleReviewed = (key: string) => toggleKind(key, "reviewed", setReviewed, reviewed);

  return <Ctx.Provider value={{ done, reviewed, toggle, toggleReviewed }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
