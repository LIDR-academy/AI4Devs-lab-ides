import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { selectionProcessApi } from '../../services/api';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface Recruiter {
  id: string;
  name: string;
  email: string;
}

interface ProcessStage {
  id: string;
  name: string;
  description: string | null;
  status: string;
  date: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SelectionProcess {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  position: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  candidate: Candidate;
  recruiter: Recruiter;
  stages: ProcessStage[];
}

const ProcessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [process, setProcess] = useState<SelectionProcess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stageBeingEdited, setStageBeingEdited] = useState<string | null>(null);
  const [stageFormData, setStageFormData] = useState<{
    status: string;
    feedback: string;
    date: string;
  }>({
    status: '',
    feedback: '',
    date: '',
  });

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        setIsLoading(true);
        const response = await selectionProcessApi.getById(id!);
        setProcess(response.data.data.selectionProcess);
        setError(null);
      } catch (err) {
        setError('Failed to fetch process details. Please try again later.');
        console.error('Error fetching process:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProcess();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await selectionProcessApi.delete(id);
      navigate('/processes');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to delete selection process.'
      );
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditStage = (stage: ProcessStage) => {
    setStageBeingEdited(stage.id);
    setStageFormData({
      status: stage.status,
      feedback: stage.feedback || '',
      date: stage.date ? new Date(stage.date).toISOString().split('T')[0] : '',
    });
  };

  const handleCancelEditStage = () => {
    setStageBeingEdited(null);
  };

  const handleStageFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStageFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateStage = async (stageId: string) => {
    if (!id) return;
    
    try {
      await selectionProcessApi.updateStage(id, stageId, stageFormData);
      
      // Refresh process data
      const response = await selectionProcessApi.getById(id);
      setProcess(response.data.data.selectionProcess);
      
      // Close edit form
      setStageBeingEdited(null);
    } catch (err) {
      console.error('Error updating stage:', err);
      setError('Failed to update stage. Please try again.');
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
            to="/processes"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Processes
          </Link>
        </div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
        <p>Selection process not found.</p>
        <div className="mt-4">
          <Link
            to="/processes"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Processes
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
            {process.title}
          </h1>
          <p className="text-sm text-gray-500">
            Started on {new Date(process.startDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/processes"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Back to Processes"
            tabIndex={0}
          >
            Back
          </Link>
          <Link
            to={`/processes/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Edit Process"
            tabIndex={0}
          >
            Edit
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Delete Process"
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Process Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{process.title}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900">{process.position}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    process.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    process.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {process.status.replace('_', ' ')}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(process.startDate).toLocaleDateString()}</dd>
              </div>
              {process.endDate && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(process.endDate).toLocaleDateString()}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{process.description || 'No description provided.'}</dd>
              </div>
              {process.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{process.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Candidate Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Candidate Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <Link to={`/candidates/${process.candidate.id}`} className="text-blue-600 hover:text-blue-800">
                    {process.candidate.firstName} {process.candidate.lastName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{process.candidate.email}</dd>
              </div>
              {process.candidate.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{process.candidate.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Recruiter</dt>
                <dd className="mt-1 text-sm text-gray-900">{process.recruiter.name} ({process.recruiter.email})</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Process Stages */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Process Stages</h2>
          
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {process.stages.map((stage, index) => (
                <li key={stage.id} className="p-4">
                  {stageBeingEdited === stage.id ? (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Stage: {stage.name}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={stageFormData.status}
                            onChange={handleStageFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PASSED">Passed</option>
                            <option value="FAILED">Failed</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={stageFormData.date}
                            onChange={handleStageFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                            Feedback
                          </label>
                          <textarea
                            id="feedback"
                            name="feedback"
                            rows={3}
                            value={stageFormData.feedback}
                            onChange={handleStageFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelEditStage}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStage(stage.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                            stage.status === 'PENDING' ? 'bg-gray-400' :
                            stage.status === 'COMPLETED' ? 'bg-blue-500' :
                            stage.status === 'PASSED' ? 'bg-green-500' :
                            'bg-red-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">{stage.name}</h3>
                            <p className="text-xs text-gray-500">
                              Status: <span className={`font-medium ${
                                stage.status === 'PENDING' ? 'text-gray-600' :
                                stage.status === 'COMPLETED' ? 'text-blue-600' :
                                stage.status === 'PASSED' ? 'text-green-600' :
                                'text-red-600'
                              }`}>{stage.status}</span>
                            </p>
                            {stage.date && (
                              <p className="text-xs text-gray-500">
                                Date: {new Date(stage.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {stage.description && (
                          <div className="mt-2 ml-11">
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          </div>
                        )}
                        
                        {stage.feedback && (
                          <div className="mt-2 ml-11 p-2 bg-yellow-50 rounded border border-yellow-100">
                            <p className="text-xs font-medium text-gray-500">Feedback:</p>
                            <p className="text-sm text-gray-600">{stage.feedback}</p>
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleEditStage(stage)}
                        className="ml-4 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
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
                      Delete Selection Process
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this selection process? This action cannot be undone.
                        All data associated with this process will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
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

export default ProcessDetail; 