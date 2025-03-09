import React, { useEffect, useRef, useState } from "react"
import { Candidate } from "../../services/api"
import CandidateForm from "./CandidateForm"
import CandidateList from "./CandidateList"
import "./CandidateModal.css"

interface CandidateModalProps {
  isOpen: boolean
  onClose: () => void
  onCandidateChange?: () => void
  candidate?: Candidate | null
  isAdding?: boolean
}

/**
 * Modal component for adding/editing candidates
 */
const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  onCandidateChange,
  candidate = null,
  isAdding = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  )
  const candidateListRef = useRef<{
    refreshCandidates: () => Promise<void>
  } | null>(null)

  // Reset the state when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Set isEditing to true if we are adding a new candidate or editing an existing one
      setIsEditing(candidate !== null || isAdding)
      setCurrentCandidate(candidate)
    }
  }, [isOpen, candidate, isAdding])

  // Handle closing the modal
  const handleClose = () => {
    setIsEditing(false)
    setCurrentCandidate(null)
    onClose()
  }

  // Handle background click (close modal)
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Handle adding a new candidate
  const handleAddNew = () => {
    setCurrentCandidate(null)
    setIsEditing(true)
  }

  // Handle editing an existing candidate
  const handleEdit = (candidate: Candidate) => {
    setCurrentCandidate(candidate)
    setIsEditing(true)
  }

  // Handle completion of adding/editing
  const handleCandidateChange = async () => {
    try {
      // Refresh the candidate list
      if (candidateListRef.current) {
        await candidateListRef.current.refreshCandidates()
      }

      // Notify parent components
      if (onCandidateChange) {
        onCandidateChange()
      }

      // Return to the list view after saving
      setIsEditing(false)
      setCurrentCandidate(null)

      // Close the modal after a short delay to ensure all updates are processed
      setTimeout(() => {
        onClose()

        // Recargar la página después de cerrar el modal
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error("Error during candidate change:", error)
    }
  }

  // Handle cancellation of adding/editing
  const handleCancel = () => {
    setIsEditing(false)
    setCurrentCandidate(null)
  }

  return (
    <div
      className={`candidate-modal ${!isOpen ? "candidate-modal-hidden" : ""}`}
      onClick={handleBackgroundClick}
    >
      <div className="candidate-modal-content">
        <div className="candidate-modal-header">
          <h2 className="modal-title">
            {isEditing
              ? currentCandidate
                ? "Edit Candidate"
                : "Add Candidate"
              : "Candidates"}
          </h2>
          <button
            className="close-button"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="candidate-modal-body">
          {isEditing ? (
            <CandidateForm
              candidate={currentCandidate}
              onSaved={handleCandidateChange}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <CandidateList
                ref={candidateListRef}
                onEdit={handleEdit}
                onAddNew={handleAddNew}
                onCandidateChange={handleCandidateChange}
              />
              <div className="modal-actions">
                <button className="add-button" onClick={handleAddNew}>
                  Add Candidate
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateModal
