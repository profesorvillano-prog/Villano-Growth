# Cerebro Villano — Agency OS

Mockup funcional del sistema operativo interno de Villano Growth (ver
`../docs/prd-cerebro-villano.md`). Next.js 15 + Tailwind, tema oscuro SaaS.

**Estado actual:** todos los módulos navegables con datos demo de los 3
clientes (Family Eaters, Dr. Marcelo, Ezequiel). Los checks del tracker
funcionan y persisten en `localStorage`. Supabase queda listo a nivel de
esquema (`supabase/schema.sql`) para la fase 2.

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
