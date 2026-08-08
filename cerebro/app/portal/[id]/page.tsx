"use client";

// Vista previa del portal del cliente para el equipo (/portal/<cliente>).
// Un cliente que entra siempre ve su propio portal; esta ruta es para que el
// equipo previsualice lo que ve cada cliente.

import { use } from "react";
import { ClientPortal } from "@/components/portal";

export default function PortalPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ClientPortal clientId={id} />;
}
