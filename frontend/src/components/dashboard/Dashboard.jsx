import React, { useEffect, useState } from "react"
import { useSearch } from "../../lib/context/SearchContext"
import useStatistics from "../../lib/hooks/useStatistics"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

/**
 * Componente Dashboard que muestra las cards con estadísticas
 */
const Dashboard = () => {
  const { statistics, loading, error } = useStatistics()
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } =
    useSearch()
  const [hoveredCard, setHoveredCard] = useState(null)

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
      borderLeft: `5px solid ${baseColor}`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      transform: isActive ? "translateY(-2px)" : "none",
      padding: "8px",
      ...(hoveredCard === cardType &&
        !isActive && {
          transform: "translateY(-1px)",
          backgroundColor: `${baseColor}15`,
        }),
      ...(isActive && {
        backgroundColor: `${baseColor}15`,
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
      }),
    }
  }

  // Estilos para los títulos en mayúscula
  const titleStyle = {
    textTransform: "uppercase",
    fontWeight: 600,
    fontSize: "0.8rem",
    letterSpacing: "0.05em",
  }

  // Obtener color para un tipo de card
  const getColor = (cardType) => {}

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
      {loading ? (
        renderSkeleton()
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "16px",
            marginBottom: "32px",
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          {/* Total Candidates Card */}
          <Card
            style={{
              ...getCardStyle("total"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("total")}
            onMouseEnter={() => setHoveredCard("total")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>

          {/* Pending Card */}
          <Card
            style={{
              ...getCardStyle("pending"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("pending")}
            onMouseEnter={() => setHoveredCard("pending")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>

          {/* Evaluated Card */}
          <Card
            style={{
              ...getCardStyle("evaluated"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("evaluated")}
            onMouseEnter={() => setHoveredCard("evaluated")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>

          {/* Rejected Card */}
          <Card
            style={{
              ...getCardStyle("rejected"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("rejected")}
            onMouseEnter={() => setHoveredCard("rejected")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>

          {/* Interview Card */}
          <Card
            style={{
              ...getCardStyle("interview"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("interview")}
            onMouseEnter={() => setHoveredCard("interview")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>

          {/* Offered Card */}
          <Card
            style={{
              ...getCardStyle("offered"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("offered")}
            onMouseEnter={() => setHoveredCard("offered")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>

          {/* Hired Card */}
          <Card
            style={{
              ...getCardStyle("hired"),
              minWidth: "140px",
              minHeight: "90px",
            }}
            onClick={() => handleCardClick("hired")}
            onMouseEnter={() => setHoveredCard("hired")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle
                style={{
                  ...titleStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
          </Card>
        </div>
      )}
    </div>
  )
}

export default Dashboard
