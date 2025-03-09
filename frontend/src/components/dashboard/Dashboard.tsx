import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { useSearch } from "../../contexts/SearchContext"
import useStatistics from "../../hooks/useStatistics"
import { StatusCountStats } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

// Interfaccia per il riferimento esportato
interface DashboardRef {
  refreshStats: () => void
}

// Interfaccia per i props
interface DashboardProps {
  initialStatus?: CardType
  onStatusChange?: (status: string) => void
}

// Tipo per i tipi di card
type CardType =
  | "pending"
  | "rejected"
  | "interview"
  | "offered"
  | "hired"
  | "total"

/**
 * Componente Dashboard che muestra las cards con estadísticas
 * Ahora soporta un referencia para exponer la función de actualización
 * y la navegación basada en URL
 */
const Dashboard = forwardRef<DashboardRef, DashboardProps>(
  ({ initialStatus, onStatusChange }, ref) => {
    // Estado local para el filtro activo
    const [activeFilter, setActiveFilter] = useState<CardType>(
      initialStatus || "total"
    )
    const [hoveredCard, setHoveredCard] = useState<CardType | null>(null)
    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } =
      useSearch()
    const { stats, loading, error, refreshStats } = useStatistics()

    // Exponemos la función de actualización a través de la referencia
    useImperativeHandle(ref, () => ({
      refreshStats,
    }))

    // Actualizar el filtro activo cuando cambia el initialStatus
    useEffect(() => {
      if (initialStatus) {
        setActiveFilter(initialStatus)
      }
    }, [initialStatus])

    // Handle card click - now also updates URL
    const handleCardClick = (cardType: CardType) => {
      setActiveFilter(cardType)

      // Notify parent to update URL if callback is provided
      if (onStatusChange) {
        onStatusChange(cardType)
      }

      // Set the filter based on card type
      let currentFilter = "all"
      switch (cardType) {
        case "pending":
          currentFilter = "PENDING"
          setSearchTerm("")
          setStatusFilter("PENDING")
          break
        case "rejected":
          currentFilter = "REJECTED"
          setSearchTerm("")
          setStatusFilter("REJECTED")
          break
        case "interview":
          currentFilter = "INTERVIEW"
          setSearchTerm("")
          setStatusFilter("INTERVIEW")
          break
        case "offered":
          currentFilter = "OFFERED"
          setSearchTerm("")
          setStatusFilter("OFFERED")
          break
        case "hired":
          currentFilter = "HIRED"
          setSearchTerm("")
          setStatusFilter("HIRED")
          break
        case "total":
          currentFilter = "all"
          setSearchTerm("")
          setStatusFilter("ALL")
          break
      }
    }

    // Debug: log the received stats
    useEffect(() => {
      console.log("Stats received from hook:", stats)
    }, [stats])

    // Ensure statistics is defined
    const statistics: StatusCountStats = stats || {
      total: 0,
      pending: 0,
      rejected: 0,
      interview: 0,
      offered: 0,
      hired: 0,
    }

    // Función para obtener el icono según el tipo de card
    const getIcon = (cardType: CardType): string => {
      switch (cardType) {
        case "pending":
          return "🟡" // Amber
        case "rejected":
          return "🔴" // Red
        case "interview":
          return "🟠" // Orange
        case "offered":
          return "🔵" // Blue
        case "hired":
          return "🟢" // Verde (invece di 🟣)
        case "total":
          return "⚪" // White
        default:
          return "⚪"
      }
    }

    // Efecto para sincronizar activeFilter con el statusFilter externo
    useEffect(() => {
      // Convertir el statusFilter a minúsculas para coincidir con nuestros tipos de tarjetas
      const currentFilter = statusFilter.toLowerCase()

      // Si el statusFilter es uno de los valores válidos para nuestras tarjetas, actualizamos activeFilter
      if (
        [
          "pending",
          "rejected",
          "interview",
          "offered",
          "hired",
          "all",
        ].includes(currentFilter)
      ) {
        setActiveFilter(
          currentFilter === "all" ? "total" : (currentFilter as CardType)
        )
      }
    }, [statusFilter])

    // Estilos para las cards
    const getCardStyle = (cardType: CardType): React.CSSProperties => {
      const isActive = activeFilter === cardType

      // Colores bases para cada tipo de card, coincidiendo con los colores de status
      let baseColor: string
      let hoverBackgroundColor: string
      let activeBackgroundColor: string

      switch (cardType) {
        case "pending":
          baseColor = "#f59e0b" // Amber
          hoverBackgroundColor = "rgba(245, 158, 11, 0.1)"
          activeBackgroundColor = "rgba(245, 158, 11, 0.2)"
          break
        case "rejected":
          baseColor = "#ef4444" // Red
          hoverBackgroundColor = "rgba(239, 68, 68, 0.1)"
          activeBackgroundColor = "rgba(239, 68, 68, 0.2)"
          break
        case "interview":
          baseColor = "#fb923c" // Orange
          hoverBackgroundColor = "rgba(251, 146, 60, 0.1)"
          activeBackgroundColor = "rgba(251, 146, 60, 0.2)"
          break
        case "offered":
          baseColor = "#3b82f6" // Light Blue
          hoverBackgroundColor = "rgba(59, 130, 246, 0.1)"
          activeBackgroundColor = "rgba(59, 130, 246, 0.2)"
          break
        case "hired":
          baseColor = "#22c55e" // Verde (invece di Purple #9333ea)
          hoverBackgroundColor = "rgba(34, 197, 94, 0.1)"
          activeBackgroundColor = "rgba(34, 197, 94, 0.2)"
          break
        case "total":
          baseColor = "#6366f1" // Purple/Indigo
          hoverBackgroundColor = "rgba(99, 102, 241, 0.1)"
          activeBackgroundColor = "rgba(99, 102, 241, 0.2)"
          break
        default:
          baseColor = "#6b7280"
          hoverBackgroundColor = "rgba(107, 114, 128, 0.1)"
          activeBackgroundColor = "rgba(107, 114, 128, 0.2)"
      }

      const style: React.CSSProperties = {
        cursor: "pointer",
        backgroundColor: "#f3f4f6", // Fondo gris para todas las cards
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        transform: isActive ? "translateY(-2px)" : "none",
        padding: "8px",
        position: "relative", // Añadir position relative para el pseudo-elemento
      }

      if (hoveredCard === cardType && !isActive) {
        style.transform = "translateY(-1px)"
        style.backgroundColor = `${baseColor}15`
      }

      if (isActive) {
        style.backgroundColor = `${baseColor}15`
        style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)"
        // Non possiamo aggiungere ::after in React.CSSProperties, quindi lo gestiremo in modo diverso
      }

      return style
    }

    // Estilos para los títulos en mayúscula
    const titleStyle: React.CSSProperties = {
      textTransform: "uppercase",
      fontWeight: 700,
      fontSize: "0.8rem",
      letterSpacing: "0.05em",
    }

    // Obtener color para un tipo de card
    const getColor = (cardType: CardType): string => {
      switch (cardType) {
        case "pending":
          return "#f59e0b" // Amber
        case "rejected":
          return "#ef4444" // Red
        case "interview":
          return "#fb923c" // Orange
        case "offered":
          return "#3b82f6" // Light Blue
        case "hired":
          return "#22c55e" // Verde (invece di #9333ea Purple)
        case "total":
          return "#6366f1" // Purple/Indigo
        default:
          return "#6b7280"
      }
    }

    // Skeleton loader para las cards durante la carga
    const renderSkeleton = (): ReactNode => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )

    // Renombrar la función para reflejar su nuevo propósito
    const renderCardWithBorder = (
      cardType: CardType,
      children: ReactNode
    ): ReactNode => {
      const isActive = activeFilter === cardType
      const cardStyle = getCardStyle(cardType)
      const color = getColor(cardType)

      return (
        <div style={{ position: "relative" }}>
          <Card
            key={cardType}
            style={cardStyle}
            onClick={() => handleCardClick(cardType)}
            onMouseEnter={() => setHoveredCard(cardType)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {children}
          </Card>
          {isActive && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "5px",
                backgroundColor: color,
                borderTopLeftRadius: "0.375rem",
                borderBottomLeftRadius: "0.375rem",
              }}
            />
          )}
        </div>
      )
    }

    // Renderizar mensaje de error
    if (error) {
      return (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fee2e2",
            borderRadius: "8px",
            color: "#ef4444",
            marginBottom: "32px",
          }}
        >
          Error loading statistics: {error}
        </div>
      )
    }

    // Renderizar skeleton durante la carga
    if (loading) {
      return renderSkeleton()
    }

    // Mapear los valores de estadísticas a los tipos de tarjetas
    const cardValues = {
      total: statistics.total || 0,
      pending: statistics.pending || 0, // Pending = Contacted in our API
      interview: statistics.interview || 0,
      hired: statistics.hired || 0,
      rejected: statistics.rejected || 0,
      offered: 0, // This is not in our API, so we default to 0
    }

    // Renderizar el dashboard con las tarjetas
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Total Candidates Card */}
        {renderCardWithBorder(
          "total",
          <>
            <CardHeader>
              <CardTitle style={titleStyle}>Total Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {cardValues.total}
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: `${getColor("total")}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {getIcon("total")}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Pending Candidates Card */}
        {renderCardWithBorder(
          "pending",
          <>
            <CardHeader>
              <CardTitle style={titleStyle}>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {cardValues.pending}
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: `${getColor("pending")}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {getIcon("pending")}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Interview Candidates Card */}
        {renderCardWithBorder(
          "interview",
          <>
            <CardHeader>
              <CardTitle style={titleStyle}>Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {cardValues.interview}
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: `${getColor("interview")}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {getIcon("interview")}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Hired Candidates Card */}
        {renderCardWithBorder(
          "hired",
          <>
            <CardHeader>
              <CardTitle style={titleStyle}>Hired</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {cardValues.hired}
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: `${getColor("hired")}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {getIcon("hired")}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Rejected Candidates Card */}
        {renderCardWithBorder(
          "rejected",
          <>
            <CardHeader>
              <CardTitle style={titleStyle}>Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {cardValues.rejected}
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: `${getColor("rejected")}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {getIcon("rejected")}
                </div>
              </div>
            </CardContent>
          </>
        )}
      </div>
    )
  }
)

// Fix forwardRef display name
Dashboard.displayName = "Dashboard"

export default Dashboard
