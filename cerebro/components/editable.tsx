"use client";

// Editores en línea con afordancia clara: al pasar el mouse se ve el subrayado
// punteado y el lápiz; clic → input; Enter/blur guarda · Esc cancela.

import { useEffect, useState } from "react";
import { fmtVal } from "@/lib/data";

const PENCIL = (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 transition-opacity group-hover:opacity-70">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export function EText({
  value, onSave, className = "", placeholder = "…",
}: { value: string; onSave: (v: string) => void; className?: string; placeholder?: string }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        title="Clic para editar"
        className={`group -mx-1.5 inline-flex items-center gap-1 rounded-md border-b border-dashed border-transparent px-1.5 py-0.5 text-left transition-colors hover:border-line hover:bg-soft/50 ${className}`}
      >
        <span>{value || <span className="text-dim">{placeholder}</span>}</span>
        {PENCIL}
      </button>
    );
  }
  const save = () => { setEditing(false); if (v !== value) onSave(v); };
  return (
    <input
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") { setV(value); setEditing(false); }
      }}
      className={`w-full min-w-24 rounded-md border border-accent/60 bg-panel px-1.5 py-0.5 shadow-[0_0_0_3px_rgb(139_92_246/0.14)] outline-none ${className}`}
    />
  );
}

export function ENum({
  value, onSave, fmt, className = "", nullable = false,
}: { value: number | null; onSave: (v: number | null) => void; fmt?: "usd" | "pct" | "x" | "n"; className?: string; nullable?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value === null ? "" : String(value));
  useEffect(() => setV(value === null ? "" : String(value)), [value]);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        title="Clic para editar"
        className={`group -mx-1.5 inline-flex items-center gap-1 rounded-md border-b border-dashed border-transparent px-1.5 py-0.5 tabular-nums transition-colors hover:border-line hover:bg-soft/50 ${className}`}
      >
        <span>{fmtVal(value, fmt)}</span>
        {PENCIL}
      </button>
    );
  }
  const save = () => {
    setEditing(false);
    const trimmed = v.trim().replace(",", ".");
    if (trimmed === "" && nullable) { onSave(null); return; }
    const n = parseFloat(trimmed);
    if (!isNaN(n)) onSave(n);
  };
  return (
    <input
      autoFocus
      inputMode="decimal"
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") { setV(value === null ? "" : String(value)); setEditing(false); }
      }}
      className={`w-20 rounded-md border border-accent/60 bg-panel px-1.5 py-0.5 text-right tabular-nums shadow-[0_0_0_3px_rgb(139_92_246/0.14)] outline-none ${className}`}
    />
  );
}

export function ESelect({
  value, options, onSave, className = "",
}: { value: string; options: { value: string; label: string }[]; onSave: (v: string) => void; className?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onSave(e.target.value)}
      className={`cursor-pointer rounded-md border border-line bg-panel px-2 py-1 text-xs font-medium text-mute outline-none transition-colors hover:border-accent/45 hover:text-ink focus:border-accent/60 ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function DeleteBtn({ onClick, title = "Eliminar" }: { onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-dim opacity-0 transition-all hover:bg-bad/15 hover:text-bad group-hover/row:opacity-100"
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6" /><path d="M10 11v6M14 11v6" />
      </svg>
    </button>
  );
}

export function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line/90 bg-panel/40 px-3 py-1.5 text-xs font-medium text-mute transition-all hover:border-accent/50 hover:bg-accent/5 hover:text-accent2"
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      {children}
    </button>
  );
}
