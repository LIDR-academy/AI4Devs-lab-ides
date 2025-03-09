import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "./dialog"

/**
 * Props per il componente ConfirmationDialog
 */
interface ConfirmationDialogProps {
  /** Se il dialogo è aperto */
  isOpen: boolean
  /** Funzione per chiudere il dialogo */
  onClose: () => void
  /** Funzione che viene eseguita alla conferma */
  onConfirm: () => void
  /** Titolo del dialogo */
  title?: string
  /** Messaggio del dialogo */
  message?: string
  /** Testo del pulsante di conferma */
  confirmText?: string
  /** Testo del pulsante di annullamento */
  cancelText?: string
  /** Stile del pulsante di conferma (danger, primary, ecc.) */
  confirmButtonStyle?: "danger" | "primary" | "cancel"
}

/**
 * Componente di dialogo di conferma generico
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonStyle = "danger",
}: ConfirmationDialogProps) => {
  // Stili per i pulsanti
  const buttonBaseStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  }

  const buttonStyles: Record<string, React.CSSProperties> = {
    cancel: {
      ...buttonBaseStyle,
      backgroundColor: "#f3f4f6",
      color: "#374151",
    },
    danger: {
      ...buttonBaseStyle,
      backgroundColor: "#ef4444",
      color: "white",
    },
    primary: {
      ...buttonBaseStyle,
      backgroundColor: "#3b82f6",
      color: "white",
    },
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>{title}</DialogHeader>
      <DialogClose onClick={onClose} />
      <DialogContent>
        <p style={{ marginTop: 0, marginBottom: "24px" }}>{message}</p>
      </DialogContent>
      <DialogFooter>
        <button style={buttonStyles.cancel} onClick={onClose}>
          {cancelText}
        </button>
        <button
          style={buttonStyles[confirmButtonStyle]}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </DialogFooter>
    </Dialog>
  )
}

export default ConfirmationDialog
