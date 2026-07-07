"use client";

import { createClient } from "@supabase/supabase-js";

// Proyecto "Villano OS". La publishable key está pensada para exponerse en el
// cliente; los datos quedan protegidos por Auth + RLS (solo usuarios del equipo).
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://bkyufepwfwzjzrriptmc.supabase.co";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_c7T1DNKIdOfetROvsO1Cpw_xDFJ22f2";

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
