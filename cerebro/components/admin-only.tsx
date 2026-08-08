"use client";

// Envuelve contenido de gestión: solo visible para la agencia (admin).
// En operación muestra un aviso de solo lectura.

import { ReactNode } from "react";
import { Card } from "./ui";

export function AdminOnly({ isAdmin, area, children }: { isAdmin: boolean; area: string; children: ReactNode }) {
  if (isAdmin) return <>{children}</>;
  return (
    <Card className="p-8 text-center">
      <p className="text-sm font-medium text-ink">Solo la agencia gestiona {area}</p>
      <p className="mt-1.5 text-xs text-mute">En operación esta sección es de solo lectura. Pedile a la agencia los cambios que necesites.</p>
    </Card>
  );
}
