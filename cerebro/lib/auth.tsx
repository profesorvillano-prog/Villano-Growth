"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthCtx {
  session: Session | null;
  email: string | null;
  ready: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ session: null, email: null, ready: false, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <Ctx.Provider value={{ session, email: session?.user.email ?? null, ready, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-dim">
        <span className="text-sm">Cargando…</span>
      </div>
    );
  }
  if (!session) return <LoginScreen />;
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
            <p className="mt-1 text-[10px] uppercase tracking-widest text-dim">Panel de agencia</p>
          </div>
        </div>
        <h1 className="mb-1 text-lg font-semibold text-ink">{mode === "in" ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <p className="mb-5 text-xs text-mute">Acceso solo para el equipo de Villano Growth.</p>
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
