/**
 * API para la gestión de candidatos
 * Implementa funciones para interactuar con el backend
 */

// Constantes
const API_URL = "/api/candidates";

/**
 * Obtiene la lista de candidatos con paginación opcional
 * @param {Object} options - Opciones de filtrado y paginación
 * @returns {Promise<Object>} - Promesa con la respuesta
 */
export const getCandidates = async ({
  page = 1,
  limit = 10,
  search = "",
  sort = "",
} = {}) => {
  try {
    // Construir la URL con los parámetros de consulta
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(sort && { sort }),
    });

    const response = await fetch(`${API_URL}?${queryParams}`);

    // Si la respuesta no es correcta, lanzar error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener candidatos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener candidatos:", error);
    throw error;
  }
};

/**
 * Obtiene los detalles de un candidato específico
 * @param {string} id - ID del candidato
 * @returns {Promise<Object>} - Promesa con los datos del candidato
 */
export const getCandidateById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener el candidato");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el candidato con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo candidato en el sistema
 * @param {Object} candidateData - Datos del candidato a crear
 * @returns {Promise<Object>} - Promesa con la respuesta
 */
export const addCandidate = async (candidateData) => {
  try {
    // Para manejar archivos, usamos FormData
    const formData = new FormData();

    // Agregamos los datos básicos como JSON
    const { personalInfo, education, experience, documents } = candidateData;

    // Agregamos los datos como campos individuales de FormData
    formData.append("personalInfo", JSON.stringify(personalInfo));
    formData.append("education", JSON.stringify(education));
    formData.append("experience", JSON.stringify(experience));

    // Agregamos los archivos
    if (documents.cv) {
      formData.append("cv", documents.cv);
    }

    if (documents.photo) {
      formData.append("photo", documents.photo);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      // No establecemos Content-Type, el navegador lo hará automáticamente con boundary para FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al añadir el candidato");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al añadir candidato:", error);
    throw error;
  }
};

/**
 * Actualiza los datos de un candidato existente
 * @param {string} id - ID del candidato
 * @param {Object} candidateData - Nuevos datos del candidato
 * @returns {Promise<Object>} - Promesa con la respuesta
 */
export const updateCandidate = async (id, candidateData) => {
  try {
    // Similar a addCandidate, usamos FormData para archivos
    const formData = new FormData();

    const { personalInfo, education, experience, documents } = candidateData;

    formData.append("personalInfo", JSON.stringify(personalInfo));
    formData.append("education", JSON.stringify(education));
    formData.append("experience", JSON.stringify(experience));

    // Solo agregamos los archivos si han cambiado
    if (documents.cv && documents.cv instanceof File) {
      formData.append("cv", documents.cv);
    }

    if (documents.photo && documents.photo instanceof File) {
      formData.append("photo", documents.photo);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el candidato");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar el candidato con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un candidato del sistema
 * @param {string} id - ID del candidato a eliminar
 * @returns {Promise<Object>} - Promesa con la respuesta
 */
export const deleteCandidate = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar el candidato");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el candidato con ID ${id}:`, error);
    throw error;
  }
};
