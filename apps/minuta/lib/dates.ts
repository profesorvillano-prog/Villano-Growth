const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const DIAS_CORTOS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** YYYY-MM-DD en horario local, sin sorpresas de zona horaria. */
export function toISODate(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** La app vive en horario de Chile: el "hoy" es el mismo en servidor y teléfono. */
export const TZ = "America/Santiago";

export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Lunes de la semana de `iso`. */
export function weekStart(iso: string): string {
  const d = parseISODate(iso);
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff);
  return toISODate(d);
}

export function weekDays(startISO: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startISO, i));
}

export function dayName(iso: string): string {
  return DIAS[parseISODate(iso).getDay()];
}

export function dayShort(iso: string): string {
  return DIAS_CORTOS[parseISODate(iso).getDay()];
}

export function dayNumber(iso: string): number {
  return parseISODate(iso).getDate();
}

export function monthShort(iso: string): string {
  return MESES[parseISODate(iso).getMonth()];
}

/** "sábado 14 de sep" */
export function longLabel(iso: string): string {
  return `${dayName(iso)} ${dayNumber(iso)} de ${monthShort(iso)}`;
}

export function relativeLabel(iso: string): string | null {
  const t = todayISO();
  if (iso === t) return "Hoy";
  if (iso === addDays(t, -1)) return "Ayer";
  if (iso === addDays(t, 1)) return "Mañana";
  return null;
}

/** "8 – 14 de sep" / "29 de sep – 5 de oct" */
export function weekLabel(startISO: string): string {
  const end = addDays(startISO, 6);
  const sameMonth = monthShort(startISO) === monthShort(end);
  return sameMonth
    ? `${dayNumber(startISO)} – ${dayNumber(end)} de ${monthShort(end)}`
    : `${dayNumber(startISO)} de ${monthShort(startISO)} – ${dayNumber(end)} de ${monthShort(end)}`;
}
