import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider, AuthGate } from "@/lib/auth";
import { AppRoot } from "@/components/app-root";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Villano OS — Cerebro Villano",
  description: "Ecosistema de Villano Growth: panel de agencia (KPIs, tracker, métricas, campañas, metas) y portal del cliente (contenido, tareas, Meta/Instagram/GHL).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">
        <AuthProvider>
          <AuthGate>
            <AppRoot>{children}</AppRoot>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
