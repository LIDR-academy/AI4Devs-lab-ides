import React, { useState } from "react"
import CandidateList from "../../components/candidate/CandidateList"
import CandidateModal from "../../components/candidate/CandidateModal"
import Dashboard from "../../components/dashboard/Dashboard"
import Layout from "../../components/layout/Layout"

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const handleAddCandidate = () => {
    setSelectedCandidate(null)
    setIsModalOpen(true)
  }

  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  const handleCandidateChange = () => {
    // No es necesario navegar, solo actualizar los datos si es necesario
  }

  return (
    <>
      <Layout onAddCandidate={handleAddCandidate}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Panel de estadísticas */}
          <Dashboard />

          {/* Lista de candidatos */}
          <CandidateList
            onEdit={handleEditCandidate}
            onAddNew={handleAddCandidate}
            onCandidateChange={handleCandidateChange}
          />
        </div>
      </Layout>

      <CandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
        onSuccess={handleCandidateChange}
      />
    </>
  )
}

export default DashboardPage
