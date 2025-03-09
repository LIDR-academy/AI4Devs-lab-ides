import React, { useEffect } from "react"
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom"
import { SearchProvider } from "./contexts/SearchContext"
import { ToastProvider } from "./contexts/ToastContext"
import DashboardPage from "./pages/Dashboard"
import { initializeApp, setupErrorHandlers } from "./utils/appInitializer"
import { updateConfig } from "./utils/config"

/**
 * Componente principale dell'applicazione
 */
const App: React.FC = () => {
  // Inizializzazione dell'applicazione
  useEffect(() => {
    // Configurare l'applicazione (può essere caricato da localStorage, API, ecc.)
    updateConfig({
      maxConnections: 10, // Aumentiamo il limite di connessioni a 10
      debugMode: process.env.NODE_ENV === "development",
    })

    // Inizializzare l'applicazione
    initializeApp()

    // Configurare i gestori di errori globali
    setupErrorHandlers()
  }, [])

  return (
    <SearchProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/:status" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </SearchProvider>
  )
}

export default App
