import React, { createContext, useContext, useState } from "react"

/**
 * Contexto para manejar términos de búsqueda y filtros globales en la aplicación
 */
const SearchContext = createContext({
  searchTerm: "",
  setSearchTerm: () => {},
  statusFilter: "PENDING",
  setStatusFilter: () => {},
})

/**
 * Proveedor del contexto de búsqueda
 */
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("PENDING")

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

/**
 * Hook para acceder fácilmente al contexto de búsqueda
 */
export const useSearch = () => useContext(SearchContext)

export default SearchContext
