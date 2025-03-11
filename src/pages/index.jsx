import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

/**
 * Página principal que redirecciona al dashboard o muestra una página de bienvenida
 */
export default function HomePage() {
  const router = useRouter();

  // Opción 1: Redireccionar automáticamente al dashboard
  // Descomenta este bloque si prefieres redirección automática
  /*
  useEffect(() => {
    router.push('/dashboard/candidates');
  }, [router]);
  */

  return (
    <>
      <Head>
        <title>Sistema ATS | Gestión de Candidatos</title>
        <meta
          name="description"
          content="Sistema de seguimiento de candidatos para reclutadores"
        />
      </Head>

      <div className="home">
        <div className="home__content">
          <h1 className="home__title">Sistema de Seguimiento de Candidatos</h1>
          <p className="home__description">
            Plataforma para la gestión eficiente de candidatos en procesos de
            selección
          </p>

          <div className="home__features">
            <div className="home__feature">
              <h2 className="home__feature-title">Gestión de Candidatos</h2>
              <p className="home__feature-text">
                Añade, edita y gestiona candidatos de manera sencilla e
                intuitiva
              </p>
            </div>
            <div className="home__feature">
              <h2 className="home__feature-title">Procesos de Selección</h2>
              <p className="home__feature-text">
                Organiza y haz seguimiento de tus procesos de selección
              </p>
            </div>
            <div className="home__feature">
              <h2 className="home__feature-title">Informes y Estadísticas</h2>
              <p className="home__feature-text">
                Obtén insights valiosos sobre tus procesos de reclutamiento
              </p>
            </div>
          </div>

          <div className="home__actions">
            <Link
              href="/dashboard/candidates"
              className="home__button home__button--primary">
              Ir al Dashboard
            </Link>
            <Link
              href="/dashboard/candidates/add"
              className="home__button home__button--secondary">
              Añadir Candidato
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
