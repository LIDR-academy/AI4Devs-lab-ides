import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { candidateService } from "../services/api";
import { Candidate } from "../types";
import ConfirmationModal from "../components/ConfirmationModal";
import Notification, { NotificationType } from "../components/Notification";

// Helper function to format date in European format (dd/MM/yyyy)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HomePage: React.FC = () => {
  const queryClient = useQueryClient();

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(
    null
  );

  // State for notifications
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
  }>({
    type: "info",
    message: "",
    isVisible: false,
  });

  // Fetch candidates data
  const {
    data: candidates,
    isLoading,
    error,
  } = useQuery<Candidate[], Error>("candidates", candidateService.getAll);

  // Delete candidate mutation
  const deleteMutation = useMutation(
    (id: number) => candidateService.delete(id),
    {
      onSuccess: (data) => {
        // Update the candidates list by removing the deleted candidate
        queryClient.setQueryData<Candidate[]>("candidates", (oldData) =>
          oldData ? oldData.filter((candidate) => candidate.id !== data.id) : []
        );

        // Close the modal
        setIsDeleteModalOpen(false);
        setCandidateToDelete(null);

        // Show success notification
        setNotification({
          type: "success",
          message: "Candidate deleted successfully",
          isVisible: true,
        });
      },
      onError: (error: any) => {
        // Close the modal
        setIsDeleteModalOpen(false);

        // Show error notification
        setNotification({
          type: "error",
          message: error.response?.data?.error || "Failed to delete candidate",
          isVisible: true,
        });
      },
    }
  );

  // Handle delete button click
  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (candidateToDelete) {
      deleteMutation.mutate(candidateToDelete.id);
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCandidateToDelete(null);
  };

  // Close notification
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Candidates
        </h1>
        <Link
          to="/add-candidate"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-center sm:text-left"
          aria-label="Add a new candidate"
        >
          <span className="flex items-center justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Candidate
          </span>
        </Link>
      </div>

      <main id="main-content" tabIndex={-1}>
        {isLoading && (
          <div
            className="flex justify-center py-10"
            aria-live="polite"
            aria-busy="true"
          >
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
              role="status"
            >
              <span className="sr-only">Loading candidates...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
            aria-live="assertive"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error.message}</span>
          </div>
        )}

        {!isLoading && !error && candidates?.length === 0 && (
          <div
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"
            role="status"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No candidates found. Add your first candidate!
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && candidates && candidates.length > 0 && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table
              className="min-w-full divide-y divide-gray-200"
              aria-label="Candidates list"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    CV
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Added
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {candidate.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {candidate.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.cvFilePath ? (
                        <a
                          href={`http://localhost:3010${candidate.cvFilePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
                          aria-label={`View CV for ${candidate.firstName} ${candidate.lastName}`}
                        >
                          View CV
                        </a>
                      ) : (
                        <span className="text-gray-500">No CV</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(candidate.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClick(candidate)}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-2 py-1"
                        aria-label={`Delete ${candidate.firstName} ${candidate.lastName}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Candidate"
        message={`Are you sure you want to delete ${candidateToDelete?.firstName} ${candidateToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteMutation.isLoading}
      />

      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default HomePage;
