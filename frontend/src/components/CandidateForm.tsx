import React, { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface CandidateFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const CandidateForm = ({
  onSubmit,
  onClose,
  loading = false,
}: CandidateFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    cv: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.education ||
      !formData.experience
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const data = new FormData();

    // Add all form fields
    data.append("firstName", formData.firstName.trim());
    data.append("lastName", formData.lastName.trim());
    data.append("email", formData.email.trim());
    data.append("phone", formData.phone.trim());
    data.append("education", formData.education.trim());
    data.append("experience", formData.experience.trim());

    // Add CV if exists
    if (formData.cv) {
      data.append("cv", formData.cv);
    }

    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to create candidate. Please try again.");
    }
  };

  // Add click handler for backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Add escape key handler
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Candidate
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                  transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                  transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education
            </label>
            <textarea
              required
              value={formData.education}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, education: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience
            </label>
            <textarea
              required
              value={formData.experience}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, experience: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CV
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cv: e.target.files ? e.target.files[0] : null,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
                transition-all duration-200 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm file:font-medium
                file:bg-secondary file:text-white hover:file:cursor-pointer
                hover:file:bg-secondary/90"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 
                hover:bg-gray-200 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-white bg-secondary 
                hover:bg-secondary/90 transition-colors duration-200
                disabled:bg-gray-300 disabled:cursor-not-allowed
                flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
