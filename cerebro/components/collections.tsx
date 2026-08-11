"use client";

// Secciones espejo del Notion del cliente, guardadas en Supabase:
//  · PlannerCard  — Planificador de contenido (crear pieza, avanzar estado, publicar)
//  · TasksCard    — Tareas livianas por cliente
//  · CalendarCard — Calendario mensual (piezas planificadas / publicadas + tareas)
//  · AccesosCard  — Links y credenciales por cliente
// Reutilizables en el panel de agencia y en el portal del cliente.

import { useEffect, useState } from "react";
import { Card, CardHead } from "./ui";
import {
  Acceso, ACCESO_CATEGORIAS, ContentPiece, PIECE_FORMATS, PIECE_STATES,
  PIECE_STATE_COLOR, PieceState, Task, TASK_STATES, TaskState,
  useAccesos, useContentPieces, useTasks,
} from "@/lib/portal";
import { todayIso } from "@/lib/date";
import { StrategyDetail } from "@/lib/data";

// ---------------- Inputs base ----------------

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/60 ${props.className ?? ""}`}
    />
  );
}
function Select({ value, onChange, children, className = "" }: { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`cursor-pointer rounded-lg border border-line bg-panel px-2 py-1.5 text-sm text-mute outline-none transition-colors hover:text-ink focus:border-accent/60 ${className}`}
    >
      {children}
    </select>
  );
}
function fdate(d: string | null): string {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

// =====================================================================
// PLANIFICADOR DE CONTENIDO
// =====================================================================

export function PlannerCard({ clientId, color, canManage = true }: { clientId: string; color: string; canManage?: boolean }) {
  const { rows, create, update, remove } = useContentPieces([clientId]);
  const [filtro, setFiltro] = useState<"Todos" | PieceState>("Todos");
  const [adding, setAdding] = useState(false);

  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando planificador…</Card>;

  const shown = filtro === "Todos" ? rows : rows.filter((r) => r.estado === filtro);
  const publicadas = rows.filter((r) => r.estado === "Publicado").length;
  const pendientes = rows.filter((r) => r.estado !== "Publicado").length;

  const setEstado = (p: ContentPiece, estado: PieceState) => {
    const patch: Partial<ContentPiece> = { estado };
    if (estado === "Publicado" && !p.fecha_pub) patch.fecha_pub = todayIso();
    update(p.id, patch);
  };

  return (
    <Card>
      <CardHead
        title="Planificador de contenido"
        sub="Crear piezas · Idea → Planificado → Revisado → Grabado → Publicado"
        right={
          <span className="flex items-center gap-3 text-[11px] text-dim">
            <span><span className="font-medium text-ok">{publicadas}</span> publicadas</span>
            <span><span className="font-medium text-ink">{pendientes}</span> en proceso</span>
          </span>
        }
      />
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-panel p-1">
          {(["Todos", ...PIECE_STATES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFiltro(s)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${filtro === s ? "bg-accent text-white" : "text-mute hover:text-ink"}`}
            >
              {s}
            </button>
          ))}
        </div>
        {canManage && (
          <button
            onClick={() => setAdding(true)}
            className="ml-auto rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-accent/50 hover:text-accent2"
          >
            + Nueva pieza
          </button>
        )}
      </div>

      {adding && <NewPieceForm color={color} onCancel={() => setAdding(false)} onSave={async (row) => { await create({ cliente: clientId, ...row }); setAdding(false); }} />}

      {shown.length === 0 && !adding ? (
        <p className="px-5 py-8 text-center text-sm text-dim">
          {rows.length === 0 ? "Todavía no hay piezas. Creá la primera con “+ Nueva pieza”." : "Sin piezas en este estado."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-dim">
                <th className="py-2 pl-5 pr-3 text-left font-medium">Pieza</th>
                <th className="px-3 py-2 text-left font-medium">Estado</th>
                <th className="px-3 py-2 text-left font-medium">Planificada</th>
                <th className="px-3 py-2 text-left font-medium">Publicada</th>
                <th className="py-2 pl-3 pr-5 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className="group border-t border-line/60 align-top hover:bg-soft/25">
                  <td className="py-2.5 pl-5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: color + "22", color }}>{p.formato}</span>
                      <span className="font-medium text-ink">{p.titulo}</span>
                    </div>
                    {(p.pilar || p.gancho) && (
                      <p className="mt-0.5 text-[11px] text-dim">{[p.pilar, p.gancho].filter(Boolean).join(" · ")}</p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[11px]">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer" className="text-accent2 hover:underline">🔗 video en Drive ↗</a>
                      ) : canManage ? (
                        <button onClick={() => { const v = window.prompt("Pegá el link del video (Drive):", ""); if (v !== null) update(p.id, { link: v.trim() || null }); }} className="text-dim transition-colors hover:text-accent2">+ link</button>
                      ) : null}
                      {p.guion ? (
                        <button onClick={() => canManage && (() => { const v = window.prompt("Guión / idea:", p.guion || ""); if (v !== null) update(p.id, { guion: v.trim() || null }); })()} className="text-mute hover:text-ink" title={p.guion || undefined}>📝 guión</button>
                      ) : canManage ? (
                        <button onClick={() => { const v = window.prompt("Guión / idea:", ""); if (v !== null) update(p.id, { guion: v.trim() || null }); }} className="text-dim transition-colors hover:text-accent2">+ guión</button>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    {canManage ? (
                      <Select value={p.estado} onChange={(v) => setEstado(p, v as PieceState)} className="text-xs">
                        {PIECE_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: PIECE_STATE_COLOR[p.estado] }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: PIECE_STATE_COLOR[p.estado] }} />{p.estado}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-mute">{fdate(p.fecha_plan)}</td>
                  <td className="px-3 py-2.5">
                    {p.estado === "Publicado" ? (
                      <span className="tabular-nums text-ok">{fdate(p.fecha_pub) === "—" ? "✓" : fdate(p.fecha_pub)}</span>
                    ) : canManage ? (
                      <button onClick={() => setEstado(p, "Publicado")} className="rounded-md border border-line px-2 py-0.5 text-[11px] text-mute transition-colors hover:border-ok/50 hover:text-ok">
                        Publicar
                      </button>
                    ) : <span className="text-dim">—</span>}
                  </td>
                  <td className="py-2.5 pl-3 pr-5 text-right">
                    {canManage && (
                      <button onClick={() => remove(p.id)} title="Eliminar" className="text-dim opacity-0 transition-opacity hover:text-bad group-hover:opacity-100">×</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function NewPieceForm({ color, onSave, onCancel }: { color: string; onSave: (row: Partial<ContentPiece>) => void; onCancel: () => void }) {
  const [titulo, setTitulo] = useState("");
  const [formato, setFormato] = useState(PIECE_FORMATS[0]);
  const [pilar, setPilar] = useState("");
  const [gancho, setGancho] = useState("");
  const [guion, setGuion] = useState("");
  const [link, setLink] = useState("");
  const [fecha, setFecha] = useState("");
  const save = () => { if (!titulo.trim()) return; onSave({ titulo: titulo.trim(), formato, pilar: pilar || null, gancho: gancho || null, guion: guion || null, link: link || null, fecha_plan: fecha || null, estado: "Planificado" }); };
  return (
    <div className="border-b border-line bg-panel/50 px-5 py-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <TextInput autoFocus placeholder="Título de la pieza" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="lg:col-span-2" onKeyDown={(e) => e.key === "Enter" && save()} />
        <Select value={formato} onChange={setFormato}>{PIECE_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}</Select>
        <TextInput placeholder="Pilar (opcional)" value={pilar} onChange={(e) => setPilar(e.target.value)} />
        <TextInput placeholder="Gancho / tema (opcional)" value={gancho} onChange={(e) => setGancho(e.target.value)} />
        <TextInput type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <TextInput placeholder="Guión / idea (opcional)" value={guion} onChange={(e) => setGuion(e.target.value)} className="lg:col-span-2" />
        <TextInput placeholder="Link del video en Drive (opcional)" value={link} onChange={(e) => setLink(e.target.value)} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={save} className="rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ background: color }}>Agregar pieza</button>
        <button onClick={onCancel} className="rounded-lg border border-line px-3 py-1.5 text-xs text-mute hover:text-ink">Cancelar</button>
      </div>
    </div>
  );
}

// =====================================================================
// TAREAS
// =====================================================================

export function TasksCard({ clientId, color, canManage = true }: { clientId: string; color: string; canManage?: boolean }) {
  const { rows, create, update, remove } = useTasks([clientId]);
  const [nuevo, setNuevo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hideDone, setHideDone] = useState(false);

  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando tareas…</Card>;

  const pendientes = rows.filter((t) => t.estado !== "hecho").length;
  const shown = hideDone ? rows.filter((t) => t.estado !== "hecho") : rows;
  const cycle = (t: Task) => {
    const order: TaskState[] = ["pendiente", "en_curso", "hecho"];
    update(t.id, { estado: order[(order.indexOf(t.estado) + 1) % 3] });
  };
  const addTask = () => { if (!nuevo.trim()) return; create({ cliente: clientId, titulo: nuevo.trim(), fecha: fecha || null, estado: "pendiente" }); setNuevo(""); setFecha(""); };

  return (
    <Card>
      <CardHead
        title="Tareas"
        sub="Checklist liviano del cliente"
        right={
          <button onClick={() => setHideDone(!hideDone)} className="text-[11px] text-mute hover:text-ink">
            {hideDone ? "Mostrar hechas" : "Ocultar hechas"} · <span className="font-medium text-ink">{pendientes}</span> abiertas
          </button>
        }
      />
      {canManage && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
          <TextInput placeholder="Nueva tarea…" value={nuevo} onChange={(e) => setNuevo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} className="min-w-[200px] flex-1" />
          <TextInput type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <button onClick={addTask} className="rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ background: color }}>Agregar</button>
        </div>
      )}
      {shown.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-dim">Sin tareas {hideDone ? "abiertas" : ""}.</p>
      ) : (
        <ul className="divide-y divide-line/60">
          {shown.map((t) => {
            const st = TASK_STATES.find((s) => s.value === t.estado)!;
            const done = t.estado === "hecho";
            return (
              <li key={t.id} className="group flex items-center gap-3 px-5 py-3">
                <button
                  onClick={() => canManage && cycle(t)}
                  title={st.label}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition-colors"
                  style={{ borderColor: st.color, background: done ? st.color : t.estado === "en_curso" ? st.color + "33" : "transparent", color: done ? "#0b0b0e" : st.color }}
                >
                  {done ? "✓" : t.estado === "en_curso" ? "•" : ""}
                </button>
                <span className={`flex-1 text-sm ${done ? "text-dim line-through" : "text-ink"}`}>{t.titulo}</span>
                {t.responsable && <span className="text-[11px] text-dim">{t.responsable}</span>}
                {t.fecha && <span className="w-16 text-right text-[11px] tabular-nums text-mute">{fdate(t.fecha)}</span>}
                {canManage && <button onClick={() => remove(t.id)} title="Eliminar" className="text-dim opacity-0 transition-opacity hover:text-bad group-hover:opacity-100">×</button>}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// =====================================================================
// CALENDARIO (mensual)
// =====================================================================

const MES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DOW = ["L", "M", "X", "J", "V", "S", "D"];

export function CalendarCard({ clientId, color }: { clientId: string; color: string }) {
  const { rows: pieces } = useContentPieces([clientId]);
  const { rows: tasks } = useTasks([clientId]);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);

  // Inicializa en el mes actual solo en cliente (evita hydration mismatch por la fecha)
  useEffect(() => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); }, []);
  if (cursor === null) return <Card className="p-5 text-sm text-dim">Cargando calendario…</Card>;
  const now = cursor;

  const first = new Date(now.y, now.m, 1);
  const startDow = (first.getDay() + 6) % 7;       // 0 = lunes
  const daysInMonth = new Date(now.y, now.m + 1, 0).getDate();
  const iso = (day: number) => `${now.y}-${String(now.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  type Ev = { label: string; tone: string; kind: "pub" | "plan" | "task" };
  const eventsFor = (day: number): Ev[] => {
    const key = iso(day);
    const evs: Ev[] = [];
    (pieces ?? []).forEach((p) => {
      if (p.fecha_pub === key) evs.push({ label: p.titulo, tone: PIECE_STATE_COLOR.Publicado, kind: "pub" });
      else if (p.fecha_plan === key) evs.push({ label: p.titulo, tone: PIECE_STATE_COLOR.Planificado, kind: "plan" });
    });
    (tasks ?? []).forEach((t) => { if (t.fecha === key) evs.push({ label: t.titulo, tone: t.estado === "hecho" ? "#34d399" : "#fbbf24", kind: "task" }); });
    return evs;
  };

  const move = (delta: number) => {
    const m = now.m + delta;
    setCursor({ y: now.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 });
  };
  const todayKey = todayIso();

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Card>
      <CardHead
        title="Calendario"
        sub="Piezas planificadas y publicadas + tareas con fecha"
        right={
          <div className="flex items-center gap-1 text-xs">
            <button onClick={() => move(-1)} className="flex h-6 w-6 items-center justify-center rounded text-mute hover:bg-soft hover:text-ink">‹</button>
            <span className="min-w-[110px] text-center font-medium capitalize text-ink">{MES_LARGO[now.m]} {now.y}</span>
            <button onClick={() => move(1)} className="flex h-6 w-6 items-center justify-center rounded text-mute hover:bg-soft hover:text-ink">›</button>
          </div>
        }
      />
      <div className="grid grid-cols-7 border-b border-line text-center text-[10px] font-semibold uppercase tracking-wide text-dim">
        {DOW.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="min-h-[76px] border-b border-r border-line/50 bg-panel/30" />;
          const evs = eventsFor(day);
          const isToday = iso(day) === todayKey;
          return (
            <div key={i} className="min-h-[76px] border-b border-r border-line/50 p-1.5">
              <div className={`mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${isToday ? "bg-accent font-semibold text-white" : "text-mute"}`}>{day}</div>
              <div className="space-y-0.5">
                {evs.slice(0, 3).map((e, j) => (
                  <div key={j} className="truncate rounded px-1 py-0.5 text-[10px] leading-tight" style={{ background: e.tone + "22", color: e.tone }} title={e.label}>
                    {e.kind === "task" ? "☑ " : e.kind === "pub" ? "✓ " : "○ "}{e.label}
                  </div>
                ))}
                {evs.length > 3 && <div className="px-1 text-[9px] text-dim">+{evs.length - 3} más</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 px-5 py-2.5 text-[10px] text-dim">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: PIECE_STATE_COLOR.Planificado }} /> Planificada</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-ok" /> Publicada</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-warn" /> Tarea</span>
      </div>
    </Card>
  );
}

// =====================================================================
// ACCESOS
// =====================================================================

export function AccesosCard({ clientId, canManage = true }: { clientId: string; canManage?: boolean }) {
  const { rows, create, remove } = useAccesos([clientId]);
  const [adding, setAdding] = useState(false);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  if (rows === null) return <Card className="p-5 text-sm text-dim">Cargando accesos…</Card>;

  const byCat = new Map<string, Acceso[]>();
  for (const a of rows) { const c = a.categoria || "Otro"; byCat.set(c, [...(byCat.get(c) ?? []), a]); }

  return (
    <Card>
      <CardHead
        title="Accesos"
        sub="Links y credenciales del cliente"
        right={canManage && (
          <button onClick={() => setAdding(true)} className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-accent/50 hover:text-accent2">+ Acceso</button>
        )}
      />
      {adding && <NewAccesoForm onCancel={() => setAdding(false)} onSave={async (row) => { await create({ cliente: clientId, ...row }); setAdding(false); }} />}
      {rows.length === 0 && !adding ? (
        <p className="px-5 py-8 text-center text-sm text-dim">Sin accesos cargados todavía.</p>
      ) : (
        <div className="divide-y divide-line/60">
          {[...byCat.entries()].map(([cat, items]) => (
            <div key={cat} className="px-5 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">{cat}</p>
              <ul className="space-y-2">
                {items.map((a) => (
                  <li key={a.id} className="group flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-panel/50 px-3 py-2 text-sm">
                    <span className="font-medium text-ink">{a.nombre}</span>
                    {a.url && <a href={a.url} target="_blank" rel="noreferrer" className="text-[11px] text-accent2 hover:underline">abrir ↗</a>}
                    {a.usuario && <span className="text-[11px] text-mute">usuario: <span className="text-ink">{a.usuario}</span></span>}
                    {a.secreto && (
                      <button onClick={() => setReveal((r) => ({ ...r, [a.id]: !r[a.id] }))} className="text-[11px] text-mute hover:text-ink">
                        clave: <span className="font-mono text-ink">{reveal[a.id] ? a.secreto : "••••••"}</span>
                      </button>
                    )}
                    {a.notas && <span className="text-[11px] text-dim">{a.notas}</span>}
                    {canManage && <button onClick={() => remove(a.id)} title="Eliminar" className="ml-auto text-dim opacity-0 transition-opacity hover:text-bad group-hover:opacity-100">×</button>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// =====================================================================
// ESTRATEGIA DETALLADA (extraída de los docs de Drive)
// =====================================================================

export function StrategyDetailCard({ detail, color }: { detail: StrategyDetail; color: string }) {
  return (
    <Card>
      <CardHead title="Estrategia de negocio" sub={detail.fuente} right={<span className="rounded-full border px-2.5 py-1 text-[11px]" style={{ borderColor: color + "66", color }}>del brief real</span>} />
      <div className="px-5 py-4">
        <p className="text-sm text-mute">{detail.resumen}</p>
      </div>
      <div className="grid gap-px border-t border-line bg-line md:grid-cols-2">
        <div className="bg-card px-5 py-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-dim">Embudo</p>
          <ol className="space-y-1.5">
            {detail.embudo.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-mute">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold" style={{ background: color + "22", color }}>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-card px-5 py-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-dim">Oferta y precios</p>
          <ul className="space-y-2">
            {detail.ofertas.map((o, i) => (
              <li key={i} className="rounded-lg border border-line bg-panel/50 px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-ink">{o.nombre}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums" style={{ color }}>{o.precio}</span>
                </div>
                {o.nota && <p className="mt-0.5 text-[11px] text-dim">{o.nota}</p>}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card px-5 py-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-dim">Canales</p>
          <ul className="space-y-1.5 text-sm text-mute">
            {detail.canales.map((c, i) => <li key={i} className="flex gap-2"><span className="text-dim">·</span>{c}</li>)}
          </ul>
        </div>
        <div className="bg-card px-5 py-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-dim">Métricas que gobiernan</p>
          <ul className="space-y-1.5 text-sm text-mute">
            {detail.metricas.map((m, i) => <li key={i} className="flex gap-2"><span style={{ color }}>▸</span>{m}</li>)}
          </ul>
        </div>
      </div>
      {detail.agenda && (
        <div className="border-t border-line px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dim">Agenda / cadencia</p>
          <p className="mt-1 text-sm text-mute">{detail.agenda}</p>
        </div>
      )}
      <div className="border-t border-line px-5 py-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">Notas estratégicas</p>
        <ul className="space-y-1.5 text-sm text-mute">
          {detail.notas.map((n, i) => <li key={i} className="flex gap-2"><span className="text-dim">—</span>{n}</li>)}
        </ul>
      </div>
    </Card>
  );
}

function NewAccesoForm({ onSave, onCancel }: { onSave: (row: Partial<Acceso>) => void; onCancel: () => void }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(ACCESO_CATEGORIAS[0]);
  const [url, setUrl] = useState("");
  const [usuario, setUsuario] = useState("");
  const [secreto, setSecreto] = useState("");
  const [notas, setNotas] = useState("");
  const save = () => { if (!nombre.trim()) return; onSave({ nombre: nombre.trim(), categoria, url: url || null, usuario: usuario || null, secreto: secreto || null, notas: notas || null }); };
  return (
    <div className="border-b border-line bg-panel/50 px-5 py-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <TextInput autoFocus placeholder="Nombre (ej. Instagram)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <Select value={categoria} onChange={setCategoria}>{ACCESO_CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
        <TextInput placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <TextInput placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <TextInput placeholder="Clave / token" value={secreto} onChange={(e) => setSecreto(e.target.value)} />
        <TextInput placeholder="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={save} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white">Guardar acceso</button>
        <button onClick={onCancel} className="rounded-lg border border-line px-3 py-1.5 text-xs text-mute hover:text-ink">Cancelar</button>
      </div>
    </div>
  );
}
