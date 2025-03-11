import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCandidates } from "../../../api/candidatesApi";

/**
 * Página para listar candidatos en el dashboard
 */
export default function CandidatesListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Cargar candidatos al montar el componente
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await getCandidates({
          page: pagination.page,
          limit: pagination.limit,
        });

        setCandidates(response.data || []);
        setPagination((prev) => ({
          ...prev,
          totalItems: response.meta?.totalItems || 0,
          totalPages: response.meta?.totalPages || 0,
        }));

        setError(null);
      } catch (err) {
        console.error("Error al cargar candidatos:", err);
        setError(
          "Error al cargar la lista de candidatos. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [pagination.page, pagination.limit]);

  // Navegar a la página para añadir candidato
  const handleAddCandidate = () => {
    router.push("/dashboard/candidates/add");
  };

  // Navegar a la página de detalles de un candidato
  const handleViewCandidate = (id) => {
    router.push(`/dashboard/candidates/${id}`);
  };

  // Cambiar de página
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <>
      <Head>
        <title>Candidatos | Dashboard ATS</title>
        <meta
          name="description"
          content="Gestión de candidatos en el sistema ATS"
        />
      </Head>

      <div className="dashboard-page">
        <div className="dashboard-page__header">
          <h1 className="dashboard-page__title">Candidatos</h1>

          <div className="dashboard-page__actions">
            <button
              type="button"
              onClick={handleAddCandidate}
              className="dashboard-page__button dashboard-page__button--primary">
              + Añadir Candidato
            </button>
          </div>
        </div>

        <div className="dashboard-page__content">
          {loading ? (
            <div className="dashboard-page__loading">
              Cargando candidatos...
            </div>
          ) : error ? (
            <div className="dashboard-page__error">{error}</div>
          ) : candidates.length === 0 ? (
            <div className="dashboard-page__empty">
              <p>No hay candidatos registrados aún.</p>
              <button
                type="button"
                onClick={handleAddCandidate}
                className="dashboard-page__button dashboard-page__button--secondary">
                Añadir tu primer candidato
              </button>
            </div>
          ) : (
            <>
              <div className="candidates-table">
                <div className="candidates-table__header">
                  <div className="candidates-table__cell candidates-table__cell--name">
                    Nombre
                  </div>
                  <div className="candidates-table__cell candidates-table__cell--email">
                    Email
                  </div>
                  <div className="candidates-table__cell candidates-table__cell--phone">
                    Teléfono
                  </div>
                  <div className="candidates-table__cell candidates-table__cell--actions">
                    Acciones
                  </div>
                </div>

                <div className="candidates-table__body">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="candidates-table__row">
                      <div className="candidates-table__cell candidates-table__cell--name">
                        {candidate.personalInfo.name}{" "}
                        {candidate.personalInfo.surnames}
                      </div>
                      <div className="candidates-table__cell candidates-table__cell--email">
                        {candidate.personalInfo.email}
                      </div>
                      <div className="candidates-table__cell candidates-table__cell--phone">
                        {candidate.personalInfo.phone}
                      </div>
                      <div className="candidates-table__cell candidates-table__cell--actions">
                        <button
                          type="button"
                          onClick={() => handleViewCandidate(candidate.id)}
                          className="candidates-table__button candidates-table__button--view"
                          aria-label={`Ver detalles de ${candidate.personalInfo.name}`}>
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="pagination__button"
                    aria-label="Página anterior">
                    Anterior
                  </button>

                  <span className="pagination__info">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="pagination__button"
                    aria-label="Página siguiente">
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
