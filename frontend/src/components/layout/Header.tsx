import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearch } from "../../contexts/SearchContext"
import { StatusIconSelect } from "../statusIcon/StatusIcon"

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** Callback function for when the Add Candidate button is clicked */
  onAddCandidate: () => void
}

/**
 * Header component with search, filter and add candidate functionality
 */
const Header: React.FC<HeaderProps> = ({ onAddCandidate }) => {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const mobileBreakpoint = 768 // Breakpoint for mobile view

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= mobileBreakpoint) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = windowWidth < mobileBreakpoint

  // Use search context
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } =
    useSearch()

  // Import useNavigate from react-router-dom
  const navigate = useNavigate()

  // Standard gap between elements
  const standardGap = "16px"

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    width: "100%",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#cccccc",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: 0,
    margin: 0,
  }

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "64px",
    alignItems: isMobile ? "stretch" : "center",
    justifyContent: "space-between",
    margin: 0,
    padding: isMobile ? "12px" : "0 16px",
    maxWidth: "100%",
    width: "100%",
    position: "relative",
  }

  const logoStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }

  const logoContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: isMobile ? "space-between" : "flex-start",
    padding: isMobile ? "0 0 12px 0" : "0",
    borderBottom: isMobile ? "1px solid #e5e7eb" : "none",
  }

  const searchContainerStyle: React.CSSProperties = {
    display: "flex",
    flexGrow: 1,
    maxWidth: isMobile ? "100%" : "50%",
    position: "relative",
    marginLeft: isMobile ? 0 : standardGap,
    marginTop: isMobile ? "12px" : 0,
    marginBottom: isMobile ? "12px" : 0,
  }

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "20px",
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.5rem 0.5rem 36px",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderColor: "#d1d5db",
    outline: "none",
    backgroundColor: "white",
  }

  const rightSectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "stretch" : "center",
    gap: isMobile ? "12px" : standardGap,
    padding: isMobile ? "12px 0 0 0" : "0",
    borderTop: isMobile && isMobileMenuOpen ? "1px solid #e5e7eb" : "none",
    maxHeight: isMobile && !isMobileMenuOpen ? "0" : "1000px",
    overflow: "hidden",
    transition: "max-height 0.3s ease, padding 0.3s ease",
    width: isMobile ? "100%" : "auto",
  }

  const filterContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexDirection: isMobile ? "column" : "row",
    alignSelf: isMobile ? "stretch" : "auto",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: "#374151",
    fontWeight: "500",
    whiteSpace: "nowrap",
    alignSelf: isMobile ? "flex-start" : "auto",
  }

  const addButtonStyle: React.CSSProperties = {
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "0.375rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    border: "none",
    fontSize: "0.875rem",
    width: isMobile ? "100%" : "auto",
  }

  const mobileMenuButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    cursor: "pointer",
    color: "#4f46e5",
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)

    // Aggiungi redirect alla pagina corretta in base allo stato selezionato
    if (value === "ALL") {
      navigate("/dashboard")
    } else {
      // Converti il valore in lowercase per il formato URL
      const statusParam = value.toLowerCase()
      navigate(`/dashboard/${statusParam}`)
    }
  }

  const handleAddClick = () => {
    onAddCandidate()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={logoContainerStyle}>
          <div style={logoStyle}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "8px" }}
            >
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 7H7V17H9V7Z"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 7H15V12H17V7Z"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 7H11V9H13V7Z"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 11H11V14H13V11Z"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 16H11V17H13V16Z"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 14H15V17H17V14Z"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>ATS</span>
          </div>

          <button
            style={mobileMenuButtonStyle}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        <div style={searchContainerStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ ...searchIconStyle, color: "#9ca3af" }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search candidates..."
            style={inputStyle}
          />
        </div>

        <div style={rightSectionStyle}>
          <div style={filterContainerStyle}>
            <span style={labelStyle}>Status:</span>
            <StatusIconSelect
              value={statusFilter}
              onChange={handleStatusChange}
              includeAllOption={true}
            />
          </div>

          <button style={addButtonStyle} onClick={handleAddClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Candidate
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
