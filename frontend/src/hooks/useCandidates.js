import { useCallback, useEffect, useState } from "react"
import * as api from "../services/api"

const useCandidates = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.getCandidates()
      console.log("Candidates data received in hook:", data)
      setCandidates(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar candidatos"
      )
      console.error("Error fetching candidates:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  const handleDeleteCandidate = async (id) => {
    try {
      await api.deleteCandidate(id)
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar candidato"
      )
      console.error("Error deleting candidate:", err)
      throw err // Re-throw to handle in UI
    }
  }

  return {
    candidates,
    loading,
    error,
    deleteCandidate: handleDeleteCandidate,
    refreshCandidates: fetchCandidates,
  }
}

export default useCandidates
