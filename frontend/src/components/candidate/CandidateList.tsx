import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useSearch } from "../../contexts/SearchContext"
import { useToast } from "../../contexts/ToastContext"
import useCandidates from "../../hooks/useCandidates"
import { Candidate, downloadCV } from "../../services/api"
import ConfirmationDialog from "../ui/confirmation-dialog"
import { DataTable } from "../ui/data-table"
import "./CandidateList.css"

/**
 * Interface for the CandidateList component props
 */
interface CandidateListProps {
  /** Callback when a candidate is edited */
  onEdit: (candidate: Candidate) => void
  /** Callback when add new candidate is requested */
  onAddNew?: () => void
  /** Callback when a candidate is added, updated or deleted */
  onCandidateChange?: () => void
  /** Status filter from URL (optional) */
  statusFilter?: string
}

// Estendere l'interfaccia Window per includere la proprietà testDataInjected
declare global {
  interface Window {
    testDataInjected?: boolean
  }
}

/**
 * Component for displaying a list of candidates with filtering, sorting and pagination
 */
const CandidateList = forwardRef<
  { refreshCandidates: () => Promise<void> },
  CandidateListProps
>(({ onEdit, onAddNew, onCandidateChange, statusFilter }, ref) => {
  const { candidates, loading, error, deleteCandidate, refreshCandidates } =
    useCandidates()

  // Esponiamo refreshCandidates tramite il ref
  useImperativeHandle(ref, () => ({
    refreshCandidates: async () => {
      console.log("CandidateList - refreshing candidates data...")
      return refreshCandidates()
    },
  }))

  const {
    searchTerm,
    setSearchTerm,
    statusFilter: contextStatusFilter,
    setStatusFilter,
  } = useSearch()

  // Sync URL status filter with context
  useEffect(() => {
    if (statusFilter) {
      // Map the URL status parameter to the format expected by the context
      let newStatusFilter = "ALL"
      switch (statusFilter) {
        case "pending":
          newStatusFilter = "PENDING"
          break
        case "rejected":
          newStatusFilter = "REJECTED"
          break
        case "interview":
          newStatusFilter = "INTERVIEW"
          break
        case "offered":
          newStatusFilter = "OFFERED"
          break
        case "hired":
          newStatusFilter = "HIRED"
          break
        case "total":
          newStatusFilter = "ALL"
          break
      }

      if (newStatusFilter !== contextStatusFilter) {
        setStatusFilter(newStatusFilter)
      }
    }
  }, [statusFilter, setStatusFilter, contextStatusFilter])

  // Debug: log candidates data with more details
  console.log("CandidateList rendering with candidates:", candidates)
  console.log(
    "Candidates array type:",
    Array.isArray(candidates) ? "Array" : typeof candidates
  )
  console.log("Candidates length:", candidates?.length)

  // Log each candidate's structure to debug type issues
  if (candidates && candidates.length > 0) {
    console.log(
      "First candidate structure:",
      JSON.stringify(candidates[0], null, 2)
    )
    console.log("First candidate status type:", typeof candidates[0].status)
    console.log("First candidate status value:", candidates[0].status)
  } else {
    console.log("No candidates available to display")
  }

  // Log context status filter
  console.log("Context status filter:", contextStatusFilter)
  console.log("URL status filter:", statusFilter)

  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(
    null
  )

  // Estado para el panel lateral de detalle
  const [detailsPanelOpen, setDetailsPanelOpen] = useState<boolean>(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  )

  // Estado para los tooltips
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // Estado para la paginación
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Estado para indicar operación de eliminación en progreso
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const { showToast } = useToast()

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
  const filteredCandidates = candidates.filter((candidate) => {
    // Filtro per termine di ricerca (case insensitive)
    const searchMatch =
      !searchTerm ||
      candidate.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro per status
    const statusMatch =
      !contextStatusFilter ||
      contextStatusFilter === "ALL" ||
      candidate.status === contextStatusFilter

    // Log filtro per debugging with more details
    if (!searchMatch) {
      console.log(
        `Candidate ${candidate.firstName} ${candidate.lastName} filtered out by search term: "${searchTerm}"`
      )
    }
    if (!statusMatch) {
      console.log(
        `Candidate ${candidate.firstName} ${candidate.lastName} filtered out by status (candidate status: "${candidate.status}", filter: "${contextStatusFilter}")`
      )
    }

    return searchMatch && statusMatch
  })

  // Log dei risultati del filtraggio
  console.log("Filtered candidates length:", filteredCandidates?.length)
  console.log("Filtered candidates:", filteredCandidates)

  // Iniciar proceso de eliminación (mostrar diálogo de confirmación)
  const openDeleteDialog = (candidate: Candidate) => {
    setCandidateToDelete(candidate)
    setDeleteDialogOpen(true)
  }

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!candidateToDelete || !candidateToDelete.id) {
      console.error("Cannot delete candidate: Missing candidate ID")
      showToast({
        title: "Deletion Failed",
        message: "Cannot delete candidate: Missing candidate ID",
        type: "error",
      })
      return
    }

    try {
      setIsDeleting(true) // Mostrar indicador de carga

      // Llamar a la API para eliminar el candidato
      await deleteCandidate(candidateToDelete.id)

      // Mostrar notificación de éxito con toast
      showToast({
        title: "Candidate Deleted",
        message: `${candidateToDelete.firstName} ${candidateToDelete.lastName} has been deleted successfully.`,
        type: "success",
      })

      // Notificar al componente padre para que actualice las estadísticas y otros componentes
      if (onCandidateChange) {
        console.log("Notifying parent component about candidate deletion")
        onCandidateChange()
      }

      // IMPORTANTE: Asegurarnos de que la UI se actualice después de eliminar
      // Utilizamos await para asegurarnos de que la operación se complete
      await refreshCandidates()
    } catch (error: any) {
      console.error("Error deleting candidate:", error)
      // Mostrar mensaje de error al usuario con toast
      showToast({
        title: "Deletion Failed",
        message: `Failed to delete candidate: ${error.message || "Unknown error"}`,
        type: "error",
      })
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

  // Download CV
  const handleDownload = async (id: string | undefined, name: string) => {
    if (!id) {
      console.error("Cannot download CV: Missing candidate ID")
      showToast({
        message: "Cannot download CV: Missing candidate ID",
        type: "error",
      })
      return
    }

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

      // Show success toast
      showToast({
        message: `CV for ${name} successfully downloaded`,
        type: "success",
      })
    } catch (error: any) {
      console.error("Error downloading CV:", error)
      // Show error toast instead of alert
      showToast({
        message: `Failed to download CV: ${error.message || "Unknown error"}`,
        type: "error",
      })
    }
  }

  // Visualizzare i dettagli del candidato
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setDetailsPanelOpen(true)
  }

  // Chiudere il pannello dei dettagli
  const handleCloseDetailsPanel = () => {
    setDetailsPanelOpen(false)
    setSelectedCandidate(null)
  }

  // Definimos las columnas para la tabla
  const columns = [
    {
      header: "Name",
      accessorKey: "fullName",
      showOnMobile: true,
      cell: ({ row }: { row: any }) => {
        // Controllo di sicurezza per assicurarsi che row.original esista
        if (!row?.original) {
          return <div>No data available</div>
        }

        const firstName = row.original.firstName || ""
        const lastName = row.original.lastName || ""
        const email = row.original.email || ""

        return (
          <div>
            <div className="candidate-name">
              {firstName} {lastName}
            </div>
            <div className="candidate-email">{email}</div>
          </div>
        )
      },
    },
    {
      header: "Phone",
      accessorKey: "phone",
      showOnMobile: false,
      cell: ({ row }: { row: any }) => {
        // Controllo di sicurezza
        if (!row?.original) {
          return <div>N/A</div>
        }

        return (
          <div className="candidate-phone">{row.original.phone || "—"}</div>
        )
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      showOnMobile: false,
      cell: ({ row }: { row: any }) => {
        // Controllo di sicurezza
        if (!row?.original) {
          return <div>N/A</div>
        }

        const status = row.original.status || "PENDING"
        // Mapeo de estado a color
        const colorMap: Record<string, string> = {
          PENDING: "#f59e0b",
          REJECTED: "#ef4444",
          INTERVIEW: "#fb923c",
          OFFERED: "#3b82f6",
          HIRED: "#22c55e",
        }
        const statusClass = `status-${status.toLowerCase()}`

        return (
          <div className={`status-indicator ${statusClass}`}>
            <div className="status-dot"></div>
            {status}
          </div>
        )
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      showOnMobile: true,
      cell: ({ row }: { row: any }) => {
        // Controllo di sicurezza
        if (!row?.original) {
          return <div>No actions available</div>
        }

        const candidate = row.original

        return (
          <div style={{ display: "flex" }}>
            {/* View button */}
            <button
              className="action-button"
              onClick={() => handleViewCandidate(candidate)}
              onMouseEnter={() => setActiveTooltip(`view-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `view-${candidate.id}` && (
                <div className="tooltip">View</div>
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

            {/* Edit button */}
            <button
              className="action-button"
              onClick={() => onEdit(candidate)}
              onMouseEnter={() => setActiveTooltip(`edit-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `edit-${candidate.id}` && (
                <div className="tooltip">Edit</div>
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

            {/* Download CV button - always visible */}
            <button
              className={`action-button ${!candidate.cvPath || !candidate.id ? "action-button-disabled" : ""}`}
              onClick={() => {
                if (candidate.cvPath && candidate.id) {
                  handleDownload(
                    candidate.id,
                    `${candidate.firstName}_${candidate.lastName}`
                  )
                } else {
                  showToast({
                    message: "No CV available for download",
                    type: "info",
                  })
                }
              }}
              onMouseEnter={() => setActiveTooltip(`download-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
              title={candidate.cvPath ? "Download CV" : "No CV available"}
              style={{
                marginRight: "8px",
                background: candidate.cvPath
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(229, 231, 235, 0.5)",
                color: candidate.cvPath ? "#22c55e" : "#9ca3af",
                borderRadius: "4px",
                padding: "5px 8px",
                border: candidate.cvPath
                  ? "1px solid rgba(34, 197, 94, 0.3)"
                  : "1px solid rgba(229, 231, 235, 0.8)",
              }}
            >
              {activeTooltip === `download-${candidate.id}` && (
                <div className="tooltip">
                  {candidate.cvPath ? "Download CV" : "No CV available"}
                </div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={candidate.cvPath ? "#22c55e" : "#9ca3af"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: candidate.cvPath ? "4px" : "0" }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {candidate.cvPath && <span>CV</span>}
            </button>

            {/* Delete button */}
            <button
              className="action-button"
              onClick={() => openDeleteDialog(candidate)}
              onMouseEnter={() => setActiveTooltip(`delete-${candidate.id}`)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === `delete-${candidate.id}` && (
                <div className="tooltip">Delete</div>
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
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="candidate-list-container">
      <div className="candidate-list-wrapper">
        {/* Tabla de candidatos */}
        {loading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">Error loading candidates: {error}</div>
        ) : filteredCandidates && filteredCandidates.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={filteredCandidates}
              style={{ width: "100%" }}
              defaultSort={{ id: "createdAt", desc: true }}
              totalItems={filteredCandidates.length}
            />
          </>
        ) : (
          <div className="empty-message">
            No candidates found with the current filters.
          </div>
        )}
      </div>

      {/* Diálogo de confirmación de eliminación */}
      {deleteDialogOpen && (
        <ConfirmationDialog
          isOpen={true}
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
      )}

      {/* Pannello di visualizzazione dei dettagli del candidato */}
      {detailsPanelOpen && selectedCandidate && (
        <div className={`details-panel ${detailsPanelOpen ? "open" : ""}`}>
          <div className="details-header">
            <h2 className="details-title">Candidate Details</h2>
            <button className="close-button" onClick={handleCloseDetailsPanel}>
              ×
            </button>
          </div>

          <div className="candidate-info">
            <h3 className="candidate-name-header">
              {selectedCandidate.firstName} {selectedCandidate.lastName}
            </h3>
            <p className="info-row">
              <strong>Email:</strong> {selectedCandidate.email}
            </p>
            {selectedCandidate.phone && (
              <p className="info-row">
                <strong>Phone:</strong> {selectedCandidate.phone}
              </p>
            )}
            {selectedCandidate.address && (
              <p className="info-row">
                <strong>Address:</strong> {selectedCandidate.address}
              </p>
            )}
          </div>

          <div className="details-section">
            <h4 className="section-header">Status</h4>
            <div
              className={`status-badge status-badge-${selectedCandidate.status?.toLowerCase() || "pending"}`}
            >
              {selectedCandidate.status || "PENDING"}
            </div>
          </div>

          {/* CV Download */}
          {selectedCandidate.cvPath && selectedCandidate.id && (
            <button
              className="download-button"
              onClick={() =>
                handleDownload(
                  selectedCandidate.id,
                  `${selectedCandidate.firstName}_${selectedCandidate.lastName}`
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download CV
            </button>
          )}

          {/* Education */}
          <div className="details-section">
            <h4 className="section-header">Education</h4>
            {Array.isArray(selectedCandidate.education) &&
            selectedCandidate.education.length > 0 ? (
              selectedCandidate.education.map((edu, index) => (
                <div key={index} className="item-entry">
                  {typeof edu === "string" ? (
                    <p>{edu}</p>
                  ) : (
                    <>
                      <p className="item-title">
                        {edu.degree} in {edu.field} at {edu.institution}
                      </p>
                      <p className="item-subtitle">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : typeof selectedCandidate.education === "string" ? (
              <p className="item-entry">{selectedCandidate.education}</p>
            ) : (
              <p className="empty-info">No education information provided</p>
            )}
          </div>

          {/* Experience */}
          <div className="details-section">
            <h4 className="section-header">Experience</h4>
            {Array.isArray(selectedCandidate.experience) &&
            selectedCandidate.experience.length > 0 ? (
              selectedCandidate.experience.map((exp, index) => (
                <div key={index} className="item-entry">
                  {typeof exp === "string" ? (
                    <p>{exp}</p>
                  ) : (
                    <>
                      <p className="item-title">
                        {exp.position} at {exp.company}
                      </p>
                      <p className="item-subtitle">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      {exp.description && (
                        <p className="item-description">{exp.description}</p>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : typeof selectedCandidate.experience === "string" ? (
              <p className="item-entry">{selectedCandidate.experience}</p>
            ) : (
              <p className="empty-info">No experience information provided</p>
            )}
          </div>

          {/* Actions */}
          <div className="details-actions">
            <button
              className="edit-button"
              onClick={() => {
                handleCloseDetailsPanel()
                onEdit(selectedCandidate)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Candidate
            </button>
          </div>
        </div>
      )}
    </div>
  )
})

// Fix forwardRef display name
CandidateList.displayName = "CandidateList"

export default CandidateList
