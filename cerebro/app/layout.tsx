import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Villano OS — Panel de agencia",
  description: "Sistema operativo interno de Villano Growth: KPIs por miembro, tracker semanal, métricas, campañas, revisiones y metas por cliente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('vos-theme');if(t==='light')document.documentElement.dataset.theme='light'}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
