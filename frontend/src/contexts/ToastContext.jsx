import { createContext, useContext, useState } from "react"
import { ToastContainer } from "../components/ui/toast"

// Create context
const ToastContext = createContext({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
})

// Create a custom ID for toasts
const generateId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = ({ message, type = "success", duration = 5000 }) => {
    const id = generateId()
    const newToast = { id, message, type, duration }
    setToasts((prevToasts) => [...prevToasts, newToast])
    return id
  }

  const hideToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  )
}

// Hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
