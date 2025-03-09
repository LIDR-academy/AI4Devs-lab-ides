import { useCallback, useEffect, useState } from "react"
import { getStatistics } from "../services/api"

const useStatistics = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    rejected: 0,
    interview: 0,
    offered: 0,
    hired: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
