import React from "react";
import { Status } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: Status;
  createdAt: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
  onStatusChange: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
  onDownloadCV: (id: number) => void;
  loadingStates: {
    status: number[];
    delete: number[];
    download: number[];
  };
}

export const CandidateTable = ({
  candidates,
  onStatusChange,
  onDelete,
  onDownloadCV,
  loadingStates,
}: CandidateTableProps) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "WAITING":
        return "bg-status-waiting";
      case "INTERVIEW":
        return "bg-status-interview";
      case "REJECTED":
        return "bg-status-rejected";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map((candidate) => (
            <tr
              key={candidate.id}
              className="transition-colors hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {candidate.firstName} {candidate.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{candidate.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(
                    candidate.status
                  )}`}
                >
                  {candidate.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(candidate.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <select
                  value={candidate.status}
                  onChange={(e) =>
                    onStatusChange(candidate.id, e.target.value as Status)
                  }
                  disabled={loadingStates.status.includes(candidate.id)}
                  className="mr-2 rounded-md border-gray-300 shadow-sm 
                    focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    transition-colors duration-200"
                >
                  <option value="WAITING">Waiting</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button
                  onClick={() => onDownloadCV(candidate.id)}
                  disabled={loadingStates.download.includes(candidate.id)}
                  className="text-secondary hover:text-secondary/80 disabled:text-gray-300
                    transition-colors duration-200 mr-2"
                >
                  {loadingStates.download.includes(candidate.id) ? (
                    <LoadingSpinner className="border-secondary" />
                  ) : (
                    "Download CV"
                  )}
                </button>
                <button
                  onClick={() => onDelete(candidate.id)}
                  disabled={loadingStates.delete.includes(candidate.id)}
                  className="text-red-600 hover:text-red-700 disabled:text-gray-300
                    transition-colors duration-200"
                >
                  {loadingStates.delete.includes(candidate.id) ? (
                    <LoadingSpinner className="border-red-600" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
