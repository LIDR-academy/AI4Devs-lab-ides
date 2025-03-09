const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3010/api"

// Helper para manejar respuestas HTTP
async function handleResponse(response) {
  // Se la risposta è 204 No Content, non tentare di analizzarla come JSON
  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage =
      errorData?.message || response.statusText || "Ha ocurrido un error"
    throw new Error(errorMessage)
  }

  try {
    const jsonResponse = await response.json()
    // Se la risposta ha una proprietà 'data', restituisci quella, altrimenti restituisci l'intera risposta
    return jsonResponse.data !== undefined ? jsonResponse.data : jsonResponse
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    return null // Restituisci null in caso di errore nell'analisi JSON
  }
}

// GET candidates
export const getCandidates = async () => {
  const response = await fetch(`${API_BASE_URL}/candidates`)
  console.log("Raw candidates response:", response)
  const result = await handleResponse(response)
  console.log("Parsed candidates data:", result)
  // Ritorna direttamente il risultato senza accedere a .data
  return result
}

// GET candidate by ID
export const getCandidate = async (id) => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`)
  return handleResponse(response).then((res) => res.data)
}

// POST new candidate
export const createCandidate = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: "POST",
    body: formData,
  })
  return handleResponse(response).then((res) => res.data)
}

// PUT update candidate
export const updateCandidate = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
    method: "PUT",
    body: formData,
  })
  return handleResponse(response).then((res) => res.data)
}

// DELETE candidate
export const deleteCandidate = async (id) => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
    method: "DELETE",
  })
  // Non c'è bisogno di analizzare la risposta come JSON per il 204 No Content
  // Ma usiamo comunque handleResponse per gestire eventuali errori
  await handleResponse(response)
  return undefined
}

// GET download CV
export const downloadCV = async (id) => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}/cv`)
  if (!response.ok) {
    throw new Error("Failed to download CV")
  }
  return await response.blob()
}

// GET statistics
export const getStatistics = async () => {
  const response = await fetch(`${API_BASE_URL}/statistics`)
  console.log("Raw statistics response:", response)
  const result = await handleResponse(response)
  console.log("Parsed statistics data:", result)
  // I dati sono già nel formato corretto, non c'è bisogno di accedere a .data
  return result
}

// GET education suggestions
export const getEducationSuggestions = async () => {
  const response = await fetch(`${API_BASE_URL}/suggestions/education`)
  return handleResponse(response).then((res) => res.data)
}

// GET experience suggestions
export const getExperienceSuggestions = async () => {
  const response = await fetch(`${API_BASE_URL}/suggestions/experience`)
  return handleResponse(response).then((res) => res.data)
}
