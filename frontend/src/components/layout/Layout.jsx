import React from "react"
import Header from "./Header"

const Layout = ({ children, onAddCandidate }) => {
  const containerStyle = {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: "20px",
  }

  return (
    <div className="app-container" style={{ padding: 0, margin: 0 }}>
      <Header onAddCandidate={onAddCandidate} />
      <main className="main-content" style={{ padding: 0, margin: 0 }}>
        <div className="scrollable-content" style={{ padding: 0, margin: 0 }}>
          <div style={containerStyle}>{children}</div>
        </div>
      </main>
    </div>
  )
}

export default Layout
