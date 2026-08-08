# Cerebro Villano — Ecosistema Villano Growth

Sistema operativo de Villano Growth (ver `../docs/prd-cerebro-villano.md`).
Next.js 15 + Tailwind + Supabase, tema oscuro SaaS. Dos caras del mismo
ecosistema, según el rol con el que se entra:

- **Panel de agencia** (equipo/admin): dashboard, tracker semanal, KPIs por
  miembro, métricas y campañas por cliente, metas, y por cada cliente:
  Planificador, Tareas, Calendario, Orgánico, Meta Ads, High Ticket, Ventas,
  Accesos, Revisiones y Estrategia.
- **Portal del cliente** (rol cliente): el cliente entra y ve **solo lo suyo**
  — crea piezas y las marca como publicadas (Planificador), gestiona sus
  Tareas, ve su Calendario, y visualiza en solo-lectura Instagram orgánico,
  Meta Ads, el embudo de GoHighLevel, sus ventas, sus Accesos y su Estrategia.

**Clientes:** Family Eaters, Dr. Marcelo (Salchicha Pro), Ezequiel (Raíz
Autoinmune) y Fixus (kinesiología). Las estrategias reales (embudo, oferta,
canales, métricas) están cargadas en `lib/data.ts` (`STRATEGY_DETAIL`).

**Datos en vivo:** Meta Ads (`campaign_metrics`), Instagram (`organic_content`),
embudo GHL (`ht_pipeline`) y ventas (`ventas`) llegan por automatizaciones
(Make / Meta / GHL / Hotmart). El planificador, las tareas y los accesos se
guardan en Supabase (`content_pieces`, `tasks`, `accesos`) y se ven en vivo.

## Roles y acceso (Supabase Auth + RLS)

- El rol vive en la tabla `profiles` (`admin` | `equipo` | `cliente`) con un
  `client_id` (slug: `family`, `marcelo`, `ezequiel`, `fixus`).
- Al registrarse, un trigger crea el perfil: `profesorvillano@gmail.com` entra
  como `admin`; el resto entra como `cliente` sin cliente asignado (no ve nada
  hasta que el equipo lo vincule).
- **Dar de alta el login de un cliente:** el cliente crea su cuenta en la
  pantalla de login, y luego el equipo corre:
  ```sql
  update profiles set rol = 'cliente', client_id = 'fixus'
  where email = 'natalia@fixus.cl';
  ```
- Sumar a alguien del equipo: `update profiles set rol = 'equipo' where email = '...';`
- El equipo puede previsualizar el portal de cualquier cliente en
  `/portal/<cliente>` (ej. `/portal/marcelo`).

## Base de datos

- Esquema base: `supabase/schema.sql`.
- Portal del cliente: `supabase/migrations/002_client_portal.sql`
  (profiles + content_pieces + tasks + accesos + RLS por cliente).
  Ya aplicado al proyecto **Villano OS** (`bkyufepwfwzjzrriptmc`).

## Correr local

```bash
cd cerebro
npm install
npm run dev   # http://localhost:3000
```

## Desplegar en Vercel

Opción A (recomendada): conectar el repo en vercel.com → **Root Directory:
`cerebro`** → framework Next.js autodetectado → Deploy.

Opción B: `npx vercel` desde esta carpeta.

Sugerencia: activar **Vercel Authentication / password protection** en el
proyecto mientras la app no tenga login propio.

## Conectar Supabase (fase 2)

1. Crear proyecto Supabase dedicado (ej. `cerebro-villano`).
2. Ejecutar `supabase/schema.sql` en el SQL Editor.
3. Activar Supabase Auth (email) e invitar al equipo (4 cuentas).
4. En la app: reemplazar `lib/store.tsx` y los seeds de `lib/data.ts` por
   consultas con `@supabase/supabase-js` usando
   `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (las policies RLS ya restringen todo a usuarios autenticados).

## Estructura

```
app/            páginas (Dashboard, Semana, Cliente, Metas, Config)
components/     shell, ui, tracker (grilla), metrics (tabla embudo)
lib/data.ts     tipos + seed demo (taxonomía de los Excels de métricas)
lib/store.tsx   estado de checks (localStorage → Supabase en fase 2)
supabase/       schema.sql
```
