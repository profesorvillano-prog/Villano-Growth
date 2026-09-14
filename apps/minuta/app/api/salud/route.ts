import { createClient } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Chequeo de conexión: confirma que la app alcanza Supabase con su clave.
 * No devuelve datos — como visitante anónimo el RLS entrega 0 filas.
 */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("minuta_groups").select("key").limit(1);

  return Response.json(
    {
      ok: !error,
      proyecto: SUPABASE_URL,
      filas_visibles_sin_sesion: data?.length ?? 0,
      error: error?.message ?? null,
    },
    { status: error ? 503 : 200 },
  );
}
