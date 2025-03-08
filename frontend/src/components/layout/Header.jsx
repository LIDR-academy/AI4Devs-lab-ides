import React from "react"
import { useSearch } from "../../lib/context/SearchContext"

const Header = ({ onAddCandidate }) => {
  // Usar el contexto de búsqueda
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } =
    useSearch()

  // Distancia estándar entre elementos
  const standardGap = "16px"

  const headerStyle = {
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

  const containerStyle = {
    display: "flex",
    height: "64px",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 0,
    padding: 0,
    maxWidth: "100%",
    width: "100%",
    position: "relative",
  }

  const logoStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#333333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: 0,
    paddingLeft: "10px",
  }

  const searchContainerStyle = {
    position: "relative",
    width: "300px",
    maxWidth: "100%",
  }

  const searchIconStyle = {
    position: "absolute",
    left: "10px",
    top: "12px",
    width: "16px",
    height: "16px",
    color: "#6b7280",
  }

  const statusFilterStyle = {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
    height: "40px",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    backgroundImage:
      'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="292.4" height="292.4"><path fill="%236B7280" d="M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 15px center",
    backgroundSize: "12px",
    paddingRight: "30px",
    maxWidth: "100%",
    width: "100%",
  }

  const addButtonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "0 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    height: "40px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "background-color 0.15s ease",
    position: "absolute",
    right: "10px",
    top: "12px",
    zIndex: 5,
  }

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Manejar cambios en el filtro de estado
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
  }

  // Manejar clic en el botón Add Candidate
  const handleAddClick = () => {
    console.log("Add button clicked, onAddCandidate:", onAddCandidate)
    if (typeof onAddCandidate === "function") {
      onAddCandidate()
    } else {
      console.error("onAddCandidate is not a function", onAddCandidate)
    }
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={logoStyle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hide-on-mobile">LOGO ATS</span>
        </div>
        <div
          className="header-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: standardGap,
            marginLeft: "auto",
            marginRight: "170px",
            paddingRight: 0,
          }}
        >
          <div
            className="search-and-filters"
            style={{ display: "flex", gap: standardGap }}
          >
            <div style={searchContainerStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={searchIconStyle}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "8px 8px 8px 32px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  fontSize: "14px",
                }}
                className="responsive-width"
              />
            </div>

            {/* Filtro de estado */}
            <div style={{ width: "150px" }}>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                style={statusFilterStyle}
                className="responsive-width"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">🟡 PENDING</option>
                <option value="EVALUATED">🟢 EVALUATED</option>
                <option value="REJECTED">🔴 REJECTED</option>
                <option value="INTERVIEW">🟠 INTERVIEW</option>
                <option value="OFFERED">🔵 OFFERED</option>
                <option value="HIRED">🟣 HIRED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón Add Candidate posicionado absolutamente */}
        <button
          style={addButtonStyle}
          onClick={handleAddClick}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563eb")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#3b82f6")
          }
        >
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
          >
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          <span className="hide-on-mobile">Add Candidate</span>
        </button>
      </div>
    </header>
  )
}

export default Header
