import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { candidateApi, selectionProcessApi } from '../../services/api';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: string | null;
  workExperience: string | null;
  skills: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  selectionProcesses: SelectionProcess[];
}

interface SelectionProcess {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  position: string;
  stages: ProcessStage[];
}

interface ProcessStage {
  id: string;
  name: string;
  description: string | null;
  status: string;
  date: string | null;
  feedback: string | null;
}

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setIsLoading(true);
        const response = await candidateApi.getById(id!);
        setCandidate(response.data.data.candidate);
        setError(null);
      } catch (err) {
        setError('Failed to fetch candidate details. Please try again later.');
        console.error('Error fetching candidate:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await candidateApi.delete(id);
      navigate('/candidates');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to delete candidate. They may have active selection processes.'
      );
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{error}</p>
        <div className="mt-4">
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
        <p>Candidate not found.</p>
        <div className="mt-4">
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <p className="text-sm text-gray-500">
            Added on {new Date(candidate.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/candidates"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Back to Candidates"
            tabIndex={0}
          >
            Back
          </Link>
          <Link
            to={`/candidates/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Edit Candidate"
            tabIndex={0}
          >
            Edit
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Delete Candidate"
            tabIndex={0}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{candidate.firstName} {candidate.lastName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{candidate.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{candidate.phone || 'Not provided'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    candidate.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'HIRED' ? 'bg-blue-100 text-blue-800' :
                    candidate.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {candidate.status}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{candidate.address || 'Not provided'}</dd>
              </div>
            </dl>
          </div>

          {/* Professional Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Skills</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{candidate.skills || 'Not provided'}</dd>
              </div>
            </dl>
          </div>

          {/* Education */}
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
            <div className="text-sm text-gray-900 whitespace-pre-line">
              {candidate.education || 'No education information provided.'}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h2>
            <div className="text-sm text-gray-900 whitespace-pre-line">
              {candidate.workExperience || 'No work experience information provided.'}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
            <div className="text-sm text-gray-900 whitespace-pre-line">
              {candidate.notes || 'No notes available.'}
            </div>
          </div>
        </div>

        {/* Selection Processes */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Selection Processes</h2>
            <Link
              to={`/processes/new?candidateId=${candidate.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Add New Process"
              tabIndex={0}
            >
              Add New Process
            </Link>
          </div>

          {candidate.selectionProcesses.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500">No selection processes found for this candidate.</p>
              <Link
                to={`/processes/new?candidateId=${candidate.id}`}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start a New Process
              </Link>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {candidate.selectionProcesses.map((process) => (
                  <li key={process.id} className="p-4 hover:bg-gray-100">
                    <Link to={`/processes/${process.id}`} className="block">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-blue-600">{process.title}</h3>
                          <p className="text-xs text-gray-500">Position: {process.position}</p>
                          <p className="text-xs text-gray-500">
                            Started: {new Date(process.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            process.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                            process.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {process.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      {process.description && (
                        <p className="mt-2 text-sm text-gray-600">{process.description}</p>
                      )}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500">Progress:</p>
                        <div className="mt-1 flex items-center">
                          {process.stages.map((stage, index) => (
                            <div 
                              key={stage.id} 
                              className="flex-1 flex flex-col items-center"
                            >
                              <div className={`h-2 w-full ${
                                index === 0 ? 'rounded-l-full' : 
                                index === process.stages.length - 1 ? 'rounded-r-full' : ''
                              } ${
                                stage.status === 'PENDING' ? 'bg-gray-300' :
                                stage.status === 'COMPLETED' ? 'bg-blue-300' :
                                stage.status === 'PASSED' ? 'bg-green-300' :
                                'bg-red-300'
                              }`}></div>
                              <span className="text-xs mt-1 text-gray-500">{stage.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Candidate
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this candidate? This action cannot be undone.
                        All data associated with this candidate will be permanently removed.
                      </p>
                      {candidate.selectionProcesses.length > 0 && (
                        <p className="mt-2 text-sm text-red-500">
                          Warning: This candidate has {candidate.selectionProcesses.length} active selection process(es).
                          You cannot delete a candidate with active processes.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={isDeleting || candidate.selectionProcesses.length > 0}
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail; 