"use client";

// Editores en línea: clic sobre el valor → input → Enter/blur guarda · Esc cancela.

import { useEffect, useState } from "react";
import { fmtVal } from "@/lib/data";

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
        className={`group -mx-1 rounded px-1 text-left transition-colors hover:bg-soft/60 ${className}`}
      >
        {value || <span className="text-dim">{placeholder}</span>}
        <span className="ml-1.5 text-[10px] opacity-0 transition-opacity group-hover:opacity-50">✎</span>
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
      className={`w-full min-w-24 rounded border border-accent/60 bg-panel px-1 py-0.5 outline-none ${className}`}
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
        className={`group -mx-1 rounded px-1 tabular-nums transition-colors hover:bg-soft/60 ${className}`}
      >
        {fmtVal(value, fmt)}
        <span className="ml-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-50">✎</span>
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
      className={`w-20 rounded border border-accent/60 bg-panel px-1 py-0.5 text-right tabular-nums outline-none ${className}`}
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
      className={`cursor-pointer rounded border border-line bg-panel px-1.5 py-0.5 text-xs text-mute outline-none transition-colors hover:text-ink focus:border-accent/60 ${className}`}
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
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-dim opacity-0 transition-all hover:bg-bad/15 hover:text-bad group-hover/row:opacity-100"
    >
      ×
    </button>
  );
}

export function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-accent/50 hover:text-accent2"
    >
      + {children}
    </button>
  );
}
