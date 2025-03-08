import React, { useState } from "react"
import "./App.css"
import CandidateList from "./components/candidate/CandidateList"
import Dashboard from "./components/dashboard/Dashboard"
import Layout from "./components/layout/Layout"
import { Card, CardContent } from "./components/ui/card"
import { Dialog, DialogContent, DialogHeader } from "./components/ui/dialog"
import { SearchProvider } from "./lib/context/SearchContext"

// Aggiungiamo uno stile globale per rimuovere qualsiasi effetto di rollover
const globalStyle = document.createElement("style")
globalStyle.innerHTML = `
  button.action-button:hover {
    background-color: transparent !important;
    opacity: 1 !important;
    transform: none !important;
    box-shadow: none !important;
  }
  
  button:active, button:focus {
    outline: none !important;
    transform: none !important;
    box-shadow: none !important;
    opacity: 0.9 !important;
  }
  
  .custom-file-input {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  .custom-file-input input[type="file"] {
    position: absolute;
    left: -9999px;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .custom-file-input label {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #f3f4f6;
    color: #374151;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #e5e7eb;
  }
  
  .custom-file-input label:hover {
    background-color: #e5e7eb;
  }
  
  .custom-file-input span {
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .error-input {
    border-color: #ef4444 !important;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(globalStyle)

function App() {
  // State para vistas
  const [activeView, setActiveView] = useState("dashboard")

  // Stato per il modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    status: "PENDING",
    cvFile: null,
  })
  const [fileName, setFileName] = useState("")

  // Estado para refrescar componentes
  const [refreshData, setRefreshData] = useState(0)

  // Stile per il bottone Add Candidate
  const addButtonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === "file" && files && files[0]) {
      setFormValues({
        ...formValues,
        cvFile: files[0],
      })
      setFileName(files[0].name)
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      })
    }

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formValues.firstName.trim())
      errors.firstName = "First name is required"
    if (!formValues.lastName.trim()) errors.lastName = "Last name is required"
    if (!formValues.address.trim()) errors.address = "Address is required"
    if (!formValues.education.trim()) errors.education = "Education is required"
    if (!formValues.experience.trim())
      errors.experience = "Experience is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formValues.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formValues.email)) {
      errors.email = "Please enter a valid email"
    }

    if (!selectedCandidate && !formValues.cvFile) {
      errors.cvFile = "CV file is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Here you would submit the form to the backend
      console.log("Form submitted:", formValues)
      setIsModalOpen(false)

      // Reset form
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        education: "",
        experience: "",
        status: "PENDING",
        cvFile: null,
      })
      setFileName("")
      setFormErrors({})

      // Refresh data
      handleDataChange()
    }
  }

  // Funzione per aprire il modal di aggiunta candidato
  const handleAddCandidate = () => {
    setSelectedCandidate(null)
    setIsModalOpen(true)
    setFormValues({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      education: "",
      experience: "",
      status: "PENDING",
      cvFile: null,
    })
    setFileName("")
    setFormErrors({})
  }

  // Funzione per aprire il modal di modifica candidato
  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)

    const [firstName, lastName] = candidate.name
      ? candidate.name.split(" ")
      : [candidate.firstName || "", candidate.lastName || ""]

    setFormValues({
      firstName: firstName || "",
      lastName: lastName || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      address: candidate.address || "",
      education: candidate.education || "",
      experience: candidate.experience || "",
      status: candidate.status || "PENDING",
      cvFile: null,
    })
    setFileName("")
    setFormErrors({})
  }

  // Función para manejar el cambio de vista
  const handleViewChange = (view) => {
    setActiveView(view)
  }

  // Función para refrescar datos cuando hay cambios
  const handleDataChange = () => {
    setRefreshData((prev) => prev + 1)
  }

  // Form di esempio per il modal
  const renderCandidateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "40px",
            rowGap: "24px",
          }}
        >
          {/* First Name */}
          <div>
            <input
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
              placeholder="First Name *"
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
              }}
            />
            {formErrors.firstName && (
              <div className="error-message">{formErrors.firstName}</div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
              placeholder="Last Name *"
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
              }}
            />
            {formErrors.lastName && (
              <div className="error-message">{formErrors.lastName}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Email *"
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
              }}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              placeholder="Phone (optional)"
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          {/* Address */}
          <div style={{ gridColumn: "span 2" }}>
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              placeholder="Address *"
              maxLength={100}
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
              }}
            />
            {formErrors.address && (
              <div className="error-message">{formErrors.address}</div>
            )}
          </div>

          {/* Education */}
          <div style={{ gridColumn: "span 2" }}>
            <textarea
              name="education"
              value={formValues.education}
              onChange={handleInputChange}
              placeholder="Education *"
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                minHeight: "120px",
                height: "120px",
                resize: "vertical",
              }}
            ></textarea>
            {formErrors.education && (
              <div className="error-message">{formErrors.education}</div>
            )}
          </div>

          {/* Experience */}
          <div style={{ gridColumn: "span 2" }}>
            <textarea
              name="experience"
              value={formValues.experience}
              onChange={handleInputChange}
              placeholder="Experience *"
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                minHeight: "120px",
                height: "120px",
                resize: "vertical",
              }}
            ></textarea>
            {formErrors.experience && (
              <div className="error-message">{formErrors.experience}</div>
            )}
          </div>

          {/* CV File */}
          <div style={{ gridColumn: "span 2" }}>
            <div className="custom-file-input" style={{ width: "100%" }}>
              <input
                type="file"
                name="cvFile"
                id="cvFile"
                accept=".pdf,.docx"
                onChange={handleInputChange}
              />
              <label htmlFor="cvFile" style={{ width: "100%" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>{fileName || "CV File * (PDF or DOCX)"}</span>
              </label>
            </div>
            {formErrors.cvFile && (
              <div className="error-message">{formErrors.cvFile}</div>
            )}
          </div>

          {/* Status (for editing) */}
          {selectedCandidate && (
            <div style={{ gridColumn: "span 2" }}>
              <select
                name="status"
                value={formValues.status}
                onChange={handleInputChange}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <option value="PENDING">⏳ PENDING</option>
                <option value="EVALUATED">✅ EVALUATED</option>
                <option value="REJECTED">❌ REJECTED</option>
                <option value="INTERVIEW">🟡 INTERVIEW</option>
                <option value="OFFERED">🔵 OFFERED</option>
                <option value="HIRED">🟣 HIRED</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                marginRight: "8px",
                padding: "10px 20px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {selectedCandidate ? "Update Candidate" : "Add Candidate"}
            </button>
          </div>
        </div>
      </form>
    )
  }

  // Renderizar el contenido según la vista activa
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <Dashboard key={refreshData} />

            {/* Tabla de candidatos */}
            <Card>
              <CardContent>
                <CandidateList
                  onEdit={handleEditCandidate}
                  onAddNew={handleAddCandidate}
                  onCandidateChange={handleDataChange}
                />
              </CardContent>
            </Card>
          </>
        )

      case "candidates":
        return (
          <CandidateList
            onEdit={handleEditCandidate}
            onAddNew={handleAddCandidate}
            onCandidateChange={handleDataChange}
          />
        )

      // Redirigir al dashboard por defecto para evitar doble llamada
      default:
        setActiveView("dashboard") // Redireccionar al dashboard
        return null
    }
  }

  return (
    <SearchProvider>
      <Layout onAddCandidate={handleAddCandidate}>
        <div style={{ padding: "24px 0" }}>
          {/* Contenido principal */}
          {renderContent()}

          {/* Modal de formulario */}
          <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <DialogContent>
              <DialogHeader>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "16px",
                  }}
                >
                  {selectedCandidate ? "Edit Candidate" : "Add New Candidate"}
                </h2>
              </DialogHeader>
              {renderCandidateForm()}
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </SearchProvider>
  )
}

export default App
