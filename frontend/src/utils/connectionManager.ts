import { AppError, ErrorCategory } from "./errorHandler"

/**
 * Connection status for tracking active requests
 */
interface ConnectionStatus {
  active: number
  queue: Array<() => void>
  maxConcurrent: number
}

/**
 * Options for the retry mechanism
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries: number
  /** Base delay in ms between retries (will be increased exponentially) */
  baseDelay: number
  /** Whether to use jitter to avoid thundering herd problem */
  useJitter: boolean
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 300,
  useJitter: true,
}

/**
 * Global connection status tracker
 */
const connectionStatus: ConnectionStatus = {
  active: 0,
  queue: [],
  maxConcurrent: 6, // Default max concurrent requests
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
const calculateBackoffDelay = (
  attempt: number,
  baseDelay: number,
  useJitter: boolean
): number => {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt)

  // Add jitter to avoid all clients retrying at the same time
  if (useJitter) {
    // Add between 0-30% random jitter
    const jitter = Math.random() * 0.3 * exponentialDelay
    return exponentialDelay + jitter
  }

  return exponentialDelay
}

/**
 * Execute a function with retry capabilities
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  const retryOptions: RetryOptions = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Calculate delay with exponential backoff and optional jitter
        const delay = calculateBackoffDelay(
          attempt - 1,
          retryOptions.baseDelay,
          retryOptions.useJitter
        )

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      // Execute the function
      const result = await fn()
      return result
    } catch (error: any) {
      lastError = error

      // Don't retry on certain types of errors
      if (
        error instanceof AppError &&
        (error.category === ErrorCategory.VALIDATION ||
          error.category === ErrorCategory.AUTHORIZATION)
      ) {
        throw error
      }

      // Last attempt failed, throw the error
      if (attempt === retryOptions.maxRetries) {
        throw error
      }

      // Log retry attempt
      console.warn(
        `Attempt ${attempt + 1}/${retryOptions.maxRetries} failed, retrying...`,
        error
      )
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError || new Error("Unknown error during retry")
}

/**
 * Set maximum concurrent connections
 */
export const setMaxConcurrentConnections = (max: number): void => {
  connectionStatus.maxConcurrent = max

  // Process queue if we increased the limit
  processQueue()
}

/**
 * Process the connection queue
 */
const processQueue = (): void => {
  while (
    connectionStatus.active < connectionStatus.maxConcurrent &&
    connectionStatus.queue.length > 0
  ) {
    const nextRequest = connectionStatus.queue.shift()
    if (nextRequest) {
      nextRequest()
    }
  }
}

/**
 * Execute a function with connection management
 */
export const withConnectionLimit = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  // If we're under the connection limit, execute immediately
  if (connectionStatus.active < connectionStatus.maxConcurrent) {
    connectionStatus.active++

    try {
      return await fn()
    } finally {
      connectionStatus.active--
      processQueue()
    }
  }

  // Otherwise, queue the request
  return new Promise<T>((resolve, reject) => {
    connectionStatus.queue.push(async () => {
      connectionStatus.active++

      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        connectionStatus.active--
        processQueue()
      }
    })
  })
}

/**
 * Combined utility for connection management and retry
 */
export const executeWithRetryAndConnectionLimit = async <T>(
  fn: () => Promise<T>,
  retryOptions: Partial<RetryOptions> = {}
): Promise<T> => {
  return withConnectionLimit(() => withRetry(fn, retryOptions))
}
