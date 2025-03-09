import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react"
import { v4 as uuidv4 } from "uuid"
import { ToastContainer, ToastProps } from "../components/ui/toast"
import { AppError } from "../utils/errorHandler"

/**
 * Interface for the toast context
 */
interface ToastContextType {
  /** Show a toast notification */
  showToast: (options: Omit<ToastProps, "id">) => string
  /** Show an error toast from an AppError */
  showErrorToast: (error: any) => string
  /** Hide a toast by ID */
  hideToast: (id: string) => void
}

/**
 * Context for managing toast notifications
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Hook for accessing the toast context
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

/**
 * Props for the ToastProvider component
 */
interface ToastProviderProps {
  /** Child components */
  children: ReactNode
}

/**
 * Provider component for toast notifications
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])
  // Store pending retries for cleanup
  const [pendingRetries, setPendingRetries] = useState<
    Record<string, { action: string; retry: () => Promise<any> }>
  >({})

  /**
   * Show a toast notification
   */
  const showToast = useCallback((options: Omit<ToastProps, "id">): string => {
    const id = uuidv4()
    const newToast: ToastProps = { id, ...options }

    setToasts((prevToasts) => [...prevToasts, newToast])

    return id
  }, [])

  /**
   * Show an error toast from an AppError
   */
  const showErrorToast = useCallback(
    (error: any): string => {
      const appError =
        error instanceof AppError ? error : AppError.fromError(error)
      const options = appError.getToastOptions()

      // If there's a retry function, add to pending retries
      if (appError.retry) {
        const id = uuidv4()
        setPendingRetries((prev) => ({
          ...prev,
          [id]: { action: "retry", retry: appError.retry! },
        }))

        return showToast({
          ...options,
        })
      }

      return showToast(options)
    },
    [showToast]
  )

  /**
   * Hide a toast by ID
   */
  const hideToast = useCallback(
    (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))

      // Clean up any pending retries
      if (pendingRetries[id]) {
        setPendingRetries((prev) => {
          const newRetries = { ...prev }
          delete newRetries[id]
          return newRetries
        })
      }
    },
    [pendingRetries]
  )

  /**
   * Handle toast actions
   */
  const handleAction = useCallback(
    (id: string, action: string) => {
      // Handle retry action
      if (action === "retry" && pendingRetries[id]) {
        pendingRetries[id]
          .retry()
          .then(() => {
            // Remove the toast and pending retry on success
            hideToast(id)
          })
          .catch((error: any) => {
            // Replace with a new error toast if retry fails
            hideToast(id)
            showErrorToast(error)
          })
      }
    },
    [hideToast, pendingRetries, showErrorToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, showErrorToast, hideToast }}>
      {children}
      <ToastContainer
        toasts={toasts}
        onClose={hideToast}
        onAction={handleAction}
      />
    </ToastContext.Provider>
  )
}

export const { Consumer: ToastConsumer } = ToastContext
