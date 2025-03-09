/**
 * Application configuration
 */
interface AppConfig {
  /** API base URL */
  apiUrl: string
  /** Maximum number of concurrent API connections */
  maxConnections: number
  /** Default timeout for API requests in milliseconds */
  apiTimeoutMs: number
  /** Whether to enable debug logging */
  debugMode: boolean
}

/**
 * Default application configuration
 */
const defaultConfig: AppConfig = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:3010/api",
  maxConnections: 6,
  apiTimeoutMs: 30000,
  debugMode: process.env.NODE_ENV === "development",
}

/**
 * Current application configuration
 */
let config: AppConfig = { ...defaultConfig }

/**
 * Get the current application configuration
 */
export const getConfig = (): Readonly<AppConfig> => {
  return Object.freeze({ ...config })
}

/**
 * Update the application configuration
 */
export const updateConfig = (newConfig: Partial<AppConfig>): AppConfig => {
  config = {
    ...config,
    ...newConfig,
  }
  return { ...config }
}

/**
 * Reset the configuration to defaults
 */
export const resetConfig = (): AppConfig => {
  config = { ...defaultConfig }
  return { ...config }
}

/**
 * Global application constants
 */
export const APP_CONSTANTS = {
  STATUS_OPTIONS: ["PENDING", "CONTACTED", "INTERVIEWED", "HIRED", "REJECTED"],
  EVALUATION_MAX: 5,
  TOAST_DURATION: 5000,
  PAGINATION_PAGE_SIZES: [10, 20, 50, 100],
  DEFAULT_PAGE_SIZE: 20,
} as const

export default config
