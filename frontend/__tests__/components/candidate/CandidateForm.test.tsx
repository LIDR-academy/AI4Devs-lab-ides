import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import CandidateForm from "../../../src/components/candidate/CandidateForm"
import { ToastProvider } from "../../../src/contexts/ToastContext"
import * as api from "../../../src/services/api"

// Mock the API services
jest.mock("../../../src/services/api", () => ({
  createCandidate: jest.fn(),
  createCandidateWithFile: jest.fn(),
  updateCandidate: jest.fn(),
  updateCandidateWithFile: jest.fn(),
}))

describe("CandidateForm Component", () => {
  const mockOnSaved = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders empty form when no candidate is provided", () => {
    render(
      <ToastProvider>
        <CandidateForm
          candidate={null}
          onSaved={mockOnSaved}
          onCancel={mockOnCancel}
        />
      </ToastProvider>
    )

    // Check form fields are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
  })

  it("fills form with candidate data when provided", () => {
    const mockCandidate = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+123456789",
      address: "123 Main St",
      education: "Computer Science",
      experience: "5 years",
      status: "PENDING",
    }

    render(
      <ToastProvider>
        <CandidateForm
          candidate={mockCandidate}
          onSaved={mockOnSaved}
          onCancel={mockOnCancel}
        />
      </ToastProvider>
    )

    // Check form fields have the correct values
    expect(screen.getByLabelText(/first name/i)).toHaveValue("John")
    expect(screen.getByLabelText(/last name/i)).toHaveValue("Doe")
    expect(screen.getByLabelText(/email/i)).toHaveValue("john.doe@example.com")
    expect(screen.getByLabelText(/phone/i)).toHaveValue("+123456789")
    expect(screen.getByLabelText(/address/i)).toHaveValue("123 Main St")
  })

  it("validates required fields on submit", async () => {
    render(
      <ToastProvider>
        <CandidateForm
          candidate={null}
          onSaved={mockOnSaved}
          onCancel={mockOnCancel}
        />
      </ToastProvider>
    )

    // Clear required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "" },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "" },
    })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "" } })

    // Submit the form
    fireEvent.click(screen.getByText(/save/i))

    // Check error messages
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })

    // Verify API not called
    expect(api.createCandidate).not.toHaveBeenCalled()
  })

  it("calls createCandidate when submitting a new candidate", async () => {
    ;(api.createCandidate as jest.Mock).mockResolvedValue({ id: "123" })

    render(
      <ToastProvider>
        <CandidateForm
          candidate={null}
          onSaved={mockOnSaved}
          onCancel={mockOnCancel}
        />
      </ToastProvider>
    )

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Jane" },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Smith" },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane.smith@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: "456 Oak St" },
    })

    // Submit the form
    fireEvent.click(screen.getByText(/save/i))

    // Check if API was called
    await waitFor(() => {
      expect(api.createCandidate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
        })
      )
      expect(mockOnSaved).toHaveBeenCalled()
    })
  })

  it("calls updateCandidate when submitting an existing candidate", async () => {
    ;(api.updateCandidate as jest.Mock).mockResolvedValue({
      id: "1",
      firstName: "John Updated",
    })

    const mockCandidate = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+123456789",
      address: "123 Main St",
      education: "Computer Science",
      experience: "5 years",
      status: "PENDING",
    }

    render(
      <ToastProvider>
        <CandidateForm
          candidate={mockCandidate}
          onSaved={mockOnSaved}
          onCancel={mockOnCancel}
        />
      </ToastProvider>
    )

    // Update a field
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John Updated" },
    })

    // Submit the form
    fireEvent.click(screen.getByText(/save/i))

    // Check if API was called
    await waitFor(() => {
      expect(api.updateCandidate).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          firstName: "John Updated",
        })
      )
      expect(mockOnSaved).toHaveBeenCalled()
    })
  })
})
