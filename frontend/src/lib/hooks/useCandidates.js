import { useCallback, useEffect, useState } from "react"
import { deleteCandidate, getCandidates } from "../api"

/**
 * Hook personalizado para gestionar candidatos
 * @returns {Object} Objeto con candidatos, funciones y estados
 */
const useCandidates = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar candidatos
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getCandidates()
      setCandidates(data)
    } catch (err) {
      console.error("Error fetching candidates:", err)
      setError("Failed to load candidates")
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar candidatos al montar el componente
  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  // Eliminar candidato
  const handleDeleteCandidate = useCallback(async (id) => {
    try {
      await deleteCandidate(id)
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id))
      return true
    } catch (err) {
      console.error("Error deleting candidate:", err)
      return false
    }
  }, [])

  // Recargar candidatos (útil después de añadir/editar)
  const refreshCandidates = useCallback(() => {
    fetchCandidates()
  }, [fetchCandidates])

  return {
    candidates,
    loading,
    error,
    deleteCandidate: handleDeleteCandidate,
    refreshCandidates,
  }
}

export default useCandidates
