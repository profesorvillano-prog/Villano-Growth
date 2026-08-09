"use client";

// Selector de persona del equipo (chips con avatar + contador). Evita mostrar
// las 4 casillas a la vez: se elige una y se ven solo sus KPIs.

import { Person, TEAM } from "@/lib/data";
import { Avatar } from "./ui";

export function PersonTabs({ who, onChange, count }: { who: Person; onChange: (p: Person) => void; count?: (name: Person) => number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEAM.map((m) => {
        const on = who === m.name;
        const n = count ? count(m.name) : undefined;
        return (
          <button
            key={m.name}
            onClick={() => onChange(m.name)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
              on ? "border-accent/50 bg-accent/12 text-ink" : "border-line bg-panel/50 text-mute hover:border-accent/40 hover:text-ink"
            }`}
          >
            <Avatar name={m.name} size={22} />
            <span className="font-medium">{m.name}</span>
            {n !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${on ? "bg-accent/20 text-accent2" : "bg-soft/70 text-dim"}`}>{n}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
