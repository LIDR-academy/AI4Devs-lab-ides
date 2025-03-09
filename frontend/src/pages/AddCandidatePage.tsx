import React from "react";
import { Link } from "react-router-dom";
import CandidateForm from "../components/CandidateForm";

const AddCandidatePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-2 py-1"
          aria-label="Back to candidates list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to Candidates</span>
        </Link>
      </div>

      <main id="main-content" tabIndex={-1}>
        <CandidateForm />
      </main>
    </div>
  );
};

export default AddCandidatePage;
