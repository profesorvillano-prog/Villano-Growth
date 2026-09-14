import { loadPlanBundle } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { PlanProvider } from "@/components/plan-context";
import { BottomNav } from "@/components/bottom-nav";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const bundle = await loadPlanBundle();

  if (!bundle) {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <h1 className="text-lg font-semibold">
          {hasSupabaseEnv ? "No pudimos cargar tu pauta" : "Falta conectar la base de datos"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {hasSupabaseEnv
            ? "Revisa la conexión con Supabase y vuelve a intentar."
            : "Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel y vuelve a desplegar."}
        </p>
      </main>
    );
  }

  return (
    <PlanProvider bundle={bundle}>
      <div className="mx-auto max-w-lg pb-20">{children}</div>
      <BottomNav />
    </PlanProvider>
  );
}
