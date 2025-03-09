import React, { useEffect } from "react"

/**
 * Interface for an action button on a toast
 */
export interface ToastAction {
  /** Label to display on the button */
  label: string
  /** Action identifier for when the button is clicked */
  action: string
}

/**
 * Props for the Toast component
 */
export interface ToastProps {
  /** Unique identifier for the toast */
  id: string
  /** Optional title for the toast */
  title?: string
  /** Message to display */
  message: string
  /** Type of toast (success, error, warning, or info) */
  type?: "success" | "error" | "warning" | "info"
  /** Optional array of action buttons */
  actions?: ToastAction[]
  /** Duration in milliseconds before auto-close (0 for no auto-close) */
  duration?: number
}

/**
 * Props for internal Toast component with callbacks
 */
interface ToastComponentProps extends ToastProps {
  /** Function to close the toast */
  onClose: (id: string) => void
  /** Function called when an action is clicked */
  onAction?: (id: string, action: string) => void
}

/**
 * Toast component to display success, error, or warning messages
 */
export const Toast: React.FC<ToastComponentProps> = ({
  id,
  title,
  message,
  type = "success",
  actions = [],
  onAction,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  // Get icon based on toast type
  const getIcon = (): React.ReactNode => {
    switch (type) {
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        )
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        )
      case "info":
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        )
    }
  }

  return (
    <div
      className={`toast ${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-content">
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-text">
          {title && <div className="toast-title">{title}</div>}
          <div className="toast-message">{message}</div>
        </div>
        <button
          className="toast-close"
          onClick={() => onClose(id)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {actions && actions.length > 0 && (
        <div className="toast-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className="toast-action-button"
              onClick={() => onAction && onAction(id, action.action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Props for the ToastContainer component
 */
interface ToastContainerProps {
  /** Array of toast objects to display */
  toasts: ToastProps[]
  /** Function to close a toast */
  onClose: (id: string) => void
  /** Function called when a toast action is clicked */
  onAction?: (id: string, action: string) => void
}

/**
 * Container for all active toast notifications
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  onAction,
}) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
          onAction={onAction}
        />
      ))}
    </div>
  )
}
