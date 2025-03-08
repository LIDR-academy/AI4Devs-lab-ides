import React from "react"

const Footer = () => {
  const footerStyle = {
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#374151",
    padding: "8px 0",
  }

  const containerStyle = {
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const textStyle = {
    fontSize: "0.75rem",
    color: "white",
    margin: 0,
    fontWeight: "500",
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={textStyle}>ATS RECRUITING TICKET TRACKING</p>
      </div>
    </footer>
  )
}

export default Footer
