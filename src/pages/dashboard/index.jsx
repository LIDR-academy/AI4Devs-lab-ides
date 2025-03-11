import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Página de redirección del dashboard a candidatos
 */
export default function DashboardPage() {
  const router = useRouter();

  // Redireccionar automáticamente al dashboard de candidatos
  useEffect(() => {
    router.replace("/dashboard/candidates");
  }, [router]);

  return (
    <div className="dashboard-redirect">
      <p>Redireccionando al dashboard de candidatos...</p>
    </div>
  );
}
