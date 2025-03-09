import React, { useEffect, useState } from "react"

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
  fullHeight?: boolean // Nuovo prop per indicare se utilizzare altezza completa
}

interface SortConfig {
  key: string | null
  direction: "ascending" | "descending"
}

// Componente DataTable con ordinamento e paginazione
export function DataTable({
  columns,
  data,
  style,
  defaultSort,
  totalItems,
  fullHeight = true, // Default a true per rendere fullHeight il comportamento predefinito
}: DataTableProps) {
  // Debug log: verifica che i dati stiano arrivando al componente
  console.log("DataTable received data:", {
    dataLength: data?.length,
    columnsLength: columns?.length,
    dataType: Array.isArray(data) ? "Array" : typeof data,
    firstItem: data && data.length > 0 ? data[0] : "No data items",
  })

  // Responsive state
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const mobileBreakpoint = 768 // Breakpoint for mobile view

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = windowWidth < mobileBreakpoint

  // Filter columns based on device size
  const visibleColumns = React.useMemo(() => {
    // On mobile, only show columns with showOnMobile=true, or the first column if none specified
    if (isMobile) {
      const mobileColumns = columns.filter((col) => col.showOnMobile)
      // If no columns are explicitly marked for mobile, show just the first column (usually Name/Candidate)
      return mobileColumns.length > 0 ? mobileColumns : [columns[0]]
    }
    return columns
  }, [columns, isMobile])

  // Trova la colonna con ordinamento predefinito
  const defaultSortColumn = React.useMemo(() => {
    return columns.find((column) => column.defaultSort)
  }, [columns])

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const pageSize = 10 // Changed from 7 to 10 items per page

  // Stato per l'ordinamento, inizializzato con l'ordinamento predefinito se presente
  const [sortConfig, setSortConfig] = React.useState<SortConfig>(() => {
    if (defaultSort) {
      return {
        key: defaultSort.id,
        direction: defaultSort.desc ? "descending" : "ascending",
      }
    } else if (defaultSortColumn) {
      return {
        key: defaultSortColumn.accessorKey,
        direction: defaultSortColumn.defaultSort as "ascending" | "descending",
      }
    }
    return {
      key: null,
      direction: "ascending",
    }
  })

  // Extract the value from a row based on the accessorKey
  const getValueByAccessorKey = (row: any, accessorKey: string) => {
    const keys = accessorKey.split(".")
    let value = row
    for (const key of keys) {
      if (value === null || value === undefined) return ""
      value = value[key]
    }
    return value
  }

  // Function to sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const aValue = getValueByAccessorKey(a, sortConfig.key!)
      const bValue = getValueByAccessorKey(b, sortConfig.key!)

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize)
  const paginatedData = sortedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  // Handle sort change
  const handleSort = (key: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === key) {
        return {
          key,
          direction:
            prevSortConfig.direction === "ascending"
              ? "descending"
              : "ascending",
        }
      }
      return { key, direction: "ascending" }
    })
  }

  // Render sort indicator
  const renderSortIndicator = (column: Column) => {
    if (sortConfig.key !== column.accessorKey) return null

    return (
      <span style={{ marginLeft: "4px" }}>
        {sortConfig.direction === "ascending" ? "▲" : "▼"}
      </span>
    )
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
      overflow: "auto",
      minHeight: 0,
    }),
  }

  // Style dei controlli di paginazione
  const paginationContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
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
    <div style={containerStyle}>
      <div style={tableBodyContainerStyle}>
        {/* Responsive card view for mobile */}
        {isMobile ? (
          <div style={{ padding: "8px" }}>
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
                        : getValueByAccessorKey(row, column.accessorKey)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Traditional table view for desktop
          <div style={{ overflowY: "auto", height: "100%" }}>
            <table style={tableStyle}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.accessorKey}
                      onClick={() => handleSort(column.accessorKey)}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        borderBottom: "1px solid #e5e7eb",
                        cursor: "pointer",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      {column.header}
                      {renderSortIndicator(column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {visibleColumns.map((column) => (
                      <td
                        key={column.accessorKey}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {column.cell
                          ? column.cell({ row: { original: row } })
                          : getValueByAccessorKey(row, column.accessorKey)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {data.length > pageSize && (
        <div style={paginationContainerStyle}>
          <div>
            Showing{" "}
            <strong>
              {currentPage * pageSize + 1}-
              {Math.min((currentPage + 1) * pageSize, data.length)}
            </strong>{" "}
            of <strong>{data.length}</strong> results
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor: currentPage === 0 ? "#f3f4f6" : "white",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor:
                  currentPage === totalPages - 1 ? "#f3f4f6" : "white",
                cursor:
                  currentPage === totalPages - 1 ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
