import React, { createContext, useContext, useState } from "react"

// Crear el contexto con un valor por defecto
const SearchContext = createContext({
  searchTerm: "",
  setSearchTerm: () => {},
  statusFilter: "ALL",
  setStatusFilter: () => {},
})

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

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

// Hook personalizado para usar el contexto
export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch debe usarse dentro de un SearchProvider")
  }
  return context
}
