// src/components/Dashboard/Dashboard.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import { candidateService } from "../../services/api";

describe("Dashboard", () => {
  test("renders dashboard with add button", () => {
    render(<Dashboard />);
    expect(screen.getByText(/recruiter dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new candidate/i })
    ).toBeInTheDocument();
  });

  test("opens candidate form when button is clicked", async () => {
    render(<Dashboard />);
    // Initially, form header should not be visible
    expect(screen.queryByText(/add new candidate/i)).not.toBeInTheDocument();

    // Click the add button
    userEvent.click(screen.getByRole("button", { name: /add new candidate/i }));

    // The CandidateForm header appears with the same text
    expect(screen.getByText(/add new candidate/i)).toBeInTheDocument();
  });

  test("closes candidate form when close button is clicked", async () => {
    render(<Dashboard />);
    // Open the form
    userEvent.click(screen.getByRole("button", { name: /add new candidate/i }));
    expect(screen.getByText(/add new candidate/i)).toBeInTheDocument();

    // Click the close button (accessible via its aria-label "Close form")
    userEvent.click(screen.getByRole("button", { name: /close form/i }));

    // Form should be closed
    expect(screen.queryByText(/add new candidate/i)).not.toBeInTheDocument();
  });

  test("renders candidates list", async () => {
    const mockCandidates = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "098-765-4321",
      },
    ];

    jest
      .spyOn(candidateService, "getCandidates")
      .mockResolvedValue({ data: mockCandidates });

    render(<Dashboard />);

    // Wait for candidates to be fetched and rendered
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();

    expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    expect(screen.getByText(/jane.smith@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/098-765-4321/i)).toBeInTheDocument();
  });

  test("renders no candidates found message when list is empty", async () => {
    jest
      .spyOn(candidateService, "getCandidates")
      .mockResolvedValue({ data: [] });

    render(<Dashboard />);

    // Wait for the "No candidates found" message to be rendered
    expect(await screen.findByText(/no candidates found/i)).toBeInTheDocument();
  });
});
