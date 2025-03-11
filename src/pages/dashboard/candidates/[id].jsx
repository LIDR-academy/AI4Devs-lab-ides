import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCandidateById, deleteCandidate } from "../../../api/candidatesApi";

/**
 * Página para ver los detalles de un candidato específico
 */
export default function CandidateDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cargar los datos del candidato cuando el ID está disponible
  useEffect(() => {
    if (!id) return;

    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await getCandidateById(id);
        setCandidate(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error al cargar candidato con ID ${id}:`, err);
        setError(
          "Error al cargar los datos del candidato. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Volver al listado de candidatos
  const handleBack = () => {
    router.push("/dashboard/candidates");
  };

  // Navegar a la página de edición
  const handleEdit = () => {
    router.push(`/dashboard/candidates/edit/${id}`);
  };

  // Mostrar confirmación para eliminar
  const handleShowDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // Cancelar la eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Eliminar el candidato
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCandidate(id);
      router.push("/dashboard/candidates");
    } catch (err) {
      console.error(`Error al eliminar candidato con ID ${id}:`, err);
      setError(
        "Error al eliminar el candidato. Por favor, inténtalo de nuevo más tarde."
      );
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Head>
        <title>
          {loading
            ? "Cargando..."
            : error
            ? "Error"
            : `${candidate?.personalInfo.name} ${candidate?.personalInfo.surnames}`}{" "}
          | ATS
        </title>
        <meta name="description" content="Detalles del candidato" />
      </Head>

      <div className="dashboard-page">
        <div className="dashboard-page__header">
          <div className="dashboard-page__breadcrumbs">
            <Link
              href="/dashboard/candidates"
              className="dashboard-page__breadcrumb-item">
              Candidatos
            </Link>
            <span className="dashboard-page__breadcrumb-separator">/</span>
            <span className="dashboard-page__breadcrumb-item dashboard-page__breadcrumb-item--active">
              {loading
                ? "Cargando..."
                : error
                ? "Error"
                : `${candidate?.personalInfo.name} ${candidate?.personalInfo.surnames}`}
            </span>
          </div>

          <div className="dashboard-page__actions">
            <button
              type="button"
              onClick={handleBack}
              className="dashboard-page__button dashboard-page__button--secondary">
              Volver
            </button>
            {!loading && !error && candidate && (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="dashboard-page__button dashboard-page__button--primary">
                  Editar
                </button>
                <button
                  type="button"
                  onClick={handleShowDeleteConfirm}
                  className="dashboard-page__button dashboard-page__button--danger">
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="dashboard-page__content">
          {loading ? (
            <div className="dashboard-page__loading">
              Cargando datos del candidato...
            </div>
          ) : error ? (
            <div className="dashboard-page__error">{error}</div>
          ) : candidate ? (
            <div className="candidate-details">
              <div className="candidate-details__section">
                <h2 className="candidate-details__section-title">
                  Información Personal
                </h2>
                <div className="candidate-details__info-grid">
                  <div className="candidate-details__info-item">
                    <span className="candidate-details__info-label">
                      Nombre completo
                    </span>
                    <span className="candidate-details__info-value">
                      {candidate.personalInfo.name}{" "}
                      {candidate.personalInfo.surnames}
                    </span>
                  </div>
                  <div className="candidate-details__info-item">
                    <span className="candidate-details__info-label">
                      Correo electrónico
                    </span>
                    <span className="candidate-details__info-value">
                      <a href={`mailto:${candidate.personalInfo.email}`}>
                        {candidate.personalInfo.email}
                      </a>
                    </span>
                  </div>
                  <div className="candidate-details__info-item">
                    <span className="candidate-details__info-label">
                      Teléfono
                    </span>
                    <span className="candidate-details__info-value">
                      <a href={`tel:${candidate.personalInfo.phone}`}>
                        {candidate.personalInfo.phone}
                      </a>
                    </span>
                  </div>
                  {candidate.personalInfo.address && (
                    <div className="candidate-details__info-item">
                      <span className="candidate-details__info-label">
                        Dirección
                      </span>
                      <span className="candidate-details__info-value">
                        {candidate.personalInfo.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="candidate-details__section">
                <h2 className="candidate-details__section-title">
                  Formación Académica
                </h2>
                {candidate.education.map((edu, index) => (
                  <div
                    key={edu.id || index}
                    className="candidate-details__card">
                    <h3 className="candidate-details__card-title">
                      {edu.title}
                    </h3>
                    <p className="candidate-details__card-subtitle">
                      {edu.institution}
                    </p>
                    <p className="candidate-details__card-date">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {edu.description && (
                      <p className="candidate-details__card-description">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="candidate-details__section">
                <h2 className="candidate-details__section-title">
                  Experiencia Laboral
                </h2>
                {candidate.experience.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    className="candidate-details__card">
                    <h3 className="candidate-details__card-title">
                      {exp.position}
                    </h3>
                    <p className="candidate-details__card-subtitle">
                      {exp.company}
                    </p>
                    <p className="candidate-details__card-date">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="candidate-details__card-description">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="candidate-details__section">
                <h2 className="candidate-details__section-title">Documentos</h2>
                <div className="candidate-details__documents">
                  {candidate.documents.cv && (
                    <div className="candidate-details__document">
                      <span className="candidate-details__document-icon">
                        📄
                      </span>
                      <span className="candidate-details__document-title">
                        Currículum Vitae
                      </span>
                      <a
                        href={candidate.documents.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="candidate-details__document-link">
                        Ver documento
                      </a>
                    </div>
                  )}

                  {candidate.documents.photo && (
                    <div className="candidate-details__document">
                      <span className="candidate-details__document-icon">
                        📷
                      </span>
                      <span className="candidate-details__document-title">
                        Fotografía
                      </span>
                      <a
                        href={candidate.documents.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="candidate-details__document-link">
                        Ver imagen
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-page__empty">
              <p>No se encontró el candidato solicitado.</p>
              <button
                type="button"
                onClick={handleBack}
                className="dashboard-page__button dashboard-page__button--secondary">
                Volver al listado
              </button>
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirm">
            <div
              className="delete-confirm__backdrop"
              onClick={handleCancelDelete}></div>
            <div className="delete-confirm__modal">
              <h3 className="delete-confirm__title">¿Eliminar candidato?</h3>
              <p className="delete-confirm__message">
                Esta acción no se puede deshacer. ¿Estás seguro de que deseas
                eliminar a este candidato?
              </p>
              <div className="delete-confirm__actions">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="delete-confirm__button delete-confirm__button--cancel">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="delete-confirm__button delete-confirm__button--confirm">
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
