/**
 * Proyecto de Supabase de la app.
 *
 * La URL y la clave "publishable" viven aquí a propósito, con el OK del dueño
 * del repo: son públicas por diseño (viajan al navegador en cualquier app de
 * Supabase, o sea que ya son visibles para quien abra la app) y así cada deploy
 * queda conectado sin configurar variables de entorno.
 *
 * Lo que protege los datos:
 *   - RLS en todas las tablas: cada usuario ve solo lo suyo.
 *   - Allowlist de correos (migración 0006): no se pueden crear cuentas nuevas.
 *
 * Nunca pongas aquí la service_role key: esa sí es secreta.
 *
 * Si algún día quieres sacarlas del repo, define las variables de entorno en
 * Vercel: mandan sobre estos valores.
 */
const PROYECTO_URL = "https://pzptdziyosqakkstmllo.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_Xf1qO86yq6XsX3OJHoJzkg_bzwHrefo";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || PROYECTO_URL;
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PUBLISHABLE_KEY;

export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const missingSupabaseEnv = [
  SUPABASE_URL ? null : "NEXT_PUBLIC_SUPABASE_URL",
  SUPABASE_ANON_KEY ? null : "NEXT_PUBLIC_SUPABASE_ANON_KEY",
].filter(Boolean) as string[];
