import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useToast } from "../../contexts/ToastContext"
import {
  Candidate,
  createCandidate,
  createCandidateWithFile,
  updateCandidate,
  updateCandidateWithFile,
} from "../../services/api"
import { StatusIconSelect } from "../statusIcon/StatusIcon"
import "./CandidateForm.css"

// Tipo per i dati del form che non include l'ID
type CandidateFormData = Omit<Candidate, "id">

// Props per il componente CandidateForm
interface CandidateFormProps {
  candidate: Candidate | null
  onSaved: () => void
  onCancel: () => void
}

const INITIAL_FORM_STATE: CandidateFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  education: [],
  experience: [],
  status: "PENDING",
  cv: null,
}

/**
 * Form component for creating and editing candidates
 */
const CandidateForm = ({
  candidate,
  onSaved,
  onCancel,
}: CandidateFormProps) => {
  // Form state
  const [formData, setFormData] = useState<CandidateFormData>({
    ...INITIAL_FORM_STATE,
  })

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>("")

  // Toast notifications
  const { showToast, showErrorToast } = useToast()

  // Load candidate data when editing
  useEffect(() => {
    if (candidate) {
      const candidateData = { ...candidate } as CandidateFormData
      // Ensure arrays are initialized
      if (!candidateData.education) candidateData.education = []
      if (!candidateData.experience) candidateData.experience = []
      if (candidate.cvPath) {
        setFileName(candidate.cvPath.split("/").pop() || "Current CV")
      }

      setFormData(candidateData)
    } else {
      setFormData({ ...INITIAL_FORM_STATE })
    }
  }, [candidate])

  // Handle form field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    // Clear error for this field when user edits it
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file changes for CV upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      setFormData((prev) => ({
        ...prev,
        cv: file,
      }))

      // Clear error for CV if present
      if (errors.cv) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.cv
          return newErrors
        })
      }
    }
  }

  // Trigger file input click
  const handleFileBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email.trim() && !emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Phone validation (optional)
    if (formData.phone && !/^[+]?[0-9\s()\-+.]{8,20}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) return

    setLoading(true)

    // Ensure all required fields have at least an empty string value
    const preparedFormData: any = {
      ...formData,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      address: formData.address || "",
      education:
        Array.isArray(formData.education) && formData.education.length === 0
          ? ""
          : formData.education || "",
      experience:
        Array.isArray(formData.experience) && formData.experience.length === 0
          ? ""
          : formData.experience || "",
      status: formData.status || "PENDING",
    }

    try {
      // Prepare form data for API if we have a file
      if (formData.cv) {
        const formDataObj = new FormData()

        // Aggiungi tutti i campi al FormData
        Object.keys(preparedFormData).forEach((key) => {
          if (key === "cv") {
            formDataObj.append("cv", preparedFormData.cv)
          } else if (key === "education" || key === "experience") {
            // Convert arrays to JSON strings for FormData
            formDataObj.append(
              key,
              typeof preparedFormData[key] === "string"
                ? preparedFormData[key]
                : JSON.stringify(preparedFormData[key])
            )
          } else {
            formDataObj.append(key, preparedFormData[key])
          }
        })

        if (candidate?.id) {
          // Update existing candidate with file
          await updateCandidateWithFile(candidate.id, formDataObj)
        } else {
          // Create new candidate with file
          await createCandidateWithFile(formDataObj)
        }
      } else {
        // No file, use JSON API
        if (candidate?.id) {
          // Update existing candidate
          await updateCandidate(candidate.id, preparedFormData)
        } else {
          // Create new candidate
          await createCandidate(preparedFormData)
        }
      }

      // Show success notification
      showToast({
        title: candidate?.id ? "Candidate Updated" : "Candidate Added",
        message: `${formData.firstName} ${formData.lastName} has been ${candidate?.id ? "updated" : "added"} successfully.`,
        type: "success",
      })

      // Notify parent component
      onSaved()
    } catch (error: any) {
      console.error("Error saving candidate:", error)
      showErrorToast(error)

      // Set form errors if available in the error response
      if (error.details && typeof error.details === "object") {
        setErrors(error.details)
      }
    } finally {
      setLoading(false)
    }
  }

  // Form styles
  const formStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "2rem",
  }

  const fullWidthStyle: React.CSSProperties = {
    gridColumn: "1 / -1",
  }

  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    cursor: "pointer",
  }

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
  }

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
  }

  const inputGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#374151",
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
  }

  const errorStyle: React.CSSProperties = {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  }

  const fileInputContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }

  const fileInputStyle: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    fontSize: "0.875rem",
    flexGrow: 1,
    cursor: "default",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }

  const browseButtonStyle: React.CSSProperties = {
    ...secondaryButtonStyle,
    whiteSpace: "nowrap",
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "800px", margin: "0 auto" }}
      className="candidate-form"
    >
      <div style={formStyle} className="form-grid">
        {/* Personal Information */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="firstName">
            First Name*
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.firstName ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            required
            className={`form-input ${errors.firstName ? "form-input-error" : ""}`}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="lastName">
            Last Name*
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.lastName ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            required
            className={`form-input ${errors.lastName ? "form-input-error" : ""}`}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="email">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.email ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            required
            className={`form-input ${errors.email ? "form-input-error" : ""}`}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.phone ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            className={`form-input ${errors.phone ? "form-input-error" : ""}`}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
          <p className="help-text">
            Format: Numbers, spaces and symbols (+, -, (, )) allowed. 8-20
            characters.
          </p>
        </div>

        <div style={{ ...inputGroupStyle, ...fullWidthStyle }}>
          <label style={labelStyle} htmlFor="address">
            Address*
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.address ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            required
            className={`form-input ${errors.address ? "form-input-error" : ""}`}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="status">
            Status
          </label>
          <StatusIconSelect
            value={formData.status || "PENDING"}
            onChange={(value) => setFormData({ ...formData, status: value })}
            includeAllOption={false}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="cv">
            CV / Resume
          </label>
          <div style={fileInputContainerStyle} className="file-input-container">
            <div style={fileInputStyle} className="file-input-display">
              {fileName || (
                <span className="placeholder-text">No file chosen</span>
              )}
            </div>
            <button
              type="button"
              style={browseButtonStyle}
              onClick={handleFileBrowseClick}
              className="browse-button"
            >
              Browse
            </button>
            <input
              type="file"
              id="cv"
              name="cv"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={loading}
            />
          </div>
          {errors.cv && <p className="error-message">{errors.cv}</p>}
          {fileName && (
            <div className="file-info">
              <span>{fileName}</span>
              <button
                type="button"
                onClick={() => {
                  setFileName("")
                }}
                className="clear-file-button"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div style={{ ...inputGroupStyle, ...fullWidthStyle }}>
          <label style={labelStyle} htmlFor="education">
            Education*
          </label>
          <textarea
            id="education"
            name="education"
            value={
              Array.isArray(formData.education)
                ? formData.education
                    .map((e) =>
                      typeof e === "string"
                        ? e
                        : `${e.degree || ""} in ${e.field || ""} at ${e.institution || ""} (${e.startDate || ""} - ${e.endDate || "present"})`
                    )
                    .join("\n\n")
                : formData.education || ""
            }
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: "100px",
              borderColor: errors.education ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            required
            className={`form-input ${errors.education ? "form-input-error" : ""}`}
          />
          {errors.education && (
            <p className="error-message">{errors.education}</p>
          )}
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginTop: "0.25rem",
            }}
          >
            Enter education details: degree, institution, dates
          </div>
        </div>

        <div style={{ ...inputGroupStyle, ...fullWidthStyle }}>
          <label style={labelStyle} htmlFor="experience">
            Experience*
          </label>
          <textarea
            id="experience"
            name="experience"
            value={
              Array.isArray(formData.experience)
                ? formData.experience
                    .map((e) =>
                      typeof e === "string"
                        ? e
                        : `${e.position || ""} at ${e.company || ""} (${e.startDate || ""} - ${e.endDate || "present"})\n${e.description || ""}`
                    )
                    .join("\n\n")
                : formData.experience || ""
            }
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: "100px",
              borderColor: errors.experience ? "#ef4444" : "#d1d5db",
            }}
            disabled={loading}
            required
            className={`form-input ${errors.experience ? "form-input-error" : ""}`}
          />
          {errors.experience && (
            <p className="error-message">{errors.experience}</p>
          )}
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginTop: "0.25rem",
            }}
          >
            Enter work experience: position, company, dates, description
          </div>
        </div>

        {/* Form Actions */}
        <div
          style={{
            ...fullWidthStyle,
            display: "flex",
            justifyContent: "end",
            gap: "1rem",
            marginTop: "1rem",
          }}
          className="form-actions"
        >
          <button
            type="button"
            onClick={onCancel}
            style={secondaryButtonStyle}
            disabled={loading}
            className="secondary-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            style={primaryButtonStyle}
            disabled={loading}
            className="primary-button"
          >
            {loading
              ? "Saving..."
              : candidate?.id
                ? "Update Candidate"
                : "Add Candidate"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default CandidateForm
