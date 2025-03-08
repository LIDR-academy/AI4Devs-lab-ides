import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom"
import { SearchProvider } from "./contexts/SearchContext"
import CandidateListPage from "./pages/CandidateList"
import DashboardPage from "./pages/Dashboard"
import "./styles/app.css"
import "./styles/form.css"
import "./styles/reset.css"
import "./styles/responsive.css"
import "./styles/toast.css"
import "./styles/variables.css"

/**
 * Componente principal de la aplicación
 */
const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/candidates" element={<CandidateListPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </SearchProvider>
  )
}

export default App
