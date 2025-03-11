import React, { useState, useEffect } from 'react';
import { useForm } from '../../../context/FormContext';
import { useFormNavigation } from '../../../context/FormContext';
import { submitApplication } from '../../../services/api';
import { testBackendConnection } from '../../../utils/testBackend';

const ReviewStep: React.FC = () => {
  const { state, dispatch } = useForm();
  const { formData, isSubmitting } = state;
  const { goToPreviousStep } = useFormNavigation();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    const isConnected = await testBackendConnection();
    setBackendStatus(isConnected ? 'connected' : 'error');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSubmit = async () => {
    if (backendStatus !== 'connected') {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Cannot submit: Backend server is not accessible. Please try again later.'
      });
      return;
    }

    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      
      const result = await submitApplication(formData);
      
      if (result.success) {
        dispatch({ type: 'SET_SUCCESS', payload: true });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Submit error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'There was an error submitting your application. Please try again.' 
      });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {backendStatus === 'error' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Warning: Cannot connect to the server. The submit function may not work.
                <button
                  onClick={checkBackendConnection}
                  className="ml-2 text-yellow-700 underline hover:text-yellow-600"
                >
                  Retry connection
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Review Your Application
        </h2>

        {/* Personal Information */}
        <section className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-base">{formData.firstName} {formData.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base">{formData.phone}</p>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Education</h3>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">{edu.title}</p>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience */}
        <section className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Work Experience</h3>
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <p className="font-medium">{exp.position}</p>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Document */}
        <section className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Uploaded Document</h3>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-base">{formData.document?.name}</span>
          </div>
        </section>

        {/* Success Message */}
        {state.isSuccess && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Application submitted successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state.submitError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {state.submitError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || state.isSuccess}
            className={`
              px-6 py-2 text-white font-medium rounded-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
              ${isSubmitting || state.isSuccess
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }
            `}
          >
            {isSubmitting ? 'Submitting...' : state.isSuccess ? 'Submitted' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep; 