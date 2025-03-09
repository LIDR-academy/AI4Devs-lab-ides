/**
 * Combina nombres de clases de manera condicional
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Formatea una fecha ISO a un formato local
 */
export function formatDate(dateString) {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Genera un ID único basado en timestamp y un valor aleatorio
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Trunca un texto si excede cierta longitud
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(text) {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convierte un objeto FormData a un objeto JSON
 */
export function formDataToJson(formData) {
  const result = {}
  formData.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/**
 * Debounce function para limitar la frecuencia de ejecución
 */
export function debounce(func, wait) {
  let timeout = null

  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
