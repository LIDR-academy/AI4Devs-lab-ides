import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CandidateList from "../../components/candidate/CandidateList"
import CandidateModal from "../../components/candidate/CandidateModal"
import Dashboard from "../../components/dashboard/Dashboard"
import Layout from "../../components/layout/Layout"
import { Candidate } from "../../services/api"

interface DashboardRefType {
  refreshStats: () => void
}

interface CandidateListRefType {
  refreshCandidates: () => Promise<void>
}

// Tipo per i possibili parametri di status
type StatusParam =
  | "pending"
  | "rejected"
  | "interview"
  | "offered"
  | "hired"
  | "total"
  | undefined

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  )

  // Ottieni il parametro dello status dall'URL
  const { status } = useParams<{ status?: string }>()
  const navigate = useNavigate()

  // Verifica se lo status è valido
  const isValidStatus = (status?: string): status is StatusParam => {
    return (
      status === undefined ||
      [
        "pending",
        "rejected",
        "interview",
        "offered",
        "hired",
        "total",
      ].includes(status)
    )
  }

  // Status normalizzato (con controllo di validità)
  const normalizedStatus: StatusParam = isValidStatus(status)
    ? (status as StatusParam)
    : undefined

  // Se lo status non è valido, reindirizza alla dashboard principale
  useEffect(() => {
    if (status && !isValidStatus(status)) {
      navigate("/dashboard", { replace: true })
    }
  }, [status, navigate])

  // Funzione per gestire il cambio di status
  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "all") {
      navigate("/dashboard")
    } else {
      navigate(`/dashboard/${newStatus}`)
    }
  }

  // Riferimento al componente Dashboard per poterlo aggiornare
  const dashboardRef = useRef<DashboardRefType | null>(null)
  // Riferimento al componente CandidateList per poterlo aggiornare
  const candidateListRef = useRef<CandidateListRefType | null>(null)

  const handleAddCandidate = () => {
    setSelectedCandidate(null)
    setIsAdding(true)
    setIsModalOpen(true)
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsAdding(false)
    setIsModalOpen(true)
  }

  const handleCandidateChange = () => {
    console.log(
      "handleCandidateChange called - updating statistics and candidate list"
    )

    // Aggiorniamo le statistiche
    if (dashboardRef.current && dashboardRef.current.refreshStats) {
      console.log("Refreshing statistics...")
      dashboardRef.current.refreshStats()
    }

    // Aggiorniamo la lista dei candidati
    if (
      candidateListRef.current &&
      candidateListRef.current.refreshCandidates
    ) {
      console.log("Refreshing candidate list...")
      candidateListRef.current.refreshCandidates()
    }
  }

  return (
    <>
      <Layout onAddCandidate={handleAddCandidate}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            height: "100%",
          }}
        >
          {/* Panel de estadísticas - Passare il riferimento per poter aggiornare le statistiche */}
          <Dashboard
            ref={dashboardRef}
            initialStatus={normalizedStatus}
            onStatusChange={handleStatusChange}
          />

          {/* Lista de candidatos - Passare il riferimento per poter aggiornare la lista */}
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <CandidateList
              ref={candidateListRef}
              onEdit={handleEditCandidate}
              onAddNew={handleAddCandidate}
              onCandidateChange={handleCandidateChange}
              statusFilter={normalizedStatus}
            />
          </div>
        </div>
      </Layout>

      {/* Modal para añadir/editar candidato */}
      <CandidateModal
        isOpen={isModalOpen}
        candidate={selectedCandidate}
        isAdding={isAdding}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCandidate(null)
          setIsAdding(false)
        }}
        onCandidateChange={handleCandidateChange}
      />
    </>
  )
}

export default DashboardPage
