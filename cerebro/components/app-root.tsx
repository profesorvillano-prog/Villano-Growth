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
  const { profile, isTeam } = useAuth();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-dim">
        <span className="text-sm">Cargando…</span>
      </div>
    );
  }

  if (!isTeam) return <ClientPortal clientId={profile.client_id} />;

  return (
    <DataProvider>
      <StoreProvider>{children}</StoreProvider>
    </DataProvider>
  );
}
