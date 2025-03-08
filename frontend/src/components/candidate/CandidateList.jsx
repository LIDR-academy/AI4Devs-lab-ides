import { useEffect, useState } from "react"
import { useSearch } from "../../contexts/SearchContext"
import useCandidates from "../../hooks/useCandidates"
import { downloadCV } from "../../services/api"
import ConfirmationDialog from "../ui/confirmation-dialog"
import { DataTable } from "../ui/data-table"

/**
 * Componente para mostrar la lista de candidatos con opciones de filtrado
 */
const CandidateList = ({ onEdit, onAddNew, onCandidateChange }) => {
  const { candidates, loading, error, deleteCandidate, refreshCandidates } =
    useCandidates()

  // Debug: log candidates data
  useEffect(() => {
    console.log("CandidateList - candidates:", candidates)
    console.log("CandidateList - loading:", loading)
    console.log("CandidateList - error:", error)
  }, [candidates, loading, error])

  // Usar el contexto de búsqueda global
  const { searchTerm, statusFilter } = useSearch()

  // Estado para tooltips
  const [activeTooltip, setActiveTooltip] = useState(null)

  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [candidateToDelete, setCandidateToDelete] = useState(null)

  // Estado para el panel lateral de detalle
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  // Estado para indicar operación de eliminación en progreso
  const [isDeleting, setIsDeleting] = useState(false)

  // Effect para generar datos de prueba adicionales
  useEffect(() => {
    // Este efecto solo simula más datos para probar la paginación
    // En una aplicación real, esto vendría de la API
    if (candidates && candidates.length > 0 && candidates.length < 50) {
      const additionalCandidates = []
      // Generar al menos 30 candidatos adicionales
      for (let i = 0; i < 30; i++) {
        const templateCandidate = candidates[i % candidates.length]
        if (templateCandidate) {
          // Crear copia con datos ligeramente modificados
          const randomDate = new Date()
          randomDate.setDate(
            randomDate.getDate() - Math.floor(Math.random() * 30)
          ) // Fecha aleatoria en los últimos 30 días

          const statuses = [
            "PENDING",
            "EVALUATED",
            "REJECTED",
            "INTERVIEW",
            "OFFERED",
            "HIRED",
          ]
          const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)]

          additionalCandidates.push({
            ...templateCandidate,
            id: `seed-${i + 1}`,
            firstName: `Candidate ${i + 1}`,
            lastName: `Test`,
            email: `candidate${i + 1}@example.com`,
            createdAt: randomDate.toISOString(),
            status: randomStatus,
          })
        }
      }

      // En una aplicación real actualizaríamos el estado
      // Aquí solo lo simulamos para la UI mostrando en consola
      console.log(
        "Generated additional test candidates:",
        additionalCandidates.length
      )

      // Simular que los datos están disponibles en memoria
      // Esto no afecta los datos reales pero permite visualizar la paginación
      if (window && !window.testDataInjected) {
        window.testDataInjected = true
        setTimeout(() => {
          console.log("Simulated data refresh with additional candidates")
        }, 1000)
      }
    }
  }, [candidates])

  // Filtrar candidatos basados en término de búsqueda y estado
  const filteredCandidates = candidates
    ? candidates.filter((candidate) => {
        // Para búsqueda, buscar en nombre y email
        const matchesSearch =
          searchTerm === "" ||
          (candidate.firstName + " " + candidate.lastName)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())

        // Para estado, filtrar por el estado seleccionado
        const matchesStatus =
          statusFilter === "ALL" || candidate.status === statusFilter

        return matchesSearch && matchesStatus
      })
    : []

  // Abrir el panel de detalles
  const handleViewClick = (candidate) => {
    setSelectedCandidate(candidate)
    setDetailPanelOpen(true)

    // Para dispositivos móviles, bloquear scroll del body cuando panel está abierto
    document.body.style.overflow = "hidden"
  }

  // Cerrar el panel de detalles
  const closeDetailPanel = () => {
    setDetailPanelOpen(false)

    // Restaurar scroll y asegurar cierre completo
    document.body.style.overflow = ""

    // Limpiar selección después de un pequeño delay para evitar efectos visuales extraños
    setTimeout(() => {
      setSelectedCandidate(null)
    }, 300)
  }

  // Iniciar proceso de eliminación (mostrar diálogo de confirmación)
  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate)
    setDeleteDialogOpen(true)
  }

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!candidateToDelete) return

    try {
      setIsDeleting(true) // Mostrar indicador de carga

      // Llamar a la API para eliminar el candidato
      await deleteCandidate(candidateToDelete.id)

      // Actualizar la UI y mostrar mensaje de éxito
      refreshCandidates()

      // Notificar al componente padre para que actualice las estadísticas y otros componentes
      if (onCandidateChange) {
        console.log("Notifying parent component about candidate deletion")
        onCandidateChange()
      }

      // Mostrar notificación de éxito (podría ser reemplazado por un componente de toast)
      alert(
        `Candidate ${candidateToDelete.firstName} ${candidateToDelete.lastName} has been deleted successfully.`
      )
    } catch (error) {
      console.error("Error deleting candidate:", error)
      // Mostrar mensaje de error al usuario
      alert(`Failed to delete candidate: ${error.message || "Unknown error"}`)
    } finally {
      // Limpiar estado y cerrar diálogo
      setDeleteDialogOpen(false)
      setCandidateToDelete(null)
      setIsDeleting(false)
    }
  }

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setCandidateToDelete(null)
  }

  // Descargar CV
  const handleDownload = async (id, name) => {
    try {
      const blob = await downloadCV(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${name.replace(/\s+/g, "_")}_CV.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading CV:", error)
      alert("Failed to download CV")
    }
  }

  // Estilos
  const actionButtonStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    marginRight: "8px",
    position: "relative",
  }

  const tooltipStyle = {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    zIndex: 10,
    marginBottom: "4px",
  }

  const detailPanelStyle = {
    position: "fixed",
    top: 0,
    right: detailPanelOpen ? 0 : "-100%",
    width: "400px",
    maxWidth: "100%",
    height: "100vh",
    backgroundColor: "white",
    boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    padding: "20px",
    transition: "right 0.3s ease-in-out",
    overflowY: "auto",
  }

  const detailPanelHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #e5e7eb",
  }

  const totalCounterStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "16px",
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  }

  // Definición de columnas para la tabla
  const columns = [
    {
      id: "name",
      header: "CANDIDATE",
      accessorKey: "firstName",
      cell: ({ row }) => (
        <span>
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      id: "email",
      header: "EMAIL",
      accessorKey: "email",
      cell: ({ row }) => row.email,
      hideOnMobile: true,
    },
    {
      id: "phone",
      header: "PHONE",
      accessorKey: "phone",
      cell: ({ row }) => row.phone || "-",
      hideOnMobile: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "STATUS",
      hideOnMobile: true,
      cell: ({ row }) => {
        const status = row.status
        let color
        let icon

        switch (status) {
          case "PENDING":
            color = "#f59e0b" // Amber
            icon = "🟡"
            break
          case "EVALUATED":
            color = "#10b981" // Green
            icon = "🟢"
            break
          case "REJECTED":
            color = "#ef4444" // Red
            icon = "🔴"
            break
          case "INTERVIEW":
            color = "#fb923c" // Orange
            icon = "🟠"
            break
          case "OFFERED":
            color = "#3b82f6" // Light Blue
            icon = "🔵"
            break
          case "HIRED":
            color = "#4f46e5" // Indigo/Navy
            icon = "🟣"
            break
          default:
            color = "#6b7280"
            icon = "⚪"
        }

        return (
          <span
            style={{
              backgroundColor: `${color}20`,
              color,
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: 500,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textTransform: "uppercase",
            }}
          >
            <span>{icon}</span>
            <span>{status.replace(/_/g, " ")}</span>
          </span>
        )
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "CREATED AT",
      hideOnMobile: true,
      cell: ({ row }) => {
        const date = new Date(row.createdAt)
        return date
          .toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", "")
      },
    },
    {
      id: "actions",
      header: "", // Eliminado el texto "Actions"
      cell: ({ row }) => {
        const candidate = row
        return (
          <div style={{ display: "flex" }}>
            {/* Edit button */}
            <button
              className="action-button"
              style={actionButtonStyle}
              onClick={() => onEdit(candidate)}
              onMouseEnter={() => setActiveTooltip(`edit-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `edit-${candidate.id}` && (
                <div style={tooltipStyle}>Edit</div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>

            {/* Delete button */}
            <button
              className="action-button"
              style={actionButtonStyle}
              onClick={() => handleDeleteClick(candidate)}
              onMouseEnter={() => setActiveTooltip(`delete-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `delete-${candidate.id}` && (
                <div style={tooltipStyle}>Delete</div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>

            {/* View button */}
            <button
              className="action-button"
              style={actionButtonStyle}
              onClick={() => handleViewClick(candidate)}
              onMouseEnter={() => setActiveTooltip(`view-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `view-${candidate.id}` && (
                <div style={tooltipStyle}>View candidate</div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            {/* Download CV button */}
            <button
              className="action-button"
              style={actionButtonStyle}
              onClick={() =>
                handleDownload(
                  candidate.id,
                  `${candidate.firstName} ${candidate.lastName}`
                )
              }
              onMouseEnter={() => setActiveTooltip(`download-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `download-${candidate.id}` && (
                <div style={tooltipStyle}>Download CV</div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>
        )
      },
    },
  ]

  // Estilo personalizado para la tabla sin borde
  const tableStyle = {
    border: "none",
    boxShadow: "none",
    borderRadius: "0",
    overflow: "visible",
  }

  return (
    <div style={{ padding: "4px 0" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(0, 0, 0, 0.1)",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      ) : error ? (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "6px",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      ) : (
        <>
          <div className="responsive-table">
            <DataTable
              columns={columns}
              data={filteredCandidates || []}
              style={tableStyle}
              defaultSort={{
                id: "createdAt",
                desc: true,
              }}
              totalItems={filteredCandidates?.length || 0}
            />
          </div>
        </>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Candidate"
        message={
          candidateToDelete
            ? `Are you sure you want to delete ${candidateToDelete.firstName} ${candidateToDelete.lastName}?`
            : "Are you sure you want to delete this candidate?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />

      {/* Panel lateral de detalles con overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          display: detailPanelOpen ? "block" : "none",
          opacity: detailPanelOpen ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        onClick={closeDetailPanel}
      />

      <div style={detailPanelStyle}>
        {selectedCandidate && (
          <>
            <div style={detailPanelHeaderStyle}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                Candidate Details
              </h2>
              <button
                onClick={closeDetailPanel}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                &times;
              </button>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "22px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {(() => {
                  const status = selectedCandidate.status
                  let icon
                  switch (status) {
                    case "PENDING":
                      icon = "🟡"
                      break
                    case "EVALUATED":
                      icon = "🟢"
                      break
                    case "REJECTED":
                      icon = "🔴"
                      break
                    case "INTERVIEW":
                      icon = "🟠"
                      break
                    case "OFFERED":
                      icon = "🔵"
                      break
                    case "HIRED":
                      icon = "🟣"
                      break
                    default:
                      icon = "⚪"
                  }
                  return <span>{icon}</span>
                })()}
                <span>
                  {selectedCandidate.firstName} {selectedCandidate.lastName}
                </span>
              </h3>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Email:
                </label>
                <div>{selectedCandidate.email}</div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Phone:
                </label>
                <div>{selectedCandidate.phone || "Not provided"}</div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Address:
                </label>
                <div>{selectedCandidate.address || "Not provided"}</div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Education:
                </label>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedCandidate.education || "Not provided"}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Experience:
                </label>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedCandidate.experience || "Not provided"}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Created At:
                </label>
                <div>
                  {new Date(selectedCandidate.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  onClick={() => {
                    handleDownload(
                      selectedCandidate.id,
                      `${selectedCandidate.firstName} ${selectedCandidate.lastName}`
                    )
                  }}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Download CV
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CandidateList
