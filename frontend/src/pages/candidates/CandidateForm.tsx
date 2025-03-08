import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { candidateApi } from '../../services/api';

interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
  skills: string;
  notes: string;
}

const CandidateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CandidateFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: '',
    skills: '',
    notes: '',
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvFilename, setCurrentCvFilename] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<CandidateFormData>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchCandidate = async () => {
        try {
          setIsLoading(true);
          const response = await candidateApi.getById(id);
          const candidate = response.data.data.candidate;
          
          setFormData({
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone || '',
            address: candidate.address || '',
            education: candidate.education || '',
            workExperience: candidate.workExperience || '',
            skills: candidate.skills || '',
            notes: candidate.notes || '',
          });
          
          if (candidate.cvFilename) {
            setCurrentCvFilename(candidate.cvFilename);
          }
          
          setApiError(null);
        } catch (err) {
          setApiError('Failed to fetch candidate data. Please try again.');
          console.error('Error fetching candidate:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCandidate();
    }
  }, [id, isEditMode]);

  const validateForm = () => {
    const newErrors: Partial<CandidateFormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file: File | null): boolean => {
    if (!file) return true; // No file is valid (it's optional)
    
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setFileError('Only PDF or DOCX files are allowed');
      return false;
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      return false;
    }
    
    setFileError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof CandidateFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
    validateFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !validateFile(cvFile)) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Crear un FormData para enviar el archivo
      const formDataToSend = new FormData();
      
      // Añadir todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Añadir el archivo CV si existe
      if (cvFile) {
        formDataToSend.append('cv', cvFile);
      }
      
      if (isEditMode) {
        await candidateApi.updateWithFile(id, formDataToSend);
      } else {
        await candidateApi.createWithFile(formDataToSend);
      }
      
      navigate('/candidates');
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} candidate. Please try again.`
      );
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} candidate:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    setCurrentCvFilename(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadCV = async () => {
    if (isEditMode && id && currentCvFilename) {
      try {
        await candidateApi.downloadCV(id);
      } catch (err) {
        console.error('Error downloading CV:', err);
        setApiError('Failed to download CV. Please try again.');
      }
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
          {isEditMode ? 'Edit Candidate' : 'Add New Candidate'}
        </h1>
        <Link
          to="/candidates"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Back to Candidates"
          tabIndex={0}
        >
          Back to Candidates
        </Link>
      </div>

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-label="First Name"
              tabIndex={0}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600" id="firstName-error">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-label="Last Name"
              tabIndex={0}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600" id="lastName-error">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              aria-label="Email"
              tabIndex={0}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Phone"
              tabIndex={0}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Address"
              tabIndex={0}
            />
          </div>

          {/* CV Upload */}
          <div className="md:col-span-2">
            <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
              CV (PDF or DOCX, max 5MB)
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="cv"
                name="cv"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                aria-label="Upload CV"
                tabIndex={0}
              />
              <label
                htmlFor="cv"
                className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>{cvFile ? 'Change file' : 'Upload file'}</span>
              </label>
              
              {(cvFile || currentCvFilename) && (
                <div className="ml-3 flex items-center">
                  <span className="text-sm text-gray-500">
                    {cvFile ? cvFile.name : currentCvFilename}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 text-sm text-red-600 hover:text-red-800"
                    aria-label="Remove file"
                    tabIndex={0}
                  >
                    Remove
                  </button>
                  {!cvFile && currentCvFilename && (
                    <button
                      type="button"
                      onClick={handleDownloadCV}
                      className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                      aria-label="Download CV"
                      tabIndex={0}
                    >
                      Download
                    </button>
                  )}
                </div>
              )}
            </div>
            {fileError && (
              <p className="mt-2 text-sm text-red-600">
                {fileError}
              </p>
            )}
          </div>

          {/* Education */}
          <div className="md:col-span-2">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <textarea
              id="education"
              name="education"
              rows={3}
              value={formData.education}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Education"
              tabIndex={0}
            />
          </div>

          {/* Work Experience */}
          <div className="md:col-span-2">
            <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700">
              Work Experience
            </label>
            <textarea
              id="workExperience"
              name="workExperience"
              rows={3}
              value={formData.workExperience}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Work Experience"
              tabIndex={0}
            />
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <textarea
              id="skills"
              name="skills"
              rows={3}
              value={formData.skills}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Skills"
              tabIndex={0}
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Notes"
              tabIndex={0}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            to="/candidates"
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
            aria-label={isEditMode ? 'Update Candidate' : 'Add Candidate'}
            tabIndex={0}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>{isEditMode ? 'Updating...' : 'Adding...'}</span>
              </div>
            ) : (
              <span>{isEditMode ? 'Update Candidate' : 'Add Candidate'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 