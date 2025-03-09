import React, { useState } from "react"

interface Column {
  header: string
  accessorKey: string
  showOnMobile?: boolean
  cell?: (props: any) => React.ReactNode
}

interface DefaultSort {
  column: string
  direction: "asc" | "desc"
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  style?: React.CSSProperties
  defaultSort?: DefaultSort
  totalItems?: number
  fullHeight?: boolean
  rowMaxHeight?: string
}

export function DataTable({
  columns,
  data,
  style,
  defaultSort,
  totalItems,
  fullHeight = true,
  rowMaxHeight = "56px",
}: DataTableProps) {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  // Estado para el ordenamiento
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(
    defaultSort
      ? { key: defaultSort.column, direction: defaultSort.direction }
      : null
  )

  // Filtrar columnas visibles
  const visibleColumns = columns.filter(
    (col) => !col.accessorKey.startsWith("_")
  )

  // Ordenar datos
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

  // Calcular datos paginados
  const paginatedData = sortedData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  // Calcular número total de páginas
  const totalPages = Math.ceil((totalItems || sortedData.length) / itemsPerPage)

  // Manejadores para cambiar de página
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // Manejar cambio de ordenamiento
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

  // Renderizar indicador de ordenamiento
  const renderSortIndicator = (column: Column) => {
    if (!sortConfig || sortConfig.key !== column.accessorKey) {
      return null
    }
    return (
      <span style={{ marginLeft: "4px" }}>
        {sortConfig.direction === "asc" ? " ↑" : " ↓"}
      </span>
    )
  }

  return (
    <div
      className="data-table-container"
      style={{
        ...style,
        width: "100%",
        height: fullHeight ? "100%" : "auto",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          overflow: "auto",
          marginBottom: "50px",
          paddingBottom: "10px",
        }}
      >
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
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {column.header}
                    {renderSortIndicator(column)}
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
                  height: "56px",
                }}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column.accessorKey}
                    style={{
                      padding: "10px 16px",
                      height: "56px",
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
      </div>

      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          height: "50px",
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
