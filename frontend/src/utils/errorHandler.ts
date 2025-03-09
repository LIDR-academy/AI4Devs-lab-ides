/**
 * Error categories for application errors
 */
export enum ErrorCategory {
  NETWORK = "network",
  VALIDATION = "validation",
  AUTHORIZATION = "authorization",
  NOT_FOUND = "notFound",
  SERVER = "server",
  UPLOAD = "upload",
  UNKNOWN = "unknown",
}

/**
 * Maps HTTP status codes to error categories
 */
export const mapStatusToCategory = (status: number): ErrorCategory => {
  if (status >= 400 && status < 500) {
    if (status === 400) return ErrorCategory.VALIDATION
    if (status === 401 || status === 403) return ErrorCategory.AUTHORIZATION
    if (status === 404) return ErrorCategory.NOT_FOUND
    if (status === 413) return ErrorCategory.UPLOAD
  }

  if (status >= 500) return ErrorCategory.SERVER

  return ErrorCategory.UNKNOWN
}

/**
 * Interface for the error options
 */
export interface ErrorOptions {
  category: ErrorCategory
  status?: number
  message: string
  originalError?: any
  retry?: () => Promise<any>
  metadata?: Record<string, any>
}

/**
 * Application Error class for standardized error handling
 */
export class AppError extends Error {
  category: ErrorCategory
  status?: number
  retry?: () => Promise<any>
  metadata?: Record<string, any>
  originalError?: any

  constructor(options: ErrorOptions) {
    super(options.message)

    this.name = "AppError"
    this.category = options.category
    this.status = options.status
    this.retry = options.retry
    this.metadata = options.metadata || {}
    this.originalError = options.originalError

    // Captures the stack trace properly in Node.js and most modern browsers
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  /**
   * Creates an AppError from an API response
   */
  static fromApiResponse(response: Response, message?: string): AppError {
    const category = mapStatusToCategory(response.status)

    return new AppError({
      category,
      status: response.status,
      message: message || `Request failed with status ${response.status}`,
      metadata: {
        url: response.url,
        statusText: response.statusText,
      },
    })
  }

  /**
   * Creates an AppError from a network error
   */
  static fromNetworkError(error: Error, retry?: () => Promise<any>): AppError {
    return new AppError({
      category: ErrorCategory.NETWORK,
      message: "Network error occurred. Check your internet connection.",
      originalError: error,
      retry,
    })
  }

  /**
   * Creates a generic AppError
   */
  static fromError(
    error: any,
    category: ErrorCategory = ErrorCategory.UNKNOWN
  ): AppError {
    if (error instanceof AppError) {
      return error
    }

    const message = error?.message || "An unexpected error occurred"

    return new AppError({
      category,
      message,
      originalError: error,
    })
  }

  /**
   * Gets user-friendly options based on error category
   */
  getToastOptions() {
    return {
      title: this.getTitle(),
      type: this.getToastType(),
      message: this.message,
      duration: this.getDuration(),
      actions: this.getActions(),
    }
  }

  /**
   * Gets appropriate title based on error category
   */
  getTitle(): string {
    switch (this.category) {
      case ErrorCategory.NETWORK:
        return "Connection Error"
      case ErrorCategory.VALIDATION:
        return "Validation Error"
      case ErrorCategory.AUTHORIZATION:
        return "Authentication Required"
      case ErrorCategory.NOT_FOUND:
        return "Not Found"
      case ErrorCategory.SERVER:
        return "Server Error"
      case ErrorCategory.UPLOAD:
        return "Upload Error"
      default:
        return "Error"
    }
  }

  /**
   * Gets appropriate toast type based on error category
   */
  getToastType(): "error" | "warning" | "info" {
    switch (this.category) {
      case ErrorCategory.VALIDATION:
      case ErrorCategory.UPLOAD:
        return "warning"
      case ErrorCategory.AUTHORIZATION:
      case ErrorCategory.NOT_FOUND:
        return "info"
      default:
        return "error"
    }
  }

  /**
   * Gets appropriate toast duration based on error category
   */
  getDuration(): number {
    switch (this.category) {
      case ErrorCategory.VALIDATION:
      case ErrorCategory.UPLOAD:
        return 8000 // Validation errors stay longer
      case ErrorCategory.NETWORK:
      case ErrorCategory.SERVER:
        return 0 // Network/server errors stay until dismissed
      default:
        return 5000
    }
  }

  /**
   * Gets appropriate actions based on error category and available retry function
   */
  getActions() {
    const actions = []

    if (this.retry) {
      actions.push({
        label: "Retry",
        action: "retry",
      })
    }

    return actions
  }
}

/**
 * Gets default message for error category
 */
export const getDefaultMessageForCategory = (
  category: ErrorCategory
): string => {
  switch (category) {
    case ErrorCategory.NETWORK:
      return "Network connection error. Please check your internet connection and try again."
    case ErrorCategory.VALIDATION:
      return "There was a problem with the data you provided. Please check your input and try again."
    case ErrorCategory.AUTHORIZATION:
      return "You are not authorized to perform this action. Please log in or contact an administrator."
    case ErrorCategory.NOT_FOUND:
      return "The requested resource could not be found."
    case ErrorCategory.SERVER:
      return "There was a problem on our server. Please try again later."
    case ErrorCategory.UPLOAD:
      return "There was a problem uploading your file. Please check the file size and type."
    case ErrorCategory.UNKNOWN:
    default:
      return "An unexpected error occurred. Please try again later."
  }
}
