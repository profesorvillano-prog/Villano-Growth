-- Al crear un usuario se le instala la pauta base (la de la minuta en PDF).
-- Después puede editar porciones y tiempos de comida desde la app.
create or replace function minuta_bootstrap_user(p_user uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan uuid;
begin
  insert into minuta_profiles (id, nombre, peso_kg, estatura_cm, edad)
  values (p_user, null, 78.4, 174, 30)
  on conflict (id) do nothing;

  select id into v_plan from minuta_plans where user_id = p_user and activo limit 1;
  if v_plan is not null then
    return v_plan;
  end if;

  insert into minuta_plans (user_id, nombre, objetivo, kcal, protein_g, carbs_g, fat_g, proximo_control, notas)
  values (
    p_user,
    'Plan de alimentación diaria',
    'Rendimiento y recomposición corporal',
    2105, 147, 247, 59,
    'Última semana de Octubre',
    array[
      'Si es más cómodo consumir algunas porciones en un horario distinto al indicado, es válido.',
      'Si algún día no tienes mucho apetito, privilegia proteínas (carnes, huevos y lácteos) y verduras por sobre grasas y carbohidratos.',
      '1 lata de cerveza de 300 cc o 1 copa de vino ≈ 140 kcal = 1 porción de cereal. Evita el alcohol al máximo.',
      'Dormir mínimo 7 horas. Consumir 2 kiwis 1 hora antes de dormir puede ayudar.',
      'Consumir pescados y legumbres 2 veces a la semana.',
      'Tienes 5 porciones de aceites/grasas para repartir en todo el día, a comodidad.',
      'Respetar las porciones totales del día.'
    ]
  )
  returning id into v_plan;

  insert into minuta_plan_targets (plan_id, group_key, portions) values
    (v_plan,'cereales',5),
    (v_plan,'frutas',3),
    (v_plan,'verduras',2),
    (v_plan,'verduras_libres',2),
    (v_plan,'proteinas',10),
    (v_plan,'lacteos',3),
    (v_plan,'grasas',5);

  insert into minuta_plan_meals (plan_id, meal_key, label, horario, ejemplo, sort, targets) values
    (v_plan,'desayuno','Desayuno','Cerca de las 13 hrs.',
     '3 huevos revueltos + 2 dientes de marraqueta + 200-400 cc de leche', 1,
     '{"cereales":{"min":2,"max":2},"proteinas":{"min":2,"max":2},"lacteos":{"min":1,"max":2}}'::jsonb),
    (v_plan,'colaciones','Colaciones','A lo largo del día',
     'Para picotear. Puedes mover porciones desde otros tiempos de comida si lo necesitas. 1 scoop de proteína = 2 porciones de proteína.', 2,
     '{"lacteos":{"min":1,"max":2},"frutas":{"min":3,"max":3},"cereales":{"min":0,"max":1},"proteinas":{"min":0,"max":2}}'::jsonb),
    (v_plan,'almuerzo','Almuerzo','Cerca de las 16-17 hrs.',
     '1½ taza de arroz, fideos o quinoa + 150-200 g de carne + 2 a 4 tazas de verduras surtidas (las salsas cuentan como verdura)', 3,
     '{"cereales":{"min":1,"max":2},"proteinas":{"min":3,"max":4},"verduras":{"min":2,"max":3}}'::jsonb),
    (v_plan,'cena','Cena','2 a 4 horas antes de dormir',
     'Repetir el almuerzo, pero con menos acompañamiento de carbohidratos.', 4,
     '{"cereales":{"min":1,"max":1},"proteinas":{"min":3,"max":4},"verduras":{"min":1,"max":3}}'::jsonb),
    (v_plan,'extras','Grasas y extras','Durante todo el día',
     '5 cucharadas de aceites/grasas: mayonesa, aceite de oliva, mantequilla de maní, crema, etc. Distribuirlas a comodidad.', 5,
     '{"grasas":{"min":5,"max":5}}'::jsonb);

  insert into minuta_supplements (user_id, nombre, dosis, cuando, nota, diario, sort) values
    (p_user,'Creatina monohidratada','3-5 g (1 cucharadita de té)','Todos los días','Ej: Ultimate Nutrition',true,1),
    (p_user,'Proteína (opcional S.O.S.)','1 scoop = 2 porciones de carnes magras','1-2 h antes o después de musculación','Sugerida: Prostar de Ultimate Nutrition',false,2),
    (p_user,'Ashwagandha','Según indicación del envase','Diario','Adaptógeno que regula el estrés y las hormonas sexuales. Sugerida: African Root o Vitamin Outlet',true,3),
    (p_user,'Cafeína / pre entreno (S.O.S.)','200 mg (1 pastilla o 1 dosis)','30-60 min antes de entrenar',null,false,4);

  return v_plan;
end;
$$;

revoke all on function minuta_bootstrap_user(uuid) from public;
grant execute on function minuta_bootstrap_user(uuid) to authenticated, service_role;

-- El usuario solo puede instalar la pauta para sí mismo.
create or replace function minuta_bootstrap_me()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'no session';
  end if;
  return minuta_bootstrap_user(auth.uid());
end;
$$;

revoke all on function minuta_bootstrap_me() from public;
grant execute on function minuta_bootstrap_me() to authenticated;

-- Trigger: cada usuario nuevo arranca con la pauta instalada.
create or replace function minuta_on_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform minuta_bootstrap_user(new.id);
  return new;
end;
$$;

drop trigger if exists minuta_auth_user_created on auth.users;
create trigger minuta_auth_user_created
  after insert on auth.users
  for each row execute function minuta_on_auth_user_created();
