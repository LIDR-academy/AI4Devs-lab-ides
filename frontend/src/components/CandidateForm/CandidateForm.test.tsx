// src/components/CandidateForm/CandidateForm.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CandidateForm from "./CandidateForm";

// Mock the entire API module so that candidateService is fully mocked.
jest.mock("../../services/api", () => ({
  candidateService: {
    createCandidate: jest.fn(),
    getCandidates: jest.fn(),
  },
}));

// Import the candidateService so we can set its behavior in tests.
// eslint-disable-next-line import/first
import { candidateService } from "../../services/api";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CandidateForm", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the form with all fields", () => {
    render(<CandidateForm onClose={mockOnClose} />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/education/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work experience/i)).toBeInTheDocument();
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("validates required fields on submission", async () => {
    render(<CandidateForm onClose={mockOnClose} />);
    // Fill in required text fields so that onSubmit is reached.
    userEvent.type(screen.getByLabelText(/first name/i), "John");
    userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    userEvent.type(screen.getByLabelText(/email/i), "john.doe@example.com");
    // Do not upload a resume file.
    userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/please upload a resume file/i),
      ).toBeInTheDocument();
    });
  });

  test("handles file upload correctly", async () => {
    render(<CandidateForm onClose={mockOnClose} />);
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const fileInput = screen.getByTestId("resume-file-input");
    userEvent.upload(fileInput, file);
    expect(screen.getByText(/File selected: test\.pdf/i)).toBeInTheDocument();
  });

  test("validates file type", async () => {
    render(<CandidateForm onClose={mockOnClose} />);
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const fileInput = screen.getByTestId("resume-file-input");
    userEvent.upload(fileInput, file);
    expect(
      screen.getByText(/please upload a pdf or docx file/i),
    ).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    (candidateService.createCandidate as jest.Mock).mockResolvedValueOnce({
      success: true,
    });
    render(<CandidateForm onClose={mockOnClose} />);
    userEvent.type(screen.getByLabelText(/first name/i), "John");
    userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    userEvent.type(screen.getByLabelText(/email/i), "john.doe@example.com");
    userEvent.type(screen.getByLabelText(/phone/i), "1234567890");
    const file = new File(["test"], "resume.pdf", { type: "application/pdf" });
    const fileInput = screen.getByTestId("resume-file-input");
    userEvent.upload(fileInput, file);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(candidateService.createCandidate).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles API errors", async () => {
    // Suppress the error output for this test:
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (candidateService.createCandidate as jest.Mock).mockRejectedValueOnce(
      new Error("API Error"),
    );

    render(<CandidateForm onClose={mockOnClose} />);
    userEvent.type(screen.getByLabelText(/first name/i), "John");
    userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    userEvent.type(screen.getByLabelText(/email/i), "john.doe@example.com");
    const file = new File(["test"], "resume.pdf", { type: "application/pdf" });
    const fileInput = screen.getByTestId("resume-file-input");
    userEvent.upload(fileInput, file);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(candidateService.createCandidate).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    // Restore the original console.error
    consoleErrorSpy.mockRestore();
  });
});
