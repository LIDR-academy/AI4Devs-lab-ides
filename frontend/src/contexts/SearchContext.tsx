import React, { createContext, ReactNode, useContext, useState } from "react"

/**
 * Interface for the search context
 */
interface SearchContextType {
  /** Current search term */
  searchTerm: string
  /** Function to update search term */
  setSearchTerm: (term: string) => void
  /** Current status filter */
  statusFilter: string
  /** Function to update status filter */
  setStatusFilter: (status: string) => void
}

/**
 * Default context value
 */
const defaultSearchContext: SearchContextType = {
  searchTerm: "",
  setSearchTerm: () => {},
  statusFilter: "ALL",
  setStatusFilter: () => {},
}

// Create context with default value
const SearchContext = createContext<SearchContextType>(defaultSearchContext)

/**
 * Props for the SearchProvider component
 */
interface SearchProviderProps {
  /** Child components */
  children: ReactNode
}

/**
 * Provider component for search functionality
 */
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

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
 * Custom hook to use the search context
 */
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
