/**
 * Utilidades para validación de campos de formulario
 */

/**
 * Valida si un correo electrónico tiene formato válido
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Valida si un número de teléfono tiene formato válido
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validatePhone = (phone) => {
  // Permite formatos internacionales y diferentes separadores
  const regex = /^(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}$/;
  return regex.test(phone);
};

/**
 * Valida si una fecha está en el pasado
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si es válida, false si no
 */
export const validatePastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  // Resetea la hora para comparar solo la fecha
  today.setHours(0, 0, 0, 0);

  return date <= today;
};

/**
 * Valida si una fecha está en el futuro
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si es válida, false si no
 */
export const validateFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  // Resetea la hora para comparar solo la fecha
  today.setHours(0, 0, 0, 0);

  return date >= today;
};

/**
 * Compara dos fechas para asegurar que la segunda es posterior a la primera
 * @param {string} startDateString - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} endDateString - Fecha de fin en formato YYYY-MM-DD
 * @returns {boolean} - true si la segunda fecha es posterior, false si no
 */
export const validateDateRange = (startDateString, endDateString) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  return endDate >= startDate;
};

/**
 * Valida si un archivo es de tipo permitido
 * @param {File} file - Archivo a validar
 * @param {Array<string>} allowedTypes - Array de tipos MIME permitidos
 * @returns {boolean} - true si es válido, false si no
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Valida si un archivo no excede el tamaño máximo
 * @param {File} file - Archivo a validar
 * @param {number} maxSizeBytes - Tamaño máximo en bytes
 * @returns {boolean} - true si es válido, false si no
 */
export const validateFileSize = (file, maxSizeBytes) => {
  return file.size <= maxSizeBytes;
};
