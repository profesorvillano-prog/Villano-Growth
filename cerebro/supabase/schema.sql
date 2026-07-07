-- Cerebro Villano · esquema Supabase (Postgres)
-- Ejecutar en el SQL Editor de un proyecto Supabase dedicado.
-- Fase 2: la app reemplaza el store local por estas tablas vía supabase-js.

create table users (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text unique not null,
  rol text not null check (rol in ('admin', 'miembro'))
);

create table clients (
  id text primary key,                -- slug: family, marcelo, ezequiel…
  nombre text not null,
  nicho text,
  oferta text,
  initials text,
  color text,
  estado text not null default 'activo',
  notion_url text,
  ciclo_ancla date not null           -- inicio del ciclo de 14 días (escalonado)
);

create table client_strategies (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade,
  pilares text,
  frecuencia_feed text,
  pauta_historias text,
  tono text,
  oferta text,
  vigente_desde date not null default current_date
);

create table collaborators (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade,
  nombre text not null,
  rol_texto text                      -- setter, editor, infoproductor…
);

create type area as enum ('organico', 'trafico', 'embudos', 'ventas', 'agencia');
create type cadencia as enum ('diaria', 'dias', 'semanal', '14d', 'mensual');

create table recurring_actions (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade, -- null = agencia
  area area not null,
  nombre text not null,
  cadencia cadencia not null,
  dias smallint[],                    -- 0=Lun … 6=Dom
  r_user uuid references users(id),
  a_user uuid references users(id),
  r_collaborator uuid references collaborators(id), -- para Cliente/Setter
  activa boolean not null default true
);

create table action_instances (
  id uuid primary key default gen_random_uuid(),
  action_id uuid references recurring_actions(id) on delete cascade,
  fecha_objetivo date not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'hecho', 'no_aplica', 'bloqueado')),
  nota text,
  completed_by uuid references users(id),
  completed_at timestamptz,
  unique (action_id, fecha_objetivo)
);

-- Métricas de embudo: 1 fila = 1 semana de 1 cliente (taxonomía del Excel)
create table funnel_weeks (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade,
  tipo text not null check (tipo in ('HT', 'LT')),
  anio smallint not null,
  semana smallint not null,           -- ISO week
  inversion numeric, impresiones int, alcance int, frecuencia numeric,
  cpm numeric, clics int, ctr numeric, cpc numeric,
  visitas_lp int, plays_vsl int, play_rate numeric, engagement_vsl numeric,
  leads int, tasa_lp_lead numeric, cpl numeric,
  agendas int, tasa_lead_agenda numeric, costo_agenda numeric,
  show_ups int, show_up_rate numeric,
  checkouts int, tasa_visita_checkout numeric,
  compras int, tasa_checkout_compra numeric, cvr_total numeric,
  cierres int, close_rate numeric,
  ticket numeric, facturacion numeric, cac numeric, cpa numeric, roas numeric,
  unique (client_id, tipo, anio, semana)
);

-- Orgánico: resumen por ciclo (el detalle pieza a pieza vive en GHL)
create table organic_cycles (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade,
  ciclo_inicio date not null,
  alcance int, nuevos_seguidores int, tasa_interaccion numeric,
  guardados int, compartidos int, mensajes int, leads int,
  piezas_plan smallint, piezas_publicadas smallint,
  unique (client_id, ciclo_inicio)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade,
  ciclo_inicio date not null,
  ciclo_fin date not null,
  snapshot jsonb,                     -- métricas congeladas al cierre
  funciono text[],
  no_funciono text[],
  decisiones text[]
);

create table commitments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id) on delete cascade,
  descripcion text not null,
  r_user uuid references users(id),
  fecha_limite date,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'hecho'))
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  client_id text references clients(id) on delete cascade,
  area area not null,
  nombre text not null,
  metrica text not null,              -- clave de la métrica origen (ej. facturacion, roas, agendas)
  objetivo numeric not null,
  plazo text,
  estado text not null default 'activa'
);

create table benchmarks (
  metrica text primary key,
  rango text not null,                -- texto de referencia (ej. '>1,5% bueno')
  verde_min numeric, verde_max numeric,
  fuente text default 'Benchmark 2026'
);

-- RLS: activar y permitir solo a usuarios autenticados (equipo)
alter table users enable row level security;
alter table clients enable row level security;
alter table client_strategies enable row level security;
alter table collaborators enable row level security;
alter table recurring_actions enable row level security;
alter table action_instances enable row level security;
alter table funnel_weeks enable row level security;
alter table organic_cycles enable row level security;
alter table reviews enable row level security;
alter table commitments enable row level security;
alter table goals enable row level security;
alter table benchmarks enable row level security;

do $$
declare t text;
begin
  foreach t in array array['users','clients','client_strategies','collaborators','recurring_actions','action_instances','funnel_weeks','organic_cycles','reviews','commitments','goals','benchmarks']
  loop
    execute format('create policy "equipo autenticado" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ============================================================================
-- FASE 2 · Estado real en Supabase (proyecto "Villano OS")
-- ============================================================================

-- Estado compartido de la app (un documento editable por todo el equipo)
create table if not exists app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);

-- Marcas del tracker: presencia de fila = marcado
-- done = R ejecutó · reviewed = A revisó
create table if not exists checks (
  action_id  text not null,
  day        date not null,
  kind       text not null check (kind in ('done','reviewed')),
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz default now(),
  primary key (action_id, day, kind)
);

-- Métricas de Meta Ads (las carga una automatización externa: Facebook → Supabase)
create table if not exists campaign_metrics (
  id bigint generated always as identity primary key,
  cliente text not null,          -- slug del cliente (ej. family_eaters)
  fecha date not null,
  account_id text, account_name text, currency text,
  campaign_id text, campaign_name text, objective text,
  spend numeric, impressions bigint, reach bigint, frequency numeric,
  clicks bigint, ctr numeric, cpc numeric, cpm numeric,
  roas_meta numeric, purchase_value numeric, leads bigint, purchases bigint,
  raw jsonb, synced_at timestamptz default now()
);

-- RLS: todas restringidas a usuarios autenticados (el equipo).
-- (políticas equivalentes creadas vía migración villano_os_state_and_checks)
