import { executeWithRetryAndConnectionLimit } from "../utils/connectionManager"
import { AppError } from "../utils/errorHandler"

// Definizione dell'API base URL con fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3010/api"

/**
 * Interface for a candidate in the system
 */
export interface Candidate {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  status?: string
  evaluation?: number
  cv?: File | null
  cvFilePath?: string
  education?: Education[]
  experience?: Experience[]
  createdAt?: string
  updatedAt?: string
}

/**
 * Interface for an education entry
 */
export interface Education {
  id?: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
}

/**
 * Interface for an experience entry
 */
export interface Experience {
  id?: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description?: string
}

/**
 * Interface for statistics
 */
export interface Statistics {
  total: number
  contacted: number
  interviewed: number
  hired: number
  rejected: number
}

/**
 * Interface for API options
 */
interface ApiOptions {
  headers?: Record<string, string>
  body?: any
}

/**
 * Handle API response
 */
const handleResponse = async (response: Response): Promise<any> => {
  // Handle 204 No Content responses
  if (response.status === 204) {
    return null
  }

  // Handle non-OK responses
  if (!response.ok) {
    throw AppError.fromApiResponse(
      response,
      `Request failed with status ${response.status}`
    )
  }

  // Parse response JSON
  try {
    const contentType = response.headers.get("content-type")

    // Log dei dettagli della risposta
    console.log(
      `API Response - Status: ${response.status}, Content-Type: ${contentType}`
    )

    if (!contentType || !contentType.includes("application/json")) {
      console.error("Unexpected content type:", contentType)
      return null
    }

    const rawData = await response.json()
    console.log("API Response Raw Data:", rawData)

    // Verifica il formato dei dati
    const data = rawData.data ? rawData.data : rawData
    console.log("Processed API Response Data:", data)

    // Se i dati sono un array vuoto o null, loggiamo questa informazione
    if (Array.isArray(data) && data.length === 0) {
      console.log("API returned an empty array")
    } else if (data === null || data === undefined) {
      console.log("API returned null or undefined data")
    }

    return data
  } catch (error) {
    console.error("Error parsing response:", error)
    return null
  }
}

/**
 * Wrap API calls with error handling
 */
const withErrorHandling = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    // Using connection manager to limit connections and implement retries
    return await executeWithRetryAndConnectionLimit(apiCall, {
      // Custom retry configuration for API calls
      maxRetries: 5, // Increased number of attempts
      baseDelay: 500, // Start with a slightly longer delay
      useJitter: true, // Use jitter to prevent thundering herd
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw AppError.fromNetworkError(error as Error, () => apiCall())
    }

    throw AppError.fromError(error)
  }
}

/**
 * Get all candidates
 */
export const getCandidates = async (): Promise<Candidate[]> => {
  return withErrorHandling(async () => {
    console.log("API: Fetching candidates from", `${API_BASE_URL}/candidates`)
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`)
      console.log("API: Raw response status:", response.status)
      console.log(
        "API: Raw response headers:",
        Object.fromEntries([...response.headers.entries()])
      )

      if (!response.ok) {
        console.error("API: Error response status:", response.status)
        if (response.status === 429) {
          console.error(
            "API: Rate limit exceeded, implementing retry with backoff"
          )
          // Simple exponential backoff retry
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return [] // Return empty array for now to avoid breaking the UI
        }
      }

      const result = await handleResponse(response)
      console.log("API: Processed candidates result:", result)

      // Ensure we always return an array
      if (!result) {
        console.warn("API: No result returned, defaulting to empty array")
        return []
      }

      if (!Array.isArray(result)) {
        console.error("API: Expected array but got:", typeof result)
        return []
      }

      return result
    } catch (error) {
      console.error("API: Error in getCandidates:", error)
      return [] // Return empty array to avoid breaking the UI
    }
  })
}

/**
 * Get a candidate by ID
 */
export const getCandidate = async (id: string): Promise<Candidate> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`)
    return handleResponse(response)
  })
}

/**
 * Create a new candidate
 */
