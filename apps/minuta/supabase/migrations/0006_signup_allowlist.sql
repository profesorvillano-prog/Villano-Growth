-- La clave publishable es pública por diseño (viaja al navegador), así que el
-- registro de cuentas nuevas queda restringido a una lista de correos.
create table if not exists minuta_allowed_emails (
  email      text primary key,
  nota       text,
  created_at timestamptz not null default now()
);

alter table minuta_allowed_emails enable row level security;
-- Sin políticas: nadie la lee ni la escribe desde la API, solo el trigger.

insert into minuta_allowed_emails (email, nota) values
  ('profesorvillano@gmail.com', 'Dueño de la app')
on conflict (email) do nothing;

create or replace function minuta_guard_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from minuta_allowed_emails a where lower(a.email) = lower(new.email)
  ) then
    raise exception 'Registro no habilitado para este correo';
  end if;
  return new;
end;
$$;

revoke all on function minuta_guard_signup() from public, anon, authenticated;

drop trigger if exists minuta_auth_signup_guard on auth.users;
create trigger minuta_auth_signup_guard
  before insert on auth.users
  for each row execute function minuta_guard_signup();
