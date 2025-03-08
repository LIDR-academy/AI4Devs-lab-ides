import React from "react"
import { Button } from "./button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

// Componente DataTable con ordinamento e paginazione
export function DataTable({ columns, data }) {
  // Trova la colonna con ordinamento predefinito
  const defaultSortColumn = React.useMemo(() => {
    return columns.find((column) => column.defaultSort)
  }, [columns])

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = React.useState(0)
  const pageSize = 5

  // Stato per l'ordinamento, inizializzato con l'ordinamento predefinito se presente
  const [sortConfig, setSortConfig] = React.useState(() => {
    if (defaultSortColumn) {
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
    const isSortable = column.accessorKey && column.accessorKey !== "actions"
    const isSorted = sortConfig.key === column.accessorKey
    const sortDirection = sortConfig.direction

    return (
      <div
        className={
          isSortable ? "cursor-pointer select-none flex items-center" : ""
        }
        onClick={isSortable ? () => requestSort(column.accessorKey) : undefined}
      >
        {typeof column.header === "function"
          ? column.header({})
          : column.header}
        {isSortable && (
          <span className="ml-2">
            {isSorted ? (
              sortDirection === "ascending" ? (
                "↑"
              ) : (
                "↓"
              )
            ) : (
              <span className="text-gray-300">↕</span>
            )}
          </span>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id || column.accessorKey}>
                  {renderSortableHeader(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.id || column.accessorKey || colIndex}
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
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="text-sm mx-2">
            Page {currentPage + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
