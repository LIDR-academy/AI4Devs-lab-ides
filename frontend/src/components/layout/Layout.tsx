import React, { ReactNode, useEffect, useState } from "react"
import Header from "./Header"

/**
 * Props for the Layout component
 */
interface LayoutProps {
  /** Child components */
  children: ReactNode
  /** Callback for add candidate button */
  onAddCandidate: () => void
}

/**
 * Layout component providing the overall page structure
 */
const Layout: React.FC<LayoutProps> = ({ children, onAddCandidate }) => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)

  // Aggiorna l'altezza della finestra quando viene ridimensionata
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calcola l'altezza disponibile (tolgo 80px per l'header)
  const availableHeight = windowHeight - 80

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: "20px",
    minHeight: `${availableHeight}px`,
    display: "flex",
    flexDirection: "column",
  }

  return (
    <div
      className="app-container"
      style={{
        padding: 0,
        margin: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header onAddCandidate={onAddCandidate} />
      <main
        className="main-content"
        style={{
          padding: 0,
          margin: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="scrollable-content"
          style={{
            padding: 0,
            margin: 0,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={containerStyle}>{children}</div>
        </div>
      </main>
    </div>
  )
}

export default Layout
