import { Dialog, DialogClose, DialogContent, DialogHeader } from "../ui/dialog"
import CandidateForm from "./CandidateForm"

const CandidateModal = ({ isOpen, onClose, candidate, onSuccess }) => {
  const handleSuccess = (result) => {
    onSuccess(result)
    onClose()

    // Reload the page only when adding a new candidate (not when editing)
    if (!candidate) {
      // Add a small delay to ensure the UI responds before reload
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  // Crear el título del modal
  const modalTitle = candidate
    ? `${candidate.firstName} ${candidate.lastName}`
    : "Add New Candidate"

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>{modalTitle}</DialogHeader>
      <DialogClose onClick={onClose} />
      <DialogContent>
        <CandidateForm
          candidate={candidate}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CandidateModal
