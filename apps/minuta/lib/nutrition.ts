import type { Entry, Group, GroupKey, Macros, Targets } from "./types";

export function portionsByGroup(entries: Entry[]): Partial<Record<GroupKey, number>> {
  const out: Partial<Record<GroupKey, number>> = {};
  for (const e of entries) out[e.group_key] = (out[e.group_key] ?? 0) + Number(e.portions);
  return out;
}

export function macrosOf(entries: Entry[], groups: Group[]): Macros {
  const byKey = new Map(groups.map((g) => [g.key, g]));
  const total: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const e of entries) {
    const g = byKey.get(e.group_key);
    if (!g) continue;
    const p = Number(e.portions);
    total.kcal += g.kcal * p;
    total.protein += g.protein_g * p;
    total.carbs += g.carbs_g * p;
    total.fat += g.fat_g * p;
  }
  return total;
}

export function targetMacros(targets: Targets, groups: Group[]): Macros {
  const total: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const g of groups) {
    const p = targets[g.key] ?? 0;
    total.kcal += g.kcal * p;
    total.protein += g.protein_g * p;
    total.carbs += g.carbs_g * p;
    total.fat += g.fat_g * p;
  }
  return total;
}

/** 1 -> "1", 1.5 -> "1½", 0.5 -> "½", 2.25 -> "2,25" */
export function fmtPortions(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const whole = Math.floor(abs);
  const rest = Math.round((abs - whole) * 100) / 100;
  const frac = rest === 0.5 ? "½" : rest === 0.25 ? "¼" : rest === 0.75 ? "¾" : "";
  if (frac) return `${sign}${whole === 0 ? "" : whole}${frac}`;
  if (rest === 0) return `${sign}${whole}`;
  return `${sign}${abs.toFixed(2).replace(".", ",").replace(/,?0+$/, "")}`;
}

export function fmtKcal(n: number): string {
  return Math.round(n).toLocaleString("es-CL");
}
