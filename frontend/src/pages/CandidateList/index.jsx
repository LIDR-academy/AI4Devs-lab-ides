import React, { useState } from "react"
import CandidateListComponent from "../../components/candidate/CandidateList"
import CandidateModal from "../../components/candidate/CandidateModal"
import Layout from "../../components/layout/Layout"

const CandidateListPage = () => {
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
    // Refresh the candidates list if needed
  }

  return (
    <>
      <Layout onAddCandidate={handleAddCandidate}>
        <CandidateListComponent
          onEdit={handleEditCandidate}
          onAddNew={handleAddCandidate}
          onCandidateChange={handleCandidateChange}
        />
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

export default CandidateListPage
