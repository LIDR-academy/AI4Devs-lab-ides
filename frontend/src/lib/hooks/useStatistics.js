import { useEffect, useRef, useState } from "react"
import { getStatistics } from "../api"

// Variable para almacenar los datos en caché
let statisticsCache = null
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 minuto de duración de caché

/**
 * Hook personalizado para obtener estadísticas
 * @param {boolean} forceRefresh - Forzar la actualización de datos
 * @returns {Object} Objeto con estadísticas, estado de carga y errores
 */
const useStatistics = (forceRefresh = false) => {
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    valuated: 0,
    discarded: 0,
    todayCount: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const fetchStatistics = async () => {
      // Si tenemos datos en caché y no ha expirado y no se fuerza la actualización, usarlos
      const now = Date.now()
      if (
        !forceRefresh &&
        statisticsCache &&
        now - lastFetchTime < CACHE_DURATION
      ) {
        setStatistics(statisticsCache)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getStatistics()

        // Guardar los datos en caché
        statisticsCache = data
        lastFetchTime = now

        if (isMounted.current) {
          setStatistics(data)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching statistics:", err)
        if (isMounted.current) {
          setError("Failed to load statistics data")
          setLoading(false)
        }
      }
    }

    fetchStatistics()

    return () => {
      isMounted.current = false
    }
  }, [forceRefresh])

  return { statistics, loading, error }
}

export default useStatistics
