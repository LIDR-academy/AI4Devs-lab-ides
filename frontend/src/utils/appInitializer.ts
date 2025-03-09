import { getConfig } from "./config"
import { setMaxConcurrentConnections } from "./connectionManager"

/**
 * Initialize the application
 * This function should be called at application startup
 */
export const initializeApp = (): void => {
  const config = getConfig()

  // Configure connection manager
  setMaxConcurrentConnections(config.maxConnections)

  // Log initialization in development mode
  if (config.debugMode) {
    console.log(`🚀 Application initialized with configuration:`, {
      apiUrl: config.apiUrl,
      maxConnections: config.maxConnections,
      environment: process.env.NODE_ENV,
    })
  }
}

/**
 * Handle global uncaught errors
 */
export const setupErrorHandlers = (): void => {
  if (typeof window !== "undefined") {
    // Handle uncaught promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled Promise Rejection:", event.reason)
      // Here you could also log to an error tracking service like Sentry
    })

    // Handle uncaught exceptions
    window.addEventListener("error", (event) => {
      console.error("Uncaught Error:", event.error)
      // Here you could also log to an error tracking service like Sentry
    })
  }
}
