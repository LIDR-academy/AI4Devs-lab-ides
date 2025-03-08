import { useEffect, useState } from "react"
import { useSearch } from "../../contexts/SearchContext"
import useStatistics from "../../hooks/useStatistics"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

/**
 * Componente Dashboard que muestra las cards con estadísticas
 */
const Dashboard = () => {
  const { stats, loading, error } = useStatistics()
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } =
    useSearch()
  const [hoveredCard, setHoveredCard] = useState(null)

  // Debug: log the received stats
  useEffect(() => {
    console.log("Stats received from hook:", stats)
  }, [stats])

  // Ensure statistics is defined
  const statistics = stats || {
    total: 0,
    pending: 0,
    evaluated: 0,
    rejected: 0,
    interview: 0,
    offered: 0,
    hired: 0,
  }

  // Inicializamos activeFilter como 'pending' para que coincida con el estado por defecto
  const [activeFilter, setActiveFilter] = useState("pending")

  // Función para obtener el icono según el tipo de card
  const getIcon = (cardType) => {
    switch (cardType) {
      case "pending":
        return "🟡" // Amber
      case "evaluated":
        return "🟢" // Green
      case "rejected":
        return "🔴" // Red
      case "interview":
        return "🟠" // Orange
      case "offered":
        return "🔵" // Blue
      case "hired":
        return "🟣" // Purple
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
        "evaluated",
        "rejected",
        "interview",
        "offered",
        "hired",
        "all",
      ].includes(currentFilter)
    ) {
      setActiveFilter(currentFilter === "all" ? "total" : currentFilter)
    }
  }, [statusFilter])

  // Función para manejar el clic en una tarjeta
  const handleCardClick = (cardType) => {
    // Guardar el filtro activo para resaltar la tarjeta
    setActiveFilter(cardType)

    switch (cardType) {
      case "pending":
        setSearchTerm("")
        setStatusFilter("PENDING")
        break
      case "evaluated":
        setSearchTerm("")
        setStatusFilter("EVALUATED")
        break
      case "rejected":
        setSearchTerm("")
        setStatusFilter("REJECTED")
        break
      case "interview":
        setSearchTerm("")
        setStatusFilter("INTERVIEW")
        break
      case "offered":
        setSearchTerm("")
        setStatusFilter("OFFERED")
        break
      case "hired":
        setSearchTerm("")
        setStatusFilter("HIRED")
        break
      case "total":
        setSearchTerm("")
        setStatusFilter("ALL")
        break
      default:
        setSearchTerm("")
        setStatusFilter("ALL")
    }
  }

  // Estilos para las cards
  const getCardStyle = (cardType) => {
    const isActive = activeFilter === cardType

    // Colores bases para cada tipo de card, coincidiendo con los colores de status
    let baseColor
    let hoverBackgroundColor
    let activeBackgroundColor

    switch (cardType) {
      case "pending":
        baseColor = "#f59e0b" // Amber
        hoverBackgroundColor = "rgba(245, 158, 11, 0.1)"
        activeBackgroundColor = "rgba(245, 158, 11, 0.2)"
        break
      case "evaluated":
        baseColor = "#10b981" // Green
        hoverBackgroundColor = "rgba(16, 185, 129, 0.1)"
        activeBackgroundColor = "rgba(16, 185, 129, 0.2)"
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
        baseColor = "#9333ea" // Purple (matching the dot color)
        hoverBackgroundColor = "rgba(147, 51, 234, 0.1)"
        activeBackgroundColor = "rgba(147, 51, 234, 0.2)"
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

    return {
      cursor: "pointer",
      backgroundColor: "#f3f4f6", // Fondo gris para todas las cards
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      transform: isActive ? "translateY(-2px)" : "none",
      padding: "8px",
      position: "relative", // Añadir position relative para el pseudo-elemento
      ...(hoveredCard === cardType &&
        !isActive && {
          transform: "translateY(-1px)",
          backgroundColor: `${baseColor}15`,
        }),
      ...(isActive && {
        backgroundColor: `${baseColor}15`,
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        "&::after": {
          // Estilo para el pseudo-elemento
          content: "''",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "5px",
          backgroundColor: baseColor,
        },
      }),
    }
  }

  // Estilos para los títulos en mayúscula
  const titleStyle = {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "0.8rem",
    letterSpacing: "0.05em",
  }

  // Obtener color para un tipo de card
  const getColor = (cardType) => {
    switch (cardType) {
      case "pending":
        return "#f59e0b" // Amber
      case "evaluated":
        return "#10b981" // Green
      case "rejected":
        return "#ef4444" // Red
      case "interview":
        return "#fb923c" // Orange
      case "offered":
        return "#3b82f6" // Light Blue
      case "hired":
        return "#9333ea" // Purple
      case "total":
        return "#6366f1" // Purple/Indigo
      default:
        return "#6b7280"
    }
  }

  // Skeleton loader para las cards durante la carga
  const renderSkeleton = () => (
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
  const renderCardWithBorder = (cardType, children) => {
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
              left: 0, // Cambiado de 'right' a 'left'
              bottom: 0,
              width: "5px",
              backgroundColor: color,
              borderTopLeftRadius: "8px", // Cambiado a bordes izquierdos
              borderBottomLeftRadius: "8px",
            }}
          />
        )}
      </div>
    )
  }

  // Mensaje de error si falla la carga
  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#FEE2E2",
          border: "1px solid #EF4444",
          borderRadius: "6px",
          color: "#B91C1C",
          marginBottom: "24px",
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div style={{ padding: "4px 0 24px 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            {/* Total Candidates Card */}
            {renderCardWithBorder(
              "total",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("total")}</span>
                      <span>ALL</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("total"),
                      }}
                    >
                      {statistics.total || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}

            {/* Pending Card */}
            {renderCardWithBorder(
              "pending",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("pending")}</span>
                      <span>PENDING</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("pending"),
                      }}
                    >
                      {statistics.pending || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}

            {/* Evaluated Card */}
            {renderCardWithBorder(
              "evaluated",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("evaluated")}</span>
                      <span>EVALUATED</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("evaluated"),
                      }}
                    >
                      {statistics.evaluated || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}

            {/* Rejected Card */}
            {renderCardWithBorder(
              "rejected",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("rejected")}</span>
                      <span>REJECTED</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("rejected"),
                      }}
                    >
                      {statistics.rejected || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}

            {/* Interview Card */}
            {renderCardWithBorder(
              "interview",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("interview")}</span>
                      <span>INTERVIEW</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("interview"),
                      }}
                    >
                      {statistics.interview || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}

            {/* Offered Card */}
            {renderCardWithBorder(
              "offered",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("offered")}</span>
                      <span>OFFERED</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("offered"),
                      }}
                    >
                      {statistics.offered || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}

            {/* Hired Card */}
            {renderCardWithBorder(
              "hired",
              <>
                <CardHeader>
                  <CardTitle
                    style={{
                      ...titleStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{getIcon("hired")}</span>
                      <span>HIRED</span>
                    </div>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: getColor("hired"),
                      }}
                    >
                      {statistics.hired || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
