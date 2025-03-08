import { useCallback, useEffect, useState } from "react"
import { getStatistics } from "../services/api"
import { StatusCountStats } from "../types"

interface UseStatisticsResult {
  stats: StatusCountStats
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

const useStatistics = (): UseStatisticsResult => {
  const [stats, setStats] = useState<StatusCountStats>({
    total: 0,
    pending: 0,
    evaluated: 0,
    rejected: 0,
    interview: 0,
    offered: 0,
    hired: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getStatistics()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading statistics")
      console.error("Error fetching statistics:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  }
}

export default useStatistics
