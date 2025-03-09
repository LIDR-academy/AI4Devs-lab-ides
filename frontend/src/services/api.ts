import { ApiResponse, Candidate, StatusCountStats } from "../types"

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3010/api"

// Helper para manejar respuestas HTTP
async function handleResponse<T>(response: Response): Promise<T> {
  // Se la risposta è 204 No Content, non tentare di analizzarla come JSON
  if (response.status === 204) {
    return null as T
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage =
      errorData?.message || response.statusText || "Ha ocurrido un error"
    throw new Error(errorMessage)
  }

  return await response.json()
}

// GET candidates
export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch(`${API_BASE_URL}/candidates`)
  return handleResponse<ApiResponse<Candidate[]>>(response).then(
    (res) => res.data
  )
}

// GET candidate by ID
export const getCandidate = async (id: string): Promise<Candidate> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`)
  return handleResponse<ApiResponse<Candidate>>(response).then(
    (res) => res.data
  )
}

// POST new candidate
export const createCandidate = async (
  formData: FormData
): Promise<Candidate> => {
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: "POST",
    body: formData,
  })
  return handleResponse<ApiResponse<Candidate>>(response).then(
    (res) => res.data
  )
}

// PUT update candidate
export const updateCandidate = async (
  id: string,
  formData: FormData
): Promise<Candidate> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
    method: "PUT",
    body: formData,
  })
  return handleResponse<ApiResponse<Candidate>>(response).then(
    (res) => res.data
  )
}

// DELETE candidate
export const deleteCandidate = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
    method: "DELETE",
  })
  // Non c'è bisogno di analizzare la risposta come JSON per il 204 No Content
  // Ma usiamo comunque handleResponse per gestire eventuali errori
  await handleResponse<null>(response)
}

// GET download CV
export const downloadCV = async (id: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}/cv`)
  if (!response.ok) {
    throw new Error("No se pudo descargar el CV")
  }
  return await response.blob()
}

// GET statistics
export const getStatistics = async (): Promise<StatusCountStats> => {
  const response = await fetch(`${API_BASE_URL}/statistics`)
  return handleResponse<ApiResponse<StatusCountStats>>(response).then(
    (res) => res.data
  )
}

// GET education suggestions
export const getEducationSuggestions = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/suggestions/education`)
  return handleResponse<ApiResponse<string[]>>(response).then((res) => res.data)
}

// GET experience suggestions
export const getExperienceSuggestions = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/suggestions/experience`)
  return handleResponse<ApiResponse<string[]>>(response).then((res) => res.data)
}
