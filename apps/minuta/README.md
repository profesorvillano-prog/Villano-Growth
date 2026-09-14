# Minuta

App para llevar la pauta nutricional por **porciones de intercambio**: qué puedo
elegir en cada comida, qué ya comí hoy y qué me falta, y la semana completa de un
vistazo.

Construida sobre la minuta de Daniel Tapia Villanueva (nutricionista
clínico-deportivo): 2105 kcal · 147 g proteína · 247 g carbohidrato · 59 g grasa.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4) desplegado en Vercel
- **Supabase** (Postgres + Auth) con RLS: cada usuario solo ve sus datos

## Pantallas

| Pantalla | Para qué |
|---|---|
| **Hoy** | Porciones consumidas/restantes por grupo, kcal y macros del día, tarjetas por tiempo de comida con lo que indica la pauta, hidratación y suplementos. Flechas ‹ › para moverse día a día. |
| **Semana** | Matriz grupos × días con lo consumido, kcal y % de adherencia por día. Se desliza de lado para cambiar de semana. |
| **Alimentos** | La lista de intercambio completa por grupo, con cuánto es 1 porción, buscador y creación de alimentos propios. Permite registrar directo a hoy. |
| **Pauta** | La minuta completa: porciones diarias (editables), tiempos de comida, suplementación, hidratación y recomendaciones. |

## Modelo de datos

Todas las tablas usan el prefijo `minuta_` para poder convivir con otras apps en
el mismo proyecto de Supabase.

- `minuta_groups` — los 7 grupos de intercambio con macros por porción
- `minuta_foods` — lista de intercambio (globales con `user_id null` + propios)
- `minuta_plans`, `minuta_plan_targets`, `minuta_plan_meals` — la pauta
- `minuta_entries` — cada porción registrada (fecha, comida, grupo, porciones)
- `minuta_water`, `minuta_supplements`, `minuta_supplement_log`

Un alimento que suma a dos grupos (lentejas = 1 proteína + 1 cereal) se guarda
como dos filas con el mismo `batch_id`, y se muestra y edita como una sola cosa.

## Puesta en marcha

1. Crear el proyecto en Supabase y aplicar las migraciones en orden:

   ```
   supabase/migrations/0001_init.sql
   supabase/migrations/0002_groups.sql
   supabase/migrations/0003_foods.sql
   supabase/migrations/0004_bootstrap.sql
   ```

2. Crear el usuario (Authentication → Users → Add user, con "Auto Confirm").
   El trigger `minuta_auth_user_created` le instala la pauta base al momento.

3. Variables de entorno (Vercel → Settings → Environment Variables y `.env.local`):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
   ```

4. Local: `npm install && npm run dev`. En Vercel el *root directory* del
   proyecto es `apps/minuta`.

## Detalle sobre las porciones

Las kcal y macros por porción están calibrados para que la suma de la pauta
(5 cereales, 3 frutas, 2 verduras + 2 libres, 10 proteínas, 3 lácteos, 5 grasas)
dé los totales de la minuta. Las porciones de grasa se tomaron como
**1 cucharadita (5 g)**: con cucharadas de 15 g el total de grasa del día se iría
muy por encima de los 59 g indicados. Vale la pena confirmarlo en el próximo
control.

La lista de intercambio viene de las listas chilenas estándar por grupo, porque
el PDF de la minuta trae la pauta y los totales, no el listado de alimentos.
Se puede editar y ampliar desde la pantalla **Alimentos**.
