import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../context/FormContext';

const DocumentsStep: React.FC = () => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();
  const [error, setError] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types
  const allowedTypes = ['application/pdf'];
  // Max file size in bytes (5MB)
  const maxFileSize = 5 * 1024 * 1024;

  // File validation
  const validateFile = (file: File): string => {
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF files are allowed';
    }
    if (file.size > maxFileSize) {
      return `File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`;
    }
    return '';
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      updateFormData({ cvFile: file });
      setError('');
    }
  };

  // Handle LinkedIn CV checkbox
  const handleLinkedInCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ isLinkedinCV: e.target.checked });
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      updateFormData({ cvFile: file });
      setError('');
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('candidateForm.documents.title')}</h2>

      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-4">{t('candidateForm.documents.uploadCV')}</h3>

        {/* Drag and drop area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragging
              ? 'border-indigo-500 bg-indigo-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-indigo-400'
          } transition-colors cursor-pointer`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          <svg
            className={`mx-auto h-12 w-12 ${
              error ? 'text-red-400' : 'text-gray-400'
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="mt-2">
            {formData.cvFile ? (
              <p className="text-sm text-gray-700">{formData.cvFile.name}</p>
            ) : (
              <p className="text-sm text-gray-500">{t('candidateForm.documents.dragDrop')}</p>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">{t('candidateForm.documents.fileSize')}</p>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* LinkedIn CV checkbox */}
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="isLinkedinCV"
              type="checkbox"
              checked={formData.isLinkedinCV || false}
              onChange={handleLinkedInCVChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isLinkedinCV" className="ml-2 block text-sm text-gray-700">
              {t('candidateForm.documents.isLinkedinCV')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStep;