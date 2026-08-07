"use client";

// Portal del cliente: vista simplificada y de marca del cliente.
//  · Crea piezas y las marca como publicadas (Planificador)
//  · Gestiona sus Tareas · ve su Calendario
//  · Visualiza (solo lectura) Meta Ads, Instagram, Embudo GHL y Ventas
//  · Ve sus Accesos y su Estrategia
// El equipo puede previsualizarlo desde /portal/[id]; el cliente entra directo al suyo.

import { useState } from "react";
import { CLIENTS, STRATEGY_DETAIL, clientById } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { ClientMark } from "./ui";
import { PlannerCard, TasksCard, CalendarCard, AccesosCard, StrategyDetailCard } from "./collections";
import { MetaLiveCard, OrganicLiveCard, HighTicketCard, VentasCard } from "./metrics";

const TABS = [
  "Inicio", "Planificador", "Tareas", "Calendario",
  "Instagram", "Meta Ads", "Embudo", "Ventas", "Accesos", "Estrategia",
] as const;
type Tab = (typeof TABS)[number];

export function ClientPortal({ clientId }: { clientId: string | null }) {
  const { email, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("Inicio");
  const client = clientId ? clientById(clientId) : undefined;

  if (!client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
        <ClientMark initials="?" color="#8f8f9d" size={48} />
        <h1 className="mt-4 text-lg font-semibold text-ink">Tu acceso todavía no está configurado</h1>
        <p className="mt-2 max-w-sm text-sm text-mute">
          {email ? <>La cuenta <span className="text-ink">{email}</span> aún no está vinculada a un cliente.</> : "Todavía no hay un cliente asignado a esta cuenta."}{" "}
          El equipo de Villano Growth lo activa en un momento.
        </p>
        <button onClick={signOut} className="mt-6 rounded-lg border border-line px-4 py-2 text-sm text-mute hover:text-ink">Cerrar sesión</button>
      </div>
    );
  }

  const slugs = client.metaSlugs;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <ClientMark initials={client.initials} color={client.color} size={36} />
            <div>
              <p className="text-sm font-semibold leading-none">{client.nombre}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-dim">Portal · Villano Growth</p>
            </div>
          </div>
          <button onClick={signOut} className="rounded-lg border border-line px-3 py-1.5 text-xs text-mute transition-colors hover:text-ink">Salir</button>
        </div>
        <div className="mx-auto max-w-6xl overflow-x-auto px-5">
          <nav className="flex gap-1 pb-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm transition-colors ${tab === t ? "bg-accent text-white" : "text-mute hover:text-ink"}`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        {tab === "Inicio" && <PortalHome client={client} onGo={setTab} />}
        {tab === "Planificador" && <PlannerCard clientId={client.id} color={client.color} canManage />}
        {tab === "Tareas" && <TasksCard clientId={client.id} color={client.color} canManage />}
        {tab === "Calendario" && <CalendarCard clientId={client.id} color={client.color} />}
        {tab === "Instagram" && <OrganicLiveCard slugs={slugs} color={client.color} />}
        {tab === "Meta Ads" && <MetaLiveCard slugs={slugs} color={client.color} />}
        {tab === "Embudo" && <HighTicketCard slugs={slugs} color={client.color} />}
        {tab === "Ventas" && <VentasCard slugs={slugs} color={client.color} />}
        {tab === "Accesos" && <AccesosCard clientId={client.id} canManage={false} />}
        {tab === "Estrategia" && (
          STRATEGY_DETAIL[client.id]
            ? <StrategyDetailCard detail={STRATEGY_DETAIL[client.id]} color={client.color} />
            : <div className="rounded-2xl border border-line bg-card p-6 text-sm text-dim">Tu estrategia se está preparando con el equipo.</div>
        )}
      </main>
    </div>
  );
}

function PortalHome({ client, onGo }: { client: (typeof CLIENTS)[number]; onGo: (t: Tab) => void }) {
  const detail = STRATEGY_DETAIL[client.id];
  const shortcuts: { t: Tab; label: string; desc: string }[] = [
    { t: "Planificador", label: "Crear contenido", desc: "Sumá piezas y marcalas como publicadas" },
    { t: "Tareas", label: "Tus tareas", desc: "Lo que hay que hacer esta semana" },
    { t: "Instagram", label: "Instagram", desc: "Rendimiento orgánico por pieza" },
    { t: "Meta Ads", label: "Meta Ads", desc: "Inversión y resultados de campañas" },
    { t: "Embudo", label: "Embudo", desc: "Mensajes → agenda → venta (GHL)" },
    { t: "Estrategia", label: "Estrategia", desc: "El plan de tu negocio" },
  ];
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-line bg-card p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: client.color }}>Bienvenido</p>
        <h1 className="mt-1 text-xl font-semibold">{client.nombre}</h1>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          {detail?.resumen ?? "Acá ves tu contenido, tus tareas y cómo van tus campañas y tu embudo en tiempo real."}
        </p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((s) => (
          <button
            key={s.t}
            onClick={() => onGo(s.t)}
            className="rounded-2xl border border-line bg-card p-5 text-left transition-colors hover:border-accent/40"
          >
            <p className="text-sm font-semibold text-ink">{s.label}</p>
            <p className="mt-1 text-xs text-mute">{s.desc}</p>
            <span className="mt-3 inline-block text-xs" style={{ color: client.color }}>Abrir →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
