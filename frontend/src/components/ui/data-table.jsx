import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

// Componente DataTable con ordinamento e paginazione
export function DataTable({ columns, data, style, defaultSort, totalItems }) {
  // Trova la colonna con ordinamento predefinito
  const defaultSortColumn = React.useMemo(() => {
    return columns.find((column) => column.defaultSort)
  }, [columns])

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = React.useState(0)
  const pageSize = 5 // Cambiado a 5 elementos por página

  // Stato per l'ordinamento, inizializzato con l'ordinamento predefinito se presente
  const [sortConfig, setSortConfig] = React.useState(() => {
    if (defaultSort) {
      return {
        key: defaultSort.id,
        direction: defaultSort.desc ? "descending" : "ascending",
      }
    } else if (defaultSortColumn) {
      return {
        key: defaultSortColumn.accessorKey,
        direction: defaultSortColumn.defaultSort,
      }
    }
    return {
      key: null,
      direction: "ascending",
    }
  })

  // Funzione per ordinare i dati
  const sortedData = React.useMemo(() => {
    let sortableData = [...data]
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        // Gestione speciale per le date
        if (
          a[sortConfig.key] &&
          typeof a[sortConfig.key] === "string" &&
          (a[sortConfig.key].includes("T") || a[sortConfig.key].includes("-"))
        ) {
          const dateA = new Date(a[sortConfig.key])
          const dateB = new Date(b[sortConfig.key])
          if (sortConfig.direction === "ascending") {
            return dateA - dateB
          }
          return dateB - dateA
        }

        // Ordinamento standard per altri tipi di dati
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }, [data, sortConfig])

  // Funzione per gestire il click sull'intestazione della colonna
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Calcola il numero totale di pagine
  const pageCount = Math.ceil(sortedData.length / pageSize)

  // Ottieni i dati per la pagina corrente
  const startIndex = currentPage * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

  // Funzioni per la navigazione tra le pagine
  const previousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))
  }

  // Funzione per renderizzare l'intestazione della colonna con indicatore di ordinamento
  const renderSortableHeader = (column) => {
    // Una columna es ordenable si:
    // 1. Tiene accessorKey (para acceder a los datos)
    // 2. No es la columna de acciones
    // 3. No tiene la propiedad disableSorting establecida a true
    const isSortable =
      column.accessorKey &&
      column.accessorKey !== "actions" &&
      !column.disableSorting

    const isSorted = sortConfig.key === column.accessorKey
    const sortDirection = sortConfig.direction

    return (
      <div
        className={
          isSortable ? "cursor-pointer select-none flex items-center" : ""
        }
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
        onClick={isSortable ? () => requestSort(column.accessorKey) : undefined}
      >
        {typeof column.header === "function"
          ? column.header({})
          : column.header}
        {isSortable && (
          <span style={{ marginLeft: "5px" }}>
            {isSorted ? (
              <span style={{ color: "#ef4444" }}>
                {sortDirection === "ascending" ? "↑" : "↓"}
              </span>
            ) : (
              <span style={{ color: "#d1d5db" }}>↕</span>
            )}
          </span>
        )}
      </div>
    )
  }

  // Estilos predeterminados para la tabla
  const defaultTableStyles = {
    height: "100vh", // Ensure the table card stretches to the bottom of the page
    display: "flex",
    flexDirection: "column",
  }

  // Combinar estilos personalizados con los predeterminados
  const tableContainerStyle = {
    ...defaultTableStyles,
    ...(style || {}),
  }

  // Estilo para las celdas de la tabla
  const tableCellStyle = {
    borderBottom: "1px solid #f0f0f0",
    padding: "12px 16px",
    textAlign: "left",
  }

  const tableHeadStyle = {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: "600",
    padding: "12px 16px",
    textAlign: "left",
  }

  // Estilos para los botones de paginación
  const paginationButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    margin: "0 4px",
    color: "#3b82f6",
    transition: "all 0.2s ease",
  }

  const disabledButtonStyle = {
    ...paginationButtonStyle,
    opacity: 0.5,
    cursor: "not-allowed",
    color: "#6b7280",
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "360px",
      }}
    >
      <div style={tableContainerStyle}>
        <Table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            flex: "1 0 auto",
          }}
        >
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id || column.accessorKey}
                  style={tableHeadStyle}
                >
                  {renderSortableHeader(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "white" : "#f9fafb",
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.id || column.accessorKey || colIndex}
                      style={tableCellStyle}
                    >
                      {column.cell
                        ? column.cell({ row })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                  style={{ padding: "24px", color: "#6b7280" }}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Paginación siempre visible */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Centrado
          padding: "16px 0", // Ajustar el padding para que la paginación esté al fondo
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={previousPage}
          disabled={currentPage === 0}
          style={
            currentPage === 0 ? disabledButtonStyle : paginationButtonStyle
          }
          onMouseOver={(e) => {
            if (currentPage !== 0) {
              e.currentTarget.style.backgroundColor = "#f3f4f6"
              e.currentTarget.style.borderColor = "#3b82f6"
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 0) {
              e.currentTarget.style.backgroundColor = "white"
              e.currentTarget.style.borderColor = "#e5e7eb"
            }
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: "14px", margin: "0 8px" }}>
          Page {currentPage + 1} of {Math.max(1, pageCount)}
          {totalItems !== undefined && (
            <span style={{ marginLeft: "8px" }}>
              | Total items: {totalItems}
            </span>
          )}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage >= pageCount - 1 || pageCount <= 1}
          style={
            currentPage >= pageCount - 1 || pageCount <= 1
              ? disabledButtonStyle
              : paginationButtonStyle
          }
          onMouseOver={(e) => {
            if (currentPage < pageCount - 1 && pageCount > 1) {
              e.currentTarget.style.backgroundColor = "#f3f4f6"
              e.currentTarget.style.borderColor = "#3b82f6"
            }
          }}
          onMouseOut={(e) => {
            if (currentPage < pageCount - 1 && pageCount > 1) {
              e.currentTarget.style.backgroundColor = "white"
              e.currentTarget.style.borderColor = "#e5e7eb"
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
