import React from "react"
import Header from "./Header"

const Layout = ({ children }) => {
  const containerStyle = {
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "24px 16px",
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="scrollable-content">
          <div style={containerStyle}>{children}</div>
        </div>
      </main>
    </div>
  )
}

export default Layout
