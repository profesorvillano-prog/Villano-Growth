"use client";

// Enrutador por rol (dentro de AuthGate, ya con sesión):
//  · cliente → su portal (ignora las rutas de agencia)
//  · equipo/admin → app de agencia con estado compartido (DataProvider + StoreProvider)

import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { DataProvider } from "@/lib/db";
import { StoreProvider } from "@/lib/store";
import { ClientPortal } from "./portal";

export function AppRoot({ children }: { children: ReactNode }) {
  const { ready, session, profile, isTeam } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-dim">
        <span className="text-sm">Cargando…</span>
      </div>
    );
  }

  // Cliente con sesión → su portal.
  if (session && profile && !isTeam) return <ClientPortal clientId={profile.client_id} />;

  // Acceso libre (sin sesión) o equipo → panel de agencia con estado compartido.
  return (
    <DataProvider>
      <StoreProvider>{children}</StoreProvider>
    </DataProvider>
  );
}
