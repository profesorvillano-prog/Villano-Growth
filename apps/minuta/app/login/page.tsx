"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : error.message,
      );
      setLoading(false);
      return;
    }
    router.replace(params.get("next") || "/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12">
      <div className="mb-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface">
          <span className="text-xl">🍽️</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Minuta</h1>
        <p className="mt-1 text-sm text-muted">
          Tu pauta nutricional por porciones de intercambio.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="text-xs font-medium text-muted" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-gold"
        />

        <label className="mt-2 text-xs font-medium text-muted" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-gold"
        />

        {error && <p className="text-sm text-[#ef6b5e]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-12 rounded-xl bg-gold font-semibold text-black transition active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
