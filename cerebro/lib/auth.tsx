"use client";

// Autenticación real (Supabase Auth) + rol.
//  · equipo/admin → panel de agencia completo
//  · cliente      → portal del cliente (solo su cliente)
// El rol se lee de la tabla `profiles`. Si la tabla/fila todavía no existe
// (migración sin correr), cae a un allowlist local para no bloquear al equipo.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Allowlist de fallback: emails del equipo (mientras no exista la fila en profiles).
const TEAM_EMAILS = ["profesorvillano@gmail.com"];

export type Rol = "admin" | "equipo" | "cliente";
export interface Profile { id: string; email: string | null; rol: Rol; client_id: string | null }

interface AuthCtx {
  session: Session | null;
  email: string | null;
  profile: Profile | null;
  isTeam: boolean;
  clientId: string | null;
  ready: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  session: null, email: null, profile: null, isTeam: false, clientId: null, ready: false, signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async (s: Session | null) => {
      if (!s) { setProfile(null); return; }
      const email = s.user.email ?? null;
      const { data } = await supabase.from("profiles").select("id, email, rol, client_id").eq("id", s.user.id).maybeSingle();
      if (!active) return;
      if (data) {
        setProfile(data as Profile);
      } else {
        // Fallback: sin fila en profiles → equipo si está en el allowlist, si no cliente sin asignar.
        const isTeam = !!email && TEAM_EMAILS.includes(email.toLowerCase());
        setProfile({ id: s.user.id, email, rol: isTeam ? "admin" : "cliente", client_id: null });
      }
    };

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session);
      if (active) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      await loadProfile(s);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); setProfile(null); };

  const isTeam = profile?.rol === "admin" || profile?.rol === "equipo";

  return (
    <Ctx.Provider value={{ session, email: session?.user.email ?? null, profile, isTeam, clientId: profile?.client_id ?? null, ready, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

// Acceso libre por ahora: no se exige login. Poné REQUIRE_LOGIN = true para
// volver a exigir sesión (el sistema de roles y el portal siguen intactos).
export const REQUIRE_LOGIN = false;

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-dim">
        <span className="text-sm">Cargando…</span>
      </div>
    );
  }
  if (REQUIRE_LOGIN && !session) return <LoginScreen />;
  return <>{children}</>;
}

function LoginScreen() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        setMsg("Cuenta creada. Si tu proyecto pide confirmación por correo, revisá tu email; si no, ya podés entrar.");
      }
    } catch (e: any) {
      setErr(e.message ?? "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-7 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.8)]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-base font-bold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]">V</span>
          <div>
            <p className="text-sm font-semibold leading-none text-ink">Villano OS</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-dim">Cerebro Villano</p>
          </div>
        </div>
        <h1 className="mb-1 text-lg font-semibold text-ink">{mode === "in" ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <p className="mb-5 text-xs text-mute">Acceso del equipo y de los clientes de Villano Growth.</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" required placeholder="tu@email.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-ink outline-none focus:border-accent/60"
          />
          <input
            type="password" required placeholder="Contraseña" value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-ink outline-none focus:border-accent/60"
          />
          {err && <p className="text-xs text-bad">{err}</p>}
          {msg && <p className="text-xs text-ok">{msg}</p>}
          <button
            type="submit" disabled={busy}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "…" : mode === "in" ? "Entrar" : "Registrarme"}
          </button>
        </form>
        <button
          onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(""); setMsg(""); }}
          className="mt-4 w-full text-center text-xs text-mute hover:text-ink"
        >
          {mode === "in" ? "¿Primera vez? Crear cuenta" : "Ya tengo cuenta · Iniciar sesión"}
        </button>
      </div>
    </div>
  );
}
