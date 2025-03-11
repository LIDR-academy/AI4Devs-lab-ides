/**
 * Base de datos en memoria para almacenar los candidatos
 * En un entorno de producción, esto sería una base de datos real
 */

// Almacén de datos compartido
const db = {
  candidates: [],
};

/**
 * Obtiene todos los candidatos
 * @param {Object} options - Opciones de paginación y filtrado
 * @returns {Array} - Lista de candidatos
 */
export const getCandidates = (options = {}) => {
  const { page = 1, limit = 10, search = "" } = options;

  // Aplicar filtro si hay un término de búsqueda
  let filteredCandidates = [...db.candidates];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredCandidates = filteredCandidates.filter(
      (candidate) =>
        candidate.personalInfo.name.toLowerCase().includes(searchLower) ||
        candidate.personalInfo.surnames.toLowerCase().includes(searchLower) ||
        candidate.personalInfo.email.toLowerCase().includes(searchLower)
    );
  }

  // Calcular metadatos de paginación
  const totalItems = filteredCandidates.length;
  const totalPages = Math.ceil(totalItems / limit);

  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  return {
    data: paginatedCandidates,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalItems,
      totalPages,
    },
  };
};

/**
 * Obtiene un candidato por ID
 * @param {string} id - ID del candidato
 * @returns {Object|null} - Candidato encontrado o null
 */
export const getCandidateById = (id) => {
  const candidate = db.candidates.find((c) => c.id === id);
  return candidate || null;
};

/**
 * Añade un nuevo candidato
 * @param {Object} candidateData - Datos del candidato
 * @returns {Object} - Candidato creado
 */
export const addCandidate = (candidateData) => {
  const newCandidate = {
    ...candidateData,
    id: candidateData.id || generateId(),
    createdAt: new Date().toISOString(),
  };

  db.candidates.push(newCandidate);
  return newCandidate;
};

/**
 * Actualiza un candidato existente
 * @param {string} id - ID del candidato
 * @param {Object} candidateData - Nuevos datos del candidato
 * @returns {Object|null} - Candidato actualizado o null
 */
export const updateCandidate = (id, candidateData) => {
  const index = db.candidates.findIndex((c) => c.id === id);

  if (index === -1) return null;

  const updatedCandidate = {
    ...db.candidates[index],
    ...candidateData,
    id, // Mantener el mismo ID
    updatedAt: new Date().toISOString(),
  };

  db.candidates[index] = updatedCandidate;
  return updatedCandidate;
};

/**
 * Elimina un candidato
 * @param {string} id - ID del candidato
 * @returns {boolean} - true si se eliminó, false si no existía
 */
export const deleteCandidate = (id) => {
  const initialLength = db.candidates.length;
  db.candidates = db.candidates.filter((c) => c.id !== id);
  return db.candidates.length < initialLength;
};

/**
 * Genera un ID único
 * @returns {string} - ID único
 */
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
