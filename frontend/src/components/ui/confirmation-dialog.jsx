import React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog"

/**
 * Componente de diálogo de confirmación genérico
 *
 * @param {boolean} isOpen - Si el diálogo está abierto
 * @param {Function} onClose - Función para cerrar el diálogo
 * @param {Function} onConfirm - Función que se ejecuta al confirmar
 * @param {string} title - Título del diálogo
 * @param {string} message - Mensaje del diálogo
 * @param {string} confirmText - Texto del botón de confirmación
 * @param {string} cancelText - Texto del botón de cancelación
 * @param {string} confirmButtonStyle - Estilo del botón de confirmación (danger, primary, etc.)
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
}) => {
  // Estilos para los botones
  const buttonBaseStyle = {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  }

  const buttonStyles = {
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
