import React, { useState } from "react"

interface Column {
  header: string
  accessorKey: string
  cell?: (props: { row: any }) => React.ReactNode
  defaultSort?: string
  // Proprietà che indica se la colonna è essenziale e deve essere mostrata anche su mobile
  showOnMobile?: boolean
}

interface DefaultSort {
  id: string
  desc: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  style?: React.CSSProperties
  defaultSort?: DefaultSort
  totalItems?: number
  fullHeight?: boolean // Prop para indicar si utilizar altura completa
  rowMaxHeight?: string // Nuevo prop para la altura máxima de las filas
}

interface SortConfig {
  key: string | null
  direction: "ascending" | "descending"
}

// DataTable component with sorting and pagination
export function DataTable({
  columns,
  data,
  style,
  defaultSort,
  totalItems,
  fullHeight = true,
  rowMaxHeight = "52px", // Reduced from 56px to 52px for better display
}: DataTableProps) {
  // Debug log: verifying that data is reaching the component
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("DataTable received data:", data)
    }
  }, [data])

  // State for mobile detection
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  // State for sorting, initialized with default sort if present
  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(
    defaultSort
      ? { key: defaultSort.column, direction: defaultSort.direction }
      : null
  )

  // Detect mobile devices
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Filter visible columns
  const visibleColumns = React.useMemo(() => {
    // On mobile, only show columns marked as showOnMobile
    if (isMobile) {
      return columns.filter((col) => col.showOnMobile)
    }
    return columns
  }, [columns, isMobile])

  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableData = [...data]
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }, [data, sortConfig])

  // Calculate paginated data
  const paginatedData = sortedData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  // Calculate total pages
  const totalPages = Math.ceil((totalItems || sortedData.length) / itemsPerPage)

  // Handlers for page changes
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // Handle sort change
  const handleSort = (column: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === column) {
        return {
          key: column,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key: column, direction: "asc" }
    })
  }

  // Styles for pagination controls
  const paginationContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
  }

  // Apply base style with any custom style
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse" as const,
    ...(fullHeight && { height: "100%" }),
    ...style,
  }

  // Container style che supporta fullHeight
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    ...(fullHeight && { height: "100%", minHeight: 0 }),
  }

  // Style del corpo della tabella con flex-grow quando fullHeight è true
  const tableBodyContainerStyle: React.CSSProperties = {
    ...(fullHeight && {
      flexGrow: 1,
      minHeight: 0,
    }),
  }

  // Mobile card view styles
  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  }

  return (
    <div
      className="data-table-container"
      style={{
        ...style,
        width: "100%",
        height: fullHeight ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden", // Solo el contenedor principal tiene overflow hidden
      }}
    >
      {/* Contenedor de la tabla con scroll */}
      <div
        style={{
          flexGrow: 1,
          overflow: "auto", // Solo este contenedor tiene scroll
          position: "relative",
        }}
      >
        {isMobile ? (
          // Vista de tarjetas para móvil
          <div className="mobile-cards-container">
            {paginatedData.map((row, rowIndex) => (
              <div key={rowIndex} style={cardStyle}>
                {visibleColumns.map((column) => (
                  <div key={column.accessorKey} style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      {column.header}
                    </div>
                    <div>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : row[column.accessorKey]}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Vista de tabla tradicional para desktop
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.accessorKey}
                    onClick={() => handleSort(column.accessorKey)}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      background: "#f8fafc",
                      position: "sticky",
                      top: 0,
                      cursor: "pointer",
                      borderBottom: "1px solid #e2e8f0",
                      whiteSpace: "nowrap",
                      zIndex: 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {column.header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    height: rowMaxHeight,
                  }}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.accessorKey}
                      style={{
                        padding: "10px 16px",
                        height: rowMaxHeight,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : row[column.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación como elemento normal al final (sin position sticky/absolute) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          borderRadius: "0 0 8px 8px",
          flexShrink: 0, // Evita que se encoja
        }}
      >
        <div>
          Showing {currentPage * itemsPerPage + 1}-
          {Math.min(
            (currentPage + 1) * itemsPerPage,
            totalItems || sortedData.length
          )}{" "}
          of {totalItems || sortedData.length} results
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            style={{
              padding: "6px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              backgroundColor: currentPage === 0 ? "#f1f5f9" : "#fff",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              color: currentPage === 0 ? "#94a3b8" : "#1e293b",
            }}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            style={{
              padding: "6px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              backgroundColor:
                currentPage >= totalPages - 1 ? "#f1f5f9" : "#fff",
              cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
              color: currentPage >= totalPages - 1 ? "#94a3b8" : "#1e293b",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
