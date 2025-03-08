import React, { useEffect, useState } from "react"
import {
  createCandidate,
  getEducationSuggestions,
  getExperienceSuggestions,
  updateCandidate,
} from "../../lib/api"
import { Button } from "../ui/button"
import { Form, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

const CandidateForm = ({ candidate, onSuccess, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
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

  // Errors state
  const [errors, setErrors] = useState({})

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Suggestions state
  const [educationSuggestions, setEducationSuggestions] = useState([])
  const [experienceSuggestions, setExperienceSuggestions] = useState([])

  // Show suggestions state
  const [showEducationSuggestions, setShowEducationSuggestions] =
    useState(false)
  const [showExperienceSuggestions, setShowExperienceSuggestions] =
    useState(false)

  // Initialize form with candidate data if editing
  useEffect(() => {
    if (candidate) {
      const { cvFilePath, ...candidateData } = candidate
      setFormData({
        ...candidateData,
        cvFile: null,
      })
    }
  }, [candidate])

  // Load suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const [educationData, experienceData] = await Promise.all([
          getEducationSuggestions(),
          getExperienceSuggestions(),
        ])

        setEducationSuggestions(educationData || [])
        setExperienceSuggestions(experienceData || [])
      } catch (error) {
        console.error("Error loading suggestions:", error)
      }
    }

    loadSuggestions()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "cvFile" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        cvFile: files[0],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))

      // Clear error when typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }))
      }
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (field === "education") {
      setShowEducationSuggestions(false)
    } else if (field === "experience") {
      setShowExperienceSuggestions(false)
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.education.trim())
      newErrors.education = "Education is required"
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required"

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Address validation
    if (formData.address.length > 100) {
      newErrors.address = "Address cannot exceed 100 characters"
    }

    // File validation for new candidates
    if (!candidate && !formData.cvFile) {
      newErrors.cvFile = "CV file is required"
    } else if (formData.cvFile) {
      const fileType = formData.cvFile.type
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!validTypes.includes(fileType)) {
        newErrors.cvFile = "Only PDF or DOCX files are allowed"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "cvFile" && value !== null && value !== undefined) {
          formDataToSend.append(key, value)
        }
      })

      // Append file if provided
      if (formData.cvFile) {
        formDataToSend.append("cvFile", formData.cvFile)
      }

      // Create or update candidate
      const result = candidate
        ? await updateCandidate(candidate.id, formDataToSend)
        : await createCandidate(formDataToSend)

      onSuccess(result)
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors((prev) => ({
        ...prev,
        form: error.message || "An error occurred while saving the candidate",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && <FormMessage>{errors.form}</FormMessage>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <FormItem>
          <FormLabel htmlFor="firstName">First Name *</FormLabel>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <FormMessage>{errors.firstName}</FormMessage>}
        </FormItem>

        {/* Last Name */}
        <FormItem>
          <FormLabel htmlFor="lastName">Last Name *</FormLabel>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <FormMessage>{errors.lastName}</FormMessage>}
        </FormItem>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <FormItem>
          <FormLabel htmlFor="email">Email *</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <FormMessage>{errors.email}</FormMessage>}
        </FormItem>

        {/* Phone */}
        <FormItem>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Enter phone number (optional)"
          />
        </FormItem>
      </div>

      {/* Address */}
      <FormItem>
        <FormLabel htmlFor="address">Address *</FormLabel>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          className={errors.address ? "border-red-500" : ""}
          maxLength={100}
        />
        {errors.address && <FormMessage>{errors.address}</FormMessage>}
        <div className="text-xs text-gray-500">
          {formData.address.length}/100 characters
        </div>
      </FormItem>

      {/* Education */}
      <FormItem className="relative">
        <FormLabel htmlFor="education">Education *</FormLabel>
        <Textarea
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="Enter education details"
          className={errors.education ? "border-red-500" : ""}
          onFocus={() => setShowEducationSuggestions(true)}
          onBlur={() =>
            setTimeout(() => setShowEducationSuggestions(false), 200)
          }
        />
        {errors.education && <FormMessage>{errors.education}</FormMessage>}

        {showEducationSuggestions && educationSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto border border-gray-200">
            {educationSuggestions
              .filter((suggestion) =>
                suggestion
                  .toLowerCase()
                  .includes(formData.education.toLowerCase())
              )
              .map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleSuggestionSelect("education", suggestion)
                  }
                >
                  {suggestion}
                </div>
              ))}
          </div>
        )}
      </FormItem>

      {/* Experience */}
      <FormItem className="relative">
        <FormLabel htmlFor="experience">Experience *</FormLabel>
        <Textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Enter experience details"
          className={errors.experience ? "border-red-500" : ""}
          onFocus={() => setShowExperienceSuggestions(true)}
          onBlur={() =>
            setTimeout(() => setShowExperienceSuggestions(false), 200)
          }
        />
        {errors.experience && <FormMessage>{errors.experience}</FormMessage>}

        {showExperienceSuggestions && experienceSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto border border-gray-200">
            {experienceSuggestions
              .filter((suggestion) =>
                suggestion
                  .toLowerCase()
                  .includes(formData.experience.toLowerCase())
              )
              .map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleSuggestionSelect("experience", suggestion)
                  }
                >
                  {suggestion}
                </div>
              ))}
          </div>
        )}
      </FormItem>

      {/* CV File Upload */}
      <FormItem>
        <FormLabel htmlFor="cvFile">
          CV File {!candidate && "*"} (PDF or DOCX)
        </FormLabel>
        <Input
          id="cvFile"
          name="cvFile"
          type="file"
          onChange={handleChange}
          className={errors.cvFile ? "border-red-500" : ""}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        {errors.cvFile && <FormMessage>{errors.cvFile}</FormMessage>}
        {candidate && candidate.cvFilePath && !formData.cvFile && (
          <p className="text-sm text-gray-500">
            Current file: {candidate.cvFilePath.split("/").pop()}
          </p>
        )}
      </FormItem>

      {/* Status (only for editing) */}
      {candidate && (
        <FormItem>
          <FormLabel htmlFor="status">Status</FormLabel>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="PENDING">Pending</option>
            <option value="VALUATED">Valuated</option>
            <option value="DISCARDED">Discarded</option>
          </select>
        </FormItem>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : candidate
            ? "Update Candidate"
            : "Add Candidate"}
        </Button>
      </div>
    </Form>
  )
}

export default CandidateForm
