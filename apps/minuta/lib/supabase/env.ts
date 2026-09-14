export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Sin estas dos variables la app no puede hablar con la base de datos. */
export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Cuáles faltan, para poder decirlo en pantalla en vez de un error genérico. */
export const missingSupabaseEnv = [
  SUPABASE_URL ? null : "NEXT_PUBLIC_SUPABASE_URL",
  SUPABASE_ANON_KEY ? null : "NEXT_PUBLIC_SUPABASE_ANON_KEY",
].filter(Boolean) as string[];
