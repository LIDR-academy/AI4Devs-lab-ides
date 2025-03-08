/**
 * API service for communicating with the backend
 */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3010"

/**
 * Función para realizar peticiones a la API con manejo de errores
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones para fetch
 * @returns {Promise<any>} - Respuesta de la API
 */
const apiRequest = async (url, options = {}) => {
  try {
    console.log(`API Request: ${options.method || "GET"} ${url}`)
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `API Error: ${response.status} ${response.statusText}`,
      }))
      throw new Error(errorData.message || "API Error")
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error (${url}):`, error)
    throw error
  }
}

/**
 * Get candidates with optional filtering
 * @param {Object} params - Optional filter parameters
 * @returns {Promise<Array>} - List of candidates
 */
export const getCandidates = async (params = {}) => {
  try {
    // Asegurar que los resultados estén ordenados por fecha de creación descendente
    const defaultParams = {
      sort: "createdAt",
      order: "desc",
      ...params,
    }

    // Usar la API real en lugar de simulación
    const queryParams = new URLSearchParams(defaultParams).toString()
    const url = `${API_URL}/api/candidates${
      queryParams ? `?${queryParams}` : ""
    }`

    try {
      // Intentar obtener datos reales de la API
      return await apiRequest(url)
    } catch (apiError) {
      console.warn(
        "API connection failed, falling back to simulated data:",
        apiError
      )
      // Si la API falla, usar datos simulados como fallback
      return simulateCandidates()
    }
  } catch (error) {
    console.error("Error fetching candidates:", error)
    throw error
  }
}

/**
 * Get candidate by ID
 * @param {number} id - Candidate ID
 * @returns {Promise<Object>} - Candidate details
 */
export const getCandidateById = async (id) => {
  try {
    // Temporary simulation
    const candidates = simulateCandidates()
    const candidate = candidates.find((c) => c.id === id)

    if (!candidate) {
      throw new Error("Candidate not found")
    }

    return candidate

    // Real implementation:
    // return await apiRequest(`${API_URL}/api/candidates/${id}`);
  } catch (error) {
    console.error(`Error fetching candidate ${id}:`, error)
    throw error
  }
}

/**
 * Create a new candidate
 * @param {FormData} formData - Form data including file
 * @returns {Promise<Object>} - Created candidate
 */
export const createCandidate = async (formData) => {
  try {
    // Real implementation (no simulation for this):
    return await apiRequest(`${API_URL}/api/candidates`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header, let browser set it with boundary for FormData
    })
  } catch (error) {
    console.error("Error creating candidate:", error)
    throw error
  }
}

/**
 * Update an existing candidate
 * @param {number} id - Candidate ID
 * @param {FormData} formData - Form data including file
 * @returns {Promise<Object>} - Updated candidate
 */
export const updateCandidate = async (id, formData) => {
  try {
    // Real implementation (no simulation for this):
    return await apiRequest(`${API_URL}/api/candidates/${id}`, {
      method: "PUT",
      body: formData,
    })
  } catch (error) {
    console.error(`Error updating candidate ${id}:`, error)
    throw error
  }
}

/**
 * Delete a candidate
 * @param {number} id - Candidate ID
 * @returns {Promise<void>}
 */
export const deleteCandidate = async (id) => {
  try {
    console.log(`Deleting candidate with ID: ${id}`)

    // Llamada a la API real
    const result = await apiRequest(`${API_URL}/api/candidates/${id}`, {
      method: "DELETE",
    })

    console.log(`Successfully deleted candidate ${id}`)
    return result
  } catch (error) {
    console.error(`Error deleting candidate ${id}:`, error)
    // Propagar el error para que pueda ser manejado por el componente
    throw error
  }
}

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} - Statistics data
 */
export const getStatistics = async () => {
  try {
    return await apiRequest(`${API_URL}/api/statistics`)
  } catch (error) {
    console.error("Error fetching statistics:", error)
    throw error
  }
}

/**
 * Download candidate CV
 * @param {number} id - Candidate ID
 * @returns {Promise<Blob>} - CV file blob
 */
export const downloadCV = async (id) => {
  try {
    console.log(`Downloading CV for candidate ${id}`)
    const response = await fetch(`${API_URL}/api/candidates/${id}/cv`)

    if (!response.ok) {
      throw new Error("Failed to download CV")
    }

    return await response.blob()
  } catch (error) {
    console.error(`Error downloading CV for candidate ${id}:`, error)
    throw error
  }
}

/**
 * Get education suggestions for autocomplete
 * @returns {Promise<Array<string>>} - List of education terms
 */
export const getEducationSuggestions = async () => {
  try {
    return await apiRequest(`${API_URL}/api/suggestions/education`)
  } catch (error) {
    console.error("Error fetching education suggestions:", error)
    // Fallback suggestions if API fails
    return [
      "Bachelor of Computer Science",
      "Master of Business Administration",
      "Ph.D. in Computer Engineering",
      "Bachelor of Science in IT",
    ]
  }
}

/**
 * Get experience suggestions for autocomplete
 * @returns {Promise<Array<string>>} - List of experience terms
 */
export const getExperienceSuggestions = async () => {
  try {
    return await apiRequest(`${API_URL}/api/suggestions/experience`)
  } catch (error) {
    console.error("Error fetching experience suggestions:", error)
    // Fallback suggestions if API fails
    return [
      "Software Engineer at Google",
      "Frontend Developer at Microsoft",
      "Full Stack Developer at Amazon",
      "Data Scientist at Facebook",
    ]
  }
}

/**
 * Simulate candidates data for testing
 * @returns {Array} Array of candidate objects
 */
function simulateCandidates() {
  return [
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "js@mail.com",
      phone: "+1234567890",
      address: "123 Main St, City",
      education: "Bachelor of Computer Science",
      experience: "Software Engineer at Google",
      status: "PENDING",
      createdAt: "2023-03-05T10:30:00",
    },
    {
      id: 2,
      firstName: "Maria",
      lastName: "García",
      email: "mg@mail.com",
      phone: "+1987654321",
      address: "456 Oak St, Town",
      education: "Master of Business Administration",
      experience: "Product Manager at Spotify",
      status: "VALUATED",
      createdAt: "2023-03-07T14:20:00",
    },
    {
      id: 3,
      firstName: "Alex",
      lastName: "Johnson",
      email: "aj@mail.com",
      phone: "+1122334455",
      address: "789 Pine St, Village",
      education: "Ph.D. in Software Engineering",
      experience: "Data Scientist at Facebook",
      status: "PENDING",
      createdAt: "2023-03-06T09:15:00",
    },
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Williams",
      email: "sw@mail.com",
      phone: "+1567890123",
      address: "101 Elm St, Borough",
      education: "Master of Computer Science",
      experience: "Backend Developer at Twitter",
      status: "VALUATED",
      createdAt: "2023-03-08T11:45:00",
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Brown",
      email: "db@mail.com",
      phone: "+1908765432",
      address: "202 Maple St, District",
      education: "Bachelor of Engineering",
      experience: "Mobile Developer at Apple",
      status: "PENDING",
      createdAt: "2023-03-08T08:30:00",
    },
  ]
}
