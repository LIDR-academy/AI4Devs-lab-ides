import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import CandidateList from "../../../src/components/candidate/CandidateList"
import { SearchProvider } from "../../../src/contexts/SearchContext"
import { ToastProvider } from "../../../src/contexts/ToastContext"
import * as api from "../../../src/services/api"

// Mock the API
jest.mock("../../../src/services/api", () => ({
  downloadCV: jest.fn(),
  getCandidates: jest.fn(),
  deleteCandidate: jest.fn(),
}))

// Mock the hooks
jest.mock("../../../src/hooks/useCandidates", () => {
  return jest.fn(() => ({
    candidates: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+123456789",
        address: "123 Main St",
        status: "PENDING",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+987654321",
        address: "456 Oak St",
        status: "INTERVIEW",
        createdAt: "2023-01-02T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z",
      },
    ],
    loading: false,
    error: null,
    deleteCandidate: jest.fn(),
    refreshCandidates: jest.fn().mockResolvedValue(undefined),
  }))
})

const mockOnEdit = jest.fn()
const mockOnAddNew = jest.fn()
const mockOnCandidateChange = jest.fn()

describe("CandidateList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the candidate list correctly", () => {
    render(
      <SearchProvider>
        <ToastProvider>
          <CandidateList
            onEdit={mockOnEdit}
            onAddNew={mockOnAddNew}
            onCandidateChange={mockOnCandidateChange}
          />
        </ToastProvider>
      </SearchProvider>
    )

    // Check if candidates are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument()
  })

  it("calls onEdit when edit button is clicked", async () => {
    render(
      <SearchProvider>
        <ToastProvider>
          <CandidateList
            onEdit={mockOnEdit}
            onAddNew={mockOnAddNew}
            onCandidateChange={mockOnCandidateChange}
          />
        </ToastProvider>
      </SearchProvider>
    )

    // Find all edit buttons (assuming the edit button has some identifier)
    const editButtons = screen.getAllByRole("button")

    // Click the first edit button
    fireEvent.click(editButtons[1]) // Assuming the second button is edit

    // Check if onEdit was called with the correct candidate
    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "1",
          firstName: "John",
          lastName: "Doe",
        })
      )
    })
  })

  it("attempts to download CV when download button is clicked", async () => {
    // Mock the download function
    ;(api.downloadCV as jest.Mock).mockResolvedValue(
      new Blob(["fake pdf content"])
    )

    render(
      <SearchProvider>
        <ToastProvider>
          <CandidateList
            onEdit={mockOnEdit}
            onAddNew={mockOnAddNew}
            onCandidateChange={mockOnCandidateChange}
          />
        </ToastProvider>
      </SearchProvider>
    )

    // Find all buttons
    const buttons = screen.getAllByRole("button")

    // Click a download button (assuming it's the third button for the first candidate)
    fireEvent.click(buttons[2])

    // Verify downloadCV was called
    await waitFor(() => {
      expect(api.downloadCV).toHaveBeenCalled()
    })
  })
})
