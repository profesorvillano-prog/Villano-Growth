"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { AREAS, Area } from "@/lib/data";

export function Card({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <section
      className={`rounded-2xl border border-line/80 bg-card shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04),0_20px_48px_-26px_rgb(0_0_0/0.85)] ${hover ? "transition-colors hover:border-accent/35" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line/80 px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        {sub && <p className="mt-1 text-xs leading-relaxed text-mute">{sub}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}

// Botón reutilizable con afordancia clara (usa .btn de globals.css)
export function Button({
  variant = "ghost", size = "md", className = "", children, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "soft"; size?: "sm" | "md" }) {
  const v = variant === "primary" ? "btn-primary" : variant === "soft" ? "btn-soft" : "btn-ghost";
  const s = size === "sm" ? "px-2.5 py-1 text-xs" : "";
  return (
    <button className={`btn ${v} ${s} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Pill({ children, tone, className = "" }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "accent"; className?: string }) {
  const map = {
    ok: "border-ok/30 bg-ok/10 text-ok",
    warn: "border-warn/30 bg-warn/10 text-warn",
    bad: "border-bad/30 bg-bad/10 text-bad",
    accent: "border-accent/30 bg-accent/10 text-accent2",
  } as const;
  const cls = tone ? map[tone] : "border-line bg-panel/60 text-mute";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cls} ${className}`}>
      {children}
    </span>
  );
}

export function AreaBadge({ area }: { area: Area }) {
  const a = AREAS[area];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/50 px-2 py-0.5 text-[11px] font-medium text-mute">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}88` }} />
      {a.label}
    </span>
  );
}

export function ClientMark({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl border font-semibold tracking-tight"
      style={{ width: size, height: size, background: color + "1f", color, borderColor: color + "3a", fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const special: Record<string, [string, string]> = {
    Setter: ["IN", "#f472b6"],
    Cliente: ["CL", "#fb7185"],
  };
  const hues: Record<string, string> = { Se: "#8b5cf6", Ro: "#60a5fa", Fr: "#34d399", Ja: "#fbbf24" };
  const initials = special[name]?.[0] ?? name.slice(0, 2).toUpperCase();
  const bg = special[name]?.[1] ?? hues[name.slice(0, 2)] ?? "#5d5d6b";
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-bg ring-2 ring-inset ring-white/10"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }}
    >
      {initials}
    </span>
  );
}

export function Progress({ pct, color = "#8b5cf6", h = 6 }: { pct: number; color?: string; h?: number }) {
  const p = Math.min(100, Math.max(0, pct));
  return (
    <div className="w-full overflow-hidden rounded-full bg-soft/70" style={{ height: h }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${p}%`, background: color, boxShadow: p > 4 ? `0 0 10px ${color}66` : undefined }}
      />
    </div>
  );
}

export function Semaforo({ estado }: { estado: "ok" | "warn" | "bad" }) {
  const map = { ok: ["#34d399", "Sano"], warn: ["#fbbf24", "Atención"], bad: ["#fb7185", "Crítico"] } as const;
  const [c, label] = map[estado];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/50 px-2 py-0.5 text-[11px] font-medium text-mute">
      <span className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
      {label}
    </span>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "ok" | "warn" | "bad" }) {
  const toneCls = tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className="min-w-0">
      <p className="truncate text-[10.5px] font-semibold uppercase tracking-[0.07em] text-dim">{label}</p>
      <p className={`mt-1.5 text-[22px] font-semibold leading-none tracking-tight tabular-nums ${toneCls}`}>{value}</p>
      {hint && <p className="mt-1 truncate text-[11px] text-mute">{hint}</p>}
    </div>
  );
}

export function StatusDot({ status }: { status?: "ok" | "warn" | "bad" }) {
  if (!status) return null;
  const c = { ok: "#34d399", warn: "#fbbf24", bad: "#fb7185" }[status];
  return <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: c }} />;
}
