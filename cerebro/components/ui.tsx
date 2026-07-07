"use client";

import { ReactNode } from "react";
import { AREAS, Area } from "@/lib/data";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-line bg-card shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_16px_40px_-20px_rgba(0,0,0,0.7)] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-mute">{sub}</p>}
      </div>
      {right}
    </header>
  );
}

export function AreaBadge({ area }: { area: Area }) {
  const a = AREAS[area];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-mute"
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
      {a.label}
    </span>
  );
}

export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const special: Record<string, [string, string]> = {
    Setter: ["IN", "#f472b6"], // Ina
    Cliente: ["CL", "#fb7185"],
  };
  const hues: Record<string, string> = { Se: "#8b5cf6", Ro: "#60a5fa", Pa: "#34d399", Ja: "#fbbf24" };
  const initials = special[name]?.[0] ?? name.slice(0, 2).toUpperCase();
  const bg = special[name]?.[1] ?? hues[name.slice(0, 2)] ?? "#5d5d6b";
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-bg"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }}
    >
      {initials}
    </span>
  );
}

export function Progress({ pct, color = "#8b5cf6", h = 6 }: { pct: number; color?: string; h?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-full bg-soft" style={{ height: h }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }}
      />
    </div>
  );
}

export function Semaforo({ estado }: { estado: "ok" | "warn" | "bad" }) {
  const map = { ok: ["bg-ok", "Sano"], warn: ["bg-warn", "Atención"], bad: ["bg-bad", "Crítico"] } as const;
  const [cls, label] = map[estado];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-mute">
      <span className={`h-2 w-2 rounded-full ${cls}`} style={{ boxShadow: "0 0 8px currentColor" }} />
      {label}
    </span>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "ok" | "warn" | "bad" }) {
  const toneCls = tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className="min-w-0">
      <p className="truncate text-[11px] font-medium uppercase tracking-wide text-dim">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${toneCls}`}>{value}</p>
      {hint && <p className="mt-0.5 truncate text-[11px] text-mute">{hint}</p>}
    </div>
  );
}

export function StatusDot({ status }: { status?: "ok" | "warn" | "bad" }) {
  if (!status) return null;
  const c = { ok: "#34d399", warn: "#fbbf24", bad: "#fb7185" }[status];
  return <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: c }} />;
}
