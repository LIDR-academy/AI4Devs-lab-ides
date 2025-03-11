import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import CandidateForm from "../../../components/candidates/CandidateForm";

/**
 * Página para añadir un nuevo candidato desde el dashboard
 */
export default function AddCandidatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para redirigir al listado de candidatos
  const handleCancel = () => {
    router.push("/dashboard/candidates");
  };

  return (
    <>
      <Head>
        <title>Añadir Candidato | ATS Dashboard</title>
        <meta
          name="description"
          content="Añadir un nuevo candidato al sistema ATS"
        />
      </Head>

      <div className="dashboard-page">
        <div className="dashboard-page__header">
          <div className="dashboard-page__breadcrumbs">
            <Link href="/dashboard" className="dashboard-page__breadcrumb-item">
              Dashboard
            </Link>
            <span className="dashboard-page__breadcrumb-separator">/</span>
            <Link
              href="/dashboard/candidates"
              className="dashboard-page__breadcrumb-item">
              Candidatos
            </Link>
            <span className="dashboard-page__breadcrumb-separator">/</span>
            <span className="dashboard-page__breadcrumb-item dashboard-page__breadcrumb-item--active">
              Añadir Candidato
            </span>
          </div>

          <div className="dashboard-page__actions">
            <button
              type="button"
              className="dashboard-page__button dashboard-page__button--secondary"
              onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>

        <div className="dashboard-page__content">
          <CandidateForm />
        </div>
      </div>
    </>
  );
}
