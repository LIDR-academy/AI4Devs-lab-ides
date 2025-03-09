import { useCallback, useEffect, useState } from "react"
import * as api from "../services/api"
import { Candidate } from "../services/api"

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
      console.log("useCandidates: Fetching candidates from API...")
      const data = await api.getCandidates()
      console.log("useCandidates: API response received:", data)

      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error("useCandidates: API did not return an array:", data)
        setCandidates([])
        setError("API did not return an array of candidates")
      } else {
        console.log(
          "useCandidates: Setting candidates array with length:",
          data.length
        )
        // Ensure all candidates have the required fields
        const validatedCandidates = data.map((candidate) => ({
          ...candidate,
          // Ensure status is a string and has a default value if missing
          status: candidate.status || "PENDING",
        })) as Candidate[]
        console.log("useCandidates: Validated candidates:", validatedCandidates)
        setCandidates(validatedCandidates)
      }
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
