"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { CLIENTS } from "@/lib/data";
import { Avatar } from "./ui";

const NAV = [
  { href: "/", label: "Dashboard", icon: "◧" },
  { href: "/semana", label: "Semana", icon: "☑" },
  { href: "/equipo", label: "Equipo · KPIs", icon: "▥" },
  { href: "/metas", label: "Metas", icon: "◎" },
  { href: "/config", label: "Configuración", icon: "⚙" },
];


export function Shell({ children, title, sub, right }: { children: ReactNode; title: string; sub?: string; right?: ReactNode }) {
  const path = usePathname();

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-line bg-panel md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]">V</span>
          <div>
            <p className="text-sm font-semibold leading-none">Villano OS</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-dim">Panel de agencia</p>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          <div>
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-dim">Operación</p>
            {NAV.slice(0, 3).map((n) => <NavItem key={n.href} {...n} active={path === n.href} />)}
          </div>
          <div>
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-dim">Clientes</p>
            {CLIENTS.map((c) => (
              <Link
                key={c.id}
                href={`/clientes/${c.id}`}
                className={`group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${
                  path?.startsWith(`/clientes/${c.id}`) ? "bg-soft text-ink" : "text-mute hover:bg-soft/60 hover:text-ink"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-xs" style={{ background: c.color + "22" }}>{c.emoji}</span>
                <span className="truncate">{c.nombre}</span>
              </Link>
            ))}
          </div>
          <div>
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-dim">Agencia</p>
            {NAV.slice(3).map((n) => <NavItem key={n.href} {...n} active={path === n.href} />)}
          </div>
        </nav>

        <div className="border-t border-line px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <Avatar name="Sebastián" size={28} />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">Sebastián</p>
              <p className="truncate text-[10px] text-dim">Admin · Villano Growth</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:pl-60">
        <header className="sticky top-0 z-10 border-b border-line bg-bg/80 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)] backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {sub && <p className="mt-0.5 text-xs text-mute">{sub}</p>}
            </div>
            <div className="flex items-center gap-3">{right}</div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${
        active ? "bg-accent/15 font-medium text-accent2" : "text-mute hover:bg-soft/60 hover:text-ink"
      }`}
    >
      {active && <span className="absolute -left-3 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent" />}
      <span className="w-5 text-center text-xs opacity-80">{icon}</span>
      {label}
    </Link>
  );
}