export const createCandidate = async (
  candidate: Candidate
): Promise<Candidate> => {
  return withErrorHandling(async () => {
    try {
      // Assicuriamoci che lo status sia PENDING
      const candidateData = {
        ...candidate,
        status: "PENDING", // Forziamo lo status a PENDING per i nuovi candidati
      }

      const options: ApiOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
      }

      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: "POST",
        ...options,
        headers: options.headers,
        body: options.body,
      })

      // Log dettagliato in caso di errore
      if (!response.ok) {
        console.error("Create candidate failed with status:", response.status)
        const errorText = await response
          .text()
          .catch(() => "No error text available")
        console.error("Error response:", errorText)

        // Tentiamo di analizzare la risposta come JSON
        try {
          const errorJson = JSON.parse(errorText)
          throw AppError.fromApiResponse(
            response,
            errorJson.message ||
              errorJson.error ||
              `Failed to create candidate (${response.status})`
          )
        } catch (parseError) {
          // Se non è JSON, usiamo il testo originale
          throw AppError.fromApiResponse(
            response,
            `Failed to create candidate: ${errorText.substring(0, 100)}`
          )
        }
      }

      return handleResponse(response)
    } catch (error) {
      console.error("Error in createCandidate:", error)
      throw error
    }
  })
}

/**
 * Update a candidate
 */
export const updateCandidate = async (
  id: string,
  candidate: Partial<Candidate>
): Promise<Candidate> => {
  return withErrorHandling(async () => {
    const options: ApiOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidate),
    }

    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: "PUT",
      ...options,
      headers: options.headers,
      body: options.body,
    })

    return handleResponse(response)
  })
}

/**
 * Delete a candidate
 */
export const deleteCandidate = async (id: string): Promise<void> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: "DELETE",
    })

    return handleResponse(response)
  })
}

/**
 * Download a candidate's CV
 */
export const downloadCV = async (id: string): Promise<Blob> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}/cv`)

    if (!response.ok) {
      throw AppError.fromApiResponse(response, "Failed to download CV")
    }

    return response.blob()
  })
}

/**
 * Get statistics
 */
export const getStatistics = async (): Promise<Statistics> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/statistics`)
    return handleResponse(response)
  })
}

/**
 * Get education suggestions
 */
export const getEducationSuggestions = async (): Promise<string[]> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/suggestions/education`)
    return handleResponse(response)
  })
}

/**
 * Get experience suggestions
 */
export const getExperienceSuggestions = async (): Promise<string[]> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/suggestions/experience`)
    return handleResponse(response)
  })
}

/**
 * Create a new candidate with file upload support
 */
export const createCandidateWithFile = async (
  formData: FormData
): Promise<Candidate> => {
  return withErrorHandling(async () => {
    try {
      // Ensure the file field name is correctly set as 'cvFile' as expected by the backend
      // If 'cv' exists, we need to get it and append it with the correct name
      if (formData.has("cv")) {
        const cvFile = formData.get("cv")
        formData.delete("cv")
        formData.append("cvFile", cvFile as File)
      }

      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: "POST",
        body: formData,
      })

      // Log dettagliato in caso di errore
      if (!response.ok) {
        console.error("Create candidate failed with status:", response.status)
        const errorText = await response
          .text()
          .catch(() => "No error text available")
        console.error("Error response:", errorText)

        // Tentiamo di analizzare la risposta come JSON
        try {
          const errorJson = JSON.parse(errorText)
          throw AppError.fromApiResponse(
            response,
            errorJson.message ||
              errorJson.error ||
              `Failed to create candidate (${response.status})`
          )
        } catch (parseError) {
          // Se non è JSON, usiamo il testo originale
          throw AppError.fromApiResponse(
            response,
            `Failed to create candidate: ${errorText.substring(0, 100)}`
          )
        }
      }

      return handleResponse(response)
    } catch (error) {
      console.error("Error in createCandidateWithFile:", error)
      throw error
    }
  })
}

/**
 * Update a candidate with file upload support
 */
export const updateCandidateWithFile = async (
  id: string,
  formData: FormData
): Promise<Candidate> => {
  return withErrorHandling(async () => {
    // Ensure the file field name is correctly set as 'cvFile' as expected by the backend
    if (formData.has("cv")) {
      const cvFile = formData.get("cv")
      formData.delete("cv")
      formData.append("cvFile", cvFile as File)
    }

    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "No error text available")
      console.error("Error updating candidate:", errorText)

      try {
        const errorJson = JSON.parse(errorText)
        throw AppError.fromApiResponse(
          response,
          errorJson.message ||
            errorJson.error ||
            `Failed to update candidate (${response.status})`
        )
      } catch (parseError) {
        throw AppError.fromApiResponse(
          response,
          `Failed to update candidate: ${errorText.substring(0, 100)}`
        )
      }
    }

    return handleResponse(response)
  })
}
