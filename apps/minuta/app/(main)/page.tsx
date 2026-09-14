import { loadEntries, loadSupplementLog, loadWater } from "@/lib/data";
import { TodayView } from "@/components/today-view";
import { todayISO } from "@/lib/dates";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export default async function HoyPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const date = d && ISO.test(d) ? d : todayISO();

  const [entries, water, supps] = await Promise.all([
    loadEntries(date, date),
    loadWater(date),
    loadSupplementLog(date),
  ]);

  return <TodayView date={date} entries={entries} water={water} supps={supps} />;
}
