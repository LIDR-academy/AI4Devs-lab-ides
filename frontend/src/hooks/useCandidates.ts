import { useCallback, useEffect, useState } from "react"
import * as api from "../services/api"
import { Candidate } from "../types"

interface UseCandidatesResult {
  candidates: Candidate[]
  loading: boolean
  error: string | null
  deleteCandidate: (id: string) => Promise<void>
  refreshCandidates: () => Promise<void>
}

const useCandidates = (): UseCandidatesResult => {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.getCandidates()
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

  const handleDeleteCandidate = async (id: string): Promise<void> => {
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
