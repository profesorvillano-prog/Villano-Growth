"use client";

// Colecciones editables por cliente en Supabase: piezas de contenido (planificador),
// tareas y accesos. Cada hook filtra por los slugs del cliente, guarda en vivo y
// degrada con elegancia (si la tabla no existe todavía, muestra vacío sin romper).

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

// ---------------- Tipos ----------------

export interface ContentPiece {
  id: string;
  cliente: string;
  titulo: string;
  formato: string;      // Reel · Carrusel · Post · Story · Video · Otro
  pilar: string | null;
  gancho: string | null;
  estado: PieceState;
  fecha_plan: string | null;  // YYYY-MM-DD
  fecha_pub: string | null;   // YYYY-MM-DD
  link: string | null;
  notas: string | null;
  created_by: string | null;
  created_at?: string;
}

export interface Task {
  id: string;
  cliente: string;
  titulo: string;
  estado: TaskState;
  responsable: string | null;
  fecha: string | null;   // YYYY-MM-DD (vencimiento)
  notas: string | null;
  created_at?: string;
}

export interface Acceso {
  id: string;
  cliente: string;
  nombre: string;
  categoria: string | null;   // Redes · Ads · CRM · Pagos · Web · Otro
  url: string | null;
  usuario: string | null;
  secreto: string | null;
  notas: string | null;
  created_at?: string;
}

// ---------------- Constantes de UI ----------------

export type PieceState = "Idea" | "Planificado" | "Revisado" | "Grabado" | "Publicado";
export const PIECE_STATES: PieceState[] = ["Idea", "Planificado", "Revisado", "Grabado", "Publicado"];
export const PIECE_STATE_COLOR: Record<PieceState, string> = {
  Idea: "#8f8f9d",
  Planificado: "#60a5fa",
  Revisado: "#a78bfa",
  Grabado: "#fbbf24",
  Publicado: "#34d399",
};

export const PIECE_FORMATS = ["Reel", "Carrusel", "Post", "Story", "Video", "Otro"];

export type TaskState = "pendiente" | "en_curso" | "hecho";
export const TASK_STATES: { value: TaskState; label: string; color: string }[] = [
  { value: "pendiente", label: "Pendiente", color: "#8f8f9d" },
  { value: "en_curso", label: "En curso", color: "#fbbf24" },
  { value: "hecho", label: "Hecho", color: "#34d399" },
];

export const ACCESO_CATEGORIAS = ["Redes", "Ads", "CRM", "Pagos", "Web", "Automatización", "Otro"];

// ---------------- Hook genérico de colección ----------------

interface CollectionApi<T> {
  rows: T[] | null;             // null = cargando
  create: (row: Partial<T>) => Promise<void>;
  update: (id: string, patch: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

function useCollection<T extends { id: string }>(
  table: string,
  slugs: string[],
  orderCol: string,
  asc: boolean,
): CollectionApi<T> {
  const [rows, setRows] = useState<T[] | null>(null);
  const key = slugs.join(",");

  const load = useCallback(async () => {
    if (!slugs.length) { setRows([]); return; }
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .in("cliente", slugs)
      .order(orderCol, { ascending: asc, nullsFirst: false });
    // Si la tabla aún no existe (fase de migración) no rompemos: mostramos vacío.
    setRows(error ? [] : ((data ?? []) as T[]));
  }, [table, key, orderCol, asc]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let active = true;
    load();
    const channel = supabase
      .channel(`${table}_${key}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => { if (active) load(); })
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, [load, key]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = async (row: Partial<T>) => {
    const { data } = await supabase.from(table).insert(row as any).select().single();
    if (data) setRows((prev) => [...(prev ?? []), data as T]);
    await load();
  };
  const update = async (id: string, patch: Partial<T>) => {
    setRows((prev) => (prev ?? []).map((r) => (r.id === id ? { ...r, ...patch } : r)));
    await supabase.from(table).update(patch as any).eq("id", id);
  };
  const remove = async (id: string) => {
    setRows((prev) => (prev ?? []).filter((r) => r.id !== id));
    await supabase.from(table).delete().eq("id", id);
  };

  return { rows, create, update, remove, reload: load };
}

// ---------------- Hooks específicos ----------------

export const useContentPieces = (slugs: string[]) =>
  useCollection<ContentPiece>("content_pieces", slugs, "fecha_plan", false);

export const useTasks = (slugs: string[]) =>
  useCollection<Task>("tasks", slugs, "fecha", true);

export const useAccesos = (slugs: string[]) =>
  useCollection<Acceso>("accesos", slugs, "categoria", true);
