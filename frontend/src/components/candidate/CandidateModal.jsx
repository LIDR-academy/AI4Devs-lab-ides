import React from "react"
import { Dialog, DialogClose, DialogContent, DialogHeader } from "../ui/dialog"
import CandidateForm from "./CandidateForm"

const CandidateModal = ({ isOpen, onClose, candidate, onSuccess }) => {
  const handleSuccess = (result) => {
    onSuccess(result)
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        {candidate ? "Edit Candidate" : "Add New Candidate"}
      </DialogHeader>
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
