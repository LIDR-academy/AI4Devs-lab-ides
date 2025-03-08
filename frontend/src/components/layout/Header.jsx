import React from "react"

const Header = () => {
  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    width: "100%",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#cccccc",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  }

  const containerStyle = {
    display: "flex",
    height: "64px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const logoStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#333333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const searchContainerStyle = {
    position: "relative",
    width: "300px",
  }

  const searchIconStyle = {
    position: "absolute",
    left: "10px",
    top: "10px",
    width: "16px",
    height: "16px",
    color: "#6b7280",
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
          LOGO ATS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 8px 8px 32px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
