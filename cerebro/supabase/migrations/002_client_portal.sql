-- ============================================================================
-- Villano OS · Portal del cliente + colecciones editables
-- Ejecutar en el SQL Editor del proyecto "Villano OS".
--   · profiles: rol (admin | equipo | cliente) + client_id (slug del cliente)
--   · content_pieces: planificador de contenido (crear pieza, marcar publicada)
--   · tasks: tareas livianas por cliente
--   · accesos: links y credenciales por cliente
-- RLS: el equipo ve/edita todo; cada cliente solo su propio contenido.
-- ============================================================================

-- ---------------- Perfiles (rol + cliente asignado) ----------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nombre text,
  rol text not null default 'cliente' check (rol in ('admin', 'equipo', 'cliente')),
  client_id text,               -- slug canónico del cliente (family, marcelo, ezequiel, fixus)
  created_at timestamptz default now()
);

-- Helpers de rol (security definer para poder leer profiles dentro de las policies)
create or replace function public.is_team() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.rol in ('admin', 'equipo'));
$$;

create or replace function public.my_client() returns text
  language sql stable security definer set search_path = public as $$
  select client_id from profiles where id = auth.uid();
$$;

-- Alta automática de perfil al registrarse. El dueño entra como admin;
-- el resto entra como 'cliente' sin cliente asignado (no ve nada hasta que
-- el equipo le setee client_id). Agregar aquí más emails del equipo si hace falta.
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, rol)
  values (
    new.id,
    new.email,
    case when lower(new.email) in ('profesorvillano@gmail.com') then 'admin' else 'cliente' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table profiles enable row level security;
drop policy if exists prof_self on profiles;
drop policy if exists prof_team on profiles;
create policy prof_self on profiles for select to authenticated
  using (id = auth.uid() or public.is_team());
create policy prof_team on profiles for all to authenticated
  using (public.is_team()) with check (public.is_team());

-- ---------------- Piezas de contenido (planificador) ----------------
create table if not exists content_pieces (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,                 -- slug canónico del cliente
  titulo text not null,
  formato text default 'Reel',           -- Reel · Carrusel · Post · Story · Video · Otro
  pilar text,
  gancho text,
  estado text not null default 'Idea'
    check (estado in ('Idea', 'Planificado', 'Revisado', 'Grabado', 'Publicado')),
  fecha_plan date,
  fecha_pub date,
  link text,
  notas text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create index if not exists content_pieces_cliente_idx on content_pieces (cliente);

-- ---------------- Tareas livianas ----------------
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  titulo text not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_curso', 'hecho')),
  responsable text,
  fecha date,
  notas text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create index if not exists tasks_cliente_idx on tasks (cliente);

-- ---------------- Accesos (links y credenciales) ----------------
create table if not exists accesos (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  nombre text not null,
  categoria text,                        -- Redes · Ads · CRM · Pagos · Web · Automatización · Otro
  url text,
  usuario text,
  secreto text,
  notas text,
  created_at timestamptz default now()
);
create index if not exists accesos_cliente_idx on accesos (cliente);

-- ---------------- RLS: equipo ve todo · cliente solo lo suyo ----------------
do $$
declare t text;
begin
  foreach t in array array['content_pieces', 'tasks', 'accesos']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_team', t);
    execute format('drop policy if exists %I on %I', t || '_client_sel', t);
    execute format('drop policy if exists %I on %I', t || '_client_ins', t);
    execute format('drop policy if exists %I on %I', t || '_client_upd', t);
    execute format('drop policy if exists %I on %I', t || '_client_del', t);
    -- equipo: acceso total
    execute format('create policy %I on %I for all to authenticated using (public.is_team()) with check (public.is_team())', t || '_team', t);
    -- cliente: solo filas de su propio cliente
    execute format('create policy %I on %I for select to authenticated using (cliente = public.my_client())', t || '_client_sel', t);
    execute format('create policy %I on %I for insert to authenticated with check (cliente = public.my_client())', t || '_client_ins', t);
    execute format('create policy %I on %I for update to authenticated using (cliente = public.my_client()) with check (cliente = public.my_client())', t || '_client_upd', t);
    execute format('create policy %I on %I for delete to authenticated using (cliente = public.my_client())', t || '_client_del', t);
  end loop;
end $$;

-- ============================================================================
-- NOTA sobre los tableros de solo-lectura del cliente (Meta Ads, Instagram,
-- GHL, Ventas): la app ya filtra cada consulta por los slugs del cliente, así
-- que el cliente solo ve sus propios números. Si además se quiere aislamiento
-- a nivel de base de datos, reemplazar la policy amplia de esas tablas por una
-- que permita: public.is_team() OR (cliente = public.my_client()).
-- Se deja fuera de esta migración para no tocar los dashboards en producción.
-- ============================================================================
