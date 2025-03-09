import React, { useEffect } from "react"

/**
 * Toast component to display success or error messages
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the toast
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast (success or error)
 * @param {Function} props.onClose - Function to close the toast
 */
export const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div
      className={`toast ${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={() => onClose(id)}>
        ×
      </button>
    </div>
  )
}

/**
 * Container for all active toast notifications
 * @param {Object} props - Component props
 * @param {Array} props.toasts - Array of toast objects to display
 * @param {Function} props.onClose - Function to close a toast
 */
export const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
