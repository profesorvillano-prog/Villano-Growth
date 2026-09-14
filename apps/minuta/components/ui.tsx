"use client";

import { useEffect } from "react";

export function Bar({
  value,
  target,
  color,
  className = "",
}: {
  value: number;
  target: number;
  color: string;
  className?: string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : value > 0 ? 100 : 0;
  const over = target > 0 && value > target;
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{
          width: `${pct}%`,
          background: over ? "#ef6b5e" : color,
        }}
      />
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  step = 0.5,
  min = 0.5,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-surface-2 p-0.5">
      <button
        type="button"
        aria-label="Quitar media porción"
        onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted active:bg-line"
      >
        −
      </button>
      <span className="tnum min-w-7 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Agregar media porción"
        onClick={() => onChange(Math.round((value + step) * 100) / 100)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted active:bg-line"
      >
        +
      </button>
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="fade-in absolute inset-0 bg-black/60"
      />
      <div className="sheet-in relative flex max-h-[92dvh] flex-col rounded-t-3xl border-t border-line bg-bg">
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div
            className="border-t border-line px-5 py-3"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Toast({ text, onUndo }: { text: string; onUndo?: () => void }) {
  return (
    <div className="fade-in pointer-events-auto fixed inset-x-0 bottom-16 z-40 mx-auto flex w-fit items-center gap-3 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm shadow-lg">
      <span>{text}</span>
      {onUndo && (
        <button onClick={onUndo} className="font-semibold text-gold">
          Deshacer
        </button>
      )}
    </div>
  );
}
