import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { DataProvider } from "@/lib/db";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Villano OS — Panel de agencia",
  description: "Sistema operativo interno de Villano Growth: KPIs por miembro, tracker semanal, métricas, campañas, revisiones y metas por cliente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">
        <DataProvider>
          <StoreProvider>{children}</StoreProvider>
        </DataProvider>
      </body>
    </html>
  );
}
