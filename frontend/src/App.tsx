import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage from "./pages/HomePage";
import AddCandidatePage from "./pages/AddCandidatePage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-600 focus:text-white focus:z-50"
          >
            Skip to main content
          </a>

          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                LTI Applicant Tracking System
              </h1>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-candidate" element={<AddCandidatePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>

          <footer className="bg-white shadow-inner mt-8 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} LTI Applicant Tracking
                  System
                </p>
                <nav className="mt-4 sm:mt-0">
                  <ul className="flex space-x-4">
                    <li>
                      <a
                        href="/privacy-policy"
                        className="text-gray-500 hover:text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
