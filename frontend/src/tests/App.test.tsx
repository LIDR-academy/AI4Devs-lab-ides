import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import Dashboard from "../components/Dashboard/Dashboard";

// Mock the Dashboard component
jest.mock("../components/Dashboard/Dashboard", () => {
  return jest.fn(() => (
    <div data-testid="dashboard-mock">Dashboard Component</div>
  ));
});

// Mock the react-toastify component
jest.mock("react-toastify", () => ({
  ToastContainer: jest.fn(() => (
    <div data-testid="toast-container-mock">Toast Container</div>
  )),
}));

describe("App Component", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-mock")).toBeInTheDocument();
  });

  test("renders the ToastContainer component", () => {
    render(<App />);
    expect(screen.getByTestId("toast-container-mock")).toBeInTheDocument();
  });

  test("renders the Dashboard component", () => {
    render(<App />);
    expect(Dashboard).toHaveBeenCalledTimes(1);
  });

  test("has the correct CSS class", () => {
    render(<App />);
    expect(screen.getByTestId("app-root")).toHaveClass("App");
  });

  test("ToastContainer has the correct props", () => {
    render(<App />);
    const toastMock = require("react-toastify").ToastContainer;
    expect(toastMock).toHaveBeenCalledWith(
      {
        position: "top-right",
        autoClose: 5000,
      },
      undefined,
    );
  });
});
