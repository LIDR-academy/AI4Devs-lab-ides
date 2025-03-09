import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom"
import { SearchProvider } from "./contexts/SearchContext"
import DashboardPage from "./pages/Dashboard"

/**
 * Componente principal de la aplicación
 */
const App = () => {
  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </SearchProvider>
  )
}

export default App
