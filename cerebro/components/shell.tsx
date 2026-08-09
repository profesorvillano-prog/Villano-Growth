"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { CLIENTS } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Icon } from "./icon";

function UserFooter() {
  const { email, signOut } = useAuth();
  return (
    <div className="border-t border-line/80 px-3 py-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-line/60 bg-panel/60 px-3 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-[11px] font-semibold text-accent2 ring-1 ring-inset ring-accent/25">VG</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-ink">{email ?? "Villano Growth"}</p>
          <p className="truncate text-[10px] text-dim">Panel del equipo</p>
        </div>
        <button onClick={signOut} title="Cerrar sesión" className="flex h-7 w-7 items-center justify-center rounded-lg text-dim transition-colors hover:bg-soft/60 hover:text-ink">
          <Icon name="logout" size={15} />
        </button>
      </div>
    </div>
  );
}

const OPERACION = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/semana", label: "Semana", icon: "week" },
  { href: "/equipo", label: "Equipo · KPIs", icon: "chart" },
];
const AGENCIA: { href: string; label: string; icon: string; admin?: boolean }[] = [
  { href: "/metas", label: "Metas", icon: "target" },
  { href: "/acciones", label: "Acciones", icon: "actions", admin: true },
  { href: "/kpis", label: "KPIs del equipo", icon: "gauge", admin: true },
  { href: "/config", label: "Configuración", icon: "settings" },
];

export function Shell({ children, title, sub, right }: { children: ReactNode; title: string; sub?: string; right?: ReactNode }) {
  const path = usePathname();
  const { profile } = useAuth();
  const isAdmin = profile?.rol === "admin";
  const agencia = AGENCIA.filter((n) => !n.admin || isAdmin);

  return (
    <div className="flex min-h-screen text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-line/80 bg-panel/70 backdrop-blur-xl md:flex">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#6d4bd8] text-base font-bold text-white shadow-[0_6px_20px_-4px_rgb(139_92_246/0.65)]">V</span>
          <div>
            <p className="text-sm font-semibold leading-none tracking-tight">Villano OS</p>
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-dim">Cerebro Villano</p>
          </div>
        </div>

        <nav className="mt-1 flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          <NavSection label="Operación">
            {OPERACION.map((n) => <NavItem key={n.href} {...n} active={path === n.href} />)}
          </NavSection>

          <NavSection label="Clientes">
            {CLIENTS.map((c) => {
              const active = path?.startsWith(`/clientes/${c.id}`);
              return (
                <Link
                  key={c.id}
                  href={`/clientes/${c.id}`}
                  className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    active ? "bg-soft/70 text-ink" : "text-mute hover:bg-soft/40 hover:text-ink"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border text-[10px] font-semibold" style={{ background: c.color + "1f", color: c.color, borderColor: c.color + "3a" }}>{c.initials}</span>
                  <span className="truncate">{c.nombre}</span>
                </Link>
              );
            })}
          </NavSection>

          <NavSection label="Agencia">
            {agencia.map((n) => <NavItem key={n.href} {...n} active={path === n.href} />)}
          </NavSection>
        </nav>

        <UserFooter />
      </aside>

      <div className="flex-1 md:pl-64">
        <header className="sticky top-0 z-10 border-b border-line/70 bg-bg/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <h1 className="truncate text-[19px] font-semibold leading-tight tracking-tight">{title}</h1>
              {sub && <p className="mt-1 truncate text-xs text-mute">{sub}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-3">{right}</div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-7">{children}</main>
      </div>
    </div>
  );
}

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-dim/90">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all ${
        active ? "bg-accent/12 font-medium text-accent2 ring-1 ring-inset ring-accent/20" : "text-mute hover:bg-soft/40 hover:text-ink"
      }`}
    >
      {active && <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgb(139_92_246/0.7)]" />}
      <Icon name={icon} size={17} className={active ? "text-accent2" : "text-dim transition-colors group-hover:text-mute"} />
      {label}
    </Link>
  );
}
