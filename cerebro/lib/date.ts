// Fechas reales derivadas del reloj del navegador. Semana de lunes a domingo.
// Soporta navegación por semanas (offset en semanas) y claves por fecha real.
// DAY index: 0=Lun … 6=Dom (coincide con DAY_LABELS de data.ts).

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Ancla para el ritmo quincenal (un lunes). Las semanas alternas son "de reunión".
const ANCHOR = new Date(2026, 6, 6); // lun 6 jul 2026
const DAY_MS = 86400000;

function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

export function todayIndex(now: Date = new Date()): number {
  return mondayIndex(now.getDay());
}

// Lunes de la semana actual + offset semanas
export function weekStart(offset = 0, now: Date = new Date()): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - mondayIndex(d.getDay()) + offset * 7);
  return d;
}

// Las 7 fechas (Date) L..D de la semana con ese offset
export function weekDates(offset = 0, now: Date = new Date()): Date[] {
  const start = weekStart(offset, now);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function weekDayNumbers(offset = 0, now: Date = new Date()): number[] {
  return weekDates(offset, now).map((d) => d.getDate());
}

// Clave estable por fecha: "YYYY-MM-DD"
export function isoKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function todayIso(now: Date = new Date()): string {
  return isoKey(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
}

// ¿La semana con ese offset es semana de ciclo quincenal?
export function isBiweeklyWeek(offset = 0, now: Date = new Date()): boolean {
  const start = weekStart(offset, now);
  const weeks = Math.round((start.getTime() - ANCHOR.getTime()) / (DAY_MS * 7));
  return (((weeks % 2) + 2) % 2) === 0;
}

function fmtDM(d: Date): string {
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

// "6 jul – 12 jul"
export function weekRangeLabel(offset = 0, now: Date = new Date()): string {
  const start = weekStart(offset, now);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${fmtDM(start)} – ${fmtDM(end)}`;
}

// "Martes 7"
export function todayLabel(now: Date = new Date()): string {
  return `${DIAS[now.getDay()]} ${now.getDate()}`;
}

// "Martes 7 de julio"
export function todayLongLabel(now: Date = new Date()): string {
  return `${DIAS[now.getDay()]} ${now.getDate()} de ${MESES_LARGO[now.getMonth()]}`;
}
