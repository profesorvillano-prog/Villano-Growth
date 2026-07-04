"use client";

// Tabla de embudo semanal (taxonomía del Excel de métricas) con benchmarks y semáforo.

import { FunnelRow, fmtVal } from "@/lib/data";
import { StatusDot } from "./ui";

export function FunnelTable({ rows }: { rows: FunnelRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-dim">
            <th className="py-2 pl-5 pr-3 text-left font-medium">Métrica</th>
            {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((s) => (
              <th key={s} className="px-3 py-2 text-right font-medium">{s}</th>
            ))}
            <th className="py-2 pl-3 pr-5 text-right font-medium">Benchmark 2026</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <FragmentRow key={i} row={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FragmentRow({ row }: { row: FunnelRow }) {
  return (
    <>
      {row.section && (
        <tr>
          <td colSpan={6} className="border-t border-line bg-panel/60 py-1.5 pl-5 text-[11px] font-semibold uppercase tracking-wide text-accent2">
            {row.section}
          </td>
        </tr>
      )}
      <tr className="border-t border-line/60 hover:bg-soft/30">
        <td className="py-2 pl-5 pr-3 text-mute">{row.label}<StatusDot status={row.status} /></td>
        {row.values.map((v, i) => (
          <td key={i} className={`px-3 py-2 text-right tabular-nums ${v === null ? "text-dim" : "text-ink"}`}>
            {fmtVal(v, row.fmt)}
          </td>
        ))}
        <td className="py-2 pl-3 pr-5 text-right text-xs text-dim">{row.benchmark ?? "—"}</td>
      </tr>
    </>
  );
}
