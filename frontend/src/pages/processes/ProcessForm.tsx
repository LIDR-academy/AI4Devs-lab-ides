import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { selectionProcessApi, candidateApi } from '../../services/api';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProcessStage {
  name: string;
  description: string;
  status: string;
}

interface ProcessFormData {
  title: string;
  description: string;
  position: string;
  candidateId: string;
  stages: ProcessStage[];
}

// Modificar la interfaz de errores para que stages sea string
interface FormErrors {
  title?: string;
  description?: string;
  position?: string;
  candidateId?: string;
  stages?: string; // Cambiado de ProcessStage[] a string
}

const defaultStages: ProcessStage[] = [
  {
    name: 'Initial Screening',
    description: 'Review of candidate resume and application',
    status: 'PENDING',
  },
  {
    name: 'Technical Interview',
    description: 'Assessment of technical skills and knowledge',
    status: 'PENDING',
  },
  {
    name: 'Final Interview',
    description: 'Final interview with hiring manager',
    status: 'PENDING',
  },
];

const ProcessForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryCandidateId = queryParams.get('candidateId');
  
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProcessFormData>({
    title: '',
    description: '',
    position: '',
    candidateId: queryCandidateId || '',
    stages: [...defaultStages],
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await candidateApi.getAll();
        setCandidates(response.data.data.candidates);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setApiError('Failed to fetch candidates. Please try again.');
      }
    };

    const fetchProcess = async () => {
      if (isEditMode && id) {
        try {
          const response = await selectionProcessApi.getById(id);
          const process = response.data.data.selectionProcess;
          
          setFormData({
            title: process.title,
            description: process.description || '',
            position: process.position,
            candidateId: process.candidate.id,
            stages: process.stages.map((stage: any) => ({
              name: stage.name,
              description: stage.description || '',
              status: stage.status,
            })),
          });
        } catch (err) {
          console.error('Error fetching process:', err);
          setApiError('Failed to fetch process data. Please try again.');
        }
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await fetchCandidates();
      if (isEditMode) {
        await fetchProcess();
      }
      setIsLoading(false);
    };

    loadData();
  }, [id, isEditMode]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.candidateId) {
      newErrors.candidateId = 'Candidate is required';
    }
    
    if (formData.stages.length === 0) {
      newErrors.stages = 'At least one stage is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStageChange = (index: number, field: keyof ProcessStage, value: string) => {
    const updatedStages = [...formData.stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    setFormData(prev => ({ ...prev, stages: updatedStages }));
  };

  const handleAddStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          name: '',
          description: '',
          status: 'PENDING',
        },
      ],
    }));
  };

  const handleRemoveStage = (index: number) => {
    const updatedStages = [...formData.stages];
    updatedStages.splice(index, 1);
    setFormData(prev => ({ ...prev, stages: updatedStages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      if (isEditMode) {
        await selectionProcessApi.update(id!, formData);
      } else {
        await selectionProcessApi.create(formData);
      }
      
      navigate(formData.candidateId ? `/processes/candidate/${formData.candidateId}` : '/processes');
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} selection process. Please try again.`
      );
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} process:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Selection Process' : 'Add New Selection Process'}
        </h1>
        <Link
          to={formData.candidateId ? `/processes/candidate/${formData.candidateId}` : '/processes'}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Back to Processes"
          tabIndex={0}
        >
          Back to Processes
        </Link>
      </div>

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Process Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-label="Process Title"
              tabIndex={0}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600" id="title-error">
                {errors.title}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.position ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-label="Position"
              tabIndex={0}
              aria-invalid={!!errors.position}
              aria-describedby={errors.position ? 'position-error' : undefined}
            />
            {errors.position && (
              <p className="mt-2 text-sm text-red-600" id="position-error">
                {errors.position}
              </p>
            )}
          </div>

          {/* Candidate */}
          <div className="md:col-span-2">
            <label htmlFor="candidateId" className="block text-sm font-medium text-gray-700">
              Candidate <span className="text-red-500">*</span>
            </label>
            <select
              id="candidateId"
              name="candidateId"
              value={formData.candidateId}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.candidateId ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-label="Candidate"
              tabIndex={0}
              aria-invalid={!!errors.candidateId}
              aria-describedby={errors.candidateId ? 'candidateId-error' : undefined}
              disabled={isEditMode || !!queryCandidateId}
            >
              <option value="">Select a candidate</option>
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.firstName} {candidate.lastName} ({candidate.email})
                </option>
              ))}
            </select>
            {errors.candidateId && (
              <p className="mt-2 text-sm text-red-600" id="candidateId-error">
                {errors.candidateId}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Description"
              tabIndex={0}
            />
          </div>
        </div>

        {/* Process Stages */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Process Stages</h2>
            <button
              type="button"
              onClick={handleAddStage}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Add Stage"
              tabIndex={0}
            >
              Add Stage
            </button>
          </div>
          
          {errors.stages && (
            <p className="mt-2 text-sm text-red-600" id="stages-error">
              {errors.stages}
            </p>
          )}
          
          {formData.stages.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500">No stages added yet. Click "Add Stage" to add a stage to the process.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.stages.map((stage, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Stage {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveStage(index)}
                      className="text-red-600 hover:text-red-900"
                      aria-label={`Remove Stage ${index + 1}`}
                      tabIndex={0}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`stage-name-${index}`} className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`stage-name-${index}`}
                        value={stage.name}
                        onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        aria-label={`Stage ${index + 1} Name`}
                        tabIndex={0}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`stage-status-${index}`} className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id={`stage-status-${index}`}
                        value={stage.status}
                        onChange={(e) => handleStageChange(index, 'status', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        aria-label={`Stage ${index + 1} Status`}
                        tabIndex={0}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PASSED">Passed</option>
                        <option value="FAILED">Failed</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor={`stage-description-${index}`} className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id={`stage-description-${index}`}
                        value={stage.description}
                        onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        aria-label={`Stage ${index + 1} Description`}
                        tabIndex={0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            to={formData.candidateId ? `/processes/candidate/${formData.candidateId}` : '/processes'}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Cancel"
            tabIndex={0}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
            aria-label={isEditMode ? 'Update Process' : 'Add Process'}
            tabIndex={0}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>{isEditMode ? 'Updating...' : 'Adding...'}</span>
              </div>
            ) : (
              <span>{isEditMode ? 'Update Process' : 'Add Process'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessForm; 