export type GroupKey =
  | "cereales"
  | "frutas"
  | "verduras"
  | "verduras_libres"
  | "proteinas"
  | "lacteos"
  | "grasas";

export type Group = {
  key: GroupKey;
  label: string;
  short_label: string;
  sort: number;
  color: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_free: boolean;
  portion_hint: string | null;
};

export type Food = {
  id: string;
  user_id: string | null;
  group_key: GroupKey;
  nombre: string;
  portion_label: string;
  gramos: number | null;
  extra_group: GroupKey | null;
  extra_portions: number | null;
  nota: string | null;
};

export type Entry = {
  id: string;
  fecha: string;
  meal_key: string;
  food_id: string | null;
  nombre: string;
  group_key: GroupKey;
  portions: number;
  batch_id: string;
};

export type MealTarget = { min: number; max: number };

export type Meal = {
  id: string;
  meal_key: string;
  label: string;
  horario: string | null;
  ejemplo: string | null;
  sort: number;
  targets: Partial<Record<GroupKey, MealTarget>>;
};

export type Plan = {
  id: string;
  nombre: string;
  objetivo: string | null;
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  proximo_control: string | null;
  notas: string[];
};

export type Supplement = {
  id: string;
  nombre: string;
  dosis: string | null;
  cuando: string | null;
  nota: string | null;
  diario: boolean;
  sort: number;
};

export type Targets = Record<GroupKey, number>;

export type Macros = { kcal: number; protein: number; carbs: number; fat: number };
