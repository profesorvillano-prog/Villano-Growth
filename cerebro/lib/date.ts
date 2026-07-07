// Fechas reales derivadas del reloj del navegador. Semana de lunes a domingo.
// DAY index: 0=Lun … 6=Dom (coincide con DAY_LABELS de data.ts).

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Índice L–D (0=Lun) de una fecha JS (getDay: 0=Dom)
function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

export function todayIndex(now: Date = new Date()): number {
  return mondayIndex(now.getDay());
}

// Lunes de la semana que contiene `now`
export function weekStart(now: Date = new Date()): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - mondayIndex(d.getDay()));
  return d;
}

// Números de día (1–31) para L..D de la semana actual
export function weekDayNumbers(now: Date = new Date()): number[] {
  const start = weekStart(now);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.getDate();
  });
}

function fmtDM(d: Date): string {
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

// "6 jul – 12 jul"
export function weekRangeLabel(now: Date = new Date()): string {
  const start = weekStart(now);
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
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${DIAS[now.getDay()]} ${now.getDate()} de ${meses[now.getMonth()]}`;
}
