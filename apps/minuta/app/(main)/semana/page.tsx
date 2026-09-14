import { loadEntries } from "@/lib/data";
import { WeekView } from "@/components/week-view";
import { addDays, todayISO, weekStart } from "@/lib/dates";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export default async function SemanaPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w } = await searchParams;
  const start = w && ISO.test(w) ? weekStart(w) : weekStart(todayISO());
  const entries = await loadEntries(start, addDays(start, 6));

  return <WeekView start={start} entries={entries} />;
}
