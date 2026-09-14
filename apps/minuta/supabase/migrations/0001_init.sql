-- Minuta — esquema inicial
-- Tablas con prefijo minuta_ para poder convivir con otras apps en el mismo proyecto.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- grupos
create table if not exists minuta_groups (
  key            text primary key,
  label          text not null,
  short_label    text not null,
  sort           int  not null,
  color          text not null,
  kcal           numeric not null default 0,
  protein_g      numeric not null default 0,
  carbs_g        numeric not null default 0,
  fat_g          numeric not null default 0,
  is_free        boolean not null default false,
  portion_hint   text
);

-- ---------------------------------------------------------------- perfil
create table if not exists minuta_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  peso_kg     numeric,
  estatura_cm numeric,
  edad        int,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- pauta
create table if not exists minuta_plans (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  nombre       text not null default 'Pauta',
  objetivo     text,
  kcal         numeric,
  protein_g    numeric,
  carbs_g      numeric,
  fat_g        numeric,
  proximo_control text,
  notas        text[] not null default '{}',
  activo       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- porciones diarias por grupo
create table if not exists minuta_plan_targets (
  plan_id    uuid not null references minuta_plans(id) on delete cascade,
  group_key  text not null references minuta_groups(key),
  portions   numeric not null default 0,
  primary key (plan_id, group_key)
);

-- tiempos de comida y cuántas porciones de cada grupo van en cada uno
create table if not exists minuta_plan_meals (
  id         uuid primary key default gen_random_uuid(),
  plan_id    uuid not null references minuta_plans(id) on delete cascade,
  meal_key   text not null,
  label      text not null,
  horario    text,
  ejemplo    text,
  sort       int not null default 0,
  targets    jsonb not null default '{}'::jsonb,  -- {"cereales":{"min":2,"max":2}, ...}
  unique (plan_id, meal_key)
);

-- ------------------------------------------------- lista de intercambio
create table if not exists minuta_foods (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade, -- null = global
  group_key      text not null references minuta_groups(key),
  nombre         text not null,
  portion_label  text not null,          -- cuánto es UNA porción
  gramos         numeric,
  extra_group    text references minuta_groups(key), -- ej: legumbres = cereal + proteína
  extra_portions numeric default 0,
  nota           text,
  favorito       boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists minuta_foods_group_idx on minuta_foods (group_key);
create index if not exists minuta_foods_user_idx  on minuta_foods (user_id);

-- ------------------------------------------------------- registro diario
create table if not exists minuta_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  fecha      date not null,
  meal_key   text not null,
  food_id    uuid references minuta_foods(id) on delete set null,
  nombre     text not null,
  group_key  text not null references minuta_groups(key),
  portions   numeric not null default 1,
  batch_id   uuid not null default gen_random_uuid(), -- agrupa alimentos que suman a 2 grupos
  created_at timestamptz not null default now()
);
create index if not exists minuta_entries_user_fecha_idx on minuta_entries (user_id, fecha);

-- ------------------------------------------------------------ hidratación
create table if not exists minuta_water (
  user_id uuid not null references auth.users(id) on delete cascade,
  fecha   date not null,
  ml      int  not null default 0,
  primary key (user_id, fecha)
);

-- --------------------------------------------------------- suplementos
create table if not exists minuta_supplements (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  nombre    text not null,
  dosis     text,
  cuando    text,
  nota      text,
  diario    boolean not null default true,
  sort      int not null default 0
);

create table if not exists minuta_supplement_log (
  user_id       uuid not null references auth.users(id) on delete cascade,
  supplement_id uuid not null references minuta_supplements(id) on delete cascade,
  fecha         date not null,
  primary key (user_id, supplement_id, fecha)
);

-- --------------------------------------------------------------- RLS
alter table minuta_groups          enable row level security;
alter table minuta_profiles        enable row level security;
alter table minuta_plans           enable row level security;
alter table minuta_plan_targets    enable row level security;
alter table minuta_plan_meals      enable row level security;
alter table minuta_foods           enable row level security;
alter table minuta_entries         enable row level security;
alter table minuta_water           enable row level security;
alter table minuta_supplements     enable row level security;
alter table minuta_supplement_log  enable row level security;

-- grupos: catálogo de lectura para cualquiera autenticado
drop policy if exists minuta_groups_read on minuta_groups;
create policy minuta_groups_read on minuta_groups
  for select to authenticated using (true);

-- perfil
drop policy if exists minuta_profiles_all on minuta_profiles;
create policy minuta_profiles_all on minuta_profiles
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- pauta
drop policy if exists minuta_plans_all on minuta_plans;
create policy minuta_plans_all on minuta_plans
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists minuta_plan_targets_all on minuta_plan_targets;
create policy minuta_plan_targets_all on minuta_plan_targets
  for all to authenticated
  using (exists (select 1 from minuta_plans p where p.id = plan_id and p.user_id = auth.uid()))
  with check (exists (select 1 from minuta_plans p where p.id = plan_id and p.user_id = auth.uid()));

drop policy if exists minuta_plan_meals_all on minuta_plan_meals;
create policy minuta_plan_meals_all on minuta_plan_meals
  for all to authenticated
  using (exists (select 1 from minuta_plans p where p.id = plan_id and p.user_id = auth.uid()))
  with check (exists (select 1 from minuta_plans p where p.id = plan_id and p.user_id = auth.uid()));

-- alimentos: los globales (user_id null) se leen; los propios se editan
drop policy if exists minuta_foods_read on minuta_foods;
create policy minuta_foods_read on minuta_foods
  for select to authenticated using (user_id is null or user_id = auth.uid());

drop policy if exists minuta_foods_insert on minuta_foods;
create policy minuta_foods_insert on minuta_foods
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists minuta_foods_update on minuta_foods;
create policy minuta_foods_update on minuta_foods
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists minuta_foods_delete on minuta_foods;
create policy minuta_foods_delete on minuta_foods
  for delete to authenticated using (user_id = auth.uid());

-- registro
drop policy if exists minuta_entries_all on minuta_entries;
create policy minuta_entries_all on minuta_entries
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists minuta_water_all on minuta_water;
create policy minuta_water_all on minuta_water
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists minuta_supplements_all on minuta_supplements;
create policy minuta_supplements_all on minuta_supplements
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists minuta_supplement_log_all on minuta_supplement_log;
create policy minuta_supplement_log_all on minuta_supplement_log
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ------------------------------------------- favoritos por uso (vista)
create or replace view minuta_food_usage
with (security_invoker = true) as
  select e.user_id, e.food_id, count(*) as veces, max(e.created_at) as ultima
  from minuta_entries e
  where e.food_id is not null
  group by e.user_id, e.food_id;
