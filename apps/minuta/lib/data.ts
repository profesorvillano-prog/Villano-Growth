import { createClient } from "@/lib/supabase/server";
import type {
  Entry,
  Food,
  Group,
  GroupKey,
  Meal,
  Plan,
  Supplement,
  Targets,
} from "@/lib/types";

export type PlanBundle = {
  userId: string;
  plan: Plan;
  targets: Targets;
  meals: Meal[];
  groups: Group[];
  foods: Food[];
  supplements: Supplement[];
};

const EMPTY_TARGETS: Targets = {
  cereales: 0,
  frutas: 0,
  verduras: 0,
  verduras_libres: 0,
  proteinas: 0,
  lacteos: 0,
  grasas: 0,
};

/** Pauta + catálogo. Si el usuario no tiene pauta, se le instala la base. */
export async function loadPlanBundle(): Promise<PlanBundle | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: groups }, { data: foods }] = await Promise.all([
    supabase.from("minuta_groups").select("*").order("sort"),
    supabase
      .from("minuta_foods")
      .select("id,user_id,group_key,nombre,portion_label,gramos,extra_group,extra_portions,nota")
      .order("nombre"),
  ]);

  let { data: plans } = await supabase
    .from("minuta_plans")
    .select("*")
    .eq("activo", true)
    .limit(1);

  if (!plans?.length) {
    await supabase.rpc("minuta_bootstrap_me");
    const retry = await supabase.from("minuta_plans").select("*").eq("activo", true).limit(1);
    plans = retry.data ?? [];
  }

  const plan = plans?.[0];
  if (!plan || !groups) return null;

  const [{ data: targetRows }, { data: mealRows }, { data: supplements }] = await Promise.all([
    supabase.from("minuta_plan_targets").select("group_key,portions").eq("plan_id", plan.id),
    supabase.from("minuta_plan_meals").select("*").eq("plan_id", plan.id).order("sort"),
    supabase.from("minuta_supplements").select("*").order("sort"),
  ]);

  const targets: Targets = { ...EMPTY_TARGETS };
  for (const row of targetRows ?? []) {
    targets[row.group_key as GroupKey] = Number(row.portions);
  }

  return {
    userId: user.id,
    plan: plan as Plan,
    targets,
    meals: (mealRows ?? []) as Meal[],
    groups: groups as Group[],
    foods: (foods ?? []) as Food[],
    supplements: (supplements ?? []) as Supplement[],
  };
}

export async function loadEntries(from: string, to: string): Promise<Entry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("minuta_entries")
    .select("id,fecha,meal_key,food_id,nombre,group_key,portions,batch_id")
    .gte("fecha", from)
    .lte("fecha", to)
    .order("created_at");
  return (data ?? []) as Entry[];
}

export async function loadWater(fecha: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("minuta_water")
    .select("ml")
    .eq("fecha", fecha)
    .maybeSingle();
  return data?.ml ?? 0;
}

export async function loadSupplementLog(fecha: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("minuta_supplement_log")
    .select("supplement_id")
    .eq("fecha", fecha);
  return (data ?? []).map((r) => r.supplement_id as string);
}
